/**
 * Orchestrator Workspace v5.0 — Pin Artifact Button
 *
 * Appears on ChatArtifact bubbles inside the ChatDrawer.
 * Click dispatches PIN_ARTIFACT, which creates a PinnedArtifact
 * and mounts it in the PinnedArtifactBento grid.
 */

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { createPinnedArtifact, isArtifactPinned, inferAgentModelId } from '@/lib/orchestrator/workspace/v5/artifact-pin-manager'
import type { ChatArtifact } from '@/lib/orchestrator/types'

interface PinArtifactButtonProps {
  artifact: ChatArtifact
  sourceMessageId: string
  className?: string
}

export function PinArtifactButton({
  artifact,
  sourceMessageId,
  className,
}: PinArtifactButtonProps) {
  const { state, dispatch } = useWorkbenchContext()
  const pinnedArtifacts = state.workspace.v5?.pinnedArtifacts ?? []
  const isPinned = isArtifactPinned(pinnedArtifacts, artifact.id)

  const handlePin = useCallback(() => {
    if (isPinned) {
      // Find and unpin
      const existing = pinnedArtifacts.find((pa) => pa.artifact.id === artifact.id)
      if (existing) {
        dispatch({ type: 'UNPIN_ARTIFACT', artifactId: existing.id })
      }
      return
    }

    const agentModelId = inferAgentModelId(artifact)
    const pinned = createPinnedArtifact(
      sourceMessageId,
      artifact,
      agentModelId,
      pinnedArtifacts.length,
    )

    dispatch({ type: 'PIN_ARTIFACT', artifact: pinned })
  }, [dispatch, artifact, sourceMessageId, isPinned, pinnedArtifacts])

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handlePin}
      className={cn(
        'flex items-center justify-center w-7 h-7 rounded-md',
        'transition-colors',
        isPinned
          ? 'bg-cyan-400/15 text-cyan-400'
          : 'bg-white/[0.04] text-white/30 hover:text-white/60 hover:bg-white/[0.08]',
        className,
      )}
      title={isPinned ? 'ピン解除' : 'ベントーにピン留め'}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        {isPinned ? (
          // Filled pin icon
          <path
            d="M6 1L8.5 3.5L7.5 6L9 7.5H6.5L6 11L5.5 7.5H3L4.5 6L3.5 3.5L6 1Z"
            fill="currentColor"
          />
        ) : (
          // Outline pin icon
          <path
            d="M6 1L8.5 3.5L7.5 6L9 7.5H6.5L6 11L5.5 7.5H3L4.5 6L3.5 3.5L6 1Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </motion.button>
  )
}
