import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { useRouter } from '@/router'
import { SubPageNav, ConfidenceIndicator } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout'
import { cn } from '@/lib/utils'
import { recommendationDetails } from './recommendation-detail-data'
import type { ExecutionType, UsageLevel, ChangeAction } from './recommendation-detail-data'

/* ── Helpers ── */

const usageColors: Record<UsageLevel, { bg: string; text: string; label: string }> = {
  high:   { bg: 'rgba(16,185,129,0.15)', text: 'var(--state-healthy)',  label: 'Active' },
  medium: { bg: 'rgba(59,130,246,0.15)', text: 'var(--engine-govern)',  label: 'Detected' },
  low:    { bg: 'rgba(234,179,8,0.15)',  text: 'var(--engine-execute)', label: 'Review' },
  none:   { bg: 'rgba(239,68,68,0.15)',  text: 'var(--state-critical)', label: 'Dormant' },
}

const actionBadge: Record<ChangeAction, { label: string; color: string; bg: string }> = {
  keep:      { label: 'Keep',      color: 'var(--state-healthy)',  bg: 'rgba(16,185,129,0.12)' },
  cancel:    { label: 'Cancel',    color: 'var(--state-critical)', bg: 'rgba(239,68,68,0.12)' },
  switch:    { label: 'Switch',    color: 'var(--engine-govern)',  bg: 'rgba(59,130,246,0.12)' },
  downgrade: { label: 'Downgrade', color: 'var(--engine-execute)', bg: 'rgba(234,179,8,0.12)' },
  increase:  { label: 'Increase',  color: 'var(--engine-grow)',    bg: 'rgba(139,92,246,0.12)' },
  open:      { label: 'Open',      color: 'var(--engine-grow)',    bg: 'rgba(139,92,246,0.12)' },
  reduce:    { label: 'Reduce',    color: '#F97316',               bg: 'rgba(249,115,22,0.12)' }, /* no engine token for orange */
  eliminate: { label: 'Eliminate', color: 'var(--state-critical)',  bg: 'rgba(239,68,68,0.12)' },
}

const execLabels: Record<ExecutionType, { label: string; color: string; bg: string }> = {
  auto:        { label: 'Auto',      color: 'var(--state-healthy)',  bg: 'rgba(16,185,129,0.12)' },
  'semi-auto': { label: 'Semi-auto', color: 'var(--engine-govern)',  bg: 'rgba(59,130,246,0.12)' },
  manual:      { label: 'Manual',    color: 'var(--engine-execute)', bg: 'rgba(234,179,8,0.12)' },
}

/* ── Page ── */

