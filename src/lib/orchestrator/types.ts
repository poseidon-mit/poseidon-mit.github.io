/**
 * Orchestrator Workbench v2.0 — Core Type Definitions
 *
 * All interfaces and types for the Multi-Model Orchestrator WebUI.
 * Based on v2.0 Implementation Plan §1-§5.
 */

// ─── Engine & Use Case Primitives ─────────────────────────────────────────────

export type EngineName = 'dashboard' | 'protect' | 'grow' | 'execute' | 'govern'
export type UseCaseId =
  | 'UC-01' | 'UC-02' | 'UC-03' | 'UC-04' | 'UC-05'
  | 'UC-06' | 'UC-07' | 'UC-08' | 'UC-09' | 'UC-10'
export type TierLevel = 1 | 2 | 3
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

// ─── Bento Grid Types ─────────────────────────────────────────────────────────

export type BentoCardType =
  | 'kpi-metric'
  | 'trend-chart'
  | 'risk-heatmap'
  | 'approval-tracker'
  | 'ai-insight'
  | 'human-addon'
  | 'data-table'
  | 'action-queue'
  | 'audit-trail'
  | 'document-preview'
  | 'comparison-matrix'
  | 'simulation-result'

export interface BentoCardSpec {
  id: string
  type: BentoCardType
  colSpan: 1 | 2 | 3 | 4
  rowSpan: 1 | 2 | 3
  engine: EngineName
  dataSource?: DataSourceRef
  priority: number
}

export interface BentoLayoutSpec {
  columns: number
  cards: BentoCardSpec[]
  primaryEngine: EngineName
}

export interface DataSourceRef {
  id: string
  type: string
  label: string
}

// ─── Intent Types ─────────────────────────────────────────────────────────────

export interface ActionSpec {
  id: string
  label: string
  description: string
  riskLevel: RiskLevel
  engine: EngineName
  requiresApproval: boolean
}

export interface IntentResult {
  id: string
  rawInput: string
  engines: EngineName[]
  useCase: UseCaseId | null
  tier: TierLevel
  riskLevel: RiskLevel
  bentoLayout: BentoLayoutSpec
  requiredData: DataSourceRef[]
  suggestedActions: ActionSpec[]
  confidence: number
  resolvedAt: string
}

// ─── Proof-First Types ────────────────────────────────────────────────────────

export interface ProofBadge {
  type: 'ai-generated' | 'human-authored' | 'system-data' | 'external-sync'
  hash?: string
  verifiedAt: string
  source: string
  tamperDetected: boolean
}

export interface GovernScore {
  overall: number
  dimensions: {
    auditability: number
    explainability: number
    compliance: number
    humanOversight: number
  }
  computedAt: string
}

export const GOVERN_SCORE_THRESHOLDS = {
  excellent: 90,
  good: 70,
  needsAttention: 50,
} as const

export function getGovernScoreLabel(score: number): string {
  if (score >= GOVERN_SCORE_THRESHOLDS.excellent) return 'Excellent'
  if (score >= GOVERN_SCORE_THRESHOLDS.good) return 'Good'
  if (score >= GOVERN_SCORE_THRESHOLDS.needsAttention) return 'Needs Attention'
  return 'Critical'
}

export function getGovernScoreColor(score: number): string {
  if (score >= GOVERN_SCORE_THRESHOLDS.excellent) return 'var(--engine-protect)'
  if (score >= GOVERN_SCORE_THRESHOLDS.good) return 'var(--engine-govern)'
  if (score >= GOVERN_SCORE_THRESHOLDS.needsAttention) return 'var(--engine-execute)'
  return 'hsl(0 84% 60%)'
}

// ─── Friction-Right Types ─────────────────────────────────────────────────────

export type FrictionTier = 'transparent' | 'confirm' | 'verify' | 'multi-approve'

export type FrictionRequirement =
  | { type: 'none' }
  | { type: 'single-click-confirm' }
  | { type: 'passkey-auth' }
  | { type: 'intent-preview'; choices: 3 }
  | { type: 'four-eyes'; requiredApprovers: number }
  | { type: 'undo-window'; windowHours: 72 }

export interface FrictionPolicy {
  tier: FrictionTier
  riskLevel: RiskLevel
  requirements: FrictionRequirement[]
}

export const FRICTION_MATRIX: Record<RiskLevel, FrictionPolicy> = {
  low: {
    tier: 'transparent',
    riskLevel: 'low',
    requirements: [
      { type: 'none' },
      { type: 'undo-window', windowHours: 72 },
    ],
  },
  medium: {
    tier: 'confirm',
    riskLevel: 'medium',
    requirements: [
      { type: 'single-click-confirm' },
      { type: 'undo-window', windowHours: 72 },
    ],
  },
  high: {
    tier: 'verify',
    riskLevel: 'high',
    requirements: [
      { type: 'passkey-auth' },
      { type: 'intent-preview', choices: 3 },
      { type: 'undo-window', windowHours: 72 },
    ],
  },
  critical: {
    tier: 'multi-approve',
    riskLevel: 'critical',
    requirements: [
      { type: 'passkey-auth' },
      { type: 'intent-preview', choices: 3 },
      { type: 'four-eyes', requiredApprovers: 2 },
      { type: 'undo-window', windowHours: 72 },
    ],
  },
}

