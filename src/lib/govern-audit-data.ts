/**
 * Govern Audit Detail — data constants and types.
 *
 * Extracted from GovernAuditDetail.tsx to keep the page component focused on UI.
 * Phase 5: Shinji Fujiwara persona rewrite — Oslo scenario, new audit IDs.
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

export const DEFAULT_DECISION_ID = 'GV-2026-0310-001'

export const ROUTE_TO_DECISION: Record<string, string> = {
  '/dashboard':          'GV-2026-0310-002',
  '/protect':            'GV-2026-0310-001',
  '/protect/threats':    'GV-2026-0310-001',
  '/protect/alert-detail': 'GV-2026-0310-002',
  '/grow':               'GV-2026-0310-003',
  '/grow/recommendations': 'GV-2026-0310-003',
  '/grow/recommendation': 'GV-2026-0309-004',
  '/execute':            'GV-2026-0307-006',
  '/execute/queue':      'GV-2026-0307-006',
  '/execute/approval':   'GV-2026-0307-006',
  '/govern':             'GV-2026-0310-001',
}

const sharedOsloFactors = [
  { label: 'Geographic anomaly', contribution: 0.96, note: 'Login from Oslo, Norway — 5,800 km from your last known location (San Francisco)' },
  { label: 'Amount deviation', contribution: 0.92, note: '$234.50 charge at Oslo Electronics — unfamiliar merchant, first transaction in this country' },
  { label: 'Timing pattern', contribution: 0.88, note: 'Transaction posted 5 minutes after anomalous login — consistent with compromised credential use' },
  { label: 'Velocity pattern', contribution: 0.72, note: 'No travel history or VPN pattern matching Norway in last 12 months' },
]

export const AUDIT_DECISIONS: Record<string, AuditDecision> = {
  'GV-2026-0310-001': {
    id: 'GV-2026-0310-001',
    engine: 'Protect',
    type: 'unusual_login',
    action: 'Unusual login flagged — Oslo, Norway',
    timestamp: '2026-03-10T03:42:00-07:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Login attempt detected from Oslo, Norway at 3:42 AM PST. IP geolocation places the session 5,800 km from your last authenticated location (San Francisco). No travel reservations or VPN patterns match this region.',
      confidence: 0.94,
    },
    topFactors: [
      { label: 'Geographic anomaly', contribution: 0.96, note: 'Oslo, Norway IP — 5,800 km from last known location' },
      { label: 'Time-of-day anomaly', contribution: 0.89, note: '3:42 AM PST — outside your normal activity window (7 AM – 11 PM)' },
      { label: 'No travel context', contribution: 0.85, note: 'No flight bookings, hotel reservations, or calendar events in Norway' },
      { label: 'Device fingerprint', contribution: 0.78, note: 'Unrecognized browser/OS combination — not in your device registry' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Not my login. I was asleep in San Francisco.' },
    dataSources: ['IP Geolocation Service', 'Device Fingerprint Registry', 'Travel Context Engine', 'Login History (90 days)'],
    coreAssertion: 'Poseidon flagged an unauthorized login from Oslo, Norway based on geographic and temporal anomalies',
    baseReality: [{ label: 'Location', value: 'Oslo, Norway' }, { label: 'Distance', value: '5,800 km from home' }, { label: 'Time', value: '3:42 AM PST' }, { label: 'Assessment', value: 'Unauthorized — credential compromise likely' }],
  },
  'GV-2026-0310-002': {
    id: 'GV-2026-0310-002',
    engine: 'Protect',
    type: 'fraud_flag',
    action: 'Suspicious transaction flagged — Oslo Electronics $234.50',
    timestamp: '2026-03-10T03:47:00-07:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: `Charge of $${DEMO_THREAD.criticalAlert.amount} from ${DEMO_THREAD.criticalAlert.counterparty} was flagged after concurrent anomalies — geographic mismatch (Oslo, Norway), unfamiliar merchant, and timing correlation with suspicious login 5 minutes prior. Combined risk exceeded auto-flag threshold.`,
      confidence: DEMO_THREAD.criticalAlert.confidence,
    },
    topFactors: sharedOsloFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Confirmed unrecognized charge. Dispute initiated.' },
    dataSources: ['Transaction History (90 days)', 'Merchant Recognition Database', 'Card Network Fraud Patterns', 'Login Anomaly Correlation'],
    coreAssertion: `Poseidon flagged a $${DEMO_THREAD.criticalAlert.amount} charge from ${DEMO_THREAD.criticalAlert.counterparty} as suspicious`,
    baseReality: [{ label: 'Amount', value: `$${DEMO_THREAD.criticalAlert.amount}` }, { label: 'Merchant', value: DEMO_THREAD.criticalAlert.counterparty }, { label: 'Risk level', value: 'Critical' }, { label: 'Card', value: `ending ${DEMO_THREAD.criticalAlert.cardLast4 ?? '4821'}` }],
  },
  'GV-2026-0310-003': {
    id: 'GV-2026-0310-003',
    engine: 'Grow',
    type: 'savings_opportunity',
    action: 'High-yield savings opportunity — $269/yr',
    timestamp: '2026-03-10T09:15:00-07:00',
    model: { name: 'FinancialStrategyAI', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Your Chase savings account earns 0.01% APY while high-yield alternatives offer 4.50% APY. Moving $8,200 would generate ~$269/year in additional interest with FDIC-insured accounts.',
      confidence: 0.92,
    },
    topFactors: [
      { label: 'Interest rate gap', contribution: 0.94, note: '4.49% APY difference between current (0.01%) and best available (4.50%)' },
      { label: 'Balance opportunity cost', contribution: 0.89, note: '$8,200 sitting idle — losing ~$22/month in potential interest' },
      { label: 'FDIC coverage', contribution: 0.82, note: 'Recommended accounts are FDIC-insured up to $250,000' },
      { label: 'Liquidity preservation', contribution: 0.75, note: 'No lock-up period — funds remain accessible for emergencies' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Good recommendation. Will open a high-yield account.' },
    dataSources: ['Bank Account Balances', 'FDIC Rate Database', 'Personal Cash Flow Analysis'],
    coreAssertion: 'Poseidon identified $269/year in lost interest by comparing your savings rate to market alternatives',
    baseReality: [{ label: 'Current APY', value: '0.01%' }, { label: 'Available APY', value: '4.50%' }, { label: 'Balance', value: '$8,200' }, { label: 'Annual gain', value: '$269/year' }],
  },
  'GV-2026-0309-004': {
    id: 'GV-2026-0309-004',
    engine: 'Grow',
    type: 'portfolio_rebalancing',
    action: 'Portfolio rebalancing recommendation generated',
    timestamp: '2026-03-09T16:30:00-07:00',
    model: { name: 'FinancialStrategyAI', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Your Fidelity 401(k) ($45,230) and Roth IRA ($18,541) show sector concentration in US large-cap tech (42% vs. target 30%). Rebalancing toward international and small-cap exposure would reduce volatility by ~8% with minimal impact on expected returns.',
      confidence: 0.85,
    },
    topFactors: [
      { label: 'Sector concentration', contribution: 0.91, note: '42% in US large-cap tech vs. 30% target — 12% overweight' },
      { label: 'Volatility reduction', contribution: 0.84, note: 'Rebalancing reduces portfolio standard deviation from 16.2% to 14.9%' },
      { label: 'Tax-efficient rebalancing', contribution: 0.78, note: 'Roth IRA rebalancing has zero tax impact — no capital gains event' },
      { label: 'Return preservation', contribution: 0.72, note: 'Expected 10-year return changes < 0.3% while risk decreases significantly' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Makes sense to diversify. Will review the rebalancing plan.' },
    dataSources: ['Fidelity Account Holdings', 'Modern Portfolio Theory Engine', 'Sector Exposure Analysis', 'Tax Impact Calculator'],
    coreAssertion: 'Poseidon identified portfolio over-concentration in US large-cap tech and recommended diversification',
    baseReality: [{ label: 'Current tech %', value: '42%' }, { label: 'Target tech %', value: '30%' }, { label: 'Accounts', value: '401(k) + Roth IRA' }, { label: 'Volatility reduction', value: '~8%' }],
  },
  'GV-2026-0308-005': {
    id: 'GV-2026-0308-005',
    engine: 'Protect',
    type: 'security_event',
    action: 'Fidelity password change detected',
    timestamp: '2026-03-08T09:00:00-07:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Password change detected on your Fidelity brokerage account. The change was initiated from your registered device and IP address during normal hours. Classified as routine security maintenance — no anomalies detected.',
      confidence: 0.40,
    },
    topFactors: [
      { label: 'Known device', contribution: 0.92, note: 'Password change from your registered MacBook Pro — device ID matches' },
      { label: 'Normal timing', contribution: 0.85, note: 'Changed at 9:00 AM PST — within your normal activity window' },
      { label: 'Home IP', contribution: 0.80, note: 'Initiated from your home network IP — consistent with prior logins' },
      { label: 'Low risk score', contribution: 0.35, note: 'All factors indicate legitimate user-initiated change' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Yes, I changed it as part of my regular password rotation.' },
    dataSources: ['Fidelity Account Activity', 'Device Registry', 'IP Geolocation Service'],
    coreAssertion: 'Poseidon logged a Fidelity password change and verified it as user-initiated with no anomalies',
    baseReality: [{ label: 'Account', value: 'Fidelity Brokerage' }, { label: 'Action', value: 'Password change' }, { label: 'Device', value: 'Registered MacBook Pro' }, { label: 'Assessment', value: 'Routine — dismissed' }],
  },
  'GV-2026-0307-006': {
    id: 'GV-2026-0307-006',
    engine: 'Execute',
    type: 'auto_execution',
    action: 'Dividend reinvestment auto-executed',
    timestamp: '2026-03-07T11:20:00-07:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Quarterly dividends of $847.32 from Fidelity brokerage automatically reinvested per your standing DRIP instruction. Shares purchased at market open pricing across 3 holdings.',
      confidence: 0.91,
    },
    topFactors: [
      { label: 'DRIP instruction', contribution: 0.95, note: 'Standing dividend reinvestment plan — auto-execution pre-approved' },
      { label: 'Dividend amount', contribution: 0.88, note: '$847.32 across 3 holdings — within expected quarterly range' },
      { label: 'Execution timing', contribution: 0.82, note: 'Reinvested at market open — standard DRIP execution window' },
      { label: 'Compliance verification', contribution: 0.78, note: 'All reinvestments comply with Fidelity DRIP rules and IRS reporting' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Expected quarterly reinvestment. Looks correct.' },
    dataSources: ['Fidelity DRIP Records', 'Dividend Schedule Database', 'Market Pricing Data'],
    coreAssertion: 'Poseidon auto-executed $847.32 dividend reinvestment per standing DRIP instruction',
    baseReality: [{ label: 'Amount', value: '$847.32' }, { label: 'Account', value: 'Fidelity Brokerage' }, { label: 'Holdings', value: '3 positions' }, { label: 'Status', value: 'Completed — shares purchased' }],
  },
  'POS-DIS-001': {
    id: 'POS-DIS-001',
    engine: 'Protect',
    type: 'dispute_filed',
    action: 'Dispute filed for suspicious Oslo Electronics charge',
    timestamp: '2026-03-10T04:00:00-07:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: `Dispute filed for $${DEMO_THREAD.criticalAlert.amount} charge from ${DEMO_THREAD.criticalAlert.counterparty}. Evidence compiled from geographic anomaly detection (Oslo login correlation), merchant pattern analysis, and timing verification. Case submitted to card issuer under Reg E protections. Provisional credit of $${DEMO_THREAD.criticalAlert.amount} expected within 2 business days.`,
      confidence: DEMO_THREAD.criticalAlert.confidence,
    },
    topFactors: sharedOsloFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Confirmed unrecognized charge. Dispute initiated successfully.' },
    dataSources: ['Transaction History (90 days)', 'Merchant Recognition Database', 'Card Network Fraud Patterns', 'Reg E Compliance Engine', 'Login Anomaly Correlation'],
    coreAssertion: `Poseidon filed dispute case POS-DIS-001 for $${DEMO_THREAD.criticalAlert.amount} suspicious charge and compiled evidence package`,
    baseReality: [{ label: 'Case ID', value: 'POS-DIS-001' }, { label: 'Amount', value: `$${DEMO_THREAD.criticalAlert.amount}` }, { label: 'Merchant', value: DEMO_THREAD.criticalAlert.counterparty }, { label: 'Status', value: 'Filed — bank review pending' }],
  },
  'GV-2026-0309-007': {
    id: 'GV-2026-0309-007',
    engine: 'Protect',
    type: 'unrecognized_charge',
    action: 'Unrecognized recurring charge flagged — DIGISRV*PREMIUM',
    timestamp: '2026-03-09T08:30:00-07:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Three consecutive monthly charges of $9.99 from DIGISRV*PREMIUM detected on Chase Sapphire Reserve since December 2025. No matching service agreement, email receipt, or account found. Cohort data shows 78% of similar charges were confirmed unwanted by other users.',
      confidence: 0.72,
    },
    topFactors: [
      { label: 'Unknown merchant', contribution: 0.82, note: 'DIGISRV*PREMIUM has never appeared in your transaction history before December 2025' },
      { label: 'No service match', contribution: 0.70, note: 'No email receipts, welcome messages, or account credentials found matching this merchant' },
      { label: 'Cohort confirmation', contribution: 0.65, note: '78% of Poseidon users with this charge confirmed it was unwanted' },
      { label: 'Recurring pattern', contribution: 0.75, note: '3 identical $9.99 charges on the 5th of each month' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'I don\'t recognize this service. Please dispute.' },
    dataSources: ['Transaction History (6 months)', 'Merchant Recognition Database', 'Email Receipt Scanner', 'Cohort Charge Analysis'],
    coreAssertion: 'Poseidon flagged 3 months of unrecognized DIGISRV*PREMIUM charges totaling $29.97',
    baseReality: [{ label: 'Merchant', value: 'DIGISRV*PREMIUM' }, { label: 'Amount', value: '$9.99/mo × 3' }, { label: 'Card', value: 'Chase Sapphire ••••9156' }, { label: 'Status', value: 'Pending dispute' }],
  },
  'GV-2026-0301-010': {
    id: 'GV-2026-0301-010',
    engine: 'Protect',
    type: 'card_testing',
    action: 'Micro-transaction testing pattern flagged — 4 merchants',
    timestamp: '2026-03-01T15:42:00-07:00',
    model: { name: 'FraudDetectionV3', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Four small charges totaling $4.36 appeared on Amex Gold in rapid succession across unknown merchants. The velocity (4 transactions in 12 minutes vs your average of 2.1/day) and pattern (small amounts across diverse merchants) match known BIN attack card-testing behavior targeting Amex cards in Q1 2026.',
      confidence: 0.82,
    },
    topFactors: [
      { label: 'Testing pattern match', contribution: 0.88, note: '4 small charges ($0.50-$1.50) across different merchants in 12 minutes' },
      { label: 'Velocity anomaly', contribution: 0.85, note: '28× velocity spike — 4 transactions in 12 minutes vs 2.1/day average' },
      { label: 'Merchant diversity', contribution: 0.78, note: 'All 4 merchants are first-time — never in your transaction history' },
      { label: 'BIN attack correlation', contribution: 0.82, note: 'Matches known BIN attack pattern targeting Amex cards this quarter' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'These are not my transactions. Request card replacement.' },
    dataSources: ['Transaction History (90 days)', 'Velocity Analysis Engine', 'BIN Attack Pattern Database', 'Merchant Recognition Database'],
    coreAssertion: 'Poseidon flagged 4 micro-transactions totaling $4.36 as likely card-testing fraud',
    baseReality: [{ label: 'Transactions', value: '4 charges' }, { label: 'Total', value: '$4.36' }, { label: 'Window', value: '12 minutes' }, { label: 'Card', value: 'Amex Gold ••••4821' }],
  },
  'GV-2026-0309-012': {
    id: 'GV-2026-0309-012',
    engine: 'Grow',
    type: 'optimization_opportunity',
    action: '401(k) employer match optimization — $1,500/yr opportunity',
    timestamp: '2026-03-09T09:00:00-07:00',
    model: { name: 'FinancialStrategyAI', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Your 401(k) contribution of 4% ($500/mo) captures the base employer match, but your employer also matches 50% on the next 4%. Increasing to 8% would unlock $125/mo ($1,500/yr) in additional employer contributions — an immediate 25% guaranteed return on additional contributions.',
      confidence: 0.95,
    },
    topFactors: [
      { label: 'Employer match gap', contribution: 0.96, note: 'Contributing 4% but employer matches up to 8% — $125/mo uncaptured' },
      { label: 'Cash flow capacity', contribution: 0.90, note: '$1,200/mo surplus supports additional $375/mo take-home reduction' },
      { label: 'Tax benefit', contribution: 0.88, note: 'Additional pre-tax contribution reduces federal liability by ~$1,800/yr' },
    ],
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Good catch. Will increase contribution.' },
    dataSources: ['Payroll Deduction Records', 'Employer Benefit Plan Documentation', 'Monthly Cash Flow Analysis'],
    coreAssertion: 'Poseidon identified $1,500/yr in uncaptured employer 401(k) match by analyzing payroll and benefit data',
    baseReality: [{ label: 'Current rate', value: '4%' }, { label: 'Optimal rate', value: '8%' }, { label: 'Annual gain', value: '$1,500/yr employer match' }, { label: 'Tax savings', value: '~$1,800/yr' }],
  },
}
