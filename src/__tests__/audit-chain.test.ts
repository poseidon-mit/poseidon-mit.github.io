import { describe, expect, it } from 'vitest'
import { selectAlertAuditChain } from '../domain/poseidon-universe'

describe('selectAlertAuditChain', () => {
  it('returns chain for THR-001 (single action, single decision)', () => {
    const chain = selectAlertAuditChain('THR-001')
    expect(chain).toEqual({
      alertId: 'THR-001',
      actionId: 'EXE-001',
      decisionId: 'GV-2026-0319-846',
    })
  })

  it('returns null for alert with no relations', () => {
    expect(selectAlertAuditChain('THR-999')).toBeNull()
  })

  it('returns null for alert not in alertToAction map', () => {
    // THR-002 exists as a threat but has no alertToAction relation
    expect(selectAlertAuditChain('THR-002')).toBeNull()
  })

  // Page-level invariant: the critical alert MUST resolve to exactly one chain
  it('critical alert THR-001 has unambiguous audit chain', () => {
    const chain = selectAlertAuditChain('THR-001')
    expect(chain).not.toBeNull()
    expect(chain!.alertId).toBe('THR-001')
    expect(chain!.actionId).toBe('EXE-001')
    expect(chain!.decisionId).toBe('GV-2026-0319-846')
  })
})
