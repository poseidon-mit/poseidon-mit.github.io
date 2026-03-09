import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GovernImmutableLedger } from '../components/poseidon/govern-hero'
import { RouterProvider } from '../router'
import GovernPage from '../pages/Govern'

/* ── Test data ── */

const DEFAULT_PROPS = {
  decisionsAudited: 47,
  engineBreakdown: [
    { engine: 'Protect', count: 19, percent: 40, color: 'var(--engine-protect)' },
    { engine: 'Grow', count: 15, percent: 32, color: 'var(--engine-grow)' },
    { engine: 'Execute', count: 8, percent: 17, color: 'var(--engine-execute)' },
    { engine: 'Govern', count: 5, percent: 11, color: 'var(--engine-govern)' },
  ],
  auditEntries: [
    {
      id: 'GV-2026-0309-048',
      engine: 'Protect',
      engineColor: 'var(--engine-protect)',
      action: 'Suspicious charge flagged — AMZN $347.89',
      confidence: 0.94,
      time: '10:32 AM',
      status: 'Verified' as const,
      modelVersion: 'FraudDetectionV3 v3.2.1',
      topFactor: 'Amount deviation',
    },
    {
      id: 'GV-2026-0309-047',
      engine: 'Grow',
      engineColor: 'var(--engine-grow)',
      action: 'High-yield savings opportunity identified — $840/yr potential',
      confidence: 0.93,
      time: '9:15 AM',
      status: 'Verified' as const,
      modelVersion: 'FinancialStrategyAI v3.2.0',
      topFactor: 'Interest rate gap',
    },
    {
      id: 'GV-2026-0308-046',
      engine: 'Protect',
      engineColor: 'var(--engine-protect)',
      action: 'Subscription price increase detected — Spotify $10.99 → $11.99',
      confidence: 0.87,
      time: '9:17 AM',
      status: 'Verified' as const,
      modelVersion: 'FraudDetectionV3 v3.2.1',
      topFactor: 'Price change detection',
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
    expect(screen.getByLabelText('47')).toBeInTheDocument()
  })

  it('renders the headline', () => {
    renderHero()
    expect(screen.getByText('Decisions Audited & Secured')).toBeInTheDocument()
  })

  it('renders engine breakdown labels', () => {
    renderHero()
    expect(screen.getByText(/Protect 40%/)).toBeInTheDocument()
    expect(screen.getByText(/Grow 32%/)).toBeInTheDocument()
    expect(screen.getByText(/Execute 17%/)).toBeInTheDocument()
    expect(screen.getByText(/Govern 11%/)).toBeInTheDocument()
  })

  it('renders audit entries', () => {
    renderHero()
    expect(screen.getByText('Suspicious charge flagged — AMZN $347.89')).toBeInTheDocument()
    expect(screen.getByText('High-yield savings opportunity identified — $840/yr potential')).toBeInTheDocument()
    expect(screen.getByText('Subscription price increase detected — Spotify $10.99 → $11.99')).toBeInTheDocument()
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

  it('renders status badge above hero', () => {
    renderGovern()
    expect(screen.getByText('Audit Active')).toBeInTheDocument()
  })

  it('renders prelude in correct order: badge → h1 → hero card', () => {
    renderGovern()
    const badge = screen.getByText('Audit Active')
    const h1 = screen.getByRole('heading', { level: 1 })
    const heroCard = screen.getByText('Decisions Audited & Secured').closest('[class*="glass-card"]')!

    expect(badge).toBeInTheDocument()
    expect(h1).toHaveClass('sr-only')

    // DOM order
    expect(badge.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(h1.compareDocumentPosition(heroCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
