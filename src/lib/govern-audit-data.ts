/**
 * Govern Audit Detail — data constants and types.
 *
 * Extracted from GovernAuditDetail.tsx to keep the page component focused on UI.
 * Phase 3: Full B2B rewrite — banking context throughout.
 */
import { DEMO_THREAD } from '@/lib/demo-thread'

export interface AuditDecision {
  id: string
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern'
  type: string
  action: string
  timestamp: string
  model: { name: string; version: string; accuracy: number }
  explanation: {
    summary: string
    confidence: number
  }
  topFactors: Array<{ label: string; contribution: number; note: string }>
  compliance: { gdpr: boolean; ecoa: boolean; ccpa: boolean }
  userFeedback: { correct: boolean; comment: string }
  dataSources: string[]
  coreAssertion: string
  baseReality: Array<{ label: string; value: string }>
}

export const DEFAULT_DECISION_ID = 'GV-2026-0319-846'

export const ROUTE_TO_DECISION: Record<string, string> = {
  '/protect':  'GV-2026-0319-847',
  '/grow':     'GV-2026-0317-840',
  '/execute':  'GV-2026-0319-848',
  '/govern':   'GV-2026-0319-846',
}

const sharedFactors = [
  { label: 'Amount deviation', contribution: 0.95, note: 'Transaction 3x typical volume for this counterparty' },
  { label: 'Jurisdiction anomaly', contribution: 0.92, note: 'New offshore destination not in approved counterparty list' },
  { label: 'Timing pattern', contribution: 0.88, note: 'Activity outside normal business hours for this client tier' },
  { label: 'Counterparty history', contribution: 0.72, note: 'No prior transactions with this entity in 24-month window' },
]

