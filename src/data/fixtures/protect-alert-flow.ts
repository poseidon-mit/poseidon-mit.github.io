/**
 * Protect Alert Flow — deterministic fixture for the full
 * Signal → Evidence → Decision → Outcome chain.
 *
 * Used by: PRT01 (alert list), PRT02 (alert detail), PRT03 (dispute),
 *          GOV02 (audit ledger), GOV03 (audit detail)
 */
import type {
  ProtectAlert,
  DecisionObject,
  AuditRecord,
  OversightCase,
  Factor,
  GovernMeta,
} from '../../contracts/domain-models';

// ─── Shared factors ──────────────────────────────────────────────────────────

const fraudFactors: Factor[] = [
  { name: 'Transaction amount', contribution: 0.35, direction: 'negative', description: '$1,250 — 4× above 90-day average' },
  { name: 'Time of day', contribution: 0.25, direction: 'negative', description: '03:00 AM local — outside normal activity window' },
  { name: 'Geolocation', contribution: 0.20, direction: 'negative', description: 'London, UK — no prior transactions in this region' },
  { name: 'Merchant category', contribution: 0.10, direction: 'neutral', description: 'Online retail — common category for user' },
  { name: 'Device fingerprint', contribution: 0.10, direction: 'negative', description: 'Unrecognized device and browser' },
];

// ─── Govern meta ─────────────────────────────────────────────────────────────

const governMeta: GovernMeta = {
  auditId: 'GV-2026-0212-001',
  modelVersion: 'v3.2',
  explanationVersion: '1.1',
  decisionId: 'DEC-FRD-001',
  timestamp: '2026-02-12T03:12:00.000Z',
};

// ─── Decision object ─────────────────────────────────────────────────────────

export const protectDecision: DecisionObject = {
  decisionId: 'DEC-FRD-001',
  signal: {
    type: 'fraud',
    severity: 'critical',
    source: 'FraudDetectionV3.2',
    detectedAt: '2026-02-12T03:00:45.000Z',
  },
  evidence: {
    summary: 'Transaction of $1,250 at Amazon UK flagged — unusual amount, time, and location pattern.',
    confidence: 0.97,
    factors: fraudFactors,
    modelVersion: 'v3.2',
  },
  decision: {
    recommendation: 'Flag transaction and notify user',
    alternatives: ['Monitor only', 'Request additional verification'],
    reversible: true,
  },
  outcome: {
    status: 'completed',
    result: 'Transaction flagged. User notified via push notification.',
    executedAt: '2026-02-12T03:00:47.000Z',
  },
  auditId: 'GV-2026-0212-001',
  explanationVersion: '1.1',
};

// ─── Alerts ──────────────────────────────────────────────────────────────────

export const protectAlerts: ProtectAlert[] = [
  {
    id: 'ALT-001',
    type: 'fraud',
    severity: 'critical',
    title: 'Unusual transaction — Amazon UK',
    summary: '$1,250 at 03:00 AM from London. Unrecognized device. Transaction flagged for review.',
    detectedAt: '2026-02-12T03:00:45.000Z',
    source: 'FraudDetectionV3.2',
    status: 'new',
    decision: protectDecision,
    governMeta,
  },
  {
    id: 'ALT-002',
    type: 'anomaly',
    severity: 'high',
    title: 'Unusual login pattern detected',
    summary: '3 failed login attempts from new IP address in 5 minutes.',
    detectedAt: '2026-02-12T02:45:00.000Z',
    source: 'BehavioralAnalyticsV2.1',
    status: 'investigating',
    governMeta: {
      auditId: 'GV-2026-0212-002',
      modelVersion: 'v2.1',
      explanationVersion: '1.0',
      decisionId: 'DEC-ANM-002',
      timestamp: '2026-02-12T02:45:00.000Z',
    },
  },
  {
    id: 'ALT-003',
    type: 'compliance',
    severity: 'medium',
    title: 'CCPA consent scope expiring',
    summary: 'Data sharing consent expires in 7 days for category: transaction history.',
    detectedAt: '2026-02-12T00:00:00.000Z',
    source: 'ComplianceScannerV1.0.3',
    status: 'new',
    governMeta: {
      auditId: 'GV-2026-0212-003',
      modelVersion: 'v1.0.3',
      explanationVersion: '1.0',
      decisionId: 'DEC-CMP-003',
      timestamp: '2026-02-12T00:00:00.000Z',
    },
  },
  {
    id: 'ALT-004',
    type: 'security',
    severity: 'low',
    title: 'Password age warning',
    summary: 'Account password has not been changed in 90 days.',
    detectedAt: '2026-02-11T08:00:00.000Z',
    source: 'SecurityPolicyV1.2',
    status: 'resolved',
    governMeta: {
      auditId: 'GV-2026-0211-004',
      modelVersion: 'v1.2',
      explanationVersion: '1.0',
      decisionId: 'DEC-SEC-004',
      timestamp: '2026-02-11T08:00:00.000Z',
    },
  },
  {
    id: 'ALT-005',
    type: 'fraud',
    severity: 'high',
    title: 'Duplicate subscription charge',
    summary: 'Two identical $14.99 charges detected from StreamMax within 24h.',
    detectedAt: '2026-02-11T14:30:00.000Z',
    source: 'FraudDetectionV3.2',
    status: 'new',
    governMeta: {
      auditId: 'GV-2026-0211-005',
      modelVersion: 'v3.2',
      explanationVersion: '1.1',
      decisionId: 'DEC-FRD-005',
      timestamp: '2026-02-11T14:30:00.000Z',
    },
  },
];

// ─── Audit record (for the primary alert) ────────────────────────────────────

export const protectAuditRecord: AuditRecord = {
  id: 'AUD-001',
  auditId: 'GV-2026-0212-001',
  timestamp: '2026-02-12T03:00:47.000Z',
  engine: 'protect',
  screenId: 'S-V3-PRT02',
  action: 'fraud_detected',
  decision: protectDecision,
  complianceFlags: {
    gdprCompliant: true,
    ecoaCompliant: true,
    ccpaCompliant: true,
  },
  governMeta,
};

// ─── Oversight case (dispute filed for the primary alert) ────────────────────

export const protectOversightCase: OversightCase = {
  id: 'OV-001',
  requestedAt: '2026-02-12T03:15:00.000Z',
  requestedBy: 'user',
  reason: 'Dispute: I was traveling and this was a legitimate purchase.',
  relatedAuditId: 'GV-2026-0212-001',
  status: 'in-review',
  slaDeadline: '2026-02-12T07:15:00.000Z',
  assignedTo: 'Risk team',
};
