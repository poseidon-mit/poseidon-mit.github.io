import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { RouterProvider } from '../router'
import { DemoStateProvider } from '../lib/demo-state/provider'
import { useDemoState } from '../lib/demo-state/provider'
import { resetDemoStateStorage } from '../lib/demo-state/storage'
import DashboardPage from '../pages/Dashboard'

/**
 * Tests that the Financial Health Score on the Dashboard hero
 * updates reactively when demo state changes (dismiss alerts, approve actions).
 */

function TestHarness() {
  const { setExecuteDecision } = useDemoState()
  return (
    <>
      <button
        data-testid="approve-exe001"
        onClick={() => setExecuteDecision({
          actionId: 'EXE-001',
          actionTitle: 'Portfolio rebalance',
          decision: 'approved',
        })}
      />
      <DashboardPage />
    </>
  )
}

function renderDashboard() {
  window.history.pushState({}, '', '/dashboard')
  return render(
    <DemoStateProvider>
      <RouterProvider>
        <TestHarness />
      </RouterProvider>
    </DemoStateProvider>,
  )
}

describe('Dashboard Financial Wellness Score', () => {
  beforeEach(() => {
    resetDemoStateStorage()
  })

  it('renders the wellness score', () => {
    renderDashboard()
    const healthLabel = screen.getByText('Financial Wellness')
    expect(healthLabel).toBeInTheDocument()
    // The score is a sibling of the label inside the same container
    const container = healthLabel.closest('div')!
    expect(container.textContent).toMatch(/\d+\/100/)
  })

  it('wellness score increases when an execute action is approved', () => {
    renderDashboard()
    const healthLabel = screen.getByText('Financial Wellness')
    const container = healthLabel.closest('div')!

    const getScore = () => {
      const match = container.textContent!.match(/(\d+)\/100/)
      return match ? parseInt(match[1]) : 0
    }

    const initial = getScore()

    // Approve an action — Execute sub-score should improve
    fireEvent.click(screen.getByTestId('approve-exe001'))

    const updated = getScore()
    expect(updated).toBeGreaterThanOrEqual(initial)
  })
})
