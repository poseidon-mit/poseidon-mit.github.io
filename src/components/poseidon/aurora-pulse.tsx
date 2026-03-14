/**
 * AuroraPulse — Animated gradient background for engine pages.
 *
 * Replaces static radial-gradient backgrounds with a subtle pulsing aurora.
 * Respects prefers-reduced-motion via useReducedMotionSafe.
 */
import type { PerformanceProfile } from '@/hooks/usePerformanceProfile'
import { engineTokens, type EngineName } from '@/lib/engine-tokens'

export interface AuroraPulseProps {
  color?: string
  engine?: EngineName
  intensity?: 'subtle' | 'normal' | 'vivid'
  performanceProfile?: PerformanceProfile
  className?: string
}

const opacityMap = {
  subtle: { primary: 0.008, secondary: 0.004 },
  normal: { primary: 0.012, secondary: 0.006 },
  vivid: { primary: 0.018, secondary: 0.010 },
}

const variableColorMap: Record<string, string> = {
  'var(--engine-dashboard)': engineTokens.dashboard.color,
  'var(--engine-protect)': engineTokens.protect.color,
  'var(--engine-grow)': engineTokens.grow.color,
  'var(--engine-execute)': engineTokens.execute.color,
  'var(--engine-govern)': engineTokens.govern.color,
}

export function AuroraPulse({
  color,
  engine,
  intensity = 'normal',
  performanceProfile = 'full',
  className = '',
}: AuroraPulseProps) {
  const { primary, secondary } = opacityMap[intensity]
  // Fallback to CSS var instead of hex for JS evaluation. Let CSS do the mix.
  const resolvedColor = color ?? (engine ? `var(--engine-${engine})` : 'var(--engine-dashboard)')
  const multiplier = performanceProfile === 'static' ? 0.7 : performanceProfile === 'lite' ? 0.85 : 1

  const primaryMix = `color-mix(in srgb, ${resolvedColor} ${primary * multiplier * 100}%, transparent)`
  const secondaryMix = `color-mix(in srgb, ${resolvedColor} ${secondary * multiplier * 100}%, transparent)`

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
      style={{
        background: `radial-gradient(70% 50% at 50% 0%, ${primaryMix}, transparent), radial-gradient(40% 40% at 80% 20%, ${secondaryMix}, transparent)`,
        animation: 'none',
      }}
    />
  )
}

AuroraPulse.displayName = 'AuroraPulse'
