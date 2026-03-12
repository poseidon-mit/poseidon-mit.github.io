/**
 * Simulated Chat Engine — Intent parser + response generator
 *
 * Matches user input keywords to pre-scripted responses with rich card data.
 * All data sourced from CANONICAL_UNIVERSE and MOCK_* constants.
 */
import { CANONICAL_UNIVERSE } from '@/domain/poseidon-universe/canonical'
const MOCK_NET_WORTH = {
  total: 94040.77,
  change: 1247.34,
  changePercent: 1.34,
  assets: 115722.09,
  liabilities: 21681.32,
  monthlyCashFlow: 8500.00,
}
import type { SimulatedResponse, SpendingCategory } from './types'

const MOCK_SPENDING: SpendingCategory[] = [
  { name: 'Housing', amount: 8500, percentage: 42.5, trend: '0%' },
  { name: 'Food & Dining', amount: 2890, percentage: 14.5, trend: '+4%' },
  { name: 'Shopping', amount: 1850, percentage: 9.3, trend: '+8%' },
  { name: 'Savings & Investments', amount: 2000, percentage: 10.0, trend: '0%' },
  { name: 'Education', amount: 1667, percentage: 8.3, trend: '0%' },
  { name: 'Transportation', amount: 1200, percentage: 6.0, trend: '+5%' },
  { name: 'Entertainment', amount: 680, percentage: 3.4, trend: '+18%' },
  { name: 'Subscriptions', amount: 450, percentage: 2.2, trend: '+3%' },
  { name: 'Healthcare', amount: 450, percentage: 2.3, trend: '0%' },
  { name: 'Other', amount: 313, percentage: 1.6, trend: '-8%' },
]

interface IntentRule {
  keywords: RegExp
  respond: () => SimulatedResponse
}

