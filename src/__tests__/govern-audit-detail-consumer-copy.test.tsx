import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/render-with-router'
import GovernAuditDetail from '../pages/GovernAuditDetail'

describe('GovernAuditDetail translates AI actions into clear Consumer Language', () => {

    test('GovernAuditDetail explains the action and reason using plain english, avoiding technical system-jargon', () => {
        renderWithRouter(
            <GovernAuditDetail />,
            { initialPath: '/govern/audit-detail?decision=GV-2026-0319-846' }
        )

        // Page renders with main content
        const main = screen.getByRole('main')
        expect(main).toBeTruthy()

        // Plain-English explanation should be present (explanation.summary from audit data)
        const textContent = main.textContent ?? ''
        expect(textContent.length).toBeGreaterThan(50)

        // TARGET: Absence of system jargon terms
        const jargonTerms = ['SHAP', 'reconstruction', 'model v2.4', 'ORCHESTRATOR']
        for (const term of jargonTerms) {
            expect(textContent).not.toContain(term)
        }
    })

})
