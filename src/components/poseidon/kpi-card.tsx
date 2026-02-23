import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface KpiCardProps {
  label: string
  value: string | number
  /** CSS color — typically a `var(--engine-*)` or `var(--state-*)` token. */
  color?: string
  /** sm = compact strip (Execute), md = standard (GrowRecs/Notifications), lg = hero (Govern). */
  size?: 'sm' | 'md' | 'lg'
  /** Engine-colored gradient overlay (replaces the neutral glass-card-overlay). */
  gradient?: ReactNode
  className?: string
}

const CONTAINER: Record<string, string> = {
  sm: 'glass-card rounded-2xl p-4',
  md: 'glass-card glass-card-overlay rounded-[24px] p-6',
  lg: 'glass-card rounded-[24px] p-8 lg:p-12',
}

const LABEL: Record<string, string> = {
  sm: 'text-[10px] font-semibold',
  md: 'text-[10px] md:text-xs font-semibold',
  lg: 'text-[10px] md:text-xs font-semibold',
}

const VALUE: Record<string, string> = {
  sm: 'text-xl font-medium',
  md: 'text-2xl md:text-3xl font-light',
  lg: 'text-3xl md:text-4xl lg:text-5xl font-light tracking-tight',
}

const SHADOW_RADIUS: Record<string, string> = {
  sm: '8px',
  md: '20px',
  lg: '15px',
}

const SHADOW_ALPHA: Record<string, string> = {
  sm: '40',
  md: '40',
  lg: '60',
}

export function KpiCard({
  label,
  value,
  color,
  size = 'sm',
  gradient,
  className,
}: KpiCardProps) {
  const hasGradient = !!gradient

  return (
    <div
      className={cn(
        CONTAINER[size],
        // When a custom gradient is provided, skip glass-card-overlay (its ::before would conflict).
        hasGradient && size === 'md' && 'glass-card rounded-[24px] p-6',
        className,
      )}
    >
      {gradient}
      <div className="flex flex-col gap-1 relative z-10">
        <span className={cn('uppercase tracking-widest text-white/40', LABEL[size])}>
          {label}
        </span>
        <span
          className={cn('font-mono tabular-nums', VALUE[size])}
          style={{
            color: color ?? 'white',
            textShadow:
              color && color !== 'white'
                ? `0 0 ${SHADOW_RADIUS[size]} ${color}${SHADOW_ALPHA[size]}`
                : undefined,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}
