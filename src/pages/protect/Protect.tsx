import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useRouter } from '@/router'
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { EmptyState, EngineBadge, ConfidenceIndicator, CohortFraudTrend } from '@/components/poseidon'
import { ProtectAnomalyRadar, ProtectThreatPosture } from '@/components/poseidon/protect-hero'
import { selectAlertAuditChain, selectCohortMetrics, selectProtectPerformance } from '@/domain/poseidon-universe'
import { getMotionPreset } from '@/lib/motion-presets'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { THREATS, severityConfig, severityToneColor, riskBreakdown, ALERT_FACTOR_ITEMS, deriveFactors } from './protect-data'
import type { ThreatRow, ThreatSeverity } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout'

/* ── Types ── */
type SortField = "severity" | "confidence" | "time" | "amount"
type SortDir = "asc" | "desc"

/* ── Helpers ── */
type Pickable = { id: string; severity: ThreatSeverity; confidence: number }

/** Deterministic top-alert selection: severity desc → confidence desc → id asc. */
export function pickTopAlert<T extends Pickable>(threats: T[]): T | null {
  if (threats.length === 0) return null
  return threats.reduce((best, t) => {
    const orderCmp = severityConfig[t.severity].order - severityConfig[best.severity].order
    if (orderCmp !== 0) return orderCmp > 0 ? t : best
    const confCmp = t.confidence - best.confidence
    if (confCmp !== 0) return confCmp > 0 ? t : best
    return t.id < best.id ? t : best
  })
}

/* ═══════════════════════════════════════════════════════
   PROTECT PAGE
   ═══════════════════════════════════════════════════════ */

