import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardCoordinationProof } from '../components/poseidon/dashboard-hero'
import { RouterProvider } from '../router'
import DashboardPage from '../pages/Dashboard'

/* ── Test data ── */

const AUDIT_ENTRIES = [
  { id: 'GV-001', type: 'Protect', action: 'Suspicious charge flagged', confidence: 0.94 },
  { id: 'GV-002', type: 'Grow', action: 'High-yield savings opportunity', confidence: 0.93 },
  { id: 'GV-003', type: 'Execute', action: 'Emergency fund auto-transfer', confidence: 0.90 },
]

const DEFAULT_PROPS = {
  activeThreats: 3,
  monthlySavings: 444,
  pendingActions: 5,
  decisionsAudited: 47,
  decisionsVerified: 44,
  recommendationCount: 8,
  criticalSignal: {
    id: 'THR-001',
    counterparty: 'AMZN Mktp US*3K7R2F',
    amount: '$347.89',
    confidence: 0.94,
    severity: 'Critical' as const,
  },
  nextApproval: {
    id: 'EXE-001',
    title: 'Dispute unrecognized charge',
    amountLabel: '$347.89',
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
    expect(screen.getByRole('heading', { level: 1, name: /finally coordinated/i })).toBeInTheDocument()
  })

  it('renders narrative with threat amount and savings', () => {
    renderHero()
    const narrative = screen.getByText(/\$347\.89 anomaly/)
    expect(narrative).toBeInTheDocument()
    expect(narrative.textContent).toMatch(/\$444\/mo/)
  })

  it('renders narrative with verified count', () => {
    renderHero()
    expect(screen.getByText(/44 verified/)).toBeInTheDocument()
  })

  it('renders engine pulse badges for protect, grow, execute', () => {
    renderHero()
    // EnginePulseBadge renders engine values — threats, savings/mo, to approve
    expect(screen.getByText('threats')).toBeInTheDocument()
    expect(screen.getByText('savings/mo')).toBeInTheDocument()
    expect(screen.getByText('to approve')).toBeInTheDocument()
  })

  it('omits "Execute queued" from narrative when pendingActions is 0', () => {
    renderHero({ pendingActions: 0, nextApproval: null, onReviewApproval: null })
    // Narrative is inside a <p> tag — find the specific narrative paragraph
    const narrativeEls = screen.getAllByText(/\$444\/mo/)
    const narrativeP = narrativeEls.find((el) => el.tagName === 'P')
    expect(narrativeP).toBeDefined()
    expect(narrativeP!.textContent).not.toMatch(/0 action/)
    expect(narrativeP!.textContent).not.toMatch(/ready for your approval/)
  })

  it('uses singular "action" when pendingActions is 1', () => {
    renderHero({ pendingActions: 1 })
    expect(screen.getByText(/1 action(?!s)/)).toBeInTheDocument()
  })

  it('renders govern rail with trust narrative', () => {
    renderHero()
    const rail = screen.getByTestId('govern-rail')
    expect(rail).toBeInTheDocument()
    expect(rail.textContent).toContain('verified and auditable')
  })

  it('renders audit stream as aria-hidden container', () => {
    renderHero()
    const stream = screen.getByTestId('audit-stream')
    expect(stream).toHaveAttribute('aria-hidden', 'true')
    expect(stream.children.length).toBeGreaterThan(0)
  })

  it('fires onReviewThreat callback on click', () => {
    const { props } = renderHero()
    const btns = screen.getAllByRole('button', { name: /review flagged charge/i })
    fireEvent.click(btns[0])
    expect(props.onReviewThreat).toHaveBeenCalledOnce()
  })

  it('hides review threat button when criticalSignal is null', () => {
    renderHero({ criticalSignal: null, onReviewThreat: null })
    expect(screen.queryByRole('button', { name: /review flagged charge/i })).not.toBeInTheDocument()
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

  it('renders hero with govern trust narrative', () => {
    renderDashboard()
    const rail = screen.getByTestId('govern-rail')
    expect(rail.textContent).toContain('verified and auditable')
  })

  it('does not render duplicate h1 elements', () => {
    renderDashboard()
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
  })
})
