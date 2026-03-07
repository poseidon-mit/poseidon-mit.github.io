/**
 * Orchestrator Workbench v2.0 — Approval Context
 * Dedicated context for multi-step approval flow operations.
 */

import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'
import { useWorkbenchContext } from './WorkbenchContext'
import { generateId } from '@/lib/orchestrator/crypto'
import { sendApprovalNotification, buildNotificationPayload } from '@/lib/orchestrator/external-channels'
import type { ApprovalFlow, ApprovalStep } from '@/lib/orchestrator/types'

interface ApprovalContextValue {
  flows: ApprovalFlow[]
  activeFlow: ApprovalFlow | null
  startFlow: (actionId: string, approvers: Array<{ name: string; role: string; channel?: 'slack' | 'teams' | 'email' }>) => ApprovalFlow
  updateStep: (flowId: string, stepIndex: number, status: ApprovalStep['status']) => void
  sendNotifications: () => Promise<void>
  isFlowActive: boolean
  currentStepIndex: number
  progress: number // 0-100
}

const ApprovalCtx = createContext<ApprovalContextValue | null>(null)

export function useApprovalContext(): ApprovalContextValue {
  const ctx = useContext(ApprovalCtx)
  if (!ctx) throw new Error('useApprovalContext must be used within ApprovalProvider')
  return ctx
}

interface ApprovalProviderProps {
  children: ReactNode
}

export function ApprovalProvider({ children }: ApprovalProviderProps) {
  const { state, dispatch } = useWorkbenchContext()

  // Collect all approval flows from pending actions that have one
  const flows = useMemo(() => {
    return state.pendingActions
      .filter((a): a is typeof a & { approvalFlow: ApprovalFlow } =>
        a.requiresApproval && 'approvalFlow' in a && a.approvalFlow != null,
      )
      .map((a) => (a as any).approvalFlow as ApprovalFlow)
  }, [state.pendingActions])

  // Active flow = first non-fully-completed flow
  const activeFlow = useMemo(() => {
    return flows.find((f) =>
      f.steps.some((s: ApprovalStep) => s.status === 'pending' || s.status === 'in-progress'),
    ) ?? null
  }, [flows])

  const currentStepIndex = activeFlow?.currentStepIndex ?? 0

  const progress = useMemo(() => {
    if (!activeFlow) return 0
    const total = activeFlow.steps.length
    const completed = activeFlow.steps.filter((s: ApprovalStep) => s.status === 'completed').length
    return Math.round((completed / total) * 100)
  }, [activeFlow])

  const startFlow = useCallback(
    (
      actionId: string,
      approvers: Array<{ name: string; role: string; channel?: 'slack' | 'teams' | 'email' }>,
    ): ApprovalFlow => {
      const flow: ApprovalFlow = {
        id: generateId(),
        actionId,
        steps: approvers.map((approver, index) => ({
          id: generateId(),
          label: `${approver.role} 承認`,
          status: index === 0 ? 'in-progress' as const : 'pending' as const,
          assignee: {
            name: approver.name,
            role: approver.role,
            channel: approver.channel,
          },
        })),
        currentStepIndex: 0,
        createdAt: new Date().toISOString(),
        undoWindowExpiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72h
      }

      dispatch({ type: 'START_APPROVAL_FLOW', flow })
      return flow
    },
    [dispatch],
  )

  const updateStep = useCallback(
    (flowId: string, stepIndex: number, status: ApprovalStep['status']) => {
      dispatch({
        type: 'UPDATE_APPROVAL_STEP',
        flowId,
        stepIndex,
        status,
      })
    },
    [dispatch],
  )

  const sendNotifications = useCallback(async () => {
    if (!activeFlow) return
    const payload = buildNotificationPayload(activeFlow)
    const results = await sendApprovalNotification(payload)
    console.log('[ApprovalContext] Notification results:', results)
  }, [activeFlow])

  const value = useMemo<ApprovalContextValue>(
    () => ({
      flows,
      activeFlow,
      startFlow,
      updateStep,
      sendNotifications,
      isFlowActive: activeFlow !== null,
      currentStepIndex,
      progress,
    }),
    [flows, activeFlow, startFlow, updateStep, sendNotifications, currentStepIndex, progress],
  )

  return <ApprovalCtx.Provider value={value}>{children}</ApprovalCtx.Provider>
}
