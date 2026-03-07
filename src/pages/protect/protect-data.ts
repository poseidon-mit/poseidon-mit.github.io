/**
 * Protect engine — shared data constants, types, and business logic.
 *
 * Follows the same pattern as execute-data.ts / govern-data.ts.
 * Both Protect.tsx and ProtectAlertDetail.tsx import from here.
 */
import { selectProtectThreats } from '@/domain/poseidon-universe'

/* ── Types ── */
export type ThreatSeverity = "Critical" | "High" | "Medium" | "Low"

/** Map 4-level threat severity to 3-level display severity for SeverityBadge. */
export function toDisplaySeverity(s: ThreatSeverity): 'critical' | 'warning' | 'info' {
  switch (s) {
    case 'Critical': return 'critical'
    case 'High': return 'warning'
    case 'Medium': return 'info'
    case 'Low': return 'info'
  }
}

export interface ThreatRow {
  id: string
  merchant: string
  amount: string
  numericAmount: number
  confidence: number
  severity: ThreatSeverity
  time: string
  sortTime: number
  description: string
}

export interface FactorItem {
  id: string
  title: string
  weight: number
  details: string
  model: string
  mitigating?: boolean
  /** Short-form evidence line for hero display (risk factors only). */
  heroCue?: string
}

export interface DerivedFactor extends FactorItem {
  value: number
}

/* ── Constants ── */
export const DISMISSED_ALERTS_KEY = 'poseidon:dismissed-alerts'
export const MITIGATING_TOTAL = 0.08 // fixed total risk reduction for mitigating factors

/** Derived from canonical universe (single source of truth for Protect threats). */
export const THREATS: ThreatRow[] = selectProtectThreats().map(t => ({
  id: t.id,
  merchant: t.merchant,
  amount: `$${t.amountUsd.toLocaleString()}`,
  numericAmount: t.amountUsd,
  confidence: t.confidence,
  severity: t.severity,
  time: t.relativeTime,
  sortTime: t.sortOrder,
  description: t.description,
}))

