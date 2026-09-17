import React from 'react';
import { Borrower, Connection, InterventionId } from '../types';
import { INTERVENTION_OPTIONS } from '../data/mockData';
import { calculateSimulation, SimulationState, getStressColor } from '../utils/simulation';

interface InterventionSandboxProps {
  borrowers: Borrower[];
  connections: Connection[];
  simState: SimulationState;
  onSelectIntervention: (id: InterventionId) => void;
  onSelectTargetBorrower: (id: string) => void;
  onJumpToGraph: () => void;
}

export const InterventionSandbox: React.FC<InterventionSandboxProps> = ({
  borrowers,
  connections,
  simState,
  onSelectIntervention,
  onSelectTargetBorrower,
  onJumpToGraph
}) => {
  // Baseline without intervention
  const unmitigatedSim: SimulationState = { ...simState, intervention: 'none' };
  const unmitigatedResults = calculateSimulation(borrowers, connections, unmitigatedSim);

  // Active with selected intervention
  const activeResults = calculateSimulation(borrowers, connections, simState);

  const targetBorrower = borrowers.find((b) => b.id === simState.targetBorrowerId);

  const unmitigatedAvgStress = Math.round(
    Object.values(unmitigatedResults).reduce((acc, r) => acc + r.stressScores['6mo'], 0) /
      borrowers.length
  );

  const activeAvgStress = Math.round(
    Object.values(activeResults).reduce((acc, r) => acc + r.stressScores['6mo'], 0) /
      borrowers.length
  );

  const unmitigatedAtRiskBorrowers = Object.values(unmitigatedResults).filter(
    (r) => r.stressScores['6mo'] > 65
  ).length;

  const activeAtRiskBorrowers = Object.values(activeResults).filter(
    (r) => r.stressScores['6mo'] > 65
  ).length;

  return (
    <div className="bg-white dark:bg-[#1D2A1F] rounded-3xl p-6 sm:p-8 border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-[#EDF1E7] dark:border-[#28392B] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-2xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
            Support & Remedies
          </h2>
        </div>
        <p className="text-sm text-[#586B5A] dark:text-[#B2C4B0] mt-1 max-w-2xl leading-relaxed">
          When an unexpected event happens, testing quick support can keep other group members from being burdened. Compare what happens with and without relief.
        </p>
      </div>

      {/* Choose Relief Type */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB] block">
          Choose a support option for {targetBorrower?.name}:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INTERVENTION_OPTIONS.map((option) => {
            const isSelected = simState.intervention === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onSelectIntervention(option.id)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-[#2D5A2B] text-white dark:bg-[#FEF08A] dark:text-[#172319] border-transparent font-medium shadow-xs'
                    : 'bg-[#F4F7EE] dark:bg-[#243527] text-[#1F2D20] dark:text-[#EEF4EB] border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581]'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold">{option.name}</h4>
                  <p className="text-xs opacity-85 mt-1 leading-relaxed">{option.shortDesc}</p>
                </div>
                <span className="text-[11px] underline opacity-90">
                  {isSelected ? 'Currently Applied' : 'Tap to Test'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison: Without Support vs With Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Without Support */}
        <div className="p-5 rounded-2xl bg-[#FFFBEB] dark:bg-[#2A241C] border border-amber-200 dark:border-amber-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Without Support (Do Nothing)
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-800/40 text-amber-800 dark:text-amber-300">
              Unmitigated
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[11px] text-amber-800/80 dark:text-amber-300/80 block">
                Avg. Group Stress (6mo)
              </span>
              <span className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-100">
                {unmitigatedAvgStress} / 100
              </span>
            </div>
            <div>
              <span className="text-[11px] text-amber-800/80 dark:text-amber-300/80 block">
                Members in Difficulty
              </span>
              <span className="text-2xl font-serif font-bold text-rose-600 dark:text-rose-400">
                {unmitigatedAtRiskBorrowers} of {borrowers.length}
              </span>
            </div>
          </div>

          <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed border-t border-amber-200/60 dark:border-amber-800/40 pt-2">
            Default pressure cascades across guarantee links, forcing friends to cover missing payments.
          </p>
        </div>

        {/* With Selected Support */}
        <div className="p-5 rounded-2xl bg-[#F0FDF4] dark:bg-[#1B2F21] border border-emerald-200 dark:border-emerald-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              With {INTERVENTION_OPTIONS.find((o) => o.id === simState.intervention)?.name}
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300">
              Active Remedy
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 block">
                Avg. Group Stress (6mo)
              </span>
              <span className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-300">
                {activeAvgStress} / 100
              </span>
            </div>
            <div>
              <span className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 block">
                Members in Difficulty
              </span>
              <span className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-300">
                {activeAtRiskBorrowers} of {borrowers.length}
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed border-t border-emerald-200/60 dark:border-emerald-800/40 pt-2">
            Stress is dampened at the source, shielding connected peers from emergency guarantee calls.
          </p>
        </div>
      </div>

      {/* Member by Member Impact */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
          Member Stress Impact with this Support:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {borrowers.map((b) => {
            const beforeScore = unmitigatedResults[b.id]?.stressScores['6mo'] ?? b.baseStress;
            const afterScore = activeResults[b.id]?.stressScores['6mo'] ?? b.baseStress;
            const improved = beforeScore - afterScore;

            return (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-[#1F2D20] dark:text-[#EEF4EB] block">
                    {b.name}
                  </span>
                  <span className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0]">
                    {b.sector.split(' ')[0]}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className="font-serif font-bold text-sm"
                    style={{ color: getStressColor(afterScore) }}
                  >
                    {afterScore}
                  </span>
                  {improved > 0 && (
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      &darr; {improved} pts relief
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Jump back button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onJumpToGraph}
          className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>See Web Graph with this Remedy</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
};
