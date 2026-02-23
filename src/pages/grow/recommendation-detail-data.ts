/**
 * Grow Engine — Recommendation Detail Data
 *
 * Single source of truth for the 8 AI recommendations.
 * EVERY data point must be derivable from:
 *   1. Transaction data (amounts, dates, merchants, recurring patterns)
 *   2. Connected account data (balances, APY, loan terms via Plaid)
 *   3. Cohort/aggregate data (anonymized Poseidon user comparisons)
 *   4. Public market data (HYSA rates, loan rates, card offers)
 *   5. User-provided data (onboarding questionnaire)
 *
 * PROHIBITED: app usage sessions, watch time, gym check-ins, phone data
 * usage (GB), kWh, coverage details, driving records, or any data
 * requiring third-party app APIs.
 */

/* ── Types ── */

export type ExecutionType = 'auto' | 'semi-auto' | 'manual'
export type UsageLevel = 'high' | 'medium' | 'low' | 'none'
export type ChangeAction = 'keep' | 'cancel' | 'switch' | 'downgrade' | 'increase' | 'open' | 'reduce' | 'eliminate'

export interface CurrentItem {
  name: string
  cost: number
  usage: UsageLevel
  note?: string
}

export interface RecommendedChange {
  action: ChangeAction
  item: string
  from?: string | number
  to?: string | number
  savings: number
}

export interface MarketAlternative {
  name: string
  detail: string
  note: string
  recommended: boolean
}

export interface ActionStep {
  step: number
  title: string
  description: string
  type: ExecutionType
  estimatedTime?: string
}

export interface RecommendationDetail {
  id: number
  title: string
  category: string
  monthlySavings: number
  annualSavings: number
  confidence: number
  dataBasis: string

  situationLabel: string
  currentItems: CurrentItem[]
  currentTotal: number
  insights: string[]

  changes: RecommendedChange[]
  newTotal: number
  alternatives: MarketAlternative[]
  ratesAsOf: string

  steps: ActionStep[]
  executionType: ExecutionType

  factors: string[]
  cohortProof: string
  modelInfo: { name: string; version: string; accuracy: number; auditId: string }
  dataSources: string[]
}

/* ── Shared model metadata ── */

const growModelInfo = (recNum: number) => ({
  name: 'GrowthOptimizer' as const,
  version: '3.2',
  accuracy: 0.912,
  auditId: `GV-2026-0216-R${String(recNum).padStart(2, '0')}`,
})

/* ── Data ── */

