import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from '@/router'
import { TrendingUp } from 'lucide-react'
import { EngineBadge } from '@/components/poseidon'
import { GrowGrowthAdvantage } from '@/components/poseidon/grow-hero'
import { selectCohortMetrics, selectPlatformProfileCount } from '@/domain/poseidon-universe'
import { GROWTH_SIMULATION_DATA, PROJECTED_3Y_ADVANTAGE } from '@/lib/grow-simulation-data'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { usePageTitle } from '@/hooks/use-page-title'
import { RECOMMENDATIONS_SUMMARY } from './grow/recommendation-detail-data'

const COHORT_DATA = {
  currentPercentile: 23,
  projectedPercentile: 67,
  bracket: 'your portfolio tier',
}


export default function GrowPage() {
  usePageTitle('Grow Engine')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()

  const totalMonthlySavings = useMemo(
    () => RECOMMENDATIONS_SUMMARY.reduce((s, r) => s + r.monthly, 0),
    [],
  )

  const avgConfidence = useMemo(() => {
    if (RECOMMENDATIONS_SUMMARY.length === 0) return 0
    const sum = RECOMMENDATIONS_SUMMARY.reduce((s, r) => s + r.confidence, 0)
    return sum / RECOMMENDATIONS_SUMMARY.length
  }, [])

  const cohort = selectCohortMetrics()
  const platformProfileCount = selectPlatformProfileCount()

  const [dismissedRanks, setDismissedRanks] = useState<Set<number>>(new Set())
  const remaining = RECOMMENDATIONS_SUMMARY.filter(r => !dismissedRanks.has(r.rank))
  const topRec = remaining.length > 0
    ? remaining.reduce((best, r) => r.rank < best.rank ? r : best)
    : null

  return (
    <>

      <motion.div
        id="main-content"
        role="main"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8`}
        style={PAGE_CONTENT_STYLE}
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}>

        {/* ── Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant} className="flex items-center gap-2">
            <EngineBadge engine="grow" icon={TrendingUp} label="Engine status: Good" />
          </motion.div>
          <h1 className="sr-only">Grow Engine</h1>

          <motion.div variants={fadeUpVariant}>
            <GrowGrowthAdvantage
              projectedGain={PROJECTED_3Y_ADVANTAGE}
              totalMonthlySavings={totalMonthlySavings}
              avgConfidence={avgConfidence}
              recommendationCount={RECOMMENDATIONS_SUMMARY.length}
              simulationData={[...GROWTH_SIMULATION_DATA]}
              currentPercentile={COHORT_DATA.currentPercentile}
              projectedPercentile={COHORT_DATA.projectedPercentile}
              cohortBracket={COHORT_DATA.bracket}
              topRecommendation={topRec ? {
                rank: topRec.rank,
                title: topRec.title,
                monthlySavings: topRec.monthly,
                confidence: topRec.confidence,
              } : null}
              onViewRecommendations={() => navigate('/grow/recommendations')}
              onQueueTopAction={topRec ? () => navigate('/execute') : null}
              onDismissTopAction={topRec ? () => setDismissedRanks(prev => new Set(prev).add(topRec.rank)) : undefined}
              cohortAcceptanceRate={cohort.recommendationAcceptanceRate}
              platformProfileCount={platformProfileCount}
            />
          </motion.div>
        </motion.section>

      </motion.div>
    </>
  )
}
