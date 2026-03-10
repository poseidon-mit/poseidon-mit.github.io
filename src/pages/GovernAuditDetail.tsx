import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MessageCircle,
  Download,
  RotateCcw,
  Shield,
  TrendingUp,
  Zap,
  Scale,
  Eye,
  Copy,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { ConfidenceIndicator } from '@/components/poseidon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getMotionPreset } from '@/lib/motion-presets'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { AUDIT_DECISIONS, DEFAULT_DECISION_ID } from '@/lib/govern-audit-data'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

const ENGINE_MAP: Record<string, { icon: typeof Shield; color: string; bg: string }> = {
  Protect: { icon: Shield,     color: 'text-emerald-700', bg: 'bg-emerald-50' },
  Grow:    { icon: TrendingUp, color: 'text-violet-700',  bg: 'bg-violet-50' },
  Execute: { icon: Zap,        color: 'text-amber-700',   bg: 'bg-amber-50' },
  Govern:  { icon: Scale,      color: 'text-blue-700',    bg: 'bg-blue-50' },
}

const STEP_COLORS: Record<string, string> = {
  Trigger: 'border-gray-300 bg-gray-50 text-gray-600',
  Analysis: 'border-violet-300 bg-violet-50 text-violet-700',
  'Generate Recommendation': 'border-violet-300 bg-violet-50 text-violet-700',
  'User Action': 'border-blue-300 bg-blue-50 text-blue-700',
  'Approval Required': 'border-amber-300 bg-amber-50 text-amber-700',
  Completed: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  Rejected: 'border-red-300 bg-red-50 text-red-700',
}

const COMPLIANCE_INFO: Array<{ key: 'gdpr' | 'ecoa' | 'ccpa'; label: string; description: string }> = [
  { key: 'gdpr', label: 'GDPR', description: 'Your data rights under European privacy law' },
  { key: 'ecoa', label: 'ECOA', description: 'Equal treatment in financial decisions' },
  { key: 'ccpa', label: 'CCPA', description: 'Your California privacy protections' },
]

function narrateBaseReality(baseReality: Array<{ label: string; value: string }>): string {
  const map = new Map(baseReality.map(r => [r.label.toLowerCase(), r.value]))
  const parts: string[] = []
  const amount = map.get('amount') || map.get('charge amount') || map.get('transaction amount')
  if (amount) parts.push(`a transaction of ${amount}`)
  const merchant = map.get('merchant') || map.get('counterparty') || map.get('vendor')
  if (merchant) parts.push(`from ${merchant}`)
  const service = map.get('service') || map.get('product') || map.get('category')
  if (service) parts.push(`for ${service}`)
  const account = map.get('account') || map.get('card')
  if (account) parts.push(`on account ${account}`)
  const risk = map.get('risk level') || map.get('severity')
  if (risk) parts.push(`assessed at ${risk.toLowerCase()} risk`)
  if (parts.length > 0) {
    return parts[0].charAt(0).toUpperCase() + parts.join(', ').slice(1) + '.'
  }
  return baseReality.map(r => `${r.label}: ${r.value}`).join(' · ')
}

