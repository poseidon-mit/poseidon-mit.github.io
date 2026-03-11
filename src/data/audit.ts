export interface AuditRecord {
  id: string;
  timestamp: string;
  engine: "Protect" | "Grow" | "Execute" | "Govern";
  action: string;
  model: string;
  confidence: number;
  processingMs: number;
  status: "pending" | "completed" | "rejected";
}

export interface GovernStats {
  totalRecords: number;
  thisMonth: number;
  avgProcessing: string;
  modelAccuracy: string;
  userOverrides: string;
}

export const auditRecords: AuditRecord[] = [
  {
    id: "AUD-2026-0310-001",
    timestamp: "2026-03-10T03:42:00Z",
    engine: "Protect",
    action: "Threat Detection — Oslo Login Anomaly",
    model: "POSEIDON-THREATDETECT V1.0",
    confidence: 0.94,
    processingMs: 234,
    status: "pending",
  },
  {
    id: "AUD-2026-0310-002",
    timestamp: "2026-03-10T03:47:00Z",
    engine: "Protect",
    action: "Threat Detection — Oslo Electronics Purchase",
    model: "POSEIDON-THREATDETECT V1.0",
    confidence: 0.91,
    processingMs: 187,
    status: "pending",
  },
  {
    id: "AUD-2026-0311-003",
    timestamp: "2026-03-11T14:30:00Z",
    engine: "Grow",
    action: "Recommendation — HYSA Transfer",
    model: "POSEIDON-OPTIMIZER V2.1",
    confidence: 0.89,
    processingMs: 456,
    status: "pending",
  },
  {
    id: "AUD-2026-0310-004",
    timestamp: "2026-03-10T09:15:00Z",
    engine: "Execute",
    action: "Tax-Loss Harvest Approval Request",
    model: "POSEIDON-EXECUTOR V1.3",
    confidence: 0.87,
    processingMs: 312,
    status: "pending",
  },
  {
    id: "AUD-2026-0309-005",
    timestamp: "2026-03-09T16:45:00Z",
    engine: "Grow",
    action: "Subscription Optimization — Equinox",
    model: "POSEIDON-OPTIMIZER V2.1",
    confidence: 0.85,
    processingMs: 523,
    status: "pending",
  },
  {
    id: "AUD-2026-0308-006",
    timestamp: "2026-03-08T11:20:00Z",
    engine: "Execute",
    action: "529 Contribution Executed",
    model: "POSEIDON-EXECUTOR V1.3",
    confidence: 0.92,
    processingMs: 198,
    status: "completed",
  },
  {
    id: "AUD-2026-0311-007",
    timestamp: "2026-03-11T10:15:00Z",
    engine: "Protect",
    action: "Threat Detection — Wire Transfer to Unfamiliar Recipient",
    model: "POSEIDON-THREATDETECT V1.0",
    confidence: 0.93,
    processingMs: 210,
    status: "pending",
  },
  {
    id: "AUD-2026-0310-008",
    timestamp: "2026-03-10T20:32:00Z",
    engine: "Protect",
    action: "Threat Detection — New Payee from Unknown Device",
    model: "POSEIDON-THREATDETECT V1.0",
    confidence: 0.89,
    processingMs: 178,
    status: "pending",
  },
  {
    id: "AUD-2026-0311-009",
    timestamp: "2026-03-11T14:45:00Z",
    engine: "Grow",
    action: "Recommendation — Refinance Auto Loan",
    model: "POSEIDON-OPTIMIZER V2.1",
    confidence: 0.87,
    processingMs: 412,
    status: "pending",
  },
  {
    id: "AUD-2026-0311-010",
    timestamp: "2026-03-11T15:00:00Z",
    engine: "Grow",
    action: "Recommendation — Increase 401(k) Contribution",
    model: "POSEIDON-OPTIMIZER V2.1",
    confidence: 0.91,
    processingMs: 389,
    status: "pending",
  },
  {
    id: "AUD-2026-0311-011",
    timestamp: "2026-03-11T09:30:00Z",
    engine: "Execute",
    action: "Roth IRA Contribution Queued",
    model: "POSEIDON-EXECUTOR V1.3",
    confidence: 0.91,
    processingMs: 267,
    status: "pending",
  },
  {
    id: "AUD-2026-0310-012",
    timestamp: "2026-03-10T16:20:00Z",
    engine: "Execute",
    action: "Insurance Premium Comparison Completed",
    model: "POSEIDON-EXECUTOR V1.3",
    confidence: 0.90,
    processingMs: 534,
    status: "completed",
  },
  {
    id: "AUD-2026-0309-013",
    timestamp: "2026-03-09T11:10:00Z",
    engine: "Execute",
    action: "401(k) Rate Increase Executed",
    model: "POSEIDON-EXECUTOR V1.3",
    confidence: 0.92,
    processingMs: 145,
    status: "completed",
  },
  {
    id: "AUD-2026-0307-014",
    timestamp: "2026-03-07T23:45:00Z",
    engine: "Protect",
    action: "Threat Detection — Unusual ATM Withdrawal Pattern",
    model: "POSEIDON-THREATDETECT V1.0",
    confidence: 0.82,
    processingMs: 196,
    status: "completed",
  },
  {
    id: "AUD-2026-0306-015",
    timestamp: "2026-03-06T09:00:00Z",
    engine: "Protect",
    action: "Threat Detection — Dark Web Email Exposure",
    model: "POSEIDON-DARKWEB V1.0",
    confidence: 0.68,
    processingMs: 1240,
    status: "completed",
  },
];

export const governStats: GovernStats = {
  totalRecords: 2856,
  thisMonth: 351,
  avgProcessing: "418ms",
  modelAccuracy: "97.2%",
  userOverrides: "8 of 100",
};
