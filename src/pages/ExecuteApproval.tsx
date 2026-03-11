import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  CalendarClock,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/use-page-title'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { useDemoState } from '@/lib/demo-state/provider'
import { useToast } from '@/hooks/useToast'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { formatCurrency } from '@/lib/formatters'
import { CountUp } from '@/components/poseidon'
import { actions } from '@/data/actions'
import type { Action } from '@/data/actions'

/* ── Tax calculation for EXE-001 ── */
const TAX_CALC = {
  unrealizedLoss: 1200,
  federalRate: 0.24,
  stateRate: 0.093,
  get federal() { return this.unrealizedLoss * this.federalRate },
  get state() { return this.unrealizedLoss * this.stateRate },
  get total() { return this.federal + this.state },
}

/* ── Execution steps for EXE-001 ── */
const EXECUTION_STEPS = [
  { id: 1, label: 'Sell VTI shares at current market price' },
  { id: 2, label: 'Realize tax loss of $1,200' },
  { id: 3, label: 'Purchase replacement ETF (ITOT)' },
  { id: 4, label: 'Apply tax offset to 2026 filing' },
]

export function ExecuteApproval() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { state, setExecuteDecision } = useDemoState()
  const { search, navigate } = useRouter()
  const { showToast } = useToast()

  const actionId = useMemo(() => new URLSearchParams(search).get('actionId') ?? new URLSearchParams(search).get('id'), [search])
  const action = useMemo(() => actions.find((a) => a.id === actionId), [actionId])

  usePageTitle(action ? `Approve: ${action.title}` : 'Action Approval')

  const [whyOpen, setWhyOpen] = useState(false)
  const [stepsAnimated, setStepsAnimated] = useState(false)

  const actionStatus = actionId ? state.execute.actionStates[actionId]?.status ?? 'pending' : 'pending'
  const isAlreadyDecided = actionStatus !== 'pending'

  const handleApprove = () => {
    if (!action) return
    setExecuteDecision({
      actionId: action.id,
      actionTitle: action.title,
      decision: 'approved',
    })
    setStepsAnimated(true)
    showToast({ message: `${action.id} approved. Execution in progress.`, variant: 'success' })
    setTimeout(() => navigate('/execute'), 2000)
  }

  const handleReject = () => {
    if (!action) return
    setExecuteDecision({
      actionId: action.id,
      actionTitle: action.title,
      decision: 'rejected',
    })
    showToast({ message: `${action.id} rejected.`, variant: 'info' })
    navigate('/execute')
  }

  if (!action) {
    return (
      <div className="hero-viewport flex flex-col items-center justify-center gap-6 pt-24 pb-12">
        <Zap className="h-12 w-12 text-amber-300" />
        <h1 className="text-xl font-semibold text-foreground">Action not found</h1>
        <p className="text-sm text-muted-foreground">
          {actionId ? `No action with ID "${actionId}" exists.` : 'No action ID provided.'}
        </p>
        <Link to="/execute" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
          <ArrowLeft className="inline h-4 w-4 mr-1" />
          Back to Execute
        </Link>
      </div>
    )
  }

  const isEXE001 = action.id === 'EXE-001'
  const displayTitle = isEXE001 ? 'Tax Savings Opportunity' : action.title

  return (
    <div className="hero-viewport">
    <motion.div
      id="main-content"
      role="main"
      className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-6 pb-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          to="/execute"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Execute
        </Link>
      </motion.div>

      {/* Header Card */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card border-t-4 border-t-amber-500">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.15)] shrink-0">
                    <Zap className="h-7 w-7 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {action.confidence && action.confidence >= 0.8 && (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-xs">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          High Confidence
                        </Badge>
                      )}
                      {action.deadline && (
                        <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-400 text-xs animate-pulse">
                          <CalendarClock className="mr-1 h-3 w-3" />
                          Due {action.deadline}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">{displayTitle}</h1>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{action.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tax Calculation Panel (EXE-001 only) */}
      {isEXE001 && (
        <motion.div variants={fadeUp}>
          <Card className="border-amber-500/20 bg-amber-500/10">
            <CardContent className="p-6">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">Tax Calculation</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-amber-500/15">
                  <span className="text-sm text-muted-foreground">Unrealized Loss</span>
                  <span className="text-sm font-semibold font-mono tabular-nums text-foreground">
                    {formatCurrency(TAX_CALC.unrealizedLoss)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-amber-500/15">
                  <span className="text-sm text-muted-foreground">Federal Tax Savings (24%)</span>
                  <span className="text-sm font-mono tabular-nums text-foreground">
                    {formatCurrency(TAX_CALC.federal)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-amber-500/15">
                  <span className="text-sm text-muted-foreground">CA State Tax Savings (9.3%)</span>
                  <span className="text-sm font-mono tabular-nums text-foreground">
                    {formatCurrency(TAX_CALC.state)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg bg-amber-500/15 px-3 -mx-1">
                  <span className="text-base font-semibold text-foreground">Total Tax Savings</span>
                  <span className="typo-hero-number text-3xl text-amber-400">
                    <CountUp value={TAX_CALC.total} prefix="$" decimals={2} />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Execution Steps Timeline */}
      {isEXE001 && (
        <motion.div variants={fadeUp}>
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">Execution Steps</h3>
              <div className="relative ml-4">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-5">
                  {EXECUTION_STEPS.map((step, i) => (
                    <motion.div
                      key={step.id}
                      className="flex items-start gap-4 relative"
                      initial={false}
                      animate={stepsAnimated ? { opacity: 1 } : { opacity: 1 }}
                    >
                      <motion.div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500',
                          stepsAnimated
                            ? 'bg-emerald-500 border-2 border-emerald-500'
                            : 'bg-card border-2 border-amber-300',
                        )}
                        initial={false}
                        animate={stepsAnimated ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ delay: i * 0.3, duration: 0.4 }}
                      >
                        {stepsAnimated ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.3 + 0.15, duration: 0.3 }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          </motion.div>
                        ) : (
                          <span className="text-[10px] font-bold font-mono text-amber-600">{step.id}</span>
                        )}
                      </motion.div>
                      <span className={cn(
                        'text-sm pt-0.5 transition-colors duration-300',
                        stepsAnimated ? 'text-emerald-400 font-medium' : 'text-foreground',
                      )}>
                        {step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons — Above fold */}
      <motion.div variants={fadeUp}>
        <Card className={cn(
          '',
          isAlreadyDecided ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-amber-500/20 bg-amber-500/10',
        )}>
          <CardContent className="p-6">
            {isAlreadyDecided ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                <p className="text-sm text-foreground text-center">
                  This action has been <span className="font-semibold">{actionStatus}</span>.
                </p>
                <Link
                  to="/execute"
                  className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Back to Execute
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sticky bottom-0 z-40">
                <h3 className="text-base font-semibold text-foreground text-center">
                  Do you approve this action?
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 min-h-[48px] text-base font-semibold"
                    onClick={handleApprove}
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 min-h-[48px] text-base font-semibold"
                    onClick={handleReject}
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* "Why this was recommended" — Collapsible, default CLOSED */}
      {isEXE001 && action.drivers && action.drivers.length > 0 && (
        <motion.div variants={fadeUp}>
          <Card className="border border-border bg-card">
            <div
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setWhyOpen(!whyOpen)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setWhyOpen(!whyOpen) } }}
              tabIndex={0}
              role="button"
              aria-expanded={whyOpen}
            >
              <h3 className="text-sm font-semibold text-foreground">Why this was recommended</h3>
              <ChevronDown className={cn('h-5 w-5 text-muted-foreground transition-transform', whyOpen && 'rotate-180')} />
            </div>
            <AnimatePresence initial={false}>
              {whyOpen && (
                <motion.div
                  variants={accordionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={accordionTransition}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0 pb-5 px-5 space-y-4">
                    {/* Decision driver bars */}
                    <div className="space-y-3">
                      {action.drivers!.map((driver) => (
                        <div key={driver.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-foreground">{driver.label}</span>
                            <span className="text-xs font-mono tabular-nums text-muted-foreground">
                              {Math.round(driver.value * 100)}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-amber-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${driver.value * 100}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Wash Sale Rule note */}
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                      <p className="text-xs text-amber-400">
                        <span className="font-semibold">Wash Sale Rule:</span>{' '}
                        Replacement ETF (ITOT) is substantially different from VTI to comply with IRS 30-day wash sale rule.
                      </p>
                    </div>

                    {/* Audit link */}
                    <Link
                      to="/govern/audit-detail?id=AUD-2026-0310-004"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View audit trail
                    </Link>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
    </motion.div>
    </div>
  )
}

export default ExecuteApproval
