import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RouterProvider } from '../router'
import { DemoStateProvider } from '../lib/demo-state/provider'
import GrowRecommendations from '../pages/GrowRecommendations'

function renderPage() {
  window.history.pushState({}, '', '/grow/recommendations')
  return render(
    <DemoStateProvider>
      <RouterProvider>
        <GrowRecommendations />
      </RouterProvider>
    </DemoStateProvider>,
  )
}

describe('GrowRecommendations page contract', () => {
  it('renders id="main-content" with role="main"', () => {
    renderPage()
    const main = document.getElementById('main-content')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('role', 'main')
  })

  it('renders recommendation rows linking to /grow/recommendation?id=...', () => {
    renderPage()
    const links = screen.getAllByRole('link', { name: /see opportunity/i })
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/\/grow\/recommendation\?id=\d+/)
    }
  })

  it('filters rows by category chip selection', () => {
    renderPage()
    const allLinks = screen.getAllByRole('link', { name: /see opportunity/i })
    const totalCount = allLinks.length

    // Click 'Efficiency' category chip
    fireEvent.click(screen.getByRole('button', { name: 'Efficiency' }))
    const savingsLinks = screen.getAllByRole('link', { name: /see opportunity/i })
    expect(savingsLinks.length).toBeGreaterThan(0)
    expect(savingsLinks.length).toBeLessThanOrEqual(totalCount)

    // Reset to All
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    const resetLinks = screen.getAllByRole('link', { name: /see opportunity/i })
    expect(resetLinks.length).toBe(totalCount)
  })
})
