import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
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
  { year: 'Now', baseline: 130000, aiOptimized: 130000 },
  { year: '1Y', baseline: 133900, aiOptimized: 138400 },
  { year: '2Y', baseline: 137917, aiOptimized: 147400 },
  { year: '3Y', baseline: 142055, aiOptimized: 156037 },
]

const DEFAULT_PROPS = {
  projectedGain: 13982,
  totalMonthlySavings: 444,
  avgConfidence: 0.87,
  recommendationCount: 8,
  simulationData: SIMULATION_DATA,
  currentPercentile: 23,
  projectedPercentile: 67,
  cohortBracket: 'your income bracket',
  topRecommendation: {
    rank: 1,
    title: 'Switch to High-Yield Savings',
    monthlySavings: 70,
    confidence: 0.93,
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
    expect(screen.getByText(/\+\$13,982/)).toBeInTheDocument()
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

  it('renders strategy impact section', () => {
    renderHero()
    expect(screen.getByText(/Strategy Impact/)).toBeInTheDocument()
  })

  it('renders top recommendation title and monthly savings', () => {
    renderHero()
    expect(screen.getByText('Switch to High-Yield Savings')).toBeInTheDocument()
    expect(screen.getByText(/\$70\/mo/)).toBeInTheDocument()
  })

  it('renders summary stats', () => {
    renderHero()
    // $444/mo appears in both summary stats and KPI card
    expect(screen.getAllByText(/\$444\/mo/).length).toBeGreaterThanOrEqual(1)
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
    expect(screen.queryByText('Switch to High-Yield Savings')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /queue for execution/i })).not.toBeInTheDocument()
  })

  it('omits cohort acceptance rate when not provided', () => {
    renderHero()
    expect(screen.queryByText(/tier adoption rate/)).not.toBeInTheDocument()
  })

  it('hides replay and delta buttons when reduced motion is preferred', () => {
    vi.mocked(useReducedMotionSafe).mockReturnValue(true)
    renderHero()
    expect(screen.queryByRole('button', { name: /replay/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /see poseidon delta/i })).not.toBeInTheDocument()
    vi.mocked(useReducedMotionSafe).mockReturnValue(false)
  })

  /* ── Optimize + Replay flow ── */

  describe('replay flow', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('shows See Poseidon Delta initially, Replay after optimize', () => {
      renderHero()
      expect(screen.getByRole('button', { name: /see poseidon delta/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /replay/i })).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /see poseidon delta/i }))
      expect(screen.getByRole('button', { name: /replay/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /see poseidon delta/i })).not.toBeInTheDocument()
    })

    it('renders active portfolios count after optimize', () => {
      renderHero({ cohortAcceptanceRate: 0.89, platformProfileCount: 184290 })
      fireEvent.click(screen.getByRole('button', { name: /see poseidon delta/i }))
      expect(screen.getByText(/184,290/)).toBeInTheDocument()
    })

    it('renders platform profile count after optimize', () => {
      renderHero({ platformProfileCount: 184290 })
      fireEvent.click(screen.getByRole('button', { name: /see poseidon delta/i }))
      expect(screen.getByText(/184,290/)).toBeInTheDocument()
      expect(screen.getByText(/active portfolios/)).toBeInTheDocument()
    })

    it('replay click does not regress visible content', () => {
      renderHero({ cohortAcceptanceRate: 0.89, platformProfileCount: 184290 })
      fireEvent.click(screen.getByRole('button', { name: /see poseidon delta/i }))
      fireEvent.click(screen.getByRole('button', { name: /replay/i }))
      act(() => vi.advanceTimersByTime(1200))
      expect(screen.getByText(/\+\$13,982/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument()
      expect(screen.getByText(/184,290/)).toBeInTheDocument()
    })
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
    // FINAL_DATA.aiOptimized(156037) - FINAL_DATA.baseline(142055) = 13982
    expect(screen.getByText(/\+\$13,982/)).toBeInTheDocument()
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

  it('dismiss replaces top recommendation with next best', () => {
    renderGrowPage()
    // Get current top recommendation title
    const sorted = [...RECOMMENDATIONS_SUMMARY].sort((a, b) => a.rank - b.rank)
    const firstTitle = sorted[0].title
    const secondTitle = sorted[1]?.title

    // Verify the top recommendation is displayed
    expect(screen.getByText(firstTitle)).toBeInTheDocument()

    // Click "Not useful"
    const dismissBtn = screen.getByRole('button', { name: /not useful/i })
    fireEvent.click(dismissBtn)

    // The first recommendation should be gone and second should appear
    if (secondTitle) {
      expect(screen.getByText(secondTitle)).toBeInTheDocument()
    }
  })
})
