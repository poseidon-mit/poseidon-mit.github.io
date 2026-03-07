/**
 * Orchestrator Workbench v2.0 — Audit Trail Hook
 * Convenience hook for recording audit events with auto hash-chaining.
 */

import { useCallback } from 'react'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { createAuditEvent, getLastHash } from '@/lib/orchestrator/audit-chain'
import type { AuditEventType, AuditTranslation } from '@/lib/orchestrator/types'
import { generateId } from '@/lib/orchestrator/crypto'

export function useAuditTrail() {
  const { state, dispatch } = useWorkbenchContext()

  const recordEvent = useCallback(
    async (
      type: AuditEventType,
      actor: { type: 'system' | 'ai-model' | 'human'; id: string; label: string },
      payload: Record<string, unknown> = {},
    ) => {
      const previousHash = getLastHash(state.auditTrail)
      const event = await createAuditEvent(type, actor, payload, previousHash)
      dispatch({ type: 'RECORD_AUDIT_EVENT', event })
      return event
    },
    [state.auditTrail.events, dispatch],
  )

  const addTranslation = useCallback(
    (eventId: string, plainText: string, model: string = 'gpt-4o-mini') => {
      const translation: AuditTranslation = {
        eventId,
        plainText,
        model,
        hash: '', // Will be computed in production
        generatedAt: new Date().toISOString(),
      }
      dispatch({ type: 'ADD_AUDIT_TRANSLATION', translation })
      return translation
    },
    [dispatch],
  )

  return {
    auditTrail: state.auditTrail,
    recordEvent,
    addTranslation,
    eventCount: state.auditTrail.events.length,
    chainValid: state.auditTrail.chainValid,
  }
}
