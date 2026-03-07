import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { saveDemoState } from '../lib/demo-state/storage'
import { createDefaultDemoState } from '../lib/demo-state/types'
import { DemoStateProvider } from '../lib/demo-state/provider'
import { RouterProvider } from '../router'
import DashboardPage from '../pages/Dashboard'

vi.mock('../hooks/useReducedMotionSafe', () => ({
  useReducedMotionSafe: vi.fn(() => false),
}))

function seedState(overrides: { auth?: Partial<ReturnType<typeof createDefaultDemoState>['auth']>; onboarding?: Partial<ReturnType<typeof createDefaultDemoState>['onboarding']> }) {
  const defaults = createDefaultDemoState()
  saveDemoState({
    ...defaults,
    auth: { ...defaults.auth, ...overrides.auth },
    onboarding: { ...defaults.onboarding, ...overrides.onboarding },
  })
}

function renderDashboard() {
  window.history.pushState({}, '', '/dashboard')
  return render(
    <DemoStateProvider>
      <RouterProvider>
        <DashboardPage />
      </RouterProvider>
    </DemoStateProvider>
  )
}

describe('Dashboard drawers', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    sessionStorage.clear()
    localStorage.clear()
  })

  it('shows GuidedSetupDrawer for agentic + onboarding incomplete', () => {
    seedState({ auth: { entryIntent: 'agentic' }, onboarding: { completed: false } })
    renderDashboard()
    act(() => vi.advanceTimersByTime(500))
    // GuidedSetupDrawer is open — "Connect All" button is present (Step 1 content)
    expect(screen.queryByText('Connect All')).toBeInTheDocument()
  })

  it('shows OnboardingArrivalSheet when arrival key is set', () => {
    sessionStorage.setItem('poseidon-onboarding-arrival', 'pending')
    seedState({ auth: { entryIntent: 'express' } })
    renderDashboard()
    act(() => vi.advanceTimersByTime(500))
    expect(screen.getByText('Poseidon is now active')).toBeInTheDocument()
  })

  it('hides OnboardingArrivalSheet when arrival key is not set', () => {
    renderDashboard()
    act(() => vi.advanceTimersByTime(500))
    expect(screen.queryByText('Poseidon is now active')).not.toBeInTheDocument()
  })

  it('hides GuidedSetupDrawer for non-agentic entry', () => {
    seedState({ auth: { entryIntent: 'express' }, onboarding: { completed: false } })
    renderDashboard()
    act(() => vi.advanceTimersByTime(500))
    expect(screen.queryByText('Connect All')).not.toBeInTheDocument()
  })
})
