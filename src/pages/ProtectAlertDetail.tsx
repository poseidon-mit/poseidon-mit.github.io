import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from '@/router'
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  CircleDot,
  Shield,
  ShieldCheck,
  User,
  ArrowUpRight,
} from "lucide-react"
import { DEMO_THREAD } from '@/lib/demo-thread'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { AuroraPulse, GovernFooter } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { Surface, Button, ButtonLink } from '@/design-system'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/* ── Data ── */
interface EvidenceItem { id: string; title: string; score: number; details: string; model?: string }
interface TimelineStep { label: string; time: string; status: "complete" | "active" }

const timelineSteps: TimelineStep[] = [
  { label: "Signal detected", time: "14:28", status: "complete" },
  { label: "Analysis complete", time: "14:29", status: "complete" },
  { label: "Alert raised", time: "14:30", status: "complete" },
  { label: "User notified", time: "14:31", status: "complete" },
  { label: "Resolution pending", time: "Now", status: "active" },
]

const evidenceItems: EvidenceItem[] = [
  { id: "e1", title: "Transaction Pattern Deviation", score: 0.96, details: "Amount 3.2x above category average ($1,312)", model: "FraudDetection v3.2" },
  { id: "e2", title: "Merchant Risk Score", score: 0.87, details: "Merchant flagged in 12 previous incidents", model: "MerchantReputation v2.1" },
  { id: "e3", title: "Geographic Anomaly", score: 0.95, details: "IP location 4,200 miles from usual pattern", model: "GeoAnalyzer v1.8" },
  { id: "e4", title: "Velocity Check", score: 0.72, details: "3rd transaction in 2 hours (unusual)" },
  { id: "e5", title: "Behavioral Analysis", score: 0.91, details: "Time of day deviates from 180-day pattern" },
]

const shapFactors = [
  { name: "Transaction velocity", value: 8.2 },
  { name: "Geo anomaly", value: 5.7 },
  { name: "Amount deviation", value: 4.1 },
  { name: "Time pattern", value: -2.3 },
  { name: "Account history", value: -1.8 },
]

const criticalAlert = DEMO_THREAD.criticalAlert
const detectedAt = formatDemoTimestamp('2026-03-19T14:28:00-04:00')
const updatedAt = formatDemoTimestamp('2026-03-19T14:30:00-04:00')

function getScoreColor(s: number) { return s >= 0.9 ? "var(--state-critical)" : s >= 0.8 ? "var(--state-warning)" : "var(--engine-govern)" }
function getScoreBg(s: number) { return s >= 0.9 ? "rgba(var(--state-critical-rgb),0.12)" : s >= 0.8 ? "rgba(var(--state-warning-rgb),0.12)" : "rgba(59,130,246,0.12)" }

