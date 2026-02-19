/**
 * Protect Engine — Static data & local type definitions.
 *
 * Types shared across engines (Signal, Severity, ShapFactor, CategoryScore, Milestone)
 * are imported from @/types/engine-data. Only Protect-specific constants live here.
 */

import {
  CreditCard,
  Shield,
  MapPin,
  Brain,
} from 'lucide-react'
import type { Signal, ShapFactor, CategoryScore, Milestone, CitationSource, ReasoningStep } from '@/types/engine-data'
import { DEMO_THREAD } from '@/lib/demo-thread'

/* ── Re-export shared types for convenience ── */
export type { Signal, ShapFactor, CategoryScore, Milestone, CitationSource, ReasoningStep }

/* ── Quick Action type (local to Protect) ── */
export interface QuickAction {
  title: string
  priority: 'urgent' | 'normal' | 'low'
  color: string
  route: string | null
}

/* ── KPI type (local to Protect) ── */
export interface Kpi {
  label: string
  value: string
  accent: string
  status: string
}

/* ─── Data ────────────────────────────────────────────────── */

export const signals: Signal[] = [
  {
    id: 's1',
    severity: 'critical',
    title: 'Unusual high-value transaction',
    merchant: DEMO_THREAD.criticalAlert.merchant,
    amount: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}.00`,
    confidence: DEMO_THREAD.criticalAlert.confidence,
    time: '14:28',
  },
  {
    id: 's2',
    severity: 'warning',
    title: 'Geographic anomaly detected',
    merchant: 'TravelCo International',
    amount: '$890.00',
    confidence: 0.87,
    time: '13:45',
  },
  {
    id: 's3',
    severity: 'info',
    title: 'New merchant first transaction',
    merchant: 'CloudServices Pro',
    amount: '$149.99',
    confidence: 0.72,
    time: '12:10',
  },
]

export const shapFactors: ShapFactor[] = [
  { label: 'merchant_days_since_registration', value: 0.82 },
  { label: 'txn_amount_zscore (+3.2\u03C3)', value: 0.71 },
  { label: 'geo_ip_distance_km', value: 0.65 },
]

export const categoryScores: CategoryScore[] = [
  { name: 'Transaction patterns', score: 92, icon: CreditCard },
  { name: 'Merchant risk', score: 87, icon: Shield },
  { name: 'Geographic', score: 95, icon: MapPin },
  { name: 'Behavioral', score: 91, icon: Brain },
]

export const milestones: Milestone[] = [
  { label: 'Signal detected', time: '14:28', status: 'completed' as const },
  { label: 'Analysis complete', time: '14:29', status: 'completed' as const },
  { label: 'Alert raised', time: '14:30', status: 'completed' as const },
  { label: 'Resolution pending', time: 'Now', status: 'current' as const },
]

export const quickActions: QuickAction[] = [
  { title: 'Freeze card', priority: 'urgent', color: 'var(--state-critical)', route: '/protect/dispute' },
  { title: `Investigate ${DEMO_THREAD.criticalAlert.merchant}`, priority: 'normal', color: 'var(--state-warning)', route: '/protect/alert-detail' },
  { title: 'Update alert rules', priority: 'low', color: 'var(--state-healthy)', route: null },
]

export const kpis: Kpi[] = [
  { label: 'Active signals', value: '3', accent: 'var(--state-warning)', status: 'amber' },
  { label: 'Blocked today', value: '1', accent: 'var(--state-healthy)', status: 'green' },
  { label: 'False positive rate', value: '2.1%', accent: 'var(--state-healthy)', status: 'green' },
  { label: 'Coverage', value: '100%', accent: 'var(--state-healthy)', status: 'green' },
]

/* ─── AI Credibility Layer Data ──────────────────────────── */

export const protectCitations: CitationSource[] = [
  { id: 'c1', label: 'Transaction History Analysis', excerpt: '180-day behavioral baseline shows $1,300 avg in this category. Current transaction is 3.2\u00D7 deviation.', url: 'https://arxiv.org/abs/1705.07874' },
  { id: 'c2', label: 'Merchant Risk Database', excerpt: `${DEMO_THREAD.criticalAlert.merchant} \u2014 newly registered (< 90 days), elevated risk tier.`, url: 'https://doi.org/10.1145/3178876.3186066' },
  { id: 'c3', label: 'Lundberg & Lee (2017) — SHAP Values', excerpt: 'Feature attribution via SHAP (NeurIPS 2017). Unified approach to interpreting model predictions with guaranteed consistency.', url: 'https://arxiv.org/abs/1705.07874' },
]

export const protectReasoningSteps: ReasoningStep[] = [
  { step: 1, label: 'Transaction Ingestion', description: `Wire transfer of $${DEMO_THREAD.criticalAlert.amount.toLocaleString()} to ${DEMO_THREAD.criticalAlert.merchant} captured via real-time feed.`, confidence: 0.99 },
  { step: 2, label: 'Behavioral Analysis', description: '180-day baseline comparison: 3.2\u00D7 deviation from category average ($1,300).', confidence: 0.94 },
  { step: 3, label: 'Merchant Risk Assessment', description: `${DEMO_THREAD.criticalAlert.merchant} registered < 90 days. Cross-referenced with risk database.`, confidence: 0.87 },
  { step: 4, label: 'Signal Classification', description: 'Classified as CRITICAL based on amount, deviation, and merchant newness.', confidence: 0.94 },
]

export const protectMethodology = {
  modelName: 'FraudDetection',
  modelVersion: '3.2',
  accuracy: 0.967,
  description: 'Multi-layer fraud detection combining behavioral analysis, merchant risk scoring, and geographic pattern matching. Trained on 2.4M transactions with ensemble gradient boosting.',
}
