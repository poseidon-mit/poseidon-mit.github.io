import { ArrowLeft } from 'lucide-react'
import { Link } from '@/router'
import type { EngineName } from '@/lib/engine-tokens'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

export interface SubPageNavProps {
  engine: EngineName
  parentPath: string
  parentLabel: string
  currentLabel: string
}

/**
 * Sticky breadcrumb navigation for sub-detail pages.
 *
 * Renders: ← {parentLabel} / {currentLabel}
 * Engine color is applied automatically from the engine token.
 */
export function SubPageNav({ engine, parentPath, parentLabel, currentLabel }: SubPageNavProps) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" aria-label="Breadcrumb">
      <div className={`${PAGE_CONTENT_CLASS} h-14 flex items-center gap-2`} style={PAGE_CONTENT_STYLE}>
        <Link
          to={parentPath}
          className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity shrink-0"
          style={{ color: `var(--engine-${engine})` }}
        >
          <ArrowLeft className="h-4 w-4" />
          {parentLabel}
        </Link>
        <span className="text-white/20 shrink-0">/</span>
        <span className="text-sm text-white/50 truncate">{currentLabel}</span>
      </div>
    </nav>
  )
}
