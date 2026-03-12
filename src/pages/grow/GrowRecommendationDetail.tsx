import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Shield,
} from 'lucide-react'
import { Link, useRouter } from '@/router'
import { CountUp } from '@/components/poseidon'
import { ShapWaterfall } from '@/components/poseidon/shap-waterfall'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'

import { cn } from '@/lib/utils'
import { selectRecommendationListItems, formatUsd } from '@/domain/poseidon-universe'
import { recommendationDetails } from './recommendation-detail-data'
import type { RecommendationDetail } from './recommendation-detail-data'
import { useDemoState } from '@/lib/demo-state'
import { useToastContext } from '@/components/providers/ToastProvider'

/* ── Helpers ── */

/** Map GRW-XXX string id to canonical numeric id */
function grwIdToNumeric(grwId: string): number {
  const match = grwId.match(/GRW-(\d+)/)
  return match ? Number(match[1]) : -1
}

function getConfidenceLabel(c: number): string {
  if (c >= 0.85) return 'High Confidence'
  if (c >= 0.7) return 'Medium Confidence'
  return 'Low Confidence'
}

function getConfidenceBadgeClass(c: number): string {
  if (c >= 0.85) return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
  if (c >= 0.7) return 'border-amber-500/20 bg-amber-500/10 text-amber-400'
  return 'border-red-500/20 bg-red-500/10 text-red-400'
}

function getRiskLabel(c: number): string {
  if (c >= 0.85) return 'Low Risk'
  if (c >= 0.7) return 'Moderate Risk'
  return 'Higher Risk'
}

/* ── Before → After Panel ── */

