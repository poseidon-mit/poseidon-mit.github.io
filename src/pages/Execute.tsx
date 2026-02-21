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
import { useRouter } from '@/router'
// Removed Dialog import
import { AuroraPulse, EmptyState, GovernFooter } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { DEMO_THREAD } from '@/lib/demo-thread'
import { getMotionPreset } from '@/lib/motion-presets'
import { ENGINE_BADGE_CLASS, ENGINE_COLOR_MAP } from '@/lib/engine-color-map'
import { useDemoState } from '@/lib/demo-state/provider'
import type { DemoExecuteDecision } from '@/lib/demo-state/types'
import {
  getCompletedExecuteCount,
  getDeferredExecuteCount,
  getPendingExecuteCount,
} from '@/lib/demo-state/selectors'
import { Button, ButtonLink, Surface } from '@/design-system'
import { useToast } from '@/hooks/useToast'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

type ActionStatus = 'pending' | 'approved' | 'deferred'

type QueueEngine = 'Protect' | 'Grow' | 'Execute'

export interface QueueAction {
  id: string
  title: string
  engine: QueueEngine
  amount: string
  confidence: number
  time: string
  description: string
  urgency: 'high' | 'medium' | 'low';
  impact: { approved: string; deferred: string; };
  reversible: boolean;
  expiresIn: string | null;
  factors: Array<{ label: string; value: number; }>;
}

