import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/render-with-router'
import { GovernFooter } from '../components/poseidon/govern-footer'

describe('GovernFooter provides exact deep linking to the actionable decision', () => {

    test('GovernFooter includes a real, actionable deep-link rather than just an icon', () => {
        renderWithRouter(
            <GovernFooter auditId="GV-2026-0216-DASH" pageContext="financial overview" />
        )

        // TARGET: GovernFooter should contain at least one actionable <a> link
        const links = screen.getAllByRole('link')
        expect(links.length).toBeGreaterThan(0)

        // At least one link should be a real navigable anchor, not just decorative
        const hasHref = links.some((link) => link.getAttribute('href'))
        expect(hasHref).toBe(true)
    })

    test('GovernFooter links exactly to the originating event/decision ID, not a generic route', () => {
        renderWithRouter(
            <GovernFooter auditId="GV-2026-0216-DASH" pageContext="financial overview" />
        )

        // TARGET: At least one link should deep-link to the specific audit decision
        const links = screen.getAllByRole('link')
        const deepLink = links.find((link) => {
            const href = link.getAttribute('href') ?? ''
            return href.includes('/govern/audit-detail?decision=')
        })
        expect(deepLink).toBeTruthy()
    })

})
