/**
 * ForecastBand — Monte Carlo prediction band chart.
 *
 * Visualizes forecast ranges with confidence intervals.
 * Uses inline SVG for lightweight rendering.
 */
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { EngineName } from '@/lib/engine-tokens'
import { engineTokens } from '@/lib/engine-tokens'

export interface ForecastPoint {
  x: number
  median: number
  low: number
  high: number
}

export interface ForecastBandProps {
  data: ForecastPoint[]
  width?: number
  height?: number
  engine?: EngineName
  className?: string
}

export function ForecastBand({
  data,
  width = 240,
  height = 80,
  engine = 'grow',
  className,
}: ForecastBandProps) {
  const color = engineTokens[engine].color

  const { bandPath, medianPath } = useMemo(() => {
    if (data.length < 2) return { bandPath: '', medianPath: '' }

    const allVals = data.flatMap((d) => [d.low, d.high])
    const minY = Math.min(...allVals)
    const maxY = Math.max(...allVals)
    const rangeY = maxY - minY || 1
    const pad = 4

    const scaleX = (i: number) => (i / (data.length - 1)) * width
    const scaleY = (v: number) => pad + (height - 2 * pad) - ((v - minY) / rangeY) * (height - 2 * pad)

    const topLine = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i).toFixed(1)},${scaleY(d.high).toFixed(1)}`).join(' ')
    const bottomLine = [...data].reverse().map((d, i) => {
      const idx = data.length - 1 - i
      return `L${scaleX(idx).toFixed(1)},${scaleY(d.low).toFixed(1)}`
    }).join(' ')

    const med = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i).toFixed(1)},${scaleY(d.median).toFixed(1)}`).join(' ')

    return {
      bandPath: `${topLine} ${bottomLine} Z`,
      medianPath: med,
    }
  }, [data, width, height])

  if (data.length < 2) return null

  return (
    <svg
      width={width}
      height={height}
      className={cn('inline-block', className)}
      aria-label="Forecast band chart"
    >
      <path d={bandPath} fill={color} fillOpacity={0.12} />
      <path d={medianPath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}

ForecastBand.displayName = 'ForecastBand'
