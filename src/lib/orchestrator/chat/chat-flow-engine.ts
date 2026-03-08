/**
 * Chat Flow Engine — Orchestrates the full conversation cycle:
 *   user input → intent parse → friction eval → artifact build → AI response messages
 *
 * This is the bridge between the chat UI and the existing orchestrator subsystems.
 */

import type {
  ChatMessage,
  ChatArtifact,
  IntentResult,
  ActionSpec,
  ActiveFrictionGate,
  WorkbenchAction,
  FrictionTier,
} from '../types'
import { parseIntent } from '../intent-parser'
import { getFrictionPolicy, requiresApproval, requiresPasskey } from '../friction-matrix'
import { generateId } from '../crypto'
import { buildArtifactsForIntent, buildFrictionGateArtifact } from './artifact-builders'

// ─── Message Factories ──────────────────────────────────────────────────────

export function createUserMessage(content: string): ChatMessage {
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    role: 'user',
    content,
  }
}

export function createAssistantMessage(
  content: string,
  artifact?: ChatArtifact | null,
  intentId?: string,
): ChatMessage {
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    role: 'assistant',
    content,
    artifact: artifact ?? null,
    intentId,
  }
}

export function createSystemMessage(
  content: string,
  auditEventId?: string,
): ChatMessage {
  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    role: 'system',
    content,
    auditEventId,
  }
}

// ─── Narrative Generation ───────────────────────────────────────────────────

function buildIntentNarrative(intent: IntentResult): string {
  const engineNames = intent.engines.map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1),
  )
  const engineList = engineNames.join(' + ')
  const useCaseLabel = intent.useCase ?? 'general analysis'
  const confidencePct = Math.round(intent.confidence * 100)

  return [
    `I've analyzed your request and routed it to **${engineList}** engine${intent.engines.length > 1 ? 's' : ''}.`,
    ``,
    `**Use Case:** ${useCaseLabel} · **Risk Level:** ${intent.riskLevel} · **Confidence:** ${confidencePct}%`,
  ].join('\n')
}

function buildFrictionNarrative(action: ActionSpec, frictionTier: FrictionTier): string {
  const frictionLabels: Record<FrictionTier, string> = {
    transparent: 'auto-approved',
    confirm: 'one-click confirmation',
    verify: 'identity verification (passkey)',
    'multi-approve': 'multi-party approval',
  }
  return [
    `This action requires **${frictionLabels[frictionTier]}** due to its ${action.riskLevel} risk level.`,
    ``,
    `**Action:** ${action.label}`,
    `${action.description}`,
  ].join('\n')
}

// ─── Smart Suggestions ──────────────────────────────────────────────────────

export interface SmartSuggestion {
  id: string
  label: string
  prompt: string
  engine: string
}

export function generateSmartSuggestions(intent: IntentResult | null): SmartSuggestion[] {
  if (!intent) {
    // Default suggestions for fresh session
    return [
      {
        id: generateId(),
        label: 'Executive risk summary',
        prompt: 'Show me the executive risk summary across all engines',
        engine: 'dashboard',
      },
      {
        id: generateId(),
        label: 'AML threshold check',
        prompt: 'Run AML threshold compliance check',
        engine: 'protect',
      },
      {
        id: generateId(),
        label: 'Budget variance analysis',
        prompt: 'Analyze current budget overruns and variances',
        engine: 'grow',
      },
      {
        id: generateId(),
        label: 'Pending approvals',
        prompt: 'Show all pending approval workflows',
        engine: 'execute',
      },
    ]
  }

  // Context-aware suggestions based on current intent
  const suggestions: SmartSuggestion[] = []

  if (intent.riskLevel === 'high' || intent.riskLevel === 'critical') {
    suggestions.push({
      id: generateId(),
      label: 'Drill into risk factors',
      prompt: `Show detailed risk breakdown for ${intent.useCase ?? 'this analysis'}`,
      engine: 'protect',
    })
  }

  if (intent.suggestedActions.length > 0) {
    suggestions.push({
      id: generateId(),
      label: 'Execute recommended action',
      prompt: `Execute: ${intent.suggestedActions[0].label}`,
      engine: intent.suggestedActions[0].engine,
    })
  }

  suggestions.push({
    id: generateId(),
    label: 'View audit trail',
    prompt: 'Show the complete audit trail for this session',
    engine: 'govern',
  })

  suggestions.push({
    id: generateId(),
    label: 'New analysis',
    prompt: 'Start a new analysis',
    engine: 'dashboard',
  })

  return suggestions.slice(0, 4)
}

