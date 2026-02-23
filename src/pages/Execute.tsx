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
} from 'lucide-react'
import { useRouter, Link } from '@/router'
// Removed Dialog import
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
import type { ExecuteActionEntity } from '@/domain/poseidon-universe'

type ActionStatus = 'pending' | 'approved' | 'deferred'

export type QueueAction = ExecuteActionEntity
export const QUEUE_ACTIONS: QueueAction[] = selectExecuteActionsView()

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

function statusTone(status: ActionStatus): string {
  if (status === 'approved') return 'var(--state-healthy)'
  if (status === 'deferred') return 'var(--state-warning)'
  return 'rgba(255,255,255,0.35)'
}

export default function ExecutePage() {
  usePageTitle('Execute')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate } = useRouter()
  const { state, setExecuteDecision } = useDemoState()
  const { showToast } = useToast()

  // Removed confirm state since we navigate to approval page

  const pendingCount = getPendingExecuteCount(state)
  const completedCount = getCompletedExecuteCount(state)
  const deferredCount = getDeferredExecuteCount(state)
  const executeSavings = selectExecuteSavingsView()

  const queue = useMemo(
    () =>
      QUEUE_ACTIONS.map((item) => {
        const status = statusFromDecision(state.execute.actionStates[item.id]?.status ?? 'pending') as ActionStatus
        return { ...item, status }
      }),
    [state.execute.actionStates],
  )

  const pendingActions = queue.filter((item) => item.status === 'pending')
  const deferredActions = queue.filter((item) => item.status === 'deferred')
  const completedActions = queue.filter((item) => item.status === 'approved')

  // Removed handleConfirmDecision and confirmAction variables

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
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-execute)]/20 bg-[var(--engine-execute)]/10 text-[var(--engine-execute)] text-xs font-bold tracking-widest uppercase self-start shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <Zap size={12} />
            Engine status: Good
          </motion.div>
          <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight tabular-nums text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {pendingCount} actions queued. <br className="hidden lg:block" />Projected savings: <span className="text-[var(--engine-execute)] font-mono drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">{formatUsd(executeSavings.potentialMonthlySavingsUsd)}/mo</span>.
          </motion.h1>

        </motion.section>

        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 pl-2">Pending approval ({pendingActions.length})</h2>

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
                <motion.div key={action.id} variants={fadeUpVariant}>
                  <motion.div
                    className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-5 transition-all"
                    style={{ borderLeftWidth: 4, borderLeftColor: ENGINE_COLOR_MAP[action.engine] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-3 flex-wrap mb-2">
                      <span className="text-sm font-mono font-bold tracking-wide" style={{ color: 'var(--engine-execute)', textShadow: '0 0 10px rgba(251,191,36,0.3)' }}>
                        {action.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-inner border border-white/[0.05] ${ENGINE_BADGE_CLASS[action.engine]}`}
                      >
                        {action.engine}
                      </span>
                      <span className="ml-auto text-xs font-mono text-white/40 tracking-widest">{action.timestampLabel}</span>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-xl md:text-2xl font-light text-white mb-2">{action.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed tracking-wide">{action.description}</p>
                    </div>

                    <div className="relative z-10 flex flex-wrap items-center gap-6 py-4 border-y border-white/[0.06] my-2">
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
                            textShadow: `0 0 10px ${action.confidence >= 0.9 ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)'}`
                          }}
                        >
                          {(action.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-4 mt-2">
                      <Link
                        to={`/execute/approval?actionId=${action.id}`}
                        className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-2xl text-sm px-6 py-3 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all bg-[var(--engine-execute)] hover:opacity-90 text-black border-none font-semibold flex items-center")}
                      >
                        Review & Approve
                        <ArrowUpRight size={16} className="ml-2" />
                      </Link>
                      <button
                        className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-2xl text-sm px-6 py-3 border border-white/10 hover:bg-white/10 transition-all font-semibold text-white/50 hover:text-white cursor-pointer")}
                        onClick={() => {
                          setExecuteDecision({ actionId: action.id, actionTitle: action.title, decision: 'deferred' })
                          showToast({ message: 'Action dismissed', variant: 'info' })
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
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

          <motion.aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Execute sidebar" variants={staggerContainerVariant}>
            <div className="sticky top-24 flex flex-col gap-6">
              <motion.div variants={fadeUpVariant}>
                <motion.div className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-2 relative z-10">Queue Summary</h3>
                  <div className="space-y-4 relative z-10">
                    {[
                      { label: 'Pending actions', value: String(pendingCount), color: 'var(--state-warning)' },
                      { label: 'Completed today', value: String(completedCount), color: 'var(--state-healthy)' },
                      { label: 'Auto-approved', value: String(state.execute.autoApprovedCount) },
                      { label: 'Rollbacks (24h)', value: String(state.execute.rollbackCount24h), color: 'var(--engine-govern)' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-white/60 tracking-wide">{item.label}</span>
                        <span className="text-base font-mono font-medium tabular-nums" style={{ color: item.color || '#F1F5F9', textShadow: item.color ? `0 0 8px ${item.color}60` : 'none' }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUpVariant}>
                <motion.div className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-2 relative z-10">Savings Tracker</h3>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[var(--engine-execute)]/20 shadow-inner" style={{ background: 'rgba(251,191,36,0.1)' }}>
                      <DollarSign size={24} style={{ color: 'var(--engine-execute)' }} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-light font-mono tabular-nums tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        {formatUsd(executeSavings.potentialMonthlySavingsUsd)}<span className="text-lg text-white/40">/mo</span>
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <TrendingUp size={12} style={{ color: 'var(--state-healthy)' }} />
                        <span className="text-xs tracking-wide" style={{ color: 'var(--state-healthy)' }}>
                          Baseline: {formatUsd(executeSavings.currentMonthlySavingsUsd)}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUpVariant}>
                <motion.div className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-govern)]/10 to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-2 relative z-10">Rollback Safety</h3>
                  <p className="text-sm leading-relaxed text-white/70 tracking-wide relative z-10">
                    All actions are reversible within 24 hours. Rollback requests are processed immediately.
                  </p>
                  <div className="relative z-10 flex items-center gap-3 mt-2 bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl">
                    <RotateCcw size={14} style={{ color: 'var(--engine-govern)' }} className="drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]" />
                    <span className="text-xs font-mono font-medium tracking-wide" style={{ color: 'var(--engine-govern)' }}>
                      {state.execute.rollbackCount24h} active rollbacks
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="flex">
                <Link to="/execute/history" className={cn(buttonVariants({ variant: "glass", size: "lg" }), "w-full rounded-2xl text-sm px-6 py-4 flex items-center justify-between border border-white/[0.1] hover:bg-white/[0.05] transition-all")}>
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
