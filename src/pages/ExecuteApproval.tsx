import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Timer,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { ShapWaterfall, EmptyState, ConfidenceIndicator, ProofChips } from '@/components/poseidon'
import { SlideToApprove } from '@/components/poseidon/slide-to-approve'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { usePageTitle } from '@/hooks/use-page-title'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { useDemoState } from '@/lib/demo-state/provider'
import { useToast } from '@/hooks/useToast'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { selectExecuteActionById, selectDeliberationTrace } from '@/domain/poseidon-universe'
import type { ExecuteActionEntity } from '@/domain/poseidon-universe'
import { getRiskTier } from '@/lib/execute-risk-tier'
import { useExecuteApprovalFlow } from './useExecuteApprovalFlow'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

const ENGINE_BADGE: Record<string, string> = {
  Protect: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Grow: 'border-violet-200 bg-violet-50 text-violet-700',
  Execute: 'border-amber-200 bg-amber-50 text-amber-700',
}

const EXEC_TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  auto: { label: 'Auto', cls: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  'semi-auto': { label: 'Semi-auto', cls: 'border-blue-200 bg-blue-50 text-blue-700' },
  manual: { label: 'Manual', cls: 'border-amber-200 bg-amber-50 text-amber-700' },
  hybrid: { label: 'Hybrid', cls: 'border-violet-200 bg-violet-50 text-violet-700' },
}

