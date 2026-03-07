import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link, useRouter } from '@/router'
import { TrendingUp } from 'lucide-react'
import { EngineBadge, ConfidenceIndicator } from '@/components/poseidon'
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
  bracket: 'your income bracket',
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

  const topRec = RECOMMENDATIONS_SUMMARY.length > 0
    ? RECOMMENDATIONS_SUMMARY.reduce((best, r) => r.rank < best.rank ? r : best)
    : null

  return (
    <>

      <motion.div
        id="main-content"
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
              cohortAcceptanceRate={cohort.recommendationAcceptanceRate}
              platformProfileCount={platformProfileCount}
            />
          </motion.div>
        </motion.section>

        {false && (<motion.section
          variants={staggerContainerVariant}
          className="flex flex-col gap-4 mb-12"
          aria-label="AI Recommendations"
        >
          <motion.div variants={fadeUpVariant} className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              AI Recommendations
              <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[var(--engine-grow)]/15 text-[var(--engine-grow)] text-[10px] font-bold tabular-nums">
                {RECOMMENDATIONS_SUMMARY.length}
              </span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {RECOMMENDATIONS_SUMMARY.map((rec) => (
              <Link key={rec.rank} to={`/grow/recommendation?id=${rec.rank}`} className="block">
                <motion.div
                  variants={fadeUpVariant}
                  className="glass-card glass-card-overlay rounded-2xl p-5 md:p-6 flex items-start gap-4 transition-colors cursor-pointer hover:bg-white/[0.02]"
                >
                  {/* Rank badge */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full border border-[var(--engine-grow)]/30 bg-[var(--engine-grow)]/10 flex items-center justify-center text-sm font-semibold tabular-nums"
                    style={{ color: 'var(--engine-grow)' }}
                  >
                    {rec.rank}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <p className="text-sm md:text-base font-semibold text-white/90 leading-snug line-clamp-2">{rec.title}</p>
                    <p className="text-xs text-white/40 flex flex-wrap items-center gap-x-1.5">
                      <span className="font-mono font-semibold" style={{ color: 'var(--engine-grow)' }}>${rec.monthly}/mo</span>
                      <span className="text-white/20">&middot;</span>
                      <span className="font-mono">${rec.annual.toLocaleString()}/yr</span>
                    </p>
                    <ConfidenceIndicator value={rec.confidence} accentColor="var(--engine-grow)" format="percent" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>)}

      </motion.div>
    </>
  )
}
