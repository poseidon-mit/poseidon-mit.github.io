import { describe, test, expect, vi, beforeAll } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../test/render-with-router'
import { CommandPalette } from '../components/layout/CommandPalette'

// cmdk calls scrollIntoView which jsdom doesn't implement
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

describe('Command Palette taxonomy is strictly Consumer-focused', () => {
  test('Command Palette indexes consumer-level navigation actions', () => {
    renderWithRouter(
      <CommandPalette isOpen={true} onClose={vi.fn()} />
    )

    // Consumer navigation actions must be present
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Protect')).toBeInTheDocument()
    expect(screen.getByText('Grow')).toBeInTheDocument()
    expect(screen.getByText('Execute')).toBeInTheDocument()
    expect(screen.getByText('Govern')).toBeInTheDocument()
    expect(screen.getByText('Approve Pending Actions')).toBeInTheDocument()
    expect(screen.getByText('View Audit Ledger')).toBeInTheDocument()
  })

  test('B2B enterprise terminology is absent from Command Palette', () => {
    renderWithRouter(
      <CommandPalette isOpen={true} onClose={vi.fn()} />
    )

    // B2B terms must NOT be present
    expect(screen.queryByText(/AML/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Wire Transfer/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/\bEngine\b/)).not.toBeInTheDocument()
  })
})
