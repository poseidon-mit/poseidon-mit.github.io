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

export function formatUsd(value: number): string {
  return `$${value.toLocaleString()}`
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`
}
