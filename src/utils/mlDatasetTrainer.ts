import { Borrower, Connection, ShockTypeId, InterventionId } from '../types';
import { calculateSimulation } from './simulation';
import { INITIAL_BORROWERS, INITIAL_CONNECTIONS } from '../data/mockData';

export interface SyntheticDataSample {
  id: string;
  // Features (X)
  features: {
    loanAmount: number;
    monthlyRepayment: number;
    currentBalance: number;
    cashBufferMonths: number;
    baseStress: number;
    connectedPeersCount: number;
    guaranteeExposureAmount: number;
    maxPeerLinkStrength: number;
    shockType: ShockTypeId;
    shockSeverity: number;
    durationMonths: number;
    intervention: InterventionId;
    isShockTarget: number; // 1 or 0
    distanceFromShockTarget: number; // 0 (target), 1 (direct neighbor), 2 (2nd degree)
  };
  // Ground truth targets (Y)
  targets: {
    stressAt3mo: number;
    stressAt6mo: number;
    stressAt12mo: number;
    reserveBufferAt6mo: number;
    riskCategory: 'low' | 'moderate' | 'high' | 'critical';
    cascadeTriggered: boolean;
  };
}

export interface ModelWeights {
  intercept: number;
  weights: { [featureKey: string]: number };
  featureMeans: { [featureKey: string]: number };
  featureStds: { [featureKey: string]: number };
  metrics: {
    trainR2: number;
    mae: number;
    samplesCount: number;
    epochs: number;
    lossHistory: number[];
  };
}

/**
 * Generate synthetic microfinance group shock scenarios with randomized variations
 */
export function generateSyntheticDataset(sampleCount: number = 250): SyntheticDataSample[] {
  const dataset: SyntheticDataSample[] = [];
  const shockTypes: ShockTypeId[] = ['crop_failure', 'medical_expense', 'income_drop', 'market_slowdown'];
  const interventions: InterventionId[] = ['none', 'grace_period', 'liquidity_support', 'restructuring'];

  let count = 0;
  while (count < sampleCount) {
    const targetBorrower = INITIAL_BORROWERS[Math.floor(Math.random() * INITIAL_BORROWERS.length)];
    const shockType = shockTypes[Math.floor(Math.random() * shockTypes.length)];
    const severity = Math.floor(Math.random() * 85) + 15;
    const duration = [3, 6, 12][Math.floor(Math.random() * 3)];
    const intervention = interventions[Math.floor(Math.random() * interventions.length)];

    const perturbedBorrowers: Borrower[] = INITIAL_BORROWERS.map((b: Borrower) => {
      const bufferVariation = Number(((Math.random() - 0.5) * 0.4).toFixed(1));
      const stressVariation = Math.floor((Math.random() - 0.5) * 8);
      return {
        ...b,
        cashBufferMonths: Math.max(0.3, Number((b.cashBufferMonths + bufferVariation).toFixed(1))),
        baseStress: Math.min(90, Math.max(15, b.baseStress + stressVariation))
      };
    });

    const simResults = calculateSimulation(perturbedBorrowers, INITIAL_CONNECTIONS, {
      targetBorrowerId: targetBorrower.id,
      shockType,
      severity,
      durationMonths: duration,
      currentTimestep: '6mo',
      intervention
    });

    for (const b of perturbedBorrowers) {
      const isTarget = b.id === targetBorrower.id;
      const res = simResults[b.id];
      if (!res) continue;

      const directLinks = INITIAL_CONNECTIONS.filter(
        (c: Connection) => c.source === b.id || c.target === b.id
      );
      const isDirectNeighbor = directLinks.some(
        (c: Connection) => c.source === targetBorrower.id || c.target === targetBorrower.id
      );

      const guaranteeTotal = directLinks
        .filter((c: Connection) => c.type === 'mutual_guarantee')
        .reduce((sum: number, c: Connection) => sum + Math.round(c.strength * 500), 0);

      const maxStrength = directLinks.length > 0
        ? Math.max(...directLinks.map((c: Connection) => c.strength))
        : 0;

      const distance = isTarget ? 0 : isDirectNeighbor ? 1 : 2;

      const stress6 = res.stressScores['6mo'];
      let riskCategory: 'low' | 'moderate' | 'high' | 'critical' = 'low';
      if (stress6 > 75) riskCategory = 'critical';
      else if (stress6 > 60) riskCategory = 'high';
      else if (stress6 > 40) riskCategory = 'moderate';

      dataset.push({
        id: `sample-${count++}`,
        features: {
          loanAmount: b.loanAmount,
          monthlyRepayment: b.monthlyRepayment,
          currentBalance: b.currentBalance,
          cashBufferMonths: b.cashBufferMonths,
          baseStress: b.baseStress,
          connectedPeersCount: directLinks.length,
          guaranteeExposureAmount: guaranteeTotal,
          maxPeerLinkStrength: maxStrength,
          shockType,
          shockSeverity: severity,
          durationMonths: duration,
          intervention,
          isShockTarget: isTarget ? 1 : 0,
          distanceFromShockTarget: distance
        },
        targets: {
          stressAt3mo: res.stressScores['3mo'],
          stressAt6mo: stress6,
          stressAt12mo: res.stressScores['12mo'],
          reserveBufferAt6mo: res.reserveBufferMonths['6mo'],
          riskCategory,
          cascadeTriggered: !isTarget && (stress6 - b.baseStress) >= 12
        }
      });

      if (count >= sampleCount) break;
    }
  }

  return dataset;
}

