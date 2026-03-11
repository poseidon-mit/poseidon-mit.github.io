/**
 * Execute Hero — "Approval Command Deck" bento for the /execute page.
 *
 * Asymmetric 2-column layout:
 * - Left primary pane: headline + featured action spotlight + CTA + queue summary
 * - Right column: execution pipeline (top) + cross-engine sources (bottom)
 *
 * Empty state (no pending): single-column "Queue clear" message, no right column.
 */
import { ArrowRight, CheckCircle, RotateCcw, Timer, Zap } from 'lucide-react'
import { HeroBento } from './hero-bento'
import { CountUp } from './count-up'
import { ListPortalBar } from './list-portal-bar'
import { ConfidenceIndicator } from './confidence-indicator'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ENGINE_BADGE_CLASS } from '@/lib/engine-color-map'
import type { ExecuteEngineName } from '@/domain/poseidon-universe/types'

/* ── Types ── */

export interface ExecuteApprovalCommandDeckProps {
  queueTotal: number
  urgentCount: number
  agentStepsCompleted: number
  agentStepsTotal: number

  featuredAction: {
    id: string
    title: string
    amountLabel: string
    confidence: number
    engine: ExecuteEngineName
    sourceEngine: ExecuteEngineName
    expiresIn: string | null
    rollbackHours: number | null
  } | null

  engineSources: {
    engine: ExecuteEngineName
    count: number
    color: string
  }[]

  onReviewApproval: (() => void) | null
}

/* ── Pipeline Node (local, not exported) ── */

type PipelineState = 'completed' | 'current' | 'future'

function PipelineNode({ label, detail, state, icon }: {
  label: string
  detail?: string
  state: PipelineState
  icon: React.ReactNode
}) {
  const stateStyles: Record<PipelineState, string> = {
    completed: 'border-[var(--state-healthy)]/30 bg-[var(--state-healthy)]/10 text-[var(--state-healthy)]',
    current: 'border-[var(--engine-execute)]/40 bg-[var(--engine-execute)]/15 text-[var(--engine-execute)]',
    future: 'border-white/10 bg-white/[0.02] text-white/30',
  }

  return (
    <div className={cn(
      'flex items-center gap-2 rounded-xl px-3 py-2 border',
      stateStyles[state],
    )}>
      <span className="shrink-0">{icon}</span>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium truncate">{label}</span>
        {detail && <span className="text-[10px] opacity-60">{detail}</span>}
      </div>
    </div>
  )
}

