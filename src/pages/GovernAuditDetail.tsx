import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, Scale, Shield, TrendingUp, Zap } from 'lucide-react'
import { Link, useRouter } from '@/router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { getMotionPreset } from '@/lib/motion-presets'
import { formatDemoTimestamp } from '@/lib/demo-date'
import { AUDIT_DECISIONS, DEFAULT_DECISION_ID } from '@/lib/govern-audit-data'
import { cn } from '@/lib/utils'

const ENGINE_MAP = {
  Protect: { icon: Shield, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  Grow: { icon: TrendingUp, color: 'text-violet-700', bg: 'bg-violet-50' },
  Execute: { icon: Zap, color: 'text-amber-700', bg: 'bg-amber-50' },
  Govern: { icon: Scale, color: 'text-blue-700', bg: 'bg-blue-50' },
} as const

const DECISION_ID_ALIASES: Record<string, string> = {
  'LED-8092': 'GV-2026-0310-002',
}

function resolveDecision(id: string | null) {
  if (!id) return AUDIT_DECISIONS[DEFAULT_DECISION_ID]
  const normalized = DECISION_ID_ALIASES[id] ?? id
  return AUDIT_DECISIONS[normalized] ?? AUDIT_DECISIONS[DEFAULT_DECISION_ID]
}

function narrateBaseReality(baseReality: Array<{ label: string; value: string }>) {
  const fragments = baseReality.map((row) => `${row.label}: ${row.value}`)
  return fragments.join(' · ')
}

export function GovernAuditDetail() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { search } = useRouter()
  const decisionId = useMemo(() => {
    const params = new URLSearchParams(search)
    return params.get('auditId') ?? params.get('decision') ?? params.get('id')
  }, [search])
  const decision = useMemo(() => resolveDecision(decisionId), [decisionId])
  const engineInfo = ENGINE_MAP[decision.engine] ?? ENGINE_MAP.Govern
  const EngineIcon = engineInfo.icon

  usePageTitle('Audit Detail')

  return (
    <motion.main
      id="main-content"
      role="main"
      className="hero-viewport flex flex-col gap-6 pb-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <Link
          to="/govern/audit"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Audit Log
        </Link>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl shrink-0', engineInfo.bg)}>
                <EngineIcon className={cn('h-7 w-7', engineInfo.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Audit Record #{decision.id}</p>
                <h1 className="text-2xl font-bold text-gray-900">{decision.action}</h1>
                <p className="mt-1 text-sm text-gray-400">{formatDemoTimestamp(decision.timestamp)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn(engineInfo.bg, engineInfo.color)}>
                    {decision.engine}
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    Audit Record
                  </Badge>
                </div>
              </div>
              <div className="shrink-0 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-right">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Confidence</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{Math.round(decision.explanation.confidence * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Why This Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-700">{decision.explanation.summary}</p>
            <div className="space-y-3">
              {decision.topFactors.map((factor) => (
                <div key={factor.label} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-gray-900">{factor.label}</span>
                    <span className="text-xs font-mono font-semibold text-blue-700">
                      {Math.round(factor.contribution * 100)}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">{factor.note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Input Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-600">{narrateBaseReality(decision.baseReality)}</p>
            <div className="flex flex-wrap gap-2">
              {decision.baseReality.map((row) => (
                <span
                  key={row.label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs"
                >
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">{row.label}</span>
                  <span className="text-gray-700">{row.value}</span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Compliance Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'GDPR', enabled: decision.compliance.gdpr },
                { label: 'ECOA', enabled: decision.compliance.ecoa },
                { label: 'CCPA', enabled: decision.compliance.ccpa },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-900">{item.label}</span>
                    <span className={cn(
                      'text-[10px] font-bold uppercase tracking-wider',
                      item.enabled ? 'text-emerald-600' : 'text-amber-600',
                    )}>
                      {item.enabled ? 'Protected' : 'Review'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">
                    {item.enabled
                      ? 'Your rights are preserved for this decision.'
                      : 'Additional review is required.'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Eye className="h-5 w-5 text-blue-600" />
              Outcome
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-gray-700">{decision.coreAssertion}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.main>
  )
}

export default GovernAuditDetail
