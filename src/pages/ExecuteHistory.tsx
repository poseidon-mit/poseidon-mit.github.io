import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  History,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  ExternalLink,
  Filter,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { GovernFooter, AuroraPulse, EmptyState } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useDemoState } from '@/lib/demo-state/provider'
import type { DemoAuditEvent } from '@/lib/demo-state/types'
import { selectExecuteActionsView, formatUsd, selectExecuteSavingsView } from '@/domain/poseidon-universe'
import { DEMO_THREAD } from '@/lib/demo-thread'

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

type DecisionFilter = 'all' | 'approved' | 'deferred' | 'rejected'

const DECISION_ICON: Record<string, typeof CheckCircle2> = {
  approved: CheckCircle2,
  deferred: Clock,
  rejected: XCircle,
}

const DECISION_COLOR: Record<string, string> = {
  approved: 'var(--state-healthy)',
  deferred: 'var(--state-warning)',
  rejected: 'var(--state-critical)',
}

const DECISION_BADGE_CLS: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  deferred: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
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
      <AuroraPulse color="var(--engine-execute)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-execute)', color: 'var(--bg-oled)' }}
      >
        Skip to main content
      </a>

      <motion.div
        id="main-content"
        className="flex flex-col gap-6 md:gap-8 lg:gap-10 pb-12 w-full"
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-execute)]/20 bg-[var(--engine-execute)]/10 text-[var(--engine-execute)] text-xs font-bold tracking-widest uppercase self-start shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              <History size={12} />
              Execute · History
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#F1F5F9]" style={{ fontFamily: 'var(--font-display)' }}>
              Execution History
            </h1>
            <p className="text-white/50 text-base">Audit log of all AI-automated financial actions with governance traceability.</p>
          </motion.div>

          {/* Stats Strip */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Total Decisions', value: totalDecisions, color: 'var(--engine-execute)' },
              { label: 'Approval Rate', value: totalDecisions > 0 ? `${approvalRate}%` : '-', color: 'var(--state-healthy)' },
              { label: 'Monthly Savings', value: formatUsd(savings.currentMonthlySavingsUsd), color: 'var(--engine-execute)' },
              { label: 'Compliance', value: `${DEMO_THREAD.complianceScore}/100`, color: 'var(--engine-govern)' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-[16px] border border-white/[0.06] backdrop-blur-xl bg-black/40 p-4 flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">{kpi.label}</span>
                <span className="text-xl font-mono font-medium tabular-nums" style={{ color: kpi.color, textShadow: `0 0 8px ${kpi.color}40` }}>
                  {kpi.value}
                </span>
              </div>
            ))}
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
            <div className="relative overflow-hidden rounded-[24px] p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
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

        <GovernFooter
          auditId={GOVERNANCE_META['/execute/history'].auditId}
          pageContext={GOVERNANCE_META['/execute/history'].pageContext}
        />
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
    <div className="relative overflow-hidden rounded-[20px] p-5 lg:p-6 border border-white/[0.06] backdrop-blur-2xl bg-black/40 shadow-xl flex items-center gap-4 hover:border-white/[0.12] transition-colors group">
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] to-transparent pointer-events-none" />

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
