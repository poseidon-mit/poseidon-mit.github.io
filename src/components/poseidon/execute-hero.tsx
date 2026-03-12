/**
 * Execute Hero — "Execution Command Deck" bento for the /execute page.
 *
 * Full 3-zone HeroBento layout:
 * - Zone A (Action): headline, hero number, urgency bar, spotlight action, CTA
 * - Zone B (Proof): execution pipeline, savings potential, cross-engine sources
 * - Zone C (Portal): navigation links to queue, savings, audit
 *
 * Empty state: celebratory queue-clear with savings stat.
 */
import { ArrowRight, CheckCircle, RotateCcw, Timer, Zap, ShieldCheck } from 'lucide-react'
import { HeroBento } from './hero-bento'
import { CountUp } from './count-up'
import { ListPortalBar } from './list-portal-bar'
import { ConfidenceIndicator } from './confidence-indicator'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ENGINE_BADGE_CLASS, ENGINE_COLOR_MAP } from '@/lib/engine-color-map'
import { EXECUTION_TYPE_BADGE } from '@/lib/execution-type-config'
import type { ExecuteEngineName, ExecutionType } from '@/domain/poseidon-universe/types'

/* ── Types ── */

export interface ExecuteHeroProps {
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
    executionType?: ExecutionType
    riskTier?: 1 | 2
  } | null

  engineSources: {
    engine: ExecuteEngineName
    count: number
    color: string
  }[]

  onReviewApproval: (() => void) | null

  // New optional props
  urgencyBreakdown?: { high: number; medium: number; low: number }
  currentSavingsUsd?: number
  potentialSavingsUsd?: number
}

/** @deprecated Use ExecuteHeroProps */
export type ExecuteApprovalCommandDeckProps = ExecuteHeroProps

/* ── Pipeline Node (local) ── */

type PipelineState = 'completed' | 'current' | 'future'

