import { useMemo } from 'react'
import { GrowHero } from '@/components/poseidon/grow-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import {
  selectGrowSimulationData,
  selectProjected3yAdvantage,
  selectRecommendationsSummary,
  selectSpotlightRecommendation,
  selectGoals,
  selectCohortHeadlines,
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

  const spotlightRec = useMemo(() => {
    const r = selectSpotlightRecommendation()
    return r ? { title: r.title, monthlySavings: r.monthlySavings, confidence: r.confidence } : null
  }, [])
  const goals = useMemo(() =>
    selectGoals().map(g => ({ id: g.id, title: g.title, currentUsd: g.currentUsd, targetUsd: g.targetUsd })),
    [],
  )
  const cohortHeadline = useMemo(() => selectCohortHeadlines().grow, [])

  // Include low/high for confidence band
  const heroSimData = useMemo(
    () =>
      simulationData.map((d) => ({
        year: d.year,
        baseline: d.baseline,
        aiOptimized: d.aiOptimized,
        low: d.low,
        high: d.high,
      })),
    [simulationData],
  )

  return (
    <div className="hero-viewport">
      <GrowHero
        projectedGain={projectedGain}
        totalMonthlySavings={totalMonthlySavings}
        avgConfidence={avgConfidence}
        recommendationCount={recs.length}
        simulationData={heroSimData}
        onViewRecommendations={() => router.navigate('/grow/recommendations')}
        spotlightRec={spotlightRec}
        goals={goals}
        cohortHeadline={cohortHeadline}
      />
    </div>
  )
}
