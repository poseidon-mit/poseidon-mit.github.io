/**
 * GovernFooter — Governance audit footer required on all Tier 1-2 pages.
 *
 * Self-contained implementation matching v0 engine page pattern.
 * Renders: verified badge | audit ID (mono) | "Request human review" button.
 */
import { ShieldCheck, Shield, ExternalLink, User } from 'lucide-react'

export interface GovernFooterProps {
  auditId: string
  pageContext?: string
  className?: string
  activeTopThreat?: { id: string; merchant: string; confidence: number } | null
}

export function GovernFooter({
  auditId,
  pageContext,
  className = '',
  activeTopThreat,
}: GovernFooterProps) {
  const streamText = activeTopThreat
    ? [
        `[PROTECT MODEL v2.4]`,
        `[Target: ${activeTopThreat.id} (${activeTopThreat.merchant})]`,
        `[Confidence: ${Math.round(activeTopThreat.confidence * 100)}%]`,
        `[Human Approval Required]`,
        `[Govern Ledger: Recording]`,
      ].join('   ·   ')
    : `[POSEIDON AI ORCHESTRATOR]   ·   [All Engines Monitoring]   ·   [Govern Ledger: Active]`

  return (
    <footer
      className={`mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden ${className}`}
      role="contentinfo"
      aria-label="Governance verification footer"
    >
      {/* Immutable Event Stream */}
      <div className="overflow-hidden border-b border-white/[0.04] py-1.5 px-4 md:px-6">
        <div
          className="whitespace-nowrap text-[10px] font-mono text-white/20 animate-[scroll-left_20s_linear_infinite]"
          aria-hidden="true"
        >
          {streamText}{'      '}{streamText}
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10">
          <ShieldCheck size={14} className="text-blue-500" />
        </div>
        <span className="mission-govern-badge inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
          <Shield size={10} />
          Auditable
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-500">
          {auditId}
        </span>
        <ExternalLink size={12} className="text-slate-500" aria-hidden="true" />
      </div>
      <button
        disabled
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/[0.08] bg-transparent px-4 py-2 text-xs font-medium text-slate-500 cursor-not-allowed opacity-50"
        aria-label={pageContext ? `Request human review of ${pageContext}` : 'Request human review'}
      >
        <User size={14} />
        Request human review
      </button>
      </div>
    </footer>
  )
}

GovernFooter.displayName = 'GovernFooter'
