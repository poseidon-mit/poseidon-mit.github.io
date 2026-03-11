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
  Protect: { icon: Shield,     color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', route: '/protect',  label: 'Protect Engine' },
  Grow:    { icon: TrendingUp, color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  route: '/grow',     label: 'Grow Engine' },
  Execute: { icon: Zap,        color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   route: '/execute',  label: 'Execute Engine' },
  Govern:  { icon: Scale,      color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    route: '/govern',   label: 'Govern Engine' },
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending:   { label: 'Pending Review', className: 'border-amber-500/20 bg-amber-500/10 text-amber-400' },
  completed: { label: 'Completed',      className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' },
  rejected:  { label: 'Rejected',       className: 'border-red-500/20 bg-red-500/10 text-red-400' },
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
  if (confidence >= 0.85) return { label: 'High Confidence', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
  if (confidence >= 0.6)  return { label: 'Moderate Confidence', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  return { label: 'Low Confidence', className: 'bg-white/[0.02] text-muted-foreground border-white/[0.06]' }
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
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Activity Log
        </Link>
      </motion.div>

      {/* ── Record Header ── */}
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <div className="flex items-start gap-4">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl shrink-0', engineInfo.bg)}>
              <EngineIcon className={cn('h-6 w-6', engineInfo.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm text-white/40 font-mono tabular-nums">
                <span>{decision.id}</span>
                <span className="text-white/30">|</span>
                <span>{formatDemoTimestamp(decision.timestamp)}</span>
              </div>
              <h1 className="text-xl font-bold text-foreground mt-1">{decision.action}</h1>
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
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Decision Flow</h2>

        <div className="flex flex-col items-center gap-0">
          {/* INPUT card */}
          <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.04] text-[11px] font-bold text-muted-foreground">1</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Input</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              {narrateInput(decision.baseReality)}
            </p>
            <div className="flex flex-wrap gap-2">
              {decision.baseReality.map((row) => (
                <span
                  key={row.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs"
                >
                  <span className="text-white/40 font-mono uppercase tracking-wider text-[10px]">{row.label}</span>
                  <span className="text-foreground font-medium">{row.value}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Down arrow */}
          <div className="flex items-center justify-center h-10">
            <ArrowDown className="h-5 w-5 text-white/30" />
          </div>

          {/* MODEL card */}
          <div className={cn('w-full rounded-2xl border bg-white/[0.03] p-5', engineInfo.border)}>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold', engineInfo.bg, engineInfo.color)}>2</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Model Analysis</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className={cn('text-xs font-semibold', confidenceInfo.className)}>
                {confidenceInfo.label}
              </Badge>
            </div>
            <p className="text-xs text-white/40 font-mono">
              {decision.model.name} v{decision.model.version}
            </p>
          </div>

          {/* Down arrow */}
          <div className="flex items-center justify-center h-10">
            <ArrowDown className="h-5 w-5 text-white/30" />
          </div>

          {/* OUTPUT card */}
          <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-400">3</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Output</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
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
            className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', engineInfo.bg)}>
                <EngineIcon className={cn('h-5 w-5', engineInfo.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">View in {engineInfo.label}</p>
                <p className="text-xs text-white/40">See the original context for this decision</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-blue-500 transition-colors" />
          </Link>
        </motion.div>
      )}

      {/* ── Processing metadata (small/muted) ── */}
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 py-6 border-t border-white/[0.06]">
        <span className="text-[11px] text-white/40 font-mono tabular-nums">
          {auditRecord ? `${auditRecord.processingMs}ms` : `${decision.model.accuracy}% accuracy`}
        </span>
        <span className="text-white/20">|</span>
        <span className="text-[11px] text-white/40 font-mono">
          {decision.model.name} v{decision.model.version}
        </span>
        <span className="text-white/20">|</span>
        <span className="text-[11px] text-white/40 font-mono">
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
