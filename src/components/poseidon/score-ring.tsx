/**
 * ScoreRing — Circular confidence/score display.
 *
 * Wraps DS v2 ConfidenceRing for the v0 adaptation workflow.
 */
import { ConfidenceRing } from '@/design-system/components/ai/ConfidenceRing'
import { type EngineName, toDSEngine } from '@/lib/engine-tokens'

export interface ScoreRingProps {
  value: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  engine?: EngineName
  className?: string
}

export function ScoreRing({
  value,
  label,
  size = 'md',
  engine,
  className,
}: ScoreRingProps) {
  return (
    <ConfidenceRing
      value={value}
      label={label}
      size={size}
      engine={toDSEngine(engine)}
      className={className}
    />
  )
}

ScoreRing.displayName = 'ScoreRing'
