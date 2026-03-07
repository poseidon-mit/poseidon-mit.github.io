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
} from '@/lib/orchestrator/types'
import { THEME_STANDARD } from '@/lib/orchestrator/theme-tokens'
import { createEmptyTrail } from '@/lib/orchestrator/audit-chain'
import { generateId } from '@/lib/orchestrator/crypto'

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
