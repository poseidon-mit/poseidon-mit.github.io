import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DemoStateProvider } from '../lib/demo-state/provider'
import { RouterProvider } from '../router'
import { resetDemoStateStorage } from '../lib/demo-state/storage'
import GrowRecommendationDetailPage from '../pages/grow/GrowRecommendationDetail'

beforeEach(() => {
  resetDemoStateStorage()
})

function renderDetail(id: number) {
  window.history.pushState({}, '', `/grow/recommendation?id=${id}`)
  return render(
    <DemoStateProvider>
      <RouterProvider>
        <GrowRecommendationDetailPage />
      </RouterProvider>
    </DemoStateProvider>,
  )
}

describe('Grow detail comparison strip follows canonical recommendation data', () => {
  it('id=1 shows the yield comparison strip, not $0.00 fallbacks', () => {
    renderDetail(1)
    expect(screen.getByText('Current APY')).toBeTruthy()
    expect(screen.getByText('New APY')).toBeTruthy()
    expect(screen.getByText('You earn')).toBeTruthy()
    expect(screen.queryByText('$0.00')).toBeNull()
  })

  it('id=5 keeps the employer-match recommendation on the yield presentation', () => {
    renderDetail(5)
    expect(screen.getByText('Current APY')).toBeTruthy()
    expect(screen.getByText('New APY')).toBeTruthy()
    expect(screen.getByText('You earn')).toBeTruthy()
    expect(screen.queryByText('$0.00')).toBeNull()
  })

  it('id=6 omits the comparison strip when canonical data has no before/after view', () => {
    renderDetail(6)
    expect(screen.queryByText('Current APY')).toBeNull()
    expect(screen.queryByText('Before')).toBeNull()
    expect(screen.queryByText('After')).toBeNull()
    expect(screen.queryByText('$0.00')).toBeNull()
  })

  it('id=18 uses the spend fallback strip with annual benefit copy', () => {
    renderDetail(18)
    expect(screen.getByText('Before')).toBeTruthy()
    expect(screen.getByText('After')).toBeTruthy()
    expect(screen.getByText('Annual Benefit:')).toBeTruthy()
    expect(screen.getByText('Save $1,344')).toBeTruthy()
  })
})