export const QUEUE_ACTIONS: QueueAction[] = [
  {
    id: 'EXE-001',
    title: 'Portfolio rebalance',
    engine: 'Execute',
    amount: '$12,400',
    confidence: 0.97,
    time: '14:28',
    description: '$12,400 transfer from Cash Reserve to Growth Equity Index',
    urgency: 'high',
    impact: {
      approved: 'Allocation adjusted and tracked in the govern audit trace.',
      deferred: 'Portfolio keeps current drift and review is deferred to next cycle.',
    },
    reversible: true,
    expiresIn: '14h',
    factors: [
      { label: 'Concentration risk', value: 0.91 },
      { label: 'Cash allocation', value: 0.87 },
      { label: 'Volatility outlook', value: 0.78 },
    ],
  },
  {
    id: 'EXE-002',
    title: 'Block wire transfer',
    engine: 'Protect',
    amount: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}`,
    confidence: DEMO_THREAD.criticalAlert.confidence,
    time: '14:15',
    description: `Suspicious $${DEMO_THREAD.criticalAlert.amount.toLocaleString()} wire transfer from Checking to ${DEMO_THREAD.criticalAlert.merchant}`,
    urgency: 'high',
    impact: {
      approved: 'Wire transfer is blocked and dispute workflow opens automatically.',
      deferred: 'Transaction remains active and fraud exposure window extends.',
    },
    reversible: true,
    expiresIn: '6h',
    factors: [
      { label: 'Merchant risk', value: 0.87 },
      { label: 'Amount anomaly', value: 0.71 },
      { label: 'Geo mismatch', value: 0.65 },
    ],
  },
  {
    id: 'EXE-003',
    title: 'Subscription consolidation',
    engine: 'Grow',
    amount: '$140/mo',
    confidence: 0.89,
    time: '13:52',
    description: 'Cancel 3 overlapping media subscriptions to save $140/mo',
    urgency: 'medium',
    impact: {
      approved: 'Estimated savings of $140/mo are queued for execution.',
      deferred: 'Current subscription stack remains unchanged.',
    },
    reversible: true,
    expiresIn: null,
    factors: [
      { label: 'Cost reduction', value: 0.92 },
      { label: 'Overlap confidence', value: 0.88 },
      { label: 'Usage parity', value: 0.82 },
    ],
  },
  {
    id: 'EXE-004',
    title: 'Archive invoices',
    engine: 'Execute',
    amount: '-',
    confidence: 0.78,
    time: '11:20',
    description: 'Batch archive 47 paid Q3 invoices to compliance cold storage',
    urgency: 'medium',
    impact: {
      approved: 'Legacy invoices are archived and indexed for governance audit.',
      deferred: 'Invoice archive remains unchanged and queue re-checks in 24h.',
    },
    reversible: false,
    expiresIn: '3d',
    factors: [
      { label: 'Document age', value: 0.84 },
      { label: 'Archive confidence', value: 0.77 },
      { label: 'Policy fit', value: 0.73 },
    ],
  },
  {
    id: 'EXE-005',
    title: 'Pay electricity bill',
    engine: 'Execute',
    amount: '$187',
    confidence: 0.99,
    time: '10:30',
    description: '$187 scheduled auto-payment from Checking to ConEdison',
    urgency: 'low',
    impact: {
      approved: 'Payment executes and receipt is logged in the audit ledger.',
      deferred: 'Payment is deferred and reminder is raised to the queue.',
    },
    reversible: true,
    expiresIn: '18h',
    factors: [
      { label: 'Payment confidence', value: 0.99 },
      { label: 'Schedule consistency', value: 0.93 },
      { label: 'Balance sufficiency', value: 0.95 },
    ],
  },
]

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
    <div className="relative min-h-screen w-full">
      <AuroraPulse engine="execute" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-execute)', color: 'var(--bg-oled)' }}
      >
        Skip to main content
      </a>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12 w-full"
        style={{ maxWidth: '1440px' }}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8 pt-8 lg:pt-12">
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-execute)]/20 bg-[var(--engine-execute)]/10 text-[var(--engine-execute)] text-xs font-bold tracking-widest uppercase self-start shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--engine-execute)]/20"><Zap size={12} /></span>
            Execute Engine
          </motion.div>
          <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight tabular-nums text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {pendingCount} actions queued. <br className="hidden lg:block" />Projected savings: <span className="text-[var(--engine-execute)] font-mono drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">${DEMO_THREAD.monthlySavings}/mo</span>.
          </motion.h1>

        </motion.section>

        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 pl-2">Pending approval ({pendingActions.length})</h2>

              {pendingActions.length === 0 ? (
                <Surface className="relative overflow-hidden rounded-[32px] p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <EmptyState
                    icon={CheckCircle2}
                    title="All pending actions are cleared"
                    description="You can review completed and deferred items in execution history."
                    accentColor="var(--state-healthy)"
                    action={{ label: 'Open execution history', onClick: () => navigate('/execute/history') }}
                  />
                </Surface>
              ) : null}

              {pendingActions.map((action) => (
                <motion.div key={action.id} variants={fadeUpVariant}>
                  <Surface
                    interactive
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
                      <span className="ml-auto text-xs font-mono text-white/40 tracking-widest">{action.time}</span>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-xl md:text-2xl font-light text-white mb-2">{action.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed tracking-wide">{action.description}</p>
                    </div>

                    <div className="relative z-10 flex flex-wrap items-center gap-6 py-4 border-y border-white/[0.06] my-2">
                      <span className="text-xl font-mono font-light tracking-wide tabular-nums text-[var(--engine-execute)] drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">{action.amount}</span>
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
                      <ButtonLink
                        to={`/execute/approval?actionId=${action.id}`}
                        variant="primary"
                        engine="execute"
                        className="rounded-2xl text-sm px-6 py-3 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all bg-[var(--engine-execute)] text-black border-none font-semibold"
                      >
                        Review & Approve
                        <ArrowUpRight size={16} className="ml-2" />
                      </ButtonLink>
                      <Button
                        variant="ghost"
                        engine="execute"
                        className="rounded-2xl text-sm px-6 py-3 border border-white/10 hover:bg-white/10 transition-all font-semibold text-white/50 hover:text-white"
                        onClick={() => {
                          setExecuteDecision({ actionId: action.id, actionTitle: action.title, decision: 'deferred' })
                          showToast({ message: 'Action dismissed', variant: 'info' })
                        }}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </Surface>
                </motion.div>
              ))}

              {deferredActions.length > 0 ? (
                <div className="mt-8">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 pl-2 mb-4">Deferred ({deferredActions.length})</h2>
                  <div className="flex flex-col gap-3">
                    {deferredActions.map((action) => (
                      <motion.div key={action.id} variants={fadeUpVariant}>
                        <Surface className="relative overflow-hidden rounded-[24px] p-6 lg:p-8 border border-white/[0.04] backdrop-blur-2xl bg-black/40 shadow-xl flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--state-warning)]/20 shadow-inner" style={{ background: 'rgba(234,179,8,0.1)' }}>
                            <Clock size={18} style={{ color: 'var(--state-warning)' }} className="drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-base font-light tracking-wide text-white/90">{action.title}</span>
                            <span className="text-xs font-mono block text-white/40 mt-1">{action.id}</span>
                          </div>
                          <span className="text-xs font-mono text-white/30 tracking-widest">{action.time}</span>
                        </Surface>
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
                        <Surface className="relative overflow-hidden rounded-[24px] p-6 lg:p-8 border border-white/[0.04] backdrop-blur-2xl bg-black/40 shadow-xl flex items-center gap-4 opacity-50 hover:opacity-80 transition-opacity">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--state-healthy)]/20 shadow-inner" style={{ background: 'rgba(34,197,94,0.1)' }}>
                            <CheckCircle2 size={18} style={{ color: 'var(--state-healthy)' }} className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-base font-light tracking-wide text-white/90">{action.title}</span>
                            <span className="text-xs font-mono block text-white/40 mt-1">{action.id}</span>
                          </div>
                          <span className="text-xs font-mono text-white/30 tracking-widest">{action.time}</span>
                        </Surface>
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
                <Surface className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
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
                </Surface>
              </motion.div>

              <motion.div variants={fadeUpVariant}>
                <Surface className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-2 relative z-10">Savings Tracker</h3>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[var(--engine-execute)]/20 shadow-inner" style={{ background: 'rgba(251,191,36,0.1)' }}>
                      <DollarSign size={24} style={{ color: 'var(--engine-execute)' }} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-light font-mono tabular-nums tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        ${DEMO_THREAD.monthlySavings}<span className="text-lg text-white/40">/mo</span>
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <TrendingUp size={12} style={{ color: 'var(--state-healthy)' }} />
                        <span className="text-xs tracking-wide" style={{ color: 'var(--state-healthy)' }}>+12% vs last month</span>
                      </div>
                    </div>
                  </div>
                </Surface>
              </motion.div>

              <motion.div variants={fadeUpVariant}>
                <Surface className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col gap-4">
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
                </Surface>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="flex">
                <ButtonLink to="/execute/history" variant="glass" engine="execute" className="w-full rounded-2xl text-sm px-6 py-4 flex items-center justify-between border border-white/[0.1] hover:bg-white/[0.05] transition-all">
                  <span className="font-semibold tracking-wide text-white/80">Review execution history</span>
                  <ArrowUpRight size={18} className="text-white/40" />
                </ButtonLink>
              </motion.div>
            </div>
          </motion.aside>
        </div>

        <GovernFooter
          auditId={GOVERNANCE_META['/execute'].auditId}
          pageContext={GOVERNANCE_META['/execute'].pageContext}
        />
      </motion.div>


    </div>
  )
}
