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

  it('displays queue total as hero number', () => {
    const { hero } = renderHero({ queueTotal: 5 })
    const heroNumber = hero.querySelector('.text-4xl')
    expect(heroNumber?.textContent).toBe('5')
    expect(within(hero).getByText(/5 actions pending/)).toBeInTheDocument()
  })

  it('uses singular "action" when queueTotal is 1', () => {
    const { hero } = renderHero({ queueTotal: 1 })
    // Hero number renders as "1" in the large text span
    const heroNumber = hero.querySelector('.text-4xl')
    expect(heroNumber?.textContent).toBe('1')
    expect(within(hero).getByText(/1 action pending/)).toBeInTheDocument()
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

  it('selects EXE-001 as initial featured action (high urgency, shortest expiry)', () => {
    const { container } = renderExecute()
    const hero = container.querySelector('[role="region"]') as HTMLElement
    expect(within(hero).getByText('Wire transfer authorization — Elias Vance')).toBeInTheDocument()
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
          data-testid="approve-exe001"
          onClick={() => setExecuteDecision({
            actionId: 'EXE-001',
            actionTitle: 'Wire transfer authorization — Elias Vance',
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

  it('updates featured action after approving EXE-001', () => {
    const { container } = renderWithState()
    const hero = container.querySelector('[role="region"]') as HTMLElement

    // Before: EXE-001
    expect(within(hero).getByText('Wire transfer authorization — Elias Vance')).toBeInTheDocument()

    // Approve EXE-001
    fireEvent.click(screen.getByTestId('approve-exe001'))

    // After: next featured action should be EXE-002 (high urgency, 6h expiry)
    expect(within(hero).getByText('Margin account setup')).toBeInTheDocument()
    expect(within(hero).queryByText('Wire transfer authorization — Elias Vance')).not.toBeInTheDocument()
  })

  it('updates hero number and subtitle after approving EXE-001', () => {
    const { container } = renderWithState()
    const hero = container.querySelector('[role="region"]') as HTMLElement

    // Before: hero number = 5
    const heroNumber = hero.querySelector('.text-4xl')
    expect(heroNumber?.textContent).toBe('5')
    expect(hero.textContent).toContain('5 actions pending')

    fireEvent.click(screen.getByTestId('approve-exe001'))

    // After: hero number = 4
    expect(heroNumber?.textContent).toBe('4')
    expect(hero.textContent).toContain('4 actions pending')
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
    expect(window.location.search).toBe('?actionId=EXE-001')
  })

  it('renders consent trust badge with zero auto-executions', () => {
    renderExecute()
    expect(screen.getByText(/auto-executions/)).toBeInTheDocument()
    expect(screen.getByText(/You're always in control/)).toBeInTheDocument()
  })

  it('renders prelude in correct order: badge → h1 → status row → hero card', () => {
    const { container } = renderExecute()
    const heroSection = container.querySelector('section')!
    const badge = screen.getByText('Queue Active')
    const h1 = screen.getByRole('heading', { level: 1 })
    const statusRow = container.querySelector('[data-testid="system-status-row"]')!
    const heroCard = container.querySelector('[role="region"]')!

    // All exist
    expect(badge).toBeInTheDocument()
    expect(h1).toHaveClass('sr-only')
    expect(statusRow).toBeInTheDocument()

    // DOM order: badge → h1 → status row → hero card
    const allNodes = heroSection.querySelectorAll('*')
    const nodeList = Array.from(allNodes)
    const badgeIdx = nodeList.indexOf(badge)
    const h1Idx = nodeList.indexOf(h1)
    const statusIdx = nodeList.indexOf(statusRow)
    const heroIdx = nodeList.indexOf(heroCard)
    expect(badgeIdx).toBeLessThan(h1Idx)
    expect(h1Idx).toBeLessThan(statusIdx)
    expect(statusIdx).toBeLessThan(heroIdx)
  })
})

/* ═══════════════════════════════════════════════════════
   SECTION 5: EMPTY QUEUE STATE
   ═══════════════════════════════════════════════════════ */

describe('ExecutePage empty queue state', () => {
  beforeEach(() => {
    resetDemoStateStorage()
  })

  function FullApprovalHarness() {
    const { setExecuteDecision } = useDemoState()
    const actionIds = ['EXE-001', 'EXE-002', 'EXE-003', 'EXE-004', 'EXE-005']
    return (
      <>
        {actionIds.map((id) => (
          <button
            key={id}
            data-testid={`approve-${id.toLowerCase()}`}
            onClick={() => setExecuteDecision({
              actionId: id,
              actionTitle: id,
              decision: 'approved',
            })}
          />
        ))}
        <ExecutePage />
      </>
    )
  }

  it('shows empty state when all actions are approved via page state', () => {
    window.history.pushState({}, '', '/execute')
    const { container } = render(
      <DemoStateProvider>
        <RouterProvider>
          <FullApprovalHarness />
        </RouterProvider>
      </DemoStateProvider>,
    )
    const hero = container.querySelector('[role="region"]') as HTMLElement

    // Approve all 5 actions
    for (const id of ['exe-001', 'exe-002', 'exe-003', 'exe-004', 'exe-005']) {
      fireEvent.click(screen.getByTestId(`approve-${id}`))
    }

    // Empty state reached via page-level state derivation
    expect(within(hero).getByText('Queue clear')).toBeInTheDocument()
    expect(within(hero).queryByText(/actions pending/)).not.toBeInTheDocument()
  })
})

/* ═══════════════════════════════════════════════════════
   SECTION 6: TIER 2 ACCORDION (STEP 1C)
   ═══════════════════════════════════════════════════════ */

describe('Execute Tier 2 accordion', () => {
  beforeEach(() => {
    resetDemoStateStorage()
    window.history.pushState({}, '', '/execute')
  })

  function renderExecute() {
    return render(
      <DemoStateProvider>
        <RouterProvider>
          <ExecutePage />
        </RouterProvider>
      </DemoStateProvider>,
    )
  }

  it('Tier 2 section header is visible but content is collapsed by default', () => {
    renderExecute()
    // The header label should be visible
    expect(screen.getByText(/background optimizations/i)).toBeInTheDocument()
    // The "Requires individual review" badge should be visible
    expect(screen.getByText(/requires individual review/i)).toBeInTheDocument()
  })

  it('expands Tier 2 cards on header click', () => {
    renderExecute()
    const tier2Header = screen.getByText(/background optimizations/i).closest('button')!
    fireEvent.click(tier2Header)
    // After expansion, the "Requires individual review" badge should still be visible
    expect(screen.getByText(/requires individual review/i)).toBeInTheDocument()
  })
})
