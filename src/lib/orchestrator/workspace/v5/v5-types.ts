/**
 * Orchestrator Workspace v5.0 — Type Definitions
 *
 * Fluid Bento & Sandbox: Autonomy Dial, Agent Provenance,
 * Pin-to-Bento, Live Sandbox Preview, Scoped Reversions.
 *
 * All v5-specific types live here as a single source of truth.
 * Extended into WorkspaceLayout via optional `v5` field for backward compatibility.
 */

import type {
  EngineName,
  RiskLevel,
  ChatArtifact,
} from '@/lib/orchestrator/types'

// ─── Autonomy Dial ──────────────────────────────────────────────────────────

export type AutonomyLevel = 'copilot' | 'balanced' | 'autonomous'

export interface AutonomyConfig {
  level: AutonomyLevel
  /** 0.0 = no friction (only critical gates), 1.0 = full friction */
  frictionScale: number
  /** Whether chat drawer opens automatically on AI actions */
  chatAutoOpen: boolean
  /** UI density mode driven by autonomy level */
  uiDensity: 'comfortable' | 'compact'
}

export const DEFAULT_AUTONOMY_CONFIG: AutonomyConfig = {
  level: 'balanced',
  frictionScale: 0.5,
  chatAutoOpen: false,
  uiDensity: 'comfortable',
}

// ─── Agent Provenance ───────────────────────────────────────────────────────
// Parallel palette — agent neon colors separate from engine colors (no collision)

export interface AgentColorConfig {
  modelId: string
  displayName: string
  /** Agent-specific neon color hex */
  neonColor: string
  /** CSS custom property name, e.g. '--agent-gpt4o' */
  cssVar: string
  /** Neon glow class, e.g. 'neon-glow-agent-gpt4o' */
  neonClass: string
  /** Badge background class */
  badgeClass: string
}

// ─── Pinned Artifacts ───────────────────────────────────────────────────────

export interface PinnedArtifact {
  id: string
  /** ID of the ChatMessage this artifact was extracted from */
  sourceMessageId: string
  /** The artifact data (snapshot at pin time) */
  artifact: ChatArtifact
  pinnedAt: string
  /** Sort position in the pinned grid (0-indexed) */
  position: number
  /** Model that generated this artifact */
  agentModelId: string
  /** Single checkpoint created at pin time for scoped reversion */
  checkpoint: ScopedCheckpoint | null
}

export interface ScopedCheckpoint {
  id: string
  artifactId: string
  /** Snapshot of artifact.data at pin time */
  snapshotData: unknown
  createdAt: string
  label: string
}

// ─── Sandbox Preview ────────────────────────────────────────────────────────

export interface SandboxPreviewState {
  isOpen: boolean
  /** Self-contained HTML string rendered in sandboxed iframe */
  htmlContent: string
  lastRenderedAt: string
  /** Card IDs that contributed to the current preview */
  sourceCardIds: string[]
}

export const DEFAULT_SANDBOX_STATE: SandboxPreviewState = {
  isOpen: false,
  htmlContent: '',
  lastRenderedAt: '',
  sourceCardIds: [],
}

// ─── Combined v5 Extensions ─────────────────────────────────────────────────

export interface V5WorkspaceExtensions {
  autonomy: AutonomyConfig
  pinnedArtifacts: PinnedArtifact[]
  sandboxPreview: SandboxPreviewState
  agentRegistry: Record<string, AgentColorConfig>
}

export function createDefaultV5Extensions(): V5WorkspaceExtensions {
  return {
    autonomy: { ...DEFAULT_AUTONOMY_CONFIG },
    pinnedArtifacts: [],
    sandboxPreview: { ...DEFAULT_SANDBOX_STATE },
    agentRegistry: {},
  }
}

// ─── v5 Workspace Actions ───────────────────────────────────────────────────

export type V5WorkspaceAction =
  | { type: 'SET_AUTONOMY_LEVEL'; level: AutonomyLevel; config: AutonomyConfig }
  | { type: 'PIN_ARTIFACT'; artifact: PinnedArtifact }
  | { type: 'UNPIN_ARTIFACT'; artifactId: string }
  | { type: 'REORDER_PINNED'; orderedIds: string[] }
  | { type: 'UPDATE_SANDBOX_PREVIEW'; preview: Partial<SandboxPreviewState> }
  | { type: 'TOGGLE_SANDBOX_PREVIEW' }
  | { type: 'RECORD_ARTIFACT_CHECKPOINT'; artifactId: string; checkpoint: ScopedCheckpoint }
  | { type: 'REVERT_ARTIFACT'; artifactId: string }
