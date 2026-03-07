/**
 * Orchestrator Workbench v2.0 — Data Provenance Tag
 * Shows data source origin and freshness for each card.
 */

import { cn } from '@/lib/utils'
import type { DataSourceRef } from '@/lib/orchestrator/types'

export interface DataProvenanceTagProps {
  source: DataSourceRef
  lastUpdated?: string
  className?: string
}

export function DataProvenanceTag({ source, lastUpdated, className }: DataProvenanceTagProps) {
  const age = lastUpdated ? getAgeLabel(lastUpdated) : null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-[9px] font-mono text-white/30',
        className,
      )}
    >
      <span className="text-white/20">📡</span>
      <span>{source.label}</span>
      {age && (
        <>
          <span className="text-white/15">·</span>
          <span className={cn(age.stale ? 'text-amber-400/50' : 'text-white/25')}>
            {age.label}
          </span>
        </>
      )}
    </div>
  )
}

function getAgeLabel(lastUpdated: string): { label: string; stale: boolean } {
  const now = Date.now()
  const updated = new Date(lastUpdated).getTime()
  const diffMs = now - updated
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHrs = Math.floor(diffMs / 3_600_000)

  if (diffMin < 1) return { label: 'just now', stale: false }
  if (diffMin < 60) return { label: `${diffMin}m ago`, stale: diffMin > 30 }
  if (diffHrs < 24) return { label: `${diffHrs}h ago`, stale: diffHrs > 6 }
  return { label: `${Math.floor(diffHrs / 24)}d ago`, stale: true }
}
