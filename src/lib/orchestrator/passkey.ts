/**
 * Orchestrator Workbench v2.0 — Passkey (WebAuthn) Utilities
 * WebAuthn credential creation + assertion for Friction-Right execution.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PasskeyCredential {
  credentialId: string
  publicKey: string
  createdAt: string
  lastUsedAt: string
  label: string
}

export interface PasskeyAssertionResult {
  success: boolean
  credentialId: string | null
  verifiedAt: string
  error?: string
}

// ─── WebAuthn Availability ───────────────────────────────────────────────────

export function isWebAuthnAvailable(): boolean {
  return !!(
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential === 'function'
  )
}

export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnAvailable()) return false
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

// ─── Relying Party Config ────────────────────────────────────────────────────

const RP_NAME = 'Poseidon Orchestrator'
const RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

function getUserIdBytes(userId: string): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder()
  return encoder.encode(userId) as Uint8Array<ArrayBuffer>
}

function generateChallenge(): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(32)) as Uint8Array<ArrayBuffer>
}

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

// ─── Credential Registration ─────────────────────────────────────────────────

export async function registerPasskey(
  userId: string,
  displayName: string,
  label: string = 'Orchestrator Passkey',
): Promise<PasskeyCredential | null> {
  if (!isWebAuthnAvailable()) return null

  try {
    const challenge = generateChallenge()

    const createOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: RP_NAME,
        id: RP_ID,
      },
      user: {
        id: getUserIdBytes(userId),
        name: userId,
        displayName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },   // ES256
        { alg: -257, type: 'public-key' },  // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60_000,
      attestation: 'none',
    }

    const credential = (await navigator.credentials.create({
      publicKey: createOptions,
    })) as PublicKeyCredential | null

    if (!credential) return null

    const response = credential.response as AuthenticatorAttestationResponse
    const now = new Date().toISOString()

    return {
      credentialId: bufferToBase64(credential.rawId),
      publicKey: bufferToBase64(response.getPublicKey?.() ?? new ArrayBuffer(0)),
      createdAt: now,
      lastUsedAt: now,
      label,
    }
  } catch (error) {
    console.error('[Passkey] Registration failed:', error)
    return null
  }
}

// ─── Credential Assertion (Authentication) ───────────────────────────────────

export async function assertPasskey(
  allowCredentials?: PasskeyCredential[],
): Promise<PasskeyAssertionResult> {
  const now = new Date().toISOString()

  if (!isWebAuthnAvailable()) {
    return {
      success: false,
      credentialId: null,
      verifiedAt: now,
      error: 'WebAuthn not available',
    }
  }

  try {
    const challenge = generateChallenge()

    const requestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      rpId: RP_ID,
      userVerification: 'required',
      timeout: 60_000,
    }

    // If we have known credentials, include them
    if (allowCredentials?.length) {
      requestOptions.allowCredentials = allowCredentials.map((cred) => ({
        id: Uint8Array.from(atob(cred.credentialId), (c) => c.charCodeAt(0)),
        type: 'public-key' as const,
        transports: ['internal' as AuthenticatorTransport],
      }))
    }

    const assertion = (await navigator.credentials.get({
      publicKey: requestOptions,
    })) as PublicKeyCredential | null

    if (!assertion) {
      return {
        success: false,
        credentialId: null,
        verifiedAt: now,
        error: 'Assertion cancelled',
      }
    }

    return {
      success: true,
      credentialId: bufferToBase64(assertion.rawId),
      verifiedAt: now,
    }
  } catch (error) {
    return {
      success: false,
      credentialId: null,
      verifiedAt: now,
      error: error instanceof Error ? error.message : 'Assertion failed',
    }
  }
}

// ─── Demo Fallback (for environments without WebAuthn) ───────────────────────

export async function assertPasskeyDemo(): Promise<PasskeyAssertionResult> {
  // Simulate biometric delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    success: true,
    credentialId: 'demo-credential-' + Date.now(),
    verifiedAt: new Date().toISOString(),
  }
}