// ─── Approval Flow Types ──────────────────────────────────────────────────────

export interface ApprovalStep {
  id: string
  label: string
  status: 'completed' | 'in-progress' | 'pending' | 'rejected'
  assignee: {
    name: string
    role: string
    channel?: 'slack' | 'teams' | 'email'
  }
  completedAt?: string
  startedAt?: string
  estimatedDurationMinutes?: number
}

export interface ApprovalFlow {
  id: string
  actionId: string
  steps: ApprovalStep[]
  currentStepIndex: number
  createdAt: string
  deadline?: string
  undoWindowExpiresAt: string
}

// ─── Audit Trail Types ────────────────────────────────────────────────────────

export type AuditEventType =
  | 'INTENT_PARSED'
  | 'DATA_FETCHED'
  | 'AI_GENERATION'
  | 'AI_VERIFICATION'
  | 'HUMAN_REVIEW'
  | 'HUMAN_ADDON'
  | 'PASSKEY_AUTH'
  | 'APPROVAL_STEP'
  | 'ACTION_EXECUTED'
  | 'ACTION_UNDONE'
  | 'SESSION_START'
  | 'SESSION_END'
  | 'DATA_PURGE'

export interface AuditEvent {
  id: string
  timestamp: string
  type: AuditEventType
  actor: {
    type: 'system' | 'ai-model' | 'human'
    id: string
    label: string
  }
  payload: Record<string, unknown>
  hash: string
  previousHash: string
}

export interface AuditTranslation {
  eventId: string
  plainText: string
  model: string
  hash: string
  generatedAt: string
}

export interface HumanAddon {
  id: string
  eventId: string
  author: { email: string; name: string }
  content: string
  createdAt: string
  updatedAt: string
}

export interface SemanticAuditTrail {
  events: AuditEvent[]
  translations: AuditTranslation[]
  addons: HumanAddon[]
  chainValid: boolean
}

// ─── Theme Types ──────────────────────────────────────────────────────────────

export interface ThemeMode {
  mode: 'standard' | 'govern'
  primaryColor: string
  backgroundClass: string
  accentGlow: string
  auditTrailExpanded: boolean
}

// ─── Local-First Types ────────────────────────────────────────────────────────

export interface LocalFirstStatus {
  opfsAvailable: boolean
  encryptionKeyLoaded: boolean
  lastSyncAt: string | null
  pendingSyncCount: number
  isOffline: boolean
}

// ─── Workspace v4.0 re-export ────────────────────────────────────────────────
// Full workspace types live in workspace/workspace-types.ts.
// Re-export key types so consumers can import from either location.
export type {
  WorkspaceLayout,
  WorkspaceAction,
  DynamicSuggestionCard,
  BentoCardStreamingState,
  GenerativeUIControl,
  DecisionAutopsyData,
  UserContext,
  StreamingStatus,
} from '@/lib/orchestrator/workspace/workspace-types'

// ─── Workspace v5.0 re-export ────────────────────────────────────────────────
export type {
  AutonomyLevel,
  AutonomyConfig,
  AgentColorConfig,
  PinnedArtifact,
  ScopedCheckpoint,
  SandboxPreviewState,
  V5WorkspaceExtensions,
  V5WorkspaceAction,
} from '@/lib/orchestrator/workspace/v5/v5-types'

// ─── Workbench State ──────────────────────────────────────────────────────────

export interface BentoCardState {
  id: string
  type: BentoCardType
  loading: boolean
  error: string | null
  data: unknown
  lastUpdatedAt: string
  proofBadge: ProofBadge | null
  humanAddons: HumanAddon[]
}

export interface UndoableAction {
  id: string
  action: ActionSpec
  executedAt: string
  undoExpiresAt: string
  undone: boolean
  undoneAt?: string
}

export interface WorkbenchState {
  // Session
  sessionId: string
  userId: string
  startedAt: string

  // Intent
  currentIntent: IntentResult | null
  intentHistory: IntentResult[]

  // Bento Grid
  activeBentoLayout: BentoLayoutSpec | null
  cardStates: Record<string, BentoCardState>

  // Theme
  themeMode: ThemeMode

  // Friction
  pendingActions: ActionSpec[]
  activeApprovalFlows: ApprovalFlow[]
  undoableActions: UndoableAction[]

