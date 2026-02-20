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
import { AuroraPulse, GovernFooter } from '@/components/poseidon'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Surface, Button, ButtonLink } from '@/design-system'

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
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: "1280px" }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        role="main"
      >

        {/* ── Hero ── */}
        <motion.section variants={staggerContainer} className="flex flex-col gap-6">
          <motion.div variants={fadeUp}>
            <Link to="/govern" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-white/[0.04]" style={{ color: "#94A3B8" }}>
              <ArrowLeft size={16} />Back to Govern
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase" style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", color: "var(--engine-govern)" }}><ShieldCheck size={12} />Audit Ledger</span>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Audit Ledger</h1>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: "#CBD5E1" }}>Immutable record of {DECISIONS_AUDITED.toLocaleString()} decisions with full evidence chain</p>
          </motion.div>

          {/* Search */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <Search size={16} style={{ color: "#64748B" }} aria-hidden="true" />
              <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by decision ID, type, or date..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#475569]" style={{ color: "#F1F5F9" }} aria-label="Search audit ledger" />
            </div>
          </motion.div>

          {/* Filter pills */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2" role="tablist" aria-label="Filter decisions">
            {filterTabs.map(f => {
              const isActive = f.label === activeFilter
              return (
                <Button key={f.label} role="tab" aria-selected={isActive} onClick={() => setActiveFilter(f.label)} variant="glass" engine="govern" size="sm" className="rounded-full text-xs" springPress={false}>
                  {f.label}
                  {f.count != null && <span className="text-[10px]" style={{ color: isActive ? "var(--engine-govern)" : "#64748B" }}>({f.count})</span>}
                </Button>
              )
            })}
          </motion.div>
        </motion.section>

        {/* ── Table + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 lg:w-2/3">
            {/* Desktop table */}
            <div className="hidden md:block">
              <Surface variant="glass" padding="none" className="overflow-hidden !p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left" role="table">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("id")}><div className="flex items-center gap-1">{"Decision ID"} <SortIndicator field="id" /></div></th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("timestamp")}><div className="flex items-center gap-1">Timestamp <SortIndicator field="timestamp" /></div></th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#64748B" }} scope="col">Type</th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#64748B" }} scope="col">Action</th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("confidence")}><div className="flex items-center gap-1">Confidence <SortIndicator field="confidence" /></div></th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("evidence")}><div className="flex items-center gap-1">Evidence <SortIndicator field="evidence" /></div></th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#64748B" }} scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map(entry => {
                        const sCfg = statusCfg[entry.status]
                        const SIcon = sCfg.icon
                        return (
                          <motion.tr key={entry.id} variants={fadeUp} className="group transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <td className="px-4 py-3.5">
                              <Link
                                to={`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`}
                                className="text-sm font-mono font-medium underline-offset-2 hover:underline focus-visible:underline"
                                style={{ color: "var(--engine-govern)" }}
                                aria-label={`Open audit detail for ${entry.id}`}
                              >
                                {entry.id}
                              </Link>
                            </td>
                            <td className="px-4 py-3.5"><span className="text-xs" style={{ color: "#94A3B8" }}>{entry.timestamp}</span></td>
                            <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: typeBg[entry.type], color: typeColor[entry.type] }}><CircleDot size={10} />{entry.type}</span></td>
                            <td className="px-4 py-3.5"><span className="text-sm" style={{ color: "#CBD5E1" }}>{entry.action}</span></td>
                            <td className="px-4 py-3.5"><span className="text-xs font-mono tabular-nums" style={{ color: getConfidenceColor(entry.confidence) }}>{formatConfidence(entry.confidence)}</span></td>
                            <td className="px-4 py-3.5"><span className="text-sm font-mono tabular-nums" style={{ color: "#CBD5E1" }}>{entry.evidence}</span></td>
                            <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: sCfg.bg, color: sCfg.color }}><SIcon size={11} />{entry.status}</span></td>
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Surface>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {sorted.map(entry => {
                const sCfg = statusCfg[entry.status]
                const SIcon = sCfg.icon
                return (
                  <motion.div key={entry.id} variants={fadeUp}>
                    <Surface variant="glass" padding="none" className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: typeBg[entry.type], color: typeColor[entry.type] }}><CircleDot size={10} />{entry.type}</span>
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: sCfg.bg, color: sCfg.color }}><SIcon size={10} />{entry.status}</span>
                        <span className="ml-auto text-xs" style={{ color: "#64748B" }}>{entry.timestamp}</span>
                      </div>
                      <Link
                        to={`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`}
                        className="text-sm font-mono font-medium underline-offset-2 hover:underline focus-visible:underline"
                        style={{ color: "var(--engine-govern)" }}
                        aria-label={`Open audit detail for ${entry.id}`}
                      >
                        {entry.id}
                      </Link>
                      <span className="text-xs" style={{ color: "#CBD5E1" }}>{entry.action}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: "#64748B" }}>{entry.evidence} evidence pts</span>
                        <span className="text-xs font-mono tabular-nums" style={{ color: getConfidenceColor(entry.confidence) }}>Conf: {formatConfidence(entry.confidence)}</span>
                      </div>
                    </Surface>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Audit sidebar">
            {/* Summary */}
            <Surface variant="glass" padding="none" className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Audit Summary</h3>
              {[
                { label: "Total decisions", value: DECISIONS_AUDITED.toLocaleString() },
                { label: "Verified", value: `${VERIFIED_COUNT.toLocaleString()} (${VERIFIED_PERCENT}%)`, color: "var(--state-healthy)" },
                { label: "Pending", value: `${PENDING_REVIEW_COUNT.toLocaleString()} (${PENDING_REVIEW_PERCENT}%)`, color: "var(--state-warning)" },
                { label: "Flagged", value: `${FLAGGED_COUNT.toLocaleString()} (${FLAGGED_PERCENT}%)`, color: "var(--state-critical)" },
                { label: "Avg evidence", value: "8.4 pts" },
                { label: "Compliance", value: `${COMPLIANCE_SCORE}%`, color: "var(--state-healthy)" },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#64748B" }}>{d.label}</span>
                  <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: d.color || "#F1F5F9" }}>{d.value}</span>
                </div>
              ))}
            </Surface>

            {/* Evidence flow */}
            <Surface variant="glass" padding="none" className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Evidence Flow</h3>
              {["Data Source", "AI Analysis", "Evidence Aggregation", "Confidence Score", "Audit Record"].map((step, i, arr) => (
                <React.Fragment key={step}>
                  <div className="w-full flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#93C5FD" }}>{step}</div>
                  {i < arr.length - 1 && <div className="flex items-center justify-center" aria-hidden="true"><ArrowDown size={14} style={{ color: "var(--engine-govern)" }} /></div>}
                </React.Fragment>
              ))}
            </Surface>

            {/* Export */}
            <Surface variant="glass" padding="none" className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Export Options</h3>
              <Button disabled variant="secondary" engine="govern" fullWidth size="sm" className="rounded-xl text-xs cursor-not-allowed opacity-60" aria-label="Export full ledger preview only">
                <Download size={14} />Export full ledger (CSV) · Preview
              </Button>
              <Button disabled variant="secondary" engine="govern" fullWidth size="sm" className="rounded-xl text-xs cursor-not-allowed opacity-60" aria-label="Generate compliance report preview only">
                <FileText size={14} />Generate compliance report (PDF) · Preview
              </Button>
            </Surface>

            {/* Primary CTA: Back to govern overview -> /govern */}
            <ButtonLink to="/govern" variant="glass" engine="govern" className="rounded-xl text-sm">
              <ArrowLeft size={16} />Back to govern overview
            </ButtonLink>
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
