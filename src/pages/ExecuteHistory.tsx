import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  History,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Zap,
  ExternalLink,
  Filter,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { EmptyState, EngineBadge } from '@/components/poseidon'
import { ListHeroBanner } from '@/components/poseidon/list-hero-banner'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useDemoState } from '@/lib/demo-state/provider'
import type { DemoAuditEvent } from '@/lib/demo-state/types'
import { selectExecuteActionsView, formatUsd, selectExecuteSavingsView } from '@/domain/poseidon-universe'
import { DEMO_THREAD } from '@/lib/demo-thread'
import { Card, CardContent } from '@/components/ui/card'

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
  const [showAutopsy, setShowAutopsy] = useState(false)

  const events = state.execute.events
  const actions = useMemo(() => selectExecuteActionsView(), [])
  const savings = selectExecuteSavingsView()

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

  const totalDecisions = events.length
  const approvedCount = events.filter((e) => e.decision === 'approved').length
  const deferredCount = events.filter((e) => e.decision === 'deferred').length
  const rejectedCount = events.filter((e) => e.decision === 'rejected').length
  const approvalRate = totalDecisions > 0 ? Math.round((approvedCount / totalDecisions) * 100) : 0

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
            engine="execute"
            icon={History}
            engineLabel="Execute · History"
            title="Execution History"
            subtitle="History of all your approved and completed actions."
            backTo="/execute"
            backLabel="Back to Queue"
            stats={[
              { label: 'Total', value: totalDecisions },
              { label: 'Approval', value: totalDecisions > 0 ? `${approvalRate}%` : '-', color: approvalRate >= 80 ? 'var(--state-healthy)' : approvalRate >= 50 ? 'var(--state-warning)' : 'var(--state-critical)' },
              { label: 'Savings/mo', value: formatUsd(savings.currentMonthlySavingsUsd) },
            ]}
          />
        </motion.div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-5">
          {/* Decision Autopsy toggle */}
          <motion.div variants={fadeUp}>
            <button
              onClick={() => setShowAutopsy(v => !v)}
              className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Decision Autopsy View</span>
              <ChevronDown size={12} className={cn('transition-transform duration-200', showAutopsy && 'rotate-180')} />
            </button>
            <div className={cn(
              'overflow-hidden transition-all duration-300',
              showAutopsy ? 'max-h-[200px] opacity-100 mt-3' : 'max-h-0 opacity-0',
            )}>
              <Card className="border border-white/[0.08] bg-white/[0.04] backdrop-blur-md shadow-sm">
                <CardContent className="p-5">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Compliance Score</span>
                      <span className="text-lg font-mono" style={{ color: 'var(--engine-govern)' }}>{DEMO_THREAD.complianceScore}/100</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">KYC Check</span>
                      <span className="text-lg font-mono" style={{ color: 'var(--state-healthy)' }}>Passed</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Risk Screening</span>
                      <span className="text-lg font-mono" style={{ color: 'var(--state-healthy)' }}>Clear</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Filter bar */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mr-1">Filter</span>
            {(['all', 'approved', 'deferred', 'rejected'] as DecisionFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setDecisionFilter(f)}
                className={cn(
                  'px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors',
                  decisionFilter === f ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/[0.03] text-muted-foreground border-white/[0.06] hover:border-white/10 hover:text-foreground',
                )}
              >
                {f} {f === 'approved' ? `(${approvedCount})` : f === 'deferred' ? `(${deferredCount})` : f === 'rejected' ? `(${rejectedCount})` : `(${totalDecisions})`}
              </button>
            ))}
          </motion.div>

          {/* History List */}
          {filteredEvents.length === 0 ? (
            <motion.div variants={fadeUp}>
              <Card className="border border-border bg-card shadow-sm">
                <CardContent className="p-12 flex items-center justify-center">
                  <EmptyState
                    icon={History}
                    title={totalDecisions === 0 ? 'No decisions yet' : 'No matching decisions'}
                    description={totalDecisions === 0 ? 'Actions you approve or defer from the Execute queue will appear here with full audit traceability.' : 'Try adjusting your filter to see more results.'}
                    accentColor="var(--engine-execute)"
                    action={totalDecisions === 0 ? { label: 'Go to Execute queue', onClick: () => navigate('/execute') } : undefined}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              {filteredEvents.map((event) => (
                <HistoryRow key={event.id} event={event} />
              ))}
            </motion.div>
          )}
        </div>
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
    <div className="rounded-xl border border-border bg-card shadow-sm p-5 lg:p-6 flex items-center gap-4 hover:shadow-md transition-shadow group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0" style={{ borderColor: `${color}30`, background: `${color}10`, boxShadow: `0 0 12px ${color}20` }}>
        <Icon size={18} style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium text-foreground tracking-wide">{event.actionTitle}</span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${badgeCls}`}>
            {event.decision}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
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

      <div className="hidden sm:flex items-center gap-4 shrink-0">
        {event.amountLabel !== '-' && (
          <span className="font-mono text-sm text-foreground">{event.amountLabel}</span>
        )}
        {event.confidence != null && (
          <span className="text-xs font-mono" style={{ color: event.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)' }}>
            {(event.confidence * 100).toFixed(0)}%
          </span>
        )}
        <Link
          to="/govern/audit"
          className="text-muted-foreground hover:text-blue-600 transition-colors p-1"
          aria-label="View in Govern audit"
        >
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  )
}
