/**
 * Natural Language Query Engine
 * Regex-based intent extraction supporting English input
 * Handles: spending, account, trend, comparison, action, savings, fraud, subscription, and help queries
 * All responses include realistic mock data
 */

export type IntentType =
  | 'spending_query'
  | 'account_query'
  | 'trend_query'
  | 'comparison_query'
  | 'action_query'
  | 'savings_query'
  | 'fraud_query'
  | 'subscription_query'
  | 'help_query'
  | 'unknown';

export type ResponseType = 'text' | 'chart' | 'table' | 'number';

export interface Entity {
  type: 'amount' | 'date' | 'category' | 'timeRange' | 'action';
  value: string;
}

export interface ParsedIntent {
  type: IntentType;
  confidence: number;
  entities: Entity[];
  rawQuery: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
}

export interface TableRow {
  [key: string]: string | number;
}

export interface QueryResponse {
  responseType: ResponseType;
  text: string;
  data?: any;
  suggestions?: string[];
}

/**
 * Parse natural language query into structured intent
 */
export function parseQuery(text: string): ParsedIntent {
  const lowerText = text.toLowerCase();
  const entities: Entity[] = [];
  let type: IntentType = 'unknown';
  let confidence = 0;

  // Spending query patterns: "What did I spend on X?", "How much on food?"
  if (
    /^(what|how much).*spend|spending|expense/i.test(lowerText)
  ) {
    type = 'spending_query';
    confidence = 0.85;

    // Extract category
    const categoryMatch = lowerText.match(
      /(?:on|at|for)\s+(\w+)/i
    );
    if (categoryMatch) {
      entities.push({
        type: 'category',
        value: categoryMatch[1] || categoryMatch[0]
      });
    }

    // Extract amount if present
    const amountMatch = text.match(/\$?[\d,]+(?:\.\d{2})?/);
    if (amountMatch) {
      entities.push({ type: 'amount', value: amountMatch[0] });
    }
  }

  // Account query patterns: "What is my balance?", "Show my account"
  if (/balance|account/i.test(lowerText)) {
    type = 'account_query';
    confidence = 0.9;

    // Extract account type if specified
    if (/checking|current/i.test(lowerText)) {
      entities.push({ type: 'category', value: 'checking' });
    } else if (/savings/i.test(lowerText)) {
      entities.push({ type: 'category', value: 'savings' });
    } else if (/investment/i.test(lowerText)) {
      entities.push({ type: 'category', value: 'investment' });
    }
  }

  // Trend query patterns: "Show me trends", "View history"
  if (/trend|history|pattern/i.test(lowerText)) {
    type = 'trend_query';
    confidence = 0.8;

    // Extract time range
    const timeMatch = lowerText.match(
      /last\s+(week|month|year|3\s*month|6\s*month|12\s*month)/i
    );
    if (timeMatch) {
      entities.push({ type: 'timeRange', value: timeMatch[0] });
    }
  }

  // Comparison query patterns: "Compare this month to last month"
  if (
    /compare|comparison|vs|versus/i.test(lowerText)
  ) {
    type = 'comparison_query';
    confidence = 0.85;

    const periodMatch = lowerText.match(
      /month|year|week/gi
    );
    if (periodMatch) {
      entities.push(
        ...periodMatch.map(p => ({ type: 'timeRange' as const, value: p }))
      );
    }
  }

  // Savings query patterns: "How are my savings?", "savings goal progress"
  if (
    /saving|goal|target|progress/i.test(lowerText)
  ) {
    type = 'savings_query';
    confidence = 0.85;
  }

  // Fraud query patterns: "Any suspicious activity?", "fraud alerts"
  if (
    /fraud|suspicious|alert|security|protect/i.test(lowerText)
  ) {
    type = 'fraud_query';
    confidence = 0.85;
  }

  // Subscription query patterns: "Show my subscriptions", "unused subscriptions"
  if (
    /subscription|subscrib|unused|underused/i.test(lowerText)
  ) {
    type = 'subscription_query';
    confidence = 0.85;
  }

  // Action query patterns: "What actions are pending?", "Review my actions"
  if (
    /^action|pending|review|approve|unread/i.test(lowerText)
  ) {
    type = 'action_query';
    confidence = 0.85;

    // Extract action type if specified
    if (/cancel|unsubscribe/i.test(lowerText)) {
      entities.push({ type: 'action', value: 'cancel' });
    } else if (/approve|accept/i.test(lowerText)) {
      entities.push({ type: 'action', value: 'approve' });
    }
  }

  // Help query patterns: "Help", "How do I"
  if (
    /^(help|how do i|what can you)/i.test(lowerText)
  ) {
    type = 'help_query';
    confidence = 0.9;
  }

  return {
    type,
    confidence,
    entities,
    rawQuery: text
  };
}

