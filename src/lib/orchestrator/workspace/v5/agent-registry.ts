/**
 * Orchestrator Workspace v5.0 — Agent Registry
 *
 * Parallel neon color palette for AI agent provenance.
 * These colors are SEPARATE from engine colors — no collision.
 *
 * Reads model metadata from DEFAULT_MODELS in model-adapter.ts.
 */

import type { AgentColorConfig } from './v5-types'

// ─── Agent Color Registry ────────────────────────────────────────────────────
// Parallel palette — deliberately avoids engine color hues

export const AGENT_COLOR_REGISTRY: Record<string, AgentColorConfig> = {
  'gpt-4o': {
    modelId: 'gpt-4o',
    displayName: 'GPT-4o',
    neonColor: '#FF6B35',
    cssVar: '--agent-gpt4o',
    neonClass: 'neon-glow-agent-gpt4o',
    badgeClass: 'badge-agent-gpt4o',
  },
  'gpt-4o-mini': {
    modelId: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    neonColor: '#14B8A6',
    cssVar: '--agent-gpt4o-mini',
    neonClass: 'neon-glow-agent-gpt4o-mini',
    badgeClass: 'badge-agent-gpt4o-mini',
  },
  'claude-sonnet-4-6': {
    modelId: 'claude-sonnet-4-6',
    displayName: 'Sonnet',
    neonColor: '#6366F1',
    cssVar: '--agent-sonnet',
    neonClass: 'neon-glow-agent-sonnet',
    badgeClass: 'badge-agent-sonnet',
  },
  'claude-opus-4-6': {
    modelId: 'claude-opus-4-6',
    displayName: 'Opus',
    neonColor: '#EC4899',
    cssVar: '--agent-opus',
    neonClass: 'neon-glow-agent-opus',
    badgeClass: 'badge-agent-opus',
  },
}

// ─── Deterministic Actors ────────────────────────────────────────────────────
// Non-frontier-model actors with dedicated visual treatment.
// These are NOT probabilistic AI — the badge should communicate "rule-based."

export const DETERMINISTIC_ACTOR_REGISTRY: Record<string, AgentColorConfig> = {
  'system-policy-engine': {
    modelId: 'system-policy-engine',
    displayName: 'Policy Engine',
    neonColor: '#F8FAFC',           // Near-white — institutional, deterministic
    cssVar: '--agent-policy-engine',
    neonClass: 'neon-glow-agent-policy',
    badgeClass: 'badge-agent-policy',
  },
}

// Fallback for unknown models
const UNKNOWN_AGENT: AgentColorConfig = {
  modelId: 'unknown',
  displayName: 'Agent',
  neonColor: '#94A3B8',
  cssVar: '--agent-unknown',
  neonClass: 'neon-glow-agent-unknown',
  badgeClass: 'badge-agent-unknown',
}

// ─── Accessors ───────────────────────────────────────────────────────────────

/**
 * Resolve agent color config for a given model ID.
 * Falls back to a neutral gray for unknown models.
 */
export function getAgentColor(modelId: string): AgentColorConfig {
  return AGENT_COLOR_REGISTRY[modelId] ?? DETERMINISTIC_ACTOR_REGISTRY[modelId] ?? UNKNOWN_AGENT
}

/**
 * Check if a modelId is a deterministic (non-probabilistic) actor.
 * UI should render these with a distinct visual treatment — monochrome/institutional,
 * not the neon glow used for frontier models.
 */
export function isDeterministicActor(modelId: string): boolean {
  return modelId in DETERMINISTIC_ACTOR_REGISTRY
}

/**
 * Get the neon glow CSS class for a model.
 */
export function getAgentNeonClass(modelId: string): string {
  return getAgentColor(modelId).neonClass
}

/**
 * Get the badge CSS class for a model.
 */
export function getAgentBadgeClass(modelId: string): string {
  return getAgentColor(modelId).badgeClass
}

/**
 * Get the display name for a model.
 */
export function getAgentDisplayName(modelId: string): string {
  return getAgentColor(modelId).displayName
}

/**
 * Get all registered agent colors (for populating the workspace agent registry).
 */
export function getAllAgentConfigs(): Record<string, AgentColorConfig> {
  return { ...AGENT_COLOR_REGISTRY }
}
