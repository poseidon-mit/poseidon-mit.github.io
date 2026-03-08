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
  ProtectThreatEntity,
  RecommendationEntity,
} from './types'

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
  },
  {
    id: 'REC-002',
    title: 'Tax-loss harvesting — Q1 realized gains offset',
    projectedBenefitUsd: 8400,
    annualBenefitUsd: 100800,
    confidence: 0.88,
    alternativeType: 'hedge',
  },
  {
    id: 'REC-003',
    title: 'FX hedging — EUR exposure reduction',
    projectedBenefitUsd: 4200,
    annualBenefitUsd: 50400,
    confidence: 0.82,
    alternativeType: 'hedge',
  },
  {
    id: 'REC-004',
    title: 'Fee restructure — custody fee renegotiation',
    projectedBenefitUsd: 3500,
    annualBenefitUsd: 42000,
    confidence: 0.91,
    alternativeType: 'restructure',
  },
  {
    id: 'REC-005',
    title: 'Credit line optimization — margin utilization',
    projectedBenefitUsd: 2800,
    annualBenefitUsd: 33600,
    confidence: 0.85,
    alternativeType: 'lending',
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

const GOVERN_AUDIT_ENTRIES: GovernAuditEntryEntity[] = [
  {
    id: 'GV-2026-0319-848',
    timestampIso: '2026-03-19T14:29:00-04:00',
    type: 'Execute',
    action: 'Credit facility disbursement authorized',
    confidence: 0.96,
    evidence: 6,
    status: 'Verified',
  },
  {
    id: 'GV-2026-0319-847',
    timestampIso: '2026-03-19T14:28:00-04:00',
    type: 'Execute',
    action: 'Margin account setup — Vance',
    confidence: 0.94,
    evidence: 12,
    status: 'Verified',
  },
  {
    id: 'GV-2026-0319-846',
    timestampIso: '2026-03-19T14:15:00-04:00',
    type: 'Protect',
    action: `AML flag — $2.5M wire to ${DEMO_THREAD.criticalAlert.counterparty}`,
    confidence: DEMO_THREAD.criticalAlert.confidence,
    evidence: 9,
    status: 'Verified',
  },
  {
    id: 'GV-2026-0319-845',
    timestampIso: '2026-03-19T13:52:00-04:00',
    type: 'Grow',
    action: 'Securities-backed lending alternative proposed',
    confidence: 0.93,
    evidence: 7,
    status: 'Verified',
  },
  {
    id: 'GV-2026-0319-844',
    timestampIso: '2026-03-19T11:20:00-04:00',
    type: 'Execute',
    action: 'Quarterly compliance filing queued',
    confidence: 0.78,
    evidence: 5,
    status: 'Pending review',
  },
  {
    id: 'GV-2026-0318-843',
    timestampIso: '2026-03-18T16:42:00-04:00',
    type: 'Protect',
    action: 'Unusual client behavior — rapid position unwinding',
    confidence: 0.92,
    evidence: 10,
    status: 'Verified',
  },
  {
    id: 'GV-2026-0318-842',
    timestampIso: '2026-03-18T10:18:00-04:00',
    type: 'Grow',
    action: 'Fee restructure — custody fee optimization',
    confidence: 0.91,
    evidence: 6,
    status: 'Verified',
  },
  {
    id: 'GV-2026-0317-841',
    timestampIso: '2026-03-17T14:12:00-04:00',
    type: 'Execute',
    action: 'Portfolio rebalance — Chen account',
    confidence: 0.89,
    evidence: 8,
    status: 'Verified',
  },
  {
    id: 'GV-2026-0317-840',
    timestampIso: '2026-03-17T09:40:00-04:00',
    type: 'Govern',
    action: 'Policy threshold recalibration',
    confidence: 0.97,
    evidence: 15,
    status: 'Verified',
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
