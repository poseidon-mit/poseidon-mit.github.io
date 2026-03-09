import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/render-with-router'
import Landing from '../pages/Landing'

describe('Landing layout remains structurally immutable', () => {
  test('Hero video element exists', () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: '/' })
    const videoElements = container.querySelectorAll('video')
    expect(videoElements.length).toBeGreaterThan(0)
  })

  test('Primary CTA links to /dashboard', () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: '/' })
    const dashboardCta = container.querySelector('a[href="/dashboard"]')
    expect(dashboardCta).not.toBeNull()
  })

  test('Secondary CTA links to /dashboard', () => {
    renderWithRouter(<Landing />, { initialPath: '/' })
    const getStartedLink = screen.getByText(new RegExp('Get Started', 'i'))
    expect(getStartedLink.tagName).toBe('A')
    expect(getStartedLink.getAttribute('href')).toBe('/dashboard')
  })

  test('Both CTAs link to /dashboard', () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: '/' })
    const dashboardLinks = container.querySelectorAll('a[href="/dashboard"]')
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(2)
  })

  test('Footer login link exists', () => {
    const { container } = renderWithRouter(<Landing />, { initialPath: '/' })
    const loginLink = container.querySelector('a[href="/login"]')
    expect(loginLink).not.toBeNull()
  })

  test('No B2B copy leaked onto Landing page', () => {
    renderWithRouter(<Landing />, { initialPath: '/' })
    expect(screen.queryByText(/AML/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Wire Transfer/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/KYC/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/compliance engine/i)).not.toBeInTheDocument()
  })

  test('No heading element contains "Engine"', () => {
    renderWithRouter(<Landing />, { initialPath: '/' })
    const headings = screen.getAllByRole('heading')
    for (const heading of headings) {
      expect(heading.textContent).not.toMatch(/Engine/i)
    }
  })

  test('At least one h1 exists on the Landing page', () => {
    renderWithRouter(<Landing />, { initialPath: '/' })
    const h1Elements = screen.getAllByRole('heading', { level: 1 })
    expect(h1Elements.length).toBeGreaterThanOrEqual(1)
  })
})
