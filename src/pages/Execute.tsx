import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Lock,
} from 'lucide-react'
import { useRouter } from '@/router'
import { UndoBanner } from '@/components/execute/UndoBanner'
import { ExecuteApprovalCommandDeck } from '@/components/poseidon/execute-hero'
import { EngineBadge } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { ENGINE_COLOR_MAP } from '@/lib/engine-color-map'
import { useDemoState } from '@/lib/demo-state/provider'
import type { DemoExecuteDecision } from '@/lib/demo-state/types'
import { useToast } from '@/hooks/useToast'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import {
  selectExecuteActionsView,
  selectArchitecturalTrust,
  selectCohortHeadlines,
  selectExecuteActionById,
} from '@/domain/poseidon-universe'
import type { ExecuteEngineName, UrgencyLevel } from '@/domain/poseidon-universe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

type ActionStatus = 'pending' | 'approved' | 'rejected' | 'deferred'

const URGENCY_ORDER: Record<UrgencyLevel, number> = { high: 0, medium: 1, low: 2 }

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function statusFromDecision(value: DemoExecuteDecision): ActionStatus {
  switch (value) {
    case 'approved':
      return 'approved'
    case 'rejected':
      return 'rejected'
    case 'deferred':
      return 'deferred'
    default:
      return 'pending'
  }
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function ExecutePage() {
  usePageTitle('Execute')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { navigate, search } = useRouter()
  const { state, resetExecuteDecision } = useDemoState()
  const { showToast } = useToast()
  const trust = selectArchitecturalTrust()

  const allActions = useMemo(() => selectExecuteActionsView(), [])

  const queue = useMemo(
    () =>
      allActions.map((item) => {
        const status = statusFromDecision(state.execute.actionStates[item.id]?.status ?? 'pending') as ActionStatus
        return { ...item, status }
      }),
    [allActions, state.execute.actionStates],
  )

  // ── Hero data (page-global, NOT affected by list filters) ──
  const allPending = useMemo(
    () => queue.filter((a) => a.status === 'pending'),
    [queue],
  )

  const featuredAction = useMemo(() => {
    if (!allPending.length) return null
    const parseExpiry = (e: string | null): number => {
      if (!e) return Infinity
      const n = parseInt(e)
      if (e.includes('d')) return n * 24
      return n
    }
    return [...allPending].sort((a, b) => {
      const urgDiff = URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]
      if (urgDiff !== 0) return urgDiff
      return parseExpiry(a.expiresIn) - parseExpiry(b.expiresIn)
        || b.confidence - a.confidence
    })[0]
  }, [allPending])

  const agentStepsCompleted = featuredAction
    ? featuredAction.steps.filter((s) => s.actor === 'agent' && s.status === 'completed').length : 0
  const agentStepsTotal = featuredAction
    ? featuredAction.steps.filter((s) => s.actor === 'agent').length : 0

  const heroUrgentCount = useMemo(
    () => allPending.filter((a) => a.urgency === 'high').length,
    [allPending],
  )

  const engineSources = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of allPending) counts[a.sourceEngine] = (counts[a.sourceEngine] || 0) + 1
    return Object.entries(counts).map(([engine, count]) => ({
      engine: engine as ExecuteEngineName,
      count,
      color: ENGINE_COLOR_MAP[engine as keyof typeof ENGINE_COLOR_MAP],
    }))
  }, [allPending])

  const undoActionId = useMemo(() => new URLSearchParams(search).get('undo'), [search])
  const undoAction = useMemo(
    () => (undoActionId ? selectExecuteActionById(undoActionId) : null),
    [undoActionId],
  )

  return (
    <>

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12`}
        style={PAGE_CONTENT_STYLE}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* UNDO Banner */}
        {undoActionId && (
          <UndoBanner
            actionId={undoActionId}
            actionTitle={undoAction?.title}
            onUndo={() => {
              resetExecuteDecision(undoActionId, undoAction?.title ?? undoActionId)
              showToast({ message: 'Action cancelled · returned to queue', variant: 'info' })
              navigate('/execute')
            }}
            onDismiss={() => navigate('/execute')}
          />
        )}

        {/* Hero */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant}><EngineBadge engine="execute" icon={Zap} label="Queue Active" className="self-start" /></motion.div>
          <h1 className="sr-only">Execute</h1>
          <motion.div variants={fadeUpVariant} data-testid="system-status-row" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/30">
            <Lock size={10} className="text-amber-400/50 engine-text-execute" />
            <span>System Status: <span className="text-amber-400/70 engine-text-execute">{trust.autoExecutionsWithoutConsent}</span> auto-executions · You're always in control</span>
          </motion.div>
          <motion.div variants={fadeUpVariant}>
            <ExecuteApprovalCommandDeck
              queueTotal={allPending.length}
              urgentCount={heroUrgentCount}
              agentStepsCompleted={agentStepsCompleted}
              agentStepsTotal={agentStepsTotal}
              featuredAction={featuredAction ? {
                id: featuredAction.id,
                title: featuredAction.title,
                amountLabel: featuredAction.amountLabel,
                confidence: featuredAction.confidence,
                engine: featuredAction.engine,
                sourceEngine: featuredAction.sourceEngine,
                expiresIn: featuredAction.expiresIn ?? null,
                rollbackHours: featuredAction.rollbackWindowHours ?? null,
              } : null}
              engineSources={engineSources}
              onReviewApproval={featuredAction
                ? () => navigate(`/execute/approval?actionId=${featuredAction.id}`)
                : null}
            />
          </motion.div>
        </motion.section>

        {/* ── Cohort Insight ── */}
        <motion.p variants={fadeUpVariant} className="text-xs text-muted-foreground -mt-2">
          <span className="text-primary/70">Similar users</span> · {selectCohortHeadlines().execute}
        </motion.p>

      </motion.div>

    </>
  )
}

