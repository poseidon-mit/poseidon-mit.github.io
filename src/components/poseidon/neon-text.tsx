/**
 * NeonText — Heading with neon glow effect.
 *
 * Use for hero titles and section headers to add Poseidon signature glow.
 */
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { EngineName } from '@/lib/engine-tokens'

const neonTextMap: Record<string, string> = {
  dashboard: 'neon-text-cyan',
  protect: 'neon-text-teal',
  grow: 'neon-text-violet',
  execute: 'neon-text-amber',
  govern: 'neon-text-blue',
}

const gradientMap: Record<string, string> = {
  dashboard: 'bg-[image:var(--gradient-cyan)]',
  protect: 'bg-[image:var(--gradient-teal)]',
  grow: 'bg-[image:var(--gradient-violet)]',
  execute: 'bg-[image:var(--gradient-amber)]',
  govern: 'bg-[image:var(--gradient-blue)]',
}

export interface NeonTextProps {
  engine?: EngineName
  as?: 'h1' | 'h2' | 'h3' | 'span'
  gradient?: boolean
  className?: string
  children: ReactNode
}

export function NeonText({
  engine = 'dashboard',
  as: Tag = 'h2',
  gradient = false,
  className,
  children,
}: NeonTextProps) {
  if (gradient) {
    return (
      <Tag
        className={cn(
          'bg-clip-text text-transparent',
          gradientMap[engine],
          neonTextMap[engine],
          className,
        )}
      >
        {children}
      </Tag>
    )
  }

  return (
    <Tag className={cn(neonTextMap[engine], className)}>
      {children}
    </Tag>
  )
}

NeonText.displayName = 'NeonText'