/**
 * Generate mock response data based on parsed intent
 */
export function formatResponse(intent: ParsedIntent): QueryResponse {
  switch (intent.type) {
    case 'spending_query':
      return formatSpendingResponse(intent);
    case 'account_query':
      return formatAccountResponse(intent);
    case 'trend_query':
      return formatTrendResponse(intent);
    case 'comparison_query':
      return formatComparisonResponse(intent);
    case 'action_query':
      return formatActionResponse(intent);
    case 'savings_query':
      return formatSavingsResponse(intent);
    case 'fraud_query':
      return formatFraudResponse(intent);
    case 'subscription_query':
      return formatSubscriptionResponse(intent);
    case 'help_query':
      return formatHelpResponse();
    default:
      return {
        responseType: 'text',
        text: 'I did not understand your query. Please try asking about your balance, spending, trends, savings goals, or pending actions.',
        suggestions: [
          'What is my balance?',
          'How much did I spend on food?',
          'Show me this month vs last month',
          'What actions are pending?',
          'How are my savings?'
        ]
      };
  }
}

function formatSpendingResponse(intent: ParsedIntent): QueryResponse {
  const category = intent.entities.find(e => e.type === 'category')?.value || 'all categories';
  const categoryLower = (category as string).toLowerCase();

  // Category-specific responses
  if (categoryLower.includes('food')) {
    return {
      responseType: 'chart',
      text: 'Your food spending breakdown this month:',
      data: {
        total: 487.32,
        currency: 'USD',
        categoryName: 'Food',
        points: [
          { label: 'Week 1', value: 98.45, category: 'Food' },
          { label: 'Week 2', value: 134.20, category: 'Food' },
          { label: 'Week 3', value: 112.67, category: 'Food' },
          { label: 'Week 4', value: 142.00, category: 'Food' }
        ] as ChartDataPoint[],
        breakdown: [
          { subcategory: 'Groceries', amount: 234.50, percentage: 48.1 },
          { subcategory: 'Dining Out', amount: 156.80, percentage: 32.2 },
          { subcategory: 'Coffee & Cafe', amount: 56.90, percentage: 11.7 },
          { subcategory: 'Delivery', amount: 39.12, percentage: 8.0 }
        ]
      },
      suggestions: [
        'Compare food spending to last month',
        'Show dining out vs groceries',
        'Set a food budget',
        'Analyze café spending'
      ]
    };
  }

  // Default: all categories breakdown
  return {
    responseType: 'chart',
    text: 'Your spending breakdown this month (all categories):',
    data: {
      total: 2740.00,
      currency: 'USD',
      categoryName: 'All',
      points: [
        { label: 'Week 1', value: 612.45, category: 'All' },
        { label: 'Week 2', value: 728.90, category: 'All' },
        { label: 'Week 3', value: 545.20, category: 'All' },
        { label: 'Week 4', value: 853.45, category: 'All' }
      ] as ChartDataPoint[],
      breakdown: [
        { category: 'Housing', amount: 1200.00, percentage: 43.8 },
        { category: 'Food', amount: 487.32, percentage: 17.8 },
        { category: 'Transport', amount: 234.50, percentage: 8.6 },
        { category: 'Utilities', amount: 189.00, percentage: 6.9 },
        { category: 'Entertainment', amount: 156.30, percentage: 5.7 },
        { category: 'Shopping', amount: 312.45, percentage: 11.4 },
        { category: 'Health', amount: 95.20, percentage: 3.5 },
        { category: 'Education', amount: 67.23, percentage: 2.5 }
      ]
    },
    suggestions: [
      'Compare to last month',
      'Show specific category breakdown',
      'Set a monthly budget',
      'Identify savings opportunities'
    ]
  };
}

