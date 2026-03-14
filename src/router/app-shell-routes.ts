export const APP_SHELL_PREFIXES = [
  '/dashboard',
  '/protect',
  '/grow',
  '/execute',
  '/govern',
  '/settings',
  '/help',
  '/orchestrator',
  '/chat',
] as const

export const APP_SHELL_WARMUP_ROUTES = [
  '/dashboard',
  '/protect',
  '/grow',
  '/execute',
  '/govern',
  '/settings',
] as const

export function isAppRoute(path: string): boolean {
  return APP_SHELL_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'))
}
