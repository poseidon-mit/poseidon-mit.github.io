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
  { name: 'Amount deviation', contribution: 0.35, direction: 'negative', description: '$347.89 — 4.2× above 90-day average for this merchant category' },
  { name: 'Merchant descriptor', contribution: 0.25, direction: 'negative', description: 'AMZN Mktp US*3K7R2F — unfamiliar descriptor not in recognized merchant list' },
  { name: 'Timing pattern', contribution: 0.20, direction: 'negative', description: '2:47 AM local — outside normal activity window' },
  { name: 'Test charge detected', contribution: 0.10, direction: 'negative', description: '$1.00 test charge 12 minutes before this transaction' },
  { name: 'Card usage pattern', contribution: 0.10, direction: 'negative', description: 'Card ending 4821 not typically used for marketplace purchases' },
];

// ─── Govern meta ─────────────────────────────────────────────────────────────

const governMeta: GovernMeta = {
  auditId: 'GV-2026-0309-048',
  modelVersion: 'v3.2',
  explanationVersion: '1.1',
  decisionId: 'DEC-FRD-001',
  timestamp: '2026-03-09T10:32:00.000Z',
};

// ─── Decision object ─────────────────────────────────────────────────────────

export const protectDecision: DecisionObject = {
  decisionId: 'DEC-FRD-001',
  signal: {
    type: 'fraud',
    severity: 'critical',
    source: 'FraudDetectionV3.2',
    detectedAt: '2026-03-09T02:47:00.000Z',
  },
  evidence: {
    summary: 'Charge of $347.89 from AMZN Mktp US*3K7R2F flagged — unfamiliar merchant descriptor, amount deviation, off-hours timing, and preceding test charge.',
    confidence: 0.94,
    factors: fraudFactors,
    modelVersion: 'v3.2',
  },
  decision: {
    recommendation: 'Flag transaction and prepare dispute package',
    alternatives: ['Monitor only', 'Request additional verification'],
    reversible: true,
  },
  outcome: {
    status: 'completed',
    result: 'Transaction flagged. User notified via push notification. Dispute package prepared.',
    executedAt: '2026-03-09T02:47:03.000Z',
  },
  auditId: 'GV-2026-0309-048',
  explanationVersion: '1.1',
};

// ─── Alerts ──────────────────────────────────────────────────────────────────

export const protectAlerts: ProtectAlert[] = [
  {
    id: 'ALT-001',
    type: 'fraud',
    severity: 'critical',
    title: 'Unrecognized charge — AMZN Mktp US*3K7R2F',
    summary: '$347.89 at 2:47 AM. Unfamiliar merchant descriptor. $1.00 test charge detected. Transaction flagged for review.',
    detectedAt: '2026-03-09T02:47:00.000Z',
    source: 'FraudDetectionV3.2',
    status: 'new',
    decision: protectDecision,
    governMeta,
  },
  {
    id: 'ALT-002',
    type: 'anomaly',
    severity: 'high',
    title: 'Subscription price increase — Spotify',
    summary: 'Monthly charge increased from $10.99 to $11.99 without notification.',
    detectedAt: '2026-03-08T09:17:00.000Z',
    source: 'FraudDetectionV3.2',
    status: 'investigating',
    governMeta: {
      auditId: 'GV-2026-0308-046',
      modelVersion: 'v3.2',
      explanationVersion: '1.1',
      decisionId: 'DEC-PRC-002',
      timestamp: '2026-03-08T09:17:00.000Z',
    },
  },
  {
    id: 'ALT-003',
    type: 'fraud',
    severity: 'medium',
    title: 'Duplicate charge — DoorDash',
    summary: 'Two identical $67.43 charges within 4 minutes. Likely processing error.',
    detectedAt: '2026-03-07T16:44:00.000Z',
    source: 'FraudDetectionV3.2',
    status: 'new',
    governMeta: {
      auditId: 'GV-2026-0307-044',
      modelVersion: 'v3.2',
      explanationVersion: '1.1',
      decisionId: 'DEC-DUP-003',
      timestamp: '2026-03-07T16:44:00.000Z',
    },
  },
  {
    id: 'ALT-004',
    type: 'anomaly',
    severity: 'medium',
    title: 'Velocity anomaly — Shell Gas Station',
    summary: '$45.00 gas station charge in Boston, then online purchase from different state within 20 minutes.',
    detectedAt: '2026-03-07T14:22:00.000Z',
    source: 'FraudDetectionV3.2',
    status: 'resolved',
    governMeta: {
      auditId: 'GV-2026-0307-VEL',
      modelVersion: 'v3.2',
      explanationVersion: '1.1',
      decisionId: 'DEC-VEL-004',
      timestamp: '2026-03-07T14:22:00.000Z',
    },
  },
  {
    id: 'ALT-005',
    type: 'fraud',
    severity: 'medium',
    title: 'Unusual ATM withdrawal',
    summary: '$800 ATM withdrawal at unfamiliar location at 11:47 PM.',
    detectedAt: '2026-03-06T23:47:00.000Z',
    source: 'FraudDetectionV3.2',
    status: 'new',
    governMeta: {
      auditId: 'GV-2026-0306-042',
      modelVersion: 'v3.2',
      explanationVersion: '1.1',
      decisionId: 'DEC-ATM-005',
      timestamp: '2026-03-06T23:47:00.000Z',
    },
  },
];

// ─── Audit record (for the primary alert) ────────────────────────────────────

export const protectAuditRecord: AuditRecord = {
  id: 'AUD-001',
  auditId: 'GV-2026-0309-048',
  timestamp: '2026-03-09T02:47:03.000Z',
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
  requestedAt: '2026-03-09T03:00:00.000Z',
  requestedBy: 'user',
  reason: 'Dispute: I don\'t recognize this charge from AMZN Mktp US*3K7R2F.',
  relatedAuditId: 'GV-2026-0309-048',
  status: 'in-review',
  slaDeadline: '2026-03-09T07:00:00.000Z',
  assignedTo: 'Card issuer dispute team',
};
