/**
 * Simulated Chat Engine — Intent parser + response generator
 *
 * Matches user input keywords to pre-scripted responses with rich card data.
 * All data sourced from CANONICAL_UNIVERSE and MOCK_* constants.
 */
import { CANONICAL_UNIVERSE } from '@/domain/poseidon-universe/canonical'
import { MOCK_NET_WORTH } from '@/lib/mock-data'
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
      text: `Your current net worth is **$${MOCK_NET_WORTH.total.toLocaleString()}**, up $${MOCK_NET_WORTH.change.toLocaleString()} (+${MOCK_NET_WORTH.changePercent}%) this month.\n\nYour total assets are $${MOCK_NET_WORTH.assets.toLocaleString()} against $${MOCK_NET_WORTH.liabilities.toLocaleString()} in liabilities. Monthly cash flow is $${MOCK_NET_WORTH.monthlyCashFlow.toLocaleString()}.`,
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
        text: `Here are your ${accounts.length} connected accounts. Total assets: **$${bs.totalAssets.toLocaleString()}**, liabilities: **$${bs.totalLiabilities.toLocaleString()}**.`,
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
        text: `I'm monitoring **${threats.length} threats** — ${pending.length} pending, ${critical.length} critical/high priority.\n\nThe most urgent is **${threats[0].counterparty}** ($${threats[0].amountUsd}) with ${Math.round(threats[0].confidence * 100)}% confidence. I recommend reviewing the critical alerts first.`,
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
        text: `Last month you spent **$${total.toLocaleString()}** across ${MOCK_SPENDING.length} categories.\n\nEntertainment is up 18% and shopping up 8% — those are the fastest-growing categories. Housing remains your largest expense at $8,500/mo.`,
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
        text: `I found **${recs.length} optimization opportunities** totaling **$${totalBenefit.toLocaleString()}/year** in potential savings.\n\nThe highest-impact recommendation is "${recs[0].title}" with a projected benefit of $${recs[0].projectedBenefitUsd.toLocaleString()}.`,
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
        text: `You have **${actions.length} pending actions** awaiting your decision.\n\nThe most urgent is "${actions[0].title}" — ${actions[0].description}. Would you like me to walk you through any of these?`,
        cards: [{ type: 'actions', actions: actions.slice(0, 5) }],
        toolCallLabel: 'Loading pending actions',
      }
    },
  },
  {
    keywords: /transfer|move.*money|振込|送金|high.yield/i,
    respond: () => ({
      text: "Here's a preview of the transfer. Moving $5,000 from Chase Checking to Marcus High-Yield Savings would earn an additional **$225/year** in interest at 4.5% APY.\n\nWould you like me to proceed?",
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
      text: "Hi Shinji! I'm your Poseidon AI financial companion. I can help you with:\n\n• **Check your net worth** and account balances\n• **Review security threats** and alerts\n• **Analyze spending** patterns and trends\n• **Find savings opportunities** and recommendations\n• **Manage pending actions** and approvals\n• **Preview transfers** between accounts\n\nWhat would you like to explore?",
      cards: [],
    }),
  },
]

const FALLBACK: SimulatedResponse = {
  text: "I can help you understand your financial picture. Try asking about your **net worth**, **account balances**, **security threats**, **spending patterns**, **savings recommendations**, or **pending actions**.\n\nYou can also ask me to **transfer money** between accounts.",
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