// ─── Main Flow Orchestrator ─────────────────────────────────────────────────

export interface ChatFlowResult {
  /** Dispatch actions to apply to workbench state in order */
  actions: WorkbenchAction[]
}

/**
 * Process a user message through the full orchestration pipeline:
 * 1. Parse intent
 * 2. Evaluate friction requirements
 * 3. Build artifacts
 * 4. Generate AI narrative messages
 */
export async function processChatInput(userInput: string): Promise<ChatFlowResult> {
  const actions: WorkbenchAction[] = []

  // 1. Add user message
  const userMsg = createUserMessage(userInput)
  actions.push({ type: 'ADD_CHAT_MESSAGE', message: userMsg })

  // 2. Set processing state
  actions.push({ type: 'SET_CHAT_PROCESSING', isProcessing: true })

  try {
    // 3. Parse intent
    const intent = await parseIntent(userInput)
    actions.push({ type: 'RESOLVE_INTENT', intent })

    // 4. System event: intent resolved
    actions.push({
      type: 'ADD_CHAT_MESSAGE',
      message: createSystemMessage(`Intent resolved → ${intent.useCase ?? 'general'} (${intent.riskLevel} risk)`),
    })

    // 5. Build narrative + first artifact
    const artifacts = buildArtifactsForIntent(intent)
    const narrative = buildIntentNarrative(intent)

    // Primary response with first artifact
    actions.push({
      type: 'ADD_CHAT_MESSAGE',
      message: createAssistantMessage(
        narrative,
        artifacts[0] ?? null,
        intent.id,
      ),
    })

    // Additional artifacts as follow-up messages
    for (let i = 1; i < artifacts.length; i++) {
      actions.push({
        type: 'ADD_CHAT_MESSAGE',
        message: createAssistantMessage('', artifacts[i], intent.id),
      })
    }

    // 6. Check friction for suggested actions
    for (const action of intent.suggestedActions) {
      const frictionPolicy = getFrictionPolicy(action.riskLevel)

      if (frictionPolicy.tier !== 'transparent') {
        // Build friction gate artifact
        const gateArtifact = buildFrictionGateArtifact(
          action,
          intent.id,
          frictionPolicy.tier,
        )
        const frictionMsg = buildFrictionNarrative(action, frictionPolicy.tier)

        actions.push({
          type: 'ADD_CHAT_MESSAGE',
          message: createAssistantMessage(frictionMsg, gateArtifact, intent.id),
        })

        // Set active friction gate
        actions.push({
          type: 'SET_FRICTION_GATE',
          gate: {
            id: gateArtifact.id,
            gateType: frictionPolicy.tier === 'multi-approve' ? 'approval'
              : frictionPolicy.tier === 'verify' ? 'passkey'
              : 'confirm',
            intentId: intent.id,
            riskLevel: action.riskLevel,
            isResolved: false,
          },
        })

        // Only one friction gate at a time
        break
      }
    }

    // 7. Update govern score
    actions.push({
      type: 'UPDATE_GOVERN_SCORE',
      score: {
        overall: Math.min(100, 85 + Math.round(intent.confidence * 10)),
        dimensions: {
          auditability: 90,
          explainability: Math.round(intent.confidence * 100),
          compliance: intent.riskLevel === 'critical' ? 70 : 85,
          humanOversight: intent.suggestedActions.some((a) => requiresApproval(a)) ? 95 : 80,
        },
        computedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    actions.push({
      type: 'ADD_CHAT_MESSAGE',
      message: createAssistantMessage(
        `I encountered an error processing your request. Please try rephrasing.\n\n\`${error instanceof Error ? error.message : 'Unknown error'}\``,
      ),
    })
  }

  // 8. Clear processing state
  actions.push({ type: 'SET_CHAT_PROCESSING', isProcessing: false })

  return { actions }
}

// ─── Welcome Message ────────────────────────────────────────────────────────

export function createWelcomeMessages(): ChatMessage[] {
  return [
    createAssistantMessage(
      [
        `**Poseidon AI Orchestrator** is ready.`,
        ``,
        `I coordinate five engines — Dashboard, Protect, Grow, Execute, and Govern — to analyze, verify, and act on your behalf.`,
        ``,
        `What would you like to investigate?`,
      ].join('\n'),
    ),
  ]
}
