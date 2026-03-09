import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/router'
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CircleDot,
  type LucideIcon,
} from 'lucide-react'
import { formatDemoTimestamp } from '@/lib/demo-date'
import { EmptyState, EngineBadge, PrioritySpotlight } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { selectGovernAuditEntries, selectSpotlightAuditEntry } from '@/domain/poseidon-universe'

/* ── Types ── */
type DecisionType = 'Protect' | 'Grow' | 'Execute' | 'Govern'
type DecisionStatus = 'Verified' | 'Pending review' | 'Flagged'
type FilterTab = 'All' | 'Verified' | 'Pending review' | 'Flagged'

const FILTER_TABS: FilterTab[] = ['All', 'Verified', 'Pending review', 'Flagged']

const typeColor: Record<DecisionType, string> = {
  Protect: 'var(--engine-protect)',
  Grow: 'var(--engine-grow)',
  Execute: 'var(--engine-execute)',
  Govern: 'var(--engine-govern)',
}
const typeBg: Record<DecisionType, string> = {
  Protect: 'rgba(34,197,94,0.12)',
  Grow: 'rgba(139,92,246,0.12)',
  Execute: 'rgba(234,179,8,0.12)',
  Govern: 'rgba(59,130,246,0.12)',
}
const statusCfg: Record<DecisionStatus, { color: string; bg: string; icon: LucideIcon }> = {
  Verified: { color: 'var(--engine-govern)', bg: 'rgba(59,130,246,0.12)', icon: CheckCircle2 },
  'Pending review': { color: 'var(--state-warning)', bg: 'rgba(245,158,11,0.12)', icon: Clock },
  Flagged: { color: 'var(--state-critical)', bg: 'rgba(239,68,68,0.12)', icon: AlertTriangle },
}

const toTimestamp = (iso: string) =>
  formatDemoTimestamp(iso, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })

/* ════════════════════════════════════════════════
   GOVERN AUDIT LEDGER
   Anchored to demo dataset: 2026-03-19
   ════════════════════════════════════════════════ */

