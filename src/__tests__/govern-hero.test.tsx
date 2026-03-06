import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GovernImmutableLedger } from '../components/poseidon/govern-hero'
import { RouterProvider } from '../router'
import GovernPage from '../pages/Govern'
import { PRIVACY_MANDATES } from '../content/trust-policies'

/* ── Test data ── */

const DEFAULT_PROPS = {
  decisionsAudited: 10249,
  engineBreakdown: [
    { engine: 'Protect', count: 4102, percent: 40, color: 'var(--engine-protect)' },
    { engine: 'Grow', count: 3287, percent: 32, color: 'var(--engine-grow)' },
    { engine: 'Execute', count: 1850, percent: 18, color: 'var(--engine-execute)' },
    { engine: 'Govern', count: 1010, percent: 10, color: 'var(--engine-govern)' },
  ],
  flightRecorderEntries: [
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
  onOpenLedger: vi.fn(),
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

  it('renders flight recorder entries', () => {
    renderHero()
    expect(screen.getByText('Portfolio rebalance')).toBeInTheDocument()
    expect(screen.getByText('Flag suspicious wire transfer ($2,847)')).toBeInTheDocument()
    expect(screen.getByText('Subscription consolidation')).toBeInTheDocument()
  })

  it('fires onOpenLedger callback on CTA click', () => {
    const { props } = renderHero()
    const btn = screen.getByRole('button', { name: /open audit ledger/i })
    fireEvent.click(btn)
    expect(props.onOpenLedger).toHaveBeenCalledOnce()
  })

  it('hides CTA when onOpenLedger is null', () => {
    renderHero({ onOpenLedger: null })
    expect(screen.queryByRole('button', { name: /open audit ledger/i })).not.toBeInTheDocument()
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

  it('CTA navigates to /govern/audit', () => {
    renderGovern()
    const btn = screen.getByRole('button', { name: /open audit ledger/i })
    fireEvent.click(btn)
    expect(window.location.pathname).toBe('/govern/audit')
  })

  it('renders Privacy & Model Ethics section with governed values', () => {
    renderGovern()
    expect(screen.getByText('Privacy & Model Ethics')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('0 Days')).toBeInTheDocument()
    expect(screen.getByText('Never')).toBeInTheDocument()
    expect(screen.getByText('Data & Privacy Mandates')).toBeInTheDocument()
  })

  it('renders all privacy mandate items from shared source', () => {
    renderGovern()
    for (const mandate of PRIVACY_MANDATES) {
      expect(screen.getByText(mandate)).toBeInTheDocument()
    }
  })
})