function formatAccountResponse(intent: ParsedIntent): QueryResponse {
  const accountType = intent.entities.find(e => e.type === 'category')?.value || 'total';
  const accountTypeLower = (accountType as string).toLowerCase();

  // Specific account type with transaction history
  if (accountTypeLower.includes('checking')) {
    return {
      responseType: 'number',
      text: 'Your checking account balance:',
      data: {
        number: 8240.50,
        currency: 'USD',
        accountType: 'Checking',
        change: '+$340.20 since yesterday',
        transactions: [
          { date: '2025-02-12', description: 'Direct Deposit - Employer', amount: 2500.00, runningBalance: 8240.50, type: 'credit' },
          { date: '2025-02-11', description: 'Amazon Purchase', amount: -45.99, runningBalance: 5740.50, type: 'debit' },
          { date: '2025-02-10', description: 'ATM Withdrawal', amount: -200.00, runningBalance: 5786.49, type: 'debit' },
          { date: '2025-02-10', description: 'Whole Foods', amount: -67.34, runningBalance: 5986.49, type: 'debit' },
          { date: '2025-02-09', description: 'Salary Adjustment', amount: 40.20, runningBalance: 6053.83, type: 'credit' }
        ]
      },
      suggestions: [
        'Show account history',
        'View recent transactions',
        'Set up auto-save',
        'Check savings account'
      ]
    };
  }

  if (accountTypeLower.includes('savings')) {
    return {
      responseType: 'number',
      text: 'Your savings account balance:',
      data: {
        number: 24680.00,
        currency: 'USD',
        accountType: 'Savings',
        change: '+$1,200.00 (auto-save)',
        interestRate: '0.45% APY',
        transactions: [
          { date: '2025-02-12', description: 'Auto-save Transfer', amount: 500.00, runningBalance: 24680.00, type: 'credit' },
          { date: '2025-02-05', description: 'Auto-save Transfer', amount: 500.00, runningBalance: 24180.00, type: 'credit' },
          { date: '2025-01-29', description: 'Auto-save Transfer', amount: 500.00, runningBalance: 23680.00, type: 'credit' },
          { date: '2025-01-22', description: 'Manual Transfer', amount: 1000.00, runningBalance: 23180.00, type: 'credit' },
          { date: '2025-01-15', description: 'Interest Payment', amount: 8.92, runningBalance: 22180.00, type: 'credit' }
        ]
      },
      suggestions: [
        'Increase auto-save amount',
        'View savings goals progress',
        'Compare to investment account',
        'Review interest earnings'
      ]
    };
  }

  if (accountTypeLower.includes('investment')) {
    return {
      responseType: 'number',
      text: 'Your investment account balance:',
      data: {
        number: 67420.35,
        currency: 'USD',
        accountType: 'Investment',
        change: '-$890.15 (market movement)',
        gainLoss: '+$8,240.35 YTD (+13.9%)',
        transactions: [
          { date: '2025-02-11', description: 'VTSAX - Buy 12.5 shares', amount: -1250.00, runningBalance: 67420.35, type: 'debit' },
          { date: '2025-02-05', description: 'Dividend Distribution - VTSAX', amount: 125.45, runningBalance: 68670.35, type: 'credit' },
          { date: '2025-01-31', description: 'VTIAX - Buy 8.3 shares', amount: -1100.00, runningBalance: 68544.90, type: 'debit' },
          { date: '2025-01-15', description: 'Dividend Distribution - VTIAX', amount: 89.20, runningBalance: 69644.90, type: 'credit' },
          { date: '2025-01-10', description: 'BND - Buy 5.5 shares', amount: -550.00, runningBalance: 69555.70, type: 'debit' }
        ]
      },
      suggestions: [
        'Rebalance portfolio',
        'View asset allocation',
        'Check dividend history',
        'Compare market performance'
      ]
    };
  }

  // Total across all accounts
  return {
    responseType: 'number',
    text: 'Your total account balances:',
    data: {
      number: 100340.85,
      currency: 'USD',
      accountType: 'Total',
      change: '+$649.05 (net change)',
      accounts: [
        { name: 'Checking', balance: 8240.50, percentage: 8.2 },
        { name: 'Savings', balance: 24680.00, percentage: 24.6 },
        { name: 'Investment', balance: 67420.35, percentage: 67.2 }
      ]
    },
    suggestions: [
      'View checking account',
      'Check savings goals',
      'Review investment portfolio',
      'Show account history'
    ]
  };
}

