import React, { useState, useEffect } from 'react';
import {
  Borrower,
  Connection,
  ShockTypeId,
  TimestepId
} from '../types';
import { SHOCK_OPTIONS } from '../data/mockData';
import {
  calculateSimulation,
  classifyCascades,
  getStressColor,
  SimulationState
} from '../utils/simulation';

interface ShockSimulatorProps {
  borrowers: Borrower[];
  connections: Connection[];
  simState: SimulationState;
  onUpdateSimState: (updater: (prev: SimulationState) => SimulationState) => void;
  onSelectBorrower: (id: string) => void;
  onPulseGraph: () => void;
}

export const ShockSimulator: React.FC<ShockSimulatorProps> = ({
  borrowers,
  connections,
  simState,
  onUpdateSimState,
  onSelectBorrower,
  onPulseGraph
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const timesteps: { id: TimestepId; label: string; offset: string }[] = [
    { id: '0', label: 'Now', offset: 'Immediate Event' },
    { id: '3mo', label: '3 Months', offset: 'Early Ripple' },
    { id: '6mo', label: '6 Months', offset: 'Group Effect' },
    { id: '12mo', label: '12 Months', offset: 'Recovery / Settled' }
  ];

  // Auto-scrubber player
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onUpdateSimState((prev) => {
          const order: TimestepId[] = ['0', '3mo', '6mo', '12mo'];
          const currIdx = order.indexOf(prev.currentTimestep);
          if (currIdx >= order.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return { ...prev, currentTimestep: order[currIdx + 1] };
        });
      }, 1600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, onUpdateSimState]);

  const simulationResults = calculateSimulation(borrowers, connections, simState);
  const classifications = classifyCascades(borrowers, connections, simState, simulationResults);

  const targetBorrower = borrowers.find((b) => b.id === simState.targetBorrowerId);

  const handleRunSimulation = () => {
    setHasRun(true);
    onPulseGraph();
    onUpdateSimState((prev) => ({ ...prev, currentTimestep: '0' }));
    setIsPlaying(true);
  };

  return (
    <div className="bg-white dark:bg-[#1D2A1F] rounded-3xl p-6 sm:p-8 border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-[#EDF1E7] dark:border-[#28392B] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <h2 className="text-2xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
            What-If Simulator
          </h2>
        </div>
        <p className="text-sm text-[#586B5A] dark:text-[#B2C4B0] mt-1 max-w-2xl leading-relaxed">
          See what happens if an unexpected event strikes a member. Test how mutual promises help or stress the rest of the lending group.
        </p>
      </div>

      {/* Setup Grid: 3 Clean Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Panel 1: Select Member */}
        <div className="p-5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
              1. Which member has an unexpected event?
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {borrowers.map((b) => {
              const isSelected = b.id === simState.targetBorrowerId;
              return (
                <button
                  key={b.id}
                  onClick={() => onUpdateSimState((prev) => ({ ...prev, targetBorrowerId: b.id }))}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2D5A2B] text-white dark:bg-[#FEF08A] dark:text-[#172319] font-semibold shadow-xs'
                      : 'bg-white dark:bg-[#1D2A1F] text-[#1F2D20] dark:text-[#EEF4EB] hover:bg-[#E3E9DA] dark:hover:bg-[#2F4433] border border-[#E3E9DA] dark:border-[#2F4433]'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  <span className="text-[11px] opacity-80">{b.sector.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Select Event */}
        <div className="p-5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] space-y-3">
          <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB] block">
            2. What kind of event happened?
          </span>

          <div className="space-y-2">
            {SHOCK_OPTIONS.map((shock) => {
              const isSelected = shock.id === simState.shockType;
              return (
                <button
                  key={shock.id}
                  onClick={() =>
                    onUpdateSimState((prev) => ({
                      ...prev,
                      shockType: shock.id,
                      severity: shock.defaultSeverity
                    }))
                  }
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2D5A2B] text-white dark:bg-[#FEF08A] dark:text-[#172319] font-semibold shadow-xs'
                      : 'bg-white dark:bg-[#1D2A1F] text-[#1F2D20] dark:text-[#EEF4EB] hover:bg-[#E3E9DA] dark:hover:bg-[#2F4433] border border-[#E3E9DA] dark:border-[#2F4433]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{shock.icon}</span>
                    <span>{shock.name}</span>
                  </div>
                  <p className="text-[11px] opacity-85 mt-0.5 line-clamp-1">{shock.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel 3: Severity & Action */}
        <div className="p-5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
                3. How serious is it?
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-[#FEF08A]">
                {simState.severity}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={simState.severity}
              onChange={(e) =>
                onUpdateSimState((prev) => ({
                  ...prev,
                  severity: Number(e.target.value)
                }))
              }
              className="w-full accent-[#2D5A2B] dark:accent-[#FEF08A] cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-[#586B5A] dark:text-[#B2C4B0]">
              <span>Mild hiccup</span>
              <span>Severe setback</span>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            className="w-full py-3 rounded-full text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isPlaying ? 'Running Simulation...' : 'Run Simulation'}</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="p-4 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
            Watch Over Time
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#1D2A1F] text-[#1F2D20] dark:text-[#EEF4EB] border border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581] cursor-pointer"
          >
            {isPlaying ? 'Pause' : 'Play Timeline'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {timesteps.map((t) => {
            const isActive = simState.currentTimestep === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onUpdateSimState((prev) => ({ ...prev, currentTimestep: t.id }))}
                className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#2D5A2B] text-white dark:bg-[#FEF08A] dark:text-[#172319] border-transparent font-semibold shadow-xs'
                    : 'bg-white dark:bg-[#1D2A1F] text-[#1F2D20] dark:text-[#EEF4EB] border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581]'
                }`}
              >
                <div className="text-xs">{t.label}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{t.offset}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Outcome Cards: Simple English explanation of what happened */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
          How members are affected at {timesteps.find((t) => t.id === simState.currentTimestep)?.label}:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {classifications.map((item) => {
            const b = borrowers.find((x) => x.id === item.borrowerId);
            if (!b) return null;
            const isTarget = b.id === simState.targetBorrowerId;

            return (
              <div
                key={b.id}
                onClick={() => onSelectBorrower(b.id)}
                className="p-3.5 rounded-xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581] cursor-pointer transition-all space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
                      {b.name}
                    </span>
                    {isTarget && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold">
                        Primary Member
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className="text-base font-serif font-bold"
                      style={{ color: getStressColor(item.stressScore) }}
                    >
                      {item.stressScore}
                    </span>
                    <span className="text-[10px] text-[#7E9280] dark:text-[#80967E] ml-1">
                      ({item.stressDelta >= 0 ? `+${item.stressDelta}` : item.stressDelta})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
                  {item.evidenceTrail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
