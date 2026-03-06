import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider } from '../router'
import ProtectPage from '../pages/protect/Protect'
import { CANONICAL_UNIVERSE } from '../domain/poseidon-universe'

/* ── Mock useReducedMotionSafe ── */
vi.mock('../hooks/useReducedMotionSafe', () => ({
  useReducedMotionSafe: vi.fn(() => false),
}))

function renderProtect() {
  window.history.pushState({}, '', '/protect')
  return render(
    <RouterProvider>
      <ProtectPage />
    </RouterProvider>,
  )
}

describe('Protect sidebar proof metrics', () => {
  const perf = CANONICAL_UNIVERSE.metrics.cohort.protectPerformance

  it('renders riskIncidentsFlagged from canonical in sidebar', () => {
    renderProtect()
    expect(screen.getByText(String(perf.riskIncidentsFlagged))).toBeInTheDocument()
    expect(screen.getByText(/risk incidents flagged/i)).toBeInTheDocument()
  })

  it('renders avgMonthlyExposureUsd from canonical in sidebar', () => {
    renderProtect()
    expect(screen.getByText(`$${perf.avgMonthlyExposureUsd}/mo`)).toBeInTheDocument()
  })

  it('does not use "blocked" language anywhere on page', () => {
    const { container } = renderProtect()
    const text = container.textContent?.toLowerCase() ?? ''
    expect(text).not.toContain('threats blocked')
    expect(text).not.toContain('auto-block')
  })
})
