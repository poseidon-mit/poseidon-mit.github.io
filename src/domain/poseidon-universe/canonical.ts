/**
 * Canonical Universe — Banking POC Demo Data
 *
 * Single source of truth for all screen data.
 * Consumer-era imports (grow-simulation-data, recommendation-detail-data)
 * are replaced with inline B2B data. Those files are untouched until
 * their consuming phases rewrite them (Phase 6).
 */
import { DEMO_THREAD } from '@/lib/demo-thread'
import type {
  CanonicalEvent,
  CanonicalUniverseV1,
  DashboardActivityEntity,
  DeliberationTrace,
  ExecuteActionEntity,
  GovernAuditEntryEntity,
  GrowthSimulationPoint,
  ProtectThreatEntity,
  RecommendationDetail,
  RecommendationEntity,
  RecommendationListItem,
  ThreatFactor,
  ThreatTiming,
} from './types'
import type { ExecutionType } from './types'

const VERIFIED_DECISIONS = 10192
const PENDING_REVIEW_DECISIONS = 55
const FLAGGED_DECISIONS = 3

// ─── Dashboard Activities (B2B) ─────────────────────────────────────────────

const DASHBOARD_ACTIVITIES: DashboardActivityEntity[] = [
  {
    id: 'ACT-001',
    kind: 'protect',
    label: `AML flag: $2.5M wire to ${DEMO_THREAD.criticalAlert.counterparty}`,
    relativeTime: '2m ago',
  },
  {
    id: 'ACT-002',
    kind: 'grow',
    label: 'Securities-backed lending alternative proposed — $315K projected advantage',
    relativeTime: '15m ago',
  },
  {
    id: 'ACT-003',
    kind: 'execute',
    label: 'Margin account setup queued for authorization',
    relativeTime: '1h ago',
  },
  {
    id: 'ACT-004',
    kind: 'govern',
    label: `Compliance check passed (${DEMO_THREAD.complianceScore}/100)`,
    relativeTime: '2h ago',
  },
  {
    id: 'ACT-005',
    kind: 'system',
    label: `Monthly portfolio optimization ${formatUsd(DEMO_THREAD.monthlyOptimization)} confirmed`,
    relativeTime: '3h ago',
  },
]

// ─── Protect Evidence Data (absorbed from protect-data.ts) ──────────────────

const THREAT_TIMING: Record<string, ThreatTiming> = {
  'THR-001': { detected: '2026-03-19T10:30:00-04:00', updated: '2026-03-19T10:32:00-04:00', times: ['10:30', '10:31', '10:32', '10:33'] },
  'THR-002': { detected: '2026-03-18T09:15:00-04:00', updated: '2026-03-18T09:17:00-04:00', times: ['09:15', '09:16', '09:17', '09:18'] },
  'THR-003': { detected: '2026-03-16T16:42:00-04:00', updated: '2026-03-16T16:44:00-04:00', times: ['16:42', '16:43', '16:44', '16:45'] },
  'THR-004': { detected: '2026-03-12T11:08:00-04:00', updated: '2026-03-12T11:10:00-04:00', times: ['11:08', '11:09', '11:10', '11:11'] },
  'THR-005': { detected: '2026-03-14T22:17:00-04:00', updated: '2026-03-14T22:19:00-04:00', times: ['22:17', '22:18', '22:19', '22:20'] },
}
const DEFAULT_THREAT_TIMING: ThreatTiming = { detected: '2026-03-19T14:28:00-04:00', updated: '2026-03-19T14:30:00-04:00', times: ['14:28', '14:29', '14:30', '14:31'] }

