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
  {
    id: "EXE-005",
    title: "Roth IRA Contribution",
    amount: 7000,
    deadline: "Apr 15, 2026",
    confidence: 0.91,
    account: "Fidelity Roth IRA",
    description: "Contribute $7,000 (2025 max) to Fidelity Roth IRA via backdoor conversion. Funds will be allocated to target-date index fund based on current portfolio strategy.",
    drivers: [
      { label: "Tax-Free Growth", value: 0.40 },
      { label: "Contribution Deadline", value: 0.30 },
      { label: "Retirement Goal Alignment", value: 0.20 },
      { label: "Market Conditions", value: 0.10 },
    ],
    status: "pending",
  },
  {
    id: "EXE-006",
    title: "Rebalance 401(k) Allocation",
    amount: 45230,
    deadline: "Mar 31, 2026",
    confidence: 0.85,
    account: "Fidelity 401(k)",
    description: "Rebalance $45,230 in 401(k) holdings from 80/20 to 70/30 stock-to-bond ratio. Current allocation has drifted 12% from target due to recent equity gains.",
    drivers: [
      { label: "Drift from Target", value: 0.35 },
      { label: "Risk Reduction", value: 0.30 },
      { label: "Market Valuation", value: 0.20 },
      { label: "Time Horizon", value: 0.15 },
    ],
    status: "pending",
  },
  {
    id: "EXE-007",
    title: "Emergency Fund Auto-Save $200/mo",
    amount: 200,
    confidence: 0.88,
    account: "Chase Savings",
    description: "Set up automated monthly transfer of $200 from Chase Checking to Chase Savings for emergency fund. Current emergency fund covers 2.1 months; target is 6 months.",
    drivers: [
      { label: "Emergency Fund Gap", value: 0.40 },
      { label: "Cash Flow Analysis", value: 0.30 },
      { label: "Savings Rate Impact", value: 0.20 },
      { label: "Income Stability", value: 0.10 },
    ],
    status: "pending",
    recurring: true,
  },
  {
    id: "EXE-008",
    title: "Dispute Amex Annual Fee $250",
    amount: 250,
    deadline: "Mar 20, 2026",
    confidence: 0.76,
    account: "Amex Gold",
    description: "Request waiver or reduction of $250 annual fee on Amex Gold card. Based on your spending history and retention offer patterns, there is a 76% chance of a partial or full waiver.",
    drivers: [
      { label: "Retention Offer Probability", value: 0.35 },
      { label: "Account Tenure", value: 0.25 },
      { label: "Spending Volume", value: 0.25 },
      { label: "Competitive Offers", value: 0.15 },
    ],
    status: "pending",
  },
  {
    id: "EXE-009",
    title: "Insurance Premium Comparison $240/yr",
    amount: 240,
    confidence: 0.90,
    account: "Home Insurance",
    description: "Completed comparison of home insurance premiums across 5 providers. Switched to bundled policy saving $240/year with equivalent coverage and lower deductible.",
    drivers: [
      { label: "Premium Savings", value: 0.40 },
      { label: "Coverage Equivalence", value: 0.30 },
      { label: "Provider Rating", value: 0.20 },
      { label: "Deductible Improvement", value: 0.10 },
    ],
    status: "completed",
  },
  {
    id: "EXE-010",
    title: "Increase 401(k) Rate to 10%",
    amount: 3600,
    confidence: 0.92,
    account: "Fidelity 401(k)",
    description: "Increased 401(k) contribution rate from 6% to 10% to capture full employer match. Additional $3,600/year in contributions with $1,800/year in employer match.",
    drivers: [
      { label: "Employer Match Capture", value: 0.45 },
      { label: "Tax Reduction", value: 0.25 },
      { label: "Retirement Gap Analysis", value: 0.20 },
      { label: "Cash Flow Feasibility", value: 0.10 },
    ],
    status: "completed",
  },
];

export const executeStats: ExecuteStats = {
  pending: 7,
  completedThisMonth: 3,
  totalExecuted: "$4,182.18",
  pendingTaxSavings: 399.60,
};
