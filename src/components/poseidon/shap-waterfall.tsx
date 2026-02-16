/**
 * ShapWaterfall — SHAP feature attribution waterfall chart.
 *
 * Visualizes ML model explainability for governance/transparency.
 * Uses Recharts BarChart internally.
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
  baseValue = 50,
  className,
}: ShapWaterfallProps) {
  const sortedFactors = useMemo(
    () => [...factors].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)),
    [factors],
  )

  const maxAbsVal = useMemo(
    () => Math.max(...factors.map((f) => Math.abs(f.value)), 1),
    [factors],
  )

  return (
    <div className={cn('space-y-1.5', className)}>
      {sortedFactors.map((factor) => {
        const width = (Math.abs(factor.value) / maxAbsVal) * 100
        const isPositive = factor.value > 0
        return (
          <div key={factor.name} className="flex items-center gap-2 text-xs">
            <span className="w-24 truncate text-white/50 text-right shrink-0">
              {factor.name}
            </span>
            <div className="flex-1 h-4 relative bg-white/[0.04] rounded overflow-hidden">
              <div
                className={cn(
                  'absolute top-0 h-full rounded transition-all duration-500',
                  isPositive
                    ? 'bg-green-500/60 left-1/2'
                    : 'bg-red-500/60 right-1/2',
                )}
                style={{ width: `${width / 2}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-mono tabular-nums text-white/60">
                  {isPositive ? '+' : ''}
                  {factor.value.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
      <div className="flex items-center gap-2 text-[10px] text-white/30 pt-1 border-t border-white/[0.06]">
        <span className="w-24 text-right shrink-0">Base</span>
        <span className="tabular-nums">{baseValue}</span>
        <span className="ml-auto tabular-nums">
          Final: {(baseValue + factors.reduce((s, f) => s + f.value, 0)).toFixed(1)}
        </span>
      </div>
    </div>
  )
}

ShapWaterfall.displayName = 'ShapWaterfall'
