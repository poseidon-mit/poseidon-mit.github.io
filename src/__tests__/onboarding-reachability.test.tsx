import { describe, test, expect, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithRouter } from '../test/render-with-router'
import SignupPage from '../pages/Signup'

describe('Agentic signup routing correctly resolves to /onboarding', () => {
  test('Clicking "Continue with Passkey" navigates to /onboarding after 800ms delay', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })

    renderWithRouter(<SignupPage />, { initialPath: '/signup' })

    const passkeyButton = screen.getByRole('button', { name: /Continue with Passkey/i })
    expect(passkeyButton).toBeInTheDocument()

    fireEvent.click(passkeyButton)

    // Advance past the 800ms setTimeout in handlePasskey
    vi.advanceTimersByTime(900)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/onboarding')
    })

    vi.useRealTimers()
  })
})
