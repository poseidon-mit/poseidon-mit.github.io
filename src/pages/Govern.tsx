import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  ChevronRight,
  ChevronDown,
  Eye,
  ShieldCheck,
  Flag,
  Search,
  Download,
  Database,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { Link } from '@/router'
import { cn } from '@/lib/utils'
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

type EngineFilter = 'All' | 'Protect' | 'Grow' | 'Execute'

/* ── Page Component ── */
export default function GovernPage() {
  usePageTitle('Govern')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const [engineFilter, setEngineFilter] = useState<EngineFilter>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const toggleCard = (key: string) => setExpandedCards(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next })

  const summary = useMemo(() => selectGovernAuditSummaryView(), [])
  const auditEntries = useMemo(() => selectGovernAuditEntries(), [])
  const engineBreakdown = useMemo(() => selectGovernEngineBreakdown(), [])
  const council = useMemo(() => selectCouncilMetrics(), [])

  const filteredEntries = useMemo(() => {
    let entries = auditEntries
    if (engineFilter !== 'All') {
      entries = entries.filter(e => e.type === engineFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      entries = entries.filter(e =>
        e.action.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
      )
    }
    return entries.slice(0, 8)
  }, [auditEntries, engineFilter, searchQuery])

  const engineCounts = useMemo(() => {
    const counts: Record<string, number> = { Protect: 0, Grow: 0, Execute: 0 }
    for (const e of auditEntries) {
      if (counts[e.type] !== undefined) counts[e.type]++
    }
    return counts
  }, [auditEntries])

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
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2" />
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              All Verified
            </>
          )}
        </Badge>
      </motion.div>

      {/* Hero: Compliance Score + Actions Logged */}
      <motion.div variants={fadeUp}>
        <Card className="border-blue-200 bg-blue-50/50 shadow-sm border-t-4 border-t-[var(--engine-govern)]">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-6">
                {/* Score Ring */}
                <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                    <circle
                      cx="48" cy="48" r="40"
                      stroke="var(--engine-govern)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="251 251"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold text-foreground">{summary.total}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{summary.total} AI actions logged</h2>
                  <p className="text-sm text-muted-foreground">
                    Complete transparency into all automated decisions
                  </p>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 mt-1 gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2" />
                    <CheckCircle2 className="h-3 w-3" />
                    100% Auditable
                  </Badge>
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
              <div className="flex flex-wrap gap-3">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <Download className="mr-1.5 h-4 w-4" />
                  Export Report
                </Button>
                <Link to="/govern/audit" className={cn(buttonVariants({ variant: "outline" }), "text-foreground")}>View Full Ledger</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Engine Filter Tabs */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
        {(['All', 'Protect', 'Grow', 'Execute'] as EngineFilter[]).map(engine => (
          <button
            key={engine}
            onClick={() => setEngineFilter(engine)}
            className={cn(
              'min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold border transition-colors',
              engineFilter === engine
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700',
            )}
          >
            {engine} {engine === 'All' ? `(${auditEntries.length})` : `(${engineCounts[engine] ?? 0})`}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 min-h-[44px] rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 w-48"
          />
        </div>
      </motion.div>

      {/* Audit Log */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Scale className="h-5 w-5 text-blue-600" />
                Audit Log
              </CardTitle>
              <Link to="/govern/audit" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "min-h-[44px] text-sm text-muted-foreground")}>View All <ChevronRight className="ml-1 h-3.5 w-3.5" /></Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {filteredEntries.map((entry) => {
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
                      <Link to={`/govern/audit-detail?auditId=${entry.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-[44px] w-[44px] p-0 text-muted-foreground")} aria-label="View audit detail">
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2-Column: Compliance + Data Retention */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Status */}
        <motion.div variants={fadeUp}>
          <Card className="border border-border bg-card shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Shield className="h-5 w-5 text-blue-600" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'All actions logged', ok: true },
                { label: 'Human approval on sensitive actions', ok: true },
                { label: 'Audit trail complete', ok: true },
                { label: 'No anomalies detected', ok: summary.flagged === 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <CheckCircle2 className={cn('h-5 w-5', item.ok ? 'text-emerald-500' : 'text-gray-300')} />
                  <span className={cn('text-sm', item.ok ? 'text-gray-700' : 'text-gray-400')}>{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Retention */}
        <motion.div variants={fadeUp}>
          <Card className="border border-border bg-card shadow-sm h-full">
            <CardHeader
              className="cursor-pointer select-none"
              onClick={() => toggleCard('data-retention')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard('data-retention') } }}
              role="button"
              tabIndex={0}
              aria-expanded={expandedCards.has('data-retention')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Database className="h-5 w-5 text-blue-600" />
                  Data Retention
                </CardTitle>
                <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform', expandedCards.has('data-retention') && 'rotate-180')} />
              </div>
            </CardHeader>
            <AnimatePresence initial={false}>
              {expandedCards.has('data-retention') && (
                <motion.div
                  variants={accordionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={accordionTransition}
                  className="overflow-hidden"
                >
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Logs retained</span>
                      <span className="font-semibold text-gray-900">7 years</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last export</span>
                      <span className="font-semibold text-gray-900">Mar 1, 2026</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Storage</span>
                        <span className="font-semibold text-gray-900">2.4 MB / 1 GB</span>
                      </div>
                      <Progress value={0.24} />
                    </div>
                    <Button variant="outline" size="sm" className="w-full min-h-[44px] text-gray-700">
                      Configure Retention
                    </Button>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>

      {/* Engine Breakdown */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader
            className="cursor-pointer select-none"
            onClick={() => toggleCard('engine-breakdown')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard('engine-breakdown') } }}
            role="button"
            tabIndex={0}
            aria-expanded={expandedCards.has('engine-breakdown')}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Engine Breakdown
              </CardTitle>
              <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform', expandedCards.has('engine-breakdown') && 'rotate-180')} />
            </div>
          </CardHeader>
          <AnimatePresence initial={false}>
            {expandedCards.has('engine-breakdown') && (
              <motion.div
                variants={accordionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={accordionTransition}
                className="overflow-hidden"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  )
}
