/**
 * Route registry integrity test — scoped to Execute + Govern screens.
 *
 * Validates:
 * 1. All actionToDecision target GV IDs exist in AUDIT_DECISIONS
 * 2. Redesigned routes exist in both routeLoaders and BREADCRUMB_MAP
 */
import { describe, expect, it } from 'vitest'
import { routeLoaders } from '../router/lazyRoutes'
import { BREADCRUMB_MAP } from '../lib/breadcrumb-registry'
import { CANONICAL_UNIVERSE } from '../domain/poseidon-universe/canonical'
import { AUDIT_DECISIONS } from '../lib/govern-audit-data'

const REDESIGNED_ROUTES = [
  '/execute',
  '/execute/approval',
  '/execute/history',
  '/execute/queue',
  '/govern',
  '/govern/audit',
  '/govern/audit-detail',
] as const

describe('Route registry integrity (Execute + Govern)', () => {
  it.each(REDESIGNED_ROUTES)(
    '%s exists in routeLoaders',
    (route) => {
      expect(routeLoaders).toHaveProperty(route)
    },
  )

  it.each(REDESIGNED_ROUTES)(
    '%s exists in BREADCRUMB_MAP',
    (route) => {
      expect(BREADCRUMB_MAP).toHaveProperty(route)
    },
  )

  it('all actionToDecision target GV IDs exist in AUDIT_DECISIONS', () => {
    const { actionToDecision } = CANONICAL_UNIVERSE.relations
    for (const [actionId, govIds] of Object.entries(actionToDecision)) {
      for (const govId of govIds) {
        expect(
          AUDIT_DECISIONS[govId],
          `${actionId} → ${govId} not found in AUDIT_DECISIONS`,
        ).toBeDefined()
      }
    }
  })
})
