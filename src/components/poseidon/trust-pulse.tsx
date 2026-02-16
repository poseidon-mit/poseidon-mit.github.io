/**
 * TrustPulse — Breathing glow orb for ambient trust visualization.
 *
 * Wraps DS v2 PulsingOrb. Place behind hero sections.
 */
import { PulsingOrb } from '@/design-system/components/effects/PulsingOrb'
import { type EngineName, toDSEngine } from '@/lib/engine-tokens'

export interface TrustPulseProps {
  engine?: EngineName
  size?: number
  className?: string
}

export function TrustPulse({
  engine,
  size = 200,
  className,
}: TrustPulseProps) {
  return (
    <PulsingOrb
      size={size}
      engine={toDSEngine(engine)}
      className={className}
    />
  )
}

TrustPulse.displayName = 'TrustPulse'
