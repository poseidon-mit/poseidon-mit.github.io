/**
 * PrioritySpotlight — reusable wrapper with engine-colored left border.
 * Used to visually elevate the highest-priority item in a list.
 */
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { EngineName } from '@/lib/engine-tokens'

const ENGINE_CSS_VAR: Record<EngineName, string> = {
  dashboard: 'var(--engine-dashboard)',
  protect: 'var(--engine-protect)',
  grow: 'var(--engine-grow)',
  execute: 'var(--engine-execute)',
  govern: 'var(--engine-govern)',
}

export interface PrioritySpotlightProps {
  children: ReactNode
  engine: EngineName
  className?: string
}

export function PrioritySpotlight({ children, engine, className }: PrioritySpotlightProps) {
  return (
    <div
      className={cn(
        'border-l-[3px] p-5 md:p-6 bg-white/[0.03] rounded-xl',
        className,
      )}
      style={{ borderLeftColor: ENGINE_CSS_VAR[engine] }}
    >
      {children}
    </div>
  )
}
