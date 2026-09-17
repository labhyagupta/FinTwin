import {
  Borrower,
  Connection,
  ShockTypeId,
  TimestepId,
  InterventionId,
  CascadeClassification
} from '../types';

export interface SimulationState {
  targetBorrowerId: string;
  shockType: ShockTypeId;
  severity: number; // 0 - 100
  durationMonths: number; // 3, 6, 12
  currentTimestep: TimestepId;
  intervention: InterventionId;
}

export interface BorrowerSimulationResult {
  borrowerId: string;
  stressScores: Record<TimestepId, number>; // 0, 3mo, 6mo, 12mo
  reserveBufferMonths: Record<TimestepId, number>;
  contagionSource?: string;
  contagionPath?: string;
  primaryRiskFactor: string;
}

export function calculateSimulation(
  borrowers: Borrower[],
  connections: Connection[],
  sim: SimulationState
): Record<string, BorrowerSimulationResult> {
  const results: Record<string, BorrowerSimulationResult> = {};

  // Initialize baselines
  borrowers.forEach((b) => {
    results[b.id] = {
      borrowerId: b.id,
      stressScores: {
        '0': b.baseStress,
        '3mo': b.baseStress,
        '6mo': b.baseStress,
        '12mo': b.baseStress
      },
      reserveBufferMonths: {
        '0': b.cashBufferMonths,
        '3mo': b.cashBufferMonths,
        '6mo': b.cashBufferMonths,
        '12mo': b.cashBufferMonths
      },
      primaryRiskFactor: b.vulnerabilityTrait
    };
  });

  const shockBorrower = borrowers.find((b) => b.id === sim.targetBorrowerId);
  if (!shockBorrower) return results;

  // Intervention mitigation multipliers
  let targetMitigation = 0;
  let contagionDampener = 1.0;

  if (sim.intervention === 'grace_period') {
    targetMitigation = 26;
    contagionDampener = 0.35;
  } else if (sim.intervention === 'liquidity_support') {
    targetMitigation = 38;
    contagionDampener = 0.15;
  } else if (sim.intervention === 'restructuring') {
    targetMitigation = 30;
    contagionDampener = 0.45;
  }

  // Shock magnitude factor based on shock type & severity (0-100)
  const severityRatio = sim.severity / 100;
  let directShockBoost = 0;

  switch (sim.shockType) {
    case 'crop_failure':
      directShockBoost = 42 * severityRatio;
      break;
    case 'medical_expense':
      directShockBoost = 35 * severityRatio;
      break;
    case 'income_drop':
      directShockBoost = 32 * severityRatio;
      break;
    case 'market_slowdown':
      directShockBoost = 28 * severityRatio;
      break;
  }

  // Step 0: "Now" (Immediate onset on target borrower)
  const targetStress0 = Math.min(
    96,
    Math.max(10, shockBorrower.baseStress + directShockBoost - targetMitigation * 0.5)
  );
  results[shockBorrower.id].stressScores['0'] = Math.round(targetStress0);
  results[shockBorrower.id].reserveBufferMonths['0'] = Math.max(
    0.2,
    Number((shockBorrower.cashBufferMonths * (1 - severityRatio * 0.4)).toFixed(1))
  );

  // Step 1: "3mo" (First wave of transmission along direct connections)
  // Target stress peaks or holds depending on duration
  const targetStress3 = Math.min(
    98,
    Math.max(12, targetStress0 + (sim.durationMonths >= 3 ? 6 : -8) - targetMitigation * 0.8)
  );
  results[shockBorrower.id].stressScores['3mo'] = Math.round(targetStress3);
  results[shockBorrower.id].reserveBufferMonths['3mo'] = Math.max(
    0.1,
    Number((results[shockBorrower.id].reserveBufferMonths['0'] * (sim.intervention !== 'none' ? 1.1 : 0.7)).toFixed(1))
  );

  // Propagate to immediate neighbors at 3mo
  borrowers.forEach((b) => {
    if (b.id === shockBorrower.id) return;

    // Find direct connection to shock borrower
    const directConn = connections.find(
      (c) =>
        (c.source === shockBorrower.id && c.target === b.id) ||
        (c.target === shockBorrower.id && c.source === b.id)
    );

    if (directConn) {
      // Transmission formula: connection strength * (stress differential above tolerance)
      const targetStressLevel = results[shockBorrower.id].stressScores['0'];
      const excessStress = Math.max(0, targetStressLevel - 45);
      
      // Buffer absorption: buffer slows incoming impact
      const bufferShield = Math.min(0.8, b.cashBufferMonths * 0.22);
      const transmissionRate =
        directConn.type === 'mutual_guarantee'
          ? directConn.strength * 0.75
          : directConn.strength * 0.55;

      const receivedImpulse =
        excessStress * transmissionRate * (1 - bufferShield) * contagionDampener;

      const newStress = Math.min(94, Math.max(b.baseStress, b.baseStress + receivedImpulse));
      results[b.id].stressScores['3mo'] = Math.round(newStress);
      results[b.id].reserveBufferMonths['3mo'] = Math.max(
        0.3,
        Number((b.cashBufferMonths - (receivedImpulse > 8 ? 0.4 : 0.1)).toFixed(1))
      );

      if (receivedImpulse > 10) {
        results[b.id].contagionSource = shockBorrower.name;
        results[b.id].contagionPath = `${directConn.type === 'mutual_guarantee' ? 'Co-guarantee liability bond' : 'Direct trade dependency'} (${directConn.label})`;
      }
    }
  });

  // Step 2: "6mo" (Second-wave diffusion across indirect neighbors and compounding)
  borrowers.forEach((b) => {
    if (b.id === shockBorrower.id) {
      const targetStress6 = Math.min(
        98,
        Math.max(
          15,
          targetStress3 + (sim.durationMonths >= 6 ? 4 : -14) - targetMitigation
        )
      );
      results[b.id].stressScores['6mo'] = Math.round(targetStress6);
      return;
    }

    // Check incoming impulse from ALL connected peers at 3mo
    let incomingContagion = 0;
    let strongestLinkName = '';
    let strongestLinkPath = '';
    let highestImpact = 0;

    connections.forEach((c) => {
      const peerId = c.source === b.id ? c.target : c.target === b.id ? c.source : null;
      if (!peerId) return;

      const peerStress3 = results[peerId]?.stressScores['3mo'] || 0;
      if (peerStress3 > 50) {
        const excess = peerStress3 - 50;
        const impact = excess * c.strength * (c.type === 'mutual_guarantee' ? 0.6 : 0.45) * contagionDampener;
        incomingContagion += impact;

        if (impact > highestImpact) {
          highestImpact = impact;
          const peerObj = borrowers.find((p) => p.id === peerId);
          strongestLinkName = peerObj?.name || 'Peer';
          strongestLinkPath = c.label;
        }
      }
    });

    const bufferShield = Math.min(0.85, b.cashBufferMonths * 0.25);
    const netImpulse = incomingContagion * (1 - bufferShield);
    const currentStress3 = results[b.id].stressScores['3mo'];
    const newStress6 = Math.min(
      95,
      Math.max(b.baseStress, currentStress3 + (netImpulse > 5 ? netImpulse * 0.6 : -3))
    );

    results[b.id].stressScores['6mo'] = Math.round(newStress6);
    results[b.id].reserveBufferMonths['6mo'] = Math.max(
      0.2,
      Number((results[b.id].reserveBufferMonths['3mo'] - (netImpulse > 8 ? 0.5 : 0)).toFixed(1))
    );

    if (strongestLinkName && netImpulse > 10) {
      results[b.id].contagionSource = strongestLinkName;
      results[b.id].contagionPath = strongestLinkPath;
    }
  });

  // Step 3: "12mo" (Long-term stabilization or persistent impairment)
  borrowers.forEach((b) => {
    const isTarget = b.id === shockBorrower.id;
    const stress6 = results[b.id].stressScores['6mo'];

    let stress12: number;
    if (isTarget) {
      if (sim.intervention !== 'none') {
        // Successful intervention returns close to baseline or lower
        stress12 = Math.max(b.baseStress - 8, Math.round(stress6 * 0.62));
      } else if (sim.durationMonths <= 6) {
        // Shock subsided
        stress12 = Math.max(b.baseStress + 4, Math.round(stress6 * 0.78));
      } else {
        // Persistent unmitigated distress
        stress12 = Math.min(95, Math.round(stress6 * 0.92));
      }
    } else {
      if (sim.intervention !== 'none') {
        // Ripple dissipates quickly
        stress12 = Math.max(b.baseStress, Math.round(stress6 * 0.75));
      } else {
        stress12 = Math.max(b.baseStress, Math.round(stress6 * 0.88));
      }
    }

    results[b.id].stressScores['12mo'] = Math.round(stress12);
    results[b.id].reserveBufferMonths['12mo'] = Math.max(
      0.4,
      Number(
        (
          results[b.id].reserveBufferMonths['6mo'] +
          (sim.intervention !== 'none' ? 0.6 : 0.2)
        ).toFixed(1)
      )
    );
  });

  return results;
}

