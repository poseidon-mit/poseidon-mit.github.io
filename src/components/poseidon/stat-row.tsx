/**
 * StatRow — Key/value pair row for sidebars and detail panels.
 *
 * Replaces the repeated inline pattern:
 *   <div className="flex items-center justify-between">
 *     <span className="text-sm text-white/60">{label}</span>
 *     <span className="text-sm font-mono" style={{ color }}>{value}</span>
 *   </div>
 */
import type React from 'react'

export interface StatRowProps {
  label: string
  value: React.ReactNode
  /** Value text color. Default: 'rgba(255,255,255,0.9)'. */
  valueColor?: string
  /** Use monospace font for value. Default: true. */
  mono?: boolean
  /** Add text-shadow glow matching valueColor. */
  glow?: boolean
  /** Label/value text size. Default: 'sm'. */
  size?: 'xs' | 'sm'
  /** Show top border separator. */
  divider?: boolean
  className?: string
}

const SIZE_MAP = {
  xs: { label: 'text-xs', value: 'text-xs' },
  sm: { label: 'text-sm', value: 'text-sm' },
} as const

export function StatRow({
  label,
  value,
  valueColor = 'rgba(255,255,255,0.9)',
  mono = true,
  glow,
  size = 'sm',
  divider,
  className,
}: StatRowProps) {
  const s = SIZE_MAP[size]
  return (
    <div className={`flex items-center justify-between${divider ? ' pt-4 border-t border-white/[0.04]' : ''}${className ? ` ${className}` : ''}`}>
      <span className={`${s.label} text-white/60 tracking-wide`}>{label}</span>
      <span
        className={`${s.value}${mono ? ' font-mono tabular-nums' : ''} font-medium`}
        style={{
          color: valueColor,
          ...(glow ? { textShadow: `0 0 8px ${valueColor}60` } : {}),
        }}
      >
        {value}
      </span>
    </div>
  )
}

StatRow.displayName = 'StatRow'
