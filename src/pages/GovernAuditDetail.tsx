import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Eye, Scale, Shield, TrendingUp, Zap } from 'lucide-react'
import { Link, useRouter } from '@/router'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { getMotionPreset } from '@/lib/motion-presets'
import { formatDemoTimestamp } from '@/lib/demo-date'
import { AUDIT_DECISIONS, DEFAULT_DECISION_ID } from '@/lib/govern-audit-data'
import { cn } from '@/lib/utils'

const ENGINE_MAP = {
  Protect: { icon: Shield, accent: 'var(--engine-protect)', label: 'Protect' },
  Grow: { icon: TrendingUp, accent: 'var(--engine-grow)', label: 'Grow' },
  Execute: { icon: Zap, accent: 'var(--engine-execute)', label: 'Execute' },
  Govern: { icon: Scale, accent: 'var(--engine-govern)', label: 'Govern' },
} as const

const DECISION_ID_ALIASES: Record<string, string> = {
  'LED-8092': 'GV-2026-0310-002',
}

function resolveDecision(id: string | null) {
  if (!id) return AUDIT_DECISIONS[DEFAULT_DECISION_ID]
  const normalized = DECISION_ID_ALIASES[id] ?? id
  return AUDIT_DECISIONS[normalized] ?? AUDIT_DECISIONS[DEFAULT_DECISION_ID]
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">{children}</p>
  )
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
  const confidencePct = Math.round(decision.explanation.confidence * 100)

  usePageTitle('Audit Detail')

  return (
    <motion.main
      id="main-content"
      role="main"
      className="hero-viewport flex flex-col gap-5 pb-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          to="/govern/audit"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
          Audit Ledger
        </Link>
      </motion.div>

      {/* Header card */}
      <motion.div variants={fadeUp}>
        <Panel className="px-6 py-6">
          <div className="flex items-start gap-5">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10"
              style={{
                color: engineInfo.accent,
                background: `color-mix(in srgb, ${engineInfo.accent} 14%, transparent)`,
              }}
            >
              <EngineIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-white/35">{decision.id}</p>
              <h1 className="mt-1 text-xl font-semibold text-white md:text-2xl">
                {decision.action}
              </h1>
              <p className="mt-2 text-sm text-white/40">
                {formatDemoTimestamp(decision.timestamp)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-medium"
                  style={{
                    color: engineInfo.accent,
                    borderColor: `color-mix(in srgb, ${engineInfo.accent} 30%, transparent)`,
                    background: `color-mix(in srgb, ${engineInfo.accent} 8%, transparent)`,
                  }}
                >
                  {decision.engine}
                </span>
                <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/50">
                  Audit Record
                </span>
              </div>
            </div>
            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                Confidence
              </p>
              <p
                className="mt-2 text-2xl font-semibold"
                style={{ color: engineInfo.accent }}
              >
                {confidencePct}%
              </p>
            </div>
          </div>
        </Panel>
      </motion.div>

      {/* Why This Decision */}
      <motion.div variants={fadeUp}>
        <Panel className="px-6 py-6">
          <SectionLabel>Why This Decision</SectionLabel>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {decision.explanation.summary}
          </p>
          <div className="mt-5 space-y-2.5">
            {decision.topFactors.map((factor) => {
              const pct = Math.round(factor.contribution * 100)
              return (
                <div
                  key={factor.label}
                  className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-white/80">
                      {factor.label}
                    </span>
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{ color: engineInfo.accent }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: engineInfo.accent,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/40">
                    {factor.note}
                  </p>
                </div>
              )
            })}
          </div>
        </Panel>
      </motion.div>

      {/* Input Data + Compliance */}
      <motion.div variants={fadeUp} className="grid gap-5 lg:grid-cols-2">
        <Panel className="px-6 py-6">
          <SectionLabel>Input Data</SectionLabel>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {decision.baseReality.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  {row.label}
                </p>
                <p className="mt-1.5 text-sm text-white/75">{row.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {decision.dataSources.map((src) => (
              <span
                key={src}
                className="rounded-lg border border-white/8 bg-white/[0.02] px-2.5 py-1 text-[10px] text-white/35"
              >
                {src}
              </span>
            ))}
          </div>
        </Panel>

        <Panel className="px-6 py-6">
          <SectionLabel>Compliance</SectionLabel>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(
              [
                { label: 'GDPR', enabled: decision.compliance.gdpr },
                { label: 'ECOA', enabled: decision.compliance.ecoa },
                { label: 'CCPA', enabled: decision.compliance.ccpa },
              ] as const
            ).map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center rounded-xl border border-white/8 bg-white/[0.02] px-4 py-4"
              >
                <CheckCircle2
                  className={cn(
                    'h-5 w-5',
                    item.enabled
                      ? 'text-[var(--engine-protect)]'
                      : 'text-amber-500/70',
                  )}
                />
                <span className="mt-2 text-sm font-semibold text-white/80">
                  {item.label}
                </span>
                <span
                  className={cn(
                    'mt-1 text-[10px] font-bold uppercase tracking-wider',
                    item.enabled
                      ? 'text-[var(--engine-protect)]'
                      : 'text-amber-500/70',
                  )}
                >
                  {item.enabled ? 'Protected' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </motion.div>

      {/* Outcome */}
      <motion.div variants={fadeUp}>
        <Panel className="px-6 py-5">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 shrink-0" style={{ color: engineInfo.accent }} />
            <div>
              <SectionLabel>Outcome</SectionLabel>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {decision.coreAssertion}
              </p>
            </div>
          </div>
        </Panel>
      </motion.div>
    </motion.main>
  )
}

export default GovernAuditDetail
