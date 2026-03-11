import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  CheckCircle2,
  ChevronDown,
  Clock,
  ArrowRight,
  CalendarClock,
  DollarSign,
  ListChecks,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { Link } from '@/router'
import { CountUp } from '@/components/poseidon'
import { formatCurrency } from '@/lib/formatters'
import { actions, executeStats } from '@/data/actions'
import { useDemoState } from '@/lib/demo-state/provider'

/* ── Page Component ── */
export default function ExecutePage() {
  usePageTitle('Execute')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const [completedOpen, setCompletedOpen] = useState(false)
  const { state } = useDemoState()

  const pendingActions = actions.filter((a) => {
    const demoStatus = state.execute.actionStates[a.id]?.status
    if (demoStatus && demoStatus !== 'pending') return false
    return a.status === 'pending'
  })
  const completedActions = actions.filter((a) => {
    const demoStatus = state.execute.actionStates[a.id]?.status
    return a.status === 'completed' || (demoStatus && demoStatus !== 'pending')
  })

  const pendingCount = pendingActions.length

  return (
    <motion.div
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 pb-12`}
      style={PAGE_CONTENT_STYLE}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Hero — Amber CountUp */}
      <motion.div variants={fadeUp} className="text-center py-8">
        <CountUp
          value={pendingCount}
          duration={800}
          className="text-8xl md:text-9xl font-bold font-mono tabular-nums text-amber-600"
        />
        <h1 className="text-xl md:text-2xl font-semibold text-foreground mt-3">
          Actions Await Your Decision
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI agents are ready to execute once you confirm
        </p>
      </motion.div>

      {/* Summary Cards 2x2 */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <ListChecks className="h-4.5 w-4.5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending</span>
            </div>
            <p className="text-3xl font-bold font-mono tabular-nums text-foreground">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed This Month</span>
            </div>
            <p className="text-3xl font-bold font-mono tabular-nums text-foreground">{executeStats.completedThisMonth}</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                <DollarSign className="h-4.5 w-4.5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Executed</span>
            </div>
            <p className="text-3xl font-bold font-mono tabular-nums text-foreground">{executeStats.totalExecuted}</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-200">
                <Zap className="h-4.5 w-4.5 text-amber-700" />
              </div>
              <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">Tax Savings</span>
            </div>
            <p className="text-2xl font-bold font-mono tabular-nums text-amber-700">
              {formatCurrency(executeStats.pendingTaxSavings)}
            </p>
            <p className="text-xs text-amber-600 mt-1">if you approve</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending Actions List */}
      <motion.div variants={fadeUp} className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Pending Actions</h2>
        {pendingActions.map((action) => (
          <Link
            key={action.id}
            to={`/execute/approval?actionId=${action.id}`}
            className="block"
          >
            <Card className="border border-border bg-card shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 shrink-0">
                      <Zap className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{action.id}</span>
                        {action.deadline && (
                          <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 text-[10px]">
                            <CalendarClock className="mr-1 h-3 w-3" />
                            Due {action.deadline}
                          </Badge>
                        )}
                      </div>
                      <p className="font-semibold text-foreground mt-0.5 truncate">{action.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{action.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {action.taxSavings && (
                      <span className="text-sm font-semibold font-mono tabular-nums text-amber-700">
                        +{formatCurrency(action.taxSavings)}
                      </span>
                    )}
                    {action.amount && (
                      <span className="text-sm font-semibold font-mono tabular-nums text-foreground">
                        {formatCurrency(action.amount)}
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {pendingActions.length === 0 && (
          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">All caught up</p>
              <p className="text-xs text-muted-foreground mt-1">No pending actions require your attention.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Completed Section (Collapsible, default closed) */}
      {completedActions.length > 0 && (
        <motion.div variants={fadeUp}>
          <Card className="border border-border bg-card shadow-sm">
            <div
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setCompletedOpen(!completedOpen)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCompletedOpen(!completedOpen) } }}
              tabIndex={0}
              role="button"
              aria-expanded={completedOpen}
            >
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Completed ({completedActions.length})
              </h3>
              <ChevronDown className={cn('h-5 w-5 text-muted-foreground transition-transform', completedOpen && 'rotate-180')} />
            </div>
            <AnimatePresence initial={false}>
              {completedOpen && (
                <motion.div
                  variants={accordionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={accordionTransition}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0 pb-5 px-5 space-y-3">
                    {completedActions.map((action) => (
                      <div key={action.id} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-mono text-xs text-muted-foreground mr-2">{action.id}</span>
                          <span className="text-sm text-foreground">{action.title}</span>
                        </div>
                        {action.amount && (
                          <span className="text-sm font-mono tabular-nums text-muted-foreground shrink-0">
                            {formatCurrency(action.amount)}
                          </span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
