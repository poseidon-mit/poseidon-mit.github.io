import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronDown,
  Zap,
  CheckCircle2,
  ArrowRight,
  XCircle,
  PiggyBank,
  TrendingUp,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { CountUp } from '@/components/poseidon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { cn } from '@/lib/utils'
import { recommendationDetails } from './recommendation-detail-data'
import type { ExecutionType, UsageLevel, ChangeAction, RecommendationDetail } from './recommendation-detail-data'

/* ── Light Theme Helpers ── */

const CATEGORY_ICON: Record<string, typeof PiggyBank> = {
  'Subscription Optimization': PiggyBank,
  'Savings Optimization': PiggyBank,
  'Debt Management': PiggyBank,
  'Spending Optimization': PiggyBank,
  'Tax Optimization': PiggyBank,
  'Portfolio Management': TrendingUp,
  'Retirement Planning': TrendingUp,
  'Investment Optimization': TrendingUp,
  'Risk Mitigation': Shield,
  'Emergency Fund': Shield,
}

const usageColors: Record<UsageLevel, { bg: string; text: string; label: string }> = {
  high:   { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Active' },
  medium: { bg: 'bg-blue-50',    text: 'text-blue-700',    label: 'Detected' },
  low:    { bg: 'bg-amber-50',   text: 'text-amber-700',   label: 'Review' },
  none:   { bg: 'bg-red-50',     text: 'text-red-700',     label: 'Dormant' },
}

const actionBadge: Record<ChangeAction, { label: string; color: string; bg: string }> = {
  keep:      { label: 'Keep',      color: 'text-emerald-700', bg: 'bg-emerald-50' },
  cancel:    { label: 'Cancel',    color: 'text-red-700',     bg: 'bg-red-50' },
  switch:    { label: 'Switch',    color: 'text-blue-700',    bg: 'bg-blue-50' },
  downgrade: { label: 'Downgrade', color: 'text-amber-700',   bg: 'bg-amber-50' },
  increase:  { label: 'Increase',  color: 'text-violet-700',  bg: 'bg-violet-50' },
  open:      { label: 'Open',      color: 'text-violet-700',  bg: 'bg-violet-50' },
  reduce:    { label: 'Reduce',    color: 'text-orange-700',  bg: 'bg-orange-50' },
  eliminate: { label: 'Eliminate', color: 'text-red-700',      bg: 'bg-red-50' },
}

const execLabels: Record<ExecutionType, { label: string; color: string; bg: string }> = {
  auto:        { label: 'Auto',      color: 'text-emerald-700', bg: 'bg-emerald-50' },
  'semi-auto': { label: 'Semi-auto', color: 'text-blue-700',    bg: 'bg-blue-50' },
  manual:      { label: 'Manual',    color: 'text-amber-700',   bg: 'bg-amber-50' },
  hybrid:      { label: 'Hybrid',    color: 'text-violet-700',  bg: 'bg-violet-50' },
}

const CONFIDENCE_LABEL: Record<string, string> = {
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
}

function getConfidenceLevel(c: number): string {
  if (c >= 0.85) return 'high'
  if (c >= 0.7) return 'medium'
  return 'low'
}

const CONFIDENCE_BADGE: Record<string, string> = {
  high: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-700',
  low: 'border-red-200 bg-red-50 text-red-700',
}

/* ── Comparison Strip (Light Theme) ── */

function ComparisonStrip({ rec }: { rec: RecommendationDetail }) {
  const kind = rec.comparison?.kind ?? 'spend'
  const c = rec.comparison

  const stripClass = 'flex items-center justify-between py-4 px-5 rounded-xl bg-gray-50 border border-gray-200'

  if (kind === 'yield' && c) {
    return (
      <div className={stripClass}>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Current APY</span>
          <span className="text-lg font-mono text-gray-400 tabular-nums line-through">{c.currentApy}%</span>
        </div>
        <ArrowRight size={16} className="text-gray-300" />
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">New APY</span>
          <span className="text-lg font-mono font-semibold text-violet-600 tabular-nums">{c.newApy}%</span>
        </div>
        <div className="flex flex-col gap-1 items-end pl-4 border-l border-gray-200">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">You earn</span>
          <span className="text-lg font-mono font-bold text-emerald-600 tabular-nums">+${c.annualGain?.toLocaleString()}/yr</span>
        </div>
      </div>
    )
  }

  if (kind === 'contribution' && c) {
    return (
      <div className={stripClass}>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Current</span>
          <span className="text-lg font-mono text-gray-400 tabular-nums">{c.currentPct}%</span>
        </div>
        <ArrowRight size={16} className="text-gray-300" />
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Target</span>
          <span className="text-lg font-mono font-semibold text-violet-600 tabular-nums">{c.newPct}%</span>
        </div>
        <div className="flex flex-col gap-1 items-end pl-4 border-l border-gray-200">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Match captured</span>
          <span className="text-lg font-mono font-bold text-emerald-600 tabular-nums">+${c.matchCapture?.toLocaleString()}/yr</span>
        </div>
      </div>
    )
  }

  if (kind === 'allocation' && c) {
    return (
      <div className="flex flex-col gap-3 py-4 px-5 rounded-xl bg-gray-50 border border-gray-200">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Current allocation</span>
          <span className="text-sm font-mono text-gray-500">{c.currentMix}</span>
        </div>
        <ArrowRight size={16} className="text-gray-300 self-center rotate-90" />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Recommended allocation</span>
          <span className="text-sm font-mono font-semibold text-violet-600">{c.newMix}</span>
        </div>
      </div>
    )
  }

  if (kind === 'coverage' && c) {
    return (
      <div className={stripClass}>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Current coverage</span>
          <span className="text-lg font-mono text-gray-400 tabular-nums">{c.currentMonths} months</span>
        </div>
        <ArrowRight size={16} className="text-gray-300" />
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Target coverage</span>
          <span className="text-lg font-mono font-semibold text-violet-600 tabular-nums">{c.targetMonths} months</span>
        </div>
      </div>
    )
  }

  // Default: spend comparison
  if (rec.currentTotal === 0 && rec.newTotal === 0 && rec.monthlySavings === 0) {
    return null
  }

  return (
    <div className={stripClass}>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wider text-gray-400">Before</span>
        <span className="text-lg font-mono text-gray-400 tabular-nums line-through">${rec.currentTotal.toFixed(2)}</span>
      </div>
      <ArrowRight size={16} className="text-gray-300" />
      <div className="flex flex-col gap-1 items-end">
        <span className="text-[10px] uppercase tracking-wider text-gray-400">After</span>
        <span className="text-lg font-mono font-semibold text-violet-600 tabular-nums">${rec.newTotal.toFixed(2)}</span>
      </div>
      <div className="flex flex-col gap-1 items-end pl-4 border-l border-gray-200">
        <span className="text-[10px] uppercase tracking-wider text-gray-400">You save</span>
        <span className="text-lg font-mono font-bold text-emerald-600 tabular-nums">${rec.monthlySavings}/mo</span>
      </div>
    </div>
  )
}

/* ── Page ── */

export default function GrowRecommendationDetailPage() {
  const { search, navigate } = useRouter()
  usePageTitle('Recommendation Detail')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
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
  const CategoryIcon = CATEGORY_ICON[rec.category] ?? PiggyBank
  const confLevel = getConfidenceLevel(rec.confidence)
  const exec = execLabels[rec.executionType]

  return (
    <motion.div
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 pb-12`}
      style={PAGE_CONTENT_STYLE}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          to="/grow/recommendations"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recommendations
        </Link>
      </motion.div>

      {/* Header Card */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 shrink-0">
                  <CategoryIcon className="h-7 w-7 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{rec.title}</h1>
                    <Badge variant="outline" className={CONFIDENCE_BADGE[confLevel]}>
                      {CONFIDENCE_LABEL[confLevel]}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{rec.category}</p>
                  <p className="text-xs text-gray-400 mt-1">{rec.dataBasis}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => navigate('/grow/recommendations')}
                >
                  Dismiss
                </Button>
                {rec.steps.some(s => s.type === 'auto') && (
                  <Button className="bg-violet-600 text-white hover:bg-violet-700">
                    <Zap className="mr-1.5 h-4 w-4" />
                    Execute Now
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary + Estimated Impact (2-column) */}
      <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2">
        {/* Summary */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rec.insights.map((insight, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">{insight}</p>
              ))}
              <ComparisonStrip rec={rec} />
            </div>
          </CardContent>
        </Card>

        {/* Estimated Impact */}
        <Card className="border-violet-200 bg-violet-50/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Estimated Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">
                  {rec.monthlySavings > 0 ? `+$${rec.annualSavings.toLocaleString()}` : 'Risk Optimization'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {rec.monthlySavings > 0 ? 'Annual Savings' : 'Portfolio Protection'}
                </p>
              </div>

              {/* Projection calculator */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {([3, 5, 10] as const).map((y) => (
                  <button
                    key={y}
                    onClick={() => setProjectionYears(y)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                      projectionYears === y
                        ? 'bg-violet-100 text-violet-700 border-violet-200'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300',
                    )}
                  >
                    {y}Y
                  </button>
                ))}
                {rec.monthlySavings > 0 && (
                  <span className="text-lg font-mono font-semibold text-violet-700 ml-2">
                    <CountUp value={rec.monthlySavings * 12 * projectionYears} prefix="$" locale duration={600} />
                  </span>
                )}
              </div>

              {/* Confidence */}
              <div className="space-y-2 pt-3 border-t border-violet-200/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Confidence</span>
                  <span className="font-semibold text-gray-900">{Math.round(rec.confidence * 100)}%</span>
                </div>
                <Progress value={rec.confidence * 100} />
              </div>

              {/* Execution type */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Execution</span>
                <Badge variant="outline" className={cn('text-xs', exec.bg, exec.color)}>
                  {exec.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Why AI Recommends This */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Why AI Recommends This</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Key Factors */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Factors</h4>
              <ul className="space-y-2">
                {rec.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                    <span className="text-sm text-gray-600 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Reasoning */}
            <div className="border-l-4 border-violet-500 bg-violet-50 rounded-r-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed italic">
                &ldquo;{rec.cohortProof}&rdquo;
              </p>
            </div>

            {/* Model info */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100">
              <span>Model: {rec.modelInfo.name} v{rec.modelInfo.version}</span>
              <span>Accuracy: {(rec.modelInfo.accuracy * 100).toFixed(1)}%</span>
              <span>Audit: {rec.modelInfo.auditId}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Execution Steps */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Execution Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rec.steps.map((step) => {
                const stepExec = execLabels[step.type]
                return (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                      {step.step}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-900">{step.title}</p>
                        <Badge variant="outline" className={cn('text-[10px]', stepExec.bg, stepExec.color)}>
                          {stepExec.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                      {step.estimatedTime && (
                        <p className="text-xs text-gray-400 mt-1">Estimated: {step.estimatedTime}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
              {rec.steps.some(s => s.type === 'auto') && (
                <Button className="bg-violet-600 text-white hover:bg-violet-700">
                  <Zap className="mr-1.5 h-4 w-4" />
                  Auto-execute with approval
                </Button>
              )}
              <Button variant="outline" className="text-gray-700">
                Manual execution
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Analysis (Collapsible) */}
      <motion.div variants={fadeUp} className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400">Detailed Analysis</h3>

        {/* Current Situation */}
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('situation')}
            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-sm font-semibold text-gray-700">{rec.situationLabel}</span>
            <ChevronDown size={16} className={cn('text-gray-400 transition-transform', expandedSection === 'situation' && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {expandedSection === 'situation' && (
              <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="flex flex-col gap-3 pt-4">
                    {rec.currentItems.map((item) => {
                      const usage = usageColors[item.usage]
                      return (
                        <div key={item.name} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 py-2 border-b border-gray-100 last:border-0">
                          <span className={cn('self-start sm:self-auto shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[80px] justify-center', usage.bg, usage.text)}>
                            {usage.label}
                          </span>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              {item.note && <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>}
                            </div>
                            {item.cost > 0 && (
                              <span className="text-sm font-mono text-gray-600 tabular-nums shrink-0">${item.cost.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {rec.currentTotal > 0 && (
                    <div className="flex items-center justify-between py-3 border-t border-gray-200 mt-3">
                      <span className="text-sm font-medium text-gray-500">Current total</span>
                      <span className="text-lg font-mono font-semibold text-gray-900 tabular-nums">
                        ${rec.currentTotal.toFixed(2)}<span className="text-xs text-gray-400 font-normal">/mo</span>
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Recommended Changes */}
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('changes')}
            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-sm font-semibold text-gray-700">Recommended Changes</span>
            <ChevronDown size={16} className={cn('text-gray-400 transition-transform', expandedSection === 'changes' && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {expandedSection === 'changes' && (
              <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="flex flex-col gap-3 pt-4">
                    {rec.changes.map((change, i) => {
                      const badge = actionBadge[change.action]
                      return (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 py-2 border-b border-gray-100 last:border-0">
                          <span className={cn('self-start sm:self-auto shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[80px] justify-center', badge.bg, badge.color)}>
                            {badge.label}
                          </span>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">{change.item}</p>
                              {(change.from || change.to) && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {change.from && <span>{change.from}</span>}
                                  {change.from && change.to && <span className="mx-1.5">→</span>}
                                  {change.to && <span className="text-gray-600">{change.to}</span>}
                                </p>
                              )}
                            </div>
                            {change.savings > 0 && (
                              <span className="text-sm font-mono text-emerald-600 tabular-nums shrink-0">
                                -${change.savings.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Market Alternatives */}
        {rec.alternatives.length > 0 && (
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('alternatives')}
              className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
            >
              <span className="text-sm font-semibold text-gray-700">Market Alternatives</span>
              <ChevronDown size={16} className={cn('text-gray-400 transition-transform', expandedSection === 'alternatives' && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {expandedSection === 'alternatives' && (
                <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-2">
                    {rec.alternatives.map((alt) => (
                      <div
                        key={alt.name}
                        className={cn(
                          'flex items-center gap-3 py-3 px-4 rounded-xl border transition-colors',
                          alt.recommended
                            ? 'border-violet-200 bg-violet-50'
                            : 'border-gray-200 bg-white',
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{alt.name}</p>
                            {alt.recommended && (
                              <Badge variant="outline" className="border-violet-200 bg-violet-100 text-violet-700 text-[10px]">
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Best for you
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{alt.note}</p>
                        </div>
                        <span className="text-sm font-mono text-gray-600 tabular-nums shrink-0">{alt.detail}</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-gray-400 mt-2">Rates as of {rec.ratesAsOf}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )}

        {/* Data Sources */}
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('transparency')}
            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-sm font-semibold text-gray-700">How We Determined This</span>
            <ChevronDown size={16} className={cn('text-gray-400 transition-transform', expandedSection === 'transparency' && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {expandedSection === 'transparency' && (
              <motion.div variants={accordionVariants} initial="hidden" animate="visible" exit="exit" transition={accordionTransition} className="overflow-hidden">
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Data sources</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.dataSources.map((ds) => (
                        <span key={ds} className="inline-flex px-2.5 py-1 rounded-lg text-xs text-gray-600 border border-gray-200 bg-gray-50">
                          {ds}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Risk Disclosure */}
      <motion.div variants={fadeUp}>
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-amber-800">Risk Disclosure</h4>
                <ul className="space-y-1.5">
                  <li className="text-sm text-amber-700">Market prices may change between analysis and execution</li>
                  <li className="text-sm text-amber-700">Past performance does not guarantee future results</li>
                  <li className="text-sm text-amber-700">Consult a financial advisor for your specific situation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
