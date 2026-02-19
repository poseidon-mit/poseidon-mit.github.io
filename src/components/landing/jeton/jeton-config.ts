export type LandingVariant = 'jeton';

export const JETON_EASING = [0.16, 1, 0.3, 1] as const;

export const JETON_SCROLL_ROOT_MARGIN = '-42% 0px -42% 0px';

export const JETON_SECTION_PADDING = {
  desktop: 'py-40',
  mobile: 'py-28',
} as const;

export function resolveLandingVariant(_search: string, _envVariant?: unknown): LandingVariant {
  return 'jeton';
}
