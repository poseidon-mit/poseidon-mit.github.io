/**
 * Workspace Flow Engine — orchestrates: suggestion click → intent → friction → parallel card streaming.
 *
 * Bridges the gap between suggestion-engine (proactive cards) and the existing
 * intent-parser + friction-matrix pipeline. Manages the full lifecycle:
 *   1. Accept a suggestion's intentTemplate
 *   2. Parse it through intent-parser.ts
 *   3. Evaluate friction (existing friction-matrix.ts)
 *   4. Dispatch Bento layout + initiate per-card streaming
 *   5. After completion, regenerate suggestions
 */

import type { IntentResult, WorkbenchAction, BentoCardSpec } from '@/lib/orchestrator/types'
import type {
  DynamicSuggestionCard,
  UserContext,
  BentoCardStreamingState,
} from './workspace-types'
import { parseIntent } from '@/lib/orchestrator/intent-parser'
import { getFrictionPolicy } from '@/lib/orchestrator/friction-matrix'
import { generateSuggestions, regenerateSuggestionsAfterAction } from './suggestion-engine'
import { streamCardData } from './streaming-coordinator'
import { generateId } from '@/lib/orchestrator/crypto'

// ─── Flow Result ────────────────────────────────────────────────────────────

export interface WorkspaceFlowResult {
  intent: IntentResult
  frictionRequired: boolean
  frictionTier: string
}

// ─── Primary Flow: Suggestion → Intent → Stream ─────────────────────────────

/**
 * Execute the full workspace flow when a user clicks a suggestion card.
 *
 * Steps:
 * 1. Parse the suggestion's intentTemplate into a full IntentResult
 * 2. Dispatch the resolved intent + bento layout to state
 * 3. Evaluate friction requirements
 * 4. If no blocking friction → initiate parallel card streaming
 * 5. Update suggestions after the flow completes
 */
export async function executeSuggestionFlow(
  suggestion: DynamicSuggestionCard,
  userContext: UserContext,
  dispatch: (action: WorkbenchAction) => void,
): Promise<WorkspaceFlowResult> {
  // Step 1: Parse the intent template
  const intent = await parseIntent(suggestion.intentTemplate)

  // Step 2: Dispatch intent + layout
  dispatch({ type: 'RESOLVE_INTENT', intent })
  dispatch({ type: 'SET_BENTO_LAYOUT', layout: intent.bentoLayout })

  // Step 3: Record audit event
  dispatch({
    type: 'RECORD_AUDIT_EVENT',
    event: {
      id: generateId(),
      timestamp: new Date().toISOString(),
      type: 'INTENT_PARSED',
      actor: { type: 'system', id: 'workspace-flow', label: 'Workspace Flow Engine' },
      payload: {
        rawInput: suggestion.intentTemplate,
        engines: intent.engines,
        useCase: intent.useCase,
        confidence: intent.confidence,
        source: 'suggestion-card',
        suggestionId: suggestion.id,
      },
      hash: generateId(), // simplified — real implementation uses audit-chain
      previousHash: '',
    },
  })

  // Step 4: Check friction requirements
  const frictionPolicy = getFrictionPolicy(intent.riskLevel)
  const frictionRequired =
    frictionPolicy.tier === 'verify' || frictionPolicy.tier === 'multi-approve'

  // Step 5: If no blocking friction, start streaming
  if (!frictionRequired) {
    await initiateCardStreaming(intent, dispatch)
  } else {
    // Set friction gate — streaming deferred until resolved
    dispatch({
      type: 'SET_FRICTION_GATE',
      gate: {
        id: generateId(),
        gateType: frictionPolicy.tier === 'multi-approve' ? 'approval' : 'passkey',
        intentId: intent.id,
        riskLevel: intent.riskLevel,
        isResolved: false,
      },
    })
  }

  // Step 6: Regenerate suggestions
  const newSuggestions = regenerateSuggestionsAfterAction(
    userContext,
    suggestion.intentTemplate,
  )
  dispatch({ type: 'SET_SUGGESTIONS', suggestions: newSuggestions })

  return {
    intent,
    frictionRequired,
    frictionTier: frictionPolicy.tier,
  }
}

