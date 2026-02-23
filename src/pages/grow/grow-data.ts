/**
 * Grow Engine — Data & configuration constants.
 *
 * Types that exist in @/types/engine-data (Goal, GoalStatus, ProjectionPoint,
 * AllocationSlice) are re-exported from there; page-local types live here.
 */

import type { Goal, GoalStatus, ProjectionPoint, AllocationSlice, CitationSource } from '@/types/engine-data'

/* ── Re-exports for convenience ── */
export type { Goal, GoalStatus, ProjectionPoint, AllocationSlice, CitationSource }

/* ── Page-local types ── */

export interface KpiCardData {
  label: string
  value: string
  badge?: { text: string; color: string; bg: string }
  trend?: { text: string; color: string }
}

export interface ActivityItem {
  text: string
  time: string
}

/* ── Status configuration ── */

export const statusConfig: Record<GoalStatus, { color: string; bg: string }> = {
  'On track': { color: 'var(--state-healthy)', bg: 'rgba(16,185,129,0.12)' },
  Behind: { color: 'var(--state-warning)', bg: 'rgba(var(--state-warning-rgb),0.12)' },
  Ahead: { color: 'var(--state-healthy)', bg: 'rgba(16,185,129,0.12)' },
}

/* ── Goals ── */

export const goals: Goal[] = [
  {
    id: 'g1',
    name: 'Retirement by 2045',
    progress: 67,
    target: '$2.4M',
    current: '$847k',
    gap: '$1.55M',
    timeline: '19 years remaining',
    status: 'Behind',
    recommendation: 'Increase monthly contribution by $420',
    confidence: 0.89,
    actions: ['Adjust goal', 'View scenarios'],
  },
  {
    id: 'g2',
    name: 'Emergency fund: $10k',
    progress: 73,
    target: '$10k',
    current: '$7.3k',
    gap: '$2.7k',
    timeline: '6 months to completion',
    status: 'On track',
    recommendation: 'Maintain current savings rate',
    confidence: 0.94,
    actions: ['View details'],
  },
  {
    id: 'g3',
    name: 'Home down payment: $120k',
    progress: 42,
    target: '$120k',
    current: '$50k',
    gap: '$70k',
    timeline: '3.5 years to target',
    status: 'On track',
    recommendation: 'No action needed',
    confidence: 0.91,
    actions: ['View details'],
  },
]

/* ── Projection chart data ── */

export const projectionData: ProjectionPoint[] = [
  { year: '2026', value: 847, low: 780, high: 920 },
  { year: '2030', value: 1100, low: 950, high: 1300 },
  { year: '2035', value: 1500, low: 1200, high: 1900 },
  { year: '2040', value: 2000, low: 1500, high: 2600 },
  { year: '2045', value: 2400, low: 1800, high: 3200 },
  { year: '2050', value: 2800, low: 2000, high: 3800 },
  { year: '2054', value: 2800, low: 2100, high: 3600 },
]

/* ── Asset allocation pie data ── */

export const allocationData: AllocationSlice[] = [
  { name: 'Stocks', value: 62, color: 'var(--engine-grow)' },
  { name: 'Bonds', value: 28, color: 'var(--engine-govern)' },
  { name: 'Cash', value: 10, color: '#64748B' },
]

/* ── Recent activity feed ── */

export const recentActivity: ActivityItem[] = [
  { text: 'Goal updated: Retirement target', time: '2 days ago' },
  { text: 'Contribution increased: +$200/mo', time: '1 week ago' },
  { text: 'Rebalanced portfolio: +2% stocks', time: '2 weeks ago' },
]

/* ── KPI cards ── */

export interface KpiNumeric {
  prefix?: string
  value: number
  decimals?: number
  suffix?: string
}

export const kpiData: (KpiCardData & { numeric?: KpiNumeric })[] = [
  {
    label: 'Net Worth',
    value: '$847.2k',
    numeric: { prefix: '$', value: 847.2, decimals: 1, suffix: 'k' },
    trend: { text: '+$12.4k (+1.5%)', color: 'var(--state-healthy)' },
  },
  {
    label: 'Goal Progress',
    value: '67%',
    numeric: { value: 67, suffix: '%' },
    badge: { text: 'on track', color: 'var(--state-healthy)', bg: 'rgba(16,185,129,0.12)' },
  },
  {
    label: 'Projected Growth',
    value: '+8.2%',
    numeric: { prefix: '+', value: 8.2, decimals: 1, suffix: '%' },
    trend: { text: 'annualized', color: 'var(--state-healthy)' },
  },
  {
    label: 'Risk-adjusted Return',
    value: '6.4%',
    numeric: { value: 6.4, decimals: 1, suffix: '%' },
    trend: { text: 'Sharpe-adjusted', color: '#14B8A6' },
  },
]

/* ── AI Credibility: Citations ── */

export const growCitations: CitationSource[] = [
  { id: 'gc1', label: 'Monte Carlo Simulation', excerpt: '10,000 simulation runs with historical market data. 89% of scenarios achieve retirement target by 2045.', url: 'https://doi.org/10.1016/j.jfineco.2017.06.002' },
  { id: 'gc2', label: 'Contribution Analysis', excerpt: 'Current monthly: $1,580. Recommended: $2,000 (+$420). Gap analysis based on compound growth at 7.2% avg return.' },
  { id: 'gc3', label: 'Cogneau & Zakamouline (2013)', excerpt: 'Block bootstrap methods applied to long-run portfolio projection. Accounts for autocorrelation in equity returns.', url: 'https://doi.org/10.1080/14697688.2013.823512' },
]

/* ── AI Credibility: Methodology ── */

export const growMethodology = {
  modelName: 'GrowthOptimizer',
  modelVersion: '2.8',
  accuracy: 0.912,
  description: 'Monte Carlo simulation engine with 10,000 runs per scenario. Incorporates historical market data, inflation forecasts, and individual spending patterns. Updated weekly with latest market conditions.',
}
