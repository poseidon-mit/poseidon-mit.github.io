import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider } from '../router'
import { DemoStateProvider } from '../lib/demo-state/provider'
import { resetDemoStateStorage } from '../lib/demo-state/storage'
import ExecuteQueuePage from '../pages/ExecuteQueue'

/**
 * Tests the ExecuteQueue page contract:
 * - Renders id="main-content" with role="main"
 * - Pending action cards link to /execute/approval?actionId=...
 * - Empty state renders when all actions are decided
 */

function renderQueue(search = '') {
  window.history.pushState({}, '', `/execute/queue${search}`)
  return render(
    <DemoStateProvider>
      <RouterProvider>
        <ExecuteQueuePage />
      </RouterProvider>
    </DemoStateProvider>,
  )
}

describe('ExecuteQueue page contract', () => {
  beforeEach(() => {
    resetDemoStateStorage()
  })

  it('renders id="main-content" with role="main"', () => {
    renderQueue()
    const main = document.getElementById('main-content')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('role', 'main')
  })

  it('pending action cards link to /execute/approval?actionId=...', () => {
    renderQueue()
    const links = screen.getAllByRole('link', { name: /review & approve/i })
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/\/execute\/approval\?actionId=/)
    }
  })

  it('shows empty state when all actions are decided', async () => {
    // Set all default actions to approved in localStorage before rendering
    const { DemoStateProvider: Provider } = await import('../lib/demo-state/provider')
    const { createDefaultDemoState } = await import('../lib/demo-state/types')
    const { saveDemoState } = await import('../lib/demo-state/storage')

    const state = createDefaultDemoState()
    // Mark all default actions as approved
    for (const id of Object.keys(state.execute.actionStates)) {
      state.execute.actionStates[id] = { id, status: 'approved', decidedAt: new Date().toISOString() }
    }
    saveDemoState(state)

    window.history.pushState({}, '', '/execute/queue')
    render(
      <Provider>
        <RouterProvider>
          <ExecuteQueuePage />
        </RouterProvider>
      </Provider>,
    )

    expect(screen.getByText(/queue clear/i)).toBeInTheDocument()
  })
})
