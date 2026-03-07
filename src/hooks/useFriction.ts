/**
 * Orchestrator Workbench v2.0 — Friction Hook
 * Friction-Right execution flow: queue → verify → execute → undo.
 */

import { useCallback } from 'react'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { getFrictionPolicy, requiresPasskey } from '@/lib/orchestrator/friction-matrix'
import type { ActionSpec, RiskLevel } from '@/lib/orchestrator/types'

export interface FrictionResult {
  needsPasskey: boolean
  needsFourEyes: boolean
  needsPreview: boolean
  canAutoExecute: boolean
}

export function useFriction() {
  const { state, dispatch } = useWorkbenchContext()

  const evaluateFriction = useCallback((riskLevel: RiskLevel): FrictionResult => {
    const policy = getFrictionPolicy(riskLevel)
    return {
      needsPasskey: requiresPasskey(riskLevel),
      needsFourEyes: policy.requirements.some((r: { type: string }) => r.type === 'four-eyes'),
      needsPreview: policy.requirements.some((r: { type: string }) => r.type === 'intent-preview'),
      canAutoExecute: !policy.requirements.some(
        (r: { type: string }) => r.type === 'four-eyes' || r.type === 'passkey-auth',
      ),
    }
  }, [])

  const queueAction = useCallback(
    (action: ActionSpec) => {
      dispatch({ type: 'QUEUE_ACTION', action })
    },
    [dispatch],
  )

  const executeAction = useCallback(
    (actionId: string) => {
      dispatch({ type: 'EXECUTE_ACTION', actionId })
    },
    [dispatch],
  )

  const undoAction = useCallback(
    (actionId: string) => {
      dispatch({ type: 'UNDO_ACTION', actionId })
    },
    [dispatch],
  )

  return {
    pendingActions: state.pendingActions,
    undoableActions: state.undoableActions,
    evaluateFriction,
    queueAction,
    executeAction,
    undoAction,
  }
}
