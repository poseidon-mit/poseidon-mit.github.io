import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RouterProvider } from '../router'
import { DemoStateProvider } from '../lib/demo-state/provider'
import { useDemoState } from '../lib/demo-state/provider'
import { resetDemoStateStorage } from '../lib/demo-state/storage'
import DashboardPage from '../pages/Dashboard'

/**
 * Tests that the Dashboard hero updates reactively when demo state changes.
 */

function TestHarness() {
  const { setExecuteDecision } = useDemoState()
  return (
    <>
      <button
        data-testid="approve-exe001"
        onClick={() => setExecuteDecision({
          actionId: 'EXE-001',
          actionTitle: 'Dispute unrecognized charge',
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

describe('Dashboard reactive state', () => {
  beforeEach(() => {
    resetDemoStateStorage()
  })

  it('renders the hero headline', () => {
    renderDashboard()
    expect(screen.getByText('Portfolio Command Center')).toBeInTheDocument()
  })

  it('pending actions count decreases when an action is approved', () => {
    renderDashboard()
    expect(screen.getByText('15 authorizations live')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('approve-exe001'))

    expect(screen.getByText('14 authorizations live')).toBeInTheDocument()
  })
})
