import {
  CANONICAL_UNIVERSE,
  CANONICAL_GROWTH_SIMULATION_DATA,
  CANONICAL_PROJECTED_3Y_ADVANTAGE,
  CANONICAL_RECOMMENDATION_DETAILS,
  CANONICAL_RECOMMENDATIONS_SUMMARY,
  CANONICAL_RECOMMENDATIONS_FOR_LIST,
} from './canonical'
import { ENGINE_COLOR_MAP, type EngineLabel } from '@/lib/engine-color-map'
import { formatDemoTimestamp } from '@/lib/demo-date'
import type {
  AccountEntity,
  CanonicalBalanceSheet,
  CanonicalUniverseV1,
  CanonicalEvent,
  DeliberationTrace,
  EngineName,
  EventChildren,
  ExecuteEngineName,
  ExecuteActionEntity,
  ExecutionType,
  GoalEntity,
  GovernAuditEntryEntity,
  GovernLedgerEntryEntity,
  GrowthSimulationPoint,
  PriorityItem,
  ProtectThreatEntity,
  RecommendationDetail,
  RecommendationListItem,
  ThreatFactor,
  ThreatTiming,
  DecisionStatus,
  UrgencyLevel,
} from './types'

export function getCanonicalUniverse(): CanonicalUniverseV1 {
  return CANONICAL_UNIVERSE
}

export function selectDashboardView(pendingActionsOverride?: number) {
  const universe = getCanonicalUniverse()
  return {
    systemConfidence: universe.metrics.systemConfidence,
    complianceScore: universe.metrics.complianceScore,
    pendingActions:
      typeof pendingActionsOverride === 'number'
        ? pendingActionsOverride
        : universe.metrics.pendingActions,
    monthlyOptimizationCurrentUsd: universe.metrics.monthlyOptimizationCurrentUsd,
    monthlyOptimizationPotentialUsd: universe.metrics.monthlyOptimizationPotentialUsd,
    recommendationCount: universe.entities.recommendations.length,
    criticalAlert: universe.entities.criticalAlert,
    activities: universe.entities.dashboardActivities,
  }
}

export function selectProtectThreats(): ProtectThreatEntity[] {
  return getCanonicalUniverse().entities.protectThreats
}

export function selectCriticalAlert() {
  return getCanonicalUniverse().entities.criticalAlert
}

export function selectGrowLiquidityReserveView() {
  return getCanonicalUniverse().metrics.liquidityReserve
}


export function selectExecuteActionsView(): ExecuteActionEntity[] {
  return getCanonicalUniverse().entities.executeActions
}

export function selectExecuteSavingsView() {
  const universe = getCanonicalUniverse()
  return {
    currentMonthlySavingsUsd: universe.metrics.monthlyOptimizationCurrentUsd,
    potentialMonthlySavingsUsd: universe.metrics.monthlyOptimizationPotentialUsd,
  }
}

export function selectExecuteActionById(actionId: string): ExecuteActionEntity | undefined {
  return getCanonicalUniverse().entities.executeActions.find((a) => a.id === actionId)
}

export function selectExecuteQueueStats() {
  const actions = getCanonicalUniverse().entities.executeActions
  const byUrgency: Record<UrgencyLevel, number> = { high: 0, medium: 0, low: 0 }
  const byType: Record<ExecutionType, number> = { auto: 0, 'semi-auto': 0, manual: 0, hybrid: 0 }
  for (const a of actions) {
    byUrgency[a.urgency]++
    byType[a.executionType]++
  }
  return {
    total: actions.length,
    byUrgency,
    byType,
    potentialSavingsUsd: getCanonicalUniverse().metrics.monthlyOptimizationPotentialUsd,
  }
}

export function selectGovernSummaryView() {
  const universe = getCanonicalUniverse()
  return {
    complianceScore: universe.metrics.complianceScore,
    decisionsAuditedTotal: universe.metrics.decisionsAuditedTotal,
    verifiedDecisions: universe.metrics.verifiedDecisions,
    pendingReviewDecisions: universe.metrics.pendingReviewDecisions,
    flaggedDecisions: universe.metrics.flaggedDecisions,
  }
}

export function selectGovernLedgerPreview(): GovernLedgerEntryEntity[] {
  return getCanonicalUniverse().entities.governAuditEntries.map((e) => ({
    id: e.id,
    type: e.type,
    action: e.action,
    confidence: e.confidence,
    timestampIso: e.timestampIso,
    status: e.status === 'Verified' ? undefined : e.status,
  }))
}

