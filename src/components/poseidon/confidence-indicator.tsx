/**
 * ConfidenceIndicator — Horizontal bar + numeric label for AI confidence scores.
 *
 * Used across Protect/Grow/Execute/Govern engine pages.
 * The 0.8+ tier uses an optional accentColor to match each engine's branding.
 */

export interface ConfidenceIndicatorProps {
  value: number
  accentColor?: string
  /** Display format: decimal (0.92) or percent (92%). Default: 'decimal'. */
  format?: 'decimal' | 'percent'
  /** Bar dimensions: sm (h-1.5 w-12), md (h-1.5 w-16), lg (h-2 w-24). Default: 'md'. */
  size?: 'sm' | 'md' | 'lg'
  /** Bypass threshold color logic entirely. */
  colorOverride?: string
  /** Add glow effect to bar and text. */
  glow?: boolean
}

function getConfidenceColor(c: number, accent?: string): string {
  if (c >= 0.9) return 'var(--state-healthy)'
  if (c >= 0.8) return accent ?? '#8B5CF6'
  if (c >= 0.7) return 'var(--state-warning)'
  return 'var(--state-critical)'
}

const SIZE_MAP = {
  sm: { bar: 'h-1.5 w-12', text: 'text-xs' },
  md: { bar: 'h-1.5 w-16', text: 'text-xs' },
  lg: { bar: 'h-2 w-24', text: 'text-sm' },
} as const

export function ConfidenceIndicator({
  value,
  accentColor,
  format = 'decimal',
  size = 'md',
  colorOverride,
  glow,
}: ConfidenceIndicatorProps) {
  const color = colorOverride ?? getConfidenceColor(value, accentColor)
  const pct = value * 100
  const { bar, text } = SIZE_MAP[size]
  const label = format === 'percent' ? `${Math.round(pct)}%` : value.toFixed(2)

  return (
    <div className="flex items-center gap-2">
      <div className={`${bar} rounded-full overflow-hidden`} style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className={`h-full rounded-full transition-all${glow ? ' shadow-[0_0_8px_currentColor]' : ''}`}
          style={{ width: `${pct}%`, background: color, color }}
        />
      </div>
      <span
        className={`${text} font-mono tabular-nums`}
        style={{ color, ...(glow ? { textShadow: `0 0 8px ${color}` } : {}) }}
      >
        {label}
      </span>
    </div>
  )
}

ConfidenceIndicator.displayName = 'ConfidenceIndicator'
