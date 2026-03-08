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
      }}
    >
      <Icon size={12} />
      {label}
    </span>
  )
}
