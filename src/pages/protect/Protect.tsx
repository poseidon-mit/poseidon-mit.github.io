import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Activity,
  Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { getMotionPreset } from '@/lib/motion-presets'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { Link } from '@/router'
import {
  selectProtectThreats,
  selectAccounts,
  selectProtectPerformance,
  formatUsd,
  getCanonicalUniverse,
} from '@/domain/poseidon-universe'
import { useDismissedAlerts } from './useDismissedAlerts'
import { severityConfig } from './protect-data'
import type { ThreatSeverity } from './protect-data'

/* ── pickTopAlert (exported for tests) ── */
type Pickable = { id: string; severity: ThreatSeverity; confidence: number }

/** Deterministic top-alert selection: severity desc → confidence desc → id asc. */
export function pickTopAlert<T extends Pickable>(threats: T[]): T | null {
  if (threats.length === 0) return null
  return threats.reduce((best, t) => {
    const orderCmp = severityConfig[t.severity].order - severityConfig[best.severity].order
    if (orderCmp !== 0) return orderCmp > 0 ? t : best
    const confCmp = t.confidence - best.confidence
    if (confCmp !== 0) return confCmp > 0 ? t : best
    return t.id < best.id ? t : best
  })
}

/* ── Page Component ── */
export default function ProtectPage() {
  usePageTitle('Protect')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { dismissed } = useDismissedAlerts()

  const allThreats = useMemo(() => selectProtectThreats(), [])
  const activeThreats = useMemo(
    () => allThreats.filter((t) => !dismissed.has(t.id)),
    [allThreats, dismissed],
  )
  const accounts = useMemo(() => selectAccounts(), [])
  const performance = useMemo(() => selectProtectPerformance(), [])
  const universe = useMemo(() => getCanonicalUniverse(), [])

  const securityScore = Math.round(universe.metrics.systemConfidence * 100)
  const hasThreats = activeThreats.length > 0
  const topThreats = activeThreats.slice(0, 3)

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
          <h1 className="text-2xl font-bold text-foreground">Protect</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-powered security monitoring for all your accounts
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            hasThreats
              ? 'border-orange-200 bg-orange-50 text-orange-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }
        >
          {hasThreats ? (
            <>
              <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
              {activeThreats.length} Alerts
            </>
          ) : (
            <>
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              All Secure
            </>
          )}
        </Badge>
      </motion.div>

      {/* Hero: Protection Status */}
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
                      stroke="#22C55E"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="251 251"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold text-foreground">{accounts.length}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Accounts Protected</h2>
                  <p className="text-sm text-muted-foreground">
                    All accounts monitored 24/7
                  </p>
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 mt-1 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    100% Monitored
                  </Badge>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      {accounts.length} accounts secure
                    </span>
                    {hasThreats && (
                      <span className="flex items-center gap-1 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        {activeThreats.length} active alerts
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/protect/threats" className={cn(buttonVariants({ variant: "outline" }), "text-foreground")}>View All Threats</Link>
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">Run Full Scan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Required */}
      {topThreats.length > 0 && (
        <motion.div variants={fadeUp}>
          <Card className="border-orange-200 bg-orange-50/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Action Required ({activeThreats.length})
                </CardTitle>
                <Link to="/protect/threats" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-sm text-muted-foreground")}>View all <ChevronRight className="ml-1 h-3 w-3" /></Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {topThreats.map((threat) => (
                <div
                  key={threat.id}
                  className="flex flex-col gap-4 rounded-xl border border-orange-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                      threat.severity === 'Critical' ? 'bg-red-100 text-red-600' : threat.severity === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{threat.counterparty}</p>
                      <p className="text-sm text-muted-foreground">{threat.description}</p>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className={`text-xs ${
                          threat.severity === 'Critical' ? 'border-red-200 bg-red-50 text-red-700' : 'border-orange-200 bg-orange-50 text-orange-700'
                        }`}>
                          {threat.severity}
                        </Badge>
                        <span>{formatUsd(threat.amountUsd)}</span>
                        <span>{threat.relativeTime}</span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/protect/alert-detail?alertId=${threat.id}`} className={cn(buttonVariants({ size: "sm" }), "bg-orange-600 text-white hover:bg-orange-700")}>
                    Review
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 2-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Connected Accounts */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">Connected Accounts</CardTitle>
                  <Link to="/settings/integrations" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-sm text-muted-foreground")}>Manage <Settings className="ml-1 h-3.5 w-3.5" /></Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{account.label}</p>
                          <p className="text-sm text-muted-foreground">{account.institution} ····{account.last4}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                          <p className="font-semibold text-foreground">{formatUsd(account.balanceUsd)}</p>
                          <p className="text-xs text-muted-foreground capitalize">{account.type.replace('-', ' ')}</p>
                        </div>
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                          Secure
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Threat Activity */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Recent Threat Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allThreats.slice(0, 4).map((threat) => (
                    <Link key={threat.id} to={`/protect/alert-detail?alertId=${threat.id}`} className="block">
                      <div className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                        <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                          threat.severity === 'Critical' || threat.severity === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {threat.severity === 'Critical' || threat.severity === 'High' ? <AlertTriangle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{threat.counterparty}</p>
                          <p className="text-sm text-muted-foreground">{threat.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{threat.relativeTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Protection Performance */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Incidents Flagged</p>
                    <p className="text-2xl font-bold text-foreground">{performance.riskIncidentsFlagged}</p>
                  </div>
                  <ShieldAlert className="h-8 w-8 text-orange-400" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Avg Monthly Exposure</p>
                    <p className="text-2xl font-bold text-foreground">{formatUsd(performance.avgMonthlyExposureUsd)}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">System Confidence</p>
                    <p className="text-2xl font-bold text-foreground">{securityScore}%</p>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp}>
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/protect/threats" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start text-foreground")}>
                  <ShieldAlert className="mr-2 h-4 w-4" /> View All Threats
                </Link>
                <Link to="/govern/audit" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start text-foreground")}>
                  <Clock className="mr-2 h-4 w-4" /> Audit Trail
                </Link>
                <Link to="/settings" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start text-foreground")}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
