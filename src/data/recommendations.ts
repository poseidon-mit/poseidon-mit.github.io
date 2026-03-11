export interface Recommendation {
  id: string;
  title: string;
  benefit?: string;
  savings?: string;
  description: string;
  status: "pending" | "approved" | "dismissed";
  engine: "Grow" | "Protect" | "Execute" | "Govern";
}

export interface GrowStats {
  totalIdentified: string;
  realized: string;
  pending: string;
  acceptedCount: number;
  totalRecommendations: number;
}

export const recommendations: Recommendation[] = [
  {
    id: "GRW-001",
    title: "Move $8,200 to High-Yield Savings",
    benefit: "$269.40/year in interest",
    description:
      "Your Chase Savings earns 0.01% APY. Moving $8,200 to a high-yield savings account at 3.30% APY would earn $269.40/year more in interest.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-002",
    title: "Portfolio Rebalancing",
    benefit: "+2.3% projected return",
    description:
      "Your current allocation is overweight in large-cap equities. Rebalancing could improve risk-adjusted returns by an estimated 2.3%.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-003",
    title: "Cancel Unused Subscriptions",
    savings: "$468/year",
    description:
      "You have an Adobe Creative duplicate charge ($59.99 x 2) and NYTimes price increased without notification ($12.00 → $17.00). Canceling duplicates and reviewing increases saves $468/year.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-004",
    title: "Maximize Credit Card Points",
    savings: "$96-192/year",
    description:
      "You're earning 1x on $3,200/mo in eligible spending. Optimizing card usage across Amex Gold and Chase Sapphire could earn $96-192/year more in rewards.",
    status: "approved",
    engine: "Grow",
  },
  {
    id: "GRW-005",
    title: "Refinance Auto Loan",
    savings: "$840/year",
    description:
      "Your current auto loan at 6.9% APR has 36 months remaining. Refinancing at today's rate of 4.5% APR would save approximately $840/year while reducing your monthly payment by $70.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-006",
    title: "Consolidate Streaming Services",
    savings: "$216/year",
    description:
      "You're subscribed to 5 streaming services totaling $78/mo. Consolidating to a bundle plan (Netflix + Hulu + Disney+) saves $18/mo ($216/year) while retaining 90% of your watched content.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-007",
    title: "Increase 401(k) Contribution",
    benefit: "$3,033/year in tax savings",
    description:
      "You're contributing 6% to your Fidelity 401(k) but your employer matches up to 10%. Increasing to 10% adds $3,033/year in combined tax savings and employer match — effectively free money.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-008",
    title: "Switch to No-Fee Checking",
    savings: "$300/year",
    description:
      "Your Chase Premier Checking charges $25/mo in maintenance fees. Switching to a no-fee online checking account with equivalent features eliminates $300/year in fees.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-009",
    title: "Negotiate Cell Phone Bill",
    savings: "$600/year",
    description:
      "Your Verizon Unlimited plan at $130/mo is $50 above the market average for comparable plans. Negotiating or switching carriers could save $600/year with identical coverage.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-010",
    title: "Open Backdoor Roth IRA",
    benefit: "$1,400/year in tax-free growth",
    description:
      "Your income exceeds direct Roth IRA limits. A backdoor Roth IRA contribution of $7,000 could generate approximately $1,400/year in tax-free investment growth based on historical returns.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-011",
    title: "Enable Round-Up Savings",
    savings: "$540/year",
    description:
      "Enabling round-up savings on your Chase debit card would automatically invest spare change from ~900 monthly transactions, averaging $45/mo ($540/year) in additional savings.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-012",
    title: "Home Insurance Bundle",
    savings: "$320/year",
    description:
      "Bundling your home and auto insurance with a single provider qualifies for a multi-policy discount, saving approximately $320/year compared to your current separate policies.",
    status: "pending",
    engine: "Grow",
  },
];

export const growStats: GrowStats = {
  totalIdentified: "$8,130/year",
  realized: "$192.00",
  pending: "$7,938/year",
  acceptedCount: 1,
  totalRecommendations: 12,
};
