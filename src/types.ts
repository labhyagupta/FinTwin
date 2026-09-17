export type ConnectionType = 'mutual_guarantee' | 'supply_link';

export interface MonthlyRecord {
  month: string;
  income: number;
  expenses: number;
  repayment: number;
  reserve: number;
}

export interface Borrower {
  id: string;
  name: string;
  sector: string;
  location: string;
  loanAmount: number;
  monthlyRepayment: number;
  currentBalance: number;
  cashBufferMonths: number;
  baseStress: number; // 0-100
  // SVG organic coordinate position (in viewBox 900x560)
  x: number;
  y: number;
  radius: number;
  history: MonthlyRecord[];
  contributingFactors: string[];
  shieldReason: string;
  vulnerabilityTrait: string;
  bioNote: string;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
  strength: number; // 0.1 to 1.0 (affects line thickness & transmission rate)
  label: string;
  details: string;
  // Natural curve curvature offset control point
  curveOffset: { x: number; y: number };
}

export type ShockTypeId = 'crop_failure' | 'medical_expense' | 'income_drop' | 'market_slowdown';

export interface ShockConfig {
  id: ShockTypeId;
  name: string;
  description: string;
  icon: string;
  defaultSeverity: number; // 10 to 90
}

export type TimestepId = '0' | '3mo' | '6mo' | '12mo';

export type InterventionId = 'none' | 'grace_period' | 'liquidity_support' | 'restructuring';

export interface InterventionOption {
  id: InterventionId;
  name: string;
  shortDesc: string;
  actionNote: string;
  groupReliefDescription: string;
}

export type CascadeCategory = 'isolated_difficulty' | 'group_caused_vulnerability' | 'independent_deterioration';

export interface CascadeClassification {
  borrowerId: string;
  category: CascadeCategory;
  stressScore: number;
  stressDelta: number;
  evidenceTrail: string;
}

export interface LedgerItem {
  id: string;
  date: string;
  borrowerName: string;
  actionType: string;
  evidenceText: string;
  outcomeNote: string;
}