function formatTrendResponse(intent: ParsedIntent): QueryResponse {
  const timeRange = intent.entities.find(e => e.type === 'timeRange')?.value || 'last 12 months';
  const categoryEntity = intent.entities.find(e => e.type === 'category');

  // Category-specific trend
  if (categoryEntity) {
    const categoryName = (categoryEntity.value as string).toLowerCase();
    if (categoryName.includes('food')) {
      return {
        responseType: 'chart',
        text: 'Your food spending trend over the last 12 months:',
        data: {
          points: [
            { label: 'Jan', value: 456, category: 'Food' },
            { label: 'Feb', value: 412, category: 'Food' },
            { label: 'Mar', value: 523, category: 'Food' },
            { label: 'Apr', value: 487, category: 'Food' },
            { label: 'May', value: 501, category: 'Food' },
            { label: 'Jun', value: 534, category: 'Food' },
            { label: 'Jul', value: 556, category: 'Food' },
            { label: 'Aug', value: 545, category: 'Food' },
            { label: 'Sep', value: 512, category: 'Food' },
            { label: 'Oct', value: 478, category: 'Food' },
            { label: 'Nov', value: 498, category: 'Food' },
            { label: 'Dec', value: 487, category: 'Food' }
          ] as ChartDataPoint[]
        },
        suggestions: [
          'Compare to previous year',
          'Show dining out trend',
          'Identify seasonal patterns',
          'Set food budget'
        ]
      };
    }
  }

  // Overall spending trend with 12-month data
  return {
    responseType: 'chart',
    text: `Your total spending trend over ${timeRange}:`,
    data: {
      points: [
        { label: 'Jan', value: 2456, category: 'spending' },
        { label: 'Feb', value: 2198, category: 'spending' },
        { label: 'Mar', value: 2723, category: 'spending' },
        { label: 'Apr', value: 2567, category: 'spending' },
        { label: 'May', value: 2345, category: 'spending' },
        { label: 'Jun', value: 2612, category: 'spending' },
        { label: 'Jul', value: 2834, category: 'spending' },
        { label: 'Aug', value: 2701, category: 'spending' },
        { label: 'Sep', value: 2445, category: 'spending' },
        { label: 'Oct', value: 2589, category: 'spending' },
        { label: 'Nov', value: 2834, category: 'spending' },
        { label: 'Dec', value: 3156, category: 'spending' }
      ] as ChartDataPoint[],
      incomePoints: [
        { label: 'Jan', value: 5500, category: 'income' },
        { label: 'Feb', value: 5500, category: 'income' },
        { label: 'Mar', value: 5750, category: 'income' },
        { label: 'Apr', value: 5500, category: 'income' },
        { label: 'May', value: 5500, category: 'income' },
        { label: 'Jun', value: 6200, category: 'income' },
        { label: 'Jul', value: 5500, category: 'income' },
        { label: 'Aug', value: 5500, category: 'income' },
        { label: 'Sep', value: 5500, category: 'income' },
        { label: 'Oct', value: 5750, category: 'income' },
        { label: 'Nov', value: 5500, category: 'income' },
        { label: 'Dec', value: 6500, category: 'income' }
      ] as ChartDataPoint[],
      averageMonthly: 2659.25,
      netSavings: 2815.00
    },
    suggestions: [
      'Analyze spending patterns',
      'Compare to previous year',
      'Identify high-spending months',
      'Export as report'
    ]
  };
}

