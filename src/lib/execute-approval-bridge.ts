import { CANONICAL_UNIVERSE } from '@/domain/poseidon-universe/canonical'
import { AUDIT_DECISIONS } from '@/lib/govern-audit-data'
import type { ExecuteActionEntity } from '@/domain/poseidon-universe/types'

export const GOVERN_AUDIT_DETAIL_URL = (govId: string) =>
  `/govern/audit-detail?decision=${encodeURIComponent(govId)}`

export function dispatchApprovalBridge(
  action: ExecuteActionEntity,
  navigate: (path: string) => void,
  showToast: (input: {
    variant: 'success' | 'info'
    message: string
    durationMs?: number
    action?: { label: string; onClick: () => void }
  }) => void,
) {
  const govIds = CANONICAL_UNIVERSE.relations.actionToDecision[action.id]
  const govId = govIds?.[0]

  if (!govId || !AUDIT_DECISIONS[govId]) {
    if (import.meta.env.DEV) {
      console.error(
        `[bridge] ${action.id}: govId=${govId ?? 'none'} — missing mapping or AUDIT_DECISIONS entry`,
      )
    }
    showToast({ variant: 'success', message: `${action.id} approved.` })
    return
  }

  showToast({
    variant: 'success',
    message: `${action.id} approved · Ledger: ${govId}`,
    durationMs: 6000,
    action: {
      label: `View ${govId}`,
      onClick: () => navigate(GOVERN_AUDIT_DETAIL_URL(govId)),
    },
  })

  window.dispatchEvent(
    new CustomEvent('poseidon:execute-approved', {
      detail: { govId, actionId: action.id, actionTitle: action.title },
    }),
  )
}
