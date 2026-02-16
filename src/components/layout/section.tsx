/**
 * Section — Page section wrapper with optional title and engine color.
 *
 * Use to divide page content into semantically meaningful sections.
 */
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { EngineName } from '@/lib/engine-tokens'
import { engineTokens } from '@/lib/engine-tokens'

export interface SectionProps {
  title?: string
  subtitle?: string
  engine?: EngineName
  children: ReactNode
  className?: string
}

export function Section({
  title,
  subtitle,
  engine,
  children,
  className,
}: SectionProps) {
  const token = engine ? engineTokens[engine] : null

  return (
    <section className={cn('mb-6', className)}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && (
            <h2
              className={cn(
                'text-lg font-semibold tracking-tight',
                token?.textClass ?? 'text-white',
              )}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

Section.displayName = 'Section'
