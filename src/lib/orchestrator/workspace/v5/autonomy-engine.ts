/**
 * Orchestrator Workspace v5.0 — Autonomy Engine
 *
 * Maps AutonomyLevel to behavioral rules:
 *   - frictionScale: how aggressively friction gates engage
 *   - chatAutoOpen: whether chat opens automatically on AI actions
 *   - uiDensity: comfortable vs compact layout density
 *
 * Wraps existing FrictionPolicy / FRICTION_MATRIX — does NOT replace them.
 */

import type { AutonomyLevel, AutonomyConfig } from './v5-types'
import type { RiskLevel, FrictionPolicy } from '@/lib/orchestrator/types'
import { FRICTION_MATRIX } from '@/lib/orchestrator/types'

// ─── Autonomy Presets ────────────────────────────────────────────────────────

export const AUTONOMY_PRESETS: Record<AutonomyLevel, AutonomyConfig> = {
  copilot: {
    level: 'copilot',
    frictionScale: 1.0,
    chatAutoOpen: true,
    uiDensity: 'comfortable',
  },
  balanced: {
    level: 'balanced',
    frictionScale: 0.5,
    chatAutoOpen: false,
    uiDensity: 'comfortable',
  },
  autonomous: {
    level: 'autonomous',
    frictionScale: 0.0,
    chatAutoOpen: false,
    uiDensity: 'compact',
  },
}

// ─── Friction Scaling ────────────────────────────────────────────────────────

/**
 * Determine whether a friction gate should be shown at the current autonomy level.
 *
 * At frictionScale=1.0 (copilot): all friction gates are active.
 * At frictionScale=0.5 (balanced): only medium+ risk friction gates fire.
 * At frictionScale=0.0 (autonomous): only critical friction remains.
 */
export function shouldShowFrictionGate(
  riskLevel: RiskLevel,
  autonomyConfig: AutonomyConfig,
): boolean {
  const { frictionScale } = autonomyConfig

  // Critical friction is always active regardless of autonomy level
  if (riskLevel === 'critical') return true

  // Map risk levels to minimum frictionScale thresholds
  const thresholds: Record<RiskLevel, number> = {
    low: 0.8,      // Only show low-risk friction at near-full friction
    medium: 0.4,   // Show medium friction at balanced+
    high: 0.1,     // Show high friction except at full autonomous
    critical: 0.0, // Always show (handled above)
  }

  return frictionScale >= thresholds[riskLevel]
}

/**
 * Get the effective friction policy for a given risk level, considering autonomy.
 * Returns null if friction should be skipped entirely.
 */
export function getEffectiveFrictionPolicy(
  riskLevel: RiskLevel,
  autonomyConfig: AutonomyConfig,
): FrictionPolicy | null {
  if (!shouldShowFrictionGate(riskLevel, autonomyConfig)) {
    return null
  }
  return FRICTION_MATRIX[riskLevel]
}

// ─── Chat Visibility ─────────────────────────────────────────────────────────

/**
 * Whether the chat drawer should auto-open when an AI action occurs.
 */
export function shouldAutoOpenChat(autonomyConfig: AutonomyConfig): boolean {
  return autonomyConfig.chatAutoOpen
}

// ─── UI Density ──────────────────────────────────────────────────────────────

/**
 * Get CSS class modifiers based on autonomy-driven UI density.
 */
export function getDensityClasses(autonomyConfig: AutonomyConfig): {
  gridGap: string
  cardPadding: string
  fontSize: string
} {
  if (autonomyConfig.uiDensity === 'compact') {
    return {
      gridGap: 'gap-2',
      cardPadding: 'p-3',
      fontSize: 'text-xs',
    }
  }
  return {
    gridGap: 'gap-4',
    cardPadding: 'p-4',
    fontSize: 'text-sm',
  }
}

// ─── Level Labels ────────────────────────────────────────────────────────────

export const AUTONOMY_LABELS: Record<AutonomyLevel, { label: string; description: string }> = {
  copilot: {
    label: 'Copilot',
    description: 'Full friction on all actions. Chat opens automatically. Maximum human oversight.',
  },
  balanced: {
    label: 'Balanced',
    description: 'Friction on medium+ risk only. Chat available on demand. Default mode.',
  },
  autonomous: {
    label: 'Autonomous',
    description: 'Only critical friction gates. Compact UI. Suggestions auto-execute.',
  },
}
