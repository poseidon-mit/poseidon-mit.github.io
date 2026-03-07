import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Clock,
  CheckCircle2,
  RotateCcw,
  ArrowUpRight,
  Filter,
  Bot,
  User,
  Timer,
  XCircle,
  Lock,
  ShieldCheck,
} from 'lucide-react'
import { useRouter, Link } from '@/router'
import { UndoBanner } from '@/components/execute/UndoBanner'
import { ExecuteApprovalCommandDeck } from '@/components/poseidon/execute-hero'
import { EmptyState, EngineBadge, ConfidenceIndicator, StatRow } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { ENGINE_BADGE_CLASS, ENGINE_COLOR_MAP } from '@/lib/engine-color-map'
import { EXECUTION_TYPE_BADGE } from '@/lib/execution-type-config'
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
  selectExecuteActionsView,
  selectArchitecturalTrust,
  selectExecuteActionById,
} from '@/domain/poseidon-universe'
import type { ExecuteActionEntity, ExecuteEngineName, ExecutionType, UrgencyLevel } from '@/domain/poseidon-universe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { useIsMobileSheet } from '@/hooks/use-mobile-action-sheet'
import { ActionSheet, ActionSheetContent, ActionSheetHeader, ActionSheetBody, ActionSheetFooter } from '@/components/ui/action-sheet'
import { useExecuteApprovalFlow } from './useExecuteApprovalFlow'

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

type ActionStatus = 'pending' | 'approved' | 'rejected' | 'deferred'

