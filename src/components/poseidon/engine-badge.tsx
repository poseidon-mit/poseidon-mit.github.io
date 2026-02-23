import type { LucideIcon } from 'lucide-react'
import type { EngineName } from '@/lib/engine-tokens'
import { engineTokens } from '@/lib/engine-tokens'
import { cn } from '@/lib/utils'

export interface EngineBadgeProps {
  engine: EngineName
  icon: LucideIcon
  label: string
  className?: string
}

/** Shadow glow per engine — matches existing inline `shadow-[0_0_15px_rgba(...)]` values. */
const ENGINE_GLOW: Record<EngineName, string> = {
  dashboard: '0 0 15px rgba(0,240,255,0.2)',
  protect: '0 0 15px rgba(34,197,94,0.2)',
  grow: '0 0 15px rgba(139,92,246,0.2)',
  execute: '0 0 15px rgba(251,191,36,0.2)',
  govern: '0 0 15px rgba(59,130,246,0.2)',
}

export function EngineBadge({ engine, icon: Icon, label, className }: EngineBadgeProps) {
  const token = engineTokens[engine]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase',
        token.borderClass,
        token.bgClass,
        className,
      )}
      style={{
        color: `var(${token.cssVar})`,
        boxShadow: ENGINE_GLOW[engine],
      }}
    >
      <Icon size={12} />
      {label}
    </span>
  )
}
