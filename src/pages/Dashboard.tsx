import { useMemo } from 'react'
import { Link } from '@/router'
import { motion, type Variants } from 'framer-motion'
import {
  Shield,
  TrendingUp,
  Zap,
  Scale,
  AlertTriangle,
  Activity,
  ChevronRight,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react'
import { getMotionPreset, hoverLift } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { useDemoState } from '@/lib/demo-state/provider'
import { getPendingExecuteCount } from '@/lib/demo-state/selectors'
import {
  selectDashboardView,
  selectExecuteActionsView,
  formatUsd,
} from '@/domain/poseidon-universe'
import type { ExecuteActionEntity } from '@/domain/poseidon-universe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import {
  THREATS,
  severityConfig,
  toDisplaySeverity,
  type ThreatRow,
} from '@/pages/protect/protect-data'
import { useDismissedAlerts } from '@/pages/protect/useDismissedAlerts'
import { RECOMMENDATIONS_SUMMARY } from '@/pages/grow/recommendation-detail-data'
import { ENGINE_COLOR_MAP, type EngineLabel } from '@/lib/engine-color-map'
import { EngineBadge, KpiCard, SeverityBadge, EmptyState } from '@/components/poseidon'

/* ── Activity Feed tone map ── */

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

/* ── Protect Summary Panel ── */

function ProtectPanel({
  threats,
  totalActive,
  itemVariants,
}: {
  threats: ThreatRow[]
  totalActive: number
  itemVariants: Variants
}) {
  return (
    <motion.section variants={itemVariants}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <EngineBadge engine="protect" icon={Shield} label="Protect" />
          <span className="text-xs text-white/40">{totalActive} active</span>
        </div>
        <Link
          to="/protect"
          className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
        >
          View all <ChevronRight size={12} />
        </Link>
      </div>

      <div className="glass-card rounded-[24px] p-5 md:p-8 flex flex-col gap-2">
        {threats.map((threat) => (
          <Link
            key={threat.id}
            to={`/protect/alert-detail?alertId=${threat.id}`}
            className="group"
          >
            <motion.div
              whileHover={{ x: 4 }}
              transition={hoverLift}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <SeverityBadge severity={toDisplaySeverity(threat.severity)} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/80 font-medium truncate">
                  {threat.merchant}
                </div>
                <div className="text-xs text-white/40 truncate">
                  {threat.description}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-mono tabular-nums text-white/90">
                  {threat.amount}
                </div>
                <div className="text-xs text-white/30">{threat.time}</div>
              </div>
              <ChevronRight
                size={14}
                className="text-white/20 group-hover:text-white/50 transition-colors shrink-0"
              />
            </motion.div>
          </Link>
        ))}
      </div>

    </motion.section>
  )
}

/* ── Grow Summary Panel ── */

function GrowPanel({
  recommendations,
  totalSavings,
  itemVariants,
}: {
  recommendations: Array<{
    rank: number
    title: string
    monthly: number
    confidence: number
  }>
  totalSavings: number
  itemVariants: Variants
}) {
  return (
    <motion.section variants={itemVariants}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <EngineBadge engine="grow" icon={TrendingUp} label="Grow" />
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full border border-white/10"
            style={{ color: 'var(--engine-grow)' }}
          >
            +{formatUsd(totalSavings)}/mo
          </span>
        </div>
        <Link
          to="/grow/recommendations"
          className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
        >
          See all <ChevronRight size={12} />
        </Link>
      </div>

      <div className="glass-card rounded-[24px] p-5 md:p-8 flex flex-col gap-2">
        {recommendations.map((rec) => (
          <Link
            key={rec.rank}
            to={`/grow/recommendation?id=${rec.rank}`}
            className="group"
          >
            <motion.div
              whileHover={{ x: 4 }}
              transition={hoverLift}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  color: 'var(--engine-grow)',
                  background: 'rgba(139,92,246,0.12)',
                }}
              >
                {rec.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/80 font-medium truncate">
                  {rec.title}
                </div>
                <div className="text-xs text-white/40">
                  {Math.round(rec.confidence * 100)}% confidence
                </div>
              </div>
              <div className="text-right shrink-0">
                <span
                  className="text-sm font-mono tabular-nums"
                  style={{ color: 'var(--engine-grow)' }}
                >
                  {formatUsd(rec.monthly)}/mo
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-white/20 group-hover:text-white/50 transition-colors shrink-0"
              />
            </motion.div>
          </Link>
        ))}
      </div>

    </motion.section>
  )
}

/* ── Execute Summary Panel ── */

