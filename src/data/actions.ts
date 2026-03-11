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
  pendingTaxSavings: number;
}

export const actions: Action[] = [
  {
    id: "EXE-001",
    title: "Tax-Loss Harvest VTI — Sell 120 Shares",
    taxSavings: 399.60,
    deadline: "Mar 31, 2026",
    confidence: 0.87,
    account: "Individual Brokerage",
    description: "Sell 120 shares of VTI at current loss to harvest $1,200 in losses. Tax benefit: $399.60 (Federal $288.00 + State CA $111.60).",
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
    title: "Monthly Transfer $500 to Savings",
    amount: 500,
    description: "Automated monthly transfer from Chase Checking to Chase Savings",
    status: "pending",
    recurring: true,
  },
  {
    id: "EXE-003",
    title: "Dividend Reinvestment $847.32",
    amount: 847.32,
    description: "Reinvest dividends from Individual Brokerage into VXUS",
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
  completedThisMonth: 1,
  totalExecuted: "$342.18",
  pendingTaxSavings: 399.60,
};
