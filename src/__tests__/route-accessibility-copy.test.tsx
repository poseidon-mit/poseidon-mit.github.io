import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/render-with-router'
import Dashboard from '../pages/Dashboard'
import Execute from '../pages/Execute'
import { BREADCRUMB_MAP } from '../lib/breadcrumb-registry'

describe('Route accessibility labels and copy reflect Consumer identity', () => {
  test('Dashboard document.title does not contain "Engine"', () => {
    renderWithRouter(<Dashboard />, { initialPath: '/dashboard' })
    expect(document.title).not.toMatch(/Engine/i)
  })

  test('BREADCRUMB_MAP values do not contain "Engine"', () => {
    for (const [route, crumbs] of Object.entries(BREADCRUMB_MAP)) {
      for (const crumb of crumbs) {
        expect(crumb).not.toMatch(
          /Engine/i,
        )
      }
    }
  })

  test('Execute page does not use B2B jargon (Validating, Broadcasting)', () => {
    renderWithRouter(<Execute />, { initialPath: '/execute' })
    expect(screen.queryByText(/Validating/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Broadcasting/i)).not.toBeInTheDocument()
  })
})
