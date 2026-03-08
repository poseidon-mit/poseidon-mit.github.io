/**
 * Orchestrator Workbench v2.0 — Global State Management
 * useReducer-based state with React Context for the entire workbench.
 */

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
  type Dispatch,
} from 'react'

import type {
  WorkbenchState,
  WorkbenchAction,
  BentoCardState,
  GovernScore,
  ActiveFrictionGate,
  BentoCardStreamingState,
} from '@/lib/orchestrator/types'
import type { WorkspaceLayout } from '@/lib/orchestrator/workspace/workspace-types'
import { THEME_STANDARD } from '@/lib/orchestrator/theme-tokens'
import { createEmptyTrail } from '@/lib/orchestrator/audit-chain'
import { generateId } from '@/lib/orchestrator/crypto'
import { createDefaultV5Extensions } from '@/lib/orchestrator/workspace/v5/v5-types'

// ─── Initial State ───────────────────────────────────────────────────────────

function createInitialState(): WorkbenchState {
  return {
    sessionId: generateId(),
    userId: 'demo-user',
    startedAt: new Date().toISOString(),

    currentIntent: null,
    intentHistory: [],

    activeBentoLayout: null,
    cardStates: {},

    themeMode: THEME_STANDARD,

    pendingActions: [],
    activeApprovalFlows: [],
    undoableActions: [],

    auditTrail: createEmptyTrail(),

    localFirstStatus: {
      opfsAvailable: false,
      encryptionKeyLoaded: false,
      lastSyncAt: null,
      pendingSyncCount: 0,
      isOffline: false,
    },

    governScore: {
      overall: 85,
      dimensions: {
        auditability: 90,
        explainability: 80,
        compliance: 85,
        humanOversight: 85,
      },
      computedAt: new Date().toISOString(),
    },

    chatThread: {
      messages: [],
      isProcessing: false,
      error: null,
    },
    activeFrictionGate: null,

    workspace: {
      activeSuggestions: [],
      streamingCards: {},
      autopsyTarget: null,
      chatDrawerOpen: false,
      autopsyDrawerOpen: false,
      userContext: null,
      generativeControls: {},
      v5: createDefaultV5Extensions(),
    },
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function workbenchReducer(
  state: WorkbenchState,
  action: WorkbenchAction,
): WorkbenchState {
  switch (action.type) {
    // ─── Intent ──────────────────────────────────────────────────────
    case 'RESOLVE_INTENT':
      return {
        ...state,
        currentIntent: action.intent,
        intentHistory: [action.intent, ...state.intentHistory].slice(0, 50),
      }

    case 'CLEAR_INTENT':
      return {
        ...state,
        currentIntent: null,
        activeBentoLayout: null,
        cardStates: {},
      }

    // ─── Bento Grid ──────────────────────────────────────────────────
    case 'SET_BENTO_LAYOUT': {
      const cardStates: Record<string, BentoCardState> = {}
      for (const card of action.layout.cards) {
        cardStates[card.id] = state.cardStates[card.id] ?? {
          id: card.id,
          type: card.type,
          loading: true,
          error: null,
          data: null,
          lastUpdatedAt: new Date().toISOString(),
          proofBadge: null,
          humanAddons: [],
        }
      }
      return {
        ...state,
        activeBentoLayout: action.layout,
        cardStates,
      }
    }

    case 'UPDATE_CARD_STATE':
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [action.cardId]: {
            ...state.cardStates[action.cardId],
            ...action.updates,
            lastUpdatedAt: new Date().toISOString(),
          },
        },
      }

    case 'ADD_HUMAN_ADDON':
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [action.cardId]: {
            ...state.cardStates[action.cardId],
            humanAddons: [
              ...(state.cardStates[action.cardId]?.humanAddons ?? []),
              action.addon,
            ],
          },
        },
      }

    // ─── Theme ───────────────────────────────────────────────────────
    case 'SET_THEME_MODE':
      return {
        ...state,
        themeMode: {
          ...state.themeMode,
          mode: action.mode,
          primaryColor: action.mode === 'govern'
            ? 'var(--engine-govern)'
            : 'var(--engine-dashboard)',
          backgroundClass: action.mode === 'govern'
            ? 'app-bg-govern-deep'
            : 'app-bg-oled',
          accentGlow: action.mode === 'govern'
            ? 'neon-glow-govern'
            : 'neon-glow-dashboard',
          auditTrailExpanded: action.mode === 'govern',
        },
      }

    // ─── Friction ────────────────────────────────────────────────────
    case 'QUEUE_ACTION':
      return {
        ...state,
        pendingActions: [...state.pendingActions, action.action],
      }

    case 'EXECUTE_ACTION': {
      const executed = state.pendingActions.find((a) => a.id === action.actionId)
      if (!executed) return state
      const now = new Date()
      const undoExpiry = new Date(now)
      undoExpiry.setHours(undoExpiry.getHours() + 72)
      return {
        ...state,
        pendingActions: state.pendingActions.filter((a) => a.id !== action.actionId),
        undoableActions: [
          {
            id: generateId(),
            action: executed,
            executedAt: now.toISOString(),
            undoExpiresAt: undoExpiry.toISOString(),
            undone: false,
          },
          ...state.undoableActions,
        ],
      }
    }

    case 'UNDO_ACTION':
      return {
        ...state,
        undoableActions: state.undoableActions.map((ua) =>
          ua.id === action.actionId
            ? { ...ua, undone: true, undoneAt: new Date().toISOString() }
            : ua,
        ),
      }

    case 'START_APPROVAL_FLOW':
      return {
        ...state,
        activeApprovalFlows: [...state.activeApprovalFlows, action.flow],
      }

    case 'UPDATE_APPROVAL_STEP':
      return {
        ...state,
        activeApprovalFlows: state.activeApprovalFlows.map((flow) =>
          flow.id === action.flowId
            ? {
                ...flow,
                steps: flow.steps.map((step, i) =>
                  i === action.stepIndex
                    ? {
                        ...step,
                        status: action.status,
                        ...(action.status === 'completed'
                          ? { completedAt: new Date().toISOString() }
                          : {}),
                        ...(action.status === 'in-progress'
                          ? { startedAt: new Date().toISOString() }
                          : {}),
                      }
                    : step,
                ),
                currentStepIndex:
                  action.status === 'completed'
                    ? Math.min(action.stepIndex + 1, flow.steps.length - 1)
                    : flow.currentStepIndex,
              }
            : flow,
        ),
      }

    // ─── Audit ───────────────────────────────────────────────────────
    case 'RECORD_AUDIT_EVENT':
      return {
        ...state,
        auditTrail: {
          ...state.auditTrail,
          events: [...state.auditTrail.events, action.event],
        },
      }

    case 'ADD_AUDIT_TRANSLATION':
      return {
        ...state,
        auditTrail: {
          ...state.auditTrail,
          translations: [...state.auditTrail.translations, action.translation],
        },
      }

    // ─── Govern ──────────────────────────────────────────────────────
    case 'UPDATE_GOVERN_SCORE':
      return {
        ...state,
        governScore: action.score,
      }

    // ─── Local-First ─────────────────────────────────────────────────
    case 'UPDATE_LOCAL_FIRST_STATUS':
      return {
        ...state,
        localFirstStatus: {
          ...state.localFirstStatus,
          ...action.updates,
        },
      }

    // ─── Chat (v3.0) ──────────────────────────────────────────────────
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatThread: {
          ...state.chatThread,
          messages: [...state.chatThread.messages, action.message],
        },
      }

    case 'SET_CHAT_PROCESSING':
      return {
        ...state,
        chatThread: {
          ...state.chatThread,
          isProcessing: action.isProcessing,
        },
      }

    case 'SET_FRICTION_GATE':
      return {
        ...state,
        activeFrictionGate: action.gate,
      }

    case 'RESOLVE_FRICTION_GATE':
      return {
        ...state,
        activeFrictionGate: state.activeFrictionGate
          ? { ...state.activeFrictionGate, isResolved: true, resolvedAt: new Date().toISOString() }
          : null,
      }

    case 'CLEAR_CHAT_THREAD':
      return {
        ...state,
        chatThread: { messages: [], isProcessing: false, error: null },
        activeFrictionGate: null,
      }

    // ─── Workspace (v4.0) ────────────────────────────────────────────
    case 'SET_SUGGESTIONS':
      return {
        ...state,
        workspace: { ...state.workspace, activeSuggestions: action.suggestions },
      }

    case 'SET_CARD_STREAMING_STATE':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          streamingCards: {
            ...state.workspace.streamingCards,
            [action.cardId]: {
              ...state.workspace.streamingCards[action.cardId],
              ...action.state,
            } as BentoCardStreamingState,
          },
        },
      }

    case 'SET_AUTOPSY_TARGET':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          autopsyTarget: action.cardId,
          autopsyDrawerOpen: action.cardId !== null,
        },
      }

    case 'TOGGLE_CHAT_DRAWER':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          chatDrawerOpen: !state.workspace.chatDrawerOpen,
        },
      }

    case 'TOGGLE_AUTOPSY_DRAWER':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          autopsyDrawerOpen: !state.workspace.autopsyDrawerOpen,
          autopsyTarget: state.workspace.autopsyDrawerOpen ? null : state.workspace.autopsyTarget,
        },
      }

    case 'SET_WORKSPACE_LAYOUT':
      return {
        ...state,
        workspace: { ...state.workspace, ...action.layout },
      }

    case 'UPDATE_GENERATIVE_CONTROL': {
      const controls = state.workspace.generativeControls[action.cardId] ?? []
      return {
        ...state,
        workspace: {
          ...state.workspace,
          generativeControls: {
            ...state.workspace.generativeControls,
            [action.cardId]: controls.map((ctrl) =>
              ctrl.id === action.controlId
                ? { ...ctrl, currentValue: action.value as never }
                : ctrl,
            ),
          },
        },
      }
    }

    case 'SET_USER_CONTEXT':
      return {
        ...state,
        workspace: { ...state.workspace, userContext: action.context },
      }

    case 'SET_GENERATIVE_CONTROLS':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          generativeControls: {
            ...state.workspace.generativeControls,
            [action.cardId]: action.controls,
          },
        },
      }

    // ─── v5.0: Autonomy, Provenance, Pin, Sandbox, Revert ─────────
    case 'SET_AUTONOMY_LEVEL':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          v5: state.workspace.v5
            ? { ...state.workspace.v5, autonomy: action.config }
            : null,
        },
      }

    case 'PIN_ARTIFACT':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          v5: state.workspace.v5
            ? {
                ...state.workspace.v5,
                pinnedArtifacts: [...state.workspace.v5.pinnedArtifacts, action.artifact],
              }
            : null,
        },
      }

    case 'UNPIN_ARTIFACT':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          v5: state.workspace.v5
            ? {
                ...state.workspace.v5,
                pinnedArtifacts: state.workspace.v5.pinnedArtifacts.filter(
                  (a) => a.id !== action.artifactId,
                ),
              }
            : null,
        },
      }

    case 'REORDER_PINNED':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          v5: state.workspace.v5
            ? {
                ...state.workspace.v5,
                pinnedArtifacts: action.orderedIds
                  .map((id, i) => {
                    const found = state.workspace.v5!.pinnedArtifacts.find((a) => a.id === id)
                    return found ? { ...found, position: i } : null
                  })
                  .filter(Boolean) as typeof state.workspace.v5.pinnedArtifacts,
              }
            : null,
        },
      }

    case 'UPDATE_SANDBOX_PREVIEW':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          v5: state.workspace.v5
            ? {
                ...state.workspace.v5,
                sandboxPreview: { ...state.workspace.v5.sandboxPreview, ...action.preview },
              }
            : null,
        },
      }

    case 'TOGGLE_SANDBOX_PREVIEW':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          v5: state.workspace.v5
            ? {
                ...state.workspace.v5,
                sandboxPreview: {
                  ...state.workspace.v5.sandboxPreview,
                  isOpen: !state.workspace.v5.sandboxPreview.isOpen,
                },
              }
            : null,
        },
      }

    case 'RECORD_ARTIFACT_CHECKPOINT':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          v5: state.workspace.v5
            ? {
                ...state.workspace.v5,
                pinnedArtifacts: state.workspace.v5.pinnedArtifacts.map((a) =>
                  a.id === action.artifactId
                    ? { ...a, checkpoint: action.checkpoint }
                    : a,
                ),
              }
            : null,
        },
      }

    case 'REVERT_ARTIFACT':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          v5: state.workspace.v5
            ? {
                ...state.workspace.v5,
                pinnedArtifacts: state.workspace.v5.pinnedArtifacts.map((a) =>
                  a.id === action.artifactId && a.checkpoint
                    ? {
                        ...a,
                        artifact: {
                          ...a.artifact,
                          data: a.checkpoint.snapshotData,
                        },
                      }
                    : a,
                ),
              }
            : null,
        },
      }

    // ─── Session ─────────────────────────────────────────────────────
    case 'LOAD_SESSION':
      return action.state

    case 'PURGE_SESSION':
      return createInitialState()

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface WorkbenchContextValue {
  state: WorkbenchState
  dispatch: Dispatch<WorkbenchAction>
}

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null)

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workbenchReducer, undefined, createInitialState)

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  )
}

export function useWorkbenchContext(): WorkbenchContextValue {
  const ctx = useContext(WorkbenchContext)
  if (!ctx) {
    throw new Error('useWorkbenchContext must be used within a WorkbenchProvider')
  }
  return ctx
}

export { WorkbenchContext }
