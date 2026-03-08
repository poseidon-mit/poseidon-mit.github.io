/**
 * CostOfInaction — "What happens if you do nothing" pill badge.
 *
 * Used in Zone B proof panels to show the consequence of inaction.
 */
import { cn } from '@/lib/utils'

const severityStyles = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20 state-bg-primary state-text-primary state-border-primary',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20 state-bg-warning state-text-warning state-border-warning',
  high: 'bg-red-500/10 text-red-400 border-red-500/20 state-bg-critical state-text-critical state-border-critical',
} as const

export interface CostOfInactionProps {
  label: string
  severity?: 'low' | 'medium' | 'high'
  className?: string
}

export function CostOfInaction({ label, severity = 'medium', className }: CostOfInactionProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        severityStyles[severity],
        className,
      )}
    >
      {label}
    </span>
  )
}

CostOfInaction.displayName = 'CostOfInaction'
