/**
 * Govern Audit Flow — deterministic fixture for the
 * Decision → Audit → Review chain.
 *
 * Used by: GOV01 (trust dashboard), GOV02 (audit ledger), GOV03 (audit detail),
 *          GOV04 (registry), GOV05 (oversight), GOV06 (policy)
 */
import type {
  AuditRecord,
  TrustScore,
  OversightCase,
  PolicyModelCard,
  DecisionObject,
  GovernMeta,
} from '../../contracts/domain-models';

// ─── Trust Score ─────────────────────────────────────────────────────────────

export const trustScore: TrustScore = {
  overall: 97,
  components: {
    accuracy: 96,
    transparency: 98,
    fairness: 94,
    compliance: 100,
  },
  trend: 'up',
  lastUpdated: '2026-03-09T08:00:00.000Z',
};

export const trustScoreHistory: TrustScore[] = [
  { overall: 94, components: { accuracy: 93, transparency: 96, fairness: 91, compliance: 100 }, trend: 'stable', lastUpdated: '2026-02-09T08:00:00.000Z' },
  { overall: 95, components: { accuracy: 94, transparency: 97, fairness: 92, compliance: 100 }, trend: 'up', lastUpdated: '2026-02-16T08:00:00.000Z' },
  { overall: 95, components: { accuracy: 95, transparency: 97, fairness: 92, compliance: 100 }, trend: 'stable', lastUpdated: '2026-02-23T08:00:00.000Z' },
  { overall: 96, components: { accuracy: 95, transparency: 98, fairness: 93, compliance: 100 }, trend: 'up', lastUpdated: '2026-03-02T08:00:00.000Z' },
  { overall: 97, components: { accuracy: 96, transparency: 98, fairness: 94, compliance: 100 }, trend: 'up', lastUpdated: '2026-03-09T08:00:00.000Z' },
  trustScore,
];

// ─── Audit Records ───────────────────────────────────────────────────────────

const makeGovernMeta = (id: string, mv: string, ev: string, did: string, ts: string): GovernMeta => ({
  auditId: id, modelVersion: mv, explanationVersion: ev, decisionId: did, timestamp: ts,
});

const makeDecision = (did: string, type: string, sev: 'critical' | 'high' | 'medium' | 'low' | 'info', source: string, summary: string, conf: number, rec: string, aid: string): DecisionObject => ({
  decisionId: did,
  signal: { type, severity: sev, source, detectedAt: '2026-03-09T03:00:00.000Z' },
  evidence: { summary, confidence: conf, factors: [], modelVersion: 'v3.2' },
  decision: { recommendation: rec, alternatives: [], reversible: true },
  auditId: aid,
  explanationVersion: '1.1',
});

