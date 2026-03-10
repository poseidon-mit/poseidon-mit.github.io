export const MOCK_USER = {
  name: 'Alex',
  initials: 'A',
  email: 'alex@poseidon.ai',
}

export const MOCK_NET_WORTH = {
  total: 847392,
  change: 12847,
  changePercent: 1.5,
  assets: 923450,
  liabilities: 76058,
  monthlyCashFlow: 4200,
}

export const MOCK_SPARKLINE_DATA = [
  780000, 795000, 810000, 822000, 834000, 847392,
]

export const MOCK_ENGINE_STATUS = [
  {
    engine: 'protect' as const,
    label: 'Protect',
    status: 'All Clear',
    statusColor: '#16A34A',
    metric: '0 threats detected',
    subtext: 'Last scan: 2 minutes ago',
  },
  {
    engine: 'grow' as const,
    label: 'Grow',
    status: 'Optimizing',
    statusColor: '#7C3AED',
    metric: '+8.4% YTD return',
    subtext: 'Beating benchmark by 2.1%',
  },
  {
    engine: 'execute' as const,
    label: 'Execute',
    status: '3 pending',
    statusColor: '#CA8A04',
    metric: '$2,400 scheduled',
    subtext: 'Next: Electric bill tomorrow',
  },
  {
    engine: 'govern' as const,
    label: 'Govern',
    status: 'Monitoring',
    statusColor: '#2563EB',
    metric: '147 decisions logged',
    subtext: 'This month',
  },
]

export const MOCK_RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'protect' as const,
    title: 'Protect flagged unusual login',
    description: 'Chase account, San Francisco',
    time: '2 min ago',
    action: 'Review',
  },
  {
    id: '2',
    type: 'execute' as const,
    title: 'Bill payment executed',
    description: 'Electric Company',
    time: '1 hour ago',
    amount: -127.5,
  },
  {
    id: '3',
    type: 'grow' as const,
    title: 'Investment rebalanced',
    description: 'Growth portfolio optimized',
    time: '3 hours ago',
    note: 'Moved $2,400',
  },
  {
    id: '4',
    type: 'execute' as const,
    title: 'Savings rule triggered',
    description: 'Spare change rounded up',
    time: 'Yesterday',
    amount: 23.47,
  },
  {
    id: '5',
    type: 'govern' as const,
    title: 'Monthly report ready',
    description: 'March 2024 summary available',
    time: 'Yesterday',
    action: 'View',
  },
]
