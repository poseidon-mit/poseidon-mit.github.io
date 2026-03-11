import { useMemo } from 'react'
import { GovernHero } from '@/components/poseidon/govern-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import {
  selectGovernSummaryView,
  selectGovernEngineBreakdown,
  selectGovernAuditEntries,
  selectSpotlightAuditEntry,
} from '@/domain/poseidon-universe'
import { ENGINE_COLOR_MAP } from '@/lib/engine-color-map'
import { formatDemoTimestamp } from '@/lib/demo-date'

export default function GovernPage() {
  usePageTitle('Govern')
  const router = useRouter()

  const summary = useMemo(() => selectGovernSummaryView(), [])
  const breakdown = useMemo(() => selectGovernEngineBreakdown(), [])
  const rawEntries = useMemo(() => selectGovernAuditEntries(), [])

  // Map canonical entries to hero's expected shape (top 5)
  const auditEntries = useMemo(
    () =>
      rawEntries.slice(0, 5).map((e) => ({
        id: e.id,
        engine: e.type,
        engineColor:
          ENGINE_COLOR_MAP[e.type as keyof typeof ENGINE_COLOR_MAP] ??
          'var(--engine-govern)',
        action: e.action,
        confidence: e.confidence,
        time: formatDemoTimestamp(e.timestampIso),
        status: e.status,
        modelVersion: 'GPT-4o + Sonnet 3.5',
        topFactor: `${Math.round(e.confidence * 100)}% confidence`,
      })),
    [rawEntries],
  )

  // New props for "0 errors" design
  const statusBreakdown = useMemo(() => ({
    verified: summary.verifiedDecisions,
    pending: summary.pendingReviewDecisions,
    flagged: summary.flaggedDecisions,
  }), [summary])

  const trustGuarantees = useMemo(() => ({
    autoExecutionsWithoutConsent: 0,
    auditCoveragePercent: 100,
    llmTrainingOptOut: true,
  }), [])

  const spotlightEntry = useMemo(() => {
    const entry = selectSpotlightAuditEntry()
    if (!entry) return null
    return {
      id: entry.id,
      action: entry.action,
      status: entry.status,
      confidence: entry.confidence,
    }
  }, [])

  return (
    <div className="hero-viewport">
      <GovernHero
        decisionsAudited={summary.decisionsAuditedTotal}
        engineBreakdown={breakdown}
        auditEntries={auditEntries}
        errorCount={0}
        statusBreakdown={statusBreakdown}
        trustGuarantees={trustGuarantees}
        spotlightEntry={spotlightEntry}
      />
    </div>
  )
}
