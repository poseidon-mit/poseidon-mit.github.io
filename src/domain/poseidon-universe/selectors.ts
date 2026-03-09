import {
  CANONICAL_UNIVERSE,
  CANONICAL_GROWTH_SIMULATION_DATA,
  CANONICAL_PROJECTED_3Y_ADVANTAGE,
  CANONICAL_RECOMMENDATION_DETAILS,
  CANONICAL_RECOMMENDATIONS_SUMMARY,
  CANONICAL_RECOMMENDATIONS_FOR_LIST,
} from './canonical'
import { ENGINE_COLOR_MAP, type EngineLabel } from '@/lib/engine-color-map'
import type {
  AccountEntity,
  CanonicalBalanceSheet,
  CanonicalUniverseV1,
  CanonicalEvent,
  DeliberationTrace,
  EngineName,
  EventChildren,
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
