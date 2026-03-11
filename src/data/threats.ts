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
];

export const protectStats: ProtectStats = {
  transactionsMonitored: 1247,
  threatsDetected: 5,
  threatsBlocked: 2,
  potentialLossPrevented: "$294.48",
};
