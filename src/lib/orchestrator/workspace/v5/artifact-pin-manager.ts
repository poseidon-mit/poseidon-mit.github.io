/**
 * Orchestrator Workspace v5.0 — Artifact Pin Manager
 *
 * Manages the lifecycle of pinned artifacts:
 *   - Pin: extract ChatArtifact from a chat message and mount in PinnedArtifactBento
 *   - Unpin: remove from persistent grid
 *   - Reorder: drag-reorder via index swap
 *   - Checkpoint: snapshot artifact data at pin time for scoped reversion
 */

import type { ChatArtifact } from '@/lib/orchestrator/types'
import type { PinnedArtifact, ScopedCheckpoint } from './v5-types'
import { getAgentColor } from './agent-registry'

// ─── Pin Operations ──────────────────────────────────────────────────────────

let pinCounter = 0

/**
 * Create a PinnedArtifact from a chat message's artifact.
 * Automatically creates a checkpoint at pin time.
 */
export function createPinnedArtifact(
  sourceMessageId: string,
  artifact: ChatArtifact,
  agentModelId: string,
  existingPinnedCount: number,
): PinnedArtifact {
  const id = `pin-${Date.now()}-${++pinCounter}`
  const now = new Date().toISOString()

  const checkpoint = createCheckpoint(id, artifact)

  return {
    id,
    sourceMessageId,
    artifact: structuredClone(artifact),
    pinnedAt: now,
    position: existingPinnedCount,
    agentModelId,
    checkpoint,
  }
}

/**
 * Remove a pinned artifact and re-index remaining positions.
 */
export function removePinnedArtifact(
  pinnedArtifacts: PinnedArtifact[],
  artifactId: string,
): PinnedArtifact[] {
  return pinnedArtifacts
    .filter((pa) => pa.id !== artifactId)
    .map((pa, idx) => ({ ...pa, position: idx }))
}

/**
 * Reorder pinned artifacts based on a new ID ordering.
 * Returns updated array with corrected position indices.
 */
export function reorderPinnedArtifacts(
  pinnedArtifacts: PinnedArtifact[],
  orderedIds: string[],
): PinnedArtifact[] {
  const byId = new Map(pinnedArtifacts.map((pa) => [pa.id, pa]))

  return orderedIds
    .map((id, idx) => {
      const pa = byId.get(id)
      if (!pa) return null
      return { ...pa, position: idx }
    })
    .filter((pa): pa is PinnedArtifact => pa !== null)
}

// ─── Checkpoint Operations ───────────────────────────────────────────────────

/**
 * Create a scoped checkpoint (snapshot) of an artifact's data at pin time.
 * Used by ScopedRevertButton to restore the artifact to its pinned state.
 */
export function createCheckpoint(
  artifactId: string,
  artifact: ChatArtifact,
): ScopedCheckpoint {
  return {
    id: `ckpt-${Date.now()}`,
    artifactId,
    snapshotData: structuredClone(artifact.data),
    createdAt: new Date().toISOString(),
    label: `Pinned: ${artifact.title || 'Untitled'}`,
  }
}

/**
 * Revert a pinned artifact to its checkpoint.
 * Returns the updated PinnedArtifact with restored data.
 */
export function revertToCheckpoint(
  pinnedArtifact: PinnedArtifact,
): PinnedArtifact | null {
  if (!pinnedArtifact.checkpoint) return null

  return {
    ...pinnedArtifact,
    artifact: {
      ...pinnedArtifact.artifact,
      data: structuredClone(pinnedArtifact.checkpoint.snapshotData),
    },
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Check if a given artifact is already pinned.
 */
export function isArtifactPinned(
  pinnedArtifacts: PinnedArtifact[],
  artifactId: string,
): boolean {
  return pinnedArtifacts.some(
    (pa) => pa.artifact.id === artifactId,
  )
}

/**
 * Infer agent model ID from artifact metadata or fallback.
 */
export function inferAgentModelId(artifact: ChatArtifact): string {
  // Check metadata for model info
  const meta = artifact.metadata as Record<string, unknown> | undefined
  if (meta?.modelId && typeof meta.modelId === 'string') {
    return meta.modelId
  }

  // Heuristic: map engine to likely model
  const engineToModel: Record<string, string> = {
    govern: 'claude-opus-4-6',
    protect: 'claude-sonnet-4-6',
    grow: 'gpt-4o',
    execute: 'gpt-4o',
    dashboard: 'gpt-4o-mini',
  }

  return engineToModel[artifact.engine] ?? 'unknown'
}