export function selectGovernAuditEntries(): GovernAuditEntryEntity[] {
  return getCanonicalUniverse().entities.governAuditEntries
}

export function selectGovernAuditSummaryView() {
  const universe = getCanonicalUniverse()
  const total = universe.metrics.decisionsAuditedTotal
  const verified = universe.metrics.verifiedDecisions
  const pending = universe.metrics.pendingReviewDecisions
  const flagged = universe.metrics.flaggedDecisions

  return {
    total,
    verified,
    pending,
    flagged,
    verifiedPercent: Math.round((verified / total) * 100),
    pendingPercent: Math.round((pending / total) * 100),
    flaggedPercent: Math.round((flagged / total) * 100),
    complianceScore: universe.metrics.complianceScore,
  }
}

export function selectGovernEngineBreakdown() {
  const { engineBreakdown } = getCanonicalUniverse().metrics
  const total = Object.values(engineBreakdown).reduce((s, n) => s + n, 0)
  return Object.entries(engineBreakdown).map(([engine, count]) => ({
    engine,
    count,
    percent: Math.round((count / total) * 100),
    color: ENGINE_COLOR_MAP[engine as EngineLabel],
  }))
}

/* ── Audit Chain Selector ── */

export interface AlertAuditChain {
  alertId: string
  actionId: string
  decisionId: string
}

/**
 * Resolve an unambiguous audit chain: alert → action → decision.
 * Returns null if the alert has no relations, or if it fans out to
 * multiple actions or decisions (ambiguous chain).
 */
export function selectAlertAuditChain(alertId: string): AlertAuditChain | null {
  const universe = getCanonicalUniverse()
  const actionIds = universe.relations.alertToAction[alertId]
  if (!actionIds || actionIds.length !== 1) return null
  const actionId = actionIds[0]
  const decisionIds = universe.relations.actionToDecision[actionId]
  if (!decisionIds || decisionIds.length !== 1) return null
  return { alertId, actionId, decisionId: decisionIds[0] }
}

export function selectExecuteActionAuditDecisionId(actionId: string): string | null {
  return getCanonicalUniverse().relations.actionToDecision[actionId]?.[0] ?? null
}

export function selectRecommendationAuditDecisionId(recommendationId: string): string | null {
  const actionId = getCanonicalUniverse().relations.recommendationToAction[recommendationId]?.[0]
  if (!actionId) return null
  return selectExecuteActionAuditDecisionId(actionId)
}

export function selectCohortMetrics() {
  return getCanonicalUniverse().metrics.cohort
}

export function selectProtectPerformance() {
  return getCanonicalUniverse().metrics.cohort.protectPerformance
}

export function selectPlatformProfileCount() {
  return getCanonicalUniverse().metrics.platformProfileCount
}

export function selectArchitecturalTrust() {
  return getCanonicalUniverse().metrics.architecturalTrust
}

/* ── Financial Health Score ── */

import type { EngineName as TokenEngineName } from '@/lib/engine-tokens'

export interface FinancialHealthBreakdown {
  engine: TokenEngineName
  weight: number
  value: number
}

export function computeFinancialHealthScore(overrides: {
  activeThreats: number
  totalThreats: number
  pendingActions: number
  totalActions: number
}): { score: number; breakdown: FinancialHealthBreakdown[] } {
  const universe = getCanonicalUniverse()

  const protectScore = overrides.totalThreats === 0
    ? 100
    : (1 - overrides.activeThreats / overrides.totalThreats) * 100

  const potentialUsd = universe.metrics.monthlyOptimizationPotentialUsd
  const currentUsd = universe.metrics.monthlyOptimizationCurrentUsd
  const growScore = potentialUsd === 0
    ? 100
    : (currentUsd / potentialUsd) * 100

  const executeScore = overrides.totalActions === 0
    ? 100
    : ((overrides.totalActions - overrides.pendingActions) / overrides.totalActions) * 100

  const governScore = universe.metrics.complianceScore

  const breakdown: FinancialHealthBreakdown[] = [
    { engine: 'protect' as TokenEngineName, weight: 0.3, value: protectScore },
    { engine: 'grow' as TokenEngineName, weight: 0.3, value: growScore },
    { engine: 'execute' as TokenEngineName, weight: 0.2, value: executeScore },
    { engine: 'govern' as TokenEngineName, weight: 0.2, value: governScore },
  ]

  const score = breakdown.reduce((sum, b) => sum + b.weight * b.value, 0)

  return { score: Math.round(score * 10) / 10, breakdown }
}

