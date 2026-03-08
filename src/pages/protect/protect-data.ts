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
  counterparty: string
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
  counterparty: t.counterparty,
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
  /* ── THR-001: Cayman Reef Holdings Ltd., $2,500,000, Critical ── */
  'THR-001': [
    { id: "e1", title: "AML Pattern Match", weight: 0.95,
      heroCue: "Wire amount 4.2× client's offshore transfer baseline",
      details: "$2,500,000 wire to new offshore counterparty exceeds client's 24-month offshore transfer mean of $595K by 4.2×. Percentile rank: 99.4 against peer cohort. Triggers enhanced due diligence under BSA/AML §314(b).",
      model: "IsoForest-AMLAnomaly v4.1" },
    { id: "e2", title: "Timing Anomaly", weight: 0.82,
      heroCue: "Urgent same-day settlement request outside normal cadence",
      details: "Same-day settlement requested for wire exceeding $500K threshold. Client's 24-month history shows 0 same-day settlement requests for amounts above $200K. Urgency pattern flagged by temporal sequence model.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Cross-Account Flow", weight: 0.88,
      heroCue: "Liquidation pattern across 3 accounts precedes wire",
      details: "$2.5M wire preceded by $1.8M securities liquidation and $700K money market redemption across 3 accounts within 72 hours. Cross-account flow pattern absent from client's 36-month transaction history.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Counterparty Risk", weight: 0.85,
      heroCue: "Counterparty registered <90 days, jurisdiction risk elevated",
      details: "Cayman Reef Holdings Ltd. incorporated 67 days ago. Jurisdiction risk score: 7.2/10 (Cayman Islands). No prior relationship with Acme Bank. Beneficial ownership structure requires manual verification.",
      model: "XGB-CounterpartyRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.90,
      heroCue: "Matches 847 confirmed AML cases (0.93 similarity)",
      details: "Transaction feature vector matches 847 confirmed AML cases across the platform. Similarity score: 0.93. Matched features: amount range, counterparty age, jurisdiction, and liquidation pattern.",
      model: "GBM-AMLDetection v3.0" },
    { id: "m1", title: "Client Relationship", weight: 0.55,
      details: "Client tenure: 12 years. AUM: $45M. Prior compliance flags: 0. Relationship stability index: 0.97 (top 3% of VIP cohort). No prior AML or sanctions alerts.",
      model: "AE-ClientStability v2.0", mitigating: true },
    { id: "m2", title: "Document Context", weight: 0.45,
      details: "Client correspondence references a legitimate real estate acquisition in Grand Cayman. Purchase agreement dated 2026-02-28 from a licensed real estate firm. Document AI confidence in legitimacy: 0.82.",
      model: "DocAnalysis-Context v1.8", mitigating: true },
  ],
  /* ── THR-002: Meridian Trade Corp, $1,200,000, High ── */
  'THR-002': [
    { id: "e1", title: "Unusual Transfer Volume", weight: 0.60,
      heroCue: "Amount 1.8× client's quarterly transfer baseline",
      details: "Transfer amount $1,200,000 is 1.8× the client's 4-quarter average institutional transfer of $670K. Percentile rank: 88.3. Amount moderate but counterparty is unrecognized.",
      model: "IsoForest-AMLAnomaly v4.1" },
    { id: "e2", title: "Off-Hours Initiation", weight: 0.78,
      heroCue: "Initiated at 02:47 AM — 2.1% of client's activity window",
      details: "Wire initiated at 02:47 AM local time. Client's 24-month active window: 07:00–18:00 EST. Only 2.1% of client's instructions occur between 00:00–06:00.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "New Counterparty", weight: 0.72,
      heroCue: "Zero prior transactions with this counterparty",
      details: "$1.2M wire to entity with no prior relationship. Zero outflows to Meridian Trade Corp in 36-month account history. Single-counterparty concentration anomaly.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Counterparty Risk", weight: 0.95,
      heroCue: "Counterparty not in any institutional directory",
      details: "Meridian Trade Corp not found in institutional counterparty directories (SWIFT, LEI registry). Zero transaction history across platform. Registration jurisdiction: unlisted. Incorporation: <90 days.",
      model: "XGB-CounterpartyRisk v2.3" },
    { id: "e5", title: "Known Fraud Pattern", weight: 0.85,
      heroCue: "Matches 523 confirmed fraud cases (0.89 similarity)",
      details: "Unrecognized counterparty + off-hours initiation pattern matches 523 confirmed fraud cases. Similarity score: 0.89. Matched features: counterparty type, timing, and amount range.",
      model: "GBM-AMLDetection v3.0" },
    { id: "m1", title: "Client Relationship", weight: 0.60,
      details: "Client tenure: 8 years. Account consistency: 91%. Prior compliance flags: 0. Stability index: 0.94 (top 6% of cohort). No prior AML alerts.",
      model: "AE-ClientStability v2.0", mitigating: true },
    { id: "m2", title: "Sector Familiarity", weight: 0.30,
      details: "Trade finance sector is unclassified for this client. No prior transactions to unclassified counterparties in 36-month history. Sector familiarity score: 0.12.",
      model: "BayesNet-SectorFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-003: Pacific Rim Ventures, $3,400,000, Medium ── */
  'THR-003': [
    { id: "e1", title: "Cross-Border Exposure", weight: 0.70,
      heroCue: "Amount 2.1× client's cross-border transfer mean",
      details: "Wire amount $3,400,000 is 2.1× the client's 24-month cross-border transfer mean of $1,620K. Percentile rank: 93.4. Prior max cross-border transfer: $2,200,000.",
      model: "IsoForest-AMLAnomaly v4.1" },
    { id: "e2", title: "Timing Assessment", weight: 0.45,
      heroCue: "Minor cadence deviation for this transaction type",
      details: "Wire initiated at 11:23 AM on weekday. Within normal business hours. No significant temporal anomaly. Minor deviation from typical cross-border transfer cadence.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Jurisdiction Complexity", weight: 0.65,
      heroCue: "Amount 3.5× client's Asia-Pacific transfer mean",
      details: "$3,400,000 cross-border wire to Asia-Pacific jurisdiction. 2 prior transfers to region in 24-month history (average: $980K). Amount is 3.5× the client's regional transfer mean.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Counterparty Assessment", weight: 0.60,
      heroCue: "Counterparty compliance incident rate 1.3× sector average",
      details: "Pacific Rim Ventures compliance incident rate: 2.8% (sector average: 2.1%). Ratio: 1.3×. First transaction with this counterparty. Entity active in institutional networks for 8 months.",
      model: "XGB-CounterpartyRisk v2.3" },
    { id: "e5", title: "Pattern Match", weight: 0.55,
      heroCue: "Matches 312 flagged cross-border cases (0.71 similarity)",
      details: "Cross-border wire + new counterparty pattern matches 312 flagged cases. Similarity score: 0.71. Matched features: transfer type and amount range.",
      model: "GBM-AMLDetection v3.0" },
    { id: "m1", title: "Client Relationship", weight: 0.65,
      details: "Client tenure: 15 years. Account consistency: 96%. Prior compliance flags: 0. Stability index: 0.98 (top 2% of cohort). No prior AML alerts.",
      model: "AE-ClientStability v2.0", mitigating: true },
    { id: "m2", title: "Sector Familiarity", weight: 0.55,
      details: "Cross-border transactions present in 8 of last 24 months. Frequency rank: 5th. Asia-Pacific sub-region familiarity score: 0.58.",
      model: "BayesNet-SectorFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-004: Regional Settlement Network, $800,000, Low ── */
  'THR-004': [
    { id: "e1", title: "Settlement Anomaly", weight: 0.50,
      heroCue: "Amount 3.6× client's settlement average",
      details: "Settlement of $800,000 against 24-month settlement mean of $220K. Percentile rank: 91.2. Prior max settlement: $500K. Amount is 3.6× above client's settlement average.",
      model: "IsoForest-AMLAnomaly v4.1" },
    { id: "e2", title: "Off-Hours Processing", weight: 0.40,
      heroCue: "After-hours settlement (73% of activity is during business hours)",
      details: "Settlement processed at 10:14 PM local time. 73% of client's settlement activity occurs between 09:00–18:00. After-hours settlement frequency: 4 in 12-month history.",
      model: "LSTM-TemporalSeq v2.0" },
    { id: "e3", title: "Rapid Liquidation", weight: 0.35,
      heroCue: "Liquidation-then-settlement pattern absent from history",
      details: "$800K settlement preceded by $340K position liquidation 20 minutes prior. Rapid liquidation-then-settlement pattern not present in client's 12-month transaction history.",
      model: "GNN-CrossAccount v1.5" },
    { id: "e4", title: "Network Risk", weight: 0.45,
      heroCue: "Settlement network incident rate 3.0× platform average",
      details: "Regional Settlement Network incident rate: 1.8% (platform settlement average: 0.6%). Ratio: 3.0×. First settlement via this network. Network flagged in 2 prior platform incidents.",
      model: "XGB-CounterpartyRisk v2.3" },
    { id: "e5", title: "Pattern Match", weight: 0.50,
      heroCue: "Matches 142 flagged settlement cases (0.64 similarity)",
      details: "High-amount settlement via flagged network matches 142 flagged cases. Similarity score: 0.64. Matched features: amount, network risk, and timing.",
      model: "GBM-AMLDetection v3.0" },
    { id: "m1", title: "Client Relationship", weight: 0.70,
      details: "Client tenure: 11 years. Account consistency: 95%. Prior compliance flags: 0. Stability index: 0.98 (top 2% of cohort). No prior AML alerts.",
      model: "AE-ClientStability v2.0", mitigating: true },
    { id: "m2", title: "Sector Familiarity", weight: 0.65,
      details: "Settlement activity present in 18 of last 24 months. Frequency rank: 4th. Regional network used 6 times prior. Familiarity score: 0.74.",
      model: "BayesNet-SectorFamiliar v1.8", mitigating: true },
  ],
  /* ── THR-005: Eastern Commodities Exchange, $5,000,000, Medium ── */
  'THR-005': [
    { id: "e1", title: "Concentration Risk Detected", weight: 0.91,
      heroCue: "Commodity allocation exceeds single-sector threshold",
      details: "$5M exposure to Eastern Commodities Exchange represents 18% of portfolio in a single commodity sector. Concentration exceeds the 15% single-sector limit defined in the client's investment policy statement. Flagged due to concentration risk, not counterparty quality.",
      model: "IsoForest-ConcentrationRisk v4.1" },
    { id: "e2", title: "Volatility Spike", weight: 0.78,
      heroCue: "30-day commodity volatility 2.4\u00d7 above historical mean",
      details: "Underlying commodity sector 30-day realized volatility at 34.2% vs. 12-month average of 14.1% (ratio: 2.4\u00d7). Elevated volatility increases mark-to-market risk on concentrated positions.",
      model: "LSTM-VolRegime v2.0" },
    { id: "e3", title: "Margin Exposure", weight: 0.82,
      heroCue: "Leveraged commodity position amplifies downside risk",
      details: "$5M notional exposure with 3:1 leverage on commodity futures. Margin call threshold at 12% drawdown ($600K). Current unrealized P&L: -$180K. Position represents the largest single-counterparty commodity exposure in the portfolio.",
      model: "GNN-MarginRisk v1.5" },
    { id: "e4", title: "Counterparty Assessment", weight: 0.68,
      heroCue: "Exchange credit rating stable but jurisdiction adds complexity",
      details: "Eastern Commodities Exchange: BBB+ rated, operational for 12 years. Jurisdiction requires CFTC-equivalent reporting. Settlement risk assessed at 0.3% (within acceptable range). No prior settlement failures with this counterparty.",
      model: "XGB-CounterpartyRisk v2.3" },
    { id: "e5", title: "Pattern Match", weight: 0.85,
      heroCue: "Concentrated commodity + high volatility matches 423 flagged cases",
      details: "The combination of single-sector concentration and elevated volatility matches 423 previously flagged cases (0.85 similarity). Matched features: concentration ratio, volatility regime, and leverage level. Note: this pattern is driven by position sizing and market conditions, not the specific commodity.",
      model: "GBM-ConcentrationAlert v3.0" },
    { id: "m1", title: "Portfolio Diversification", weight: 0.62,
      details: "Overall portfolio diversification score: 0.81 (above median). 14 asset classes represented. Commodity allocation historically between 5-12%. Current spike driven by recent position additions.",
      model: "AE-PortfolioDiversity v2.0", mitigating: true },
    { id: "m2", title: "Client Mandate Alignment", weight: 0.45,
      details: "Client investment policy allows commodity exposure up to 20% with board approval. Current 18% is within the expanded mandate. Prior commodity positions held for 8+ months on average.",
      model: "BayesNet-MandateAlign v1.8", mitigating: true },
  ],
}
export const DEFAULT_FACTOR_ITEMS = ALERT_FACTOR_ITEMS['THR-001']

/* ── Risk sidebar data ── */
export const riskBreakdown = [
  { label: "Settlement risk", pct: 45, color: "var(--state-critical)" },
  { label: "Counterparty risk", pct: 25, color: "var(--state-warning)" },
  { label: "Jurisdiction anomaly", pct: 20, color: "var(--engine-govern)" },
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
