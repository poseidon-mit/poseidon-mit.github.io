import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CohortFraudTrend } from '../components/poseidon/cohort-fraud-trend'

const DEFAULT_PROPS = {
  label: 'Card-not-present fraud up 23% this quarter',
  changePercent: 23,
  period: 'Q1 2026',
  factors: [
    { label: 'Online merchant category risk', value: 0.82 },
    { label: 'Cross-border transaction velocity', value: 0.74 },
    { label: 'New device fingerprint frequency', value: 0.68 },
  ],
}

describe('CohortFraudTrend', () => {
  describe('compact variant', () => {
    it('renders label and change percent', () => {
      render(<CohortFraudTrend {...DEFAULT_PROPS} variant="compact" />)
      expect(screen.getByText(DEFAULT_PROPS.label)).toBeInTheDocument()
      expect(screen.getByText(/\+23%/)).toBeInTheDocument()
      expect(screen.getByText('Q1 2026')).toBeInTheDocument()
    })

    it('does not render factors list', () => {
      render(<CohortFraudTrend {...DEFAULT_PROPS} variant="compact" />)
      expect(screen.queryByText(/Online merchant/)).not.toBeInTheDocument()
    })

    it('does not render heading', () => {
      render(<CohortFraudTrend {...DEFAULT_PROPS} variant="compact" />)
      expect(screen.queryByText(/Platform Fraud Trends/)).not.toBeInTheDocument()
    })
  })

  describe('detailed variant (default)', () => {
    it('renders heading, label, and change percent', () => {
      render(<CohortFraudTrend {...DEFAULT_PROPS} />)
      expect(screen.getByText('Platform Fraud Trends')).toBeInTheDocument()
      expect(screen.getByText(DEFAULT_PROPS.label)).toBeInTheDocument()
      expect(screen.getByText(/\+23%/)).toBeInTheDocument()
      expect(screen.getByText('Q1 2026')).toBeInTheDocument()
    })

    it('renders all factors', () => {
      render(<CohortFraudTrend {...DEFAULT_PROPS} />)
      expect(screen.getByText(/Online merchant category risk/)).toBeInTheDocument()
      expect(screen.getByText(/Cross-border transaction velocity/)).toBeInTheDocument()
      expect(screen.getByText(/New device fingerprint frequency/)).toBeInTheDocument()
    })

    it('formats factor values to 2 decimal places', () => {
      render(<CohortFraudTrend {...DEFAULT_PROPS} />)
      expect(screen.getByText(/0\.82/)).toBeInTheDocument()
      expect(screen.getByText(/0\.74/)).toBeInTheDocument()
      expect(screen.getByText(/0\.68/)).toBeInTheDocument()
    })
  })

  it('omits plus sign for negative change', () => {
    render(<CohortFraudTrend {...DEFAULT_PROPS} changePercent={-5} variant="compact" />)
    expect(screen.getByText(/-5%/)).toBeInTheDocument()
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
  })
})
