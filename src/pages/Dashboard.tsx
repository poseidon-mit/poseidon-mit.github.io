import { useMemo } from 'react'
import { DashboardHero } from '@/components/poseidon/dashboard-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import { MOCK_NET_WORTH, MOCK_USER, MOCK_SPARKLINE_DATA } from '@/lib/mock-data'
import {
  selectProtectThreats,
  selectRecommendationsSummary,
  selectExecuteActionsView,
  selectGovernSummaryView,
  selectSpotlightThreat,
  selectSpotlightRecommendation,
  selectSpotlightAction,
  computeFinancialHealthScore,
  formatUsd,
} from '@/domain/poseidon-universe'

export default function Dashboard() {
  usePageTitle('Dashboard')
  const router = useRouter()

  const threats = useMemo(() => selectProtectThreats(), [])
  const recs = useMemo(() => selectRecommendationsSummary(), [])
  const actions = useMemo(() => selectExecuteActionsView(), [])
  const governSummary = useMemo(() => selectGovernSummaryView(), [])
  const spotlight = useMemo(() => selectSpotlightThreat(), [])
  const spotlightRec = useMemo(() => selectSpotlightRecommendation(), [])
  const spotlightAction = useMemo(() => selectSpotlightAction(), [])

  const totalMonthlySavings = useMemo(
    () => recs.reduce((sum, r) => sum + r.monthly, 0),
    [recs],
  )

  const { score, breakdown } = useMemo(
    () =>
      computeFinancialHealthScore({
        activeThreats: threats.length,
        totalThreats: 5,
        pendingActions: actions.length,
        totalActions: 6,
      }),
    [threats, actions],
  )

  const protectSignal = spotlight
    ? {
        threatCount: threats.length,
        topAmount: formatUsd(spotlight.amountUsd),
        topCounterparty: spotlight.counterparty,
        severity: spotlight.severity,
      }
    : threats.length > 0
      ? {
          threatCount: threats.length,
          topAmount: '',
          topCounterparty: '',
          severity: 'Medium',
        }
      : null

  const growSignal = spotlightRec
    ? {
        savingsPerMonth: totalMonthlySavings,
        recCount: recs.length,
        topTitle: spotlightRec.title,
      }
    : recs.length > 0
      ? {
          savingsPerMonth: totalMonthlySavings,
          recCount: recs.length,
          topTitle: '',
        }
      : null

  const executeSignal = spotlightAction
    ? {
        pendingCount: actions.length,
        topTitle: spotlightAction.title,
        topAmount: spotlightAction.amountLabel,
      }
    : actions.length > 0
      ? {
          pendingCount: actions.length,
          topTitle: '',
          topAmount: '',
        }
      : null

  return (
    <div className="hero-viewport">
      <DashboardHero
        userName={MOCK_USER.name}
        netWorth={MOCK_NET_WORTH.total}
        netWorthChange={MOCK_NET_WORTH.change}
        netWorthChangePercent={MOCK_NET_WORTH.changePercent}
        sparklineData={MOCK_SPARKLINE_DATA}
        healthScore={score}
        healthBreakdown={breakdown}
        protectSignal={protectSignal}
        growSignal={growSignal}
        executeSignal={executeSignal}
        decisionsAudited={governSummary.decisionsAuditedTotal}
        complianceScore={governSummary.complianceScore}
        onNavigate={(path) => router.navigate(path)}
      />
    </div>
  )
}
