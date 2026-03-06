/**
 * Govern Audit Detail — data constants and types.
 *
 * Extracted from GovernAuditDetail.tsx to keep the page component focused on UI.
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
}

export const DEFAULT_DECISION_ID = 'GV-2026-0319-846'

const sharedFactors = [
  { label: 'Amount deviation', contribution: 0.95, note: '3x typical transaction amount' },
  { label: 'Location anomaly', contribution: 0.92, note: 'Unusual network region for account profile' },
  { label: 'Time-of-day risk', contribution: 0.88, note: 'Activity outside normal behavior window' },
  { label: 'Merchant history', contribution: 0.72, note: 'Low historical trust score in this category' },
]

export const AUDIT_DECISIONS: Record<string, AuditDecision> = {
  'GV-2026-0319-847': {
    id: 'GV-2026-0319-847',
    engine: 'Execute',
    type: 'portfolio_rebalance',
    action: 'Portfolio rebalance',
    timestamp: '2026-03-19T14:28:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Portfolio allocation shifted from concentrated tech exposure to balanced risk targets after market-volatility threshold crossed.',
      confidence: 0.97,
    },
    topFactors: [
      { label: 'Risk concentration', contribution: 0.93, note: 'Technology allocation exceeded target by 14%' },
      { label: 'Volatility index', contribution: 0.89, note: '30-day volatility exceeded policy threshold' },
      { label: 'Liquidity buffer', contribution: 0.81, note: 'Cash reserve remains above required floor' },
      { label: 'Tax impact', contribution: 0.62, note: 'Estimated tax drag stayed within accepted range' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Matches investment policy and approved risk profile.' },
    dataSources: ['Brokerage Account History (90 days)', 'Market Volatility Index (VIX)', 'User IPS Targets'],
  },
  'GV-2026-0319-846': {
    id: 'GV-2026-0319-846',
    engine: 'Protect',
    type: 'fraud_detected',
    action: 'Flag suspicious wire transfer',
    timestamp: '2026-03-19T14:15:00-04:00',
    model: { name: 'FraudDetectionV3.2', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: `Transaction was flagged after concurrent anomalies on merchant (${DEMO_THREAD.criticalAlert.merchant}), amount ($${DEMO_THREAD.criticalAlert.amount.toLocaleString()}), and location signal. Combined risk exceeded auto-flag threshold.`,
      confidence: DEMO_THREAD.criticalAlert.confidence,
    },
    topFactors: sharedFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Confirmed suspicious transfer. Keep card protection active.' },
    dataSources: ['Transaction History (Last 30 Days)', 'Geolocation Database', 'Merchant Trust Consortium'],
  },
  'GV-2026-0319-845': {
    id: 'GV-2026-0319-845',
    engine: 'Grow',
    type: 'savings_optimization',
    action: 'Subscription consolidation',
    timestamp: '2026-03-19T13:52:00-04:00',
    model: { name: 'GrowthForecast', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Three overlapping services with duplicate billing categories detected across recurring charges were grouped into one replacement plan with lower monthly burn.',
      confidence: 0.89,
    },
    topFactors: [
      { label: 'Billing category overlap', contribution: 0.91, note: 'Three services bill under overlapping merchant categories' },
      { label: 'Monthly cost delta', contribution: 0.87, note: 'Projected savings of $140 per month' },
      { label: 'Service switching risk', contribution: 0.74, note: 'Low disruption expected from consolidation' },
      { label: 'Contract term', contribution: 0.58, note: 'Cancellation windows confirmed open' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Recommendation approved. Savings target updated.' },
    dataSources: ['Recurring Billing Ledger (12 Months)', 'Merchant Category Analysis'],
  },
  'GV-2026-0319-844': {
    id: 'GV-2026-0319-844',
    engine: 'Execute',
    type: 'document_archive',
    action: 'Invoice archive recommended',
    timestamp: '2026-03-19T11:20:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Automated retention policy identified stale paid invoices and queued them for archive to reduce dashboard noise.',
      confidence: 0.78,
    },
    topFactors: [
      { label: 'Retention policy match', contribution: 0.84, note: 'Documents exceeded retention visibility window' },
      { label: 'Duplicate artifacts', contribution: 0.73, note: '47 paid invoices already stored in backup archive' },
      { label: 'Searchability score', contribution: 0.66, note: 'Metadata quality sufficient for recall' },
      { label: 'Audit preservation', contribution: 0.59, note: 'Immutable references retained in ledger' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Queued for human review before completion.' },
    dataSources: ['Document Archive DB', 'Data Retention Policy V2'],
  },
  'GV-2026-0318-843': {
    id: 'GV-2026-0318-843',
    engine: 'Protect',
    type: 'transaction_review',
    action: 'Unusual transaction',
    timestamp: '2026-03-18T16:42:00-04:00',
    model: { name: 'FraudDetectionV3.2', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Transaction pattern deviated from baseline and triggered manual verification workflow before settlement.',
      confidence: 0.92,
    },
    topFactors: sharedFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Escalation was appropriate for this charge profile.' },
    dataSources: ['Retail Transaction History', 'Fraud Fingerprinting Network'],
  },
  'GV-2026-0318-842': {
    id: 'GV-2026-0318-842',
    engine: 'Grow',
    type: 'goal_update',
    action: 'Goal update',
    timestamp: '2026-03-18T10:18:00-04:00',
    model: { name: 'GoalTracker', version: '2.9.0', accuracy: 96.9 },
    explanation: {
      summary: 'Savings trajectory model recalculated expected completion after recurring transfers increased.',
      confidence: 0.86,
    },
    topFactors: [
      { label: 'Contribution consistency', contribution: 0.88, note: 'Transfers remained stable for 10 weeks' },
      { label: 'Income stability', contribution: 0.84, note: 'No variance events in payroll stream' },
      { label: 'Expense variability', contribution: 0.72, note: 'Spend volatility remained within expected band' },
      { label: 'Forecast uncertainty', contribution: 0.61, note: 'Confidence interval narrowed month-over-month' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Progress estimate aligns with current account balances.' },
    dataSources: ['Payroll Deposit Ledger', 'Monthly Expense Variance'],
  },
  'GV-2026-0317-841': {
    id: 'GV-2026-0317-841',
    engine: 'Execute',
    type: 'payment_execution',
    action: 'Scheduled payment verified',
    timestamp: '2026-03-17T14:12:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Scheduled payment executed inside approved threshold with complete trace of consent and transaction lifecycle.',
      confidence: 0.91,
    },
    topFactors: [
      { label: 'Consent state', contribution: 0.94, note: 'Action approved by account owner' },
      { label: 'Policy alignment', contribution: 0.88, note: 'Payment complied with risk and spend constraints' },
      { label: 'Funds availability', contribution: 0.85, note: 'Buffer remained above minimum reserve target' },
      { label: 'Counterparty trust', contribution: 0.63, note: 'Verified vendor with prior successful history' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Execution met expected timing and amount.' },
    dataSources: ['Scheduled Payment Queue', 'Vendor Risk Graph'],
  },
  'GV-2026-0317-840': {
    id: 'GV-2026-0317-840',
    engine: 'Govern',
    type: 'policy_update',
    action: 'Policy update',
    timestamp: '2026-03-17T09:40:00-04:00',
    model: { name: 'GovernanceTracer', version: '3.1.0', accuracy: 98.9 },
    explanation: {
      summary: 'Policy thresholds were recalibrated after oversight review to improve explainability and reduce false-positive escalation.',
      confidence: 0.97,
    },
    topFactors: [
      { label: 'Oversight feedback', contribution: 0.93, note: 'Human review signaled threshold adjustment need' },
      { label: 'False-positive trend', contribution: 0.89, note: 'Recent alerts exceeded target false-positive rate' },
      { label: 'Audit completeness', contribution: 0.82, note: 'Policy migration retained full evidence lineage' },
      { label: 'Policy coverage', contribution: 0.67, note: 'Controls expanded for edge-case transactions' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Policy update approved with full oversight trace.' },
    dataSources: ['Aggregated False-Positive Error Log', 'Oversight Committee Rules'],
  },
}
