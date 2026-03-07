import { CANONICAL_UNIVERSE } from './canonical'
import { ENGINE_COLOR_MAP, type EngineLabel } from '@/lib/engine-color-map'
import type {
  CanonicalUniverseV1,
  ExecuteActionEntity,
  ExecutionType,
  GovernAuditEntryEntity,
  GovernLedgerEntryEntity,
  ProtectThreatEntity,
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
    monthlySavingsCurrentUsd: universe.metrics.monthlySavingsCurrentUsd,
    monthlySavingsPotentialUsd: universe.metrics.monthlySavingsPotentialUsd,
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

export function selectGrowEmergencyFundView() {
  return getCanonicalUniverse().metrics.emergencyFund
}

export function selectExecuteActionsView(): ExecuteActionEntity[] {
  return getCanonicalUniverse().entities.executeActions
}

export function selectExecuteSavingsView() {
  const universe = getCanonicalUniverse()
  return {
    currentMonthlySavingsUsd: universe.metrics.monthlySavingsCurrentUsd,
    potentialMonthlySavingsUsd: universe.metrics.monthlySavingsPotentialUsd,
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
    potentialSavingsUsd: getCanonicalUniverse().metrics.monthlySavingsPotentialUsd,
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

  const potentialUsd = universe.metrics.monthlySavingsPotentialUsd
  const currentUsd = universe.metrics.monthlySavingsCurrentUsd
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

export function formatUsd(value: number): string {
  return `$${value.toLocaleString()}`
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`
}