export function ExecuteApproval() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
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
    return selectDeliberationTrace(action.sourceEntityId ?? '')
  }, [action])

  if (!action) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center gap-8 pt-24 pb-12 px-5" style={{ maxWidth: '1440px' }}>
        <EmptyState
          icon={AlertTriangle}
          title="Action not found"
          description={actionId ? `No action with ID "${actionId}" exists in the queue.` : 'No action ID was provided in the URL.'}
          accentColor="var(--engine-execute)"
          action={{ label: 'Back to Execute queue', onClick: () => navigate('/execute') }}
        />
      </div>
    )
  }

  const typeBadge = EXEC_TYPE_BADGE[action.executionType] ?? EXEC_TYPE_BADGE.manual
  const sourceLink = action.sourceEngine === 'Protect' && action.sourceEntityId
    ? { label: `From Protect alert ${action.sourceEntityId}`, to: `/protect/alert-detail?alertId=${action.sourceEntityId}` }
    : action.sourceEngine === 'Grow' && action.sourceEntityId
    ? { label: `From Grow recommendation ${action.sourceEntityId}`, to: '/grow/recommendations' }
    : null

  return (
    <motion.div
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 pb-12`}
      style={PAGE_CONTENT_STYLE}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          to="/execute"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Execute
        </Link>
      </motion.div>

      {/* Header Card */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 shrink-0">
                  <Zap className="h-7 w-7 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500">Approval Required</p>
                  <h1 className="text-2xl font-bold text-gray-900">{action.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className={ENGINE_BADGE[action.engine] ?? 'bg-gray-50 text-gray-600'}>
                      {action.engine}
                    </Badge>
                    <Badge variant="outline" className={typeBadge.cls}>
                      {typeBadge.label}
                    </Badge>
                    {action.expiresIn && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <Timer size={12} />
                        Expires in {action.expiresIn}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900 shrink-0">{action.amountLabel}</span>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">{action.description}</p>

              {sourceLink && (
                <Link to={sourceLink.to} className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors">
                  <ExternalLink size={12} />
                  {sourceLink.label}
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Impact Assessment */}
      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">If approved</p>
            <p className="text-sm text-emerald-800 leading-relaxed">{action.impact.approved}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">If deferred</p>
            <p className="text-sm text-amber-800 leading-relaxed">{action.impact.deferred}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Execution Plan */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Zap className="h-5 w-5 text-amber-600" />
              Execution Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {action.steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-amber-100 text-amber-700 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-700">{step.label}</span>
                    {step.requiresConsent && (
                      <ShieldCheck size={12} className="inline ml-1.5 text-amber-500" />
                    )}
                  </div>
                  {step.estimatedDuration && (
                    <span className="text-xs font-mono text-gray-400 shrink-0">{step.estimatedDuration}</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-mono mt-4">
              {action.steps.length} steps · {action.steps.filter(s => s.estimatedDuration).map(s => s.estimatedDuration).join(' + ')}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Confidence + SHAP Decision Drivers */}
      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
        {/* Confidence & Source */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Why This Action?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Confidence</span>
              <div className="flex-1">
                <Progress value={action.confidence * 100} />
              </div>
              <span className="text-sm font-bold text-gray-900">{Math.round(action.confidence * 100)}%</span>
            </div>
            {sourceLink && (
              <Link to={sourceLink.to} className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
                <ExternalLink size={14} />
                View Original {action.sourceEngine === 'Grow' ? 'Recommendation' : 'Alert'}
              </Link>
            )}
            <p className="text-sm text-gray-500 leading-relaxed">{action.description}</p>
          </CardContent>
        </Card>

        {/* Financial Impact */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Financial Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Transaction Amount</span>
              <span className="text-sm font-semibold text-gray-900">{action.amountLabel}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Expected Benefit</span>
              <span className="text-sm font-semibold text-emerald-600">{action.impact.approved.match(/\$[\d,]+/)?.[0] ?? 'See details'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Net Benefit</span>
              <span className="text-sm font-bold text-emerald-600">Positive</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decision Drivers (SHAP) — dark card like ProtectAlertDetail */}
      <motion.div variants={fadeUp}>
        <div className="bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gray-800">
          <div className="border-b border-white/[0.06] pb-4 mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Decision Drivers</h3>
            <p className="text-xs text-white/30 mt-1">
              Key factors driving this AI decision.
            </p>
          </div>
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

      {/* Deliberation Trace */}
      {deliberationTrace && (
        <motion.div variants={fadeUp}>
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Deliberation Trace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deliberationTrace.rounds.map((round, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className={cn(
                      'w-2.5 h-2.5 rounded-full mt-1.5 shrink-0',
                      round.position === 'support' && 'bg-emerald-500',
                      round.position === 'oppose' && 'bg-red-500',
                      round.position === 'modify' && 'bg-amber-500',
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-800">{round.roleId}</span>
                        <Badge variant="outline" className={cn(
                          'text-[10px] uppercase',
                          round.position === 'support' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                          round.position === 'oppose' && 'border-red-200 bg-red-50 text-red-700',
                          round.position === 'modify' && 'border-amber-200 bg-amber-50 text-amber-700',
                        )}>
                          {round.position}
                        </Badge>
                        <span className="text-xs font-mono text-gray-400">{Math.round(round.confidence * 100)}%</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{round.argument}</p>
                    </div>
                  </div>
                ))}
                {deliberationTrace.consensus && (
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 mt-1">
                    <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest mb-1">Consensus</p>
                    <p className="text-xs text-blue-800">{deliberationTrace.consensus.rationale}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Confirmation Section */}
      <motion.div variants={fadeUp}>
        <Card className={cn(
          'shadow-sm',
          isAlreadyDecided ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
        )}>
          <CardContent className="p-6">
            {isAlreadyDecided ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                <p className="text-sm text-gray-700 text-center">
                  This action has been <span className="font-semibold text-gray-900">{actionStatus}</span>.
                </p>
                <Button asChild variant="outline">
                  <Link to="/execute">Back to Queue</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-800">Confirmation Required</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      You are about to authorize the AI agent to execute this transaction on your behalf.
                      This action cannot be undone once market orders are placed.
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consentReviewed}
                    onChange={(e) => setConsentReviewed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-amber-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                    I understand and approve this transaction
                  </span>
                </label>

                {isTier2 ? (
                  <div className="flex flex-col gap-3">
                    <SlideToApprove
                      label="Slide to Approve"
                      completedLabel="Approved"
                      disabled={!consentReviewed}
                      onAuthorize={() => {
                        setSlideAuthorized(true)
                        setConfirmAction({ type: 'approve' })
                      }}
                    />
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setConfirmAction({ type: 'defer' })}
                      >
                        Defer
                      </Button>
                      <button
                        type="button"
                        className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer py-1"
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
                    <Button
                      disabled={!consentReviewed}
                      className={cn(
                        'flex-1',
                        consentReviewed
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed',
                      )}
                      onClick={() => setConfirmAction({ type: 'approve' })}
                    >
                      Approve & Execute
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setConfirmAction({ type: 'defer' })}
                    >
                      Defer
                    </Button>
                    <button
                      type="button"
                      className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer py-1 sm:w-auto"
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
                  <p className="text-xs text-amber-600 text-center">
                    Review the execution plan and check the consent box to enable approval.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <Dialog open={true} onOpenChange={(open) => !open && setConfirmAction(null)}>
          <DialogContent className="max-w-md bg-white border border-gray-200" role="dialog" aria-modal="true">
            <div className="flex flex-col gap-4 p-2">
              <div>
                <p className={cn(
                  'text-xs font-semibold uppercase tracking-widest mb-1',
                  confirmAction.type === 'approve' ? 'text-emerald-600' : 'text-amber-600',
                )}>
                  {confirmAction.type === 'approve' ? 'Confirm Approval' : 'Confirm Deferral'}
                </p>
                <h3 className="text-base font-semibold text-gray-900">{action.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
              </div>

              <div className="rounded-xl p-3 bg-gray-50 border border-gray-200">
                <p className="text-[10px] uppercase tracking-wider mb-2 text-gray-400">Execution plan ({action.steps.length} steps)</p>
                <div className="space-y-1.5">
                  {action.steps.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono border border-gray-200 text-gray-500 bg-white">{i + 1}</span>
                      <span className="text-gray-600">{s.label}</span>
                      {s.requiresConsent && <ShieldCheck size={10} className="text-amber-500 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className={cn(
                'rounded-xl p-3',
                confirmAction.type === 'approve' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200',
              )}>
                <p className={cn(
                  'text-[10px] uppercase tracking-wider mb-1',
                  confirmAction.type === 'approve' ? 'text-emerald-600' : 'text-amber-600',
                )}>
                  {confirmAction.type === 'approve' ? 'Expected outcome' : 'If deferred'}
                </p>
                <p className="text-xs text-gray-700">
                  {confirmAction.type === 'approve' ? action.impact.approved : action.impact.deferred}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  className={cn(
                    'w-full',
                    confirmAction.type === 'approve'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-amber-600 text-white hover:bg-amber-700',
                  )}
                  onClick={handleConfirm}
                >
                  {confirmAction.type === 'approve' ? 'Approve' : 'Defer'}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setConfirmAction(null)}>
                  Cancel
                </Button>
              </div>

              <p className="text-[10px] text-gray-400 text-center">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
        >
          <Card className="border border-border bg-card shadow-lg max-w-md w-full mx-4">
            <CardContent className="p-8">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">
                Execution Stream
              </h2>
              <div className="flex flex-col gap-4">
                {EXECUTION_STEPS.map((step, i) => {
                  const status = getStepStatus(step.phase, executionPhase)
                  return (
                    <div key={step.phase} className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500',
                        status === 'completed' && 'border-emerald-300 bg-emerald-50',
                        status === 'active' && 'border-amber-300 bg-amber-50',
                        status === 'pending' && 'border-gray-200 bg-gray-50',
                        status === 'active' && !prefersReducedMotion && 'animate-pulse',
                      )}>
                        {status === 'completed' ? (
                          <CheckCircle2 size={14} className="text-emerald-600" />
                        ) : status === 'active' ? (
                          <Loader2 size={14} className={cn('text-amber-600', !prefersReducedMotion && 'animate-spin')} />
                        ) : (
                          <span className="text-[10px] font-mono text-gray-400">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={cn(
                          'text-sm',
                          status === 'active' ? 'text-gray-900' : status === 'completed' ? 'text-gray-500' : 'text-gray-300',
                        )}>
                          {step.label}
                        </span>
                        {status === 'active' && (
                          <span className="text-[10px] text-gray-400 font-mono">{step.detail}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {executionPhase === 'confirmed' && (
                <p className="text-xs text-center font-mono text-emerald-600 mt-6">
                  Action confirmed. Redirecting...
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

const EXECUTION_STEPS = [
  { phase: 'reviewing', label: 'Reviewing', detail: 'Verifying your request...' },
  { phase: 'signing', label: 'Signing', detail: 'Securing your approval...' },
  { phase: 'submitting', label: 'Submitting', detail: 'Processing your action...' },
  { phase: 'confirmed', label: 'Confirmed', detail: 'Action completed.' },
] as const

function getStepStatus(stepPhase: string, currentPhase: string): 'pending' | 'active' | 'completed' {
  const order = ['reviewing', 'signing', 'submitting', 'confirmed']
  const stepIdx = order.indexOf(stepPhase)
  const currentIdx = order.indexOf(currentPhase)
  if (stepIdx < currentIdx) return 'completed'
  if (stepIdx === currentIdx) return 'active'
  return 'pending'
}

export default ExecuteApproval
