export type EngineLabel = 'Protect' | 'Grow' | 'Execute' | 'Govern' | 'Dashboard'

export const ENGINE_COLOR_MAP: Record<EngineLabel, string> = {
  Protect: 'var(--engine-protect)',
  Grow: 'var(--engine-grow)',
  Execute: 'var(--engine-execute)',
  Govern: 'var(--engine-govern)',
  Dashboard: 'var(--engine-dashboard)',
}

export const ENGINE_BADGE_CLASS: Record<Exclude<EngineLabel, 'Dashboard'>, string> = {
  Protect: 'bg-emerald-500/20 text-emerald-400',
  Grow: 'bg-violet-500/20 text-violet-400',
  Execute: 'bg-amber-500/20 text-amber-400',
  Govern: 'bg-blue-500/20 text-blue-400',
}
