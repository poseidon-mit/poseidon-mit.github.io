import { useState, useRef, useEffect } from 'react'
import { useDemoState } from '@/lib/demo-state/provider'
import { useToast } from '@/hooks/useToast'
import { useRouter } from '@/router'
import type { ExecuteActionEntity } from '@/domain/poseidon-universe'
import { dispatchApprovalBridge } from '@/lib/execute-approval-bridge'

export type ExecutionPhase = 'idle' | 'reviewing' | 'signing' | 'submitting' | 'confirmed'

export function useExecuteApprovalFlow(
  action: ExecuteActionEntity | undefined,
  onComplete: (decision: 'approved' | 'deferred') => void,
) {
  const { setExecuteDecision } = useDemoState()
  const { showToast } = useToast()
  const { navigate } = useRouter()
  const [consentReviewed, setConsentReviewed] = useState(false)
  const [slideAuthorized, setSlideAuthorized] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'defer' } | null>(null)
  const [executionPhase, setExecutionPhase] = useState<ExecutionPhase>('idle')

  const isExecuting = useRef(false)
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timerIds.current.forEach(clearTimeout)
    }
  }, [])

  const handleConfirm = () => {
    if (!confirmAction || !action) return
    if (isExecuting.current) return

    const decision = confirmAction.type === 'approve' ? 'approved' : 'deferred'
    setConfirmAction(null)

    if (decision === 'approved') {
      isExecuting.current = true
      setExecutionPhase('reviewing')

      timerIds.current.push(setTimeout(() => setExecutionPhase('signing'), 1200))
      timerIds.current.push(setTimeout(() => setExecutionPhase('submitting'), 2800))
      timerIds.current.push(setTimeout(() => {
        setExecutionPhase('confirmed')
        setExecuteDecision({
          actionId: action.id,
          actionTitle: action.title,
          decision: 'approved',
        })
        dispatchApprovalBridge(action, navigate, showToast)
      }, 4200))
      timerIds.current.push(setTimeout(() => {
        onComplete('approved')
      }, 5700))
    } else {
      setExecuteDecision({
        actionId: action.id,
        actionTitle: action.title,
        decision: 'deferred',
      })
      showToast({
        variant: 'info',
        message: `${action.id} deferred and queued for review.`,
      })
      onComplete(decision)
    }
  }

  return {
    consentReviewed,
    setConsentReviewed,
    slideAuthorized,
    setSlideAuthorized,
    confirmAction,
    setConfirmAction,
    handleConfirm,
    executionPhase,
  }
}
