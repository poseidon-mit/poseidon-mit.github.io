import { motion } from "framer-motion"
import { Link, useRouter } from '@/router'
import {
  Scale,
  Shield,
  ShieldCheck,
  ExternalLink,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  CircleDot,
  type LucideIcon,
} from "lucide-react"
import { DEMO_THREAD } from '@/lib/demo-thread'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { AuroraPulse, GovernFooter } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { Surface, ButtonLink } from '@/design-system'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/* ── Cross-thread values ── */
const DECISIONS_AUDITED = DEMO_THREAD.decisionsAudited
const COMPLIANCE_SCORE = DEMO_THREAD.complianceScore
const VERIFIED_COUNT = 1189
const PENDING_REVIEW_COUNT = 55
const FLAGGED_COUNT = 3
const VERIFIED_PERCENT = Math.round((VERIFIED_COUNT / DECISIONS_AUDITED) * 100)

/* ── Data ── */
type DecisionType = "Protect" | "Grow" | "Execute" | "Govern"
type DecisionStatus = "Verified" | "Pending" | "Flagged"

const typeColor: Record<DecisionType, string> = { Protect: "var(--engine-protect)", Grow: "var(--engine-grow)", Execute: "var(--engine-execute)", Govern: "var(--engine-govern)" }
const statusConfig: Record<DecisionStatus, { color: string; bg: string; icon: LucideIcon }> = {
  Verified: { color: "var(--engine-govern)", bg: "rgba(59,130,246,0.12)", icon: CheckCircle2 },
  Pending: { color: "var(--state-warning)", bg: "rgba(245,158,11,0.12)", icon: Clock },
  Flagged: { color: "var(--state-critical)", bg: "rgba(239,68,68,0.12)", icon: AlertTriangle },
}

const ledgerEntries = [
  { id: "GV-2026-0319-847", type: "Execute" as DecisionType, action: "Portfolio rebalance", confidence: 0.97, status: "Verified" as DecisionStatus, time: formatDemoTimestamp("2026-03-19T14:28:00-04:00") },
  { id: "GV-2026-0319-846", type: "Protect" as DecisionType, action: "Block wire transfer", confidence: 0.94, status: "Verified" as DecisionStatus, time: formatDemoTimestamp("2026-03-19T14:15:00-04:00") },
  { id: "GV-2026-0319-845", type: "Grow" as DecisionType, action: "Subscription consolidation", confidence: 0.89, status: "Verified" as DecisionStatus, time: formatDemoTimestamp("2026-03-19T13:52:00-04:00") },
  { id: "GV-2026-0319-844", type: "Execute" as DecisionType, action: "Archive invoices", confidence: 0.78, status: "Pending" as DecisionStatus, time: formatDemoTimestamp("2026-03-19T11:20:00-04:00") },
  { id: "GV-2026-0318-843", type: "Protect" as DecisionType, action: "Unusual transaction", confidence: 0.92, status: "Verified" as DecisionStatus, time: formatDemoTimestamp("2026-03-18T16:42:00-04:00") },
  { id: "GV-2026-0318-842", type: "Govern" as DecisionType, action: "Policy update", confidence: 0.97, status: "Verified" as DecisionStatus, time: formatDemoTimestamp("2026-03-18T09:40:00-04:00") },
]

/* ═══════════════════════════════════════════════════════
   GOVERN PAGE
   CTA: "Open audit ledger" -> /govern/audit (line 667-668)
   ═══════════════════════════════════════════════════════ */

