/**
 * Decision Protocol — Multi-Model Deliberation Architecture
 *
 * Defines the decision governance layer for Poseidon's Institutional Assurance tier:
 * model roles, invocation policies, consensus rules, fallback behavior, and data exposure.
 *
 * This is a data/types file — no UI. The UI consumes these definitions
 * via selectors and deliberation traces in the canonical universe.
 */

// ─── Model Roles ────────────────────────────────────────────────────────────

export type DataAccessLevel = 'full' | 'redacted-summary' | 'metadata-only' | 'none'

export interface ModelRole {
  roleId: string
  label: string
  modelId: string
  specialization: string
  dataAccess: DataAccessLevel
}

/**
 * modelId values MUST match AGENT_COLOR_REGISTRY entries in agent-registry.ts,
 * except 'system-policy-engine' which is a deterministic trust mechanism, not a frontier model.
 */
export const MODEL_ROLES: ModelRole[] = [
  {
    roleId: 'compliance',
    label: 'Compliance AI',
    modelId: 'claude-sonnet-4-6',
    specialization: 'AML, sanctions, regulatory policy risk',
    dataAccess: 'full',
  },
  {
    roleId: 'document',
    label: 'Document AI',
    modelId: 'gpt-4o',
    specialization: 'Correspondence/context extraction, document analysis',
    dataAccess: 'redacted-summary',
  },
  {
    roleId: 'strategy',
    label: 'Financial Strategy AI',
    modelId: 'claude-opus-4-6',
    specialization: 'Alternatives, economic tradeoffs, scenario modeling',
    dataAccess: 'redacted-summary',
  },
  {
    roleId: 'policy',
    label: 'Policy Engine',
    modelId: 'system-policy-engine',
    specialization: 'Deterministic rule enforcement, threshold checks',
    dataAccess: 'metadata-only',
  },
]

/** The policy engine modelId — NOT in agent-registry, validated separately. */
export const POLICY_ENGINE_MODEL_ID = 'system-policy-engine'

/** Registry-backed role IDs (frontier models with agent-registry entries). */
export const REGISTRY_BACKED_ROLE_IDS = MODEL_ROLES
  .filter((r) => r.modelId !== POLICY_ENGINE_MODEL_ID)
  .map((r) => r.roleId)

// ─── Invocation Policies ────────────────────────────────────────────────────

export type InvocationMode = 'single' | 'cross-check' | 'council'

export interface InvocationPolicy {
  mode: InvocationMode
  trigger: string
  requiredRoles: string[]
  humanReviewRequired: boolean
}

export const INVOCATION_POLICIES: InvocationPolicy[] = [
  {
    mode: 'single',
    trigger: 'Routine operations under $1K, pre-approved categories',
    requiredRoles: ['compliance'],
    humanReviewRequired: false,
  },
  {
    mode: 'cross-check',
    trigger: 'Standard operations $1K–$10K or elevated-risk merchants',
    requiredRoles: ['compliance', 'strategy'],
    humanReviewRequired: false,
  },
  {
    mode: 'council',
    trigger: 'Capital movement >$10K, international transfers, regulatory flags, flagged merchants',
    requiredRoles: ['compliance', 'document', 'strategy', 'policy'],
    humanReviewRequired: true,
  },
]

// ─── Consensus Rules ────────────────────────────────────────────────────────

export type ConsensusMethod =
  | 'unanimous'
  | 'majority'
  | 'weighted-vote'
  | 'policy-override'
  | 'mandatory-human'

export interface ConsensusPolicy {
  method: ConsensusMethod
  disagreementThreshold: number // 0–1, triggers escalation when exceeded
  tieBreaker: 'policy-engine' | 'human'
  escalationTarget: 'senior-manager' | 'compliance-officer'
}

export const DEFAULT_CONSENSUS: ConsensusPolicy = {
  method: 'weighted-vote',
  disagreementThreshold: 0.3,
  tieBreaker: 'human',
  escalationTarget: 'compliance-officer',
}

// ─── Fallback Rules ─────────────────────────────────────────────────────────

export interface FallbackPolicy {
  providerUnavailable: 'degrade-gracefully'
  lowConfidence: 'flag-and-escalate'
  materialDisagreement: 'mandatory-human-review'
  latencyExceeded: 'proceed-with-available-and-flag'
}

export const FALLBACK_POLICY: FallbackPolicy = {
  providerUnavailable: 'degrade-gracefully',
  lowConfidence: 'flag-and-escalate',
  materialDisagreement: 'mandatory-human-review',
  latencyExceeded: 'proceed-with-available-and-flag',
}

/**
 * Degradation chain when providers are unavailable:
 *   council → cross-check → single + mandatory human
 */
export const DEGRADATION_CHAIN: InvocationMode[] = ['council', 'cross-check', 'single']

// ─── Data Exposure Policies ─────────────────────────────────────────────────

export type PiiHandling = 'full' | 'redacted' | 'hashed' | 'none'

export interface DataExposurePolicy {
  roleId: string
  rawClientData: boolean
  transactionDetails: boolean
  piiFields: PiiHandling
  retentionDays: number
  trainingOptOut: boolean
  providerGuarantee: string
}

export const DATA_EXPOSURE_POLICIES: DataExposurePolicy[] = [
  {
    roleId: 'compliance',
    rawClientData: true,
    transactionDetails: true,
    piiFields: 'full',
    retentionDays: 0,
    trainingOptOut: true,
    providerGuarantee: 'Anthropic zero-retention API',
  },
  {
    roleId: 'document',
    rawClientData: false,
    transactionDetails: false,
    piiFields: 'redacted',
    retentionDays: 0,
    trainingOptOut: true,
    providerGuarantee: 'OpenAI zero-retention API',
  },
  {
    roleId: 'strategy',
    rawClientData: false,
    transactionDetails: false,
    piiFields: 'redacted',
    retentionDays: 0,
    trainingOptOut: true,
    providerGuarantee: 'Anthropic zero-retention API',
  },
  {
    roleId: 'policy',
    rawClientData: false,
    transactionDetails: false,
    piiFields: 'none',
    retentionDays: 0,
    trainingOptOut: true,
    providerGuarantee: 'On-premise deterministic engine — no external data transmission',
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getRoleById(roleId: string): ModelRole | undefined {
  return MODEL_ROLES.find((r) => r.roleId === roleId)
}

export function getRoleLabel(roleId: string): string {
  return getRoleById(roleId)?.label ?? roleId
}

export function isPolicyEngine(modelId: string): boolean {
  return modelId === POLICY_ENGINE_MODEL_ID
}

export function getRequiredRolesForMode(mode: InvocationMode): string[] {
  const policy = INVOCATION_POLICIES.find((p) => p.mode === mode)
  return policy?.requiredRoles ?? []
}