function formatComparisonResponse(_intent: ParsedIntent): QueryResponse {
  return {
    responseType: 'table',
    text: 'Comparison: This Month vs Last Month',
    data: {
      rows: [
        {
          category: 'Total Spending',
          thisMonth: '$2,740',
          lastMonth: '$2,589',
          change: '+5.8%'
        },
        {
          category: 'Income',
          thisMonth: '$5,500',
          lastMonth: '$5,500',
          change: '—'
        },
        {
          category: 'Net Savings',
          thisMonth: '$2,760',
          lastMonth: '$2,911',
          change: '-5.2%'
        },
        {
          category: 'Largest Category',
          thisMonth: 'Housing ($1,200)',
          lastMonth: 'Housing ($1,200)',
          change: '—'
        },
        {
          category: 'Smallest Category',
          thisMonth: 'Education ($67)',
          lastMonth: 'Education ($52)',
          change: '+28.8%'
        },
        {
          category: 'Number of Transactions',
          thisMonth: '124',
          lastMonth: '118',
          change: '+5.1%'
        },
        {
          category: 'Average Transaction',
          thisMonth: '$22.10',
          lastMonth: '$21.94',
          change: '+0.7%'
        },
        {
          category: 'Recurring Costs',
          thisMonth: '$1,545',
          lastMonth: '$1,545',
          change: '—'
        }
      ] as TableRow[],
      topChanges: [
        {
          category: 'Food',
          lastMonth: 412,
          thisMonth: 487,
          change: '+18.2%'
        },
        {
          category: 'Entertainment',
          lastMonth: 128,
          thisMonth: 156,
          change: '+21.9%'
        },
        {
          category: 'Transport',
          lastMonth: 198,
          thisMonth: 234,
          change: '+18.2%'
        }
      ]
    },
    suggestions: [
      'Show year-over-year comparison',
      'Analyze category changes',
      'Set spending goals',
      'Identify cost reduction opportunities'
    ]
  };
}

function formatActionResponse(_intent: ParsedIntent): QueryResponse {
  return {
    responseType: 'table',
    text: 'Pending Actions Awaiting Your Approval',
    data: {
      rows: [
        {
          action: 'Cancel Spotify Premium',
          engine: 'GOVERN',
          savings: '$9.99/month',
          daysUnused: '89',
          risk: 'Low',
          daysPending: '3',
          autoApprovable: 'Yes'
        },
        {
          action: 'Upgrade Checking to High-Yield',
          engine: 'GROW',
          savings: '+$12.50/month',
          daysUnused: '—',
          risk: 'None',
          daysPending: '5',
          autoApprovable: 'Yes'
        },
        {
          action: 'Rebalance Investment Portfolio',
          engine: 'GROW',
          savings: 'Optimize returns',
          daysUnused: '—',
          risk: 'Medium',
          daysPending: '7',
          autoApprovable: 'No'
        },
        {
          action: 'Enable 50/30/20 Budget Rule',
          engine: 'GOVERN',
          savings: 'Better control',
          daysUnused: '—',
          risk: 'Low',
          daysPending: '2',
          autoApprovable: 'Yes'
        },
        {
          action: 'Increase Auto-Save to $750/month',
          engine: 'GROW',
          savings: '$750/month',
          daysUnused: '—',
          risk: 'Low',
          daysPending: '4',
          autoApprovable: 'Yes'
        },
        {
          action: 'Block Duplicate Spending in Food',
          engine: 'PROTECT',
          savings: 'Prevent waste',
          daysUnused: '—',
          risk: 'Low',
          daysPending: '1',
          autoApprovable: 'Yes'
        }
      ] as TableRow[],
      actionsByEngine: {
        PROTECT: 1,
        GROW: 3,
        GOVERN: 2,
        EXECUTE: 0
      }
    },
    suggestions: [
      'Approve all low-risk actions',
      'Review medium-risk items',
      'Create custom actions',
      'Set auto-approval rules'
    ]
  };
}

