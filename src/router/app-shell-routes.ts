export const APP_SHELL_PREFIXES = [
  '/dashboard',
  '/protect',
  '/grow',
  '/execute',
  '/govern',
  '/settings',
  '/help',
] as const

export function isAppRoute(path: string): boolean {
  return APP_SHELL_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'))
}
