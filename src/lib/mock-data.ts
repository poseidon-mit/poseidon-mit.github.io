export const MOCK_USER = {
  name: 'Shinji',
  initials: 'SF',
  email: 'shinji@mit.com',
}

export const MOCK_NET_WORTH = {
  total: 94040.77,
  change: 1247,
  changePercent: 1.3,
  assets: 115722.09,
  liabilities: 21681.32,
  monthlyCashFlow: 8500,
}

export const MOCK_SPARKLINE_DATA = [
  88200, 89500, 90800, 91400, 92700, 94041,
]

export const MOCK_ENGINE_STATUS = [
  {
    engine: 'protect' as const,
    label: 'Protect',
    status: '5 High',
    statusColor: '#16A34A',
    metric: '20 threats detected',
    metricValue: 20,
    metricFormat: (n: number) => `${Math.round(n)} threats detected`,
    subtext: '5 high · 10 medium · 5 low',
  },
  {
    engine: 'grow' as const,
    label: 'Grow',
    status: 'Optimizing',
    statusColor: '#7C3AED',
    metric: '$8,229/yr savings found',
    metricValue: 8229,
    metricFormat: (n: number) => `$${Math.round(n).toLocaleString()}/yr savings found`,
    subtext: '20 recommendations · 1 approved',
  },
  {
    engine: 'execute' as const,
    label: 'Execute',
    status: '20 pending',
    statusColor: '#CA8A04',
    metric: '$399.60 tax savings',
    metricValue: 399.60,
    metricFormat: (n: number) => `$${n.toFixed(2)} tax savings`,
    subtext: 'Tax-loss harvest deadline: Mar 31',
  },
  {
    engine: 'govern' as const,
    label: 'Govern',
    status: 'Monitoring',
    statusColor: '#2563EB',
    metric: '2,847 decisions logged',
    metricValue: 2847,
    metricFormat: (n: number) => `${Math.round(n).toLocaleString()} decisions logged`,
    subtext: '100% auditable',
  },
]

export const MOCK_RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'protect' as const,
    title: 'Unusual login from Oslo, Norway',
    description: 'New device detected at 3:42 AM',
    time: '2 min ago',
    action: 'Review',
  },
  {
    id: '2',
    type: 'protect' as const,
    title: 'Suspicious transaction flagged',
    description: 'Oslo Electronics — $234.50',
    time: '7 min ago',
    action: 'Review',
  },
  {
    id: '3',
    type: 'grow' as const,
    title: 'High-yield savings opportunity',
    description: '$269.40/yr additional interest',
    time: '1 hour ago',
    note: 'Move $8,200 to high-yield savings',
  },
  {
    id: '4',
    type: 'execute' as const,
    title: 'Dividend reinvestment completed',
    description: '$847.32 → 14.2 shares VXUS',
    time: 'Yesterday',
    amount: 847.32,
  },
  {
    id: '5',
    type: 'govern' as const,
    title: 'Audit check passed',
    description: 'All 6 recent decisions verified',
    time: 'Yesterday',
    action: 'View',
  },
]