// Execution type badge config — shared from lib/execution-type-config.ts

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
      return 'approved'
    case 'rejected':
      return 'rejected'
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
  const { navigate, search } = useRouter()
  const { state, setExecuteDecision, resetExecuteDecision } = useDemoState()
  const { showToast } = useToast()
  const trust = selectArchitecturalTrust()

  // Mobile sheet state
  const isMobile = useIsMobileSheet()
  const [sheetAction, setSheetAction] = useState<ExecuteActionEntity | null>(null)
  const sheetFlow = useExecuteApprovalFlow(sheetAction ?? undefined, () => { setSheetAction(null) })

  // Filter/sort state
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ExecutionType | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortKey>('default')
  const [showFilters, setShowFilters] = useState(false)

  const pendingCount = getPendingExecuteCount(state)
  const completedCount = getCompletedExecuteCount(state)
  const deferredCount = getDeferredExecuteCount(state)

  const allActions = useMemo(() => selectExecuteActionsView(), [])

  const queue = useMemo(
    () =>
      allActions.map((item) => {
        const status = statusFromDecision(state.execute.actionStates[item.id]?.status ?? 'pending') as ActionStatus
        return { ...item, status }
      }),
    [allActions, state.execute.actionStates],
  )

  // ── Hero data (page-global, NOT affected by list filters) ──
  const allPending = useMemo(
    () => queue.filter((a) => a.status === 'pending'),
    [queue],
  )

  const featuredAction = useMemo(() => {
    if (!allPending.length) return null
    const parseExpiry = (e: string | null): number => {
      if (!e) return Infinity
      const n = parseInt(e)
      if (e.includes('d')) return n * 24
      return n
    }
    return [...allPending].sort((a, b) => {
      const urgDiff = URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]
      if (urgDiff !== 0) return urgDiff
      return parseExpiry(a.expiresIn) - parseExpiry(b.expiresIn)
        || b.confidence - a.confidence
    })[0]
  }, [allPending])

  const agentStepsCompleted = featuredAction
    ? featuredAction.steps.filter((s) => s.actor === 'agent' && s.status === 'completed').length : 0
  const agentStepsTotal = featuredAction
    ? featuredAction.steps.filter((s) => s.actor === 'agent').length : 0

  const heroUrgentCount = useMemo(
    () => allPending.filter((a) => a.urgency === 'high').length,
    [allPending],
  )

  const engineSources = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of allPending) counts[a.sourceEngine] = (counts[a.sourceEngine] || 0) + 1
    return Object.entries(counts).map(([engine, count]) => ({
      engine: engine as ExecuteEngineName,
      count,
      color: ENGINE_COLOR_MAP[engine as keyof typeof ENGINE_COLOR_MAP],
    }))
  }, [allPending])

  const pendingActions = useMemo(() => {
    let items = queue.filter((item) => item.status === 'pending')
    if (urgencyFilter !== 'all') items = items.filter((a) => a.urgency === urgencyFilter)
    if (typeFilter !== 'all') items = items.filter((a) => a.executionType === typeFilter)
    if (sortBy === 'urgency') items = [...items].sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])
    if (sortBy === 'confidence') items = [...items].sort((a, b) => b.confidence - a.confidence)
    return items
  }, [queue, urgencyFilter, typeFilter, sortBy])

  const deferredActions = queue.filter((item) => item.status === 'deferred')
  const rejectedActions = queue.filter((item) => item.status === 'rejected')
  const completedActions = queue.filter((item) => item.status === 'approved')

  const undoActionId = useMemo(() => new URLSearchParams(search).get('undo'), [search])
  const undoAction = useMemo(
    () => (undoActionId ? selectExecuteActionById(undoActionId) : null),
    [undoActionId],
  )

  return (
    <>

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12`}
        style={PAGE_CONTENT_STYLE}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* UNDO Banner */}
        {undoActionId && (
          <UndoBanner
            actionId={undoActionId}
            actionTitle={undoAction?.title}
            onUndo={() => {
              resetExecuteDecision(undoActionId, undoAction?.title ?? undoActionId)
              showToast({ message: 'Action cancelled · returned to queue', variant: 'info' })
              navigate('/execute')
            }}
            onDismiss={() => navigate('/execute')}
          />
        )}

        {/* Hero */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant}><EngineBadge engine="execute" icon={Zap} label="Engine status: Good" className="self-start" /></motion.div>
          <h1 className="sr-only">Execute Engine</h1>
          <motion.div variants={fadeUpVariant} data-testid="system-status-row" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
            <Lock size={10} className="text-amber-400/50" />
            <span>System Status: <span className="text-amber-400/70">{trust.autoExecutionsWithoutConsent}</span> auto-executions · Your final approval is always required</span>
          </motion.div>
          <motion.div variants={fadeUpVariant}>
            <ExecuteApprovalCommandDeck
              queueTotal={allPending.length}
              urgentCount={heroUrgentCount}
              agentStepsCompleted={agentStepsCompleted}
              agentStepsTotal={agentStepsTotal}
              featuredAction={featuredAction ? {
                id: featuredAction.id,
                title: featuredAction.title,
                amountLabel: featuredAction.amountLabel,
                confidence: featuredAction.confidence,
                engine: featuredAction.engine,
                sourceEngine: featuredAction.sourceEngine,
                expiresIn: featuredAction.expiresIn ?? null,
                rollbackHours: featuredAction.rollbackWindowHours ?? null,
              } : null}
              engineSources={engineSources}
              onReviewApproval={featuredAction
                ? () => navigate(`/execute/approval?actionId=${featuredAction.id}`)
                : null}
            />
          </motion.div>
        </motion.section>

        {false && (<div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
              {/* Filter Bar */}
              <motion.div variants={fadeUpVariant} className="flex items-center gap-3 flex-wrap">
                <h2 className="section-label">Pending approval ({pendingActions.length})</h2>
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
                <motion.div className="glass-card glass-card-overlay rounded-[32px] p-8 flex items-center justify-center">
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
                  isMobile={isMobile}
                  onSheetOpen={() => {
                    sheetFlow.setConsentReviewed(false)
                    sheetFlow.setConfirmAction(null)
                    setSheetAction(action)
                  }}
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
                        <motion.div className="glass-card rounded-[24px] p-4 md:p-6 lg:p-8 flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--state-warning)]/20 shadow-inner" style={{ background: 'rgba(234,179,8,0.1)' }}>
                            <Clock size={18} style={{ color: 'var(--state-warning)' }} />
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

              {rejectedActions.length > 0 ? (
                <div className="mt-8">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 pl-2 mb-4">Rejected ({rejectedActions.length})</h2>
                  <div className="flex flex-col gap-3">
                    {rejectedActions.map((action) => (
                      <motion.div key={action.id} variants={fadeUpVariant}>
                        <motion.div className="glass-card rounded-[24px] p-4 md:p-6 lg:p-8 flex items-center gap-4 opacity-50 hover:opacity-80 transition-opacity">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--state-critical)]/20 shadow-inner" style={{ background: 'rgba(239,68,68,0.1)' }}>
                            <XCircle size={18} style={{ color: 'var(--state-critical)' }} />
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
                        <motion.div className="glass-card rounded-[24px] p-4 md:p-6 lg:p-8 flex items-center gap-4 opacity-50 hover:opacity-80 transition-opacity">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--state-healthy)]/20 shadow-inner" style={{ background: 'rgba(34,197,94,0.1)' }}>
                            <CheckCircle2 size={18} style={{ color: 'var(--state-healthy)' }} />
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
              {/* Queue Summary */}
              <motion.div variants={fadeUpVariant}>
                <div className="glass-card glass-card-overlay rounded-[24px] p-6 flex flex-col gap-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-3 mb-1 relative z-10">Queue Summary</h3>
                  <div className="space-y-3 relative z-10">
                    <StatRow label="Pending actions" value={String(pendingCount)} valueColor="var(--state-warning)" glow />
                    <StatRow label="Completed today" value={String(completedCount)} valueColor="var(--state-healthy)" glow />
                    <StatRow label="Auto-approved" value={String(state.execute.autoApprovedCount)} />
                    <StatRow label="Rollbacks (24h)" value={String(state.execute.rollbackCount24h)} valueColor="var(--engine-govern)" glow />
                  </div>
                </div>
              </motion.div>

              {/* Rollback Safety */}
              <motion.div variants={fadeUpVariant}>
                <div className="glass-card rounded-[24px] p-6 flex flex-col gap-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-govern)]/10 to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-3 mb-1 relative z-10">Rollback Safety</h3>
                  <p className="text-sm leading-relaxed text-white/70 tracking-wide relative z-10">
                    All actions are reversible within 24 hours. Rollback requests are processed immediately.
                  </p>
                  <div className="relative z-10 flex items-center gap-3 mt-1 bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl">
                    <RotateCcw size={14} style={{ color: 'var(--engine-govern)' }} />
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
        </div>)}

      </motion.div>

      {false && (<ActionSheet open={!!sheetAction} onOpenChange={(open) => { if (!open) setSheetAction(null) }}>
        <ActionSheetContent>
          {sheetAction && (
            <>
              <ActionSheetHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono font-bold" style={{ color: 'var(--engine-execute)' }}>{sheetAction.id}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border border-white/[0.05] ${ENGINE_BADGE_CLASS[sheetAction.engine]}`}>{sheetAction.engine}</span>
                </div>
                <h2 className="text-lg font-light text-white">{sheetAction.title}</h2>
                <p className="text-sm text-white/50 mt-1">{sheetAction.description}</p>
              </ActionSheetHeader>
              <ActionSheetBody>
                <div className="flex items-center gap-4 mb-4 py-3 border-b border-white/[0.06]">
                  <span className="text-xl font-mono font-light tabular-nums text-[var(--engine-execute)]">{sheetAction.amountLabel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-white/40">Confidence</span>
                    <ConfidenceIndicator value={sheetAction.confidence} format="percent" glow />
                  </div>
                </div>
                {/* Top factors */}
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Key Factors</span>
                  {sheetAction.factors.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                      <span className="text-sm text-white/70">{f.label}</span>
                      <span className="text-sm font-mono text-white/90">{f.value}</span>
                    </div>
                  ))}
                </div>
                {/* Consent gate */}
                <label className="flex items-start gap-3 cursor-pointer py-3 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <input
                    type="checkbox"
                    checked={sheetFlow.consentReviewed}
                    onChange={(e) => sheetFlow.setConsentReviewed(e.target.checked)}
                    className="mt-0.5 accent-[var(--engine-execute)]"
                  />
                  <span className="text-xs text-white/60 leading-relaxed">
                    I have reviewed the AI analysis and approve this action under my authority. This decision will be logged to the governance audit trail.
                  </span>
                </label>
              </ActionSheetBody>
              <ActionSheetFooter>
                <button
                  disabled={!sheetFlow.consentReviewed}
                  onClick={() => sheetFlow.setConfirmAction({ type: 'approve' })}
                  className={cn(
                    'w-full py-3.5 rounded-2xl text-sm font-semibold transition-all',
                    sheetFlow.consentReviewed
                      ? 'bg-[var(--engine-execute)] text-black hover:opacity-90 cursor-pointer'
                      : 'bg-white/10 text-white/30 cursor-not-allowed',
                  )}
                >
                  <CheckCircle2 size={16} className="inline mr-2" />
                  Approve & Log
                </button>
                <button
                  onClick={() => sheetFlow.setConfirmAction({ type: 'defer' })}
                  className="w-full py-3 rounded-2xl text-sm font-medium border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Defer for Review
                </button>
              </ActionSheetFooter>
            </>
          )}
        </ActionSheetContent>
      </ActionSheet>)}

      {false && sheetFlow.confirmAction && sheetAction && (
        <ActionSheet open onOpenChange={() => sheetFlow.setConfirmAction(null)}>
          <ActionSheetContent>
            <ActionSheetBody>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  sheetFlow.confirmAction.type === 'approve' ? 'bg-[var(--state-healthy)]/10' : 'bg-[var(--state-warning)]/10',
                )}>
                  {sheetFlow.confirmAction.type === 'approve'
                    ? <ShieldCheck size={24} className="text-[var(--state-healthy)]" />
                    : <Clock size={24} className="text-[var(--state-warning)]" />}
                </div>
                <h3 className="text-lg font-light text-white text-center">
                  {sheetFlow.confirmAction.type === 'approve' ? 'Confirm approval?' : 'Defer this action?'}
                </h3>
                <p className="text-sm text-white/50 text-center">
                  {sheetFlow.confirmAction.type === 'approve'
                    ? `${sheetAction.id} will be approved and logged to governance.`
                    : `${sheetAction.id} will be queued for later review.`}
                </p>
              </div>
            </ActionSheetBody>
            <ActionSheetFooter>
              <button
                onClick={sheetFlow.handleConfirm}
                className={cn(
                  'w-full py-3.5 rounded-2xl text-sm font-semibold cursor-pointer transition-all',
                  sheetFlow.confirmAction.type === 'approve'
                    ? 'bg-[var(--engine-execute)] text-black hover:opacity-90'
                    : 'bg-white/10 text-white hover:bg-white/15',
                )}
              >
                {sheetFlow.confirmAction.type === 'approve' ? 'Yes, Approve' : 'Yes, Defer'}
              </button>
              <button
                onClick={() => sheetFlow.setConfirmAction(null)}
                className="w-full py-3 rounded-2xl text-sm font-medium text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </ActionSheetFooter>
          </ActionSheetContent>
        </ActionSheet>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════
   ACTION CARD SUB-COMPONENT
   ═══════════════════════════════════════════ */

