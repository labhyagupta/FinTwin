import React, { useState } from 'react';
import { LedgerItem, Borrower } from '../types';

interface AttributionLedgerProps {
  ledgerItems: LedgerItem[];
  onAddLedgerItem: (item: LedgerItem) => void;
  borrowers: Borrower[];
  onSelectBorrower: (id: string) => void;
}

export const AttributionLedger: React.FC<AttributionLedgerProps> = ({
  ledgerItems,
  onAddLedgerItem,
  borrowers,
  onSelectBorrower
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newBorrowerId, setNewBorrowerId] = useState(borrowers[0]?.id || '');
  const [newActionType, setNewActionType] = useState('Home & Farm Visit');
  const [newEvidence, setNewEvidence] = useState('');
  const [newOutcome, setNewOutcome] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.trim() || !newOutcome.trim()) return;

    const borrower = borrowers.find((b) => b.id === newBorrowerId);

    const newItem: LedgerItem = {
      id: `ledg-${Date.now()}`,
      date: 'Today',
      borrowerName: borrower ? borrower.name : 'Entire Circle',
      actionType: newActionType,
      evidenceText: newEvidence.trim(),
      outcomeNote: newOutcome.trim()
    };

    onAddLedgerItem(newItem);
    setNewEvidence('');
    setNewOutcome('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white dark:bg-[#1D2A1F] rounded-3xl p-6 sm:p-8 border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDF1E7] dark:border-[#28392B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-2xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
              Community Activity Log
            </h2>
          </div>
          <p className="text-sm text-[#586B5A] dark:text-[#B2C4B0] mt-1">
            A simple diary of visits, community conversations, and agreed support plans.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#2D5A2B] hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          {isAdding ? 'Cancel Entry' : '+ Add Visit Note'}
        </button>
      </div>

      {/* Add Entry Form Modal/Accordion */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] space-y-4"
        >
          <h3 className="text-sm font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
            New Community Visit or Action
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="log-member" className="text-xs text-[#586B5A] dark:text-[#B2C4B0] block mb-1">
                Which member did you talk with?
              </label>
              <select
                id="log-member"
                value={newBorrowerId}
                onChange={(e) => setNewBorrowerId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] text-xs text-[#1F2D20] dark:text-[#EEF4EB]"
              >
                {borrowers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.sector})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="log-type" className="text-xs text-[#586B5A] dark:text-[#B2C4B0] block mb-1">
                Type of activity:
              </label>
              <select
                id="log-type"
                value={newActionType}
                onChange={(e) => setNewActionType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] text-xs text-[#1F2D20] dark:text-[#EEF4EB]"
              >
                <option value="Home & Farm Visit">Home & Farm Visit</option>
                <option value="Payment Check-in">Payment Check-in</option>
                <option value="Emergency Relief Granted">Emergency Relief Granted</option>
                <option value="Group Meeting Decision">Group Meeting Decision</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="log-notes" className="text-xs text-[#586B5A] dark:text-[#B2C4B0] block mb-1">
              What did you observe?
            </label>
            <textarea
              id="log-notes"
              rows={2}
              value={newEvidence}
              onChange={(e) => setNewEvidence(e.target.value)}
              placeholder="e.g. Visited maize store; 60 bags ready for harvest collection..."
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] text-xs text-[#1F2D20] dark:text-[#EEF4EB]"
            />
          </div>

          <div>
            <label htmlFor="log-outcome" className="text-xs text-[#586B5A] dark:text-[#B2C4B0] block mb-1">
              Agreed next step or outcome:
            </label>
            <input
              id="log-outcome"
              type="text"
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              placeholder="e.g. Confirmed regular installment on schedule."
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] text-xs text-[#1F2D20] dark:text-[#EEF4EB]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-full text-xs text-[#586B5A] dark:text-[#B2C4B0] hover:bg-white dark:hover:bg-[#1D2A1F] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Diary Entries List */}
      <div className="space-y-3">
        {ledgerItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
                  {item.borrowerName}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-[#1D2A1F] text-[#586B5A] dark:text-[#B2C4B0] border border-[#E3E9DA] dark:border-[#2F4433]">
                  {item.actionType}
                </span>
              </div>
              <span className="text-[11px] text-[#7E9280] dark:text-[#80967E]">{item.date}</span>
            </div>

            <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
              {item.evidenceText}
            </p>

            <div className="text-[11px] text-[#2D5A2B] dark:text-[#A7D1A2] font-medium pt-1 border-t border-[#E3E9DA] dark:border-[#2F4433]">
              Next Step: {item.outcomeNote}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
