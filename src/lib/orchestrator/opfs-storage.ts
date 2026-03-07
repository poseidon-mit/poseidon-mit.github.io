/**
 * Orchestrator Workbench v2.0 — OPFS Storage
 * Origin Private File System (OPFS) read/write for local-first persistence.
 * AES-256-GCM encrypted storage with auto-purge support.
 */

import { encrypt, decrypt } from './crypto'

// ─── OPFS Directory Structure ────────────────────────────────────────────────

const ROOT_DIR = 'poseidon-orchestrator'
const SESSIONS_DIR = 'sessions'
const AUDIT_DIR = 'audit'
const CACHE_DIR = 'cache'

// ─── OPFS Availability ──────────────────────────────────────────────────────

export async function isOpfsAvailable(): Promise<boolean> {
  try {
    if (!navigator.storage || !('getDirectory' in navigator.storage)) return false
    const root = await navigator.storage.getDirectory()
    return !!root
  } catch {
    return false
  }
}

// ─── Directory Access ────────────────────────────────────────────────────────

async function getOrCreateDir(
  parent: FileSystemDirectoryHandle,
  name: string,
): Promise<FileSystemDirectoryHandle> {
  return parent.getDirectoryHandle(name, { create: true })
}

async function getRootDir(): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory()
  return getOrCreateDir(root, ROOT_DIR)
}

async function getSessionDir(sessionId: string): Promise<FileSystemDirectoryHandle> {
  const root = await getRootDir()
  const sessions = await getOrCreateDir(root, SESSIONS_DIR)
  return getOrCreateDir(sessions, sessionId)
}

async function getAuditDir(): Promise<FileSystemDirectoryHandle> {
  const root = await getRootDir()
  return getOrCreateDir(root, AUDIT_DIR)
}

async function getCacheDir(): Promise<FileSystemDirectoryHandle> {
  const root = await getRootDir()
  return getOrCreateDir(root, CACHE_DIR)
}

// ─── Read/Write Primitives ───────────────────────────────────────────────────

async function writeFile(
  dir: FileSystemDirectoryHandle,
  filename: string,
  content: string,
): Promise<void> {
  const fileHandle = await dir.getFileHandle(filename, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(content)
  await writable.close()
}

async function readFile(
  dir: FileSystemDirectoryHandle,
  filename: string,
): Promise<string | null> {
  try {
    const fileHandle = await dir.getFileHandle(filename)
    const file = await fileHandle.getFile()
    return file.text()
  } catch {
    return null
  }
}

async function deleteFile(
  dir: FileSystemDirectoryHandle,
  filename: string,
): Promise<boolean> {
  try {
    await dir.removeEntry(filename)
    return true
  } catch {
    return false
  }
}

// ─── Encrypted Storage ───────────────────────────────────────────────────────

export async function writeEncrypted(
  dir: FileSystemDirectoryHandle,
  filename: string,
  data: unknown,
  passphrase: string,
): Promise<void> {
  const json = JSON.stringify(data)
  const encrypted = await encrypt(json, passphrase)
  await writeFile(dir, filename, encrypted)
}

export async function readEncrypted<T>(
  dir: FileSystemDirectoryHandle,
  filename: string,
  passphrase: string,
): Promise<T | null> {
  const encrypted = await readFile(dir, filename)
  if (!encrypted) return null
  try {
    const json = await decrypt(encrypted, passphrase)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

// ─── Session Storage ─────────────────────────────────────────────────────────

export interface SessionSnapshot {
  sessionId: string
  state: unknown
  savedAt: string
  version: string
}

export async function saveSession(
  sessionId: string,
  state: unknown,
  passphrase?: string,
): Promise<void> {
  const dir = await getSessionDir(sessionId)
  const snapshot: SessionSnapshot = {
    sessionId,
    state,
    savedAt: new Date().toISOString(),
    version: '2.0.0',
  }

  if (passphrase) {
    await writeEncrypted(dir, 'state.enc', snapshot, passphrase)
  } else {
    await writeFile(dir, 'state.json', JSON.stringify(snapshot))
  }
}

export async function loadSession(
  sessionId: string,
  passphrase?: string,
): Promise<SessionSnapshot | null> {
  const dir = await getSessionDir(sessionId)

  if (passphrase) {
    return readEncrypted<SessionSnapshot>(dir, 'state.enc', passphrase)
  }

  const json = await readFile(dir, 'state.json')
  if (!json) return null
  try {
    return JSON.parse(json) as SessionSnapshot
  } catch {
    return null
  }
}

// ─── Audit Chain Storage ─────────────────────────────────────────────────────

export async function appendAuditEvent(event: unknown): Promise<void> {
  const dir = await getAuditDir()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await writeFile(dir, `event-${timestamp}.json`, JSON.stringify(event))
}

export async function listAuditEvents(): Promise<string[]> {
  try {
    const dir = await getAuditDir()
    const entries: string[] = []
    for await (const [name] of (dir as any).entries()) {
      if (name.startsWith('event-') && name.endsWith('.json')) {
        entries.push(name)
      }
    }
    return entries.sort()
  } catch {
    return []
  }
}

// ─── Cache Storage ───────────────────────────────────────────────────────────

export async function cacheData(key: string, data: unknown, ttlMs: number = 300_000): Promise<void> {
  const dir = await getCacheDir()
  const entry = {
    data,
    cachedAt: Date.now(),
    expiresAt: Date.now() + ttlMs,
  }
  await writeFile(dir, `${key}.json`, JSON.stringify(entry))
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  const dir = await getCacheDir()
  const json = await readFile(dir, `${key}.json`)
  if (!json) return null
  try {
    const entry = JSON.parse(json) as { data: T; expiresAt: number }
    if (Date.now() > entry.expiresAt) {
      await deleteFile(dir, `${key}.json`)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

// ─── Auto-Purge ──────────────────────────────────────────────────────────────

export async function purgeExpiredSessions(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<number> {
  let purged = 0
  try {
    const root = await getRootDir()
    const sessions = await getOrCreateDir(root, SESSIONS_DIR)
    const now = Date.now()

    for await (const [name, handle] of (sessions as any).entries()) {
      if (handle.kind !== 'directory') continue
      try {
        const dir = await sessions.getDirectoryHandle(name)
        // Check state file modification time
        const stateHandle = await dir.getFileHandle('state.json').catch(() => null)
        if (stateHandle) {
          const file = await stateHandle.getFile()
          if (now - file.lastModified > maxAgeMs) {
            await sessions.removeEntry(name, { recursive: true })
            purged++
          }
        }
      } catch {
        // Skip entries that can't be read
      }
    }
  } catch {
    // OPFS not available or permission denied
  }
  return purged
}

/**
 * Purge all local data (nuclear option for GDPR/security).
 */
export async function purgeAllData(): Promise<void> {
  try {
    const root = await navigator.storage.getDirectory()
    await root.removeEntry(ROOT_DIR, { recursive: true })
  } catch {
    // Already empty or not available
  }
}
