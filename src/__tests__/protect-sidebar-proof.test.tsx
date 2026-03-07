import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider } from '../router'
import ProtectPage from '../pages/protect/Protect'

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
  it('does not use "blocked" language anywhere on page', () => {
    const { container } = renderProtect()
    const text = container.textContent?.toLowerCase() ?? ''
    expect(text).not.toContain('threats blocked')
    expect(text).not.toContain('auto-block')
  })
})
