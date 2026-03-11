import { useMemo } from 'react'
import { ExecuteHero } from '@/components/poseidon/execute-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import {
  selectExecuteActionsView,
  selectExecuteQueueStats,
  selectExecuteSavingsView,
} from '@/domain/poseidon-universe'
import { ENGINE_COLOR_MAP } from '@/lib/engine-color-map'
import type { ExecuteEngineName } from '@/domain/poseidon-universe'

export default function ExecutePage() {
  usePageTitle('Execute')
  const router = useRouter()

  const actions = useMemo(() => selectExecuteActionsView(), [])
  const stats = useMemo(() => selectExecuteQueueStats(), [])
  const savings = useMemo(() => selectExecuteSavingsView(), [])
  const featured = actions[0] ?? null

  // Compute engine source counts
  const engineSources = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of actions) {
      const engine = a.sourceEngine || a.engine
      counts[engine] = (counts[engine] || 0) + 1
    }
    return Object.entries(counts).map(([engine, count]) => ({
      engine: engine as ExecuteEngineName,
      count,
      color: ENGINE_COLOR_MAP[engine as keyof typeof ENGINE_COLOR_MAP] ?? 'var(--engine-execute)',
    }))
  }, [actions])

  // Compute agent steps from featured action
  const agentStepsCompleted = featured
    ? featured.steps.filter((s) => s.status === 'completed').length
    : 0
  const agentStepsTotal = featured ? featured.steps.length : 0

  return (
    <div className="hero-viewport">
      <ExecuteHero
        queueTotal={actions.length}
        urgentCount={stats.byUrgency.high}
        agentStepsCompleted={agentStepsCompleted}
        agentStepsTotal={agentStepsTotal}
        featuredAction={
          featured
            ? {
                id: featured.id,
                title: featured.title,
                amountLabel: featured.amountLabel,
                confidence: featured.confidence,
                engine: featured.engine,
                sourceEngine: featured.sourceEngine,
                expiresIn: featured.expiresIn,
                rollbackHours: featured.rollbackWindowHours ?? null,
                executionType: featured.executionType,
                riskTier: featured.riskTier,
              }
            : null
        }
        engineSources={engineSources}
        onReviewApproval={
          featured
            ? () => router.navigate(`/execute/approval?actionId=${featured.id}`)
            : null
        }
        urgencyBreakdown={stats.byUrgency}
        currentSavingsUsd={savings.currentMonthlySavingsUsd}
        potentialSavingsUsd={savings.potentialMonthlySavingsUsd}
      />
    </div>
  )
}
