import React, { useState } from 'react';
import {
  INITIAL_BORROWERS,
  INITIAL_CONNECTIONS,
  INITIAL_LEDGER_ITEMS
} from './data/mockData';
import {
  Borrower,
  Connection,
  LedgerItem,
  InterventionId
} from './types';
import {
  calculateSimulation,
  SimulationState
} from './utils/simulation';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { HelpGuideModal } from './components/HelpGuideModal';
import { DatasetTrainerModal } from './components/DatasetTrainerModal';
import { SimpleHomeView } from './components/SimpleHomeView';
import { NetworkGraph } from './components/NetworkGraph';
import { MarginalAnnotations } from './components/MarginalAnnotations';
import { BorrowerProfile } from './components/BorrowerProfile';
import { ShockSimulator } from './components/ShockSimulator';
import { HealthyBorrowerShield } from './components/HealthyBorrowerShield';
import { InterventionSandbox } from './components/InterventionSandbox';
import { AttributionLedger } from './components/AttributionLedger';

export type SimpleNavTab =
  | 'home'
  | 'network'
  | 'profile'
  | 'simulator'
  | 'shield'
  | 'intervention'
  | 'ledger';

function AppContent() {
  const [activeTab, setActiveTab] = useState<SimpleNavTab>('home');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [borrowers] = useState<Borrower[]>(INITIAL_BORROWERS);
  const [connections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [ledgerItems, setLedgerItems] = useState<LedgerItem[]>(INITIAL_LEDGER_ITEMS);

  // Focus state
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>('amina');

  // Simulation state
  const [simState, setSimState] = useState<SimulationState>({
    targetBorrowerId: 'amina',
    shockType: 'crop_failure',
    severity: 65,
    durationMonths: 6,
    currentTimestep: '0',
    intervention: 'none'
  });

  const [isPulseActive, setIsPulseActive] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  // Compute live diffusion results
  const simulationResults = calculateSimulation(borrowers, connections, simState);
  const selectedBorrower = borrowers.find((b) => b.id === selectedBorrowerId) || borrowers[0];

  const handlePulseGraph = () => {
    setIsPulseActive(true);
    setPulseKey((k) => k + 1);
    setTimeout(() => {
      setIsPulseActive(false);
    }, 4000);
  };

  const handleSelectBorrowerFromAnywhere = (id: string | null) => {
    setSelectedBorrowerId(id);
    if (id) {
      setSimState((prev) => ({ ...prev, targetBorrowerId: id }));
    }
  };

  const handleLaunchShock = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    setSimState((prev) => ({ ...prev, targetBorrowerId: borrowerId, currentTimestep: '0' }));
    setActiveTab('simulator');
    handlePulseGraph();
  };

  const handleTestIntervention = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    setSimState((prev) => ({ ...prev, targetBorrowerId: borrowerId }));
    setActiveTab('intervention');
  };

  const handleAddLedgerItem = (item: LedgerItem) => {
    setLedgerItems((prev) => [item, ...prev]);
  };

  // Nav menu items in simple, friendly English
  const navItems: { id: SimpleNavTab; label: string; description: string }[] = [
    { id: 'home', label: 'Home', description: 'Start here & overview' },
    { id: 'network', label: 'Explore Web', description: 'Interactive community web' },
    { id: 'profile', label: 'Member Profile', description: 'Income & cash flow' },
    { id: 'simulator', label: 'What-If Ideas', description: 'Test unexpected events' },
    { id: 'shield', label: 'Protected Members', description: 'Members with strong buffers' },
    { id: 'intervention', label: 'Support & Remedies', description: 'Payment relief options' },
    { id: 'ledger', label: 'Activity Log', description: 'Visit diary & next steps' }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col transition-colors duration-200">
      {/* Header with clean navigation and Light/Dark toggle */}
      <header className="border-b border-[#E3E9DA] dark:border-[#2F4433] bg-white/95 dark:bg-[#141E16]/95 sticky top-0 z-40 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Friendly Title */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#D9EBD4] dark:bg-[#213224] border border-[#86B581] dark:border-[#3D5943] flex items-center justify-center shrink-0 shadow-xs">
                {/* Spiderweb icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2D5A2B] dark:text-[#FEF08A]" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.5" />
                  <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeOpacity="0.7" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="currentColor" strokeOpacity="0.6" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] tracking-tight">
                    Financial Nexus
                  </h1>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF08A]/60 dark:bg-[#FEF08A]/20 text-[#854D0E] dark:text-[#FEF08A] border border-[#FDE047]/60 dark:border-[#FEF08A]/30">
                    Mwangaza Circle
                  </span>
                </div>
                <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">
                  Calm community risk monitoring &middot; 7 connected members
                </p>
              </div>
            </button>

            {/* Mobile Header Buttons */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsHelpOpen(true)}
                className="w-8 h-8 rounded-full bg-[#F4F7EE] dark:bg-[#1D2A1F] text-[#1F2D20] dark:text-[#EEF4EB] border border-[#E3E9DA] dark:border-[#2F4433] flex items-center justify-center text-xs font-bold"
                aria-label="Open Help"
              >
                ?
              </button>
            </div>
          </div>

          {/* Simple, Readable Navigation Tabs + Desktop Theme Toggle */}
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2D5A2B] text-white dark:bg-[#FEF08A] dark:text-[#172319] font-semibold shadow-xs'
                        : 'text-[#586B5A] dark:text-[#B2C4B0] hover:text-[#1F2D20] dark:hover:text-[#EEF4EB] hover:bg-[#F4F7EE] dark:hover:bg-[#243527]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Quick Actions: Help, AI Studio & Theme Toggle */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#E3E9DA] dark:border-[#2F4433]">
              <ThemeToggle />
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FEF08A]/70 hover:bg-[#FEF08A] dark:bg-[#3D3A20] dark:hover:bg-[#4E4B28] text-[#854D0E] dark:text-[#FEF08A] border border-[#FDE047] dark:border-[#FEF08A]/40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Synthetic Dataset & Machine Learning Studio"
              >
                <span>✨</span>
                <span>AI & Dataset</span>
              </button>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F4F7EE] hover:bg-[#E3E9DA] dark:bg-[#1D2A1F] dark:hover:bg-[#243527] text-[#1F2D20] dark:text-[#EEF4EB] border border-[#E3E9DA] dark:border-[#2F4433] transition-colors cursor-pointer flex items-center gap-1.5"
                title="Open simple guide and help"
              >
                <span className="w-4 h-4 rounded-full bg-[#FEF08A] dark:bg-[#3D3A20] text-[#854D0E] dark:text-[#FEF08A] flex items-center justify-center font-bold text-[10px]">
                  ?
                </span>
                <span>Help</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Tab 1: Home View (Calm, friendly introductory dashboard) */}
        {activeTab === 'home' && (
          <SimpleHomeView
            borrowers={borrowers}
            connections={connections}
            simulationResults={simulationResults}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectBorrower={handleSelectBorrowerFromAnywhere}
          />
        )}

        {/* Tab 2: Interactive Web View */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 w-full space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB] flex items-center gap-2">
                      <span>Community Web of Guarantees</span>
                    </h2>
                    <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">
                      Each member sits on the web. Lines represent shared promises to help if trouble arises.
                    </p>
                  </div>
                  {simState.intervention !== 'none' && (
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-medium">
                      Active remedy: {simState.intervention.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <NetworkGraph
                  borrowers={borrowers}
                  connections={connections}
                  selectedBorrowerId={selectedBorrowerId}
                  onSelectBorrower={handleSelectBorrowerFromAnywhere}
                  simulationResults={simulationResults}
                  currentTimestep={simState.currentTimestep}
                  isSimulating={isPulseActive}
                  shockBorrowerId={simState.targetBorrowerId}
                  pulseTriggerKey={pulseKey}
                />

                <div className="p-4 rounded-2xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#586B5A] dark:text-[#B2C4B0] shadow-xs">
                  <span>
                    <strong className="text-[#1F2D20] dark:text-[#EEF4EB]">How to read this:</strong> Tap any member on the web to see who they share promises with and inspect their savings.
                  </span>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#2D5A2B] hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white shadow-xs whitespace-nowrap cursor-pointer transition-colors"
                  >
                    Test an Event &rarr;
                  </button>
                </div>
              </div>

              {/* Marginal Annotations Sidebar */}
              <MarginalAnnotations
                borrowers={borrowers}
                connections={connections}
                selectedBorrowerId={selectedBorrowerId}
                onSelectBorrower={handleSelectBorrowerFromAnywhere}
                simulationResults={simulationResults}
                currentTimestep={simState.currentTimestep}
                onOpenProfile={(id) => {
                  setSelectedBorrowerId(id);
                  setActiveTab('profile');
                }}
                onOpenSimulator={handleLaunchShock}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Member Profile */}
        {activeTab === 'profile' && (
          <BorrowerProfile
            borrower={selectedBorrower}
            currentStress={
              simulationResults[selectedBorrower.id]?.stressScores[simState.currentTimestep] ??
              selectedBorrower.baseStress
            }
            onSelectAnother={(id) => setSelectedBorrowerId(id)}
            allBorrowers={borrowers}
            onLaunchShock={handleLaunchShock}
            onTestIntervention={handleTestIntervention}
          />
        )}

        {/* Tab 4: What-If Ideas (Simulator) */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <ShockSimulator
              borrowers={borrowers}
              connections={connections}
              simState={simState}
              onUpdateSimState={setSimState}
              onSelectBorrower={(id) => {
                setSelectedBorrowerId(id);
                setActiveTab('profile');
              }}
              onPulseGraph={handlePulseGraph}
            />
          </div>
        )}

        {/* Tab 5: Protected Members (Shield) */}
        {activeTab === 'shield' && (
          <HealthyBorrowerShield
            borrowers={borrowers}
            simulationResults={simulationResults}
            currentTimestep={simState.currentTimestep}
            onSelectBorrower={(id) => {
              setSelectedBorrowerId(id);
              setActiveTab('profile');
            }}
          />
        )}

        {/* Tab 6: Support & Remedies (Intervention) */}
        {activeTab === 'intervention' && (
          <InterventionSandbox
            borrowers={borrowers}
            connections={connections}
            simState={simState}
            onSelectIntervention={(id: InterventionId) => {
              setSimState((prev) => ({ ...prev, intervention: id }));
              handlePulseGraph();
            }}
            onSelectTargetBorrower={(id: string) => {
              setSimState((prev) => ({ ...prev, targetBorrowerId: id }));
            }}
            onJumpToGraph={() => {
              setActiveTab('network');
            }}
          />
        )}

        {/* Tab 7: Community Activity Log (Ledger) */}
        {activeTab === 'ledger' && (
          <AttributionLedger
            ledgerItems={ledgerItems}
            onAddLedgerItem={handleAddLedgerItem}
            borrowers={borrowers}
            onSelectBorrower={(id) => {
              setSelectedBorrowerId(id);
              setActiveTab('profile');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E3E9DA] dark:border-[#2F4433] py-5 px-6 bg-white dark:bg-[#141E16] text-xs text-[#586B5A] dark:text-[#B2C4B0] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
              Financial Nexus
            </span>
            <span>&mdash; Calm risk monitoring for microfinance lending circles.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-xs text-[#2D5A2B] dark:text-[#FEF08A] hover:underline cursor-pointer"
            >
              How it works
            </button>
            <span>&middot;</span>
            <span>Light & Dark Mode Enabled</span>
          </div>
        </div>
      </footer>

      {/* Help Modal */}
      <HelpGuideModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Synthetic Dataset & Machine Learning Training Studio */}
      <DatasetTrainerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        borrowers={borrowers}
        connections={connections}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
