/**
 * GovernFooter — Governance audit footer required on all Tier 1-2 pages.
 *
 * Self-contained implementation matching v0 engine page pattern.
 * Renders: verified badge | audit ID (mono) | "Request human review" button.
 */
import { ShieldCheck, Shield, Lock, ExternalLink, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GovernTraceBinding } from '@/lib/govern-trace'

export interface GovernFooterProps {
  auditId: string
  pageContext?: string
  className?: string
  activeTopThreat?: { id: string; counterparty: string; confidence: number } | null
  latestExecuteEvent?: { govId: string; actionId: string; actionTitle: string } | null
  traceBinding?: GovernTraceBinding
}

export function GovernFooter({
  auditId,
  pageContext,
  className = '',
  activeTopThreat,
  latestExecuteEvent,
  traceBinding,
}: GovernFooterProps) {
  const streamText = latestExecuteEvent
    ? `Action approved   ·   ${latestExecuteEvent.actionTitle}   ·   Logged: ${latestExecuteEvent.govId}`
    : activeTopThreat
    ? `Alert detected   ·   ${activeTopThreat.id} (${activeTopThreat.counterparty})   ·   Confidence: ${Math.round(activeTopThreat.confidence * 100)}%`
    : `Poseidon is monitoring your finances   ·   All decisions are logged`

  const deepLinkHref = traceBinding
    ? `/govern/audit-detail?decision=${traceBinding.auditDecisionId}`
    : `/govern/audit-detail?decision=${auditId}`

  const isActive = !!(latestExecuteEvent || activeTopThreat)
  const displayId = traceBinding ? traceBinding.auditDecisionId : auditId
  const hashPreview = `0x${displayId.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase()}`

  return (
    <footer
      className={cn(
        'mt-8 rounded-2xl border bg-white/[0.03] overflow-hidden',
        isActive
          ? 'border-[var(--engine-govern)]/30 laser-scan-animated animate-[laser-scan_2s_ease-out] bg-[length:200%_100%]'
          : 'border-white/[0.06]',
        className,
      )}
      role="contentinfo"
      aria-label="Governance verification footer"
      style={isActive ? { backgroundImage: 'linear-gradient(90deg, transparent 30%, rgba(59,130,246,0.12) 50%, transparent 70%)' } : undefined}
    >
      {/* Immutable Event Stream */}
      <div className="overflow-hidden border-b border-white/[0.04] py-1.5 px-4 md:px-6">
        <div
          key={streamText}
          className={cn(
            'whitespace-nowrap text-[10px] font-mono animate-[scroll-left_20s_linear_infinite]',
            latestExecuteEvent
              ? 'text-amber-400/30 engine-text-execute'
              : isActive ? 'text-white/30' : 'text-white/20',
          )}
          style={latestExecuteEvent ? { opacity: 0.3 } : undefined}
          aria-hidden="true"
        >
          {streamText}{'      '}{streamText}
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 engine-bg-govern">
          <ShieldCheck size={14} className="text-blue-500 engine-text-govern" />
        </div>
        <span className="mission-govern-badge inline-flex items-center gap-1 rounded-full bg-emerald-500/10 engine-bg-protect px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-500 engine-text-protect">
          <Shield size={10} />
          Auditable
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
          <Lock size={10} />
          Immutable
        </span>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={deepLinkHref}
          className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
        >
          {displayId}
        </a>
        <span className="text-[10px] font-mono text-white/20 hidden md:inline">{hashPreview}…</span>
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
