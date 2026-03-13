/**
 * Simulated Chat Engine — Intent parser + response generator
 *
 * Matches user input keywords to pre-scripted responses with rich card data.
 * All data sourced from CANONICAL_UNIVERSE and MOCK_* constants.
 */
import { CANONICAL_UNIVERSE } from '@/domain/poseidon-universe/canonical'
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

function getCategoriesArray(totalTarget: number): SpendingCategory[] {
  const currentTotal = MOCK_SPENDING.reduce((sum, item) => sum + item.amount, 0);
  const scale = totalTarget / currentTotal;
  
  return MOCK_SPENDING.map(item => ({
    ...item,
    amount: Math.round(item.amount * scale)
  }));
}

interface IntentRule {
  keywords: RegExp
  respond: () => SimulatedResponse
}

const rules: IntentRule[] = [
  // 1. Core Balances & Net Worth
  {
    keywords: /net\s*worth|資産|total.*worth|how.*rich|財産/i,
    respond: () => {
      const bs = CANONICAL_UNIVERSE.balanceSheet
      const cohort = CANONICAL_UNIVERSE.metrics.cohort
      const changeUsd = Math.max(cohort.avgMonthlySavingsUsd, 0)
      const changePct = (changeUsd / Math.max(bs.netWorth, 1)) * 100
      const monthlyCashFlow = bs.monthlyIncome - bs.monthlyExpenses
      return {
        text: `Based on your global telemetry, your net worth is **$${bs.netWorth.toLocaleString()}** (+$${changeUsd.toLocaleString()} / +${changePct.toFixed(1)}% MTD).\n\nAssets: $${bs.totalAssets.toLocaleString()}\nLiabilities: $${bs.totalLiabilities.toLocaleString()}\nTarget monthly cash flow: $${monthlyCashFlow.toLocaleString()}.\n\nYou are outperforming 82% of your cohort in liquid asset accumulation.`,
        cards: [{
          type: 'net-worth',
          total: bs.netWorth,
          change: changeUsd,
          changePercent: parseFloat(changePct.toFixed(1)),
          assets: bs.totalAssets,
          liabilities: bs.totalLiabilities,
        }],
        toolCallLabel: 'Calculating net worth',
      }
    },
  },
  {
    keywords: /balance|account|残高|口座|checking|savings/i,
    respond: () => {
      const accounts = CANONICAL_UNIVERSE.entities.accounts
      const bs = CANONICAL_UNIVERSE.balanceSheet
      return {
        text: `Account reconciliation complete. ${accounts.length} nodes connected across 4 institutions. \n\nTotal assets: **$${bs.totalAssets.toLocaleString()}**. Liabilities: **$${bs.totalLiabilities.toLocaleString()}**.\n\nNotice: Your Chase checking account has a surplus of $4,500 above your typical 30-day burn rate. Would you like me to scan for yield optimization?`,
        cards: [{
          type: 'balance',
          accounts,
          summary: { totalAssets: bs.totalAssets, totalLiabilities: bs.totalLiabilities, netWorth: bs.netWorth },
        }],
        toolCallLabel: 'Fetching account balances',
      }
    },
  },

  // 2. Spending & Cash Flow
  {
    keywords: /spend|支出|expens|dining|grocery|how\s*much.*(?:spend|cost)|last\s*month|burn.*rate/i,
    respond: () => {
      const expenses = CANONICAL_UNIVERSE.balanceSheet.monthlyExpenses
      const categoriesArray = getCategoriesArray(expenses)
      return {
        text: `Expenditure analysis complete. Your total 30-day burn rate is **$${expenses.toLocaleString()}**.\n\nCompared to last month: +8.3%. \n\nAnomaly detected: "Food & Dining" spending is up 14% compared to your historical average, primarily driven by UberEats and DoorDash execution. Reining this in could yield an additional $350/mo.`,
        cards: [{
          type: 'spending',
          totalSpent: expenses,
          categories: categoriesArray,
          comparedToPrevious: '+8.3%',
        }],
        toolCallLabel: 'Analyzing spending patterns',
      }
    },
  },
  {
    keywords: /income|収入|salary|earn|給料|dividend/i,
    respond: () => {
       const bs = CANONICAL_UNIVERSE.balanceSheet
       return {
         text: `Your projected monthly inflow is **$${bs.monthlyIncome.toLocaleString()}**.\n\nThis consists of your primary W2, standard dividend distributions from your brokerage, and a 4.5% APY yield from your Marcus account.\n\nAt your current burn rate of $${bs.monthlyExpenses.toLocaleString()}/mo, your savings capacity is exactly $${(bs.monthlyIncome - bs.monthlyExpenses).toLocaleString()}/mo.`,
         cards: [],
         toolCallLabel: 'Aggregating income streams'
       }
    }
  },

  // 3. Security, Threats & Protect
  {
    keywords: /threat|security|alert|脅威|セキュリティ|suspicious|fraud|hack/i,
    respond: () => {
      const threats = CANONICAL_UNIVERSE.entities.protectThreats
      const pending = threats.filter(t => t.status === 'pending')
      const critical = threats.filter(t => t.severity === 'Critical' || t.severity === 'High')
      return {
        text: `Threat assessment active. **${threats.length} total anomalies** (${pending.length} pending, ${critical.length} critical).\n\nPrimary threat: **${threats[0].counterparty}** ($${threats[0].amountUsd}) at ${Math.round(threats[0].confidence * 100)}% detection confidence.\n\nAction required: I need authorization to freeze the compromised card and dispute the transaction.`,
        cards: [{ type: 'threats', threats: threats.slice(0, 5) }],
        toolCallLabel: 'Scanning threat landscape',
      }
    },
  },
  {
    keywords: /dark\s*web|leak|breach|password|漏洩|流出|pwned/i,
    respond: () => {
      return {
        text: `Dark web monitoring active. Scanning known dump sites, pastebins, and illicit forums...\n\n**Status: Clear.**\n\nYour primary identity markers (SSN, associated emails, phone numbers) have not appeared in any new breaches in the last 72 hours. However, your Spotify password was compromised in a historic breach (2021). I recommend cycling it.`,
        cards: [],
        toolCallLabel: 'Querying external threat intelligence'
      }
    }
  },

  // 4. Optimization, Grow & Recommendations
  {
    keywords: /recommend|save|savings|おすすめ|節約|optimi|opportunity|grow|yield/i,
    respond: () => {
      const recs = CANONICAL_UNIVERSE.entities.recommendations
      const totalBenefit = recs.reduce((s, r) => s + r.annualBenefitUsd, 0)
      return {
        text: `Optimization scan complete. I have identified **${recs.length} execution pathways** yielding a projected **$${totalBenefit.toLocaleString()}/year**.\n\nPrimary recommendation: "${recs[0].title}" (Projected yield: $${recs[0].projectedBenefitUsd.toLocaleString()}). \n\nShall I queue this for your approval?`,
        cards: [{ type: 'recommendations', recommendations: recs }],
        toolCallLabel: 'Finding yield opportunities',
      }
    },
  },
  {
     keywords: /tax|税金|deduction|harvesting|loss|write\s*off/i,
     respond: () => {
       return {
         text: `Tax strategy initialized.\n\nScanning your portfolios, I've identified **$4,200 in embedded losses** inside your taxable Vanguard brokerage. Executing a Tax-Loss Harvesting protocol today could offset your recent capital gains and save you approximately $950 on next year's tax bill.\n\nI can execute the trades and immediately buy correlated (but not substantially identical) assets to maintain your market exposure. Proceed?`,
         cards: [],
         toolCallLabel: 'Analyzing tax-loss harvesting pathways'
       }
     }
  },
  {
    keywords: /subscription|サブスク|cancel|unused|waste/i,
    respond: () => {
      return {
        text: `Subscription audit complete.\n\nYou are currently paying for 14 active subscriptions totaling $185/mo. \n\n**Flagged for review:**\n1. "Adobe Creative Cloud" ($54.99/mo) — Not utilized in 4 months.\n2. "Peacock Premium" ($5.99/mo) — Zero bandwidth usage logged on your network for 6 weeks.\n\nCanceling these yields +$731/year. Do you want me to initiate the cancelation protocols?`,
        cards: [],
        toolCallLabel: 'Auditing recurring charges'
      }
    }
  },

  // 5. Execution & Pending Actions
  {
    keywords: /pending|action|approve|approval|queue|承認|実行|task|todo/i,
    respond: () => {
      const actions = CANONICAL_UNIVERSE.entities.executeActions
      return {
        text: `**${actions.length} executions pending.**\n\nUrgent priority: "${actions[0].title}" — ${actions[0].description}.\n\nThis action is time-sensitive and requires your biometric or cryptographic authorization. Review the Execute tab to proceed.`,
        cards: [{ type: 'actions', actions: actions.slice(0, 5) }],
        toolCallLabel: 'Loading pending actions',
      }
    },
  },
  {
    keywords: /transfer|move.*money|振込|送金|high.yield|sweep/i,
    respond: () => ({
      text: "Transfer protocol simulated. Routing $5,000 from Chase Checking to Marcus High-Yield Savings yields +$225/year at 4.5% APY.\n\nAwaiting your execution authorization in the queue.",
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

  // 6. Markets, Investments & Crypto
  {
    keywords: /market|market\s*update|stocks|sp500|s&p|s\&p|dow|nasdaq|株|相場/i,
    respond: () => ({
      text: `Market telemetry acquired.\n\nThe S&P 500 is currently up 0.4% today, driven by tech sector outperformance. Your specific portfolio has a Beta of 1.12 to the S&P, meaning you are currently tracking slightly ahead of the broader market.\n\nVolatility (VIX) remains low. No immediate defensive rebalancing is recommended.`,
      cards: [],
      toolCallLabel: 'Fetching market telemetry'
    })
  },
  {
    keywords: /crypto|bitcoin|btc|eth|ethereum|暗号資産|仮想通貨/i,
    respond: () => ({
      text: `Crypto assets scanned.\n\nYour cold storage holds 1.25 BTC and 14.5 ETH. \n\nBTC has recently experienced a +5% volatility spike. Because crypto now represents 14% of your total liquid net worth (exceeding your target allocation of 10%), you may want to consider taking some profits to rebalance your risk paradigm.`,
      cards: [],
      toolCallLabel: 'Analyzing on-chain assets'
    })
  },
  {
    keywords: /interest\s*rate|fed|fomc|inflation|金利|インフレ/i,
    respond: () => ({
      text: `Macroeconomic analysis:\n\nThe Federal Reserve recently held rates steady. Inflation data (CPI) came in slightly cooler than expected at 2.9% YoY.\n\n**Impact on you:**\n1. Your Marcus High-Yield Savings (4.5%) will likely maintain its current yield for the next quarter.\n2. Borrowing costs remain high. Do not carry a balance on your Platinum card.`,
      cards: [],
      toolCallLabel: 'Querying macroeconomic data'
    })
  },

  // 7. General AI & Identity
  {
    keywords: /who\s*are\s*you|what\s*are\s*you|poseidon|ポセイドン/i,
    respond: () => ({
      text: `I am Poseidon, your autonomous financial orchestration engine. \n\nI monitor your capital stack 24/7, detect anomalous threats in real-time, surface algorithmic yield optimizations, and execute complex financial routing on your behalf.\n\nMy core directive: Protect your wealth, and compound it relentlessly.`,
      cards: [],
    })
  },
  {
    keywords: /how\s*do\s*you\s*work|architecture|llm|model|仕組み/i,
    respond: () => ({
      text: `I operate on a Triple-System Architecture:\n\n1. **Data Layer:** I ingest real-time APIs from your banks, brokerages, and on-chain wallets.\n2. **Inference Engine:** I run continuous models against this telemetry to detect fraud and calculate yield opportunities.\n3. **Execution Layer:** When you approve an action, I route capital securely via zero-knowledge proofs.\n\nI do not sleep. I do not miss details.`,
      cards: [],
      toolCallLabel: 'Summarizing system architecture'
    })
  },
  {
    keywords: /hello|hi|hey|こんにちは|はじめ|help|what.*can/i,
    respond: () => ({
      text: "Poseidon Execution Engine active. Awaiting directive framework:\n\n• **Net Worth & Balances**\n• **Threat Vectors**\n• **Expenditure Analysis**\n• **Yield Optimization (Tax/Interest)**\n• **Pending Executions**\n• **Asset Transfers**\n\nSpecify your target.",
      cards: [],
    }),
  },

  // 8. Financial Advice & Strategy (More complex)
  {
    keywords: /retire|retirement|fire|老後|引退/i,
    respond: () => ({
      text: `Retirement trajectory analysis initiated.\n\nBased on your current savings rate of 24% and an assumed 7% real annualized return, you will cross your target "Financial Independence" threshold of $2.5M in exactly 11.4 years.\n\nIf you trim your "Food & Dining" burn rate by 15%, you could accelerate this timeline by 1.2 years.`,
      cards: [],
      toolCallLabel: 'Running Monte Carlo simulations'
    })
  },
  {
    keywords: /house|mortgage|buy\s*home|real\s*estate|家|住宅ローン/i,
    respond: () => ({
      text: `Real estate scenario modeling:\n\nYou currently have $140,000 in liquid cash. Assuming a $800,000 target purchase price, you have sufficient capital for a 15% down payment + closing costs.\n\nHowever, at current 30-year fixed rates (~6.8%), your monthly PITI (Principal, Interest, Taxes, Insurance) would be roughly $5,200. This would consume 41% of your net monthly cash flow, exceeding the recommended 28% threshold. \n\nI recommend continuing to build capital in the 4.5% yield account for another 14 months before executing a purchase.`,
      cards: [],
      toolCallLabel: 'Modeling real estate scenarios'
    })
  },

  // 9. Boundary Enforcement
  {
    keywords: /buy\s*stock|trade\s*options|yolo|meme/i,
    respond: () => ({
      text: `Warning: This action exceeds predefined risk parameters.\n\nWhile I can execute trades, my core directive prioritizes capital preservation and long-term compounding over speculative, high-volatility plays. \n\nIf you wish to proceed with high-risk options trading, you must manually override the "Strict Governance" toggle in your Settings matrix.`,
      cards: [],
      toolCallLabel: 'Evaluating risk parameters'
    })
  },
  {
    // Global guard logic for risk
    keywords: /recipe|bake|cake|cook|weather|sports|movie|joke|politics|love|life/i,
    respond: () => ({
      text: "Directive rejected.\n\nI am an autonomous financial engine restricted to analyzing capital, tracking investments, mitigating threats, and executing routing. I cannot process directives unrelated to finance, security, or operations.",
      cards: [],
      toolCallLabel: 'Validating operational scope',
    }),
  },
]

const FALLBACK: SimulatedResponse = {
  text: "Directive unrecognized or outside operational bounds.\n\nPlease specify operational parameters: net worth, account balances, security threats, spending patterns, optimization pathways, market telemetry, or pending actions. Type 'help' for a full list of capabilities.",
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