const THREAT_FACTORS: Record<string, ThreatFactor[]> = {
  /* ── THR-001: Cayman Reef Holdings Ltd., $2,500,000, Critical ── */
  'THR-001': [
    { id: 'e1', title: 'AML Pattern Match', weight: 0.95, heroCue: 'Wire amount 4.2× client\'s offshore transfer baseline', details: '$2,500,000 wire to new offshore counterparty exceeds client\'s 24-month offshore transfer mean of $595K by 4.2×. Percentile rank: 99.4 against peer cohort. Triggers enhanced due diligence under BSA/AML §314(b).', model: 'IsoForest-AMLAnomaly v4.1' },
    { id: 'e2', title: 'Timing Anomaly', weight: 0.82, heroCue: 'Urgent same-day settlement request outside normal cadence', details: 'Same-day settlement requested for wire exceeding $500K threshold. Client\'s 24-month history shows 0 same-day settlement requests for amounts above $200K. Urgency pattern flagged by temporal sequence model.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e3', title: 'Cross-Account Flow', weight: 0.88, heroCue: 'Liquidation pattern across 3 accounts precedes wire', details: '$2.5M wire preceded by $1.8M securities liquidation and $700K money market redemption across 3 accounts within 72 hours. Cross-account flow pattern absent from client\'s 36-month transaction history.', model: 'GNN-CrossAccount v1.5' },
    { id: 'e4', title: 'Counterparty Risk', weight: 0.85, heroCue: 'Counterparty registered <90 days, jurisdiction risk elevated', details: 'Cayman Reef Holdings Ltd. incorporated 67 days ago. Jurisdiction risk score: 7.2/10 (Cayman Islands). No prior relationship with Acme Bank. Beneficial ownership structure requires manual verification.', model: 'XGB-CounterpartyRisk v2.3' },
    { id: 'e5', title: 'Known Fraud Pattern', weight: 0.90, heroCue: 'Matches 847 confirmed AML cases (0.93 similarity)', details: 'Transaction feature vector matches 847 confirmed AML cases across the platform. Similarity score: 0.93. Matched features: amount range, counterparty age, jurisdiction, and liquidation pattern.', model: 'GBM-AMLDetection v3.0' },
    { id: 'm1', title: 'Client Relationship', weight: 0.55, details: 'Client tenure: 12 years. AUM: $45M. Prior compliance flags: 0. Relationship stability index: 0.97 (top 3% of VIP cohort). No prior AML or sanctions alerts.', model: 'AE-ClientStability v2.0', mitigating: true },
    { id: 'm2', title: 'Document Context', weight: 0.45, details: 'Client correspondence references a legitimate real estate acquisition in Grand Cayman. Purchase agreement dated 2026-02-28 from a licensed real estate firm. Document AI confidence in legitimacy: 0.82.', model: 'DocAnalysis-Context v1.8', mitigating: true },
  ],
  /* ── THR-002: Meridian Capital Partners, $890,000, High ── */
  'THR-002': [
    { id: 'e1', title: 'Unusual Transfer Volume', weight: 0.60, heroCue: 'Amount 1.8× client\'s quarterly transfer baseline', details: 'Transfer amount $1,200,000 is 1.8× the client\'s 4-quarter average institutional transfer of $670K. Percentile rank: 88.3. Amount moderate but counterparty is unrecognized.', model: 'IsoForest-AMLAnomaly v4.1' },
    { id: 'e2', title: 'Off-Hours Initiation', weight: 0.78, heroCue: 'Initiated at 02:47 AM — 2.1% of client\'s activity window', details: 'Wire initiated at 02:47 AM local time. Client\'s 24-month active window: 07:00–18:00 EST. Only 2.1% of client\'s instructions occur between 00:00–06:00.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e3', title: 'New Counterparty', weight: 0.72, heroCue: 'Zero prior transactions with this counterparty', details: '$1.2M wire to entity with no prior relationship. Zero outflows to Meridian Trade Corp in 36-month account history. Single-counterparty concentration anomaly.', model: 'GNN-CrossAccount v1.5' },
    { id: 'e4', title: 'Counterparty Risk', weight: 0.95, heroCue: 'Counterparty not in any institutional directory', details: 'Meridian Trade Corp not found in institutional counterparty directories (SWIFT, LEI registry). Zero transaction history across platform. Registration jurisdiction: unlisted. Incorporation: <90 days.', model: 'XGB-CounterpartyRisk v2.3' },
    { id: 'e5', title: 'Known Fraud Pattern', weight: 0.85, heroCue: 'Matches 523 confirmed fraud cases (0.89 similarity)', details: 'Unrecognized counterparty + off-hours initiation pattern matches 523 confirmed fraud cases. Similarity score: 0.89. Matched features: counterparty type, timing, and amount range.', model: 'GBM-AMLDetection v3.0' },
    { id: 'm1', title: 'Client Relationship', weight: 0.60, details: 'Client tenure: 8 years. Account consistency: 91%. Prior compliance flags: 0. Stability index: 0.94 (top 6% of cohort). No prior AML alerts.', model: 'AE-ClientStability v2.0', mitigating: true },
    { id: 'm2', title: 'Sector Familiarity', weight: 0.30, details: 'Trade finance sector is unclassified for this client. No prior transactions to unclassified counterparties in 36-month history. Sector familiarity score: 0.12.', model: 'BayesNet-SectorFamiliar v1.8', mitigating: true },
  ],
  /* ── THR-003: Swiss National Bank, $3,400,000, Medium ── */
  'THR-003': [
    { id: 'e1', title: 'Cross-Border Exposure', weight: 0.70, heroCue: 'Amount 2.1× client\'s cross-border transfer mean', details: 'Wire amount $3,400,000 is 2.1× the client\'s 24-month cross-border transfer mean of $1,620K. Percentile rank: 93.4. Prior max cross-border transfer: $2,200,000.', model: 'IsoForest-AMLAnomaly v4.1' },
    { id: 'e2', title: 'Timing Assessment', weight: 0.45, heroCue: 'Minor cadence deviation for this transaction type', details: 'Wire initiated at 11:23 AM on weekday. Within normal business hours. No significant temporal anomaly. Minor deviation from typical cross-border transfer cadence.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e3', title: 'Jurisdiction Complexity', weight: 0.65, heroCue: 'Amount 3.5× client\'s Asia-Pacific transfer mean', details: '$3,400,000 cross-border wire to Asia-Pacific jurisdiction. 2 prior transfers to region in 24-month history (average: $980K). Amount is 3.5× the client\'s regional transfer mean.', model: 'GNN-CrossAccount v1.5' },
    { id: 'e4', title: 'Counterparty Assessment', weight: 0.60, heroCue: 'Counterparty compliance incident rate 1.3× sector average', details: 'Pacific Rim Ventures compliance incident rate: 2.8% (sector average: 2.1%). Ratio: 1.3×. First transaction with this counterparty. Entity active in institutional networks for 8 months.', model: 'XGB-CounterpartyRisk v2.3' },
    { id: 'e5', title: 'Pattern Match', weight: 0.55, heroCue: 'Matches 312 flagged cross-border cases (0.71 similarity)', details: 'Cross-border wire + new counterparty pattern matches 312 flagged cases. Similarity score: 0.71. Matched features: transfer type and amount range.', model: 'GBM-AMLDetection v3.0' },
    { id: 'm1', title: 'Client Relationship', weight: 0.65, details: 'Client tenure: 15 years. Account consistency: 96%. Prior compliance flags: 0. Stability index: 0.98 (top 2% of cohort). No prior AML alerts.', model: 'AE-ClientStability v2.0', mitigating: true },
    { id: 'm2', title: 'Sector Familiarity', weight: 0.55, details: 'Cross-border transactions present in 8 of last 24 months. Frequency rank: 5th. Asia-Pacific sub-region familiarity score: 0.58.', model: 'BayesNet-SectorFamiliar v1.8', mitigating: true },
  ],
  /* ── THR-004: Apex Ventures LLC, $1,200,000, Medium ── */
  'THR-004': [
    { id: 'e1', title: 'Settlement Anomaly', weight: 0.50, heroCue: 'Amount 3.6× client\'s settlement average', details: 'Settlement of $800,000 against 24-month settlement mean of $220K. Percentile rank: 91.2. Prior max settlement: $500K. Amount is 3.6× above client\'s settlement average.', model: 'IsoForest-AMLAnomaly v4.1' },
    { id: 'e2', title: 'Off-Hours Processing', weight: 0.40, heroCue: 'After-hours settlement (73% of activity is during business hours)', details: 'Settlement processed at 10:14 PM local time. 73% of client\'s settlement activity occurs between 09:00–18:00. After-hours settlement frequency: 4 in 12-month history.', model: 'LSTM-TemporalSeq v2.0' },
    { id: 'e3', title: 'Rapid Liquidation', weight: 0.35, heroCue: 'Liquidation-then-settlement pattern absent from history', details: '$800K settlement preceded by $340K position liquidation 20 minutes prior. Rapid liquidation-then-settlement pattern not present in client\'s 12-month transaction history.', model: 'GNN-CrossAccount v1.5' },
    { id: 'e4', title: 'Network Risk', weight: 0.45, heroCue: 'Settlement network incident rate 3.0× platform average', details: 'Regional Settlement Network incident rate: 1.8% (platform settlement average: 0.6%). Ratio: 3.0×. First settlement via this network. Network flagged in 2 prior platform incidents.', model: 'XGB-CounterpartyRisk v2.3' },
    { id: 'e5', title: 'Pattern Match', weight: 0.50, heroCue: 'Matches 142 flagged settlement cases (0.64 similarity)', details: 'High-amount settlement via flagged network matches 142 flagged cases. Similarity score: 0.64. Matched features: amount, network risk, and timing.', model: 'GBM-AMLDetection v3.0' },
    { id: 'm1', title: 'Client Relationship', weight: 0.70, details: 'Client tenure: 11 years. Account consistency: 95%. Prior compliance flags: 0. Stability index: 0.98 (top 2% of cohort). No prior AML alerts.', model: 'AE-ClientStability v2.0', mitigating: true },
    { id: 'm2', title: 'Sector Familiarity', weight: 0.65, details: 'Settlement activity present in 18 of last 24 months. Frequency rank: 4th. Regional network used 6 times prior. Familiarity score: 0.74.', model: 'BayesNet-SectorFamiliar v1.8', mitigating: true },
  ],
  /* ── THR-005: Eastern Commodities Exchange, $5,000,000, Medium ── */
  'THR-005': [
    { id: 'e1', title: 'Concentration Risk Detected', weight: 0.91, heroCue: 'Commodity allocation exceeds single-sector threshold', details: '$5M exposure to Eastern Commodities Exchange represents 18% of portfolio in a single commodity sector. Concentration exceeds the 15% single-sector limit defined in the client\'s investment policy statement. Flagged due to concentration risk, not counterparty quality.', model: 'IsoForest-ConcentrationRisk v4.1' },
    { id: 'e2', title: 'Volatility Spike', weight: 0.78, heroCue: '30-day commodity volatility 2.4× above historical mean', details: 'Underlying commodity sector 30-day realized volatility at 34.2% vs. 12-month average of 14.1% (ratio: 2.4×). Elevated volatility increases mark-to-market risk on concentrated positions.', model: 'LSTM-VolRegime v2.0' },
    { id: 'e3', title: 'Margin Exposure', weight: 0.82, heroCue: 'Leveraged commodity position amplifies downside risk', details: '$5M notional exposure with 3:1 leverage on commodity futures. Margin call threshold at 12% drawdown ($600K). Current unrealized P&L: -$180K. Position represents the largest single-counterparty commodity exposure in the portfolio.', model: 'GNN-MarginRisk v1.5' },
    { id: 'e4', title: 'Counterparty Assessment', weight: 0.68, heroCue: 'Exchange credit rating stable but jurisdiction adds complexity', details: 'Eastern Commodities Exchange: BBB+ rated, operational for 12 years. Jurisdiction requires CFTC-equivalent reporting. Settlement risk assessed at 0.3% (within acceptable range). No prior settlement failures with this counterparty.', model: 'XGB-CounterpartyRisk v2.3' },
    { id: 'e5', title: 'Pattern Match', weight: 0.85, heroCue: 'Concentrated commodity + high volatility matches 423 flagged cases', details: 'The combination of single-sector concentration and elevated volatility matches 423 previously flagged cases (0.85 similarity). Matched features: concentration ratio, volatility regime, and leverage level. Note: this pattern is driven by position sizing and market conditions, not the specific commodity.', model: 'GBM-ConcentrationAlert v3.0' },
    { id: 'm1', title: 'Portfolio Diversification', weight: 0.62, details: 'Overall portfolio diversification score: 0.81 (above median). 14 asset classes represented. Commodity allocation historically between 5-12%. Current spike driven by recent position additions.', model: 'AE-PortfolioDiversity v2.0', mitigating: true },
    { id: 'm2', title: 'Client Mandate Alignment', weight: 0.45, details: 'Client investment policy allows commodity exposure up to 20% with board approval. Current 18% is within the expanded mandate. Prior commodity positions held for 8+ months on average.', model: 'BayesNet-MandateAlign v1.8', mitigating: true },
  ],
}

// ─── Protect Threats (B2B — institutional banking) ──────────────────────────

