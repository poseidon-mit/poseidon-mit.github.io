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

export interface CriticalAlertEntity {
  id: string
  amountUsd: number
  merchant: string
  confidence: number
  cardLast4: string
  signalId: string
}

export interface ProtectThreatEntity {
  id: string
  merchant: string
  amountUsd: number
  confidence: number
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  description: string
  relativeTime: string
  sortOrder: number
}

export interface RecommendationEntity {
  id: string
  title: string
  monthlySavingsUsd: number
  annualSavingsUsd: number
  confidence: number
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

export interface CanonicalUniverseV1 {
  schemaVersion: '1.1.0'
  generatedAt: string
  metrics: {
    systemConfidence: number
    complianceScore: number
    pendingActions: number
    monthlySavingsCurrentUsd: number
    monthlySavingsPotentialUsd: number
    decisionsAuditedTotal: number
    verifiedDecisions: number
    pendingReviewDecisions: number
    flaggedDecisions: number
    emergencyFund: {
      percent: number
      currentUsd: number
      targetUsd: number
    }
    engineBreakdown: Record<'Protect' | 'Grow' | 'Execute' | 'Govern', number>
    platformProfileCount: number
    cohort: CohortMetrics
    architecturalTrust: ArchitecturalTrust
  }
  entities: {
    criticalAlert: CriticalAlertEntity
    protectThreats: ProtectThreatEntity[]
    recommendations: RecommendationEntity[]
    executeActions: ExecuteActionEntity[]
    governAuditEntries: GovernAuditEntryEntity[]
    dashboardActivities: DashboardActivityEntity[]
  }
  relations: {
    alertToAction: Record<string, string[]>
    recommendationToAction: Record<string, string[]>
    actionToDecision: Record<string, string[]>
  }
}
