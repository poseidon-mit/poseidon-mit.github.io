/**
 * Orchestrator Workbench v2.0 — Lifecycle Hook
 * Wires together OPFS persistence, auto-purge, and audit auto-recording.
 *
 * Responsibilities:
 * 1. OPFS session save on every state change (debounced)
 * 2. OPFS session restore on mount
 * 3. Auto-purge on beforeunload/visibilitychange (5-min grace period)
 * 4. Audit event auto-recording for dispatched actions
 */

import { useEffect, useRef, useCallback } from 'react'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import {
  saveSession,
  loadSession,
  appendAuditEvent,
  purgeAllData,
  purgeExpiredSessions,
} from '@/lib/orchestrator/opfs-storage'
import { generateId } from '@/lib/orchestrator/crypto'
import type { AuditEvent, AuditEventType, WorkbenchState } from '@/lib/orchestrator/types'

const SAVE_DEBOUNCE_MS = 500
const GRACE_PERIOD_MS = 5 * 60 * 1000 // 5 minutes
const PURGE_GRACE_KEY = 'poseidon-orchestrator-purge-timestamp'

interface LifecycleOptions {
  /** Encryption passphrase for OPFS storage */
  passphrase?: string
  /** Enable auto-purge on session end */
  autoPurge?: boolean
  /** Enable OPFS persistence */
  persistEnabled?: boolean
}

export function useOrchestratorLifecycle(options: LifecycleOptions = {}) {
  const { passphrase, autoPurge = true, persistEnabled = true } = options
  const { state, dispatch } = useWorkbenchContext()
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedHashRef = useRef<string>('')
  const mountedRef = useRef(false)

  // ─── 1. OPFS Session Restore on Mount ─────────────────────────────────────

  useEffect(() => {
    if (!persistEnabled || mountedRef.current) return
    mountedRef.current = true

    // Check grace period — if the page was closed <5min ago, restore
    const purgeTimestamp = localStorage.getItem(PURGE_GRACE_KEY)
    if (purgeTimestamp) {
      const elapsed = Date.now() - parseInt(purgeTimestamp, 10)
      if (elapsed > GRACE_PERIOD_MS) {
        // Grace period expired — purge and start fresh
        purgeAllData().catch(console.error)
        localStorage.removeItem(PURGE_GRACE_KEY)
        return
      }
      // Within grace — clear the purge marker
      localStorage.removeItem(PURGE_GRACE_KEY)
    }

    // Attempt to restore session from OPFS
    loadSession(state.sessionId, passphrase)
      .then((snapshot) => {
        if (snapshot) {
          // SessionSnapshot contains { sessionId, state, savedAt, version }
          // The state field is `unknown`, cast to WorkbenchState for dispatch
          dispatch({ type: 'LOAD_SESSION', state: snapshot.state as WorkbenchState })
          console.log('[Lifecycle] Session restored from OPFS')
        }
      })
      .catch((err) => {
        console.warn('[Lifecycle] Failed to restore session:', err)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 2. OPFS Session Save (debounced) ─────────────────────────────────────

  const debouncedSave = useCallback(
    (currentState: WorkbenchState) => {
      if (!persistEnabled) return

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }

      saveTimerRef.current = setTimeout(() => {
        const stateHash = JSON.stringify({
          intent: currentState.currentIntent?.id,
          cards: Object.keys(currentState.cardStates).length,
          audit: currentState.auditTrail.events.length,
          pending: currentState.pendingActions.length,
        })

        // Skip if state hasn't meaningfully changed
        if (stateHash === lastSavedHashRef.current) return
        lastSavedHashRef.current = stateHash

        saveSession(currentState.sessionId, currentState, passphrase)
          .then(() => {
            dispatch({
              type: 'UPDATE_LOCAL_FIRST_STATUS',
              updates: { lastSyncAt: new Date().toISOString() },
            })
          })
          .catch((err) => {
            console.warn('[Lifecycle] Failed to save session:', err)
          })
      }, SAVE_DEBOUNCE_MS)
    },
    [persistEnabled, passphrase, dispatch],
  )

  // Trigger save whenever state changes
  useEffect(() => {
    if (!mountedRef.current) return
    debouncedSave(state)
  }, [state, debouncedSave])

  // ─── 3. Auto-Purge on Session End ─────────────────────────────────────────

  useEffect(() => {
    if (!autoPurge) return

    const handleBeforeUnload = () => {
      // Set grace period marker — actual purge happens on next load if expired
      localStorage.setItem(PURGE_GRACE_KEY, Date.now().toString())
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem(PURGE_GRACE_KEY, Date.now().toString())
      } else if (document.visibilityState === 'visible') {
        // User returned — cancel purge
        localStorage.removeItem(PURGE_GRACE_KEY)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [autoPurge])

  // ─── 4. Periodic expired session cleanup ──────────────────────────────────

  useEffect(() => {
    if (!persistEnabled) return

    // Clean up expired sessions every 10 minutes
    const interval = setInterval(() => {
      purgeExpiredSessions(GRACE_PERIOD_MS).catch(console.error)
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [persistEnabled])

  // ─── Cleanup on unmount ───────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])
}

// ─── Audit Auto-Recording Middleware ──────────────────────────────────────────

/**
 * Creates an audit-recording dispatch wrapper.
 * Wraps the original dispatch to auto-record audit events for tracked action types.
 */
export function createAuditDispatch(
  originalDispatch: React.Dispatch<any>,
) {
  const AUDITED_ACTIONS = new Set([
    'RESOLVE_INTENT',
    'SET_BENTO_LAYOUT',
    'QUEUE_ACTION',
    'EXECUTE_ACTION',
    'UNDO_ACTION',
    'START_APPROVAL_FLOW',
    'UPDATE_APPROVAL_STEP',
    'SET_THEME_MODE',
    'PURGE_SESSION',
  ])

  return (action: any) => {
    // Dispatch the original action first
    originalDispatch(action)

    // Auto-record audit event for tracked actions
    if (AUDITED_ACTIONS.has(action.type)) {
      const auditEvent: AuditEvent = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        type: mapActionToAuditType(action.type),
        actor: { type: 'system', id: 'orchestrator', label: 'Orchestrator System' },
        payload: sanitizeForAudit(action),
        hash: '',
        previousHash: '',
      }

      // Record to audit trail
      originalDispatch({ type: 'RECORD_AUDIT_EVENT', event: auditEvent })

      // Persist to OPFS
      appendAuditEvent(auditEvent).catch(console.error)
    }
  }
}

function mapActionToAuditType(actionType: string): AuditEventType {
  const mapping: Record<string, AuditEventType> = {
    RESOLVE_INTENT: 'INTENT_PARSED',
    SET_BENTO_LAYOUT: 'DATA_FETCHED',
    QUEUE_ACTION: 'ACTION_EXECUTED',
    EXECUTE_ACTION: 'ACTION_EXECUTED',
    UNDO_ACTION: 'ACTION_UNDONE',
    START_APPROVAL_FLOW: 'APPROVAL_STEP',
    UPDATE_APPROVAL_STEP: 'APPROVAL_STEP',
    SET_THEME_MODE: 'HUMAN_REVIEW',
    PURGE_SESSION: 'DATA_PURGE',
  }
  return mapping[actionType] ?? 'SESSION_START'
}

function sanitizeForAudit(action: any): Record<string, unknown> {
  const { type, ...rest } = action
  // Remove sensitive data before audit logging
  const sanitized = { ...rest }
  delete sanitized.passphrase
  delete sanitized.apiKey
  delete sanitized.token
  return sanitized
}