function ActionCard({
  action,
  fadeUpVariant,
  isMobile,
  onSheetOpen,
  onDefer,
}: {
  action: ExecuteActionEntity & { status: ActionStatus }
  fadeUpVariant: import('framer-motion').Variants
  isMobile: boolean
  onSheetOpen: () => void
  onDefer: () => void
}) {
  const typeBadge = EXECUTION_TYPE_BADGE[action.executionType]
  const isExpiringSoon = action.expiresIn && (action.expiresIn.includes('h') && parseInt(action.expiresIn) <= 4)

  return (
    <motion.div variants={fadeUpVariant}>
      <motion.div
        className="glass-card glass-card-overlay rounded-[24px] p-4 md:p-6 lg:p-8 hover:border-white/[0.15] flex flex-col gap-5 transition-colors"
        style={{ borderLeftWidth: 4, borderLeftColor: ENGINE_COLOR_MAP[action.engine] }}
      >

        <div className="relative z-10 flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-mono font-bold tracking-wide" style={{ color: 'var(--engine-execute)' }}>
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
          <span className="text-xl font-mono font-light tracking-wide tabular-nums text-[var(--engine-execute)]">{action.amountLabel}</span>
          <div className="w-px h-6 bg-white/[0.06]" />
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-white/40">Confidence</span>
            <ConfidenceIndicator value={action.confidence} format="percent" glow />
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
          {isMobile ? (
            <button
              onClick={onSheetOpen}
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'rounded-2xl text-sm px-6 py-3 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all bg-[var(--engine-execute)] hover:opacity-90 text-black border-none font-semibold flex items-center cursor-pointer')}
            >
              Review & Approve
              <ArrowUpRight size={16} className="ml-2" />
            </button>
          ) : (
            <Link
              to={`/execute/approval?actionId=${action.id}`}
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'rounded-2xl text-sm px-6 py-3 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all bg-[var(--engine-execute)] hover:opacity-90 text-black border-none font-semibold flex items-center')}
            >
              Review & Approve
              <ArrowUpRight size={16} className="ml-2" />
            </Link>
          )}
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
