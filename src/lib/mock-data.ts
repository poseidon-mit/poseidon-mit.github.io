export const MOCK_USER = {
  name: 'Shinji',
  initials: 'SF',
  email: 'shinji@mit.com',
}

export const MOCK_NET_WORTH = {
  total: 902753.52,
  change: 18247,
  changePercent: 2.1,
  assets: 909802.27,
  liabilities: 7048.75,
  monthlyCashFlow: 8500,
}

export const MOCK_SPARKLINE_DATA = [
  868200, 875500, 882800, 890400, 895700, 902753,
]

export const MOCK_ENGINE_STATUS = [
  {
    engine: 'protect' as const,
    label: 'Protect',
    status: '2 Critical',
    statusColor: '#16A34A',
    metric: '5 threats detected',
    metricValue: 5,
    metricFormat: (n: number) => `${Math.round(n)} threats detected`,
    subtext: '2 high · 2 medium · 1 low',
  },
  {
    engine: 'grow' as const,
    label: 'Grow',
    status: 'Optimizing',
    statusColor: '#7C3AED',
    metric: '$3,601/yr savings found',
    metricValue: 3601,
    metricFormat: (n: number) => `$${Math.round(n).toLocaleString()}/yr savings found`,
    subtext: '4 recommendations · 1 approved',
  },
  {
    engine: 'execute' as const,
    label: 'Execute',
    status: '3 pending',
    statusColor: '#CA8A04',
    metric: '$1,443 tax savings',
    metricValue: 1443,
    metricFormat: (n: number) => `$${Math.round(n).toLocaleString()} tax savings`,
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
    description: 'Oslo Electronics — $734.50',
    time: '7 min ago',
    action: 'Review',
  },
  {
    id: '3',
    type: 'grow' as const,
    title: 'High-yield savings opportunity',
    description: '$831/yr additional interest',
    time: '1 hour ago',
    note: 'Move $18,500 to Marcus',
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
