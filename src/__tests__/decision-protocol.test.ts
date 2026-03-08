/**
 * Decision Protocol — structural validation tests.
 *
 * Ensures model roles reference valid agent-registry entries,
 * invocation policies don't overlap, and consensus params are in range.
 */
import { describe, expect, it } from 'vitest'
import {
  MODEL_ROLES,
  INVOCATION_POLICIES,
  DEFAULT_CONSENSUS,
  DATA_EXPOSURE_POLICIES,
  POLICY_ENGINE_MODEL_ID,
  REGISTRY_BACKED_ROLE_IDS,
} from '@/lib/decision-protocol'
import { AGENT_COLOR_REGISTRY } from '@/lib/orchestrator/workspace/v5/agent-registry'

describe('Decision Protocol', () => {
  describe('Model Roles', () => {
    it('registry-backed roles reference valid agent-registry entries', () => {
      const registryIds = Object.keys(AGENT_COLOR_REGISTRY)
      const registryRoles = MODEL_ROLES.filter(
        (r) => r.modelId !== POLICY_ENGINE_MODEL_ID,
      )

      for (const role of registryRoles) {
        expect(
          registryIds,
          `Role "${role.roleId}" references modelId "${role.modelId}" which is not in AGENT_COLOR_REGISTRY`,
        ).toContain(role.modelId)
      }
    })

    it('policy engine uses system-policy-engine modelId (non-registry actor)', () => {
      const policyRole = MODEL_ROLES.find((r) => r.roleId === 'policy')
      expect(policyRole).toBeDefined()
      expect(policyRole!.modelId).toBe('system-policy-engine')
      expect(Object.keys(AGENT_COLOR_REGISTRY)).not.toContain('system-policy-engine')
    })

    it('every role has a unique roleId', () => {
      const roleIds = MODEL_ROLES.map((r) => r.roleId)
      expect(new Set(roleIds).size).toBe(roleIds.length)
    })

    it('every role has a non-empty specialization', () => {
      for (const role of MODEL_ROLES) {
        expect(role.specialization.length).toBeGreaterThan(0)
      }
    })

    it('REGISTRY_BACKED_ROLE_IDS excludes the policy engine', () => {
      expect(REGISTRY_BACKED_ROLE_IDS).not.toContain('policy')
      expect(REGISTRY_BACKED_ROLE_IDS).toContain('compliance')
      expect(REGISTRY_BACKED_ROLE_IDS).toContain('document')
      expect(REGISTRY_BACKED_ROLE_IDS).toContain('strategy')
    })
  })

  describe('Invocation Policies', () => {
    it('modes are ordered by escalation level', () => {
      const modes = INVOCATION_POLICIES.map((p) => p.mode)
      expect(modes).toEqual(['single', 'cross-check', 'council'])
    })

    it('each policy has at least one required role', () => {
      for (const policy of INVOCATION_POLICIES) {
        expect(policy.requiredRoles.length).toBeGreaterThan(0)
      }
    })

    it('all required roles reference valid roleIds', () => {
      const allRoleIds = MODEL_ROLES.map((r) => r.roleId)
      for (const policy of INVOCATION_POLICIES) {
        for (const roleId of policy.requiredRoles) {
          expect(allRoleIds, `Unknown roleId "${roleId}" in ${policy.mode} policy`).toContain(roleId)
        }
      }
    })

    it('council mode requires human review', () => {
      const council = INVOCATION_POLICIES.find((p) => p.mode === 'council')
      expect(council?.humanReviewRequired).toBe(true)
    })

    it('higher modes are strict supersets of lower modes (role coverage)', () => {
      const single = INVOCATION_POLICIES.find((p) => p.mode === 'single')!
      const crossCheck = INVOCATION_POLICIES.find((p) => p.mode === 'cross-check')!
      const council = INVOCATION_POLICIES.find((p) => p.mode === 'council')!

      for (const role of single.requiredRoles) {
        expect(crossCheck.requiredRoles).toContain(role)
      }
      for (const role of crossCheck.requiredRoles) {
        expect(council.requiredRoles).toContain(role)
      }
    })
  })

  describe('Consensus Policy', () => {
    it('disagreement threshold is between 0 and 1', () => {
      expect(DEFAULT_CONSENSUS.disagreementThreshold).toBeGreaterThanOrEqual(0)
      expect(DEFAULT_CONSENSUS.disagreementThreshold).toBeLessThanOrEqual(1)
    })

    it('has a valid tie breaker', () => {
      expect(['policy-engine', 'human']).toContain(DEFAULT_CONSENSUS.tieBreaker)
    })

    it('has a valid escalation target', () => {
      expect(['senior-manager', 'compliance-officer']).toContain(
        DEFAULT_CONSENSUS.escalationTarget,
      )
    })
  })

  describe('Data Exposure Policies', () => {
    it('every role has a data exposure policy', () => {
      const roleIds = MODEL_ROLES.map((r) => r.roleId)
      const policyRoleIds = DATA_EXPOSURE_POLICIES.map((p) => p.roleId)
      for (const roleId of roleIds) {
        expect(policyRoleIds, `Missing data exposure policy for role "${roleId}"`).toContain(roleId)
      }
    })

    it('all policies opt out of training', () => {
      for (const policy of DATA_EXPOSURE_POLICIES) {
        expect(policy.trainingOptOut).toBe(true)
      }
    })

    it('policy engine has no raw data access', () => {
      const policyExposure = DATA_EXPOSURE_POLICIES.find((p) => p.roleId === 'policy')
      expect(policyExposure?.rawClientData).toBe(false)
      expect(policyExposure?.transactionDetails).toBe(false)
      expect(policyExposure?.piiFields).toBe('none')
    })

    it('compliance role has full data access', () => {
      const complianceExposure = DATA_EXPOSURE_POLICIES.find((p) => p.roleId === 'compliance')
      expect(complianceExposure?.rawClientData).toBe(true)
      expect(complianceExposure?.piiFields).toBe('full')
    })
  })
})
