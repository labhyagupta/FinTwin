import React from 'react';
import { Borrower } from '../types';
import { BorrowerSimulationResult } from '../utils/simulation';

interface HealthyBorrowerShieldProps {
  borrowers: Borrower[];
  simulationResults: Record<string, BorrowerSimulationResult>;
  currentTimestep: string;
  onSelectBorrower: (id: string) => void;
}

export const HealthyBorrowerShield: React.FC<HealthyBorrowerShieldProps> = ({
  borrowers,
  simulationResults,
  currentTimestep,
  onSelectBorrower
}) => {
  // Filter resilient borrowers whose simulated stress is < 42
  const shieldedBorrowers = borrowers.filter((b) => {
    const sim = simulationResults[b.id];
    const score = sim
      ? sim.stressScores[currentTimestep as keyof typeof sim.stressScores]
      : b.baseStress;
    return score < 42;
  });

  return (
    <div className="bg-white dark:bg-[#1D2A1F] rounded-3xl p-6 sm:p-8 border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-[#EDF1E7] dark:border-[#28392B] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-2xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
            Protected Members
          </h2>
        </div>
        <p className="text-sm text-[#586B5A] dark:text-[#B2C4B0] mt-1 max-w-2xl leading-relaxed">
          These community members have healthy savings or steady daily sales. Even if another member experiences a setback, their finances remain safe.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shieldedBorrowers.map((borrower) => {
          const sim = simulationResults[borrower.id];
          const score = sim
            ? sim.stressScores[currentTimestep as keyof typeof sim.stressScores]
            : borrower.baseStress;

          return (
            <div
              key={borrower.id}
              onClick={() => onSelectBorrower(borrower.id)}
              className="p-5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581] dark:hover:border-[#FEF08A]/60 transition-all cursor-pointer space-y-3 shadow-xs"
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
                    {borrower.name}
                  </h3>
                  <span className="text-xs text-[#2D5A2B] dark:text-[#A7D1A2] font-medium">
                    {borrower.sector}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(score)}
                  </span>
                  <span className="text-[11px] text-[#7E9280] dark:text-[#80967E] block">
                    Stress (Low)
                  </span>
                </div>
              </div>

              {/* Simple explanation note */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433]">
                <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB] block mb-0.5">
                  Why they stay safe:
                </span>
                <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
                  {borrower.shieldReason}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#586B5A] dark:text-[#B2C4B0] pt-1">
                <span>Savings: {borrower.cashBufferMonths} months buffer</span>
                <span className="font-medium text-[#1F2D20] dark:text-[#EEF4EB]">
                  Remaining debt: ${borrower.currentBalance}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {shieldedBorrowers.length === 0 && (
        <div className="p-6 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] text-center text-sm text-[#586B5A] dark:text-[#B2C4B0] border border-[#E3E9DA] dark:border-[#2F4433]">
          During this severe event, multiple members feel pressure. Try applying a support remedy to restore protection.
        </div>
      )}

      {/* Helpful advice footer */}
      <div className="p-4 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] text-xs text-[#586B5A] dark:text-[#B2C4B0] flex items-center justify-between">
        <span>
          <strong className="text-[#1F2D20] dark:text-[#EEF4EB]">Simple Rule:</strong> Financial safety comes from regular cash income and keeping cross-guarantees manageable.
        </span>
      </div>
    </div>
  );
};
