export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "retirement" | "brokerage";
  balance: number;
  apy?: number;
  ytdReturn?: number;
  institution: string;
}

export interface Subscription {
  name: string;
  amount: number;
  flag?: "PRICE_INCREASE" | "DUPLICATE" | "LOW_USAGE";
}

export interface MonthlyCategory {
  name: string;
  amount: number;
  percentage: number;
}

export interface AccountsSummary {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  monthlySpending: number;
}

export const accounts: Account[] = [
  { id: "acc-001", name: "Chase Checking", type: "checking", balance: 12450.32, institution: "Chase" },
  { id: "acc-002", name: "Chase Savings", type: "savings", balance: 8200.00, apy: 0.01, institution: "Chase" },
  { id: "acc-005", name: "Amex Gold", type: "credit", balance: -2340.87, institution: "American Express" },
  { id: "acc-006", name: "Chase Sapphire", type: "credit", balance: -890.45, institution: "Chase" },
  { id: "acc-007", name: "401(k)", type: "retirement", balance: 45230.18, ytdReturn: 8.2, institution: "Fidelity" },
  { id: "acc-008", name: "Roth IRA", type: "retirement", balance: 18540.92, ytdReturn: 7.8, institution: "Fidelity" },
  { id: "acc-009", name: "Individual Brokerage", type: "brokerage", balance: 12850.67, ytdReturn: 5.4, institution: "Fidelity" },
];

export const accountsSummary: AccountsSummary = {
  netWorth: 94040.77,
  totalAssets: 97272.09,
  totalLiabilities: -3231.32,
  monthlySpending: 6500,
};

export const subscriptions: Subscription[] = [
  { name: "Netflix", amount: 22.99 },
  { name: "Spotify", amount: 16.99 },
  { name: "NYTimes", amount: 17.00, flag: "PRICE_INCREASE" },
  { name: "Amazon Prime", amount: 14.99 },
  { name: "Adobe Creative", amount: 59.99, flag: "DUPLICATE" },
  { name: "iCloud+", amount: 9.99 },
  { name: "YouTube Premium", amount: 22.99 },
  { name: "Notion", amount: 18.00 },
];

export interface RecentTransaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  icon: string;
}

export const recentTransactions: RecentTransaction[] = [
  { id: "txn-001", merchant: "Whole Foods Market", amount: -87.32, date: "2026-03-10", icon: "shopping-cart" },
  { id: "txn-002", merchant: "Blue Bottle Coffee", amount: -6.50, date: "2026-03-10", icon: "coffee" },
  { id: "txn-003", merchant: "Equinox", amount: -189.00, date: "2026-03-09", icon: "dumbbell" },
  { id: "txn-004", merchant: "Payroll Deposit", amount: 6923.08, date: "2026-03-07", icon: "banknote" },
  { id: "txn-005", merchant: "Netflix", amount: -22.99, date: "2026-03-05", icon: "film" },
];

export const monthlyCategories: MonthlyCategory[] = [
  { name: "Housing", amount: 2400, percentage: 36.9 },
  { name: "Food & Dining", amount: 1200, percentage: 18.5 },
  { name: "Transportation", amount: 600, percentage: 9.2 },
  { name: "Shopping", amount: 500, percentage: 7.7 },
  { name: "Entertainment", amount: 300, percentage: 4.6 },
  { name: "Healthcare", amount: 250, percentage: 3.8 },
  { name: "Subscriptions", amount: 182.94, percentage: 2.8 },
  { name: "Savings & Investments", amount: 800, percentage: 12.3 },
  { name: "Other", amount: 267.06, percentage: 4.1 },
];
