/**
 * ShapWaterfall — SHAP feature attribution waterfall chart.
 *
 * Visualizes ML model explainability for governance/transparency.
 * Desktop: vertical waterfall SVG (positive = rose, negative = blue).
 * Mobile: horizontal Recharts BarChart.
 * Dark-theme optimized with responsive SVG and Recharts.
 */
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMediaQuery'

export interface ShapFactor {
  name: string
  value: number
}

export interface ShapWaterfallProps {
  factors: ShapFactor[]
  baseValue?: number
  className?: string
}

export function ShapWaterfall({
  factors,
  baseValue = 0,
  className,
}: ShapWaterfallProps) {
  const isMobile = useIsMobile()

  const sortedFactors = useMemo(() => {
    const pos = factors.filter(f => f.value > 0).sort((a, b) => b.value - a.value)
    const neg = factors.filter(f => f.value <= 0).sort((a, b) => a.value - b.value)
    return [...pos, ...neg]
  }, [factors])

  const finalScore = baseValue + factors.reduce((s, f) => s + f.value, 0)

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
  const totalCols = chartData.length + 1 // +1 for final score
  const barWidth = 48
  const gap = 12
  const chartWidth = totalCols * (barWidth + gap) - gap
  const viewW = marginLeft + chartWidth + 16
  const viewH = marginTop + chartHeight + marginBottom

  // Y-axis scale: 0 to max(1.0, finalScore rounded up)
  const yMax = Math.max(1.0, Math.ceil(finalScore * 4) / 4)
  const scaleY = (v: number) => marginTop + chartHeight - (v / yMax) * chartHeight
  const barX = (i: number) => marginLeft + i * (barWidth + gap)

  // Y-axis ticks
  const ticks = useMemo(() => {
    const result: number[] = []
    for (let t = 0; t <= yMax; t += 0.25) {
      result.push(Math.round(t * 100) / 100)
    }
    return result
  }, [yMax])

  const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max - 1) + '…' : s

  // Mobile: horizontal bar chart
  if (isMobile) {
    const mobileData = sortedFactors.map(f => ({ name: f.name, value: f.value }))
    return (
      <div className={cn('space-y-3', className)}>
        {/* Legend */}
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
          <BarChart
            layout="vertical"
            data={mobileData}
            margin={{ top: 4, right: 48, bottom: 4, left: 8 }}
          >
            <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
              tickLine={false}
              axisLine={false}
            />
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
      {/* Legend */}
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

      {/* Waterfall SVG */}
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full"
        aria-label="Decision drivers waterfall chart"
      >
        {/* Y-axis line */}
        <line x1={marginLeft} y1={marginTop} x2={marginLeft} y2={marginTop + chartHeight} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Y-axis ticks + grid lines */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={marginLeft - 4} y1={scaleY(tick)} x2={marginLeft} y2={scaleY(tick)} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1={marginLeft} y1={scaleY(tick)} x2={marginLeft + chartWidth} y2={scaleY(tick)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4,4" />
            <text x={marginLeft - 8} y={scaleY(tick) + 3.5} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">
              {tick.toFixed(2)}
            </text>
          </g>
        ))}

        {/* X-axis baseline */}
        <line x1={marginLeft} y1={scaleY(0)} x2={marginLeft + chartWidth} y2={scaleY(0)} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {/* Factor bars */}
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
              {/* Bar */}
              <rect
                x={x} y={y} width={barWidth} height={h} rx="4"
                fill={isPositive ? 'rgba(251, 113, 133, 0.85)' : 'rgba(96, 165, 250, 0.85)'}
                stroke={isPositive ? 'rgba(251, 113, 133, 0.3)' : 'rgba(96, 165, 250, 0.3)'}
                strokeWidth="1"
              />
              {/* Value label above/below bar */}
              <text
                x={x + barWidth / 2}
                y={isPositive ? y - 8 : y + h + 14}
                textAnchor="middle"
                fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="monospace" fontWeight="600"
              >
                {displayVal}
              </text>
              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={marginTop + chartHeight + 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="500"
              >
                {truncate(item.name, 10)}
              </text>
              {/* Connector to next bar */}
              {i < chartData.length - 1 && (
                <line
                  x1={x + barWidth} y1={scaleY(item.end)}
                  x2={barX(i + 1)} y2={scaleY(item.end)}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2"
                />
              )}
            </g>
          )
        })}

        {/* Final Score bar */}
        {(() => {
          const x = barX(chartData.length)
          const y = scaleY(Math.max(finalScore, 0))
          const h = Math.max(scaleY(0) - y, 1)
          return (
            <g>
              <rect x={x} y={y} width={barWidth} height={h} rx="4" fill="rgba(16, 185, 129, 0.85)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
              <text
                x={x + barWidth / 2} y={y - 8}
                textAnchor="middle"
                fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="monospace" fontWeight="700"
              >
                {finalScore.toFixed(2)}
              </text>
              <text
                x={x + barWidth / 2}
                y={marginTop + chartHeight + 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="600"
              >
                Final Score
              </text>
              {/* Connector from last factor */}
              {chartData.length > 0 && (
                <line
                  x1={barX(chartData.length - 1) + barWidth}
                  y1={scaleY(chartData[chartData.length - 1].end)}
                  x2={x}
                  y2={scaleY(chartData[chartData.length - 1].end)}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2"
                />
              )}
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

ShapWaterfall.displayName = 'ShapWaterfall'