export default function GovernPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse engine="govern" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: "var(--engine-govern)", color: "#ffffff" }}>Skip to main content</a>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12 w-full pt-8 lg:pt-12" style={{ maxWidth: "1440px" }} variants={staggerContainerVariant} initial="hidden" animate="visible" role="main">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
          <motion.div variants={fadeUpVariant}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/10 text-[var(--engine-govern)] text-xs font-bold tracking-widest uppercase self-start shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--engine-govern)]/20"><Scale size={12} /></span>
              Govern Engine
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Governance & Oversight
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide mb-2">
            Transparent, accountable AI. Every decision strictly audited and mathematically provable.
          </p>
        </motion.section>

        {/* ── Compliance score ring + stats ── */}
        <motion.div variants={fadeUpVariant} className="px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
            {[
              { label: "Decisions audited", value: DECISIONS_AUDITED.toLocaleString(), color: "white" },
              { label: "Verified", value: `${VERIFIED_PERCENT}%`, color: "var(--state-healthy)" },
              { label: "Pending review", value: String(PENDING_REVIEW_COUNT), color: "var(--state-warning)" },
              { label: "Flagged", value: String(FLAGGED_COUNT), color: "var(--state-critical)" },
            ].map(d => (
              <Surface key={d.label} className="relative overflow-hidden rounded-[24px] p-8 lg:p-12 backdrop-blur-3xl bg-black/60 shadow-lg border border-white/[0.08] hover:bg-white/[0.02] transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-govern)]/5 to-transparent pointer-events-none" />
                <div className="flex flex-col gap-3 relative z-10">
                  <span className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white/50">{d.label}</span>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-light font-mono tabular-nums tracking-tight" style={{ color: d.color, textShadow: d.color !== 'white' ? `0 0 15px ${d.color}60` : 'none' }}>{d.value}</span>
                </div>
              </Surface>
            ))}
          </div>
        </motion.div>

        {/* ── Decision Ledger + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 px-2">Decision Ledger</h2>
              <div className="flex flex-col">
                <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="flex flex-col divide-y divide-white/[0.04] relative z-10">
                    {ledgerEntries.map(entry => {
                      const sCfg = statusConfig[entry.status];
                      const SIcon = sCfg.icon;
                      return (
                        <motion.div key={entry.id} variants={fadeUpVariant} onClick={() => navigate(`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`)} className="group cursor-pointer p-6 md:p-8 hover:bg-white/[0.04] transition-colors flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.05] shrink-0" style={{ background: `${typeColor[entry.type]}15`, color: typeColor[entry.type] }}><CircleDot size={16} /></span>
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                              <span className="text-base font-light tracking-wide text-white group-hover:text-[var(--engine-govern)] transition-colors truncate">{entry.action}</span>
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-[10px] uppercase tracking-widest font-mono text-white/40">{entry.id}</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1" style={{ color: sCfg.color }}><SIcon size={10} />{entry.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-6 shrink-0">
                            <div className="flex-col items-end gap-1.5 hidden md:flex">
                              <span className="text-sm font-mono tracking-widest" style={{ color: entry.confidence >= 0.9 ? "var(--state-healthy)" : entry.confidence >= 0.8 ? "var(--engine-govern)" : "var(--state-warning)", textShadow: `0 0 10px ${entry.confidence >= 0.9 ? "var(--state-healthy)" : entry.confidence >= 0.8 ? "var(--engine-govern)" : "var(--state-warning)"}60` }}>{formatConfidence(entry.confidence)}</span>
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
                </Surface>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Governance sidebar">
            <div className="sticky top-24 flex flex-col gap-6">
              <Surface className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4">Compliance Breakdown</h3>
                <div className="relative z-10 flex flex-col gap-5">
                  {[
                    { label: "Transparency", pct: 92, color: "var(--state-healthy)" },
                    { label: "Auditability", pct: 96, color: "var(--state-healthy)" },
                    { label: "Reversibility", pct: 89, color: "var(--state-healthy)" },
                    { label: "Human oversight", pct: 84, color: "var(--engine-govern)" },
                  ].map(r => (
                    <div key={r.label} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-medium text-white/70">{r.label}</span>
                        <span className="text-xs font-mono font-medium tracking-tight tabular-nums" style={{ color: r.color, textShadow: `0 0 10px ${r.color}60` }}>{r.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden bg-white/10 shadow-inner">
                        <div className="h-full rounded-full transition-all duration-500 shadow-[0_0_8px_currentColor]" style={{ width: `${r.pct}%`, background: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Surface>

              <Surface className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4">Policy Status</h3>
                <div className="relative z-10 flex flex-col gap-4">
                  {[{ label: "Active policies", value: "12" }, { label: "Last updated", value: "2h ago" }, { label: "Auto-enforce", value: "Enabled", color: "var(--state-healthy)" }].map(d => (
                    <div key={d.label} className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-medium text-white/50">{d.label}</span>
                      <span className="text-sm font-mono tracking-tight tabular-nums" style={{ color: d.color || "white", textShadow: d.color ? `0 0 10px ${d.color}60` : 'none' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </Surface>

              {/* Primary CTA: Open audit ledger -> /govern/audit */}
              <ButtonLink to="/govern/audit" variant="primary" engine="govern" className="w-full rounded-2xl text-base px-6 py-4 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all bg-[var(--engine-govern)] text-black border-none font-semibold flex items-center justify-center gap-2">
                Open audit ledger
                <ArrowUpRight size={18} />
              </ButtonLink>
            </div>
          </aside>
        </div>

        <GovernFooter
          auditId={GOVERNANCE_META['/govern'].auditId}
          pageContext={GOVERNANCE_META['/govern'].pageContext}
        />
      </motion.div>
    </div>
  )
}
