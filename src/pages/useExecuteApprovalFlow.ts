import { useState } from 'react'
import { useDemoState } from '@/lib/demo-state/provider'
import { useToast } from '@/hooks/useToast'
import type { ExecuteActionEntity } from '@/domain/poseidon-universe'

export function useExecuteApprovalFlow(
  action: ExecuteActionEntity | undefined,
  onComplete: (decision: 'approved' | 'deferred') => void,
) {
  const { setExecuteDecision } = useDemoState()
  const { showToast } = useToast()
  const [consentReviewed, setConsentReviewed] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'defer' } | null>(null)

  const handleConfirm = () => {
    if (!confirmAction || !action) return
    const decision = confirmAction.type === 'approve' ? 'approved' : 'deferred'
    setExecuteDecision({
      actionId: action.id,
      actionTitle: action.title,
      decision,
    })
    showToast({
      variant: decision === 'approved' ? 'success' : 'info',
      message: decision === 'approved'
        ? `${action.id} approved and logged to governance.`
        : `${action.id} deferred and queued for review.`,
    })
    setConfirmAction(null)
    onComplete(decision)
  }

  return {
    consentReviewed,
    setConsentReviewed,
    confirmAction,
    setConfirmAction,
    handleConfirm,
  }
}
