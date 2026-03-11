import { useMemo } from 'react'
import { GrowGrowthAdvantage } from '@/components/poseidon/grow-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import {
  selectGrowSimulationData,
  selectProjected3yAdvantage,
  selectRecommendationsSummary,
} from '@/domain/poseidon-universe'

export default function GrowPage() {
  usePageTitle('Grow')
  const router = useRouter()

  const simulationData = useMemo(() => selectGrowSimulationData(), [])
  const projectedGain = useMemo(() => selectProjected3yAdvantage(), [])
  const recs = useMemo(() => selectRecommendationsSummary(), [])

  const totalMonthlySavings = useMemo(
    () => recs.reduce((sum, r) => sum + r.monthly, 0),
    [recs],
  )
  const avgConfidence = useMemo(
    () =>
      recs.length > 0
        ? recs.reduce((sum, r) => sum + r.confidence, 0) / recs.length
        : 0,
    [recs],
  )

  // Map canonical GrowthSimulationPoint to hero's expected shape
  const heroSimData = useMemo(
    () =>
      simulationData.map((d) => ({
        year: d.year,
        baseline: d.baseline,
        aiOptimized: d.aiOptimized,
      })),
    [simulationData],
  )

  return (
    <div className="hero-viewport">
      <GrowGrowthAdvantage
        projectedGain={projectedGain}
        totalMonthlySavings={totalMonthlySavings}
        avgConfidence={avgConfidence}
        recommendationCount={recs.length}
        simulationData={heroSimData}
        onViewRecommendations={() => router.navigate('/grow/recommendations')}
      />
    </div>
  )
}
