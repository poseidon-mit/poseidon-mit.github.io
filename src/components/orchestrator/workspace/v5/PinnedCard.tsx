/**
 * Orchestrator Workspace v5.0 — Pinned Card
 *
 * Individual card in the PinnedArtifactBento grid.
 * Renders artifact content with:
 *   - Agent provenance badge (neon top-border + model label)
 *   - Scoped revert button (when checkpoint exists)
 *   - Unpin button (top-right)
 *   - Artifact title, engine, and timestamp
 */

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { getAgentColor } from '@/lib/orchestrator/workspace/v5/agent-registry'
import { ScopedRevertButton } from './ScopedRevertButton'
import type { PinnedArtifact } from '@/lib/orchestrator/workspace/v5/v5-types'

interface PinnedCardProps {
  pinnedArtifact: PinnedArtifact
}

export function PinnedCard({ pinnedArtifact }: PinnedCardProps) {
  const { dispatch } = useWorkbenchContext()
  const { artifact, agentModelId, checkpoint, pinnedAt } = pinnedArtifact
  const agentConfig = getAgentColor(agentModelId)

  const handleUnpin = useCallback(() => {
    dispatch({ type: 'UNPIN_ARTIFACT', artifactId: pinnedArtifact.id })
  }, [dispatch, pinnedArtifact.id])

  // Format the pinned timestamp
  const pinnedTime = new Date(pinnedAt).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Extract display value from artifact data
  const displayValue = extractValue(artifact.data)

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden',
        'bg-white/[0.02] border border-white/[0.06]',
        'transition-colors hover:bg-white/[0.04]',
        'cursor-grab active:cursor-grabbing',
      )}
    >
      {/* Agent neon top-border */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${agentConfig.neonColor}88, ${agentConfig.neonColor}, ${agentConfig.neonColor}88)`,
          boxShadow: `0 0 8px ${agentConfig.neonColor}40, 0 0 16px ${agentConfig.neonColor}15`,
        }}
      />

      {/* Card content */}
      <div className="p-3 pt-4">
        {/* Header row: title + unpin button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-medium text-white/70 truncate">
              {artifact.title || 'Untitled'}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-[9px] font-mono"
                style={{ color: agentConfig.neonColor }}
              >
                {agentConfig.displayName}
              </span>
              <span className="text-white/10 text-[8px]">•</span>
              <span className="text-[9px] text-white/25 font-mono">
                {artifact.engine}
              </span>
            </div>
          </div>

          {/* Unpin button */}
          <button
            onClick={handleUnpin}
            className={cn(
              'flex items-center justify-center w-5 h-5 rounded',
              'text-white/20 hover:text-white/50 hover:bg-white/[0.06]',
              'transition-colors',
            )}
            title="ピン解除"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path
                d="M1 1L7 7M7 1L1 7"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Display value */}
        {displayValue && (
          <div className="text-lg font-bold font-mono text-white/90 mb-1">
            {displayValue}
          </div>
        )}

        {/* Footer: timestamp + revert button */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
          <span className="text-[9px] text-white/20 font-mono">
            📌 {pinnedTime}
          </span>

          {checkpoint && (
            <ScopedRevertButton
              pinnedArtifact={pinnedArtifact}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractValue(data: unknown): string | null {
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if ('value' in d && d.value != null) return String(d.value)
    if ('score' in d && d.score != null) return String(d.score)
    if ('count' in d && d.count != null) return String(d.count)
    if ('summary' in d && typeof d.summary === 'string') return d.summary
  }
  return null
}
