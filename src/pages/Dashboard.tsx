import { useMemo, memo } from "react"
import { motion } from "framer-motion"
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
import { GovernFooter } from '@/components/poseidon'
import {
  creatorStudioStaggerContainer,
  creatorStudioStaggerItem,
} from '@/lib/motion-presets'
import { Surface, ButtonLink } from '@/design-system'


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
    <Surface interactive className="stat-card" variant="elevated">
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
    </Surface>
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
    <Surface
      interactive
      className="rounded-2xl p-4 flex flex-col gap-3"
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
    </Surface>
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
    <Surface className="rounded-2xl p-4 md:p-6 flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>
        Recent Activity
      </h2>
      <div className="flex flex-col gap-0">
        {activities.map((item, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
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
          </motion.div>
        ))}
      </div>
    </Surface>
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
    <Surface className="rounded-2xl p-4 md:p-6 flex flex-col gap-4">
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
          <motion.div
            key={i}
            variants={itemVariants}
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
          </motion.div>
        ))}
      </div>
      <ButtonLink
        to="/execute"
        variant="glass"
        engine="dashboard"
        className="mt-2 w-full rounded-full"
      >
        Review plan
        <ArrowUpRight size={16} />
      </ButtonLink>
    </Surface>
  )
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════════ */

export const itemVariants = creatorStudioStaggerItem

export default function DashboardPage() {
  const alertCount = 1
  const alertSpark = [6, 5, 4, 4, 3, 2, 2, 1]

  return (
    <div className="command-center relative overflow-hidden bg-[var(--bg-oled)]">
      {/* Remove previous AuroraPulse since the Apple theme relies on deep Vantablack/hardware feel */}

      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold bg-white text-black">
        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="command-center__main py-8 max-w-7xl mx-auto"
        variants={creatorStudioStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ── Hero Section ── */}
        <motion.section variants={itemVariants} className="hero-section mb-10 px-4 md:px-6 lg:px-8" aria-label="Dashboard overview">
          <div className="hero-kicker text-white/50 text-sm font-semibold tracking-wide uppercase mb-2">
            <span className="hero-kicker__icon"><LayoutDashboard size={14} className="inline mr-2" /></span>
            <span>Dashboard</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white m-0 mb-4 drop-shadow-md">
            {"Welcome back. System confidence: "}
            <span className="text-teal-400">{SYSTEM_CONFIDENCE}</span>
            {" across 4 engines + command center."}
          </h1>

          <p className="text-xl text-white/70 tracking-wide font-light max-w-3xl mb-6">
            One unresolved alert. Five actions queued. Cash buffer at 14 days.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium" role="status" aria-label="Engine confidence scores">
            <span className="text-white/60">{`Overall ${SYSTEM_CONFIDENCE.toFixed(2)}`}</span>
            <span className="text-white/30" aria-hidden="true">|</span>
            <span className="text-green-400">Protect 0.94</span>
            <span className="text-white/30" aria-hidden="true">|</span>
            <span className="text-blue-400">Grow 0.89</span>
            <span className="text-white/30" aria-hidden="true">|</span>
            <span className="text-yellow-400">Execute 0.91</span>
            <span className="text-white/30" aria-hidden="true">|</span>
            <span className="text-purple-400">Govern 0.97</span>
          </div>
        </motion.section>

        {/* ── KPI Grid ── */}
        <motion.section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-6 lg:px-8 mb-6" variants={itemVariants} aria-label="Key performance indicators">
          <StatCard label="Net position" value="$847k" delta="+8.2%" deltaPositive sparkData={[30, 35, 28, 40, 38, 50, 55, 60]} sparkColor="#14B8A6" />
          <StatCard label="Cash flow" value="+$4.1k" delta="+12%" deltaPositive sparkData={[10, 20, 15, 30, 25, 35, 40, 42]} sparkColor="#38BDF8" />
          <StatCard label="Risk" value="Low" delta="Down from Med" deltaPositive sparkData={[60, 55, 50, 45, 35, 30, 25, 20]} sparkColor="#A855F7" />
          <StatCard label="Alerts" value={String(alertCount)} delta={alertCount <= 2 ? "-3 resolved" : `+${alertCount - 2} new`} deltaPositive={alertCount <= 2} sparkData={alertSpark} sparkColor="#F59E0B" />
        </motion.section>

        {/* ── Engine Health Strip ── */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-6 lg:px-8 mb-6" aria-label="Engine health">
          <EngineHealthCard name="Protect" icon={Shield} score="0.94" status="Active" color="#4ADE80" />
          <EngineHealthCard name="Grow" icon={TrendingUp} score="0.89" status="Active" color="#60A5FA" />
          <EngineHealthCard name="Execute" icon={Zap} score="0.91" status="Active" color="#FACC15" />
          <EngineHealthCard name="Govern" icon={Scale} score="0.97" status="Active" color="#C084FC" />
        </motion.section>

        {/* ── Activity Feed + Decision Rail ── */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 px-4 md:px-6 lg:px-8">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <ActivityFeed />
          </div>
          <div className="w-full lg:w-80 shrink-0">
            <DecisionRail />
          </div>
        </motion.div>

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
