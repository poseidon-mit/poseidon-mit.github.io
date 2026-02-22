import { describe, expect, it } from 'vitest'
import {
  THREATS,
  ALERT_FACTOR_ITEMS,
  ALERT_TIMING,
  MITIGATING_TOTAL,
  deriveFactors,
} from '../pages/protect/protect-data'

const threatIds = THREATS.map(t => t.id)

describe('Protect ↔ AlertDetail data consistency', () => {
  it('every THREATS entry has a matching ALERT_FACTOR_ITEMS entry', () => {
    for (const id of threatIds) {
      expect(ALERT_FACTOR_ITEMS[id], `Missing ALERT_FACTOR_ITEMS for ${id}`).toBeDefined()
    }
  })

  it('every THREATS entry has a matching ALERT_TIMING entry', () => {
    for (const id of threatIds) {
      expect(ALERT_TIMING[id], `Missing ALERT_TIMING for ${id}`).toBeDefined()
    }
  })

  it('ALERT_FACTOR_ITEMS has no orphan entries without a matching THREATS entry', () => {
    for (const id of Object.keys(ALERT_FACTOR_ITEMS)) {
      expect(threatIds, `Orphan ALERT_FACTOR_ITEMS entry ${id}`).toContain(id)
    }
  })

  it('ALERT_TIMING has no orphan entries without a matching THREATS entry', () => {
    for (const id of Object.keys(ALERT_TIMING)) {
      expect(threatIds, `Orphan ALERT_TIMING entry ${id}`).toContain(id)
    }
  })
})

describe('AlertDetail factor structure', () => {
  it.each(Object.entries(ALERT_FACTOR_ITEMS))(
    '%s has exactly 5 risk + 2 mitigating factors',
    (id, items) => {
      const risk = items.filter(i => !i.mitigating)
      const safe = items.filter(i => i.mitigating)
      expect(risk).toHaveLength(5)
      expect(safe).toHaveLength(2)
    },
  )

  it.each(Object.entries(ALERT_FACTOR_ITEMS))(
    '%s — all factors have model version',
    (_id, items) => {
      for (const item of items) {
        expect(item.model, `Factor "${item.title}" missing model`).toBeTruthy()
        expect(item.model).toMatch(/v\d+\.\d+/)
      }
    },
  )

  it.each(Object.entries(ALERT_FACTOR_ITEMS))(
    '%s — all factors have non-empty details',
    (_id, items) => {
      for (const item of items) {
        expect(item.details.length, `Factor "${item.title}" has empty details`).toBeGreaterThan(20)
      }
    },
  )

  it.each(Object.entries(ALERT_FACTOR_ITEMS))(
    '%s — factor IDs are unique',
    (_id, items) => {
      const ids = items.map(i => i.id)
      expect(new Set(ids).size).toBe(ids.length)
    },
  )
})

describe('deriveFactors rounding — Final Risk Score === confidence', () => {
  it.each(THREATS.map(t => [t.id, t.confidence] as const))(
    '%s (confidence=%s) — sum of derived values equals confidence exactly',
    (id, confidence) => {
      const items = ALERT_FACTOR_ITEMS[id]
      if (!items) return // covered by consistency test above

      const derived = deriveFactors(items, confidence)
      const total = Math.round(derived.reduce((s, d) => s + d.value, 0) * 100) / 100

      expect(total).toBe(confidence)
    },
  )

  it.each(THREATS.map(t => [t.id, t.confidence] as const))(
    '%s — risk factors sum to confidence + MITIGATING_TOTAL',
    (id, confidence) => {
      const items = ALERT_FACTOR_ITEMS[id]
      if (!items) return

      const derived = deriveFactors(items, confidence)
      const riskSum = Math.round(derived.filter(d => !d.mitigating).reduce((s, d) => s + d.value, 0) * 100) / 100
      const safeSum = Math.round(derived.filter(d => d.mitigating).reduce((s, d) => s + Math.abs(d.value), 0) * 100) / 100

      // Risk items should approximately sum to confidence + MITIGATING_TOTAL (±0.01 from rounding adjustment)
      expect(riskSum).toBeGreaterThanOrEqual(confidence)
      expect(riskSum).toBeLessThanOrEqual(confidence + MITIGATING_TOTAL + 0.01)

      // Mitigating items should sum to approximately MITIGATING_TOTAL
      expect(safeSum).toBeGreaterThanOrEqual(MITIGATING_TOTAL - 0.01)
      expect(safeSum).toBeLessThanOrEqual(MITIGATING_TOTAL + 0.01)
    },
  )
})

describe('AlertDetail factor details reference correct alert data', () => {
  it.each(THREATS.map(t => [t.id, t.merchant, t.amount] as const))(
    '%s — at least one factor detail mentions merchant or amount',
    (id, merchant, amount) => {
      const items = ALERT_FACTOR_ITEMS[id]
      if (!items) return

      const allDetails = items.map(i => i.details).join(' ')
      const amountNum = amount.replace(/[^0-9.,]/g, '')

      const mentionsMerchant = allDetails.includes(merchant) || allDetails.toLowerCase().includes(merchant.toLowerCase())
      const mentionsAmount = allDetails.includes(amount) || allDetails.includes(amountNum)

      expect(
        mentionsMerchant || mentionsAmount,
        `${id}: no factor details mention merchant "${merchant}" or amount "${amount}"`,
      ).toBe(true)
    },
  )
})
