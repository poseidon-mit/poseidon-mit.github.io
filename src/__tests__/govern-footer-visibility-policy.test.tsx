import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { ROUTE_META_CONTRACT } from '../contracts/rebuild-contracts'

describe('GovernFooter is a visible persistent proof system on critical routes', () => {

    const flagshipRoutes = ['/dashboard', '/protect', '/grow', '/execute', '/govern']

    test('GovernFooter visibility policy is updated in route contracts', () => {
        // TARGET: All flagship routes must have showFooter: true (or undefined, which defaults to true)
        for (const route of flagshipRoutes) {
            const contract = ROUTE_META_CONTRACT[route]
            expect(contract, `Route contract missing for ${route}`).toBeTruthy()

            const showFooter = contract.governance.showFooter
            // showFooter must be true (not explicitly false)
            expect(showFooter).not.toBe(false)
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
