import { useMemo } from 'react'
import { GovernImmutableLedger } from '@/components/poseidon/govern-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import {
  selectGovernSummaryView,
  selectGovernEngineBreakdown,
  selectGovernAuditEntries,
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

  return (
    <div className="hero-viewport">
      <GovernImmutableLedger
        decisionsAudited={summary.decisionsAuditedTotal}
        engineBreakdown={breakdown}
        auditEntries={auditEntries}
      />
    </div>
  )
}
