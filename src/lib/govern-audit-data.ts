/**
 * Govern Audit Detail — data constants and types.
 *
 * Extracted from GovernAuditDetail.tsx to keep the page component focused on UI.
 * Phase 4: Full B2C rewrite — personal finance context throughout.
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

export const DEFAULT_DECISION_ID = 'GV-2026-0309-048'

export const ROUTE_TO_DECISION: Record<string, string> = {
  '/dashboard': 'GV-2026-0309-048',
  '/protect':   'GV-2026-0309-048',
  '/grow':      'GV-2026-0309-047',
  '/execute':   'GV-2026-0307-043',
  '/govern':    'GV-2026-0305-041',
}

const sharedFraudFactors = [
  { label: 'Amount deviation', contribution: 0.95, note: 'Charge is 4.2× your 90-day average for this merchant category' },
  { label: 'Merchant descriptor', contribution: 0.92, note: 'Unfamiliar merchant name — not in your recognized merchant list' },
  { label: 'Timing pattern', contribution: 0.88, note: 'Transaction posted at 2:47 AM — outside your normal activity window' },
  { label: 'Velocity pattern', contribution: 0.72, note: 'Small test charge ($1.00) detected 12 minutes before this transaction' },
]

export const AUDIT_DECISIONS: Record<string, AuditDecision> = {
  'GV-2026-0309-048': {
    id: 'GV-2026-0309-048',
    engine: 'Protect',
    type: 'fraud_flag',
    action: 'Suspicious charge flagged',
    timestamp: '2026-03-09T10:32:00-04:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: `Charge of $${DEMO_THREAD.criticalAlert.amount} from ${DEMO_THREAD.criticalAlert.counterparty} was flagged after concurrent anomalies in merchant descriptor, amount deviation, and timing pattern. Combined risk exceeded auto-flag threshold.`,
      confidence: DEMO_THREAD.criticalAlert.confidence,
    },
    topFactors: sharedFraudFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Confirmed unrecognized charge. Dispute initiated.' },
    dataSources: ['Transaction History (90 days)', 'Merchant Recognition Database', 'Card Network Fraud Patterns'],
    coreAssertion: `Poseidon flagged a $${DEMO_THREAD.criticalAlert.amount} charge from ${DEMO_THREAD.criticalAlert.counterparty} as suspicious`,
    baseReality: [{ label: 'Amount', value: `$${DEMO_THREAD.criticalAlert.amount}` }, { label: 'Merchant', value: DEMO_THREAD.criticalAlert.counterparty }, { label: 'Risk level', value: 'Critical' }, { label: 'Card', value: `ending ${DEMO_THREAD.criticalAlert.cardLast4 ?? '4821'}` }],
  },
  'GV-2026-0309-047': {
    id: 'GV-2026-0309-047',
    engine: 'Grow',
    type: 'savings_opportunity',
    action: 'High-yield savings opportunity identified',
    timestamp: '2026-03-09T09:15:00-04:00',
    model: { name: 'FinancialStrategyAI', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Your savings account is earning 0.01% APY while high-yield alternatives offer 4.85% APY. Moving $23,000 would generate ~$840/year in additional interest with FDIC-insured accounts.',
      confidence: 0.93,
    },
    topFactors: [
      { label: 'Interest rate gap', contribution: 0.94, note: '4.84% APY difference between current (0.01%) and best available (4.85%)' },
      { label: 'Balance opportunity cost', contribution: 0.89, note: '$23,000 sitting idle — losing ~$70/month in potential interest' },
      { label: 'FDIC coverage', contribution: 0.82, note: 'Recommended accounts are FDIC-insured up to $250,000' },
      { label: 'Liquidity preservation', contribution: 0.75, note: 'No lock-up period — funds remain accessible for emergencies' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Good recommendation. Will transfer savings this week.' },
    dataSources: ['Bank Account Balances', 'FDIC Rate Database', 'Personal Cash Flow Analysis'],
    coreAssertion: 'Poseidon identified $840/year in lost interest by comparing your savings rate to market alternatives',
    baseReality: [{ label: 'Current APY', value: '0.01%' }, { label: 'Available APY', value: '4.85%' }, { label: 'Balance', value: '$23,000' }, { label: 'Annual gain', value: '$840/year' }],
  },
  'GV-2026-0308-046': {
    id: 'GV-2026-0308-046',
    engine: 'Protect',
    type: 'price_increase',
    action: 'Subscription price increase detected',
    timestamp: '2026-03-08T09:17:00-04:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Spotify subscription charge increased from $10.99 to $11.99 without a prior notification detected in your email or app notifications. This matches a pattern of silent price increases across streaming services.',
      confidence: 0.87,
    },
    topFactors: [
      { label: 'Price change detection', contribution: 0.91, note: 'Monthly charge increased 9.1% ($10.99 → $11.99)' },
      { label: 'Notification absence', contribution: 0.85, note: 'No price change notification found in email or app alerts' },
      { label: 'Cohort pattern', contribution: 0.78, note: '23% of similar users experienced undisclosed streaming price increases' },
      { label: 'Usage frequency', contribution: 0.62, note: 'Active Spotify user — 47 listening sessions this month' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Noticed the increase. Good catch.' },
    dataSources: ['Subscription Tracking History', 'Email Notification Scanner', 'Merchant Billing Patterns'],
    coreAssertion: 'Poseidon detected a silent $1.00/month Spotify price increase without user notification',
    baseReality: [{ label: 'Service', value: 'Spotify Premium' }, { label: 'Previous', value: '$10.99/mo' }, { label: 'Current', value: '$11.99/mo' }, { label: 'Impact', value: '$12/year increase' }],
  },
  'GV-2026-0308-045': {
    id: 'GV-2026-0308-045',
    engine: 'Grow',
    type: 'debt_optimization',
    action: 'Balance transfer eligibility assessed',
    timestamp: '2026-03-08T08:45:00-04:00',
    model: { name: 'FinancialStrategyAI', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Your Visa ending 4821 carries $4,800 at 22.9% APR. A 0% APR balance transfer card would save approximately $1,200/year in interest while you pay down the principal.',
      confidence: 0.88,
    },
    topFactors: [
      { label: 'Interest rate savings', contribution: 0.93, note: '22.9% APR → 0% for 18 months on $4,800 balance' },
      { label: 'Credit score eligibility', contribution: 0.86, note: 'Your credit profile qualifies for multiple 0% APR offers' },
      { label: 'Payoff timeline', contribution: 0.79, note: 'At $267/month, balance paid in full within 18-month promo period' },
      { label: 'Transfer fee', contribution: 0.65, note: '3% fee ($144) is offset by $1,200+ in interest savings' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Looking into balance transfer options now.' },
    dataSources: ['Credit Card Statements', 'Credit Bureau Summary', 'Balance Transfer Offer Database'],
    coreAssertion: 'Poseidon identified $1,200/year in potential savings by transferring $4,800 credit card balance to 0% APR',
    baseReality: [{ label: 'Balance', value: '$4,800' }, { label: 'Current APR', value: '22.9%' }, { label: 'Target APR', value: '0% (18 months)' }, { label: 'Annual savings', value: '$1,200' }],
  },
  'GV-2026-0307-044': {
    id: 'GV-2026-0307-044',
    engine: 'Protect',
    type: 'duplicate_charge',
    action: 'Duplicate charge detected',
    timestamp: '2026-03-07T16:44:00-04:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Two identical DoorDash charges of $67.43 posted within 4 minutes. This pattern is consistent with merchant processing errors rather than intentional fraud, but warrants dispute for refund.',
      confidence: 0.72,
    },
    topFactors: [
      { label: 'Duplicate amount', contribution: 0.94, note: 'Two identical $67.43 charges on the same card' },
      { label: 'Time proximity', contribution: 0.88, note: 'Charges posted 4 minutes apart — typical processing error window' },
      { label: 'Merchant pattern', contribution: 0.71, note: 'DoorDash has elevated duplicate charge rate in cohort data' },
      { label: 'Order verification', contribution: 0.58, note: 'Only one delivery order found matching this time window' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Only placed one order. Second charge is duplicate.' },
    dataSources: ['Transaction History (30 days)', 'Merchant Billing Patterns', 'Order Confirmation Records'],
    coreAssertion: 'Poseidon detected a duplicate $67.43 DoorDash charge and recommended dispute for refund',
    baseReality: [{ label: 'Merchant', value: 'DoorDash' }, { label: 'Amount', value: '$67.43 × 2' }, { label: 'Time gap', value: '4 minutes' }, { label: 'Assessment', value: 'Processing error — dispute recommended' }],
  },
  'GV-2026-0307-043': {
    id: 'GV-2026-0307-043',
    engine: 'Execute',
    type: 'auto_transfer',
    action: 'Emergency fund auto-transfer queued',
    timestamp: '2026-03-07T08:30:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Cash flow analysis detected sufficient surplus to begin $500/month automatic transfers toward your emergency fund goal. Current fund covers 2.1 months of expenses; target is 6 months.',
      confidence: 0.90,
    },
    topFactors: [
      { label: 'Cash surplus', contribution: 0.92, note: 'Monthly surplus of $1,200+ after all obligations' },
      { label: 'Emergency fund gap', contribution: 0.87, note: 'Current: $14,280 (2.1 months) vs. target: $40,800 (6 months)' },
      { label: 'Income stability', contribution: 0.83, note: 'Consistent income for 18+ months — low interruption risk' },
      { label: 'Transfer amount', contribution: 0.76, note: '$500/month preserves comfortable checking balance above $3,000' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Good amount. Setting up recurring transfer.' },
    dataSources: ['Checking Account Activity', 'Income Verification Records', 'Emergency Fund Calculator'],
    coreAssertion: 'Poseidon recommended $500/month auto-transfer to build emergency fund from 2.1 to 6 months coverage',
    baseReality: [{ label: 'Transfer', value: '$500/month' }, { label: 'Current fund', value: '$14,280 (2.1 months)' }, { label: 'Target', value: '$40,800 (6 months)' }, { label: 'Timeline', value: '~53 months to goal' }],
  },
  'GV-2026-0306-042': {
    id: 'GV-2026-0306-042',
    engine: 'Protect',
    type: 'unusual_withdrawal',
    action: 'Unusual ATM withdrawal flagged',
    timestamp: '2026-03-06T23:49:00-04:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: '$800 ATM withdrawal at an unfamiliar location at 11:47 PM. The combination of high amount, late timing, and new ATM location triggered risk scoring above the alert threshold.',
      confidence: 0.91,
    },
    topFactors: [
      { label: 'Location anomaly', contribution: 0.93, note: 'ATM not in your usual network — 12 miles from home/work' },
      { label: 'Amount deviation', contribution: 0.89, note: '$800 withdrawal is 3.2× your average ATM transaction' },
      { label: 'Time of day', contribution: 0.85, note: '11:47 PM — outside your normal banking hours' },
      { label: 'Withdrawal frequency', contribution: 0.68, note: 'Second ATM withdrawal this week — above your monthly pattern' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'This was me — visiting a friend in another neighborhood.' },
    dataSources: ['ATM Transaction Network', 'Location Pattern Analysis', 'Card Usage History'],
    coreAssertion: 'Poseidon flagged an $800 late-night ATM withdrawal at an unfamiliar location',
    baseReality: [{ label: 'Amount', value: '$800' }, { label: 'Time', value: '11:47 PM' }, { label: 'Location', value: 'Unfamiliar ATM — 12 mi from home' }, { label: 'Outcome', value: 'User confirmed legitimate' }],
  },
  'POS-DIS-001': {
    id: 'POS-DIS-001',
    engine: 'Protect',
    type: 'dispute_filed',
    action: 'Dispute filed for suspicious charge',
    timestamp: '2026-03-09T10:45:00-04:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: `Dispute filed for $${DEMO_THREAD.criticalAlert.amount} charge from ${DEMO_THREAD.criticalAlert.counterparty}. Evidence compiled from transaction anomaly detection, merchant pattern analysis, and timing verification. Case submitted to card issuer under Reg E protections. Provisional credit of $${DEMO_THREAD.criticalAlert.amount} expected within 2 business days.`,
      confidence: DEMO_THREAD.criticalAlert.confidence,
    },
    topFactors: sharedFraudFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Confirmed unrecognized charge. Dispute initiated successfully.' },
    dataSources: ['Transaction History (90 days)', 'Merchant Recognition Database', 'Card Network Fraud Patterns', 'Reg E Compliance Engine'],
    coreAssertion: `Poseidon filed dispute case POS-DIS-001 for $${DEMO_THREAD.criticalAlert.amount} suspicious charge and compiled evidence package`,
    baseReality: [{ label: 'Case ID', value: 'POS-DIS-001' }, { label: 'Amount', value: `$${DEMO_THREAD.criticalAlert.amount}` }, { label: 'Merchant', value: DEMO_THREAD.criticalAlert.counterparty }, { label: 'Status', value: 'Filed — bank review pending' }],
  },
  'GV-2026-0305-041': {
    id: 'GV-2026-0305-041',
    engine: 'Govern',
    type: 'optimization_analysis',
    action: 'Streaming subscription optimization completed',
    timestamp: '2026-03-05T11:10:00-04:00',
    model: { name: 'GovernanceTracer', version: '3.1.0', accuracy: 98.9 },
    explanation: {
      summary: 'Comprehensive analysis of your 3 streaming subscriptions ($52.97/month total) identified potential savings of $17/month by cancelling the least-used service. All AI recommendations passed audit verification.',
      confidence: 0.91,
    },
    topFactors: [
      { label: 'Usage analysis', contribution: 0.93, note: 'Hulu used 2 hours/month vs. Netflix 28 hours/month and Disney+ 12 hours/month' },
      { label: 'Cost-per-hour value', contribution: 0.87, note: 'Hulu: $9.00/hr vs. Netflix: $0.54/hr — 17× cost difference per hour watched' },
      { label: 'Audit verification', contribution: 0.82, note: 'All 3 recommendation models agreed on Hulu as lowest-value subscription' },
      { label: 'Cancellation ease', contribution: 0.74, note: 'Online cancellation available — no call required, reversible anytime' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Fair analysis. Will consider cancelling Hulu.' },
    dataSources: ['Subscription Billing Records', 'App Usage Tracking', 'Streaming Market Rate Comparison'],
    coreAssertion: 'Poseidon completed audit-verified analysis identifying $17/month savings from streaming optimization',
    baseReality: [{ label: 'Total subscriptions', value: '3 services ($52.97/mo)' }, { label: 'Lowest value', value: 'Hulu ($17.99/mo, 2 hrs/mo)' }, { label: 'Savings', value: '$17/month ($204/year)' }, { label: 'Audit status', value: 'All models verified' }],
  },
}
