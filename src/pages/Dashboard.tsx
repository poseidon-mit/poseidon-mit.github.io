import { useMemo } from 'react'
import { useRouter } from '@/router'
import { motion } from 'framer-motion'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { useDemoState } from '@/lib/demo-state/provider'
import { getPendingExecuteCount } from '@/lib/demo-state/selectors'
import {
  selectCohortMetrics,
  selectDashboardView,
  selectExecuteActionsView,
  selectGovernAuditSummaryView,
  selectGovernAuditEntries,
} from '@/domain/poseidon-universe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { THREATS, severityConfig } from '@/pages/protect/protect-data'
import { useDismissedAlerts } from '@/pages/protect/useDismissedAlerts'
import { DashboardCoordinationProof } from '@/components/poseidon'
import { WelcomeDrawer } from '@/components/dashboard/WelcomeDrawer'
import type { EngineName } from '@/lib/engine-tokens'

/* ── Urgency sort helpers ── */

const URGENCY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

function expiryToHours(s: string | null | undefined): number {
  if (!s) return Infinity
  const match = s.match(/^(\d+)(h|d)$/)
  if (!match) return Infinity
  const n = Number(match[1])
  return match[2] === 'd' ? n * 24 : n
}


/* ═══════════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const prefersReducedMotion = useReducedMotionSafe()
  const motionPreset = getMotionPreset(prefersReducedMotion)
  const containerVariants = motionPreset.creatorStudioStaggerContainer
  const itemVariants = motionPreset.creatorStudioStaggerItem
  const { state } = useDemoState()
  usePageTitle('Dashboard')

  /* ── Data ── */
  const pendingCount = getPendingExecuteCount(state)
  const dashboardView = selectDashboardView(pendingCount)
  const { dismissed } = useDismissedAlerts()

  const activeThreats = useMemo(
    () => THREATS.filter((t) => !dismissed.has(t.id)),
    [dismissed],
  )
  const topThreats = useMemo(
    () =>
      [...activeThreats]
        .sort(
          (a, b) =>
            severityConfig[b.severity].order -
            severityConfig[a.severity].order,
        )
        .slice(0, 3),
    [activeThreats],
  )

  const allActions = useMemo(() => selectExecuteActionsView(), [])
  const sortedPendingActions = useMemo(
    () =>
      allActions
        .filter(
          (a) =>
            (state.execute.actionStates[a.id]?.status ?? 'pending') ===
            'pending',
        )
        .sort((a, b) => {
          const urgDiff = (URGENCY_ORDER[a.urgency] ?? 2) - (URGENCY_ORDER[b.urgency] ?? 2)
          if (urgDiff !== 0) return urgDiff
          return expiryToHours(a.expiresIn) - expiryToHours(b.expiresIn)
        }),
    [allActions, state.execute.actionStates],
  )
  const topPendingAction = sortedPendingActions[0] ?? null

  const { navigate } = useRouter()
  const cohort = selectCohortMetrics()
  const governSummary = useMemo(() => selectGovernAuditSummaryView(), [])
  const auditStreamEntries = useMemo(
    () => selectGovernAuditEntries().map((e) => ({
      id: e.id,
      type: e.type,
      action: e.action,
      confidence: e.confidence,
    })),
    [],
  )
  const topThreat = topThreats[0] ?? null

  const dominantEngine: EngineName =
    (topThreats.length > 0 && topThreats[0]?.severity === 'Critical') ? 'protect'
    : pendingCount > 3 ? 'execute'
    : 'grow'

  return (
    <div className="selection:bg-cyan-500/30">
      <motion.main
        id="main-content"
        className={PAGE_CONTENT_CLASS}
        style={PAGE_CONTENT_STYLE}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Coordination Proof Hero ── */}
        <motion.section variants={itemVariants} className="flex flex-col gap-6 mb-10">
          <DashboardCoordinationProof
            dominantEngine={dominantEngine}
            activeThreats={activeThreats.length}
            monthlySavings={dashboardView.monthlyOptimizationPotentialUsd}
            pendingActions={pendingCount}
            decisionsAudited={governSummary.total}
            decisionsVerified={governSummary.verified}
            recommendationCount={dashboardView.recommendationCount}
            criticalSignal={topThreat ? {
              id: topThreat.id,
              counterparty: topThreat.counterparty,
              amount: topThreat.amount,
              confidence: topThreat.confidence,
              severity: topThreat.severity,
            } : null}
            nextApproval={topPendingAction ? {
              id: topPendingAction.id,
              title: topPendingAction.title,
              amountLabel: topPendingAction.amountLabel,
              engine: topPendingAction.engine,
              urgency: topPendingAction.urgency,
            } : null}
            auditStreamEntries={auditStreamEntries}
            onReviewThreat={topThreat
              ? () => navigate(`/protect/alert-detail?alertId=${topThreat.id}`)
              : null}
            onReviewApproval={topPendingAction
              ? () => navigate(`/execute/approval?actionId=${topPendingAction.id}`)
              : null}
            onViewRecommendations={() => navigate('/grow/recommendations')}
            cohortAvgSavingsUsd={cohort.avgMonthlySavingsUsd}
          />
        </motion.section>

      </motion.main>

      <WelcomeDrawer />
    </div>
  )
}
