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
  /** Compact mode: single-line, no ticker, no laser-scan. For detail/approval screens. */
  compact?: boolean
}

export function GovernFooter({
  auditId,
  pageContext,
  className = '',
  activeTopThreat,
  latestExecuteEvent,
  traceBinding,
  compact = false,
}: GovernFooterProps) {
  const streamText = latestExecuteEvent
    ? `Action approved   ·   ${latestExecuteEvent.actionTitle}   ·   Logged: ${latestExecuteEvent.govId}`
    : activeTopThreat
    ? `Alert detected   ·   ${activeTopThreat.id} (${activeTopThreat.counterparty})   ·   Confidence: ${Math.round(activeTopThreat.confidence * 100)}%`
    : `Poseidon is monitoring your finances   ·   All decisions are logged`

  const deepLinkHref = traceBinding
    ? `/govern/audit-detail?decision=${traceBinding.auditDecisionId}`
    : `/govern/audit-detail?decision=${auditId}`

  const isActive = !compact && !!(latestExecuteEvent || activeTopThreat)
  const displayId = traceBinding ? traceBinding.auditDecisionId : auditId
  const hashPreview = `0x${displayId.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase()}`

  /* ── Compact mode: single-line evidence trail, no animation ── */
  if (compact) {
    return (
      <footer
        className={cn('mt-8 rounded-xl border border-border bg-muted/30 px-4 py-2.5 md:px-6', className)}
        role="contentinfo"
        aria-label="Governance verification footer"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500 engine-text-govern shrink-0" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Verified</span>
          </div>
          <a
            href={deepLinkHref}
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            {displayId}
            <ExternalLink size={11} className="text-muted-foreground" aria-hidden="true" />
          </a>
        </div>
      </footer>
    )
  }

  /* ── Full mode: overview/list screens ── */
  return (
    <footer
      className={cn(
        'mt-8 rounded-2xl border bg-muted/20 overflow-hidden',
        isActive
          ? 'border-blue-200'
          : 'border-border',
        className,
      )}
      role="contentinfo"
      aria-label="Governance verification footer"
      style={isActive ? { backgroundImage: 'linear-gradient(90deg, transparent 30%, rgba(59,130,246,0.06) 50%, transparent 70%)' } : undefined}
    >
      {/* Immutable Event Stream — only scroll when active */}
      <div className="overflow-hidden border-b border-border py-1.5 px-4 md:px-6">
        <div
          key={streamText}
          className={cn(
            'whitespace-nowrap text-[10px] font-mono',
            '',
            latestExecuteEvent
              ? 'text-amber-500/40 engine-text-execute'
              : isActive ? 'text-muted-foreground/50' : 'text-muted-foreground/30',
          )}
          style={latestExecuteEvent ? { opacity: 0.3 } : undefined}
          aria-hidden="true"
        >
          {isActive ? <>{streamText}{'      '}{streamText}</> : streamText}
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 engine-bg-govern">
          <ShieldCheck size={14} className="text-blue-500 engine-text-govern" />
        </div>
        <span className="mission-govern-badge inline-flex items-center gap-1 rounded-full bg-emerald-50 engine-bg-protect px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 engine-text-protect">
          <Shield size={10} />
          Auditable
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
          <Lock size={10} />
          Immutable
        </span>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={deepLinkHref}
          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          {displayId}
        </a>
        <span className="text-[10px] font-mono text-muted-foreground/40 hidden md:inline">{hashPreview}…</span>
        <ExternalLink size={12} className="text-muted-foreground" aria-hidden="true" />
      </div>
      <button
        disabled
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-transparent px-4 py-2 text-xs font-medium text-muted-foreground cursor-not-allowed opacity-50"
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
