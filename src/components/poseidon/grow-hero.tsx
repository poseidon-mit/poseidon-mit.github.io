import { useMemo, useState } from 'react'
import { ArrowRight, RotateCcw, Sparkles, Users } from 'lucide-react'
import { ListPortalBar } from './list-portal-bar'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import {
  HeroBackdrop,
  HeroEyebrow,
  HeroMetricPill,
  HeroPanel,
} from './hero-concept-primitives'

export interface GrowHeroProps {
  projectedGain: number
  totalMonthlySavings: number
  avgConfidence: number
  recommendationCount: number
  simulationData: {
    year: string
    baseline: number
    aiOptimized: number
    low?: number
    high?: number
  }[]
  onViewRecommendations: () => void
  spotlightRec?: {
    title: string
    monthlySavings: number
    confidence: number
  } | null
  goals?: {
    id: string
    title: string
    currentUsd: number
    targetUsd: number
  }[]
  cohortHeadline?: string
}

export type GrowGrowthAdvantageProps = GrowHeroProps

function money(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })
}

function GoalProgress({
  title,
  currentUsd,
  targetUsd,
}: {
  title: string
  currentUsd: number
  targetUsd: number
}) {
  const pct = Math.max(
    0,
    Math.min(100, Math.round((currentUsd / Math.max(targetUsd, 1)) * 100)),
  )

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white">{title}</p>
        <span className="font-mono text-xs text-[var(--engine-grow)]">{pct}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-[var(--engine-grow)] shadow-[0_0_16px_rgba(139,92,246,0.45)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-white/45">
        ${money(currentUsd)} of ${money(targetUsd)}
      </p>
    </div>
  )
}

function CompoundTerrain({
  data,
  showDelta,
  reducedMotion,
  replayKey,
}: {
  data: GrowHeroProps['simulationData']
  showDelta: boolean
  reducedMotion: boolean
  replayKey: number
}) {
  const [activeIndex, setActiveIndex] = useState(Math.max(data.length - 1, 0))
  const width = 820
  const height = 280
  const allValues = data.flatMap((point) => [point.baseline, point.aiOptimized, point.low ?? point.aiOptimized, point.high ?? point.aiOptimized])
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)

  const normalized = useMemo(
    () =>
      data.map((point, index) => {
        const x = (index / Math.max(data.length - 1, 1)) * width
        const baselineY =
          height - ((point.baseline - min) / Math.max(max - min, 1)) * (height - 70) - 32
        const optimizedY =
          height - ((point.aiOptimized - min) / Math.max(max - min, 1)) * (height - 70) - 32
        const lowY =
          height - (((point.low ?? point.aiOptimized) - min) / Math.max(max - min, 1)) * (height - 70) - 32
        const highY =
          height - (((point.high ?? point.aiOptimized) - min) / Math.max(max - min, 1)) * (height - 70) - 32
        return { x, baselineY, optimizedY, lowY, highY }
      }),
    [data, height, max, min, width],
  )

  const baselinePoints = normalized.map((point) => `${point.x},${point.baselineY}`).join(' ')
  const optimizedPoints = normalized.map((point) => `${point.x},${point.optimizedY}`).join(' ')
  const vaporArea = normalized
    .map((point) => `${point.x},${point.highY}`)
    .concat([...normalized].reverse().map((point) => `${point.x},${point.lowY}`))
    .join(' ')
  const activePoint = normalized[activeIndex] ?? normalized[normalized.length - 1]
  const activeData = data[activeIndex] ?? data[data.length - 1]

  return (
    <HeroPanel
      className="relative overflow-hidden px-4 py-4 md:px-5"
      onMouseMove={(event) => {
        if (reducedMotion || data.length <= 1) return
        const rect = event.currentTarget.getBoundingClientRect()
        const ratio = (event.clientX - rect.left) / Math.max(rect.width, 1)
        setActiveIndex(Math.max(0, Math.min(data.length - 1, Math.round(ratio * (data.length - 1)))))
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />
      <div
        className={cn(
          'absolute inset-x-[12%] top-1/3 h-28 rounded-full blur-3xl opacity-35',
          showDelta && !reducedMotion && 'animate-[pulse_8s_ease-in-out_infinite]',
        )}
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(139,92,246,0.28), transparent)',
        }}
      />

      <svg
        key={replayKey}
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-10 h-[250px] w-full"
        role="img"
        aria-label={`3-year growth outlook from $${money(data[0]?.baseline ?? 0)} to $${money(data[data.length - 1]?.aiOptimized ?? 0)} optimized versus $${money(data[data.length - 1]?.baseline ?? 0)} baseline`}
      >
        <defs>
          <linearGradient id="grow-optimized-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(139,92,246,0.5)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.95)" />
          </linearGradient>
          <linearGradient id="grow-vapor-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(139,92,246,0.28)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.03)" />
          </linearGradient>
          <filter id="grow-vapor-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0.2, 0.45, 0.7].map((line) => (
          <line
            key={line}
            x1="0"
            y1={height * line}
            x2={width}
            y2={height * line}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 8"
          />
        ))}

        {showDelta && (
          <polygon
            points={vaporArea}
            fill="url(#grow-vapor-fill)"
            filter="url(#grow-vapor-glow)"
            className={cn(!reducedMotion && 'animate-[pulse_10s_ease-in-out_infinite]')}
          />
        )}

        <polyline
          points={baselinePoints}
          fill="none"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="3"
          strokeDasharray="5 10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={optimizedPoints}
          fill="none"
          stroke="url(#grow-optimized-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {activePoint && (
          <>
            <line
              x1={activePoint.x}
              y1="0"
              x2={activePoint.x}
              y2={height}
              stroke="rgba(255,255,255,0.22)"
              strokeDasharray="4 6"
            />
            <circle cx={activePoint.x} cy={activePoint.optimizedY} r="6" fill="var(--engine-grow)" />
            <circle cx={activePoint.x} cy={activePoint.baselineY} r="5" fill="rgba(255,255,255,0.7)" />
          </>
        )}
      </svg>

      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-white/35">
        <span>Baseline path</span>
        <span>{activeData?.year ?? 'Now'}</span>
        <span>Optimized arc</span>
      </div>

      {activeData && (
        <div className="relative z-10 mt-4 flex flex-wrap gap-3">
          <HeroMetricPill label="Baseline" value={`$${money(activeData.baseline)}`} />
          <HeroMetricPill
            label="Optimized"
            value={`$${money(activeData.aiOptimized)}`}
            tone="var(--engine-grow)"
          />
          <HeroMetricPill
            label="Delta"
            value={`+$${money(Math.max(activeData.aiOptimized - activeData.baseline, 0))}`}
            tone="var(--engine-grow)"
          />
        </div>
      )}
    </HeroPanel>
  )
}

