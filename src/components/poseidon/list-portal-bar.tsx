/**
 * ListPortalBar — Zone C navigation component for hero sections.
 *
 * Renders a horizontal bar with engine color accent, count badge,
 * label, and chevron pointing to a Tier 2 list view.
 *
 * Uses typed PortalDestination to prevent ad-hoc link behaviors.
 */
import { ChevronRight } from 'lucide-react'
import { Link } from '@/router'
import { getEngineToken, type EngineName } from '@/lib/engine-tokens'
import { cn } from '@/lib/utils'

export type PortalDestination =
  | { type: 'route'; to: string }
  | { type: 'hash'; hash: string }
  | { type: 'deep-link'; path: string; query: Record<string, string> }

export interface ListPortalBarProps {
  engine: EngineName
  label: string
  count: number
  destination: PortalDestination
  className?: string
}

function resolveHref(destination: PortalDestination): string {
  switch (destination.type) {
    case 'route':
      return destination.to
    case 'hash':
      return `#${destination.hash}`
    case 'deep-link':
      return `${destination.path}?${new URLSearchParams(destination.query).toString()}`
  }
}

export function ListPortalBar({ engine, label, count, destination, className }: ListPortalBarProps) {
  const token = getEngineToken(engine)
  const href = resolveHref(destination)

  const content = (
    <span className={cn(
      'flex items-center gap-3 w-full min-h-[44px] text-sm font-medium text-white/70 hover:text-white/90 transition-colors',
      className,
    )}>
      <span
        className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
        style={{ backgroundColor: `color-mix(in srgb, var(${token.cssVar}) 20%, transparent)`, color: `var(${token.cssVar})` }}
      >
        {count}
      </span>
      <span className="flex-1 truncate">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-white/40" />
    </span>
  )

  if (destination.type === 'hash') {
    return <a href={href} className="block">{content}</a>
  }

  return <Link to={href} className="block">{content}</Link>
}

ListPortalBar.displayName = 'ListPortalBar'
