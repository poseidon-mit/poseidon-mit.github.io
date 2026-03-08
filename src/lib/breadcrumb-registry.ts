/**
 * Breadcrumb definitions — single source of truth for app-shell breadcrumbs.
 * Consumed by AppNavShell (runtime) and route-integrity tests.
 */
export const BREADCRUMB_MAP: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/dashboard/notifications': ['Dashboard', 'Notifications'],
  '/protect': ['Protect Engine'],
  '/protect/alert-detail': ['Protect Engine', 'Alert Detail'],
  '/grow': ['Grow Engine'],
  '/grow/goal': ['Grow Engine', 'Goal Detail'],
  '/grow/scenarios': ['Grow Engine', 'Scenarios'],
  '/grow/recommendations': ['Grow Engine', 'Recommendations'],
  '/grow/recommendation': ['Grow Engine', 'Recommendation Detail'],
  '/execute': ['Execute Engine'],
  '/execute/approval': ['Execute Engine', 'Approval Queue'],
  '/execute/history': ['Execute Engine', 'History'],
  '/execute/queue': ['Execute Engine', 'Action Queue'],
  '/govern': ['Govern Engine'],
  '/govern/audit': ['Govern Engine', 'Audit Ledger'],
  '/govern/audit-detail': ['Govern Engine', 'Audit Detail'],
  '/settings': ['Settings'],
  '/settings/ai': ['Settings', 'AI Preferences'],
  '/settings/integrations': ['Settings', 'Integrations'],
  '/settings/rights': ['Settings', 'Rights & Privacy'],
  '/orchestrator': ['Orchestrator Workbench'],
}