function ExecutePanel({
  actions,
  pendingCount,
  itemVariants,
}: {
  actions: ExecuteActionEntity[]
  pendingCount: number
  itemVariants: Variants
}) {
  return (
    <motion.section variants={itemVariants} className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <EngineBadge engine="execute" icon={Zap} label="Execute" />
          {pendingCount > 0 && (
            <span className="text-xs text-white/40">
              {pendingCount} awaiting approval
            </span>
          )}
        </div>
        <Link
          to="/execute"
          className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
        >
          Review queue <ChevronRight size={12} />
        </Link>
      </div>

      {actions.length === 0 ? (
        <div className="glass-card rounded-[24px] p-8">
          <EmptyState
            icon={CheckCircle}
            title="All clear"
            description="No actions need your approval right now."
            accentColor="var(--engine-protect)"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link
              key={action.id}
              to={`/execute/approval?actionId=${action.id}`}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={hoverLift}
                className="glass-card rounded-2xl p-5 cursor-pointer group h-full flex flex-col gap-3 border-l-2 transition-colors"
                style={{
                  borderLeftColor:
                    ENGINE_COLOR_MAP[action.engine as EngineLabel] ??
                    'var(--engine-execute)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      color:
                        ENGINE_COLOR_MAP[action.engine as EngineLabel] ??
                        'var(--engine-execute)',
                    }}
                  >
                    {action.engine}
                  </span>
                  {action.urgency === 'high' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
                      Urgent
                    </span>
                  )}
                </div>

                <div className="text-sm text-white/80 font-medium">
                  {action.title}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-mono tabular-nums text-white/60">
                    {action.amountLabel}
                  </span>
                  <span className="text-xs text-white/40">
                    {Math.round(action.confidence * 100)}%
                  </span>
                </div>

                {action.expiresIn && (
                  <div className="text-[10px] text-white/30">
                    Expires in {action.expiresIn}
                  </div>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.section>
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
  const { state } = useDemoState()
  usePageTitle('Dashboard')

  /* ── Data ── */
  const pendingCount = getPendingExecuteCount(state)
  const dashboardView = selectDashboardView(pendingCount)
  const { dismissed } = useDismissedAlerts()

  const activeThreats = useMemo(
    () => THREATS.filter((t) => !dismissed.has(t.id)),
    [dismissed],
  )
  const topThreats = useMemo(
    () =>
      [...activeThreats]
        .sort(
          (a, b) =>
            severityConfig[b.severity].order -
            severityConfig[a.severity].order,
        )
        .slice(0, 3),
    [activeThreats],
  )

  const topRecs = useMemo(() => RECOMMENDATIONS_SUMMARY.slice(0, 3), [])
  const totalMonthlySavings = useMemo(
    () => RECOMMENDATIONS_SUMMARY.reduce((sum, r) => sum + r.monthly, 0),
    [],
  )

  const allActions = useMemo(() => selectExecuteActionsView(), [])
  const pendingActions = useMemo(
    () =>
      allActions
        .filter(
          (a) =>
            (state.execute.actionStates[a.id]?.status ?? 'pending') ===
            'pending',
        )
        .slice(0, 3),
    [allActions, state.execute.actionStates],
  )

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
        {/* ── Hero ── */}
        <motion.section variants={itemVariants} className="mb-8">
          <div className="flex flex-col gap-4">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your finances, intelligently coordinated.
            </h1>
            <p className="text-sm text-white/40 tracking-wide">
              {activeThreats.length} flagged · {pendingCount} queued ·{' '}
              {formatUsd(totalMonthlySavings)}/mo found
            </p>
          </div>
        </motion.section>

        {/* ── KPI Strip ── */}
        <motion.section
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          variants={itemVariants}
          aria-label="Key performance indicators"
        >
          <KpiCard
            label="System Confidence"
            value={`${Math.round(dashboardView.systemConfidence * 100)}%`}
            color="var(--engine-dashboard)"
          />
          <KpiCard
            label="Monthly Savings"
            value={`${formatUsd(dashboardView.monthlySavingsCurrentUsd)}/mo`}
            color="var(--engine-grow)"
          />
          <KpiCard
            label="Pending Actions"
            value={String(pendingCount)}
            color="var(--engine-execute)"
          />
          <KpiCard
            label="Compliance"
            value={`${dashboardView.complianceScore}/100`}
            color="var(--engine-govern)"
          />
        </motion.section>

        {/* ── Protect + Grow (side-by-side on desktop) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <ProtectPanel
            threats={topThreats}
            totalActive={activeThreats.length}
            itemVariants={itemVariants}
          />
          <GrowPanel
            recommendations={topRecs}
            totalSavings={totalMonthlySavings}
            itemVariants={itemVariants}
          />
        </div>

        {/* ── Execute ── */}
        <ExecutePanel
          actions={pendingActions}
          pendingCount={pendingCount}
          itemVariants={itemVariants}
        />

        {/* ── Activity Feed ── */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="glass-card rounded-[24px] p-5 md:p-8 flex flex-col gap-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Recent Activity
            </h2>
            <div className="flex flex-col gap-2">
              {dashboardView.activities.map((item) => {
                const tone = activityToneMap[item.kind]
                const Icon = tone.icon
                return (
                  <div key={item.id} className="flex items-center gap-4 py-3">
                    <div
                      className="flex items-center justify-center rounded-xl w-10 h-10 shrink-0"
                      style={{ background: `${tone.color}10` }}
                    >
                      <Icon size={16} style={{ color: tone.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white/70">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-white/30 shrink-0">
                      {item.relativeTime}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  )
}