export function GrowHero({
  projectedGain,
  totalMonthlySavings,
  avgConfidence,
  recommendationCount,
  simulationData,
  onViewRecommendations,
  spotlightRec,
  goals,
  cohortHeadline,
}: GrowHeroProps) {
  const reducedMotion = useReducedMotionSafe()
  const [showDelta, setShowDelta] = useState(reducedMotion)
  const [replayKey, setReplayKey] = useState(0)

  return (
    <section
      role="region"
      aria-labelledby="grow-hero-title"
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#08101d]"
    >
      <HeroBackdrop
        accent="var(--engine-grow)"
        secondaryAccent="var(--engine-dashboard)"
        reducedMotion={reducedMotion}
      />

      <div className="relative z-10 flex min-h-[65vh] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <div className="grid flex-1 gap-8 xl:grid-cols-[0.96fr_1.04fr] xl:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <HeroEyebrow>
                <Sparkles className="h-3.5 w-3.5 text-[var(--engine-grow)]" />
                Grow horizon live
              </HeroEyebrow>
              <HeroEyebrow className="text-white/52">
                {recommendationCount} ranked opportunities
              </HeroEyebrow>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-white/38">
                Compound horizon
              </p>
              <h2
                id="grow-hero-title"
                aria-label="Compound horizon"
                className="mt-4 text-[clamp(2.7rem,8vw,5.6rem)] font-semibold leading-none tracking-[-0.06em] text-white"
              >
                COMPOUND
                <br />
                HORIZON
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/58">
                Selector-ranked capital moves reshape the forward path, then the terrain view
                shows what changes when idle cash starts compounding with intent.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <HeroMetricPill
                label="Annual upside"
                value={`+$${money(projectedGain)}/yr`}
                tone="var(--engine-grow)"
              />
              <HeroMetricPill label="Monthly lift" value={`+$${money(totalMonthlySavings)}/mo`} />
              <HeroMetricPill label="Average confidence" value={`${Math.round(avgConfidence * 100)}%`} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onViewRecommendations}
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'min-h-[48px] rounded-full bg-[var(--engine-grow)] px-7 text-white hover:bg-[var(--engine-grow)]/90',
                )}
              >
                View all opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>

              {!reducedMotion && !showDelta && (
                <button
                  type="button"
                  onClick={() => setShowDelta(true)}
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'min-h-[48px] rounded-full border-white/15 bg-white/[0.03] px-7 text-white/80 hover:bg-white/[0.08]',
                  )}
                >
                  See Poseidon delta
                </button>
              )}

              {!reducedMotion && showDelta && (
                <button
                  type="button"
                  onClick={() => setReplayKey((value) => value + 1)}
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'min-h-[48px] rounded-full border-white/15 bg-white/[0.03] px-7 text-white/80 hover:bg-white/[0.08]',
                  )}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Replay
                </button>
              )}
            </div>
          </div>

          <CompoundTerrain
            data={simulationData}
            showDelta={showDelta}
            reducedMotion={reducedMotion}
            replayKey={replayKey}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <HeroPanel className="px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Top recommendation
            </p>
            {spotlightRec ? (
              <div className="mt-4 space-y-3">
                <p className="text-xl font-semibold text-white">{spotlightRec.title}</p>
                <div className="flex flex-wrap gap-3 text-xs text-white/45">
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    +${money(spotlightRec.monthlySavings)}/mo
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {Math.round(spotlightRec.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/55">
                No recommendation is currently prioritized.
              </p>
            )}

            {cohortHeadline && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm leading-7 text-white/58">
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                  <Users className="h-3.5 w-3.5" />
                  Cohort signal
                </div>
                {cohortHeadline}
              </div>
            )}
          </HeroPanel>

          <HeroPanel className="px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Goal progress</p>
            <div className="mt-4 space-y-3">
              {goals?.slice(0, 2).map((goal) => (
                <GoalProgress key={goal.id} {...goal} />
              ))}
              {!goals?.length && (
                <p className="text-sm text-white/55">
                  No goals are currently connected to the Grow engine.
                </p>
              )}
            </div>
          </HeroPanel>
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-2">
          <ListPortalBar
            engine="grow"
            label="Scenario lab"
            count={recommendationCount}
            destination={{ type: 'route', to: '/grow/scenarios' }}
          />
          <ListPortalBar
            engine="grow"
            label="Goal tracking"
            count={goals?.length ?? 0}
            destination={{ type: 'route', to: '/grow/goal' }}
          />
        </div>
      </div>
    </section>
  )
}

export const GrowGrowthAdvantage = GrowHero