  // Audit
  auditTrail: SemanticAuditTrail

  // Local-First
  localFirstStatus: LocalFirstStatus

  // Govern
  governScore: GovernScore

  // Chat (v3.0)
  chatThread: ChatThread
  activeFrictionGate: ActiveFrictionGate | null

  // Workspace (v4.0)
  workspace: import('@/lib/orchestrator/workspace/workspace-types').WorkspaceLayout
}

// ─── Reducer Actions ──────────────────────────────────────────────────────────

export type WorkbenchAction =
  // Intent
  | { type: 'RESOLVE_INTENT'; intent: IntentResult }
  | { type: 'CLEAR_INTENT' }

  // Bento Grid
  | { type: 'SET_BENTO_LAYOUT'; layout: BentoLayoutSpec }
  | { type: 'UPDATE_CARD_STATE'; cardId: string; updates: Partial<BentoCardState> }
  | { type: 'ADD_HUMAN_ADDON'; cardId: string; addon: HumanAddon }

  // Theme
  | { type: 'SET_THEME_MODE'; mode: 'standard' | 'govern' }

  // Friction
  | { type: 'QUEUE_ACTION'; action: ActionSpec }
  | { type: 'EXECUTE_ACTION'; actionId: string }
  | { type: 'UNDO_ACTION'; actionId: string }
  | { type: 'START_APPROVAL_FLOW'; flow: ApprovalFlow }
  | { type: 'UPDATE_APPROVAL_STEP'; flowId: string; stepIndex: number; status: ApprovalStep['status'] }

  // Audit
  | { type: 'RECORD_AUDIT_EVENT'; event: AuditEvent }
  | { type: 'ADD_AUDIT_TRANSLATION'; translation: AuditTranslation }

  // Govern
  | { type: 'UPDATE_GOVERN_SCORE'; score: GovernScore }

  // Local-First
  | { type: 'UPDATE_LOCAL_FIRST_STATUS'; updates: Partial<LocalFirstStatus> }

  // Chat (v3.0)
  | { type: 'ADD_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'SET_CHAT_PROCESSING'; isProcessing: boolean }
  | { type: 'SET_FRICTION_GATE'; gate: ActiveFrictionGate }
  | { type: 'RESOLVE_FRICTION_GATE' }
  | { type: 'CLEAR_CHAT_THREAD' }

  // Workspace (v4.0)
  | import('@/lib/orchestrator/workspace/workspace-types').WorkspaceAction

  // Session
  | { type: 'LOAD_SESSION'; state: WorkbenchState }
  | { type: 'PURGE_SESSION' }

// ─── Chat Message Types ──────────────────────────────────────────────────────

export type ChatArtifactType =
  | BentoCardType
  | 'friction-gate'

export interface ChatArtifact {
  id: string
  type: ChatArtifactType
  title: string
  engine: EngineName
  data: unknown
  metadata?: {
    dataSource?: DataSourceRef
    confidence?: number
    proofBadge?: ProofBadge
    riskLevel?: RiskLevel
  }
}

export interface FrictionGateData {
  gateType: 'passkey' | 'approval' | 'preview' | 'confirm'
  title: string
  description: string
  intentId: string
  riskLevel: RiskLevel
  frictionTier: FrictionTier
  actionLabel: string
  cancelLabel: string
  resolved?: boolean
  resolvedAt?: string
}

export interface ChatMessage {
  id: string
  timestamp: string
  role: 'user' | 'assistant' | 'system'
  content: string
  artifact?: ChatArtifact | null
  intentId?: string
  auditEventId?: string
}

export interface ChatThread {
  messages: ChatMessage[]
  isProcessing: boolean
  error: string | null
}

export interface ActiveFrictionGate {
  id: string
  gateType: 'passkey' | 'approval' | 'preview' | 'confirm'
  intentId: string
  riskLevel: RiskLevel
  isResolved: boolean
  resolvedAt?: string
}

// ─── Tier UI Config ───────────────────────────────────────────────────────────

export interface TierUIConfig {
  showAiInsightCards: boolean
  showHumanAddonCards: boolean
  showAuditTrailInline: boolean
  commandPaletteMode: 'simple' | 'standard' | 'dialog'
}

export function getTierUIConfig(tier: TierLevel): TierUIConfig {
  switch (tier) {
    case 1:
      return {
        showAiInsightCards: false,
        showHumanAddonCards: false,
        showAuditTrailInline: false,
        commandPaletteMode: 'simple',
      }
    case 2:
      return {
        showAiInsightCards: true,
        showHumanAddonCards: true,
        showAuditTrailInline: false,
        commandPaletteMode: 'standard',
      }
    case 3:
      return {
        showAiInsightCards: true,
        showHumanAddonCards: true,
        showAuditTrailInline: true,
        commandPaletteMode: 'dialog',
      }
  }
}
