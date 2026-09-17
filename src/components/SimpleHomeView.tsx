import React from 'react';
import { Borrower, Connection } from '../types';
import { BorrowerSimulationResult } from '../utils/simulation';

interface SimpleHomeViewProps {
  borrowers: Borrower[];
  connections: Connection[];
  simulationResults: Record<string, BorrowerSimulationResult>;
  onNavigate: (tab: any) => void;
  onSelectBorrower: (id: string) => void;
}

export const SimpleHomeView: React.FC<SimpleHomeViewProps> = ({
  borrowers,
  connections,
  simulationResults,
  onNavigate,
  onSelectBorrower
}) => {
  // Quick calculations for the group
  const totalLoan = borrowers.reduce((acc, b) => acc + b.loanAmount, 0);
  const totalBalance = borrowers.reduce((acc, b) => acc + b.currentBalance, 0);
  const safeBorrowers = borrowers.filter((b) => (simulationResults[b.id]?.stressScores['0'] ?? b.baseStress) < 42);
  const needsAttention = borrowers.filter((b) => (simulationResults[b.id]?.stressScores['0'] ?? b.baseStress) >= 60);

  return (
    <div className="space-y-6">
      {/* Calm, Friendly Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FEF08A]/25 via-[#D9EBD4]/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#FEF08A]/40 dark:bg-[#FEF08A]/20 text-[#854D0E] dark:text-[#FEF08A] border border-[#FDE047]/60 dark:border-[#FEF08A]/40">
            <span>Welcome to Financial Nexus</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2D20] dark:text-[#EEF4EB] leading-tight">
            See how your community borrowing group supports each other
          </h2>

          <p className="text-sm sm:text-base text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
            In our lending circle, members back each other up. This tool shows you who is doing well, who might need extra help, and how help given to one person keeps everyone safe.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('network')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Group Web</span>
              <span>&rarr;</span>
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#F4F7EE] dark:bg-[#243527] text-[#1F2D20] dark:text-[#EEF4EB] border border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581] transition-all cursor-pointer"
            >
              Test What-If Ideas
            </button>
          </div>
        </div>
      </div>

      {/* 3 Simple Action Cards: Clear explanation of what you can do */}
      <div>
        <h3 className="text-base font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] mb-3 px-1">
          What would you like to do?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Explore Group Web */}
          <div
            onClick={() => onNavigate('network')}
            className="p-5 rounded-2xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581] dark:hover:border-[#FEF08A]/60 shadow-sm hover:shadow transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#D9EBD4] dark:bg-[#2B3D2E] text-[#2D5A2B] dark:text-[#A7D1A2] flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h4 className="text-base font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] group-hover:text-[#2D5A2B] dark:group-hover:text-[#FEF08A] transition-colors">
                Explore the Web
              </h4>
              <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
                See all 7 members connected like a spiderweb. Click on any member to see who they share promises with and how they are doing.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#2D5A2B] dark:text-[#FEF08A] flex items-center gap-1">
              <span>View interactive web</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Card 2: Test What-If Shocks */}
          <div
            onClick={() => onNavigate('simulator')}
            className="p-5 rounded-2xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581] dark:hover:border-[#FEF08A]/60 shadow-sm hover:shadow transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FEF08A] dark:bg-[#3D3A20] text-[#854D0E] dark:text-[#FEF08A] flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h4 className="text-base font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] group-hover:text-[#2D5A2B] dark:group-hover:text-[#FEF08A] transition-colors">
                Test What-If Situations
              </h4>
              <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
                What if crops fail, or medical bills happen? See how unexpected events ripple through the group and where to step in.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#2D5A2B] dark:text-[#FEF08A] flex items-center gap-1">
              <span>Try a simulation</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Card 3: Help & Solutions */}
          <div
            onClick={() => onNavigate('intervention')}
            className="p-5 rounded-2xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581] dark:hover:border-[#FEF08A]/60 shadow-sm hover:shadow transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#F4F7EE] dark:bg-[#28382A] text-[#1F2D20] dark:text-[#EEF4EB] flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h4 className="text-base font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] group-hover:text-[#2D5A2B] dark:group-hover:text-[#FEF08A] transition-colors">
                Protect & Support Members
              </h4>
              <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
                Test helpful remedies like payment holidays or emergency cash to stop money worries before they reach other members.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#2D5A2B] dark:text-[#FEF08A] flex items-center gap-1">
              <span>View support options</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Group Health Summary at a Glance */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDF1E7] dark:border-[#28392B] pb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
              Circle Health at a Glance
            </h3>
            <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">
              Mwangaza Circle &middot; 7 community members working together
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-[#2D5A2B] dark:text-[#A7D1A2]">
              Group Status: Healthy & Active
            </span>
          </div>
        </div>

        {/* 4 Clean metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
            <span className="text-xs text-[#586B5A] dark:text-[#B2C4B0] block">
              Total Borrowed
            </span>
            <span className="text-xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] mt-1 block">
              ${totalLoan.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#7E9280] dark:text-[#80967E]">
              ${totalBalance.toLocaleString()} remaining
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
            <span className="text-xs text-[#586B5A] dark:text-[#B2C4B0] block">
              Protected Members
            </span>
            <span className="text-xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {safeBorrowers.length} of {borrowers.length}
            </span>
            <span className="text-[11px] text-[#7E9280] dark:text-[#80967E]">
              Strong cash buffers
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
            <span className="text-xs text-[#586B5A] dark:text-[#B2C4B0] block">
              Needs Attention
            </span>
            <span className="text-xl font-serif font-bold text-[#D97706] dark:text-[#FBBF24] mt-1 block">
              {needsAttention.length} member
            </span>
            <span className="text-[11px] text-[#7E9280] dark:text-[#80967E]">
              Seasonal crop timing
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
            <span className="text-xs text-[#586B5A] dark:text-[#B2C4B0] block">
              Mutual Promises
            </span>
            <span className="text-xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] mt-1 block">
              {connections.filter((c) => c.type === 'mutual_guarantee').length} links
            </span>
            <span className="text-[11px] text-[#7E9280] dark:text-[#80967E]">
              Community backup
            </span>
          </div>
        </div>

        {/* Member list quick links */}
        <div className="pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
              Community Members in Circle:
            </span>
            <span className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">
              Click a name to see their details
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {borrowers.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  onSelectBorrower(b.id);
                  onNavigate('profile');
                }}
                className="p-2.5 rounded-xl bg-[#F4F7EE] hover:bg-[#FEF08A]/40 dark:bg-[#243527] dark:hover:bg-[#2F4433] border border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581] text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB] truncate group-hover:text-[#2D5A2B] dark:group-hover:text-[#FEF08A]">
                  {b.name.split(' ')[0]}
                </div>
                <div className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] truncate mt-0.5">
                  {b.sector.split(' ')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
