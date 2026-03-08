import type { ExecuteActionEntity } from '@/domain/poseidon-universe/types'

export type RiskTier = 1 | 2

export function getRiskTier(action: ExecuteActionEntity): RiskTier {
  return action.riskTier
}

export const RISK_TIER_CONFIG = {
  1: { label: 'Immediate Attention', description: 'Lower-risk batch operations', batchable: true },
  2: { label: 'Background Optimizations', description: 'Requires individual review', batchable: false },
} as const