const PROTECT_THREATS: ProtectThreatEntity[] = [
  {
    id: DEMO_THREAD.criticalAlert.id,
    counterparty: DEMO_THREAD.criticalAlert.counterparty,
    amountUsd: DEMO_THREAD.criticalAlert.amount,
    confidence: DEMO_THREAD.criticalAlert.confidence,
    severity: 'Critical',
    description: 'AML flag — new offshore destination, VIP client',
    relativeTime: '4h ago',
    sortOrder: 8,
    compositePriority: 95,
    clientName: 'Elias Vance',
    regulatoryFlag: 'AML/KYC',
    timing: THREAT_TIMING['THR-001'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-001'],
  },
  {
    id: 'THR-002',
    counterparty: 'Meridian Capital Partners',
    amountUsd: 890000,
    confidence: 0.87,
    severity: 'High',
    description: 'Unusual client behavior — rapid position unwinding',
    relativeTime: '1d ago',
    sortOrder: 7,
    compositePriority: 78,
    clientName: 'Sarah Chen',
    timing: THREAT_TIMING['THR-002'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-002'],
  },
  {
    id: 'THR-003',
    counterparty: 'Swiss National Bank',
    amountUsd: 3400000,
    confidence: 0.72,
    severity: 'Medium',
    description: 'Regulatory deadline — FINMA reporting due in 48h',
    relativeTime: '3d ago',
    sortOrder: 6,
    compositePriority: 62,
    regulatoryFlag: 'FINMA',
    timing: THREAT_TIMING['THR-003'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-003'],
  },
  {
    id: 'THR-004',
    counterparty: 'Apex Ventures LLC',
    amountUsd: 1200000,
    confidence: 0.65,
    severity: 'Medium',
    description: 'Counterparty exposure — credit downgrade watch',
    relativeTime: '1w ago',
    sortOrder: 4,
    compositePriority: 48,
    timing: THREAT_TIMING['THR-004'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-004'],
  },
  {
    id: 'THR-005',
    counterparty: 'Eastern Commodities Exchange',
    amountUsd: 5000000,
    confidence: 0.91,
    severity: 'Medium',
    description: 'Market risk — concentrated commodity exposure',
    relativeTime: '5d ago',
    sortOrder: 5,
    compositePriority: 55,
    timing: THREAT_TIMING['THR-005'] ?? DEFAULT_THREAT_TIMING,
    factors: THREAT_FACTORS['THR-005'],
  },
]

// ─── Recommendations (B2B — inline, not from recommendation-detail-data) ────

const RECOMMENDATIONS: RecommendationEntity[] = [
  {
    id: 'REC-001',
    title: 'Securities-backed lending vs. cash wire',
    projectedBenefitUsd: 26250,
    annualBenefitUsd: 315000,
    confidence: 0.93,
    alternativeType: 'lending',
    compositePriority: Math.round(315000 * 0.93 / 1000),  // 293
  },
  {
    id: 'REC-002',
    title: 'Tax-loss harvesting — Q1 realized gains offset',
    projectedBenefitUsd: 8400,
    annualBenefitUsd: 100800,
    confidence: 0.88,
    alternativeType: 'hedge',
    compositePriority: Math.round(100800 * 0.88 / 1000),  // 89
  },
  {
    id: 'REC-003',
    title: 'FX hedging — EUR exposure reduction',
    projectedBenefitUsd: 4200,
    annualBenefitUsd: 50400,
    confidence: 0.82,
    alternativeType: 'hedge',
    compositePriority: Math.round(50400 * 0.82 / 1000),   // 41
  },
  {
    id: 'REC-004',
    title: 'Fee restructure — custody fee renegotiation',
    projectedBenefitUsd: 3500,
    annualBenefitUsd: 42000,
    confidence: 0.91,
    alternativeType: 'restructure',
    compositePriority: Math.round(42000 * 0.91 / 1000),   // 38
  },
  {
    id: 'REC-005',
    title: 'Credit line optimization — margin utilization',
    projectedBenefitUsd: 2800,
    annualBenefitUsd: 33600,
    confidence: 0.85,
    alternativeType: 'lending',
    compositePriority: Math.round(33600 * 0.85 / 1000),   // 29
  },
]

// ─── Execute Actions (B2B — institutional operations) ───────────────────────

const EXECUTE_ACTIONS: ExecuteActionEntity[] = [
  {
    id: 'EXE-001',
    title: 'Wire transfer authorization — Elias Vance',
    engine: 'Execute',
    amountLabel: '$2,500,000',
    confidence: 0.97,
    timestampLabel: '14:28',
    description: '$2.5M wire transfer to offshore account — alternative lending path recommended',
    urgency: 'high',
    impact: {
      approved: 'Wire transfer authorized and logged in compliance audit trail.',
      deferred: 'Client request held pending further review; escalation timer starts.',
    },
    reversible: false,
    expiresIn: '4h',
    factors: [
      { label: 'AML risk assessment', value: 0.91 },
      { label: 'Client tier verification', value: 0.95 },
      { label: 'Alternative path benefit', value: 0.88 },
    ],
    executionType: 'manual',
    category: 'protection',
    sourceEngine: 'Protect',
    sourceEntityId: DEMO_THREAD.criticalAlert.id,
    riskTier: 2,
    compositePriority: 92,
    steps: [
      { id: 'EXE-001-S1', label: 'AML/KYC screening', description: 'Compliance AI screened counterparty against sanctions databases', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '3s' },
      { id: 'EXE-001-S2', label: 'Document verification', description: 'Document AI extracted and verified real estate purchase context', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '5s' },
      { id: 'EXE-001-S3', label: 'Alternative analysis', description: 'Financial Strategy AI proposed securities-backed lending alternative', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '4s' },
      { id: 'EXE-001-S4', label: 'Authorize transfer path', description: 'Senior Wealth Manager reviews deliberation and authorizes chosen path', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~5 min' },
      { id: 'EXE-001-S5', label: 'Execute and audit', description: 'Transaction executed and full decision lineage logged to audit trail', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '2s' },
    ],
  },
  {
    id: 'EXE-002',
    title: 'Margin account setup',
    engine: 'Execute',
    amountLabel: '$2,500,000',
    confidence: 0.94,
    timestampLabel: '14:15',
    description: 'Open margin account and set credit facility for securities-backed lending path',
    urgency: 'high',
    impact: {
      approved: 'Margin account opened and credit facility configured.',
      deferred: 'Alternative lending path unavailable; original wire transfer remains pending.',
    },
    reversible: true,
    expiresIn: '6h',
    factors: [
      { label: 'Collateral sufficiency', value: 0.93 },
      { label: 'Margin requirements', value: 0.89 },
      { label: 'Client eligibility', value: 0.96 },
    ],
    executionType: 'semi-auto',
    category: 'investment',
    sourceEngine: 'Grow',
    sourceEntityId: 'REC-001',
    rollbackWindowHours: 48,
    riskTier: 2,
    compositePriority: 85,
    steps: [
      { id: 'EXE-002-S1', label: 'Verify collateral', description: 'AI verified portfolio holdings meet margin requirements', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-002-S2', label: 'Configure credit facility', description: 'Credit terms and borrowing limits calculated', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '3s' },
      { id: 'EXE-002-S3', label: 'Approve margin account', description: 'You review terms and authorize account opening', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~2 min' },
      { id: 'EXE-002-S4', label: 'Open account and log', description: 'Account opened and decision logged to compliance ledger', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '5s' },
    ],
  },
  {
    id: 'EXE-003',
    title: 'Portfolio rebalance — Chen account',
    engine: 'Execute',
    amountLabel: '$890,000',
    confidence: 0.89,
    timestampLabel: '13:52',
    description: 'Rebalance concentrated tech allocation to target risk profile',
    urgency: 'medium',
    impact: {
      approved: 'Allocation adjusted and tracked in compliance audit trail.',
      deferred: 'Portfolio keeps current concentration risk; review deferred to next cycle.',
    },
    reversible: true,
    expiresIn: '14h',
    factors: [
      { label: 'Concentration risk', value: 0.91 },
      { label: 'Target drift', value: 0.87 },
      { label: 'Tax impact', value: 0.72 },
    ],
    executionType: 'hybrid',
    category: 'rebalance',
    sourceEngine: 'Execute',
    rollbackWindowHours: 24,
    riskTier: 1,
    compositePriority: 65,
    steps: [
      { id: 'EXE-003-S1', label: 'Analyze allocation drift', description: 'AI scanned portfolio drift against target allocation model', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '2s' },
      { id: 'EXE-003-S2', label: 'Calculate optimal path', description: 'Determine minimum-trade path to restore target weights', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '3s' },
      { id: 'EXE-003-S3', label: 'Review rebalance plan', description: 'You review the transfer details and tax impact', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~2 min' },
      { id: 'EXE-003-S4', label: 'Execute trades', description: 'Trade orders queued for execution and audit logging', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '5s' },
    ],
  },
  {
    id: 'EXE-004',
    title: 'Compliance filing — quarterly report',
    engine: 'Execute',
    amountLabel: '-',
    confidence: 0.78,
    timestampLabel: '11:20',
    description: 'Quarterly compliance report generation and filing for regulatory submission',
    urgency: 'medium',
    impact: {
      approved: 'Report filed and confirmation logged to audit trail.',
      deferred: 'Filing deadline approaches; reminder escalated in 24h.',
    },
    reversible: false,
    expiresIn: '3d',
    factors: [
      { label: 'Data completeness', value: 0.84 },
      { label: 'Regulatory alignment', value: 0.77 },
      { label: 'Historical accuracy', value: 0.73 },
    ],
    executionType: 'auto',
    category: 'compliance',
    sourceEngine: 'Execute',
    riskTier: 1,
    compositePriority: 52,
    steps: [
      { id: 'EXE-004-S1', label: 'Aggregate reporting data', description: 'AI compiled transaction data from all engines for quarterly report', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '6s' },
      { id: 'EXE-004-S2', label: 'Approve filing', description: 'You review and approve the regulatory submission', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~1 min' },
      { id: 'EXE-004-S3', label: 'Submit and archive', description: 'Filing submitted and evidence archived in compliance ledger', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '30s' },
    ],
  },
  {
    id: 'EXE-005',
    title: 'Credit facility disbursement',
    engine: 'Execute',
    amountLabel: '$2,500,000',
    confidence: 0.96,
    timestampLabel: '10:30',
    description: '$2.5M credit facility disbursement against securities collateral',
    urgency: 'low',
    impact: {
      approved: 'Disbursement executes and receipt is logged in the audit ledger.',
      deferred: 'Disbursement deferred; client notified of delay.',
    },
    reversible: true,
    expiresIn: '18h',
    factors: [
      { label: 'Collateral verification', value: 0.97 },
      { label: 'Credit terms compliance', value: 0.95 },
      { label: 'Client authorization', value: 0.93 },
    ],
    executionType: 'semi-auto',
    category: 'investment',
    sourceEngine: 'Execute',
    rollbackWindowHours: 24,
    riskTier: 2,
    compositePriority: 42,
    steps: [
      { id: 'EXE-005-S1', label: 'Verify collateral value', description: 'AI confirmed current market value of pledged securities', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '1s' },
      { id: 'EXE-005-S2', label: 'Check credit terms', description: 'Verified disbursement aligns with approved credit facility terms', actor: 'agent', status: 'completed', requiresConsent: false, estimatedDuration: '1s' },
      { id: 'EXE-005-S3', label: 'Authorize disbursement', description: 'You confirm the $2.5M disbursement', actor: 'user', status: 'current', requiresConsent: true, estimatedDuration: '~30s' },
      { id: 'EXE-005-S4', label: 'Execute transfer', description: 'Funds transferred and receipt logged to audit ledger', actor: 'agent', status: 'waiting', requiresConsent: false, estimatedDuration: '3s' },
    ],
  },
]

// ─── Govern Audit Entries ───────────────────────────────────────────────────

function governPriority(status: 'Verified' | 'Pending review' | 'Flagged', confidence: number): number {
  const statusWeight = status === 'Pending review' ? 90 : status === 'Flagged' ? 80 : 40
  return Math.round(statusWeight + confidence * 10)
}

const GOVERN_AUDIT_ENTRIES: GovernAuditEntryEntity[] = [
  {
    id: 'GV-2026-0319-848',
    timestampIso: '2026-03-19T14:29:00-04:00',
    type: 'Execute',
    action: 'Credit facility disbursement authorized',
    confidence: 0.96,
    evidence: 6,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.96),
  },
  {
    id: 'GV-2026-0319-847',
    timestampIso: '2026-03-19T14:28:00-04:00',
    type: 'Execute',
    action: 'Margin account setup — Vance',
    confidence: 0.94,
    evidence: 12,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.94),
  },
  {
    id: 'GV-2026-0319-846',
    timestampIso: '2026-03-19T14:15:00-04:00',
    type: 'Protect',
    action: `AML flag — $2.5M wire to ${DEMO_THREAD.criticalAlert.counterparty}`,
    confidence: DEMO_THREAD.criticalAlert.confidence,
    evidence: 9,
    status: 'Verified',
    compositePriority: governPriority('Verified', DEMO_THREAD.criticalAlert.confidence),
  },
  {
    id: 'GV-2026-0319-845',
    timestampIso: '2026-03-19T13:52:00-04:00',
    type: 'Grow',
    action: 'Securities-backed lending alternative proposed',
    confidence: 0.93,
    evidence: 7,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.93),
  },
  {
    id: 'GV-2026-0319-844',
    timestampIso: '2026-03-19T11:20:00-04:00',
    type: 'Execute',
    action: 'Quarterly compliance filing queued',
    confidence: 0.78,
    evidence: 5,
    status: 'Pending review',
    compositePriority: governPriority('Pending review', 0.78),
  },
  {
    id: 'GV-2026-0318-843',
    timestampIso: '2026-03-18T16:42:00-04:00',
    type: 'Protect',
    action: 'Unusual client behavior — rapid position unwinding',
    confidence: 0.92,
    evidence: 10,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.92),
  },
  {
    id: 'GV-2026-0318-842',
    timestampIso: '2026-03-18T10:18:00-04:00',
    type: 'Grow',
    action: 'Fee restructure — custody fee optimization',
    confidence: 0.91,
    evidence: 6,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.91),
  },
  {
    id: 'GV-2026-0317-841',
    timestampIso: '2026-03-17T14:12:00-04:00',
    type: 'Execute',
    action: 'Portfolio rebalance — Chen account',
    confidence: 0.89,
    evidence: 8,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.89),
  },
  {
    id: 'GV-2026-0317-840',
    timestampIso: '2026-03-17T09:40:00-04:00',
    type: 'Govern',
    action: 'Policy threshold recalibration',
    confidence: 0.97,
    evidence: 15,
    status: 'Verified',
    compositePriority: governPriority('Verified', 0.97),
  },
]

// ─── Deliberation Traces ────────────────────────────────────────────────────

const EVT_892X_DELIBERATION: DeliberationTrace = {
  id: 'DT-892X-001',
  eventId: 'EVT-892X',
  rounds: [
    {
      roleId: 'compliance',
      modelId: 'claude-sonnet-4-6',
      position: 'oppose',
      argument: 'Wire destination is a newly registered offshore entity with no prior transaction history. AML risk score exceeds threshold for automatic approval. Recommend hold for enhanced due diligence.',
      confidence: 0.91,
      factors: [
        { label: 'New counterparty risk', weight: 0.35 },
        { label: 'Jurisdiction risk', weight: 0.30 },
        { label: 'Transaction amount', weight: 0.20 },
        { label: 'Client pattern deviation', weight: 0.15 },
      ],
    },
    {
      roleId: 'document',
      modelId: 'gpt-4o',
      position: 'support',
      argument: 'Client correspondence references a legitimate real estate acquisition. Purchase agreement document (uploaded 2026-03-18) matches the wire amount and offshore entity registration. Context supports a genuine business purpose.',
      confidence: 0.86,
      factors: [
        { label: 'Document authenticity', weight: 0.40 },
        { label: 'Amount consistency', weight: 0.30 },
        { label: 'Entity registration match', weight: 0.20 },
        { label: 'Timeline coherence', weight: 0.10 },
      ],
    },
    {
      roleId: 'strategy',
      modelId: 'claude-opus-4-6',
      position: 'modify',
      argument: 'Recommend securities-backed lending as an alternative to cash wire. Client retains portfolio exposure and avoids $315K in opportunity cost over 3 years. Margin account setup takes 24h vs. immediate wire, but risk-adjusted return is significantly better.',
      confidence: 0.93,
      factors: [
        { label: 'Opportunity cost avoidance', weight: 0.35 },
        { label: 'Portfolio continuity', weight: 0.25 },
        { label: 'Tax efficiency', weight: 0.25 },
        { label: 'Execution feasibility', weight: 0.15 },
      ],
    },
    {
      roleId: 'policy',
      modelId: 'system-policy-engine',
      position: 'modify',
      argument: 'Transaction exceeds $500K threshold — mandatory council review triggered. Offshore destination requires enhanced KYC documentation. Human authorization required regardless of model consensus. Alternative path (lending) satisfies capital movement rules with lower risk classification.',
      confidence: 1.0,
      factors: [
        { label: 'Amount threshold enforcement', weight: 0.40 },
        { label: 'KYC requirement', weight: 0.30 },
        { label: 'Human review mandate', weight: 0.20 },
        { label: 'Alternative path compliance', weight: 0.10 },
      ],
    },
  ],
  consensus: {
    score: 0.91,
    adoptedModelId: 'claude-opus-4-6',
    rationale: 'Council adopted the securities-backed lending alternative. Compliance AI flagged legitimate AML concern, Document AI confirmed business context, Financial Strategy AI proposed a superior economic path, and Policy Engine enforced mandatory human review. The system challenged its own recommendation before requesting authorization.',
  },
}

// ─── Canonical Events ───────────────────────────────────────────────────────

const CANONICAL_EVENTS: CanonicalEvent[] = [
  {
    id: 'EVT-892X',
    title: 'Elias Vance — $2.5M offshore wire request',
    clientName: 'Elias Vance',
    clientTier: 'VIP',
    timestampIso: '2026-03-19T14:00:00-04:00',
    status: 'active',
    children: {
      threats: [DEMO_THREAD.criticalAlert.id],
      alternatives: ['REC-001'],
      actions: ['EXE-001', 'EXE-002', 'EXE-005'],
      auditEntries: ['GV-2026-0319-846', 'GV-2026-0319-847', 'GV-2026-0319-845'],
    },
    deliberationTraces: [EVT_892X_DELIBERATION],
  },
  {
    id: 'EVT-891',
    title: 'Sarah Chen — rapid position unwinding',
    clientName: 'Sarah Chen',
    clientTier: 'Standard',
    timestampIso: '2026-03-18T16:30:00-04:00',
    status: 'resolved',
    children: {
      threats: ['THR-002'],
      alternatives: [],
      actions: ['EXE-003'],
      auditEntries: ['GV-2026-0318-843', 'GV-2026-0317-841'],
    },
    deliberationTraces: [],
  },
]

// ─── Growth Simulation Data (absorbed from grow-simulation-data.ts) ─────────

export const CANONICAL_GROWTH_SIMULATION_DATA: GrowthSimulationPoint[] = [
  { year: 'Now', baseline: 200000, aiOptimized: 200000, low: 200000, high: 200000 },
  { year: '1Y',  baseline: 204000, aiOptimized: 211584, low: 211480, high: 211690 },
  { year: '2Y',  baseline: 208080, aiOptimized: 223797, low: 223345, high: 224266 },
  { year: '3Y',  baseline: 212242, aiOptimized: 236679, low: 235609, high: 237812 },
]

const FINAL_SIM = CANONICAL_GROWTH_SIMULATION_DATA[CANONICAL_GROWTH_SIMULATION_DATA.length - 1]
export const CANONICAL_PROJECTED_3Y_ADVANTAGE = FINAL_SIM.aiOptimized - FINAL_SIM.baseline

// ─── Recommendation Detail Data (absorbed from recommendation-detail-data.ts) ─

const growModelInfo = (recNum: number) => ({
  name: 'GrowthOptimizer' as const,
  version: '3.2',
  accuracy: 0.912,
  auditId: `GV-2026-0216-R${String(recNum).padStart(2, '0')}`,
})

export const CANONICAL_RECOMMENDATION_DETAILS: RecommendationDetail[] = [
  {
    id: 1, title: 'Optimize Corporate Credit Facility', category: 'Risk Mitigation',
    monthlySavings: 18400, annualSavings: 220800, confidence: 0.90,
    dataBasis: 'Based on 6 months of revolving credit facility utilization data',
    situationLabel: 'Your Corporate Credit Facility Costs',
    currentItems: [
      { name: 'JP Morgan Revolving Facility', cost: 12600, usage: 'high', note: '$4.2M drawn · SOFR+285bps · interest accruing monthly' },
      { name: 'Wells Fargo Working Capital Line', cost: 5800, usage: 'medium', note: '$1.8M drawn · SOFR+320bps · interest accruing monthly' },
      { name: 'Total interest charges', cost: 18400, usage: 'low', note: 'Avg $18,400/mo in facility interest over past 6 months' },
    ],
    currentTotal: 18400,
    insights: [
      'We detected $18,400/mo in credit facility interest across 2 lending relationships over the past 6 months',
      'Consolidating into a single syndicated facility at renegotiated terms could reduce the blended rate by 90-120bps',
      'Poseidon enterprise clients who consolidated revolving facilities saved an average of $16,200/mo in interest expense',
    ],
    changes: [
      { action: 'switch', item: 'Consolidate JP Morgan facility', from: 'SOFR+285bps', to: 'SOFR+175bps (consolidated)', savings: 12600 },
      { action: 'switch', item: 'Consolidate Wells Fargo line', from: 'SOFR+320bps', to: 'SOFR+175bps (consolidated)', savings: 5800 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'BNY Mellon Syndicated Facility', detail: 'SOFR+175bps', note: 'Best rate for your credit profile, $8M commitment, flexible draw schedule', recommended: true },
      { name: 'US Bank Corporate Line', detail: 'SOFR+195bps', note: 'Competitive rate with treasury management fee waiver', recommended: false },
      { name: 'Citibank Revolving Credit', detail: 'SOFR+210bps', note: 'Existing relationship, expedited underwriting', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Request facility proposals from lead arrangers', description: 'Poseidon has pre-populated an RFP with your utilization history and credit profile. Send to 3 shortlisted banks.', type: 'semi-auto', estimatedTime: '1 business day' },
      { step: 2, title: 'CFO review and term sheet comparison', description: 'Compare consolidated term sheets side-by-side: rate, commitment fee, covenants, and draw flexibility.', type: 'manual', estimatedTime: '3-5 business days' },
      { step: 3, title: 'Execute facility agreement', description: 'Legal review and execution of the new consolidated facility. Poseidon tracks closing checklist items automatically.', type: 'manual', estimatedTime: '2-4 weeks' },
    ],
    executionType: 'semi-auto',
    factors: [
      '$18,400/mo in detected interest expense across fragmented facilities is the primary signal — consolidation unlocks volume pricing',
      'Combined drawn balance of $6M at 285-320bps over SOFR generates significant monthly drag on operating margins',
      'Consistent covenant compliance and clean payment history strengthen negotiating position for rate reduction',
    ],
    cohortProof: '134 Poseidon enterprise clients who consolidated revolving facilities saved an average of $16,200/mo in interest expense',
    modelInfo: growModelInfo(1),
    dataSources: ['Credit facility utilization analysis (6 months)', 'Interest expense detection', 'Syndicated loan market benchmarks', 'Covenant compliance history'],
  },
  {
    id: 2, title: 'Rationalize SaaS License Portfolio', category: 'Efficiency',
    monthlySavings: 14200, annualSavings: 170400, confidence: 0.86,
    dataBasis: 'Based on 24 months of recurring vendor payment analysis',
    situationLabel: 'Your SaaS License Portfolio',
    currentItems: [
      { name: 'Salesforce Enterprise', cost: 18500, usage: 'high', note: 'Matches Enterprise tier pricing · 340 seats licensed · recurring 24 months' },
      { name: 'ServiceNow ITSM', cost: 12400, usage: 'medium', note: 'Matches Pro tier pricing · 180 seats licensed · recurring 18 months' },
      { name: 'Workday HCM', cost: 9800, usage: 'medium', note: 'Matches full-suite pricing · recurring 14 months' },
      { name: 'Tableau Server', cost: 6200, usage: 'low', note: 'Matches Creator tier pricing · 95 seats licensed · recurring 12 months' },
    ],
    currentTotal: 46900,
    insights: [
      'Your charges match enterprise-tier pricing across 4 platforms — these are the most expensive license levels',
      'ERP usage telemetry suggests only 62% average seat utilization across these platforms — 38% of licenses may be unused',
      '78% of mid-market Poseidon clients who right-sized SaaS licenses reported no productivity impact',
    ],
    changes: [
      { action: 'downgrade', item: 'Salesforce Enterprise → Professional (right-size seats)', from: '$18,500', to: '$12,800', savings: 5700 },
      { action: 'downgrade', item: 'ServiceNow Pro → Standard (right-size seats)', from: '$12,400', to: '$8,600', savings: 3800 },
      { action: 'cancel', item: 'Tableau Server (consolidate into Salesforce Analytics)', savings: 6200 },
      { action: 'downgrade', item: 'Workday HCM → Core (remove unused modules)', from: '$9,800', to: '$11,300', savings: -1500 },
    ],
    newTotal: 32700, alternatives: [], ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Audit seat utilization with IT ops', description: 'Poseidon generates a seat utilization report per platform. Review with IT to confirm inactive users and redundant modules.', type: 'semi-auto', estimatedTime: '2-3 business days' },
      { step: 2, title: 'Negotiate renewal terms with vendors', description: 'Use utilization data as leverage in renewal negotiations. Poseidon provides benchmarked pricing for your tier and headcount.', type: 'manual', estimatedTime: '2-4 weeks' },
      { step: 3, title: 'Consolidate Tableau into Salesforce Analytics', description: 'Migrate dashboards and reports from Tableau to Salesforce CRM Analytics. Poseidon tracks migration checklist.', type: 'manual', estimatedTime: '4-6 weeks' },
      { step: 4, title: 'Procurement approval and contract execution', description: 'Route renegotiated contracts through procurement workflow for CFO sign-off.', type: 'manual', estimatedTime: '1-2 weeks' },
    ],
    executionType: 'semi-auto',
    factors: ['Enterprise-tier pricing across 4 platforms with only 62% seat utilization — a strong signal of over-provisioning', 'Overlapping analytics capabilities (Tableau + Salesforce Analytics) indicate consolidation opportunity', 'SaaS over-provisioning is the most common technology overspend pattern in our mid-market cohort'],
    cohortProof: '218 mid-market clients right-sized SaaS licenses, saving an average of $11,800/mo with no productivity loss',
    modelInfo: growModelInfo(2),
    dataSources: ['Recurring vendor payment detection (24 months)', 'Vendor pricing tier mapping', 'Seat utilization inference model', 'Cohort benchmark (right-sized vs over-provisioned)'],
  },
  {
    id: 3, title: 'Optimize Equipment & Fleet Financing', category: 'Risk Mitigation',
    monthlySavings: 22600, annualSavings: 271200, confidence: 0.84,
    dataBasis: 'Based on your connected equipment lease accounts and credit profile',
    situationLabel: 'Your Equipment & Fleet Financing',
    currentItems: [
      { name: 'Caterpillar Financial (heavy equipment)', cost: 48700, usage: 'high', note: '7.2% implicit rate · 42 months remaining' },
      { name: 'Outstanding lease balance', cost: 0, usage: 'medium', note: '$1.42M remaining principal across 8 units' },
    ],
    currentTotal: 48700,
    insights: ['Your equipment lease implicit rate of 7.2% is 2.4% above the current market rate for your credit tier', 'Poseidon clients with similar fleet profiles who restructured financing saved an average of $19,800/mo', 'With 42 months remaining, total interest savings from refinancing would be approximately $949,200'],
    changes: [{ action: 'switch', item: 'Equipment lease restructure', from: '7.2% implicit rate ($48,700/mo)', to: '4.8% via sale-leaseback ($26,100/mo)', savings: 22600 }],
    newTotal: 26100,
    alternatives: [
      { name: 'GATX Capital', detail: '4.8% implicit rate', note: 'Best rate for your equipment class, flexible end-of-term options', recommended: true },
      { name: 'Key Equipment Finance', detail: '5.1% implicit rate', note: 'Includes maintenance bundling, strong mid-market focus', recommended: false },
      { name: 'PNC Equipment Finance', detail: '5.4% implicit rate', note: 'Existing banking relationship discount available', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Request proposals from equipment lessors', description: 'Poseidon has pre-populated an RFP with your fleet manifest and utilization data. Submit to 3 shortlisted lessors.', type: 'semi-auto', estimatedTime: '2 business days' },
      { step: 2, title: 'CFO review of restructuring terms', description: 'Compare sale-leaseback proposals: implicit rate, residual value, maintenance inclusions, and balance sheet impact.', type: 'manual', estimatedTime: '1-2 weeks' },
      { step: 3, title: 'Execute restructured lease agreements', description: 'Legal review and execution of new lease agreements. Poseidon tracks UCC filings and closing documentation.', type: 'manual', estimatedTime: '3-6 weeks' },
    ],
    executionType: 'semi-auto',
    factors: ['Rate differential of 2.4% is the primary driver — your credit profile qualifies for investment-grade equipment rates', '42 months remaining makes restructuring cost-effective even after early termination fees', 'Consistent on-time payment history (detected from 18 months of lease debits) strengthens negotiation leverage'],
    cohortProof: '63 Poseidon clients with similar fleet profiles saved an average of $19,800/mo on equipment financing',
    modelInfo: growModelInfo(3),
    dataSources: ['Connected lease accounts (ERP integration)', 'Equipment residual value benchmarks', 'Market rate comparison (14 lessors)', 'Payment history analysis'],
  },
  {
    id: 4, title: 'Optimize Cash Management & Payment Timing', category: 'Efficiency',
    monthlySavings: 28500, annualSavings: 342000, confidence: 0.92,
    dataBasis: 'Based on 12 months of treasury operations and payment flow analysis',
    situationLabel: 'Your Cash Management Inefficiencies',
    currentItems: [
      { name: 'Early payment discount forfeitures', cost: 14200, usage: 'low', note: 'Missed 2/10 Net 30 terms on 68% of eligible invoices' },
      { name: 'Wire transfer fees (avoidable)', cost: 6800, usage: 'low', note: 'Avg 42 unnecessary wires/mo × $35 each vs ACH at $0.25' },
      { name: 'FX conversion spreads', cost: 7500, usage: 'none', note: 'Sub-optimal spot execution on $2.1M/mo cross-border payments' },
    ],
    currentTotal: 28500,
    insights: ['We detected $342,000 in avoidable cash management costs over the past 12 months', 'Your AP cycle averages 34 days, but 68% of your suppliers offer 2/10 Net 30 — paying on Day 10 would capture $170,400/yr in early-pay discounts', 'Shifting 42 wire transfers/mo to batch ACH and using forward contracts for FX would save an additional $171,600/yr'],
    changes: [
      { action: 'eliminate', item: 'Early-pay discount forfeitures', from: '$14,200/mo lost', to: '$0 (accelerated AP workflow)', savings: 14200 },
      { action: 'eliminate', item: 'Excess wire transfer fees', from: '$6,800/mo', to: '$0 (batch ACH conversion)', savings: 6800 },
      { action: 'reduce', item: 'FX conversion spreads', from: '$7,500/mo', to: '$0 (forward contract hedging)', savings: 7500 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'Kyriba Treasury Management', detail: 'Full TMS', note: 'Best-in-class AP automation with dynamic discounting, FX hedging module', recommended: true },
      { name: 'GTreasury', detail: 'Mid-market TMS', note: 'Strong cash positioning and payment factory capabilities', recommended: false },
      { name: 'Bank of America CashPro', detail: 'Bank TMS', note: 'Integrated with existing banking relationship, lower implementation cost', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Implement accelerated AP approval workflow', description: 'Poseidon configures auto-routing for invoices with early-pay terms. AP manager approves daily batch by 10 AM.', type: 'auto', estimatedTime: '1-2 weeks' },
      { step: 2, title: 'Convert recurring wires to batch ACH', description: 'Poseidon identifies 42 domestic vendor payments eligible for ACH conversion. Treasury ops reviews and approves the batch schedule.', type: 'semi-auto', estimatedTime: '2-3 business days' },
      { step: 3, title: 'Establish FX forward contracts', description: 'Set up 30/60/90-day forward contracts for recurring cross-border payments. Treasury committee review required.', type: 'manual', estimatedTime: '1-2 weeks' },
    ],
    executionType: 'auto',
    factors: ['Early-pay discount forfeitures of $14,200/mo are the largest component — AP workflow latency is the root cause', 'Wire transfer fees of $6,800/mo are fully avoidable by converting domestic payments to batch ACH processing', 'FX spot execution at retail spreads on $2.1M/mo in cross-border payments — forward contracts lock in wholesale rates'],
    cohortProof: '342 Poseidon enterprise clients optimized payment timing, saving an average of $24,800/mo in cash management costs',
    modelInfo: growModelInfo(4),
    dataSources: ['Payment flow analysis (12 months)', 'AP cycle time measurement', 'Wire/ACH transaction classification', 'FX execution spread analysis'],
  },
  {
    id: 5, title: 'Optimize Treasury & Short-Term Liquidity', category: 'Revenue Growth',
    monthlySavings: 38400, annualSavings: 460800, confidence: 0.88,
    dataBasis: 'Based on 6 months of connected treasury account balances',
    situationLabel: 'Your Liquidity Deployment Strategy',
    currentItems: [
      { name: 'Operating account (Chase Commercial)', cost: 0, usage: 'low', note: '$4.8M avg balance · ECR offset only (no yield)' },
      { name: 'Excess cash reserves', cost: 0, usage: 'none', note: 'Avg $7.2M idle at month-end across 3 accounts' },
    ],
    currentTotal: 0,
    insights: ['Your treasury accounts average $7.2M idle at month-end — funds that could earn 5.1% in overnight sweeps or T-bill ladders', 'Moving $4.8M from ECR-offset to an institutional money market fund earns $244,800/year more in yield', 'Poseidon clients who implemented automated sweep programs increased yield on idle cash by 3.8x'],
    changes: [
      { action: 'open', item: 'Institutional money market sweep', from: '0.0% yield (ECR offset)', to: '5.1% yield (overnight sweep)', savings: 0 },
      { action: 'increase', item: 'Automated daily sweep', from: '$0/day', to: 'Excess over $1.5M operating floor', savings: 38400 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'Federated Hermes Institutional MMF', detail: '5.1% yield', note: 'Same-day liquidity, AAA rated, $100K minimum', recommended: true },
      { name: 'Dreyfus Government Cash Mgmt', detail: '4.9% yield', note: 'T+0 liquidity, government-only portfolio', recommended: false },
      { name: 'Morgan Stanley Institutional Liquidity', detail: '5.0% yield', note: 'Integrated with MS treasury platform', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Establish institutional money market account', description: 'Poseidon initiates account setup with Federated Hermes using your corporate KYC on file. No additional documentation required.', type: 'auto', estimatedTime: '2-3 business days' },
      { step: 2, title: 'Configure automated daily sweep', description: 'Set sweep threshold at $1.5M operating floor. Excess cash sweeps into MMF at end of each business day.', type: 'auto', estimatedTime: '1-2 business days' },
      { step: 3, title: 'Treasury committee approval', description: 'Submit sweep program parameters and investment policy statement amendment for treasury committee sign-off.', type: 'manual', estimatedTime: '1 committee cycle' },
    ],
    executionType: 'auto',
    factors: ['The 5.1% yield gap between idle deposits and institutional MMFs is the primary driver of this recommendation', 'Consistent month-end surplus of $7.2M indicates substantial capacity for yield optimization without liquidity risk', 'Automated sweeps convert idle balances into yield daily — cohort data shows 3.8x higher returns vs manual treasury management'],
    cohortProof: '189 Poseidon enterprise clients who implemented sweep programs increased yield on idle cash by an average of $32,400/mo',
    modelInfo: growModelInfo(5),
    dataSources: ['Connected treasury balances (bank API)', 'Daily cash position analysis (6 months)', 'Institutional MMF rate comparison (18 providers)'],
  },
  {
    id: 6, title: 'Bundle Commercial Insurance & Risk Transfer', category: 'Risk Mitigation',
    monthlySavings: 42600, annualSavings: 511200, confidence: 0.80,
    dataBasis: 'Based on 26 months of commercial insurance premium payment history',
    situationLabel: 'Your Commercial Insurance Premiums',
    currentItems: [
      { name: 'Zurich (general liability + property)', cost: 68400, usage: 'high', note: 'Recurring premium detected for 26 months' },
      { name: 'AIG (D&O + E&O)', cost: 34200, usage: 'medium', note: 'Recurring premium detected for 14 months' },
      { name: 'Hartford (workers comp)', cost: 22800, usage: 'medium', note: 'Recurring premium detected for 20 months' },
    ],
    currentTotal: 125400,
    insights: ['You\'re paying three separate carriers $125,400/mo — bundling into a master program typically saves 18-30%', 'Your Zurich premium shows an annual pattern suggesting renewal in April — the ideal time to market your program', 'Poseidon clients who consolidated commercial programs saved an average of $38,500/mo'],
    changes: [{ action: 'switch', item: 'Consolidated commercial insurance program', from: '$125,400/mo (3 separate carriers)', to: '$82,800/mo (master program)', savings: 42600 }],
    newTotal: 82800,
    alternatives: [
      { name: 'Marsh Master Program', detail: '$82,800/mo', note: 'Best cohort-reported program savings for your premium range, dedicated claims team', recommended: true },
      { name: 'Aon Commercial Package', detail: '$86,200/mo', note: 'Strong analytics platform, global program capability', recommended: false },
      { name: 'Willis Towers Watson Bundle', detail: '$89,400/mo', note: 'Includes cyber liability at no incremental premium', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Engage broker for program marketing', description: 'Poseidon submits your loss history and exposure data to 3 shortlisted brokers for master program proposals.', type: 'semi-auto', estimatedTime: '1-2 weeks' },
      { step: 2, title: 'Risk committee review of proposals', description: 'Compare master program structures: coverage terms, deductibles, aggregate limits, and carrier ratings. Risk committee sign-off required.', type: 'manual', estimatedTime: '2-3 weeks' },
      { step: 3, title: 'Bind master program at renewal', description: 'Accept the best proposal and set effective date to align with April renewal to avoid short-rate cancellation penalties.', type: 'manual', estimatedTime: '2 weeks' },
      { step: 4, title: 'Confirm legacy policies non-renewed', description: 'After master program is bound, verify that Zurich, AIG, and Hartford policies are non-renewed at expiry.', type: 'manual', estimatedTime: '1 week' },
    ],
    executionType: 'manual',
    factors: ['Fragmented carrier relationships detected — master program discount is the primary savings opportunity', 'Upcoming annual renewal timing (April) creates a natural switching window without short-rate penalties', 'Combined premium of $125,400/mo is above the 75th percentile for Poseidon clients in your revenue bracket'],
    cohortProof: '52 Poseidon enterprise clients who consolidated commercial insurance saved an average of $38,500/mo',
    modelInfo: growModelInfo(6),
    dataSources: ['Insurance premium payment detection (26 months)', 'Renewal timing inference', 'Cohort benchmark (bundled vs fragmented programs)', 'Loss ratio benchmarking'],
  },
  {
    id: 7, title: 'Enforce T&E Policy & Consolidate Vendors', category: 'Efficiency',
    monthlySavings: 32400, annualSavings: 388800, confidence: 0.77,
    dataBasis: 'Based on 12 months of corporate card and AP spend analysis',
    situationLabel: 'Your T&E and Vendor Spend Trends',
    currentItems: [
      { name: 'Corporate travel (non-preferred vendors)', cost: 128000, usage: 'high', note: 'Up from $64,000/mo 12 months ago · 100% increase · 72% off-policy bookings' },
      { name: 'Consulting & professional services', cost: 94000, usage: 'high', note: 'Up from $48,000/mo 12 months ago · 96% increase · fragmented across 34 vendors' },
      { name: 'Office supplies & misc vendors', cost: 18400, usage: 'medium', note: 'Stable over 12 months · 28 active vendors for commodity purchases' },
    ],
    currentTotal: 240400,
    insights: ['Your T&E and vendor spend has grown from $130,000/mo to $240,400/mo over the past year — an 85% increase', '72% of travel bookings are off-policy (non-preferred vendors), costing 34% more than negotiated rates', 'Consolidating the top 10 consulting vendors and enforcing preferred-vendor policies could redirect $388,800/yr to the bottom line'],
    changes: [{ action: 'reduce', item: 'Monthly T&E and vendor spend (policy enforcement + consolidation)', from: '$240,400/mo', to: '$208,000/mo', savings: 32400 }],
    newTotal: 208000, alternatives: [], ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Deploy T&E policy guardrails in expense platform', description: 'Poseidon configures auto-flag rules for off-policy bookings and routes exceptions to department heads for pre-approval.', type: 'auto', estimatedTime: '1-2 weeks' },
      { step: 2, title: 'Negotiate preferred vendor agreements', description: 'Procurement team negotiates volume discounts with top 10 consulting firms and preferred travel vendors using Poseidon spend analytics.', type: 'manual', estimatedTime: '4-6 weeks' },
      { step: 3, title: 'Redirect savings to strategic initiatives', description: 'The $32,400/mo in captured savings is reallocated per CFO directive to R&D or working capital reserves.', type: 'manual', estimatedTime: 'Ongoing' },
    ],
    executionType: 'manual',
    factors: ['Spend velocity is the primary signal — 85% year-over-year increase across T&E and professional services categories', 'Off-policy travel bookings now represent 72% of travel spend, at rates 34% above negotiated preferred-vendor pricing', 'Vendor fragmentation across 34 consulting firms eliminates volume leverage — consolidation unlocks tier pricing'],
    cohortProof: '89 Poseidon enterprise clients who enforced T&E policies and consolidated vendors reduced spend by an average of $28,600/mo within 3 months',
    modelInfo: growModelInfo(7),
    dataSources: ['Corporate card transaction analysis (12 months)', 'AP vendor fragmentation analysis', 'Travel booking policy compliance audit', 'Preferred vendor rate benchmarking'],
  },
  {
    id: 8, title: 'Optimize Procurement Card & Rebate Recovery', category: 'Revenue Growth',
    monthlySavings: 24800, annualSavings: 297600, confidence: 0.79,
    dataBasis: 'Based on 18 months of procurement and AP spend analysis',
    situationLabel: 'Your Procurement Payment Optimization',
    currentItems: [
      { name: 'Legacy purchasing process (check/wire)', cost: 0, usage: 'none', note: '$8.2M/yr in P-card-eligible spend currently paid via check or wire' },
      { name: 'Unclaimed vendor rebates', cost: 0, usage: 'none', note: '$142,000 in volume rebates and early-pay discounts unclaimed over 18 months' },
      { name: 'Addressable AP spend', cost: 0, usage: 'high', note: '$14.6M/yr in total AP spend · only 31% on P-card today' },
    ],
    currentTotal: 0,
    insights: ['$8.2M/yr in procurement spend is paid via check or wire, forfeiting 1.5-2.0% in P-card rebates', 'Your vendor agreements include $142,000 in unclaimed volume rebates and early-pay discounts over the past 18 months', 'Migrating eligible spend to P-card and implementing rebate tracking could generate $297,600/yr in recovered value'],
    changes: [
      { action: 'switch', item: 'Migrate AP spend to procurement card', from: 'Check/wire ($0 rebate)', to: 'P-card (1.8% rebate on $8.2M)', savings: 12300 },
      { action: 'increase', item: 'Implement rebate tracking and recovery', from: '$0 recovered', to: '$12,500/mo recovered', savings: 12500 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'Citi Commercial Card Program', detail: '1.8% rebate', note: 'Best fit: highest rebate tier for your spend volume, integrated expense management', recommended: true },
      { name: 'Bank of America Procurement Card', detail: '1.65% rebate', note: 'Strong reporting platform, Visa commercial network', recommended: false },
      { name: 'US Bank Corporate Payment Solutions', detail: '1.5% rebate + virtual cards', note: 'Virtual card capability for single-use supplier payments', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Analyze AP spend for P-card eligibility', description: 'Poseidon categorizes your $14.6M AP spend by vendor acceptance, transaction size, and payment term compatibility.', type: 'semi-auto', estimatedTime: '3-5 business days' },
      { step: 2, title: 'Negotiate P-card program with issuing bank', description: 'RFP to 3 commercial card issuers using Poseidon spend analytics. Procurement team evaluates rebate tiers and reporting capabilities.', type: 'manual', estimatedTime: '3-4 weeks' },
      { step: 3, title: 'Implement rebate tracking system', description: 'Configure automated monitoring of volume rebate thresholds and early-pay discount eligibility across top 50 vendor contracts.', type: 'semi-auto', estimatedTime: '2-3 weeks' },
      { step: 4, title: 'CFO approval and program rollout', description: 'Present business case to CFO with projected $297,600/yr recovery. Phase rollout over 90 days starting with top 20 vendors.', type: 'manual', estimatedTime: '2-4 weeks' },
    ],
    executionType: 'manual',
    factors: ['$8.2M/yr in P-card-eligible spend paid via check/wire creates a clear rebate forfeiture — 1.8% on this volume is $147,600/yr', 'Unclaimed volume rebates of $142,000 over 18 months indicate a systematic gap in vendor contract compliance monitoring', 'Poseidon clients who implemented P-card programs on eligible AP spend recovered an average of $22,400/mo in rebates and discounts'],
    cohortProof: '47 Poseidon enterprise clients who optimized procurement payments recovered an average of $22,400/mo in rebates and discounts',
    modelInfo: growModelInfo(8),
    dataSources: ['AP transaction analysis (18 months)', 'Vendor contract rebate clause extraction', 'P-card eligibility classification model', 'Cohort procurement optimization outcomes'],
  },
]

export const CANONICAL_RECOMMENDATIONS_SUMMARY = CANONICAL_RECOMMENDATION_DETAILS.map(r => ({
  rank: r.id,
  title: r.title,
  monthly: r.monthlySavings,
  annual: r.annualSavings,
  confidence: r.confidence,
}))

const EXECUTION_TO_DIFFICULTY: Record<ExecutionType, 'Easy' | 'Medium' | 'Hard'> = {
  auto: 'Easy',
  'semi-auto': 'Medium',
  manual: 'Hard',
  hybrid: 'Hard',
}

export const CANONICAL_RECOMMENDATIONS_FOR_LIST: RecommendationListItem[] = CANONICAL_RECOMMENDATION_DETAILS.map((r, i) => {
  const factorNames = r.factors.slice(0, 3)
  const totalFactors = factorNames.length
  const baseWeight = Math.round((1 / totalFactors) * 100) / 100
  return {
    id: r.id,
    rank: i + 1,
    title: r.title,
    description: r.dataBasis,
    category: r.category as 'Efficiency' | 'Risk Mitigation' | 'Revenue Growth',
    difficulty: EXECUTION_TO_DIFFICULTY[r.executionType],
    monthlySavings: r.monthlySavings,
    annualSavings: r.annualSavings,
    confidence: r.confidence,
    shapFactors: factorNames.map((name, j) => ({
      name: name.length > 40 ? name.slice(0, 37) + '...' : name,
      weight: j === 0 ? 1 - baseWeight * (totalFactors - 1) : baseWeight,
    })),
    evidence: r.cohortProof,
    modelVersion: `${r.modelInfo.name} v${r.modelInfo.version}`,
    auditId: r.modelInfo.auditId,
  }
})

// ─── Canonical Universe Export ───────────────────────────────────────────────

/** Inline B2B projected 3-year advantage (replaces grow-simulation-data import). */
const PROJECTED_3Y_ADVANTAGE_USD = 541_800

export const CANONICAL_UNIVERSE: CanonicalUniverseV1 = {
  schemaVersion: '1.1.0',
  generatedAt: '2026-03-19T14:30:00-04:00',
  metrics: {
    systemConfidence: DEMO_THREAD.systemConfidence,
    complianceScore: DEMO_THREAD.complianceScore,
    pendingActions: DEMO_THREAD.pendingActions,
    monthlyOptimizationCurrentUsd: DEMO_THREAD.monthlyOptimization,
    monthlyOptimizationPotentialUsd: RECOMMENDATIONS.reduce((s, r) => s + r.projectedBenefitUsd, 0),
    decisionsAuditedTotal: DEMO_THREAD.decisionsAudited,
    verifiedDecisions: VERIFIED_DECISIONS,
    pendingReviewDecisions: PENDING_REVIEW_DECISIONS,
    flaggedDecisions: FLAGGED_DECISIONS,
    liquidityReserve: {
      percent: DEMO_THREAD.liquidityReserve.percent,
      currentUsd: DEMO_THREAD.liquidityReserve.current,
      targetUsd: DEMO_THREAD.liquidityReserve.target,
    },
    engineBreakdown: { Protect: 4102, Grow: 3287, Execute: 1851, Govern: 1010 },
    platformProfileCount: 184_290,
    architecturalTrust: {
      autoExecutionsWithoutConsent: 0,
      auditCoveragePercent: 100,
      falsePositiveRate: 0.001,
      llmRetentionDays: 0,
      llmTrainingOptOut: true,
    },
    cohort: {
      recommendationAcceptanceRate: 0.89,
      avgMonthlySavingsUsd: 583,
      fraudTrend: {
        label: 'Counterparty risk incidents up 18% this quarter',
        changePercent: 18,
        period: 'Q1 2026',
        factors: [
          { label: 'New counterparty onboarding velocity', value: 0.82 },
          { label: 'Cross-border transaction complexity', value: 0.74 },
          { label: 'Regulatory jurisdiction changes', value: 0.68 },
        ],
      },
      cohortSize: 12847,
      projected3yAdvantageUsd: PROJECTED_3Y_ADVANTAGE_USD,
      protectPerformance: {
        riskIncidentsFlagged: 24,
        avgMonthlyExposureUsd: 280,
      },
    },
    councilMetrics: {
      falsePositiveReductionPercent: 34,
      recommendationChangedPercent: 22,
      modelDisagreementRate: 0.31,
      avgTimeToDecisionMinutes: 2.4,
      humanOverrideRate: 0.08,
      confidenceSpread: { min: 0.72, max: 0.97 },
    },
  },
  entities: {
    criticalAlert: {
      id: DEMO_THREAD.criticalAlert.id,
      amountUsd: DEMO_THREAD.criticalAlert.amount,
      counterparty: DEMO_THREAD.criticalAlert.counterparty,
      confidence: DEMO_THREAD.criticalAlert.confidence,
      clientName: 'Elias Vance',
      clientTier: 'VIP',
      transactionType: 'Wire transfer — offshore',
      signalId: DEMO_THREAD.criticalAlert.signalId ?? 'PRT-2026-0216-003',
    },
    protectThreats: PROTECT_THREATS,
    recommendations: RECOMMENDATIONS,
    executeActions: EXECUTE_ACTIONS,
    governAuditEntries: GOVERN_AUDIT_ENTRIES,
    dashboardActivities: DASHBOARD_ACTIVITIES,
    events: CANONICAL_EVENTS,
  },
  relations: {
    alertToAction: {
      [DEMO_THREAD.criticalAlert.id]: ['EXE-001'],
    },
    recommendationToAction: {
      'REC-001': ['EXE-002', 'EXE-005'],
    },
    actionToDecision: {
      'EXE-001': ['GV-2026-0319-846'],
      'EXE-002': ['GV-2026-0319-847'],
      'EXE-003': ['GV-2026-0317-841'],
      'EXE-004': ['GV-2026-0319-844'],
      'EXE-005': ['GV-2026-0319-848'],
    },
    eventToChildren: Object.fromEntries(
      CANONICAL_EVENTS.map((e) => [e.id, e.children]),
    ),
  },
}

function formatUsd(value: number): string {
  return `$${value.toLocaleString()}`
}
