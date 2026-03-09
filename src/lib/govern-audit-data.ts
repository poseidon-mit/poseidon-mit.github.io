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
      summary: 'Your savings account is earning 0.01% APY while high-yield alternatives offer 4.50% APY. Moving $23,000 would generate ~$840/year in additional interest with FDIC-insured accounts.',
      confidence: 0.93,
    },
    topFactors: [
      { label: 'Interest rate gap', contribution: 0.94, note: '4.49% APY difference between current (0.01%) and best available (4.50%)' },
      { label: 'Balance opportunity cost', contribution: 0.89, note: '$23,000 sitting idle — losing ~$70/month in potential interest' },
      { label: 'FDIC coverage', contribution: 0.82, note: 'Recommended accounts are FDIC-insured up to $250,000' },
      { label: 'Liquidity preservation', contribution: 0.75, note: 'No lock-up period — funds remain accessible for emergencies' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Good recommendation. Will transfer savings this week.' },
    dataSources: ['Bank Account Balances', 'FDIC Rate Database', 'Personal Cash Flow Analysis'],
    coreAssertion: 'Poseidon identified $840/year in lost interest by comparing your savings rate to market alternatives',
    baseReality: [{ label: 'Current APY', value: '0.01%' }, { label: 'Available APY', value: '4.50%' }, { label: 'Balance', value: '$23,000' }, { label: 'Annual gain', value: '$840/year' }],
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
      { label: 'Interest rate savings', contribution: 0.93, note: '22.9% APR → 0% for 21 months on $4,800 balance' },
      { label: 'Credit score eligibility', contribution: 0.86, note: 'Your credit profile qualifies for multiple 0% APR offers' },
      { label: 'Payoff timeline', contribution: 0.79, note: 'At $229/month, balance paid in full within 21-month promo period' },
      { label: 'Transfer fee', contribution: 0.65, note: '3% fee ($144) is offset by $1,200+ in interest savings' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Looking into balance transfer options now.' },
    dataSources: ['Credit Card Statements', 'Credit Bureau Summary', 'Balance Transfer Offer Database'],
    coreAssertion: 'Poseidon identified $1,200/year in potential savings by transferring $4,800 credit card balance to 0% APR',
    baseReality: [{ label: 'Balance', value: '$4,800' }, { label: 'Current APR', value: '22.9%' }, { label: 'Target APR', value: '0% (21 months)' }, { label: 'Annual savings', value: '$1,200' }],
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
      { label: 'Amount deviation', contribution: 0.89, note: '$800 withdrawal is 2.7× your average ATM transaction' },
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
  'GV-2026-0305-040': {
    id: 'GV-2026-0305-040',
    engine: 'Protect',
    type: 'velocity_anomaly',
    action: 'Geographic velocity anomaly assessed',
    timestamp: '2026-03-05T11:10:00-04:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: '$45.00 charge at an unfamiliar Shell gas station in Boston, followed by an online purchase in a different state 18 minutes later. Geographic velocity pattern flagged for review, though card-present EMV chip authentication reduces fraud likelihood.',
      confidence: 0.65,
    },
    topFactors: [
      { label: 'Geographic velocity', contribution: 0.75, note: 'Gas station in Boston, then online purchase from Texas-based retailer 18 min later' },
      { label: 'Unfamiliar location', contribution: 0.60, note: 'First transaction at this Shell station — not in your regular gas station list' },
      { label: 'Round amount', contribution: 0.45, note: 'Exact $45.00 is unusual for gas purchases — your average is $38.72' },
      { label: 'EMV authentication', contribution: 0.70, note: 'Card-present chip authentication significantly reduces fraud probability' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Legitimate transaction — was driving through Boston.' },
    dataSources: ['Card Transaction Network', 'Geographic Velocity Analysis', 'Gas Station Skimming Reports'],
    coreAssertion: 'Poseidon flagged a geographic velocity anomaly at an unfamiliar Shell gas station',
    baseReality: [{ label: 'Amount', value: '$45.00' }, { label: 'Location', value: 'Shell Station, Boston' }, { label: 'Time gap', value: '18 minutes to next transaction' }, { label: 'Outcome', value: 'User confirmed legitimate' }],
  },
  'GV-2026-0304-039': {
    id: 'GV-2026-0304-039',
    engine: 'Grow',
    type: 'refinance_opportunity',
    action: 'Auto loan refinance opportunity identified',
    timestamp: '2026-03-04T14:20:00-04:00',
    model: { name: 'FinancialStrategyAI', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Your auto loan at 6.9% APR on $18,200 remaining balance is 2.7% above current market rates for your credit profile. Refinancing to 4.2% APR would save $47/month ($564/year) over the remaining 44-month term.',
      confidence: 0.84,
    },
    topFactors: [
      { label: 'Rate differential', contribution: 0.92, note: '6.9% current vs. 4.2% available — 2.7% savings opportunity' },
      { label: 'Remaining term', contribution: 0.85, note: '44 months remaining — enough to justify refinance costs' },
      { label: 'Credit eligibility', contribution: 0.80, note: '20+ months of on-time payments qualify for competitive rates' },
      { label: 'Monthly impact', contribution: 0.76, note: '$412/mo → $365/mo — $47/month reduction in payment' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Will look into Capital One refinance option.' },
    dataSources: ['Auto Loan Payment History', 'Market Rate Comparison (8 lenders)', 'Credit Profile Analysis'],
    coreAssertion: 'Poseidon identified $564/year in savings by refinancing auto loan from 6.9% to 4.2% APR',
    baseReality: [{ label: 'Current APR', value: '6.9%' }, { label: 'Available APR', value: '4.2%' }, { label: 'Balance', value: '$18,200' }, { label: 'Monthly savings', value: '$47/month' }],
  },
  'GV-2026-0305-041': {
    id: 'GV-2026-0305-041',
    engine: 'Govern',
    type: 'optimization_analysis',
    action: 'Streaming subscription optimization completed',
    timestamp: '2026-03-05T11:10:00-04:00',
    model: { name: 'GovernanceTracer', version: '3.1.0', accuracy: 98.9 },
    explanation: {
      summary: 'Comprehensive analysis of your 3 streaming subscriptions ($47.47/month total) identified potential savings of $17/month by cancelling the least-used service. All AI recommendations passed audit verification.',
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
    baseReality: [{ label: 'Total subscriptions', value: '3 services ($47.47/mo)' }, { label: 'Lowest value', value: 'Hulu ($17.99/mo, 2 hrs/mo)' }, { label: 'Savings', value: '$17/month ($204/year)' }, { label: 'Audit status', value: 'All models verified' }],
  },
  'GV-2026-0309-049': {
    id: 'GV-2026-0309-049',
    engine: 'Protect',
    type: 'bill_increase',
    action: 'Internet bill increase detected',
    timestamp: '2026-03-09T07:17:00-04:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Comcast Xfinity bill increased from $89/month to $99/month — an 11.2% increase without detected notification. This matches a systematic rate adjustment affecting 34% of Comcast subscribers this quarter.',
      confidence: 0.82,
    },
    topFactors: [
      { label: 'Bill increase', contribution: 0.88, note: '$89 → $99/month (11.2% increase) without plan change' },
      { label: 'No notification', contribution: 0.82, note: 'No price change notification found in email or account alerts' },
      { label: 'Cohort pattern', contribution: 0.75, note: '34% of Comcast subscribers affected by Q1 rate adjustment' },
      { label: 'Market comparison', contribution: 0.70, note: 'Comparable plans available for $49-$69/mo from competitors' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Did not notice the increase. Will call to negotiate.' },
    dataSources: ['Internet Bill Detection (18 months)', 'ISP Rate Change Monitoring', 'Competitor Pricing Analysis'],
    coreAssertion: 'Poseidon detected an $10/month Comcast bill increase without user notification',
    baseReality: [{ label: 'Service', value: 'Comcast Xfinity 200 Mbps' }, { label: 'Previous', value: '$89/mo' }, { label: 'Current', value: '$99/mo' }, { label: 'Impact', value: '$120/year increase' }],
  },
  'GV-2026-0309-050': {
    id: 'GV-2026-0309-050',
    engine: 'Protect',
    type: 'unknown_charge',
    action: 'Unrecognized subscription charge flagged',
    timestamp: '2026-03-09T06:32:00-04:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: '$14.99/month recurring charge from APP*CLOUDSVCS has appeared for 3 consecutive months with no identifiable service, app usage, or email receipt matching this billing descriptor.',
      confidence: 0.76,
    },
    topFactors: [
      { label: 'No service match', contribution: 0.88, note: 'No app, email receipt, or subscription record matches APP*CLOUDSVCS' },
      { label: 'Descriptor obscurity', contribution: 0.76, note: 'Generic billing aggregator name — cannot identify actual service' },
      { label: 'Trial conversion pattern', contribution: 0.72, note: 'First charge 3 months ago — consistent with free trial conversion' },
      { label: 'Recurring pattern', contribution: 0.65, note: 'Same $14.99 for 3 consecutive months — legitimate subscription or forgotten trial' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'I do not recognize this charge. Please cancel.' },
    dataSources: ['Recurring Charge Detection', 'Email Receipt Cross-Reference', 'App Store Purchase History', 'Billing Descriptor Database'],
    coreAssertion: 'Poseidon flagged an unrecognized $14.99/month subscription charge from APP*CLOUDSVCS',
    baseReality: [{ label: 'Merchant', value: 'APP*CLOUDSVCS' }, { label: 'Amount', value: '$14.99/mo' }, { label: 'Duration', value: '3 months ($44.97 total)' }, { label: 'Assessment', value: 'Unrecognized — cancellation recommended' }],
  },
  'GV-2026-0309-051': {
    id: 'GV-2026-0309-051',
    engine: 'Grow',
    type: 'subscription_review',
    action: 'Unknown subscription cancellation recommended',
    timestamp: '2026-03-09T06:35:00-04:00',
    model: { name: 'FinancialStrategyAI', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Recurring $14.99/month charge from APP*CLOUDSVCS identified with no matching service. Cancellation would save $180/year. Refund inquiry for 3 months of unrecognized charges ($44.97) recommended.',
      confidence: 0.88,
    },
    topFactors: [
      { label: 'Charge identification failure', contribution: 0.90, note: 'Cross-referencing email, app store, and subscription databases found no match' },
      { label: 'Annual savings', contribution: 0.85, note: '$180/year saved by cancelling unrecognized subscription' },
      { label: 'Refund opportunity', contribution: 0.78, note: '3 months of charges ($44.97) eligible for refund inquiry' },
      { label: 'Charge prevention', contribution: 0.72, note: 'Stopping APP*CLOUDSVCS prevents future charges immediately' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Good recommendation. Cancel this subscription.' },
    dataSources: ['Subscription Detection Engine', 'Email Receipt Analysis', 'Billing Descriptor Database', 'Refund Eligibility Calculator'],
    coreAssertion: 'Poseidon recommended cancelling unrecognized APP*CLOUDSVCS subscription to save $180/year',
    baseReality: [{ label: 'Charge', value: 'APP*CLOUDSVCS $14.99/mo' }, { label: 'Duration', value: '3 months' }, { label: 'Annual savings', value: '$180' }, { label: 'Refund', value: '$44.97 inquiry filed' }],
  },
  'GV-2026-0308-044B': {
    id: 'GV-2026-0308-044B',
    engine: 'Grow',
    type: 'retirement_optimization',
    action: '401(k) employer match optimization identified',
    timestamp: '2026-03-08T10:00:00-04:00',
    model: { name: 'FinancialStrategyAI', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'You\'re contributing 4% to your 401(k) but your employer matches up to 6%. Increasing your contribution by 2% captures an additional $2,900/year in employer match — effectively a 100% return on the extra contribution.',
      confidence: 0.95,
    },
    topFactors: [
      { label: 'Uncaptured match', contribution: 0.96, note: '2% uncaptured employer match = $2,900/year in free money' },
      { label: 'Guaranteed return', contribution: 0.93, note: '100% return on additional contribution — no investment required' },
      { label: 'Tax advantage', contribution: 0.88, note: 'Pre-tax contribution reduces taxable income — net cost ~$180/mo not $242/mo' },
      { label: 'Cash flow feasibility', contribution: 0.82, note: 'Monthly surplus supports additional $180/month after tax benefit' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'This is an obvious win. Will increase contribution.' },
    dataSources: ['Payroll Contribution Analysis', 'Employer Match Policy', 'Tax Impact Calculator', '401(k) Match Optimization Data'],
    coreAssertion: 'Poseidon identified $3,600/year in combined value by increasing 401(k) contribution to capture full employer match',
    baseReality: [{ label: 'Current contribution', value: '4% ($483/mo)' }, { label: 'Recommended', value: '6% ($725/mo)' }, { label: 'Employer match gained', value: '$2,900/year' }, { label: 'Net cost after tax savings', value: '~$180/month' }],
  },
  'GV-2026-0307-044B': {
    id: 'GV-2026-0307-044B',
    engine: 'Execute',
    type: 'dispute_queued',
    action: 'DoorDash duplicate charge dispute queued',
    timestamp: '2026-03-07T16:50:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Dispute package compiled for duplicate $67.43 DoorDash charge. Evidence includes transaction timestamps, order confirmation records, and merchant billing pattern analysis showing only one delivery order in this time window.',
      confidence: 0.72,
    },
    topFactors: [
      { label: 'Duplicate evidence strength', contribution: 0.94, note: 'Two identical $67.43 charges 4 minutes apart with single order confirmation' },
      { label: 'Historical resolution rate', contribution: 0.88, note: '97% of similar DoorDash duplicate disputes refunded within 5 days' },
      { label: 'Merchant pattern', contribution: 0.75, note: 'DoorDash has 2.3% duplicate charge rate — above platform average' },
      { label: 'Dispute window', contribution: 0.70, note: 'Within 60-day dispute window — full protection under Reg E' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Only placed one order. Dispute the duplicate.' },
    dataSources: ['Transaction History', 'Order Confirmation Records', 'Merchant Billing Patterns', 'Dispute Resolution Database'],
    coreAssertion: 'Poseidon queued dispute for duplicate $67.43 DoorDash charge with evidence package',
    baseReality: [{ label: 'Merchant', value: 'DoorDash' }, { label: 'Duplicate amount', value: '$67.43' }, { label: 'Time gap', value: '4 minutes between charges' }, { label: 'Status', value: 'Awaiting user approval' }],
  },
  'GV-2026-0309-052': {
    id: 'GV-2026-0309-052',
    engine: 'Execute',
    type: 'cancellation_queued',
    action: 'Unrecognized subscription cancellation queued',
    timestamp: '2026-03-09T06:40:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Cancellation package prepared for unrecognized $14.99/month APP*CLOUDSVCS subscription. Includes charge prevention request and partial refund inquiry for 3 months of charges ($44.97).',
      confidence: 0.76,
    },
    topFactors: [
      { label: 'Service identification failure', contribution: 0.90, note: 'No matching service found across email, app stores, and subscription databases' },
      { label: 'Savings potential', contribution: 0.85, note: '$180/year saved by cancelling unrecognized subscription' },
      { label: 'Charge prevention', contribution: 0.78, note: 'Stopping future charges from this billing descriptor' },
      { label: 'Refund eligibility', contribution: 0.72, note: '3 months of unrecognized charges ($44.97) eligible for refund inquiry' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Cancel and stop charges. Request refund for prior charges.' },
    dataSources: ['Subscription Identification Engine', 'Charge Prevention System', 'Refund Inquiry Process', 'Billing Descriptor Database'],
    coreAssertion: 'Poseidon queued cancellation of unrecognized APP*CLOUDSVCS subscription with refund inquiry',
    baseReality: [{ label: 'Merchant', value: 'APP*CLOUDSVCS' }, { label: 'Amount', value: '$14.99/mo' }, { label: 'Action', value: 'Cancel + stop charges + refund inquiry' }, { label: 'Status', value: 'Awaiting user approval' }],
  },
}
