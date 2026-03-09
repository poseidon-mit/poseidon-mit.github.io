import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { renderWithRouter } from '../test/render-with-router'
import { PageSkeleton } from '../components/poseidon/page-skeleton'
import Execute from '../pages/Execute'

describe('Loading state architecture follows the 3-class contract', () => {
  test('In-shell transition uses PageSkeleton with structural skeleton blocks', () => {
    renderWithRouter(<PageSkeleton />)

    // PageSkeleton renders an aria-labelled container with pulsing skeleton blocks
    const skeleton = screen.getByLabelText(/loading page content/i)
    expect(skeleton).toBeInTheDocument()
    expect(skeleton.classList.contains('animate-pulse')).toBe(true)
  })

  test('Cold boot fallback: main.tsx wraps app in Suspense with RouteLoadingFallback', () => {
    const mainSrc = readFileSync(resolve(__dirname, '../main.tsx'), 'utf-8')
    expect(mainSrc).toContain('<Suspense')
    expect(mainSrc).toContain('RouteLoadingFallback')
  })

  test('In-shell fallback: AuthenticatedLayout wraps content in Suspense with PageSkeleton', () => {
    const layoutSrc = readFileSync(
      resolve(__dirname, '../components/layout/AuthenticatedLayout.tsx'),
      'utf-8'
    )
    expect(layoutSrc).toContain('<Suspense')
    expect(layoutSrc).toContain('PageSkeleton')
  })

  test('Execute page renders without a loading progressbar', () => {
    renderWithRouter(<Execute />, { initialPath: '/execute' })

    // No loading indicator should appear on render
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
