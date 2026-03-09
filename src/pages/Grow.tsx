import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from '@/router'
import { TrendingUp } from 'lucide-react'
import { EngineBadge } from '@/components/poseidon'
import { GrowGrowthAdvantage } from '@/components/poseidon/grow-hero'
import { GROWTH_SIMULATION_DATA, PROJECTED_3Y_ADVANTAGE } from '@/lib/grow-simulation-data'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { usePageTitle } from '@/hooks/use-page-title'
import { RECOMMENDATIONS_SUMMARY } from './grow/recommendation-detail-data'

export default function GrowPage() {
  usePageTitle('Grow')
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
            <EngineBadge engine="grow" icon={TrendingUp} label="Optimization Active" />
          </motion.div>
          <h1 className="sr-only">Grow</h1>

          <motion.div variants={fadeUpVariant}>
            <GrowGrowthAdvantage
              projectedGain={PROJECTED_3Y_ADVANTAGE}
              totalMonthlySavings={totalMonthlySavings}
              avgConfidence={avgConfidence}
              recommendationCount={RECOMMENDATIONS_SUMMARY.length}
              simulationData={[...GROWTH_SIMULATION_DATA]}
              onViewRecommendations={() => navigate('/grow/recommendations')}
            />
          </motion.div>
        </motion.section>

      </motion.div>
    </>
  )
}
