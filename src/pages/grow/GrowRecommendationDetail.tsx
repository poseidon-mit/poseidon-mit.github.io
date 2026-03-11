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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMotionPreset, accordionVariants, accordionTransition } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { cn } from '@/lib/utils'
import { recommendations } from '@/data/recommendations'
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
  if (c >= 0.85) return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (c >= 0.7) return 'border-amber-200 bg-amber-50 text-amber-700'
  return 'border-red-200 bg-red-50 text-red-700'
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
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Before</p>
          <p className="text-sm font-medium text-gray-700">Chase Savings</p>
          <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-gray-400 line-through">
            {c.currentApy}% APY
          </p>
          <p className="mt-1 font-mono tabular-nums text-sm text-gray-400">$0.82/yr in interest</p>
        </div>
        {/* After */}
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-500 mb-2">After</p>
          <p className="text-sm font-medium text-violet-700">High-Yield Savings</p>
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
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Current Allocation</p>
          <p className="font-mono text-sm text-gray-600">{c.currentMix}</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-500 mb-2">Recommended</p>
          <p className="font-mono text-sm font-semibold text-violet-600">{c.newMix}</p>
        </div>
      </div>
    )
  }

  if (c.kind === 'contribution') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Current</span>
          <span className="font-mono tabular-nums text-lg text-gray-400">{c.currentPct}%</span>
        </div>
        <ArrowRight size={16} className="text-gray-300" />
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">Target</span>
          <span className="font-mono tabular-nums text-lg font-semibold text-violet-600">{c.newPct}%</span>
        </div>
        {c.matchCapture != null && (
          <div className="flex flex-col gap-1 items-end pl-4 border-l border-gray-200">
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Match captured</span>
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
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Before</p>
        <p className="font-mono tabular-nums text-2xl font-bold text-gray-400 line-through">
          ${rec.currentTotal.toFixed(2)}/mo
        </p>
      </div>
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-500 mb-2">After</p>
        <p className="font-mono tabular-nums text-2xl font-bold text-violet-600">
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
  const [whyOpen, setWhyOpen] = useState(false)
  const { state, decideRecommendation } = useDemoState()
  const { showToast } = useToastContext()

  // Resolve the GRW-XXX id from query params
  const grwId = useMemo(() => new URLSearchParams(search).get('id') ?? '', [search])

  // Find the matching data record from data/recommendations.ts
  const recSummary = useMemo(() => recommendations.find(r => r.id === grwId), [grwId])

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
    : recSummary.status

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
  const benefitText = recSummary.benefit
    ? `+${recSummary.benefit}`
    : recSummary.savings
      ? `Save ${recSummary.savings}`
      : null

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
          to="/grow"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Grow
        </Link>
      </motion.div>

      {/* Header: Badge, Title, Description */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card shadow-sm border-t-4 border-t-violet-600">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className={confBadgeClass}>
                <Shield className="mr-1 h-3 w-3" />
                {confLabel}
              </Badge>
              {effectiveStatus === 'approved' && (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Approved
                </Badge>
              )}
              {effectiveStatus === 'dismissed' && (
                <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-500">
                  <XCircle className="mr-1 h-3 w-3" />
                  Declined
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{recSummary.title}</h1>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{recSummary.description}</p>

            {/* Annual Benefit */}
            {benefitText && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-50 border border-violet-200 px-4 py-2">
                <span className="text-sm font-medium text-violet-700">Annual Benefit:</span>
                <span className="font-mono tabular-nums text-lg font-bold text-violet-600">
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
          <Card className="border border-violet-200 bg-violet-50/40 shadow-sm">
            <CardContent className="p-6">
              <p className="text-base font-semibold text-gray-900 mb-4">
                Do you want to proceed?
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-violet-600 text-white hover:bg-violet-700 min-h-[44px] px-6"
                  onClick={handleAccept}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Accept Recommendation
                </Button>
                <Button
                  variant="outline"
                  className="min-h-[44px] px-6 text-gray-700"
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
            'border shadow-sm',
            effectiveStatus === 'approved'
              ? 'border-emerald-200 bg-emerald-50/40'
              : 'border-gray-200 bg-gray-50/40',
          )}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                {effectiveStatus === 'approved' ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-700">
                      You accepted this recommendation
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-gray-500" />
                    <p className="text-sm font-medium text-gray-600">
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
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setWhyOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-sm font-semibold text-gray-700">Why this was recommended</span>
            <ChevronDown
              size={16}
              className={cn('text-gray-400 transition-transform', whyOpen && 'rotate-180')}
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
                <div className="px-5 pb-5 border-t border-gray-100 space-y-5">
                  {/* Decision driver bars */}
                  <div className="pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                      Key Factors
                    </h4>
                    <div className="space-y-3">
                      {rec.factors.map((factor, i) => {
                        // Weight visualization: first factor strongest
                        const weight = Math.max(90 - i * 20, 30)
                        return (
                          <div key={i} className="space-y-1">
                            <p className="text-sm text-gray-600">{factor}</p>
                            <div className="h-2 w-full rounded-full bg-gray-100">
                              <div
                                className="h-2 rounded-full bg-violet-500"
                                style={{ width: `${weight}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* AI Reasoning Quote */}
                  <div className="border-l-4 border-violet-500 bg-violet-50 rounded-r-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      &ldquo;{rec.cohortProof}&rdquo;
                    </p>
                  </div>

                  {/* Risk Level */}
                  <div className="flex items-center justify-between text-sm py-2 border-t border-gray-100">
                    <span className="text-gray-500">Risk Level</span>
                    <Badge variant="outline" className={confBadgeClass}>
                      {getRiskLabel(rec.confidence)}
                    </Badge>
                  </div>

                  {/* Model Info */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
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
  )
}
