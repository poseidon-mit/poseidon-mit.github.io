/**
 * ListHeroBanner — Compact hero header for list/queue sub-pages.
 *
 * Unlike HeroBento (full-viewport 3-zone grid), this is a lightweight banner
 * that sits at the top of hero-viewport, leaving remaining space for a
 * scrollable list below.
 *
 * Layout: Glass card with AuroraPulse, 2-column on desktop
 *   Left: back link + engine badge + title + stats row
 *   Right: children slot (breakdown badges, mini chart, etc.)
 */
import { cn } from '@/lib/utils'
import { engineTokens, type EngineName } from '@/lib/engine-tokens'
import { AuroraPulse } from './aurora-pulse'
import { EngineBadge } from './engine-badge'
import { Link } from '@/router'
import { ArrowLeft, type LucideIcon } from 'lucide-react'

export interface ListHeroBannerStat {
  label: string
  value: string | number
  color?: string
}

export interface ListHeroBannerProps {
  engine: EngineName
  icon: LucideIcon
  engineLabel: string
  title: string
  subtitle?: string
  backTo: string
  backLabel: string
  stats?: ListHeroBannerStat[]
  className?: string
  children?: React.ReactNode
}

export function ListHeroBanner({
  engine,
  icon,
  engineLabel,
  title,
  subtitle,
  backTo,
  backLabel,
  stats,
  className,
  children,
}: ListHeroBannerProps) {
  const token = engineTokens[engine]

  return (
    <div className={cn('flex flex-col gap-4 shrink-0', className)}>
      {/* Back link */}
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      {/* Banner card */}
      <div
        className="glass-surface relative overflow-hidden rounded-2xl"
        style={{
          borderColor: `color-mix(in srgb, var(${token.cssVar}) 8%, transparent)`,
          borderWidth: 1,
        }}
      >
        <AuroraPulse engine={engine} intensity="subtle" className="absolute inset-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 p-5 md:p-6">
          {/* Left: title area */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <EngineBadge engine={engine} icon={icon} label={engineLabel} className="self-start" />
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}

            {/* Stats row */}
            {stats && stats.length > 0 && (
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    {i > 0 && <span className="text-white/10">·</span>}
                    <span
                      className="text-lg font-mono font-bold tabular-nums"
                      style={{ color: stat.color ?? `var(${token.cssVar})` }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right slot: children */}
          {children && (
            <div className="shrink-0 flex flex-col gap-2">{children}</div>
          )}
        </div>
      </div>
    </div>
  )
}

ListHeroBanner.displayName = 'ListHeroBanner'
