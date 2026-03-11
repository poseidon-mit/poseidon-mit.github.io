import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Zap, CheckCircle2, Timer } from 'lucide-react'
import { Link, useRouter } from '@/router'
import { EmptyState, EngineBadge, PrioritySpotlight } from '@/components/poseidon'
import { Card, CardContent } from '@/components/ui/card'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { useDemoState } from '@/lib/demo-state/provider'
import { selectExecuteActionsView, selectSpotlightAction } from '@/domain/poseidon-universe'
import type { ExecuteActionEntity, UrgencyLevel } from '@/domain/poseidon-universe'
import { getEngineToken, fromDomainEngine } from '@/lib/engine-tokens'
import { cn } from '@/lib/utils'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

const URGENCY_ORDER: Record<UrgencyLevel, number> = { high: 0, medium: 1, low: 2 }

const URGENCY_BADGE: Record<UrgencyLevel, string> = {
  high: 'bg-red-500/10 text-red-400 border border-red-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  low: 'bg-white/[0.04] text-muted-foreground border border-white/[0.06]',
}

export default function ExecuteQueuePage() {
  usePageTitle('Action Queue')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { state } = useDemoState()
  const { navigate } = useRouter()

  const allActions = useMemo(() => selectExecuteActionsView(), [])
  const spotlightAction = useMemo(() => selectSpotlightAction(), [])

  const pendingActions = useMemo(
    () =>
      allActions
        .filter(
          (a) => (state.execute.actionStates[a.id]?.status ?? 'pending') === 'pending',
        )
        .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]),
    [allActions, state.execute.actionStates],
  )

  // Separate spotlight from remaining queue items
  const spotlightPending = spotlightAction
    ? pendingActions.find((a) => a.id === spotlightAction.id) ?? null
    : null
  const remainingActions = spotlightPending
    ? pendingActions.filter((a) => a.id !== spotlightPending.id)
    : pendingActions

  return (
    <motion.main
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 pb-12`}
      style={PAGE_CONTENT_STYLE}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.section variants={staggerContainer} className="flex flex-col gap-5">
        <div>
          <Link
            to="/execute"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Execute
          </Link>
        </div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <EngineBadge engine="execute" icon={Zap} label="Execute · Approval Queue" className="self-start" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Approval Queue
          </h1>
          <p className="text-muted-foreground text-base">
            {pendingActions.length === 0
              ? 'All actions have been reviewed.'
              : `${pendingActions.length} action${pendingActions.length !== 1 ? 's' : ''} awaiting your approval.`}
          </p>
        </motion.div>
      </motion.section>

      {/* Action list */}
      {pendingActions.length === 0 ? (
        <motion.div variants={fadeUp}>
          <div className="rounded-xl border border-border bg-card p-12 flex items-center justify-center">
            <EmptyState
              icon={CheckCircle2}
              title="Queue clear"
              description="All pending actions have been reviewed. Check execution history for past decisions."
              accentColor="var(--state-healthy)"
              action={{ label: 'View execution history', onClick: () => navigate('/execute/history') }}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          {/* Priority Spotlight — highest compositePriority action */}
          {spotlightPending && (
            <Link to={`/execute/approval?actionId=${spotlightPending.id}`} className="block">
              <PrioritySpotlight engine="execute">
                <SpotlightCard action={spotlightPending} />
              </PrioritySpotlight>
            </Link>
          )}

          {/* Separator after spotlight */}
          {spotlightPending && remainingActions.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest shrink-0">
                {remainingActions.length} more action{remainingActions.length !== 1 ? 's' : ''}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}

          {/* High/medium urgency — full width stack */}
          {remainingActions.filter(a => a.urgency !== 'low').map((action) => (
            <QueueCard key={action.id} action={action} />
          ))}

          {/* Low urgency — 2-col compact grid */}
          {remainingActions.some(a => a.urgency === 'low') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {remainingActions.filter(a => a.urgency === 'low').map((action) => (
                <CompactQueueCard key={action.id} action={action} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.main>
  )
}

/* ── Spotlight Card (expanded detail for top-priority action) ── */

function SpotlightCard({ action }: { action: ExecuteActionEntity }) {
  const token = getEngineToken(fromDomainEngine(action.engine))
  const isExpiringSoon = action.expiresIn && action.expiresIn.includes('h') && parseInt(action.expiresIn) <= 4

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
          Highest Priority
        </span>
        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest', URGENCY_BADGE[action.urgency])}>
          {action.urgency}
        </span>
        {action.expiresIn && (
          <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase', isExpiringSoon ? 'text-red-400' : 'text-muted-foreground')}>
            <Timer size={10} className={isExpiringSoon ? 'animate-pulse' : ''} />
            {action.expiresIn}
          </span>
        )}
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-foreground">{action.title}</h3>

      {/* Prominent amount */}
      <span className="text-xl font-mono font-bold" style={{ color: `var(${token.cssVar})` }}>
        {action.amountLabel}
      </span>

      <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
        <span className="font-mono text-xs">{action.id}</span>
        <span>·</span>
        <span style={{ color: `var(${token.cssVar})` }}>{action.engine}</span>
        <span>·</span>
        <span>{Math.round(action.confidence * 100)}% confidence</span>
      </div>

      <span
        className={cn(
          'self-start hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold mt-1 transition-colors',
          'bg-amber-600 text-white hover:bg-amber-700',
        )}
      >
        Review &amp; Approve
        <ArrowRight size={14} />
      </span>
    </div>
  )
}

/* ── Compact Queue Card for low-urgency items ── */

function CompactQueueCard({ action }: { action: ExecuteActionEntity }) {
  const token = getEngineToken(fromDomainEngine(action.engine))

  return (
    <Link
      to={`/execute/approval?actionId=${action.id}`}
      className="rounded-[16px] border border-border bg-card p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors border-l-2 group"
      style={{ borderLeftColor: `var(${token.cssVar})` }}
    >
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground truncate block">{action.title}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-mono font-bold" style={{ color: `var(${token.cssVar})` }}>
            {action.amountLabel}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">{action.engine}</span>
        </div>
      </div>
      <ArrowRight size={14} className="shrink-0 text-white/40 group-hover:text-[var(--engine-execute)] transition-colors" />
    </Link>
  )
}

/* ── Queue Card with urgency-based tiers ── */

function QueueCard({ action }: { action: ExecuteActionEntity }) {
  const token = getEngineToken(fromDomainEngine(action.engine))
  const isExpiringSoon = action.expiresIn && action.expiresIn.includes('h') && parseInt(action.expiresIn) <= 4
  const isFocus = action.urgency === 'high'

  return (
    <Link
      to={`/execute/approval?actionId=${action.id}`}
      className={cn(
        'rounded-[20px] border border-border bg-card flex items-center hover:bg-muted/50 transition-colors border-l-2 group block',
        isFocus ? 'p-5 gap-4' : 'p-4 gap-3',
      )}
      style={{
        borderLeftColor: `var(${token.cssVar})`,
      }}
    >
      {/* Engine dot */}
      <div
        className={cn(
          'flex items-center justify-center border shrink-0',
          isFocus ? 'h-12 w-12 rounded-xl' : 'h-10 w-10 rounded-lg',
        )}
        style={{ borderColor: `color-mix(in srgb, var(${token.cssVar}) 30%, transparent)`, background: `color-mix(in srgb, var(${token.cssVar}) 10%, transparent)` }}
      >
        <Zap size={isFocus ? 20 : 16} style={{ color: `var(${token.cssVar})` }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Primary row: title + amount + urgency */}
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <span className={cn('text-foreground truncate', isFocus ? 'text-base font-semibold' : 'text-sm font-semibold')}>{action.title}</span>
          <span className={cn(isFocus ? 'text-lg font-mono font-bold' : 'text-base font-mono font-bold')} style={{ color: `var(${token.cssVar})` }}>
            {action.amountLabel}
          </span>
          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest', URGENCY_BADGE[action.urgency])}>
            {action.urgency}
          </span>
          {action.expiresIn && (
            <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', isExpiringSoon ? 'text-red-400' : 'text-muted-foreground')}>
              <Timer size={12} className={isExpiringSoon ? 'animate-pulse' : ''} />
              {action.expiresIn}
            </span>
          )}
        </div>

        {/* Secondary meta */}
        <div className={cn('flex items-center gap-3 flex-wrap text-xs')}>
          <span className="font-mono text-muted-foreground">{action.id}</span>
          <span className="text-muted-foreground">·</span>
          <span style={{ color: `var(${token.cssVar})` }}>{action.engine}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{Math.round(action.confidence * 100)}% confidence</span>
        </div>
      </div>

      {/* CTA — hidden on mobile, card itself is the touch target */}
      {isFocus ? (
        <span
          className={cn(
            'shrink-0 hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
            'bg-amber-600 text-white hover:bg-amber-700',
          )}
        >
          Review &amp; Approve
        </span>
      ) : (
        <span
          className="shrink-0 hidden sm:inline-flex items-center gap-1.5 border border-border text-foreground hover:bg-muted/50 rounded-xl px-4 py-2 text-xs font-semibold transition-colors"
        >
          Review &amp; Approve
        </span>
      )}
    </Link>
  )
}
