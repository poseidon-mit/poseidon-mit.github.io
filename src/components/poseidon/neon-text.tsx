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
  dashboard: 'from-[#bffcff] to-[#00f0ff]',
  protect: 'from-[#5eead4] to-[#15e1c2]',
  grow: 'from-[#d7b7ff] to-[#8b5cf6]',
  execute: 'from-[#ffe0a1] to-[#f59e0b]',
  govern: 'from-[#b8d6ff] to-[#58a6ff]',
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
          'bg-gradient-to-r bg-clip-text text-transparent',
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
