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
  { year: '3M',  baseline: 130975, aiOptimized: 132100 },
  { year: '6M',  baseline: 131950, aiOptimized: 134200 },
  { year: '9M',  baseline: 132925, aiOptimized: 136300 },
  { year: '1Y',  baseline: 133900, aiOptimized: 138400 },
  { year: '15M', baseline: 134904, aiOptimized: 140650 },
  { year: '18M', baseline: 135909, aiOptimized: 142900 },
  { year: '21M', baseline: 136913, aiOptimized: 145150 },
  { year: '2Y',  baseline: 137917, aiOptimized: 147400 },
  { year: '27M', baseline: 138951, aiOptimized: 149559 },
  { year: '30M', baseline: 139986, aiOptimized: 151718 },
  { year: '33M', baseline: 141020, aiOptimized: 153878 },
  { year: '3Y',  baseline: 142055, aiOptimized: 156037 },
]

const DEFAULT_PROPS = {
  projectedGain: 13982,
  totalMonthlySavings: 444,
  avgConfidence: 0.87,
  recommendationCount: 8,
  simulationData: SIMULATION_DATA,
  onViewRecommendations: vi.fn(),
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

  it('renders summary stats', () => {
    renderHero()
    expect(screen.getAllByText(/\$444\/mo/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/8 recommendations/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/87% avg confidence/)).toBeInTheDocument()
  })

  it('renders the chart with an accessible aria-label', () => {
    renderHero()
    const chart = screen.getByRole('img', { name: /3-year growth/i })
    expect(chart).toBeInTheDocument()
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

    it('replay click does not regress visible content', () => {
      renderHero()
      fireEvent.click(screen.getByRole('button', { name: /see poseidon delta/i }))
      fireEvent.click(screen.getByRole('button', { name: /replay/i }))
      act(() => vi.advanceTimersByTime(1200))
      expect(screen.getByText(/\+\$13,982/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument()
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

  it('derives totalMonthlySavings from RECOMMENDATIONS_SUMMARY', () => {
    renderGrowPage()
    const expected = RECOMMENDATIONS_SUMMARY.reduce((s, r) => s + r.monthly, 0)
    expect(screen.getAllByText(new RegExp(`\\$${expected.toLocaleString()}/mo`)).length).toBeGreaterThanOrEqual(1)
  })
})
