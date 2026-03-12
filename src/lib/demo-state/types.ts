import { DEMO_USER, type DemoUser } from '@/lib/demo-user'

export const DEMO_STATE_VERSION = 4

export type DemoAuthMethod = 'skip' | 'form' | 'google' | 'apple' | 'passkey'
export type EntryIntent = 'express' | 'agentic'
export type DemoExecuteDecision = 'approved' | 'deferred' | 'rejected' | 'pending'
export type DemoAuditDecision = Exclude<DemoExecuteDecision, 'pending'> | 'undo'
export type DemoGovernEngine = 'Protect' | 'Grow' | 'Execute' | 'Govern'

export interface DemoAuthState {
  sessionStarted: boolean
  method: DemoAuthMethod | null
  lastSignInAt: string | null
  email: string
  entryIntent: EntryIntent | null
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
  decision: DemoAuditDecision
  createdAt: string
  engine?: string
  amountLabel?: string
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

export type DemoThreatResolution = 'legitimate' | 'blocked'
export type DemoRecommendationDecision = 'accepted' | 'declined'

export interface DemoThreatState {
  resolvedThreats: Record<string, { resolution: DemoThreatResolution; resolvedAt: string }>
}

export interface DemoRecommendationState {
  decisions: Record<string, { decision: DemoRecommendationDecision; decidedAt: string }>
}

export interface DemoState {
  version: number
  user: DemoUser
  auth: DemoAuthState
  onboarding: DemoOnboardingState
  execute: DemoExecuteState
  threats: DemoThreatState
  recommendations: DemoRecommendationState
  settings: DemoSettingsState
  support: DemoSupportState
}

function createDefaultExecuteActionStates(): Record<string, DemoExecuteActionState> {
  return {
    'EXE-001': { id: 'EXE-001', status: 'pending', decidedAt: null },
    'EXE-002': { id: 'EXE-002', status: 'pending', decidedAt: null },
    'EXE-003': { id: 'EXE-003', status: 'approved', decidedAt: '2026-03-07T11:22:00-05:00' },
    'EXE-004': { id: 'EXE-004', status: 'approved', decidedAt: '2026-02-15T14:12:00-05:00' },
    'EXE-005': { id: 'EXE-005', status: 'approved', decidedAt: '2026-02-28T09:04:00-05:00' },
    'EXE-006': { id: 'EXE-006', status: 'deferred', decidedAt: '2026-03-09T08:45:00-05:00' },
    'EXE-007': { id: 'EXE-007', status: 'approved', decidedAt: '2026-03-01T10:18:00-05:00' },
  }
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
      entryIntent: null,
    },
    onboarding: {
      connectedAccountIds: [],
      selectedGoals: ['govern'],
      consentSelections: {
        analyze: true,
        recommend: true,
        approve: false,
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
    threats: {
      resolvedThreats: {},
    },
    recommendations: {
      decisions: {},
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
