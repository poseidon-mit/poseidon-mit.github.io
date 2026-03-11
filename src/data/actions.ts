export interface ActionDriver {
  label: string;
  value: number;
}

export interface Action {
  id: string;
  title: string;
  taxSavings?: number;
  amount?: number;
  deadline?: string;
  confidence?: number;
  account?: string;
  description: string;
  drivers?: ActionDriver[];
  status: "pending" | "completed" | "cancelled";
  recurring?: boolean;
}

export interface ExecuteStats {
  pending: number;
  completedThisMonth: number;
  totalExecuted: string;
  automationRate: string;
}

export const actions: Action[] = [
  {
    id: "EXE-001",
    title: "Tax-Loss Harvest VTI — Sell 120 Shares",
    taxSavings: 1443.2,
    deadline: "Mar 31, 2026",
    confidence: 0.87,
    account: "Brokerage",
    description: "Sell 120 shares of VTI at current loss to harvest $4,810.67 in losses",
    drivers: [
      { label: "Tax Savings Impact", value: 0.35 },
      { label: "Market Timing", value: 0.25 },
      { label: "Portfolio Balance", value: 0.22 },
      { label: "Wash Sale Risk", value: 0.18 },
    ],
    status: "pending",
  },
  {
    id: "EXE-002",
    title: "Monthly Transfer $2,000 to Marcus HYSA",
    amount: 2000,
    description: "Automated monthly transfer from Chase Checking to Marcus HYSA",
    status: "pending",
    recurring: true,
  },
  {
    id: "EXE-003",
    title: "529 Contribution $1,666.67",
    amount: 1666.67,
    description: "Monthly 529 contribution split between Sakura and Hana accounts",
    status: "completed",
  },
  {
    id: "EXE-004",
    title: "Adobe Duplicate Refund Dispute $59.99",
    amount: 59.99,
    description: "File dispute for duplicate Adobe Creative Cloud charge on Chase Sapphire",
    status: "pending",
  },
];

export const executeStats: ExecuteStats = {
  pending: 3,
  completedThisMonth: 7,
  totalExecuted: "$42,847.32",
  automationRate: "45%",
};
