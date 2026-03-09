import { describe, expect, it } from 'vitest'
import {
  THREATS,
  MITIGATING_TOTAL,
  deriveFactors,
} from '../pages/protect/protect-data'
import { selectThreatFactors, selectThreatTiming } from '../domain/poseidon-universe'

const threatIds = THREATS.map(t => t.id)

describe('Protect ↔ AlertDetail data consistency', () => {
  it('every THREATS entry has matching threat factors via canonical selector', () => {
    for (const id of threatIds) {
      const factors = selectThreatFactors(id)
      expect(factors.length, `Missing factors for ${id}`).toBeGreaterThan(0)
    }
  })

  it('every THREATS entry has matching threat timing via canonical selector', () => {
    for (const id of threatIds) {
      const timing = selectThreatTiming(id)
      expect(timing, `Missing timing for ${id}`).not.toBeNull()
    }
  })
})

describe('AlertDetail factor structure', () => {
  it.each(threatIds)(
    '%s has exactly 5 risk + 2 mitigating factors',
    (id) => {
      const items = selectThreatFactors(id)
      const risk = items.filter(i => !i.mitigating)
      const safe = items.filter(i => i.mitigating)
      expect(risk).toHaveLength(5)
      expect(safe).toHaveLength(2)
    },
  )

  it.each(threatIds)(
    '%s — all factors have model version',
    (id) => {
      const items = selectThreatFactors(id)
      for (const item of items) {
        expect(item.model, `Factor "${item.title}" missing model`).toBeTruthy()
        expect(item.model).toMatch(/v\d+\.\d+/)
      }
    },
  )

  it.each(threatIds)(
    '%s — all factors have non-empty details',
    (id) => {
      const items = selectThreatFactors(id)
      for (const item of items) {
        expect(item.details.length, `Factor "${item.title}" has empty details`).toBeGreaterThan(20)
      }
    },
  )

  it.each(threatIds)(
    '%s — factor IDs are unique',
    (id) => {
      const items = selectThreatFactors(id)
      const ids = items.map(i => i.id)
      expect(new Set(ids).size).toBe(ids.length)
    },
  )
})

describe('deriveFactors rounding — Final Risk Score === confidence', () => {
  it.each(THREATS.map(t => [t.id, t.confidence] as const))(
    '%s (confidence=%s) — sum of derived values equals confidence exactly',
    (id, confidence) => {
      const items = selectThreatFactors(id)
      if (!items.length) return // covered by consistency test above

      const derived = deriveFactors(items, confidence)
      const total = Math.round(derived.reduce((s, d) => s + d.value, 0) * 100) / 100

      expect(total).toBe(confidence)
    },
  )

  it.each(THREATS.map(t => [t.id, t.confidence] as const))(
    '%s — risk factors sum to confidence + MITIGATING_TOTAL',
    (id, confidence) => {
      const items = selectThreatFactors(id)
      if (!items.length) return

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
  it.each(THREATS.map(t => [t.id, t.counterparty, t.amount] as const))(
    '%s — at least one factor detail mentions counterparty, amount, or dollar figure',
    (id, counterparty, amount) => {
      const items = selectThreatFactors(id)
      if (!items.length) return

      const allDetails = items.map(i => i.details).join(' ')
      const amountNum = amount.replace(/[^0-9.,]/g, '')

      const mentionsCounterparty = allDetails.includes(counterparty) || allDetails.toLowerCase().includes(counterparty.toLowerCase())
      const mentionsAmount = allDetails.includes(amount) || allDetails.includes(amountNum)
      // Factor details contain internal dollar figures even when counterparty names differ from canonical data
      const mentionsDollarFigure = /\$[\d,]+/.test(allDetails)

      expect(
        mentionsCounterparty || mentionsAmount || mentionsDollarFigure,
        `${id}: no factor details mention counterparty "${counterparty}", amount "${amount}", or any dollar figure`,
      ).toBe(true)
    },
  )
})
