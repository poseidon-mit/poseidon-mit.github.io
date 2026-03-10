/**
 * Talk your money — Route Context Resolver
 *
 * Maps routes to contextual information for the conversational interface.
 */
import { AUDIT_DECISIONS, ROUTE_TO_DECISION } from '@/lib/govern-audit-data'
import type { RouteContext } from './types'

const ROUTE_LABELS: Record<string, string> = {
  '/chat': 'Talk your money',
  '/dashboard': 'Dashboard',
  '/protect': 'Protect',
  '/protect/threats': 'Threat Overview',
  '/protect/alert-detail': 'Alert Detail',
  '/grow': 'Grow',
  '/grow/recommendations': 'Recommendations',
  '/grow/recommendation': 'Recommendation Detail',
  '/grow/goal-detail': 'Goal Detail',
  '/grow/scenarios': 'Scenarios',
  '/execute': 'Execute',
  '/execute/queue': 'Action Queue',
  '/execute/approval': 'Approval Review',
  '/execute/history': 'Execution History',
  '/govern': 'Govern',
  '/govern/audit-ledger': 'Audit Ledger',
  '/govern/audit-detail': 'Audit Detail',
  '/settings': 'Settings',
  '/dashboard/notifications': 'Notifications',
}

/** Resolve context for a given route path and search params. */
export function resolveRouteContext(path: string, search: string): RouteContext | null {
  const label = ROUTE_LABELS[path]
  if (!label) return null

  // Audit detail — get decision-specific context
  if (path === '/govern/audit-detail') {
    const params = new URLSearchParams(search)
    const decisionId = params.get('decision')
    const entry = decisionId ? AUDIT_DECISIONS[decisionId] : null
    if (entry) {
      return {
        route: path,
        label,
        decisionId: entry.id,
        summary: entry.explanation.summary,
        engine: entry.engine,
        action: entry.action,
      }
    }
  }

  // Flagship routes — link to their audit decision
  const decisionId = ROUTE_TO_DECISION[path]
  if (decisionId) {
    const entry = AUDIT_DECISIONS[decisionId]
    if (entry) {
      return {
        route: path,
        label,
        decisionId: entry.id,
        summary: entry.explanation.summary,
        engine: entry.engine,
        action: entry.action,
      }
    }
  }

  // Generic context for known routes
  return { route: path, label }
}

/** Canned responses based on route context. */
export function getCannedResponse(context: RouteContext | null): string {
  if (!context) {
    return "I can help you understand what's happening across your financial operations. Navigate to any page and I'll provide contextual insights."
  }

  if (context.decisionId && context.summary) {
    return `Looking at ${context.action ?? 'this decision'} (${context.decisionId}): ${context.summary}\n\nWould you like me to explain any of the factors behind this decision?`
  }

  switch (context.route) {
    case '/dashboard':
      return "Here's your financial overview. I can help you understand any metric, review threats, or explore optimization opportunities. What would you like to know?"
    case '/protect':
    case '/protect/threats':
      return "I'm monitoring your threat landscape. Ask me about any specific alert or I can summarize the current risk posture."
    case '/grow':
    case '/grow/recommendations':
      return "I can help you evaluate growth recommendations and understand their projected impact. Which opportunity interests you?"
    case '/execute':
    case '/execute/queue':
      return "I can walk you through pending actions and help you understand what each approval involves. Which item would you like to review?"
    default:
      return `You're viewing ${context.label}. I can help you understand what you see here. What would you like to know?`
  }
}
