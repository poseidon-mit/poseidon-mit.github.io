import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  RotateCcw,
  ArrowUpRight,
  Filter,
  Bot,
  User,
  AlertTriangle,
  Timer,
} from 'lucide-react'
import { useRouter, Link } from '@/router'
import { EmptyState } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { ENGINE_BADGE_CLASS, ENGINE_COLOR_MAP } from '@/lib/engine-color-map'
import { useDemoState } from '@/lib/demo-state/provider'
import type { DemoExecuteDecision } from '@/lib/demo-state/types'
import {
  getCompletedExecuteCount,
  getDeferredExecuteCount,
  getPendingExecuteCount,
} from '@/lib/demo-state/selectors'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import {
  formatUsd,
  selectExecuteActionsView,
  selectExecuteSavingsView,
} from '@/domain/poseidon-universe'
import type { ExecuteActionEntity, ExecutionType, UrgencyLevel } from '@/domain/poseidon-universe'
import { DEMO_THREAD } from '@/lib/demo-thread'

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

type ActionStatus = 'pending' | 'approved' | 'deferred'

const EXECUTION_TYPE_BADGE: Record<ExecutionType, { label: string; cls: string }> = {
  auto: { label: 'Auto', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  'semi-auto': { label: 'Semi-Auto', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  manual: { label: 'Manual', cls: 'bg-slate-400/15 text-slate-300 border-slate-400/20' },
  hybrid: { label: 'Hybrid', cls: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
}

const URGENCY_OPTIONS: UrgencyLevel[] = ['high', 'medium', 'low']
const EXEC_TYPE_OPTIONS: ExecutionType[] = ['auto', 'semi-auto', 'manual', 'hybrid']

type SortKey = 'urgency' | 'confidence' | 'default'
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'default', label: 'Default' },
  { key: 'urgency', label: 'Urgency' },
  { key: 'confidence', label: 'Confidence' },
]
const URGENCY_ORDER: Record<UrgencyLevel, number> = { high: 0, medium: 1, low: 2 }

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function statusFromDecision(value: DemoExecuteDecision): ActionStatus {
  switch (value) {
    case 'approved':
    case 'rejected':
      return 'approved'
    case 'deferred':
      return 'deferred'
    default:
      return 'pending'
  }
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function ExecutePage() {
  usePageTitle('Execute')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  const { state, setExecuteDecision } = useDemoState()
  const { showToast } = useToast()

  // Filter/sort state
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ExecutionType | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortKey>('default')
  const [showFilters, setShowFilters] = useState(false)

  const pendingCount = getPendingExecuteCount(state)
  const completedCount = getCompletedExecuteCount(state)
  const deferredCount = getDeferredExecuteCount(state)
  const executeSavings = selectExecuteSavingsView()

  const allActions = useMemo(() => selectExecuteActionsView(), [])

  const queue = useMemo(
    () =>
      allActions.map((item) => {
        const status = statusFromDecision(state.execute.actionStates[item.id]?.status ?? 'pending') as ActionStatus
        return { ...item, status }
      }),
    [allActions, state.execute.actionStates],
  )

  const pendingActions = useMemo(() => {
    let items = queue.filter((item) => item.status === 'pending')
    if (urgencyFilter !== 'all') items = items.filter((a) => a.urgency === urgencyFilter)
    if (typeFilter !== 'all') items = items.filter((a) => a.executionType === typeFilter)
    if (sortBy === 'urgency') items = [...items].sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])
    if (sortBy === 'confidence') items = [...items].sort((a, b) => b.confidence - a.confidence)
    return items
  }, [queue, urgencyFilter, typeFilter, sortBy])

  const deferredActions = queue.filter((item) => item.status === 'deferred')
  const completedActions = queue.filter((item) => item.status === 'approved')

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-execute)', color: 'var(--bg-oled)' }}
      >
        Skip to main content
      </a>

      <motion.div
        id="main-content"
        className="flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12 w-full"
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* Hero */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-execute)]/20 bg-[var(--engine-execute)]/10 text-[var(--engine-execute)] text-xs font-bold tracking-widest uppercase self-start shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <Zap size={12} />
            Execute Engine
          </motion.div>
          <motion.h1 variants={fadeUpVariant} className="text-2xl md:text-4xl font-bold tracking-tight text-[#F1F5F9] mb-2 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {pendingCount} actions queued. <br className="hidden lg:block" />Projected savings: <span className="text-[var(--engine-execute)] font-mono drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">{formatUsd(executeSavings.potentialMonthlySavingsUsd)}/mo</span>.
          </motion.h1>

          {/* KPI Strip */}
          <motion.div variants={fadeUpVariant} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Pending', value: pendingCount, color: 'var(--state-warning)' },
              { label: 'Completed', value: completedCount, color: 'var(--state-healthy)' },
              { label: 'Deferred', value: deferredCount, color: 'var(--engine-govern)' },
              { label: 'Savings/mo', value: formatUsd(executeSavings.potentialMonthlySavingsUsd), color: 'var(--engine-execute)' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-[16px] border border-white/[0.06] backdrop-blur-xl bg-black/40 p-4 flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">{kpi.label}</span>
                <span className="text-xl font-mono font-medium tabular-nums" style={{ color: kpi.color, textShadow: `0 0 8px ${kpi.color}40` }}>
                  {kpi.value}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.section>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
              {/* Filter Bar */}
              <motion.div variants={fadeUpVariant} className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">Pending approval ({pendingActions.length})</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer',
                    showFilters ? 'border-[var(--engine-execute)]/30 bg-[var(--engine-execute)]/10 text-[var(--engine-execute)]' : 'border-white/10 bg-white/5 text-white/50 hover:text-white/70',
                  )}
                >
                  <Filter size={12} />
                  Filters
                </button>
              </motion.div>

              {showFilters && (
                <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-3 p-4 rounded-[16px] border border-white/[0.06] bg-black/30 backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Urgency</span>
                    <div className="flex gap-1">
                      <button onClick={() => setUrgencyFilter('all')} className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors', urgencyFilter === 'all' ? 'border-white/20 bg-white/10 text-white' : 'border-white/5 text-white/40 hover:text-white/60')}>All</button>
                      {URGENCY_OPTIONS.map((u) => (
                        <button key={u} onClick={() => setUrgencyFilter(u)} className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors', urgencyFilter === u ? 'border-white/20 bg-white/10 text-white' : 'border-white/5 text-white/40 hover:text-white/60')}>{u}</button>
                      ))}
                    </div>
                  </div>
                  <div className="w-px h-5 bg-white/10" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Type</span>
                    <div className="flex gap-1">
                      <button onClick={() => setTypeFilter('all')} className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors', typeFilter === 'all' ? 'border-white/20 bg-white/10 text-white' : 'border-white/5 text-white/40 hover:text-white/60')}>All</button>
                      {EXEC_TYPE_OPTIONS.map((t) => (
                        <button key={t} onClick={() => setTypeFilter(t)} className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors', typeFilter === t ? 'border-white/20 bg-white/10 text-white' : 'border-white/5 text-white/40 hover:text-white/60')}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="w-px h-5 bg-white/10" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Sort</span>
                    <div className="flex gap-1">
                      {SORT_OPTIONS.map((s) => (
                        <button key={s.key} onClick={() => setSortBy(s.key)} className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors', sortBy === s.key ? 'border-white/20 bg-white/10 text-white' : 'border-white/5 text-white/40 hover:text-white/60')}>{s.label}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {pendingActions.length === 0 ? (
                <motion.div className="relative overflow-hidden rounded-[32px] p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <EmptyState
                    icon={CheckCircle2}
                    title="All pending actions are cleared"
                    description="You can review completed and deferred items in execution history."
                    accentColor="var(--state-healthy)"
                    action={{ label: 'Open execution history', onClick: () => navigate('/execute/history') }}
                  />
                </motion.div>
              ) : null}

              {pendingActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  fadeUpVariant={fadeUpVariant}
                  onDefer={() => {
                    setExecuteDecision({ actionId: action.id, actionTitle: action.title, decision: 'deferred' })
                    showToast({ message: 'Action dismissed', variant: 'info' })
                  }}
                />
              ))}

              {deferredActions.length > 0 ? (
                <div className="mt-8">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 pl-2 mb-4">Deferred ({deferredActions.length})</h2>
                  <div className="flex flex-col gap-3">
                    {deferredActions.map((action) => (
                      <motion.div key={action.id} variants={fadeUpVariant}>
                        <motion.div className="relative overflow-hidden rounded-[24px] p-6 lg:p-8 border border-white/[0.04] backdrop-blur-2xl bg-black/40 shadow-xl flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--state-warning)]/20 shadow-inner" style={{ background: 'rgba(234,179,8,0.1)' }}>
                            <Clock size={18} style={{ color: 'var(--state-warning)' }} className="drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-base font-light tracking-wide text-white/90">{action.title}</span>
                            <span className="text-xs font-mono block text-white/40 mt-1">{action.id}</span>
                          </div>
                          <span className="text-xs font-mono text-white/30 tracking-widest">{action.timestampLabel}</span>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}

              {completedActions.length > 0 ? (
                <div className="mt-8">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 pl-2 mb-4">Completed ({completedActions.length})</h2>
                  <div className="flex flex-col gap-3">
                    {completedActions.map((action) => (
                      <motion.div key={action.id} variants={fadeUpVariant}>
                        <motion.div className="relative overflow-hidden rounded-[24px] p-6 lg:p-8 border border-white/[0.04] backdrop-blur-2xl bg-black/40 shadow-xl flex items-center gap-4 opacity-50 hover:opacity-80 transition-opacity">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--state-healthy)]/20 shadow-inner" style={{ background: 'rgba(34,197,94,0.1)' }}>
                            <CheckCircle2 size={18} style={{ color: 'var(--state-healthy)' }} className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-base font-light tracking-wide text-white/90">{action.title}</span>
                            <span className="text-xs font-mono block text-white/40 mt-1">{action.id}</span>
                          </div>
                          <span className="text-xs font-mono text-white/30 tracking-widest">{action.timestampLabel}</span>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.section>
          </div>

          {/* Sidebar */}
          <motion.aside className="w-full lg:w-[320px] xl:w-[380px] shrink-0 flex flex-col gap-6" aria-label="Execute sidebar" variants={staggerContainerVariant}>
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Agent Status Monitor */}
              <motion.div variants={fadeUpVariant}>
                <div className="relative overflow-hidden rounded-[24px] p-6 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-3 mb-1 relative z-10 flex items-center gap-2">
                    <Bot size={12} style={{ color: 'var(--engine-execute)' }} />
                    Agent Status
                  </h3>
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60 tracking-wide">System confidence</span>
                      <span className="text-sm font-mono font-medium tabular-nums" style={{ color: 'var(--state-healthy)', textShadow: '0 0 8px rgba(34,197,94,0.4)' }}>
                        {(DEMO_THREAD.systemConfidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60 tracking-wide">Decisions audited</span>
                      <span className="text-sm font-mono font-medium tabular-nums text-white/80">
                        {DEMO_THREAD.decisionsAudited.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60 tracking-wide">Compliance score</span>
                      <span className="text-sm font-mono font-medium tabular-nums" style={{ color: 'var(--engine-govern)', textShadow: '0 0 8px rgba(59,130,246,0.4)' }}>
                        {DEMO_THREAD.complianceScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Queue Summary */}
              <motion.div variants={fadeUpVariant}>
                <div className="relative overflow-hidden rounded-[24px] p-6 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-3 mb-1 relative z-10">Queue Summary</h3>
                  <div className="space-y-3 relative z-10">
                    {[
                      { label: 'Pending actions', value: String(pendingCount), color: 'var(--state-warning)' },
                      { label: 'Completed today', value: String(completedCount), color: 'var(--state-healthy)' },
                      { label: 'Auto-approved', value: String(state.execute.autoApprovedCount) },
                      { label: 'Rollbacks (24h)', value: String(state.execute.rollbackCount24h), color: 'var(--engine-govern)' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-white/60 tracking-wide">{item.label}</span>
                        <span className="text-sm font-mono font-medium tabular-nums" style={{ color: item.color || '#F1F5F9', textShadow: item.color ? `0 0 8px ${item.color}60` : 'none' }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Savings Tracker */}
              <motion.div variants={fadeUpVariant}>
                <div className="relative overflow-hidden rounded-[24px] p-6 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-3 mb-1 relative z-10">Savings Tracker</h3>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[var(--engine-execute)]/20 shadow-inner" style={{ background: 'rgba(251,191,36,0.1)' }}>
                      <DollarSign size={24} style={{ color: 'var(--engine-execute)' }} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-light font-mono tabular-nums tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        {formatUsd(executeSavings.potentialMonthlySavingsUsd)}<span className="text-base text-white/40">/mo</span>
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <TrendingUp size={12} style={{ color: 'var(--state-healthy)' }} />
                        <span className="text-xs tracking-wide" style={{ color: 'var(--state-healthy)' }}>
                          Baseline: {formatUsd(executeSavings.currentMonthlySavingsUsd)}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Rollback Safety */}
              <motion.div variants={fadeUpVariant}>
                <div className="relative overflow-hidden rounded-[24px] p-6 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-govern)]/10 to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-3 mb-1 relative z-10">Rollback Safety</h3>
                  <p className="text-sm leading-relaxed text-white/70 tracking-wide relative z-10">
                    All actions are reversible within 24 hours. Rollback requests are processed immediately.
                  </p>
                  <div className="relative z-10 flex items-center gap-3 mt-1 bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl">
                    <RotateCcw size={14} style={{ color: 'var(--engine-govern)' }} className="drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]" />
                    <span className="text-xs font-mono font-medium tracking-wide" style={{ color: 'var(--engine-govern)' }}>
                      {state.execute.rollbackCount24h} active rollbacks
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="flex">
                <Link to="/execute/history" className={cn(buttonVariants({ variant: 'glass', size: 'lg' }), 'w-full rounded-2xl text-sm px-6 py-4 flex items-center justify-between border border-white/[0.1] hover:bg-white/[0.05] transition-all')}>
                  <span className="font-semibold tracking-wide text-white/80">Review execution history</span>
                  <ArrowUpRight size={18} className="text-white/40" />
                </Link>
              </motion.div>
            </div>
          </motion.aside>
        </div>

      </motion.div>
    </>
  )
}

/* ═══════════════════════════════════════════
   ACTION CARD SUB-COMPONENT
   ═══════════════════════════════════════════ */

function ActionCard({
  action,
  fadeUpVariant,
  onDefer,
}: {
  action: ExecuteActionEntity & { status: ActionStatus }
  fadeUpVariant: import('framer-motion').Variants
  onDefer: () => void
}) {
  const typeBadge = EXECUTION_TYPE_BADGE[action.executionType]
  const isExpiringSoon = action.expiresIn && (action.expiresIn.includes('h') && parseInt(action.expiresIn) <= 4)

  return (
    <motion.div variants={fadeUpVariant}>
      <motion.div
        className="relative overflow-hidden rounded-[24px] p-6 lg:p-8 border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-5 transition-colors"
        style={{ borderLeftWidth: 4, borderLeftColor: ENGINE_COLOR_MAP[action.engine] }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-mono font-bold tracking-wide" style={{ color: 'var(--engine-execute)', textShadow: '0 0 10px rgba(251,191,36,0.3)' }}>
            {action.id}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest shadow-inner border border-white/[0.05] ${ENGINE_BADGE_CLASS[action.engine]}`}>
            {action.engine}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${typeBadge.cls}`}>
            {action.executionType === 'auto' ? <Bot size={10} /> : action.executionType === 'manual' ? <User size={10} /> : null}
            {typeBadge.label}
          </span>
          {action.expiresIn && (
            <span className={cn(
              'inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase ml-1',
              isExpiringSoon ? 'text-red-400' : 'text-white/40',
            )}>
              <Timer size={10} className={isExpiringSoon ? 'animate-pulse' : ''} />
              {action.expiresIn}
            </span>
          )}
          <span className="ml-auto text-xs font-mono text-white/40 tracking-widest">{action.timestampLabel}</span>
        </div>

        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl font-light text-white mb-2">{action.title}</h3>
          <p className="text-sm text-white/50 leading-relaxed tracking-wide">{action.description}</p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-6 py-3 border-y border-white/[0.06] my-1">
          <span className="text-xl font-mono font-light tracking-wide tabular-nums text-[var(--engine-execute)] drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">{action.amountLabel}</span>
          <div className="w-px h-6 bg-white/[0.06]" />
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-white/40">Confidence</span>
            <div className="h-1.5 w-16 rounded-full overflow-hidden bg-white/[0.05]">
              <div
                className="h-full rounded-full shadow-[0_0_8px_currentColor]"
                style={{
                  width: `${action.confidence * 100}%`,
                  background: action.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)',
                  color: action.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)',
                }}
              />
            </div>
            <span
              className="text-sm font-mono font-medium"
              style={{
                color: action.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)',
                textShadow: `0 0 10px ${action.confidence >= 0.9 ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)'}`,
              }}
            >
              {(action.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Step preview */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-white/40">
          <span className="font-semibold tracking-widest uppercase">Steps:</span>
          {action.steps.map((step, i) => (
            <span key={step.id} className={cn(
              'inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-mono font-bold border',
              step.status === 'completed' ? 'border-[var(--state-healthy)]/30 bg-[var(--state-healthy)]/10 text-[var(--state-healthy)]'
                : step.status === 'current' ? 'border-[var(--engine-execute)]/40 bg-[var(--engine-execute)]/15 text-[var(--engine-execute)]'
                : 'border-white/10 text-white/30',
            )}>
              {i + 1}
            </span>
          ))}
          <span className="text-white/30 ml-1">{action.steps.filter((s) => s.requiresConsent).length} consent required</span>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4 mt-1">
          <Link
            to={`/execute/approval?actionId=${action.id}`}
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'rounded-2xl text-sm px-6 py-3 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all bg-[var(--engine-execute)] hover:opacity-90 text-black border-none font-semibold flex items-center')}
          >
            Review & Approve
            <ArrowUpRight size={16} className="ml-2" />
          </Link>
          <button
            className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'rounded-2xl text-sm px-6 py-3 border border-white/10 hover:bg-white/10 transition-all font-semibold text-white/50 hover:text-white cursor-pointer')}
            onClick={onDefer}
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
