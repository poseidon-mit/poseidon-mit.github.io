/**
 * Grow Engine — Recommendation Detail Data
 *
 * Single source of truth for the 8 AI recommendations (B2B / Institutional Banking).
 * EVERY data point must be derivable from:
 *   1. Transaction data (amounts, dates, vendors, recurring patterns)
 *   2. Connected account data (balances, rates, facility terms via treasury APIs)
 *   3. Cohort/aggregate data (anonymized Poseidon enterprise client comparisons)
 *   4. Public market data (treasury rates, commercial lending rates, procurement benchmarks)
 *   5. Client-provided data (onboarding questionnaire, ERP integration)
 *
 * PROHIBITED: employee personal data, individual browsing/app usage,
 * internal communications content, or any data requiring HR system APIs.
 */

/* ── Types ── */

export type ExecutionType = 'auto' | 'semi-auto' | 'manual'
export type UsageLevel = 'high' | 'medium' | 'low' | 'none'
export type ChangeAction = 'keep' | 'cancel' | 'switch' | 'downgrade' | 'increase' | 'open' | 'reduce' | 'eliminate'

export type Category = 'Efficiency' | 'Risk Mitigation' | 'Revenue Growth'

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
  // #1 — Corporate Credit Facility Optimization ($18,400/mo)
  {
    id: 1,
    title: 'Optimize Corporate Credit Facility',
    category: 'Risk Mitigation',
    monthlySavings: 18400,
    annualSavings: 220800,
    confidence: 0.90,
    dataBasis: 'Based on 6 months of revolving credit facility utilization data',
    situationLabel: 'Your Corporate Credit Facility Costs',
    currentItems: [
      { name: 'JP Morgan Revolving Facility', cost: 12600, usage: 'high', note: '$4.2M drawn · SOFR+285bps · interest accruing monthly' },
      { name: 'Wells Fargo Working Capital Line', cost: 5800, usage: 'medium', note: '$1.8M drawn · SOFR+320bps · interest accruing monthly' },
      { name: 'Total interest charges', cost: 18400, usage: 'low', note: 'Avg $18,400/mo in facility interest over past 6 months' },
    ],
    currentTotal: 18400,
    insights: [
      'We detected $18,400/mo in credit facility interest across 2 lending relationships over the past 6 months',
      'Consolidating into a single syndicated facility at renegotiated terms could reduce the blended rate by 90-120bps',
      'Poseidon enterprise clients who consolidated revolving facilities saved an average of $16,200/mo in interest expense',
    ],
    changes: [
      { action: 'switch', item: 'Consolidate JP Morgan facility', from: 'SOFR+285bps', to: 'SOFR+175bps (consolidated)', savings: 12600 },
      { action: 'switch', item: 'Consolidate Wells Fargo line', from: 'SOFR+320bps', to: 'SOFR+175bps (consolidated)', savings: 5800 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'BNY Mellon Syndicated Facility', detail: 'SOFR+175bps', note: 'Best rate for your credit profile, $8M commitment, flexible draw schedule', recommended: true },
      { name: 'US Bank Corporate Line', detail: 'SOFR+195bps', note: 'Competitive rate with treasury management fee waiver', recommended: false },
      { name: 'Citibank Revolving Credit', detail: 'SOFR+210bps', note: 'Existing relationship, expedited underwriting', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Request facility proposals from lead arrangers', description: 'Poseidon has pre-populated an RFP with your utilization history and credit profile. Send to 3 shortlisted banks.', type: 'semi-auto', estimatedTime: '1 business day' },
      { step: 2, title: 'CFO review and term sheet comparison', description: 'Compare consolidated term sheets side-by-side: rate, commitment fee, covenants, and draw flexibility.', type: 'manual', estimatedTime: '3-5 business days' },
      { step: 3, title: 'Execute facility agreement', description: 'Legal review and execution of the new consolidated facility. Poseidon tracks closing checklist items automatically.', type: 'manual', estimatedTime: '2-4 weeks' },
    ],
    executionType: 'semi-auto',
    factors: [
      '$18,400/mo in detected interest expense across fragmented facilities is the primary signal — consolidation unlocks volume pricing',
      'Combined drawn balance of $6M at 285-320bps over SOFR generates significant monthly drag on operating margins',
      'Consistent covenant compliance and clean payment history strengthen negotiating position for rate reduction',
    ],
    cohortProof: '134 Poseidon enterprise clients who consolidated revolving facilities saved an average of $16,200/mo in interest expense',
    modelInfo: growModelInfo(1),
    dataSources: ['Credit facility utilization analysis (6 months)', 'Interest expense detection', 'Syndicated loan market benchmarks', 'Covenant compliance history'],
  },

  // #2 — SaaS License Rationalization ($14,200/mo)
  {
    id: 2,
    title: 'Rationalize SaaS License Portfolio',
    category: 'Efficiency',
    monthlySavings: 14200,
    annualSavings: 170400,
    confidence: 0.86,
    dataBasis: 'Based on 24 months of recurring vendor payment analysis',
    situationLabel: 'Your SaaS License Portfolio',
    currentItems: [
      { name: 'Salesforce Enterprise', cost: 18500, usage: 'high', note: 'Matches Enterprise tier pricing · 340 seats licensed · recurring 24 months' },
      { name: 'ServiceNow ITSM', cost: 12400, usage: 'medium', note: 'Matches Pro tier pricing · 180 seats licensed · recurring 18 months' },
      { name: 'Workday HCM', cost: 9800, usage: 'medium', note: 'Matches full-suite pricing · recurring 14 months' },
      { name: 'Tableau Server', cost: 6200, usage: 'low', note: 'Matches Creator tier pricing · 95 seats licensed · recurring 12 months' },
    ],
    currentTotal: 46900,
    insights: [
      'Your charges match enterprise-tier pricing across 4 platforms — these are the most expensive license levels',
      'ERP usage telemetry suggests only 62% average seat utilization across these platforms — 38% of licenses may be unused',
      '78% of mid-market Poseidon clients who right-sized SaaS licenses reported no productivity impact',
    ],
    changes: [
      { action: 'downgrade', item: 'Salesforce Enterprise → Professional (right-size seats)', from: '$18,500', to: '$12,800', savings: 5700 },
      { action: 'downgrade', item: 'ServiceNow Pro → Standard (right-size seats)', from: '$12,400', to: '$8,600', savings: 3800 },
      { action: 'cancel', item: 'Tableau Server (consolidate into Salesforce Analytics)', savings: 6200 },
      { action: 'downgrade', item: 'Workday HCM → Core (remove unused modules)', from: '$9,800', to: '$11,300', savings: -1500 },
    ],
    newTotal: 32700,
    alternatives: [],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Audit seat utilization with IT ops', description: 'Poseidon generates a seat utilization report per platform. Review with IT to confirm inactive users and redundant modules.', type: 'semi-auto', estimatedTime: '2-3 business days' },
      { step: 2, title: 'Negotiate renewal terms with vendors', description: 'Use utilization data as leverage in renewal negotiations. Poseidon provides benchmarked pricing for your tier and headcount.', type: 'manual', estimatedTime: '2-4 weeks' },
      { step: 3, title: 'Consolidate Tableau into Salesforce Analytics', description: 'Migrate dashboards and reports from Tableau to Salesforce CRM Analytics. Poseidon tracks migration checklist.', type: 'manual', estimatedTime: '4-6 weeks' },
      { step: 4, title: 'Procurement approval and contract execution', description: 'Route renegotiated contracts through procurement workflow for CFO sign-off.', type: 'manual', estimatedTime: '1-2 weeks' },
    ],
    executionType: 'semi-auto',
    factors: [
      'Enterprise-tier pricing across 4 platforms with only 62% seat utilization — a strong signal of over-provisioning',
      'Overlapping analytics capabilities (Tableau + Salesforce Analytics) indicate consolidation opportunity',
      'SaaS over-provisioning is the most common technology overspend pattern in our mid-market cohort',
    ],
    cohortProof: '218 mid-market clients right-sized SaaS licenses, saving an average of $11,800/mo with no productivity loss',
    modelInfo: growModelInfo(2),
    dataSources: ['Recurring vendor payment detection (24 months)', 'Vendor pricing tier mapping', 'Seat utilization inference model', 'Cohort benchmark (right-sized vs over-provisioned)'],
  },

  // #3 — Equipment/Fleet Financing Optimization ($22,600/mo)
  {
    id: 3,
    title: 'Optimize Equipment & Fleet Financing',
    category: 'Risk Mitigation',
    monthlySavings: 22600,
    annualSavings: 271200,
    confidence: 0.84,
    dataBasis: 'Based on your connected equipment lease accounts and credit profile',
    situationLabel: 'Your Equipment & Fleet Financing',
    currentItems: [
      { name: 'Caterpillar Financial (heavy equipment)', cost: 48700, usage: 'high', note: '7.2% implicit rate · 42 months remaining' },
      { name: 'Outstanding lease balance', cost: 0, usage: 'medium', note: '$1.42M remaining principal across 8 units' },
    ],
    currentTotal: 48700,
    insights: [
      'Your equipment lease implicit rate of 7.2% is 2.4% above the current market rate for your credit tier',
      'Poseidon clients with similar fleet profiles who restructured financing saved an average of $19,800/mo',
      'With 42 months remaining, total interest savings from refinancing would be approximately $949,200',
    ],
    changes: [
      { action: 'switch', item: 'Equipment lease restructure', from: '7.2% implicit rate ($48,700/mo)', to: '4.8% via sale-leaseback ($26,100/mo)', savings: 22600 },
    ],
    newTotal: 26100,
    alternatives: [
      { name: 'GATX Capital', detail: '4.8% implicit rate', note: 'Best rate for your equipment class, flexible end-of-term options', recommended: true },
      { name: 'Key Equipment Finance', detail: '5.1% implicit rate', note: 'Includes maintenance bundling, strong mid-market focus', recommended: false },
      { name: 'PNC Equipment Finance', detail: '5.4% implicit rate', note: 'Existing banking relationship discount available', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Request proposals from equipment lessors', description: 'Poseidon has pre-populated an RFP with your fleet manifest and utilization data. Submit to 3 shortlisted lessors.', type: 'semi-auto', estimatedTime: '2 business days' },
      { step: 2, title: 'CFO review of restructuring terms', description: 'Compare sale-leaseback proposals: implicit rate, residual value, maintenance inclusions, and balance sheet impact.', type: 'manual', estimatedTime: '1-2 weeks' },
      { step: 3, title: 'Execute restructured lease agreements', description: 'Legal review and execution of new lease agreements. Poseidon tracks UCC filings and closing documentation.', type: 'manual', estimatedTime: '3-6 weeks' },
    ],
    executionType: 'semi-auto',
    factors: [
      'Rate differential of 2.4% is the primary driver — your credit profile qualifies for investment-grade equipment rates',
      '42 months remaining makes restructuring cost-effective even after early termination fees',
      'Consistent on-time payment history (detected from 18 months of lease debits) strengthens negotiation leverage',
    ],
    cohortProof: '63 Poseidon clients with similar fleet profiles saved an average of $19,800/mo on equipment financing',
    modelInfo: growModelInfo(3),
    dataSources: ['Connected lease accounts (ERP integration)', 'Equipment residual value benchmarks', 'Market rate comparison (14 lessors)', 'Payment history analysis'],
  },

  // #4 — Cash Management & Payment Timing Optimization ($28,500/mo)
  {
    id: 4,
    title: 'Optimize Cash Management & Payment Timing',
    category: 'Efficiency',
    monthlySavings: 28500,
    annualSavings: 342000,
    confidence: 0.92,
    dataBasis: 'Based on 12 months of treasury operations and payment flow analysis',
    situationLabel: 'Your Cash Management Inefficiencies',
    currentItems: [
      { name: 'Early payment discount forfeitures', cost: 14200, usage: 'low', note: 'Missed 2/10 Net 30 terms on 68% of eligible invoices' },
      { name: 'Wire transfer fees (avoidable)', cost: 6800, usage: 'low', note: 'Avg 42 unnecessary wires/mo × $35 each vs ACH at $0.25' },
      { name: 'FX conversion spreads', cost: 7500, usage: 'none', note: 'Sub-optimal spot execution on $2.1M/mo cross-border payments' },
    ],
    currentTotal: 28500,
    insights: [
      'We detected $342,000 in avoidable cash management costs over the past 12 months',
      'Your AP cycle averages 34 days, but 68% of your suppliers offer 2/10 Net 30 — paying on Day 10 would capture $170,400/yr in early-pay discounts',
      'Shifting 42 wire transfers/mo to batch ACH and using forward contracts for FX would save an additional $171,600/yr',
    ],
    changes: [
      { action: 'eliminate', item: 'Early-pay discount forfeitures', from: '$14,200/mo lost', to: '$0 (accelerated AP workflow)', savings: 14200 },
      { action: 'eliminate', item: 'Excess wire transfer fees', from: '$6,800/mo', to: '$0 (batch ACH conversion)', savings: 6800 },
      { action: 'reduce', item: 'FX conversion spreads', from: '$7,500/mo', to: '$0 (forward contract hedging)', savings: 7500 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'Kyriba Treasury Management', detail: 'Full TMS', note: 'Best-in-class AP automation with dynamic discounting, FX hedging module', recommended: true },
      { name: 'GTreasury', detail: 'Mid-market TMS', note: 'Strong cash positioning and payment factory capabilities', recommended: false },
      { name: 'Bank of America CashPro', detail: 'Bank TMS', note: 'Integrated with existing banking relationship, lower implementation cost', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Implement accelerated AP approval workflow', description: 'Poseidon configures auto-routing for invoices with early-pay terms. AP manager approves daily batch by 10 AM.', type: 'auto', estimatedTime: '1-2 weeks' },
      { step: 2, title: 'Convert recurring wires to batch ACH', description: 'Poseidon identifies 42 domestic vendor payments eligible for ACH conversion. Treasury ops reviews and approves the batch schedule.', type: 'semi-auto', estimatedTime: '2-3 business days' },
      { step: 3, title: 'Establish FX forward contracts', description: 'Set up 30/60/90-day forward contracts for recurring cross-border payments. Treasury committee review required.', type: 'manual', estimatedTime: '1-2 weeks' },
    ],
    executionType: 'auto',
    factors: [
      'Early-pay discount forfeitures of $14,200/mo are the largest component — AP workflow latency is the root cause',
      'Wire transfer fees of $6,800/mo are fully avoidable by converting domestic payments to batch ACH processing',
      'FX spot execution at retail spreads on $2.1M/mo in cross-border payments — forward contracts lock in wholesale rates',
    ],
    cohortProof: '342 Poseidon enterprise clients optimized payment timing, saving an average of $24,800/mo in cash management costs',
    modelInfo: growModelInfo(4),
    dataSources: ['Payment flow analysis (12 months)', 'AP cycle time measurement', 'Wire/ACH transaction classification', 'FX execution spread analysis'],
  },

  // #5 — Treasury Management & Short-Term Liquidity ($38,400/mo)
  {
    id: 5,
    title: 'Optimize Treasury & Short-Term Liquidity',
    category: 'Revenue Growth',
    monthlySavings: 38400,
    annualSavings: 460800,
    confidence: 0.88,
    dataBasis: 'Based on 6 months of connected treasury account balances',
    situationLabel: 'Your Liquidity Deployment Strategy',
    currentItems: [
      { name: 'Operating account (Chase Commercial)', cost: 0, usage: 'low', note: '$4.8M avg balance · ECR offset only (no yield)' },
      { name: 'Excess cash reserves', cost: 0, usage: 'none', note: 'Avg $7.2M idle at month-end across 3 accounts' },
    ],
    currentTotal: 0,
    insights: [
      'Your treasury accounts average $7.2M idle at month-end — funds that could earn 5.1% in overnight sweeps or T-bill ladders',
      'Moving $4.8M from ECR-offset to an institutional money market fund earns $244,800/year more in yield',
      'Poseidon clients who implemented automated sweep programs increased yield on idle cash by 3.8x',
    ],
    changes: [
      { action: 'open', item: 'Institutional money market sweep', from: '0.0% yield (ECR offset)', to: '5.1% yield (overnight sweep)', savings: 0 },
      { action: 'increase', item: 'Automated daily sweep', from: '$0/day', to: 'Excess over $1.5M operating floor', savings: 38400 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'Federated Hermes Institutional MMF', detail: '5.1% yield', note: 'Same-day liquidity, AAA rated, $100K minimum', recommended: true },
      { name: 'Dreyfus Government Cash Mgmt', detail: '4.9% yield', note: 'T+0 liquidity, government-only portfolio', recommended: false },
      { name: 'Morgan Stanley Institutional Liquidity', detail: '5.0% yield', note: 'Integrated with MS treasury platform', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Establish institutional money market account', description: 'Poseidon initiates account setup with Federated Hermes using your corporate KYC on file. No additional documentation required.', type: 'auto', estimatedTime: '2-3 business days' },
      { step: 2, title: 'Configure automated daily sweep', description: 'Set sweep threshold at $1.5M operating floor. Excess cash sweeps into MMF at end of each business day.', type: 'auto', estimatedTime: '1-2 business days' },
      { step: 3, title: 'Treasury committee approval', description: 'Submit sweep program parameters and investment policy statement amendment for treasury committee sign-off.', type: 'manual', estimatedTime: '1 committee cycle' },
    ],
    executionType: 'auto',
    factors: [
      'The 5.1% yield gap between idle deposits and institutional MMFs is the primary driver of this recommendation',
      'Consistent month-end surplus of $7.2M indicates substantial capacity for yield optimization without liquidity risk',
      'Automated sweeps convert idle balances into yield daily — cohort data shows 3.8x higher returns vs manual treasury management',
    ],
    cohortProof: '189 Poseidon enterprise clients who implemented sweep programs increased yield on idle cash by an average of $32,400/mo',
    modelInfo: growModelInfo(5),
    dataSources: ['Connected treasury balances (bank API)', 'Daily cash position analysis (6 months)', 'Institutional MMF rate comparison (18 providers)'],
  },

  // #6 — Commercial Insurance & Risk Transfer Bundling ($42,600/mo)
  {
    id: 6,
    title: 'Bundle Commercial Insurance & Risk Transfer',
    category: 'Risk Mitigation',
    monthlySavings: 42600,
    annualSavings: 511200,
    confidence: 0.80,
    dataBasis: 'Based on 26 months of commercial insurance premium payment history',
    situationLabel: 'Your Commercial Insurance Premiums',
    currentItems: [
      { name: 'Zurich (general liability + property)', cost: 68400, usage: 'high', note: 'Recurring premium detected for 26 months' },
      { name: 'AIG (D&O + E&O)', cost: 34200, usage: 'medium', note: 'Recurring premium detected for 14 months' },
      { name: 'Hartford (workers comp)', cost: 22800, usage: 'medium', note: 'Recurring premium detected for 20 months' },
    ],
    currentTotal: 125400,
    insights: [
      'You\'re paying three separate carriers $125,400/mo — bundling into a master program typically saves 18-30%',
      'Your Zurich premium shows an annual pattern suggesting renewal in April — the ideal time to market your program',
      'Poseidon clients who consolidated commercial programs saved an average of $38,500/mo',
    ],
    changes: [
      { action: 'switch', item: 'Consolidated commercial insurance program', from: '$125,400/mo (3 separate carriers)', to: '$82,800/mo (master program)', savings: 42600 },
    ],
    newTotal: 82800,
    alternatives: [
      { name: 'Marsh Master Program', detail: '$82,800/mo', note: 'Best cohort-reported program savings for your premium range, dedicated claims team', recommended: true },
      { name: 'Aon Commercial Package', detail: '$86,200/mo', note: 'Strong analytics platform, global program capability', recommended: false },
      { name: 'Willis Towers Watson Bundle', detail: '$89,400/mo', note: 'Includes cyber liability at no incremental premium', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Engage broker for program marketing', description: 'Poseidon submits your loss history and exposure data to 3 shortlisted brokers for master program proposals.', type: 'semi-auto', estimatedTime: '1-2 weeks' },
      { step: 2, title: 'Risk committee review of proposals', description: 'Compare master program structures: coverage terms, deductibles, aggregate limits, and carrier ratings. Risk committee sign-off required.', type: 'manual', estimatedTime: '2-3 weeks' },
      { step: 3, title: 'Bind master program at renewal', description: 'Accept the best proposal and set effective date to align with April renewal to avoid short-rate cancellation penalties.', type: 'manual', estimatedTime: '2 weeks' },
      { step: 4, title: 'Confirm legacy policies non-renewed', description: 'After master program is bound, verify that Zurich, AIG, and Hartford policies are non-renewed at expiry.', type: 'manual', estimatedTime: '1 week' },
    ],
    executionType: 'manual',
    factors: [
      'Fragmented carrier relationships detected — master program discount is the primary savings opportunity',
      'Upcoming annual renewal timing (April) creates a natural switching window without short-rate penalties',
      'Combined premium of $125,400/mo is above the 75th percentile for Poseidon clients in your revenue bracket',
    ],
    cohortProof: '52 Poseidon enterprise clients who consolidated commercial insurance saved an average of $38,500/mo',
    modelInfo: growModelInfo(6),
    dataSources: ['Insurance premium payment detection (26 months)', 'Renewal timing inference', 'Cohort benchmark (bundled vs fragmented programs)', 'Loss ratio benchmarking'],
  },

  // #7 — T&E Policy Enforcement & Vendor Consolidation ($32,400/mo)
  {
    id: 7,
    title: 'Enforce T&E Policy & Consolidate Vendors',
    category: 'Efficiency',
    monthlySavings: 32400,
    annualSavings: 388800,
    confidence: 0.77,
    dataBasis: 'Based on 12 months of corporate card and AP spend analysis',
    situationLabel: 'Your T&E and Vendor Spend Trends',
    currentItems: [
      { name: 'Corporate travel (non-preferred vendors)', cost: 128000, usage: 'high', note: 'Up from $64,000/mo 12 months ago · 100% increase · 72% off-policy bookings' },
      { name: 'Consulting & professional services', cost: 94000, usage: 'high', note: 'Up from $48,000/mo 12 months ago · 96% increase · fragmented across 34 vendors' },
      { name: 'Office supplies & misc vendors', cost: 18400, usage: 'medium', note: 'Stable over 12 months · 28 active vendors for commodity purchases' },
    ],
    currentTotal: 240400,
    insights: [
      'Your T&E and vendor spend has grown from $130,000/mo to $240,400/mo over the past year — an 85% increase',
      '72% of travel bookings are off-policy (non-preferred vendors), costing 34% more than negotiated rates',
      'Consolidating the top 10 consulting vendors and enforcing preferred-vendor policies could redirect $388,800/yr to the bottom line',
    ],
    changes: [
      { action: 'reduce', item: 'Monthly T&E and vendor spend (policy enforcement + consolidation)', from: '$240,400/mo', to: '$208,000/mo', savings: 32400 },
    ],
    newTotal: 208000,
    alternatives: [],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Deploy T&E policy guardrails in expense platform', description: 'Poseidon configures auto-flag rules for off-policy bookings and routes exceptions to department heads for pre-approval.', type: 'auto', estimatedTime: '1-2 weeks' },
      { step: 2, title: 'Negotiate preferred vendor agreements', description: 'Procurement team negotiates volume discounts with top 10 consulting firms and preferred travel vendors using Poseidon spend analytics.', type: 'manual', estimatedTime: '4-6 weeks' },
      { step: 3, title: 'Redirect savings to strategic initiatives', description: 'The $32,400/mo in captured savings is reallocated per CFO directive to R&D or working capital reserves.', type: 'manual', estimatedTime: 'Ongoing' },
    ],
    executionType: 'manual',
    factors: [
      'Spend velocity is the primary signal — 85% year-over-year increase across T&E and professional services categories',
      'Off-policy travel bookings now represent 72% of travel spend, at rates 34% above negotiated preferred-vendor pricing',
      'Vendor fragmentation across 34 consulting firms eliminates volume leverage — consolidation unlocks tier pricing',
    ],
    cohortProof: '89 Poseidon enterprise clients who enforced T&E policies and consolidated vendors reduced spend by an average of $28,600/mo within 3 months',
    modelInfo: growModelInfo(7),
    dataSources: ['Corporate card transaction analysis (12 months)', 'AP vendor fragmentation analysis', 'Travel booking policy compliance audit', 'Preferred vendor rate benchmarking'],
  },

  // #8 — Procurement Card & Rebate Recovery Optimization ($24,800/mo)
  {
    id: 8,
    title: 'Optimize Procurement Card & Rebate Recovery',
    category: 'Revenue Growth',
    monthlySavings: 24800,
    annualSavings: 297600,
    confidence: 0.79,
    dataBasis: 'Based on 18 months of procurement and AP spend analysis',
    situationLabel: 'Your Procurement Payment Optimization',
    currentItems: [
      { name: 'Legacy purchasing process (check/wire)', cost: 0, usage: 'none', note: '$8.2M/yr in P-card-eligible spend currently paid via check or wire' },
      { name: 'Unclaimed vendor rebates', cost: 0, usage: 'none', note: '$142,000 in volume rebates and early-pay discounts unclaimed over 18 months' },
      { name: 'Addressable AP spend', cost: 0, usage: 'high', note: '$14.6M/yr in total AP spend · only 31% on P-card today' },
    ],
    currentTotal: 0,
    insights: [
      '$8.2M/yr in procurement spend is paid via check or wire, forfeiting 1.5-2.0% in P-card rebates',
      'Your vendor agreements include $142,000 in unclaimed volume rebates and early-pay discounts over the past 18 months',
      'Migrating eligible spend to P-card and implementing rebate tracking could generate $297,600/yr in recovered value',
    ],
    changes: [
      { action: 'switch', item: 'Migrate AP spend to procurement card', from: 'Check/wire ($0 rebate)', to: 'P-card (1.8% rebate on $8.2M)', savings: 12300 },
      { action: 'increase', item: 'Implement rebate tracking and recovery', from: '$0 recovered', to: '$12,500/mo recovered', savings: 12500 },
    ],
    newTotal: 0,
    alternatives: [
      { name: 'Citi Commercial Card Program', detail: '1.8% rebate', note: 'Best fit: highest rebate tier for your spend volume, integrated expense management', recommended: true },
      { name: 'Bank of America Procurement Card', detail: '1.65% rebate', note: 'Strong reporting platform, Visa commercial network', recommended: false },
      { name: 'US Bank Corporate Payment Solutions', detail: '1.5% rebate + virtual cards', note: 'Virtual card capability for single-use supplier payments', recommended: false },
    ],
    ratesAsOf: 'Feb 22, 2026',
    steps: [
      { step: 1, title: 'Analyze AP spend for P-card eligibility', description: 'Poseidon categorizes your $14.6M AP spend by vendor acceptance, transaction size, and payment term compatibility.', type: 'semi-auto', estimatedTime: '3-5 business days' },
      { step: 2, title: 'Negotiate P-card program with issuing bank', description: 'RFP to 3 commercial card issuers using Poseidon spend analytics. Procurement team evaluates rebate tiers and reporting capabilities.', type: 'manual', estimatedTime: '3-4 weeks' },
      { step: 3, title: 'Implement rebate tracking system', description: 'Configure automated monitoring of volume rebate thresholds and early-pay discount eligibility across top 50 vendor contracts.', type: 'semi-auto', estimatedTime: '2-3 weeks' },
      { step: 4, title: 'CFO approval and program rollout', description: 'Present business case to CFO with projected $297,600/yr recovery. Phase rollout over 90 days starting with top 20 vendors.', type: 'manual', estimatedTime: '2-4 weeks' },
    ],
    executionType: 'manual',
    factors: [
      '$8.2M/yr in P-card-eligible spend paid via check/wire creates a clear rebate forfeiture — 1.8% on this volume is $147,600/yr',
      'Unclaimed volume rebates of $142,000 over 18 months indicate a systematic gap in vendor contract compliance monitoring',
      'Poseidon clients who implemented P-card programs on eligible AP spend recovered an average of $22,400/mo in rebates and discounts',
    ],
    cohortProof: '47 Poseidon enterprise clients who optimized procurement payments recovered an average of $22,400/mo in rebates and discounts',
    modelInfo: growModelInfo(8),
    dataSources: ['AP transaction analysis (18 months)', 'Vendor contract rebate clause extraction', 'P-card eligibility classification model', 'Cohort procurement optimization outcomes'],
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

/* ── Enriched summary for GrowRecommendations list page ── */

/** Enriched summary for GrowRecommendations list page. */
export type RecommendationListItem = {
  id: number
  rank: number
  title: string
  description: string
  category: 'Efficiency' | 'Risk Mitigation' | 'Revenue Growth'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  monthlySavings: number
  annualSavings: number
  confidence: number
  shapFactors: { name: string; weight: number }[]
  evidence: string
  modelVersion: string
  auditId: string
}

const EXECUTION_TO_DIFFICULTY: Record<ExecutionType, 'Easy' | 'Medium' | 'Hard'> = {
  auto: 'Easy',
  'semi-auto': 'Medium',
  manual: 'Hard',
}

export const RECOMMENDATIONS_FOR_LIST: RecommendationListItem[] = recommendationDetails.map((r, i) => {
  // Derive SHAP-like factors from the first 3 factors with distributed weights
  const factorNames = r.factors.slice(0, 3)
  const totalFactors = factorNames.length
  const baseWeight = Math.round((1 / totalFactors) * 100) / 100

  return {
    id: r.id,
    rank: i + 1,
    title: r.title,
    description: r.dataBasis,
    category: r.category as 'Efficiency' | 'Risk Mitigation' | 'Revenue Growth',
    difficulty: EXECUTION_TO_DIFFICULTY[r.executionType],
    monthlySavings: r.monthlySavings,
    annualSavings: r.annualSavings,
    confidence: r.confidence,
    shapFactors: factorNames.map((name, j) => ({
      name: name.length > 40 ? name.slice(0, 37) + '...' : name,
      weight: j === 0 ? 1 - baseWeight * (totalFactors - 1) : baseWeight,
    })),
    evidence: r.cohortProof,
    modelVersion: `${r.modelInfo.name} v${r.modelInfo.version}`,
    auditId: r.modelInfo.auditId,
  }
})
