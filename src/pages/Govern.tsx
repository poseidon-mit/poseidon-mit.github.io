import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  ChevronRight,
  Eye,
  ShieldCheck,
  Flag,
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
  selectGovernAuditSummaryView,
  selectGovernAuditEntries,
  selectGovernEngineBreakdown,
  selectCouncilMetrics,
  formatPercent,
} from '@/domain/poseidon-universe'
import { formatDemoTimestamp } from '@/lib/demo-date'

const STATUS_ICON: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  'Verified': { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  'Pending review': { icon: Clock, color: 'bg-amber-50 text-amber-600' },
  'Flagged': { icon: Flag, color: 'bg-red-50 text-red-600' },
}

const ENGINE_BADGE: Record<string, string> = {
  Protect: 'bg-emerald-50 text-emerald-700',
  Grow: 'bg-violet-50 text-violet-700',
  Execute: 'bg-amber-50 text-amber-700',
  Govern: 'bg-blue-50 text-blue-700',
}

/* ── Page Component ── */
export default function GovernPage() {
  usePageTitle('Govern')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)

  const summary = useMemo(() => selectGovernAuditSummaryView(), [])
  const auditEntries = useMemo(() => selectGovernAuditEntries(), [])
  const engineBreakdown = useMemo(() => selectGovernEngineBreakdown(), [])
  const council = useMemo(() => selectCouncilMetrics(), [])

  const recentEntries = auditEntries.slice(0, 6)

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
          <h1 className="text-2xl font-bold text-foreground">Govern</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Compliance monitoring and audit trail
          </p>
        </div>
        <Badge variant="outline" className={
          summary.pending > 0
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : 'border-blue-200 bg-blue-50 text-blue-700'
        }>
          {summary.pending > 0 ? (
            <>
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              {summary.pending} Pending
            </>
          ) : (
            <>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              All Verified
            </>
          )}
        </Badge>
      </motion.div>

      {/* Hero: Compliance Score */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-6">
                {/* Score Ring */}
                <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                    <circle
                      cx="48" cy="48" r="40"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${summary.complianceScore * 2.51} 251`}
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold text-foreground">{summary.complianceScore}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Compliance Score</h2>
                  <p className="text-sm text-muted-foreground">
                    {summary.complianceScore >= 90 ? 'Strong compliance posture' : 'Needs attention'}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      {summary.verified} verified
                    </span>
                    {summary.pending > 0 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Clock className="h-4 w-4" />
                        {summary.pending} pending
                      </span>
                    )}
                    {summary.flagged > 0 && (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        {summary.flagged} flagged
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/govern/audit">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">View Full Ledger</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Decisions Audited</p>
                <p className="text-xl font-bold text-foreground">{summary.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-xl font-bold text-foreground">{summary.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <Flag className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-xl font-bold text-red-600">{summary.flagged}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Audit Log */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Scale className="h-5 w-5 text-blue-600" />
                    Recent Audit Log
                  </CardTitle>
                  <Link to="/govern/audit">
                    <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                      View All <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {recentEntries.map((entry) => {
                    const statusCfg = STATUS_ICON[entry.status] ?? STATUS_ICON['Verified']
                    const StatusIcon = statusCfg.icon
                    return (
                      <div key={entry.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${statusCfg.color}`}>
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{entry.action}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="outline" className={ENGINE_BADGE[entry.type] ?? 'bg-muted text-muted-foreground'}>
                                {entry.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{entry.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden text-right sm:block">
                            <Badge variant="outline" className={
                              entry.status === 'Verified' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                              entry.status === 'Flagged' ? 'border-red-200 bg-red-50 text-red-700' :
                              'border-amber-200 bg-amber-50 text-amber-700'
                            }>
                              {entry.status}
                            </Badge>
                          </div>
                          <Link to={`/govern/audit-detail?auditId=${entry.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
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
          {/* Engine Breakdown */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  Engine Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {engineBreakdown.map((item) => (
                  <div key={item.engine} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{item.engine}</span>
                      <span className="text-sm text-muted-foreground">{item.count} decisions ({item.percent}%)</span>
                    </div>
                    <Progress value={item.percent} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Council Metrics */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Council Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">False Positive Reduction</span>
                  <span className="font-semibold text-foreground">{formatPercent(council.falsePositiveReductionPercent / 100)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">Human Override Rate</span>
                  <span className="font-semibold text-foreground">{formatPercent(council.humanOverrideRate / 100)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">Avg Decision Time</span>
                  <span className="font-semibold text-foreground">{council.avgTimeToDecisionMinutes} min</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">Model Disagreement</span>
                  <span className="font-semibold text-foreground">{formatPercent(council.modelDisagreementRate / 100)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
