import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from '@/router'
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { EmptyState } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { THREATS, severityConfig, severityToneColor, riskBreakdown } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'

/* ── Types ── */
type SortField = "severity" | "confidence" | "time" | "amount"
type SortDir = "asc" | "desc"

/* ═══════════════════════════════════════════════════════
   PROTECT PAGE
   ═══════════════════════════════════════════════════════ */

export default function ProtectPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const [sortField, setSortField] = useState<SortField>("severity")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

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

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: "var(--engine-protect)", color: 'var(--bg-oled)' }}>Skip to main content</a>

      <motion.div id="main-content" className="w-full flex flex-col gap-6 md:gap-8" variants={staggerContainerVariant} initial="hidden" animate="visible" role="main" aria-label="Protect Engine - Threat Detection">

        {/* ── Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 mb-8 mt-4">
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--engine-protect)]/20 bg-[var(--engine-protect)]/10 px-3 py-1.5 text-xs font-bold tracking-widest uppercase text-[var(--engine-protect)] shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <ShieldCheck size={12} /> Engine status: Good
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white/80 max-w-4xl leading-snug" style={{ fontFamily: "var(--font-display)" }}>
              24/7 threat detection across your accounts based on{' '}
              <span className="bg-gradient-to-r from-[var(--engine-protect)] to-[var(--engine-govern)] bg-clip-text text-transparent">your transaction history</span>
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

              <div className="flex flex-col gap-3">
                {sorted.length === 0 && (
                  <div className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-3 transition-opacity hover:bg-white/[0.02]">
                    <EmptyState
                      icon={Shield}
                      title="No active threats"
                      description="Threat feed is clear right now."
                      accentColor="var(--engine-protect)"
                    />
                  </div>
                )}
                <AnimatePresence>
                  {sorted.map((t) => {
                    const theme = severityConfig[t.severity]
                    return (
                      <motion.div key={t.id} variants={fadeUpVariant} exit={{ opacity: 0, height: 0 }}>
                        <Link to={`/protect/alert-detail?alertId=${t.id}`} className="group block focus:outline-none focus:ring-2 focus:ring-[var(--engine-protect)] rounded-[24px]">
                          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-2xl bg-black/40 shadow-xl p-5 md:p-6 lg:p-8 transition-all hover:bg-white/[0.04]">
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
                                <div className="flex items-center gap-1">
                                  <div className="h-1.5 w-12 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.02]">
                                    <div className="h-full rounded-full shadow-[0_0_8px_currentColor]" style={{ width: `${t.confidence * 100}%`, background: severityToneColor[t.severity], color: severityToneColor[t.severity] }} />
                                  </div>
                                  <span className="text-xs font-mono font-medium tabular-nums" style={{ color: severityToneColor[t.severity] }}>{t.confidence.toFixed(2)}</span>
                                </div>
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
              <motion.div variants={fadeUpVariant} className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <h3 className="text-xs xl:text-sm font-semibold uppercase tracking-widest text-white/50">Threat Summary</h3>
                  <Shield size={16} className="text-white/20" />
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  {[{ label: "Active threats", value: String(activeThreats.length) }, { label: "Critical", value: String(criticalCount), color: "var(--state-critical)" }, { label: "High", value: String(highCount), color: "var(--state-warning)" }, { label: "Blocked today", value: String(dismissed.size), color: "var(--state-healthy)" }].map((d, i) => (
                    <div key={d.label} className={`flex items-center justify-between ${i !== 0 ? 'pt-4 border-t border-white/[0.04]' : ''}`}>
                      <span className="text-sm xl:text-base font-medium text-white/60 tracking-wide">{d.label}</span>
                      <span className="text-base xl:text-lg font-mono font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ color: d.color || "rgba(255,255,255,0.9)" }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Risk breakdown */}
              <motion.div variants={fadeUpVariant} className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <h3 className="text-xs xl:text-sm font-semibold uppercase tracking-widest text-white/50">Risk Breakdown</h3>
                </div>

                <div className="flex flex-col gap-5 relative z-10">
                  {riskBreakdown.map(r => (
                    <div key={r.label} className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm xl:text-base font-medium text-white/70 tracking-wide">{r.label}</span>
                        <span className="text-xs xl:text-sm font-mono font-bold drop-shadow-[0_0_5px_currentColor]" style={{ color: r.color }}>{r.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.02]">
                        <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]" style={{ width: `${r.pct}%`, background: r.color, color: r.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI Defense Posture */}
              <motion.div variants={fadeUpVariant} className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <h3 className="text-xs xl:text-sm font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 relative z-10">AI Defense Posture</h3>
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-center justify-between"><span className="text-sm xl:text-base text-white/60 tracking-wide">Threats blocked (30d)</span><span className="text-base xl:text-lg font-mono font-medium text-white/90">1</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm xl:text-base text-white/60 tracking-wide">False positive rate</span><span className="text-base xl:text-lg font-mono font-medium text-white/90">0.01%</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm xl:text-base text-white/60 tracking-wide">Last model update</span><span className="text-base xl:text-lg font-mono font-medium text-white/90">2d ago</span></div>
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
