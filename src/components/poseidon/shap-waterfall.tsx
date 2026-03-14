/**
 * ShapWaterfall — SHAP feature attribution waterfall chart.
 *
 * Two variants:
 *   - "chart" (default): SVG vertical waterfall (desktop) + Recharts horizontal bar (mobile).
 *     Used on detail/approval pages where space is available.
 *   - "inline": Compact div-based horizontal bars with labels.
 *     Used inside hero cards where vertical space is tight.
 *
 * Dark-theme optimized.
 */
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { getEngineToken, type EngineName } from '@/lib/engine-tokens'

export interface ShapFactor {
  name?: string
  label?: string
  value: number
}

export interface ShapWaterfallProps {
  factors: ShapFactor[]
  baseValue?: number
  finalValue?: number
  engine?: EngineName
  className?: string
  /** "chart" = SVG waterfall (default), "inline" = compact div bars */
  variant?: 'chart' | 'inline'
}

/* ── Inline variant (compact div-based bars) ── */
function InlineWaterfall({
  factors,
  baseValue = 0,
  finalValue,
  engine = 'protect',
  className,
}: Omit<ShapWaterfallProps, 'variant'>) {
  const engineTokens = getEngineToken(engine)
  const finalScoreColor = engineTokens.color

  const sortedFactors = useMemo(() => {
    const resolved = factors.map(f => ({ label: f.label ?? f.name ?? '', value: f.value }))
    const pos = resolved.filter(f => f.value >= 0).sort((a, b) => b.value - a.value)
    const neg = resolved.filter(f => f.value < 0).sort((a, b) => a.value - b.value)
    return [...pos, ...neg]
  }, [factors])

  const rawSum = sortedFactors.reduce((acc, f) => acc + f.value, 0)
  const targetOutput = finalValue !== undefined ? finalValue : baseValue + rawSum
  const targetSum = targetOutput - baseValue
  const scale = rawSum !== 0 && finalValue !== undefined ? targetSum / rawSum : 1

  let cursor = baseValue
  const segments = sortedFactors.map(f => {
    const scaledDelta = f.value * scale
    const start = cursor
    const end = cursor + scaledDelta
    cursor = end
    return { label: f.label, rawValue: f.value, scaledDelta, start, end, isMitigating: f.value < 0 }
  })

  let domainMin = Math.min(baseValue, targetOutput)
  let domainMax = Math.max(baseValue, targetOutput)
  for (const seg of segments) {
    domainMin = Math.min(domainMin, seg.start, seg.end)
    domainMax = Math.max(domainMax, seg.start, seg.end)
  }
  const domainRange = domainMax - domainMin
  const padding = domainRange * 0.05 || 0.1
  const renderMin = domainMin - padding
  const renderMax = domainMax + padding
  const renderRange = renderMax - renderMin

  const getPercent = (v: number) => Math.max(0, Math.min(100, ((v - renderMin) / renderRange) * 100))

  const formatVal = (v: number, isDelta: boolean) => {
    const val = v * 100
    const fixed = Math.abs(val) < 10 ? val.toFixed(1) : val.toFixed(0)
    const sign = isDelta && v > 0 ? '+' : (isDelta && v < 0 ? '\u2212' : '')
    return `${sign}${Math.abs(Number(fixed))}%`
  }

  return (
    <div className={cn('w-full flex flex-col', className)} role="img" aria-label="SHAP Feature Attribution Waterfall">
      <div className="flex w-full overflow-hidden text-sm">
        <div className="flex-1 w-full space-y-3 min-w-0">
          {segments.map((seg, i) => {
            const leftPct = getPercent(Math.min(seg.start, seg.end))
            const widthPct = Math.abs(getPercent(seg.end) - getPercent(seg.start))
            const isNeg = seg.isMitigating
            const fillClass = isNeg
              ? 'bg-blue-500/20 border border-blue-500/40 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]'
              : 'bg-rose-500/20 border border-rose-500/40 shadow-[inset_0_0_10px_rgba(244,63,94,0.1)]'
            const textClass = isNeg ? 'text-blue-400 group-hover:text-blue-300' : 'text-rose-400 group-hover:text-rose-300'
            const textAnchor = isNeg ? 'right' : 'left'

            return (
              <div key={`${seg.label}-${i}`} className="flex items-start group relative min-h-[32px]">
                <div className="w-[110px] sm:w-[160px] md:w-[200px] shrink-0 text-[11px] text-white/60 pr-3 sm:pr-4 text-right font-medium leading-[1.35] opacity-80 group-hover:opacity-100 transition-opacity py-1.5 truncate" title={seg.label}>
                  {seg.label}
                </div>
                <div className="flex-1 relative h-[32px]">
                  <div className="absolute border-l border-dashed border-white/10 -top-2 h-3 z-0" style={{ left: `${getPercent(seg.start)}%` }} />
                  <div className="absolute top-0 bottom-0 border-l border-white/5 border-dashed pointer-events-none" style={{ left: `${getPercent(0)}%` }} />
                  <div className="absolute top-0 bottom-0 border-l border-white/5 border-dashed pointer-events-none" style={{ left: `${getPercent(targetOutput)}%` }} />
                  <div className={cn("absolute h-[22px] top-1 rounded-sm z-10 transition-all duration-300 hover:brightness-125", fillClass)} style={{ left: `${leftPct}%`, width: `${Math.max(0.5, widthPct)}%` }} />
                  <div
                    className={cn("absolute top-1/2 -translate-y-[45%] font-mono text-[10px] z-20 whitespace-nowrap transition-colors font-semibold tracking-wider", textClass)}
                    style={{ [textAnchor]: textAnchor === 'left' ? `calc(${getPercent(seg.end)}% + 8px)` : `calc(${100 - getPercent(seg.end)}% + 8px)` }}
                  >
                    {formatVal(seg.rawValue, true)}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Final Output Row */}
          <div className="flex items-center group relative h-12 mt-4 pt-3 pb-3 border-t border-white/[0.06]">
            <div className="w-[110px] sm:w-[160px] md:w-[200px] shrink-0 text-[11px] font-bold text-white pr-3 sm:pr-4 text-right uppercase tracking-widest">
              Risk Score
            </div>
            <div className="flex-1 relative h-full">
              {segments.length > 0 && (
                <div className="absolute border-l border-dashed border-white/20 -top-[18px] h-[30px] z-0" style={{ left: `${getPercent(segments[segments.length - 1].end)}%` }} />
              )}
              <div className="absolute top-0 bottom-0 border-l border-white/5 border-dashed pointer-events-none" style={{ left: `${getPercent(0)}%` }} />
              <div
                className="absolute h-[28px] top-1 rounded-sm bg-white/10 transition-all duration-500"
                style={{
                  left: `${getPercent(Math.min(0, targetOutput))}%`,
                  width: `${Math.abs(getPercent(targetOutput) - getPercent(0))}%`,
                  borderColor: finalScoreColor,
                  borderWidth: '1px',
                  boxShadow: `inset 0 0 16px ${finalScoreColor}30, 0 0 12px ${finalScoreColor}20`,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-[40%] font-mono text-xs font-bold tracking-wider"
                style={{
                  left: `calc(${getPercent(targetOutput)}% + 10px)`,
                  color: finalScoreColor,
                  textShadow: `0 0 10px ${finalScoreColor}80`,
                }}
              >
                {formatVal(targetOutput, false)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main component ── */
export function ShapWaterfall({
  factors,
  baseValue = 0,
  finalValue,
  engine,
  className,
  variant = 'chart',
}: ShapWaterfallProps) {
  // Inline variant delegates to the compact div-based renderer
  if (variant === 'inline') {
    return (
      <InlineWaterfall
        factors={factors}
        baseValue={baseValue}
        finalValue={finalValue}
        engine={engine}
        className={className}
      />
    )
  }

  const isMobile = useIsMobile()

  // Normalize factor names — support both `name` and `label` props
  const normalizedFactors = useMemo(
    () => factors.map(f => ({ name: f.name ?? f.label ?? '', value: f.value })),
    [factors],
  )

  const sortedFactors = useMemo(() => {
    const pos = normalizedFactors.filter(f => f.value > 0).sort((a, b) => b.value - a.value)
    const neg = normalizedFactors.filter(f => f.value <= 0).sort((a, b) => a.value - b.value)
    return [...pos, ...neg]
  }, [normalizedFactors])

  const rawSum = normalizedFactors.reduce((s, f) => s + f.value, 0)
  const finalScore = finalValue !== undefined ? finalValue : baseValue + rawSum

  // Engine-based final score color (fallback to emerald)
  const finalBarColor = engine
    ? getEngineToken(engine).color
    : 'rgba(16, 185, 129, 0.85)'
  const finalBarStroke = engine
    ? `${getEngineToken(engine).color}4D`
    : 'rgba(16, 185, 129, 0.3)'

  const chartData = useMemo(() => {
    let cumulative = baseValue
    return sortedFactors.map((factor) => {
      const start = cumulative
      cumulative += factor.value
      return { ...factor, start, end: cumulative }
    })
  }, [sortedFactors, baseValue])

  // Chart dimensions
  const marginLeft = 44
  const marginTop = 8
  const chartHeight = 200
  const marginBottom = 52
  const totalCols = chartData.length + 1
  const barWidth = 48
  const gap = 12
  const chartWidth = totalCols * (barWidth + gap) - gap
  const viewW = marginLeft + chartWidth + 16
  const viewH = marginTop + chartHeight + marginBottom

  const yMax = Math.max(1.0, Math.ceil(finalScore * 4) / 4)
  const scaleY = (v: number) => marginTop + chartHeight - (v / yMax) * chartHeight
  const barX = (i: number) => marginLeft + i * (barWidth + gap)

  const ticks = useMemo(() => {
    const result: number[] = []
    for (let t = 0; t <= yMax; t += 0.25) {
      result.push(Math.round(t * 100) / 100)
    }
    return result
  }, [yMax])

  const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max - 1) + '\u2026' : s

  // Mobile: horizontal bar chart
  if (isMobile) {
    const mobileData = sortedFactors.map(f => ({ name: f.name, value: f.value }))
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center justify-center gap-5 text-[11px] text-white/40 mb-2">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-rose-400/80 border border-rose-400/30" />
            Impact (Increase)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-blue-400/80 border border-blue-400/30" />
            Impact (Decrease)
          </span>
        </div>
        <ResponsiveContainer width="100%" height={mobileData.length * 40 + 24}>
          <BarChart layout="vertical" data={mobileData} margin={{ top: 4, right: 48, bottom: 4, left: 8 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} tickLine={false} axisLine={false} />
            <Bar dataKey="value" radius={4} label={{ position: 'right', fontSize: 10, fill: 'rgba(255,255,255,0.6)', fontWeight: 500, formatter: (v: any) => typeof v === 'number' ? (v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)) : v }}>
              {mobileData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? 'rgba(251, 113, 133, 0.85)' : 'rgba(96, 165, 250, 0.85)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-center gap-5 text-[11px] text-white/40 mb-4">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-rose-400/80 border border-rose-400/30" />
          Impact (Increase)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-blue-400/80 border border-blue-400/30" />
          Impact (Decrease)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-emerald-500/80 border border-emerald-500/30" />
          Final score
        </span>
      </div>

      <svg viewBox={`0 0 ${viewW} ${viewH}`} className="w-full" aria-label="Decision drivers waterfall chart">
        <line x1={marginLeft} y1={marginTop} x2={marginLeft} y2={marginTop + chartHeight} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={marginLeft - 4} y1={scaleY(tick)} x2={marginLeft} y2={scaleY(tick)} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1={marginLeft} y1={scaleY(tick)} x2={marginLeft + chartWidth} y2={scaleY(tick)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4,4" />
            <text x={marginLeft - 8} y={scaleY(tick) + 3.5} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">{tick.toFixed(2)}</text>
          </g>
        ))}

        <line x1={marginLeft} y1={scaleY(0)} x2={marginLeft + chartWidth} y2={scaleY(0)} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {chartData.map((item, i) => {
          const x = barX(i)
          const top = Math.max(item.start, item.end)
          const bottom = Math.min(item.start, item.end)
          const y = scaleY(top)
          const h = Math.max(scaleY(bottom) - scaleY(top), 1)
          const isPositive = item.value > 0
          const displayVal = isPositive ? `+${item.value.toFixed(2)}` : item.value.toFixed(2)

          return (
            <g key={item.name}>
              <rect x={x} y={y} width={barWidth} height={h} rx="4" fill={isPositive ? 'rgba(251, 113, 133, 0.85)' : 'rgba(96, 165, 250, 0.85)'} stroke={isPositive ? 'rgba(251, 113, 133, 0.3)' : 'rgba(96, 165, 250, 0.3)'} strokeWidth="1" />
              <text x={x + barWidth / 2} y={isPositive ? y - 8 : y + h + 14} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="monospace" fontWeight="600">{displayVal}</text>
              <text x={x + barWidth / 2} y={marginTop + chartHeight + 16} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="500">{truncate(item.name, 10)}</text>
              {i < chartData.length - 1 && (
                <line x1={x + barWidth} y1={scaleY(item.end)} x2={barX(i + 1)} y2={scaleY(item.end)} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2" />
              )}
            </g>
          )
        })}

        {(() => {
          const x = barX(chartData.length)
          const y = scaleY(Math.max(finalScore, 0))
          const h = Math.max(scaleY(0) - y, 1)
          return (
            <g>
              <rect x={x} y={y} width={barWidth} height={h} rx="4" fill={finalBarColor} stroke={finalBarStroke} strokeWidth="1" />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="monospace" fontWeight="700">{finalScore.toFixed(2)}</text>
              <text x={x + barWidth / 2} y={marginTop + chartHeight + 16} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="600">Final Score</text>
              {chartData.length > 0 && (
                <line x1={barX(chartData.length - 1) + barWidth} y1={scaleY(chartData[chartData.length - 1].end)} x2={x} y2={scaleY(chartData[chartData.length - 1].end)} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2" />
              )}
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

ShapWaterfall.displayName = 'ShapWaterfall'
