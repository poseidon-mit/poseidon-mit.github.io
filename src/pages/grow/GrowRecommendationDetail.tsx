import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Zap,
  CheckCircle2,
  ArrowRight,
  XCircle,
} from 'lucide-react'
import { useRouter } from '@/router'
import { SubPageNav, ConfidenceIndicator, CountUp } from '@/components/poseidon'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout'
import { cn } from '@/lib/utils'
import { recommendationDetails } from './recommendation-detail-data'
import type { ExecutionType, UsageLevel, ChangeAction, RecommendationDetail } from './recommendation-detail-data'

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
  reduce:    { label: 'Reduce',    color: '#F97316',               bg: 'rgba(249,115,22,0.12)' },
  eliminate: { label: 'Eliminate', color: 'var(--state-critical)',  bg: 'rgba(239,68,68,0.12)' },
}

const execLabels: Record<ExecutionType, { label: string; color: string; bg: string }> = {
  auto:        { label: 'Auto',      color: 'var(--state-healthy)',  bg: 'rgba(16,185,129,0.12)' },
  'semi-auto': { label: 'Semi-auto', color: 'var(--engine-govern)',  bg: 'rgba(59,130,246,0.12)' },
  manual:      { label: 'Manual',    color: 'var(--engine-execute)', bg: 'rgba(234,179,8,0.12)' },
  hybrid:      { label: 'Hybrid',    color: 'var(--engine-grow)',    bg: 'rgba(139,92,246,0.12)' },
}

/* ── Comparison Strip ── */

function ComparisonStrip({ rec }: { rec: RecommendationDetail }) {
  const kind = rec.comparison?.kind ?? 'spend'
  const c = rec.comparison

  const stripClass = 'flex items-center justify-between py-4 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]'

  if (kind === 'yield' && c) {
    return (
      <div className={stripClass}>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Current APY</span>
          <span className="text-lg font-mono text-white/50 tabular-nums line-through">{c.currentApy}%</span>
        </div>
        <ArrowRight size={16} className="text-white/20" />
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] uppercase tracking-wider text-white/40">New APY</span>
          <span className="text-lg font-mono font-semibold tabular-nums" style={{ color: 'var(--engine-grow)' }}>{c.newApy}%</span>
        </div>
        <div className="flex flex-col gap-1 items-end pl-4 border-l border-white/[0.08]">
          <span className="text-[10px] uppercase tracking-wider text-white/40">You earn</span>
          <span className="text-lg font-mono font-bold tabular-nums" style={{ color: 'var(--state-healthy)' }}>+${c.annualGain?.toLocaleString()}/yr</span>
        </div>
      </div>
    )
  }

  if (kind === 'contribution' && c) {
    return (
      <div className={stripClass}>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Current</span>
          <span className="text-lg font-mono text-white/50 tabular-nums">{c.currentPct}%</span>
        </div>
        <ArrowRight size={16} className="text-white/20" />
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Target</span>
          <span className="text-lg font-mono font-semibold tabular-nums" style={{ color: 'var(--engine-grow)' }}>{c.newPct}%</span>
        </div>
        <div className="flex flex-col gap-1 items-end pl-4 border-l border-white/[0.08]">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Match captured</span>
          <span className="text-lg font-mono font-bold tabular-nums" style={{ color: 'var(--state-healthy)' }}>+${c.matchCapture?.toLocaleString()}/yr</span>
        </div>
      </div>
    )
  }

  if (kind === 'allocation' && c) {
    return (
      <div className="flex flex-col gap-3 py-4 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Current allocation</span>
          <span className="text-sm font-mono text-white/50">{c.currentMix}</span>
        </div>
        <ArrowRight size={16} className="text-white/20 self-center rotate-90" />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Recommended allocation</span>
          <span className="text-sm font-mono font-semibold" style={{ color: 'var(--engine-grow)' }}>{c.newMix}</span>
        </div>
      </div>
    )
  }

  if (kind === 'coverage' && c) {
    return (
      <div className={stripClass}>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Current coverage</span>
          <span className="text-lg font-mono text-white/50 tabular-nums">{c.currentMonths} months</span>
        </div>
        <ArrowRight size={16} className="text-white/20" />
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Target coverage</span>
          <span className="text-lg font-mono font-semibold tabular-nums" style={{ color: 'var(--engine-grow)' }}>{c.targetMonths} months</span>
        </div>
      </div>
    )
  }

  // Default: spend comparison (only show if currentTotal or newTotal are non-zero)
  if (rec.currentTotal === 0 && rec.newTotal === 0 && rec.monthlySavings === 0) {
    return null
  }

  return (
    <div className={stripClass}>
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
  )
}

/* ── Page ── */

