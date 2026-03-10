import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DemoStateProvider } from '../lib/demo-state/provider'
import { RouterProvider } from '../router'
import { resetDemoStateStorage } from '../lib/demo-state/storage'
import ProtectAlertDetailPage from '../pages/protect/ProtectAlertDetail'

beforeEach(() => {
  resetDemoStateStorage()
})

function renderDetail(alertId: string) {
  window.history.pushState({}, '', `/protect/alert-detail?alertId=${alertId}`)
  return render(
    <DemoStateProvider>
      <RouterProvider>
        <ProtectAlertDetailPage />
      </RouterProvider>
    </DemoStateProvider>,
  )
}

describe('Protect detail truthfulness', () => {
  it('invalid alertId does NOT silently show THREATS[0]', () => {
    renderDetail('INVALID-999')
    // Should navigate away, rendering nothing
    expect(screen.queryByText('Alert #INVALID-999')).toBeNull()
    // Should NOT show THR-001 content
    expect(screen.queryByText('Alert #THR-001')).toBeNull()
  })

  it('valid alertId=THR-001 shows correct alert with canonical account data', () => {
    renderDetail('THR-001')
    // Multiple elements may contain "Alert #THR-001" (h1, nav, etc.)
    const matches = screen.getAllByText('Alert #THR-001')
    expect(matches.length).toBeGreaterThan(0)
    // Account should come from canonical, not hardcoded
    expect(screen.getByText('Visa ****4821')).toBeTruthy()
  })

  it('severity comparison uses correct case (Critical not critical)', () => {
    renderDetail('THR-001')
    // The severity badge should show 'Critical'
    const badges = screen.getAllByText('Critical')
    expect(badges.length).toBeGreaterThan(0)
  })
})
