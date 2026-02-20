import { cn } from '@/lib/utils'

export interface PreviewBadgeProps {
  label?: string
  hint?: string
  className?: string
}

export function PreviewBadge({
  label = 'Preview',
  hint = 'Available in production release.',
  className,
}: PreviewBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/65',
        className,
      )}
      title={hint}
      aria-label={`${label} mode`}
    >
      {label}
    </span>
  )
}

export default PreviewBadge