/* ── Cross-Engine Chain Selector ── */

export type CrossEngineChain =
  | {
      origin: 'alert'
      alertId: string
      actionId: string
      decisionId: string | null
    }
  | {
      origin: 'recommendation'
      recommendationId: string
      actionId: string
      decisionId: string | null
    }

/**
 * Returns all cross-engine chains from the canonical universe.
 * Covers both alertToAction and recommendationToAction relations.
 * decisionId is null if the action has no resolved decision yet.
 */
export function selectCrossEngineChains(): CrossEngineChain[] {
  const universe = getCanonicalUniverse()
  const { alertToAction, recommendationToAction, actionToDecision } = universe.relations

  const chains: CrossEngineChain[] = []

  for (const [alertId, actionIds] of Object.entries(alertToAction)) {
    for (const actionId of actionIds) {
      const decisionIds = actionToDecision[actionId]
      chains.push({
        origin: 'alert',
        alertId,
        actionId,
        decisionId: decisionIds?.[0] ?? null,
      })
    }
  }

  for (const [recommendationId, actionIds] of Object.entries(recommendationToAction)) {
    for (const actionId of actionIds) {
      const decisionIds = actionToDecision[actionId]
      chains.push({
        origin: 'recommendation',
        recommendationId,
        actionId,
        decisionId: decisionIds?.[0] ?? null,
      })
    }
  }

  return chains
}

/* ── Event Selectors (Phase 0B) ── */

export function selectEventById(eventId: string): CanonicalEvent | null {
  return getCanonicalUniverse().entities.events.find((e) => e.id === eventId) ?? null
}

export function selectEventChildren(eventId: string): EventChildren | null {
  return getCanonicalUniverse().relations.eventToChildren[eventId] ?? null
}

export function selectDeliberationTrace(eventId: string): DeliberationTrace | null {
  const event = selectEventById(eventId)
  if (!event) return null
  return event.deliberationTraces[0] ?? null
}

/**
 * Unified cross-engine priority queue.
 * Merges threats + actions + pending audit entries, sorted by compositePriority descending.
 */
export function selectPriorityQueue(): PriorityItem[] {
  const universe = getCanonicalUniverse()
  const items: PriorityItem[] = []

  for (const threat of universe.entities.protectThreats) {
    const eventId = Object.entries(universe.relations.eventToChildren).find(
      ([, children]) => children.threats.includes(threat.id),
    )?.[0]
    items.push({
      kind: 'threat',
      engine: 'Protect',
      compositePriority: threat.compositePriority,
      item: threat,
      eventId,
    })
  }

  for (const action of universe.entities.executeActions) {
    const eventId = Object.entries(universe.relations.eventToChildren).find(
      ([, children]) => children.actions.includes(action.id),
    )?.[0]
    items.push({
      kind: 'action',
      engine: 'Execute',
      compositePriority: action.compositePriority,
      item: action,
      eventId,
    })
  }

  for (const audit of universe.entities.governAuditEntries) {
    if (audit.status === 'Verified') continue
    items.push({
      kind: 'audit',
      engine: 'Govern',
      compositePriority: audit.compositePriority,
      item: audit,
    })
  }

  return items.sort((a, b) => b.compositePriority - a.compositePriority)
}

/**
 * Visual tier based on composite priority score, not raw severity.
 */
export function selectVisualTier(item: { compositePriority: number }): 'attention' | 'monitoring' {
  return item.compositePriority >= 60 ? 'attention' : 'monitoring'
}

/**
 * Event-level audit chain. Replaces selectAlertAuditChain for event-based traversal.
 */
export function selectEventAuditChain(eventId: string) {
  const event = selectEventById(eventId)
  if (!event) return null
  return {
    eventId,
    threats: event.children.threats,
    alternatives: event.children.alternatives,
    actions: event.children.actions,
    auditEntries: event.children.auditEntries,
    deliberation: event.deliberationTraces[0] ?? null,
  }
}

export function selectCouncilMetrics() {
  return getCanonicalUniverse().metrics.councilMetrics
}

/* ── Spotlight Selectors ── */

export function selectSpotlightThreat(): ProtectThreatEntity | null {
  const threats = selectProtectThreats()
  if (threats.length === 0) return null
  return threats.reduce((best, t) => (t.compositePriority > best.compositePriority ? t : best))
}

