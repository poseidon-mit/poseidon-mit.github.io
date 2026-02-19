import { CROSS_SCREEN_DATA_THREAD } from '@/contracts/rebuild-contracts';

interface EmergencyFundThread {
  percent: number;
  current: number;
  target: number;
}

interface CriticalAlertThread {
  id: string;
  amount: number;
  merchant: string;
  confidence: number;
  cardLast4?: string;
  signalId?: string;
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readEmergencyFund(value: unknown): EmergencyFundThread {
  const fallback: EmergencyFundThread = { percent: 73, current: 7300, target: 10000 };
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
    amount: 2847,
    merchant: 'TechElectro Store',
    confidence: 0.94,
    cardLast4: '4821',
    signalId: 'PRT-2026-0216-003',
  };
  if (!value || typeof value !== 'object') return fallback;
  const candidate = value as Record<string, unknown>;
  return {
    id: typeof candidate.id === 'string' ? candidate.id : fallback.id,
    amount: readNumber(candidate.amount, fallback.amount),
    merchant: typeof candidate.merchant === 'string' ? candidate.merchant : fallback.merchant,
    confidence: readNumber(candidate.confidence, fallback.confidence),
    cardLast4: typeof candidate.cardLast4 === 'string' ? candidate.cardLast4 : fallback.cardLast4,
    signalId: typeof candidate.signalId === 'string' ? candidate.signalId : fallback.signalId,
  };
}

export const DEMO_THREAD = {
  systemConfidence: readNumber(CROSS_SCREEN_DATA_THREAD.system_confidence.value, 0.92),
  decisionsAudited: readNumber(CROSS_SCREEN_DATA_THREAD.decisions_audited.value, 1247),
  complianceScore: readNumber(CROSS_SCREEN_DATA_THREAD.compliance_score.value, 96),
  pendingActions: readNumber(CROSS_SCREEN_DATA_THREAD.pending_actions.value, 5),
  monthlySavings: readNumber(CROSS_SCREEN_DATA_THREAD.monthly_savings.value, 847),
  emergencyFund: readEmergencyFund(CROSS_SCREEN_DATA_THREAD.emergency_fund_progress.value),
  criticalAlert: readCriticalAlert(CROSS_SCREEN_DATA_THREAD.critical_alert_thr001.value),
} as const;

