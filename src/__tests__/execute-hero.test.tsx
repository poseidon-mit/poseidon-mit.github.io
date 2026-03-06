import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { ExecuteApprovalCommandDeck } from '../components/poseidon/execute-hero'
import { RouterProvider } from '../router'
import { DemoStateProvider } from '../lib/demo-state/provider'
import { useDemoState } from '../lib/demo-state/provider'
import { resetDemoStateStorage } from '../lib/demo-state/storage'
import ExecutePage from '../pages/Execute'

/* ── Fixtures ── */

const DEFAULT_PROPS = {
  queueTotal: 5,
  urgentCount: 2,
  agentStepsCompleted: 2,
  agentStepsTotal: 3,
  featuredAction: {
    id: 'EXE-002',
    title: 'Flag suspicious wire transfer',
    amountLabel: '$2,847',
    confidence: 0.94,
    engine: 'Protect' as const,
    sourceEngine: 'Protect' as const,
    expiresIn: '6h',
    rollbackHours: 48,
  },
  engineSources: [
    { engine: 'Protect' as const, count: 1, color: 'var(--engine-protect)' },
    { engine: 'Execute' as const, count: 3, color: 'var(--engine-execute)' },
    { engine: 'Grow' as const, count: 1, color: 'var(--engine-grow)' },
  ],
  onReviewApproval: vi.fn(),
}

function renderHero(overrides: Partial<typeof DEFAULT_PROPS> = {}) {
  const props = { ...DEFAULT_PROPS, ...overrides }
  const result = render(<ExecuteApprovalCommandDeck {...props} />)
  const hero = result.container.querySelector('[role="region"]') as HTMLElement
  return { ...result, props, hero }
}

/* ═══════════════════════════════════════════════════════
   SECTION 1: FACADE TESTS (pure component)
   ═══════════════════════════════════════════════════════ */

describe('ExecuteApprovalCommandDeck', () => {
  it('renders the headline', () => {
    const { hero } = renderHero()
    expect(within(hero).getByText('Nothing moves without your yes.')).toBeInTheDocument()
  })

  it('renders pipeline nodes', () => {
    const { hero } = renderHero()
    expect(within(hero).getByText('Agent Prepared')).toBeInTheDocument()
    expect(within(hero).getByText('Your Approval')).toBeInTheDocument()
    expect(within(hero).getByText('Govern Logged')).toBeInTheDocument()
  })

  it('renders agent step count in pipeline', () => {
    const { hero } = renderHero()
    expect(within(hero).getByText('2/3 steps')).toBeInTheDocument()
  })

  it('renders featured action title and amount', () => {
    const { hero } = renderHero()
    expect(within(hero).getByText('Flag suspicious wire transfer')).toBeInTheDocument()
    expect(within(hero).getByText('$2,847')).toBeInTheDocument()
  })

  it('renders engine source breakdown with counts', () => {
    const { hero } = renderHero()
    expect(within(hero).getByText('Cross-Engine Sources')).toBeInTheDocument()
    // Verify source counts are rendered
    const sourceSection = hero.textContent
    expect(sourceSection).toContain('Grow')
    // Count entries: Protect appears in badge AND sources, so just check the section exists
    expect(within(hero).getAllByText('Protect').length).toBeGreaterThanOrEqual(2) // badge + source
  })

  it('renders rollback info from rollbackHours', () => {
    const { hero } = renderHero()
    expect(within(hero).getByText('48h reversible')).toBeInTheDocument()
  })

  it('renders queue summary', () => {
    const { hero } = renderHero()
    const summaryText = hero.textContent
    expect(summaryText).toContain('5 queued')
    expect(summaryText).toContain('2 urgent')
  })

  it('fires onReviewApproval on CTA click', () => {
    const { hero, props } = renderHero()
    const btn = within(hero).getByRole('button', { name: /review & approve/i })
    fireEvent.click(btn)
    expect(props.onReviewApproval).toHaveBeenCalledOnce()
  })

  it('renders empty state when featuredAction is null', () => {
    const { hero } = renderHero({ featuredAction: null, onReviewApproval: null })
    expect(within(hero).getByText('Queue clear')).toBeInTheDocument()
    expect(within(hero).queryByText('Flag suspicious wire transfer')).not.toBeInTheDocument()
    expect(within(hero).queryByText('Agent Prepared')).not.toBeInTheDocument()
    expect(within(hero).queryByText('Cross-Engine Sources')).not.toBeInTheDocument()
    expect(within(hero).queryByRole('button', { name: /review & approve/i })).not.toBeInTheDocument()
  })

  it('hides CTA when onReviewApproval is null', () => {
    const { hero } = renderHero({ onReviewApproval: null })
    expect(within(hero).queryByRole('button', { name: /review & approve/i })).not.toBeInTheDocument()
  })

  it('hides rollback info when rollbackHours is null', () => {
    const { hero } = renderHero({
      featuredAction: { ...DEFAULT_PROPS.featuredAction, rollbackHours: null },
    })
    expect(within(hero).queryByText(/reversible/)).not.toBeInTheDocument()
  })
})

