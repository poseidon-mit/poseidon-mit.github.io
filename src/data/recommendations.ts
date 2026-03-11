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
  acceptanceRate: string;
}

export const recommendations: Recommendation[] = [
  {
    id: "GRW-001",
    title: "Move $18,500 to High-Yield Savings",
    benefit: "$831/year in interest",
    description:
      "Your Chase Savings earns 0.01% APY. Moving to Marcus HYSA at 4.5% APY would earn significantly more.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-002",
    title: "Maximize 529 Contributions +$500/child/mo",
    benefit: "$600/year in tax deductions",
    description:
      "Increasing 529 contributions by $500/month per child maximizes state tax deduction.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-003",
    title: "Review Equinox Membership $285/mo",
    savings: "$1,320/year",
    description:
      "You've visited Equinox only 2 times in the last 3 months. Consider downgrading or canceling.",
    status: "pending",
    engine: "Grow",
  },
  {
    id: "GRW-004",
    title: "Tax-Loss Harvest VTI Position",
    savings: "$1,065.60 in tax savings",
    description:
      "Your VTI position shows unrealized losses. Harvesting could offset capital gains.",
    status: "approved",
    engine: "Grow",
  },
];

export const growStats: GrowStats = {
  totalIdentified: "$3,601/year",
  realized: "$1,065.60",
  pending: "$2,536.08",
  acceptanceRate: "67%",
};
