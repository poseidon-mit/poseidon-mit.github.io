import { useMemo, memo } from "react"
import { motion, type Variants } from "framer-motion"
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
  Activity
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { DEMO_THREAD } from '@/lib/demo-thread'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { GovernFooter } from '@/components/poseidon'
import {
  getMotionPreset,
} from '@/lib/motion-presets'
import { Surface, ButtonLink } from '@/design-system'
import { ENGINE_COLOR_MAP, ENGINE_BADGE_CLASS } from '@/lib/engine-color-map'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/* ── Cross-thread values ── */
const SYSTEM_CONFIDENCE = DEMO_THREAD.systemConfidence
const PENDING_ACTIONS = DEMO_THREAD.pendingActions
const COMPLIANCE_SCORE = DEMO_THREAD.complianceScore

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
      <Surface interactive className="relative h-full overflow-hidden rounded-[32px] p-6 border border-white/[0.08] backdrop-blur-3xl bg-black/60 group shadow-2xl">
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
            <div className="text-4xl font-display font-light tracking-tight text-white mb-3">{value}</div>
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
      </Surface>
    </motion.div>
  )
})

/* ── Activity Feed ── */
const activities = [
  { icon: Shield, label: `Blocked suspicious transfer to ${DEMO_THREAD.criticalAlert.merchant}`, time: "2m ago", color: "var(--engine-protect)" },
  { icon: TrendingUp, label: "Savings goal projection updated", time: "15m ago", color: "var(--engine-grow)" },
  { icon: Zap, label: "Auto-paid electricity bill", time: "1h ago", color: "var(--engine-execute)" },
  { icon: Scale, label: `Compliance check passed (${COMPLIANCE_SCORE}/100)`, time: "2h ago", color: "var(--engine-govern)" },
  { icon: AlertTriangle, label: "New alert: unusual pattern detected", time: "3h ago", color: "var(--state-warning)" },
]

function ActivityFeed({ itemVariants }: { itemVariants: Variants }) {
  return (
    <Surface className="rounded-[32px] p-8 lg:p-10 flex flex-col gap-6 backdrop-blur-3xl border-white/[0.08] bg-black/50 h-full shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="flex justify-between items-center relative z-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">Recent Activity</h2>
      </div>
      <div className="flex flex-col flex-1 justify-between gap-2 relative z-10">
        {activities.map((item, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex items-center gap-5 py-3 group cursor-pointer"
          >
            <div
              className="flex items-center justify-center rounded-2xl w-12 h-12 shrink-0 border border-white/[0.05] transition-all duration-500 group-hover:scale-110 group-hover:border-white/[0.1]"
              style={{ background: `${item.color}10`, boxShadow: `inset 0 0 20px ${item.color}05` }}
            >
              <item.icon size={18} style={{ color: item.color }} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
            </div>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-base font-medium text-white/80 group-hover:text-white transition-colors tracking-wide">{item.label}</span>
              <span className="text-xs font-mono text-white/30 tracking-wider">{item.time}</span>
            </div>
            <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/80 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
          </motion.div>
        ))}
      </div>
    </Surface>
  )
}

/* ── Decision Rail ── */
const decisions = [
  { label: "Approve rebalance", engine: "Execute" as const, status: "pending", confidence: 0.91 },
  { label: "Block vendor charge", engine: "Protect" as const, status: "pending", confidence: 0.94 },
  { label: "Update savings goal", engine: "Grow" as const, status: "approved", confidence: 0.89 },
  { label: "Archive old invoices", engine: "Execute" as const, status: "pending", confidence: 0.78 },
  { label: "Policy update", engine: "Govern" as const, status: "approved", confidence: 0.97 },
]

