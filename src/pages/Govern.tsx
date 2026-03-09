import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useRouter } from '@/router'
import { Scale } from "lucide-react"
import { GovernImmutableLedger, EngineBadge, ConfidenceIndicator } from '@/components/poseidon'
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { getMotionPreset } from '@/lib/motion-presets'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { selectGovernAuditEntries, selectGovernAuditSummaryView, selectGovernEngineBreakdown } from '@/domain/poseidon-universe'
import { ENGINE_COLOR_MAP, type EngineLabel } from '@/lib/engine-color-map'
import { AUDIT_DECISIONS } from '@/lib/govern-audit-data'
import type { EngineName } from '@/domain/poseidon-universe'

type FilterEngine = EngineName | 'All'

export default function GovernPage() {
  usePageTitle('Govern')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  const [engineFilter, setEngineFilter] = useState<FilterEngine>('All')
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

  const filteredEntries = useMemo(() => {
    if (engineFilter === 'All') return auditEntries
    return auditEntries.filter(e => e.type === engineFilter)
  }, [auditEntries, engineFilter])

  const filterEngines: FilterEngine[] = ['All', 'Protect', 'Grow', 'Execute', 'Govern']

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

        {/* ── Summary bar ── */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card rounded-2xl px-5 py-4 md:px-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-white/70">
              <span className="font-semibold text-white">{auditSummary.total}</span> AI decisions audited
            </span>
            <span className="text-white/20">·</span>
            <span className="text-sm text-white/50">100% transparency</span>
            <span className="text-white/20">·</span>
            <span className="text-sm text-white/50">
              Last verified: {auditEntries[0] ? formatDemoTimestamp(auditEntries[0].timestampIso) : 'N/A'}
            </span>
          </div>
        </motion.section>

        {/* ── Engine filter chips ── */}
        <motion.section variants={fadeUpVariant} className="flex flex-wrap gap-2">
          {filterEngines.map(engine => {
            const isActive = engineFilter === engine
            const color = engine === 'All' ? 'var(--engine-govern)' : ENGINE_COLOR_MAP[engine as EngineLabel]
            return (
              <button
                key={engine}
                type="button"
                onClick={() => setEngineFilter(engine)}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all cursor-pointer border"
                style={{
                  background: isActive ? `color-mix(in srgb, ${color} 20%, transparent)` : 'transparent',
                  borderColor: isActive ? `color-mix(in srgb, ${color} 40%, transparent)` : 'rgba(255,255,255,0.08)',
                  color: isActive ? color : 'rgba(255,255,255,0.4)',
                }}
              >
                {engine}
              </button>
            )
          })}
        </motion.section>

        {/* ── Decision Ledger ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-3">
          {filteredEntries.map(entry => (
            <motion.button
              key={entry.id}
              type="button"
              variants={fadeUpVariant}
              onClick={() => navigate(`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`)}
              className="group glass-card rounded-2xl p-4 md:p-5 hover:bg-white/[0.04] transition-colors flex items-center gap-4 w-full text-left cursor-pointer"
            >
              {/* Engine color dot */}
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: ENGINE_COLOR_MAP[entry.type as EngineLabel] }}
              />

              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
                    style={{
                      background: `${ENGINE_COLOR_MAP[entry.type as EngineLabel]}20`,
                      color: ENGINE_COLOR_MAP[entry.type as EngineLabel],
                    }}
                  >
                    {entry.type}
                  </span>
                  {entry.status !== 'Verified' && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--state-warning)]">
                      {entry.status}
                    </span>
                  )}
                  <span className="text-[10px] text-white/25 ml-auto hidden sm:block">
                    {formatDemoTimestamp(entry.timestampIso)}
                  </span>
                </div>
                <span className="text-sm text-white/70 truncate group-hover:text-white transition-colors">
                  {entry.action}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <ConfidenceIndicator value={entry.confidence} format="percent" size="sm" />
              </div>
            </motion.button>
          ))}
        </motion.section>

      </motion.div>
    </>
  )
}
