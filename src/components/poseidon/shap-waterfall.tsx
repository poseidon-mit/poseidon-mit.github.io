import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { getEngineToken, type EngineName } from '@/lib/engine-tokens'

export interface ShapFactor {
  label: string
  value: number
}

export interface ShapWaterfallProps {
  factors: ShapFactor[]
  baseValue?: number
  finalValue?: number
  engine?: EngineName
  className?: string
}

export function ShapWaterfall({
  factors,
  baseValue = 0,
  finalValue,
  engine = 'protect',
  className,
}: ShapWaterfallProps) {
  const isPercentage = true // In Poseidon context, SHAP is almost always a % mapping

  // Engine theming for the final prediction and the negative/positive values
  // By default, Negative (Mitigating Risk) -> Blue/Cyan, Positive (Adding Risk) -> Red/Rose
  // Final Score -> Uses Engine Primary Color
  const engineTokens = getEngineToken(engine)
  const finalScoreColor = engineTokens.color

  // 1. Separate positive (risk/increase) and negative (mitigating/decrease)
  const sortedFactors = useMemo(() => {
    const pos = factors.filter(f => f.value >= 0).sort((a, b) => b.value - a.value)
    const neg = factors.filter(f => f.value < 0).sort((a, b) => a.value - b.value)
    return [...pos, ...neg]
  }, [factors])

  // 2. Cascade computation
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
    return {
      label: f.label,
      rawValue: f.value,
      scaledDelta,
      start,
      end,
      isMitigating: f.value < 0
    }
  })

  // 3. Domain boundaries
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

  const getPercent = (v: number) => {
    return Math.max(0, Math.min(100, ((v - renderMin) / renderRange) * 100))
  }

  const formatVal = (v: number, isDelta: boolean) => {
    const val = isPercentage ? v * 100 : v
    const fixed = Math.abs(val) < 10 ? val.toFixed(1) : val.toFixed(0)
    const sign = isDelta && v > 0 ? '+' : (isDelta && v < 0 ? '−' : '')
    return `${sign}${Math.abs(Number(fixed))}${isPercentage ? '%' : ''}`
  }

  return (
    <div className={cn('w-full flex flex-col', className)} role="img" aria-label="SHAP Feature Attribution Waterfall">

      <div className="flex w-full overflow-hidden text-sm">
        {/* Waterfall Container */}
        <div className="flex-1 w-full space-y-3 min-w-0">

          {/* Factors */}
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
                  <div 
                    className="absolute border-l border-dashed border-white/10 -top-2 h-3 z-0" 
                    style={{ left: `${getPercent(seg.start)}%` }}
                  />

                  <div className="absolute top-0 bottom-0 border-l border-white/5 border-dashed pointer-events-none" style={{ left: `${getPercent(0)}%` }} />
                  <div className="absolute top-0 bottom-0 border-l border-white/5 border-dashed pointer-events-none" style={{ left: `${getPercent(targetOutput)}%` }} />

                  <div 
                    className={cn("absolute h-[22px] top-1 rounded-sm z-10 transition-all duration-300 hover:brightness-125", fillClass)}
                    style={{ left: `${leftPct}%`, width: `${Math.max(0.5, widthPct)}%` }}
                  />

                  <div 
                    className={cn("absolute top-1/2 -translate-y-[45%] font-mono text-[10px] z-20 whitespace-nowrap transition-colors font-semibold tracking-wider", textClass)}
                    style={{ 
                      [textAnchor]: textAnchor === 'left' ? `calc(${getPercent(seg.end)}% + 8px)` : `calc(${100 - getPercent(seg.end)}% + 8px)`
                    }}
                  >
                    {formatVal(seg.rawValue, true)}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Final Output Row */}
          <div className="flex items-center group relative h-9 mt-4 pt-3 pb-1 border-t border-white/[0.06]">
             <div className="w-[110px] sm:w-[160px] md:w-[200px] shrink-0 text-[11px] font-bold text-white pr-3 sm:pr-4 text-right uppercase tracking-widest">
               Risk Score
             </div>
             <div className="flex-1 relative h-full">
               {segments.length > 0 && (
                 <div 
                   className="absolute border-l border-dashed border-white/20 -top-[18px] h-[24px] z-0" 
                   style={{ left: `${getPercent(segments[segments.length - 1].end)}%` }}
                 />
               )}
               
               <div className="absolute top-0 bottom-0 border-l border-white/5 border-dashed pointer-events-none" style={{ left: `${getPercent(0)}%` }} />
               
               <div 
                 className="absolute h-6 top-1.5 rounded-sm bg-white/10 transition-all duration-500"
                 style={{
                    left: `${getPercent(Math.min(0, targetOutput))}%`,
                    width: `${Math.abs(getPercent(targetOutput) - getPercent(0))}%`,
                    borderColor: finalScoreColor,
                    borderWidth: '1px',
                    boxShadow: `inset 0 0 16px ${finalScoreColor}30, 0 0 12px ${finalScoreColor}20`
                 }}
               />
               <div 
                 className="absolute top-1/2 -translate-y-[40%] font-mono text-xs font-bold tracking-wider"
                 style={{ 
                    left: `calc(${getPercent(targetOutput)}% + 10px)`,
                    color: finalScoreColor,
                    textShadow: `0 0 10px ${finalScoreColor}80` 
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
