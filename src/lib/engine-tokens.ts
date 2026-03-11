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
    color: 'hsl(189, 94%, 43%)',
    cssVar: '--engine-dashboard',
    neonVar: '--neon-cyan',
    neonClass: 'neon-glow-dashboard',
    textClass: 'text-cyan-400 engine-text-dashboard',
    bgClass: 'bg-cyan-500/10 engine-bg-dashboard',
    borderClass: 'border-cyan-500/20 engine-border-dashboard',
    label: 'Dashboard',
    labelJa: 'ダッシュボード',
  },
  protect: {
    color: 'hsl(160, 84%, 39%)',
    cssVar: '--engine-protect',
    neonVar: '--neon-teal',
    neonClass: 'neon-glow-protect',
    textClass: 'text-emerald-400 engine-text-protect',
    bgClass: 'bg-emerald-500/10 engine-bg-protect',
    borderClass: 'border-emerald-500/20 engine-border-protect',
    label: 'Protect',
    labelJa: '保護',
  },
  grow: {
    color: 'hsl(258, 90%, 66%)',
    cssVar: '--engine-grow',
    neonVar: '--neon-violet',
    neonClass: 'neon-glow-grow',
    textClass: 'text-violet-400 engine-text-grow',
    bgClass: 'bg-violet-500/10 engine-bg-grow',
    borderClass: 'border-violet-500/20 engine-border-grow',
    label: 'Grow',
    labelJa: '成長',
  },
  execute: {
    color: 'hsl(38, 92%, 50%)',
    cssVar: '--engine-execute',
    neonVar: '--neon-amber',
    neonClass: 'neon-glow-execute',
    textClass: 'text-amber-400 engine-text-execute',
    bgClass: 'bg-amber-500/10 engine-bg-execute',
    borderClass: 'border-amber-500/20 engine-border-execute',
    label: 'Execute',
    labelJa: '実行',
  },
  govern: {
    color: 'hsl(217, 91%, 60%)',
    cssVar: '--engine-govern',
    neonVar: '--neon-blue',
    neonClass: 'neon-glow-govern',
    textClass: 'text-blue-400 engine-text-govern',
    bgClass: 'bg-blue-500/10 engine-bg-govern',
    borderClass: 'border-blue-500/20 engine-border-govern',
    label: 'Govern',
    labelJa: 'ガバナンス',
  },
}

export function getEngineToken(engine: EngineName): EngineToken {
  return engineTokens[engine]
}

export const ENGINE_NAMES = Object.keys(engineTokens) as EngineName[]

/* ── Engine-name casing bridge ── */

import type { EngineName as DomainEngineName } from '@/domain/poseidon-universe/types'

/** Convert domain uppercase engine label to lowercase token key */
export function fromDomainEngine(label: DomainEngineName): Exclude<EngineName, 'dashboard'> {
  return label.toLowerCase() as Exclude<EngineName, 'dashboard'>
}

/** Convert lowercase token key to domain uppercase engine label */
export function toDomainEngine(engine: Exclude<EngineName, 'dashboard'>): DomainEngineName {
  return (engine.charAt(0).toUpperCase() + engine.slice(1)) as DomainEngineName
}
