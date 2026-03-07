/**
 * Cryptographic utilities for Orchestrator Workbench v2.0
 * SHA-256 hashing + AES-256-GCM encryption via Web Crypto API
 */

/** Generate SHA-256 hash of arbitrary string content */
export async function sha256(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Shorten a hash for display (first 8 chars) */
export function shortHash(hash: string): string {
  return hash.slice(0, 8)
}

/** Generate a random UUID v4 (fallback for non-secure contexts like HTTP) */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback: manual UUID v4 using getRandomValues or Math.random
  const getRandomByte = typeof crypto !== 'undefined' && crypto.getRandomValues
    ? () => crypto.getRandomValues(new Uint8Array(1))[0]
    : () => Math.floor(Math.random() * 256)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = getRandomByte()
    const v = c === 'x' ? r & 0x0f : (r & 0x03) | 0x08
    return v.toString(16)
  })
}

// ─── AES-256-GCM ──────────────────────────────────────────────────────────────

const AES_ALGO = 'AES-GCM'
const IV_LENGTH = 12
const SALT_LENGTH = 16
const PBKDF2_ITERATIONS = 100_000

/** Derive an AES-256 key from a passphrase using PBKDF2 */
export async function deriveKey(
  passphrase: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: AES_ALGO, length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/** Encrypt plaintext with AES-256-GCM. Returns base64-encoded salt+iv+ciphertext */
export async function encrypt(plaintext: string, passphrase: string): Promise<string> {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const key = await deriveKey(passphrase, salt)

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: AES_ALGO, iv },
    key,
    encoder.encode(plaintext),
  )

  const combined = new Uint8Array(SALT_LENGTH + IV_LENGTH + cipherBuffer.byteLength)
  combined.set(salt, 0)
  combined.set(iv, SALT_LENGTH)
  combined.set(new Uint8Array(cipherBuffer), SALT_LENGTH + IV_LENGTH)

  return btoa(String.fromCharCode(...combined))
}

/** Decrypt base64-encoded salt+iv+ciphertext with AES-256-GCM */
export async function decrypt(encryptedBase64: string, passphrase: string): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0))
  const salt = combined.slice(0, SALT_LENGTH)
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH)

  const key = await deriveKey(passphrase, salt)
  const plainBuffer = await crypto.subtle.decrypt(
    { name: AES_ALGO, iv },
    key,
    ciphertext,
  )

  return new TextDecoder().decode(plainBuffer)
}