export default function ProtectPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  usePageTitle('Protect Engine')
  const [sortField, setSortField] = useState<SortField>("severity")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const cohort = selectCohortMetrics()
  const perf = selectProtectPerformance()
  const { dismissed } = useDismissedAlerts()
  const activeThreats = useMemo(() => THREATS.filter(t => !dismissed.has(t.id)), [dismissed])

  const sorted = useMemo(
    () =>
      [...activeThreats].sort((a, b) => {
        let cmp = 0
        switch (sortField) {
          case "severity": cmp = severityConfig[a.severity].order - severityConfig[b.severity].order; break
          case "confidence": cmp = a.confidence - b.confidence; break
          case "time": cmp = a.sortTime - b.sortTime; break
          case "amount": cmp = a.numericAmount - b.numericAmount; break
        }
        return sortDir === "asc" ? cmp : -cmp
      }),
    [sortField, sortDir, activeThreats],
  )
  const criticalCount = activeThreats.filter((t) => t.severity === "Critical").length
  const highCount = activeThreats.filter((t) => t.severity === "High").length

  /* ── Hero data ── */
  const criticalAlert = useMemo(
    () => pickTopAlert(activeThreats.filter(t => t.severity === 'Critical')),
    [activeThreats],
  )

  // Radar axes: derived contribution values on fixed 0-0.30 scale
  const radarAxes = useMemo(() => {
    if (!criticalAlert) return []
    const items = ALERT_FACTOR_ITEMS[criticalAlert.id]
    if (!items) return []
    const derived = deriveFactors(items, criticalAlert.confidence)
    return derived
      .filter(f => !f.mitigating)
      .map(f => ({
        label: f.title.replace('Unusual ', '').replace('Known ', ''),
        value: f.value,
        maxValue: 0.30,
        color: f.value >= 0.20 ? 'var(--state-critical)' : 'var(--state-warning)',
      }))
  }, [criticalAlert])

  // Evidence cues from authored heroCue field
  const evidenceCues = useMemo(() => {
    if (!criticalAlert) return []
    const items = ALERT_FACTOR_ITEMS[criticalAlert.id]
    if (!items) return []
    return items
      .filter(i => !i.mitigating && i.heroCue)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map(i => i.heroCue!)
  }, [criticalAlert])

  // Audit chain from canonical relations (strict: null if ambiguous)
  const auditChain = useMemo(
    () => criticalAlert ? selectAlertAuditChain(criticalAlert.id) : null,
    [criticalAlert],
  )

  const topAlert = useMemo(() => pickTopAlert(activeThreats), [activeThreats])

  const totalExposure = useMemo(
    () => activeThreats.reduce((sum, t) => sum + t.numericAmount, 0),
    [activeThreats],
  )

  const feedThreats = criticalAlert
    ? sorted.filter(t => t.id !== criticalAlert.id)
    : sorted

  return (
    <>

      <motion.div id="main-content" className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8`} style={PAGE_CONTENT_STYLE} variants={staggerContainerVariant} initial="hidden" animate="visible" role="main" aria-label="Protect Engine - Threat Detection">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 mb-8">
          <motion.div variants={fadeUpVariant} className="flex items-center gap-2">
            <EngineBadge engine="protect" icon={ShieldCheck} label="Engine status: Good" />
          </motion.div>
          <h1 className="sr-only">Protect Engine</h1>

          {criticalAlert ? (
            <motion.div variants={fadeUpVariant}>
              <ProtectAnomalyRadar
                alert={criticalAlert}
                radarAxes={radarAxes}
                evidenceCues={evidenceCues}
                auditChain={auditChain}
                remainingCount={activeThreats.length - 1}
                totalExposure={totalExposure}
                fpRate="0.01%"
                onReviewSignal={() => navigate(`/protect/alert-detail?alertId=${criticalAlert.id}`)}
              />
            </motion.div>
          ) : (
            <motion.div variants={fadeUpVariant}>
              <ProtectThreatPosture
                activeCount={activeThreats.length}
                highCount={highCount}
                mediumCount={activeThreats.filter(t => t.severity === 'Medium').length}
                lowCount={activeThreats.filter(t => t.severity === 'Low').length}
                resolvedCount={dismissed.size}
                fpRate="0.01%"
                modelUpdate="2d ago"
                topAlert={topAlert}
                onOpenTopAlert={topAlert ? () => navigate(`/protect/alert-detail?alertId=${topAlert.id}`) : null}
              />
            </motion.div>
          )}
        </motion.section>

        {/* ── Content: Table + Sidebar ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-5">
          {/* Threat Table */}
          <div className="flex-1 min-w-0 lg:w-2/3">
            {/* Threat Cards */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-sm xl:text-base font-semibold uppercase tracking-widest text-white/50">Live Threat Feed</h2>
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

              <div className="flex flex-col gap-3" aria-label="Live Threat Feed">
                {feedThreats.length === 0 && !criticalAlert && (
                  <div className="glass-card glass-card-overlay rounded-[32px] p-6 lg:p-8 flex flex-col gap-3 transition-opacity">
                    <EmptyState
                      icon={Shield}
                      title="No active threats"
                      description="Threat feed is clear right now."
                      accentColor="var(--engine-protect)"
                    />
                  </div>
                )}
                {feedThreats.length === 0 && criticalAlert && (
                  <div className="glass-card glass-card-overlay rounded-[32px] p-6 lg:p-8 flex flex-col gap-3 transition-opacity">
                    <EmptyState
                      icon={Shield}
                      title="No additional threats"
                      description="Only the spotlighted alert remains active."
                      accentColor="var(--engine-protect)"
                    />
                  </div>
                )}
                <AnimatePresence>
                  {feedThreats.map((t) => {
                    const theme = severityConfig[t.severity]
                    return (
                      <motion.div key={t.id} variants={fadeUpVariant} exit={{ opacity: 0, height: 0 }}>
                        <Link to={`/protect/alert-detail?alertId=${t.id}`} className="group block focus:outline-none focus:ring-2 focus:ring-[var(--engine-protect)] rounded-[24px]">
                          <div className="glass-card rounded-[24px] p-5 md:p-6 lg:p-8 transition-all hover:bg-white/[0.04]">
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to right, ${theme.bg}, transparent)` }} />
                            {/* Mobile layout */}
                            <div className="flex flex-col gap-4 md:hidden relative z-10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center justify-center rounded-xl text-xs font-bold font-mono tabular-nums shadow-[0_0_15px_currentColor] border border-[currentColor]/30 bg-[currentColor]/10" style={{ color: theme.color, width: 44, height: 28 }}>{t.confidence.toFixed(2)}</span>
                                  <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">Confidence</span>
                                </div>
                                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{t.time}</span>
                              </div>
                              <div>
                                <h3 className="text-base font-medium text-white/90 truncate mr-4">{t.merchant}</h3>
                                <span className="text-sm font-mono text-white/70 block mt-1">{t.amount}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/[0.06]">
                                <span className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: theme.color }}><AlertTriangle size={12} />{t.severity}</span>
                                <ArrowRight size={16} className="text-white/30 group-hover:text-white/90 transition-colors" />
                              </div>
                            </div>
                            {/* Desktop layout */}
                            <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-6 items-center gap-4 relative z-10">
                              <div className="col-span-2 flex flex-col gap-1">
                                <span className="text-xs font-mono font-medium drop-shadow-[0_0_5px_currentColor]" style={{ color: "var(--engine-protect)" }}>{t.id}</span>
                                <h3 className="text-base font-medium text-white/90 truncate mr-4">{t.merchant}</h3>
                                <span className="text-xs text-white/40">{t.description}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-base font-mono font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{t.amount}</span>
                                <span className="text-[10px] uppercase font-mono tracking-widest text-white/50">{t.time}</span>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: severityConfig[t.severity].bg, color: severityConfig[t.severity].color }}>{t.severity === 'Critical' && <AlertTriangle size={10} />}{t.severity}</span>
                                <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">Threat confidence</span>
                                <ConfidenceIndicator value={t.confidence} colorOverride={severityToneColor[t.severity]} size="sm" glow />
                              </div>
                              <div className="hidden lg:flex items-center justify-end">
                                <ArrowRight size={16} className="text-white/30 group-hover:text-white/90 transition-colors" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] xl:w-[380px] shrink-0" aria-label="Security summary sidebar">
            <div className="sticky top-6 flex flex-col gap-6">
              {/* Threat summary */}
              <motion.div variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-[32px] p-5 md:p-6 lg:p-8 flex flex-col gap-6 transition-colors">

                <div className="relative z-10 flex items-center justify-between">
                  <h3 className="text-xs xl:text-sm font-semibold uppercase tracking-widest text-white/50">Threat Summary</h3>
                  <Shield size={16} className="text-white/20" />
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  {[{ label: "Active threats", value: String(activeThreats.length) }, { label: "Critical", value: String(criticalCount), color: "var(--state-critical)" }, { label: "High", value: String(highCount), color: "var(--state-warning)" }, { label: "Resolved today", value: String(dismissed.size), color: "var(--state-healthy)" }].map((d, i) => (
                    <div key={d.label} className={`flex items-center justify-between ${i !== 0 ? 'pt-4 border-t border-white/[0.04]' : ''}`}>
                      <span className="text-xs md:text-sm xl:text-base font-medium text-white/60 tracking-wide">{d.label}</span>
                      <span className="text-base xl:text-lg font-mono font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ color: d.color || "rgba(255,255,255,0.9)" }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Risk breakdown */}
              <motion.div variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-[32px] p-5 md:p-6 lg:p-8 flex flex-col gap-6 transition-colors">

                <div className="relative z-10 flex items-center justify-between">
                  <h3 className="text-xs xl:text-sm font-semibold uppercase tracking-widest text-white/50">Risk Breakdown</h3>
                </div>

                <div className="flex flex-col gap-5 relative z-10">
                  {riskBreakdown.map(r => (
                    <div key={r.label} className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm xl:text-base font-medium text-white/70 tracking-wide">{r.label}</span>
                        <span className="text-xs xl:text-sm font-mono font-bold drop-shadow-[0_0_5px_currentColor]" style={{ color: r.color }}>{r.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.02]">
                        <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]" style={{ width: `${r.pct}%`, background: r.color, color: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Platform Fraud Trends */}
              <motion.div variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-[32px] p-5 md:p-6 lg:p-8 transition-colors">
                <CohortFraudTrend
                  label={cohort.fraudTrend.label}
                  changePercent={cohort.fraudTrend.changePercent}
                  period={cohort.fraudTrend.period}
                  factors={cohort.fraudTrend.factors}
                />
              </motion.div>

              {/* AI Defense Posture */}
              <motion.div variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-[32px] p-5 md:p-6 lg:p-8 flex flex-col gap-6 transition-colors">
                <h3 className="text-xs xl:text-sm font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 relative z-10">AI Defense Posture</h3>
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-center justify-between"><span className="text-xs md:text-sm xl:text-base text-white/60 tracking-wide">Risk incidents flagged (30d)</span><span className="text-base xl:text-lg font-mono font-medium text-white/90">{perf.riskIncidentsFlagged}</span></div>
                  <div className="flex items-center justify-between"><span className="text-xs md:text-sm xl:text-base text-white/60 tracking-wide">Avg exposure identified</span><span className="text-base xl:text-lg font-mono font-medium text-white/90">${perf.avgMonthlyExposureUsd}/mo</span></div>
                  <div className="flex items-center justify-between"><span className="text-xs md:text-sm xl:text-base text-white/60 tracking-wide">False positive rate</span><span className="text-base xl:text-lg font-mono font-medium text-white/90">0.01%</span></div>
                  <div className="flex items-center justify-between"><span className="text-xs md:text-sm xl:text-base text-white/60 tracking-wide">Last model update</span><span className="text-base xl:text-lg font-mono font-medium text-white/90">2d ago</span></div>
                </div>
                <div className="mt-2 pt-6 border-t border-white/[0.06] relative z-10">
                  <Link to="/govern" className={cn(buttonVariants({ variant: "glass", size: "sm" }), "w-full rounded-xl justify-center font-medium tracking-wide text-xs xl:text-sm")}>View AI Governance Log</Link>
                </div>
              </motion.div>
            </div>
          </aside>
        </div>

      </motion.div>
    </>
  )
}
