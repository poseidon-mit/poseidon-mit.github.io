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

describe('Spotlight cards mobile behavior', () => {
  it('GrowRecommendations spotlight card is not tappable', () => {
    renderPage(<GrowRecommendations />, '/grow/recommendations')
    const allLinks = screen.getAllByRole('link')
    const spotlightLink = allLinks.find(
      (link) => link.getAttribute('href')?.includes('/grow/recommendation?id='),
    )
    expect(spotlightLink).toBeUndefined()
    expect(screen.getAllByRole('button', { name: /see opportunity/i })[0]).toBeDisabled()
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

  it('GrowRecommendations spotlight card contains no nested detail links', () => {
    renderPage(<GrowRecommendations />, '/grow/recommendations')
    const growLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.includes('/grow/recommendation?id='))
    expect(growLinks).toHaveLength(0)
  })
})
