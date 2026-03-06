/**
 * Shared trust policy constants.
 * Coherence tests bind these to canonical universe invariants.
 */
export const TRUST_POLICIES = {
  readOnlyApis: 'Read-only bank connections',
  soc2: 'SOC 2 Type II in progress',
  encryption: 'Bank-Level Data Protection',
  llmZeroRetention: 'LLM Zero-Retention',
} as const

/** Trust bar items for Landing hero (ordered). */
export const TRUST_BAR_ITEMS = [
  TRUST_POLICIES.readOnlyApis,
  TRUST_POLICIES.soc2,
  TRUST_POLICIES.encryption,
  TRUST_POLICIES.llmZeroRetention,
] as const

/** Govern Zone B policy prose. */
export const PRIVACY_MANDATES = [
  'LLM inference data is ephemeral — prompts and completions are not retained after response generation.',
  'User financial data is never used for model training or fine-tuning.',
  'Audit logs and decision records are retained per compliance schedule (90 days–7 years) and are never purged without governance approval.',
  'All bank connectivity uses read-only API tokens. No write access to external accounts.',
] as const
