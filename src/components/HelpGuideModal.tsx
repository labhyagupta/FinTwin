import React from 'react';

export const HelpGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] p-6 sm:p-8 shadow-2xl space-y-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-[#EDF1E7] dark:border-[#28392B] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FEF08A] dark:bg-[#3D3A20] text-[#854D0E] dark:text-[#FEF08A] flex items-center justify-center font-bold text-sm">
              ?
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
              Help & Simple Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#586B5A] dark:text-[#B2C4B0] hover:bg-[#F4F7EE] dark:hover:bg-[#243527] cursor-pointer"
            aria-label="Close help"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 text-sm text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
          <div>
            <h3 className="font-semibold text-base text-[#1F2D20] dark:text-[#EEF4EB] mb-1">
              What is this website?
            </h3>
            <p>
              In community borrowing (microfinance), members often sign up together and promise to back each other up. If one person has a problem, others might need to help pay. This tool helps community leaders and organizers see where help is needed before anyone gets overwhelmed.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base text-[#1F2D20] dark:text-[#EEF4EB] mb-1">
              What do the colors mean?
            </h3>
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F4F7EE] dark:bg-[#243527]">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span><strong className="text-[#1F2D20] dark:text-[#EEF4EB]">Green (Calm):</strong> The member has enough cash saved and can pay easily without worry.</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F4F7EE] dark:bg-[#243527]">
                <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                <span><strong className="text-[#1F2D20] dark:text-[#EEF4EB]">Yellow (Watch):</strong> Money is a bit tight, often due to farm planting or seasonal business.</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F4F7EE] dark:bg-[#243527]">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <span><strong className="text-[#1F2D20] dark:text-[#EEF4EB]">Red (Needs Care):</strong> The member has suffered an unexpected difficulty and needs group support.</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base text-[#1F2D20] dark:text-[#EEF4EB] mb-1">
              What do the lines on the web mean?
            </h3>
            <p className="text-xs">
              Each line connects two members who have agreed to back each other up, or who do business together (like a farmer selling maize to a local posho mill). Thicker lines mean closer ties.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base text-[#1F2D20] dark:text-[#EEF4EB] mb-1">
              How do I use the What-If tool?
            </h3>
            <p className="text-xs">
              Go to <strong>What-If Ideas</strong>, choose a member and an event (like crop failure), and press <strong>Run simulation</strong>. You will watch how the strain touches connected friends over 3, 6, and 12 months.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#EDF1E7] dark:border-[#28392B] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white cursor-pointer transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
