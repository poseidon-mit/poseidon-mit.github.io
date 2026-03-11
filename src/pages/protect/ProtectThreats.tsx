import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle2, ChevronRight, ArrowLeft, Filter, Clock } from 'lucide-react'
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
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { THREATS } from './protect-data'
import type { ThreatRow, ThreatSeverity } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'

/* ── Severity display config ── */

const severityBadgeConfig: Record<ThreatSeverity, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  High: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  Low: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
}

const severityIconColor: Record<ThreatSeverity, string> = {
  Critical: 'text-red-600',
  High: 'text-red-600',
  Medium: 'text-amber-600',
  Low: 'text-blue-600',
}

const severityIconBg: Record<ThreatSeverity, string> = {
  Critical: 'bg-red-100',
  High: 'bg-red-100',
  Medium: 'bg-amber-100',
  Low: 'bg-blue-100',
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

  // Unique accounts from threats for filter dropdown
  const threatAccounts = useMemo(() => {
    const accts = new Set(activeThreats.map(t => t.account).filter(Boolean))
    return Array.from(accts) as string[]
  }, [activeThreats])

  // Apply filters
  const filtered = useMemo(() => {
    return activeThreats.filter(t => {
      if (accountFilter !== 'all' && t.account !== accountFilter) return false
      if (severityFilter !== 'all' && t.severity !== severityFilter) return false
      return true
    })
  }, [activeThreats, accountFilter, severityFilter])

  const pendingThreats = useMemo(() => filtered.filter(t => t.status === 'pending'), [filtered])
  const resolvedThreats = useMemo(() => filtered.filter(t => t.status === 'resolved'), [filtered])

  const clearFilters = () => {
    setAccountFilter('all')
    setSeverityFilter('all')
    setDateFilter('7days')
  }

  const hasActiveFilters = accountFilter !== 'all' || severityFilter !== 'all' || dateFilter !== '7days'

  return (
    <motion.main
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 pb-12 bg-[#F8F7F4] min-h-screen`}
      style={PAGE_CONTENT_STYLE}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          to="/protect"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Protect
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
          <Shield className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Threats</h1>
          <p className="text-gray-500">Review and manage security alerts across all accounts</p>
        </div>
      </motion.div>

      {/* Summary cards */}
      <motion.div variants={fadeUp}>
        <SummaryCards
          pendingCount={pendingThreats.length}
          resolvedCount={resolvedThreats.length}
          accountsCount={accounts.length}
        />
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="h-4 w-4" />
          <span>Filter:</span>
        </div>

        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-700">
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
          <SelectTrigger className="w-[140px] bg-white border-gray-200 text-gray-700">
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
          <SelectTrigger className="w-[140px] bg-white border-gray-200 text-gray-700">
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
          <Button variant="ghost" size="sm" className="text-gray-500" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </motion.div>

      {/* Tabs: Pending / Resolved */}
      <motion.div variants={fadeUp}>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="bg-gray-100">
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
                icon={<CheckCircle2 className="h-12 w-12 text-green-500" />}
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
                icon={<Clock className="h-12 w-12 text-gray-400" />}
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
    </motion.main>
  )
}

/* ── Summary Cards ── */

function SummaryCards({
  pendingCount,
  resolvedCount,
  accountsCount,
}: {
  pendingCount: number
  resolvedCount: number
  accountsCount: number
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="border-2 border-red-200 bg-red-50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-700">{pendingCount}</p>
            <p className="text-sm text-red-600">Pending Review</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-700">{resolvedCount}</p>
            <p className="text-sm text-green-600">Resolved</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-700">{accountsCount}</p>
            <p className="text-sm text-blue-600">Accounts Monitored</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ── Threat Card ── */

function ThreatCard({ threat }: { threat: ThreatRow }) {
  const config = severityBadgeConfig[threat.severity]
  const isResolved = threat.status === 'resolved'

  return (
    <Card className="bg-white border-gray-200 transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: icon + info */}
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${severityIconBg[threat.severity]}`}
            >
              {isResolved ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className={`h-5 w-5 ${severityIconColor[threat.severity]}`} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-gray-900">{threat.counterparty}</p>
                <Badge variant="outline" className={`${config.bg} ${config.text} ${config.border}`}>
                  {threat.severity}
                </Badge>
                {isResolved && (
                  <Badge variant="outline" className="border-green-200 bg-green-100 text-green-700">
                    Resolved
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{threat.description}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                {threat.account && <span>{threat.account}</span>}
                <span className="font-mono">{threat.amount}</span>
                <span>Detected: {threat.time}</span>
                {threat.resolvedAt && <span>Resolved: {threat.resolvedAt}</span>}
              </div>
            </div>
          </div>

          {/* Right: action button */}
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

/* ── Empty State (light theme) ── */

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
    <Card className="bg-white border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-12">
        {icon}
        <p className="mt-4 text-lg font-medium text-gray-900">{title}</p>
        <p className="text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}
