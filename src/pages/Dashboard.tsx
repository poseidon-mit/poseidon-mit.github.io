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
import {
  getMotionPreset,
  hoverLift,
} from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PendingActionsBanner } from '@/components/dashboard/PendingActionsBanner'
import { usePageTitle } from '@/hooks/use-page-title'
import { useDemoState } from '@/lib/demo-state/provider'
import { getPendingExecuteCount } from '@/lib/demo-state/selectors'
import { selectDashboardView, formatUsd } from '@/domain/poseidon-universe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

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
    <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={hoverLift}>
      <div className="glass-card glass-card-overlay h-full rounded-[32px] p-6 group transition-all">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 100%, ${sparkColor}, transparent)` }} />

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

const activityToneMap: Record<
  'protect' | 'grow' | 'execute' | 'govern' | 'system',
  { icon: LucideIcon; color: string }
> = {
  protect: { icon: Shield, color: 'var(--engine-protect)' },
  grow: { icon: TrendingUp, color: 'var(--engine-grow)' },
  execute: { icon: Zap, color: 'var(--engine-execute)' },
  govern: { icon: Scale, color: 'var(--engine-govern)' },
  system: { icon: AlertTriangle, color: 'var(--state-warning)' },
}

function ActivityFeed({
  itemVariants,
  activities,
}: {
  itemVariants: Variants
  activities: Array<{ id: string; kind: 'protect' | 'grow' | 'execute' | 'govern' | 'system'; label: string; relativeTime: string }>
}) {
  return (
    <div className="glass-card glass-card-overlay rounded-[32px] p-8 lg:p-10 flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center relative z-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">Recent Activity</h2>
      </div>
      <div className="flex flex-col flex-1 justify-between gap-2 relative z-10">
        {activities.map((item) => {
          const tone = activityToneMap[item.kind]
          const Icon = tone.icon
          return (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="flex items-center gap-5 py-3 group"
          >
            <div
              className="flex items-center justify-center rounded-2xl w-12 h-12 shrink-0 border border-white/[0.05] transition-all duration-500 group-hover:scale-110 group-hover:border-white/[0.1]"
              style={{ background: `${tone.color}10`, boxShadow: `inset 0 0 20px ${tone.color}05` }}
            >
              <Icon size={18} style={{ color: tone.color }} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
            </div>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-base font-medium text-white/80 tracking-wide">{item.label}</span>
              <span className="text-xs font-mono text-white/30 tracking-wider">{item.relativeTime}</span>
            </div>
          </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const motionPreset = getMotionPreset(prefersReducedMotion)
  const containerVariants = motionPreset.creatorStudioStaggerContainer
  const itemVariants = motionPreset.creatorStudioStaggerItem
  const { navigate } = useRouter()
  const { state } = useDemoState()
  usePageTitle('Dashboard')

  const pendingActions = getPendingExecuteCount(state)
  const dashboardView = selectDashboardView(pendingActions)
  const alertCount = 1
  const alertSpark = [6, 5, 4, 4, 3, 2, 2, 1]

  return (
    <div className="selection:bg-cyan-500/30">

      <motion.main
        id="main-content"
        className={PAGE_CONTENT_CLASS}
        style={PAGE_CONTENT_STYLE}
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
          pendingCount={dashboardView.pendingActions}
          navigate={navigate}
          variants={itemVariants}
        />

        {/* ── KPI Grid ── */}
        <motion.section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" variants={itemVariants} aria-label="Key performance indicators">
          <StatCard label="Net position" value="$847.2k" delta="+8.2%" deltaPositive sparkData={[30, 35, 28, 40, 38, 50, 55, 60]} sparkColor="var(--engine-dashboard)" icon={Activity} />
          <StatCard label="Monthly savings" value={`${formatUsd(dashboardView.monthlySavingsCurrentUsd)}/mo`} delta="current baseline" deltaPositive={true} sparkData={[10, 20, 15, 30, 25, 35, 40, 42]} sparkColor="var(--engine-grow)" icon={TrendingUp} />
          <StatCard label="Pending actions" value={String(dashboardView.pendingActions)} delta="approval queue" deltaPositive={false} sparkData={[60, 55, 50, 45, 35, 30, 25, 20]} sparkColor="var(--engine-protect)" icon={ShieldCheck} />
          <StatCard label="Compliance score" value={`${dashboardView.complianceScore}/100`} delta={alertCount <= 2 ? "-3 resolved" : `+${alertCount - 2} new`} deltaPositive={alertCount <= 2} sparkData={alertSpark} sparkColor="var(--state-warning)" icon={AlertTriangle} />
        </motion.section>

        {/* ── Activity Feed ── */}
        <motion.div variants={itemVariants} className="mb-16">
          <ActivityFeed itemVariants={itemVariants} activities={dashboardView.activities} />
        </motion.div>

      </motion.main>
    </div>
  )
}
