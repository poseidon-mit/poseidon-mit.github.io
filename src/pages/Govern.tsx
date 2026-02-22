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
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/* ── Cross-thread values (Single Source of Truth) ── */
const DECISIONS_AUDITABLE = 50
const REVIEW_RECOMMENDED_COUNT = 10
const FLAGGED_COUNT = 3

/* ── Data ── */
type DecisionType = "Protect" | "Grow" | "Execute" | "Govern"
type DecisionStatus = "Review Recommended" | "Flagged"

const typeColor: Record<DecisionType, string> = { Protect: "var(--engine-protect)", Grow: "var(--engine-grow)", Execute: "var(--engine-execute)", Govern: "var(--engine-govern)" }
const statusConfig: Record<DecisionStatus, { color: string; icon: LucideIcon }> = {
  "Review Recommended": { color: "var(--state-warning)", icon: Clock },
  Flagged: { color: "var(--state-critical)", icon: AlertTriangle },
}

const ledgerEntries: { id: string; type: DecisionType; action: string; confidence: number; status?: DecisionStatus; time: string }[] = [
  { id: "GV-2026-0319-847", type: "Protect", action: "Block wire — TechElectro Store", confidence: 0.94, status: "Flagged", time: formatDemoTimestamp("2026-03-19T14:28:00-04:00") },
  { id: "GV-2026-0319-846", type: "Protect", action: "Flag — Unknown Vendor", confidence: 0.87, status: "Review Recommended", time: formatDemoTimestamp("2026-03-19T14:15:00-04:00") },
  { id: "GV-2026-0319-845", type: "Grow", action: "Increase contribution by $420", confidence: 0.89, status: "Review Recommended", time: formatDemoTimestamp("2026-03-19T13:52:00-04:00") },
  { id: "GV-2026-0319-844", type: "Protect", action: "High-risk category — Crypto Exchange", confidence: 0.91, status: "Flagged", time: formatDemoTimestamp("2026-03-19T11:20:00-04:00") },
  { id: "GV-2026-0318-843", type: "Protect", action: "International wire — Travel Agency XYZ", confidence: 0.72, time: formatDemoTimestamp("2026-03-18T16:42:00-04:00") },
  { id: "GV-2026-0318-842", type: "Grow", action: "Maintain current savings rate", confidence: 0.94, time: formatDemoTimestamp("2026-03-18T09:40:00-04:00") },
  { id: "GV-2026-0318-841", type: "Protect", action: "Unusual ATM withdrawal — Gas Station", confidence: 0.65, time: formatDemoTimestamp("2026-03-18T08:15:00-04:00") },
  { id: "GV-2026-0317-840", type: "Grow", action: "No action needed — Home down payment", confidence: 0.91, time: formatDemoTimestamp("2026-03-17T15:30:00-04:00") },
]


/* ═══════════════════════════════════════════════════════
   GOVERN PAGE
   CTA: "Open audit ledger" -> /govern/audit (line 667-668)
   ═══════════════════════════════════════════════════════ */

export default function GovernPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: "var(--engine-govern)", color: "#ffffff" }}>Skip to main content</a>

      <motion.div id="main-content" className="flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12 w-full" variants={staggerContainerVariant} initial="hidden" animate="visible" role="main">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
          <motion.div variants={fadeUpVariant}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/10 px-3 py-1.5 text-xs font-bold tracking-widest uppercase text-[var(--engine-govern)] shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <ShieldCheck size={12} /> Engine status: Good
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            <span className="bg-gradient-to-r from-[var(--engine-govern)] to-[var(--engine-grow)] bg-clip-text text-transparent">100% auditability</span> for every AI decision
          </h1>
        </motion.section>

        {/* ── Compliance score ring + stats ── */}
        <motion.div variants={fadeUpVariant} className="px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full">
            {[
              { label: "Decision auditable", value: String(DECISIONS_AUDITABLE), color: "white" },
              { label: "Review Recommended", value: String(REVIEW_RECOMMENDED_COUNT), color: "var(--state-warning)" },
              { label: "Flagged", value: String(FLAGGED_COUNT), color: "var(--state-critical)" },
            ].map(d => (
              <div key={d.label} className="relative overflow-hidden rounded-[24px] p-8 lg:p-12 backdrop-blur-3xl bg-black/60 shadow-lg border border-white/[0.08] hover:bg-white/[0.02] transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-govern)]/5 to-transparent pointer-events-none" />
                <div className="flex flex-col gap-3 relative z-10">
                  <span className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white/50">{d.label}</span>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-light font-mono tabular-nums tracking-tight" style={{ color: d.color, textShadow: d.color !== 'white' ? `0 0 15px ${d.color}60` : 'none' }}>{d.value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Decision Ledger ── */}
        <div className="px-4 md:px-6 lg:px-8">
          <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 px-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">Decision Ledger</h2>
              <div className="flex items-center gap-2">
                <button type="button" disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/30 text-[10px] uppercase tracking-widest cursor-not-allowed"><Search size={12} />Search</button>
                <button type="button" disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/30 text-[10px] uppercase tracking-widest cursor-not-allowed"><ArrowUpDown size={12} />Sort</button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-0">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex flex-col divide-y divide-white/[0.04] relative z-10">
                {ledgerEntries.map(entry => {
                  const sCfg = entry.status ? statusConfig[entry.status] : null;
                  return (
                    <motion.div key={entry.id} variants={fadeUpVariant} onClick={() => navigate(`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`)} className="group cursor-pointer p-6 md:p-8 hover:bg-white/[0.04] transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.05] shrink-0" style={{ background: `${typeColor[entry.type]}15`, color: typeColor[entry.type] }}><CircleDot size={16} /></span>
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                          <span className="text-base font-light tracking-wide text-white group-hover:text-[var(--engine-govern)] transition-colors truncate">{entry.action}</span>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[10px] uppercase tracking-widest font-mono text-white/40">{entry.id}</span>
                            {sCfg && <span className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1" style={{ color: sCfg.color }}><sCfg.icon size={10} />{entry.status}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-6 shrink-0">
                        <div className="flex-col items-end gap-1.5 hidden md:flex">
                          <span className="text-sm font-mono tracking-widest" style={{ color: entry.confidence >= 0.9 ? "var(--state-healthy)" : entry.confidence >= 0.8 ? "var(--engine-govern)" : "var(--state-warning)", textShadow: `0 0 10px ${entry.confidence >= 0.9 ? "var(--state-healthy)" : entry.confidence >= 0.8 ? "var(--engine-govern)" : "var(--state-warning)"}60` }}>Confidence {formatConfidence(entry.confidence)}</span>
                          <span className="text-[10px] uppercase tracking-widest text-white/30">{entry.time}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full hidden sm:flex items-center justify-center border border-white/[0.05] bg-white/[0.02] group-hover:bg-white/[0.1] group-hover:border-[var(--engine-govern)]/30 transition-all shadow-inner">
                          <ArrowUpRight size={14} className="text-white/60 group-hover:text-[var(--engine-govern)]" />
                        </div>
                      </div>
                    </motion.div>
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
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
                  <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
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
