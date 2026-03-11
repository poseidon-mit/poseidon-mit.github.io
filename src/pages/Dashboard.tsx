import { useMemo } from 'react'
import { DashboardCoordinationProof } from '@/components/poseidon/dashboard-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import {
  selectProtectThreats,
  selectRecommendationsSummary,
  selectExecuteActionsView,
  selectGovernSummaryView,
  selectGovernAuditEntries,
  selectSpotlightThreat,
  formatUsd,
} from '@/domain/poseidon-universe'

export default function Dashboard() {
  usePageTitle('Dashboard')
  const router = useRouter()

  const threats = useMemo(() => selectProtectThreats(), [])
  const recs = useMemo(() => selectRecommendationsSummary(), [])
  const actions = useMemo(() => selectExecuteActionsView(), [])
  const governSummary = useMemo(() => selectGovernSummaryView(), [])
  const auditEntries = useMemo(() => selectGovernAuditEntries(), [])
  const spotlight = useMemo(() => selectSpotlightThreat(), [])

  const totalMonthlySavings = useMemo(
    () => recs.reduce((sum, r) => sum + r.monthly, 0),
    [recs],
  )

  const criticalSignal = spotlight
    ? {
        id: spotlight.id,
        counterparty: spotlight.counterparty,
        amount: formatUsd(spotlight.amountUsd),
        confidence: spotlight.confidence,
        severity: spotlight.severity as 'Critical' | 'High' | 'Medium' | 'Low',
      }
    : null

  const topAction = actions[0] ?? null
  const nextApproval = topAction
    ? {
        id: topAction.id,
        title: topAction.title,
        amountLabel: topAction.amountLabel,
        engine: topAction.engine,
        urgency: topAction.urgency as 'high' | 'medium' | 'low',
      }
    : null

  const auditStreamEntries = auditEntries.slice(0, 8).map((e) => ({
    id: e.id,
    type: e.type,
    action: e.action,
    confidence: e.confidence,
  }))

  return (
    <div className="hero-viewport">
      <DashboardCoordinationProof
        activeThreats={threats.length}
        monthlySavings={totalMonthlySavings}
        pendingActions={actions.length}
        decisionsAudited={governSummary.decisionsAuditedTotal}
        decisionsVerified={governSummary.verifiedDecisions}
        recommendationCount={recs.length}
        criticalSignal={criticalSignal}
        nextApproval={nextApproval}
        auditStreamEntries={auditStreamEntries}
        onReviewThreat={
          spotlight
            ? () => router.navigate(`/protect/alert-detail?alertId=${spotlight.id}`)
            : null
        }
        onReviewApproval={
          topAction
            ? () => router.navigate(`/execute/approval?actionId=${topAction.id}`)
            : null
        }
        onViewRecommendations={() => router.navigate('/grow/recommendations')}
      />
    </div>
  )
}