export default function GrowRecommendationDetailPage() {
  const { search, navigate } = useRouter()
  usePageTitle('Recommendation Detail')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const [projectionYears, setProjectionYears] = useState<3 | 5 | 10>(5)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const rec = useMemo(() => {
    const id = Number(new URLSearchParams(search).get('id'))
    return recommendationDetails.find(r => r.id === id)
  }, [search])

  if (!rec) {
    navigate('/grow')
    return null
  }

  const toggleSection = (id: string) => setExpandedSection(prev => prev === id ? null : id)

  return (
    <div className="relative min-h-screen w-full">

      <SubPageNav engine="grow" parentPath="/grow" parentLabel="Grow" currentLabel={rec.title} />

      <motion.div
        id="main-content"
        role="main"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 pb-12`}
        style={PAGE_CONTENT_STYLE}
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}
      >
        {/* ═══════════════════════════════════════════
            ZONE 1: SUMMARY CARD
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-2xl p-6 lg:p-8 flex flex-col gap-6">
            {/* Impact header */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-4xl md:text-5xl font-light tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                  <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">${rec.monthlySavings}</span>
                  <span className="text-lg text-white/40 font-normal">/mo</span>
                </p>
                <p className="text-xs text-white/40 font-mono">${rec.annualSavings.toLocaleString()}/year</p>
                {/* Projection calculator */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Projected</span>
                  {([3, 5, 10] as const).map((y) => (
                    <button
                      key={y}
                      onClick={() => setProjectionYears(y)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                        projectionYears === y
                          ? 'bg-[var(--engine-grow)]/20 text-[var(--engine-grow)] border border-[var(--engine-grow)]/30'
                          : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06]',
                      )}
                    >
                      {y}Y
                    </button>
                  ))}
                  <span className="text-lg font-mono font-semibold tabular-nums ml-2" style={{ color: 'var(--engine-grow)' }}>
                    <CountUp value={rec.monthlySavings * 12 * projectionYears} prefix="$" locale duration={600} />
                  </span>
                </div>
              </div>
              <h1 className={PAGE_HEADING_CLASS} style={PAGE_HEADING_STYLE}>
                {rec.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <ConfidenceIndicator value={rec.confidence} accentColor="var(--engine-grow)" format="percent" size="lg" />
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: execLabels[rec.executionType].color, background: execLabels[rec.executionType].bg }}
                >
                  {rec.executionType === 'auto' && <Zap size={10} />}
                  {execLabels[rec.executionType].label}
                </span>
              </div>
              <p className="text-xs text-white/40">{rec.dataBasis}</p>
            </div>

            {/* Before / After comparison — adapts to recommendation kind */}
            <ComparisonStrip rec={rec} />
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            ZONE 2: ACTION WIDGET
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6" style={{ borderTopWidth: 2, borderTopColor: 'var(--engine-grow)' }}>
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Recommended Action</h3>
              <p className="text-sm font-medium tracking-wide" style={{ color: 'var(--engine-grow)' }}>
                {rec.changes.length} changes · Save ${rec.monthlySavings}/mo
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {rec.steps.some(s => s.type === 'auto') && (
                <motion.button
                  type="button"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-default w-full sm:w-auto relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, var(--engine-grow), color-mix(in srgb, var(--engine-grow) 70%, white))',
                    color: 'var(--bg-oled)',
                    boxShadow: '0 0 24px rgba(139,92,246,0.3)',
                  }}
                >
                  <Zap size={14} /> Execute Strategy
                </motion.button>
              )}
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] text-white/70 cursor-default w-full sm:w-auto"
              >
                Add to Execute Queue <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 text-xs text-red-400/60 hover:text-red-400 transition-colors cursor-default py-1"
              >
                <XCircle size={12} /> Reject
              </button>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            ZONE 3: DETAILS ACCORDION
            ═══════════════════════════════════════════ */}
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer list-none text-white/40 hover:text-white/60 transition-colors py-2">
            <span className="text-xs font-semibold uppercase tracking-widest">Analysis & Transparency</span>
            <span className="text-xs text-white/30 group-open:rotate-180 transition-transform">▾</span>
          </summary>

          <div className="flex flex-col gap-4 mt-4">
            {/* Section 1: Current Situation */}
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('situation')}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">{rec.situationLabel}</span>
                <ChevronDown size={14} className={cn('text-white/30 transition-transform', expandedSection === 'situation' && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {expandedSection === 'situation' && (
                  <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                    <div className="px-5 pb-5 flex flex-col gap-4 border-t border-white/[0.06]">
                      <div className="flex flex-col gap-3 pt-4">
                        {rec.currentItems.map((item) => (
                          <div key={item.name} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 py-2 border-b border-white/[0.04] last:border-0">
                            <span
                              className="self-start sm:self-auto flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[80px] justify-center"
                              style={{ color: usageColors[item.usage].text, background: usageColors[item.usage].bg }}
                            >
                              {usageColors[item.usage].label}
                            </span>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white/90 font-medium">{item.name}</p>
                                {item.note && <p className="text-xs text-white/40 mt-0.5">{item.note}</p>}
                              </div>
                              {item.cost > 0 && (
                                <span className="text-sm font-mono text-white/60 tabular-nums flex-shrink-0">${item.cost.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {rec.currentTotal > 0 && (
                        <div className="flex items-center justify-between py-3 border-t border-white/[0.08]">
                          <span className="text-sm font-medium text-white/60">Current total</span>
                          <span className="text-lg font-mono font-semibold text-white/90 tabular-nums">${rec.currentTotal.toFixed(2)}<span className="text-xs text-white/40 font-normal">/mo</span></span>
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section 2: Recommended Changes */}
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('changes')}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Recommended Changes</span>
                <ChevronDown size={14} className={cn('text-white/30 transition-transform', expandedSection === 'changes' && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {expandedSection === 'changes' && (
                  <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                    <div className="px-5 pb-5 flex flex-col gap-4 border-t border-white/[0.06]">
                      <div className="flex flex-col gap-3 pt-4">
                        {rec.changes.map((change, i) => {
                          const badge = actionBadge[change.action]
                          return (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 py-2 border-b border-white/[0.04] last:border-0">
                              <span
                                className="self-start sm:self-auto flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[80px] justify-center"
                                style={{ color: badge.color, background: badge.bg }}
                              >
                                {badge.label}
                              </span>
                              <div className="flex items-center gap-3 flex-1 min-w-0">
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
                                  <span className="text-sm font-mono tabular-nums flex-shrink-0" style={{ color: 'var(--state-healthy)' }}>
                                    -${change.savings.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Steps */}
                      <div className="pt-4 border-t border-white/[0.06]">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Execution Steps</h4>
                        <div className="flex flex-col gap-3">
                          {rec.steps.map((step) => {
                            const exec = execLabels[step.type]
                            return (
                              <div key={step.step} className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-white/[0.12] bg-white/[0.04] flex items-center justify-center text-[10px] font-semibold text-white/50 tabular-nums">
                                  {step.step}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                    <p className="text-sm text-white/80">{step.title}</p>
                                    <span
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                                      style={{ color: exec.color, background: exec.bg }}
                                    >
                                      {step.type === 'auto' && <Zap size={8} />}
                                      {exec.label}
                                    </span>
                                  </div>
                                  <p className="text-xs text-white/40">{step.description}</p>
                                  {step.estimatedTime && <p className="text-[10px] text-white/30 mt-1">Estimated: {step.estimatedTime}</p>}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section 3: Market Alternatives */}
            {rec.alternatives.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-black/40 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('alternatives')}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Market Alternatives</span>
                  <ChevronDown size={14} className={cn('text-white/30 transition-transform', expandedSection === 'alternatives' && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {expandedSection === 'alternatives' && (
                    <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                      <div className="px-5 pb-5 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
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
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-medium text-white/90">{alt.name}</p>
                                {alt.recommended && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--engine-grow)', background: 'rgba(139,92,246,0.15)' }}>
                                    <CheckCircle2 size={9} /> Best for you
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/40 mt-0.5">{alt.note}</p>
                            </div>
                            <span className="text-sm font-mono text-white/60 tabular-nums flex-shrink-0">{alt.detail}</span>
                          </div>
                        ))}
                        <p className="text-[10px] text-white/30 mt-2">Rates as of {rec.ratesAsOf}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Section 4: Transparency */}
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('transparency')}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">How We Determined This</span>
                <ChevronDown size={14} className={cn('text-white/30 transition-transform', expandedSection === 'transparency' && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {expandedSection === 'transparency' && (
                  <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                    <div className="px-5 pb-5 flex flex-col gap-5 border-t border-white/[0.06] pt-4">
                      {/* Contributing factors */}
                      <div>
                        <h4 className="text-xs font-semibold text-white/40 mb-3">Contributing factors</h4>
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
                        <h4 className="text-xs font-semibold text-white/40 mb-3">Model details</h4>
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
                        <h4 className="text-xs font-semibold text-white/40 mb-2">Data sources</h4>
                        <div className="flex flex-wrap gap-2">
                          {rec.dataSources.map((ds) => (
                            <span key={ds} className="inline-flex px-2.5 py-1 rounded-lg text-[10px] text-white/50 border border-white/[0.06] bg-white/[0.02]">
                              {ds}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </details>

      </motion.div>
    </div>
  )
}
