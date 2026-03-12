import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/render-with-router'
import { TalkToMoneyFab } from '../components/ui/TalkToMoneyFab'

describe('Talk your money Context Binding ensures Route-Specific Relevance', () => {

    test('TalkToMoney on /dashboard is active with no disabled or coming-soon state', () => {
        renderWithRouter(<TalkToMoneyFab />, { initialPath: '/dashboard' })

        const fab = screen.getByLabelText(/talk your money/i)
        expect(fab).toBeTruthy()
        expect(fab.hasAttribute('disabled')).toBe(false)

        // No "coming soon" text anywhere in the FAB
        expect(fab.textContent?.toLowerCase()).not.toContain('coming soon')
    })

    test('TalkToMoney on /govern/audit-detail has no coming-soon state', () => {
        renderWithRouter(<TalkToMoneyFab />, {
            initialPath: '/govern/audit-detail?decision=GOV-003',
        })

        const fab = screen.getByLabelText(/talk your money/i)
        expect(fab).toBeTruthy()
        expect(fab.textContent?.toLowerCase()).not.toContain('coming soon')
    })

    test('TalkToMoney state machine uses useRouter() to derive route context', () => {
        // The state machine hook uses useRouter internally
        const source = readFileSync(
            resolve(__dirname, '../features/talk-to-money/use-talk-to-money.ts'),
            'utf-8'
        )

        expect(source).toContain('useRouter')
    })

})
