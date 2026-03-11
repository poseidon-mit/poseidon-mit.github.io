/**
 * Grow Hero — "Advantage Zone" bento hero for the /grow page.
 *
 * Full-width layout with stacked area chart showing the true
 * advantage band between baseline and AI-optimized trajectories.
 *
 * Internal sub-components:
 * - HeroHeadline: big gain number + subtitle + replay button
 * - HeroChart: stacked area chart with Advantage Zone
 * - HeroKpiStrip: 3 KPI cards (savings, cohort, top action)
 */
import { useState, useMemo, useCallback } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import {
  AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ReferenceDot, ReferenceLine, Label, ResponsiveContainer,
} from 'recharts'
import { HeroBento } from './hero-bento'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/* ── Types ── */

export interface GrowGrowthAdvantageProps {
  projectedGain: number
  totalMonthlySavings: number
  avgConfidence: number
  recommendationCount: number
  simulationData: { year: string; baseline: number; aiOptimized: number }[]
  onViewRecommendations: () => void
}

/* ── Helpers ── */

const formatDollarK = (v: number) => `$${Math.round(v / 1000)}k`

/* ── Chart tooltip ── */

interface TooltipPayloadEntry {
  payload: { year: string; baseline: number; band: number }
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  if (!data) return null
  const aiOptimized = data.baseline + data.band
  return (
    <div className="rounded-xl border border-white/10 bg-[#0F1D32]/95 backdrop-blur-md px-4 py-3 shadow-md text-xs">
      <p className="font-semibold text-white/90 mb-2">{label}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#94A3B8]" />
          <span className="text-white/50">Current Path:</span>
          <span className="ml-auto font-mono text-white/90">${data.baseline.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--engine-grow)]" />
          <span className="text-white/50">Poseidon-Optimized:</span>
          <span className="ml-auto font-mono text-[var(--engine-grow)]">${aiOptimized.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

/* ── HeroHeadline ── */

function HeroHeadline({
  projectedGain,
  isOptimized,
  onOptimize,
  onReplay,
  showControls,
}: {
  projectedGain: number
  isOptimized: boolean
  onOptimize: () => void
  onReplay: () => void
  showControls: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <span
          className="text-4xl md:text-5xl font-mono font-bold tabular-nums"
          style={{ color: 'var(--engine-grow)' }}
        >
          +${projectedGain.toLocaleString()}
        </span>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-white"
            style={{ fontFamily: 'var(--font-display)' }}>
          Your 3-year advantage.
        </h2>
        <span className="text-xs font-medium uppercase tracking-widest text-white/40">
          Projected 3-year advantage
        </span>
      </div>
      {showControls && (
        !isOptimized ? (
          <button
            onClick={onOptimize}
            aria-label="See Poseidon Delta"
            className="hidden md:flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 px-3 py-2 min-h-[44px] text-xs font-semibold text-violet-400 hover:bg-violet-500/20 transition-colors engine-bg-grow engine-border-grow engine-text-grow"
          >
            See Poseidon Delta
          </button>
        ) : (
          <button
            onClick={onReplay}
            aria-label="Replay growth animation"
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 min-h-[44px] min-w-[44px] rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-[var(--engine-grow)] hover:border-[var(--engine-grow)]/30 transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        )
      )}
    </div>
  )
}

/* ── HeroChart ── */

function HeroChart({
  chartData,
  finalBaseline,
  finalAiOptimized,
  isReplaying,
  replayKey,
  isOptimized,
  totalMonthlySavings,
}: {
  chartData: { year: string; baseline: number; band: number; aiOptimized: number }[]
  finalBaseline: number
  finalAiOptimized: number
  isReplaying: boolean
  replayKey: number
  isOptimized: boolean
  totalMonthlySavings: number
}) {
  const midBandY = finalBaseline + (finalAiOptimized - finalBaseline) / 2

  /* Dynamic Y-axis domain — fills the chart area instead of wasting space */
  const { yMin, yMax, yTicks } = useMemo(() => {
    const allValues = chartData.flatMap(d => [d.baseline, d.baseline + d.band])
    const min = Math.min(...allValues)
    const max = Math.max(...allValues)
    const padding = (max - min) * 0.12
    const domainMin = Math.floor((min - padding) / 2000) * 2000
    const domainMax = Math.ceil((max + padding) / 2000) * 2000
    const step = Math.ceil((domainMax - domainMin) / 4 / 2000) * 2000
    const ticks: number[] = []
    for (let v = domainMin + step; v <= domainMax; v += step) ticks.push(v)
    return { yMin: domainMin, yMax: domainMax, yTicks: ticks }
  }, [chartData])

  return (
    <div
      className="w-full flex-1 min-h-[200px]"
      role="img"
      aria-label={`3-year growth: baseline $${finalBaseline.toLocaleString()}, AI optimized $${finalAiOptimized.toLocaleString()}, advantage +$${(finalAiOptimized - finalBaseline).toLocaleString()}`}
    >
      <ResponsiveContainer key={replayKey} width="100%" height="100%" minWidth={1}>
        <AreaChart data={chartData} margin={{ top: 20, right: 80, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="advantageZoneGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--engine-grow)" stopOpacity={0.5} />
              <stop offset="40%" stopColor="var(--engine-grow)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--engine-grow)" stopOpacity={0.02} />
            </linearGradient>
            <filter id="glowGrow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="year"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={false}
            interval={1}
          />
          <YAxis
            width={50}
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
            axisLine={false}
            tickLine={false}
            domain={[yMin, yMax]}
            ticks={yTicks}
          />

          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(139, 92, 246, 0.25)', strokeDasharray: '4 4' }} />

          {/* Layer 1: invisible baseline area (lifts the band up) */}
          <Area
            type="monotone"
            dataKey="baseline"
            stackId="advantage"
            fill="transparent"
            stroke="none"
            isAnimationActive={isReplaying}
            animationDuration={1400}
            animationEasing="ease-in-out"
          />

          {/* Layer 2: violet advantage band (delta between AI and baseline) */}
          <Area
            type="monotone"
            dataKey="band"
            stackId="advantage"
            fill="url(#advantageZoneGradient)"
            stroke="var(--engine-grow)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: 'var(--engine-grow)' }}
            isAnimationActive={isReplaying}
            animationDuration={1400}
            animationEasing="ease-in-out"
          />

          {/* Glow underlay — blurred duplicate of the AI-optimized line */}
          <Line
            type="monotone"
            dataKey="aiOptimized"
            stroke="var(--engine-grow)"
            strokeWidth={5}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            style={{ filter: 'url(#glowGrow)', opacity: 0.4 }}
            legendType="none"
          />

          {/* Layer 3: visible dashed baseline line — dots disabled to reduce noise */}
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#94A3B8"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{ r: 5, fill: '#94A3B8', strokeDasharray: 'none' }}
            isAnimationActive={false}
          />

          {/* End-value labels */}
          <ReferenceDot x={chartData[chartData.length - 1]?.year} y={finalAiOptimized} r={0} ifOverflow="extendDomain">
            <Label value={formatDollarK(finalAiOptimized)} position="right" offset={8} fill="#8B5CF6" fontSize={12} fontWeight={600} fontFamily="var(--font-mono, ui-monospace, monospace)" />
          </ReferenceDot>
          <ReferenceDot x={chartData[chartData.length - 1]?.year} y={finalBaseline} r={0} ifOverflow="extendDomain">
            <Label value={formatDollarK(finalBaseline)} position="right" offset={8} fill="#64748B" fontSize={11} fontFamily="var(--font-mono, ui-monospace, monospace)" />
          </ReferenceDot>

          {/* Poseidon Delta annotation — visible after optimize */}
          {isOptimized && (
            <ReferenceLine y={midBandY} stroke="transparent" ifOverflow="extendDomain">
              <Label
                value={`+$${totalMonthlySavings.toLocaleString()}/mo  Poseidon Delta`}
                fill="rgba(139,92,246,0.75)"
                fontSize={9}
                fontFamily="var(--font-mono, ui-monospace, monospace)"
                position="insideRight"
              />
            </ReferenceLine>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GROWTH ADVANTAGE HERO
   ═══════════════════════════════════════════════════════ */

export function GrowGrowthAdvantage({
  projectedGain,
  totalMonthlySavings,
  avgConfidence,
  recommendationCount,
  simulationData,
  onViewRecommendations,
}: GrowGrowthAdvantageProps) {
  const prefersReducedMotion = useReducedMotionSafe()
  const [isOptimized, setIsOptimized] = useState(false)
  const [chartKey, setChartKey] = useState(0)
  const isReplaying = chartKey > 0

  const handleOptimize = useCallback(() => {
    setChartKey(k => k + 1)
    setIsOptimized(true)
  }, [])

  const handleReplay = useCallback(() => {
    setIsOptimized(false)
    setChartKey(k => k + 1)
    setTimeout(() => setIsOptimized(true), 1200)
  }, [])

  const finalData = simulationData[simulationData.length - 1]

  const chartData = useMemo(
    () => simulationData.map(d => ({
      year: d.year,
      baseline: d.baseline,
      band: d.aiOptimized - d.baseline,
      aiOptimized: d.aiOptimized,
    })),
    [simulationData],
  )

  return (
    <HeroBento engine="grow" className="md:grid-cols-[2fr_3fr]">
      {/* Zone A: Action */}
      <HeroBento.Action>
        <HeroHeadline
          projectedGain={projectedGain}
          isOptimized={isOptimized}
          onOptimize={handleOptimize}
          onReplay={handleReplay}
          showControls={!prefersReducedMotion}
        />

        {/* Summary stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40 font-mono">
          <span><span style={{ color: 'var(--engine-grow)' }}>${totalMonthlySavings.toLocaleString()}/mo</span> savings</span>
          <span className="text-white/20">&middot;</span>
          <span>{recommendationCount} recommendations</span>
          <span className="text-white/20">&middot;</span>
          <span>{Math.round(avgConfidence * 100)}% avg confidence</span>
        </div>

        {/* Primary CTA */}
        <div className="pt-2">
          <button
            onClick={onViewRecommendations}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'h-auto w-full md:w-auto self-start rounded-2xl px-8 py-4 min-h-[44px]',
              'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
              'font-semibold tracking-wide text-sm',
              'hover:from-violet-400 hover:to-purple-400 transition-all',
            )}
          >
            View all {recommendationCount} recommendations <ArrowRight size={16} />
          </button>
        </div>
      </HeroBento.Action>

      {/* Zone B: Proof */}
      <HeroBento.Proof>
        <HeroChart
          chartData={chartData}
          finalBaseline={finalData?.baseline ?? 0}
          finalAiOptimized={finalData?.aiOptimized ?? 0}
          isReplaying={isReplaying && !prefersReducedMotion}
          replayKey={chartKey}
          isOptimized={isOptimized}
          totalMonthlySavings={totalMonthlySavings}
        />

      </HeroBento.Proof>
    </HeroBento>
  )
}
