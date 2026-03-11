import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle2, ChevronRight, Clock, Filter } from 'lucide-react'
import { Link } from '@/router'
import { selectAccounts } from '@/domain/poseidon-universe'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListHeroBanner } from '@/components/poseidon/list-hero-banner'
import { THREATS } from './protect-data'
import type { ThreatRow, ThreatSeverity } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'

/* ── Severity display config ── */

const severityBadgeConfig: Record<ThreatSeverity, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  High: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  Medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
}

const severityIconColor: Record<ThreatSeverity, string> = {
  Critical: 'text-red-400',
  High: 'text-red-400',
  Medium: 'text-amber-400',
  Low: 'text-blue-400',
}

const severityIconBg: Record<ThreatSeverity, string> = {
  Critical: 'bg-red-500/10',
  High: 'bg-red-500/10',
  Medium: 'bg-amber-500/10',
  Low: 'bg-blue-500/10',
}

/* ── Main Page ── */

export default function ProtectThreatsPage() {
  usePageTitle('Security Threats')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { dismissed } = useDismissedAlerts()

  const [accountFilter, setAccountFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('7days')

  const activeThreats = useMemo(() => THREATS.filter(t => !dismissed.has(t.id)), [dismissed])
  const accounts = useMemo(() => selectAccounts(), [])

  const threatAccounts = useMemo(() => {
    const accts = new Set(activeThreats.map(t => t.account).filter(Boolean))
    return Array.from(accts) as string[]
  }, [activeThreats])

  const filtered = useMemo(() => {
    return activeThreats.filter(t => {
      if (accountFilter !== 'all' && t.account !== accountFilter) return false
      if (severityFilter !== 'all' && t.severity !== severityFilter) return false
      return true
    })
  }, [activeThreats, accountFilter, severityFilter])

  const pendingThreats = useMemo(() => filtered.filter(t => t.status === 'pending'), [filtered])
  const resolvedThreats = useMemo(() => filtered.filter(t => t.status === 'resolved'), [filtered])
  const allResolved = THREATS.filter(t => t.status === 'resolved').length

  const clearFilters = () => {
    setAccountFilter('all')
    setSeverityFilter('all')
    setDateFilter('7days')
  }

  const hasActiveFilters = accountFilter !== 'all' || severityFilter !== 'all' || dateFilter !== '7days'

  return (
    <div className="hero-viewport">
      <motion.div
        className="flex flex-col gap-5 h-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Banner */}
        <motion.div variants={fadeUp}>
          <ListHeroBanner
            engine="protect"
            icon={Shield}
            engineLabel="Protect · Threats"
            title="Security Threats"
            subtitle="Review and manage security alerts across all accounts"
            backTo="/protect"
            backLabel="Back to Protect"
            stats={[
              { label: 'Pending', value: pendingThreats.length, color: 'var(--state-critical)' },
              { label: 'Resolved', value: allResolved, color: 'var(--state-healthy)' },
              { label: 'Monitored', value: accounts.length },
            ]}
          />
        </motion.div>

        {/* Scrollable list area */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">
          {/* Filters */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter:</span>
            </div>

            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectTrigger className="w-[180px] bg-white/[0.03] border-white/[0.06] text-foreground">
                <SelectValue placeholder="All Accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {threatAccounts.map(acct => (
                  <SelectItem key={acct} value={acct}>{acct}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px] bg-white/[0.03] border-white/[0.06] text-foreground">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px] bg-white/[0.03] border-white/[0.06] text-foreground">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </motion.div>

          {/* Tabs: Pending / Resolved */}
          <motion.div variants={fadeUp}>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="bg-white/[0.04]">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingThreats.length})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Resolved ({resolvedThreats.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4 space-y-3">
                {pendingThreats.length === 0 ? (
                  <InlineEmptyState
                    icon={<CheckCircle2 className="h-12 w-12 text-emerald-400" />}
                    title="All clear!"
                    description="No pending threats to review"
                  />
                ) : (
                  pendingThreats.map(threat => (
                    <ThreatCard key={threat.id} threat={threat} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="resolved" className="mt-4 space-y-3">
                {resolvedThreats.length === 0 ? (
                  <InlineEmptyState
                    icon={<Clock className="h-12 w-12 text-white/40" />}
                    title="No history yet"
                    description="Resolved threats will appear here"
                  />
                ) : (
                  resolvedThreats.map(threat => (
                    <ThreatCard key={threat.id} threat={threat} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Threat Card ── */

function ThreatCard({ threat }: { threat: ThreatRow }) {
  const config = severityBadgeConfig[threat.severity]
  const isResolved = threat.status === 'resolved'

  return (
    <Card className="bg-card border-white/[0.06] transition-shadow hover:bg-white/[0.04]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${severityIconBg[threat.severity]}`}
            >
              {isResolved ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <AlertTriangle className={`h-5 w-5 ${severityIconColor[threat.severity]}`} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">{threat.counterparty}</p>
                <Badge variant="outline" className={`${config.bg} ${config.text} ${config.border}`}>
                  {threat.severity}
                </Badge>
                {isResolved && (
                  <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    Resolved
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{threat.description}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                {threat.account && <span>{threat.account}</span>}
                <span className="font-mono">{threat.amount}</span>
                <span>Detected: {threat.time}</span>
                {threat.resolvedAt && <span>Resolved: {threat.resolvedAt}</span>}
              </div>
            </div>
          </div>

          <Link
            to={`/protect/alert-detail?alertId=${threat.id}`}
            className={cn(
              buttonVariants({ variant: isResolved ? 'outline' : 'default', size: 'sm' }),
              'shrink-0 whitespace-nowrap'
            )}
          >
            {isResolved ? 'View' : 'Review'}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

/* ── Empty State ── */

function InlineEmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="bg-card border-white/[0.06]">
      <CardContent className="flex flex-col items-center justify-center py-12">
        {icon}
        <p className="mt-4 text-lg font-medium text-foreground">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
