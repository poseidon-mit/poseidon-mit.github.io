import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GovernHero, GovernImmutableLedger } from '../components/poseidon/govern-hero'
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

function renderHero(overrides: Record<string, unknown> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides }
  return { ...render(<GovernHero {...props} />), props }
}

/* ═══════════════════════════════════════════════════════
   FACADE-LEVEL TESTS
   ═══════════════════════════════════════════════════════ */

describe('GovernHero', () => {
  it('renders "errors in N AI decisions" headline', () => {
    renderHero()
    expect(screen.getByText(/errors in/)).toBeInTheDocument()
    // 47 appears in both headline and portal badge — use getAllByText
    expect(screen.getAllByText('47').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/AI decisions/)).toBeInTheDocument()
  })

  it('renders CountUp with errorCount (defaults to 0)', () => {
    renderHero()
    // CountUp renders aria-label with the target value
    expect(screen.getByLabelText('0')).toBeInTheDocument()
  })

  it('renders engine breakdown labels', () => {
    renderHero()
    expect(screen.getByText(/Protect 40%/)).toBeInTheDocument()
    expect(screen.getByText(/Grow 32%/)).toBeInTheDocument()
    expect(screen.getByText(/Execute 17%/)).toBeInTheDocument()
    expect(screen.getByText(/Govern 11%/)).toBeInTheDocument()
  })

  it('renders "What Poseidon checked" section label', () => {
    renderHero()
    expect(screen.getByText('What Poseidon checked')).toBeInTheDocument()
  })

  it('renders audit entries in Zone B', () => {
    renderHero()
    expect(screen.getByText('Suspicious charge flagged — AMZN $347.89')).toBeInTheDocument()
    expect(screen.getByText('High-yield savings opportunity identified — $840/yr potential')).toBeInTheDocument()
    expect(screen.getByText('Subscription price increase detected — Spotify $10.99 → $11.99')).toBeInTheDocument()
  })

  it('renders "Activity Log" label in Zone B', () => {
    renderHero()
    expect(screen.getByText('Activity Log')).toBeInTheDocument()
  })

  it('renders status breakdown when provided', () => {
    renderHero({ statusBreakdown: { verified: 44, pending: 2, flagged: 1 } })
    // Numbers may appear in multiple places — use getAllByText
    expect(screen.getAllByText('44').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Reviewing')).toBeInTheDocument()
    // "Verified" also appears in audit entry statuses — use getAllByText
    expect(screen.getAllByText('Verified').length).toBeGreaterThanOrEqual(1)
    // "Flagged" label in breakdown
    expect(screen.getAllByText(/Flagged/).length).toBeGreaterThanOrEqual(1)
  })

  it('renders trust guarantees when provided', () => {
    renderHero({
      trustGuarantees: {
        autoExecutionsWithoutConsent: 0,
        auditCoveragePercent: 100,
        llmTrainingOptOut: true,
      },
    })
    expect(screen.getByText(/actions taken without your approval/)).toBeInTheDocument()
    expect(screen.getByText(/of decisions have a paper trail/)).toBeInTheDocument()
    expect(screen.getByText('Your data is never used to train AI')).toBeInTheDocument()
  })

  it('renders spotlight alert for non-Verified entries', () => {
    renderHero({
      spotlightEntry: {
        id: 'GV-SPOT-001',
        action: 'Unusual API access pattern detected',
        status: 'Flagged' as const,
        confidence: 0.72,
      },
    })
    expect(screen.getByText('Unusual API access pattern detected')).toBeInTheDocument()
    expect(screen.getByText('72% confidence')).toBeInTheDocument()
  })

  it('does not render spotlight alert for Verified entries', () => {
    renderHero({
      spotlightEntry: {
        id: 'GV-SPOT-002',
        action: 'This should not appear',
        status: 'Verified' as const,
        confidence: 0.99,
      },
    })
    expect(screen.queryByText('This should not appear')).not.toBeInTheDocument()
  })

  it('expands audit entry on click to reveal top factor', () => {
    renderHero()
    const entry = screen.getByText('Suspicious charge flagged — AMZN $347.89')
    const button = entry.closest('button')!
    fireEvent.click(button)
    // Top factor "Amount deviation" is unique to this entry
    const factorText = screen.getByText(/Amount deviation/)
    expect(factorText).toBeInTheDocument()
    // The expanded container should now have opacity-100 class
    const expandDiv = factorText.closest('[class*="transition-all"]')!
    expect(expandDiv.className).toContain('opacity-100')
  })

  it('renders "Every action Poseidon took was verified safe." subtitle', () => {
    renderHero()
    expect(screen.getByText('Every action Poseidon took was verified safe.')).toBeInTheDocument()
  })

  it('renders "Your safety guarantees" section label when trustGuarantees provided', () => {
    renderHero({
      trustGuarantees: {
        autoExecutionsWithoutConsent: 0,
        auditCoveragePercent: 100,
        llmTrainingOptOut: false,
      },
    })
    expect(screen.getByText('Your safety guarantees')).toBeInTheDocument()
  })
})

/* ═══════════════════════════════════════════════════════
   BACKWARD COMPATIBILITY
   ═══════════════════════════════════════════════════════ */

describe('GovernImmutableLedger backward compat', () => {
  it('GovernImmutableLedger is the same component as GovernHero', () => {
    expect(GovernImmutableLedger).toBe(GovernHero)
  })

  it('renders when used as GovernImmutableLedger', () => {
    render(<GovernImmutableLedger {...DEFAULT_PROPS} />)
    expect(screen.getByText(/errors in/)).toBeInTheDocument()
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

  it('renders the hero with "errors in" headline', () => {
    renderGovern()
    expect(screen.getByText(/errors in/)).toBeInTheDocument()
    expect(screen.getByText(/AI decisions/)).toBeInTheDocument()
  })

  it('renders status breakdown from canonical data', () => {
    renderGovern()
    // "Verified" appears in both breakdown label and audit entry statuses
    expect(screen.getAllByText('Verified').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Reviewing')).toBeInTheDocument()
  })

  it('renders trust guarantees section', () => {
    renderGovern()
    expect(screen.getByText('Your safety guarantees')).toBeInTheDocument()
    expect(screen.getByText(/actions taken without your approval/)).toBeInTheDocument()
  })

  it('portal bar links to /govern/audit', () => {
    renderGovern()
    const link = screen.getByRole('link', { name: /activity log/i })
    expect(link).toHaveAttribute('href', '/govern/audit')
  })
})
