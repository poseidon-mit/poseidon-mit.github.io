export type EngineName = 'Protect' | 'Grow' | 'Execute' | 'Govern'
export type ExecuteEngineName = 'Protect' | 'Grow' | 'Execute'

export type UrgencyLevel = 'high' | 'medium' | 'low'

export type ExecutionType = 'auto' | 'semi-auto' | 'manual' | 'hybrid'
export type ExecuteCategory = 'protection' | 'savings' | 'investment' | 'compliance' | 'rebalance'
export type ExecuteStepActor = 'agent' | 'user'
export type ExecuteStepStatus = 'completed' | 'current' | 'waiting' | 'blocked'

export interface ExecutionStep {
  id: string
  label: string
  description: string
  actor: ExecuteStepActor
  status: ExecuteStepStatus
  requiresConsent: boolean
  estimatedDuration?: string
}

export type DecisionStatus = 'Verified' | 'Pending review' | 'Flagged'

// ─── B2B Entity Types ───────────────────────────────────────────────────────

export type ClientTier = 'VIP' | 'Standard'
export type AlternativeType = 'lending' | 'restructure' | 'hedge' | 'compliance'

export interface CriticalAlertEntity {
  id: string
  amountUsd: number
  counterparty: string
  confidence: number
  clientName: string
  clientTier: ClientTier
  transactionType: string
  signalId: string
}

export interface ProtectThreatEntity {
  id: string
  counterparty: string
  amountUsd: number
  confidence: number
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  description: string
  relativeTime: string
  sortOrder: number
  compositePriority: number
  clientName?: string
  regulatoryFlag?: string
}

export interface RecommendationEntity {
  id: string
  title: string
  projectedBenefitUsd: number
  annualBenefitUsd: number
  confidence: number
  alternativeType: AlternativeType
}

export interface ExecuteActionFactor {
  label: string
  value: number
}

export interface ExecuteActionEntity {
  id: string
  title: string
  engine: ExecuteEngineName
  amountLabel: string
  confidence: number
  timestampLabel: string
  description: string
  urgency: UrgencyLevel
  impact: {
    approved: string
    deferred: string
  }
  reversible: boolean
  expiresIn: string | null
  factors: ExecuteActionFactor[]
  executionType: ExecutionType
  category: ExecuteCategory
  steps: ExecutionStep[]
  sourceEngine: ExecuteEngineName
  sourceEntityId?: string
  rollbackWindowHours?: number
  riskTier: 1 | 2
  compositePriority: number
}

export interface GovernLedgerEntryEntity {
  id: string
  type: EngineName
  action: string
  confidence: number
  timestampIso: string
  status?: Extract<DecisionStatus, 'Pending review' | 'Flagged'>
}

export interface GovernAuditEntryEntity {
  id: string
  timestampIso: string
  type: EngineName
  action: string
  confidence: number
  evidence: number
  status: DecisionStatus
}

export interface DashboardActivityEntity {
  id: string
  kind: 'protect' | 'grow' | 'execute' | 'govern' | 'system'
  label: string
  relativeTime: string
}

export interface CohortFraudTrendData {
  label: string
  changePercent: number
  period: string
  factors: Array<{ label: string; value: number }>
}

export interface ProtectPerformance {
  riskIncidentsFlagged: number
  avgMonthlyExposureUsd: number
}

export interface CohortMetrics {
  recommendationAcceptanceRate: number
  avgMonthlySavingsUsd: number
  fraudTrend: CohortFraudTrendData
  cohortSize: number
  projected3yAdvantageUsd: number
  protectPerformance: ProtectPerformance
}

export interface ArchitecturalTrust {
  autoExecutionsWithoutConsent: number
  auditCoveragePercent: number
  falsePositiveRate: number
  llmRetentionDays: number
  llmTrainingOptOut: boolean
}

// ─── Decision Council Metrics ───────────────────────────────────────────────

export interface CouncilMetrics {
  falsePositiveReductionPercent: number
  recommendationChangedPercent: number
  modelDisagreementRate: number
  avgTimeToDecisionMinutes: number
  humanOverrideRate: number
  confidenceSpread: { min: number; max: number }
}

// ─── Event Entity + Deliberation ────────────────────────────────────────────

export type EventStatus = 'active' | 'resolved' | 'escalated'

export interface EventChildren {
  threats: string[]
  alternatives: string[]
  actions: string[]
  auditEntries: string[]
}

export interface CanonicalEvent {
  id: string
  title: string
  clientName: string
  clientTier: ClientTier
  timestampIso: string
  status: EventStatus
  children: EventChildren
  deliberationTraces: DeliberationTrace[]
}

export type DeliberationPosition = 'support' | 'oppose' | 'modify'

export interface DeliberationRound {
  roleId: string
  modelId: string
  position: DeliberationPosition
  argument: string
  confidence: number
  factors: Array<{ label: string; weight: number }>
}

export interface DeliberationConsensus {
  score: number
  adoptedModelId: string
  rationale: string
}

export interface DeliberationTrace {
  id: string
  eventId: string
  rounds: DeliberationRound[]
  consensus: DeliberationConsensus
}

// ─── Priority Queue ─────────────────────────────────────────────────────────

export type PriorityKind = 'threat' | 'action' | 'audit'

export interface PriorityItem {
  kind: PriorityKind
  engine: EngineName
  compositePriority: number
  item: ProtectThreatEntity | ExecuteActionEntity | GovernAuditEntryEntity
  eventId?: string
}

// ─── Canonical Universe ─────────────────────────────────────────────────────

export interface CanonicalUniverseV1 {
  schemaVersion: '1.1.0'
  generatedAt: string
  metrics: {
    systemConfidence: number
    complianceScore: number
    pendingActions: number
    monthlyOptimizationCurrentUsd: number
    monthlyOptimizationPotentialUsd: number
    decisionsAuditedTotal: number
    verifiedDecisions: number
    pendingReviewDecisions: number
    flaggedDecisions: number
    liquidityReserve: {
      percent: number
      currentUsd: number
      targetUsd: number
    }
    engineBreakdown: Record<'Protect' | 'Grow' | 'Execute' | 'Govern', number>
    platformProfileCount: number
    cohort: CohortMetrics
    architecturalTrust: ArchitecturalTrust
    councilMetrics: CouncilMetrics
  }
  entities: {
    criticalAlert: CriticalAlertEntity
    protectThreats: ProtectThreatEntity[]
    recommendations: RecommendationEntity[]
    executeActions: ExecuteActionEntity[]
    governAuditEntries: GovernAuditEntryEntity[]
    dashboardActivities: DashboardActivityEntity[]
    events: CanonicalEvent[]
  }
  relations: {
    alertToAction: Record<string, string[]>
    recommendationToAction: Record<string, string[]>
    actionToDecision: Record<string, string[]>
    eventToChildren: Record<string, EventChildren>
  }
}
