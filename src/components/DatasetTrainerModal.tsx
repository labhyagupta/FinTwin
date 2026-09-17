import React, { useState, useEffect } from 'react';
import {
  generateSyntheticDataset,
  trainStressModel,
  SyntheticDataSample,
  ModelWeights,
  predictStress
} from '../utils/mlDatasetTrainer';
import { Borrower, Connection } from '../types';

interface DatasetTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrowers: Borrower[];
  connections: Connection[];
}

export const DatasetTrainerModal: React.FC<DatasetTrainerModalProps> = ({
  isOpen,
  onClose,
  borrowers
}) => {
  const [datasetSize, setDatasetSize] = useState<number>(300);
  const [dataset, setDataset] = useState<SyntheticDataSample[]>([]);
  const [model, setModel] = useState<ModelWeights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [epochs, setEpochs] = useState<number>(120);
  const [learningRate, setLearningRate] = useState<number>(0.05);

  // Live test input state
  const [testBorrowerId, setTestBorrowerId] = useState<string>(borrowers[0]?.id || 'amina');
  const [testShockSeverity, setTestShockSeverity] = useState<number>(70);
  const [predictedValue, setPredictedValue] = useState<number | null>(null);

  // Initialize with a dataset on first open
  useEffect(() => {
    if (isOpen && dataset.length === 0) {
      handleGenerate();
    }
  }, [isOpen]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const data = generateSyntheticDataset(datasetSize);
      setDataset(data);
      setIsGenerating(false);
    }, 150);
  };

  const handleTrain = () => {
    if (dataset.length === 0) return;
    setIsTraining(true);
    setTimeout(() => {
      const trained = trainStressModel(dataset, epochs, learningRate);
      setModel(trained);
      setIsTraining(false);
    }, 250);
  };

  const handlePredict = () => {
    if (!model) return;
    const b = borrowers.find((x) => x.id === testBorrowerId) || borrowers[0];
    const pred = predictStress(
      {
        cashBufferMonths: b.cashBufferMonths,
        baseStress: b.baseStress,
        loanAmount: b.loanAmount,
        connectedPeersCount: 3,
        guaranteeExposureAmount: 450,
        shockSeverity: testShockSeverity,
        isShockTarget: 1,
        distanceFromShockTarget: 0
      },
      model
    );
    setPredictedValue(pred);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataset, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'microfinance_stress_synthetic_dataset.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] p-5 sm:p-7 shadow-2xl space-y-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDF1E7] dark:border-[#28392B] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF08A] dark:bg-[#3D3A20] text-[#854D0E] dark:text-[#FEF08A] flex items-center justify-center font-bold text-base shadow-xs">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
                  Synthetic Dataset & Model Training Studio
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                  In-Browser ML
                </span>
              </div>
              <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">
                Generate simulated lending circle shock scenarios, inspect features, and train a predictive model.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#586B5A] dark:text-[#B2C4B0] hover:bg-[#F4F7EE] dark:hover:bg-[#243527] cursor-pointer"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* 2-Column Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Dataset Generation */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
                1. Synthetic Dataset Generator
              </h3>
              <span className="text-xs font-bold text-[#2D5A2B] dark:text-[#FEF08A]">
                {dataset.length} samples ready
              </span>
            </div>

            <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
              Synthesizes realistic borrower balance sheets, network topology, random shocks, and multi-month contagion outcomes.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <label htmlFor="sample-count-select" className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">Size:</label>
              <select
                id="sample-count-select"
                value={datasetSize}
                onChange={(e) => setDatasetSize(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] text-xs text-[#1F2D20] dark:text-[#EEF4EB] cursor-pointer"
              >
                <option value={150}>150 samples</option>
                <option value={300}>300 samples</option>
                <option value={600}>600 samples</option>
                <option value={1000}>1,000 samples</option>
              </select>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 py-1.5 px-3 rounded-full text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Re-generate Dataset'}
              </button>
            </div>

            {dataset.length > 0 && (
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#7E9280] dark:text-[#80967E]">
                  Features: 14 &middot; Targets: 6
                </span>
                <button
                  onClick={handleDownloadJSON}
                  className="text-xs font-semibold text-[#2D5A2B] dark:text-[#FEF08A] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                  </svg>
                  <span>Export JSON</span>
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Model Training */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
                2. Gradient Descent Model Training
              </h3>
              {model && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  R² = {model.metrics.trainR2}
                </span>
              )}
            </div>

            <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0] leading-relaxed">
              Fits a multivariate predictive model using normalized feature standardizations and iterative error minimization.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label htmlFor="epochs-input" className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] block">Epochs:</label>
                <input
                  id="epochs-input"
                  type="number"
                  min={20}
                  max={500}
                  step={20}
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full mt-0.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] text-xs"
                />
              </div>
              <div>
                <label htmlFor="lr-input" className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] block">Learning Rate:</label>
                <input
                  id="lr-input"
                  type="number"
                  min={0.001}
                  max={0.2}
                  step={0.01}
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full mt-0.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleTrain}
              disabled={isTraining || dataset.length === 0}
              className="w-full py-2 rounded-full text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] dark:hover:bg-white shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isTraining ? 'Training Model...' : 'Train Model on Synthetic Data'}
            </button>
          </div>
        </div>

        {/* Model Results / Learned Weights Visualization */}
        {model && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1D2A1F] border border-[#E3E9DA] dark:border-[#2F4433] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDF1E7] dark:border-[#28392B] pb-3">
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1F2D20] dark:text-[#EEF4EB]">
                  Trained Model Performance & Learned Feature Weights
                </h4>
                <p className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">
                  Target: 6-Month Projected Contagion Stress Score (0 - 100)
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#586B5A] dark:text-[#B2C4B0]">
                  Mean Absolute Error: <strong className="text-[#1F2D20] dark:text-[#EEF4EB]">{model.metrics.mae} pts</strong>
                </span>
                <span className="text-[#586B5A] dark:text-[#B2C4B0]">
                  R² Goodness-of-Fit: <strong className="text-emerald-600 dark:text-emerald-400">{model.metrics.trainR2}</strong>
                </span>
              </div>
            </div>

            {/* Feature weights badges */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB] block">
                Learned Coefficients (Weight Impact):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(model.weights).map(([key, weight]) => {
                  const isPositive = weight > 0;
                  return (
                    <div
                      key={key}
                      className="p-2.5 rounded-xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] text-xs"
                    >
                      <span className="text-[11px] text-[#586B5A] dark:text-[#B2C4B0] block truncate">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      <span
                        className={`text-sm font-mono font-bold mt-0.5 block ${
                          isPositive ? 'text-amber-700 dark:text-[#FEF08A]' : 'text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {isPositive ? `+${weight}` : weight}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Model Inference Playground */}
            <div className="pt-3 border-t border-[#EDF1E7] dark:border-[#28392B] space-y-2">
              <span className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB] block">
                Test Real-Time Prediction:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="test-borrower-select" className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">Select Member:</label>
                <select
                  id="test-borrower-select"
                  value={testBorrowerId}
                  onChange={(e) => setTestBorrowerId(e.target.value)}
                  className="px-3 py-1 rounded-xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] text-xs text-[#1F2D20] dark:text-[#EEF4EB]"
                >
                  {borrowers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="test-severity-range" className="text-xs text-[#586B5A] dark:text-[#B2C4B0]">Shock Severity:</label>
                <input
                  id="test-severity-range"
                  type="range"
                  min="20"
                  max="95"
                  value={testShockSeverity}
                  onChange={(e) => setTestShockSeverity(Number(e.target.value))}
                  className="w-24 accent-[#2D5A2B] dark:accent-[#FEF08A]"
                />
                <span className="text-xs font-bold">{testShockSeverity}%</span>

                <button
                  onClick={handlePredict}
                  className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] cursor-pointer"
                >
                  Predict Stress
                </button>

                {predictedValue !== null && (
                  <div className="px-3 py-1 rounded-full bg-[#FEF08A]/60 dark:bg-[#FEF08A]/20 text-[#854D0E] dark:text-[#FEF08A] font-bold text-xs border border-[#FDE047]/60 dark:border-[#FEF08A]/40">
                    Predicted 6mo Stress: {predictedValue} / 100
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dataset Preview Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB]">
              Sample Rows Preview (First 5 of {dataset.length}):
            </h4>
            <span className="text-[11px] text-[#7E9280] dark:text-[#80967E]">
              Includes borrower balance, shock severity & simulated cascade output
            </span>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl border border-[#E3E9DA] dark:border-[#2F4433]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F7EE] dark:bg-[#243527] text-[#586B5A] dark:text-[#B2C4B0] border-b border-[#E3E9DA] dark:border-[#2F4433]">
                  <th className="p-2.5 font-semibold">Sample ID</th>
                  <th className="p-2.5 font-semibold">Cash Buffer</th>
                  <th className="p-2.5 font-semibold">Base Stress</th>
                  <th className="p-2.5 font-semibold">Shock Event</th>
                  <th className="p-2.5 font-semibold">Severity</th>
                  <th className="p-2.5 font-semibold">Intervention</th>
                  <th className="p-2.5 font-semibold">Predicted 6mo Stress</th>
                  <th className="p-2.5 font-semibold">Risk Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E9DA] dark:divide-[#2F4433]">
                {dataset.slice(0, 5).map((row) => (
                  <tr key={row.id} className="hover:bg-[#F4F7EE]/60 dark:hover:bg-[#243527]/60">
                    <td className="p-2.5 font-mono text-[11px]">{row.id}</td>
                    <td className="p-2.5">{row.features.cashBufferMonths} mo</td>
                    <td className="p-2.5">{row.features.baseStress}</td>
                    <td className="p-2.5 capitalize">{row.features.shockType.replace('_', ' ')}</td>
                    <td className="p-2.5 font-semibold text-amber-700 dark:text-[#FEF08A]">{row.features.shockSeverity}%</td>
                    <td className="p-2.5 capitalize">{row.features.intervention.replace('_', ' ')}</td>
                    <td className="p-2.5 font-bold font-serif">{row.targets.stressAt6mo}</td>
                    <td className="p-2.5">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433]">
                        {row.targets.riskCategory}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Guidance on GitHub Export */}
        <div className="p-4 rounded-2xl bg-[#F4F7EE] dark:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-[#1F2D20] dark:text-[#EEF4EB] block">
              Push to GitHub & Repository Access:
            </span>
            <p className="text-[#586B5A] dark:text-[#B2C4B0] text-[11px] mt-0.5">
              To push this project to GitHub, export via <strong>Settings &rarr; Export to GitHub</strong> in Google AI Studio, or download the ZIP and run <code>git remote add origin &lt;repo&gt; && git push</code>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#2D5A2B] text-white hover:bg-[#234722] dark:bg-[#FEF08A] dark:text-[#172319] cursor-pointer whitespace-nowrap"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