function DecisionRail({ itemVariants }: { itemVariants: Variants }) {
  return (
    <Surface className="rounded-[32px] p-8 lg:p-10 flex flex-col gap-6 backdrop-blur-3xl border-white/[0.08] bg-black/50 h-full shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
          Decision Queue
        </h2>
        <span className="text-xs font-mono font-medium text-cyan-300 bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          {PENDING_ACTIONS} pending
        </span>
      </div>
      <div className="flex flex-col gap-3 flex-1 relative z-10">
        {decisions.map((d, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.1] group cursor-pointer"
          >
            <div className="w-1.5 h-10 rounded-full shadow-[0_0_10px_currentColor] opacity-50 group-hover:opacity-100 transition-opacity" style={{ background: ENGINE_COLOR_MAP[d.engine], color: ENGINE_COLOR_MAP[d.engine] }} />
            <div className="flex-1 min-w-0">
              <span className="text-base font-medium block text-white/80 group-hover:text-white tracking-wide">{d.label}</span>
              <span className="text-xs text-white/40 mt-1 flex items-center gap-2 tracking-wider uppercase font-mono">
                <div className={`w-2 h-2 rounded-full ${d.confidence >= 0.9 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]'}`} />
                {d.confidence >= 0.9 ? 'High Conf' : 'Review'}
              </span>
            </div>
            {d.status === "pending" ? (
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 group-hover:bg-amber-400/20 transition-colors">
                <Clock size={16} />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 group-hover:bg-emerald-400/20 transition-colors">
                <CheckCircle2 size={16} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <ButtonLink
        to="/execute/approval"
        variant="glass"
        engine="dashboard"
        className="mt-6 w-full rounded-2xl py-4 border-white/[0.1] hover:bg-white/[0.08] text-base tracking-wide relative z-10 shadow-lg"
      >
        Review Queue
        <ArrowUpRight size={18} className="ml-2" />
      </ButtonLink>
    </Surface>
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

  const alertCount = 1
  const alertSpark = [6, 5, 4, 4, 3, 2, 2, 1]

  return (
    <div className="command-center relative min-h-screen overflow-hidden bg-[var(--bg-oled)] selection:bg-cyan-500/30">

      {/* Background Noise & Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold bg-white text-black">
        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="relative z-10 py-10 px-6 max-w-[1920px] mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Hero Section ── */}
        <motion.section variants={itemVariants} className="mb-12" aria-label="Dashboard overview">
          <div className="flex items-center gap-2 mb-6 text-cyan-400/80 uppercase tracking-widest text-xs font-semibold">
            <LayoutDashboard size={14} className="animate-pulse" />
            <span>Command Center</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tighter text-white mb-4">
                System Confidence
              </h1>
              <div className="flex items-center gap-4">
                <div className="text-5xl lg:text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  {SYSTEM_CONFIDENCE.toFixed(2)}
                </div>
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  Optimal
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8 text-sm font-medium bg-black/40 border border-white/[0.08] rounded-full px-8 py-4 backdrop-blur-3xl shadow-2xl">
              <span className="flex items-center gap-2.5 text-white/50 tracking-wider uppercase text-xs"><Shield size={16} className="text-[var(--engine-protect)] drop-shadow-[0_0_8px_currentColor]" /> Protect <span className="text-white font-mono">0.94</span></span>
              <span className="w-px h-6 bg-white/10" />
              <span className="flex items-center gap-2.5 text-white/50 tracking-wider uppercase text-xs"><TrendingUp size={16} className="text-[var(--engine-grow)] drop-shadow-[0_0_8px_currentColor]" /> Grow <span className="text-white font-mono">0.89</span></span>
              <span className="w-px h-6 bg-white/10" />
              <span className="flex items-center gap-2.5 text-white/50 tracking-wider uppercase text-xs"><Zap size={16} className="text-[var(--engine-execute)] drop-shadow-[0_0_8px_currentColor]" /> Execute <span className="text-white font-mono">0.91</span></span>
              <span className="w-px h-6 bg-white/10" />
              <span className="flex items-center gap-2.5 text-white/50 tracking-wider uppercase text-xs"><Scale size={16} className="text-[var(--engine-govern)] drop-shadow-[0_0_8px_currentColor]" /> Govern <span className="text-white font-mono">0.97</span></span>
            </div>
          </div>
        </motion.section>

        {/* ── KPI Grid ── */}
        <motion.section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" variants={itemVariants} aria-label="Key performance indicators">
          <StatCard label="Net position" value="$847.2k" delta="+8.2%" deltaPositive sparkData={[30, 35, 28, 40, 38, 50, 55, 60]} sparkColor="var(--engine-dashboard)" icon={Activity} />
          <StatCard label="Cash flow" value="+$4.1k" delta="+12%" deltaPositive sparkData={[10, 20, 15, 30, 25, 35, 40, 42]} sparkColor="var(--engine-grow)" icon={TrendingUp} />
          <StatCard label="Risk Exposure" value="Low" delta="Down from Med" deltaPositive sparkData={[60, 55, 50, 45, 35, 30, 25, 20]} sparkColor="var(--engine-protect)" icon={ShieldCheck} />
          <StatCard label="Active Alerts" value={String(alertCount)} delta={alertCount <= 2 ? "-3 resolved" : `+${alertCount - 2} new`} deltaPositive={alertCount <= 2} sparkData={alertSpark} sparkColor="var(--state-warning)" icon={AlertTriangle} />
        </motion.section>

        {/* ── Activity Feed + Decision Rail ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8">
            <ActivityFeed itemVariants={itemVariants} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-8">
            <DecisionRail itemVariants={itemVariants} />
          </div>
        </motion.div>

        {/* ── GovernFooter ── */}
        <div className="pt-8 border-t border-white/[0.04]">
          <GovernFooter
            auditId={GOVERNANCE_META['/dashboard'].auditId}
            pageContext={GOVERNANCE_META['/dashboard'].pageContext}
          />
        </div>
      </motion.main>
    </div>
  )
}
