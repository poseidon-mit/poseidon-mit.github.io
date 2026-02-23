import type { CanonicalUniverseV1 } from './types'

export function validateCanonicalUniverse(universe: CanonicalUniverseV1): string[] {
  const issues: string[] = []

  if (universe.schemaVersion !== '1.0.0') {
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

  return issues
}
