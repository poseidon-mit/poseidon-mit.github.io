import { motion } from "framer-motion"
import { Scale } from "lucide-react"
import { GovernImmutableLedger, EngineBadge } from '@/components/poseidon'
import { formatDemoTimestamp } from '@/lib/demo-date'
import { getMotionPreset } from '@/lib/motion-presets'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { selectGovernAuditEntries, selectGovernAuditSummaryView, selectGovernEngineBreakdown } from '@/domain/poseidon-universe'
import { ENGINE_COLOR_MAP, type EngineLabel } from '@/lib/engine-color-map'
import { AUDIT_DECISIONS } from '@/lib/govern-audit-data'
export default function GovernPage() {
  usePageTitle('Govern')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const auditSummary = selectGovernAuditSummaryView()
  const engineBreakdown = selectGovernEngineBreakdown()
  const auditEntries = selectGovernAuditEntries()

  const heroAuditEntries = auditEntries.slice(0, 3).map((entry) => {
    const detail = AUDIT_DECISIONS[entry.id as keyof typeof AUDIT_DECISIONS]
    return {
      id: entry.id,
      engine: entry.type,
      engineColor: ENGINE_COLOR_MAP[entry.type as EngineLabel],
      action: entry.action,
      confidence: entry.confidence,
      time: formatDemoTimestamp(entry.timestampIso),
      status: entry.status,
      modelVersion: detail ? `${detail.model.name} v${detail.model.version}` : 'Unknown',
      topFactor: detail?.topFactors[0]?.label ?? 'N/A',
    }
  })

  return (
    <>
      <motion.div id="main-content" className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12`} style={PAGE_CONTENT_STYLE} variants={staggerContainerVariant} initial="hidden" animate="visible" role="main">

        {/* ── Prelude ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant} className="flex items-center gap-2">
            <EngineBadge engine="govern" icon={Scale} label="Audit Active" />
          </motion.div>
          <h1 className="sr-only">Govern</h1>
          <motion.div variants={fadeUpVariant}>
            <GovernImmutableLedger
              decisionsAudited={auditSummary.total}
              engineBreakdown={engineBreakdown}
              auditEntries={heroAuditEntries}
            />
          </motion.div>
        </motion.section>

      </motion.div>
    </>
  )
}
