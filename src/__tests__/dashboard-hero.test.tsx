import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardHero } from '../components/poseidon/dashboard-hero'
import { RouterProvider } from '../router'
import DashboardPage from '../pages/Dashboard'

/* ── Test data ── */

const DEFAULT_PROPS = {
  userName: 'Shinji',
  netWorth: 94041,
  netWorthChange: 1247,
  netWorthChangePercent: 1.3,
  sparklineData: [88200, 89500, 90800, 91400, 92700, 94041],
  healthScore: 82.4,
  healthBreakdown: [
    { engine: 'protect' as const, weight: 0.3, value: 80 },
    { engine: 'grow' as const, weight: 0.3, value: 75 },
    { engine: 'execute' as const, weight: 0.2, value: 90 },
    { engine: 'govern' as const, weight: 0.2, value: 85 },
  ],
  protectSignal: {
    threatCount: 5,
    topAmount: '$234.50',
    topCounterparty: 'AMZN Mktp US*3K7R2F',
    severity: 'Critical',
  },
  growSignal: {
    savingsPerMonth: 203,
    recCount: 4,
    topTitle: 'Switch to high-yield savings',
  },
  executeSignal: {
    pendingCount: 3,
    topTitle: 'Tax-loss harvest',
    topAmount: '$399.60',
  },
  decisionsAudited: 2847,
  complianceScore: 98,
  onNavigate: vi.fn(),
}

function renderHero(overrides: Partial<typeof DEFAULT_PROPS> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides }
  return { ...render(<DashboardHero {...props} />), props }
}

/* ═══════════════════════════════════════════════════════
   FACADE-LEVEL TESTS
   ═══════════════════════════════════════════════════════ */

describe('DashboardHero', () => {
  it('renders the greeting with user name', () => {
    renderHero()
    expect(screen.getByText(/Shinji/)).toBeInTheDocument()
  })

  it('renders engine signal cards', () => {
    renderHero()
    expect(screen.getByText(/5 active threats/)).toBeInTheDocument()
    expect(screen.getByText(/4 recommendations/)).toBeInTheDocument()
    expect(screen.getByText(/3 pending approvals/)).toBeInTheDocument()
  })

  it('renders govern badge with verified count', () => {
    renderHero()
    expect(screen.getByText(/2,847 decisions verified/)).toBeInTheDocument()
  })

  it('fires onNavigate when signal card is clicked', () => {
    const { props } = renderHero()
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(props.onNavigate).toHaveBeenCalled()
  })

  it('hides protect signal when null', () => {
    renderHero({ protectSignal: null })
    expect(screen.queryByText(/active threats/)).not.toBeInTheDocument()
  })

  it('renders net worth label', () => {
    renderHero()
    expect(screen.getByText('Net Worth')).toBeInTheDocument()
  })

  it('renders financial health score label', () => {
    renderHero()
    expect(screen.getByText('Financial Health Score')).toBeInTheDocument()
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

  it('renders hero with net worth label', () => {
    renderDashboard()
    expect(screen.getByText('Net Worth')).toBeInTheDocument()
  })

  it('renders engine signal cards from live data', () => {
    renderDashboard()
    expect(screen.getByText(/active threat/)).toBeInTheDocument()
  })
})
