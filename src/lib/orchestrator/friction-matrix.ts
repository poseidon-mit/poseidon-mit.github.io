/**
 * Orchestrator Workbench v2.0 — Friction Matrix
 * Risk-level → friction-tier mapping with policy resolution.
 */

import type {
  ActionSpec,
  FrictionPolicy,
  FrictionRequirement,
  FrictionTier,
  RiskLevel,
  FRICTION_MATRIX,
} from './types'
import { FRICTION_MATRIX as MATRIX } from './types'

/** Get the friction policy for a given risk level */
export function getFrictionPolicy(riskLevel: RiskLevel): FrictionPolicy {
  return MATRIX[riskLevel]
}

/** Determine if an action requires any form of approval */
export function requiresApproval(action: ActionSpec): boolean {
  const policy = getFrictionPolicy(action.riskLevel)
  return policy.requirements.some(
    (r) => r.type === 'four-eyes' || r.type === 'passkey-auth',
  )
}

/** Determine if an action requires passkey authentication */
export function requiresPasskey(riskLevel: RiskLevel): boolean {
  const policy = getFrictionPolicy(riskLevel)
  return policy.requirements.some((r) => r.type === 'passkey-auth')
}

/** Determine if an action requires multi-party approval */
export function requiresFourEyes(riskLevel: RiskLevel): boolean {
  const policy = getFrictionPolicy(riskLevel)
  return policy.requirements.some((r) => r.type === 'four-eyes')
}

/** Get the undo window duration in hours (always 72h per spec) */
export function getUndoWindowHours(riskLevel: RiskLevel): number {
  const policy = getFrictionPolicy(riskLevel)
  const undoReq = policy.requirements.find((r) => r.type === 'undo-window')
  return undoReq?.type === 'undo-window' ? undoReq.windowHours : 72
}

/** Get human-readable friction tier label */
export function getFrictionLabel(tier: FrictionTier): string {
  switch (tier) {
    case 'transparent':
      return '自動実行'
    case 'confirm':
      return 'ワンクリック確認'
    case 'verify':
      return '本人確認必須'
    case 'multi-approve':
      return '複数承認必須'
  }
}

/** Get friction tier color for UI display */
export function getFrictionColor(tier: FrictionTier): string {
  switch (tier) {
    case 'transparent':
      return 'var(--engine-protect)'
    case 'confirm':
      return 'var(--engine-dashboard)'
    case 'verify':
      return 'var(--engine-execute)'
    case 'multi-approve':
      return 'hsl(0 84% 60%)'
  }
}

/** Calculate undo expiration timestamp from execution time */
export function calculateUndoExpiry(executedAt: string, riskLevel: RiskLevel): string {
  const hours = getUndoWindowHours(riskLevel)
  const expiry = new Date(executedAt)
  expiry.setHours(expiry.getHours() + hours)
  return expiry.toISOString()
}