export const severityConfig: Record<ThreatSeverity, { color: string; bg: string; border: string; shadow: string; order: number }> = {
  Critical: { color: "var(--state-critical)", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", shadow: "rgba(239,68,68,0.5)", order: 4 },
  High: { color: "var(--state-warning)", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", shadow: "rgba(245,158,11,0.5)", order: 3 },
  Medium: { color: "var(--engine-govern)", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", shadow: "rgba(59,130,246,0.5)", order: 2 },
  Low: { color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", shadow: "rgba(148,163,184,0.5)", order: 1 },
}

export const severityToneColor: Record<ThreatSeverity, string> = {
  Critical: "var(--state-critical)",
  High: "var(--state-warning)",
  Medium: "var(--engine-govern)",
  Low: "#64748B",
}

/* Per-alert timing (aligned with THREATS detection times) */
export const ALERT_TIMING: Record<string, { detected: string; updated: string; times: string[] }> = {
  'THR-001': { detected: '2026-03-19T10:30:00-04:00', updated: '2026-03-19T10:32:00-04:00', times: ['10:30', '10:31', '10:32', '10:33'] },
  'THR-002': { detected: '2026-03-18T09:15:00-04:00', updated: '2026-03-18T09:17:00-04:00', times: ['09:15', '09:16', '09:17', '09:18'] },
  'THR-003': { detected: '2026-03-16T16:42:00-04:00', updated: '2026-03-16T16:44:00-04:00', times: ['16:42', '16:43', '16:44', '16:45'] },
  'THR-004': { detected: '2026-03-12T11:08:00-04:00', updated: '2026-03-12T11:10:00-04:00', times: ['11:08', '11:09', '11:10', '11:11'] },
  'THR-005': { detected: '2026-03-14T22:17:00-04:00', updated: '2026-03-14T22:19:00-04:00', times: ['22:17', '22:18', '22:19', '22:20'] },
}
export const DEFAULT_TIMING = { detected: '2026-03-19T14:28:00-04:00', updated: '2026-03-19T14:30:00-04:00', times: ['14:28', '14:29', '14:30', '14:31'] }

/* Per-alert factor items — weights and descriptions reflect each signal's context */
export const ALERT_FACTOR_ITEMS: Record<string, FactorItem[]> = {
  /* ── THR-001: TechElectro Store, $2,847, Critical ── */
  'THR-001': [
    { id: "e1", title: "Unusual Spending", weight: 0.95,
      heroCue: "Amount 3.2\u00d7 your category mean",
      details: "Transaction amount $2,847 is 3.2\u00d7 your 180-day electronics category mean of $890. Percentile rank: 99.1. Prior max in category: $1,340.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.82,
      heroCue: "3 transactions in 2-hour burst",
      details: "3 transactions detected within a 2-hour window. Your 180-day baseline: 1.2 transactions/day. Burst frequency exceeds 97th percentile of your historical pattern.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.88,
      heroCue: "Cross-account drawdown absent from history",
      details: "$2,847 external transfer from checking preceded by $3,100 savings drawdown 48 hours prior. Cross-account flow pattern absent from your 24-month transaction history.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.85,
      heroCue: "Merchant dispute rate 2.4\u00d7 average",
      details: "TechElectro Store dispute rate: 4.1% (platform electronics category average: 1.7%). Ratio: 2.4\u00d7. First transaction with this merchant. Merchant active on platform for 3 months.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.90,
      heroCue: "Matches 847 confirmed fraud cases (0.93 similarity)",
      details: "Transaction feature vector matches 847 confirmed fraud cases across Poseidon platform. Similarity score: 0.93. Matched features: amount range, category, and temporal pattern.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.55,
      details: "Account age: 5.2 years. Monthly transaction consistency: 94%. Prior disputes: 0. Stability index: 0.97 (top 3% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.45,
      details: "Electronics category present in 14 of last 24 months. Category spend frequency rank: 3rd. Merchant is new but category familiarity score: 0.82.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-002: Unknown Vendor, $1,200, High ── */
  'THR-002': [
    { id: "e1", title: "Unusual Spending", weight: 0.60,
      heroCue: "Amount 1.8\u00d7 your spending mean",
      details: "Transaction amount $1,200 is 1.8\u00d7 your 180-day general spending mean of $670. Percentile rank: 88.3. Amount moderate but vendor is unrecognized.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.78,
      heroCue: "Transaction at 02:47 AM (2.1% of your activity)",
      details: "Transaction at 02:47 AM local time. Your 180-day active window: 07:00\u201323:00. Only 2.1% of your transactions occur between 00:00\u201306:00.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.72,
      heroCue: "Zero prior outflows to unrecognized vendors",
      details: "$1,200 debit to entity with no prior relationship. Zero outflows to unrecognized vendors in 12-month account history. Single-transaction outflow anomaly.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.95,
      heroCue: "Vendor not in any known merchant directory",
      details: "Vendor not found in any known merchant directory. Zero transaction history across Poseidon platform. Merchant category code: unlisted. Age on platform: <30 days.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.85,
      heroCue: "Matches 523 confirmed fraud cases (0.89 similarity)",
      details: "Unrecognized vendor + after-hours timing pattern matches 523 confirmed fraud cases. Similarity score: 0.89. Matched features: vendor type, timing, and amount range.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.60,
      details: "Account age: 3.8 years. Monthly transaction consistency: 91%. Prior disputes: 0. Stability index: 0.94 (top 6% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.30,
      details: "Vendor category is unclassified. No prior transactions to unclassified merchants in 24-month history. Category familiarity score: 0.12.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-003: Travel Agency XYZ, $3,400, Medium ── */
  'THR-003': [
    { id: "e1", title: "Unusual Spending", weight: 0.70,
      heroCue: "Amount 2.1\u00d7 your travel category mean",
      details: "Transaction amount $3,400 is 2.1\u00d7 your 180-day travel category mean of $1,620. Percentile rank: 93.4. Prior max in travel category: $2,200.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.45,
      heroCue: "Minor cadence deviation for this category",
      details: "Transaction at 11:23 AM on weekday. Within normal active hours. No significant temporal anomaly. Minor deviation from typical purchase cadence for this category.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.65,
      heroCue: "Amount 3.5\u00d7 your international transfer mean",
      details: "$3,400 international wire transfer. 2 prior international transfers in 24-month history (average: $980). Amount is 3.5\u00d7 your prior international transfer mean.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.60,
      heroCue: "Agency dispute rate 1.3\u00d7 category average",
      details: "Travel Agency XYZ dispute rate: 2.8% (platform travel category average: 2.1%). Ratio: 1.3\u00d7. First transaction with this agency. Agency active on platform for 8 months.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.55,
      heroCue: "Matches 312 confirmed fraud cases (0.71 similarity)",
      details: "International wire + new travel vendor pattern matches 312 confirmed fraud cases. Similarity score: 0.71. Matched features: transfer type and amount range.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.65,
      details: "Account age: 7.1 years. Monthly transaction consistency: 96%. Prior disputes: 0. Stability index: 0.98 (top 2% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.55,
      details: "Travel category present in 8 of last 24 months. Category spend frequency rank: 5th. International travel sub-category familiarity score: 0.58.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-004: Gas Station ATM, $800, Low ── */
  'THR-004': [
    { id: "e1", title: "Unusual Spending", weight: 0.50,
      heroCue: "Amount 3.6\u00d7 your ATM withdrawal average",
      details: "ATM withdrawal $800. Your 180-day ATM withdrawal mean: $220. Percentile rank: 91.2. Prior max ATM withdrawal: $500. Amount is 3.6\u00d7 above your ATM average.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.40,
      heroCue: "After-hours withdrawal (73% of ATM use is daytime)",
      details: "Withdrawal at 10:14 PM local time. 73% of your ATM usage occurs between 09:00\u201318:00. After-hours ATM withdrawal frequency: 4 in 12-month history.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.35,
      heroCue: "Cash-then-spend pattern absent from history",
      details: "$800 cash withdrawal followed by $340 point-of-sale purchase 20 minutes later. Rapid cash-then-spend pattern not present in your 12-month transaction history.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.45,
      heroCue: "ATM skimming report rate 3.0\u00d7 average",
      details: "Gas Station ATM skimming report rate: 1.8% (platform ATM average: 0.6%). Ratio: 3.0\u00d7. First withdrawal at this location. ATM operator flagged in 2 prior platform incidents.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.50,
      heroCue: "Matches 142 card-skimming cases (0.64 similarity)",
      details: "High-amount ATM withdrawal at flagged location pattern matches 142 confirmed card-skimming cases. Similarity score: 0.64. Matched features: amount, location risk, and timing.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.70,
      details: "Account age: 6.3 years. Monthly transaction consistency: 95%. Prior disputes: 0. Stability index: 0.98 (top 2% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.65,
      details: "ATM withdrawal category present in 18 of last 24 months. Category spend frequency rank: 4th. Gas station merchants used 6 times prior. Familiarity score: 0.74.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-005: Crypto Exchange, $5,000, Medium ── */
  'THR-005': [
    { id: "e1", title: "New Category Detected", weight: 0.85,
      heroCue: "First-time category — no spending baseline exists",
      details: "Transaction amount $5,000 to a new merchant category (digital assets). No 180-day baseline exists for this category. Amount exceeds your median transaction by 4.7\u00d7. Flagged due to novelty, not category risk.",
      model: "IsoForest-SpendAnomaly v4.1" },
    { id: "e2", title: "Unusual Timing", weight: 0.55,
      heroCue: "Late-night transaction (8.3% of your activity)",
      details: "Transaction at 11:42 PM local time. Within active hours but upper boundary. 8.3% of your transactions occur between 23:00\u201300:00.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Unusual Account Activity", weight: 0.80,
      heroCue: "First-time outflow to a new platform category",
      details: "$5,000 transfer to a digital asset platform. No prior outflows to this merchant category in 24-month history. Represents 12.4% of checking account balance. Flagged because new-category + large-amount is a common pattern in first-time fraud, though many legitimate first purchases share this profile.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Merchant Reputation", weight: 0.75,
      heroCue: "Exchange dispute rate 3.0\u00d7 platform average",
      details: "This exchange's dispute rate is 5.7% (platform average: 1.9%, ratio: 3.0\u00d7). Elevated dispute rates are common for new asset-class platforms and do not necessarily indicate fraud. First transaction with this exchange. Exchange active on platform for 6 months.",
      model: "XGB-MerchantRisk v2.3" },
    { id: "e5", title: "Pattern Match", weight: 0.92,
      heroCue: "First-time category + high amount matches 691 flagged cases",
      details: "The combination of first-time category and high amount matches 691 previously flagged cases (0.91 similarity). Matched features: new category, transaction size, and merchant dispute rate. Note: this pattern is driven by novelty and amount, not by the specific asset class.",
      model: "GBM-PlatformFraud v3.0" },
    { id: "m1", title: "Account History", weight: 0.55,
      details: "Account age: 4.5 years. Monthly transaction consistency: 92%. Prior disputes: 0. Stability index: 0.95 (top 5% of cohort). No prior fraud flags.",
      model: "AE-AccountStability v2.0", mitigating: true },
    { id: "m2", title: "Familiar Category", weight: 0.25,
      details: "Cryptocurrency category: 0 occurrences in 24-month history. No prior digital asset transactions. Category familiarity score: 0.04.",
      model: "BayesNet-CatFamiliar v1.8", mitigating: true },
  ],
}
export const DEFAULT_FACTOR_ITEMS = ALERT_FACTOR_ITEMS['THR-001']

/* ── Risk sidebar data ── */
export const riskBreakdown = [
  { label: "Transaction fraud", pct: 45, color: "var(--state-critical)" },
  { label: "Merchant risk", pct: 25, color: "var(--state-warning)" },
  { label: "Geo anomaly", pct: 20, color: "var(--engine-govern)" },
  { label: "Velocity", pct: 10, color: "#64748B" },
]

/* ── Business Logic ── */

/** Derive contribution values — adjusts largest risk item to guarantee sum === confidence */
export function deriveFactors(items: FactorItem[], confidence: number): DerivedFactor[] {
  const positiveTarget = confidence + MITIGATING_TOTAL
  const riskItems = items.filter(i => !i.mitigating)
  const safeItems = items.filter(i => i.mitigating)
  const riskWeightSum = riskItems.reduce((s, i) => s + i.weight, 0)
  const safeWeightSum = safeItems.reduce((s, i) => s + i.weight, 0)

  const derived: DerivedFactor[] = items.map(item => {
    if (item.mitigating) {
      return { ...item, value: -Math.round((item.weight / safeWeightSum) * MITIGATING_TOTAL * 100) / 100 }
    }
    return { ...item, value: Math.round((item.weight / riskWeightSum) * positiveTarget * 100) / 100 }
  })

  // Fix rounding: adjust highest-weight risk item so sum equals confidence exactly
  const total = Math.round(derived.reduce((s, d) => s + d.value, 0) * 100) / 100
  const diff = Math.round((confidence - total) * 100) / 100
  if (diff !== 0) {
    const maxRisk = derived.reduce((best, d) => !d.mitigating && d.value > (best?.value ?? 0) ? d : best, null as DerivedFactor | null)
    if (maxRisk) maxRisk.value = Math.round((maxRisk.value + diff) * 100) / 100
  }

  return derived
}
