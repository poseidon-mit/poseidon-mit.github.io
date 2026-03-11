export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "hysa" | "emergency" | "credit" | "retirement" | "brokerage" | "education";
  balance: number;
  apy?: number;
  ytdReturn?: number;
  institution: string;
  beneficiary?: string;
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
  { id: "acc-001", name: "Chase Checking", type: "checking", balance: 24680.5, institution: "Chase" },
  { id: "acc-002", name: "Chase Savings", type: "savings", balance: 18500, apy: 0.01, institution: "Chase" },
  { id: "acc-003", name: "Marcus HYSA", type: "hysa", balance: 35000, apy: 4.5, institution: "Goldman Sachs" },
  { id: "acc-004", name: "Emergency Fund", type: "emergency", balance: 42000, institution: "Goldman Sachs" },
  { id: "acc-005", name: "Amex Platinum", type: "credit", balance: -4892.3, institution: "American Express" },
  { id: "acc-006", name: "Chase Sapphire", type: "credit", balance: -2156.45, institution: "Chase" },
  { id: "acc-007", name: "401(k)", type: "retirement", balance: 485230.18, ytdReturn: 8.2, institution: "Fidelity" },
  { id: "acc-008", name: "Roth IRA", type: "retirement", balance: 128540.92, ytdReturn: 7.8, institution: "Fidelity" },
  { id: "acc-009", name: "Brokerage", type: "brokerage", balance: 92850.67, ytdReturn: 5.4, institution: "Fidelity" },
  { id: "acc-010", name: "529 Plan (Sakura)", type: "education", balance: 45000, institution: "Vanguard", beneficiary: "Sakura" },
  { id: "acc-011", name: "529 Plan (Hana)", type: "education", balance: 38000, institution: "Vanguard", beneficiary: "Hana" },
];

export const accountsSummary: AccountsSummary = {
  netWorth: 902753.52,
  totalAssets: 909802.27,
  totalLiabilities: -7048.75,
  monthlySpending: 20000,
};

export const subscriptions: Subscription[] = [
  { name: "Netflix", amount: 22.99 },
  { name: "Spotify", amount: 16.99 },
  { name: "NYTimes", amount: 17.0, flag: "PRICE_INCREASE" },
  { name: "Amazon Prime", amount: 14.99 },
  { name: "Adobe Creative", amount: 59.99, flag: "DUPLICATE" },
  { name: "iCloud+", amount: 9.99 },
  { name: "YouTube Premium", amount: 22.99 },
  { name: "Equinox", amount: 285.0, flag: "LOW_USAGE" },
];

export const monthlyCategories: MonthlyCategory[] = [
  { name: "Housing", amount: 8500, percentage: 42.5 },
  { name: "Food & Dining", amount: 2890.45, percentage: 14.5 },
  { name: "Transportation", amount: 1200, percentage: 6.0 },
  { name: "Shopping", amount: 1850, percentage: 9.3 },
  { name: "Entertainment", amount: 680, percentage: 3.4 },
  { name: "Healthcare", amount: 450, percentage: 2.3 },
  { name: "Education", amount: 1666.67, percentage: 8.3 },
  { name: "Subscriptions", amount: 449.95, percentage: 2.2 },
  { name: "Savings & Investments", amount: 2000, percentage: 10.0 },
  { name: "Other", amount: 312.93, percentage: 1.6 },
];
