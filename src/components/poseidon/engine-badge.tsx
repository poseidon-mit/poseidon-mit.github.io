/**
 * EngineBadge — Engine-semantic status badge.
 *
 * Wraps DS v2 Badge with engine color auto-resolution.
 * Use to replace plain badges with engine-aware variants.
 */
import type { ReactNode } from 'react'
import { Badge } from '@/design-system/components/primitives/Badge'
import { type EngineName, toDSEngine } from '@/lib/engine-tokens'

export interface EngineBadgeProps {
  engine: EngineName
  glow?: boolean
  size?: 'sm' | 'md'
  className?: string
  children: ReactNode
}

export function EngineBadge({
  engine,
  glow = false,
  size = 'md',
  className,
  children,
}: EngineBadgeProps) {
  const dsEngine = toDSEngine(engine)
  return (
    <Badge
      variant={dsEngine ? 'engine' : 'default'}
      engine={dsEngine}
      glow={glow}
      size={size}
      className={className}
    >
      {children}
    </Badge>
  )
}

EngineBadge.displayName = 'EngineBadge'
