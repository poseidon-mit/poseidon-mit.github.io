/**
 * HeroBento — 3-zone layout primitive for engine hero sections.
 *
 * Provides the "Dynamic Bento Core" CSS Grid structure:
 * - Zone A (Action): Primary decision + CTA (left/top on desktop)
 * - Zone B (Proof): Evidence panel (right column on desktop)
 * - Zone C (Portal): Navigation bar (full-width bottom)
 *
 * Desktop: grid-cols-[1fr_380px], portal spans full width bottom
 * Mobile: single column stacked (action → proof → portal)
 */
import { cn } from '@/lib/utils'
import { engineTokens, type EngineName } from '@/lib/engine-tokens'
import { AuroraPulse } from './aurora-pulse'

export interface HeroBentoProps extends React.HTMLAttributes<HTMLDivElement> {
  engine: EngineName
  accentColor?: string
  fullscreen?: boolean
  className?: string
  children: React.ReactNode
}

export function HeroBento({ engine, accentColor, fullscreen, className, children, ...rest }: HeroBentoProps) {
  const borderColor = accentColor ?? `var(${engineTokens[engine].cssVar})`

  return (
    <div
      className={cn(
        'glass-card relative overflow-hidden rounded-2xl flex flex-col w-full',
        fullscreen && 'flex-1 h-full',
        className,
      )}
      style={{ borderColor: `color-mix(in srgb, ${borderColor} 8%, transparent)`, borderWidth: 1 }}
      {...rest}
    >
      {accentColor
        ? <AuroraPulse color={accentColor} intensity="subtle" className="absolute inset-0 pointer-events-none" />
        : <AuroraPulse engine={engine} intensity="subtle" className="absolute inset-0 pointer-events-none" />
      }
      {children}
    </div>
  )
}

HeroBento.displayName = 'HeroBento'

/* ── Zone A: Action ── */

export interface HeroBentoActionProps {
  children: React.ReactNode
  className?: string
}

function Action({ children, className }: HeroBentoActionProps) {
  return (
    <div className={cn('relative z-10 flex flex-col justify-start p-5 md:p-8 lg:p-10 flex-1', className)}>
      {children}
    </div>
  )
}

Action.displayName = 'HeroBento.Action'
HeroBento.Action = Action

/* ── Zone B: Proof ── */

export interface HeroBentoProofProps {
  children: React.ReactNode
  className?: string
}

function Proof({ children, className }: HeroBentoProofProps) {
  return (
    <div className={cn('relative z-10 flex flex-col gap-3 p-5 md:p-8 lg:p-10 lg:w-[380px] lg:shrink-0 lg:border-l lg:border-white/5 bg-black/20 overflow-hidden', className)}>
      {children}
    </div>
  )
}

Proof.displayName = 'HeroBento.Proof'
HeroBento.Proof = Proof

/* ── Zone C: Portal ── */

export interface HeroBentoPortalProps {
  children: React.ReactNode
  className?: string
}

function Portal({ children, className }: HeroBentoPortalProps) {
  return (
    <div className={cn('relative z-10 w-full border-t border-white/5 px-6 py-3 shrink-0', className)}>
      {children}
    </div>
  )
}

Portal.displayName = 'HeroBento.Portal'
HeroBento.Portal = Portal