const rules: IntentRule[] = [
  {
    keywords: /net\s*worth|資産|total.*worth|how.*rich|財産/i,
    respond: () => ({
      text: `Net worth calculated: **$${MOCK_NET_WORTH.total.toLocaleString()}** (+$${MOCK_NET_WORTH.change.toLocaleString()} / +${MOCK_NET_WORTH.changePercent}% MTD).\n\nAssets: $${MOCK_NET_WORTH.assets.toLocaleString()}. Liabilities: $${MOCK_NET_WORTH.liabilities.toLocaleString()}. Target monthly cash flow: $${MOCK_NET_WORTH.monthlyCashFlow.toLocaleString()}.`,
      cards: [{
        type: 'net-worth',
        total: MOCK_NET_WORTH.total,
        change: MOCK_NET_WORTH.change,
        changePercent: MOCK_NET_WORTH.changePercent,
        assets: MOCK_NET_WORTH.assets,
        liabilities: MOCK_NET_WORTH.liabilities,
      }],
      toolCallLabel: 'Calculating net worth',
    }),
  },
  {
    keywords: /balance|account|残高|口座|checking|savings/i,
    respond: () => {
      const accounts = CANONICAL_UNIVERSE.entities.accounts
      const bs = CANONICAL_UNIVERSE.balanceSheet
      return {
        text: `Account reconciliation complete. ${accounts.length} nodes connected. Total assets: **$${bs.totalAssets.toLocaleString()}**. Liabilities: **$${bs.totalLiabilities.toLocaleString()}**.`,
        cards: [{
          type: 'balance',
          accounts,
          summary: { totalAssets: bs.totalAssets, totalLiabilities: bs.totalLiabilities, netWorth: bs.netWorth },
        }],
        toolCallLabel: 'Fetching account balances',
      }
    },
  },
  {
    keywords: /threat|security|alert|脅威|セキュリティ|suspicious|fraud/i,
    respond: () => {
      const threats = CANONICAL_UNIVERSE.entities.protectThreats
      const pending = threats.filter(t => t.status === 'pending')
      const critical = threats.filter(t => t.severity === 'Critical' || t.severity === 'High')
      return {
        text: `Threat assessment active. **${threats.length} total anomalies** (${pending.length} pending, ${critical.length} critical).\n\nPrimary threat: **${threats[0].counterparty}** ($${threats[0].amountUsd}) at ${Math.round(threats[0].confidence * 100)}% detection confidence. Immediate review mandated.`,
        cards: [{ type: 'threats', threats: threats.slice(0, 5) }],
        toolCallLabel: 'Scanning threat landscape',
      }
    },
  },
  {
    keywords: /spend|支出|expens|dining|grocery|how\s*much.*(?:spend|cost)|last\s*month/i,
    respond: () => {
      const total = MOCK_SPENDING.reduce((s, c) => s + c.amount, 0)
      return {
        text: `Expenditure analysis complete. Total: **$${total.toLocaleString()}**.\n\nFastest growing sectors: Entertainment (+18%), Shopping (+8%). Largest allocation: Housing ($8,500/mo).`,
        cards: [{
          type: 'spending',
          totalSpent: total,
          categories: MOCK_SPENDING,
          comparedToPrevious: '+8.3%',
        }],
        toolCallLabel: 'Analyzing spending patterns',
      }
    },
  },
  {
    keywords: /recommend|save|savings|おすすめ|節約|optimi|opportunity/i,
    respond: () => {
      const recs = CANONICAL_UNIVERSE.entities.recommendations
      const totalBenefit = recs.reduce((s, r) => s + r.annualBenefitUsd, 0)
      return {
        text: `Optimization scan complete. **${recs.length} pathways identified** yielding **$${totalBenefit.toLocaleString()}/year**.\n\nPrimary recommendation: "${recs[0].title}" (Projected yield: $${recs[0].projectedBenefitUsd.toLocaleString()}).`,
        cards: [{ type: 'recommendations', recommendations: recs }],
        toolCallLabel: 'Finding recommendations',
      }
    },
  },
  {
    keywords: /pending|action|approve|approval|queue|承認|実行/i,
    respond: () => {
      const actions = CANONICAL_UNIVERSE.entities.executeActions
      return {
        text: `**${actions.length} executions pending.**\n\nUrgent priority: "${actions[0].title}" — ${actions[0].description}. Awaiting your authorization code.`,
        cards: [{ type: 'actions', actions: actions.slice(0, 5) }],
        toolCallLabel: 'Loading pending actions',
      }
    },
  },
  {
    keywords: /transfer|move.*money|振込|送金|high.yield/i,
    respond: () => ({
      text: "Transfer protocol simulated. Routing $5,000 from Chase Checking to Marcus High-Yield Savings yields +$225/year at 4.5% APY.\n\nAwaiting execution authorization.",
      cards: [{
        type: 'transfer-preview',
        from: 'Chase Checking',
        to: 'Marcus High-Yield Savings',
        amount: 5000,
        benefit: '+$225/year at 4.5% APY',
      }],
      toolCallLabel: 'Preparing transfer preview',
    }),
  },
  {
    keywords: /hello|hi|hey|こんにちは|はじめ|help|what.*can/i,
    respond: () => ({
      text: "Poseidon Execution Engine active. Awaiting directive framework:\n\n• **Net Worth & Balances**\n• **Threat Vectors**\n• **Expenditure Analysis**\n• **Yield Optimization**\n• **Pending Executions**\n• **Asset Transfers**\n\nSpecify target.",
      cards: [],
    }),
  },
]

const FALLBACK: SimulatedResponse = {
  text: "Directive unrecognized. Specify parameters: net worth, account balances, security threats, spending patterns, savings recommendations, or pending actions. Transfer protocols also available.",
  cards: [],
}

export function generateResponse(input: string): SimulatedResponse {
  const trimmed = input.trim()
  for (const rule of rules) {
    if (rule.keywords.test(trimmed)) {
      return rule.respond()
    }
  }
  return FALLBACK
}
