import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Timer,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { ShapWaterfall, EmptyState, EngineBadge, ConfidenceIndicator, SubPageNav, ProofChips } from '@/components/poseidon'
import { SlideToApprove } from '@/components/poseidon/slide-to-approve'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { usePageTitle } from '@/hooks/use-page-title'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { useDemoState } from '@/lib/demo-state/provider'
import { useToast } from '@/hooks/useToast'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { selectExecuteActionById, selectDeliberationTrace } from '@/domain/poseidon-universe'
import type { ExecuteActionEntity } from '@/domain/poseidon-universe'
import { getRiskTier } from '@/lib/execute-risk-tier'
import { useExecuteApprovalFlow } from './useExecuteApprovalFlow'
import { ENGINE_BADGE_CLASS } from '@/lib/engine-color-map'
import { EXECUTION_TYPE_BADGE } from '@/lib/execution-type-config'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout'

export function ExecuteApproval() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: stagger } = getMotionPreset(prefersReducedMotion)
  const { state, setExecuteDecision } = useDemoState()
  const { search, navigate } = useRouter()
  const { showToast } = useToast()

  const actionId = useMemo(() => new URLSearchParams(search).get('actionId'), [search])
  const action = useMemo(() => (actionId ? selectExecuteActionById(actionId) : undefined), [actionId])

  usePageTitle(action ? `Approve: ${action.title}` : 'Action Approval')

  const actionStatus = actionId ? state.execute.actionStates[actionId]?.status ?? 'pending' : 'pending'
  const isAlreadyDecided = actionStatus !== 'pending'

  const {
    consentReviewed,
    setConsentReviewed,
    slideAuthorized,
    setSlideAuthorized,
    confirmAction,
    setConfirmAction,
    handleConfirm,
    executionPhase,
  } = useExecuteApprovalFlow(action, (decision) => {
    if (decision === 'approved') {
      navigate(`/execute?undo=${action!.id}`)
    } else {
      navigate('/execute')
    }
  })

  const riskTier = action ? getRiskTier(action) : 1
  const isTier2 = riskTier === 2
  const deliberationTrace = useMemo(() => {
    if (!action) return null
    // Try to find deliberation trace via event linkage
    return selectDeliberationTrace(action.sourceEntityId ?? '')
  }, [action])

  if (!action) {
    return (
      <div className="relative min-h-screen w-full">
        <div className="mx-auto flex flex-col items-center justify-center gap-8 pt-24 pb-12 px-5" style={{ maxWidth: '1440px' }}>
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

  const typeBadge = EXECUTION_TYPE_BADGE[action.executionType]
  const sourceLink = action.sourceEngine === 'Protect' && action.sourceEntityId
    ? { label: `From Protect alert ${action.sourceEntityId}`, to: `/protect/alert-detail?alertId=${action.sourceEntityId}` }
    : action.sourceEngine === 'Grow' && action.sourceEntityId
    ? { label: `From Grow recommendation ${action.sourceEntityId}`, to: '/grow/recommendations' }
    : null

  return (
    <div className="relative min-h-screen w-full">

      <SubPageNav engine="execute" parentPath="/execute" parentLabel="Execute" currentLabel={`Approve: ${action.title}`} />

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 pb-12 pt-8 lg:pt-12`}
        style={PAGE_CONTENT_STYLE}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* Compact Hero */}
        <motion.div variants={fadeUpVariant} className="glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <EngineBadge engine="execute" icon={Zap} label="Execute · Approval" />
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/[0.05] ${ENGINE_BADGE_CLASS[action.engine]}`}>
              {action.engine}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${typeBadge.cls}`}>
              {typeBadge.label}
            </span>
            {action.expiresIn && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--engine-execute)', opacity: 0.7 }}>
                <Timer size={10} />
                Expires in {action.expiresIn}
              </span>
            )}
          </div>

          <h1 className={PAGE_HEADING_CLASS} style={PAGE_HEADING_STYLE}>
            {action.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6">
            <span className="text-2xl font-mono font-light tracking-wide tabular-nums" style={{ color: 'var(--engine-execute)', opacity: 0.8 }}>{action.amountLabel}</span>
            <div className="w-px h-6 bg-white/[0.06]" />
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-white/40">Confidence</span>
              <ConfidenceIndicator value={action.confidence} format="percent" size="lg" />
            </div>
          </div>

          <p className="text-sm text-white/50 max-w-3xl font-light leading-relaxed">
            {action.description}
          </p>

          {sourceLink && (
            <Link to={sourceLink.to} className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-execute)' }}>
              <ExternalLink size={12} />
              {sourceLink.label}
            </Link>
          )}
        </motion.div>

        {/* Split-Pane Layout: Left=Evidence (55%) · Right=Execution+Consent (45%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4 md:gap-6">

          {/* ═══ LEFT PANE: Evidence ═══ */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* The Catalyst */}
            <motion.div variants={fadeUpVariant}>
              <div className="glass-card glass-card-overlay p-5 md:p-6 flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <Zap size={12} className="text-amber-500/70" />
                  The Catalyst
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border border-white/[0.05] ${ENGINE_BADGE_CLASS[action.sourceEngine]}`}>
                    {action.sourceEngine}
                  </span>
                  <ArrowRight size={12} className="text-white/20" />
                  <span className="text-xs text-white/50">Execute</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{action.description}</p>
              </div>
            </motion.div>

            {/* Decision Drivers (SHAP) + ProofChips */}
            <motion.div variants={fadeUpVariant}>
              <div className="glass-card glass-card-overlay p-5 md:p-6 flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">Decision Drivers</h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  Primary signal: <span className="text-white/80 font-medium">{action.factors[0]?.label}</span> at {action.factors[0]?.value.toFixed(2)}, supported by {action.factors.length - 1} additional factors.
                </p>
                <ShapWaterfall
                  factors={action.factors.map((f) => ({ name: f.label, value: f.value }))}
                  baseValue={50}
                  className="mt-1"
                />
                {action.factors.length > 1 && (
                  <ProofChips
                    total={action.amountLabel}
                    parts={action.factors.slice(0, 3).map((f) => ({ label: f.label, value: Math.round(f.value * 100) }))}
                    formatValue={(v) => `${v}%`}
                  />
                )}
              </div>
            </motion.div>

            {/* Impact */}
            <motion.div variants={fadeUpVariant}>
              <div className="glass-card glass-card-overlay p-5 md:p-6 flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <Zap size={12} className="text-amber-500/70" />
                  Impact Assessment
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-4">
                    <p className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-widest mb-2">If approved</p>
                    <p className="text-sm text-white/70 font-light leading-relaxed">{action.impact.approved}</p>
                  </div>
                  <div className="rounded-2xl bg-amber-500/5 border border-amber-500/15 p-4">
                    <p className="text-[10px] font-semibold text-amber-400/80 uppercase tracking-widest mb-2">If deferred</p>
                    <p className="text-sm text-white/70 font-light leading-relaxed">{action.impact.deferred}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Deliberation Trace (if available) */}
            {deliberationTrace && (
              <motion.div variants={fadeUpVariant}>
                <div className="glass-card glass-card-overlay p-5 md:p-6 flex flex-col gap-4">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">Deliberation Trace</h2>
                  <div className="flex flex-col gap-3">
                    {deliberationTrace.rounds.map((round, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className={cn(
                          'w-2 h-2 rounded-full mt-1.5 shrink-0',
                          round.position === 'support' && 'bg-emerald-400',
                          round.position === 'oppose' && 'bg-red-400',
                          round.position === 'modify' && 'bg-amber-400',
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-white/80">{round.roleId}</span>
                            <span className={cn(
                              'text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border',
                              round.position === 'support' && 'text-emerald-400/80 border-emerald-500/20 bg-emerald-500/5',
                              round.position === 'oppose' && 'text-red-400/80 border-red-500/20 bg-red-500/5',
                              round.position === 'modify' && 'text-amber-400/80 border-amber-500/20 bg-amber-500/5',
                            )}>
                              {round.position}
                            </span>
                            <span className="text-[10px] font-mono text-white/30">{Math.round(round.confidence * 100)}%</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed">{round.argument}</p>
                        </div>
                      </div>
                    ))}
                    {deliberationTrace.consensus && (
                      <div className="rounded-xl bg-blue-500/5 border border-blue-500/15 p-3 mt-1">
                        <p className="text-[10px] font-semibold text-blue-400/80 uppercase tracking-widest mb-1">Consensus</p>
                        <p className="text-xs text-white/60">{deliberationTrace.consensus.rationale}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ═══ RIGHT PANE: Execution Plan + Consent ═══ */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Execution Plan */}
            <motion.div variants={fadeUpVariant}>
              <div className="glass-card glass-card-overlay p-5 md:p-6 flex flex-col gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <Zap size={12} className="text-amber-500/70" />
                  Execution Plan
                </h2>
                <div className="flex flex-col gap-3">
                  {action.steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border border-white/10 text-white/40 shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-white/70">{step.label}</span>
                        {step.requiresConsent && (
                          <ShieldCheck size={10} className="inline ml-1.5 text-amber-400/60" />
                        )}
                      </div>
                      {step.estimatedDuration && (
                        <span className="text-[10px] font-mono text-white/30 shrink-0">{step.estimatedDuration}</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/40 font-mono">
                  {action.steps.length} steps · {action.steps.filter(s => s.estimatedDuration).map(s => s.estimatedDuration).join(' + ')}
                </p>
              </div>
            </motion.div>

            {/* Consent Gate */}
            <motion.div variants={fadeUpVariant}>
              <div className="glass-card glass-card-overlay p-5 md:p-6 flex flex-col gap-4 lg:sticky lg:top-24">
                {isAlreadyDecided ? (
                  <div className="flex flex-col items-center gap-3 py-4">
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
                    <label className="flex items-start gap-3 cursor-pointer group" data-slot="consent_scope">
                      <input
                        type="checkbox"
                        checked={consentReviewed}
                        onChange={(e) => setConsentReviewed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-amber-500 cursor-pointer"
                      />
                      <span className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                        I have reviewed the execution plan and understand the expected outcome of this action.
                      </span>
                    </label>

                    {/* Tier 2: Slide-to-Authorize · Tier 1: Button */}
                    {isTier2 ? (
                      <div className="flex flex-col gap-3">
                        <SlideToApprove
                          label="Slide to Authorize"
                          completedLabel="Authorized"
                          disabled={!consentReviewed}
                          onAuthorize={() => {
                            setSlideAuthorized(true)
                            setConfirmAction({ type: 'approve' })
                          }}
                        />
                        <div className="flex items-center gap-3">
                          <button
                            className={cn(
                              buttonVariants({ variant: 'glass', size: 'lg' }),
                              'flex-1 rounded-2xl text-sm px-6 py-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer font-semibold',
                            )}
                            onClick={() => setConfirmAction({ type: 'defer' })}
                          >
                            Defer
                          </button>
                          <button
                            type="button"
                            className="text-xs text-red-400/60 hover:text-red-400 transition-colors cursor-pointer py-1"
                            onClick={() => {
                              setExecuteDecision({ actionId: action.id, actionTitle: action.title, decision: 'rejected' })
                              showToast({ message: `${action.id} rejected`, variant: 'info' })
                              navigate('/execute')
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          disabled={!consentReviewed}
                          className={cn(
                            buttonVariants({ variant: 'glass', size: 'lg' }),
                            'flex-1 rounded-2xl text-sm px-6 py-3 font-semibold cursor-pointer transition-all',
                            consentReviewed
                              ? 'border-transparent'
                              : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed',
                          )}
                          style={consentReviewed ? {
                            background: 'color-mix(in srgb, var(--engine-execute) 20%, transparent)',
                            color: 'var(--engine-execute)',
                            borderColor: 'color-mix(in srgb, var(--engine-execute) 30%, transparent)',
                          } : undefined}
                          onClick={() => setConfirmAction({ type: 'approve' })}
                        >
                          Approve Action
                        </button>
                        <button
                          className={cn(
                            buttonVariants({ variant: 'glass', size: 'lg' }),
                            'flex-1 rounded-2xl text-sm px-6 py-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer font-semibold',
                          )}
                          onClick={() => setConfirmAction({ type: 'defer' })}
                        >
                          Defer
                        </button>
                        <button
                          type="button"
                          className="text-xs text-red-400/60 hover:text-red-400 transition-colors cursor-pointer py-1 sm:w-auto"
                          onClick={() => {
                            setExecuteDecision({ actionId: action.id, actionTitle: action.title, decision: 'rejected' })
                            showToast({ message: `${action.id} rejected`, variant: 'info' })
                            navigate('/execute')
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {!consentReviewed && (
                      <p className="text-[10px] text-amber-400/50 text-center">
                        Review the execution plan and check the consent box to enable approval.
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>

        </div>
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
                Confidence {Math.round(action.confidence * 100)}% · {action.steps.length} steps
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Execution Stream overlay */}
      {executionPhase !== 'idle' && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(10, 20, 35, 0.95)' }}
        >
          <div className="glass-card glass-card-overlay rounded-3xl p-8 md:p-10 max-w-md w-full mx-4 flex flex-col gap-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
              Execution Stream
            </h2>
            <div className="flex flex-col gap-4">
              {EXECUTION_STEPS.map((step, i) => {
                const status = getStepStatus(step.phase, executionPhase)
                return (
                  <div key={step.phase} className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500',
                      status === 'completed' && 'border-emerald-500/40 bg-emerald-500/10',
                      status === 'active' && 'border-amber-400/40 bg-amber-400/10',
                      status === 'pending' && 'border-white/10 bg-white/[0.02]',
                      status === 'active' && !prefersReducedMotion && 'animate-pulse',
                    )}>
                      {status === 'completed' ? (
                        <CheckCircle2 size={14} style={{ color: 'var(--state-healthy)' }} />
                      ) : status === 'active' ? (
                        <Loader2 size={14} className={prefersReducedMotion ? '' : 'animate-spin'} style={{ color: 'var(--engine-execute)' }} />
                      ) : (
                        <span className="text-[10px] font-mono text-white/30">{i + 1}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn(
                        'text-sm',
                        status === 'active' ? 'text-white/90' : status === 'completed' ? 'text-white/60' : 'text-white/30',
                      )}>
                        {step.label}
                      </span>
                      {status === 'active' && (
                        <span className="text-[10px] text-white/30 font-mono">{step.detail}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {executionPhase === 'confirmed' && (
              <p className="text-xs text-center font-mono" style={{ color: 'var(--state-healthy)' }}>
                Transaction confirmed. Redirecting...
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

const EXECUTION_STEPS = [
  { phase: 'validating', label: 'Validating', detail: 'Checking compliance rules...' },
  { phase: 'signing', label: 'Signing', detail: 'Applying cryptographic signature...' },
  { phase: 'broadcasting', label: 'Broadcasting', detail: 'Submitting to settlement network...' },
  { phase: 'confirmed', label: 'Confirmed', detail: 'Transaction settled.' },
] as const

function getStepStatus(stepPhase: string, currentPhase: string): 'pending' | 'active' | 'completed' {
  const order = ['validating', 'signing', 'broadcasting', 'confirmed']
  const stepIdx = order.indexOf(stepPhase)
  const currentIdx = order.indexOf(currentPhase)
  if (stepIdx < currentIdx) return 'completed'
  if (stepIdx === currentIdx) return 'active'
  return 'pending'
}

export default ExecuteApproval
