/**
 * Orchestrator Workbench v2.0 — Passkey Hook
 * Manage WebAuthn passkey lifecycle: register, authenticate, credential storage.
 */

import { useState, useCallback } from 'react'
import {
  isWebAuthnAvailable,
  isPlatformAuthenticatorAvailable,
  registerPasskey,
  assertPasskey,
  assertPasskeyDemo,
  type PasskeyCredential,
  type PasskeyAssertionResult,
} from '@/lib/orchestrator/passkey'

export type PasskeyStatus = 'idle' | 'registering' | 'authenticating' | 'authenticated' | 'error'

export interface UsePasskeyReturn {
  status: PasskeyStatus
  isAvailable: boolean
  credentials: PasskeyCredential[]
  lastAssertion: PasskeyAssertionResult | null
  error: string | null
  register: (userId: string, displayName: string) => Promise<boolean>
  authenticate: () => Promise<boolean>
  clearCredentials: () => void
}

export function usePasskey(): UsePasskeyReturn {
  const [status, setStatus] = useState<PasskeyStatus>('idle')
  const [credentials, setCredentials] = useState<PasskeyCredential[]>([])
  const [lastAssertion, setLastAssertion] = useState<PasskeyAssertionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAvailable] = useState(() => isWebAuthnAvailable())

  const register = useCallback(
    async (userId: string, displayName: string): Promise<boolean> => {
      setStatus('registering')
      setError(null)

      try {
        const hasPlatform = await isPlatformAuthenticatorAvailable()
        if (!hasPlatform) {
          setError('Platform authenticator not available')
          setStatus('error')
          return false
        }

        const credential = await registerPasskey(userId, displayName)
        if (!credential) {
          setError('Registration cancelled or failed')
          setStatus('error')
          return false
        }

        setCredentials((prev) => [...prev, credential])
        setStatus('idle')
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Registration failed')
        setStatus('error')
        return false
      }
    },
    [],
  )

  const authenticate = useCallback(async (): Promise<boolean> => {
    setStatus('authenticating')
    setError(null)

    try {
      let result: PasskeyAssertionResult

      if (isAvailable) {
        result = await assertPasskey(credentials.length > 0 ? credentials : undefined)
      } else {
        // Demo fallback
        result = await assertPasskeyDemo()
      }

      setLastAssertion(result)

      if (result.success) {
        setStatus('authenticated')
        // Update lastUsedAt on matched credential
        if (result.credentialId) {
          setCredentials((prev) =>
            prev.map((c) =>
              c.credentialId === result.credentialId
                ? { ...c, lastUsedAt: result.verifiedAt }
                : c,
            ),
          )
        }
        return true
      } else {
        setError(result.error ?? 'Authentication failed')
        setStatus('error')
        return false
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed')
      setStatus('error')
      return false
    }
  }, [isAvailable, credentials])

  const clearCredentials = useCallback(() => {
    setCredentials([])
    setLastAssertion(null)
    setStatus('idle')
    setError(null)
  }, [])

  return {
    status,
    isAvailable,
    credentials,
    lastAssertion,
    error,
    register,
    authenticate,
    clearCredentials,
  }
}
