import React, { useState } from "react"
import { motion } from "framer-motion"
import { Link } from '@/router'
import {
  ShieldCheck,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  CircleDot,
  FileText,
  User,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react"
import { DEMO_THREAD } from '@/lib/demo-thread'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { AuroraPulse, EmptyState, GovernFooter, PreviewBadge } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { Surface, Button, ButtonLink } from '@/design-system'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useRouter } from '@/router'

/* ── Cross-thread values ── */
const DECISIONS_AUDITED = DEMO_THREAD.decisionsAudited
const COMPLIANCE_SCORE = DEMO_THREAD.complianceScore
const VERIFIED_COUNT = 1189
const PENDING_REVIEW_COUNT = 55
const FLAGGED_COUNT = 3
const VERIFIED_PERCENT = Math.round((VERIFIED_COUNT / DECISIONS_AUDITED) * 100)
const PENDING_REVIEW_PERCENT = Math.round((PENDING_REVIEW_COUNT / DECISIONS_AUDITED) * 100)
const FLAGGED_PERCENT = Math.round((FLAGGED_COUNT / DECISIONS_AUDITED) * 100)

/* ── Data ── */
type DecisionType = "Protect" | "Grow" | "Execute" | "Govern"
type DecisionStatus = "Verified" | "Pending review" | "Flagged"
type FilterTab = "All" | "Verified" | "Pending review" | "Flagged"
type SortField = "id" | "timestamp" | "confidence" | "evidence"
type SortDir = "asc" | "desc"

interface AuditEntry {
  id: string
  timestamp: string
  sortTime: number
  type: DecisionType
  action: string
  confidence: number
  evidence: number
  status: DecisionStatus
}

