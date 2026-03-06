import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GrowGrowthAdvantage } from '../components/poseidon/grow-hero'
import { RECOMMENDATIONS_SUMMARY } from '../pages/grow/recommendation-detail-data'
import { RouterProvider } from '../router'
import GrowPage from '../pages/Grow'

/* ── Mock useReducedMotionSafe ── */
vi.mock('../hooks/useReducedMotionSafe', () => ({
  useReducedMotionSafe: vi.fn(() => false),
}))

import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe'

/* ── Test data ── */

const SIMULATION_DATA = [
  { year: 'Now', baseline: 200000, aiOptimized: 200000 },
  { year: '1Y', baseline: 204000, aiOptimized: 211584 },
  { year: '2Y', baseline: 208080, aiOptimized: 223797 },
  { year: '3Y', baseline: 212242, aiOptimized: 236679 },
]

const DEFAULT_PROPS = {
  projectedGain: 24437,
  totalMonthlySavings: 612,
  avgConfidence: 0.87,
  recommendationCount: 8,
  simulationData: SIMULATION_DATA,
  currentPercentile: 23,
  projectedPercentile: 67,
  cohortBracket: 'your income bracket',
  topRecommendation: {
    rank: 1,
    title: 'Reduce Credit Card Interest',
    monthlySavings: 164,
    confidence: 0.88,
  },
  onViewRecommendations: vi.fn(),
  onQueueTopAction: vi.fn(),
}

function renderHero(overrides: Partial<typeof DEFAULT_PROPS> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides }
  return { ...render(<GrowGrowthAdvantage {...props} />), props }
}

/* ═══════════════════════════════════════════════════════
   FACADE-LEVEL TESTS
   ═══════════════════════════════════════════════════════ */

describe('GrowGrowthAdvantage', () => {
  it('renders the projected gain number formatted with commas', () => {
    renderHero()
    expect(screen.getByText(/\+\$24,437/)).toBeInTheDocument()
  })

  it('fires onViewRecommendations when View all button is clicked', () => {
    const { props } = renderHero()
    const btn = screen.getByRole('button', { name: /view all/i })
    fireEvent.click(btn)
    expect(props.onViewRecommendations).toHaveBeenCalledOnce()
  })

  it('fires onQueueTopAction when Queue for Execution button is clicked', () => {
    const { props } = renderHero()
    const btn = screen.getByRole('button', { name: /queue for execution/i })
    fireEvent.click(btn)
    expect(props.onQueueTopAction).toHaveBeenCalledOnce()
  })

  it('renders cohort percentiles', () => {
    renderHero()
    expect(screen.getByText(/23rd/)).toBeInTheDocument()
    expect(screen.getByText(/67th/)).toBeInTheDocument()
  })

  it('renders top recommendation title and monthly savings', () => {
    renderHero()
    expect(screen.getByText('Reduce Credit Card Interest')).toBeInTheDocument()
    expect(screen.getByText(/\$164\/mo/)).toBeInTheDocument()
  })

  it('renders summary stats', () => {
    renderHero()
    // $612/mo appears in both summary stats and KPI card
    expect(screen.getAllByText(/\$612\/mo/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/8 recommendations/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/87% avg confidence/)).toBeInTheDocument()
  })

  it('renders the chart with an accessible aria-label', () => {
    renderHero()
    const chart = screen.getByRole('img', { name: /3-year growth/i })
    expect(chart).toBeInTheDocument()
  })

  it('hides Next Best Action pane when topRecommendation is null', () => {
    renderHero({ topRecommendation: null, onQueueTopAction: null })
    expect(screen.queryByText('Reduce Credit Card Interest')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /queue for execution/i })).not.toBeInTheDocument()
  })

  /* ── New tests ── */

  it('renders replay button', () => {
    renderHero()
    expect(screen.getByRole('button', { name: /replay/i })).toBeInTheDocument()
  })

  it('renders cohort acceptance rate when provided', () => {
    renderHero({ cohortAcceptanceRate: 0.89 })
    expect(screen.getByText(/89% cohort acceptance rate/)).toBeInTheDocument()
  })

  it('omits cohort acceptance rate when not provided', () => {
    renderHero()
    expect(screen.queryByText(/cohort acceptance rate/)).not.toBeInTheDocument()
  })

  it('renders platform profile count in cohort card', () => {
    renderHero({ platformProfileCount: 184290 })
    expect(screen.getByText(/184,290/)).toBeInTheDocument()
    expect(screen.getByText(/active profiles/)).toBeInTheDocument()
  })

  it('hides replay button when reduced motion is preferred', () => {
    vi.mocked(useReducedMotionSafe).mockReturnValue(true)
    renderHero()
    expect(screen.queryByRole('button', { name: /replay/i })).not.toBeInTheDocument()
    vi.mocked(useReducedMotionSafe).mockReturnValue(false)
  })

  it('replay click does not regress visible content', () => {
    renderHero()
    expect(screen.getByText(/\+\$24,437/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /replay/i }))
    expect(screen.getByText(/\+\$24,437/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument()
  })
})

/* ═══════════════════════════════════════════════════════
   PAGE-LEVEL INTEGRATION TESTS
   ═══════════════════════════════════════════════════════ */

describe('GrowPage integration', () => {
  function renderGrowPage() {
    window.history.pushState({}, '', '/grow')
    return render(
      <RouterProvider>
        <GrowPage />
      </RouterProvider>,
    )
  }

  it('renders hero with derived projected gain', () => {
    renderGrowPage()
    // FINAL_DATA.aiOptimized(236679) - FINAL_DATA.baseline(212242) = 24437
    expect(screen.getByText(/\+\$24,437/)).toBeInTheDocument()
  })

  it('navigates to /grow/recommendations when View all is clicked', () => {
    renderGrowPage()
    const btn = screen.getByRole('button', { name: /view all/i })
    fireEvent.click(btn)
    expect(window.location.pathname).toBe('/grow/recommendations')
  })

  it('navigates to /execute when Queue for Execution is clicked', () => {
    renderGrowPage()
    const btn = screen.getByRole('button', { name: /queue for execution/i })
    fireEvent.click(btn)
    expect(window.location.pathname).toBe('/execute')
  })

  it('derives totalMonthlySavings from RECOMMENDATIONS_SUMMARY', () => {
    renderGrowPage()
    const expected = RECOMMENDATIONS_SUMMARY.reduce((s, r) => s + r.monthly, 0)
    // $X/mo appears in both summary stats and KPI card
    expect(screen.getAllByText(new RegExp(`\\$${expected.toLocaleString()}/mo`)).length).toBeGreaterThanOrEqual(1)
  })
})
