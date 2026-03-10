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

describe('Grow detail comparison strip adapts to recommendation kind', () => {
  it('id=1 (yield) shows APY comparison, not $0.00', () => {
    renderDetail(1)
    // Should show APY values
    expect(screen.getByText('Current APY')).toBeTruthy()
    expect(screen.getByText('New APY')).toBeTruthy()
    expect(screen.getByText('You earn')).toBeTruthy()
    // Should NOT show $0.00
    expect(screen.queryByText('$0.00')).toBeNull()
  })

  it('id=5 (allocation) shows mix comparison, not $0.00', () => {
    renderDetail(5)
    expect(screen.getByText('Current allocation')).toBeTruthy()
    expect(screen.getByText('Recommended allocation')).toBeTruthy()
    expect(screen.queryByText('$0.00')).toBeNull()
  })

  it('id=6 (coverage) shows months comparison, not $0.00', () => {
    renderDetail(6)
    expect(screen.getByText('Current coverage')).toBeTruthy()
    expect(screen.getByText('Target coverage')).toBeTruthy()
    expect(screen.queryByText('$0.00')).toBeNull()
  })

  it('id=9 (contribution) shows percentage + match, not $0.00', () => {
    renderDetail(9)
    expect(screen.getByText('Current')).toBeTruthy()
    expect(screen.getByText('Target')).toBeTruthy()
    expect(screen.getByText('Match captured')).toBeTruthy()
    expect(screen.queryByText('$0.00')).toBeNull()
  })

  it('id=3 (spend) still shows Before/After/You save', () => {
    renderDetail(3)
    expect(screen.getByText('Before')).toBeTruthy()
    expect(screen.getByText('After')).toBeTruthy()
    expect(screen.getByText('You save')).toBeTruthy()
  })
})
