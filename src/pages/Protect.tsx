import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from '@/router'
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react"
import { DEMO_THREAD } from '@/lib/demo-thread'
import { AuroraPulse, EmptyState, GlassCard, GovernFooter } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { ButtonLink } from '@/design-system'


/* ── Types ── */
type Severity = "Critical" | "High" | "Medium" | "Low"
type SortField = "severity" | "confidence" | "time"
type SortDir = "asc" | "desc"

interface ThreatRow {
  id: string; merchant: string; amount: string; confidence: number; severity: Severity; time: string; sortTime: number; description: string
}

/* ── Data ── */
const threats: ThreatRow[] = [
  { id: DEMO_THREAD.criticalAlert.id, merchant: DEMO_THREAD.criticalAlert.merchant, amount: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}`, confidence: DEMO_THREAD.criticalAlert.confidence, severity: "Critical", time: "2m ago", sortTime: 8, description: "Unusual transaction pattern" },
  { id: "THR-002", merchant: "Unknown Vendor", amount: "$1,200", confidence: 0.87, severity: "High", time: "15m ago", sortTime: 7, description: "Unrecognized merchant" },
  { id: "THR-003", merchant: "Travel Agency XYZ", amount: "$3,400", confidence: 0.72, severity: "Medium", time: "1h ago", sortTime: 6, description: "International wire transfer" },
  { id: "THR-004", merchant: "Subscription Service", amount: "$49.99", confidence: 0.65, severity: "Low", time: "3h ago", sortTime: 5, description: "Duplicate charge detected" },
  { id: "THR-005", merchant: "Crypto Exchange", amount: "$5,000", confidence: 0.91, severity: "Medium", time: "5h ago", sortTime: 4, description: "High-risk category transfer" },
]

const severityConfig: Record<Severity, { color: string; bg: string; order: number }> = {
  Critical: { color: "var(--state-critical)", bg: "rgba(var(--state-critical-rgb),0.12)", order: 4 },
  High: { color: "var(--state-warning)", bg: "rgba(var(--state-warning-rgb),0.12)", order: 3 },
  Medium: { color: "var(--engine-govern)", bg: "rgba(59,130,246,0.12)", order: 2 },
  Low: { color: "#64748B", bg: "rgba(100,116,139,0.12)", order: 1 },
}

/* ── Risk sidebar data ── */
const riskBreakdown = [
  { label: "Transaction fraud", pct: 45, color: "var(--state-critical)" },
  { label: "Merchant risk", pct: 25, color: "var(--state-warning)" },
  { label: "Geo anomaly", pct: 20, color: "var(--engine-govern)" },
  { label: "Velocity", pct: 10, color: "#64748B" },
]

const severityToneColor: Record<Severity, string> = {
  Critical: "var(--state-critical)",
  High: "var(--state-warning)",
  Medium: "var(--engine-govern)",
  Low: "#64748B",
}

/* ═══════════════════════════════════════════════════════
   PROTECT PAGE
   ═══════════════════════════════════════════════════════ */

export default function ProtectPage() {
  const [sortField, setSortField] = useState<SortField>("severity")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) { setSortDir(d => d === "asc" ? "desc" : "asc") }
    else { setSortField(field); setSortDir("desc") }
  }

  const sorted = [...threats].sort((a, b) => {
    let cmp = 0
    switch (sortField) {
      case "severity": cmp = severityConfig[a.severity].order - severityConfig[b.severity].order; break
      case "confidence": cmp = a.confidence - b.confidence; break
      case "time": cmp = a.sortTime - b.sortTime; break
    }
    return sortDir === "asc" ? cmp : -cmp
  })
  const criticalCount = threats.filter((t) => t.severity === "Critical").length
  const highCount = threats.filter((t) => t.severity === "High").length
  const monitoringCount = threats.filter((t) => t.severity === "Medium" || t.severity === "Low").length

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={11} style={{ color: "#475569" }} />
    return sortDir === "asc" ? <ArrowUp size={11} style={{ color: "var(--engine-protect)" }} /> : <ArrowDown size={11} style={{ color: "var(--engine-protect)" }} />
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraPulse engine="protect" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: "var(--engine-protect)", color: 'var(--bg-oled)' }}>Skip to main content</a>

      <motion.main id="main-content" className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 md:gap-8 md:px-6 lg:px-8" variants={staggerContainer} initial="hidden" animate="visible" role="main" aria-label="Protect Engine - Threat Detection">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-4">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase" style={{ borderColor: "rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "var(--engine-protect)" }}>
              <Shield size={12} />Protect Engine
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>
            Threat posture: <span style={{ color: "var(--state-critical)" }}>{criticalCount} critical</span>, {highCount} high, {monitoringCount} monitoring.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed" style={{ color: "#CBD5E1" }}>
            Real-time threat detection across all connected accounts. AI confidence scoring with full evidence chain.
          </motion.p>
        </motion.section>

        {/* ── Content: Table + Sidebar ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-5">
          {/* Threat Table */}
          <div className="flex-1 min-w-0 lg:w-2/3">
            {/* Desktop table */}
            <div className="hidden md:block">
              <GlassCard className="overflow-hidden !p-0">
                {sorted.length === 0 ? (
                  <EmptyState
                    icon={Shield}
                    title="No threats match your current view"
                    description="Try a different sort strategy or reopen top alert details."
                    accentColor="var(--engine-protect)"
                    action={{ label: "Open top alert", onClick: () => window.location.assign('/protect/alert-detail') }}
                  />
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left" role="table">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#64748B" }} scope="col">ID</th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#64748B" }} scope="col">Merchant</th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#64748B" }} scope="col">Amount</th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("confidence")} aria-sort={sortField === "confidence" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                          <div className="flex items-center gap-1">Confidence <SortIndicator field="confidence" /></div>
                        </th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("severity")} aria-sort={sortField === "severity" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                          <div className="flex items-center gap-1">Severity <SortIndicator field="severity" /></div>
                        </th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("time")} aria-sort={sortField === "time" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                          <div className="flex items-center gap-1">Time <SortIndicator field="time" /></div>
                        </th>
                        <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "#64748B" }} scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {sorted.map((t) => (
                          <motion.tr key={t.id} variants={fadeUp} className="group transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <td className="px-4 py-3.5"><span className="text-xs font-mono font-medium" style={{ color: "var(--engine-protect)" }}>{t.id}</span></td>
                            <td className="px-4 py-3.5"><div className="flex flex-col gap-0.5"><span className="text-sm" style={{ color: "#F1F5F9" }}>{t.merchant}</span><span className="text-[10px]" style={{ color: "#64748B" }}>{t.description}</span></div></td>
                            <td className="px-4 py-3.5"><span className="text-sm font-mono font-semibold tabular-nums" style={{ color: "#F1F5F9" }}>{t.amount}</span></td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}><div className="h-full rounded-full" style={{ width: `${t.confidence * 100}%`, background: severityToneColor[t.severity] }} /></div>
                                <span className="text-xs font-mono tabular-nums" style={{ color: severityToneColor[t.severity] }}>{t.confidence.toFixed(2)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ background: severityConfig[t.severity].bg, color: severityConfig[t.severity].color }}>{t.severity === "Critical" && <AlertTriangle size={10} />}{t.severity}</span></td>
                            <td className="px-4 py-3.5"><span className="text-xs" style={{ color: "#94A3B8" }}>{t.time}</span></td>
                            <td className="px-4 py-3.5">
                              <ButtonLink to="/protect/alert-detail" variant="glass" engine="protect" size="sm" className="rounded-lg text-xs" icon={<ChevronRight size={12} />} iconPosition="right" aria-label={`Investigate ${t.id}`}>
                                Investigate
                              </ButtonLink>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                )}
              </GlassCard>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {sorted.length === 0 && (
                <GlassCard>
                  <EmptyState
                    icon={Shield}
                    title="No active threats"
                    description="Threat feed is clear right now."
                    accentColor="var(--engine-protect)"
                  />
                </GlassCard>
              )}
              {sorted.map((t) => (
                <motion.div key={t.id} variants={fadeUp}>
                  <GlassCard className="flex flex-col gap-3" borderColor={severityConfig[t.severity].color}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-medium" style={{ color: "var(--engine-protect)" }}>{t.id}</span>
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: severityConfig[t.severity].bg, color: severityConfig[t.severity].color }}>{t.severity}</span>
                      <span className="ml-auto text-[10px]" style={{ color: "#64748B" }}>{t.time}</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{t.merchant}</span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: "#F1F5F9" }}>{t.amount}</span>
                      <span className="text-xs font-mono tabular-nums" style={{ color: severityToneColor[t.severity] }}>{t.confidence.toFixed(2)}</span>
                    </div>
                    <ButtonLink to="/protect/alert-detail" variant="glass" engine="protect" size="sm" fullWidth className="rounded-xl" icon={<ChevronRight size={14} />} iconPosition="right">
                      Investigate
                    </ButtonLink>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Protect sidebar">
            {/* Threat summary */}
            <GlassCard className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Threat Summary</h3>
              {[{ label: "Active threats", value: String(threats.length) }, { label: "Critical", value: String(criticalCount), color: "var(--state-critical)" }, { label: "High", value: String(highCount), color: "var(--state-warning)" }, { label: "Blocked today", value: "3", color: "var(--state-healthy)" }, { label: "Avg response", value: "<200ms" }].map(d => (
                <div key={d.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#64748B" }}>{d.label}</span>
                  <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: d.color || "#F1F5F9" }}>{d.value}</span>
                </div>
              ))}
            </GlassCard>

            {/* Risk breakdown */}
            <GlassCard className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F1F5F9" }}>Risk Breakdown</h3>
              {riskBreakdown.map(r => (
                <div key={r.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#94A3B8" }}>{r.label}</span>
                    <span className="text-xs font-mono tabular-nums" style={{ color: r.color }}>{r.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </GlassCard>

            {/* Primary CTA */}
            <ButtonLink to="/protect/alert-detail" variant="glass" engine="protect" className="rounded-xl" icon={<AlertTriangle size={16} />}>
              Open top alert
            </ButtonLink>
          </aside>
        </div>

        <GovernFooter
          auditId={GOVERNANCE_META['/protect'].auditId}
          pageContext={GOVERNANCE_META['/protect'].pageContext}
        />
      </motion.main>
    </div>
  )
}
