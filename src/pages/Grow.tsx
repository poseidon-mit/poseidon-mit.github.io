import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  ArrowUpRight,
  Target,
  Lightbulb,
  ChevronRight,
  Wallet,
  Droplets,
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
  selectBalanceSheet,
  selectGrowRecommendations,
  selectGoals,
  selectAccounts,
  selectGrowLiquidityReserveView,
  getCanonicalUniverse,
  formatUsd,
} from '@/domain/poseidon-universe'

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: 'Checking',
  savings: 'Savings',
  'credit-card': 'Credit Card',
  retirement: 'Retirement',
  brokerage: 'Brokerage',
  'auto-loan': 'Auto Loan',
}

const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  checking: 'bg-blue-500',
  savings: 'bg-emerald-500',
  'credit-card': 'bg-red-500',
  retirement: 'bg-violet-500',
  brokerage: 'bg-amber-500',
  'auto-loan': 'bg-slate-500',
}

/* ── Page Component ── */
export default function GrowPage() {
  usePageTitle('Grow')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)

  const balanceSheet = useMemo(() => selectBalanceSheet(), [])
  const recommendations = useMemo(() => selectGrowRecommendations(), [])
  const goals = useMemo(() => selectGoals(), [])
  const accounts = useMemo(() => selectAccounts(), [])
  const liquidity = useMemo(() => selectGrowLiquidityReserveView(), [])
  const universe = useMemo(() => getCanonicalUniverse(), [])

  const topRecs = recommendations.slice(0, 3)
  const optimizationPotential = universe.metrics.monthlyOptimizationPotentialUsd

  // Group accounts by type for allocation view
  const accountGroups = useMemo(() => {
    const groups: Record<string, { label: string; total: number; color: string }> = {}
    for (const acc of accounts) {
      const key = acc.type
      if (!groups[key]) {
        groups[key] = {
          label: ACCOUNT_TYPE_LABELS[key] ?? key,
          total: 0,
          color: ACCOUNT_TYPE_COLORS[key] ?? 'bg-slate-500',
        }
      }
      groups[key].total += Math.abs(acc.balanceUsd)
    }
    return Object.values(groups).sort((a, b) => b.total - a.total)
  }, [accounts])

  const totalAbsBalance = accountGroups.reduce((s, g) => s + g.total, 0)

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
          <h1 className="text-2xl font-bold text-foreground">Grow</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Investment management and wealth building
          </p>
        </div>
        <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">
          <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
          {recommendations.length} Recommendations
        </Badge>
      </motion.div>

      {/* Hero: Net Worth */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Worth</p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-foreground">
                    {formatUsd(balanceSheet.netWorth)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Assets: {formatUsd(balanceSheet.totalAssets)}
                  </span>
                  <span className="text-muted-foreground">
                    Liabilities: {formatUsd(balanceSheet.totalLiabilities)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="rounded-xl bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-medium text-emerald-600">Optimization Potential</p>
                  <p className="text-xl font-bold text-emerald-700">+{formatUsd(optimizationPotential)}/mo</p>
                </div>
                <div className="flex gap-2">
                  <Link to="/grow/scenarios">
                    <Button variant="outline" className="text-foreground">Scenarios</Button>
                  </Link>
                  <Link to="/grow/recommendations">
                    <Button className="bg-violet-600 text-white hover:bg-violet-700">Recommendations</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Account Allocation */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Wallet className="h-5 w-5 text-violet-600" />
                  Account Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accountGroups.map((group) => {
                    const percent = totalAbsBalance > 0 ? Math.round((group.total / totalAbsBalance) * 100) : 0
                    return (
                      <div key={group.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${group.color}`} />
                            <span className="font-medium text-foreground">{group.label}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{formatUsd(group.total)}</span>
                            <span className="w-12 text-right font-semibold text-foreground">{percent}%</span>
                          </div>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className={`h-full rounded-full ${group.color}`} style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Financial Goals */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Target className="h-5 w-5 text-violet-600" />
                    Financial Goals
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal) => {
                    const progress = goal.targetUsd > 0 ? Math.round((goal.currentUsd / goal.targetUsd) * 100) : 0
                    return (
                      <div key={goal.id} className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{goal.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatUsd(goal.monthlyContributionUsd)}/mo contribution
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-bold text-foreground">{formatUsd(goal.currentUsd)}</p>
                              <p className="text-sm text-muted-foreground">of {formatUsd(goal.targetUsd)}</p>
                            </div>
                            <Link to={`/grow/goal?id=${goal.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Progress value={progress} />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{progress}% complete</span>
                            <span>{formatUsd(goal.targetUsd - goal.currentUsd)} to go</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Top Recommendations */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Top Recommendations
                  </CardTitle>
                  <Link to="/grow/recommendations">
                    <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {topRecs.map((rec) => (
                  <Link key={rec.id} to={`/grow/recommendation?id=${rec.id}`} className="block">
                    <div className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/30">
                      <p className="font-medium text-foreground">{rec.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{rec.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald-600">
                          <ArrowUpRight className="mr-1 inline h-3.5 w-3.5" />
                          +{formatUsd(rec.annualSavings)}/yr
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Liquidity Reserve */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Liquidity Reserve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-semibold text-foreground">{formatUsd(liquidity.currentUsd)}</span>
                  </div>
                  <Progress value={liquidity.percent} />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-semibold text-foreground">{formatUsd(liquidity.targetUsd)}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-xs text-blue-700">
                    {liquidity.percent}% of target — {liquidity.percent >= 100 ? 'Fully funded' : `${formatUsd(liquidity.targetUsd - liquidity.currentUsd)} needed`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
