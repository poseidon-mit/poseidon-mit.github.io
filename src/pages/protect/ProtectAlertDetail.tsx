import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, LabelList } from 'recharts'
import { useRouter } from '@/router'
import { SubPageNav, ConfidenceIndicator } from '@/components/poseidon'
import {
  AlertTriangle,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  CircleDot,
  Upload,
  Zap,
  Copy,
  Check,
} from "lucide-react"
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/use-page-title'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import {
  THREATS,
  ALERT_FACTOR_ITEMS,
  ALERT_TIMING,
  DEFAULT_FACTOR_ITEMS,
  DEFAULT_TIMING,
  MITIGATING_TOTAL,
  deriveFactors,
  severityConfig,
} from './protect-data'
import type { DerivedFactor } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'

/* ── Local types ── */
interface TimelineStep { label: string; time: string; status: "complete" | "active" }

/* ── Chart helpers ── */

function getScoreColor(v: number) {
  if (v < 0) return '#3B82F6' // blue for mitigating
  return v >= 0.20 ? 'var(--state-critical)' : v >= 0.15 ? 'var(--state-warning)' : 'var(--engine-govern)'
}

const WATERFALL_COLORS = { risk: '#DC2626', safe: '#3B82F6', final: '#22C55E' } as const

interface WaterfallDatum {
  name: string
  base: number
  value: number
  type: 'risk' | 'safe' | 'final'
  displayValue: string
}

function computeWaterfallData(factors: { name: string; value: number }[]): WaterfallDatum[] {
  const positives = factors.filter(f => f.value > 0).sort((a, b) => b.value - a.value)
  const negatives = factors.filter(f => f.value <= 0).sort((a, b) => a.value - b.value)
  const sorted = [...positives, ...negatives]

  let cumulative = 0
  const result: WaterfallDatum[] = []

  for (const f of sorted) {
    if (f.value >= 0) {
      result.push({ name: f.name, base: cumulative, value: f.value, type: 'risk', displayValue: `+${f.value.toFixed(2)}` })
      cumulative += f.value
    } else {
      cumulative += f.value
      result.push({ name: f.name, base: cumulative, value: Math.abs(f.value), type: 'safe', displayValue: f.value.toFixed(2) })
    }
  }

  result.push({ name: 'Final Risk Score', base: 0, value: Math.round(cumulative * 100) / 100, type: 'final', displayValue: cumulative.toFixed(2) })
  return result
}