function PipelineNode({ label, detail, state, icon, tag }: {
  label: string
  detail?: string
  state: PipelineState
  icon: React.ReactNode
  tag?: string
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
      {tag && (
        <span className="ml-auto text-[9px] uppercase font-bold tracking-widest text-[var(--engine-execute)]">
          {tag}
        </span>
      )}
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
   EXECUTE HERO
   ═══════════════════════════════════════════════════════ */

export function ExecuteHero({
  queueTotal,
  urgentCount,
  agentStepsCompleted,
  agentStepsTotal,
  featuredAction,
  engineSources,
  onReviewApproval,
  urgencyBreakdown,
  currentSavingsUsd,
  potentialSavingsUsd,
}: ExecuteHeroProps) {
  const isExpiringSoon = featuredAction?.expiresIn
    && featuredAction.expiresIn.includes('h')
    && parseInt(featuredAction.expiresIn) <= 4

  const realizationPct = potentialSavingsUsd && currentSavingsUsd != null
    ? Math.round((currentSavingsUsd / potentialSavingsUsd) * 100)
    : 0

  if (!featuredAction) {
    /* ── Empty State ── */
    return (
      <HeroBento engine="execute" role="region" aria-labelledby="execute-hero-title">
        <HeroBento.Action className="md:col-span-2">
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <h2 id="execute-hero-title" className="sr-only">Execute Hero</h2>
            <div className="relative">
              <CheckCircle size={56} className="text-[var(--state-healthy)]" style={{ filter: 'drop-shadow(0 0 12px rgba(34,197,94,0.5))' }} />
              <div className="absolute inset-0 animate-ping opacity-20">
                <CheckCircle size={56} className="text-[var(--state-healthy)]" />
              </div>
            </div>
            <p className="text-3xl font-light text-white/90">Queue Clear</p>
            <p className="text-sm text-white/50">All actions approved. Your AI is standing by.</p>
            {currentSavingsUsd != null && currentSavingsUsd > 0 && (
              <p className="text-lg font-mono" style={{ color: 'var(--state-healthy)' }}>
                $<CountUp value={currentSavingsUsd} locale />/mo saved this month
              </p>
            )}
            <a
              href="/execute/history"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'default' }),
                'rounded-2xl px-6 py-3 min-h-[44px] text-sm',
                'border-white/10 text-white/60 hover:text-white hover:border-white/20',
              )}
            >
              View savings history <ArrowRight size={14} />
            </a>
          </div>
        </HeroBento.Action>
      </HeroBento>
    )
  }

  const execTypeBadge = featuredAction.executionType
    ? EXECUTION_TYPE_BADGE[featuredAction.executionType]
    : null

  return (
    <HeroBento engine="execute" role="region" aria-labelledby="execute-hero-title">
      {/* ── Zone A: Action ── */}
      <div className="flex flex-col lg:flex-row w-full">
        {/* Col 1: Hero */}
        <div className="flex flex-col gap-6 lg:gap-8 flex-1 p-6 lg:p-10 justify-center">
          {/* Editorial Headline */}
          <h2
            id="execute-hero-title"
            className="typo-display text-xl md:text-2xl lg:text-3xl text-white"
          >
            Nothing moves without your yes.
          </h2>

          {/* Hero Number */}
          <div className="flex flex-col gap-2 lg:gap-4">
            <span className="typo-hero-number text-[clamp(3.5rem,10vw,7rem)] leading-none"
                  style={{ color: 'var(--engine-execute)' }}>
              <CountUp value={queueTotal} duration={800} />
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-white/40">
              {queueTotal === 1 ? 'action' : 'actions'} pending approval
            </span>
          </div>

          {/* Urgency Distribution Bar */}
          {urgencyBreakdown && queueTotal > 0 && (
            <div className="flex flex-col gap-1.5 mt-auto lg:mt-0">
              <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.06]">
                {urgencyBreakdown.high > 0 && (
                  <div
                    className="bg-red-500 transition-all duration-600"
                    style={{ width: `${(urgencyBreakdown.high / queueTotal) * 100}%` }}
                  />
                )}
                {urgencyBreakdown.medium > 0 && (
                  <div
                    className="bg-amber-500 transition-all duration-600"
                    style={{ width: `${(urgencyBreakdown.medium / queueTotal) * 100}%` }}
                  />
                )}
                {urgencyBreakdown.low > 0 && (
                  <div
                    className="bg-slate-400 transition-all duration-600"
                    style={{ width: `${(urgencyBreakdown.low / queueTotal) * 100}%` }}
                  />
                )}
              </div>
              <span className="text-[10px] text-white/40">
                {urgencyBreakdown.high > 0 && `${urgencyBreakdown.high} urgent`}
                {urgencyBreakdown.high > 0 && urgencyBreakdown.medium > 0 && ' · '}
                {urgencyBreakdown.medium > 0 && `${urgencyBreakdown.medium} medium`}
                {(urgencyBreakdown.high > 0 || urgencyBreakdown.medium > 0) && urgencyBreakdown.low > 0 && ' · '}
                {urgencyBreakdown.low > 0 && `${urgencyBreakdown.low} low`}
              </span>
            </div>
          )}
        </div>

        {/* Col 2: Action Card */}
        <div className="flex flex-col justify-center flex-1 lg:border-l lg:border-white/5 p-6 lg:p-10 gap-6 lg:gap-8 bg-white/[0.02]">
          {/* Spotlight Action Card */}
          <div className="bg-white/[0.04] border-l-2 rounded-xl p-4 flex flex-col gap-2.5"
               style={{ borderLeftColor: ENGINE_COLOR_MAP[featuredAction.sourceEngine] ?? 'var(--engine-execute)' }}>
            {/* Row 1: Title + ExecutionType Badge */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-base font-medium text-white/90">{featuredAction.title}</p>
              {execTypeBadge && (
                <span className={cn(
                  'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border',
                  execTypeBadge.cls,
                )}>
                  {execTypeBadge.label}
                </span>
              )}
            </div>

            {/* Row 2: Amount + Confidence */}
            <div className="flex items-center gap-4">
              <span
                className="text-lg font-mono tabular-nums font-bold"
                style={{ color: 'var(--engine-execute)' }}
              >
                {featuredAction.amountLabel}
              </span>
              <ConfidenceIndicator value={featuredAction.confidence} format="percent" />
            </div>

            {/* Row 3: Expiry + Rollback + Risk Tier */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {/* Badge row */}
              <div className="flex items-center gap-2">
                <span className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest shadow-inner border border-white/[0.05]',
                  ENGINE_BADGE_CLASS[featuredAction.engine],
                )}>
                  {featuredAction.engine}
                </span>
                <span className="text-xs font-mono text-white/40">{featuredAction.id}</span>
              </div>

              {featuredAction.expiresIn && (
                <span className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase',
                  isExpiringSoon ? 'text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.5)]' : 'text-white/40',
                )}>
                  <Timer size={10} className={isExpiringSoon ? 'animate-pulse' : ''} />
                  Expires {featuredAction.expiresIn}
                </span>
              )}

              {featuredAction.rollbackHours != null && (
                <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
                  <RotateCcw size={10} />
                  {featuredAction.rollbackHours}h reversible
                </span>
              )}

              {featuredAction.riskTier != null && (
                <span className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border',
                  featuredAction.riskTier === 1
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                )}>
                  <ShieldCheck size={10} />
                  {featuredAction.riskTier === 1 ? 'Low-risk' : 'Elevated'}
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          {onReviewApproval && (
            <button
              onClick={onReviewApproval}
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'h-auto w-full md:w-auto self-end rounded-2xl px-8 py-4 min-h-[48px]',
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

        {/* Col 3: Pipeline & Stats */}
        <div className="flex flex-col gap-6 p-6 lg:p-10 lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-black/20">
          {/* Execution Pipeline */}
          <div className="bg-white/[0.02] rounded-2xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">
              Execution Pipeline
            </span>

            <PipelineNode
              label="Agent Prepared"
              detail={`${agentStepsCompleted}/${agentStepsTotal} steps completed`}
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
              tag="← YOU ARE HERE"
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

          {/* Savings Potential */}
          {potentialSavingsUsd != null && potentialSavingsUsd > 0 && (
            <div className="bg-white/[0.02] rounded-2xl p-3 flex flex-col gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Savings Potential
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-mono tabular-nums" style={{ color: 'var(--engine-execute)' }}>
                    $<CountUp value={potentialSavingsUsd} duration={1200} locale />/mo
                  </span>
                  <span className="text-[10px] text-white/40">potential</span>
                </div>
                {currentSavingsUsd != null && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-mono tabular-nums" style={{ color: 'var(--state-healthy)' }}>
                      $<CountUp value={currentSavingsUsd} duration={1200} locale />/mo
                    </span>
                    <span className="text-[10px] text-white/40">saved</span>
                  </div>
                )}
              </div>
              {currentSavingsUsd != null && (
                <div className="flex flex-col gap-1">
                  <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
                      style={{ width: `${Math.min(100, realizationPct)}%`, transition: 'width 1s ease 0.3s' }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40">{realizationPct}% realized</span>
                </div>
              )}
            </div>
          )}

          {/* Cross-Engine Sources */}
          <div className="hidden md:flex bg-white/[0.02] rounded-2xl p-3 flex-col gap-3">
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
          </div>
        </div>
      </div>

      {/* ── Zone C: Portal ── */}
      <HeroBento.Portal>
        <div className="flex items-center gap-4">
          <ListPortalBar
            engine="execute"
            label={`${queueTotal} pending action${queueTotal !== 1 ? 's' : ''}`}
            count={queueTotal}
            destination={{ type: 'route', to: '/execute/queue' }}
          />
          <ListPortalBar
            engine="execute"
            label="Savings"
            count={0}
            destination={{ type: 'route', to: '/execute/history' }}
          />
        </div>
      </HeroBento.Portal>
    </HeroBento>
  )
}

ExecuteHero.displayName = 'ExecuteHero'

/** @deprecated Use ExecuteHero */
export const ExecuteApprovalCommandDeck = ExecuteHero
