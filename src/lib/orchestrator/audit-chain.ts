/**
 * Orchestrator Workbench v2.0 — Audit Hash Chain
 * SHA-256 hash chain for tamper detection in the Semantic Audit Trail.
 */

import { sha256, generateId } from './crypto'
import type { AuditEvent, AuditEventType, SemanticAuditTrail } from './types'

const GENESIS_HASH = '0'.repeat(64)

/** Create a deterministic string from event data for hashing */
function serializeForHash(event: Omit<AuditEvent, 'hash'>): string {
  return JSON.stringify({
    id: event.id,
    timestamp: event.timestamp,
    type: event.type,
    actor: event.actor,
    payload: event.payload,
    previousHash: event.previousHash,
  })
}

/** Create a new audit event with proper hash chain linkage */
export async function createAuditEvent(
  type: AuditEventType,
  actor: AuditEvent['actor'],
  payload: Record<string, unknown>,
  previousHash: string = GENESIS_HASH,
): Promise<AuditEvent> {
  const event: Omit<AuditEvent, 'hash'> = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    type,
    actor,
    payload,
    previousHash,
  }

  const hash = await sha256(serializeForHash(event))

  return { ...event, hash }
}

/** Verify a single event's hash integrity */
export async function verifyEventHash(event: AuditEvent): Promise<boolean> {
  const { hash, ...rest } = event
  const expectedHash = await sha256(serializeForHash(rest))
  return hash === expectedHash
}

/** Verify the entire hash chain integrity */
export async function verifyChain(events: AuditEvent[]): Promise<boolean> {
  if (events.length === 0) return true

  // First event should link to genesis
  if (events[0].previousHash !== GENESIS_HASH) return false

  for (let i = 0; i < events.length; i++) {
    // Verify this event's own hash
    const valid = await verifyEventHash(events[i])
    if (!valid) return false

    // Verify chain linkage (each event's previousHash should match prior event's hash)
    if (i > 0 && events[i].previousHash !== events[i - 1].hash) {
      return false
    }
  }

  return true
}

/** Get the last hash in the chain (for appending new events) */
export function getLastHash(trail: SemanticAuditTrail): string {
  const { events } = trail
  return events.length > 0 ? events[events.length - 1].hash : GENESIS_HASH
}

/** Create an empty semantic audit trail */
export function createEmptyTrail(): SemanticAuditTrail {
  return {
    events: [],
    translations: [],
    addons: [],
    chainValid: true,
  }
}