/* ═══════════════════════════════════════════════════════
   SECTION 2: FEATURED ACTION SELECTION LOGIC
   ═══════════════════════════════════════════════════════ */

describe('ExecutePage featured action selection', () => {
  beforeEach(() => {
    resetDemoStateStorage()
  })

  function renderExecute() {
    window.history.pushState({}, '', '/execute')
    return render(
      <DemoStateProvider>
        <RouterProvider>
          <ExecutePage />
        </RouterProvider>
      </DemoStateProvider>,
    )
  }

  it('selects EXE-002 as initial featured action (high urgency, shortest expiry)', () => {
    const { container } = renderExecute()
    const hero = container.querySelector('[role="region"]') as HTMLElement
    expect(within(hero).getByText('Flag suspicious wire transfer')).toBeInTheDocument()
  })
})

/* ═══════════════════════════════════════════════════════
   SECTION 3: STATE MUTATION REGRESSION
   ═══════════════════════════════════════════════════════ */

describe('ExecutePage hero state mutation', () => {
  beforeEach(() => {
    resetDemoStateStorage()
  })

  function TestHarness() {
    const { setExecuteDecision } = useDemoState()
    return (
      <>
        <button
          data-testid="approve-exe002"
          onClick={() => setExecuteDecision({
            actionId: 'EXE-002',
            actionTitle: 'Flag suspicious wire transfer',
            decision: 'approved',
          })}
        />
        <ExecutePage />
      </>
    )
  }

  function renderWithState() {
    window.history.pushState({}, '', '/execute')
    return render(
      <DemoStateProvider>
        <RouterProvider>
          <TestHarness />
        </RouterProvider>
      </DemoStateProvider>,
    )
  }

  it('updates featured action after approving EXE-002', () => {
    const { container } = renderWithState()
    const hero = container.querySelector('[role="region"]') as HTMLElement

    // Before: EXE-002
    expect(within(hero).getByText('Flag suspicious wire transfer')).toBeInTheDocument()

    // Approve EXE-002
    fireEvent.click(screen.getByTestId('approve-exe002'))

    // After: next featured action should be EXE-001 (high urgency, 14h expiry)
    expect(within(hero).getByText('Portfolio rebalance')).toBeInTheDocument()
    expect(within(hero).queryByText('Flag suspicious wire transfer')).not.toBeInTheDocument()
  })

  it('updates queue summary after approving EXE-002', () => {
    const { container } = renderWithState()
    const hero = container.querySelector('[role="region"]') as HTMLElement

    // Before: 5 queued · 2 urgent
    expect(hero.textContent).toContain('5 queued')
    expect(hero.textContent).toContain('2 urgent')

    fireEvent.click(screen.getByTestId('approve-exe002'))

    // After: 4 queued · 1 urgent
    expect(hero.textContent).toContain('4 queued')
    expect(hero.textContent).toContain('1 urgent')
  })
})

/* ═══════════════════════════════════════════════════════
   SECTION 4: NAVIGATION
   ═══════════════════════════════════════════════════════ */

describe('ExecutePage hero navigation', () => {
  beforeEach(() => {
    resetDemoStateStorage()
  })

  function renderExecute() {
    window.history.pushState({}, '', '/execute')
    return render(
      <DemoStateProvider>
        <RouterProvider>
          <ExecutePage />
        </RouterProvider>
      </DemoStateProvider>,
    )
  }

  it('navigates to execute approval on hero CTA click', () => {
    const { container } = renderExecute()
    const hero = container.querySelector('[role="region"]') as HTMLElement
    const btn = within(hero).getByRole('button', { name: /review & approve/i })
    fireEvent.click(btn)
    expect(window.location.pathname).toBe('/execute/approval')
    expect(window.location.search).toBe('?actionId=EXE-002')
  })

  it('renders consent trust badge with zero auto-executions', () => {
    renderExecute()
    expect(screen.getByText(/auto-executions/)).toBeInTheDocument()
    expect(screen.getByText(/Your final approval is always required/)).toBeInTheDocument()
  })
})