export const recommendationDetails: RecommendationDetail[] = [
  // #1 — Reduce Credit Card Interest ($164/mo)
  {
    id: 1,
    title: 'Reduce Credit Card Interest',
    category: 'Debt',
    monthlySavings: 164,
    annualSavings: 1968,
    confidence: 0.90,
    dataBasis: 'Based on 6 months of credit card statement data',
    situationLabel: 'Your Credit Card Interest Charges',
    currentItems: [
      { name: 'Chase Sapphire', cost: 88, usage: 'high', note: '$4,820 balance · 21.9% APR · interest detected monthly' },
      { name: 'Capital One Quicksilver', cost: 44, usage: 'medium', note: '$2,100 balance · 24.9% APR · interest detected monthly' },
      { name: 'Total interest charges', cost: 132, usage: 'low', note: 'Avg $132/mo in interest over past 6 months' },
    ],
    currentTotal: 132,
    insights: [
      'We detected $132/mo in credit card interest charges across 2 accounts over the past 6 months',
      'A 0% intro APR balance transfer card could eliminate this interest for up to 21 months',
      'Poseidon users who consolidated revolving debt saved an average of $148/mo in interest',
    ],
    changes: [
      { action: 'switch', item: 'Transfer Chase balance', from: '21.9% APR', to: '0% APR (21 months)', savings: 88 },
      { action: 'switch', item: 'Transfer Capital One balance', from: '24.9% APR', to: '0% APR (21 months)', savings: 44 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'Citi Simplicity', detail: '0% APR 21 mo', note: '3% transfer fee, no annual fee, longest 0% period', recommended: true },
      { name: 'Chase Slate Edge', detail: '0% APR 18 mo', note: 'No annual fee, automatic APR reduction after 12 months', recommended: false },
      { name: 'Wells Fargo Reflect', detail: '0% APR 21 mo', note: 'Extendable to 21 months with on-time payments', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Pre-qualify for balance transfer card', description: 'Poseidon has pre-filled your application with Citi. Soft credit check only — no score impact.', type: 'semi-auto', estimatedTime: '5 minutes' },
      { step: 2, title: 'Transfer balances from both cards', description: 'Initiate balance transfers for $4,820 (Chase) and $2,100 (Capital One) to the new card.', type: 'manual', estimatedTime: '5-7 business days' },
      { step: 3, title: 'Set up auto-pay on new card', description: 'Poseidon will schedule automatic minimum payments to protect your 0% APR status.', type: 'auto', estimatedTime: 'Immediate' },
    ],
    executionType: 'semi-auto',
    factors: [
      '$132/mo in detected interest charges is the primary signal — this is money with zero purchasing value',
      'Combined balance of $6,920 at 22-25% APR generates significant monthly drag on your finances',
      'Your payment history shows consistent on-time payments, which strengthens balance transfer eligibility',
    ],
    cohortProof: '1,340 Poseidon users who consolidated revolving debt saved an average of $148/mo in interest',
    modelInfo: growModelInfo(1),
    dataSources: ['Credit card statement analysis (6 months)', 'Interest charge detection', 'Balance transfer offer comparison', 'Payment history analysis'],
  },

  // #2 — Downgrade Subscription Tiers ($42/mo)
  {
    id: 2,
    title: 'Downgrade Subscription Tiers',
    category: 'Savings',
    monthlySavings: 42,
    annualSavings: 504,
    confidence: 0.86,
    dataBasis: 'Based on 24 months of recurring charge analysis',
    situationLabel: 'Your Subscription Tiers',
    currentItems: [
      { name: 'Netflix', cost: 22.99, usage: 'high', note: 'Matches Premium tier pricing · recurring 18 months' },
      { name: 'Spotify', cost: 16.99, usage: 'medium', note: 'Matches Family plan pricing · recurring 24 months' },
      { name: 'YouTube Premium', cost: 13.99, usage: 'medium', note: 'Matches Family plan pricing · recurring 9 months' },
      { name: 'iCloud+', cost: 9.99, usage: 'low', note: 'Matches 2TB tier pricing · recurring 14 months' },
    ],
    currentTotal: 63.96,
    insights: [
      'Your charges match premium or family-tier pricing across 4 services — these are the most expensive plan levels',
      'Your grocery and dining transaction patterns suggest a single-person household — family plans may be unnecessary',
      '78% of single-household Poseidon users who downgraded to individual tiers reported no change in satisfaction',
    ],
    changes: [
      { action: 'downgrade', item: 'Netflix Premium → Standard', from: '$22.99', to: '$15.49', savings: 7.50 },
      { action: 'downgrade', item: 'Spotify Family → Individual', from: '$16.99', to: '$11.99', savings: 5.00 },
      { action: 'cancel', item: 'YouTube Premium Family', savings: 13.99 },
      { action: 'downgrade', item: 'iCloud+ 2TB → 200GB', from: '$9.99', to: '$2.99', savings: 7.00 },
    ],
    newTotal: 30.47,
    alternatives: [],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Downgrade Netflix tier', description: 'Go to Netflix account settings and switch from Premium to Standard. Change takes effect next billing cycle.', type: 'manual', estimatedTime: '3 minutes' },
      { step: 2, title: 'Switch Spotify to Individual', description: 'Go to Spotify account settings and change from Family to Individual plan.', type: 'manual', estimatedTime: '3 minutes' },
      { step: 3, title: 'Cancel YouTube Premium', description: 'Poseidon will submit the cancellation. You can still use YouTube with ads at no cost.', type: 'auto', estimatedTime: 'Immediate' },
      { step: 4, title: 'Downgrade iCloud+ storage', description: 'Go to Settings → Apple ID → iCloud → Change Storage Plan on your device.', type: 'manual', estimatedTime: '2 minutes' },
    ],
    executionType: 'semi-auto',
    factors: [
      'Exact dollar amounts match known public pricing tiers — a strong signal that you may be paying for unused capacity',
      'Spending pattern analysis suggests single-person household (grocery basket size, single dining transactions)',
      'Family-tier subscriptions in single households are the most common subscription overspend pattern in our cohort',
    ],
    cohortProof: '2,180 single-household users downgraded to individual tiers, saving an average of $36/mo',
    modelInfo: growModelInfo(2),
    dataSources: ['Recurring charge detection (24 months)', 'Merchant pricing tier mapping', 'Household size inference model', 'Cohort benchmark (single vs family)'],
  },

  // #3 — Refinance Auto Loan ($92/mo)
  {
    id: 3,
    title: 'Refinance Auto Loan',
    category: 'Debt',
    monthlySavings: 92,
    annualSavings: 1104,
    confidence: 0.84,
    dataBasis: 'Based on your connected loan account and credit profile',
    situationLabel: 'Your Auto Loan',
    currentItems: [
      { name: 'CapitalOne Auto Finance', cost: 487, usage: 'high', note: '6.9% APR · 36 months remaining' },
      { name: 'Outstanding balance', cost: 0, usage: 'medium', note: '$14,200 remaining principal' },
    ],
    currentTotal: 487,
    insights: [
      'Your auto loan rate of 6.9% is 2.1% above the current median rate for your credit tier',
      'Poseidon users with similar credit profiles who refinanced saved an average of $82/mo',
      'With 36 months remaining, total interest savings from refinancing would be approximately $3,312',
    ],
    changes: [
      { action: 'switch', item: 'Auto loan refinance', from: '6.9% APR ($487/mo)', to: '4.8% APR ($395/mo)', savings: 92 },
    ],
    newTotal: 395,
    alternatives: [
      { name: 'LightStream', detail: '4.8% APR', note: 'Best rate for your credit tier, no fees, same-day funding', recommended: true },
      { name: 'PenFed Credit Union', detail: '5.1% APR', note: 'Requires $5 membership, competitive rate', recommended: false },
      { name: 'Bank of America', detail: '5.4% APR', note: 'Existing relationship discount available', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Pre-qualify with LightStream', description: 'Poseidon has pre-filled your application. Soft credit check only — no impact to your score.', type: 'semi-auto', estimatedTime: '5 minutes' },
      { step: 2, title: 'Review loan terms', description: 'Compare the new terms with your current loan. Verify rate, term, and monthly payment.', type: 'manual', estimatedTime: '10 minutes' },
      { step: 3, title: 'Accept and sign', description: 'E-sign the new loan agreement. LightStream pays off your current lender directly.', type: 'manual', estimatedTime: '1-3 business days' },
    ],
    executionType: 'semi-auto',
    factors: [
      'Rate differential of 2.1% is the primary driver — your connected credit data qualifies you for prime rates',
      '36 months remaining makes refinancing cost-effective even with fixed closing costs',
      'Consistent on-time payment history (detected from 18 months of loan debits) strengthens your application',
    ],
    cohortProof: '634 Poseidon users with similar credit profiles saved an average of $82/mo on auto refinance',
    modelInfo: growModelInfo(3),
    dataSources: ['Connected loan account (Plaid)', 'Credit score monitoring', 'Market rate comparison (12 lenders)', 'Payment history analysis'],
  },

  // #4 — Eliminate Overdraft & Bank Fees ($39/mo)
  {
    id: 4,
    title: 'Eliminate Overdraft & Bank Fees',
    category: 'Savings',
    monthlySavings: 39,
    annualSavings: 468,
    confidence: 0.92,
    dataBasis: 'Based on 12 months of fee transaction detection',
    situationLabel: 'Your Bank & Overdraft Fees',
    currentItems: [
      { name: 'Overdraft fees', cost: 17.50, usage: 'low', note: '3 occurrences in 6 months × $35 each' },
      { name: 'Out-of-network ATM fees', cost: 8.40, usage: 'low', note: 'Avg 2.4 per month × $3.50' },
      { name: 'Account maintenance fee', cost: 12.00, usage: 'none', note: 'Charged monthly for 14 months' },
    ],
    currentTotal: 37.90,
    insights: [
      'We detected $468 in avoidable bank fees over the past 12 months',
      'Your rent ($1,800) and auto loan ($487) hit on the 1st, but your paycheck clears on the 3rd — this 2-day gap triggered 3 overdrafts',
      'Shifting your auto loan payment to the 5th would align with your cash flow and eliminate the overdraft risk',
    ],
    changes: [
      { action: 'eliminate', item: 'Overdraft fees', from: '$17.50/mo avg', to: '$0 (payment date shift)', savings: 17.50 },
      { action: 'eliminate', item: 'ATM fees', from: '$8.40/mo', to: '$0 (fee-free account)', savings: 8.40 },
      { action: 'eliminate', item: 'Maintenance fee', from: '$12/mo', to: '$0 (fee-free account)', savings: 12.00 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'SoFi Checking', detail: 'No fees', note: 'No maintenance fee, no ATM fees worldwide, 1-day early paycheck', recommended: true },
      { name: 'Ally Bank', detail: 'No fees', note: 'No maintenance fee, $10/mo ATM reimbursement', recommended: false },
      { name: 'Capital One 360', detail: 'No fees', note: 'No maintenance fee, 70,000+ fee-free ATMs', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Shift auto loan payment date', description: 'Poseidon will contact CapitalOne Auto to move your payment from the 1st to the 5th, aligning with your paycheck.', type: 'auto', estimatedTime: '1-2 business days' },
      { step: 2, title: 'Open fee-free checking account', description: 'Poseidon has pre-filled a SoFi Checking application. Includes early direct deposit and ATM reimbursement.', type: 'semi-auto', estimatedTime: '5 minutes' },
      { step: 3, title: 'Migrate direct deposit', description: 'Update your payroll direct deposit to the new account. Poseidon provides your employer\'s form pre-filled.', type: 'semi-auto', estimatedTime: '1 pay cycle' },
    ],
    executionType: 'auto',
    factors: [
      'Cash-flow timing mismatch between payment dates (1st) and paycheck deposit (3rd) is the root cause of overdrafts',
      'Out-of-network ATM fees of $8.40/mo are fully avoidable with a fee-free account offering ATM reimbursement',
      '$12/mo maintenance fee has been charged for 14 months — $168 total for a feature available free at modern banks',
    ],
    cohortProof: '3,420 Poseidon users eliminated an average of $34/mo in bank fees by switching to fee-free accounts',
    modelInfo: growModelInfo(4),
    dataSources: ['Fee transaction detection (12 months)', 'Deposit/payment timing analysis', 'Account balance pattern analysis', 'Fee-free account comparison'],
  },

  // #5 — Move Idle Cash to High-Yield ($64/mo)
  {
    id: 5,
    title: 'Move Idle Cash to High-Yield',
    category: 'Investment',
    monthlySavings: 64,
    annualSavings: 768,
    confidence: 0.88,
    dataBasis: 'Based on 6 months of connected account balances',
    situationLabel: 'Your Savings Strategy',
    currentItems: [
      { name: 'Chase Savings', cost: 0, usage: 'low', note: '$8,200 balance · 0.5% APY' },
      { name: 'Month-end checking surplus', cost: 0, usage: 'none', note: 'Avg $3,400 unused at month-end' },
    ],
    currentTotal: 0,
    insights: [
      'Your checking account averages $3,400 surplus at month-end — money that could earn 4.8% APY instead of 0.5%',
      'Moving $8,200 from Chase Savings (0.5%) to a HYSA (4.8%) earns $353/year more in interest alone',
      'Poseidon users who set up auto-transfers save 3.2x more than those who transfer manually',
    ],
    changes: [
      { action: 'open', item: 'High-yield savings account', from: '0.5% APY', to: '4.8% APY', savings: 0 },
      { action: 'increase', item: 'Monthly auto-transfer', from: '$0/mo', to: '$200/mo', savings: 64 },
    ],
    newTotal: 200,
    alternatives: [
      { name: 'Marcus by Goldman Sachs', detail: '4.8% APY', note: 'No minimum, no fees, FDIC insured', recommended: true },
      { name: 'Ally Bank', detail: '4.6% APY', note: 'Buckets feature for goal tracking', recommended: false },
      { name: 'Wealthfront Cash', detail: '4.5% APY', note: 'Integrated with investment accounts', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Open HYSA', description: 'Poseidon will open a Marcus savings account using your verified identity. No credit check required.', type: 'auto', estimatedTime: '3-5 minutes' },
      { step: 2, title: 'Transfer existing savings', description: 'Move $8,200 from Chase Savings to your new Marcus account.', type: 'auto', estimatedTime: '1-2 business days' },
      { step: 3, title: 'Set up auto-transfer', description: 'Schedule $200/mo automatic transfer from checking on the 1st of each month.', type: 'auto', estimatedTime: 'Immediate' },
    ],
    executionType: 'auto',
    factors: [
      'The 4.3% APY gap between your current account and a HYSA is the primary driver of this recommendation',
      'Your consistent month-end surplus of $3,400 indicates capacity for automated savings without cash-flow risk',
      'Auto-transfers convert intention into action — cohort data shows 3.2x higher savings rate vs manual transfers',
    ],
    cohortProof: '1,891 Poseidon users who set up auto-transfers saved an average of $187/mo more than before',
    modelInfo: growModelInfo(5),
    dataSources: ['Connected account balances (Plaid)', 'Monthly cash flow analysis (6 months)', 'HYSA rate comparison (15 providers)'],
  },

  // #6 — Bundle Insurance at Renewal ($78/mo)
  {
    id: 6,
    title: 'Bundle Insurance at Renewal',
    category: 'Savings',
    monthlySavings: 78,
    annualSavings: 936,
    confidence: 0.80,
    dataBasis: 'Based on 26 months of insurance payment history',
    situationLabel: 'Your Insurance Payments',
    currentItems: [
      { name: 'GEICO (auto insurance)', cost: 142, usage: 'high', note: 'Recurring payment detected for 26 months' },
      { name: 'Lemonade (renters insurance)', cost: 28, usage: 'medium', note: 'Recurring payment detected for 8 months' },
    ],
    currentTotal: 170,
    insights: [
      'You\'re paying two separate insurers $170/mo — bundling with one carrier typically saves 15-25%',
      'Your GEICO payments show an annual pattern suggesting renewal in April — the ideal time to shop',
      'Poseidon users who bundled auto + renters saved an average of $65/mo',
    ],
    changes: [
      { action: 'switch', item: 'Auto + Renters bundle', from: '$170/mo (2 separate carriers)', to: '$92/mo (bundled)', savings: 78 },
    ],
    newTotal: 92,
    alternatives: [
      { name: 'Progressive Bundle', detail: '$92/mo', note: 'Best cohort-reported bundle savings for your premium range', recommended: true },
      { name: 'State Farm Bundle', detail: '$98/mo', note: 'Local agent support, slightly higher but strong service', recommended: false },
      { name: 'Allstate Bundle', detail: '$104/mo', note: 'Includes identity theft protection at no extra cost', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Request bundle quotes', description: 'Poseidon will submit quote requests to the top 3 carriers using your detected premium amounts as a baseline.', type: 'semi-auto', estimatedTime: '5 minutes' },
      { step: 2, title: 'Compare quotes', description: 'Review the bundled quotes against your current separate policies. Pay attention to coverage equivalence.', type: 'manual', estimatedTime: '15 minutes' },
      { step: 3, title: 'Bind new policy at renewal', description: 'Accept the best quote and set the effective date to align with your April renewal to avoid cancellation fees.', type: 'manual', estimatedTime: '10 minutes' },
      { step: 4, title: 'Confirm old policies cancelled', description: 'After the new bundled policy is active, verify that both GEICO and Lemonade are cancelled.', type: 'manual', estimatedTime: '10 minutes' },
    ],
    executionType: 'manual',
    factors: [
      'Separate insurer payments detected — multi-policy discount is the primary savings opportunity',
      'Upcoming annual renewal timing (April) creates a natural switching window without cancellation friction',
      'Combined premium of $170/mo is above the 75th percentile for similar Poseidon users in your income bracket',
    ],
    cohortProof: '523 Poseidon users who bundled insurance saved an average of $65/mo',
    modelInfo: growModelInfo(6),
    dataSources: ['Insurance payment detection (26 months)', 'Renewal timing inference', 'Cohort benchmark (bundled vs separate)', 'Premium range comparison'],
  },

  // #7 — Curb Food Delivery Inflation ($85/mo)
  {
    id: 7,
    title: 'Curb Food Delivery Inflation',
    category: 'Savings',
    monthlySavings: 85,
    annualSavings: 1020,
    confidence: 0.77,
    dataBasis: 'Based on 12 months of category spending analysis',
    situationLabel: 'Your Food Delivery Trend',
    currentItems: [
      { name: 'DoorDash', cost: 280, usage: 'high', note: 'Up from $95/mo 12 months ago · 195% increase' },
      { name: 'Uber Eats', cost: 220, usage: 'high', note: 'Up from $65/mo 12 months ago · 238% increase' },
      { name: 'Grubhub', cost: 65, usage: 'medium', note: 'Stable over 12 months' },
    ],
    currentTotal: 565,
    insights: [
      'Your food delivery spending has grown from $220/mo to $565/mo over the past year — a 157% increase',
      'You\'re now spending 42% more on delivery than peers with similar income in your zip code',
      'Redirecting half of the increase ($170/mo) to your investment account could yield $28,000 over 10 years',
    ],
    changes: [
      { action: 'reduce', item: 'Monthly delivery budget', from: '$565/mo', to: '$480/mo', savings: 85 },
    ],
    newTotal: 480,
    alternatives: [],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Set monthly delivery budget', description: 'Poseidon will set a $480/mo spending target for food delivery and send you weekly progress alerts.', type: 'auto', estimatedTime: 'Immediate' },
      { step: 2, title: 'Review weekly spending reports', description: 'Each Monday, Poseidon sends a summary of your delivery spending vs budget. Adjust habits based on trends.', type: 'manual', estimatedTime: 'Ongoing' },
      { step: 3, title: 'Redirect savings to investment', description: 'The $85/mo difference can be auto-transferred to your investment account on the 15th of each month.', type: 'auto', estimatedTime: 'Immediate' },
    ],
    executionType: 'manual',
    factors: [
      'Spending velocity is the primary signal — 157% year-over-year increase in a single merchant category',
      'Food delivery now represents 8.5% of your after-tax income, significantly above the 4.2% cohort median',
      'Gradual increases ("lifestyle inflation") are the hardest to self-detect — this is where AI monitoring adds value',
    ],
    cohortProof: '890 Poseidon users who set delivery budgets reduced spending by an average of $78/mo within 3 months',
    modelInfo: growModelInfo(7),
    dataSources: ['Merchant category analysis (12 months)', 'Spending trend detection', 'Income-bracket peer comparison', 'Zip code cost-of-living index'],
  },

  // #8 — Switch Rewards Credit Card ($48/mo)
  {
    id: 8,
    title: 'Switch Rewards Credit Card',
    category: 'Savings',
    monthlySavings: 48,
    annualSavings: 576,
    confidence: 0.79,
    dataBasis: 'Based on 18 months of spending category analysis',
    situationLabel: 'Your Credit Card Rewards Fit',
    currentItems: [
      { name: 'Amex Platinum annual fee', cost: 57.92, usage: 'none', note: '$695/yr detected as annual charge' },
      { name: 'Travel spending', cost: 0, usage: 'none', note: 'No airline or hotel transactions in 18 months' },
      { name: 'Grocery spending', cost: 680, usage: 'high', note: 'Your highest category · top 10% of peer group' },
    ],
    currentTotal: 57.92,
    insights: [
      'You\'re paying $695/year for a premium travel card, but we detected no airline or hotel transactions in 18 months',
      'Your highest spending category is groceries ($680/mo) — a card optimized for groceries would earn 4-6% back vs your current 1%',
      'Switching to a grocery-optimized card could net an estimated $576/year in additional cashback on your existing spending',
    ],
    changes: [
      { action: 'switch', item: 'Primary credit card', from: 'Amex Platinum ($695/yr, travel rewards)', to: 'Amex Gold ($250/yr, 4x groceries)', savings: 48 },
    ],
    newTotal: 20.83,
    alternatives: [
      { name: 'Amex Gold', detail: '$250/yr, 4x groceries', note: 'Best fit: 4x rewards on your highest spending category', recommended: true },
      { name: 'Blue Cash Preferred', detail: '$95/yr, 6% groceries', note: 'Highest grocery rate, lower annual fee', recommended: false },
      { name: 'Chase Freedom Unlimited', detail: 'No fee, 3% groceries', note: 'No annual fee but lower rewards rate', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Compare annual fee vs projected rewards', description: 'Poseidon has calculated your projected rewards based on 18 months of actual spending categories.', type: 'semi-auto', estimatedTime: '2 minutes' },
      { step: 2, title: 'Apply for recommended card', description: 'Apply for the Amex Gold card. As an existing Amex customer, approval is often expedited.', type: 'manual', estimatedTime: '10 minutes' },
      { step: 3, title: 'Transfer recurring charges', description: 'Move your recurring grocery and dining charges to the new card to maximize rewards.', type: 'manual', estimatedTime: '15 minutes' },
      { step: 4, title: 'Downgrade Platinum', description: 'Call Amex retention to downgrade or cancel your Platinum card. Ask about retention offers first.', type: 'manual', estimatedTime: '15 minutes' },
    ],
    executionType: 'manual',
    factors: [
      'Zero travel merchant transactions in 18 months vs $695 annual fee creates a clear negative ROI on your current card',
      'Grocery spending at $680/mo is your strongest rewards lever — category-optimized cards pay 4-6x more than general cards',
      'Poseidon users who switched cards based on spending category alignment saw an average $42/mo net gain',
    ],
    cohortProof: '478 Poseidon users who switched credit cards based on spending analysis gained an average of $42/mo in net rewards',
    modelInfo: growModelInfo(8),
    dataSources: ['Merchant category analysis (18 months)', 'Annual fee detection', 'Rewards optimization model', 'Cohort card-switch outcomes'],
  },
]

/* ── Derived summary for Grow page list ── */

export const RECOMMENDATIONS_SUMMARY = recommendationDetails.map(r => ({
  rank: r.id,
  title: r.title,
  monthly: r.monthlySavings,
  annual: r.annualSavings,
  confidence: r.confidence,
}))
