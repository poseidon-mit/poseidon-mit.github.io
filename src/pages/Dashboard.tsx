import { useMemo, memo } from "react"
import { useRouter } from "@/router"
import { motion, type Variants } from "framer-motion"
import {
  Shield,
  TrendingUp,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Scale,
  type LucideIcon,
  Activity
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { DEMO_DATA } from '@/lib/constants/mock-data'
import {
  getMotionPreset,
} from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PendingActionsBanner } from '@/components/dashboard/PendingActionsBanner'

/* ── Cross-thread values (Single Source of Truth) ── */
const COMPLIANCE_SCORE = DEMO_DATA.COMPLIANCE_SCORE

/* ── KPI Stat Card (Premium Apple WWDC Style) ── */
const StatCard = memo(function StatCard({
  label,
  value,
  delta,
  deltaPositive,
  sparkData,
  sparkColor,
  icon: Icon
}: {
  label: string
  value: string
  delta: string
  deltaPositive: boolean
  sparkData: number[]
  sparkColor: string
  icon: LucideIcon
}) {
  const data = useMemo(() => sparkData.map((v, i) => ({ i, v })), [sparkData])

  return (
    <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <div className="relative h-full overflow-hidden rounded-[32px] p-6 border border-white/[0.08] backdrop-blur-3xl bg-black/60 group shadow-2xl transition-all hover:bg-black/40">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 100%, ${sparkColor}, transparent)` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.1] shadow-inner" style={{ color: sparkColor, boxShadow: `inset 0 0 20px ${sparkColor}20` }}>
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <span className="text-white/50 font-medium text-sm tracking-wide uppercase">{label}</span>
          </div>
        </div>

        <div className="flex items-end justify-between relative z-10">
          <div>
            <div className="text-4xl font-display font-light tracking-tight tabular-nums text-white mb-3">{value}</div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${deltaPositive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                {delta}
              </span>
              <span className="text-white/30 text-xs tracking-wide">vs last period</span>
            </div>
          </div>

          <div className="w-28 h-14" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`spark-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparkColor} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                  </linearGradient>
                  <filter id={`glow-${label}`}>
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={sparkColor}
                  strokeWidth={2.5}
                  fill={`url(#spark-${label.replace(/\s/g, "")})`}
                  isAnimationActive={false}
                  filter={`url(#glow-${label})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

/* ── Activity Feed ── */
const activities = [
  { icon: Shield, label: `Blocked suspicious transfer to ${DEMO_DATA.EXECUTE_VENDOR}`, time: "2m ago", color: "var(--engine-protect)" },
  { icon: TrendingUp, label: "Savings goal projection updated", time: "15m ago", color: "var(--engine-grow)" },
  { icon: Zap, label: "Auto-paid electricity bill", time: "1h ago", color: "var(--engine-execute)" },
  { icon: Scale, label: `Compliance check passed (${COMPLIANCE_SCORE}/100)`, time: "2h ago", color: "var(--engine-govern)" },
  { icon: AlertTriangle, label: "New alert: unusual pattern detected", time: "3h ago", color: "var(--state-warning)" },
]

function ActivityFeed({ itemVariants }: { itemVariants: Variants }) {
  return (
    <div className="rounded-[32px] p-8 lg:p-10 flex flex-col gap-6 backdrop-blur-3xl border border-white/[0.08] bg-black/50 h-full shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="flex justify-between items-center relative z-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">Recent Activity</h2>
      </div>
      <div className="flex flex-col flex-1 justify-between gap-2 relative z-10">
        {activities.map((item, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex items-center gap-5 py-3 group"
          >
            <div
              className="flex items-center justify-center rounded-2xl w-12 h-12 shrink-0 border border-white/[0.05] transition-all duration-500 group-hover:scale-110 group-hover:border-white/[0.1]"
              style={{ background: `${item.color}10`, boxShadow: `inset 0 0 20px ${item.color}05` }}
            >
              <item.icon size={18} style={{ color: item.color }} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
            </div>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-base font-medium text-white/80 tracking-wide">{item.label}</span>
              <span className="text-xs font-mono text-white/30 tracking-wider">{item.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Pending decisions count (used by PendingActionsBanner) ── */
const decisions = [
  { status: "pending" },
  { status: "pending" },
  { status: "approved" },
  { status: "pending" },
  { status: "approved" },
]

/* ═══════════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const motionPreset = getMotionPreset(prefersReducedMotion)
  const containerVariants = motionPreset.creatorStudioStaggerContainer
  const itemVariants = motionPreset.creatorStudioStaggerItem
  const { navigate } = useRouter()

  const alertCount = 1
  const alertSpark = [6, 5, 4, 4, 3, 2, 2, 1]

  return (
    <div className="selection:bg-cyan-500/30">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold bg-white text-black">
        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Hero Section ── */}
        <motion.section variants={itemVariants} className="mb-12" aria-label="Dashboard overview">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  System Status: Optimal
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Pending Actions Banner ── */}
        <PendingActionsBanner
          pendingCount={decisions.filter(d => d.status === 'pending').length}
          navigate={navigate}
          variants={itemVariants}
        />

        {/* ── KPI Grid ── */}
        <motion.section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" variants={itemVariants} aria-label="Key performance indicators">
          <StatCard label="Net position" value="$847.2k" delta="+8.2%" deltaPositive sparkData={[30, 35, 28, 40, 38, 50, 55, 60]} sparkColor="var(--engine-dashboard)" icon={Activity} />
          <StatCard label="Cash flow" value="+$4.1k" delta="+12%" deltaPositive sparkData={[10, 20, 15, 30, 25, 35, 40, 42]} sparkColor="var(--engine-grow)" icon={TrendingUp} />
          <StatCard label="Risk Exposure" value="Low" delta="Down from Med" deltaPositive sparkData={[60, 55, 50, 45, 35, 30, 25, 20]} sparkColor="var(--engine-protect)" icon={ShieldCheck} />
          <StatCard label="Active Alerts" value={String(alertCount)} delta={alertCount <= 2 ? "-3 resolved" : `+${alertCount - 2} new`} deltaPositive={alertCount <= 2} sparkData={alertSpark} sparkColor="var(--state-warning)" icon={AlertTriangle} />
        </motion.section>

        {/* ── Activity Feed ── */}
        <motion.div variants={itemVariants} className="mb-16">
          <ActivityFeed itemVariants={itemVariants} />
        </motion.div>

      </motion.main>
    </div>
  )
}