/**
 * Resume streaming after friction is resolved.
 */
export async function resumeAfterFriction(
  intent: IntentResult,
  dispatch: (action: WorkbenchAction) => void,
): Promise<void> {
  dispatch({ type: 'RESOLVE_FRICTION_GATE' })
  await initiateCardStreaming(intent, dispatch)
}

// ─── Parallel Card Streaming ────────────────────────────────────────────────

/**
 * Initiate independent streaming for all cards in the bento layout.
 * Each card streams in parallel with staggered start times for visual polish.
 */
async function initiateCardStreaming(
  intent: IntentResult,
  dispatch: (action: WorkbenchAction) => void,
): Promise<void> {
  const cards = intent.bentoLayout.cards

  // Initialize all cards to skeleton state
  for (const card of cards) {
    dispatch({
      type: 'SET_CARD_STREAMING_STATE',
      cardId: card.id,
      state: {
        id: card.id,
        type: card.type,
        loading: true,
        error: null,
        data: null,
        lastUpdatedAt: new Date().toISOString(),
        proofBadge: null,
        humanAddons: [],
        streamingStatus: 'skeleton',
        confidence: 0,
        estimatedTimeRemainingMs: 3000 + Math.random() * 2000,
        streamingSource: getStreamingSourceLabel(card),
        partialData: null,
        startedStreamingAt: new Date().toISOString(),
      },
    })
  }

  // Stream all cards in parallel with staggered delays
  const streamPromises = cards.map((card, index) =>
    streamCardWithStagger(card, index, intent, dispatch),
  )

  await Promise.allSettled(streamPromises)
}

async function streamCardWithStagger(
  card: BentoCardSpec,
  index: number,
  intent: IntentResult,
  dispatch: (action: WorkbenchAction) => void,
): Promise<void> {
  // Stagger start: 200ms between each card
  const staggerDelay = index * 200
  await delay(staggerDelay)

  try {
    await streamCardData(card, intent, (update) => {
      dispatch({
        type: 'SET_CARD_STREAMING_STATE',
        cardId: card.id,
        state: update,
      })

      // Also update the main card state when streaming completes
      if (update.streamingStatus === 'complete' && update.data !== undefined) {
        dispatch({
          type: 'UPDATE_CARD_STATE',
          cardId: card.id,
          updates: {
            loading: false,
            data: update.data,
            proofBadge: update.proofBadge ?? null,
          },
        })
      }
    })
  } catch (err) {
    dispatch({
      type: 'SET_CARD_STREAMING_STATE',
      cardId: card.id,
      state: {
        streamingStatus: 'error',
        confidence: 0,
        estimatedTimeRemainingMs: 0,
      },
    })
    dispatch({
      type: 'UPDATE_CARD_STATE',
      cardId: card.id,
      updates: {
        loading: false,
        error: err instanceof Error ? err.message : 'ストリーミングエラー',
      },
    })
  }
}

// ─── Initialize Workspace ───────────────────────────────────────────────────

/**
 * Initialize the workspace with context-aware suggestions.
 * Called once when the workspace mounts.
 */
export function initializeWorkspace(
  dispatch: (action: WorkbenchAction) => void,
  userContext: UserContext,
): void {
  dispatch({ type: 'SET_USER_CONTEXT', context: userContext })
  const suggestions = generateSuggestions(userContext)
  dispatch({ type: 'SET_SUGGESTIONS', suggestions })
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStreamingSourceLabel(card: BentoCardSpec): string {
  const sourceMap: Record<string, string> = {
    'kpi-metric': '基幹データベース',
    'trend-chart': '時系列データAPI',
    'risk-heatmap': 'リスク分析エンジン',
    'approval-tracker': '承認ワークフロー',
    'ai-insight': 'AIモデル推論',
    'data-table': 'データウェアハウス',
    'action-queue': 'アクションキュー',
    'audit-trail': '監査ログ',
    'document-preview': 'ドキュメントストア',
    'comparison-matrix': '比較分析エンジン',
    'simulation-result': 'シミュレーションAPI',
  }
  return sourceMap[card.type] ?? 'データソース'
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