function PipelineConnector({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex justify-center py-0.5">
      <div className="w-0.5 h-4 rounded-full" style={{
        background: `linear-gradient(to bottom, ${from}, ${to})`,
      }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   APPROVAL COMMAND DECK HERO
   ═══════════════════════════════════════════════════════ */

export function ExecuteApprovalCommandDeck({
  queueTotal,
  urgentCount,
  agentStepsCompleted,
  agentStepsTotal,
  featuredAction,
  engineSources,
  onReviewApproval,
}: ExecuteApprovalCommandDeckProps) {
  const isExpiringSoon = featuredAction?.expiresIn
    && featuredAction.expiresIn.includes('h')
    && parseInt(featuredAction.expiresIn) <= 4

  return featuredAction ? (
    <HeroBento engine="execute" role="region" aria-labelledby="execute-hero-title">
      <HeroBento.Action>
        {/* Hero Number */}
        <span className="typo-hero-number text-4xl md:text-5xl"
              style={{ color: 'var(--engine-execute)' }}>
          <CountUp value={queueTotal} />
        </span>

        {/* Editorial Headline */}
        <h2
          id="execute-hero-title"
          className="typo-display text-xl md:text-2xl lg:text-3xl text-white"
        >
          Nothing moves without your yes.
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-white/50">
          {queueTotal === 1 ? '1 action' : `${queueTotal} actions`} pending your approval
        </p>

        {/* Featured Action detail */}
        <div className="flex flex-col gap-3 mt-1">
          {/* Badge row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest shadow-inner border border-white/[0.05]',
              ENGINE_BADGE_CLASS[featuredAction.engine],
            )}>
              {featuredAction.engine}
            </span>
            <span className="text-xs font-mono text-white/40">{featuredAction.id}</span>
            {featuredAction.expiresIn && (
              <span className={cn(
                'inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase',
                isExpiringSoon ? 'text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.5)]' : 'text-white/40',
              )}>
                <Timer size={10} className={isExpiringSoon ? 'animate-pulse' : ''} />
                Expires {featuredAction.expiresIn}
              </span>
            )}
          </div>

          {/* Title */}
          <p className="text-lg md:text-xl font-medium text-white/90">
            {featuredAction.title}
          </p>

          {/* Amount + Confidence */}
          <div className="flex items-center gap-4">
            <span
              className="text-2xl font-mono tabular-nums font-bold"
              style={{ color: 'var(--engine-execute)' }}
            >
              {featuredAction.amountLabel}
            </span>
            <ConfidenceIndicator value={featuredAction.confidence} format="percent" />
          </div>

          {/* CTA */}
          {onReviewApproval && (
            <button
              onClick={onReviewApproval}
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'h-auto w-full md:w-auto self-start rounded-2xl px-8 py-4 min-h-[44px] mt-2',
                'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950',
                'font-semibold tracking-wide text-sm',
                'hover:from-amber-400 hover:to-yellow-400 transition-all',
                'flex items-center justify-center gap-2',
              )}
            >
              Review &amp; Approve <ArrowRight size={16} />
            </button>
          )}
        </div>
      </HeroBento.Action>

      <HeroBento.Proof>
        {/* Execution Pipeline */}
        <div className="bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">
            Execution Pipeline
          </span>

          <PipelineNode
            label="Agent Prepared"
            detail={`${agentStepsCompleted}/${agentStepsTotal} steps`}
            state={agentStepsCompleted > 0 ? 'completed' : 'future'}
            icon={<CheckCircle size={14} />}
          />
          <PipelineConnector
            from={agentStepsCompleted > 0 ? 'var(--state-healthy)' : 'rgba(255,255,255,0.1)'}
            to="var(--engine-execute)"
          />
          <PipelineNode
            label="Your Approval"
            state="current"
            icon={<Zap size={14} className="animate-pulse" />}
          />
          <PipelineConnector
            from="var(--engine-execute)"
            to="rgba(255,255,255,0.1)"
          />
          <PipelineNode
            label="Govern Logged"
            state="future"
            icon={<CheckCircle size={14} />}
          />
        </div>

        {/* Cross-Engine Sources */}
        <div className="bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Cross-Engine Sources
          </span>
          <div className="flex flex-col gap-2">
            {engineSources.map(({ engine, count, color }) => (
              <div key={engine} className="flex items-center gap-2 text-xs text-white/60">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span>{engine}</span>
                <span className="ml-auto font-mono text-white/40">{count}</span>
              </div>
            ))}
          </div>
          {featuredAction.rollbackHours != null && (
            <div className="flex items-center gap-2 text-xs text-white/40 mt-1 pt-2 border-t border-white/[0.06]">
              <RotateCcw size={12} />
              <span>{featuredAction.rollbackHours}h reversible</span>
            </div>
          )}
        </div>
      </HeroBento.Proof>

      <HeroBento.Portal>
        <ListPortalBar
          engine="execute"
          label={`${queueTotal} pending action${queueTotal !== 1 ? 's' : ''}`}
          count={queueTotal}
          destination={{ type: 'route', to: '/execute/queue' }}
        />
      </HeroBento.Portal>
    </HeroBento>
  ) : (
    /* ── Empty State ── */
    <HeroBento engine="execute" role="region" aria-labelledby="execute-hero-title">
      <HeroBento.Action className="md:col-span-2">
        <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
          <h2
            id="execute-hero-title"
            className="sr-only"
          >
            Execute Hero
          </h2>
          <CheckCircle size={40} className="text-[var(--state-healthy)]" />
          <p className="text-xl font-light text-white/90">Queue clear</p>
          <p className="text-sm text-white/50">Your financial AI is standing by.</p>
        </div>
      </HeroBento.Action>
    </HeroBento>
  )
}

ExecuteApprovalCommandDeck.displayName = 'ExecuteApprovalCommandDeck'
