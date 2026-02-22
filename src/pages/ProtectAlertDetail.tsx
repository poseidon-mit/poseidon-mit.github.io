import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, LabelList } from 'recharts'
import { Link, useRouter } from '@/router'
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
  Upload,
  Zap,
  Copy,
  Check,
} from "lucide-react"
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { AuroraPulse } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { THREATS } from './Protect'

/* ── Data ── */
export interface FactorItem { id: string; title: string; weight: number; details: string; model: string; mitigating?: boolean }
export interface DerivedFactor extends FactorItem { value: number }
interface TimelineStep { label: string; time: string; status: "complete" | "active" }

/* Per-alert timing (aligned with THREATS detection times in Protect.tsx) */
export const ALERT_TIMING: Record<string, { detected: string; updated: string; times: string[] }> = {
  'THR-001': { detected: '2026-03-19T10:30:00-04:00', updated: '2026-03-19T10:32:00-04:00', times: ['10:30', '10:31', '10:32', '10:33'] },
  'THR-002': { detected: '2026-03-18T09:15:00-04:00', updated: '2026-03-18T09:17:00-04:00', times: ['09:15', '09:16', '09:17', '09:18'] },
  'THR-003': { detected: '2026-03-16T16:42:00-04:00', updated: '2026-03-16T16:44:00-04:00', times: ['16:42', '16:43', '16:44', '16:45'] },
  'THR-004': { detected: '2026-03-12T11:08:00-04:00', updated: '2026-03-12T11:10:00-04:00', times: ['11:08', '11:09', '11:10', '11:11'] },
  'THR-005': { detected: '2026-03-14T22:17:00-04:00', updated: '2026-03-14T22:19:00-04:00', times: ['22:17', '22:18', '22:19', '22:20'] },
}
const DEFAULT_TIMING = { detected: '2026-03-19T14:28:00-04:00', updated: '2026-03-19T14:30:00-04:00', times: ['14:28', '14:29', '14:30', '14:31'] }

