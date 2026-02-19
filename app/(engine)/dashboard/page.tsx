"use client"

import { useState, useEffect, useMemo, memo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  LayoutDashboard,
  Info,
  Shield,
  TrendingUp,
  Zap,
  Scale,
  ShieldCheck,
  ExternalLink,
  User,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"

/* ── Motion presets (same names/values as src/lib/motion-presets.ts) ── */
const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ── Cross-thread values (frozen from CROSS_SCREEN_DATA_THREAD) ── */
const SYSTEM_CONFIDENCE = 0.92
const PENDING_ACTIONS = 5
const COMPLIANCE_SCORE = 96

/* ── AuroraPulse (inlined from src/components/poseidon/aurora-pulse) ── */
function AuroraPulse({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background: `radial-gradient(70% 50% at 50% 0%, ${color}0F, transparent), radial-gradient(40% 40% at 80% 20%, ${color}08, transparent)`,
        animation: "aurora-drift 8s ease-in-out infinite alternate",
      }}
    />
  )
}

/* ── GovernFooter (inlined from src/components/poseidon/govern-footer) ── */
function GovernFooter({ auditId, pageContext }: { auditId: string; pageContext: string }) {
  return (
    <footer
      className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/[0.06] px-4 py-3 md:px-6 md:py-4"
      style={{ background: "rgba(255,255,255,0.03)" }}
      role="contentinfo"
      aria-label="Governance verification footer"
    >
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 28, height: 28, background: "rgba(59,130,246,0.12)" }}
        >
          <ShieldCheck size={14} style={{ color: "var(--engine-govern)" }} />
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: "rgba(16,185,129,0.12)", color: "var(--state-healthy)" }}
        >
          <Shield size={10} />
          Verified
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: "#64748B" }}>{auditId}</span>
        <ExternalLink size={12} style={{ color: "#64748B" }} aria-hidden="true" />
      </div>
      <Link
        href="/govern/audit"
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/[0.04]"
        style={{ borderColor: "rgba(255,255,255,0.08)", color: "#CBD5E1", minHeight: "44px" }}
        aria-label={`Request human review of ${pageContext}`}
      >
        <User size={14} />
        Request human review
      </Link>
    </footer>
  )
}

