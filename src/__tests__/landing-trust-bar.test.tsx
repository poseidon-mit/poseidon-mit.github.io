import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TRUST_BAR_ITEMS } from '../content/trust-policies'
import { RouterProvider } from '../router'
import LandingPage from '../pages/Landing'

describe('Landing trust bar SSOT', () => {
  function renderLanding() {
    window.history.pushState({}, '', '/')
    return render(
      <RouterProvider>
        <LandingPage />
      </RouterProvider>,
    )
  }

  it('renders all trust bar items from shared source', () => {
    renderLanding()
    for (const item of TRUST_BAR_ITEMS) {
      expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1)
    }
  })
})
