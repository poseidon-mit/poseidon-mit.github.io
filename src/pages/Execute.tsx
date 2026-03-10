import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  PiggyBank,
  ListTodo,
  History,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getMotionPreset } from '@/lib/motion-presets'
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

/* ── Page Component ── */
export default function ExecutePage() {
  usePageTitle('Execute')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)

  const actions = useMemo(() => selectExecuteActionsView(), [])
  const stats = useMemo(() => selectExecuteQueueStats(), [])
  const savings = useMemo(() => selectExecuteSavingsView(), [])

  const topActions = actions.slice(0, 5)
  const savingsProgress = savings.potentialMonthlySavingsUsd > 0
    ? Math.round((savings.currentMonthlySavingsUsd / savings.potentialMonthlySavingsUsd) * 100)
    : 0

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
          <p className="mt-1 text-sm text-muted-foreground">
            Smart actions and automated money movement
          </p>
        </div>
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
          <Zap className="mr-1.5 h-3.5 w-3.5" />
          {stats.byUrgency.high > 0 ? `${stats.byUrgency.high} Urgent` : `${stats.total} Actions`}
        </Badge>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <ListTodo className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Actions</p>
                <p className="text-xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Urgency</p>
                <p className="text-xl font-bold text-foreground">{stats.byUrgency.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <PiggyBank className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-xl font-bold text-emerald-600">{formatUsd(stats.potentialSavingsUsd)}/mo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) — Action Queue */}
        <div className="space-y-6 lg:col-span-2">
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Zap className="h-5 w-5 text-amber-600" />
                    Action Queue
                  </CardTitle>
                  <Link to="/execute/queue">
                    <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                      View Full Queue <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {topActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          action.urgency === 'high' ? 'bg-red-50' : action.urgency === 'medium' ? 'bg-amber-50' : 'bg-emerald-50'
                        }`}>
                          <Zap className={`h-5 w-5 ${
                            action.urgency === 'high' ? 'text-red-600' : action.urgency === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{action.title}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className={ENGINE_BADGE[action.engine] ?? 'bg-muted text-muted-foreground'}>
                              {action.engine}
                            </Badge>
                            <Badge variant="outline" className={URGENCY_BADGE[action.urgency]}>
                              {action.urgency}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{action.amountLabel}</p>
                          <p className="text-xs text-muted-foreground">{action.timestampLabel}</p>
                        </div>
                        <Link to={`/execute/approval?actionId=${action.id}`}>
                          <Button variant="outline" size="sm" className="text-foreground">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Savings Potential */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <PiggyBank className="h-5 w-5 text-emerald-600" />
                  Savings Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-semibold text-foreground">{formatUsd(savings.currentMonthlySavingsUsd)}/mo</span>
                  </div>
                  <Progress value={savingsProgress} />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Potential</span>
                    <span className="font-semibold text-emerald-600">{formatUsd(savings.potentialMonthlySavingsUsd)}/mo</span>
                  </div>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-600">Unlock more savings</p>
                  <p className="mt-1 text-sm text-emerald-700">
                    Complete {stats.total} pending actions to reach your full savings potential.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/execute/queue">
                  <Button variant="outline" className="w-full justify-start text-foreground">
                    <ListTodo className="mr-2 h-4 w-4" /> Full Action Queue
                  </Button>
                </Link>
                <Link to="/execute/history">
                  <Button variant="outline" className="w-full justify-start text-foreground">
                    <History className="mr-2 h-4 w-4" /> Payment History
                  </Button>
                </Link>
                <Link to="/execute/approval">
                  <Button variant="outline" className="w-full justify-start text-foreground">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approval Flow
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
