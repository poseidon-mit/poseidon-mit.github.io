import { motion } from "framer-motion"
import { Link } from '@/router'
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
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Surface, ButtonLink } from '@/design-system'

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
  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse engine="govern" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: "var(--engine-govern)", color: "#ffffff" }}>Skip to main content</a>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: "1280px" }} variants={staggerContainer} initial="hidden" animate="visible" role="main">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainer} className="flex flex-col gap-4">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase" style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", color: "var(--engine-govern)" }}>
              <Scale size={12} />Govern Engine
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>
            Compliance score: <span style={{ color: "var(--engine-govern)" }}>{COMPLIANCE_SCORE}/100</span>. {DECISIONS_AUDITED.toLocaleString()} decisions audited.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed" style={{ color: "#CBD5E1" }}>
            Full governance transparency. Every AI decision is explainable, auditable, and reversible.
          </motion.p>
        </motion.section>

        {/* ── Compliance score ring + stats ── */}
        <motion.div variants={fadeUp}>
          <Surface variant="glass" padding="none" className="flex flex-col md:flex-row gap-6 items-center">
            {/* SVG ring */}
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full" aria-label={`Compliance score: ${COMPLIANCE_SCORE}%`}>
                <circle cx="60" cy="60" r="50" fill="none" strokeWidth="8" stroke="rgba(255,255,255,0.06)" />
                <circle cx="60" cy="60" r="50" fill="none" strokeWidth="8" stroke="var(--engine-govern)" strokeLinecap="round" strokeDasharray={`${COMPLIANCE_SCORE * 3.14} ${314 - COMPLIANCE_SCORE * 3.14}`} transform="rotate(-90 60 60)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono tabular-nums" style={{ color: "var(--engine-govern)" }}>{COMPLIANCE_SCORE}</span>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: "#64748B" }}>Score</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { label: "Decisions audited", value: DECISIONS_AUDITED.toLocaleString() },
                { label: "Verified", value: `${VERIFIED_PERCENT}%`, color: "var(--state-healthy)" },
                { label: "Pending review", value: String(PENDING_REVIEW_COUNT), color: "var(--state-warning)" },
                { label: "Flagged", value: String(FLAGGED_COUNT), color: "var(--state-critical)" },
              ].map(d => (
                <div key={d.label} className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "#64748B" }}>{d.label}</span>
                  <span className="text-lg font-bold font-mono tabular-nums" style={{ color: d.color || "#F1F5F9" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </Surface>
        </motion.div>

        {/* ── Decision Ledger + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <motion.section variants={staggerContainer} className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Recent Decisions</h2>
              {ledgerEntries.map(entry => {
                const sCfg = statusConfig[entry.status]
                const SIcon = sCfg.icon
                return (
                  <motion.div key={entry.id} variants={fadeUp}>
                    <Surface variant="glass" padding="none" borderColor={typeColor[entry.type]} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${typeColor[entry.type]}15`, color: typeColor[entry.type] }}><CircleDot size={10} />{entry.type}</span>
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: sCfg.bg, color: sCfg.color }}><SIcon size={10} />{entry.status}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block" style={{ color: "#F1F5F9" }}>{entry.action}</span>
                        <span className="text-[10px] font-mono" style={{ color: "#64748B" }}>{entry.id}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono tabular-nums" style={{ color: entry.confidence >= 0.9 ? "var(--state-healthy)" : entry.confidence >= 0.8 ? "var(--engine-govern)" : "var(--state-warning)" }}>{formatConfidence(entry.confidence)}</span>
                        <span className="text-xs" style={{ color: "#64748B" }}>{entry.time}</span>
                      </div>
                    </Surface>
                  </motion.div>
                )
              })}
            </motion.section>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Governance sidebar">
            <Surface variant="glass" padding="none" className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Compliance Breakdown</h3>
              {[
                { label: "Transparency", pct: 98, color: "var(--state-healthy)" },
                { label: "Auditability", pct: 100, color: "var(--state-healthy)" },
                { label: "Reversibility", pct: 95, color: "var(--state-healthy)" },
                { label: "Human oversight", pct: 88, color: "var(--engine-govern)" },
              ].map(r => (
                <div key={r.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between"><span className="text-xs" style={{ color: "#94A3B8" }}>{r.label}</span><span className="text-xs font-mono tabular-nums" style={{ color: r.color }}>{r.pct}%</span></div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}><div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.pct}%`, background: r.color }} /></div>
                </div>
              ))}
            </Surface>

            <Surface variant="glass" padding="none" className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Policy Status</h3>
              {[{ label: "Active policies", value: "12" }, { label: "Last updated", value: "2h ago" }, { label: "Auto-enforce", value: "Enabled", color: "var(--state-healthy)" }].map(d => (
                <div key={d.label} className="flex items-center justify-between"><span className="text-xs" style={{ color: "#64748B" }}>{d.label}</span><span className="text-sm font-mono font-semibold" style={{ color: d.color || "#F1F5F9" }}>{d.value}</span></div>
              ))}
            </Surface>

            {/* Primary CTA: Open audit ledger -> /govern/audit */}
            <ButtonLink to="/govern/audit" variant="glass" engine="govern" className="rounded-xl" icon={<ArrowUpRight size={16} />} iconPosition="right">
              Open audit ledger
            </ButtonLink>
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