export function selectGrowRecommendations(): RecommendationListItem[] {
  return [...CANONICAL_RECOMMENDATIONS_FOR_LIST].sort((a, b) => {
    const aPri = getCanonicalUniverse().entities.recommendations.find(r => r.id === String(a.id))?.compositePriority ?? 0
    const bPri = getCanonicalUniverse().entities.recommendations.find(r => r.id === String(b.id))?.compositePriority ?? 0
    return bPri - aPri
  })
}

export function selectSpotlightRecommendation(): RecommendationListItem | null {
  const items = selectGrowRecommendations()
  return items[0] ?? null
}

export function selectSpotlightAction(): ExecuteActionEntity | null {
  const actions = selectExecuteActionsView()
  if (actions.length === 0) return null
  return actions.reduce((best, a) => (a.compositePriority > best.compositePriority ? a : best))
}

export function selectSpotlightAuditEntry(): GovernAuditEntryEntity | null {
  const entries = selectGovernAuditEntries().filter(e => e.status !== 'Verified')
  if (entries.length === 0) return null
  return entries.reduce((best, e) => (e.compositePriority > best.compositePriority ? e : best))
}

/* ── Spotlight Context — Unified Output Shape (Phase 0 Precision) ── */

export type SpotlightKind = 'threat' | 'recommendation' | 'action' | 'audit'

export interface SpotlightContext {
  hook: string
  engine: EngineName
  urgency: 'critical' | 'high' | 'medium' | 'low'
  evidence: string[]
}

export interface SpotlightItem {
  kind: SpotlightKind
  context: SpotlightContext
  compositePriority: number
  entityId: string
}

export function selectEngineSpotlight(engine: EngineName): SpotlightItem | null {
  switch (engine) {
    case 'Protect': {
      const t = selectSpotlightThreat()
      if (!t) return null
      return {
        kind: 'threat',
        context: {
          hook: `${t.severity} threat: ${t.counterparty}`,
          engine: 'Protect',
          urgency: mapSeverityToUrgency(t.severity),
          evidence: (t.factors ?? []).slice(0, 3).map(f => f.title),
        },
        compositePriority: t.compositePriority,
        entityId: t.id,
      }
    }
    case 'Grow': {
      const r = selectSpotlightRecommendation()
      if (!r) return null
      const entity = getCanonicalUniverse().entities.recommendations
        .find(e => e.id === String(r.id))
      return {
        kind: 'recommendation',
        context: {
          hook: r.title,
          engine: 'Grow',
          urgency: (entity?.compositePriority ?? 0) >= 60 ? 'high' : 'medium',
          evidence: r.evidence ? [r.evidence] : [],
        },
        compositePriority: entity?.compositePriority ?? 0,
        entityId: String(r.id),
      }
    }
    case 'Execute': {
      const a = selectSpotlightAction()
      if (!a) return null
      return {
        kind: 'action',
        context: {
          hook: a.title,
          engine: 'Execute',
          urgency: a.urgency,
          evidence: a.factors.slice(0, 3).map(f => f.label),
        },
        compositePriority: a.compositePriority,
        entityId: a.id,
      }
    }
    case 'Govern': {
      const e = selectSpotlightAuditEntry()
      if (!e) return null
      return {
        kind: 'audit',
        context: {
          hook: `${e.status}: ${e.action}`,
          engine: 'Govern',
          urgency: e.compositePriority >= 60 ? 'high' : 'medium',
          evidence: [`Confidence: ${e.confidence}%`],
        },
        compositePriority: e.compositePriority,
        entityId: e.id,
      }
    }
    default:
      return null
  }
}

export function selectAllEngineSpotlights(): SpotlightItem[] {
  const engines: EngineName[] = ['Protect', 'Grow', 'Execute', 'Govern']
  return engines
    .map(e => selectEngineSpotlight(e))
    .filter((s): s is SpotlightItem => s !== null)
    .sort((a, b) => b.compositePriority - a.compositePriority)
}

function mapSeverityToUrgency(severity: string): SpotlightContext['urgency'] {
  switch (severity) {
    case 'Critical': return 'critical'
    case 'High': return 'high'
    case 'Medium': return 'medium'
    default: return 'low'
  }
}

/* ── Evidence Selectors ── */

export function selectThreatFactors(threatId: string): ThreatFactor[] {
  const threat = selectProtectThreats().find(t => t.id === threatId)
  return threat?.factors ?? []
}

export function selectThreatTiming(threatId: string): ThreatTiming | null {
  const threat = selectProtectThreats().find(t => t.id === threatId)
  return threat?.timing ?? null
}

/* ── Grow Data Selectors ── */

