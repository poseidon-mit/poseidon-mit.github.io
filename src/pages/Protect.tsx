import { useMemo, useState } from "react"
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
import { AuroraPulse, EmptyState, GovernFooter } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { getMotionPreset } from '@/lib/motion-presets'
import { Surface, ButtonLink } from '@/design-system'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

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
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const [sortField, setSortField] = useState<SortField>("severity")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) { setSortDir(d => d === "asc" ? "desc" : "asc") }
    else { setSortField(field); setSortDir("desc") }
  }

  const sorted = useMemo(
    () =>
      [...threats].sort((a, b) => {
        let cmp = 0
        switch (sortField) {
          case "severity": cmp = severityConfig[a.severity].order - severityConfig[b.severity].order; break
          case "confidence": cmp = a.confidence - b.confidence; break
          case "time": cmp = a.sortTime - b.sortTime; break
        }
        return sortDir === "asc" ? cmp : -cmp
      }),
    [sortField, sortDir],
  )
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

      <motion.main id="main-content" className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 md:gap-8 md:px-6 lg:px-8" variants={staggerContainerVariant} initial="hidden" animate="visible" role="main" aria-label="Protect Engine - Threat Detection">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 mb-8 mt-4">
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--engine-protect)]/20 bg-[var(--engine-protect)]/10 px-3 py-1.5 text-xs font-bold tracking-widest uppercase text-[var(--engine-protect)] shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <Shield size={12} /> Protect Engine
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white max-w-4xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Threat posture: <span className="text-[var(--state-critical)] font-semibold drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">{criticalCount} critical</span>, {highCount} high, {monitoringCount} monitoring.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-white/50 font-light max-w-2xl tracking-wide mt-2">
              Real-time threat detection across all connected accounts. AI confidence scoring with full evidence chain.
            </p>
          </motion.div>
        </motion.section>

        {/* ── Content: Table + Sidebar ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-5">
          {/* Threat Table */}
          <div className="flex-1 min-w-0 lg:w-2/3">
            {/* Desktop table */}
            <div className="hidden md:block">
              <Surface interactive className="relative h-full overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl transition-all hover:bg-white/[0.02]" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />

                {sorted.length === 0 ? (
                  <div className="p-8">
                    <EmptyState
                      icon={Shield}
                      title="No threats match your current view"
                      description="Try a different sort strategy or reopen top alert details."
                      accentColor="var(--engine-protect)"
                      action={{ label: "Open top alert", onClick: () => window.location.assign('/protect/alert-detail') }}
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto relative z-10 w-full rounded-[24px] bg-white/[0.02] border border-white/[0.05]">
                    <table className="w-full text-left border-collapse" role="table">
                      <caption className="sr-only">Threat alerts sorted by confidence, severity, or time</caption>
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
                          <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold" style={{ color: "#64748B" }} scope="col">ID</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold" style={{ color: "#64748B" }} scope="col">Merchant</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold" style={{ color: "#64748B" }} scope="col">Amount</th>
                          <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("confidence")} aria-sort={sortField === "confidence" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                            <div className="flex items-center gap-2 hover:text-white/70 transition-colors">Confidence <SortIndicator field="confidence" /></div>
                          </th>
                          <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("severity")} aria-sort={sortField === "severity" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                            <div className="flex items-center gap-2 hover:text-white/70 transition-colors">Severity <SortIndicator field="severity" /></div>
                          </th>
                          <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold cursor-pointer select-none" style={{ color: "#64748B" }} scope="col" onClick={() => handleSort("time")} aria-sort={sortField === "time" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                            <div className="flex items-center gap-2 hover:text-white/70 transition-colors">Time <SortIndicator field="time" /></div>
                          </th>
                          <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold" style={{ color: "#64748B" }} scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {sorted.map((t) => (
                            <motion.tr
                              key={t.id}
                              variants={fadeUpVariant}
                              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                              className="group transition-all hover:bg-white/[0.06] cursor-pointer"
                              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                              onClick={() => window.location.assign('/protect/alert-detail')}
                            >
                              <td className="px-6 py-5"><span className="text-xs font-mono font-medium drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" style={{ color: "var(--engine-protect)" }}>{t.id}</span></td>
                              <td className="px-6 py-5"><div className="flex flex-col gap-1.5"><span className="text-base font-medium text-white/90 group-hover:text-white transition-colors tracking-wide">{t.merchant}</span><span className="text-xs text-white/40 tracking-wide">{t.description}</span></div></td>
                              <td className="px-6 py-5"><span className="text-base font-mono font-bold text-white/80 group-hover:text-white">{t.amount}</span></td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="h-1.5 w-16 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.02]"><div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]" style={{ width: `${t.confidence * 100}%`, background: severityToneColor[t.severity], color: severityToneColor[t.severity] }} /></div>
                                  <span className="text-xs font-mono font-medium drop-shadow-[0_0_5px_currentColor]" style={{ color: severityToneColor[t.severity] }}>{t.confidence.toFixed(2)}</span>
                                </div>
                              </td>
                              <td className="px-6 py-5"><span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ background: severityConfig[t.severity].bg, color: severityConfig[t.severity].color, border: `1px solid rgba(255,255,255,0.05)` }}>{t.severity === "Critical" && <AlertTriangle size={12} />}{t.severity}</span></td>
                              <td className="px-6 py-5"><span className="text-xs font-mono text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">{t.time}</span></td>
                              <td className="px-6 py-5">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/[0.05] bg-white/[0.05] group-hover:bg-white/[0.15] group-hover:border-white/[0.2] transition-all shadow-inner">
                                  <ChevronRight size={14} className="text-white/60 group-hover:text-white" />
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </Surface>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {sorted.length === 0 && (
                <Surface variant="glass" padding="md">
                  <EmptyState
                    icon={Shield}
                    title="No active threats"
                    description="Threat feed is clear right now."
                    accentColor="var(--engine-protect)"
                  />
                </Surface>
              )}
              {sorted.map((t) => (
                <motion.div key={t.id} variants={fadeUpVariant}>
                  <Surface variant="glass" padding="md" className="flex flex-col gap-3" borderColor={severityConfig[t.severity].color}>
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
                  </Surface>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6" aria-label="Protect sidebar">
            {/* Threat summary */}
            <motion.div variants={fadeUpVariant} className="h-full">
              <Surface interactive className="relative h-full overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/10 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Threat Summary</h3>
                  <Shield size={16} className="text-white/20" />
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  {[{ label: "Active threats", value: String(threats.length) }, { label: "Critical", value: String(criticalCount), color: "var(--state-critical)" }, { label: "High", value: String(highCount), color: "var(--state-warning)" }, { label: "Blocked today", value: "3", color: "var(--state-healthy)" }, { label: "Avg response", value: "<200ms" }].map((d, i) => (
                    <div key={d.label} className={`flex items-center justify-between ${i !== 0 ? 'pt-4 border-t border-white/[0.04]' : ''}`}>
                      <span className="text-sm font-medium text-white/60 tracking-wide">{d.label}</span>
                      <span className="text-base font-mono font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ color: d.color || "rgba(255,255,255,0.9)" }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </Surface>
            </motion.div>

            {/* Risk breakdown */}
            <motion.div variants={fadeUpVariant}>
              <Surface interactive className="relative h-full overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Risk Breakdown</h3>
                </div>

                <div className="flex flex-col gap-5 relative z-10">
                  {riskBreakdown.map(r => (
                    <div key={r.label} className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white/70 tracking-wide">{r.label}</span>
                        <span className="text-xs font-mono font-bold drop-shadow-[0_0_5px_currentColor]" style={{ color: r.color }}>{r.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.02]">
                        <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]" style={{ width: `${r.pct}%`, background: r.color, color: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Surface>
            </motion.div>

            {/* Primary CTA */}
            <motion.div variants={fadeUpVariant}>
              <ButtonLink to="/protect/alert-detail" variant="primary" engine="protect" className="w-full rounded-[24px] py-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] transition-all font-bold tracking-wide border-none bg-gradient-to-r from-[var(--engine-protect)] to-red-400 text-white">
                Open Top Alert
                <ChevronRight size={18} className="ml-2" />
              </ButtonLink>
            </motion.div>
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
