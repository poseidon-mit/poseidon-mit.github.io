import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { GrowHero, GrowGrowthAdvantage } from '../components/poseidon/grow-hero'
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
  { year: 'Now', baseline: 130000, aiOptimized: 130000, low: 130000, high: 130000 },
  { year: '3M',  baseline: 130975, aiOptimized: 133280, low: 131500, high: 135000 },
  { year: '6M',  baseline: 131950, aiOptimized: 136620, low: 134000, high: 139200 },
  { year: '9M',  baseline: 132925, aiOptimized: 140020, low: 137500, high: 142500 },
  { year: '1Y',  baseline: 133900, aiOptimized: 143500, low: 141000, high: 146000 },
  { year: '15M', baseline: 134904, aiOptimized: 147040, low: 144500, high: 149500 },
  { year: '18M', baseline: 135909, aiOptimized: 150650, low: 148000, high: 153300 },
  { year: '21M', baseline: 136913, aiOptimized: 154330, low: 151500, high: 157100 },
  { year: '2Y',  baseline: 137917, aiOptimized: 158080, low: 155000, high: 161200 },
  { year: '27M', baseline: 138951, aiOptimized: 161520, low: 158500, high: 164500 },
  { year: '30M', baseline: 139986, aiOptimized: 165040, low: 162000, high: 168100 },
  { year: '33M', baseline: 141020, aiOptimized: 168630, low: 165500, high: 171800 },
  { year: '3Y',  baseline: 142055, aiOptimized: 172300, low: 169000, high: 175600 },
]

const DEFAULT_PROPS = {
  projectedGain: 30245,
  totalMonthlySavings: 759,
  avgConfidence: 0.87,
  recommendationCount: 10,
  simulationData: SIMULATION_DATA,
  onViewRecommendations: vi.fn(),
}

function renderHero(overrides: Partial<typeof DEFAULT_PROPS & { spotlightRec: any; goals: any; cohortHeadline: string }> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides }
  return { ...render(<GrowHero {...props} />), props }
}

/* ═══════════════════════════════════════════════════════
   FACADE-LEVEL TESTS
   ═══════════════════════════════════════════════════════ */

describe('GrowHero', () => {
  it('renders the projected gain number', () => {
    renderHero()
    expect(screen.getByText(/\+\$/)).toBeInTheDocument()
  })

  it('fires onViewRecommendations when View all button is clicked', () => {
    const { props } = renderHero()
    const btn = screen.getByRole('button', { name: /view all/i })
    fireEvent.click(btn)
    expect(props.onViewRecommendations).toHaveBeenCalledOnce()
  })

  it('renders KPI strip stats', () => {
    renderHero()
    expect(screen.getAllByText(/\$759\/mo/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/10/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/87%/)).toBeInTheDocument()
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

  it('renders headline text', () => {
    renderHero()
    expect(screen.getByText('Your Growth Trajectory')).toBeInTheDocument()
  })

  /* ── Spotlight Recommendation ── */

  it('renders spotlight recommendation when provided', () => {
    renderHero({
      spotlightRec: { title: 'Refinance auto loan', monthlySavings: 280, confidence: 0.94 },
    })
    expect(screen.getByText('Refinance auto loan')).toBeInTheDocument()
    expect(screen.getByText(/\$280\/mo/)).toBeInTheDocument()
    expect(screen.getByText(/94% confidence/)).toBeInTheDocument()
  })

  it('hides spotlight recommendation when not provided', () => {
    renderHero()
    expect(screen.queryByText('Top Recommendation')).not.toBeInTheDocument()
  })

  /* ── Goal Progress ── */

  it('renders goal progress bars when provided', () => {
    renderHero({
      goals: [
        { id: 'g1', title: 'Condo Down Payment', currentUsd: 12850, targetUsd: 100000 },
        { id: 'g2', title: 'Emergency Fund', currentUsd: 8200, targetUsd: 39000 },
      ],
    })
    expect(screen.getByText('Condo Down Payment')).toBeInTheDocument()
    expect(screen.getByText('Emergency Fund')).toBeInTheDocument()
    expect(screen.getByText('13%')).toBeInTheDocument()
    expect(screen.getByText('21%')).toBeInTheDocument()
  })

  it('hides goal progress when not provided', () => {
    renderHero()
    expect(screen.queryByText('Goal Progress')).not.toBeInTheDocument()
  })

  /* ── Cohort Headline ── */

  it('renders cohort headline when provided', () => {
    renderHero({
      cohortHeadline: '12,847 similar users saved $4,200/year',
    })
    expect(screen.getByText('12,847 similar users saved $4,200/year')).toBeInTheDocument()
  })

  it('hides cohort headline when not provided', () => {
    renderHero()
    expect(screen.queryByText(/similar users/)).not.toBeInTheDocument()
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
      expect(screen.getByText(/\+\$/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument()
    })
  })
})

/* ── Backward compatibility ── */

describe('GrowGrowthAdvantage (backward compat)', () => {
  it('is the same component as GrowHero', () => {
    expect(GrowGrowthAdvantage).toBe(GrowHero)
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
    expect(screen.getByText(/\+\$/)).toBeInTheDocument()
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

  it('renders spotlight recommendation from canonical data', () => {
    renderGrowPage()
    expect(screen.getByText('Top Recommendation')).toBeInTheDocument()
  })

  it('renders goal progress section', () => {
    renderGrowPage()
    expect(screen.getByText('Goal Progress')).toBeInTheDocument()
  })
})
