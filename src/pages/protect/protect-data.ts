/**
 * Protect engine — shared data constants, types, and business logic.
 *
 * Follows the same pattern as execute-data.ts / govern-data.ts.
 * Both Protect.tsx and ProtectAlertDetail.tsx import from here.
 */
import { selectProtectThreats, type ThreatFactor } from '@/domain/poseidon-universe'

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

/** @deprecated Use ThreatFactor from @/domain/poseidon-universe */
export type FactorItem = ThreatFactor

export interface DerivedFactor extends ThreatFactor {
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

/* Evidence data (ALERT_TIMING, ALERT_FACTOR_ITEMS) has been migrated to canonical.
 * Use selectThreatFactors(threatId) and selectThreatTiming(threatId) from @/domain/poseidon-universe. */

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