export function selectGrowSimulationData(): GrowthSimulationPoint[] {
  return CANONICAL_GROWTH_SIMULATION_DATA
}

export function selectProjected3yAdvantage(): number {
  return CANONICAL_PROJECTED_3Y_ADVANTAGE
}

export function selectRecommendationDetails(): RecommendationDetail[] {
  return CANONICAL_RECOMMENDATION_DETAILS
}

export function selectRecommendationsSummary() {
  return CANONICAL_RECOMMENDATIONS_SUMMARY
}

export function selectRecommendationListItems(): RecommendationListItem[] {
  return CANONICAL_RECOMMENDATIONS_FOR_LIST
}

/* ── Formatting Utilities ── */

export function formatUsd(value: number): string {
  return `$${value.toLocaleString()}`
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`
}

/* ── Account & Balance Sheet Selectors ── */

export function selectAccounts(): AccountEntity[] {
  return getCanonicalUniverse().entities.accounts
}

export function selectBalanceSheet(): CanonicalBalanceSheet {
  return getCanonicalUniverse().balanceSheet
}

export function selectGoals(): GoalEntity[] {
  return getCanonicalUniverse().entities.goals
}

export function selectAccountByLast4(last4: string): AccountEntity | undefined {
  return getCanonicalUniverse().entities.accounts.find(a => a.last4 === last4)
}

/* ── Cohort Headlines ── */

export function selectCohortHeadlines() {
  return getCanonicalUniverse().metrics.cohortHeadlines
}

type ExecuteActionStateLike = Record<string, { status: string } | undefined>

function isPendingExecuteAction(
  action: ExecuteActionEntity,
  actionStates?: ExecuteActionStateLike,
) {
  return (actionStates?.[action.id]?.status ?? 'pending') === 'pending'
}

function buildDashboardSparkline(
  netWorth: number,
  monthlyIncome: number,
  projected3yAdvantageUsd: number,
) {
  const lift = Math.round(projected3yAdvantageUsd / 12)
  return [
    netWorth - monthlyIncome * 0.75,
    netWorth - monthlyIncome * 0.58,
    netWorth - monthlyIncome * 0.42,
    netWorth - monthlyIncome * 0.3,
    netWorth - monthlyIncome * 0.12,
    netWorth + lift,
  ]
}

function pickSeverityThreat<T extends Pick<ProtectThreatEntity, 'id' | 'severity' | 'confidence'>>(
  threats: T[],
) {
  const severityOrder: Record<ProtectThreatEntity['severity'], number> = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  }

  if (threats.length === 0) return null

  return threats.reduce((best, threat) => {
    const severityCmp = severityOrder[threat.severity] - severityOrder[best.severity]
    if (severityCmp !== 0) return severityCmp > 0 ? threat : best
    const confidenceCmp = threat.confidence - best.confidence
    if (confidenceCmp !== 0) return confidenceCmp > 0 ? threat : best
    return threat.id < best.id ? threat : best
  })
}

export interface DashboardHeroView {
  netWorth: number
  netWorthChange: number
  netWorthChangePercent: number
  assets: number
  liabilities: number
  monthlyCashFlow: number
  sparklineData: number[]
  healthScore: number
  healthBreakdown: FinancialHealthBreakdown[]
  protectSignal: {
    threatCount: number
    topAmount: string
    topCounterparty: string
    severity: string
    attentionItems: { label: string; href: string }[]
  } | null
  growSignal: {
    savingsPerMonth: number
    recCount: number
    topTitle: string
    attentionItems: { label: string; href: string }[]
  } | null
  executeSignal: {
    pendingCount: number
    topTitle: string
    topAmount: string
    attentionItems: { label: string; href: string }[]
  } | null
  decisionsAudited: number
  complianceScore: number
}

export interface ProtectHeroAttentionView {
  mode: 'attention'
  alert: {
    id: string
    counterparty: string
    amount: string
    confidence: number
    severity: ProtectThreatEntity['severity']
    description: string
    time: string
  }
  radarAxes: {
    label: string
    value: number
    maxValue: number
    color?: string
  }[]
  shapFactors: { label: string; weight: number; mitigating: boolean }[]
  auditChain: AlertAuditChain | null
  remainingCount: number
  totalExposure: number
  fpRate: string
}

export interface ProtectHeroMonitoringView {
  mode: 'monitoring'
  activeCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  resolvedCount: number
  fpRate: string
  modelUpdate: string
  topAlert: {
    id: string
    counterparty: string
    severity: ProtectThreatEntity['severity']
  } | null
}

export type ProtectHeroView = ProtectHeroAttentionView | ProtectHeroMonitoringView

export interface GrowHeroView {
  projectedGain: number
  totalMonthlySavings: number
  avgConfidence: number
  recommendationCount: number
  simulationData: GrowthSimulationPoint[]
  spotlightRec: {
    title: string
    monthlySavings: number
    confidence: number
  } | null
  goals: {
    id: string
    title: string
    currentUsd: number
    targetUsd: number
  }[]
  cohortHeadline?: string
}

export interface ExecuteHeroView {
  queueTotal: number
  urgentCount: number
  agentStepsCompleted: number
  agentStepsTotal: number
  featuredAction: {
    id: string
    title: string
    amountLabel: string
    confidence: number
    engine: ExecuteEngineName
    sourceEngine: ExecuteEngineName
    expiresIn: string | null
    rollbackHours: number | null
    executionType?: ExecutionType
    riskTier?: 1 | 2
  } | null
  engineSources: {
    engine: ExecuteEngineName
    count: number
    color: string
  }[]
  urgencyBreakdown: { high: number; medium: number; low: number }
  currentSavingsUsd: number
  potentialSavingsUsd: number
  pendingQueue: { id: string; title: string }[]
}

export interface GovernHeroView {
  decisionsAudited: number
  engineBreakdown: { engine: string; count: number; percent: number; color: string }[]
  auditEntries: {
    id: string
    engine: string
    engineColor: string
    action: string
    confidence: number
    time: string
    status: DecisionStatus
    modelVersion: string
    topFactor: string
  }[]
  errorCount: number
  statusBreakdown: { verified: number; pending: number; flagged: number }
  trustGuarantees: {
    autoExecutionsWithoutConsent: number
    auditCoveragePercent: number
    llmTrainingOptOut: boolean
  }
  spotlightEntry: { id: string; action: string; status: DecisionStatus; confidence: number } | null
}

export function selectPendingExecuteActions(actionStates?: ExecuteActionStateLike): ExecuteActionEntity[] {
  return selectExecuteActionsView().filter((action) => isPendingExecuteAction(action, actionStates))
}

export function selectDashboardHeroView(actionStates?: ExecuteActionStateLike): DashboardHeroView {
  const balanceSheet = selectBalanceSheet()
  const cohort = selectCohortMetrics()
  const recommendations = selectRecommendationsSummary()
  const spotlightThreat = selectSpotlightThreat()
  const spotlightRecommendation = selectSpotlightRecommendation()
  const pendingActions = selectPendingExecuteActions(actionStates)
  const spotlightAction = selectSpotlightAction()
  const featuredAction = spotlightAction
    ? pendingActions.find((action) => action.id === spotlightAction.id) ?? pendingActions[0] ?? null
    : pendingActions[0] ?? null
  const governSummary = selectGovernSummaryView()
  const trust = selectArchitecturalTrust()
  const activeThreats = selectProtectThreats().filter((threat) => threat.status !== 'resolved')
  const { score, breakdown } = computeFinancialHealthScore({
    activeThreats: spotlightThreat ? 1 : 0,
    totalThreats: Math.max(activeThreats.length, 1),
    pendingActions: pendingActions.length,
    totalActions: Math.max(selectExecuteActionsView().length, 1),
  })

  return {
    netWorth: balanceSheet.netWorth,
    netWorthChange: Math.max(cohort.avgMonthlySavingsUsd, 0),
    netWorthChangePercent:
      (Math.max(cohort.avgMonthlySavingsUsd, 0) / Math.max(balanceSheet.netWorth, 1)) * 100,
    assets: balanceSheet.totalAssets,
    liabilities: balanceSheet.totalLiabilities,
    monthlyCashFlow: balanceSheet.monthlyIncome - balanceSheet.monthlyExpenses,
    sparklineData: buildDashboardSparkline(
      balanceSheet.netWorth,
      balanceSheet.monthlyIncome,
      cohort.projected3yAdvantageUsd,
    ),
    healthScore: score,
    healthBreakdown: breakdown,
    protectSignal: spotlightThreat
      ? {
          threatCount: activeThreats.length,
          topAmount: formatUsd(spotlightThreat.amountUsd),
          topCounterparty: spotlightThreat.counterparty,
          severity: spotlightThreat.severity,
          attentionItems: activeThreats.slice(0, 2).map((threat) => ({
            label: `${threat.counterparty} · ${formatUsd(threat.amountUsd)}`,
            href: `/protect/alert-detail?alertId=${threat.id}`,
          })),
        }
      : null,
    growSignal: spotlightRecommendation
      ? {
          savingsPerMonth: selectExecuteSavingsView().potentialMonthlySavingsUsd,
          recCount: recommendations.length,
          topTitle: spotlightRecommendation.title,
          attentionItems: recommendations.slice(0, 2).map((rec) => ({
            label: `${rec.title} · +$${rec.projectedBenefitUsd}/mo`,
            href: `/grow/recommendation?id=${rec.rank}`,
          })),
        }
      : null,
    executeSignal: featuredAction
      ? {
          pendingCount: pendingActions.length,
          topTitle: featuredAction.title,
          topAmount: featuredAction.amountLabel,
          attentionItems: pendingActions.slice(0, 2).map((action) => ({
            label: `${action.title} · ${action.amountLabel}`,
            href: `/execute/approval?id=${action.id}`,
          })),
        }
      : null,
    decisionsAudited: governSummary.decisionsAuditedTotal,
    complianceScore: trust.auditCoveragePercent,
  }
}

export function selectProtectHeroView(
  dismissedThreatIds?: Iterable<string>,
): ProtectHeroView {
  const dismissed = new Set(dismissedThreatIds ?? [])
  const allThreats = selectProtectThreats()
  const activeThreats = allThreats.filter((threat) => !dismissed.has(threat.id))
  const spotlight =
    activeThreats.length === 0
      ? null
      : activeThreats.reduce((best, threat) =>
          threat.compositePriority > best.compositePriority ? threat : best)
  const fpRate = formatPercent(selectArchitecturalTrust().falsePositiveRate * 100, 1)

  if (
    spotlight &&
    (spotlight.severity === 'Critical' || spotlight.severity === 'High')
  ) {
    const radarAxes = selectThreatFactors(spotlight.id)
      .filter((factor) => !factor.mitigating)
      .map((factor) => ({
        label: factor.title,
        value: factor.weight,
        maxValue: 0.3,
        color:
          factor.weight >= 0.2
            ? 'var(--state-critical)'
            : 'var(--engine-protect)',
      }))
    const shapFactors = selectThreatFactors(spotlight.id)
      .map((factor) => ({
        label: factor.title,
        weight: factor.weight,
        mitigating: !!factor.mitigating,
      }))

    return {
      mode: 'attention',
      alert: {
        id: spotlight.id,
        counterparty: spotlight.counterparty,
        amount: formatUsd(spotlight.amountUsd),
        confidence: spotlight.confidence,
        severity: spotlight.severity,
        description: spotlight.description,
        time: spotlight.relativeTime,
      },
      radarAxes,
      shapFactors,
      auditChain: selectAlertAuditChain(spotlight.id),
      remainingCount: Math.max(0, activeThreats.length - 1),
      totalExposure: spotlight.amountUsd,
      fpRate,
    }
  }

  const topAlert = pickSeverityThreat(activeThreats)

  return {
    mode: 'monitoring',
    activeCount: activeThreats.length,
    highCount: activeThreats.filter((threat) => threat.severity === 'High').length,
    mediumCount: activeThreats.filter((threat) => threat.severity === 'Medium').length,
    lowCount: activeThreats.filter((threat) => threat.severity === 'Low').length,
    resolvedCount: allThreats.filter((threat) => threat.status === 'resolved').length,
    fpRate,
    modelUpdate: spotlight?.relativeTime ?? 'live',
    topAlert: topAlert
      ? {
          id: topAlert.id,
          counterparty: topAlert.counterparty,
          severity: topAlert.severity,
        }
      : null,
  }
}

export function selectGrowHeroView(): GrowHeroView {
  const savings = selectExecuteSavingsView()
  const spotlight = selectSpotlightRecommendation()

  return {
    projectedGain: savings.potentialMonthlySavingsUsd * 12,
    totalMonthlySavings: savings.potentialMonthlySavingsUsd,
    avgConfidence: spotlight?.confidence ?? 0,
    recommendationCount: selectRecommendationsSummary().length,
    simulationData: selectGrowSimulationData(),
    spotlightRec: spotlight
      ? {
          title: spotlight.title,
          monthlySavings: spotlight.monthlySavings,
          confidence: spotlight.confidence,
        }
      : null,
    cohortHeadline: selectCohortHeadlines().grow,
  }
}

export function selectExecuteHeroView(
  actionStates?: ExecuteActionStateLike,
): ExecuteHeroView {
  const pendingActions = selectPendingExecuteActions(actionStates)
  const spotlight = selectSpotlightAction()
  const featuredAction = spotlight
    ? pendingActions.find((action) => action.id === spotlight.id) ?? pendingActions[0] ?? null
    : pendingActions[0] ?? null
  const urgencyBreakdown = pendingActions.reduce(
    (acc, action) => {
      acc[action.urgency] += 1
      return acc
    },
    { high: 0, medium: 0, low: 0 },
  )
  const counts: Record<string, number> = {}
  for (const action of pendingActions) {
    const engine = action.sourceEngine || action.engine
    counts[engine] = (counts[engine] || 0) + 1
  }
  const savings = selectExecuteSavingsView()

  return {
    queueTotal: pendingActions.length,
    urgentCount: urgencyBreakdown.high,
    agentStepsCompleted: featuredAction
      ? featuredAction.steps.filter((step) => step.status === 'completed').length
      : 0,
    agentStepsTotal: featuredAction ? featuredAction.steps.length : 0,
    featuredAction: featuredAction
      ? {
          id: featuredAction.id,
          title: featuredAction.title,
          amountLabel: featuredAction.amountLabel,
          confidence: featuredAction.confidence,
          engine: featuredAction.engine,
          sourceEngine: featuredAction.sourceEngine,
          expiresIn: featuredAction.expiresIn,
          rollbackHours: featuredAction.rollbackWindowHours ?? null,
          executionType: featuredAction.executionType,
          riskTier: featuredAction.riskTier,
        }
      : null,
    engineSources: Object.entries(counts).map(([engine, count]) => ({
      engine: engine as ExecuteEngineName,
      count,
      color:
        ENGINE_COLOR_MAP[engine as keyof typeof ENGINE_COLOR_MAP] ??
        'var(--engine-execute)',
    })),
    urgencyBreakdown,
    currentSavingsUsd: savings.currentMonthlySavingsUsd,
    potentialSavingsUsd: savings.potentialMonthlySavingsUsd,
    pendingQueue: pendingActions.map((a) => ({ id: a.id, title: a.title })),
  }
}

export function selectGovernHeroView(): GovernHeroView {
  const summary = selectGovernAuditSummaryView()
  const trust = selectArchitecturalTrust()
  const spotlight = selectSpotlightAuditEntry()

  return {
    decisionsAudited: summary.total,
    engineBreakdown: selectGovernEngineBreakdown(),
    auditEntries: selectGovernAuditEntries().slice(0, 8).map((entry) => ({
      id: entry.id,
      engine: entry.type,
      engineColor:
        ENGINE_COLOR_MAP[entry.type as keyof typeof ENGINE_COLOR_MAP] ??
        'var(--engine-govern)',
      action: entry.action,
      confidence: entry.confidence,
      time: formatDemoTimestamp(entry.timestampIso),
      status: entry.status,
      modelVersion: `${entry.type} trace ledger`,
      topFactor: `${entry.evidence} evidence checks captured`,
    })),
    errorCount: 0,
    statusBreakdown: {
      verified: summary.verified,
      pending: summary.pending,
      flagged: summary.flagged,
    },
    trustGuarantees: {
      autoExecutionsWithoutConsent: trust.autoExecutionsWithoutConsent,
      auditCoveragePercent: trust.auditCoveragePercent,
      llmTrainingOptOut: trust.llmTrainingOptOut,
    },
    spotlightEntry: spotlight
      ? {
          id: spotlight.id,
          action: spotlight.action,
          status: spotlight.status,
          confidence: spotlight.confidence,
        }
      : null,
  }
}

/* ── GovernFooter View Selector ── */

const ENGINE_LOWER_TO_DOMAIN: Record<string, string> = {
  protect: 'Protect',
  grow: 'Grow',
  execute: 'Execute',
  govern: 'Govern',
}

/**
 * Returns data for the GovernFooter trust bar.
 * Optionally filters latest entries by engine (lowercase token name).
 */
export function selectGovernFooterView(currentEngine?: string) {
  const summary = selectGovernAuditSummaryView()
  const entries = selectGovernAuditEntries()

  const domainEngine = currentEngine ? ENGINE_LOWER_TO_DOMAIN[currentEngine] : undefined
  const filtered = domainEngine
    ? entries.filter(e => e.type === domainEngine)
    : entries

  const latestEntries = filtered.slice(0, 3)
  const lastRecordIso = entries[0]?.timestampIso ?? null

  return { total: summary.total, latestEntries, lastRecordIso }
}
