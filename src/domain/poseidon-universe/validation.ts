import type { CanonicalUniverseV1 } from './types'

export function validateCanonicalUniverse(universe: CanonicalUniverseV1): string[] {
  const issues: string[] = []

  if (universe.schemaVersion !== '1.1.0') {
    issues.push(`Unexpected schema version: ${universe.schemaVersion}`)
  }

  const totalByStatus =
    universe.metrics.verifiedDecisions +
    universe.metrics.pendingReviewDecisions +
    universe.metrics.flaggedDecisions

  if (totalByStatus !== universe.metrics.decisionsAuditedTotal) {
    issues.push(
      `Decision totals mismatch: ${totalByStatus} != ${universe.metrics.decisionsAuditedTotal}`,
    )
  }

  if (universe.metrics.pendingActions !== universe.entities.executeActions.length) {
    issues.push(
      `Pending actions mismatch: ${universe.metrics.pendingActions} != ${universe.entities.executeActions.length}`,
    )
  }

  const criticalAlert = universe.entities.criticalAlert
  if (!universe.entities.protectThreats.some((threat) => threat.id === criticalAlert.id)) {
    issues.push(`Critical alert ${criticalAlert.id} is missing from protect threats`)
  }

  const c = universe.metrics.cohort
  if (c.recommendationAcceptanceRate < 0 || c.recommendationAcceptanceRate > 1) {
    issues.push('cohort.recommendationAcceptanceRate out of range')
  }
  if (c.avgMonthlySavingsUsd <= 0) {
    issues.push('cohort.avgMonthlySavingsUsd must be positive')
  }
  if (c.projected3yAdvantageUsd <= 0) {
    issues.push('cohort.projected3yAdvantageUsd must be positive')
  }
  if (c.fraudTrend.factors.length === 0) {
    issues.push('cohort.fraudTrend.factors must not be empty')
  }
  if (c.protectPerformance.riskIncidentsFlagged < 0) {
    issues.push('cohort.protectPerformance.riskIncidentsFlagged must be non-negative')
  }
  if (c.protectPerformance.avgMonthlyExposureUsd < 0) {
    issues.push('cohort.protectPerformance.avgMonthlyExposureUsd must be non-negative')
  }

  const trust = universe.metrics.architecturalTrust
  if (trust.autoExecutionsWithoutConsent !== 0) {
    issues.push('architecturalTrust.autoExecutionsWithoutConsent must be 0')
  }
  if (trust.auditCoveragePercent !== 100) {
    issues.push('architecturalTrust.auditCoveragePercent must be 100')
  }
  if (trust.falsePositiveRate < 0 || trust.falsePositiveRate > 1) {
    issues.push('architecturalTrust.falsePositiveRate out of range')
  }
  if (trust.llmRetentionDays !== 0) {
    issues.push('architecturalTrust.llmRetentionDays must be 0')
  }
  if (trust.llmTrainingOptOut !== true) {
    issues.push('architecturalTrust.llmTrainingOptOut must be true')
  }

  const m = universe.metrics
  if (m.platformProfileCount < 1000) {
    issues.push('platformProfileCount must be >= 1000')
  }

  const breakdownSum = Object.values(universe.metrics.engineBreakdown).reduce((s, n) => s + n, 0)
  if (breakdownSum !== universe.metrics.decisionsAuditedTotal) {
    issues.push(
      `Engine breakdown sum mismatch: ${breakdownSum} != ${universe.metrics.decisionsAuditedTotal}`,
    )
  }

  return issues
}