function formatSavingsResponse(_intent: ParsedIntent): QueryResponse {
  return {
    responseType: 'table',
    text: 'Your Savings Goals Dashboard',
    data: {
      goals: [
        {
          id: 'emergency-fund',
          name: 'Emergency Fund',
          target: 10000,
          current: 7500,
          percentage: 75,
          monthlyContribution: 500,
          projectedDate: '2025-05-15',
          autoSaveActive: true,
          description: 'Save 6 months of living expenses'
        },
        {
          id: 'vacation',
          name: 'Vacation Fund',
          target: 3000,
          current: 1800,
          percentage: 60,
          monthlyContribution: 300,
          projectedDate: '2025-04-01',
          autoSaveActive: true,
          description: 'Trip to Japan summer 2025'
        },
        {
          id: 'down-payment',
          name: 'Home Down Payment',
          target: 50000,
          current: 12400,
          percentage: 24.8,
          monthlyContribution: 1200,
          projectedDate: '2027-09-30',
          autoSaveActive: true,
          description: '20% down payment for house purchase'
        }
      ],
      summary: {
        totalGoals: 3,
        totalTarget: 63000,
        totalCurrent: 21700,
        totalPercentage: 34.4,
        monthlyContributionTotal: 2000,
        autoSaveRulesActive: 3
      }
    },
    suggestions: [
      'Adjust monthly contribution amounts',
      'Add new savings goal',
      'View contribution history',
      'Update goal target amounts'
    ]
  };
}

function formatFraudResponse(_intent: ParsedIntent): QueryResponse {
  return {
    responseType: 'table',
    text: 'PROTECT Engine - Fraud & Security Alerts',
    data: {
      activeAlerts: [
        {
          id: 'alert-1',
          type: 'Unusual Transaction',
          description: 'Overseas ATM withdrawal detected',
          location: 'Bali, Indonesia',
          amount: 450.00,
          date: '2025-02-11',
          riskLevel: 'Medium',
          action: 'Review',
          status: 'Active'
        },
        {
          id: 'alert-2',
          type: 'Duplicate Charge',
          description: 'Duplicate charge detected on Amazon',
          location: 'Amazon.com',
          amount: 89.99,
          date: '2025-02-10',
          riskLevel: 'Low',
          action: 'Refund',
          status: 'Active'
        }
      ],
      recentlyResolved: [
        {
          description: 'Suspicious login attempt from new device (blocked)',
          date: '2025-02-08',
          action: 'Auto-blocked'
        },
        {
          description: 'Unusual category spending pattern detected (reviewed, approved)',
          date: '2025-02-05',
          action: 'Approved'
        },
        {
          description: 'High-value transaction verification requested',
          date: '2025-01-28',
          action: 'Verified'
        },
        {
          description: 'International transaction attempt (declined)',
          date: '2025-01-25',
          action: 'Declined'
        },
        {
          description: 'Unusual time-based spending pattern (monitored)',
          date: '2025-01-20',
          action: 'Monitored'
        }
      ],
      riskScore: {
        overall: 23,
        maxScore: 100,
        level: 'Low'
      },
      protectionStats: {
        fraudAlertsCaught: 247,
        blockTransactions: 12,
        potentialSavings: 4567.89,
        coverageStatus: 'Active - Full Protection'
      }
    },
    suggestions: [
      'View all recent alerts',
      'Adjust fraud sensitivity',
      'Report false positive',
      'Review protection coverage'
    ]
  };
}