/* ── SHAP Waterfall (inlined from poseidon/shap-waterfall) ── */
function ShapWaterfall({ factors }: { factors: { name: string; value: number }[] }) {
  const sorted = [...factors].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
  const maxAbs = Math.max(...factors.map(f => Math.abs(f.value)), 1)
  return (
    <div className="flex flex-col gap-3">
      {sorted.map(f => {
        const w = (Math.abs(f.value) / maxAbs) * 100
        const pos = f.value > 0
        return (
          <div key={f.name} className="flex items-center gap-4 text-xs">
            <span className="w-32 truncate text-right shrink-0 tracking-wide font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{f.name}</span>
            <div className="flex-1 h-6 relative rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className={`absolute top-0 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor] ${pos ? "left-1/2" : "right-1/2"}`} style={{ width: `${w / 2}%`, background: pos ? "rgba(34,197,94,0.6)" : "rgba(239,68,68,0.6)", color: pos ? "rgba(34,197,94,0.8)" : "rgba(239,68,68,0.8)" }} />
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-mono font-bold tabular-nums" style={{ color: "rgba(255,255,255,0.9)", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{pos ? "+" : ""}{f.value.toFixed(1)}</span></div>
            </div>
          </div>
        )
      })}
      <div className="flex items-center gap-4 text-xs pt-4 mt-2" style={{ color: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="w-32 text-right shrink-0 font-medium tracking-wide">Base Score</span>
        <span className="tabular-nums font-mono font-medium">42.0</span>
        <span className="ml-auto tabular-nums font-mono font-bold text-white/90 bg-white/[0.05] border border-white/[0.1] px-3 py-1 rounded-lg">Final: {(42 + factors.reduce((s, f) => s + f.value, 0)).toFixed(1)}</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PROTECT ALERT DETAIL PAGE
   CTA: "Open execute queue" -> /execute (line 536-537)
   ═══════════════════════════════════════════════════════ */

export default function ProtectAlertDetailPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)

  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse engine="protect" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: "var(--engine-protect)", color: 'var(--bg-oled)' }}>Skip to main content</a>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: "1280px" }}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >

        {/* ── Header ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 mb-8 mt-4">
          <motion.div variants={fadeUpVariant}>
            <Link to="/protect" className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05]" style={{ color: "#94A3B8" }}><ArrowLeft size={16} />Back to Protect</Link>
          </motion.div>
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>{`Signal #${criticalAlert.signalId}`}</h1>
              <span className="text-sm tracking-wide text-white/40 font-mono mt-1">{`Detected: ${detectedAt} • Updated: ${updatedAt}`}</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-widest border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]" style={{ background: "rgba(239,68,68,0.1)", color: "var(--state-critical)" }} aria-label="Alert status: Critical"><AlertTriangle size={16} />CRITICAL</span>
          </motion.div>
        </motion.section>

        {/* ── Alert Summary ── */}
        <motion.div variants={fadeUpVariant} className="mb-6">
          <Surface interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-red-500/20 backdrop-blur-3xl bg-black/60 shadow-[0_0_30px_rgba(239,68,68,0.1)] flex flex-col gap-4 transition-all hover:bg-white/[0.02]" padding="none">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--state-critical)]/10 to-transparent pointer-events-none" />

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8 relative z-10">
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Merchant</span><span className="text-lg font-medium text-white/90">{criticalAlert.merchant}</span></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Amount</span><span className="text-2xl font-light font-mono text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{`$${criticalAlert.amount.toLocaleString()}.00`}</span></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Confidence</span><div className="flex items-center gap-3"><div className="h-1.5 w-24 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.02]"><div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ width: `${criticalAlert.confidence * 100}%`, background: "var(--state-critical)" }} /></div><span className="text-base font-mono font-bold drop-shadow-[0_0_5px_currentColor] text-red-400">{formatConfidence(criticalAlert.confidence)}</span></div></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Alert type</span><span className="text-base text-white/70 tracking-wide">Unusual transaction pattern</span></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Account</span><div className="flex items-center gap-2"><CreditCard size={16} className="text-white/30" /><span className="text-base font-mono font-medium drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] text-white/80">{`Checking ****${criticalAlert.cardLast4}`}</span></div></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Location</span><div className="flex items-center gap-2"><MapPin size={16} className="text-white/30" /><span className="text-base text-white/80 tracking-wide">{"Online"}</span></div><span className="text-xs font-semibold tracking-wide text-red-400">Flagged IP: 203.0.113.42</span></div>
            </div>
          </Surface>
        </motion.div>

        {/* ── Timeline ── */}
        <motion.div variants={fadeUpVariant} className="mb-8">
          <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4 transition-all hover:bg-white/[0.02]" padding="none">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 hidden md:flex items-center justify-between" role="list" aria-label="Alert timeline">
              {timelineSteps.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center gap-3 flex-1" role="listitem">
                  <div className="w-full flex items-center justify-center mb-2">
                    {i > 0 && <div className="h-0.5 flex-1 bg-white/[0.05] -mr-8" />}
                    <div className={`flex items-center justify-center rounded-full border z-10 ${step.status === "active" ? "animate-pulse" : ""} shadow-[0_0_15px_currentColor]`} style={{ width: 32, height: 32, background: step.status === "complete" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", borderColor: step.status === "complete" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)", color: step.status === "complete" ? "var(--state-healthy)" : "var(--state-warning)" }}>
                      {step.status === "complete" ? <CheckCircle2 size={16} className="text-emerald-400 drop-shadow-[0_0_8px_currentColor]" /> : <CircleDot size={16} className="text-amber-400 drop-shadow-[0_0_8px_currentColor]" />}
                    </div>
                    {i < timelineSteps.length - 1 && <div className="h-0.5 flex-1 bg-white/[0.05] -ml-8" />}
                  </div>
                  <span className="text-xs font-semibold text-center text-white/70 tracking-widest uppercase">{step.label}</span>
                  <span className="text-xs font-mono font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] text-white/40">{step.time}</span>
                </div>
              ))}
            </div>
            {/* Mobile vertical timeline */}
            <div className="flex flex-col gap-0 md:hidden relative z-10" role="list" aria-label="Alert timeline">
              {timelineSteps.map((step, i) => (
                <div key={step.label} className="flex items-start gap-4" role="listitem">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center rounded-full shrink-0 border border-white/[0.1] ${step.status === "active" ? "animate-pulse" : ""}`} style={{ width: 28, height: 28, background: step.status === "complete" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)" }}>
                      {step.status === "complete" ? <CheckCircle2 size={14} style={{ color: "var(--state-healthy)" }} /> : <CircleDot size={14} style={{ color: "var(--state-warning)" }} />}
                    </div>
                    {i < timelineSteps.length - 1 && <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.08)" }} aria-hidden="true" />}
                  </div>
                  <div className="flex items-center gap-3 pb-6 mt-1"><span className="text-sm font-medium" style={{ color: "#CBD5E1" }}>{step.label}</span><span className="text-xs font-mono" style={{ color: "#64748B" }}>{step.time}</span></div>
                </div>
              ))}
            </div>
          </Surface>
        </motion.div>

        {/* ── Evidence + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white" style={{ fontFamily: "var(--font-display)" }}>Evidence analysis</h2>
              <div className="flex flex-col gap-4">
                {evidenceItems.map(item => {
                  const expanded = expandedId === item.id
                  return (
                    <motion.div key={item.id} variants={fadeUpVariant}>
                      <Surface interactive className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-2xl bg-black/40 shadow-xl !p-0 transition-all hover:bg-white/[0.02]" padding="none">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                        <Button className="w-full justify-between rounded-none !p-6 text-left relative z-10 border-none" variant="ghost" engine="protect" size="sm" springPress={false} onClick={() => setExpandedId(expanded ? null : item.id)} aria-expanded={expanded} aria-label={`${item.title}: score ${(item.score * 100).toFixed(0)}%`}>
                          <div className="flex items-center gap-4">
                            <span className="inline-flex items-center justify-center rounded-xl text-sm font-bold font-mono tabular-nums shadow-[0_0_15px_currentColor] border border-[currentColor]/30 bg-[currentColor]/10" style={{ color: getScoreColor(item.score), width: 56, height: 36 }}>{item.score.toFixed(2)}</span>
                            <span className="text-base font-medium text-white/90 tracking-wide">{item.title}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/[0.05] bg-white/[0.02] shadow-inner transition-all group-hover:bg-white/[0.1]">
                            {expanded ? <ChevronUp size={16} className="text-white/60 drop-shadow-[0_0_5px_currentColor]" /> : <ChevronDown size={16} className="text-white/60 drop-shadow-[0_0_5px_currentColor]" />}
                          </div>
                        </Button>
                        <AnimatePresence>
                          {expanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden relative z-10">
                              <div className="px-6 pb-6 flex flex-col gap-3 mx-6 pt-4 border-t border-white/[0.06]">
                                <p className="text-sm leading-relaxed text-white/70 tracking-wide">{item.details}</p>
                                {item.model && <span className="text-xs font-mono text-white/30 uppercase tracking-widest mt-2 block">Model: {item.model}</span>}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Surface>
                    </motion.div>
                  )
                })}
              </div>

              {/* SHAP attribution waterfall */}
              <motion.div variants={fadeUpVariant} className="mt-4">
                <Surface interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]" padding="none">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">SHAP attribution</h3>
                      <p className="text-xs text-white/30 tracking-wide mt-1">Feature contribution to threat score</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <ShapWaterfall factors={shapFactors} />
                  </div>
                </Surface>
              </motion.div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Alert actions sidebar">
            {/* Recommended actions */}
            <div className="sticky top-6 flex flex-col gap-6">
              <Surface interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--state-critical)]/10 to-transparent pointer-events-none" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 relative z-10 border-b border-white/[0.06] pb-4">Actions</h3>

                <div className="flex flex-col gap-4 relative z-10">
                  <ButtonLink to="/protect/dispute" variant="primary" engine="protect" fullWidth className="rounded-2xl py-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] transition-all font-bold tracking-wide border-none bg-gradient-to-r from-[var(--engine-protect)] to-red-400 text-white" icon={<XCircle size={18} />}>{"Block & investigate"}</ButtonLink>
                  <ButtonLink
                    to="/protect/dispute"
                    variant="glass"
                    engine="protect"
                    fullWidth
                    className="rounded-2xl py-4 border border-white/[0.1] hover:bg-white/[0.05] shadow-lg backdrop-blur-md font-semibold tracking-wide"
                  >
                    Request verification
                  </ButtonLink>
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 mt-2 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <p className="text-xs text-center text-red-400 font-medium tracking-wide leading-relaxed drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{`AI recommends blocking (${formatConfidence(criticalAlert.confidence)} confidence)`}</p>
                  </div>
                </div>
              </Surface>

              {/* Primary CTA: Open execute queue -> /execute */}
              <Surface interactive className="relative overflow-hidden rounded-[24px] p-4 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-lg group hover:border-white/[0.2] transition-all cursor-pointer" padding="none" onClick={() => window.location.assign('/execute')}>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--engine-execute)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--engine-execute)]/20 border border-[var(--engine-execute)]/30 flex items-center justify-center text-[var(--engine-execute)] shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                      <CircleDot size={14} className="drop-shadow-[0_0_5px_currentColor]" />
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-white/90">Open execute queue</span>
                  </div>
                  <ArrowUpRight size={18} className="text-white/40 group-hover:text-white/90 transition-colors drop-shadow-[0_0_5px_currentColor]" />
                </div>
              </Surface>

              {/* Similar incidents */}
              <Surface interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 relative z-10 border-b border-white/[0.06] pb-4">Similar Incidents</h3>
                <div className="flex flex-col relative z-10">
                  {[{ title: `${criticalAlert.merchant} flagged`, time: "2 weeks ago", result: "Blocked" }, { title: "Unusual pattern", time: "3 weeks ago", result: "Verified safe" }, { title: "High-risk geo", time: "1 month ago", result: "Blocked" }].map((item, i) => (
                    <div key={i} className={`flex items-center justify-between py-4 ${i !== 0 ? 'border-t border-white/[0.04]' : ''}`}>
                      <div className="flex flex-col gap-1.5"><span className="text-sm font-medium tracking-wide text-white/80">{item.title}</span><span className="text-xs font-mono font-bold text-white/30 tracking-widest">{item.time}</span></div>
                      <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_currentColor] border border-[currentColor]/30 bg-[currentColor]/10" style={{ color: item.result === "Blocked" ? "var(--state-critical)" : "var(--state-healthy)" }}>{item.result}</span>
                    </div>
                  ))}
                </div>
              </Surface>

              {/* Account context */}
              <Surface interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02]" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 relative z-10 border-b border-white/[0.06] pb-4">Account Context</h3>
                <div className="flex flex-col gap-4 relative z-10">
                  {[{ label: "Account balance", value: "$12,847" }, { label: "Avg monthly spend", value: "$3,200" }, { label: "Risk score", value: "Low (0.12)", color: "var(--state-healthy)" }, { label: "Alerts this month", value: "2" }].map(d => (
                    <div key={d.label} className="flex items-center justify-between"><span className="text-sm text-white/60 tracking-wide font-medium">{d.label}</span><span className="text-base font-mono font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ color: d.color || "rgba(255,255,255,0.9)" }}>{d.value}</span></div>
                  ))}
                </div>
              </Surface>
            </div>
          </aside>
        </div>

        <GovernFooter
          auditId={GOVERNANCE_META['/protect/alert-detail'].auditId}
          pageContext={GOVERNANCE_META['/protect/alert-detail'].pageContext}
        />
      </motion.div>
    </div>
  )
}
