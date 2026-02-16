/**
 * Sparkline — Inline mini line chart for KPI cards.
 *
 * Wraps DS v2 SparkLine with simplified props.
 */
import { SparkLine } from '@/design-system/components/data-viz/SparkLine'
import { type EngineName, toDSEngine } from '@/lib/engine-tokens'

export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  engine?: EngineName
  showArea?: boolean
  className?: string
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  engine,
  showArea = false,
  className,
}: SparklineProps) {
  return (
    <SparkLine
      data={data}
      width={width}
      height={height}
      engine={toDSEngine(engine)}
      showArea={showArea}
      className={className}
    />
  )
}

Sparkline.displayName = 'Sparkline'