function ProtectShapWaterfallChart({ factors }: { factors: DerivedFactor[] }) {
  const waterfallInput = useMemo(() => factors.map(f => ({ name: f.title, value: f.value })), [factors])
  const data = useMemo(() => computeWaterfallData(waterfallInput), [waterfallInput])

  return (
    <div className="flex flex-col gap-3">
      {/* Legend */}
      <div className="flex items-center justify-center gap-5 text-[11px] text-white/50">
        {([['Risk increase', WATERFALL_COLORS.risk], ['Risk decrease', WATERFALL_COLORS.safe], ['Final', WATERFALL_COLORS.final]] as const).map(([label, color]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: color, opacity: 0.7 }} />
            {label}
          </span>
        ))}
      </div>
      {/* Chart */}
      <ResponsiveContainer width="100%" height={data.length * 52 + 40}>
        <BarChart layout="vertical" data={data} margin={{ top: 4, right: 44, left: -8, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 1]}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono, monospace)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
            label={{ value: 'Risk Score', position: 'bottom', offset: 10, fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={70}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="value" stackId="w" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList
              dataKey="displayValue"
              position="right"
              style={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}
            />
            {data.map((entry, i) => (
              <Cell key={i} fill={WATERFALL_COLORS[entry.type]} fillOpacity={0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PROTECT ALERT DETAIL PAGE
   ═══════════════════════════════════════════════════════ */

export default function ProtectAlertDetailPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  usePageTitle('Alert Detail')
  const { search, navigate } = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [disputeState, setDisputeState] = useState<'idle' | 'drafting' | 'submitted'>('idle')
  const [copied, setCopied] = useState(false)

  const { dismiss } = useDismissedAlerts()

  const alert = useMemo(() => {
    const alertId = new URLSearchParams(search).get('alertId')
    return THREATS.find(t => t.id === alertId) || THREATS[0]
  }, [search])

  const severityTheme = severityConfig[alert.severity]

  const factors = useMemo(() => {
    const items = ALERT_FACTOR_ITEMS[alert.id] || DEFAULT_FACTOR_ITEMS
    return deriveFactors(items, alert.confidence)
  }, [alert.id, alert.confidence])

  /** Sorted to match waterfall chart order: risk desc, then mitigating */
  const sortedFactors = useMemo(() => {
    const risk = factors.filter(f => !f.mitigating).sort((a, b) => b.value - a.value)
    const safe = factors.filter(f => f.mitigating).sort((a, b) => a.value - b.value)
    return [...risk, ...safe]
  }, [factors])

  /** Case brief: top 3 risk factors as key findings for bank dispute */
  const caseBrief = useMemo(() => {
    const topRisk = sortedFactors.filter(f => !f.mitigating).slice(0, 3)
    const findings = topRisk.map(f => {
      // Extract first sentence from details as concise finding
      const first = f.details.split('. ')[0]
      return first.endsWith('.') ? first : `${first}.`
    })
    const t = ALERT_TIMING[alert.id] || { detected: '' }
    const dateStr = t.detected ? new Date(t.detected).toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : 'N/A'
    const caseId = `POS-DIS-${alert.id.replace('THR-', '')}`
    const text = [
      `CASE BRIEF — ${alert.id}`,
      '',
      `Transaction    ${alert.amount} · ${alert.counterparty}`,
      `Date           ${dateStr}`,
      `Account        Checking ****4821`,
      `AI Confidence  ${formatConfidence(alert.confidence)} (${alert.severity})`,
      '',
      'Key Findings',
      ...findings.map(f => `· ${f}`),
      '',
      `Reference      ${caseId}`,
    ].join('\n')
    return { findings, dateStr, caseId, text }
  }, [alert, sortedFactors])

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(caseBrief.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const timing = ALERT_TIMING[alert.id] || DEFAULT_TIMING
  const detectedAt = formatDemoTimestamp(timing.detected)
  const updatedAt = formatDemoTimestamp(timing.updated)
  const timelineSteps: TimelineStep[] = [
    { label: "Signal detected", time: timing.times[0], status: "complete" },
    { label: "Analysis complete", time: timing.times[1], status: "complete" },
    { label: "Alert raised", time: timing.times[2], status: "complete" },
    { label: "User notified", time: timing.times[3], status: "complete" },
    { label: "Resolution pending", time: "Now", status: "active" },
  ]

  return (
    <>

      <SubPageNav engine="protect" parentPath="/protect" parentLabel="Protect" currentLabel={`Signal #${alert.id}`} />

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 py-6 md:py-8`}
        style={PAGE_CONTENT_STYLE}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >

        {/* ── Header ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 mb-8 mt-4">
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className={PAGE_HEADING_CLASS} style={PAGE_HEADING_STYLE}>{`Signal #${alert.id}`}</h1>
              <span className="text-sm tracking-wide text-white/40 font-mono mt-1">{`Detected: ${detectedAt} • Updated: ${updatedAt}`}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 md:gap-2 rounded-full px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-bold uppercase tracking-widest" style={{ background: severityTheme.bg, border: `1px solid ${severityTheme.border}`, color: severityTheme.color }} aria-label={`Alert status: ${alert.severity}`}><AlertTriangle size={16} />{alert.severity}</span>
          </motion.div>
        </motion.section>

        {/* ── Alert Summary ── */}
        <motion.div variants={fadeUpVariant} className="mb-6">
          <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col gap-4 transition-all" style={{ border: `1px solid ${severityTheme.border}` }}>
            <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, ${severityTheme.bg}, transparent)` }} />

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8 relative z-10">
              <div className="flex flex-col gap-2 min-w-0"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Counterparty</span><span className="text-base md:text-lg font-medium text-white/90">{alert.counterparty}</span></div>
              <div className="flex flex-col gap-2 min-w-0"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Amount</span><span className="text-lg md:text-2xl font-light font-mono" style={{ color: severityTheme.color }}>{alert.amount}</span></div>
              <div className="flex flex-col gap-2 min-w-0"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Confidence</span><ConfidenceIndicator value={alert.confidence} colorOverride={severityTheme.color} size="lg" glow /></div>
              <div className="flex flex-col gap-2 min-w-0"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Alert type</span><span className="text-sm md:text-base text-white/70 tracking-wide break-words">{alert.description}</span></div>
              <div className="flex flex-col gap-2 min-w-0"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Account</span><div className="flex items-center gap-2"><CreditCard size={16} className="text-white/30" /><span className="text-base font-mono font-medium text-white/80">{`Checking ****4821`}</span></div></div>
              <div className="flex flex-col gap-2 min-w-0"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Location</span><div className="flex items-center gap-2"><MapPin size={16} className="text-white/30" /><span className="text-base text-white/80 tracking-wide">{"Online"}</span></div><span className="text-xs font-semibold tracking-wide" style={{ color: severityTheme.color }}>Flagged IP: 203.0.113.42</span></div>
            </div>
          </div>
        </motion.div>

        {/* ── Timeline ── */}
        <motion.div variants={fadeUpVariant} className="mb-8">
          <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col gap-4 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 hidden md:flex items-center justify-between" role="list" aria-label="Alert timeline">
              {timelineSteps.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center gap-3 flex-1" role="listitem">
                  <div className="w-full flex items-center justify-center mb-2">
                    <div className={`h-0.5 flex-1 -mr-8 ${i > 0 ? 'bg-white/[0.05]' : 'bg-transparent'}`} />
                    <div className={`flex items-center justify-center rounded-full border z-10 ${step.status === "active" ? "animate-pulse" : ""}`} style={{ width: 32, height: 32, background: step.status === "complete" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", borderColor: step.status === "complete" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)", color: step.status === "complete" ? "var(--state-healthy)" : "var(--state-warning)" }}>
                      {step.status === "complete" ? <CheckCircle2 size={16} className="text-emerald-400" /> : <CircleDot size={16} className="text-amber-400" />}
                    </div>
                    <div className={`h-0.5 flex-1 -ml-8 ${i < timelineSteps.length - 1 ? 'bg-white/[0.05]' : 'bg-transparent'}`} />
                  </div>
                  <span className="text-xs font-semibold text-center text-white/70 tracking-widest uppercase">{step.label}</span>
                  <span className="text-xs font-mono font-bold text-white/40">{step.time}</span>
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
          </div>
        </motion.div>

        {/* ── Decision Drivers + Evidence ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* SHAP attribution waterfall */}
          <motion.div variants={fadeUpVariant}>
            <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col gap-6 transition-all h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Decision Drivers</h3>
                  <p className="text-xs text-white/30 tracking-wide mt-1">Key factors driving this AI decision. <span className="font-mono uppercase tracking-widest text-white/20">Model: Poseidon-ThreatDetect v1.0</span></p>
                </div>
              </div>
              <div className="relative z-10">
                <ProtectShapWaterfallChart factors={factors} />
              </div>
            </div>
          </motion.div>

          {/* Evidence Analysis */}
          <motion.div variants={fadeUpVariant}>
            <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col gap-6 transition-all h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Evidence Analysis</h3>
                  <p className="text-xs text-white/30 tracking-wide mt-1">Why our AI flagged this transaction</p>
                </div>
              </div>
              <div className="relative z-10 flex flex-col gap-2">
                {sortedFactors.map(item => {
                  const expanded = expandedId === item.id
                  const displayValue = item.value >= 0 ? `+${item.value.toFixed(2)}` : item.value.toFixed(2)
                  return (
                    <div key={item.id} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] transition-all hover:bg-white/[0.04] cursor-pointer" onClick={() => setExpandedId(expanded ? null : item.id)}>
                      <div className="flex items-center justify-between px-5 py-4" aria-expanded={expanded} aria-label={`${item.title}: ${displayValue}`}>
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center justify-center rounded-xl text-sm font-bold font-mono tabular-nums border border-[currentColor]/30 bg-[currentColor]/10" style={{ color: getScoreColor(item.value), width: 56, height: 36 }}>{displayValue}</span>
                          <span className="text-sm font-medium text-white/90 tracking-wide">{item.title}</span>
                        </div>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center border border-white/[0.05] bg-white/[0.02]">
                          {expanded ? <ChevronUp size={14} className="text-white/50" /> : <ChevronDown size={14} className="text-white/50" />}
                        </div>
                      </div>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                            <div className="px-5 pb-4 flex flex-col gap-2 mx-5 pt-3 border-t border-white/[0.06]">
                              <p className="text-sm leading-relaxed text-white/60 tracking-wide">{item.details}</p>
                              {item.model && <span className="text-xs font-mono text-white/30 uppercase tracking-widest mt-1 block">Model: {item.model}</span>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Actions ── */}
        <motion.div variants={fadeUpVariant}>
          {disputeState === 'idle' && (
            <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all" style={{ borderColor: 'var(--state-critical)' }}>
              <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, ${severityTheme.bg}, transparent)` }} />
              <div className="relative z-10 flex flex-col gap-1">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Recommended Action</h3>
                <p className="text-sm font-medium tracking-wide" style={{ color: severityTheme.color }}>{`AI recommends blocking (${formatConfidence(alert.confidence)} confidence)`}</p>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button onClick={() => setDisputeState('drafting')} className={cn(buttonVariants({ variant: "default" }), "rounded-2xl px-8 py-4 transition-all font-bold tracking-wide border-none text-white shadow-lg")} style={{ background: severityTheme.color, boxShadow: `0 0 30px ${severityTheme.shadow}` }}>
                  <span className="flex items-center justify-center gap-2"><XCircle size={18} /> Block & Dispute</span>
                </button>
                <button onClick={() => { dismiss(alert.id); navigate('/protect') }} className={cn(buttonVariants({ variant: "ghost" }), "rounded-2xl px-6 py-4 border border-white/[0.08] hover:bg-white/[0.05] text-white/50 hover:text-white/70 font-medium tracking-wide transition-all flex items-center justify-center gap-2")}>
                  <CheckCircle2 size={18} /> This was Me
                </button>
              </div>
            </div>
          )}

          {disputeState === 'drafting' && (
            <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col gap-6" style={{ borderColor: 'var(--engine-execute)', background: 'rgba(234, 179, 8, 0.05)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-execute)]/20 to-transparent pointer-events-none" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 relative z-10 border-b border-white/[0.06] pb-4">Case Brief</h3>
              <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                <div className="flex-1 flex flex-col gap-4">
                  {/* Case Brief — structured reference for bank dispute */}
                  <div className="rounded-[20px] bg-black/40 border border-white/[0.06] p-5 font-mono text-xs leading-relaxed shadow-inner">
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-white/60">
                      <span className="text-white/40">Transaction</span>
                      <span><span className="text-red-400 font-bold">{alert.amount}</span>{' · '}<span className="text-white/90 font-bold">{alert.counterparty}</span></span>
                      <span className="text-white/40">Date</span>
                      <span className="text-white/70">{caseBrief.dateStr}</span>
                      <span className="text-white/40">Account</span>
                      <span className="text-white/70">Checking ****4821</span>
                      <span className="text-white/40">AI Confidence</span>
                      <span className="font-bold" style={{ color: severityTheme.color }}>{formatConfidence(alert.confidence)} ({alert.severity})</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/[0.06]">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--engine-execute)] font-semibold mb-2">Key Findings</p>
                      <ul className="flex flex-col gap-1.5">
                        {caseBrief.findings.map((f, i) => (
                          <li key={i} className="text-white/70 flex gap-2">
                            <span className="text-[var(--engine-execute)] shrink-0">·</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-white/40">Reference <span className="text-white/70 font-bold">{caseBrief.caseId}</span></span>
                      <button
                        onClick={handleCopyBrief}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all border border-white/[0.08] hover:border-[var(--engine-execute)]/40 hover:bg-[var(--engine-execute)]/10 text-white/50 hover:text-white/80"
                      >
                        {copied ? <><Check size={12} className="text-emerald-400" />Copied</> : <><Copy size={12} />Copy to clipboard</>}
                      </button>
                    </div>
                  </div>
                  {/* Upload supporting docs */}
                  <div className="rounded-[20px] border border-dashed border-[var(--engine-execute)]/30 hover:border-[var(--engine-execute)]/60 cursor-pointer p-4 text-center bg-[var(--engine-execute)]/5 hover:bg-[var(--engine-execute)]/10 transition-colors group">
                    <Upload className="w-6 h-6 text-white/40 group-hover:text-white/80 mx-auto mb-2 transition-colors drop-shadow-sm" />
                    <p className="text-xs font-medium tracking-wide text-white/80">Attach Supporting Documents</p>
                    <p className="text-[10px] text-white/40 mt-1">Receipts, invoices, or correspondence that support your claim</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 lg:justify-end lg:w-48 shrink-0">
                  <button onClick={() => setDisputeState('submitted')} className={cn(buttonVariants({ variant: "default" }), "w-full rounded-xl py-3 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] bg-[var(--engine-execute)] border-none text-black font-bold tracking-wide flex items-center justify-center gap-2 transition-all")}><Zap size={16} />Email to Bank</button>
                  <button onClick={() => setDisputeState('idle')} className={cn(buttonVariants({ variant: "ghost" }), "w-full rounded-xl py-3 border border-white/10 hover:bg-white/10 text-white/60 font-medium")}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {disputeState === 'submitted' && (
            <div className="glass-card rounded-2xl p-6 lg:p-8 !border-emerald-500/30 !bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center gap-6 text-center sm:text-left">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center gap-4 shrink-0">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-light tracking-wide text-white" style={{ fontFamily: "var(--font-display)" }}>Dispute Filed</h3>
                  <p className="text-sm text-white/70 tracking-wide">Case <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded border border-emerald-500/20">{caseBrief.caseId}</span> sent to your bank.</p>
                </div>
              </div>
              <div className="relative z-10 bg-black/40 border border-white/10 rounded-xl p-3 flex-1 text-left">
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Next Step</p>
                <p className="text-sm font-medium text-emerald-400">Your bank will review within 10 business days (Reg E). Provisional credit may apply within 48h.</p>
              </div>
            </div>
          )}
        </motion.div>

      </motion.div>
    </>
  )
}
