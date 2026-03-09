import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/render-with-router'
import { TalkToMoneyFab } from '../components/ui/TalkToMoneyFab'

describe('Talk to Money Entrypoints are Explicit and Context-Bound across Flagships', () => {

    const flagshipRoutes = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/protect', label: 'Protect' },
        { path: '/grow', label: 'Grow' },
        { path: '/execute', label: 'Execute' },
        { path: '/govern', label: 'Govern' },
    ]

    for (const { path, label } of flagshipRoutes) {
        test(`TalkToMoney exposes an entrypoint from ${label} (${path})`, () => {
            renderWithRouter(<TalkToMoneyFab />, { initialPath: path })

            const fab = screen.getByRole('button', { name: /talk to money/i })
            expect(fab).toBeTruthy()
            expect(fab.hasAttribute('disabled')).toBe(false)
            expect(fab.textContent?.toLowerCase()).not.toContain('coming soon')
        })
    }

    test('TalkToMoney FAB has no cursor-not-allowed class across all routes', () => {
        for (const { path } of flagshipRoutes) {
            const { unmount } = renderWithRouter(<TalkToMoneyFab />, { initialPath: path })

            const fab = screen.getByRole('button', { name: /talk to money/i })
            expect(fab.className).not.toContain('cursor-not-allowed')

            unmount()
        }
    })

})
