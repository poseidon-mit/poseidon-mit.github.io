import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DemoStateProvider } from '../lib/demo-state/provider'
import { RouterProvider } from '../router'
import { resetDemoStateStorage } from '../lib/demo-state/storage'
import GrowRecommendations from '../pages/GrowRecommendations'
import ProtectThreatsPage from '../pages/protect/ProtectThreats'
import ExecuteQueuePage from '../pages/ExecuteQueue'

beforeEach(() => {
  resetDemoStateStorage()
})

function renderPage(ui: React.ReactElement, path: string) {
  window.history.pushState({}, '', path)
  return render(
    <DemoStateProvider>
      <RouterProvider>{ui}</RouterProvider>
    </DemoStateProvider>,
  )
}

describe('Spotlight cards are tappable links on mobile', () => {
  it('GrowRecommendations spotlight card links to recommendation detail', () => {
    renderPage(<GrowRecommendations />, '/grow/recommendations')
    // The spotlight card should contain a link wrapping the entire card
    const allLinks = screen.getAllByRole('link')
    const spotlightLink = allLinks.find(
      (link) => link.getAttribute('href')?.includes('/grow/recommendation?id='),
    )
    expect(spotlightLink).toBeTruthy()
    // The link should have block display (full card tappable, not hidden on mobile)
    expect(spotlightLink!.className).toContain('block')
  })

  it('ProtectThreats spotlight card links to alert detail', () => {
    renderPage(<ProtectThreatsPage />, '/protect/threats')
    const allLinks = screen.getAllByRole('link')
    const spotlightLink = allLinks.find(
      (link) => link.getAttribute('href')?.includes('/protect/alert-detail?alertId='),
    )
    expect(spotlightLink).toBeTruthy()
    expect(spotlightLink!.className).not.toContain('sr-only')
  })

  it('ExecuteQueue spotlight card links to approval page', () => {
    renderPage(<ExecuteQueuePage />, '/execute/queue')
    const allLinks = screen.getAllByRole('link')
    const spotlightLink = allLinks.find(
      (link) => link.getAttribute('href')?.includes('/execute/approval?actionId='),
    )
    expect(spotlightLink).toBeTruthy()
    expect(spotlightLink!.className).toContain('block')
  })

  it('spotlight cards do not contain nested <a> tags', () => {
    renderPage(<GrowRecommendations />, '/grow/recommendations')
    const allLinks = screen.getAllByRole('link')
    const spotlightLink = allLinks.find(
      (link) =>
        link.getAttribute('href')?.includes('/grow/recommendation?id=') &&
        link.className.includes('block'),
    )
    expect(spotlightLink).toBeTruthy()
    // No nested <a> inside the spotlight link
    const nestedLinks = spotlightLink!.querySelectorAll('a')
    expect(nestedLinks.length).toBe(0)
  })
})
