export interface ThreatDriver {
  label: string;
  value: number;
}

export interface Threat {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  confidence: number;
  account: string;
  device?: string;
  location?: string;
  timestamp: string;
  ip?: string;
  merchant: string | null;
  amount: number | null;
  description?: string;
  drivers?: ThreatDriver[];
  status: "pending" | "dismissed" | "resolved";
}

export interface ProtectStats {
  transactionsMonitored: number;
  threatsDetected: number;
  threatsBlocked: number;
  potentialLossPrevented: string;
}

export const threats: Threat[] = [
  {
    id: "THR-001",
    title: "Unusual Login from Oslo",
    severity: "high",
    confidence: 0.94,
    account: "Chase Checking",
    device: "Windows 11 Chrome 122.0",
    location: "Oslo, Norway",
    timestamp: "Mar 10, 3:42 AM",
    ip: "185.147.xx.xx",
    merchant: null,
    amount: null,
    drivers: [
      { label: "Geographic Anomaly", value: 0.35 },
      { label: "Device Fingerprint", value: 0.28 },
      { label: "Time Pattern", value: 0.18 },
      { label: "Velocity Check", value: 0.13 },
    ],
    status: "pending",
  },
  {
    id: "THR-002",
    title: "Oslo Electronics Purchase $234.50",
    severity: "high",
    confidence: 0.91,
    account: "Amex Gold",
    device: "Windows 11 Chrome 122.0",
    location: "Oslo, Norway",
    timestamp: "Mar 10, 3:47 AM",
    ip: undefined,
    merchant: "Oslo Electronics AS",
    amount: 234.50,
    drivers: [
      { label: "Geographic Anomaly", value: 0.32 },
      { label: "Merchant Category", value: 0.25 },
      { label: "Amount Pattern", value: 0.20 },
      { label: "Velocity Check", value: 0.14 },
    ],
    status: "pending",
  },
  {
    id: "THR-003",
    title: "NYTimes Price Increase +$5/mo",
    severity: "medium",
    confidence: 0.88,
    account: "Chase Checking",
    timestamp: "Mar 8",
    merchant: null,
    amount: null,
    description: "Subscription price increased from $12.00 to $17.00/mo without notification",
    status: "pending",
  },
  {
    id: "THR-004",
    title: "Adobe Duplicate Charge $59.99",
    severity: "medium",
    confidence: 0.92,
    account: "Chase Sapphire",
    timestamp: "Mar 5",
    merchant: null,
    amount: null,
    description: "Duplicate charge detected for Adobe Creative Cloud",
    status: "pending",
  },
  {
    id: "THR-005",
    title: "Fidelity Password Changed",
    severity: "low",
    confidence: 0.72,
    account: "Fidelity 401(k)",
    timestamp: "Mar 3",
    merchant: null,
    amount: null,
    description: "Password change detected from recognized device",
    status: "dismissed",
  },
  {
    id: "THR-006",
    title: "Wire Transfer to Unfamiliar Recipient",
    severity: "high",
    confidence: 0.93,
    account: "Chase Checking",
    device: "macOS 15 Safari 19.3",
    location: "Boston, MA",
    timestamp: "Mar 11, 10:15 AM",
    ip: "72.93.xx.xx",
    merchant: null,
    amount: 15000,
    description: "Wire transfer of $15,000 initiated to a recipient not in your payee history. The receiving account was opened less than 30 days ago at an online-only bank.",
    drivers: [
      { label: "New Recipient", value: 0.38 },
      { label: "Amount Anomaly", value: 0.28 },
      { label: "Recipient Account Age", value: 0.20 },
      { label: "Transaction Velocity", value: 0.14 },
    ],
    status: "pending",
  },
  {
    id: "THR-007",
    title: "New Payee Added from Unknown Device",
    severity: "high",
    confidence: 0.89,
    account: "Chase Savings",
    device: "Android 15 Chrome 124.0",
    location: "Newark, NJ",
    timestamp: "Mar 10, 8:32 PM",
    ip: "104.28.xx.xx",
    merchant: null,
    amount: 2500,
    description: "A new payee was added and a $2,500 transfer initiated from a device not previously associated with your account. Device fingerprint does not match any known sessions.",
    drivers: [
      { label: "Unknown Device", value: 0.40 },
      { label: "New Payee + Transfer", value: 0.30 },
      { label: "Geographic Mismatch", value: 0.18 },
      { label: "Time Pattern", value: 0.12 },
    ],
    status: "pending",
  },
  {
    id: "THR-008",
    title: "Credit Limit Increase Request",
    severity: "medium",
    confidence: 0.78,
    account: "Amex Gold",
    device: "iOS 19.3 Safari",
    location: "Cambridge, MA",
    timestamp: "Mar 9, 2:18 PM",
    ip: "73.114.xx.xx",
    merchant: null,
    amount: 10000,
    description: "A credit limit increase of $10,000 was requested on your Amex Gold card. The request originated from a recognized device but deviates from your typical account management behavior.",
    drivers: [
      { label: "Behavioral Deviation", value: 0.35 },
      { label: "Amount Significance", value: 0.30 },
      { label: "Request Frequency", value: 0.20 },
      { label: "Account Age Factor", value: 0.15 },
    ],
    status: "pending",
  },
  {
    id: "THR-009",
    title: "Unusual ATM Withdrawal Pattern",
    severity: "medium",
    confidence: 0.82,
    account: "Chase Checking",
    device: undefined,
    location: "Somerville, MA",
    timestamp: "Mar 7, 11:45 PM",
    ip: undefined,
    merchant: "Chase ATM #4471",
    amount: 1800,
    description: "Three ATM withdrawals totaling $1,800 within a 2-hour window at different locations. This pattern is inconsistent with your typical cash withdrawal behavior.",
    drivers: [
      { label: "Withdrawal Frequency", value: 0.38 },
      { label: "Total Amount", value: 0.28 },
      { label: "Time of Day", value: 0.20 },
      { label: "Multi-Location", value: 0.14 },
    ],
    status: "resolved",
  },
  {
    id: "THR-010",
    title: "Dark Web Email Detection",
    severity: "low",
    confidence: 0.68,
    account: "All Accounts",
    device: undefined,
    location: undefined,
    timestamp: "Mar 6, 9:00 AM",
    ip: undefined,
    merchant: null,
    amount: null,
    description: "Your primary email address was found in a data breach dump on the dark web. No financial credentials were exposed, but password reuse could pose a risk.",
    drivers: [
      { label: "Breach Recency", value: 0.35 },
      { label: "Data Sensitivity", value: 0.30 },
      { label: "Password Reuse Risk", value: 0.25 },
      { label: "Account Exposure", value: 0.10 },
    ],
    status: "resolved",
  },
];

export const protectStats: ProtectStats = {
  transactionsMonitored: 1247,
  threatsDetected: 10,
  threatsBlocked: 3,
  potentialLossPrevented: "$16,860",
};
