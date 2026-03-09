import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/render-with-router'
import { GovernFooter } from '../components/poseidon/govern-footer'

describe('GovernFooter traceability is guaranteed on Flagship AI action routes', () => {

    test('GovernFooter surfaces when an actionable recommendation or flag is present', () => {
        renderWithRouter(
            <GovernFooter auditId="GV-2026-0216-DASH" pageContext="financial overview" />
        )

        // Footer renders with contentinfo role
        const footer = screen.getByRole('contentinfo', { name: /governance verification footer/i })
        expect(footer).toBeTruthy()

        // Audit ID is visible
        expect(screen.getByText('GV-2026-0216-DASH')).toBeTruthy()

        // Auditable badge is visible
        expect(screen.getByText('Auditable')).toBeTruthy()

        // Request human review button is present
        expect(screen.getByRole('button', { name: /request human review/i })).toBeTruthy()
    })

})
