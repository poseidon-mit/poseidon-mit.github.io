import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { ROUTE_META_CONTRACT } from '../contracts/rebuild-contracts'

describe('GovernFooter visibility policy follows conditional display rules', () => {

    // Routes where GovernFooter should be visible (detail/recommendation/approval pages)
    const routesWithFooter = ['/execute', '/govern']
    // Routes where GovernFooter should be hidden (overview/summary pages)
    const routesWithoutFooter = ['/dashboard', '/protect', '/grow']

    test('GovernFooter is visible on detail and approval routes', () => {
        for (const route of routesWithFooter) {
            const contract = ROUTE_META_CONTRACT[route]
            expect(contract, `Route contract missing for ${route}`).toBeTruthy()
            const showFooter = contract.governance.showFooter
            expect(showFooter, `${route} should have showFooter not false`).not.toBe(false)
        }
    })

    test('GovernFooter is hidden on overview routes', () => {
        for (const route of routesWithoutFooter) {
            const contract = ROUTE_META_CONTRACT[route]
            expect(contract, `Route contract missing for ${route}`).toBeTruthy()
            const showFooter = contract.governance.showFooter
            expect(showFooter, `${route} should have showFooter: false`).toBe(false)
        }
    })

    test('GovernFooter opacity is NOT physically reduced (e.g., AuthenticatedLayout.tsx)', () => {
        // Read AuthenticatedLayout source to verify no opacity reduction on GovernFooter
        const layoutSource = readFileSync(
            resolve(__dirname, '../components/layout/AuthenticatedLayout.tsx'),
            'utf-8'
        )

        // TARGET: GovernFooter should NOT be rendered with opacity-70
        // The footer is a critical trust signal — reducing its opacity undermines user confidence
        expect(layoutSource).not.toContain('opacity-70')
    })

})
