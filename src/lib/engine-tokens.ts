/**
 * Engine → color / neon / gradient mapping utility.
 *
 * Used by components/poseidon/* facades and the v0 adaptation workflow.
 */

export type EngineName = 'dashboard' | 'protect' | 'grow' | 'execute' | 'govern'

/** DS v2 engine type (excludes 'dashboard') */
export type DSEngineName = 'protect' | 'grow' | 'execute' | 'govern'

/** Convert facade EngineName to DS v2 engine (undefined for 'dashboard') */
export function toDSEngine(engine: EngineName | undefined): DSEngineName | undefined {
  if (!engine || engine === 'dashboard') return undefined
  return engine
}

export interface EngineToken {
  color: string
  cssVar: string
  neonVar: string
  neonClass: string
  textClass: string
  bgClass: string
  borderClass: string
  label: string
  labelJa: string
}

export const engineTokens: Record<EngineName, EngineToken> = {
  dashboard: {
    color: '#00F0FF',
    cssVar: '--engine-dashboard',
    neonVar: '--neon-cyan',
    neonClass: 'neon-glow-dashboard',
    textClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/20',
    label: 'Dashboard',
    labelJa: 'ダッシュボード',
  },
  protect: {
    color: '#22C55E',
    cssVar: '--engine-protect',
    neonVar: '--neon-teal',
    neonClass: 'neon-glow-protect',
    textClass: 'text-green-400',
    bgClass: 'bg-green-500/10',
    borderClass: 'border-green-500/20',
    label: 'Protect',
    labelJa: '保護',
  },
  grow: {
    color: '#8B5CF6',
    cssVar: '--engine-grow',
    neonVar: '--neon-violet',
    neonClass: 'neon-glow-grow',
    textClass: 'text-violet-400',
    bgClass: 'bg-violet-500/10',
    borderClass: 'border-violet-500/20',
    label: 'Grow',
    labelJa: '成長',
  },
  execute: {
    color: '#EAB308',
    cssVar: '--engine-execute',
    neonVar: '--neon-amber',
    neonClass: 'neon-glow-execute',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/20',
    label: 'Execute',
    labelJa: '実行',
  },
  govern: {
    color: '#3B82F6',
    cssVar: '--engine-govern',
    neonVar: '--neon-blue',
    neonClass: 'neon-glow-govern',
    textClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/20',
    label: 'Govern',
    labelJa: 'ガバナンス',
  },
}

export function getEngineToken(engine: EngineName): EngineToken {
  return engineTokens[engine]
}

export const ENGINE_NAMES = Object.keys(engineTokens) as EngineName[]
