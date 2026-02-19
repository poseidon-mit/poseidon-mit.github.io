import { useMemo, memo } from "react"
import { motion } from "framer-motion"
import { Link } from '@/router'
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
  type LucideIcon,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { DEMO_THREAD } from '@/lib/demo-thread'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { AuroraPulse, GovernFooter } from '@/components/poseidon'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'


/* ── Cross-thread values (frozen from CROSS_SCREEN_DATA_THREAD) ── */
const SYSTEM_CONFIDENCE = DEMO_THREAD.systemConfidence
const PENDING_ACTIONS = DEMO_THREAD.pendingActions
const COMPLIANCE_SCORE = DEMO_THREAD.complianceScore

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
  icon: LucideIcon
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
  { icon: Shield, label: `Blocked suspicious transfer to ${DEMO_THREAD.criticalAlert.merchant}`, time: "2m ago", color: "var(--engine-protect)" },
  { icon: TrendingUp, label: "Savings goal projection updated", time: "15m ago", color: "var(--engine-grow)" },
  { icon: Zap, label: "Auto-paid electricity bill", time: "1h ago", color: "var(--engine-execute)" },
  { icon: Scale, label: `Compliance check passed (${COMPLIANCE_SCORE}/100)`, time: "2h ago", color: "var(--engine-govern)" },
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
  { label: "Policy update", engine: "Govern", status: "approved", confidence: 0.97 },
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
        to="/execute"
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
  const alertCount = 1
  const alertSpark = [6, 5, 4, 4, 3, 2, 2, 1]

  return (
    <div className="command-center relative overflow-hidden">
      <AuroraPulse engine="dashboard" />
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
            {"Welcome back. System confidence: "}
            <span className="hero-headline__accent">{SYSTEM_CONFIDENCE}</span>
            {" across 4 engines + command center."}
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-subline">
            One unresolved alert. Five actions queued. Cash buffer at 14 days.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-proof" role="status" aria-label="Engine confidence scores">
            <span className="hero-proof__label">{`System confidence ${SYSTEM_CONFIDENCE.toFixed(2)}`}</span>
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
          <StatCard label="Cash flow" value="+$4.1k" delta="+12%" deltaPositive sparkData={[10, 20, 15, 30, 25, 35, 40, 42]} sparkColor="var(--engine-dashboard)" />
          <StatCard label="Risk" value="Low" delta="Down from Med" deltaPositive sparkData={[60, 55, 50, 45, 35, 30, 25, 20]} sparkColor="var(--engine-govern)" />
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
          <GovernFooter
            auditId={GOVERNANCE_META['/dashboard'].auditId}
            pageContext={GOVERNANCE_META['/dashboard'].pageContext}
          />
        </div>
      </motion.main>
    </div>
  )
}
