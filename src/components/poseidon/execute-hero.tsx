import { ArrowRight, CheckCircle2, ShieldCheck, Timer } from 'lucide-react'
import { HourglassLock } from './effects/HourglassLock'
import { ListPortalBar } from './list-portal-bar'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type {
  ExecuteEngineName,
  ExecutionType,
} from '@/domain/poseidon-universe/types'
import {
  HeroBackdrop,
  HeroEyebrow,
  HeroMetricPill,
  HeroPanel,
} from './hero-concept-primitives'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

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
  urgencyBreakdown?: { high: number; medium: number; low: number }
  currentSavingsUsd?: number
  potentialSavingsUsd?: number
}

export type ExecuteApprovalCommandDeckProps = ExecuteHeroProps

function SourcePill({
  engine,
  count,
  color,
}: {
  engine: ExecuteEngineName
  count: number
  color: string
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
      style={{ boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 16%, transparent)` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {engine} {count}
    </span>
  )
}

function RoutingField({
  queueTotal,
  reducedMotion,
}: {
  queueTotal: number
  reducedMotion: boolean
}) {
  return (
    <HeroPanel className="relative overflow-hidden px-6 py-6">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_36%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/35">
          <span>Incoming</span>
          <span>Your gate</span>
          <span>Cleared</span>
        </div>

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="space-y-3">
            {Array.from({ length: Math.min(queueTotal, 3) }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70"
              >
                Queue lane {index + 1}
              </div>
            ))}
          </div>

          <div className="relative flex justify-center">
            <div
              className={cn(
                'absolute left-1/2 top-1/2 h-px w-[min(36vw,220px)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[rgba(245,158,11,0.7)] to-transparent',
                !reducedMotion && 'animate-[pulse_3.4s_ease-in-out_infinite]',
              )}
            />
            <div
              className={cn(
                'absolute left-1/2 top-1/2 h-px w-[min(36vw,220px)] -translate-y-1/2 bg-gradient-to-r from-transparent via-[rgba(245,158,11,0.65)] to-transparent',
                !reducedMotion && 'animate-[pulse_4.2s_ease-in-out_infinite]',
              )}
              style={{ transform: 'translateX(-100%) translateY(-50%)' }}
            />
            <div className="relative z-10 flex h-[220px] w-[220px] items-center justify-center rounded-[36px] border border-[rgba(245,158,11,0.2)] bg-black/50 shadow-[0_0_50px_rgba(245,158,11,0.16)]">
              <HourglassLock count={queueTotal} />
            </div>
          </div>

          <div className="space-y-3 text-right">
            {['AUD trail armed', 'Consent required', 'Rollback retained'].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </HeroPanel>
  )
}

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
  const reducedMotion = useReducedMotionSafe()

  if (!featuredAction) {
    return (
      <section
        role="region"
        aria-labelledby="execute-hero-title"
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#110d08]"
      >
        <HeroBackdrop
          accent="var(--engine-execute)"
          secondaryAccent="var(--engine-protect)"
          reducedMotion={reducedMotion}
        />
        <div className="relative z-10 flex min-h-[65vh] flex-col items-center justify-center gap-6 px-6 py-10 text-center">
          <CheckCircle2 className="h-14 w-14 text-[var(--engine-protect)]" />
          <h2
            id="execute-hero-title"
            className="text-4xl font-semibold tracking-[-0.04em] text-white"
          >
            Queue Clear
          </h2>
          <p className="max-w-2xl text-base leading-8 text-white/55">
            Poseidon has no actions waiting for consent. The command deck is clear and audit
            logging remains active.
          </p>
          {currentSavingsUsd != null && (
            <p className="rounded-full border border-white/10 px-4 py-2 font-mono text-sm text-white/70">
              Current monthly lift: ${currentSavingsUsd.toLocaleString()}
            </p>
          )}
        </div>
      </section>
    )
  }

  const realizationPct =
    potentialSavingsUsd && currentSavingsUsd != null && potentialSavingsUsd > 0
      ? Math.round((currentSavingsUsd / potentialSavingsUsd) * 100)
      : null

  return (
    <section
      role="region"
      aria-labelledby="execute-hero-title"
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#100d08]"
    >
      <HeroBackdrop
        accent="var(--engine-execute)"
        secondaryAccent="var(--engine-govern)"
        reducedMotion={reducedMotion}
      />
      <div className="relative z-10 flex min-h-[65vh] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <div className="grid flex-1 gap-8 xl:grid-cols-[0.94fr_1.06fr] xl:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <HeroEyebrow>Human authorization required</HeroEyebrow>
              <HeroEyebrow className="text-white/52">
                {queueTotal} live queue item{queueTotal === 1 ? '' : 's'}
              </HeroEyebrow>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-white/38">Consent gate</p>
              <h2
                id="execute-hero-title"
                className="mt-4 text-[clamp(2.7rem,8vw,5.3rem)] font-semibold leading-none tracking-[-0.06em] text-white"
              >
                CONSENT
                <br />
                GATE
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/58">
                Money does not move until your approval closes the gate. The stage below keeps
                the incoming queue, consent surface, and governed outcome in one line of sight.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <HeroMetricPill label="Queue" value={`${queueTotal} pending`} tone="var(--engine-execute)" />
              <HeroMetricPill label="Urgent" value={`${urgentCount} time-sensitive`} />
              <HeroMetricPill label="Prepared" value={`${agentStepsCompleted}/${agentStepsTotal} steps`} />
            </div>

            <HeroPanel className="px-5 py-5">
              <div className="flex flex-wrap items-center gap-3">
                <HeroEyebrow className="font-mono text-white/46">{featuredAction.id}</HeroEyebrow>
                <HeroEyebrow>{Math.round(featuredAction.confidence * 100)}% confidence</HeroEyebrow>
                {featuredAction.rollbackHours != null && (
                  <HeroEyebrow>{featuredAction.rollbackHours}h reversible</HeroEyebrow>
                )}
              </div>

              <p className="mt-5 text-2xl font-semibold text-white md:text-3xl">
                {featuredAction.title}
              </p>
              <p className="mt-3 text-lg font-mono text-[var(--engine-execute)]">
                {featuredAction.amountLabel}
              </p>

              {featuredAction.expiresIn && (
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--state-warning)]">
                  <Timer className="h-4 w-4" />
                  Expires in {featuredAction.expiresIn}
                </p>
              )}

              {onReviewApproval && (
                <button
                  type="button"
                  onClick={onReviewApproval}
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'lg' }),
                    'mt-6 min-h-[48px] rounded-full bg-[var(--engine-execute)] px-7 text-slate-950 hover:bg-[var(--engine-execute)]/90',
                  )}
                >
                  Review & Approve
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </HeroPanel>
          </div>

          <div className="flex flex-col gap-5">
            <RoutingField queueTotal={queueTotal} reducedMotion={reducedMotion} />

            <HeroPanel className="px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                Execution posture
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
                  <p className="text-sm text-white">Agent prepared</p>
                  <p className="mt-2 font-mono text-xs text-white/45">
                    {agentStepsCompleted}/{agentStepsTotal} steps completed
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
                  <p className="text-sm text-white">Urgent actions</p>
                  <p className="mt-2 font-mono text-xs text-white/45">
                    {urgentCount} currently time-sensitive
                  </p>
                </div>
                {urgencyBreakdown && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
                    <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      {urgencyBreakdown.high > 0 && (
                        <div
                          className="bg-[var(--state-critical)]"
                          style={{ width: `${(urgencyBreakdown.high / Math.max(queueTotal, 1)) * 100}%` }}
                        />
                      )}
                      {urgencyBreakdown.medium > 0 && (
                        <div
                          className="bg-[var(--engine-execute)]"
                          style={{ width: `${(urgencyBreakdown.medium / Math.max(queueTotal, 1)) * 100}%` }}
                        />
                      )}
                      {urgencyBreakdown.low > 0 && (
                        <div
                          className="bg-white/30"
                          style={{ width: `${(urgencyBreakdown.low / Math.max(queueTotal, 1)) * 100}%` }}
                        />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-white/45">
                      High / Medium / Low: {urgencyBreakdown.high} / {urgencyBreakdown.medium} / {urgencyBreakdown.low}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Cross-engine sources
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {engineSources.map((source) => (
                    <SourcePill key={source.engine} {...source} />
                  ))}
                </div>
              </div>

              {(currentSavingsUsd != null || potentialSavingsUsd != null) && (
                <div className="mt-6 border-t border-white/10 pt-6 text-sm text-white/60">
                  <p className="inline-flex items-center gap-2 text-white/75">
                    <ShieldCheck className="h-4 w-4 text-[var(--engine-execute)]" />
                    You&apos;re always in control.
                  </p>
                  {realizationPct != null && (
                    <p className="mt-2 text-xs text-white/45">
                      Realized optimization: {realizationPct}% of modeled monthly potential.
                    </p>
                  )}
                </div>
              )}
            </HeroPanel>
          </div>
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-3">
          <ListPortalBar
            engine="execute"
            label="Approval queue"
            count={queueTotal}
            destination={{ type: 'route', to: '/execute/queue' }}
          />
          <ListPortalBar
            engine="execute"
            label="Savings history"
            count={Math.max(0, Math.round(currentSavingsUsd ?? 0))}
            destination={{ type: 'route', to: '/execute/history' }}
          />
          <ListPortalBar
            engine="govern"
            label="Audit trail"
            count={queueTotal}
            destination={{ type: 'route', to: '/govern/audit' }}
          />
        </div>
      </div>
    </section>
  )
}

export const ExecuteApprovalCommandDeck = ExecuteHero
