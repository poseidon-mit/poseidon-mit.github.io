import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  PiggyBank,
  ListTodo,
  History,
  ArrowRight,
  XCircle,
  Settings2,
  CreditCard,
  TrendingUp,
  ArrowUpDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { Link } from '@/router'
import {
  selectExecuteActionsView,
  selectExecuteQueueStats,
  selectExecuteSavingsView,
  formatUsd,
} from '@/domain/poseidon-universe'
import type { UrgencyLevel } from '@/domain/poseidon-universe/types'

const URGENCY_BADGE: Record<UrgencyLevel, string> = {
  high: 'border-red-200 bg-red-50 text-red-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-700',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const ENGINE_BADGE: Record<string, string> = {
  Protect: 'bg-emerald-50 text-emerald-700',
  Grow: 'bg-violet-50 text-violet-700',
  Execute: 'bg-amber-50 text-amber-700',
}

const TYPE_ICON: Record<string, typeof CreditCard> = {
  recurring: CreditCard,
  investment: TrendingUp,
  transfer: ArrowUpDown,
}

const TYPE_BADGE: Record<string, string> = {
  recurring: 'border-blue-200 bg-blue-50 text-blue-700',
  investment: 'border-violet-200 bg-violet-50 text-violet-700',
  transfer: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

// Mock execution history
const EXECUTION_HISTORY = [
  { date: 'March 10', description: 'Pay Netflix', amount: '$22.99', status: 'approved' as const, action: 'Auto-approved' },
  { date: 'March 9', description: 'Transfer to Savings', amount: '$500.00', status: 'approved' as const, action: 'Approved' },
  { date: 'March 8', description: 'Pay Phone Bill', amount: '$85.00', status: 'approved' as const, action: 'Auto-approved' },
  { date: 'March 7', description: 'Large Transfer', amount: '$2,000.00', status: 'rejected' as const, action: 'Rejected' },
]

const HISTORY_STATUS: Record<string, string> = {
  approved: 'text-emerald-600',
  rejected: 'text-red-600',
}

/* ── Page Component ── */
export default function ExecutePage() {
  usePageTitle('Execute')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const [showAll, setShowAll] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const toggleCard = (key: string) => setExpandedCards(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  const actions = useMemo(() => selectExecuteActionsView(), [])
  const stats = useMemo(() => selectExecuteQueueStats(), [])
  const savings = useMemo(() => selectExecuteSavingsView(), [])

  const visibleActions = showAll ? actions : actions.slice(0, 3)
  const remainingCount = actions.length - 3

  // Count by type (approximate from engine)
  const billCount = actions.filter(a => a.engine === 'Execute').length
  const investCount = actions.filter(a => a.engine === 'Grow').length
  const transferCount = actions.filter(a => a.engine === 'Protect').length

  return (
    <motion.div
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6`}
      style={PAGE_CONTENT_STYLE}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Page Header */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Execute</h1>
        </div>
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
          <Zap className="mr-1.5 h-3.5 w-3.5" />
          {stats.byUrgency.high > 0 ? `${stats.byUrgency.high} Urgent` : `${stats.total} Actions`}
        </Badge>
      </motion.div>

      {/* Hero Card */}
      <motion.div variants={fadeUp}>
        <Card className="border-amber-200 bg-amber-50/50 shadow-sm border-t-4 border-t-[var(--engine-execute)]">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 shrink-0">
                  <Zap className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900"><span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse mr-2" />{stats.total} actions awaiting your approval</h2>
                  <p className="text-sm text-gray-500 mt-1">AI agents are ready to execute once you confirm</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                    {billCount > 0 && <span>● {billCount} bill payments</span>}
                    {investCount > 0 && <span>● {investCount} investments</span>}
                    {transferCount > 0 && <span>● {transferCount} transfers</span>}
                  </div>
                </div>
              </div>
              <Link to="/execute/queue" className={cn(buttonVariants(), "bg-amber-600 text-white hover:bg-amber-700 shrink-0")}>
                Review All Pending
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending Approvals */}
      <motion.div variants={fadeUp} className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Pending Approvals ({stats.total})</h3>
        {visibleActions.map((action) => (
          <Card key={action.id} className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    action.urgency === 'high' ? 'bg-red-50' : action.urgency === 'medium' ? 'bg-amber-50' : 'bg-emerald-50'
                  }`}>
                    <Zap className={`h-5 w-5 ${
                      action.urgency === 'high' ? 'text-red-600' : action.urgency === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={ENGINE_BADGE[action.engine] ?? 'bg-muted text-muted-foreground'}>
                        {action.engine}
                      </Badge>
                      <p className="font-semibold text-foreground">{action.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{action.timestampLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xl font-bold text-foreground">{action.amountLabel}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 min-h-[44px] px-6"
                >
                  Reject
                </Button>
                <Link
                  to={`/execute/approval?actionId=${action.id}`}
                  className={cn(buttonVariants(), "bg-emerald-600 text-white hover:bg-emerald-700 min-h-[44px] px-6")}
                >
                  Review &amp; Approve
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {!showAll && remainingCount > 0 && (
          <Button
            variant="ghost"
            className="w-full text-gray-500"
            onClick={() => setShowAll(true)}
          >
            Show {remainingCount} more...
          </Button>
        )}
      </motion.div>

      {/* 2-Column: Automation Settings + Execution Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Automation Settings */}
        <motion.div variants={fadeUp}>
          <Card className="border border-border bg-card shadow-sm h-full">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleCard('automation')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard('automation') } }}
              tabIndex={0}
              role="button"
              aria-expanded={expandedCards.has('automation')}
            >
              <CardTitle className="flex items-center justify-between gap-2 text-lg font-semibold text-foreground">
                <span className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-gray-500" />
                  Automation Settings
                </span>
                <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform', expandedCards.has('automation') && 'rotate-180')} />
              </CardTitle>
            </CardHeader>
            <AnimatePresence initial={false}>
              {expandedCards.has('automation') && (
                <motion.div
                  variants={accordionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={accordionTransition}
                  className="overflow-hidden"
                >
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1.5">Auto-approve threshold</label>
                      <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-amber-300 focus:ring-1 focus:ring-amber-200">
                        <option>Under $50</option>
                        <option>Under $100</option>
                        <option>Under $200</option>
                        <option>Never auto-approve</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 accent-amber-600" />
                        <span className="text-sm text-gray-700">Recurring bills</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-amber-600" />
                        <span className="text-sm text-gray-700">Investment trades</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-amber-600" />
                        <span className="text-sm text-gray-700">Account transfers</span>
                      </label>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Execution Stats */}
        <motion.div variants={fadeUp}>
          <Card className="border border-border bg-card shadow-sm h-full">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleCard('stats')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard('stats') } }}
              tabIndex={0}
              role="button"
              aria-expanded={expandedCards.has('stats')}
            >
              <CardTitle className="flex items-center justify-between gap-2 text-lg font-semibold text-foreground">
                <span className="flex items-center gap-2">
                  <History className="h-5 w-5 text-gray-500" />
                  Execution Stats (30d)
                </span>
                <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform', expandedCards.has('stats') && 'rotate-180')} />
              </CardTitle>
            </CardHeader>
            <AnimatePresence initial={false}>
              {expandedCards.has('stats') && (
                <motion.div
                  variants={accordionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={accordionTransition}
                  className="overflow-hidden"
                >
                  <CardContent className="space-y-4">
                    <div className="text-center py-2">
                      <p className="text-3xl font-bold text-foreground">156</p>
                      <p className="text-sm text-muted-foreground">total executions</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-emerald-600 font-medium">149 approved (95.5%)</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-red-600 font-medium">4 rejected</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-amber-600 font-medium">3 modified</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 text-center">
                      <p className="text-lg font-bold text-foreground">$12,450</p>
                      <p className="text-sm text-muted-foreground">total processed</p>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>

      {/* Recent Execution History */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <History className="h-5 w-5 text-gray-500" />
                Recent Execution History
              </CardTitle>
              <Link to="/govern" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "min-h-[44px] text-sm text-muted-foreground")}>
                View Full Log <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {EXECUTION_HISTORY.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    {item.status === 'approved' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.description}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-gray-900">{item.amount}</span>
                    <span className={`text-xs font-medium ${HISTORY_STATUS[item.status]}`}>
                      {item.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
