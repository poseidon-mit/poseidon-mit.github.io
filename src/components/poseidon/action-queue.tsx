/**
 * ActionQueue — Execution approval queue card (simplified facade).
 *
 * Wraps the existing ActionQueueCard with a streamlined API.
 */
import { ActionQueueCard } from '@/components/ActionQueueCard'
import type { Action } from '@/services/mockExecute'

export type { Action as ActionQueueItem }

export interface ActionQueueProps {
  action: Action
  onApprove?: (id: string) => void
  onDecline?: (id: string) => void
}

export function ActionQueue({
  action,
  onApprove,
  onDecline,
}: ActionQueueProps) {
  return (
    <ActionQueueCard
      action={action}
      onApprove={onApprove}
      onDecline={onDecline}
    />
  )
}

ActionQueue.displayName = 'ActionQueue'
