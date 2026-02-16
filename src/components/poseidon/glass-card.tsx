/**
 * GlassCard — Glass morphism container for the Poseidon design language.
 *
 * Wraps DS v2 GlassPanel with a simplified API for v0 adaptation.
 * Apply to upgrade plain shadcn/ui cards during "Poseidon化" step.
 */
import type { ReactNode } from 'react'
import { GlassPanel } from '@/design-system/components/effects/GlassPanel'
import { cn } from '@/lib/utils'
import { type EngineName, toDSEngine } from '@/lib/engine-tokens'

export interface GlassCardProps {
  children: ReactNode
  engine?: EngineName
  blur?: 'sm' | 'md' | 'lg'
  className?: string
}

export function GlassCard({
  children,
  engine,
  blur = 'md',
  className,
}: GlassCardProps) {
  return (
    <GlassPanel
      blur={blur}
      engine={toDSEngine(engine)}
      className={cn('p-4', className)}
    >
      {children}
    </GlassPanel>
  )
}

GlassCard.displayName = 'GlassCard'