function BeforeAfterPanel({ rec }: { rec: RecommendationDetail }) {
  const c = rec.comparison
  if (!c) return null

  if (c.kind === 'yield') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Before */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2">Before</p>
          <p className="text-sm font-medium text-muted-foreground">Chase Savings</p>
          <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-white/40 line-through">
            {c.currentApy}% APY
          </p>
          <p className="mt-1 font-mono tabular-nums text-sm text-white/40">$0.82/yr in interest</p>
        </div>
        {/* After */}
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-5 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400 mb-2">After</p>
          <p className="text-sm font-medium text-violet-400">High-Yield Savings</p>
          <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-violet-600">
            {c.newApy}% APY
          </p>
          <p className="mt-1 font-mono tabular-nums text-sm text-violet-600">$269.40/yr in interest</p>
        </div>
      </div>
    )
  }

  if (c.kind === 'allocation') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2">Current Allocation</p>
          <p className="font-mono text-sm text-muted-foreground">{c.currentMix}</p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-5 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400 mb-2">Recommended</p>
          <p className="font-mono text-sm font-semibold text-violet-400">{c.newMix}</p>
        </div>
      </div>
    )
  }

  if (c.kind === 'contribution') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Current</span>
          <span className="font-mono tabular-nums text-lg text-white/40">{c.currentPct}%</span>
        </div>
        <ArrowRight size={16} className="text-white/30" />
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Target</span>
          <span className="font-mono tabular-nums text-lg font-semibold text-violet-400">{c.newPct}%</span>
        </div>
        {c.matchCapture != null && (
          <div className="flex flex-col gap-1 items-end pl-4 border-l border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Match captured</span>
            <span className="font-mono tabular-nums text-lg font-bold text-emerald-600">+${c.matchCapture.toLocaleString()}/yr</span>
          </div>
        )}
      </div>
    )
  }

  // Default spend comparison
  if (rec.currentTotal === 0 && rec.newTotal === 0) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2">Before</p>
        <p className="font-mono tabular-nums text-2xl font-bold text-white/40 line-through">
          ${rec.currentTotal.toFixed(2)}/mo
        </p>
      </div>
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-5 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400 mb-2">After</p>
        <p className="font-mono tabular-nums text-2xl font-bold text-violet-400">
          ${rec.newTotal.toFixed(2)}/mo
        </p>
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
  const [whyOpen, setWhyOpen] = useState(true)
  const { state, decideRecommendation } = useDemoState()
  const { showToast } = useToastContext()

  // Resolve the GRW-XXX id from query params
  const grwId = useMemo(() => new URLSearchParams(search).get('id') ?? '', [search])

  // Find the matching data record from canonical summary
  const recSummary = useMemo(() => {
    const numericId = grwIdToNumeric(grwId)
    return selectRecommendationListItems().find(r => r.id === numericId)
  }, [grwId])

  // Find the matching canonical detail record
  const rec = useMemo(() => {
    const numericId = grwIdToNumeric(grwId)
    return recommendationDetails.find(r => r.id === numericId)
  }, [grwId])

  if (!rec || !recSummary) {
    navigate('/grow')
    return null
  }

  // Demo state decision
  const demoDecision = state.recommendations.decisions[grwId]
  const effectiveStatus = demoDecision
    ? demoDecision.decision === 'accepted'
      ? 'approved'
      : 'dismissed'
    : 'pending'

  const isDecided = effectiveStatus === 'approved' || effectiveStatus === 'dismissed'

  const handleAccept = () => {
    decideRecommendation(grwId, 'accepted')
    showToast({
      message: `Recommendation "${recSummary.title}" accepted`,
      variant: 'success',
    })
  }

  const handleDecline = () => {
    decideRecommendation(grwId, 'declined')
    showToast({
      message: `Recommendation "${recSummary.title}" declined`,
      variant: 'info',
    })
  }

  const confLabel = getConfidenceLabel(rec.confidence)
  const confBadgeClass = getConfidenceBadgeClass(rec.confidence)

  // Build the annual benefit text
  const benefitText = recSummary.annualSavings
    ? `Save ${formatUsd(recSummary.annualSavings)}`
    : null

  return (
    <div className="hero-viewport">
    <motion.div
      id="main-content"
      role="main"
      className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-6 pb-12"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Back link */}
      <motion.div variants={fadeUp}>
        <Link
          to="/grow"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Grow
        </Link>
      </motion.div>

      {/* Header: Badge, Title, Description */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card border-t-4 border-t-violet-500">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className={confBadgeClass}>
                <Shield className="mr-1 h-3 w-3" />
                {confLabel}
              </Badge>
              {effectiveStatus === 'approved' && (
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Approved
                </Badge>
              )}
              {effectiveStatus === 'dismissed' && (
                <Badge variant="outline" className="border-white/[0.06] bg-white/[0.02] text-muted-foreground">
                  <XCircle className="mr-1 h-3 w-3" />
                  Declined
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{recSummary.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{recSummary.description}</p>

            {/* Annual Benefit */}
            {benefitText && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-4 py-2">
                <span className="text-sm font-medium text-violet-400">Annual Benefit:</span>
                <span className="typo-hero-number text-2xl text-violet-400">
                  {benefitText}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Before → After Panel */}
      <motion.div variants={fadeUp}>
        <BeforeAfterPanel rec={rec} />
      </motion.div>

      {/* Action Buttons — above the fold */}
      {!isDecided && (
        <motion.div variants={fadeUp}>
          <Card className="border border-violet-500/20 bg-violet-500/10">
            <CardContent className="p-6">
              <p className="text-base font-semibold text-foreground mb-4">
                Do you want to proceed?
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="w-full sm:w-auto bg-violet-600 text-white hover:bg-violet-700 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] min-h-[48px] px-8 text-base font-semibold transition-all"
                  onClick={handleAccept}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Accept Recommendation
                </Button>
                <Button
                  variant="outline"
                  className="min-h-[44px] px-6 text-muted-foreground"
                  onClick={handleDecline}
                >
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {isDecided && (
        <motion.div variants={fadeUp}>
          <Card className={cn(
            'border',
            effectiveStatus === 'approved'
              ? 'border-emerald-500/20 bg-emerald-500/10'
              : 'border-white/[0.06] bg-white/[0.02]',
          )}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                {effectiveStatus === 'approved' ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <p className="text-sm font-medium text-emerald-400">
                      You accepted this recommendation
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                      You declined this recommendation
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Collapsible "Why this was recommended" — default CLOSED */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => setWhyOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.04]"
          >
            <span className="text-sm font-semibold text-foreground">Why this was recommended</span>
            {!whyOpen && rec.factors[0] && (
              <span className="text-xs text-white/30 ml-2 hidden sm:inline">— {rec.factors[0]}</span>
            )}
            <ChevronDown
              size={16}
              className={cn('text-white/40 transition-transform', whyOpen && 'rotate-180')}
            />
          </button>
          <AnimatePresence>
            {whyOpen && (
              <motion.div
                variants={accordionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={accordionTransition}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 border-t border-white/[0.06] space-y-5">
                  {/* Decision driver bars using SHAP Waterfall */}
                  <div className="pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                      SHAP Explainability Factors
                    </h4>
                    <div className="space-y-3">
                      <ShapWaterfall
                        factors={rec.factors.map((factor, i) => ({
                          name: factor,
                          value: Math.max(0.9 - i * 0.2, 0.1) // Mocking SHAP impact values
                        }))}
                        baseValue={0.2}
                      />
                    </div>
                  </div>

                  {/* AI Reasoning Quote */}
                  <div className="border-l-4 border-violet-500 bg-violet-500/10 rounded-r-xl p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      &ldquo;{rec.cohortProof}&rdquo;
                    </p>
                  </div>

                  {/* Risk Level */}
                  <div className="flex items-center justify-between text-sm py-2 border-t border-white/[0.06]">
                    <span className="text-muted-foreground">Risk Level</span>
                    <Badge variant="outline" className={confBadgeClass}>
                      {getRiskLabel(rec.confidence)}
                    </Badge>
                  </div>

                  {/* Model Info */}
                  <div className="flex flex-wrap gap-4 text-xs text-white/40 pt-2 border-t border-white/[0.06]">
                    <span>Model: {rec.modelInfo.name} v{rec.modelInfo.version}</span>
                    <span>Accuracy: {(rec.modelInfo.accuracy * 100).toFixed(1)}%</span>
                  </div>

                  {/* Audit Trail Link */}
                  <div className="pt-2">
                    <Link
                      to="/govern/audit-detail?id=AUD-2026-0311-003"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      View Activity Log
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
    </div>
  )
}
