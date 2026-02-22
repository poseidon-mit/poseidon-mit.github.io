/**
 * GovernFooter — Governance audit footer required on all Tier 1-2 pages.
 *
 * Self-contained implementation matching v0 engine page pattern.
 * Renders: verified badge | audit ID (mono) | "Request human review" button.
 */
import { ShieldCheck, Shield, ExternalLink, User } from 'lucide-react'
import { useRouter } from '../../router'

export interface GovernFooterProps {
  auditId: string
  pageContext?: string
  className?: string
}

export function GovernFooter({
  auditId,
  pageContext,
  className = '',
}: GovernFooterProps) {
  const { navigate } = useRouter()

  return (
    <footer
      className={`mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 md:px-6 md:py-4 ${className}`}
      role="contentinfo"
      aria-label="Governance verification footer"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10">
          <ShieldCheck size={14} className="text-blue-500" />
        </div>
        <span className="mission-govern-badge inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
          <Shield size={10} />
          Verified
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-500">
          {auditId}
        </span>
        <ExternalLink size={12} className="text-slate-500" aria-hidden="true" />
      </div>
      <button
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/[0.08] bg-transparent px-4 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-white/[0.04] cursor-pointer"
        aria-label={pageContext ? `Request human review of ${pageContext}` : 'Request human review'}
        onClick={() => navigate('/govern/oversight')}
      >
        <User size={14} />
        Request human review
      </button>
    </footer>
  )
}

GovernFooter.displayName = 'GovernFooter'
