import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Scale,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CountUp } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { Link } from '@/router'
import { cn } from '@/lib/utils'
import { auditRecords, governStats } from '@/data/audit'
import { formatDemoTimestamp } from '@/lib/demo-date'

/* ── Engine color config ── */
const ENGINE_BADGE: Record<string, { bg: string; text: string; dot: string }> = {
  Protect: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Grow:    { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-500' },
  Execute: { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  Govern:  { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending:   { label: 'Pending',   className: 'border-amber-200 bg-amber-50 text-amber-700' },
  completed: { label: 'Completed', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  rejected:  { label: 'Rejected',  className: 'border-red-200 bg-red-50 text-red-700' },
}

const FILTER_PILL_ACTIVE: Record<string, string> = {
  All:     'bg-blue-100 text-blue-700 border-blue-200',
  Protect: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Grow:    'bg-violet-100 text-violet-700 border-violet-200',
  Execute: 'bg-amber-100 text-amber-700 border-amber-200',
}

type EngineFilter = 'All' | 'Protect' | 'Grow' | 'Execute'

/* ── Page Component ── */
export default function GovernPage() {
  usePageTitle('Govern')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const [engineFilter, setEngineFilter] = useState<EngineFilter>('All')

  const filteredRecords = useMemo(() => {
    if (engineFilter === 'All') return auditRecords.slice(0, 6)
    return auditRecords.filter(r => r.engine === engineFilter).slice(0, 6)
  }, [engineFilter])

  const engineCounts = useMemo(() => {
    const counts: Record<string, number> = { Protect: 0, Grow: 0, Execute: 0 }
    for (const r of auditRecords) {
      if (counts[r.engine] !== undefined) counts[r.engine]++
    }
    return counts
  }, [])

  return (
    <motion.div
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-8`}
      style={PAGE_CONTENT_STYLE}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* ── Hero: 100% ── */}
      <motion.div variants={fadeUp} className="text-center pt-4 pb-2">
        <CountUp
          value={100}
          suffix="%"
          duration={1600}
          className="text-[5rem] sm:text-[6.5rem] font-bold leading-none tracking-tight text-blue-600 font-mono tabular-nums"
        />
        <p className="mt-3 text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          Every AI decision is recorded, traceable, and explainable.
        </p>
      </motion.div>

      {/* ── Summary cards (2x2) ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
        <SummaryCard
          label="Total Records"
          value={governStats.totalRecords}
          locale
          icon={<FileText className="h-4 w-4 text-blue-500" />}
        />
        <SummaryCard
          label="This Month"
          value={governStats.thisMonth}
          locale
          icon={<Clock className="h-4 w-4 text-blue-500" />}
        />
        <SummaryCard
          label="Auditable"
          value={100}
          suffix="%"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">User Overrides</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 font-mono tabular-nums">
            {governStats.userOverrides}
          </span>
        </div>
      </motion.div>

      {/* ── Engine filter pills ── */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
        {(['All', 'Protect', 'Grow', 'Execute'] as EngineFilter[]).map(engine => (
          <button
            key={engine}
            onClick={() => setEngineFilter(engine)}
            className={cn(
              'min-h-[44px] px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
              engineFilter === engine
                ? FILTER_PILL_ACTIVE[engine]
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700',
            )}
          >
            {engine}
            <span className="ml-1.5 font-mono tabular-nums text-xs opacity-70">
              {engine === 'All' ? auditRecords.length : (engineCounts[engine] ?? 0)}
            </span>
          </button>
        ))}
      </motion.div>

      {/* ── Activity Log ── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Scale className="h-5 w-5 text-blue-600" />
            Activity Log
          </h2>
          <Link
            to="/govern/audit"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gray-200" />

          <div className="flex flex-col gap-0">
            {filteredRecords.map((record) => {
              const engineStyle = ENGINE_BADGE[record.engine] ?? ENGINE_BADGE.Govern
              const statusStyle = STATUS_BADGE[record.status] ?? STATUS_BADGE.pending
              return (
                <Link
                  key={record.id}
                  to={`/govern/audit-detail?auditId=${record.id}`}
                  className="group relative flex items-start gap-4 py-4 pl-0 hover:bg-gray-50/50 rounded-lg transition-colors -mx-2 px-2"
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    'relative z-10 mt-1.5 h-[15px] w-[15px] rounded-full border-2 border-white shrink-0',
                    engineStyle.dot,
                  )} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                          {record.action}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="outline" className={cn('text-[11px] px-2 py-0.5', engineStyle.bg, engineStyle.text)}>
                            {record.engine}
                          </Badge>
                          <span className="text-xs text-gray-400 font-mono tabular-nums">
                            {formatDemoTimestamp(record.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={cn('text-[11px] px-2 py-0.5', statusStyle.className)}>
                          {statusStyle.label}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Summary Card sub-component ── */
function SummaryCard({
  label,
  value,
  suffix,
  locale,
  icon,
}: {
  label: string
  value: number
  suffix?: string
  locale?: boolean
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <CountUp
        value={value}
        suffix={suffix}
        locale={locale}
        duration={1000}
        className="text-2xl font-bold text-gray-900 font-mono tabular-nums"
      />
    </div>
  )
}