function formatSubscriptionResponse(_intent: ParsedIntent): QueryResponse {
  return {
    responseType: 'table',
    text: 'Subscription Audit - Active & Unused Services',
    data: {
      subscriptions: [
        {
          name: 'Netflix',
          cost: 15.99,
          billingCycle: 'Monthly',
          lastUsed: '2 days ago',
          status: 'Active',
          autoRenew: true,
          description: 'Streaming entertainment'
        },
        {
          name: 'Spotify',
          cost: 9.99,
          billingCycle: 'Monthly',
          lastUsed: '89 days ago',
          status: 'Unused',
          autoRenew: true,
          description: 'Music streaming - potential cancellation'
        },
        {
          name: 'Adobe Creative Cloud',
          cost: 54.99,
          billingCycle: 'Monthly',
          lastUsed: '5 days ago',
          status: 'Active',
          autoRenew: true,
          description: 'Photo and video editing'
        },
        {
          name: 'ChatGPT Plus',
          cost: 20.00,
          billingCycle: 'Monthly',
          lastUsed: 'Today',
          status: 'Active',
          autoRenew: true,
          description: 'AI assistant access'
        },
        {
          name: 'AWS',
          cost: 34.21,
          billingCycle: 'Monthly',
          lastUsed: 'Today',
          status: 'Active',
          autoRenew: true,
          description: 'Cloud computing services'
        },
        {
          name: 'New York Times',
          cost: 17.00,
          billingCycle: 'Monthly',
          lastUsed: '45 days ago',
          status: 'Underused',
          autoRenew: true,
          description: 'News subscription - consider canceling'
        },
        {
          name: 'Gym Membership',
          cost: 49.99,
          billingCycle: 'Monthly',
          lastUsed: '120 days ago',
          status: 'Unused',
          autoRenew: true,
          description: 'Fitness center - high priority to cancel'
        },
        {
          name: 'iCloud Storage',
          cost: 2.99,
          billingCycle: 'Monthly',
          lastUsed: 'Today',
          status: 'Active',
          autoRenew: true,
          description: '200GB cloud backup'
        }
      ],
      summary: {
        totalMonthly: 205.16,
        activeCount: 5,
        underusedCount: 1,
        unusedCount: 2,
        potentialSavings: 76.98
      }
    },
    suggestions: [
      'Cancel unused Spotify',
      'Review gym membership',
      'Downgrade NYT subscription',
      'Set usage reminders'
    ]
  };
}

function formatHelpResponse(): QueryResponse {
  return {
    responseType: 'text',
    text: `I can help you with financial management using Poseidon's four engines:

**PROTECT** (Security & Alerts)
• Fraud detection: "Any suspicious activity?"
• Fraud alerts and unusual transactions
• Security status and protection coverage

**GROW** (Savings & Investment)
• Savings goals: "How are my savings?"
• Investment tracking and portfolio health
• Savings goal progress and projections

**GOVERN** (Spending Control)
• Spending queries: "What did I spend on food?"
• Budget management and category breakdown
• Subscription audit: "Show my subscriptions"

**EXECUTE** (Transaction Management)
• Account queries: "What is my balance?"
• Transaction history and account details
• Multi-account summaries

Additional queries:
• Trends: "Show me spending trends"
• Comparisons: "Compare this month to last month"
• Actions: "What actions are pending?"`,
    suggestions: [
      'What is my balance?',
      'How much did I spend on food?',
      'How are my savings?',
      'Any suspicious activity?',
      'Show my subscriptions',
      'What actions are pending?'
    ]
  };
}