export const AUDIT_DECISIONS: Record<string, AuditDecision> = {
  'GV-2026-0319-848': {
    id: 'GV-2026-0319-848',
    engine: 'Execute',
    type: 'credit_facility',
    action: 'Credit facility setup',
    timestamp: '2026-03-19T14:29:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Securities-backed credit facility initiated for VIP client after margin requirements verified and collateral sufficiency confirmed.',
      confidence: 0.99,
    },
    topFactors: [
      { label: 'Collateral coverage', contribution: 0.96, note: 'Portfolio value exceeds 150% of credit line' },
      { label: 'Client tier verification', contribution: 0.92, note: 'VIP client with $45M AUM, established relationship' },
      { label: 'Margin requirements', contribution: 0.88, note: 'Initial and maintenance margins within policy limits' },
      { label: 'Regulatory clearance', contribution: 0.79, note: 'Credit facility compliant with Reg T and Reg U' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Credit facility matches client request and portfolio profile.' },
    dataSources: ['Client Portfolio Ledger', 'Margin Requirements Engine', 'Regulatory Compliance Registry'],
    coreAssertion: 'Poseidon initiated a $2.5M securities-backed credit facility after margin verification',
    baseReality: [{ label: 'Facility', value: '$2,500,000 credit line' }, { label: 'Collateral', value: 'Securities portfolio' }, { label: 'Client', value: 'Elias Vance (VIP)' }, { label: 'Coverage', value: '150% collateralized' }],
  },
  'GV-2026-0319-847': {
    id: 'GV-2026-0319-847',
    engine: 'Execute',
    type: 'wire_authorization',
    action: 'Wire transfer authorization',
    timestamp: '2026-03-19T14:28:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Portfolio rebalance executed to reduce concentrated sector exposure after volatility threshold crossed. Decision Council cross-validated with 3 models.',
      confidence: 0.97,
    },
    topFactors: [
      { label: 'Sector concentration', contribution: 0.93, note: 'Technology allocation exceeded target by 14%' },
      { label: 'Volatility threshold', contribution: 0.89, note: '30-day volatility exceeded policy limit' },
      { label: 'Liquidity buffer', contribution: 0.81, note: 'Cash reserve remains above required floor' },
      { label: 'Tax impact', contribution: 0.62, note: 'Estimated tax drag stayed within accepted range' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Matches investment policy and approved risk profile.' },
    dataSources: ['Client Portfolio History (90 days)', 'Market Volatility Index', 'Investment Policy Statement'],
    coreAssertion: 'Poseidon rebalanced $12,400 across portfolio sectors after volatility threshold crossed',
    baseReality: [{ label: 'Transfer amount', value: '$12,400' }, { label: 'Source', value: 'Concentrated tech position' }, { label: 'Target', value: 'Diversified equity allocation' }, { label: 'Trigger', value: 'Volatility threshold exceeded' }],
  },
  'GV-2026-0319-846': {
    id: 'GV-2026-0319-846',
    engine: 'Protect',
    type: 'aml_flag',
    action: 'AML compliance flag',
    timestamp: '2026-03-19T14:15:00-04:00',
    model: { name: 'ComplianceAI', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: `Transaction was flagged after concurrent anomalies on counterparty (${DEMO_THREAD.criticalAlert.counterparty}), amount ($${DEMO_THREAD.criticalAlert.amount.toLocaleString()}), and jurisdiction signal. Combined risk exceeded auto-flag threshold.`,
      confidence: DEMO_THREAD.criticalAlert.confidence,
    },
    topFactors: sharedFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Confirmed suspicious transfer. AML investigation initiated.' },
    dataSources: ['Transaction History (Last 30 Days)', 'Sanctions Database', 'Counterparty Risk Consortium'],
    coreAssertion: `Poseidon flagged a $${DEMO_THREAD.criticalAlert.amount.toLocaleString()} offshore wire transfer as Critical Risk`,
    baseReality: [{ label: 'Amount', value: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}` }, { label: 'Counterparty', value: DEMO_THREAD.criticalAlert.counterparty }, { label: 'Risk level', value: 'Critical' }, { label: 'Account', value: DEMO_THREAD.criticalAlert.cardLast4 ?? 'ACCT-7291' }],
  },
  'GV-2026-0319-845': {
    id: 'GV-2026-0319-845',
    engine: 'Grow',
    type: 'fee_optimization',
    action: 'Fee restructure recommendation',
    timestamp: '2026-03-19T13:52:00-04:00',
    model: { name: 'FinancialStrategyAI', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Securities-backed lending alternative identified that would save client $315K over 3 years vs. cash wire. Cross-validated by Financial Strategy AI and Compliance AI.',
      confidence: 0.89,
    },
    topFactors: [
      { label: 'Interest rate advantage', contribution: 0.91, note: 'Securities lending rate 2.3% below cash wire cost-of-capital' },
      { label: 'Tax efficiency', contribution: 0.87, note: 'Avoids capital gains realization on liquidated positions' },
      { label: 'Portfolio continuity', contribution: 0.74, note: 'Client retains market exposure during credit period' },
      { label: 'Facility terms', contribution: 0.58, note: 'Flexible repayment structure within regulatory bounds' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Alternative adopted. Client authorized securities-backed path.' },
    dataSources: ['Client Portfolio Analytics', 'Credit Facility Rate Engine', 'Tax Simulation Model'],
    coreAssertion: 'Poseidon recommended securities-backed lending saving $315K vs. cash wire over 3 years',
    baseReality: [{ label: 'Alternative', value: 'Securities-backed lending' }, { label: 'Savings', value: '$315,000 over 3 years' }, { label: 'Rate advantage', value: '2.3% below cash wire' }, { label: 'Tax impact', value: 'Capital gains deferred' }],
  },
  'GV-2026-0319-844': {
    id: 'GV-2026-0319-844',
    engine: 'Execute',
    type: 'compliance_filing',
    action: 'Compliance filing queued',
    timestamp: '2026-03-19T11:20:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Automated retention policy identified regulatory filings due for submission and queued them for senior review before dispatch.',
      confidence: 0.78,
    },
    topFactors: [
      { label: 'Filing deadline', contribution: 0.84, note: 'Regulatory submission window closes in 72 hours' },
      { label: 'Document completeness', contribution: 0.73, note: 'All required attachments verified against checklist' },
      { label: 'Prior submission history', contribution: 0.66, note: 'Filing pattern consistent with previous quarters' },
      { label: 'Audit trail', contribution: 0.59, note: 'Immutable references retained in compliance ledger' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Queued for human review before submission.' },
    dataSources: ['Regulatory Filing Calendar', 'Compliance Document Archive'],
    coreAssertion: 'Poseidon queued quarterly compliance filings for senior review before regulatory deadline',
    baseReality: [{ label: 'Filings', value: 'Q1 regulatory submissions' }, { label: 'Deadline', value: '72 hours remaining' }, { label: 'Status', value: 'Pending senior review' }, { label: 'Completeness', value: 'All attachments verified' }],
  },
  'GV-2026-0318-843': {
    id: 'GV-2026-0318-843',
    engine: 'Protect',
    type: 'counterparty_exposure',
    action: 'Counterparty exposure alert',
    timestamp: '2026-03-18T16:42:00-04:00',
    model: { name: 'ComplianceAI', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Counterparty exposure pattern deviated from baseline and triggered manual verification workflow before settlement authorization.',
      confidence: 0.92,
    },
    topFactors: sharedFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Escalation was appropriate for this counterparty profile.' },
    dataSources: ['Counterparty Risk Database', 'Sanctions Screening Network'],
    coreAssertion: 'Poseidon escalated a counterparty exposure that deviated from baseline risk patterns',
    baseReality: [{ label: 'Pattern', value: 'Baseline deviation' }, { label: 'Action', value: 'Manual verification triggered' }, { label: 'Settlement', value: 'Held pending review' }, { label: 'Source', value: 'Counterparty risk analysis' }],
  },
  'GV-2026-0318-842': {
    id: 'GV-2026-0318-842',
    engine: 'Grow',
    type: 'portfolio_optimization',
    action: 'Portfolio optimization update',
    timestamp: '2026-03-18T10:18:00-04:00',
    model: { name: 'FinancialStrategyAI', version: '2.9.0', accuracy: 96.9 },
    explanation: {
      summary: 'Liquidity reserve trajectory recalculated after client inflow pattern stabilized over 10-week observation window.',
      confidence: 0.86,
    },
    topFactors: [
      { label: 'Inflow consistency', contribution: 0.88, note: 'Deposits remained stable for 10 weeks' },
      { label: 'Market conditions', contribution: 0.84, note: 'No variance events in portfolio returns' },
      { label: 'Withdrawal patterns', contribution: 0.72, note: 'Client outflows remained within expected band' },
      { label: 'Forecast confidence', contribution: 0.61, note: 'Confidence interval narrowed month-over-month' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Optimization estimate aligns with current portfolio balances.' },
    dataSources: ['Client Cash Flow Ledger', 'Portfolio Performance Analytics'],
    coreAssertion: 'Poseidon recalculated liquidity reserve trajectory after inflow pattern stabilized',
    baseReality: [{ label: 'Trigger', value: 'Inflow pattern stabilization' }, { label: 'Stability', value: '10 weeks consistent' }, { label: 'Market variance', value: 'None detected' }, { label: 'Confidence trend', value: 'Narrowing monthly' }],
  },
  'GV-2026-0317-841': {
    id: 'GV-2026-0317-841',
    engine: 'Execute',
    type: 'payment_authorization',
    action: 'Scheduled payment authorized',
    timestamp: '2026-03-17T14:12:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Scheduled institutional payment executed inside approved threshold with complete trace of authorization and transaction lifecycle.',
      confidence: 0.91,
    },
    topFactors: [
      { label: 'Authorization state', contribution: 0.94, note: 'Action approved by Senior Wealth Manager' },
      { label: 'Policy alignment', contribution: 0.88, note: 'Payment complied with institutional risk constraints' },
      { label: 'Liquidity buffer', contribution: 0.85, note: 'Buffer remained above minimum reserve target' },
      { label: 'Counterparty trust', contribution: 0.63, note: 'Verified institutional counterparty with prior history' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Execution met expected timing and amount.' },
    dataSources: ['Authorization Queue', 'Counterparty Risk Graph'],
    coreAssertion: 'Poseidon verified and executed an authorized institutional payment within approved threshold',
    baseReality: [{ label: 'Authorization', value: 'Senior Wealth Manager approved' }, { label: 'Policy', value: 'Within institutional risk constraints' }, { label: 'Buffer', value: 'Above minimum reserve' }, { label: 'Counterparty', value: 'Verified institution' }],
  },
  'GV-2026-0317-840': {
    id: 'GV-2026-0317-840',
    engine: 'Govern',
    type: 'policy_update',
    action: 'Policy threshold recalibration',
    timestamp: '2026-03-17T09:40:00-04:00',
    model: { name: 'GovernanceTracer', version: '3.1.0', accuracy: 98.9 },
    explanation: {
      summary: 'Decision Council thresholds were recalibrated after oversight review to improve explainability and reduce false-positive escalation rate.',
      confidence: 0.97,
    },
    topFactors: [
      { label: 'Oversight feedback', contribution: 0.93, note: 'Human review signaled threshold adjustment need' },
      { label: 'False-positive trend', contribution: 0.89, note: 'Recent alerts exceeded target false-positive rate' },
      { label: 'Audit completeness', contribution: 0.82, note: 'Policy migration retained full evidence lineage' },
      { label: 'Policy coverage', contribution: 0.67, note: 'Controls expanded for cross-jurisdictional edge cases' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Policy update approved with full oversight trace.' },
    dataSources: ['Aggregated False-Positive Error Log', 'Decision Council Governance Rules'],
    coreAssertion: 'Poseidon recalibrated Decision Council thresholds to reduce false-positive rate by 23%',
    baseReality: [{ label: 'Trigger', value: 'Oversight committee review' }, { label: 'Issue', value: 'False-positive rate exceeded target' }, { label: 'Migration', value: 'Full evidence lineage retained' }, { label: 'Coverage', value: 'Cross-jurisdictional controls expanded' }],
  },
}