/* Per-alert factor items — weights and descriptions reflect each signal's context */
export const ALERT_FACTOR_ITEMS: Record<string, FactorItem[]> = {
  /* ── THR-001: TechElectro Store, $2,847, Critical ── */
  'THR-001': [
    { id: "e1", title: "Unusual Spending", weight: 0.95,
      details: "Transaction amount $2,847 is 3.2\u00d7 your 180-day electronics category mean of $890. Percentile rank: 99.1. Prior max in category: $1,340.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.82,
      details: "3 transactions detected within a 2-hour window. Your 180-day baseline: 1.2 transactions/day. Burst frequency exceeds 97th percentile of your historical pattern.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.88,
      details: "$2,847 external transfer from checking preceded by $3,100 savings drawdown 48 hours prior. Cross-account flow pattern absent from your 24-month transaction history.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.85,
      details: "TechElectro Store dispute rate: 4.1% (platform electronics category average: 1.7%). Ratio: 2.4\u00d7. First transaction with this merchant. Merchant active on platform for 3 months.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.90,
      details: "Transaction feature vector matches 847 confirmed fraud cases across Poseidon platform. Similarity score: 0.93. Matched features: amount range, category, and temporal pattern.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.55,
      details: "Account age: 5.2 years. Monthly transaction consistency: 94%. Prior disputes: 0. Stability index: 0.97 (top 3% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.45,
      details: "Electronics category present in 14 of last 24 months. Category spend frequency rank: 3rd. Merchant is new but category familiarity score: 0.82.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-002: Unknown Vendor, $1,200, High ── */
  'THR-002': [
    { id: "e1", title: "Unusual Spending", weight: 0.60,
      details: "Transaction amount $1,200 is 1.8\u00d7 your 180-day general spending mean of $670. Percentile rank: 88.3. Amount moderate but vendor is unrecognized.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.78,
      details: "Transaction at 02:47 AM local time. Your 180-day active window: 07:00\u201323:00. Only 2.1% of your transactions occur between 00:00\u201306:00.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.72,
      details: "$1,200 debit to entity with no prior relationship. Zero outflows to unrecognized vendors in 12-month account history. Single-transaction outflow anomaly.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.95,
      details: "Vendor not found in any known merchant directory. Zero transaction history across Poseidon platform. Merchant category code: unlisted. Age on platform: <30 days.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.85,
      details: "Unrecognized vendor + after-hours timing pattern matches 523 confirmed fraud cases. Similarity score: 0.89. Matched features: vendor type, timing, and amount range.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.60,
      details: "Account age: 3.8 years. Monthly transaction consistency: 91%. Prior disputes: 0. Stability index: 0.94 (top 6% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.30,
      details: "Vendor category is unclassified. No prior transactions to unclassified merchants in 24-month history. Category familiarity score: 0.12.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-003: Travel Agency XYZ, $3,400, Medium ── */
  'THR-003': [
    { id: "e1", title: "Unusual Spending", weight: 0.70,
      details: "Transaction amount $3,400 is 2.1\u00d7 your 180-day travel category mean of $1,620. Percentile rank: 93.4. Prior max in travel category: $2,200.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.45,
      details: "Transaction at 11:23 AM on weekday. Within normal active hours. No significant temporal anomaly. Minor deviation from typical purchase cadence for this category.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.65,
      details: "$3,400 international wire transfer. 2 prior international transfers in 24-month history (average: $980). Amount is 3.5\u00d7 your prior international transfer mean.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.60,
      details: "Travel Agency XYZ dispute rate: 2.8% (platform travel category average: 2.1%). Ratio: 1.3\u00d7. First transaction with this agency. Agency active on platform for 8 months.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.55,
      details: "International wire + new travel vendor pattern matches 312 confirmed fraud cases. Similarity score: 0.71. Matched features: transfer type and amount range.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.65,
      details: "Account age: 7.1 years. Monthly transaction consistency: 96%. Prior disputes: 0. Stability index: 0.98 (top 2% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.55,
      details: "Travel category present in 8 of last 24 months. Category spend frequency rank: 5th. International travel sub-category familiarity score: 0.58.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-004: Gas Station ATM, $800, Low ── */
  'THR-004': [
    { id: "e1", title: "Unusual Spending", weight: 0.50,
      details: "ATM withdrawal $800. Your 180-day ATM withdrawal mean: $220. Percentile rank: 91.2. Prior max ATM withdrawal: $500. Amount is 3.6\u00d7 above your ATM average.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.40,
      details: "Withdrawal at 10:14 PM local time. 73% of your ATM usage occurs between 09:00\u201318:00. After-hours ATM withdrawal frequency: 4 in 12-month history.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.35,
      details: "$800 cash withdrawal followed by $340 point-of-sale purchase 20 minutes later. Rapid cash-then-spend pattern not present in your 12-month transaction history.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.45,
      details: "Gas Station ATM skimming report rate: 1.8% (platform ATM average: 0.6%). Ratio: 3.0\u00d7. First withdrawal at this location. ATM operator flagged in 2 prior platform incidents.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.50,
      details: "High-amount ATM withdrawal at flagged location pattern matches 142 confirmed card-skimming cases. Similarity score: 0.64. Matched features: amount, location risk, and timing.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.70,
      details: "Account age: 6.3 years. Monthly transaction consistency: 95%. Prior disputes: 0. Stability index: 0.98 (top 2% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.65,
      details: "ATM withdrawal category present in 18 of last 24 months. Category spend frequency rank: 4th. Gas station merchants used 6 times prior. Familiarity score: 0.74.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-005: Crypto Exchange, $5,000, Medium ── */
  'THR-005': [
    { id: "e1", title: "Unusual Spending", weight: 0.85,
      details: "Transaction amount $5,000. First cryptocurrency purchase \u2014 no 180-day category baseline exists. Amount exceeds your median transaction by 4.7\u00d7.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.55,
      details: "Transaction at 11:42 PM local time. Within active hours but upper boundary. 8.3% of your transactions occur between 23:00\u201300:00.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.80,
      details: "$5,000 transfer to cryptocurrency exchange. No prior outflows to digital asset platforms in 24-month history. Represents 12.4% of checking account balance.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.75,
      details: "Crypto Exchange dispute rate: 5.7% (platform average: 1.9%). Ratio: 3.0\u00d7. First transaction with this exchange. Exchange active on platform for 6 months.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.92,
      details: "First-time crypto + high-amount pattern matches 691 confirmed fraud cases. Similarity score: 0.91. Matched features: new category, amount, and platform risk level.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.55,
      details: "Account age: 4.5 years. Monthly transaction consistency: 92%. Prior disputes: 0. Stability index: 0.95 (top 5% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.25,
      details: "Cryptocurrency category: 0 occurrences in 24-month history. No prior digital asset transactions. Category familiarity score: 0.04.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
}
const DEFAULT_FACTOR_ITEMS = ALERT_FACTOR_ITEMS['THR-001']

export const MITIGATING_TOTAL = 0.08 // fixed total risk reduction for mitigating factors

/** Derive contribution values — adjusts largest risk item to guarantee sum === confidence */
export function deriveFactors(items: FactorItem[], confidence: number): DerivedFactor[] {
  const positiveTarget = confidence + MITIGATING_TOTAL
  const riskItems = items.filter(i => !i.mitigating)
  const safeItems = items.filter(i => i.mitigating)
  const riskWeightSum = riskItems.reduce((s, i) => s + i.weight, 0)
  const safeWeightSum = safeItems.reduce((s, i) => s + i.weight, 0)

  const derived: DerivedFactor[] = items.map(item => {
    if (item.mitigating) {
      return { ...item, value: -Math.round((item.weight / safeWeightSum) * MITIGATING_TOTAL * 100) / 100 }
    }
    return { ...item, value: Math.round((item.weight / riskWeightSum) * positiveTarget * 100) / 100 }
  })

  // Fix rounding: adjust highest-weight risk item so sum equals confidence exactly
  const total = Math.round(derived.reduce((s, d) => s + d.value, 0) * 100) / 100
  const diff = Math.round((confidence - total) * 100) / 100
  if (diff !== 0) {
    const maxRisk = derived.reduce((best, d) => !d.mitigating && d.value > (best?.value ?? 0) ? d : best, null as DerivedFactor | null)
    if (maxRisk) maxRisk.value = Math.round((maxRisk.value + diff) * 100) / 100
  }

  return derived
}

/* detectedAt / updatedAt are now derived per-alert inside the component */

function getScoreColor(v: number) {
  if (v < 0) return '#3B82F6' // blue for mitigating
  return v >= 0.20 ? 'var(--state-critical)' : v >= 0.15 ? 'var(--state-warning)' : 'var(--engine-govern)'
}

/* ── SHAP Waterfall (Recharts) ── */
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

function ShapWaterfall({ factors }: { factors: DerivedFactor[] }) {
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
            width={100}
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
  const { search, navigate } = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [disputeState, setDisputeState] = useState<'idle' | 'drafting' | 'submitted'>('idle')
  const [copied, setCopied] = useState(false)

  const alert = useMemo(() => {
    const alertId = new URLSearchParams(search).get('alertId')
    return THREATS.find(t => t.id === alertId) || THREATS[0]
  }, [search])

  const severityTheme = useMemo(() => {
    switch (alert.severity) {
      case 'Critical': return { color: 'var(--state-critical)', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', shadow: 'rgba(239,68,68,0.5)' }
      case 'High': return { color: 'var(--state-warning)', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', shadow: 'rgba(245,158,11,0.5)' }
      case 'Medium': return { color: 'var(--engine-govern)', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', shadow: 'rgba(59,130,246,0.5)' }
      case 'Low': return { color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', shadow: 'rgba(148,163,184,0.5)' }
      default: return { color: 'var(--state-critical)', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', shadow: 'rgba(239,68,68,0.5)' }
    }
  }, [alert.severity])

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
      `Transaction    ${alert.amount} · ${alert.merchant}`,
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
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>{`Signal #${alert.id}`}</h1>
              <span className="text-sm tracking-wide text-white/40 font-mono mt-1">{`Detected: ${detectedAt} • Updated: ${updatedAt}`}</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,0,0,0.2)]" style={{ background: severityTheme.bg, border: `1px solid ${severityTheme.border}`, color: severityTheme.color }} aria-label={`Alert status: ${alert.severity}`}><AlertTriangle size={16} />{alert.severity}</span>
          </motion.div>
        </motion.section>

        {/* ── Alert Summary ── */}
        <motion.div variants={fadeUpVariant} className="mb-6">
          <div className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.2)] flex flex-col gap-4 transition-all hover:bg-white/[0.02]" style={{ border: `1px solid ${severityTheme.border}` }}>
            <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, ${severityTheme.bg}, transparent)` }} />

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8 relative z-10">
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Merchant</span><span className="text-lg font-medium text-white/90">{alert.merchant}</span></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Amount</span><span className="text-2xl font-light font-mono" style={{ color: severityTheme.color, textShadow: `0 0 8px ${severityTheme.shadow}` }}>{alert.amount}</span></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Confidence</span><div className="flex items-center gap-3"><div className="h-1.5 w-24 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.02]"><div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]" style={{ width: `${alert.confidence * 100}%`, background: severityTheme.color }} /></div><span className="text-base font-mono font-bold drop-shadow-[0_0_5px_currentColor]" style={{ color: severityTheme.color }}>{formatConfidence(alert.confidence)}</span></div></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Alert type</span><span className="text-base text-white/70 tracking-wide">{alert.description}</span></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Account</span><div className="flex items-center gap-2"><CreditCard size={16} className="text-white/30" /><span className="text-base font-mono font-medium drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] text-white/80">{`Checking ****4821`}</span></div></div>
              <div className="flex flex-col gap-2"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Location</span><div className="flex items-center gap-2"><MapPin size={16} className="text-white/30" /><span className="text-base text-white/80 tracking-wide">{"Online"}</span></div><span className="text-xs font-semibold tracking-wide" style={{ color: severityTheme.color }}>Flagged IP: 203.0.113.42</span></div>
            </div>
          </div>
        </motion.div>

        {/* ── Timeline ── */}
        <motion.div variants={fadeUpVariant} className="mb-8">
          <div className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4 transition-all hover:bg-white/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 hidden md:flex items-center justify-between" role="list" aria-label="Alert timeline">
              {timelineSteps.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center gap-3 flex-1" role="listitem">
                  <div className="w-full flex items-center justify-center mb-2">
                    <div className={`h-0.5 flex-1 -mr-8 ${i > 0 ? 'bg-white/[0.05]' : 'bg-transparent'}`} />
                    <div className={`flex items-center justify-center rounded-full border z-10 ${step.status === "active" ? "animate-pulse" : ""} shadow-[0_0_15px_currentColor]`} style={{ width: 32, height: 32, background: step.status === "complete" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", borderColor: step.status === "complete" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)", color: step.status === "complete" ? "var(--state-healthy)" : "var(--state-warning)" }}>
                      {step.status === "complete" ? <CheckCircle2 size={16} className="text-emerald-400 drop-shadow-[0_0_8px_currentColor]" /> : <CircleDot size={16} className="text-amber-400 drop-shadow-[0_0_8px_currentColor]" />}
                    </div>
                    <div className={`h-0.5 flex-1 -ml-8 ${i < timelineSteps.length - 1 ? 'bg-white/[0.05]' : 'bg-transparent'}`} />
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
          </div>
        </motion.div>

        {/* ── Decision Drivers + Evidence ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* SHAP attribution waterfall */}
          <motion.div variants={fadeUpVariant}>
            <div className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02] h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Decision Drivers</h3>
                  <p className="text-xs text-white/30 tracking-wide mt-1">Key factors driving this AI decision. <span className="font-mono uppercase tracking-widest text-white/20">Mode: Poseidon-Fraud v1.0</span></p>
                </div>
              </div>
              <div className="relative z-10">
                <ShapWaterfall factors={factors} />
              </div>
            </div>
          </motion.div>

          {/* Evidence Analysis */}
          <motion.div variants={fadeUpVariant}>
            <div className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-6 transition-all hover:bg-white/[0.02] h-full">
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
                          <span className="inline-flex items-center justify-center rounded-xl text-sm font-bold font-mono tabular-nums shadow-[0_0_15px_currentColor] border border-[currentColor]/30 bg-[currentColor]/10" style={{ color: getScoreColor(item.value), width: 56, height: 36 }}>{displayValue}</span>
                          <span className="text-sm font-medium text-white/90 tracking-wide">{item.title}</span>
                        </div>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center border border-white/[0.05] bg-white/[0.02]">
                          {expanded ? <ChevronUp size={14} className="text-white/50" /> : <ChevronDown size={14} className="text-white/50" />}
                        </div>
                      </div>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
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
            <div className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all hover:bg-white/[0.02]" style={{ borderColor: 'var(--state-critical)' }}>
              <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, ${severityTheme.bg}, transparent)` }} />
              <div className="relative z-10 flex flex-col gap-1">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Recommended Action</h3>
                <p className="text-sm font-medium tracking-wide" style={{ color: severityTheme.color }}>{`AI recommends blocking (${formatConfidence(alert.confidence)} confidence)`}</p>
              </div>
              <div className="relative z-10 flex items-center gap-3 shrink-0">
                <button onClick={() => setDisputeState('drafting')} className={cn(buttonVariants({ variant: "default" }), "rounded-2xl px-8 py-4 transition-all font-bold tracking-wide border-none text-white shadow-lg")} style={{ background: severityTheme.color, boxShadow: `0 0 30px ${severityTheme.shadow}` }}>
                  <span className="flex items-center justify-center gap-2"><XCircle size={18} /> Block & Dispute</span>
                </button>
                <button onClick={() => {
                  const key = 'poseidon:dismissed-alerts'
                  const prev: string[] = JSON.parse(localStorage.getItem(key) || '[]')
                  if (!prev.includes(alert.id)) localStorage.setItem(key, JSON.stringify([...prev, alert.id]))
                  navigate('/protect')
                }} className={cn(buttonVariants({ variant: "ghost" }), "rounded-2xl px-6 py-4 border border-white/[0.08] hover:bg-white/[0.05] text-white/50 hover:text-white/70 font-medium tracking-wide transition-all flex items-center gap-2")}>
                  <CheckCircle2 size={18} /> This was Me
                </button>
              </div>
            </div>
          )}

          {disputeState === 'drafting' && (
            <div className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border backdrop-blur-3xl shadow-2xl flex flex-col gap-6" style={{ borderColor: 'var(--engine-execute)', background: 'rgba(234, 179, 8, 0.05)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-execute)]/20 to-transparent pointer-events-none" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 relative z-10 border-b border-white/[0.06] pb-4">Case Brief</h3>
              <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                <div className="flex-1 flex flex-col gap-4">
                  {/* Case Brief — structured reference for bank dispute */}
                  <div className="rounded-[20px] bg-black/40 border border-white/[0.06] p-5 font-mono text-xs leading-relaxed shadow-inner">
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-white/60">
                      <span className="text-white/40">Transaction</span>
                      <span><span className="text-red-400 font-bold">{alert.amount}</span>{' · '}<span className="text-white/90 font-bold">{alert.merchant}</span></span>
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
            <div className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-emerald-500/30 backdrop-blur-3xl bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row sm:items-center gap-6 text-center sm:text-left">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center gap-4 shrink-0">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400 drop-shadow-[0_0_10px_currentColor]" />
                </div>
                <div>
                  <h3 className="text-lg font-light tracking-wide text-white" style={{ fontFamily: "var(--font-display)" }}>Dispute Filed</h3>
                  <p className="text-sm text-white/70 tracking-wide">Case <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-1 rounded border border-emerald-500/20">{caseBrief.caseId}</span> sent to your bank.</p>
                </div>
              </div>
              <div className="relative z-10 bg-black/40 border border-white/10 rounded-xl p-3 flex-1 text-left">
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Next Step</p>
                <p className="text-sm font-medium text-emerald-400 drop-shadow-[0_0_5px_currentColor]">Your bank will review within 10 business days (Reg E). Provisional credit may apply within 48h.</p>
              </div>
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  )
}