export default function GrowRecommendationDetailPage() {
  const { search, navigate } = useRouter()
  usePageTitle('Recommendation Detail')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const [transparencyOpen, setTransparencyOpen] = useState(false)

  const rec = useMemo(() => {
    const id = Number(new URLSearchParams(search).get('id'))
    return recommendationDetails.find(r => r.id === id)
  }, [search])

  if (!rec) {
    navigate('/grow')
    return null
  }

  return (
    <div className="relative min-h-screen w-full">


      <SubPageNav engine="grow" parentPath="/grow" parentLabel="Grow" currentLabel={rec.title} />

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-8 pb-12`}
        style={PAGE_CONTENT_STYLE}
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}
      >
        {/* ═══════════════════════════════════════════
            S1: IMPACT HEADER
            ═══════════════════════════════════════════ */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-4xl md:text-5xl font-light tabular-nums" style={{ color: 'var(--engine-grow)', fontFamily: 'var(--font-display)' }}>
                ${rec.monthlySavings}<span className="text-lg text-white/40 font-normal">/mo</span>
              </p>
              <p className="text-xs text-white/40 font-mono">${rec.annualSavings.toLocaleString()}/year</p>
            </div>
            <h1 className={PAGE_HEADING_CLASS} style={PAGE_HEADING_STYLE}>
              {rec.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {/* Confidence bar */}
              <ConfidenceIndicator value={rec.confidence} accentColor="var(--engine-grow)" format="percent" size="lg" />
              {/* Execution type badge */}
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ color: execLabels[rec.executionType].color, background: execLabels[rec.executionType].bg }}
              >
                {rec.executionType === 'auto' && <Zap size={10} />}
                {execLabels[rec.executionType].label}
              </span>
            </div>
            <p className="text-xs text-white/40">{rec.dataBasis}</p>
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            S2: YOUR CURRENT SITUATION
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant}>
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-6 md:p-8">
            <h2 className="section-label mb-6">{rec.situationLabel}</h2>

            {/* Current items */}
            <div className="flex flex-col gap-3 mb-6">
              {rec.currentItems.map((item) => (
                <div key={item.name} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                  {/* Usage indicator */}
                  <span
                    className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[60px] justify-center"
                    style={{ color: usageColors[item.usage].text, background: usageColors[item.usage].bg }}
                  >
                    {usageColors[item.usage].label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 font-medium">{item.name}</p>
                    {item.note && <p className="text-xs text-white/40 mt-0.5">{item.note}</p>}
                  </div>
                  {item.cost > 0 && (
                    <span className="text-sm font-mono text-white/60 tabular-nums">${item.cost.toFixed(2)}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Total */}
            {rec.currentTotal > 0 && (
              <div className="flex items-center justify-between py-3 border-t border-white/[0.08]">
                <span className="text-sm font-medium text-white/60">Current total</span>
                <span className="text-lg font-mono font-semibold text-white/90 tabular-nums">${rec.currentTotal.toFixed(2)}<span className="text-xs text-white/40 font-normal">/mo</span></span>
              </div>
            )}

            {/* Insights */}
            <div className="mt-6 flex flex-col gap-2">
              {rec.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl px-4 py-3 bg-[var(--engine-grow)]/[0.06] border border-[var(--engine-grow)]/[0.1]">
                  <span className="text-[var(--engine-grow)] mt-0.5 flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.3" /><path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            S3: RECOMMENDED ACTION
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant}>
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-6 md:p-8">
            <h2 className="section-label mb-6">Recommended Action</h2>

            {/* Changes list */}
            <div className="flex flex-col gap-3 mb-6">
              {rec.changes.map((change, i) => {
                const badge = actionBadge[change.action]
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                    <span
                      className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[70px] justify-center"
                      style={{ color: badge.color, background: badge.bg }}
                    >
                      {badge.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/90">{change.item}</p>
                      {(change.from || change.to) && (
                        <p className="text-xs text-white/40 mt-0.5">
                          {change.from && <span>{change.from}</span>}
                          {change.from && change.to && <span className="mx-1.5">→</span>}
                          {change.to && <span className="text-white/60">{change.to}</span>}
                        </p>
                      )}
                    </div>
                    {change.savings > 0 && (
                      <span className="text-sm font-mono tabular-nums" style={{ color: 'var(--state-healthy)' }}>
                        -${change.savings.toFixed(2)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Before / After comparison */}
            <div className="flex items-center justify-between py-4 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-white/40">Before</span>
                <span className="text-lg font-mono text-white/50 tabular-nums line-through">${rec.currentTotal.toFixed(2)}</span>
              </div>
              <ArrowRight size={16} className="text-white/20" />
              <div className="flex flex-col gap-1 items-end">
                <span className="text-[10px] uppercase tracking-wider text-white/40">After</span>
                <span className="text-lg font-mono font-semibold tabular-nums" style={{ color: 'var(--engine-grow)' }}>${rec.newTotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-1 items-end pl-4 border-l border-white/[0.08]">
                <span className="text-[10px] uppercase tracking-wider text-white/40">You save</span>
                <span className="text-lg font-mono font-bold tabular-nums" style={{ color: 'var(--state-healthy)' }}>${rec.monthlySavings}/mo</span>
              </div>
            </div>

            {/* Market alternatives */}
            {rec.alternatives.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Market alternatives considered</h3>
                <div className="flex flex-col gap-2">
                  {rec.alternatives.map((alt) => (
                    <div
                      key={alt.name}
                      className={cn(
                        'flex items-center gap-3 py-3 px-4 rounded-xl border transition-colors',
                        alt.recommended
                          ? 'border-[var(--engine-grow)]/30 bg-[var(--engine-grow)]/[0.04]'
                          : 'border-white/[0.06] bg-transparent'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white/90">{alt.name}</p>
                          {alt.recommended && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--engine-grow)', background: 'rgba(139,92,246,0.15)' }}>
                              <CheckCircle2 size={9} /> Best for you
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">{alt.note}</p>
                      </div>
                      <span className="text-sm font-mono text-white/60 tabular-nums flex-shrink-0">{alt.detail}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-white/30 mt-3">Rates as of {rec.ratesAsOf}</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            S4: TAKE ACTION
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant}>
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-6 md:p-8">
            <h2 className="section-label mb-6">Take Action</h2>

            <div className="flex flex-col gap-4">
              {rec.steps.map((step) => {
                const exec = execLabels[step.type]
                return (
                  <div key={step.step} className="flex gap-4">
                    {/* Step number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full border border-white/[0.12] bg-white/[0.04] flex items-center justify-center text-xs font-semibold text-white/50 tabular-nums">
                      {step.step}
                    </div>

                    <div className="flex-1 min-w-0 pb-4 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white/90">{step.title}</p>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: exec.color, background: exec.bg }}
                        >
                          {step.type === 'auto' && <Zap size={8} />}
                          {exec.label}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">{step.description}</p>
                      {step.estimatedTime && (
                        <p className="text-[10px] text-white/30 mt-1.5">Estimated: {step.estimatedTime}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA buttons (non-functional demo) */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/[0.06]">
              {rec.steps.some(s => s.type === 'auto') && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-default"
                  style={{
                    background: 'var(--engine-grow)',
                    color: 'var(--bg-oled)',
                  }}
                >
                  <Zap size={14} /> Execute Auto Steps
                </button>
              )}
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] text-white/70 cursor-default"
              >
                Add to Execute Queue <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            S5: TRANSPARENCY (Expandable Accordion)
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant}>
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 overflow-hidden">
            <button
              onClick={() => setTransparencyOpen(p => !p)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors hover:bg-white/[0.02]"
            >
              <h2 className="section-label">How we determined this</h2>
              {transparencyOpen ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
            </button>

            {transparencyOpen && (
              <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col gap-6 border-t border-white/[0.06]">
                {/* Contributing factors */}
                <div className="pt-6">
                  <h3 className="text-xs font-semibold text-white/40 mb-3">Contributing factors</h3>
                  <div className="flex flex-col gap-2">
                    {rec.factors.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--engine-grow)' }} />
                        <p className="text-xs text-white/60 leading-relaxed">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cohort proof */}
                <div className="rounded-xl px-4 py-3 bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-xs text-white/50 leading-relaxed">{rec.cohortProof}</p>
                </div>

                {/* Model info */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 mb-3">Model details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-white/30">Model</p>
                      <p className="text-white/60 font-mono">{rec.modelInfo.name} v{rec.modelInfo.version}</p>
                    </div>
                    <div>
                      <p className="text-white/30">Accuracy</p>
                      <p className="text-white/60 font-mono">{(rec.modelInfo.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-white/30">Audit ID</p>
                      <p className="text-white/60 font-mono">{rec.modelInfo.auditId}</p>
                    </div>
                    <div>
                      <p className="text-white/30">Data sources</p>
                      <p className="text-white/60">{rec.dataSources.length} sources</p>
                    </div>
                  </div>
                </div>

                {/* Data sources */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 mb-2">Data sources</h3>
                  <div className="flex flex-wrap gap-2">
                    {rec.dataSources.map((ds) => (
                      <span key={ds} className="inline-flex px-2.5 py-1 rounded-lg text-[10px] text-white/50 border border-white/[0.06] bg-white/[0.02]">
                        {ds}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

      </motion.div>
    </div>
  )
}
