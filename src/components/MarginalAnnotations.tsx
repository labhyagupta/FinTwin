import React from 'react';
import { Borrower, Connection } from '../types';
import { BorrowerSimulationResult, getStressColor, getStressDescriptor } from '../utils/simulation';

interface MarginalAnnotationsProps {
  borrowers: Borrower[];
  connections: Connection[];
  simulationResults: Record<string, BorrowerSimulationResult>;
  currentTimestep: string;
  selectedBorrowerId: string | null;
  onSelectBorrower: (id: string) => void;
  onOpenProfile: (id: string) => void;
  onOpenSimulator: (id: string) => void;
}

export const MarginalAnnotations: React.FC<MarginalAnnotationsProps> = ({
  borrowers,
  connections,
  simulationResults,
  currentTimestep,
  selectedBorrowerId,
  onSelectBorrower,
  onOpenProfile,
  onOpenSimulator
}) => {
  const selectedBorrower = borrowers.find((b) => b.id === selectedBorrowerId);
  const selectedResult = selectedBorrower ? simulationResults[selectedBorrower.id] : null;
  const selectedStress = selectedResult
    ? selectedResult.stressScores[currentTimestep as keyof typeof selectedResult.stressScores]
    : selectedBorrower?.baseStress ?? 0;

  // Aggregate stats
  const totalLoanOrigination = borrowers.reduce((acc, b) => acc + b.loanAmount, 0);
  const totalBalance = borrowers.reduce((acc, b) => acc + b.currentBalance, 0);

  const avgStress = Math.round(
    borrowers.reduce((acc, b) => {
      const res = simulationResults[b.id];
      return acc + (res ? res.stressScores[currentTimestep as keyof typeof res.stressScores] : b.baseStress);
    }, 0) / borrowers.length
  );

  const highStressCount = borrowers.filter((b) => {
    const res = simulationResults[b.id];
    const score = res ? res.stressScores[currentTimestep as keyof typeof res.stressScores] : b.baseStress;
    return score > 68;
  }).length;

  const guaranteeBondsTotal = connections
    .filter((c) => c.type === 'mutual_guarantee')
    .reduce((acc, c) => acc + Math.round(c.strength * 600), 0);

  // Connected peers of selected member
  const connectedPeerDetails = selectedBorrower
    ? connections
        .filter((c) => c.source === selectedBorrower.id || c.target === selectedBorrower.id)
        .map((conn) => {
          const peerId = conn.source === selectedBorrower.id ? conn.target : conn.source;
          const peer = borrowers.find((b) => b.id === peerId);
          return { peer, connection: conn };
        })
    : [];

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4">
      {/* Selected Borrower Details Card */}
      {selectedBorrower ? (
        <div className="bg-white dark:bg-[#1D2A1F] rounded-3xl p-5 sm:p-6 border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm space-y-4">
          <div className="flex items-start justify-between border-b border-[#EDF1E7] dark:border-[#28392B] pb-3">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-[#FEF08A] tracking-wide block">
                Selected Member
              </span>
              <h3 className="text-lg font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
                {selectedBorrower.name}
              </h3>
              <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">
                {selectedBorrower.sector} &middot; {selectedBorrower.location}
              </p>
            </div>
            <button
              onClick={() => onSelectBorrower('')}
              className="text-xs text-[#7E9280] hover:text-[#1F2D20] dark:hover:text-[#EEF4EB] cursor-pointer"
            >
              &times; Close
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
            <div>
              <span className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] block">Stress Level</span>
              <div
                className="text-2xl font-serif font-bold mt-0.5"
                style={{ color: getStressColor(selectedStress) }}
              >
                {Math.round(selectedStress)}
                <span className="text-xs text-[#7E9280] font-normal"> / 100</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] block">Cash Buffer</span>
              <div className="text-sm font-semibold text-[#1F2D20] dark:text-[#EEF4EB] mt-1.5">
                {selectedBorrower.cashBufferMonths} months
              </div>
            </div>
          </div>

          {/* Connected friends */}
          <div>
            <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB] block mb-1.5">
              Connected Group Members ({connectedPeerDetails.length})
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {connectedPeerDetails.map(({ peer, connection }) => (
                <button
                  key={connection.id}
                  onClick={() => peer && onSelectBorrower(peer.id)}
                  className="w-full text-left p-2 rounded-xl bg-[#F4F7EE] dark:bg-[#243527] hover:bg-[#E3E9DA] dark:hover:bg-[#2F4433] border border-[#E3E9DA] dark:border-[#2F4433] text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="text-[#1F2D20] dark:text-[#EEF4EB] font-medium truncate max-w-[130px]">
                    {peer?.name}
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      connection.type === 'mutual_guarantee'
                        ? 'text-amber-700 dark:text-[#FEF08A]'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {connection.type === 'mutual_guarantee' ? 'Guarantee' : 'Trade'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#EDF1E7] dark:border-[#28392B]">
            <button
              onClick={() => onOpenProfile(selectedBorrower.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white transition-colors cursor-pointer"
            >
              Full Profile
            </button>
            <button
              onClick={() => onOpenSimulator(selectedBorrower.id)}
              className="flex-1 py-2 rounded-xl text-xs font-medium bg-[#F4F7EE] dark:bg-[#243527] text-[#1F2D20] dark:text-[#EEF4EB] hover:bg-[#E3E9DA] border border-[#E3E9DA] dark:border-[#2F4433] transition-colors cursor-pointer"
            >
              Test What-If
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1D2A1F] rounded-3xl p-5 border border-[#E3E9DA] dark:border-[#2F4433] text-xs text-[#586B5A] dark:text-[#B2C4B0] flex items-center gap-3 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span>Click any member on the web to see their details and mutual guarantees.</span>
        </div>
      )}

      {/* Circle Overview Card */}
      <div className="bg-white dark:bg-[#1D2A1F] rounded-3xl p-5 border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm space-y-3">
        <div className="border-b border-[#EDF1E7] dark:border-[#28392B] pb-2">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-[#FEF08A] tracking-wide block">
            Circle Overview
          </span>
          <h3 className="text-base font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
            Group Vitality
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-baseline">
            <span className="text-[#586B5A] dark:text-[#B2C4B0]">Average Circle Stress</span>
            <div className="text-right">
              <span
                className="text-base font-serif font-bold"
                style={{ color: getStressColor(avgStress) }}
              >
                {avgStress} / 100
              </span>
              <span className={`block text-[10px] ${getStressDescriptor(avgStress).tone}`}>
                {getStressDescriptor(avgStress).label}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-[#586B5A] dark:text-[#B2C4B0]">Total Remaining Balance</span>
            <span className="text-[#1F2D20] dark:text-[#EEF4EB] font-semibold">
              ${totalBalance.toLocaleString()} / ${totalLoanOrigination.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#586B5A] dark:text-[#B2C4B0]">Total Guarantees Pledged</span>
            <span className="text-amber-700 dark:text-[#FEF08A] font-semibold">
              ${guaranteeBondsTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#586B5A] dark:text-[#B2C4B0]">Members Needing Care</span>
            <span
              className={`font-semibold ${
                highStressCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {highStressCount === 0 ? 'All Stable (0)' : `${highStressCount} member(s)`}
            </span>
          </div>
        </div>
      </div>

      {/* Helpful Tips Card */}
      <div className="bg-white dark:bg-[#1D2A1F] rounded-3xl p-5 border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm space-y-2">
        <h4 className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
          Helpful Note
        </h4>
        <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
          Members with green badges have 2+ months of savings and can handle short market pauses without putting pressure on friends.
        </p>
      </div>
    </aside>
  );
};
