/**
 * PageShell — Page-level wrapper with hero, body, and GovernFooter.
 *
 * Wraps page content with consistent structure:
 * - Optional hero section
 * - Main body
 * - GovernContractSet footer (auto-injected for Tier 1-2 pages)
 */
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { GovernFooter } from '@/components/poseidon/govern-footer'
import { selectGovernFooterView } from '@/domain/poseidon-universe'
import type { EngineName } from '@/lib/engine-tokens'

export interface PageShellProps {
  children: ReactNode
  hero?: ReactNode
  engine?: EngineName
  showGovernFooter?: boolean
  className?: string
}

export function PageShell({
  children,
  hero,
  engine,
  showGovernFooter = true,
  className,
}: PageShellProps) {
  const fallbackAuditId = selectGovernFooterView(engine).latestEntries[0]?.id ?? 'AUD-891'

  return (
    <div
      className={cn('page-shell flex flex-col min-h-full', className)}
      data-engine={engine}
    >
      {hero && (
        <header className="page-shell-hero mb-5">
          {hero}
        </header>
      )}

      <div className="page-shell-body flex-1 px-[var(--page-padding)] pb-6">
        {children}
      </div>

      {showGovernFooter && (
        <footer className="page-shell-footer mt-auto px-[var(--page-padding)] pb-6">
          <GovernFooter auditId={fallbackAuditId} currentEngine={engine} />
        </footer>
      )}
    </div>
  )
}

PageShell.displayName = 'PageShell'
