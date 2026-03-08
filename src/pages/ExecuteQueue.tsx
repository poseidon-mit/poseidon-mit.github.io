import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Zap, CheckCircle2, Timer } from 'lucide-react'
import { Link, useRouter } from '@/router'
import { EmptyState, EngineBadge } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { useDemoState } from '@/lib/demo-state/provider'
import { selectExecuteActionsView } from '@/domain/poseidon-universe'
import type { ExecuteActionEntity, UrgencyLevel } from '@/domain/poseidon-universe'
import { getEngineToken, fromDomainEngine } from '@/lib/engine-tokens'
import { cn } from '@/lib/utils'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

const URGENCY_ORDER: Record<UrgencyLevel, number> = { high: 0, medium: 1, low: 2 }

const URGENCY_BADGE: Record<UrgencyLevel, string> = {
  high: 'bg-red-500/15 text-red-400 border border-red-500/20',
  medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  low: 'bg-white/5 text-white/40 border border-white/10',
}

export default function ExecuteQueuePage() {
  usePageTitle('Action Queue')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { state } = useDemoState()
  const { navigate } = useRouter()

  const allActions = useMemo(() => selectExecuteActionsView(), [])

  const pendingActions = useMemo(
    () =>
      allActions
        .filter(
          (a) => (state.execute.actionStates[a.id]?.status ?? 'pending') === 'pending',
        )
        .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]),
    [allActions, state.execute.actionStates],
  )

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
            to="/execute"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Execute
          </Link>
        </div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <EngineBadge engine="execute" icon={Zap} label="Execute · Authorization Queue" className="self-start" />
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
            Authorization Queue
          </h1>
          <p className="text-white/50 text-base">
            {pendingActions.length === 0
              ? 'All actions have been reviewed.'
              : `${pendingActions.length} action${pendingActions.length !== 1 ? 's' : ''} awaiting your authorization.`}
          </p>
        </motion.div>
      </motion.section>

      {/* Action list */}
      {pendingActions.length === 0 ? (
        <motion.div variants={fadeUp}>
          <div className="glass-card glass-card-overlay rounded-[24px] p-12 flex items-center justify-center">
            <EmptyState
              icon={CheckCircle2}
              title="Queue clear"
              description="All pending actions have been reviewed. Check execution history for past decisions."
              accentColor="var(--state-healthy)"
              action={{ label: 'View execution history', onClick: () => navigate('/execute/history') }}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          {pendingActions.map((action) => (
            <QueueCard key={action.id} action={action} />
          ))}
        </motion.div>
      )}
    </motion.main>
  )
}

function QueueCard({ action }: { action: ExecuteActionEntity }) {
  const token = getEngineToken(fromDomainEngine(action.engine))
  const isExpiringSoon = action.expiresIn && action.expiresIn.includes('h') && parseInt(action.expiresIn) <= 4

  return (
    <div
      className="glass-card glass-card-overlay rounded-[20px] p-5 lg:p-6 flex items-center gap-4 hover:border-white/[0.12] transition-colors border-l-2"
      style={{ borderLeftColor: `var(${token.cssVar})` }}
    >
      {/* Engine dot */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
        style={{ borderColor: `color-mix(in srgb, var(${token.cssVar}) 30%, transparent)`, background: `color-mix(in srgb, var(${token.cssVar}) 10%, transparent)` }}
      >
        <Zap size={16} style={{ color: `var(${token.cssVar})` }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium text-white/90 truncate">{action.title}</span>
          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest', URGENCY_BADGE[action.urgency])}>
            {action.urgency}
          </span>
          {action.expiresIn && (
            <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase', isExpiringSoon ? 'text-red-400' : 'text-white/40')}>
              <Timer size={10} className={isExpiringSoon ? 'animate-pulse' : ''} />
              {action.expiresIn}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
          <span className="font-mono">{action.id}</span>
          <span>·</span>
          <span style={{ color: `var(${token.cssVar})` }}>{action.engine}</span>
          <span>·</span>
          <span className="font-mono">{action.amountLabel}</span>
          <span>·</span>
          <span>{Math.round(action.confidence * 100)}% confidence</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/execute/approval?actionId=${action.id}`}
        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
        style={{
          borderColor: `color-mix(in srgb, var(${token.cssVar}) 30%, transparent)`,
          color: `var(${token.cssVar})`,
          background: `color-mix(in srgb, var(${token.cssVar}) 10%, transparent)`,
        }}
      >
        Review &amp; Approve
      </Link>
    </div>
  )
}
