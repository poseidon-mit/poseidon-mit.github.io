import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardCoordinationProof } from '../components/poseidon/dashboard-hero'
import { RouterProvider } from '../router'
import DashboardPage from '../pages/Dashboard'

/* ── Test data ── */

const AUDIT_ENTRIES = [
  { id: 'GV-001', type: 'Protect', action: 'Flag wire transfer', confidence: 0.94 },
  { id: 'GV-002', type: 'Grow', action: 'Subscription consolidation', confidence: 0.89 },
  { id: 'GV-003', type: 'Execute', action: 'Portfolio rebalance', confidence: 0.97 },
]

const DEFAULT_PROPS = {
  activeThreats: 3,
  monthlySavings: 612,
  pendingActions: 5,
  decisionsAudited: 10250,
  decisionsVerified: 10191,
  recommendationCount: 8,
  criticalSignal: {
    id: 'THR-001',
    counterparty: 'TechElectro Store',
    amount: '$2,847',
    confidence: 0.94,
    severity: 'Critical' as const,
  },
  nextApproval: {
    id: 'EXE-002',
    title: 'Flag suspicious wire transfer',
    amountLabel: '$2,847',
    engine: 'Protect',
    urgency: 'high' as const,
  },
  auditStreamEntries: AUDIT_ENTRIES,
  onReviewThreat: vi.fn(),
  onReviewApproval: vi.fn(),
  onViewRecommendations: vi.fn(),
}

function renderHero(overrides: Partial<typeof DEFAULT_PROPS> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides }
  return { ...render(<DashboardCoordinationProof {...props} />), props }
}

/* ═══════════════════════════════════════════════════════
   FACADE-LEVEL TESTS
   ═══════════════════════════════════════════════════════ */

describe('DashboardCoordinationProof', () => {
  it('renders the headline', () => {
    renderHero()
    expect(screen.getByRole('heading', { level: 1, name: /fully coordinated/i })).toBeInTheDocument()
  })

  it('renders narrative with threat amount and savings', () => {
    renderHero()
    const narrative = screen.getByText(/\$2,847 anomaly/)
    expect(narrative).toBeInTheDocument()
    expect(narrative.textContent).toMatch(/\$612\/mo/)
  })

  it('renders narrative with verified count', () => {
    renderHero()
    expect(screen.getByText(/10,191 verified/)).toBeInTheDocument()
  })

  it('renders engine pulse badges for protect, grow, execute', () => {
    renderHero()
    // EnginePulseBadge renders engine values — threats, opportunity, pending
    expect(screen.getByText('threats')).toBeInTheDocument()
    expect(screen.getByText('opportunity')).toBeInTheDocument()
    expect(screen.getByText('pending')).toBeInTheDocument()
  })

  it('omits "Execute queued" from narrative when pendingActions is 0', () => {
    renderHero({ pendingActions: 0, nextApproval: null, onReviewApproval: null })
    // Narrative is inside a <p> tag — find the specific narrative paragraph
    const narrativeEls = screen.getAllByText(/\$612\/mo/)
    const narrativeP = narrativeEls.find((el) => el.tagName === 'P')
    expect(narrativeP).toBeDefined()
    expect(narrativeP!.textContent).not.toMatch(/queued 0 actions/)
    expect(narrativeP!.textContent).not.toMatch(/Execute queued/)
  })

  it('uses singular "action" when pendingActions is 1', () => {
    renderHero({ pendingActions: 1 })
    expect(screen.getByText(/1 action(?!s)/)).toBeInTheDocument()
  })

  it('renders govern rail with audited count', () => {
    renderHero()
    const rail = screen.getByTestId('govern-rail')
    expect(rail).toBeInTheDocument()
    // CountUp renders aria-label with formatted value
    const countUp = rail.querySelector('[aria-label]')
    expect(countUp?.getAttribute('aria-label')).toContain('10,250')
  })

  it('renders audit stream as aria-hidden container', () => {
    renderHero()
    const stream = screen.getByTestId('audit-stream')
    expect(stream).toHaveAttribute('aria-hidden', 'true')
    expect(stream.children.length).toBeGreaterThan(0)
  })

  it('fires onReviewThreat callback on click', () => {
    const { props } = renderHero()
    const btns = screen.getAllByRole('button', { name: /review critical threat/i })
    fireEvent.click(btns[0])
    expect(props.onReviewThreat).toHaveBeenCalledOnce()
  })

  it('hides review threat button when criticalSignal is null', () => {
    renderHero({ criticalSignal: null, onReviewThreat: null })
    expect(screen.queryByRole('button', { name: /review critical threat/i })).not.toBeInTheDocument()
  })

  it('cohort avg savings are not rendered by default', () => {
    renderHero()
    expect(screen.queryByText(/Cohort avg/)).not.toBeInTheDocument()
  })
})

/* ═══════════════════════════════════════════════════════
   PAGE-LEVEL INTEGRATION TESTS
   ═══════════════════════════════════════════════════════ */

describe('DashboardPage integration', () => {
  function renderDashboard() {
    window.history.pushState({}, '', '/dashboard')
    return render(
      <RouterProvider>
        <DashboardPage />
      </RouterProvider>,
    )
  }

  it('renders hero with derived governance data', () => {
    renderDashboard()
    const rail = screen.getByTestId('govern-rail')
    const countUp = rail.querySelector('[aria-label]')
    expect(countUp?.getAttribute('aria-label')).toContain('10,250')
  })

  it('renders Command Center badge above hero', () => {
    renderDashboard()
    expect(screen.getByText('Command Center')).toBeInTheDocument()
  })

  it('does not render duplicate h1 elements', () => {
    renderDashboard()
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
  })
})
