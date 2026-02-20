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
import { Dialog, DialogContent } from '@/components/ui/dialog'
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

interface QueueAction {
  id: string
  title: string
  engine: QueueEngine
  amount: string
  confidence: number
  time: string
  description: string
}

const QUEUE_ACTIONS: QueueAction[] = [
  {
    id: 'EXE-001',
    title: 'Portfolio rebalance',
    engine: 'Execute',
    amount: '$12,400',
    confidence: 0.97,
    time: '14:28',
    description: 'Optimize allocation based on 90-day pattern',
  },
  {
    id: 'EXE-002',
    title: 'Block wire transfer',
    engine: 'Protect',
    amount: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}`,
    confidence: DEMO_THREAD.criticalAlert.confidence,
    time: '14:15',
    description: `Suspicious transaction to ${DEMO_THREAD.criticalAlert.merchant}`,
  },
  {
    id: 'EXE-003',
    title: 'Subscription consolidation',
    engine: 'Grow',
    amount: '$140/mo',
    confidence: 0.89,
    time: '13:52',
    description: '3 overlapping subscriptions detected',
  },
  {
    id: 'EXE-004',
    title: 'Archive invoices',
    engine: 'Execute',
    amount: '-',
    confidence: 0.78,
    time: '11:20',
    description: 'Batch archive of 47 paid invoices',
  },
  {
    id: 'EXE-005',
    title: 'Pay electricity bill',
    engine: 'Execute',
    amount: '$187',
    confidence: 0.99,
    time: '10:30',
    description: 'Recurring auto-payment',
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

  const [confirm, setConfirm] = useState<{
    actionId: string
    decision: Extract<ActionStatus, 'approved' | 'deferred'>
  } | null>(null)

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

  const handleConfirmDecision = () => {
    if (!confirm) return
    const action = QUEUE_ACTIONS.find((item) => item.id === confirm.actionId)
    if (!action) return

    setExecuteDecision({
      actionId: action.id,
      actionTitle: action.title,
      decision: confirm.decision,
    })

    showToast({
      variant: 'success',
      message:
        confirm.decision === 'approved'
          ? `${action.id} approved and logged to audit trace.`
          : `${action.id} deferred. Queue will re-evaluate automatically.`,
    })

    setConfirm(null)
  }

  const confirmAction = confirm ? QUEUE_ACTIONS.find((item) => item.id === confirm.actionId) ?? null : null

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
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-4">
          <motion.div variants={fadeUpVariant}>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase"
              style={{
                borderColor: 'rgba(234,179,8,0.3)',
                background: 'rgba(234,179,8,0.08)',
                color: 'var(--engine-execute)',
              }}
            >
              <Zap size={12} />
              Execute Engine
            </span>
          </motion.div>
          <motion.h1 variants={fadeUpVariant} className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-slate-100">
            {pendingCount} actions queued. Projected savings:{' '}
            <span style={{ color: 'var(--engine-execute)' }}>${DEMO_THREAD.monthlySavings}/mo</span>.
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-sm md:text-base leading-relaxed text-slate-300">
            AI-optimized execution queue. Every action is auditable and reversible within 24 hours.
          </motion.p>
        </motion.section>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <motion.section variants={staggerContainerVariant} className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Pending approval ({pendingActions.length})</h2>

              {pendingActions.length === 0 ? (
                <Surface variant="glass" padding="md">
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
                    variant="glass"
                    padding="md"
                    borderColor={ENGINE_COLOR_MAP[action.engine]}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-medium" style={{ color: 'var(--engine-execute)' }}>
                        {action.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${ENGINE_BADGE_CLASS[action.engine]}`}
                      >
                        {action.engine}
                      </span>
                      <span className="ml-auto text-[10px] font-mono text-slate-500">{action.time}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100">{action.title}</h3>
                    <p className="text-xs text-slate-400">{action.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono font-bold tabular-nums text-slate-100">{action.amount}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 rounded-full overflow-hidden bg-white/10">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${action.confidence * 100}%`,
                              background: action.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)',
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-mono tabular-nums"
                          style={{
                            color: action.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)',
                          }}
                        >
                          {action.confidence.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setConfirm({ actionId: action.id, decision: 'approved' })}
                        variant="glass"
                        engine="execute"
                        fullWidth
                        className="rounded-xl text-sm"
                      >
                        <CheckCircle2 size={14} />
                        Approve
                      </Button>
                      <Button
                        onClick={() => setConfirm({ actionId: action.id, decision: 'deferred' })}
                        variant="secondary"
                        engine="execute"
                        className="rounded-xl text-sm"
                      >
                        <Clock size={14} />
                        Defer
                      </Button>
                    </div>
                  </Surface>
                </motion.div>
              ))}

              {deferredActions.length > 0 ? (
                <>
                  <h2 className="text-sm font-semibold uppercase tracking-wider mt-4 text-slate-500">Deferred ({deferredActions.length})</h2>
                  {deferredActions.map((action) => (
                    <motion.div key={action.id} variants={fadeUpVariant}>
                      <Surface variant="glass" padding="md" className="flex items-center gap-4 opacity-80">
                        <Clock size={16} style={{ color: 'var(--state-warning)' }} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-slate-100">{action.title}</span>
                          <span className="text-xs block text-slate-500">{action.id}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{action.time}</span>
                      </Surface>
                    </motion.div>
                  ))}
                </>
              ) : null}

              {completedActions.length > 0 ? (
                <>
                  <h2 className="text-sm font-semibold uppercase tracking-wider mt-4 text-slate-500">Completed ({completedActions.length})</h2>
                  {completedActions.map((action) => (
                    <motion.div key={action.id} variants={fadeUpVariant}>
                      <Surface variant="glass" padding="md" className="flex items-center gap-4 opacity-60">
                        <CheckCircle2 size={16} style={{ color: 'var(--state-healthy)' }} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-slate-100">{action.title}</span>
                          <span className="text-xs block text-slate-500">{action.id}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{action.time}</span>
                      </Surface>
                    </motion.div>
                  ))}
                </>
              ) : null}
            </motion.section>
          </div>

          <motion.aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Execute sidebar" variants={staggerContainerVariant}>
            <motion.div variants={fadeUpVariant}>
              <Surface variant="glass" padding="md" className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-slate-100">Queue Summary</h3>
                {[
                  { label: 'Pending actions', value: String(pendingCount), color: 'var(--state-warning)' },
                  { label: 'Completed today', value: String(completedCount), color: 'var(--state-healthy)' },
                  { label: 'Auto-approved', value: String(state.execute.autoApprovedCount) },
                  { label: 'Rollbacks (24h)', value: String(state.execute.rollbackCount24h), color: 'var(--state-healthy)' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: item.color || '#F1F5F9' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </Surface>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <Surface variant="glass" padding="md" className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-slate-100">Savings Tracker</h3>
                <div className="flex items-center gap-2">
                  <DollarSign size={20} style={{ color: 'var(--engine-execute)' }} />
                  <span className="text-2xl font-bold font-mono tabular-nums" style={{ color: 'var(--engine-execute)' }}>
                    ${DEMO_THREAD.monthlySavings}/mo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={12} style={{ color: 'var(--state-healthy)' }} />
                  <span className="text-xs" style={{ color: 'var(--state-healthy)' }}>+12% vs last month</span>
                </div>
              </Surface>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <Surface variant="glass" padding="md" className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-slate-100">Rollback Safety</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  All actions are reversible within 24 hours. Rollback requests are processed immediately.
                </p>
                <div className="flex items-center gap-2">
                  <RotateCcw size={12} style={{ color: 'var(--engine-govern)' }} />
                  <span className="text-xs font-mono" style={{ color: 'var(--engine-govern)' }}>
                    {state.execute.rollbackCount24h} active rollbacks
                  </span>
                </div>
              </Surface>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <ButtonLink to="/execute/history" variant="glass" engine="execute" className="rounded-xl text-sm">
                Review execution history <ArrowUpRight size={16} />
              </ButtonLink>
            </motion.div>
          </motion.aside>
        </div>

        <GovernFooter
          auditId={GOVERNANCE_META['/execute'].auditId}
          pageContext={GOVERNANCE_META['/execute'].pageContext}
        />
      </motion.div>

      <Dialog open={Boolean(confirm)} onOpenChange={(open) => !open && setConfirm(null)}>
        <DialogContent
          className="max-w-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="execute-decision-title"
          style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {confirm && confirmAction ? (
            <div className="flex flex-col gap-4 p-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--engine-execute)' }}>
                  Confirm decision
                </p>
                <h2 id="execute-decision-title" className="text-base font-semibold text-white">
                  {confirmAction.title}
                </h2>
                <p className="text-xs text-white/50 mt-1">{confirmAction.description}</p>
              </div>

              <div className="rounded-xl border border-white/12 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-wider mb-1 text-white/60">Selected action</p>
                <p className="text-xs text-white/80">
                  {confirm.decision === 'approved'
                    ? 'Approve and write immutable event to audit ledger.'
                    : 'Defer for later review. No transaction executes now.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant={confirm.decision === 'approved' ? 'glass' : 'secondary'}
                  engine="execute"
                  fullWidth
                  className="rounded-xl text-sm"
                  onClick={handleConfirmDecision}
                >
                  {confirm.decision === 'approved' ? 'Approve' : 'Defer'}
                </Button>
                <Button
                  variant="secondary"
                  engine="execute"
                  fullWidth
                  className="rounded-xl text-sm"
                  onClick={() => setConfirm(null)}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-[10px] text-white/25 text-center">
                Status will update immediately · Pending {pendingCount} · Deferred {deferredCount}
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
