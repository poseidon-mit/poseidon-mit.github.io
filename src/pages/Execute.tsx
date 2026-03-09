import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Bot,
  User,
  Timer,
  Lock,
  ChevronDown,
} from 'lucide-react'
import { useRouter, Link } from '@/router'
import { UndoBanner } from '@/components/execute/UndoBanner'
import { ExecuteApprovalCommandDeck } from '@/components/poseidon/execute-hero'
import { EmptyState, EngineBadge, ConfidenceIndicator } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { ENGINE_BADGE_CLASS, ENGINE_COLOR_MAP } from '@/lib/engine-color-map'
import { EXECUTION_TYPE_BADGE } from '@/lib/execution-type-config'
import { useDemoState } from '@/lib/demo-state/provider'
import type { DemoExecuteDecision } from '@/lib/demo-state/types'
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
import { getRiskTier, RISK_TIER_CONFIG } from '@/lib/execute-risk-tier'
import { dispatchApprovalBridge } from '@/lib/execute-approval-bridge'

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

type ActionStatus = 'pending' | 'approved' | 'rejected' | 'deferred'

// Execution type badge config — shared from lib/execution-type-config.ts

type SortKey = 'urgency' | 'confidence' | 'default'
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

  // Filter/sort state
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ExecutionType | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortKey>('default')
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

  // Risk-tiered split
  const tier1Actions = useMemo(() => pendingActions.filter(a => getRiskTier(a) === 1), [pendingActions])
  const tier2Actions = useMemo(() => pendingActions.filter(a => getRiskTier(a) === 2), [pendingActions])

  // Tier 2 collapse state
  const [tier2Expanded, setTier2Expanded] = useState(false)

  // Batch selection state for Tier 1
  const [batchSelected, setBatchSelected] = useState<Set<string>>(new Set())
  const toggleBatchItem = (id: string) => setBatchSelected(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })
  const toggleBatchAll = () => {
    if (batchSelected.size === tier1Actions.length) setBatchSelected(new Set())
    else setBatchSelected(new Set(tier1Actions.map(a => a.id)))
  }
  const handleBatchApprove = () => {
    for (const id of batchSelected) {
      const a = tier1Actions.find(x => x.id === id)
      if (!a) continue
      setExecuteDecision({ actionId: a.id, actionTitle: a.title, decision: 'approved' })
      dispatchApprovalBridge(a, navigate, showToast)
    }
    setBatchSelected(new Set())
  }

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
          <motion.div variants={fadeUpVariant}><EngineBadge engine="execute" icon={Zap} label="Queue Active" className="self-start" /></motion.div>
          <h1 className="sr-only">Execute</h1>
          <motion.div variants={fadeUpVariant} data-testid="system-status-row" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
            <Lock size={10} className="text-amber-400/50 engine-text-execute" />
            <span>System Status: <span className="text-amber-400/70 engine-text-execute">{trust.autoExecutionsWithoutConsent}</span> auto-executions · You're always in control</span>
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

        {/* Risk-Tiered Queue */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-8">

          {/* Tier 1: Low-Friction Operations */}
          {tier1Actions.length > 0 && (
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    {RISK_TIER_CONFIG[1].label}
                  </h2>
                  <span className="text-[10px] font-mono text-white/30">{tier1Actions.length} items</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white/50 hover:text-white/70 transition-colors">
                    <input
                      type="checkbox"
                      checked={batchSelected.size === tier1Actions.length && tier1Actions.length > 0}
                      onChange={toggleBatchAll}
                      className="accent-amber-500 cursor-pointer"
                    />
                    Select all
                  </label>
                  {batchSelected.size > 0 && (
                    <button
                      onClick={handleBatchApprove}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-amber-600/80 engine-solid-execute text-white hover:bg-amber-600/90 transition-colors cursor-pointer"
                    >
                      Approve Selected ({batchSelected.size})
                    </button>
                  )}
                </div>
              </div>
              {tier1Actions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  fadeUpVariant={fadeUpVariant}
                  onDefer={() => {
                    setExecuteDecision({ actionId: action.id, actionTitle: action.title, decision: 'deferred' })
                    showToast({ message: 'Action dismissed', variant: 'info' })
                  }}
                  batchMode
                  batchChecked={batchSelected.has(action.id)}
                  onBatchToggle={() => toggleBatchItem(action.id)}
                />
              ))}
            </motion.div>
          )}

          {/* Tier 2: Direct Capital Movement — collapsed by default */}
          {tier2Actions.length > 0 && (
            <motion.div variants={fadeUpVariant} className="flex flex-col gap-4">
              <button
                onClick={() => setTier2Expanded(v => !v)}
                className="flex items-center gap-3 w-full text-left group"
              >
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  {RISK_TIER_CONFIG[2].label}
                </h2>
                <span className="text-[10px] font-mono text-white/30">{tier2Actions.length} items</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-amber-400/60 engine-text-execute border border-amber-400/20 px-2 py-0.5 rounded-md bg-amber-400/5 engine-bg-execute">
                  <Lock size={9} />
                  Requires individual review
                </span>
                <ChevronDown size={14} className={cn(
                  'ml-auto text-white/30 transition-transform duration-200',
                  tier2Expanded && 'rotate-180',
                )} />
              </button>
              <AnimatePresence>
                {tier2Expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden flex flex-col gap-4"
                  >
                    {tier2Actions.map((action) => (
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {pendingActions.length === 0 && (
            <motion.div variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-2xl p-8 flex items-center justify-center">
              <EmptyState
                icon={CheckCircle2}
                title="All pending actions are cleared"
                description="You can review completed and deferred items in execution history."
                accentColor="var(--state-healthy)"
                action={{ label: 'Open execution history', onClick: () => navigate('/execute/history') }}
              />
            </motion.div>
          )}

          {/* History link */}
          <motion.div variants={fadeUpVariant} className="flex">
            <Link to="/execute/history" className={cn(buttonVariants({ variant: 'glass', size: 'lg' }), 'w-full max-w-md rounded-2xl text-sm px-6 py-4 flex items-center justify-between border border-white/[0.1] hover:bg-white/[0.05] transition-all')}>
              <span className="font-semibold tracking-wide text-white/80">Review execution history</span>
              <ArrowUpRight size={18} className="text-white/40" />
            </Link>
          </motion.div>
        </motion.section>

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
  batchMode,
  batchChecked,
  onBatchToggle,
}: {
  action: ExecuteActionEntity & { status: ActionStatus }
  fadeUpVariant: import('framer-motion').Variants
  onDefer: () => void
  batchMode?: boolean
  batchChecked?: boolean
  onBatchToggle?: () => void
}) {
  const typeBadge = EXECUTION_TYPE_BADGE[action.executionType]
  const isExpiringSoon = action.expiresIn && (action.expiresIn.includes('h') && parseInt(action.expiresIn) <= 4)

  return (
    <motion.div variants={fadeUpVariant}>
      <motion.div
        className="glass-card glass-card-overlay rounded-xl p-4 md:p-6 lg:p-8 hover:border-white/[0.15] flex flex-col gap-5 transition-colors"
        style={{ borderLeftWidth: 4, borderLeftColor: ENGINE_COLOR_MAP[action.engine] }}
      >

        <div className="relative z-10 flex items-center gap-2 flex-wrap mb-1">
          {batchMode && (
            <input
              type="checkbox"
              checked={batchChecked}
              onChange={onBatchToggle}
              className="accent-amber-500 cursor-pointer mr-1"
              onClick={(e) => e.stopPropagation()}
            />
          )}
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
              isExpiringSoon ? 'text-red-400 state-text-critical' : 'text-white/40',
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
