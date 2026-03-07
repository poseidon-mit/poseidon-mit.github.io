/**
 * Orchestrator Workbench v2.0 — Local-First Hook
 * OPFS availability detection, encryption key management, offline detection.
 */

import { useEffect, useCallback } from 'react'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'

/** Check if the Origin Private File System (OPFS) API is available */
async function checkOpfsAvailable(): Promise<boolean> {
  try {
    if (!navigator.storage || !('getDirectory' in navigator.storage)) return false
    const root = await navigator.storage.getDirectory()
    return !!root
  } catch {
    return false
  }
}

export function useLocalFirst() {
  const { state, dispatch } = useWorkbenchContext()

  // ─── OPFS Detection ──────────────────────────────────────────────────────
  useEffect(() => {
    checkOpfsAvailable().then((available) => {
      dispatch({
        type: 'UPDATE_LOCAL_FIRST_STATUS',
        updates: { opfsAvailable: available },
      })
    })
  }, [dispatch])

  // ─── Offline Detection ───────────────────────────────────────────────────
  useEffect(() => {
    function handleOnline() {
      dispatch({
        type: 'UPDATE_LOCAL_FIRST_STATUS',
        updates: { isOffline: false, lastSyncAt: new Date().toISOString() },
      })
    }
    function handleOffline() {
      dispatch({
        type: 'UPDATE_LOCAL_FIRST_STATUS',
        updates: { isOffline: true },
      })
    }

    // Set initial state
    dispatch({
      type: 'UPDATE_LOCAL_FIRST_STATUS',
      updates: { isOffline: !navigator.onLine },
    })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [dispatch])

  // ─── Load Encryption Key ────────────────────────────────────────────────
  const loadEncryptionKey = useCallback(
    async (passphrase: string) => {
      try {
        // In production, derive key and store in memory
        // For now, just mark as loaded
        if (passphrase.length >= 8) {
          dispatch({
            type: 'UPDATE_LOCAL_FIRST_STATUS',
            updates: { encryptionKeyLoaded: true },
          })
          return true
        }
        return false
      } catch {
        return false
      }
    },
    [dispatch],
  )

  // ─── Clear Encryption Key ───────────────────────────────────────────────
  const clearEncryptionKey = useCallback(() => {
    dispatch({
      type: 'UPDATE_LOCAL_FIRST_STATUS',
      updates: { encryptionKeyLoaded: false },
    })
  }, [dispatch])

  return {
    localFirstStatus: state.localFirstStatus,
    loadEncryptionKey,
    clearEncryptionKey,
  }
}
