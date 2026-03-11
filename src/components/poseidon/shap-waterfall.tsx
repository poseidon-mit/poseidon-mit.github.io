/**
 * ShapWaterfall — SHAP feature attribution waterfall chart.
 *
 * Visualizes ML model explainability for governance/transparency.
 * Desktop: vertical waterfall SVG (positive = rose, negative = blue).
 * Mobile: horizontal Recharts BarChart (positive = green, negative = red).
 * Light-theme optimized with responsive SVG.
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
        <div className="flex items-center justify-center gap-5 text-[11px] text-white/40">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-400" />
            Risk increase
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-400" />
            Risk decrease
          </span>
        </div>
        <ResponsiveContainer width="100%" height={mobileData.length * 40 + 24}>
          <BarChart
            layout="vertical"
            data={mobileData}
            margin={{ top: 4, right: 48, bottom: 4, left: 8 }}
          >
            <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
              tickLine={false}
              axisLine={false}
            />
            <Bar dataKey="value" radius={4} label={{ position: 'right', fontSize: 9, fill: 'rgba(255,255,255,0.5)', formatter: (v: number) => v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2) }}>
              {mobileData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#22C55E' : '#EF4444'} />
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
      <div className="flex items-center justify-center gap-5 text-[11px] text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-400" />
          Risk increase
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-400" />
          Risk decrease
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />
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
        <line x1={marginLeft} y1={marginTop} x2={marginLeft} y2={marginTop + chartHeight} stroke="#E5E7EB" strokeWidth="1" />

        {/* Y-axis ticks + grid lines */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={marginLeft - 4} y1={scaleY(tick)} x2={marginLeft} y2={scaleY(tick)} stroke="#9CA3AF" strokeWidth="1" />
            <line x1={marginLeft} y1={scaleY(tick)} x2={marginLeft + chartWidth} y2={scaleY(tick)} stroke="#F3F4F6" strokeWidth="1" />
            <text x={marginLeft - 7} y={scaleY(tick) + 3.5} textAnchor="end" fill="#9CA3AF" fontSize="9" fontFamily="monospace">
              {tick.toFixed(2)}
            </text>
          </g>
        ))}

        {/* X-axis baseline */}
        <line x1={marginLeft} y1={scaleY(0)} x2={marginLeft + chartWidth} y2={scaleY(0)} stroke="#D1D5DB" strokeWidth="1" />

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
                fill={isPositive ? '#FB7185' : '#60A5FA'}
              />
              {/* Value label above/below bar */}
              <text
                x={x + barWidth / 2}
                y={isPositive ? y - 5 : y + h + 12}
                textAnchor="middle"
                fill="#374151" fontSize="9" fontFamily="monospace" fontWeight="600"
              >
                {displayVal}
              </text>
              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={marginTop + chartHeight + 14}
                textAnchor="middle"
                fill="#6B7280" fontSize="8.5"
              >
                {truncate(item.name, 10)}
              </text>
              {/* Connector to next bar */}
              {i < chartData.length - 1 && (
                <line
                  x1={x + barWidth} y1={scaleY(item.end)}
                  x2={barX(i + 1)} y2={scaleY(item.end)}
                  stroke="#D1D5DB" strokeWidth="1" strokeDasharray="3,2"
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
              <rect x={x} y={y} width={barWidth} height={h} rx="4" fill="#10B981" />
              <text
                x={x + barWidth / 2} y={y - 5}
                textAnchor="middle"
                fill="#111827" fontSize="10" fontFamily="monospace" fontWeight="700"
              >
                {finalScore.toFixed(2)}
              </text>
              <text
                x={x + barWidth / 2}
                y={marginTop + chartHeight + 14}
                textAnchor="middle"
                fill="#374151" fontSize="8.5" fontWeight="600"
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
                  stroke="#D1D5DB" strokeWidth="1" strokeDasharray="3,2"
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
