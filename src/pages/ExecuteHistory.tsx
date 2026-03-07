import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  History,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Zap,
  ExternalLink,
  Filter,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { EmptyState, EngineBadge } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useDemoState } from '@/lib/demo-state/provider'
import type { DemoAuditEvent } from '@/lib/demo-state/types'
import { selectExecuteActionsView, formatUsd, selectExecuteSavingsView } from '@/domain/poseidon-universe'
import { DEMO_THREAD } from '@/lib/demo-thread'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout'

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

type DecisionFilter = 'all' | 'approved' | 'deferred' | 'rejected'

const DECISION_ICON: Record<string, typeof CheckCircle2> = {
  approved: CheckCircle2,
  deferred: Clock,
  rejected: XCircle,
  undo: RotateCcw,
}

const DECISION_COLOR: Record<string, string> = {
  approved: 'var(--state-healthy)',
  deferred: 'var(--state-warning)',
  rejected: 'var(--state-critical)',
  undo: 'var(--engine-execute)',
}

const DECISION_BADGE_CLS: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  deferred: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  undo: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function ExecuteHistoryPage() {
  usePageTitle('Execution History')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { state } = useDemoState()
  const { navigate } = useRouter()

  const [decisionFilter, setDecisionFilter] = useState<DecisionFilter>('all')

  const events = state.execute.events
  const actions = useMemo(() => selectExecuteActionsView(), [])
  const savings = selectExecuteSavingsView()

  // Enrich events with action data
  const enrichedEvents = useMemo(() => {
    return events.map((event) => {
      const action = actions.find((a) => a.id === event.actionId)
      return {
        ...event,
        engine: action?.engine ?? event.engine ?? 'Execute',
        amountLabel: action?.amountLabel ?? event.amountLabel ?? '-',
        confidence: action?.confidence,
        executionType: action?.executionType,
      }
    })
  }, [events, actions])

  const filteredEvents = useMemo(() => {
    if (decisionFilter === 'all') return enrichedEvents
    return enrichedEvents.filter((e) => e.decision === decisionFilter)
  }, [enrichedEvents, decisionFilter])

  // Stats
  const totalDecisions = events.length
  const approvedCount = events.filter((e) => e.decision === 'approved').length
  const deferredCount = events.filter((e) => e.decision === 'deferred').length
  const rejectedCount = events.filter((e) => e.decision === 'rejected').length
  const approvalRate = totalDecisions > 0 ? Math.round((approvedCount / totalDecisions) * 100) : 0

  return (
    <div className="relative min-h-screen w-full">

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 lg:gap-10 pb-12`}
        style={PAGE_CONTENT_STYLE}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* Header */}
        <motion.section variants={staggerContainer} className="flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Link to="/execute" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
              <ArrowLeft size={16} />
              Back to Queue
            </Link>
          </div>

          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <EngineBadge engine="execute" icon={History} label="Execute · History" className="self-start" />
            <h1 className={PAGE_HEADING_CLASS} style={PAGE_HEADING_STYLE}>
              Execution History
            </h1>
            <p className="text-white/50 text-base">Audit log of all AI-automated financial actions with governance traceability.</p>
          </motion.div>

          {/* Stats Strip */}
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {[
                { label: 'Total Decisions', value: String(totalDecisions), color: 'var(--engine-execute)' },
                { label: 'Approval Rate', value: totalDecisions > 0 ? `${approvalRate}%` : '-', color: 'var(--state-healthy)' },
                { label: 'Monthly Savings', value: formatUsd(savings.currentMonthlySavingsUsd), color: 'var(--engine-execute)' },
                { label: 'Compliance', value: `${DEMO_THREAD.complianceScore}/100`, color: 'var(--engine-govern)' },
              ].map((kpi, i) => (
                <div key={kpi.label} className={cn('flex flex-col gap-1.5', i > 0 && 'md:border-l md:border-white/[0.06] md:pl-6')}>
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/40">{kpi.label}</span>
                  <span
                    className="text-2xl md:text-3xl font-mono tabular-nums font-medium"
                    style={{ color: kpi.color }}
                  >
                    {kpi.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Filter bar */}
        <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-white/40" />
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mr-1">Filter</span>
          {(['all', 'approved', 'deferred', 'rejected'] as DecisionFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setDecisionFilter(f)}
              className={cn(
                'px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors',
                decisionFilter === f ? 'border-white/20 bg-white/10 text-white' : 'border-white/5 text-white/40 hover:text-white/60',
              )}
            >
              {f} {f === 'approved' ? `(${approvedCount})` : f === 'deferred' ? `(${deferredCount})` : f === 'rejected' ? `(${rejectedCount})` : `(${totalDecisions})`}
            </button>
          ))}
        </motion.div>

        {/* History List */}
        {filteredEvents.length === 0 ? (
          <motion.div variants={fadeUp}>
            <div className="glass-card glass-card-overlay rounded-[24px] p-12 flex items-center justify-center">
              <EmptyState
                icon={History}
                title={totalDecisions === 0 ? 'No decisions yet' : 'No matching decisions'}
                description={totalDecisions === 0 ? 'Actions you approve or defer from the Execute queue will appear here with full audit traceability.' : 'Try adjusting your filter to see more results.'}
                accentColor="var(--engine-execute)"
                action={totalDecisions === 0 ? { label: 'Go to Execute queue', onClick: () => navigate('/execute') } : undefined}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            {filteredEvents.map((event) => (
              <HistoryRow key={event.id} event={event} />
            ))}
          </motion.div>
        )}

      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   HISTORY ROW
   ═══════════════════════════════════════════ */

interface EnrichedEvent extends DemoAuditEvent {
  engine: string
  amountLabel: string
  confidence?: number
  executionType?: string
}

function HistoryRow({ event }: { event: EnrichedEvent }) {
  const Icon = DECISION_ICON[event.decision] ?? History
  const color = DECISION_COLOR[event.decision] ?? 'var(--engine-execute)'
  const badgeCls = DECISION_BADGE_CLS[event.decision] ?? ''

  const formattedDate = useMemo(() => {
    try {
      return new Date(event.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return event.createdAt
    }
  }, [event.createdAt])

  return (
    <div className="glass-card glass-card-overlay rounded-[20px] p-5 lg:p-6 flex items-center gap-4 hover:border-white/[0.12] transition-colors group">

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner shrink-0 relative z-10" style={{ borderColor: `${color}30`, background: `${color}10` }}>
        <Icon size={18} style={{ color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium text-white/90 tracking-wide">{event.actionTitle}</span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${badgeCls}`}>
            {event.decision}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
          <span className="font-mono">{event.actionId}</span>
          <span>·</span>
          <span>{event.engine}</span>
          {event.executionType && (
            <>
              <span>·</span>
              <span>{event.executionType}</span>
            </>
          )}
          <span>·</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Amount + Confidence */}
      <div className="hidden sm:flex items-center gap-4 shrink-0 relative z-10">
        {event.amountLabel !== '-' && (
          <span className="font-mono text-sm text-white/70">{event.amountLabel}</span>
        )}
        {event.confidence != null && (
          <span className="text-xs font-mono" style={{ color: event.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)' }}>
            {(event.confidence * 100).toFixed(0)}%
          </span>
        )}
        <Link
          to="/govern/audit"
          className="text-white/30 hover:text-[var(--engine-govern)] transition-colors p-1"
          aria-label="View in Govern audit"
        >
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  )
}
