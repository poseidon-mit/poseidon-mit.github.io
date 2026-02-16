/**
 * Hook: resolve engine name to color tokens, CSS variables, and utility classes.
 */
import { useMemo } from 'react'
import { type EngineName, getEngineToken, type EngineToken } from '@/lib/engine-tokens'

export function useEngineTheme(engine: EngineName | undefined): EngineToken | null {
  return useMemo(() => {
    if (!engine) return null
    return getEngineToken(engine)
  }, [engine])
}
