/**
 * Orchestrator Workbench v2.0 — Approval Flow Hook
 * Manage multi-step approval flows with step progression.
 */

import { useCallback } from 'react'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { generateId } from '@/lib/orchestrator/crypto'
import type { ApprovalFlow, ApprovalStep, ActionSpec } from '@/lib/orchestrator/types'

export function useApprovalFlow() {
  const { state, dispatch } = useWorkbenchContext()

  const startFlow = useCallback(
    (action: ActionSpec, approvers: ApprovalStep[]) => {
      const now = new Date()
      const undoExpiry = new Date(now)
      undoExpiry.setHours(undoExpiry.getHours() + 72)

      const flow: ApprovalFlow = {
        id: generateId(),
        actionId: action.id,
        steps: approvers.map((step, i) => ({
          ...step,
          status: i === 0 ? 'in-progress' : 'pending',
          ...(i === 0 ? { startedAt: now.toISOString() } : {}),
        })),
        currentStepIndex: 0,
        createdAt: now.toISOString(),
        undoWindowExpiresAt: undoExpiry.toISOString(),
      }

      dispatch({ type: 'START_APPROVAL_FLOW', flow })
      return flow
    },
    [dispatch],
  )

  const approveStep = useCallback(
    (flowId: string, stepIndex: number) => {
      dispatch({
        type: 'UPDATE_APPROVAL_STEP',
        flowId,
        stepIndex,
        status: 'completed',
      })
    },
    [dispatch],
  )

  const rejectStep = useCallback(
    (flowId: string, stepIndex: number) => {
      dispatch({
        type: 'UPDATE_APPROVAL_STEP',
        flowId,
        stepIndex,
        status: 'rejected',
      })
    },
    [dispatch],
  )

  return {
    activeFlows: state.activeApprovalFlows,
    startFlow,
    approveStep,
    rejectStep,
  }
}
