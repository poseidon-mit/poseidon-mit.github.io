import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from '@/router'
import {
  Scale,
  CircleDot,
  ChevronDown,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { GovernImmutableLedger, EngineBadge } from '@/components/poseidon'
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { selectGovernAuditEntries, selectGovernAuditSummaryView, selectGovernEngineBreakdown, selectCrossEngineChains } from '@/domain/poseidon-universe'
import { ENGINE_COLOR_MAP, type EngineLabel } from '@/lib/engine-color-map'
import { AUDIT_DECISIONS } from '@/lib/govern-audit-data'

/* ── Engine nodes for cross-engine trace ── */
const TRACE_ENGINES = [
  { label: 'Protect', color: 'var(--engine-protect)' },
  { label: 'Grow', color: 'var(--engine-grow)' },
  { label: 'Execute', color: 'var(--engine-execute)' },
  { label: 'Govern', color: 'var(--engine-govern)' },
] as const

export default function GovernPage() {
  usePageTitle('Govern')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  const [historyOpen, setHistoryOpen] = useState(false)
  const auditSummary = selectGovernAuditSummaryView()
  const engineBreakdown = selectGovernEngineBreakdown()
  const auditEntries = selectGovernAuditEntries()
  const chains = selectCrossEngineChains()
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

  // Compliance KPIs
  const auditCoverage = auditSummary.total > 0
    ? Math.round((auditSummary.verified / auditSummary.total) * 100)
    : 0

  // Recent decisions (top 5)
  const recentDecisions = auditEntries.slice(0, 5)

  // Most recent cross-engine chain
  const latestChain = chains[0] ?? null

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

        {/* ── Compliance Dashboard ── */}
        <motion.section variants={fadeUpVariant} className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 px-2">
            Compliance Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 md:p-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-2xl font-mono font-semibold" style={{ color: 'var(--engine-govern)' }}>
                  {auditCoverage}%
                </span>
                <span className="text-xs text-white/40">Audit coverage</span>
                <span className="text-[10px] text-white/25 font-mono">
                  {auditSummary.verified} of {auditSummary.total} decisions verified
                </span>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 md:p-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-2xl font-mono font-semibold" style={{ color: 'var(--engine-govern)' }}>
                  90-day
                </span>
                <span className="text-xs text-white/40">AI data window</span>
                <span className="text-[10px] text-white/25 font-mono">
                  Rolling window · auto-purge enabled
                </span>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 md:p-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-2xl font-mono font-semibold" style={{ color: 'var(--engine-govern)' }}>
                  Available
                </span>
                <span className="text-xs text-white/40">Privacy control</span>
                <span className="text-[10px] text-white/25 font-mono">
                  Available on request · your data stays private
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Recent Decisions ── */}
        <motion.section variants={fadeUpVariant} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 px-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">Recent Decisions</h2>
            <button
              type="button"
              onClick={() => navigate('/govern/audit-ledger')}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold hover:text-[var(--engine-govern)] text-white/40 transition-colors"
            >
              View all <ArrowRight size={10} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {recentDecisions.map(entry => (
              <motion.button
                key={entry.id}
                type="button"
                variants={fadeUpVariant}
                onClick={() => navigate(`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`)}
                className="group glass-card rounded-2xl p-4 md:p-5 hover:bg-white/[0.04] transition-colors flex items-center gap-4 w-full text-left cursor-pointer"
              >
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/[0.05] shrink-0"
                  style={{
                    background: `${ENGINE_COLOR_MAP[entry.type as EngineLabel]}15`,
                    color: ENGINE_COLOR_MAP[entry.type as EngineLabel],
                  }}
                >
                  <CircleDot size={14} />
                </span>
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
                  </div>
                  <span className="text-sm text-white/70 truncate group-hover:text-white transition-colors">
                    {entry.action}
                  </span>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                  <span
                    className="text-xs font-mono tracking-widest"
                    style={{
                      color: entry.confidence >= 0.9 ? 'var(--state-healthy)' : entry.confidence >= 0.8 ? 'var(--engine-govern)' : 'var(--state-warning)',
                    }}
                  >
                    {formatConfidence(entry.confidence)}
                  </span>
                  <span className="text-[10px] text-white/25">
                    {formatDemoTimestamp(entry.timestampIso)}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ── Cross-Engine Trace ── */}
        <motion.section variants={fadeUpVariant} className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 px-2">
            Cross-Engine Trace
          </h2>
          <div className="glass-card rounded-2xl p-6 md:p-8">
            {latestChain && (
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-6">
                Latest chain: {latestChain.origin === 'alert' ? latestChain.alertId : ('recommendationId' in latestChain ? latestChain.recommendationId : '')} → {latestChain.actionId}{latestChain.decisionId ? ` → ${latestChain.decisionId}` : ''}
              </p>
            )}
            <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
              {TRACE_ENGINES.map((engine, i) => (
                <div key={engine.label} className="flex items-center gap-2 shrink-0">
                  {/* Engine node */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: engine.color,
                        background: `color-mix(in srgb, ${engine.color} 10%, transparent)`,
                      }}
                    >
                      <span
                        className="text-[10px] md:text-xs font-bold uppercase tracking-widest"
                        style={{ color: engine.color }}
                      >
                        {engine.label.charAt(0)}
                      </span>
                    </div>
                    <span
                      className="text-[9px] md:text-[10px] uppercase tracking-widest font-semibold"
                      style={{ color: engine.color }}
                    >
                      {engine.label}
                    </span>
                  </div>
                  {/* Arrow connector (not after last) */}
                  {i < TRACE_ENGINES.length - 1 && (
                    <div className="flex items-center gap-0.5 -mt-5">
                      <div className="w-6 md:w-10 lg:w-16 h-px bg-white/[0.12]" />
                      <ArrowRight size={12} className="text-white/20 shrink-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── History (collapsible) ── */}
        <motion.section variants={fadeUpVariant} className="flex flex-col gap-6">
          <button type="button" onClick={() => setHistoryOpen(v => !v)} className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 px-2 cursor-pointer hover:text-white/70 transition-colors">
            History
            <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: historyOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
          <AnimatePresence initial={false}>
            {historyOpen && (
              <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                <div className="glass-card glass-card-overlay rounded-2xl p-0">
                  <div className="relative z-10 p-8 md:p-12 flex items-center justify-center min-h-[120px]">
                    <span className="text-xs uppercase tracking-widest text-white/20">No history entries yet</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

      </motion.div>
    </>
  )
}