export function GovernAuditDetail() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  usePageTitle('Audit Detail')
  const { showToast } = useToast()
  const [rawExpanded, setRawExpanded] = useState(false)

  const { search } = useRouter()
  const params = new URLSearchParams(search)
  const decisionId = params.get('auditId') ?? params.get('decision')
  const auditEntry = (decisionId && AUDIT_DECISIONS[decisionId]) || AUDIT_DECISIONS[DEFAULT_DECISION_ID]
  const resolvedTimestamp = formatDemoTimestamp(auditEntry.timestamp)
  const engineInfo = ENGINE_MAP[auditEntry.engine] ?? ENGINE_MAP.Govern

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
          Back to Audit Log
        </Link>
      </motion.div>

      {/* Header Card */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl shrink-0', engineInfo.bg)}>
                <Eye className={cn('h-7 w-7', engineInfo.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Audit Record #{auditEntry.id}</p>
                <h1 className="text-2xl font-bold text-gray-900">{auditEntry.engine}: {auditEntry.action}</h1>
                <p className="text-sm text-gray-400 mt-1">{resolvedTimestamp}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="outline" className={cn(engineInfo.bg, engineInfo.color)}>
                    {auditEntry.engine}
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    Audit Record
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decision Chain */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Decision Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-0 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gray-200" />
              {auditEntry.topFactors.map((factor, i) => {
                const stepColor = STEP_COLORS[factor.label] ?? 'border-blue-300 bg-blue-50 text-blue-700'
                return (
                  <div key={factor.label} className="flex gap-4 relative py-4">
                    <div className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold z-10',
                      stepColor,
                    )}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-900">{factor.label}</span>
                        <span className="text-xs font-mono font-bold text-blue-600 tabular-nums">
                          {formatConfidence(factor.contribution)}
                        </span>
                      </div>
                      <Progress value={factor.contribution * 100} />
                      <p className="text-xs text-gray-500 leading-relaxed">{factor.note}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Input Data + Model Details (2-column) */}
      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
        {/* Input Data */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Input Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {narrateBaseReality(auditEntry.baseReality)}
            </p>
            <div className="flex flex-wrap gap-2">
              {auditEntry.baseReality.map((row) => (
                <span
                  key={row.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                >
                  <span className="text-gray-400 font-mono uppercase tracking-wider text-[10px]">{row.label}</span>
                  <span className="text-gray-700">{row.value}</span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Model Details */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Model Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Model</span>
              <span className="text-sm font-mono font-medium text-gray-900">{auditEntry.model.name} v{auditEntry.model.version}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Accuracy</span>
              <span className="text-sm font-semibold text-gray-900">{auditEntry.model.accuracy}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Confidence</span>
                <span className="text-sm font-bold text-gray-900">{formatConfidence(auditEntry.explanation.confidence)}</span>
              </div>
              <Progress value={auditEntry.explanation.confidence * 100} />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Data sources</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {auditEntry.dataSources.map((src) => (
                  <span key={src} className="inline-flex px-2.5 py-1 rounded-lg text-xs text-gray-600 border border-gray-200 bg-gray-50 font-mono">
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* The Outcome */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">The Outcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-base text-gray-700 leading-relaxed">
              {auditEntry.explanation.summary}
            </p>

            {/* Compliance */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your Regulatory Protections</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                {COMPLIANCE_INFO.map((reg) => (
                  <div key={reg.key} className="flex flex-col gap-1.5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{reg.label}</span>
                      {auditEntry.compliance[reg.key] && (
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Active</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 leading-relaxed">{reg.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Your Voice — Actions */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Your Voice</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => {
              const fab = document.querySelector<HTMLButtonElement>('[aria-label*="Talk to Money"]')
              if (fab) fab.click()
            }}
            className="rounded-2xl border border-gray-200 bg-card p-5 flex flex-col gap-3 hover:bg-gray-50 transition-colors cursor-pointer text-left shadow-sm"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 border border-violet-200">
              <MessageCircle size={18} className="text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">I disagree with this</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Talk to our AI about this decision and share your perspective.</p>
          </button>

          <button
            type="button"
            onClick={() => showToast({ message: 'Review request submitted', variant: 'success' })}
            className="rounded-2xl border border-gray-200 bg-card p-5 flex flex-col gap-3 hover:bg-gray-50 transition-colors cursor-pointer text-left shadow-sm"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 border border-blue-200">
              <RotateCcw size={18} className="text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Request review</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Ask for a human review of this automated decision.</p>
          </button>

          <button
            type="button"
            onClick={() => showToast({ message: 'Preparing download...', variant: 'info' })}
            className="rounded-2xl border border-gray-200 bg-card p-5 flex flex-col gap-3 hover:bg-gray-50 transition-colors cursor-pointer text-left shadow-sm"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200">
              <Download size={18} className="text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Download record</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Get a copy of this decision record for your files.</p>
          </button>
        </div>
      </motion.div>

      {/* Raw Data (JSON) */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setRawExpanded(!rawExpanded)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">Raw Data (JSON)</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500"
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard.writeText(JSON.stringify(auditEntry, null, 2))
                  showToast({ message: 'Copied to clipboard', variant: 'success' })
                }}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
              <ChevronDown size={16} className={cn('text-gray-400 transition-transform', rawExpanded && 'rotate-180')} />
            </div>
          </button>
          {rawExpanded && (
            <div className="border-t border-gray-200">
              <pre className="bg-gray-900 text-gray-300 p-6 text-xs font-mono overflow-x-auto max-h-96">
                {JSON.stringify(auditEntry, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Sealed footer */}
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 py-6 border-t border-gray-200">
        <Scale size={12} className="text-gray-300" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
          Permanently sealed on Poseidon immutable ledger · {auditEntry.id}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default GovernAuditDetail
