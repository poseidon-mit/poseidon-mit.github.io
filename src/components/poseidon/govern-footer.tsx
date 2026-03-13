import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, FileText, Lock, Shield, ShieldCheck, User } from 'lucide-react'
import { Link } from '@/router'
import { accordionTransition, accordionVariants } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { selectGovernFooterView } from '@/domain/poseidon-universe'
import type { GovernAuditEntryEntity } from '@/domain/poseidon-universe/types'
import type { GovernTraceBinding } from '@/lib/govern-trace'

export interface GovernFooterProps {
  auditId: string
  pageContext?: string
  className?: string
  currentEngine?: string
  traceBinding?: GovernTraceBinding
  compact?: boolean
}

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return 'N/A'
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.max(0, Math.floor(diff / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function EntryRow({ entry }: { entry: GovernAuditEntryEntity }) {
  return (
    <Link
      to={`/govern/audit-detail?decision=${entry.id}`}
      className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]"
    >
      <div className="min-w-0">
        <p className="truncate text-sm text-white">{entry.action}</p>
        <p className="mt-1 text-xs text-white/38">
          {entry.id} · {relativeTime(entry.timestampIso)}
        </p>
      </div>
      <span className="shrink-0 rounded-full border border-white/[0.08] px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/55">
        {entry.status}
      </span>
    </Link>
  )
}

export function GovernFooter({
  auditId,
  pageContext,
  className = '',
  currentEngine,
  traceBinding,
  compact = false,
}: GovernFooterProps) {
  const [expanded, setExpanded] = useState(false)
  const footerData = useMemo(
    () => selectGovernFooterView(currentEngine),
    [currentEngine],
  )

  const displayId = traceBinding?.auditDecisionId ?? auditId
  const deepLinkHref = `/govern/audit-detail?decision=${displayId}`

  if (compact) {
    return (
      <footer
        className={cn('rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3', className)}
        role="contentinfo"
        aria-label="Governance verification footer"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--engine-govern)]" />
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
              Verified
            </span>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-blue-400">
              Auditable
            </span>
          </div>
          <Link
            to={deepLinkHref}
            className="inline-flex items-center gap-1 text-xs font-mono text-white/55 transition-colors hover:text-white"
          >
            {displayId}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className={cn('overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]', className)}
      role="contentinfo"
      aria-label="Governance verification footer"
    >
      <div className="overflow-hidden border-b border-white/[0.04] px-4 py-1.5 md:px-6">
        <div className="whitespace-nowrap text-[10px] font-mono text-white/22">
          Poseidon is monitoring your finances · All decisions are logged · Poseidon is monitoring your finances · All decisions are logged
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10">
            <FileText className="h-4 w-4 text-[var(--engine-govern)]" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
            <Shield className="h-3 w-3" />
            Auditable
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-blue-400">
            <Lock className="h-3 w-3" />
            Immutable
          </span>
          {pageContext && (
            <span className="text-xs text-white/45">{pageContext}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={deepLinkHref}
            className="inline-flex items-center gap-1 text-xs font-mono text-white/55 transition-colors hover:text-white"
          >
            {displayId}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-medium text-white/72 transition-colors hover:bg-white/[0.04]"
            aria-label={pageContext ? `Request human review of ${pageContext}` : 'Request human review'}
          >
            <User className="h-3.5 w-3.5" />
            Request human review
          </button>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-medium text-white/72 transition-colors hover:bg-white/[0.04]"
            aria-expanded={expanded}
            aria-controls="govern-footer-preview"
          >
            {expanded ? 'Hide' : 'Show'} recent decisions
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 text-xs text-white/42 md:px-6">
        100% Auditable · {footerData.total.toLocaleString()} records · Last: {relativeTime(footerData.lastRecordIso)}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="govern-footer-preview"
            variants={accordionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={accordionTransition}
            className="overflow-hidden border-t border-white/[0.04] bg-black/10"
          >
            <div className="space-y-3 px-4 py-4 md:px-6">
              {footerData.latestEntries.length === 0 ? (
                <p className="text-xs text-white/35">No decisions recorded yet.</p>
              ) : (
                footerData.latestEntries.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

GovernFooter.displayName = 'GovernFooter'
