import { CROSS_SCREEN_DATA_THREAD } from '@/contracts/rebuild-contracts';

interface LiquidityReserveThread {
  percent: number;
  current: number;
  target: number;
}

interface CriticalAlertThread {
  id: string;
  amount: number;
  counterparty: string;
  confidence: number;
  cardLast4?: string;
  signalId?: string;
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readLiquidityReserve(value: unknown): LiquidityReserveThread {
  const fallback: LiquidityReserveThread = { percent: 82, current: 41_000_000, target: 50_000_000 };
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Record<string, unknown>;
  return {
    percent: readNumber(candidate.percent, fallback.percent),
    current: readNumber(candidate.current, fallback.current),
    target: readNumber(candidate.target, fallback.target),
  };
}

function readCriticalAlert(value: unknown): CriticalAlertThread {
  const fallback: CriticalAlertThread = {
    id: 'THR-001',
    amount: 2_500_000,
    counterparty: 'Cayman Reef Holdings Ltd.',
    confidence: 0.94,
    cardLast4: 'ACCT-7291',
    signalId: 'PRT-2026-0216-003',
  };
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Record<string, unknown>;

  const counterparty = typeof candidate.counterparty === 'string'
    ? candidate.counterparty
    : typeof candidate.merchant === 'string'
      ? candidate.merchant
      : fallback.counterparty;

  return {
    id: typeof candidate.id === 'string' ? candidate.id : fallback.id,
    amount: readNumber(candidate.amount, fallback.amount),
    counterparty,
    confidence: readNumber(candidate.confidence, fallback.confidence),
    cardLast4: typeof candidate.cardLast4 === 'string' ? candidate.cardLast4 : fallback.cardLast4,
    signalId: typeof candidate.signalId === 'string' ? candidate.signalId : fallback.signalId,
  };
}

const _monthlyOptimization = readNumber(CROSS_SCREEN_DATA_THREAD.monthly_optimization.value, 24_500);
const _liquidityReserve = readLiquidityReserve(CROSS_SCREEN_DATA_THREAD.liquidity_reserve.value);
const _criticalAlert = readCriticalAlert(CROSS_SCREEN_DATA_THREAD.critical_alert_thr001.value);

export const DEMO_THREAD = {
  systemConfidence: readNumber(CROSS_SCREEN_DATA_THREAD.system_confidence.value, 0.92),
  decisionsAudited: readNumber(CROSS_SCREEN_DATA_THREAD.decisions_audited.value, 10250),
  complianceScore: readNumber(CROSS_SCREEN_DATA_THREAD.compliance_score.value, 96),
  pendingActions: readNumber(CROSS_SCREEN_DATA_THREAD.pending_actions.value, 5),

  // B2B primary fields
  monthlyOptimization: _monthlyOptimization,
  liquidityReserve: _liquidityReserve,
  criticalAlert: _criticalAlert,
} as const;
