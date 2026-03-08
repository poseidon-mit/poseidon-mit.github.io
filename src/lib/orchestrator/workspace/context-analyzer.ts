/**
 * Context Analyzer — builds UserContext from environment signals.
 *
 * In production this would pull from calendar APIs, RBAC, and session history.
 * Current implementation provides realistic mock data for demo purposes.
 */

import type { UserContext, CalendarSignal, RecentAction } from './workspace-types'
import type { EngineName, UseCaseId } from '@/lib/orchestrator/types'

// ─── Fiscal Quarter Helper ───────────────────────────────────────────────────

function getCurrentFiscalQuarter(): string {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  const year = now.getFullYear()
  const quarter = Math.ceil(month / 3)
  return `Q${quarter}-${year}`
}

// ─── Mock Calendar Signals ───────────────────────────────────────────────────

function getCalendarSignals(): CalendarSignal[] {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)

  return [
    {
      type: 'meeting',
      label: 'Monthly AML Review Board',
      timestamp: tomorrow.toISOString(),
      relevantEngine: 'govern' as EngineName,
    },
    {
      type: 'deadline',
      label: 'Q1 Budget Variance Report Due',
      timestamp: nextWeek.toISOString(),
      relevantEngine: 'execute' as EngineName,
    },
    {
      type: 'recurring',
      label: 'Weekly Risk Assessment Sync',
      timestamp: now.toISOString(),
      relevantEngine: 'protect' as EngineName,
    },
  ]
}

// ─── Mock Recent Actions ─────────────────────────────────────────────────────

function getRecentActions(): RecentAction[] {
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  return [
    {
      id: 'ra-001',
      useCaseId: 'UC-01' as UseCaseId,
      label: 'AML閾値チェック実行',
      timestamp: oneHourAgo.toISOString(),
      engine: 'govern' as EngineName,
    },
    {
      id: 'ra-002',
      useCaseId: 'UC-04' as UseCaseId,
      label: 'ポートフォリオリスク分析',
      timestamp: threeHoursAgo.toISOString(),
      engine: 'protect' as EngineName,
    },
    {
      id: 'ra-003',
      useCaseId: 'UC-07' as UseCaseId,
      label: '月次予算レビュー',
      timestamp: yesterday.toISOString(),
      engine: 'execute' as EngineName,
    },
  ]
}

// ─── Role Detection ──────────────────────────────────────────────────────────

export interface RoleConfig {
  role: string
  department: string
  riskProfile: 'low' | 'medium' | 'high' | 'critical'
}

const DEFAULT_ROLE: RoleConfig = {
  role: 'CFO',
  department: 'Finance',
  riskProfile: 'high',
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Analyze the current user context from available signals.
 * In production, this aggregates real-time data from calendar, RBAC,
 * session history, and external APIs.
 */
export function analyzeUserContext(
  roleOverride?: Partial<RoleConfig>,
): UserContext {
  const roleConfig = { ...DEFAULT_ROLE, ...roleOverride }

  return {
    role: roleConfig.role,
    fiscalQuarter: getCurrentFiscalQuarter(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    recentActions: getRecentActions(),
    calendarSignals: getCalendarSignals(),
    department: roleConfig.department,
    riskProfile: roleConfig.riskProfile,
  }
}

/**
 * Check if the user's context suggests urgency for a specific engine.
 */
export function hasUrgentSignalForEngine(
  context: UserContext,
  engine: EngineName,
): boolean {
  const now = new Date()
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  return context.calendarSignals.some(
    (signal) =>
      signal.relevantEngine === engine &&
      (signal.type === 'deadline' || signal.type === 'meeting') &&
      new Date(signal.timestamp) <= in24Hours,
  )
}
