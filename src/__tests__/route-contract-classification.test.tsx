import { describe, test, expect } from 'vitest'
import { TARGET_SCOPE_READY_ROUTES } from '../contracts/rebuild-contracts'

// 🚨 MANDATORY REWRITE GATE: route-contract-classification.test.tsx
// 1. `/deck`, `/share`, `/orchestrator`, and `/test/spectacular` are completely eradicated from the `TARGET_SCOPE_READY_ROUTES`.
// 2. `/protect/dispute` is eradicated.

describe('Internal, pitch, and orchestrator routes are definitively excluded', () => {
    test('TARGET_SCOPE_READY_ROUTES does not contain B2B or internal paths', () => {
        const invalidRoutes = ['/deck', '/share', '/orchestrator', '/test/spectacular', '/protect/dispute']

        invalidRoutes.forEach(route => {
            expect(TARGET_SCOPE_READY_ROUTES.includes(route)).toBe(false)
        })
    })
})
