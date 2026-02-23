import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Zap,
  CheckCircle2,
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Timer,
} from 'lucide-react'
import { Link, useRouter } from '../router'
import { GovernFooter, ShapWaterfall, AuroraPulse, EmptyState } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { Dialog, DialogContent } from '../components/ui/dialog'
import { usePageTitle } from '../hooks/use-page-title'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { useDemoState } from '@/lib/demo-state/provider'
import { useToast } from '@/hooks/useToast'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { selectExecuteActionById } from '@/domain/poseidon-universe'
import type { ExecuteActionEntity, ExecutionStep } from '@/domain/poseidon-universe'
import { ENGINE_BADGE_CLASS } from '@/lib/engine-color-map'

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

const EXEC_TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  auto: { label: 'Auto', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  'semi-auto': { label: 'Semi-Auto', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  manual: { label: 'Manual', cls: 'bg-slate-400/15 text-slate-300 border-slate-400/20' },
  hybrid: { label: 'Hybrid', cls: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function ExecuteApproval() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: stagger } = getMotionPreset(prefersReducedMotion)
  const { state, setExecuteDecision } = useDemoState()
  const { showToast } = useToast()
  const { search, navigate } = useRouter()
  const [consentReviewed, setConsentReviewed] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'defer' } | null>(null)

  const actionId = useMemo(() => new URLSearchParams(search).get('actionId'), [search])
  const action = useMemo(() => (actionId ? selectExecuteActionById(actionId) : undefined), [actionId])

  usePageTitle(action ? `Approve: ${action.title}` : 'Action Approval')

  const actionStatus = actionId ? state.execute.actionStates[actionId]?.status ?? 'pending' : 'pending'
  const isAlreadyDecided = actionStatus !== 'pending'

  const handleConfirm = () => {
    if (!confirmAction || !action) return
    const decision = confirmAction.type === 'approve' ? 'approved' : 'deferred'
    setExecuteDecision({
      actionId: action.id,
      actionTitle: action.title,
      decision,
    })
    showToast({
      variant: decision === 'approved' ? 'success' : 'info',
      message: decision === 'approved'
        ? `${action.id} approved and logged to governance.`
        : `${action.id} deferred and queued for review.`,
    })
    setConfirmAction(null)
    navigate('/execute')
  }

  // No action found — show empty state
  if (!action) {
    return (
      <div className="relative min-h-screen w-full">
        <AuroraPulse color="var(--engine-execute)" intensity="subtle" />
        <div className="mx-auto flex flex-col items-center justify-center gap-8 pt-24 pb-12" style={{ maxWidth: '1440px' }}>
          <EmptyState
            icon={AlertTriangle}
            title="Action not found"
            description={actionId ? `No action with ID "${actionId}" exists in the queue.` : 'No action ID was provided in the URL.'}
            accentColor="var(--engine-execute)"
            action={{ label: 'Back to Execute queue', onClick: () => navigate('/execute') }}
          />
        </div>
      </div>
    )
  }

  const typeBadge = EXEC_TYPE_BADGE[action.executionType]
  const sourceLink = action.sourceEngine === 'Protect' && action.sourceEntityId
    ? { label: `From Protect alert ${action.sourceEntityId}`, to: `/protect/alert-detail?alertId=${action.sourceEntityId}` }
    : action.sourceEngine === 'Grow' && action.sourceEntityId
    ? { label: `From Grow recommendation ${action.sourceEntityId}`, to: '/grow/recommendations' }
    : null

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-execute)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-execute)', color: 'var(--bg-oled)' }}
      >
        Skip to main content
      </a>

      {/* Breadcrumb */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1440px' }}>
          <Link to="/execute" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-execute)' }}>
            <ArrowLeft className="h-4 w-4" />
            Execute
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Approve: {action.title}</span>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 lg:gap-10 pb-12 w-full pt-8 lg:pt-12 px-4 md:px-6 lg:px-8"
        style={{ maxWidth: '1440px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* Hero */}
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-execute)]/20 bg-[var(--engine-execute)]/10 text-[var(--engine-execute)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              <Zap size={12} />
              Execute · Action Approval
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/[0.05] ${ENGINE_BADGE_CLASS[action.engine]}`}>
              {action.engine}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${typeBadge.cls}`}>
              {typeBadge.label}
            </span>
            {action.reversible && (
              <span className="text-[10px] text-[var(--state-healthy)] font-semibold tracking-widest uppercase border border-[var(--state-healthy)]/20 px-2.5 py-1 bg-[var(--state-healthy)]/10 rounded-full">
                Reversible
              </span>
            )}
            {action.expiresIn && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase text-amber-400">
                <Timer size={10} />
                Expires in {action.expiresIn}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#F1F5F9] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {action.title}
          </h1>
          <p className="text-base md:text-lg text-white/50 max-w-3xl font-light leading-relaxed tracking-wide">
            {action.description}
          </p>

          {sourceLink && (
            <Link to={sourceLink.to} className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-execute)' }}>
              <ExternalLink size={12} />
              {sourceLink.label}
            </Link>
          )}

          {/* Amount + Confidence row */}
          <div className="flex flex-wrap items-center gap-6 py-3 border-y border-white/[0.06]">
            <span className="text-2xl font-mono font-light tracking-wide tabular-nums text-[var(--engine-execute)] drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">{action.amountLabel}</span>
            <div className="w-px h-6 bg-white/[0.06]" />
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-white/40">Confidence</span>
              <div className="h-2 w-20 rounded-full overflow-hidden bg-white/[0.05]">
                <div
                  className="h-full rounded-full shadow-[0_0_8px_currentColor]"
                  style={{
                    width: `${action.confidence * 100}%`,
                    background: action.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)',
                    color: action.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)',
                  }}
                />
              </div>
              <span className="text-base font-mono font-medium" style={{ color: action.confidence >= 0.9 ? 'var(--state-healthy)' : 'var(--state-warning)' }}>
                {(action.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-8">
            {/* Execution Plan Stepper */}
            <motion.div variants={fadeUpVariant}>
              <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-6 lg:p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10" style={{ color: 'var(--engine-execute)' }}>
                  <Zap size={14} />
                  Execution Plan
                </h2>
                <div className="relative z-10 flex flex-col">
                  {action.steps.map((step, i) => (
                    <StepperRow key={step.id} step={step} index={i} isLast={i === action.steps.length - 1} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Impact comparison */}
            <motion.div variants={fadeUpVariant}>
              <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-6 lg:p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10" style={{ color: 'var(--engine-execute)' }}>
                  <Zap size={14} />
                  Expected Outcome
                </h2>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-[16px] bg-emerald-500/5 border border-emerald-500/20 p-5 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                    <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest mb-3">If approved</p>
                    <p className="text-base text-white/80 font-light tracking-wide leading-relaxed">{action.impact.approved}</p>
                  </div>
                  <div className="rounded-[16px] bg-amber-500/5 border border-amber-500/20 p-5 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                    <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mb-3">If deferred</p>
                    <p className="text-base text-white/80 font-light tracking-wide leading-relaxed">{action.impact.deferred}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SHAP Evidence */}
            <motion.div variants={fadeUpVariant}>
              <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-6 lg:p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-widest mb-5 flex items-center gap-2 text-white/50">Mathematical Reasoning</h2>
                    <div className="space-y-4">
                      {action.factors.map((f) => (
                        <div key={f.label} className="flex items-center gap-4">
                          <span className="text-sm font-medium tracking-wide text-white/80 w-40 shrink-0">{f.label}</span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/10 shadow-inner">
                            <div className="h-full rounded-full shadow-[0_0_10px_currentColor] bg-amber-500/80" style={{ width: `${f.value * 100}%` }} />
                          </div>
                          <span className="text-sm font-mono text-white/70 w-12 text-right">{f.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--engine-protect)' }}>Decision Drivers</p>
                    <ShapWaterfall
                      factors={action.factors.map((f) => ({ name: f.label, value: f.value }))}
                      baseValue={50}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar: Consent + Actions */}
          <motion.aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0" variants={stagger}>
            <div className="sticky top-20 flex flex-col gap-6">
              {/* Consent Card */}
              <motion.div variants={fadeUpVariant}>
                <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-6 flex flex-col gap-5">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-3 relative z-10 flex items-center gap-2">
                    <ShieldCheck size={12} style={{ color: 'var(--engine-execute)' }} />
                    Consent Gate
                  </h3>

                  {isAlreadyDecided ? (
                    <div className="relative z-10 flex flex-col items-center gap-3 py-4">
                      <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--state-healthy)' }} />
                      <p className="text-sm text-white/70 text-center">
                        This action has been <span className="font-semibold text-white/90">{actionStatus}</span>.
                      </p>
                      <Link
                        to="/execute"
                        className={cn(buttonVariants({ variant: 'glass' }), 'rounded-xl px-6 py-2 text-sm border border-white/10')}
                      >
                        Back to Queue
                      </Link>
                    </div>
                  ) : (
                    <>
                      <label className="relative z-10 flex items-start gap-3 cursor-pointer group" data-slot="consent_scope">
                        <input
                          type="checkbox"
                          checked={consentReviewed}
                          onChange={(e) => setConsentReviewed(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-[var(--engine-execute)] cursor-pointer"
                        />
                        <span className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                          I have reviewed the execution plan and understand the expected outcome of this action.
                        </span>
                      </label>

                      <div className="relative z-10 flex flex-col gap-3">
                        <button
                          disabled={!consentReviewed}
                          className={cn(
                            buttonVariants({ variant: 'glass', size: 'lg' }),
                            'w-full rounded-2xl text-sm px-6 py-3 font-semibold cursor-pointer transition-all',
                            consentReviewed
                              ? 'bg-[var(--engine-execute)] text-black shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] hover:opacity-90 border-transparent'
                              : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed',
                          )}
                          onClick={() => setConfirmAction({ type: 'approve' })}
                        >
                          Approve Action
                        </button>
                        <button
                          className={cn(
                            buttonVariants({ variant: 'glass', size: 'lg' }),
                            'w-full rounded-2xl text-sm px-6 py-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer font-semibold',
                          )}
                          onClick={() => setConfirmAction({ type: 'defer' })}
                        >
                          Defer
                        </button>
                      </div>

                      {!consentReviewed && (
                        <p className="relative z-10 text-[10px] text-amber-400/60 text-center">
                          Review the execution plan and check the consent box to enable approval.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </motion.div>

              {/* Action Summary */}
              <motion.div variants={fadeUpVariant}>
                <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-6 flex flex-col gap-3">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-3 relative z-10">Action Summary</h3>
                  <div className="relative z-10 space-y-2.5">
                    {[
                      { label: 'Action ID', value: action.id },
                      { label: 'Engine', value: action.engine },
                      { label: 'Type', value: action.executionType },
                      { label: 'Category', value: action.category },
                      { label: 'Steps', value: `${action.steps.length} (${action.steps.filter((s) => s.requiresConsent).length} require consent)` },
                      { label: 'Reversible', value: action.reversible ? `Yes (${action.rollbackWindowHours ?? 24}h window)` : 'No' },
                      { label: 'Urgency', value: action.urgency },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-xs text-white/40 tracking-wide">{row.label}</span>
                        <span className="text-xs font-mono text-white/70">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </div>

        <GovernFooter
          auditId={GOVERNANCE_META['/execute/approval'].auditId}
          pageContext={GOVERNANCE_META['/execute/approval'].pageContext}
        />
      </motion.div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <Dialog open={true} onOpenChange={(open) => !open && setConfirmAction(null)}>
          <DialogContent
            className="max-w-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="execute-approval-confirm-title"
            style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="flex flex-col gap-4 p-2">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: confirmAction.type === 'approve' ? 'var(--engine-execute)' : 'var(--state-warning)' }}
                >
                  {confirmAction.type === 'approve' ? 'Confirm Approval' : 'Confirm Deferral'}
                </p>
                <h3 id="execute-approval-confirm-title" className="text-base font-semibold text-white">{action.title}</h3>
                <p className="text-xs text-white/50 mt-1">{action.description}</p>
              </div>

              {/* Step summary */}
              <div className="rounded-xl p-3 bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-wider mb-2 text-white/40">Execution plan ({action.steps.length} steps)</p>
                <div className="space-y-1.5">
                  {action.steps.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono border border-white/10 text-white/40">{i + 1}</span>
                      <span className="text-white/60">{s.label}</span>
                      {s.requiresConsent && <ShieldCheck size={10} className="text-amber-400/60 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl p-3"
                style={{
                  background: confirmAction.type === 'approve' ? 'rgba(34,197,94,0.05)' : 'rgba(251,191,36,0.08)',
                  border: `1px solid ${confirmAction.type === 'approve' ? 'rgba(34,197,94,0.2)' : 'rgba(251,191,36,0.22)'}`,
                }}
              >
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: confirmAction.type === 'approve' ? 'var(--engine-protect)' : 'var(--engine-execute)' }}>
                  {confirmAction.type === 'approve' ? 'Expected outcome' : 'If deferred'}
                </p>
                <p className="text-xs text-white/70">
                  {confirmAction.type === 'approve' ? action.impact.approved : action.impact.deferred}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  className={cn(buttonVariants({ variant: confirmAction.type === 'approve' ? 'glass' : 'secondary' }), 'w-full rounded-xl text-sm cursor-pointer')}
                  onClick={handleConfirm}
                >
                  {confirmAction.type === 'approve' ? 'Approve' : 'Defer'}
                </button>
                <button
                  className={cn(buttonVariants({ variant: 'secondary' }), 'w-full rounded-xl text-sm cursor-pointer')}
                  onClick={() => setConfirmAction(null)}
                >
                  Cancel
                </button>
              </div>

              <p className="text-[10px] text-white/25 text-center">
                Confidence {action.confidence} · {action.reversible ? 'Reversible' : 'Irreversible'} · {action.steps.length} steps
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   STEPPER ROW
   ═══════════════════════════════════════════ */

function StepperRow({ step, index, isLast }: { step: ExecutionStep; index: number; isLast: boolean }) {
  const isCompleted = step.status === 'completed'
  const isCurrent = step.status === 'current'
  const isWaiting = step.status === 'waiting' || step.status === 'blocked'

  return (
    <div className="flex gap-4">
      {/* Connector column */}
      <div className="flex flex-col items-center w-8 shrink-0">
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2',
          isCompleted && 'border-[var(--state-healthy)] bg-[var(--state-healthy)]/15 text-[var(--state-healthy)]',
          isCurrent && 'border-[var(--engine-execute)] bg-[var(--engine-execute)]/15 text-[var(--engine-execute)] shadow-[0_0_12px_rgba(251,191,36,0.3)]',
          isWaiting && 'border-white/15 bg-white/5 text-white/30',
        )}>
          {isCompleted ? <CheckCircle2 size={14} /> : index + 1}
        </div>
        {!isLast && (
          <div className={cn(
            'w-0.5 flex-1 my-1',
            isCompleted ? 'bg-[var(--state-healthy)]/30' : 'bg-white/10',
          )} />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={cn(
            'text-sm font-medium tracking-wide',
            isCompleted && 'text-white/60',
            isCurrent && 'text-white',
            isWaiting && 'text-white/40',
          )}>
            {step.label}
          </span>
          <span className={cn(
            'inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest',
            step.actor === 'agent' ? 'text-cyan-400/60' : 'text-violet-400/60',
          )}>
            {step.actor === 'agent' ? <Bot size={10} /> : <User size={10} />}
            {step.actor}
          </span>
          {step.requiresConsent && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-amber-400/70 border border-amber-400/20 px-1.5 py-0.5 rounded-md bg-amber-400/5">
              <ShieldCheck size={9} />
              Consent
            </span>
          )}
          {step.estimatedDuration && (
            <span className="text-[10px] text-white/30 font-mono">{step.estimatedDuration}</span>
          )}
        </div>
        <p className={cn(
          'text-xs leading-relaxed',
          isCompleted && 'text-white/40',
          isCurrent && 'text-white/60',
          isWaiting && 'text-white/30',
        )}>
          {step.description}
        </p>
      </div>
    </div>
  )
}

export default ExecuteApproval
