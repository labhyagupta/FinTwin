import React from 'react';
import { Borrower, MonthlyRecord } from '../types';
import { getStressColor, getStressDescriptor } from '../utils/simulation';

interface BorrowerProfileProps {
  borrower: Borrower;
  currentStress: number;
  onSelectAnother: (id: string) => void;
  allBorrowers: Borrower[];
  onLaunchShock: (borrowerId: string) => void;
  onTestIntervention: (borrowerId: string) => void;
}

export const BorrowerProfile: React.FC<BorrowerProfileProps> = ({
  borrower,
  currentStress,
  onSelectAnother,
  allBorrowers,
  onLaunchShock,
  onTestIntervention
}) => {
  const stressColor = getStressColor(currentStress);
  const descriptor = getStressDescriptor(currentStress);

  // SVG Chart Dimensions
  const width = 640;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const usableW = width - padding.left - padding.right;
  const usableH = height - padding.top - padding.bottom;

  const records = borrower.history;
  const maxVal = Math.max(
    ...records.map((r) => Math.max(r.income, r.expenses + r.repayment)),
    500
  );

  const getPoints = (accessor: (r: MonthlyRecord) => number) => {
    return records.map((r, i) => {
      const x = padding.left + (i / (records.length - 1)) * usableW;
      const val = accessor(r);
      const y = padding.top + usableH - (val / maxVal) * usableH;
      return { x, y, val, month: r.month };
    });
  };

  const incomePts = getPoints((r) => r.income);
  const expensePts = getPoints((r) => r.expenses);

  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  return (
    <div className="bg-white dark:bg-[#1D2A1F] rounded-3xl p-6 sm:p-8 border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm space-y-6">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDF1E7] dark:border-[#28392B] pb-5">
        <div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-[#FEF08A] tracking-wide block">
            Member Profile
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
            {borrower.name}
          </h2>
          <p className="text-sm text-[#586B5A] dark:text-[#B2C4B0] mt-0.5">
            {borrower.sector} &middot; {borrower.location}
          </p>
        </div>

        {/* Member Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="member-select" className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">
            Switch Member:
          </label>
          <select
            id="member-select"
            value={borrower.id}
            onChange={(e) => onSelectAnother(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F4F7EE] dark:bg-[#243527] text-[#1F2D20] dark:text-[#EEF4EB] border border-[#E3E9DA] dark:border-[#2F4433] cursor-pointer"
          >
            {allBorrowers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.sector.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Financial Health Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
          <span className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] block">Current Stress</span>
          <div className="text-2xl font-serif font-bold mt-1" style={{ color: stressColor }}>
            {Math.round(currentStress)}
            <span className="text-xs text-[#7E9280] font-normal"> / 100</span>
          </div>
          <span className="text-[10px] text-[#586B5A] dark:text-[#B2C4B0] block mt-0.5">
            {descriptor.label}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
          <span className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] block">Emergency Savings</span>
          <div className="text-2xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] mt-1">
            {borrower.cashBufferMonths}
            <span className="text-xs text-[#7E9280] font-normal"> months</span>
          </div>
          <span className="text-[10px] text-[#586B5A] dark:text-[#B2C4B0] block mt-0.5">
            Living buffer cushion
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
          <span className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] block">Active Loan</span>
          <div className="text-2xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] mt-1">
            ${borrower.currentBalance}
          </div>
          <span className="text-[10px] text-[#586B5A] dark:text-[#B2C4B0] block mt-0.5">
            Originated at ${borrower.loanAmount}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
          <span className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] block">Monthly Payment</span>
          <div className="text-2xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] mt-1">
            ${borrower.monthlyRepayment}
          </div>
          <span className="text-[10px] text-[#586B5A] dark:text-[#B2C4B0] block mt-0.5">
            Regular installment
          </span>
        </div>
      </div>

      {/* Cash Flow History Curve */}
      <div className="p-5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
              18-Month Income & Expenses Record
            </h3>
            <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">
              Shows how money earned and spent flows each season.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[#586B5A] dark:text-[#B2C4B0]">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[#586B5A] dark:text-[#B2C4B0]">Expenses</span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 min-w-[500px]">
            {/* Horizontal guidelines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + usableH * ratio;
              return (
                <line
                  key={ratio}
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-[#E3E9DA] dark:text-[#2F4433]"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              );
            })}

            {/* Income curve */}
            <path
              d={makeSmoothPath(incomePts)}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Expense curve */}
            <path
              d={makeSmoothPath(expensePts)}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />

            {/* Month labels along bottom */}
            {records.map((r, i) => {
              if (i % 2 !== 0 && i !== records.length - 1) return null;
              const x = padding.left + (i / (records.length - 1)) * usableW;
              return (
                <text
                  key={r.month}
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-[#7E9280] dark:fill-[#80967E] text-[10px]"
                >
                  {r.month}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Two Context Cards: Story and Protection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] space-y-2">
          <h4 className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
            About This Member's Work
          </h4>
          <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
            {borrower.bioNote}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] space-y-2">
          <h4 className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
            Why They Are Protected
          </h4>
          <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
            {borrower.shieldReason}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={() => onLaunchShock(borrower.id)}
          className="px-4 py-2 rounded-full text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white transition-colors cursor-pointer"
        >
          Test What-If on {borrower.name.split(' ')[0]}
        </button>
        <button
          onClick={() => onTestIntervention(borrower.id)}
          className="px-4 py-2 rounded-full text-xs font-medium bg-[#F4F7EE] dark:bg-[#243527] text-[#1F2D20] dark:text-[#EEF4EB] hover:bg-[#E3E9DA] border border-[#E3E9DA] dark:border-[#2F4433] transition-colors cursor-pointer"
        >
          Explore Support Options
        </button>
      </div>
    </div>
  );
};
