import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RouterProvider } from '../router'
import { DemoStateProvider } from '../lib/demo-state/provider'
import { resetDemoStateStorage } from '../lib/demo-state/storage'
import ProtectThreatsPage from '../pages/protect/ProtectThreats'

function renderPage() {
  window.history.pushState({}, '', '/protect/threats')
  return render(
    <DemoStateProvider>
      <RouterProvider>
        <ProtectThreatsPage />
      </RouterProvider>
    </DemoStateProvider>,
  )
}

describe('ProtectThreats page', () => {
  beforeEach(() => {
    resetDemoStateStorage()
  })

  it('renders id="main-content" with role="main"', () => {
    renderPage()
    const main = document.getElementById('main-content')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('role', 'main')
  })

  it('renders threat rows linking to /protect/alert-detail', () => {
    renderPage()
    const links = screen.getAllByRole('link', { name: /investigate/i })
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/\/protect\/alert-detail\?alertId=/)
    }
  })

  it('renders the sort buttons', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Critical first' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Highest confidence' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Most recent' })).toBeInTheDocument()
  })

  it('changing sort button re-renders threat list without crashing', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Highest confidence' }))
    expect(screen.getAllByRole('link', { name: /investigate/i }).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Most recent' }))
    expect(screen.getAllByRole('link', { name: /investigate/i }).length).toBeGreaterThan(0)
  })
})