/**
 * Train a multivariate linear regression model with Gradient Descent to predict 6-month cascade stress
 */
export function trainStressModel(
  dataset: SyntheticDataSample[],
  epochs: number = 100,
  learningRate: number = 0.05
): ModelWeights {
  const featureKeys = [
    'cashBufferMonths',
    'baseStress',
    'loanAmount',
    'connectedPeersCount',
    'guaranteeExposureAmount',
    'shockSeverity',
    'isShockTarget',
    'distanceFromShockTarget'
  ];

  const n = dataset.length;
  const featureMeans: { [key: string]: number } = {};
  const featureStds: { [key: string]: number } = {};

  featureKeys.forEach((key) => {
    const vals = dataset.map((d) => (d.features as any)[key] as number);
    const mean = vals.reduce((a, b) => a + b, 0) / n;
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    featureMeans[key] = mean;
    featureStds[key] = Math.sqrt(variance) || 1;
  });

  const X = dataset.map((d) =>
    featureKeys.map((k) => ((d.features as any)[k] - featureMeans[k]) / featureStds[k])
  );
  const Y = dataset.map((d) => d.targets.stressAt6mo);

  let intercept = Y.reduce((a, b) => a + b, 0) / n;
  let weights: number[] = new Array(featureKeys.length).fill(0);

  const lossHistory: number[] = [];

  for (let epoch = 0; epoch < epochs; epoch++) {
    const gradients = new Array(featureKeys.length).fill(0);
    let interceptGrad = 0;
    let totalErrorSq = 0;

    for (let i = 0; i < n; i++) {
      let pred = intercept;
      for (let j = 0; j < featureKeys.length; j++) {
        pred += weights[j] * X[i][j];
      }
      const err = pred - Y[i];
      totalErrorSq += err * err;
      interceptGrad += err;

      for (let j = 0; j < featureKeys.length; j++) {
        gradients[j] += err * X[i][j];
      }
    }

    intercept -= (learningRate * interceptGrad) / n;
    for (let j = 0; j < featureKeys.length; j++) {
      weights[j] -= (learningRate * gradients[j]) / n;
    }

    if (epoch % 5 === 0 || epoch === epochs - 1) {
      lossHistory.push(Number((totalErrorSq / n).toFixed(2)));
    }
  }

  let sumAbsErr = 0;
  let sumSqErr = 0;
  const meanY = Y.reduce((a, b) => a + b, 0) / n;
  let totalVar = 0;

  for (let i = 0; i < n; i++) {
    let pred = intercept;
    for (let j = 0; j < featureKeys.length; j++) {
      pred += weights[j] * X[i][j];
    }
    const err = pred - Y[i];
    sumAbsErr += Math.abs(err);
    sumSqErr += err * err;
    totalVar += Math.pow(Y[i] - meanY, 2);
  }

  const mae = Number((sumAbsErr / n).toFixed(2));
  const r2 = Number(Math.max(0, 1 - sumSqErr / (totalVar || 1)).toFixed(3));

  const weightsMap: { [key: string]: number } = {};
  featureKeys.forEach((key, idx) => {
    weightsMap[key] = Number(weights[idx].toFixed(3));
  });

  return {
    intercept: Number(intercept.toFixed(2)),
    weights: weightsMap,
    featureMeans,
    featureStds,
    metrics: {
      trainR2: r2,
      mae,
      samplesCount: n,
      epochs,
      lossHistory
    }
  };
}

export function predictStress(
  features: {
    cashBufferMonths: number;
    baseStress: number;
    loanAmount: number;
    connectedPeersCount: number;
    guaranteeExposureAmount: number;
    shockSeverity: number;
    isShockTarget: number;
    distanceFromShockTarget: number;
  },
  model: ModelWeights
): number {
  let score = model.intercept;
  for (const [key, weight] of Object.entries(model.weights)) {
    const val = (features as any)[key] ?? 0;
    const mean = model.featureMeans[key] ?? 0;
    const std = model.featureStds[key] ?? 1;
    const normalized = (val - mean) / std;
    score += weight * normalized;
  }
  return Math.min(99, Math.max(10, Math.round(score)));
}
