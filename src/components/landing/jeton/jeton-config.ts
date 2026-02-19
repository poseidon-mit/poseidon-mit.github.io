export type LandingVariant = 'classic' | 'jeton';

export const JETON_EASING = [0.16, 1, 0.3, 1] as const;

export const JETON_SCROLL_ROOT_MARGIN = '-42% 0px -42% 0px';

export const JETON_SECTION_PADDING = {
  desktop: 'py-40',
  mobile: 'py-28',
} as const;

export interface JetonWebGLDefaults {
  quality: 'auto' | 'balanced' | 'high';
  pointerIntensity: number;
}

export const JETON_WEBGL_DEFAULTS: JetonWebGLDefaults = {
  quality: 'auto',
  pointerIntensity: 0.32,
};

function normalizeVariant(value: unknown): LandingVariant | null {
  if (value === 'classic' || value === 'jeton') return value;
  return null;
}

export function resolveLandingVariant(search: string, envVariant?: unknown): LandingVariant {
  const queryValue = new URLSearchParams(search).get('landing');
  const queryVariant = normalizeVariant(queryValue);
  if (queryVariant) return queryVariant;

  const env = normalizeVariant(envVariant);
  if (env) return env;

  return 'jeton';
}
