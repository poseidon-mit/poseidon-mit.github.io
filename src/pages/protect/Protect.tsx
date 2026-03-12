import { useMemo } from 'react'
import { ProtectAnomalyRadar, ProtectThreatPosture } from '@/components/poseidon/protect-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import {
  selectProtectHeroView,
} from '@/domain/poseidon-universe'
import { severityConfig } from './protect-data'
import type { ThreatSeverity } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'

type Pickable = { id: string; severity: ThreatSeverity; confidence: number }

export function pickTopAlert<T extends Pickable>(threats: T[]): T | null {
  if (threats.length === 0) return null
  return threats.reduce((best, threat) => {
    const orderCmp = severityConfig[threat.severity].order - severityConfig[best.severity].order
    if (orderCmp !== 0) return orderCmp > 0 ? threat : best
    const confidenceCmp = threat.confidence - best.confidence
    if (confidenceCmp !== 0) return confidenceCmp > 0 ? threat : best
    return threat.id < best.id ? threat : best
  })
}

export default function ProtectPage() {
  usePageTitle('Protect')
  const router = useRouter()
  const { dismissed } = useDismissedAlerts()

  const heroView = useMemo(() => selectProtectHeroView(dismissed), [dismissed])

  return (
    <div className="hero-viewport">
      {heroView.mode === 'attention' ? (
        <ProtectAnomalyRadar
          alert={heroView.alert}
          radarAxes={heroView.radarAxes}
          shapFactors={heroView.shapFactors}
          auditChain={heroView.auditChain}
          remainingCount={heroView.remainingCount}
          totalExposure={heroView.totalExposure}
          fpRate={heroView.fpRate}
          onReviewThreat={() => router.navigate(`/protect/alert-detail?alertId=${heroView.alert.id}`)}
        />
      ) : (
        <ProtectThreatPosture
          activeCount={heroView.activeCount}
          highCount={heroView.highCount}
          mediumCount={heroView.mediumCount}
          lowCount={heroView.lowCount}
          resolvedCount={heroView.resolvedCount}
          fpRate={heroView.fpRate}
          modelUpdate={heroView.modelUpdate}
          topAlert={heroView.topAlert}
          onOpenTopAlert={
            heroView.topAlert
              ? () => router.navigate(`/protect/alert-detail?alertId=${heroView.topAlert!.id}`)
              : null
          }
        />
      )}
    </div>
  )
}
