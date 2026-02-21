import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useRouter } from '@/router'
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
export type Severity = "Critical" | "High" | "Medium" | "Low"
export type SortField = "severity" | "confidence" | "time" | "amount"
export type SortDir = "asc" | "desc"

export interface ThreatRow {
  id: string; merchant: string; amount: string; numericAmount: number; confidence: number; severity: Severity; time: string; sortTime: number; description: string
}

/* ── Data ── */
export const THREATS: ThreatRow[] = [
  { id: DEMO_THREAD.criticalAlert.id, merchant: DEMO_THREAD.criticalAlert.merchant, amount: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}`, numericAmount: DEMO_THREAD.criticalAlert.amount, confidence: DEMO_THREAD.criticalAlert.confidence, severity: "Critical", time: "2m ago", sortTime: 8, description: "Unusual transaction pattern" },
  { id: "THR-002", merchant: "Unknown Vendor", amount: "$1,200", numericAmount: 1200, confidence: 0.87, severity: "High", time: "15m ago", sortTime: 7, description: "Unrecognized merchant" },
  { id: "THR-003", merchant: "Travel Agency XYZ", amount: "$3,400", numericAmount: 3400, confidence: 0.72, severity: "Medium", time: "1h ago", sortTime: 6, description: "International wire transfer" },
  { id: "THR-004", merchant: "Subscription Service", amount: "$49.99", numericAmount: 49.99, confidence: 0.65, severity: "Low", time: "3h ago", sortTime: 5, description: "Duplicate charge detected" },
  { id: "THR-005", merchant: "Crypto Exchange", amount: "$5,000", numericAmount: 5000, confidence: 0.91, severity: "Medium", time: "5h ago", sortTime: 4, description: "High-risk category transfer" },
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
  const { navigate } = useRouter()

  const handleSort = (field: SortField) => {
    if (sortField === field) { setSortDir(d => d === "asc" ? "desc" : "asc") }
    else { setSortField(field); setSortDir("desc") }
  }

  const sorted = useMemo(
    () =>
      [...THREATS].sort((a, b) => {
        let cmp = 0
        switch (sortField) {
          case "severity": cmp = severityConfig[a.severity].order - severityConfig[b.severity].order; break
          case "confidence": cmp = a.confidence - b.confidence; break
          case "time": cmp = a.sortTime - b.sortTime; break
          case "amount": cmp = a.numericAmount - b.numericAmount; break
        }
        return sortDir === "asc" ? cmp : -cmp
      }),
    [sortField, sortDir],
  )
  const criticalCount = THREATS.filter((t) => t.severity === "Critical").length
  const highCount = THREATS.filter((t) => t.severity === "High").length
  const monitoringCount = THREATS.filter((t) => t.severity === "Medium" || t.severity === "Low").length

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
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight tabular-nums text-white max-w-4xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Threat posture: <span className="text-[var(--state-critical)] font-semibold drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">{criticalCount} critical</span>, {highCount} high, {monitoringCount} monitoring.
            </h1>

          </motion.div>
        </motion.section>

        {/* ── Content: Table + Sidebar ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-5">
          {/* Threat Table */}
          <div className="flex-1 min-w-0 lg:w-2/3">
            {/* Threat Cards */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">Live Threat Feed</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">Sort:</span>
                  <select
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-white/20"
                    value={`${sortField}-${sortDir}`}
                    onChange={(e) => {
                      const [f, d] = e.target.value.split('-');
                      setSortField(f as SortField);
                      setSortDir(d as SortDir);
                    }}
                    aria-label="Sort threats"
                  >
                    <option value="severity-desc">Highest Severity</option>
                    <option value="severity-asc">Lowest Severity</option>
                    <option value="amount-desc">Highest Amount</option>
                    <option value="amount-asc">Lowest Amount</option>
                    <option value="confidence-desc">Highest Confidence</option>
                    <option value="time-desc">Most Recent</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
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
                <AnimatePresence>
                  {sorted.map((t) => (
                    <motion.div key={t.id} variants={fadeUpVariant} exit={{ opacity: 0, height: 0 }}>
                      <Surface interactive variant="glass" padding="md" className="flex flex-col gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer" borderColor={severityConfig[t.severity].color} onClick={() => navigate(`/protect/alert-detail?alertId=${t.id}`)}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-medium drop-shadow-[0_0_5px_currentColor]" style={{ color: "var(--engine-protect)" }}>{t.id}</span>
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: severityConfig[t.severity].bg, color: severityConfig[t.severity].color }}>{t.severity === 'Critical' && <AlertTriangle size={10} />}{t.severity}</span>
                          <span className="ml-auto text-[10px] uppercase font-mono tracking-widest" style={{ color: "#64748B" }}>{t.time}</span>
                        </div>
                        <div>
                          <span className="text-base font-medium tracking-wide block" style={{ color: "#F1F5F9" }}>{t.merchant}</span>
                          <span className="text-xs text-white/40">{t.description}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-lg font-mono font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{t.amount}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-12 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.02]">
                              <div className="h-full rounded-full shadow-[0_0_8px_currentColor]" style={{ width: `${t.confidence * 100}%`, background: severityToneColor[t.severity], color: severityToneColor[t.severity] }} />
                            </div>
                            <span className="text-xs font-mono font-medium tabular-nums" style={{ color: severityToneColor[t.severity] }}>{t.confidence.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                          <span className="text-xs tracking-wide text-white/40 group-hover:text-white/70 transition-colors">Click to investigate</span>
                          <div className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all">
                            <ChevronRight size={14} />
                          </div>
                        </div>
                      </Surface>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6" aria-label="Protect sidebar">
            {/* Threat summary */}
            <motion.div variants={fadeUpVariant} className="h-full">
              <Surface interactive className="relative h-full overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Threat Summary</h3>
                  <Shield size={16} className="text-white/20" />
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  {[{ label: "Active threats", value: String(THREATS.length) }, { label: "Critical", value: String(criticalCount), color: "var(--state-critical)" }, { label: "High", value: String(highCount), color: "var(--state-warning)" }, { label: "Blocked today", value: "3", color: "var(--state-healthy)" }, { label: "Avg response", value: "<200ms" }].map((d, i) => (
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
              <Surface interactive className="relative h-full overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

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
