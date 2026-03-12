import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Timer,
  XCircle,
  Zap,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { EmptyState, ProofChips, ShapWaterfall } from '@/components/poseidon'
import { SlideToApprove } from '@/components/poseidon/slide-to-approve'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { getRiskTier } from '@/lib/execute-risk-tier'
import { selectDeliberationTrace, selectExecuteActionById } from '@/domain/poseidon-universe'
import { useExecuteApprovalFlow } from './useExecuteApprovalFlow'

const EXECUTION_STEPS = [
  { phase: 'reviewing', label: 'Reviewing', detail: 'Verifying your request...' },
  { phase: 'signing', label: 'Signing', detail: 'Securing your approval...' },
  { phase: 'submitting', label: 'Submitting', detail: 'Processing your action...' },
  { phase: 'confirmed', label: 'Confirmed', detail: 'Action completed.' },
] as const

function normalizeGrowRecommendationId(value: string): string {
  const match = value.match(/(?:REC|GRW)-(\d+)/i)
  return match ? `GRW-${match[1].padStart(3, '0')}` : value
}

function getStepStatus(
  stepPhase: (typeof EXECUTION_STEPS)[number]['phase'],
  currentPhase: string,
): 'pending' | 'active' | 'completed' {
  const order = ['reviewing', 'signing', 'submitting', 'confirmed']
  const stepIndex = order.indexOf(stepPhase)
  const currentIndex = order.indexOf(currentPhase)
  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'active'
  return 'pending'
}

