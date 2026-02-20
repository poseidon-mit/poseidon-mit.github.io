import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createDefaultDemoState,
  type DemoAuthMethod,
  type DemoExecuteDecision,
  type DemoGovernEngine,
  type DemoSettingsState,
  type DemoState,
  type DemoSupportTicket,
} from './types'
import { loadDemoState, resetDemoStateStorage, saveDemoState } from './storage'

interface CreateSupportTicketInput {
  subject: string
  category: string
  priority: DemoSupportTicket['priority']
  description: string
}

interface BeginDemoSessionInput {
  method: DemoAuthMethod
  email?: string
}

interface DemoStateContextValue {
  state: DemoState
  beginDemoSession: (input: BeginDemoSessionInput) => void
  endDemoSession: () => void
  updateOnboarding: (patch: Partial<DemoState['onboarding']>) => void
  markOnboardingCompleted: () => void
  setExecuteDecision: (args: {
    actionId: string
    actionTitle: string
    decision: Exclude<DemoExecuteDecision, 'pending'>
  }) => void
  updateSettings: (patch: Partial<DemoSettingsState>) => void
  updateGovernTrust: (
    engine: DemoGovernEngine,
    patch: Partial<DemoSettingsState['governTrust'][DemoGovernEngine]>,
  ) => void
  createSupportTicket: (input: CreateSupportTicketInput) => DemoSupportTicket
  resetAllDemoState: () => void
}

const FALLBACK_DEMO_STATE = createDefaultDemoState()

const DemoStateContext = createContext<DemoStateContextValue>({
  state: FALLBACK_DEMO_STATE,
  beginDemoSession: () => {},
  endDemoSession: () => {},
  updateOnboarding: () => {},
  markOnboardingCompleted: () => {},
  setExecuteDecision: () => {},
  updateSettings: () => {},
  updateGovernTrust: () => {},
  createSupportTicket: (input) => ({
    id: timestampId('TKT'),
    subject: input.subject,
    category: input.category,
    priority: input.priority,
    description: input.description,
    createdAt: new Date().toISOString(),
  }),
  resetAllDemoState: () => {},
})

function timestampId(prefix: string): string {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, '0')
  const d = String(now.getUTCDate()).padStart(2, '0')
  const h = String(now.getUTCHours()).padStart(2, '0')
  const min = String(now.getUTCMinutes()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 900 + 100)
  return `${prefix}-${y}${m}${d}-${h}${min}-${rand}`
}

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => loadDemoState(createDefaultDemoState()))

  useEffect(() => {
    saveDemoState(state)
  }, [state])

  const beginDemoSession = useCallback((input: BeginDemoSessionInput) => {
    setState((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        sessionStarted: true,
        method: input.method,
        email: input.email?.trim() || prev.auth.email,
        lastSignInAt: new Date().toISOString(),
      },
    }))
  }, [])

  const endDemoSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        sessionStarted: false,
        method: null,
      },
    }))
  }, [])

  const updateOnboarding = useCallback((patch: Partial<DemoState['onboarding']>) => {
    setState((prev) => ({ ...prev, onboarding: { ...prev.onboarding, ...patch } }))
  }, [])

  const markOnboardingCompleted = useCallback(() => {
    setState((prev) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        completed: true,
        completedAt: new Date().toISOString(),
      },
    }))
  }, [])

  const setExecuteDecision = useCallback((args: {
    actionId: string
    actionTitle: string
    decision: Exclude<DemoExecuteDecision, 'pending'>
  }) => {
    setState((prev) => {
      const existing = prev.execute.actionStates[args.actionId] ?? {
        id: args.actionId,
        status: 'pending' as const,
        decidedAt: null,
      }

      const event = {
        id: timestampId('GV-EXEC'),
        actionId: args.actionId,
        actionTitle: args.actionTitle,
        decision: args.decision,
        createdAt: new Date().toISOString(),
      }

      return {
        ...prev,
        execute: {
          ...prev.execute,
          actionStates: {
            ...prev.execute.actionStates,
            [args.actionId]: {
              ...existing,
              status: args.decision,
              decidedAt: new Date().toISOString(),
            },
          },
          events: [event, ...prev.execute.events].slice(0, 25),
        },
      }
    })
  }, [])

  const updateSettings = useCallback((patch: Partial<DemoSettingsState>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...patch,
      },
    }))
  }, [])

  const updateGovernTrust = useCallback(
    (engine: DemoGovernEngine, patch: Partial<DemoSettingsState['governTrust'][DemoGovernEngine]>) => {
      setState((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          governTrust: {
            ...prev.settings.governTrust,
            [engine]: {
              ...prev.settings.governTrust[engine],
              ...patch,
            },
          },
        },
      }))
    },
    [],
  )

  const createSupportTicket = useCallback((input: CreateSupportTicketInput) => {
    const ticket: DemoSupportTicket = {
      id: timestampId('TKT'),
      subject: input.subject,
      category: input.category,
      priority: input.priority,
      description: input.description,
      createdAt: new Date().toISOString(),
    }

    setState((prev) => ({
      ...prev,
      support: {
        submittedTickets: [ticket, ...prev.support.submittedTickets].slice(0, 20),
        lastTicketId: ticket.id,
      },
    }))

    return ticket
  }, [])

  const resetAllDemoState = useCallback(() => {
    resetDemoStateStorage()
    setState(createDefaultDemoState())
  }, [])

  const value = useMemo<DemoStateContextValue>(
    () => ({
      state,
      beginDemoSession,
      endDemoSession,
      updateOnboarding,
      markOnboardingCompleted,
      setExecuteDecision,
      updateSettings,
      updateGovernTrust,
      createSupportTicket,
      resetAllDemoState,
    }),
    [
      state,
      beginDemoSession,
      endDemoSession,
      updateOnboarding,
      markOnboardingCompleted,
      setExecuteDecision,
      updateSettings,
      updateGovernTrust,
      createSupportTicket,
      resetAllDemoState,
    ],
  )

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>
}

export function useDemoState(): DemoStateContextValue {
  return useContext(DemoStateContext)
}
