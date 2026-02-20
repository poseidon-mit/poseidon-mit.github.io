import { DEMO_USER, type DemoUser } from '@/lib/demo-user'

export const DEMO_STATE_VERSION = 1

export type DemoAuthMethod = 'skip' | 'form' | 'google' | 'apple'
export type DemoExecuteDecision = 'approved' | 'deferred' | 'rejected' | 'pending'
export type DemoGovernEngine = 'Protect' | 'Grow' | 'Execute' | 'Govern'

export interface DemoAuthState {
  sessionStarted: boolean
  method: DemoAuthMethod | null
  lastSignInAt: string | null
  email: string
}

export interface DemoOnboardingState {
  connectedAccountIds: string[]
  selectedGoals: string[]
  consentSelections: Record<string, boolean>
  completed: boolean
  completedAt: string | null
}

export interface DemoExecuteActionState {
  id: string
  status: DemoExecuteDecision
  decidedAt: string | null
}

export interface DemoAuditEvent {
  id: string
  actionId: string
  actionTitle: string
  decision: Exclude<DemoExecuteDecision, 'pending'>
  createdAt: string
}

export interface DemoExecuteState {
  actionStates: Record<string, DemoExecuteActionState>
  autoApprovedCount: number
  rollbackCount24h: number
  events: DemoAuditEvent[]
}

export interface DemoGovernTrustConfig {
  riskTolerance: number
  autoApproval: number
  toggles: Record<string, boolean>
}

export interface DemoSettingsState {
  notifications: {
    threatAlerts: boolean
    weeklyDigest: boolean
    executionAlerts: boolean
  }
  governTrust: Record<DemoGovernEngine, DemoGovernTrustConfig>
}

export interface DemoSupportTicket {
  id: string
  subject: string
  category: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  description: string
  createdAt: string
}

export interface DemoSupportState {
  submittedTickets: DemoSupportTicket[]
  lastTicketId: string | null
}

export interface DemoState {
  version: number
  user: DemoUser
  auth: DemoAuthState
  onboarding: DemoOnboardingState
  execute: DemoExecuteState
  settings: DemoSettingsState
  support: DemoSupportState
}

const DEFAULT_EXECUTE_IDS = ['EXE-001', 'EXE-002', 'EXE-003', 'EXE-004', 'EXE-005'] as const

function createDefaultExecuteActionStates(): Record<string, DemoExecuteActionState> {
  return Object.fromEntries(
    DEFAULT_EXECUTE_IDS.map((id) => [id, { id, status: 'pending', decidedAt: null }]),
  ) as Record<string, DemoExecuteActionState>
}

export function createDefaultDemoState(): DemoState {
  return {
    version: DEMO_STATE_VERSION,
    user: DEMO_USER,
    auth: {
      sessionStarted: false,
      method: null,
      lastSignInAt: null,
      email: DEMO_USER.email,
    },
    onboarding: {
      connectedAccountIds: [],
      selectedGoals: ['protect'],
      consentSelections: {
        analyze: true,
        recommend: true,
        approve: true,
        notifications: true,
      },
      completed: false,
      completedAt: null,
    },
    execute: {
      actionStates: createDefaultExecuteActionStates(),
      autoApprovedCount: 8,
      rollbackCount24h: 2,
      events: [],
    },
    settings: {
      notifications: {
        threatAlerts: true,
        weeklyDigest: true,
        executionAlerts: false,
      },
      governTrust: {
        Protect: {
          riskTolerance: 30,
          autoApproval: 85,
          toggles: {
            'Auto-block suspicious': true,
            'Real-time alerts': true,
          },
        },
        Grow: {
          riskTolerance: 55,
          autoApproval: 70,
          toggles: {
            'Auto-save rules': true,
            'Goal tracking': true,
          },
        },
        Execute: {
          riskTolerance: 40,
          autoApproval: 80,
          toggles: {
            'Low-risk auto-execute': false,
            'Bill negotiation': true,
          },
        },
        Govern: {
          riskTolerance: 20,
          autoApproval: 95,
          toggles: {
            'Auto-audit logging': true,
            'Policy enforcement': true,
          },
        },
      },
    },
    support: {
      submittedTickets: [],
      lastTicketId: null,
    },
  }
}