export function ExecuteApproval() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { search, navigate } = useRouter()

  const actionId = useMemo(
    () =>
      new URLSearchParams(search).get('actionId') ??
      new URLSearchParams(search).get('id'),
    [search],
  )
  const action = useMemo(
    () => (actionId ? selectExecuteActionById(actionId) : undefined),
    [actionId],
  )
  const deliberationTrace = useMemo(
    () => (action?.sourceEntityId ? selectDeliberationTrace(action.sourceEntityId) : null),
    [action?.sourceEntityId],
  )

  usePageTitle(action ? `Approve: ${action.title}` : 'Action Approval')

  const {
    consentReviewed,
    setConsentReviewed,
    setSlideAuthorized,
    confirmAction,
    setConfirmAction,
    handleConfirm,
    executionPhase,
  } = useExecuteApprovalFlow(action, (decision) => {
    if (decision === 'approved') {
      navigate(`/execute?undo=${action?.id ?? ''}`)
      return
    }
    navigate('/execute')
  })

  if (!action) {
    return (
      <main id="main-content" role="main" className="hero-viewport mx-auto flex flex-col items-center justify-center gap-8 pt-24 pb-12 px-5">
        <EmptyState
          icon={AlertTriangle}
          title="Action not found"
          description={actionId ? `No action with ID "${actionId}" exists in the queue.` : 'No action ID was provided in the URL.'}
          accentColor="var(--engine-execute)"
          action={{ label: 'Back to Execute queue', onClick: () => navigate('/execute') }}
        />
      </main>
    )
  }

  const isTier2 = getRiskTier(action) === 2
  const sourceLink = action.sourceEngine === 'Protect' && action.sourceEntityId
    ? { label: `From Protect alert ${action.sourceEntityId}`, to: `/protect/alert-detail?alertId=${action.sourceEntityId}` }
    : action.sourceEngine === 'Grow' && action.sourceEntityId
      ? {
          label: `From Grow recommendation ${normalizeGrowRecommendationId(action.sourceEntityId)}`,
          to: `/grow/recommendation?id=${normalizeGrowRecommendationId(action.sourceEntityId)}`,
        }
      : null

  return (
    <motion.main
      id="main-content"
      role="main"
      className="hero-viewport flex flex-col gap-6 pb-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <Link
          to="/execute"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Execute
        </Link>
      </motion.div>

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
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                      {action.engine}
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                      {action.executionType}
                    </Badge>
                    {action.expiresIn && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <Timer size={12} />
                        Expires in {action.expiresIn}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <ShieldCheck size={12} />
                      March 19, 2026 anchor
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-2xl font-bold text-gray-900">{action.amountLabel}</span>
              </div>

              <p className="text-sm leading-relaxed text-gray-500">{action.description}</p>

              {sourceLink && (
                <Link
                  to={sourceLink.to}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 transition-colors hover:text-amber-700"
                >
                  <ExternalLink size={12} />
                  {sourceLink.label}
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">If approved</p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-800">{action.impact.approved}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">If deferred</p>
            <p className="mt-2 text-sm leading-relaxed text-amber-800">{action.impact.deferred}</p>
          </CardContent>
        </Card>
      </motion.div>

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
              {action.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm text-gray-700">{step.label}</span>
                    {step.requiresConsent && (
                      <ShieldCheck size={12} className="ml-1.5 inline text-amber-500" />
                    )}
                  </div>
                  {step.estimatedDuration && (
                    <span className="shrink-0 text-xs font-mono text-gray-400">{step.estimatedDuration}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
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
            <p className="text-sm leading-relaxed text-gray-500">{action.description}</p>
            {deliberationTrace?.consensus && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600">Consensus</p>
                <p className="mt-1 text-xs text-blue-800">{deliberationTrace.consensus.rationale}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Financial Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Transaction Amount</span>
              <span className="text-sm font-semibold text-gray-900">{action.amountLabel}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 py-2">
              <span className="text-sm text-gray-500">Expected Benefit</span>
              <span className="text-sm font-semibold text-emerald-600">
                {action.impact.approved.match(/\$[\d,]+/)?.[0] ?? 'See details'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Net Benefit</span>
              <span className="text-sm font-bold text-emerald-600">Positive</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="border border-gray-800 bg-gray-900 shadow-sm">
          <CardContent className="p-6 lg:p-8">
            <div className="mb-4 border-b border-white/[0.06] pb-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/60">Decision Drivers</h2>
              <p className="mt-1 text-xs text-white/35">Key factors driving this AI decision.</p>
            </div>
            <ShapWaterfall
              factors={action.factors.map((factor) => ({ name: factor.label, value: factor.value }))}
              baseValue={50}
              className="mt-1"
            />
            {action.factors.length > 1 && (
              <ProofChips
                total={action.amountLabel}
                parts={action.factors.slice(0, 3).map((factor) => ({
                  label: factor.label,
                  value: Math.round(factor.value * 100),
                }))}
                formatValue={(value) => `${value}%`}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800">Confirmation Required</h3>
                <p className="mt-1 text-sm text-amber-700">
                  Review the execution plan, confirm consent scope, and then authorize the action.
                </p>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 group" data-slot="consent_scope">
              <input
                type="checkbox"
                checked={consentReviewed}
                onChange={(event) => setConsentReviewed(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-amber-600 cursor-pointer"
              />
              <span className="text-sm leading-relaxed text-gray-700 transition-colors group-hover:text-gray-900">
                I have reviewed the execution plan and understand the expected outcome of this action.
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
                  <Button variant="outline" className="flex-1" onClick={() => setConfirmAction({ type: 'defer' })}>
                    Defer
                  </Button>
                  <button
                    type="button"
                    className="cursor-pointer py-1 text-xs text-red-500 transition-colors hover:text-red-700"
                    onClick={() => navigate('/execute')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
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
                <Button variant="outline" className="flex-1" onClick={() => setConfirmAction({ type: 'defer' })}>
                  Defer
                </Button>
                <button
                  type="button"
                  className="cursor-pointer py-1 text-xs text-red-500 transition-colors hover:text-red-700 sm:w-auto"
                  onClick={() => navigate('/execute')}
                >
                  Reject
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {confirmAction && (
        <Dialog open onOpenChange={(open) => !open && setConfirmAction(null)}>
          <DialogContent className="max-w-md border border-gray-200 bg-white" role="dialog" aria-modal="true">
            <div className="flex flex-col gap-4 p-2">
              <DialogTitle className="sr-only">
                {confirmAction.type === 'approve' ? 'Approve action' : 'Defer action'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Review the action summary, expected outcome, and execution plan before confirming.
              </DialogDescription>
              <div>
                <p className={cn(
                  'mb-1 text-xs font-semibold uppercase tracking-widest',
                  confirmAction.type === 'approve' ? 'text-emerald-600' : 'text-amber-600',
                )}>
                  {confirmAction.type === 'approve' ? 'Confirm Approval' : 'Confirm Deferral'}
                </p>
                <h3 className="text-base font-semibold text-gray-900">{action.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{action.description}</p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-400">
                  Execution plan ({action.steps.length} steps)
                </p>
                <div className="space-y-1.5">
                  {action.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2 text-xs">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-200 bg-white text-[9px] font-mono text-gray-500">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{step.label}</span>
                      {step.requiresConsent && <ShieldCheck size={10} className="shrink-0 text-amber-500" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className={cn(
                'rounded-xl border p-3',
                confirmAction.type === 'approve' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
              )}>
                <p className={cn(
                  'mb-1 text-[10px] uppercase tracking-wider',
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
            </div>
          </DialogContent>
        </Dialog>
      )}

      {executionPhase !== 'idle' && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
        >
          <Card className="mx-4 w-full max-w-md border border-border bg-card shadow-lg">
            <CardContent className="p-8">
              <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
                Execution Stream
              </h2>
              <div className="flex flex-col gap-4">
                {EXECUTION_STEPS.map((step, index) => {
                  const status = getStepStatus(step.phase, executionPhase)
                  return (
                    <div key={step.phase} className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500',
                        status === 'completed' && 'border-emerald-300 bg-emerald-50',
                        status === 'active' && 'border-amber-300 bg-amber-50',
                        status === 'pending' && 'border-gray-200 bg-gray-50',
                      )}>
                        {status === 'completed' ? (
                          <CheckCircle2 size={14} className="text-emerald-600" />
                        ) : status === 'active' ? (
                          <Loader2 size={14} className={cn('text-amber-600', !prefersReducedMotion && 'animate-spin')} />
                        ) : (
                          <span className="text-[10px] font-mono text-gray-400">{index + 1}</span>
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
                          <span className="text-[10px] font-mono text-gray-400">{step.detail}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {executionPhase === 'confirmed' && (
                <p className="mt-6 text-center text-xs font-mono text-emerald-600">
                  Action confirmed. Redirecting...
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.main>
  )
}

export default ExecuteApproval
