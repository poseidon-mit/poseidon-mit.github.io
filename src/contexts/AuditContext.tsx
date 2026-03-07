/**
 * Orchestrator Workbench v2.0 — Audit Context
 * Dedicated context for semantic audit trail operations.
 * Wraps WorkbenchContext dispatch with audit-specific helpers.
 */

import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'
import { useWorkbenchContext } from './WorkbenchContext'
import { generateId } from '@/lib/orchestrator/crypto'
import { getLastHash, verifyChain } from '@/lib/orchestrator/audit-chain'
import type { AuditEvent, AuditTranslation, SemanticAuditTrail } from '@/lib/orchestrator/types'

interface AuditContextValue {
  trail: SemanticAuditTrail
  record: (event: Omit<AuditEvent, 'id' | 'timestamp' | 'hash' | 'previousHash'>) => void
  addTranslation: (eventId: string, plainText: string, model?: string) => void
  addHumanAddon: (eventId: string, note: string) => void
  verifyIntegrity: () => Promise<boolean>
  eventCount: number
  isChainValid: boolean
}

const AuditCtx = createContext<AuditContextValue | null>(null)

export function useAuditContext(): AuditContextValue {
  const ctx = useContext(AuditCtx)
  if (!ctx) throw new Error('useAuditContext must be used within AuditProvider')
  return ctx
}

interface AuditProviderProps {
  children: ReactNode
}

export function AuditProvider({ children }: AuditProviderProps) {
  const { state, dispatch } = useWorkbenchContext()
  const trail = state.auditTrail

  const record = useCallback(
    (event: Omit<AuditEvent, 'id' | 'timestamp' | 'hash' | 'previousHash'>) => {
      const previousHash = getLastHash(trail)
      const fullEvent: AuditEvent = {
        ...event,
        id: generateId(),
        timestamp: new Date().toISOString(),
        hash: '', // Computed by reducer or chain logic
        previousHash,
      }
      dispatch({ type: 'RECORD_AUDIT_EVENT', event: fullEvent })
    },
    [dispatch, trail],
  )

  const addTranslation = useCallback(
    (eventId: string, plainText: string, model: string = 'gpt-4o-mini') => {
      const translation: AuditTranslation = {
        eventId,
        plainText,
        model,
        hash: '',
        generatedAt: new Date().toISOString(),
      }
      dispatch({ type: 'ADD_AUDIT_TRANSLATION', translation })
    },
    [dispatch],
  )

  const addHumanAddon = useCallback(
    (eventId: string, note: string) => {
      dispatch({
        type: 'RECORD_AUDIT_EVENT',
        event: {
          id: generateId(),
          timestamp: new Date().toISOString(),
          type: 'HUMAN_ADDON',
          actor: { type: 'human', id: 'current-user', label: 'User' },
          payload: { parentEventId: eventId, note },
          hash: '',
          previousHash: getLastHash(trail),
        },
      })
    },
    [dispatch, trail],
  )

  const verifyIntegrity = useCallback(async (): Promise<boolean> => {
    return verifyChain(trail.events)
  }, [trail])

  const value = useMemo<AuditContextValue>(
    () => ({
      trail,
      record,
      addTranslation,
      addHumanAddon,
      verifyIntegrity,
      eventCount: trail.events.length,
      isChainValid: trail.chainValid,
    }),
    [trail, record, addTranslation, addHumanAddon, verifyIntegrity],
  )

  return <AuditCtx.Provider value={value}>{children}</AuditCtx.Provider>
}
