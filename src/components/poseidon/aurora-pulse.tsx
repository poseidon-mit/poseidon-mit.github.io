/**
 * AuroraPulse — Animated gradient background for engine pages.
 *
 * Replaces static radial-gradient backgrounds with a subtle pulsing aurora.
 * Respects prefers-reduced-motion via useReducedMotionSafe.
 */

import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { engineTokens, type EngineName } from '@/lib/engine-tokens'

export interface AuroraPulseProps {
  color?: string
  engine?: EngineName
  intensity?: 'subtle' | 'normal' | 'vivid'
}

const opacityMap = {
  subtle: { primary: 0.018, secondary: 0.009 },
  normal: { primary: 0.026, secondary: 0.013 },
  vivid: { primary: 0.04, secondary: 0.02 },
}

const variableColorMap: Record<string, string> = {
  'var(--engine-dashboard)': engineTokens.dashboard.color,
  'var(--engine-protect)': engineTokens.protect.color,
  'var(--engine-grow)': engineTokens.grow.color,
  'var(--engine-execute)': engineTokens.execute.color,
  'var(--engine-govern)': engineTokens.govern.color,
}

export function AuroraPulse({ color, engine, intensity = 'normal' }: AuroraPulseProps) {
  const reducedMotion = useReducedMotionSafe()
  const { primary, secondary } = opacityMap[intensity]
  const resolvedColor = color ?? (engine ? engineTokens[engine].color : engineTokens.dashboard.color)

  // Convert hex color to rgba with given opacity
  const hexToRgba = (hex: string, alpha: number) => {
    const normalized = variableColorMap[hex] ?? hex
    if (!normalized.startsWith('#') || normalized.length < 7) {
      const fallback = engineTokens.dashboard.color
      const r = parseInt(fallback.slice(1, 3), 16)
      const g = parseInt(fallback.slice(3, 5), 16)
      const b = parseInt(fallback.slice(5, 7), 16)
      return `rgba(${r},${g},${b},${alpha})`
    }
    const r = parseInt(normalized.slice(1, 3), 16)
    const g = parseInt(normalized.slice(3, 5), 16)
    const b = parseInt(normalized.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background: `radial-gradient(70% 50% at 50% 0%, ${hexToRgba(resolvedColor, primary)}, transparent), radial-gradient(40% 40% at 80% 20%, ${hexToRgba(resolvedColor, secondary)}, transparent)`,
        animation: reducedMotion ? 'none' : 'aurora-drift 8s ease-in-out infinite alternate',
      }}
    />
  )
}

AuroraPulse.displayName = 'AuroraPulse'
