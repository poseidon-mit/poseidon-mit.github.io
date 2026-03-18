import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RouterProvider } from '../router'
import GrowRecommendations from '../pages/GrowRecommendations'
import { AppNavShell } from '../components/layout/AppNavShell'

function renderPage() {
  window.history.pushState({}, '', '/grow/recommendations')
  return render(
    <RouterProvider>
      <AppNavShell path="/grow/recommendations">
        <GrowRecommendations />
      </AppNavShell>
    </RouterProvider>,
  )
}

describe('GrowRecommendations page contract', () => {
  it('renders the curated 10 recommendation cards with updated copy', () => {
    renderPage()
    const expectedTitles = [
      'Food delivery spending is above your usual range',
      'Grocery price differences detected',
      'Internet bill increased',
      'Mobile plan may not fit current usage',
      'Overlapping streaming subscriptions detected',
      'Recurring gym charge detected',
      'Large healthcare charge detected',
      'Bill payment timing issue detected',
      'Checking account fees detected',
      'Excess idle cash detected in checking',
    ]

    for (const title of expectedTitles) {
      expect(screen.getByText(title)).toBeInTheDocument()
    }

    expect(screen.getAllByRole('button', { name: /see opportunity/i })).toHaveLength(10)
  })

  it('renders id="main-content" with role="main"', () => {
    renderPage()
    const main = document.getElementById('main-content')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('role', 'main')
  })

  it('does not render recommendation rows as links to detail pages', () => {
    renderPage()
    expect(screen.queryByRole('link', { name: /see opportunity/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /food delivery spending is above your usual range/i })).not.toBeInTheDocument()
    for (const button of screen.getAllByRole('button', { name: /see opportunity/i })) {
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
    }
  })

  it('filters rows by category chip selection', () => {
    renderPage()
    const totalCount = screen.getAllByRole('button', { name: /see opportunity/i }).length

    fireEvent.click(screen.getByRole('button', { name: 'Revenue Growth' }))
    expect(screen.queryAllByRole('button', { name: /see opportunity/i })).toHaveLength(0)
    expect(screen.getByText('No recommendations')).toBeInTheDocument()
    expect(screen.getByText('No recommendations match this filter.')).toBeInTheDocument()

    // Reset to All
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    const resetButtons = screen.getAllByRole('button', { name: /see opportunity/i })
    expect(resetButtons.length).toBe(totalCount)
  })
})
