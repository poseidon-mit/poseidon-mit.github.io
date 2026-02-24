import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from '@/router'
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowUpDown,
  Search,
  CircleDot,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"
import { EngineBadge, KpiCard } from '@/components/poseidon'
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { selectGovernLedgerPreview, selectGovernSummaryView } from '@/domain/poseidon-universe'
import { ENGINE_COLOR_MAP, type EngineLabel } from '@/lib/engine-color-map'
import type { DecisionStatus } from '@/components/poseidon'

/* ── Data ── */
type DecisionType = "Protect" | "Grow" | "Execute" | "Govern"
const statusConfig: Partial<Record<DecisionStatus, { color: string; icon: LucideIcon }>> = {
  "Pending review": { color: "var(--state-warning)", icon: Clock },
  Flagged: { color: "var(--state-critical)", icon: AlertTriangle },
}


export default function GovernPage() {
  usePageTitle('Govern Engine')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  const [historyOpen, setHistoryOpen] = useState(false)
  const governSummary = selectGovernSummaryView()
  const ledgerEntries = selectGovernLedgerPreview().map((entry) => ({
    id: entry.id,
    type: entry.type as DecisionType,
    action: entry.action,
    confidence: entry.confidence,
    status: entry.status as DecisionStatus | undefined,
    time: formatDemoTimestamp(entry.timestampIso),
  }))

  return (
    <>

      <motion.div id="main-content" className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12`} style={PAGE_CONTENT_STYLE} variants={staggerContainerVariant} initial="hidden" animate="visible" role="main">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant}>
            <EngineBadge engine="govern" icon={ShieldCheck} label="Engine status: Good" />
          </motion.div>
          <h1 className={`${PAGE_HEADING_CLASS} mb-2`} style={PAGE_HEADING_STYLE}>
            <span className="bg-gradient-to-r from-[var(--engine-govern)] to-[var(--engine-grow)] bg-clip-text text-transparent">100% auditability</span> for every AI decision
          </h1>
        </motion.section>

        {/* ── Compliance score ring + stats ── */}
        <motion.div variants={fadeUpVariant}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full">
            {[
              { label: "Decision auditable", value: governSummary.decisionsAuditedTotal.toLocaleString(), color: "white" },
              { label: "Review Recommended", value: String(governSummary.pendingReviewDecisions), color: "var(--state-warning)" },
              { label: "Flagged", value: String(governSummary.flaggedDecisions), color: "var(--state-critical)" },
            ].map(d => (
              <KpiCard
                key={d.label}
                label={d.label}
                value={d.value}
                color={d.color}
                size="lg"
                gradient={<div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-govern)]/5 to-transparent pointer-events-none" />}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Decision Ledger ── */}
        <div>
          <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 px-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">Decision Ledger</h2>
              <div className="flex items-center gap-2">
                <button type="button" disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/30 text-[10px] uppercase tracking-widest cursor-not-allowed"><Search size={12} />Search</button>
                <button type="button" disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/30 text-[10px] uppercase tracking-widest cursor-not-allowed"><ArrowUpDown size={12} />Sort</button>
              </div>
            </div>
            <div className="glass-card glass-card-overlay rounded-[32px] p-0">
              <div className="flex flex-col divide-y divide-white/[0.04] relative z-10">
                {ledgerEntries.map(entry => {
                  const sCfg = entry.status ? statusConfig[entry.status] : null;
                  return (
                    <motion.button key={entry.id} type="button" variants={fadeUpVariant} onClick={() => navigate(`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`)} className="group cursor-pointer p-4 md:p-6 lg:p-8 hover:bg-white/[0.04] transition-colors flex items-start md:items-center justify-between gap-4 w-full text-left">
                      <div className="flex items-start md:items-center gap-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/[0.05] shrink-0" style={{ background: `${ENGINE_COLOR_MAP[entry.type as EngineLabel]}15`, color: ENGINE_COLOR_MAP[entry.type as EngineLabel] }}><CircleDot size={16} /></span>
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                          <span className="text-base font-light tracking-wide text-white group-hover:text-[var(--engine-govern)] transition-colors">{entry.action}</span>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[10px] uppercase tracking-widest font-mono text-white/40">{entry.id}</span>
                            {sCfg && <span className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1" style={{ color: sCfg.color }}><sCfg.icon size={10} />{entry.status}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center justify-end gap-3 md:gap-6 shrink-0">
                        <div className="flex-col items-end gap-1.5 hidden md:flex">
                          <span className="text-sm font-mono tracking-widest" style={{ color: entry.confidence >= 0.9 ? "var(--state-healthy)" : entry.confidence >= 0.8 ? "var(--engine-govern)" : "var(--state-warning)", textShadow: `0 0 10px ${entry.confidence >= 0.9 ? "var(--state-healthy)" : entry.confidence >= 0.8 ? "var(--engine-govern)" : "var(--state-warning)"}60` }}>Confidence {formatConfidence(entry.confidence)}</span>
                          <span className="text-[10px] uppercase tracking-widest text-white/30">{entry.time}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full hidden sm:flex items-center justify-center border border-white/[0.05] bg-white/[0.02] group-hover:bg-white/[0.1] group-hover:border-[var(--engine-govern)]/30 transition-all shadow-inner">
                          <ArrowUpRight size={14} className="text-white/60 group-hover:text-[var(--engine-govern)]" />
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.section>

          {/* ── History (collapsible) ── */}
          <motion.section variants={fadeUpVariant} className="flex flex-col gap-6 mt-8">
            <button type="button" onClick={() => setHistoryOpen(v => !v)} className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 px-2 cursor-pointer hover:text-white/70 transition-colors">
              History
              <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: historyOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            <AnimatePresence initial={false}>
              {historyOpen && (
                <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                  <div className="glass-card glass-card-overlay rounded-[32px] p-0">
                    <div className="relative z-10 p-8 md:p-12 flex items-center justify-center min-h-[120px]">
                      <span className="text-xs uppercase tracking-widest text-white/20">No history entries yet</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

      </motion.div>
    </>
  )
}
