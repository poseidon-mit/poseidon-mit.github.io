/**
 * ShapWaterfall — SHAP feature attribution waterfall chart.
 *
 * Visualizes ML model explainability for governance/transparency.
 * Positive values = risk increase (red), Negative = risk decrease (blue).
 */
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

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
  const sortedFactors = useMemo(() => {
    const pos = factors.filter(f => f.value > 0).sort((a, b) => b.value - a.value)
    const neg = factors.filter(f => f.value <= 0).sort((a, b) => a.value - b.value)
    return [...pos, ...neg]
  }, [factors])

  const maxAbsVal = useMemo(
    () => Math.max(...factors.map((f) => Math.abs(f.value)), 0.01),
    [factors],
  )

  const finalScore = baseValue + factors.reduce((s, f) => s + f.value, 0)

  return (
    <div className={cn('space-y-1.5', className)}>
      {/* Legend */}
      <div className="flex items-center justify-center gap-5 text-[11px] text-white/50 mb-3">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500/70" />
          Risk increase
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500/70" />
          Risk decrease
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500/70" />
          Final score
        </span>
      </div>

      {sortedFactors.map((factor) => {
        const width = (Math.abs(factor.value) / maxAbsVal) * 100
        const isPositive = factor.value > 0
        return (
          <div key={factor.name} className="flex items-center gap-2 text-xs">
            <span className="w-28 truncate text-white/50 text-right shrink-0">
              {factor.name}
            </span>
            <div className="flex-1 h-5 relative bg-white/[0.04] rounded overflow-hidden">
              <div
                className={cn(
                  'absolute top-0 h-full rounded transition-all duration-500',
                  isPositive
                    ? 'bg-red-500/70 left-1/2'
                    : 'bg-blue-500/70 right-1/2',
                )}
                style={{ width: `${width / 2}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-mono tabular-nums text-white/70 font-semibold">
                  {isPositive ? '+' : ''}
                  {factor.value.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      {/* Final score row */}
      <div className="flex items-center gap-2 text-xs pt-2 border-t border-white/[0.08]">
        <span className="w-28 truncate text-white/50 text-right shrink-0 font-semibold">
          Final Risk Score
        </span>
        <div className="flex-1 h-5 relative bg-white/[0.04] rounded overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded bg-emerald-500/70 transition-all duration-500"
            style={{ width: `${Math.min((finalScore / (maxAbsVal * 2)) * 100, 100)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-mono tabular-nums text-white/80 font-bold">
              {finalScore.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

ShapWaterfall.displayName = 'ShapWaterfall'
