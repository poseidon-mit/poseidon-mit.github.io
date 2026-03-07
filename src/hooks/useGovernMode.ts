/**
 * Orchestrator Workbench v2.0 — Govern Mode Hook
 * Toggle and manage Standard ↔ Govern theme modes.
 */

import { useCallback } from 'react'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import type { GovernScore } from '@/lib/orchestrator/types'

export function useGovernMode() {
  const { state, dispatch } = useWorkbenchContext()

  const isGovern = state.themeMode.mode === 'govern'

  const toggleMode = useCallback(() => {
    dispatch({
      type: 'SET_THEME_MODE',
      mode: isGovern ? 'standard' : 'govern',
    })
  }, [isGovern, dispatch])

  const setMode = useCallback(
    (mode: 'standard' | 'govern') => {
      dispatch({ type: 'SET_THEME_MODE', mode })
    },
    [dispatch],
  )

  const updateGovernScore = useCallback(
    (score: GovernScore) => {
      dispatch({ type: 'UPDATE_GOVERN_SCORE', score })
    },
    [dispatch],
  )

  return {
    isGovern,
    themeMode: state.themeMode,
    governScore: state.governScore,
    toggleMode,
    setMode,
    updateGovernScore,
  }
}