export const auditRecords: AuditRecord[] = [
  {
    id: 'AUD-001',
    auditId: 'GV-2026-0309-048',
    timestamp: '2026-03-09T10:32:00.000Z',
    engine: 'protect',
    screenId: 'S-V3-PRT02',
    action: 'fraud_detected',
    decision: makeDecision('DEC-FRD-001', 'fraud', 'critical', 'FraudDetectionV3.2', 'Unrecognized $347.89 charge from AMZN Mktp US*3K7R2F flagged', 0.94, 'Flag and prepare dispute', 'GV-2026-0309-048'),
    complianceFlags: { gdprCompliant: true, ecoaCompliant: true, ccpaCompliant: true },
    governMeta: makeGovernMeta('GV-2026-0309-048', 'v3.2', '1.1', 'DEC-FRD-001', '2026-03-09T10:32:00.000Z'),
  },
  {
    id: 'AUD-002',
    auditId: 'GV-2026-0308-046',
    timestamp: '2026-03-08T09:17:00.000Z',
    engine: 'protect',
    screenId: 'S-V3-PRT01',
    action: 'price_increase_detected',
    decision: makeDecision('DEC-PRC-002', 'anomaly', 'high', 'FraudDetectionV3.2', 'Spotify subscription increased $10.99 → $11.99 without notification', 0.87, 'Alert user to price change', 'GV-2026-0308-046'),
    complianceFlags: { gdprCompliant: true, ecoaCompliant: true, ccpaCompliant: true },
    governMeta: makeGovernMeta('GV-2026-0308-046', 'v3.2', '1.1', 'DEC-PRC-002', '2026-03-08T09:17:00.000Z'),
  },
  {
    id: 'AUD-003',
    auditId: 'GV-2026-0309-047',
    timestamp: '2026-03-09T09:15:00.000Z',
    engine: 'grow',
    screenId: 'S-V3-GRW02',
    action: 'savings_opportunity_identified',
    decision: makeDecision('DEC-GRW-001', 'savings_opportunity', 'info', 'FinancialStrategyAI', 'High-yield savings at 4.85% APY would generate $840/year on $23,000', 0.93, 'Recommend high-yield savings transfer', 'GV-2026-0309-047'),
    complianceFlags: { gdprCompliant: true, ecoaCompliant: true, ccpaCompliant: true },
    governMeta: makeGovernMeta('GV-2026-0309-047', 'v3.2', '1.0', 'DEC-GRW-001', '2026-03-09T09:15:00.000Z'),
  },
  {
    id: 'AUD-004',
    auditId: 'GV-2026-0308-045',
    timestamp: '2026-03-08T08:45:00.000Z',
    engine: 'grow',
    screenId: 'S-V3-GRW02',
    action: 'debt_optimization_assessed',
    decision: makeDecision('DEC-GRW-002', 'debt_optimization', 'info', 'FinancialStrategyAI', '0% APR balance transfer on $4,800 saves $1,200/year vs 22.9% APR', 0.88, 'Present balance transfer options', 'GV-2026-0308-045'),
    complianceFlags: { gdprCompliant: true, ecoaCompliant: true, ccpaCompliant: true },
    governMeta: makeGovernMeta('GV-2026-0308-045', 'v3.2', '1.0', 'DEC-GRW-002', '2026-03-08T08:45:00.000Z'),
  },
  {
    id: 'AUD-005',
    auditId: 'GV-2026-0307-043',
    timestamp: '2026-03-07T08:30:00.000Z',
    engine: 'execute',
    screenId: 'S-V3-EXE02',
    action: 'auto_transfer_queued',
    decision: makeDecision('DEC-ACT-001', 'savings_automation', 'info', 'ExecutePlanner', 'Cash surplus supports $500/month emergency fund auto-transfer', 0.90, 'Set up recurring $500/month transfer', 'GV-2026-0307-043'),
    complianceFlags: { gdprCompliant: true, ecoaCompliant: true, ccpaCompliant: true },
    governMeta: makeGovernMeta('GV-2026-0307-043', 'v1.5', '1.0', 'DEC-ACT-001', '2026-03-07T08:30:00.000Z'),
  },
  {
    id: 'AUD-006',
    auditId: 'GV-2026-0305-041',
    timestamp: '2026-03-05T11:10:00.000Z',
    engine: 'govern',
    screenId: 'S-V3-GOV06',
    action: 'optimization_audit_completed',
    decision: makeDecision('DEC-GOV-001', 'audit_verification', 'info', 'GovernanceTracer', 'Streaming subscription optimization analysis verified by all models', 0.91, 'Analysis approved — present to user', 'GV-2026-0305-041'),
    complianceFlags: { gdprCompliant: true, ecoaCompliant: true, ccpaCompliant: true },
    governMeta: makeGovernMeta('GV-2026-0305-041', 'v3.1', '1.0', 'DEC-GOV-001', '2026-03-05T11:10:00.000Z'),
  },
];

// ─── Oversight Cases ─────────────────────────────────────────────────────────

