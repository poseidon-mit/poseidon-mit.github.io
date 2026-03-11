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
  CircleDot,
  type LucideIcon,
} from 'lucide-react'
import { formatDemoTimestamp } from '@/lib/demo-date'
import { EmptyState, PrioritySpotlight } from '@/components/poseidon'
import { ListHeroBanner } from '@/components/poseidon/list-hero-banner'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { Card } from '@/components/ui/card'
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

  const verified = entries.filter(e => e.status === 'Verified').length
  const pendingCount = entries.filter(e => e.status === 'Pending review').length
  const flaggedCount = entries.filter(e => e.status === 'Flagged').length

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
    <div className="hero-viewport">
      <motion.div
        className="flex flex-col gap-5 h-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Banner */}
        <motion.div variants={fadeUp}>
          <ListHeroBanner
            engine="govern"
            icon={ShieldCheck}
            engineLabel="Govern · Audit Ledger"
            title="Audit Ledger"
            subtitle={`${entries.length} decisions · ${verified} verified${pendingCount > 0 ? ` · ${pendingCount} pending review` : ''}`}
            backTo="/govern"
            backLabel="Back to Govern"
            stats={[
              { label: 'Verified', value: verified },
              { label: 'Pending', value: pendingCount, color: 'var(--state-warning)' },
              { label: 'Flagged', value: flaggedCount, color: 'var(--state-critical)' },
            ]}
          />
        </motion.div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">
          {/* Search + filter bar */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] px-4 py-3 bg-white/[0.03] focus-within:border-blue-500/30 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
              <Search size={16} className="text-white/40 shrink-0" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search ID, type, or action…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40 text-foreground"
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
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                      : 'bg-white/[0.03] text-muted-foreground border-white/[0.06] hover:border-white/10 hover:text-foreground',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {filtered.length < entries.length && (
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {entries.length}
              </p>
            )}
          </motion.div>

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
                    <p className="text-sm text-foreground font-medium">{spotlightEntry.action}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="font-mono">{spotlightEntry.id}</span>
                      <span>{Math.round(spotlightEntry.confidence * 100)}% confidence</span>
                      <span>{spotlightEntry.evidence} evidence</span>
                    </div>
                  </div>
                  <Link
                    to={`/govern/audit-detail?decision=${encodeURIComponent(spotlightEntry.id)}`}
                    className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
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
              <Card className="rounded-xl p-12 flex items-center justify-center">
                <EmptyState
                  icon={Search}
                  title="No matching decisions"
                  description="Try adjusting filters or using a different search term."
                  accentColor="var(--engine-govern)"
                />
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              {filtered.filter(e => e.status !== 'Verified').map(entry => (
                <AuditEntryCard key={entry.id} entry={entry} />
              ))}

              {filtered.some(e => e.status !== 'Verified') && filtered.some(e => e.status === 'Verified') && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest shrink-0">
                    {filtered.filter(e => e.status === 'Verified').length} verified
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}

              {filtered.some(e => e.status === 'Verified') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.filter(e => e.status === 'Verified').map(entry => (
                    <CompactAuditCard key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
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

function CompactAuditCard({ entry }: { entry: AuditEntryRow }) {
  return (
    <Link
      to={`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`}
      className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors border-l-2 group"
      style={{ borderLeftColor: typeColor[entry.type] }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-medium" style={{ color: 'var(--engine-govern)' }}>
            {entry.id}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-transparent"
            style={{ background: typeBg[entry.type], color: typeColor[entry.type] }}
          >
            {entry.type}
          </span>
        </div>
        <span className="text-sm text-foreground truncate block">{entry.action}</span>
        <span className="text-[10px] text-muted-foreground mt-1 block">{entry.timestamp}</span>
        <span className="inline-flex items-center gap-1 text-[10px] mt-1" style={{ color: 'var(--engine-govern)' }}>
          <CheckCircle2 size={10} /> Verified
        </span>
      </div>
      <ArrowRight size={14} className="shrink-0 text-muted-foreground group-hover:text-blue-600 transition-colors" />
    </Link>
  )
}

function AuditEntryCard({ entry }: { entry: AuditEntryRow }) {
  const sCfg = statusCfg[entry.status]
  const StatusIcon = sCfg.icon
  const borderColor = typeColor[entry.type]

  return (
    <Link
      to={`/govern/audit-detail?decision=${encodeURIComponent(entry.id)}`}
      className="rounded-xl border border-border bg-card p-5 lg:p-6 flex items-center gap-4 transition-colors border-l-2 group block hover:bg-white/[0.02]"
      style={{ borderLeftColor: borderColor }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
        style={{
          borderColor: `color-mix(in srgb, ${typeColor[entry.type]} 30%, transparent)`,
          background: typeBg[entry.type],
          boxShadow: `0 0 10px color-mix(in srgb, ${typeColor[entry.type]} 15%, transparent)`,
        }}
      >
        <CircleDot size={16} style={{ color: typeColor[entry.type] }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs font-mono font-medium" style={{ color: 'var(--engine-govern)' }}>
            {entry.id}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: typeBg[entry.type], color: typeColor[entry.type] }}
          >
            {entry.type}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: sCfg.bg, color: sCfg.color }}
          >
            <StatusIcon size={11} />
            {entry.status}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{entry.timestamp}</span>
        </div>

        <p className="text-sm text-foreground mb-1">{entry.action}</p>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">{Math.round(entry.confidence * 100)}% confidence</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{entry.evidence} evidence</span>
        </div>
      </div>

      <span
        className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
        style={{
          borderColor: 'color-mix(in srgb, var(--engine-govern) 30%, transparent)',
          color: 'var(--engine-govern)',
          background: 'color-mix(in srgb, var(--engine-govern) 10%, transparent)',
        }}
      >
        View details
        <ArrowRight size={12} />
      </span>
    </Link>
  )
}