/* ── KPI Stat Card ── */
const StatCard = memo(function StatCard({
  label,
  value,
  delta,
  deltaPositive,
  sparkData,
  sparkColor,
}: {
  label: string
  value: string
  delta: string
  deltaPositive: boolean
  sparkData: number[]
  sparkColor: string
}) {
  const data = useMemo(() => sparkData.map((v, i) => ({ i, v })), [sparkData])
  return (
    <motion.div variants={fadeUp} className="stat-card glass-surface">
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        <div className="stat-card__spark" aria-hidden="true">
          <ResponsiveContainer width={60} height={24}>
            <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparkColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={1.5}
                fill={`url(#spark-${label.replace(/\s/g, "")})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <span className="stat-card__value">{value}</span>
      <span className={`stat-card__delta ${deltaPositive ? "stat-card__delta--up" : "stat-card__delta--down"}`}>
        {delta}
      </span>
    </motion.div>
  )
})

/* ── Engine Health Card ── */
function EngineHealthCard({
  name,
  icon: Icon,
  score,
  status,
  color,
}: {
  name: string
  icon: React.ElementType
  score: string
  status: string
  color: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="glass-surface rounded-2xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-lg w-8 h-8"
          style={{ background: `${color}15` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        <span className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{name}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold font-mono tabular-nums" style={{ color }}>{score}</span>
        <span
          className="text-[10px] font-semibold rounded-full px-2 py-0.5"
          style={{ background: "rgba(16,185,129,0.12)", color: "var(--state-healthy)" }}
        >
          {status}
        </span>
      </div>
    </motion.div>
  )
}

/* ── Activity Feed ── */
const activities = [
  { icon: Shield, label: "Blocked suspicious transfer to MerchantX", time: "2m ago", color: "var(--engine-protect)" },
  { icon: TrendingUp, label: "Savings goal projection updated", time: "15m ago", color: "var(--engine-grow)" },
  { icon: Zap, label: "Auto-paid electricity bill", time: "1h ago", color: "var(--engine-execute)" },
  { icon: Scale, label: "Compliance check passed (96/100)", time: "2h ago", color: "var(--engine-govern)" },
  { icon: AlertTriangle, label: "New alert: unusual pattern detected", time: "3h ago", color: "var(--state-warning)" },
]

function ActivityFeed() {
  return (
    <motion.div variants={fadeUp} className="glass-surface rounded-2xl p-4 md:p-6 flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>
        Recent Activity
      </h2>
      <div className="flex flex-col gap-0">
        {activities.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-3"
            style={{ borderBottom: i < activities.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
          >
            <div
              className="flex items-center justify-center rounded-lg w-7 h-7 shrink-0 mt-0.5"
              style={{ background: `${item.color}15` }}
            >
              <item.icon size={14} style={{ color: item.color }} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium" style={{ color: "#F1F5F9" }}>{item.label}</span>
              <span className="text-[10px]" style={{ color: "#64748B" }}>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Decision Rail ── */
const decisions = [
  { label: "Approve rebalance", engine: "Execute", status: "pending", confidence: 0.91 },
  { label: "Block vendor charge", engine: "Protect", status: "pending", confidence: 0.94 },
  { label: "Update savings goal", engine: "Grow", status: "approved", confidence: 0.89 },
  { label: "Archive old invoices", engine: "Execute", status: "pending", confidence: 0.78 },
  { label: "Policy update", engine: "Govern", status: "approved", confidence: 1.0 },
]

const engineColorMap: Record<string, string> = {
  Execute: "var(--engine-execute)",
  Protect: "var(--engine-protect)",
  Grow: "var(--engine-grow)",
  Govern: "var(--engine-govern)",
}

function DecisionRail() {
  return (
    <motion.div variants={fadeUp} className="glass-surface rounded-2xl p-4 md:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>
          Decision Queue
        </h2>
        <span className="text-[10px] font-mono" style={{ color: "#64748B" }}>
          {PENDING_ACTIONS} pending
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {decisions.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.02]"
            style={{ borderLeft: `2px solid ${engineColorMap[d.engine]}` }}
          >
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium block" style={{ color: "#F1F5F9" }}>{d.label}</span>
              <span className="text-[10px]" style={{ color: "#64748B" }}>{d.engine}</span>
            </div>
            <span
              className="text-[10px] font-mono tabular-nums"
              style={{ color: d.confidence >= 0.9 ? "var(--state-healthy)" : "var(--state-warning)" }}
            >
              {d.confidence.toFixed(2)}
            </span>
            {d.status === "pending" ? (
              <Clock size={12} style={{ color: "var(--state-warning)" }} />
            ) : (
              <CheckCircle2 size={12} style={{ color: "var(--state-healthy)" }} />
            )}
          </div>
        ))}
      </div>
      <Link
        href="/execute"
        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, var(--engine-dashboard), #0891B2)",
          color: "#0B1221",
          minHeight: "44px",
        }}
      >
        Review plan
        <ArrowUpRight size={16} />
      </Link>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const [alertCount, setAlertCount] = useState(2)
  const [alertSpark, setAlertSpark] = useState([8, 7, 5, 6, 4, 3, 3, 2])

  useEffect(() => {
    const id = setInterval(() => {
      setAlertCount((prev) => Math.max(0, Math.min(8, prev + (Math.random() > 0.45 ? -1 : 1))))
      setAlertSpark((prev) => {
        const last = prev[prev.length - 1]
        const next = Math.max(0, last + Math.round((Math.random() - 0.5) * 2))
        return [...prev.slice(1), next]
      })
    }, 12000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="command-center relative overflow-hidden">
      <AuroraPulse color="#00F0FF" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: "var(--engine-dashboard)", color: "#0B1221" }}>
        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="command-center__main"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ── Hero Section ── */}
        <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="hero-section" aria-label="Dashboard overview">
          <motion.div variants={fadeUp} className="hero-kicker">
            <span className="hero-kicker__icon"><LayoutDashboard size={14} /></span>
            <span>Dashboard</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-headline">
            {"Good morning. System confidence: "}
            <span className="hero-headline__accent">{SYSTEM_CONFIDENCE}</span>
            {" across 4 engines."}
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-subline">
            One unresolved alert. Three actions queued. Cash buffer at 14 days.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-proof" role="status" aria-label="Engine confidence scores">
            <span className="hero-proof__label">{"System confidence 0.92"}</span>
            <span className="hero-proof__sep" aria-hidden="true">|</span>
            <span style={{ color: "var(--engine-protect)" }}>Protect 0.94</span>
            <span className="hero-proof__sep" aria-hidden="true">|</span>
            <span style={{ color: "var(--engine-grow)" }}>Grow 0.89</span>
            <span className="hero-proof__sep" aria-hidden="true">|</span>
            <span style={{ color: "var(--engine-execute)" }}>Execute 0.91</span>
            <span className="hero-proof__sep" aria-hidden="true">|</span>
            <span style={{ color: "var(--engine-govern)" }}>Govern 0.97</span>
          </motion.div>
        </motion.section>

        {/* ── KPI Grid ── */}
        <motion.section className="kpi-grid" variants={staggerContainer} initial="hidden" animate="visible" aria-label="Key performance indicators">
          <StatCard label="Net position" value="$847k" delta="+8.2%" deltaPositive sparkData={[30, 35, 28, 40, 38, 50, 55, 60]} sparkColor="#14B8A6" />
          <StatCard label="Cash flow" value="+$4.1k" delta="+12%" deltaPositive sparkData={[10, 20, 15, 30, 25, 35, 40, 42]} sparkColor="#00F0FF" />
          <StatCard label="Risk" value="Low" delta="Down from Med" deltaPositive sparkData={[60, 55, 50, 45, 35, 30, 25, 20]} sparkColor="#3B82F6" />
          <StatCard label="Alerts" value={String(alertCount)} delta={alertCount <= 2 ? "-3 resolved" : `+${alertCount - 2} new`} deltaPositive={alertCount <= 2} sparkData={alertSpark} sparkColor="#F59E0B" />
        </motion.section>

        {/* ── Engine Health Strip ── */}
        <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-6 lg:px-8" aria-label="Engine health">
          <EngineHealthCard name="Protect" icon={Shield} score="0.94" status="Active" color="var(--engine-protect)" />
          <EngineHealthCard name="Grow" icon={TrendingUp} score="0.89" status="Active" color="var(--engine-grow)" />
          <EngineHealthCard name="Execute" icon={Zap} score="0.91" status="Active" color="var(--engine-execute)" />
          <EngineHealthCard name="Govern" icon={Scale} score="0.97" status="Active" color="var(--engine-govern)" />
        </motion.section>

        {/* ── Activity Feed + Decision Rail ── */}
        <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-6 lg:px-8">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <ActivityFeed />
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <DecisionRail />
          </div>
        </div>

        {/* ── GovernFooter ── */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter auditId="GV-2026-0216-DASH" pageContext="financial overview" />
        </div>
      </motion.main>
    </div>
  )
}