export const oversightCases: OversightCase[] = [
  {
    id: 'OV-001',
    requestedAt: '2026-03-09T03:00:00.000Z',
    requestedBy: 'user',
    reason: 'Dispute: I don\'t recognize this $347.89 charge from AMZN Mktp US*3K7R2F.',
    relatedAuditId: 'GV-2026-0309-048',
    status: 'in-review',
    slaDeadline: '2026-03-09T07:00:00.000Z',
    assignedTo: 'Card issuer dispute team',
  },
  {
    id: 'OV-002',
    requestedAt: '2026-03-07T17:00:00.000Z',
    requestedBy: 'user',
    reason: 'Dispute: DoorDash duplicate charge — I only placed one order.',
    relatedAuditId: 'GV-2026-0307-044',
    status: 'pending',
    slaDeadline: '2026-03-08T17:00:00.000Z',
  },
  {
    id: 'OV-003',
    requestedAt: '2026-03-06T23:55:00.000Z',
    requestedBy: 'system',
    reason: 'Escalation: Unusual ATM withdrawal pattern — user verification requested.',
    relatedAuditId: 'GV-2026-0306-042',
    status: 'resolved',
    slaDeadline: '2026-03-07T03:55:00.000Z',
    assignedTo: 'Automated verification',
    resolution: 'User confirmed legitimate withdrawal — location whitelisted.',
  },
  {
    id: 'OV-004',
    requestedAt: '2026-03-02T12:00:00.000Z',
    requestedBy: 'user',
    reason: 'Dispute: False positive fraud alert on recurring Netflix payment.',
    relatedAuditId: 'GV-2026-0302-001',
    status: 'resolved',
    slaDeadline: '2026-03-02T16:00:00.000Z',
    assignedTo: 'Automated verification',
    resolution: 'Alert overturned — recurring payment whitelisted.',
  },
];

// ─── Model Cards ─────────────────────────────────────────────────────────────

export const modelCards: PolicyModelCard[] = [
  {
    modelId: 'MDL-001',
    name: 'FraudDetectionV3.2',
    version: '3.2.1',
    description: 'Real-time fraud detection using behavioral analysis, merchant pattern matching, and transaction velocity monitoring.',
    limitations: ['Limited international merchant data', 'May flag legitimate purchases from new merchants'],
    dataUsed: ['Transaction history', 'Merchant recognition patterns', 'Card usage timing', 'Test charge detection'],
    fairnessMetrics: { demographicParity: 0.98, equalOpportunity: 0.96, predictiveParity: 0.97 },
    lastAuditDate: '2026-03-01',
    policyBoundaries: ['No autonomous blocking above $1,000', 'Human review for disputed transactions'],
  },
  {
    modelId: 'MDL-002',
    name: 'FinancialStrategyAI',
    version: '3.2.0',
    description: 'Personal finance optimization using spending analysis, rate comparison, and goal-based planning.',
    limitations: ['Requires 3 months of transaction history', 'Rate projections based on current market conditions'],
    dataUsed: ['Bank account balances', 'Transaction patterns', 'Market rate data', 'Credit bureau summary'],
    fairnessMetrics: { demographicParity: 0.95, equalOpportunity: 0.94 },
    lastAuditDate: '2026-02-15',
    policyBoundaries: ['Savings projections capped at 12-month horizon', 'All recommendations require user approval'],
  },
  {
    modelId: 'MDL-003',
    name: 'ExecutePlanner',
    version: '4.1.0',
    description: 'Action execution planning with cash flow analysis, risk assessment, and step-by-step guidance.',
    limitations: ['Assumes regular income pattern', 'Does not account for irregular large expenses'],
    dataUsed: ['Account balances', 'Income verification', 'Spending patterns', 'Goal progress'],
    fairnessMetrics: { demographicParity: 0.97, equalOpportunity: 0.95 },
    lastAuditDate: '2026-02-28',
    policyBoundaries: ['Max auto-transfer: $500/day', 'User approval required for first-time actions'],
  },
  {
    modelId: 'MDL-004',
    name: 'GovernanceTracer',
    version: '3.1.0',
    description: 'Audit verification and transparency engine ensuring all AI decisions are explainable and compliant.',
    limitations: ['US regulations only', 'EU GDPR coverage limited to Article 22 scope'],
    dataUsed: ['Audit records', 'Model decision logs', 'User consent records'],
    fairnessMetrics: { demographicParity: 1.0, equalOpportunity: 1.0 },
    lastAuditDate: '2026-03-05',
    policyBoundaries: ['Fail-closed on missing audit data', 'All policy changes require dual approval'],
  },
];
