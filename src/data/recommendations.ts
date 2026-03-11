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
];

export const growStats: GrowStats = {
  totalIdentified: "$2,437/year",
  realized: "$192.00",
  pending: "$2,245/year",
  acceptedCount: 1,
  totalRecommendations: 4,
};
