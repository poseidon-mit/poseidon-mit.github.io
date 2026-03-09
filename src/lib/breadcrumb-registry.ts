/**
 * Breadcrumb definitions — single source of truth for app-shell breadcrumbs.
 * Consumed by AppNavShell (runtime) and route-integrity tests.
 */
export const BREADCRUMB_MAP: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/dashboard/notifications': ['Dashboard', 'Notifications'],
  '/protect': ['Protect'],
  '/protect/alert-detail': ['Protect', 'Alert Detail'],
  '/grow': ['Grow'],
  '/grow/goal': ['Grow', 'Goal Detail'],
  '/grow/scenarios': ['Grow', 'Scenarios'],
  '/grow/recommendations': ['Grow', 'Recommendations'],
  '/grow/recommendation': ['Grow', 'Recommendation Detail'],
  '/execute': ['Execute'],
  '/execute/approval': ['Execute', 'Approval Queue'],
  '/execute/history': ['Execute', 'History'],
  '/execute/queue': ['Execute', 'Action Queue'],
  '/govern': ['Govern'],
  '/govern/audit': ['Govern', 'Audit Ledger'],
  '/govern/audit-detail': ['Govern', 'Audit Detail'],
  '/settings': ['Settings'],
  '/settings/ai': ['Settings', 'AI Preferences'],
  '/settings/integrations': ['Settings', 'Integrations'],
  '/settings/rights': ['Settings', 'Rights & Privacy'],
}
