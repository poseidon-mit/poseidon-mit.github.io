/**
 * GovernFooter — Trust indicator bar for all Tier 1-2 pages.
 *
 * Collapsed: "100% Auditable · N records · Last: Xm ago"
 * Expanded:  Latest AI decisions preview with engine-context filtering.
 * Compact:   Single-line verified badge for detail/approval screens.
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ChevronUp, ExternalLink, Shield, TrendingUp, Zap, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import { accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { selectGovernFooterView } from '@/domain/poseidon-universe/selectors'
import type { GovernAuditEntryEntity } from '@/domain/poseidon-universe/types'
import type { GovernTraceBinding } from '@/lib/govern-trace'

export interface GovernFooterProps {
  auditId: string
  pageContext?: string
  className?: string
  currentEngine?: string
  traceBinding?: GovernTraceBinding
  /** Compact mode: single-line for detail/approval screens. */
  compact?: boolean
}

const ENGINE_ICONS: Record<string, typeof Shield> = {
  Protect: Shield,
  Grow: TrendingUp,
  Execute: Zap,
  Govern: Scale,
}

const ENGINE_COLORS: Record<string, string> = {
  Protect: 'text-emerald-600 bg-emerald-50',
  Grow: 'text-violet-600 bg-violet-50',
  Execute: 'text-amber-600 bg-amber-50',
  Govern: 'text-blue-600 bg-blue-50',
}

const STATUS_STYLES: Record<string, string> = {
  Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending review': 'bg-amber-50 text-amber-700 border-amber-200',
  Flagged: 'bg-red-50 text-red-700 border-red-200',
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hrs = Math.floor(min / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
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

  const displayId = traceBinding ? traceBinding.auditDecisionId : auditId
  const deepLinkHref = traceBinding
    ? `/govern/audit-detail?decision=${traceBinding.auditDecisionId}`
    : `/govern/audit-detail?decision=${auditId}`

  /* ── Compact mode: single-line evidence trail ── */
  if (compact) {
    return (
      <footer
        className={cn('mt-8 rounded-xl border border-border bg-muted/30 px-4 py-2.5 md:px-6', className)}
        role="contentinfo"
        aria-label="Governance verification footer"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-blue-500 shrink-0" />
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

  /* ── Full mode: trust indicator bar with expandable preview ── */
  return <FullFooter
    currentEngine={currentEngine}
    expanded={expanded}
    setExpanded={setExpanded}
    className={className}
    pageContext={pageContext}
  />
}

GovernFooter.displayName = 'GovernFooter'

/* ── Full mode extracted to allow hooks at top level ── */

function FullFooter({
  currentEngine,
  expanded,
  setExpanded,
  className,
  pageContext,
}: {
  currentEngine?: string
  expanded: boolean
  setExpanded: (v: boolean) => void
  className: string
  pageContext?: string
}) {
  const footerData = useMemo(
    () => selectGovernFooterView(currentEngine),
    [currentEngine],
  )

  const lastTime = footerData.lastRecordIso ? relativeTime(footerData.lastRecordIso) : 'N/A'

  return (
    <footer
      className={cn(
        'rounded-2xl border border-blue-100 bg-blue-50/60 overflow-hidden',
        className,
      )}
      role="contentinfo"
      aria-label={pageContext ? `Governance audit: ${pageContext}` : 'Governance audit footer'}
    >
      {/* Collapsed bar */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 md:px-6 min-h-[44px] text-left hover:bg-blue-50/80 transition-colors"
        aria-expanded={expanded}
        aria-controls="govern-footer-preview"
      >
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <FileText size={16} className="text-blue-600 shrink-0" />
          <span className="text-sm font-semibold text-blue-700">100% Auditable</span>
          <span className="text-sm text-blue-500" aria-label={`${footerData.total} records`}>
            · {footerData.total.toLocaleString()} records
          </span>
          <span className="text-sm text-blue-400">
            · Last: {lastTime}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/govern/audit"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors hidden sm:inline"
          >
            View Audit
          </a>
          <ChevronUp
            size={16}
            className={cn(
              'text-blue-400 transition-transform duration-200',
              expanded ? '' : 'rotate-180',
            )}
          />
        </div>
      </button>

      {/* Expanded preview */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="govern-footer-preview"
            variants={accordionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={accordionTransition}
            className="overflow-hidden"
          >
            <div className="border-t border-blue-100 bg-white px-4 py-3 md:px-6">
              <p className="text-xs font-medium text-gray-500 mb-2.5">Latest AI Decisions</p>
              <div className="space-y-2">
                {footerData.latestEntries.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
                {footerData.latestEntries.length === 0 && (
                  <p className="text-xs text-gray-400 py-2">No decisions recorded yet</p>
                )}
              </div>
              <a
                href="/govern/audit"
                className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors min-h-[44px]"
              >
                View Full Audit Trail
                <ChevronUp size={14} className="rotate-90" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

function EntryRow({ entry }: { entry: GovernAuditEntryEntity }) {
  const Icon = ENGINE_ICONS[entry.type] ?? Scale
  const colors = ENGINE_COLORS[entry.type] ?? 'text-blue-600 bg-blue-50'
  const [iconColor, iconBg] = colors.split(' ')
  const statusStyle = STATUS_STYLES[entry.status] ?? STATUS_STYLES.Verified
  const time = relativeTime(entry.timestampIso)

  return (
    <div className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-gray-50">
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', iconBg)}>
          <Icon size={14} className={iconColor} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{entry.action}</p>
          <p className="text-xs text-gray-500">{entry.id} · {time}</p>
        </div>
      </div>
      <span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold', statusStyle)}>
        {entry.status}
      </span>
    </div>
  )
}
