/**
 * Orchestrator Workspace v5.0 — Provenance Tagger
 *
 * Tags streaming BentoCards with agent provenance metadata.
 * Attaches modelId from the streaming coordinator to card states
 * so AgentProvenanceBadge can render per-model neon borders and badges.
 */

import type { BentoCardStreamingState } from '@/lib/orchestrator/workspace/workspace-types'
import { getAgentColor } from './agent-registry'
import type { AgentColorConfig } from './v5-types'

// ─── Provenance Metadata ─────────────────────────────────────────────────────

export interface CardProvenance {
  modelId: string
  agentConfig: AgentColorConfig
  taggedAt: string
}

/**
 * Extract provenance metadata from a streaming card.
 * Returns null if no model ID is present in the card's streaming source.
 */
export function extractProvenance(
  card: BentoCardStreamingState,
): CardProvenance | null {
  // The streaming coordinator embeds modelId in the streamingSource field
  // Format: "model:gpt-4o" or "model:claude-sonnet-4-6" or just the label
  const source = card.streamingSource ?? ''

  // Try extracting from "model:" prefix
  if (source.startsWith('model:')) {
    const modelId = source.slice(6)
    return {
      modelId,
      agentConfig: getAgentColor(modelId),
      taggedAt: new Date().toISOString(),
    }
  }

  // Check if streamingSource itself is a known model ID
  const agentConfig = getAgentColor(source)
  if (agentConfig.modelId !== 'unknown') {
    return {
      modelId: source,
      agentConfig,
      taggedAt: new Date().toISOString(),
    }
  }

  // Heuristic: map card types to likely models based on DEFAULT_MODELS roles
  const cardTypeToModel: Record<string, string> = {
    'ai-insight': 'claude-sonnet-4-6',    // insight-generator
    'risk-heatmap': 'claude-opus-4-6',    // risk-assessor
    'trend-chart': 'gpt-4o-mini',         // translator (data processing)
    'simulation-result': 'gpt-4o',        // intent-parser / orchestrator
  }

  const inferredModel = cardTypeToModel[card.type]
  if (inferredModel) {
    return {
      modelId: inferredModel,
      agentConfig: getAgentColor(inferredModel),
      taggedAt: new Date().toISOString(),
    }
  }

  return null
}

/**
 * Tag a card with provenance. Returns updated streaming state metadata.
 * Does not mutate the original card — returns new partial state.
 */
export function tagCardWithProvenance(
  card: BentoCardStreamingState,
  modelId: string,
): Partial<BentoCardStreamingState> {
  return {
    streamingSource: `model:${modelId}`,
  }
}
