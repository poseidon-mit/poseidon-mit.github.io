import { useMemo } from 'react'
import { ProtectAnomalyRadar, ProtectThreatPosture } from '@/components/poseidon/protect-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import {
  selectProtectThreats,
  selectSpotlightThreat,
  selectAlertAuditChain,
  selectThreatFactors,
  formatUsd,
} from '@/domain/poseidon-universe'
import { useDismissedAlerts } from './useDismissedAlerts'
import { severityConfig } from './protect-data'
import type { ThreatSeverity } from './protect-data'

/* ── pickTopAlert (exported for tests) ── */
type Pickable = { id: string; severity: ThreatSeverity; confidence: number }

/** Deterministic top-alert selection: severity desc → confidence desc → id asc. */
export function pickTopAlert<T extends Pickable>(threats: T[]): T | null {
  if (threats.length === 0) return null
  return threats.reduce((best, t) => {
    const orderCmp = severityConfig[t.severity].order - severityConfig[best.severity].order
    if (orderCmp !== 0) return orderCmp > 0 ? t : best
    const confCmp = t.confidence - best.confidence
    if (confCmp !== 0) return confCmp > 0 ? t : best
    return t.id < best.id ? t : best
  })
}

export default function ProtectPage() {
  usePageTitle('Protect')
  const router = useRouter()
  const { dismissed } = useDismissedAlerts()

  const allThreats = useMemo(() => selectProtectThreats(), [])
  const activeThreats = useMemo(
    () => allThreats.filter((t) => !dismissed.has(t.id)),
    [allThreats, dismissed],
  )

  const spotlight = useMemo(() => selectSpotlightThreat(), [])
  const hasCritical = spotlight !== null &&
    (spotlight.severity === 'Critical' || spotlight.severity === 'High')

  // Build radar axes from threat factors
  const radarAxes = useMemo(() => {
    if (!spotlight) return []
    const factors = selectThreatFactors(spotlight.id)
    if (!factors) return []
    return factors.map((f) => ({
      label: f.title,
      value: f.weight,
      maxValue: 0.3,
    }))
  }, [spotlight])

  const auditChain = spotlight ? selectAlertAuditChain(spotlight.id) : null

  const remainingCount = Math.max(0, activeThreats.length - 1)
  const totalExposure = activeThreats.reduce((sum, t) => sum + t.amountUsd, 0)

  // Determine top alert for non-critical state
  const topAlert = useMemo(() => {
    const picked = pickTopAlert(activeThreats)
    return picked
      ? { id: picked.id, counterparty: picked.counterparty, severity: picked.severity }
      : null
  }, [activeThreats])

  return (
    <div className="hero-viewport">
      {hasCritical && spotlight ? (
        <ProtectAnomalyRadar
          alert={{
            id: spotlight.id,
            counterparty: spotlight.counterparty,
            amount: formatUsd(spotlight.amountUsd),
            confidence: spotlight.confidence,
            severity: spotlight.severity,
            description: spotlight.description,
            time: spotlight.relativeTime,
          }}
          radarAxes={radarAxes}
          evidenceCues={spotlight.factors?.map((f) => f.heroCue ?? f.title) ?? []}
          auditChain={auditChain}
          remainingCount={remainingCount}
          totalExposure={totalExposure}
          fpRate="0.3%"
          onReviewThreat={() =>
            router.navigate(`/protect/alert-detail?alertId=${spotlight.id}`)
          }
        />
      ) : (
        <ProtectThreatPosture
          activeCount={activeThreats.length}
          highCount={activeThreats.filter((t) => t.severity === 'High').length}
          mediumCount={activeThreats.filter((t) => t.severity === 'Medium').length}
          lowCount={activeThreats.filter((t) => t.severity === 'Low').length}
          resolvedCount={allThreats.filter((t) => t.status === 'resolved').length}
          fpRate="0.3%"
          modelUpdate="v2.4.1"
          topAlert={topAlert}
          onOpenTopAlert={
            topAlert
              ? () =>
                  router.navigate(
                    `/protect/alert-detail?alertId=${topAlert.id}`,
                  )
              : null
          }
        />
      )}
    </div>
  )
}
