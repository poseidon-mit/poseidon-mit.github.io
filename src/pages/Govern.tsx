import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from '@/router'
import {
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowUpDown,
  Search,
  CircleDot,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"
import { GovernImmutableLedger } from '@/components/poseidon'
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { selectGovernAuditEntries, selectGovernAuditSummaryView, selectGovernEngineBreakdown, selectGovernLedgerPreview, selectArchitecturalTrust } from '@/domain/poseidon-universe'
import { ENGINE_COLOR_MAP, type EngineLabel } from '@/lib/engine-color-map'
import { AUDIT_DECISIONS } from '@/lib/govern-audit-data'
import { PRIVACY_MANDATES } from '@/content/trust-policies'
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
  const trust = selectArchitecturalTrust()
  const auditSummary = selectGovernAuditSummaryView()
  const engineBreakdown = selectGovernEngineBreakdown()
  const auditEntries = selectGovernAuditEntries()
  const flightRecorderEntries = auditEntries.slice(0, 3).map((entry) => {
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

        {/* ── Hero: Immutable Audit Ledger ── */}
        <motion.div variants={fadeUpVariant}>
          <GovernImmutableLedger
            decisionsAudited={auditSummary.total}
            engineBreakdown={engineBreakdown}
            flightRecorderEntries={flightRecorderEntries}
            onOpenLedger={() => navigate('/govern/audit')}
          />
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

          {/* ── Privacy & Model Ethics ── */}
          <motion.section variants={fadeUpVariant} className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 px-2 mb-6">
              Privacy & Model Ethics
            </h2>
            {/* Zone A — governed metrics */}
            <div className="glass-card glass-card-overlay rounded-[32px] p-6 md:p-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-2xl font-mono font-semibold text-blue-400">{trust.auditCoveragePercent}%</span>
                  <span className="text-xs text-white/40">AI decisions audited & logged</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-2xl font-mono font-semibold text-blue-400">{trust.llmRetentionDays} Days</span>
                  <span className="text-xs text-white/40">LLM inference data retained</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-2xl font-mono font-semibold text-blue-400">{trust.llmTrainingOptOut ? 'Never' : 'Permitted'}</span>
                  <span className="text-xs text-white/40">User data used for model training</span>
                </div>
              </div>
            </div>
            {/* Zone B — static policy prose */}
            <div className="mt-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 md:p-6">
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/25 mb-3">Data & Privacy Mandates</p>
              <ul className="space-y-2 text-xs text-white/40 leading-relaxed">
                {PRIVACY_MANDATES.map((text) => <li key={text}>{text}</li>)}
              </ul>
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
