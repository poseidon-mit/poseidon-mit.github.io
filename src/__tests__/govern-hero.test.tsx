import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GovernImmutableLedger } from '../components/poseidon/govern-hero'
import { RouterProvider } from '../router'
import GovernPage from '../pages/Govern'

/* ── Test data ── */

const DEFAULT_PROPS = {
  decisionsAudited: 10249,
  engineBreakdown: [
    { engine: 'Protect', count: 4102, percent: 40, color: 'var(--engine-protect)' },
    { engine: 'Grow', count: 3287, percent: 32, color: 'var(--engine-grow)' },
    { engine: 'Execute', count: 1850, percent: 18, color: 'var(--engine-execute)' },
    { engine: 'Govern', count: 1010, percent: 10, color: 'var(--engine-govern)' },
  ],
  auditEntries: [
    {
      id: 'GV-2026-0319-847',
      engine: 'Execute',
      engineColor: 'var(--engine-execute)',
      action: 'Portfolio rebalance',
      confidence: 0.97,
      time: '2:28 PM',
      status: 'Verified' as const,
      modelVersion: 'ExecutePlanner v4.1.0',
      topFactor: 'Risk concentration',
    },
    {
      id: 'GV-2026-0319-846',
      engine: 'Protect',
      engineColor: 'var(--engine-protect)',
      action: 'Flag suspicious wire transfer ($2,847)',
      confidence: 0.94,
      time: '2:15 PM',
      status: 'Verified' as const,
      modelVersion: 'FraudDetectionV3.2 v3.2.1',
      topFactor: 'Merchant risk',
    },
    {
      id: 'GV-2026-0319-845',
      engine: 'Grow',
      engineColor: 'var(--engine-grow)',
      action: 'Subscription consolidation',
      confidence: 0.89,
      time: '1:52 PM',
      status: 'Verified' as const,
      modelVersion: 'GrowthForecast v3.2.0',
      topFactor: 'Billing category overlap',
    },
  ],
}

function renderHero(overrides: Partial<typeof DEFAULT_PROPS> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides }
  return { ...render(<GovernImmutableLedger {...props} />), props }
}

/* ═══════════════════════════════════════════════════════
   FACADE-LEVEL TESTS
   ═══════════════════════════════════════════════════════ */

describe('GovernImmutableLedger', () => {
  it('renders CountUp aria-label with locale-formatted total', () => {
    renderHero()
    expect(screen.getByLabelText('10,249')).toBeInTheDocument()
  })

  it('renders the headline', () => {
    renderHero()
    expect(screen.getByText('Decisions Audited & Secured')).toBeInTheDocument()
  })

  it('renders engine breakdown labels', () => {
    renderHero()
    expect(screen.getByText(/Protect 40%/)).toBeInTheDocument()
    expect(screen.getByText(/Grow 32%/)).toBeInTheDocument()
    expect(screen.getByText(/Execute 18%/)).toBeInTheDocument()
    expect(screen.getByText(/Govern 10%/)).toBeInTheDocument()
  })

  it('renders audit entries', () => {
    renderHero()
    expect(screen.getByText('Portfolio rebalance')).toBeInTheDocument()
    expect(screen.getByText('Flag suspicious wire transfer ($2,847)')).toBeInTheDocument()
    expect(screen.getByText('Subscription consolidation')).toBeInTheDocument()
  })
})

/* ═══════════════════════════════════════════════════════
   PAGE-LEVEL INTEGRATION TESTS
   ═══════════════════════════════════════════════════════ */

describe('GovernPage integration', () => {
  function renderGovern() {
    window.history.pushState({}, '', '/govern')
    return render(
      <RouterProvider>
        <GovernPage />
      </RouterProvider>,
    )
  }

  it('renders the hero with audit total', () => {
    renderGovern()
    expect(screen.getByText('Decisions Audited & Secured')).toBeInTheDocument()
  })

  it('portal bar navigates to /govern/audit on click', () => {
    renderGovern()
    const link = screen.getByRole('link', { name: /view full audit ledger/i })
    fireEvent.click(link)
    expect(window.location.pathname).toBe('/govern/audit')
  })

  it('renders Engine status badge above hero', () => {
    renderGovern()
    expect(screen.getByText('Engine status: Good')).toBeInTheDocument()
  })

  it('renders prelude in correct order: badge → h1 → hero card', () => {
    renderGovern()
    const badge = screen.getByText('Engine status: Good')
    const h1 = screen.getByRole('heading', { level: 1 })
    const heroCard = screen.getByText('Decisions Audited & Secured').closest('[class*="glass-card"]')!

    expect(badge).toBeInTheDocument()
    expect(h1).toHaveClass('sr-only')

    // DOM order
    expect(badge.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(h1.compareDocumentPosition(heroCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
