export const microcopyCatalog = {
  app_loading: 'Loading Poseidon',
  app_boot_subtitle: 'Preparing your financial command center',
  command_palette_empty: 'No matching commands. Try a broader keyword.',
  command_palette_title: 'Command Palette',
  search_recent_title: 'Recent searches',
  search_no_results: 'No results found for "{query}"',
  error_boundary_title: 'Something interrupted this workflow',
  error_boundary_retry: 'Try again',
  error_boundary_home: 'Return to dashboard',
} as const;

export type MicrocopyKey = keyof typeof microcopyCatalog;

export function copy(key: MicrocopyKey, vars?: Record<string, string | number>): string {
  const template = microcopyCatalog[key] as string;
  if (!vars) return template;

  return Object.entries(vars).reduce<string>((result, [k, v]) => {
    return result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }, template);
}
