import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowDown,
  Shield,
  TrendingUp,
  Zap,
  Scale,
  ExternalLink,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { Badge } from '@/components/ui/badge'
import { getMotionPreset } from '@/lib/motion-presets'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { formatDemoTimestamp } from '@/lib/demo-date'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { AUDIT_DECISIONS, DEFAULT_DECISION_ID } from '@/lib/govern-audit-data'
import { auditRecords } from '@/data/audit'
import { cn } from '@/lib/utils'

/* ── Engine visual config ── */
const ENGINE_CONFIG: Record<string, {
  icon: typeof Shield
  color: string
  bg: string
  border: string
  route: string
  label: string
}> = {
  Protect: { icon: Shield,     color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', route: '/protect',  label: 'Protect Engine' },
  Grow:    { icon: TrendingUp, color: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200',  route: '/grow',     label: 'Grow Engine' },
  Execute: { icon: Zap,        color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   route: '/execute',  label: 'Execute Engine' },
  Govern:  { icon: Scale,      color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    route: '/govern',   label: 'Govern Engine' },
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending:   { label: 'Pending Review', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  completed: { label: 'Completed',      className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  rejected:  { label: 'Rejected',       className: 'border-red-200 bg-red-50 text-red-700' },
}

/* ── Map AUD IDs to GV decision IDs ── */
const AUD_TO_GV: Record<string, string> = {
  'AUD-2026-0310-001': 'GV-2026-0310-001',
  'AUD-2026-0310-002': 'GV-2026-0310-002',
  'AUD-2026-0311-003': 'GV-2026-0310-003',
  'AUD-2026-0310-004': 'GV-2026-0307-006',
  'AUD-2026-0309-005': 'GV-2026-0309-004',
  'AUD-2026-0308-006': 'GV-2026-0307-006',
}

function resolveDecision(id: string | null) {
  if (!id) return AUDIT_DECISIONS[DEFAULT_DECISION_ID]
  // Direct lookup (GV-* IDs)
  if (AUDIT_DECISIONS[id]) return AUDIT_DECISIONS[id]
  // Map from AUD-* IDs
  const mapped = AUD_TO_GV[id]
  if (mapped && AUDIT_DECISIONS[mapped]) return AUDIT_DECISIONS[mapped]
  return AUDIT_DECISIONS[DEFAULT_DECISION_ID]
}

function resolveAuditRecord(id: string | null) {
  if (!id) return undefined
  return auditRecords.find(r => r.id === id)
}

/* ── Confidence label ── */
function getConfidenceLabel(confidence: number): { label: string; className: string } {
  if (confidence >= 0.85) return { label: 'High Confidence', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  if (confidence >= 0.6)  return { label: 'Moderate Confidence', className: 'bg-amber-50 text-amber-700 border-amber-200' }
  return { label: 'Low Confidence', className: 'bg-gray-50 text-gray-600 border-gray-200' }
}

/* ── Page Component ── */
export function GovernAuditDetail() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  usePageTitle('Decision Record')

  const { search } = useRouter()
  const params = new URLSearchParams(search)
  const rawId = params.get('auditId') ?? params.get('decision') ?? params.get('id')

  const decision = resolveDecision(rawId)
  const auditRecord = resolveAuditRecord(rawId)
  const engineInfo = ENGINE_CONFIG[decision.engine] ?? ENGINE_CONFIG.Govern
  const EngineIcon = engineInfo.icon
  const confidenceInfo = getConfidenceLabel(decision.explanation.confidence)

  // Determine the status — prefer auditRecord status if available, otherwise infer
  const status = auditRecord?.status ?? 'completed'
  const statusStyle = STATUS_BADGE[status] ?? STATUS_BADGE.completed

  return (
    <motion.div
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 pb-12`}
      style={PAGE_CONTENT_STYLE}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          to="/govern"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Activity Log
        </Link>
      </motion.div>

      {/* ── Record Header ── */}
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl shrink-0', engineInfo.bg)}>
              <EngineIcon className={cn('h-6 w-6', engineInfo.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm text-gray-400 font-mono tabular-nums">
                <span>{decision.id}</span>
                <span className="text-gray-300">|</span>
                <span>{formatDemoTimestamp(decision.timestamp)}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mt-1">{decision.action}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge variant="outline" className={cn('text-xs', engineInfo.bg, engineInfo.color, engineInfo.border)}>
                  {decision.engine}
                </Badge>
                <Badge variant="outline" className={cn('text-xs', statusStyle.className)}>
                  {statusStyle.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Decision Flow: INPUT -> MODEL -> OUTPUT ── */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Decision Flow</h2>

        <div className="flex flex-col items-center gap-0">
          {/* INPUT card */}
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">1</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Input</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {narrateInput(decision.baseReality)}
            </p>
            <div className="flex flex-wrap gap-2">
              {decision.baseReality.map((row) => (
                <span
                  key={row.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs"
                >
                  <span className="text-gray-400 font-mono uppercase tracking-wider text-[10px]">{row.label}</span>
                  <span className="text-gray-700 font-medium">{row.value}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Down arrow */}
          <div className="flex items-center justify-center h-10">
            <ArrowDown className="h-5 w-5 text-gray-300" />
          </div>

          {/* MODEL card */}
          <div className={cn('w-full rounded-2xl border bg-white p-5', engineInfo.border)}>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold', engineInfo.bg, engineInfo.color)}>2</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Model Analysis</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className={cn('text-xs font-semibold', confidenceInfo.className)}>
                {confidenceInfo.label}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              {decision.model.name} v{decision.model.version}
            </p>
          </div>

          {/* Down arrow */}
          <div className="flex items-center justify-center h-10">
            <ArrowDown className="h-5 w-5 text-gray-300" />
          </div>

          {/* OUTPUT card */}
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-600">3</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Output</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {decision.explanation.summary}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Related Item link ── */}
      {decision.engine !== 'Govern' && (
        <motion.div variants={fadeUp}>
          <Link
            to={engineInfo.route}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', engineInfo.bg)}>
                <EngineIcon className={cn('h-5 w-5', engineInfo.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">View in {engineInfo.label}</p>
                <p className="text-xs text-gray-400">See the original context for this decision</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </Link>
        </motion.div>
      )}

      {/* ── Processing metadata (small/muted) ── */}
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 py-6 border-t border-gray-100">
        <span className="text-[11px] text-gray-400 font-mono tabular-nums">
          {auditRecord ? `${auditRecord.processingMs}ms` : `${decision.model.accuracy}% accuracy`}
        </span>
        <span className="text-gray-200">|</span>
        <span className="text-[11px] text-gray-400 font-mono">
          {decision.model.name} v{decision.model.version}
        </span>
        <span className="text-gray-200">|</span>
        <span className="text-[11px] text-gray-400 font-mono">
          {decision.id}
        </span>
      </motion.div>
    </motion.div>
  )
}

/* ── Helper: narrate the base reality into a sentence ── */
function narrateInput(baseReality: Array<{ label: string; value: string }>): string {
  const map = new Map(baseReality.map(r => [r.label.toLowerCase(), r.value]))
  const parts: string[] = []

  const amount = map.get('amount') || map.get('charge amount') || map.get('transaction amount')
  if (amount) parts.push(`a transaction of ${amount}`)
  const merchant = map.get('merchant') || map.get('counterparty') || map.get('vendor')
  if (merchant) parts.push(`from ${merchant}`)
  const location = map.get('location')
  if (location) parts.push(`originating from ${location}`)
  const account = map.get('account') || map.get('card')
  if (account) parts.push(`on ${account}`)
  const assessment = map.get('assessment') || map.get('status')
  if (assessment) parts.push(`(${assessment})`)

  if (parts.length > 0) {
    const sentence = parts.join(' ')
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  }

  return baseReality.map(r => `${r.label}: ${r.value}`).join(' · ')
}

export default GovernAuditDetail