export default function GovernAuditPage() {
  usePageTitle('Audit Ledger')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const spotlightEntry = selectSpotlightAuditEntry()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All')

  const entries = useMemo(() => {
    return selectGovernAuditEntries()
      .map(e => ({
        id: e.id,
        timestamp: toTimestamp(e.timestampIso),
        sortTime: new Date(e.timestampIso).getTime(),
        type: e.type as DecisionType,
        action: e.action,
        confidence: e.confidence,
        evidence: e.evidence,
        status: e.status as DecisionStatus,
      }))
      .sort((a, b) => b.sortTime - a.sortTime)
  }, [])

  // Dataset-level header counts (always shows full dataset totals)
  const verified = entries.filter(e => e.status === 'Verified').length
  const pending = entries.filter(e => e.status === 'Pending review').length

  const filtered = useMemo(() => {
    let list = entries
    if (activeFilter !== 'All') list = list.filter(e => e.status === activeFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(e =>
        e.id.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q),
      )
    }
    return list
  }, [entries, activeFilter, search])

  return (
    <motion.main
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 pb-12`}
      style={PAGE_CONTENT_STYLE}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.section variants={staggerContainer} className="flex flex-col gap-5">
        <div>
          <Link
            to="/govern"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Govern
          </Link>
        </div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <EngineBadge engine="govern" icon={ShieldCheck} label="Govern · Audit Ledger" className="self-start" />
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
            Audit Ledger
          </h1>
          <p className="text-white/50 text-base">
            {entries.length} decisions · {verified} verified
            {pending > 0 ? ` · ${pending} pending review` : ''}
          </p>
        </motion.div>

        {/* Search + filter bar */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] px-4 py-3 bg-white/[0.02] focus-within:border-[var(--engine-govern)]/50 transition-all">
            <Search size={16} className="text-white/40 shrink-0" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ID, type, or action…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/30 text-white"
              aria-label="Search audit ledger"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                  activeFilter === tab
                    ? 'bg-[var(--engine-govern)]/15 text-[var(--engine-govern)] border-[var(--engine-govern)]/30'
                    : 'bg-white/[0.04] text-white/40 border-white/10 hover:border-white/20 hover:text-white/60',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {filtered.length < entries.length && (
            <p className="text-xs text-white/30">
              Showing {filtered.length} of {entries.length}
            </p>
          )}
        </motion.div>
      </motion.section>

      {/* Priority Spotlight */}
      {spotlightEntry && (
        <motion.div variants={fadeUp}>
          <PrioritySpotlight engine="govern">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--engine-govern)' }}>
                Priority spotlight
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: statusCfg[spotlightEntry.status as DecisionStatus]?.bg, color: statusCfg[spotlightEntry.status as DecisionStatus]?.color }}>
                {spotlightEntry.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl border shrink-0"
                style={{
                  borderColor: `color-mix(in srgb, ${typeColor[spotlightEntry.type as DecisionType]} 30%, transparent)`,
                  background: typeBg[spotlightEntry.type as DecisionType],
                }}
              >
                <CircleDot size={16} style={{ color: typeColor[spotlightEntry.type as DecisionType] }} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 font-medium">{spotlightEntry.action}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                  <span className="font-mono">{spotlightEntry.id}</span>
                  <span>{Math.round(spotlightEntry.confidence * 100)}% confidence</span>
                  <span>{spotlightEntry.evidence} evidence</span>
                </div>
              </div>
              <Link
                to={`/govern/audit-detail?decision=${encodeURIComponent(spotlightEntry.id)}`}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
                style={{
                  borderColor: 'color-mix(in srgb, var(--engine-govern) 30%, transparent)',
                  color: 'var(--engine-govern)',
                  background: 'color-mix(in srgb, var(--engine-govern) 10%, transparent)',
                }}
              >
                View details
                <ArrowRight size={12} />
              </Link>
            </div>
          </PrioritySpotlight>
        </motion.div>
      )}

      {/* Entry list */}
      {filtered.length === 0 ? (
        <motion.div variants={fadeUp}>
          <div className="glass-card glass-card-overlay rounded-xl p-12 flex items-center justify-center">
            <EmptyState
              icon={Search}
              title="No matching decisions"
              description="Try adjusting filters or using a different search term."
              accentColor="var(--engine-govern)"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          {filtered.map(entry => (
            <AuditEntryCard key={entry.id} entry={entry} />
          ))}
        </motion.div>
      )}
    </motion.main>
  )
}

type AuditEntryRow = {
  id: string
  timestamp: string
  type: DecisionType
  action: string
  confidence: number
  evidence: number
  status: DecisionStatus
}

function AuditEntryCard({ entry }: { entry: AuditEntryRow }) {
  const sCfg = statusCfg[entry.status]
  const StatusIcon = sCfg.icon

  return (
    <div
      className="glass-card glass-card-overlay rounded-[20px] p-5 lg:p-6 flex items-center gap-4 hover:border-white/[0.12] transition-colors border-l-2"
      style={{ borderLeftColor: 'var(--engine-govern)' }}
    >
      {/* Type icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
        style={{
          borderColor: `color-mix(in srgb, ${typeColor[entry.type]} 30%, transparent)`,
          background: typeBg[entry.type],
        }}
      >
        <CircleDot size={16} style={{ color: typeColor[entry.type] }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs font-mono font-medium" style={{ color: 'var(--engine-govern)' }}>
            {entry.id}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
            style={{ background: typeBg[entry.type], color: typeColor[entry.type] }}
          >
            {entry.type}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
            style={{ background: sCfg.bg, color: sCfg.color }}
          >
            <StatusIcon size={9} />
            {entry.status}
          </span>
          <span className="text-[10px] text-white/30 ml-auto shrink-0">{entry.timestamp}</span>
        </div>
        <p className="text-sm text-white/70 truncate mb-1">{entry.action}</p>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span>{Math.round(entry.confidence * 100)}% confidence</span>
          <span>·</span>
          <span>{entry.evidence} evidence</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`}
        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
        style={{
          borderColor: 'color-mix(in srgb, var(--engine-govern) 30%, transparent)',
          color: 'var(--engine-govern)',
          background: 'color-mix(in srgb, var(--engine-govern) 10%, transparent)',
        }}
      >
        View details
        <ArrowRight size={12} />
      </Link>
    </div>
  )
}
