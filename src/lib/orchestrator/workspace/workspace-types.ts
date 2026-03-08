/**
 * Orchestrator Workspace v4.0 — Type Definitions
 *
 * Context-Aware Intent Workspace types.
 * Dynamic Suggestion Cards, Streaming States, Generative UI Controls,
 * Decision Autopsy, and Workspace Layout.
 */

import type {
  EngineName,
  RiskLevel,
  UseCaseId,
  BentoCardType,
  BentoCardState,
  DataSourceRef,
  AuditEvent,
  ProofBadge,
} from '@/lib/orchestrator/types'

import type { V5WorkspaceExtensions, V5WorkspaceAction } from './v5/v5-types'

// ─── User Context ────────────────────────────────────────────────────────────

export interface CalendarSignal {
  type: 'meeting' | 'deadline' | 'recurring'
  label: string
  timestamp: string
  relevantEngine?: EngineName
}

export interface UserContext {
  role: string
  fiscalQuarter: string          // e.g. 'Q1-2026'
  timezone: string               // IANA timezone
  recentActions: RecentAction[]
  calendarSignals: CalendarSignal[]
  department?: string
  riskProfile?: RiskLevel
}

export interface RecentAction {
  id: string
  useCaseId: UseCaseId
  label: string
  timestamp: string
  engine: EngineName
}

// ─── Dynamic Suggestion Cards ────────────────────────────────────────────────

export type SuggestionContextSource =
  | 'fiscal-quarter'
  | 'role-based'
  | 'recent-activity'
  | 'calendar-signal'
  | 'risk-alert'
  | 'follow-up'

export interface DynamicSuggestionCard {
  id: string
  icon: string                   // Lucide icon name
  label: string
  description: string
  confidence: number             // 0–1: how relevant this suggestion is
  engine: EngineName
  intentTemplate: string         // raw input for intent-parser
  contextSource: SuggestionContextSource
  priority: number               // sort order (lower = higher priority)
  useCaseId?: UseCaseId
}

// ─── Bento Card Streaming State ──────────────────────────────────────────────

export type StreamingStatus = 'idle' | 'skeleton' | 'streaming' | 'complete' | 'error'

export interface BentoCardStreamingState extends BentoCardState {
  streamingStatus: StreamingStatus
  confidence: number             // 0–1: sub-agent confidence score
  estimatedTimeRemainingMs: number
  streamingSource: string        // label of the data source being fetched
  partialData: unknown           // partial payload during streaming
  startedStreamingAt?: string
  completedStreamingAt?: string
}

// ─── Generative UI Controls ──────────────────────────────────────────────────

export type GenerativeControlType = 'slider' | 'toggle' | 'dropdown'

export interface GenerativeControlBase {
  id: string
  type: GenerativeControlType
  label: string
  linkedCardId: string           // which BentoCard this control modifies
  engine: EngineName
}

export interface GenerativeSliderControl extends GenerativeControlBase {
  type: 'slider'
  currentValue: number
  min: number
  max: number
  step: number
  unit: string                   // '%', '¥', 'days', etc.
  formatLabel?: (val: number) => string
}

export interface GenerativeToggleControl extends GenerativeControlBase {
  type: 'toggle'
  currentValue: boolean
  onLabel: string
  offLabel: string
}

export interface GenerativeDropdownControl extends GenerativeControlBase {
  type: 'dropdown'
  currentValue: string
  options: { value: string; label: string }[]
}

export type GenerativeUIControl =
  | GenerativeSliderControl
  | GenerativeToggleControl
  | GenerativeDropdownControl

// ─── Decision Autopsy ────────────────────────────────────────────────────────
// Strictly deterministic — NO generative text (compliance requirement)

export interface AutopsyDataSource {
  name: string
  fetchTimestamp: string
  recordCount: number
  status: 'fresh' | 'stale' | 'error'
  endpoint?: string
}

export interface AutopsyFormula {
  label: string
  expression: string             // human-readable formula
  inputs: Record<string, unknown>  // scalar, array, or nested object inputs
  output: number | string
}

export interface DecisionAutopsyData {
  cardId: string
  cardType: BentoCardType
  engine: EngineName
  dataSources: AutopsyDataSource[]
  formulas: AutopsyFormula[]
  auditEvents: AuditEvent[]
  rawInputs: Record<string, unknown>
  proofBadge: ProofBadge | null
  computedAt: string
}

// ─── Workspace Layout ────────────────────────────────────────────────────────

export interface WorkspaceLayout {
  activeSuggestions: DynamicSuggestionCard[]
  streamingCards: Record<string, BentoCardStreamingState>
  autopsyTarget: string | null    // cardId of the card being inspected
  chatDrawerOpen: boolean
  autopsyDrawerOpen: boolean
  userContext: UserContext | null
  generativeControls: Record<string, GenerativeUIControl[]>  // cardId → controls
  /** v5.0 extensions — null when v5 features are not initialized */
  v5: V5WorkspaceExtensions | null
}

// ─── Workspace Actions ───────────────────────────────────────────────────────

export type WorkspaceAction =
  | { type: 'SET_SUGGESTIONS'; suggestions: DynamicSuggestionCard[] }
  | { type: 'SET_CARD_STREAMING_STATE'; cardId: string; state: Partial<BentoCardStreamingState> }
  | { type: 'SET_AUTOPSY_TARGET'; cardId: string | null }
  | { type: 'TOGGLE_CHAT_DRAWER' }
  | { type: 'TOGGLE_AUTOPSY_DRAWER' }
  | { type: 'SET_WORKSPACE_LAYOUT'; layout: Partial<WorkspaceLayout> }
  | { type: 'UPDATE_GENERATIVE_CONTROL'; cardId: string; controlId: string; value: unknown }
  | { type: 'SET_USER_CONTEXT'; context: UserContext }
  | { type: 'SET_GENERATIVE_CONTROLS'; cardId: string; controls: GenerativeUIControl[] }
  // v5.0 actions
  | V5WorkspaceAction