const toAuditTimestamp = (value: string) =>
  formatDemoTimestamp(value, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

const filterTabs: { label: FilterTab; count?: number }[] = [
  { label: "All" },
  { label: "Verified", count: VERIFIED_COUNT },
  { label: "Pending review", count: PENDING_REVIEW_COUNT },
  { label: "Flagged", count: FLAGGED_COUNT },
]

const auditEntries: AuditEntry[] = [
  { id: "GV-2026-0319-847", timestamp: toAuditTimestamp("2026-03-19T14:28:00-04:00"), sortTime: new Date("2026-03-19T14:28:00-04:00").getTime(), type: "Execute", action: "Portfolio rebalance", confidence: 0.97, evidence: 12, status: "Verified" },
  { id: "GV-2026-0319-846", timestamp: toAuditTimestamp("2026-03-19T14:15:00-04:00"), sortTime: new Date("2026-03-19T14:15:00-04:00").getTime(), type: "Protect", action: "Block wire transfer", confidence: 0.94, evidence: 9, status: "Verified" },
  { id: "GV-2026-0319-845", timestamp: toAuditTimestamp("2026-03-19T13:52:00-04:00"), sortTime: new Date("2026-03-19T13:52:00-04:00").getTime(), type: "Grow", action: "Subscription consolidation", confidence: 0.89, evidence: 7, status: "Verified" },
  { id: "GV-2026-0319-844", timestamp: toAuditTimestamp("2026-03-19T11:20:00-04:00"), sortTime: new Date("2026-03-19T11:20:00-04:00").getTime(), type: "Execute", action: "Archive invoices", confidence: 0.78, evidence: 5, status: "Pending review" },
  { id: "GV-2026-0318-843", timestamp: toAuditTimestamp("2026-03-18T16:42:00-04:00"), sortTime: new Date("2026-03-18T16:42:00-04:00").getTime(), type: "Protect", action: "Unusual transaction", confidence: 0.92, evidence: 10, status: "Verified" },
  { id: "GV-2026-0318-842", timestamp: toAuditTimestamp("2026-03-18T10:18:00-04:00"), sortTime: new Date("2026-03-18T10:18:00-04:00").getTime(), type: "Grow", action: "Goal update", confidence: 0.86, evidence: 6, status: "Verified" },
  { id: "GV-2026-0317-841", timestamp: toAuditTimestamp("2026-03-17T14:12:00-04:00"), sortTime: new Date("2026-03-17T14:12:00-04:00").getTime(), type: "Execute", action: "Payment processed", confidence: 0.91, evidence: 8, status: "Verified" },
  { id: "GV-2026-0317-840", timestamp: toAuditTimestamp("2026-03-17T09:40:00-04:00"), sortTime: new Date("2026-03-17T09:40:00-04:00").getTime(), type: "Govern", action: "Policy update", confidence: 0.97, evidence: 15, status: "Verified" },
]

const typeColor: Record<DecisionType, string> = { Protect: "var(--engine-protect)", Grow: "var(--engine-grow)", Execute: "var(--engine-execute)", Govern: "var(--engine-govern)" }
const typeBg: Record<DecisionType, string> = { Protect: "rgba(34,197,94,0.12)", Grow: "rgba(139,92,246,0.12)", Execute: "rgba(234,179,8,0.12)", Govern: "rgba(59,130,246,0.12)" }
const statusCfg: Record<DecisionStatus, { color: string; bg: string; icon: LucideIcon }> = {
  Verified: { color: "var(--engine-govern)", bg: "rgba(59,130,246,0.12)", icon: CheckCircle2 },
  "Pending review": { color: "var(--state-warning)", bg: "rgba(245,158,11,0.12)", icon: Clock },
  Flagged: { color: "var(--state-critical)", bg: "rgba(239,68,68,0.12)", icon: AlertTriangle },
}

function getConfidenceColor(c: number) { return c >= 0.9 ? "var(--state-healthy)" : c >= 0.8 ? "var(--engine-govern)" : c >= 0.7 ? "var(--state-warning)" : "var(--state-critical)" }

/* ═══════════════════════════════════════════════════════
   GOVERN AUDIT LEDGER PAGE
   CTA: "Back to govern overview" -> /govern (line 696-697)
   ═══════════════════════════════════════════════════════ */

export default function GovernAuditPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All")
  const [sortField, setSortField] = useState<SortField>("timestamp")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) { setSortDir(d => d === "asc" ? "desc" : "asc") }
    else { setSortField(field); setSortDir("desc") }
  }

  let filtered = auditEntries as AuditEntry[]
  if (activeFilter !== "All") { filtered = filtered.filter(e => e.status === activeFilter) }
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(e => e.id.toLowerCase().includes(q) || e.type.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.timestamp.toLowerCase().includes(q))
  }

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0
    switch (sortField) {
      case "id": cmp = a.id.localeCompare(b.id); break
      case "timestamp": cmp = a.sortTime - b.sortTime; break
      case "confidence": cmp = a.confidence - b.confidence; break
      case "evidence": cmp = a.evidence - b.evidence; break
    }
    return sortDir === "asc" ? cmp : -cmp
  })

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={11} style={{ color: "#475569" }} />
    return sortDir === "asc" ? <ArrowUp size={11} style={{ color: "var(--engine-govern)" }} /> : <ArrowDown size={11} style={{ color: "var(--engine-govern)" }} />
  }

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse engine="govern" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: "var(--engine-govern)", color: "#ffffff" }}>Skip to main content</a>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12 w-full pt-8 lg:pt-12"
        style={{ maxWidth: "1440px" }}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >

        {/* ── Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
          <motion.div variants={fadeUpVariant} className="flex items-center justify-between">
            <Link to="/govern" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-white/70 hover:text-white backdrop-blur-md">
              <ArrowLeft size={16} />Back to Govern
            </Link>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/10 text-[var(--engine-govern)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--engine-govern)]/20"><ShieldCheck size={12} /></span>
              Audit Ledger
            </span>
          </motion.div>
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>Audit Ledger</h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">Immutable record of {DECISIONS_AUDITED.toLocaleString()} decisions with full evidence chain</p>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="flex flex-col md:flex-row gap-4 items-center justify-between w-full mt-4">
            {/* Search */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] px-4 py-3 bg-white/[0.02] backdrop-blur-xl w-full md:max-w-md focus-within:border-[var(--engine-govern)]/50 focus-within:bg-white/[0.04] transition-all shadow-inner">
              <Search size={18} className="text-white/40" aria-hidden="true" />
              <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search ID, type, or date..." className="flex-1 bg-transparent text-sm md:text-base outline-none placeholder:text-white/30 text-white font-light tracking-wide" aria-label="Search audit ledger" />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto" role="tablist" aria-label="Filter decisions">
              {filterTabs.map(f => {
                const isActive = f.label === activeFilter
                return (
                  <Button key={f.label} role="tab" aria-selected={isActive} onClick={() => setActiveFilter(f.label)} variant={isActive ? "primary" : "glass"} engine="govern" size="sm" className={`rounded-full text-xs transition-all ${isActive ? 'bg-[var(--engine-govern)] text-black font-semibold shadow-[0_0_15px_rgba(20,184,166,0.4)] border-none' : 'text-white/70 hover:text-white'}`} springPress={false}>
                    {f.label}
                    {f.count != null && <span className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'}`}>{f.count}</span>}
                  </Button>
                )
              })}
            </div>
          </motion.div>
        </motion.section>

        {/* ── Table + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8 mt-4">
          <div className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-6">
            {/* Desktop table */}
            <div className="hidden md:block">
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-0">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                {sorted.length === 0 ? (
                  <div className="p-12 relative z-10">
                    <EmptyState
                      icon={Search}
                      title="No matching decisions"
                      description="Try adjusting filters or using a different search term."
                      accentColor="var(--engine-govern)"
                    />
                  </div>
                ) : null}
                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-left" role="table">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/[0.06]">
                        <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold cursor-pointer select-none text-white/50 hover:text-white/80 transition-colors" scope="col" onClick={() => handleSort("id")}><div className="flex items-center gap-2">{"Decision ID"} <SortIndicator field="id" /></div></th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold cursor-pointer select-none text-white/50 hover:text-white/80 transition-colors" scope="col" onClick={() => handleSort("timestamp")}><div className="flex items-center gap-2">Timestamp <SortIndicator field="timestamp" /></div></th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-white/50" scope="col">Type</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-white/50" scope="col">Action</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold cursor-pointer select-none text-white/50 hover:text-white/80 transition-colors" scope="col" onClick={() => handleSort("confidence")}><div className="flex items-center gap-2">Confidence <SortIndicator field="confidence" /></div></th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold cursor-pointer select-none text-white/50 hover:text-white/80 transition-colors" scope="col" onClick={() => handleSort("evidence")}><div className="flex items-center gap-2">Evidence <SortIndicator field="evidence" /></div></th>
                        <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-white/50" scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {sorted.map(entry => {
                        const sCfg = statusCfg[entry.status]
                        const SIcon = sCfg.icon
                        return (
                          <motion.tr
                            key={entry.id}
                            variants={fadeUpVariant}
                            className="group cursor-pointer transition-colors hover:bg-white/[0.04] focus-within:bg-white/[0.04]"
                            onClick={() => navigate(`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                navigate(`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`)
                              }
                            }}
                            tabIndex={0}
                            aria-label={`Open audit detail for ${entry.id}`}
                          >
                            <td className="px-6 py-4">
                              <Link
                                to={`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`}
                                className="text-sm font-mono tracking-wide underline-offset-4 hover:underline focus-visible:underline text-[var(--engine-govern)] transition-all group-hover:text-teal-300"
                                aria-label={`Open audit detail for ${entry.id}`}
                              >
                                {entry.id}
                              </Link>
                            </td>
                            <td className="px-6 py-4"><span className="text-xs tracking-wide text-white/60">{entry.timestamp}</span></td>
                            <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-widest border border-white/[0.05]" style={{ background: typeBg[entry.type], color: typeColor[entry.type] }}><CircleDot size={12} />{entry.type}</span></td>
                            <td className="px-6 py-4"><span className="text-sm tracking-wide text-white/90 font-light">{entry.action}</span></td>
                            <td className="px-6 py-4"><span className="text-sm font-mono tracking-widest" style={{ color: getConfidenceColor(entry.confidence), textShadow: `0 0 10px ${getConfidenceColor(entry.confidence)}50` }}>{formatConfidence(entry.confidence)}</span></td>
                            <td className="px-6 py-4"><span className="text-sm font-mono tracking-widest text-white/80">{entry.evidence}</span></td>
                            <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-widest border border-white/[0.05]" style={{ background: sCfg.bg, color: sCfg.color }}><SIcon size={12} />{entry.status}</span></td>
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Surface>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-4 md:hidden">
              {sorted.length === 0 ? (
                <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-8">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <EmptyState
                      icon={Search}
                      title="No matching decisions"
                      description="Try adjusting filters or using a different search term."
                      accentColor="var(--engine-govern)"
                    />
                  </div>
                </Surface>
              ) : null}
              {sorted.map(entry => {
                const sCfg = statusCfg[entry.status]
                const SIcon = sCfg.icon
                return (
                  <motion.div key={entry.id} variants={fadeUpVariant}>
                    <Surface className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-5 flex flex-col gap-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                      <div className="relative z-10 flex items-center gap-2 flex-wrap pb-3 border-b border-white/[0.06]">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-widest border border-white/[0.05]" style={{ background: typeBg[entry.type], color: typeColor[entry.type] }}><CircleDot size={12} />{entry.type}</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-widest border border-white/[0.05]" style={{ background: sCfg.bg, color: sCfg.color }}><SIcon size={12} />{entry.status}</span>
                        <span className="ml-auto text-[10px] uppercase tracking-widest text-white/40">{entry.timestamp}</span>
                      </div>
                      <div className="relative z-10 flex flex-col gap-1">
                        <Link
                          to={`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`}
                          className="text-base font-mono font-medium tracking-wide underline-offset-4 hover:underline focus-visible:underline text-[var(--engine-govern)]"
                          aria-label={`Open audit detail for ${entry.id}`}
                        >
                          {entry.id}
                        </Link>
                        <span className="text-sm font-light tracking-wide text-white/90">{entry.action}</span>
                      </div>
                      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        <span className="text-xs text-white/50 tracking-wide">{entry.evidence} evidence pts</span>
                        <span className="text-xs font-mono tracking-widest" style={{ color: getConfidenceColor(entry.confidence), textShadow: `0 0 10px ${getConfidenceColor(entry.confidence)}50` }}>Conf: {formatConfidence(entry.confidence)}</span>
                      </div>
                    </Surface>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Audit sidebar">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Summary */}
              <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-5">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4">Audit Summary</h3>
                <div className="relative z-10 flex flex-col gap-4">
                  {[
                    { label: "Total decisions", value: DECISIONS_AUDITED.toLocaleString() },
                    { label: "Verified", value: `${VERIFIED_COUNT.toLocaleString()} (${VERIFIED_PERCENT}%)`, color: "var(--state-healthy)" },
                    { label: "Pending", value: `${PENDING_REVIEW_COUNT.toLocaleString()} (${PENDING_REVIEW_PERCENT}%)`, color: "var(--state-warning)" },
                    { label: "Flagged", value: `${FLAGGED_COUNT.toLocaleString()} (${FLAGGED_PERCENT}%)`, color: "var(--state-critical)" },
                    { label: "Avg evidence", value: "8.4 pts" },
                    { label: "Compliance", value: `${COMPLIANCE_SCORE}%`, color: "var(--state-healthy)" },
                  ].map(d => (
                    <div key={d.label} className="flex items-center justify-between">
                      <span className="text-xs tracking-wide text-white/60">{d.label}</span>
                      <span className="text-sm font-mono tracking-widest" style={{ color: d.color || "white", textShadow: d.color ? `0 0 10px ${d.color}60` : 'none' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </Surface>

              {/* Evidence flow */}
              <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4">Evidence Flow</h3>
                <div className="relative z-10 flex flex-col gap-3 mt-2">
                  {["Data Source", "AI Analysis", "Evidence Aggregation", "Confidence Score", "Audit Record"].map((step, i, arr) => (
                    <React.Fragment key={step}>
                      <div className="w-full flex items-center justify-center rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-widest border border-[var(--engine-govern)]/30 bg-[var(--engine-govern)]/10 text-[var(--engine-govern)] shadow-inner">{step}</div>
                      {i < arr.length - 1 && <div className="flex items-center justify-center -my-1" aria-hidden="true"><ArrowDown size={16} className="text-[var(--engine-govern)]/50 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]" /></div>}
                    </React.Fragment>
                  ))}
                </div>
              </Surface>

              {/* Export */}
              <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-5">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4">Export Options</h3>
                <div className="relative z-10 flex flex-col gap-3">
                  <Button disabled title="Export available in production release" variant="glass" engine="govern" fullWidth className="rounded-2xl text-sm py-4 cursor-not-allowed opacity-60 border border-white/[0.08] hover:border-white/[0.08]" aria-label="Export full ledger preview only">
                    <Download size={16} className="mr-2" />Export full ledger (CSV)<PreviewBadge className="ml-2" />
                  </Button>
                  <Button disabled title="Export available in production release" variant="glass" engine="govern" fullWidth className="rounded-2xl text-sm py-4 cursor-not-allowed opacity-60 border border-white/[0.08] hover:border-white/[0.08]" aria-label="Generate compliance report preview only">
                    <FileText size={16} className="mr-2" />Generate report (PDF)<PreviewBadge className="ml-2" />
                  </Button>
                </div>
              </Surface>

              {/* Primary CTA: Back to govern overview -> /govern */}
              <ButtonLink to="/govern" variant="glass" engine="govern" className="w-full rounded-2xl text-lg px-6 py-5 shadow-[0_0_20px_rgba(20,184,166,0.15)] hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-white font-semibold flex items-center justify-center gap-2">
                <ArrowLeft size={18} />Back to govern overview
              </ButtonLink>
            </div>
          </aside>
        </div>

        <GovernFooter
          auditId={GOVERNANCE_META['/govern/audit'].auditId}
          pageContext={GOVERNANCE_META['/govern/audit'].pageContext}
        />
      </motion.div>
    </div>
  )
}