export function classifyCascades(
  borrowers: Borrower[],
  connections: Connection[],
  sim: SimulationState,
  results: Record<string, BorrowerSimulationResult>
): CascadeClassification[] {
  const currentStep = sim.currentTimestep;
  const targetBorrower = borrowers.find((b) => b.id === sim.targetBorrowerId);

  return borrowers.map((b) => {
    const currentScore = results[b.id]?.stressScores[currentStep] ?? b.baseStress;
    const delta = currentScore - b.baseStress;
    const isTarget = b.id === sim.targetBorrowerId;

    if (isTarget) {
      const evidence =
        delta > 20
          ? `Primary shock epicenter: ${b.name} absorbs initial ${sim.shockType.replace('_', ' ')} impact. Liquidity fell to ${results[b.id]?.reserveBufferMonths[currentStep]} months reserve.`
          : `Contained disruption: ${b.name} managing strain with ${sim.intervention !== 'none' ? 'active intervention support' : 'initial cash cushion'}.`;
      return {
        borrowerId: b.id,
        category: 'isolated_difficulty',
        stressScore: currentScore,
        stressDelta: delta,
        evidenceTrail: evidence
      };
    }

    // Direct connections to shock target
    const directLink = connections.find(
      (c) =>
        (c.source === sim.targetBorrowerId && c.target === b.id) ||
        (c.target === sim.targetBorrowerId && c.source === b.id)
    );

    if (delta >= 12 && directLink) {
      return {
        borrowerId: b.id,
        category: 'group_caused_vulnerability',
        stressScore: currentScore,
        stressDelta: delta,
        evidenceTrail: `Stress elevated by ${delta} points following ${directLink.type === 'mutual_guarantee' ? 'joint guarantee exposure' : 'supply contract strain'} tied to ${targetBorrower?.name}. Link strength: ${Math.round(directLink.strength * 100)}%.`
      };
    }

    if (delta >= 12 && !directLink) {
      return {
        borrowerId: b.id,
        category: 'independent_deterioration',
        stressScore: currentScore,
        stressDelta: delta,
        evidenceTrail: `Secondary transmission through interconnected cooperative balance sheets, compounded by existing seasonal operating expenditure.`
      };
    }

    // Otherwise contained
    return {
      borrowerId: b.id,
      category: 'isolated_difficulty',
      stressScore: currentScore,
      stressDelta: delta,
      evidenceTrail: `Buffer preserved at ${results[b.id]?.reserveBufferMonths[currentStep] || b.cashBufferMonths} months. No active spillover contracted across lending network.`
    };
  });
}

/**
 * Returns color token for a given stress score:
 * Healthy (<38): Muted Sage Green (#A5C89E)
 * Mild stress (38-68): Pastel Yellow (#FEF08A)
 * High stress (>68): Luminous Amber Vermilion (#F97316)
 */
export function getStressColor(score: number): string {
  if (score < 38) return '#A5C89E'; // Muted Sage Green
  if (score <= 68) return '#FEF08A'; // Pastel Yellow
  return '#F97316'; // Luminous Amber Coral
}

export function getStressDescriptor(score: number): { label: string; tone: string } {
  if (score < 28) return { label: 'Calm & Resilient', tone: 'text-[#A5C89E]' };
  if (score < 42) return { label: 'Stable Operating Buffer', tone: 'text-[#A5C89E]' };
  if (score < 62) return { label: 'Mild Caution / Watchlist', tone: 'text-[#FEF08A]' };
  if (score < 78) return { label: 'Elevated Transmission Strain', tone: 'text-[#F97316]' };
  return { label: 'Critical Cascade Threat', tone: 'text-[#F97316]' };
}
