/**
 * Execute engine — data constants, config maps, and local type extensions.
 *
 * Types that already exist in @/types/engine-data (ActionItem, Priority, Engine,
 * ActionStatus, RecentExecution) are re-exported from there.
 */

import type {
  ActionItem,
  Priority,
  Engine,
  RecentExecution,
  CitationSource,
  ReasoningStep,
} from '@/types/engine-data'
import { DEMO_THREAD } from '@/lib/demo-thread'

/* ═══════════════════════════════════════════
   KPI DATA
   ═══════════════════════════════════════════ */

export interface KpiCardData {
  label: string
  value: string
  badge?: { text: string; color: string; bg: string }
  trend?: { text: string; color: string; icon: 'up' | 'down' }
}

export const kpiData: KpiCardData[] = [
  {
    label: 'Pending Actions',
    value: String(DEMO_THREAD.pendingActions),
    badge: { text: 'pending', color: 'var(--engine-execute)', bg: 'rgba(234,179,8,0.12)' },
  },
  {
    label: 'Auto-approved Today',
    value: '12',
    trend: { text: '+3 from yesterday', color: 'var(--state-healthy)', icon: 'up' },
  },
  {
    label: 'Blocked Today',
    value: '1',
    badge: { text: 'blocked', color: 'var(--state-critical)', bg: 'rgba(var(--state-critical-rgb),0.12)' },
  },
  {
    label: 'Avg Review Time',
    value: '2.3 min',
    trend: { text: '-15% trend', color: 'var(--state-healthy)', icon: 'down' },
  },
]

/* ═══════════════════════════════════════════
   ACTION DATA
   ═══════════════════════════════════════════ */

export const initialActions: ActionItem[] = [
  {
    id: 'act-1',
    priority: 'CRITICAL',
    action: `Block wire transfer to ${DEMO_THREAD.criticalAlert.merchant}`,
    detail: 'Unusual merchant + high-risk geography + amount deviation',
    engine: 'Protect',
    confidence: DEMO_THREAD.criticalAlert.confidence,
    amount: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}`,
    timeAgo: '4 min ago',
    status: 'pending',
  },
  {
    id: 'act-2',
    priority: 'HIGH',
    action: 'Consolidate subscriptions',
    detail: '3 overlapping tools detected, usage <30% on 2',
    engine: 'Grow',
    confidence: 0.89,
    amount: 'Save $140/mo',
    timeAgo: '18 min ago',
    status: 'pending',
  },
  {
    id: 'act-3',
    priority: 'HIGH',
    action: 'Rebalance portfolio allocation',
    detail: 'Target allocation drift 8.2%, rebalance to 60/40',
    engine: 'Grow',
    confidence: 0.87,
    amount: '$24k allocation',
    timeAgo: '1 hr ago',
    status: 'pending',
  },
  {
    id: 'act-4',
    priority: 'MEDIUM',
    action: 'Archive old invoices',
    detail: 'Retention policy: archive after 7 years',
    engine: 'Govern',
    confidence: 0.78,
    amount: '142 items',
    timeAgo: '3 hr ago',
    status: 'pending',
  },
  {
    id: 'act-5',
    priority: 'MEDIUM',
    action: 'Archive invoices',
    detail: 'Batch archive completed invoices based on retention policy',
    engine: 'Govern',
    confidence: 0.78,
    amount: '47 items',
    timeAgo: '3 hr ago',
    status: 'pending',
  },
]

/* ═══════════════════════════════════════════
   RECENT EXECUTIONS
   ═══════════════════════════════════════════ */

export const recentExecutions: RecentExecution[] = [
  { action: 'Block wire transfer', engine: 'Protect', timeAgo: '2 min ago', status: 'Approved' },
  { action: 'Rebalance portfolio', engine: 'Grow', timeAgo: '18 min ago', status: 'Auto-executed' },
  { action: 'Archive invoices', engine: 'Govern', timeAgo: '1 hr ago', status: 'Approved' },
  { action: 'Consolidate tools', engine: 'Grow', timeAgo: '2 hr ago', status: 'Rejected' },
]

/* ═══════════════════════════════════════════
   CONFIDENCE CHART DATA
   ═══════════════════════════════════════════ */

export const confidenceData = [
  { range: '0.9-1.0', count: 6, fill: 'var(--state-healthy)' },
  { range: '0.8-0.9', count: 5, fill: '#14B8A6' },
  { range: '0.7-0.8', count: 3, fill: 'var(--state-warning)' },
  { range: '<0.7', count: 0, fill: 'var(--state-critical)' },
]

/* ═══════════════════════════════════════════
   CONFIG MAPS
   ═══════════════════════════════════════════ */

export const engineColor: Record<Engine, string> = {
  Protect: 'var(--engine-protect)',
  Grow: 'var(--engine-grow)',
  Govern: 'var(--engine-govern)',
}

export const engineBg: Record<Engine, string> = {
  Protect: 'rgba(20,184,166,0.12)',
  Grow: 'rgba(139,92,246,0.12)',
  Govern: 'rgba(59,130,246,0.12)',
}

export const priorityConfig: Record<Priority, { color: string; bg: string; label: string }> = {
  CRITICAL: { color: 'var(--state-critical)', bg: 'rgba(var(--state-critical-rgb),0.12)', label: 'CRITICAL' },
  HIGH: { color: 'var(--state-warning)', bg: 'rgba(var(--state-warning-rgb),0.12)', label: 'HIGH' },
  MEDIUM: { color: '#64748B', bg: 'rgba(100,116,139,0.12)', label: 'MEDIUM' },
}

export const statusConfig: Record<RecentExecution['status'], { color: string; bg: string }> = {
  Approved: { color: 'var(--state-healthy)', bg: 'rgba(16,185,129,0.12)' },
  Rejected: { color: 'var(--state-critical)', bg: 'rgba(var(--state-critical-rgb),0.12)' },
  'Auto-executed': { color: '#14B8A6', bg: 'rgba(20,184,166,0.12)' },
}

/* ═══════════════════════════════════════════
   UTILITY HELPERS
   ═══════════════════════════════════════════ */

export function getConfidenceColor(c: number): string {
  if (c >= 0.9) return 'var(--state-healthy)'
  if (c >= 0.8) return '#14B8A6'
  if (c >= 0.7) return 'var(--state-warning)'
  return 'var(--state-critical)'
}

/* ═══════════════════════════════════════════
   AI CREDIBILITY LAYER DATA (Phase 6)
   ═══════════════════════════════════════════ */

export const executeCitations: CitationSource[] = [
  { id: 'ec1', label: 'Protect Engine Signal', excerpt: `Fraud detection model flagged $${DEMO_THREAD.criticalAlert.amount.toLocaleString()} transfer with ${DEMO_THREAD.criticalAlert.confidence.toFixed(2)} confidence score.` },
  { id: 'ec2', label: 'Risk Threshold Policy', excerpt: 'Transactions > $5k with fraud score > 0.85 require manual approval per policy GV-2026-001.' },
  { id: 'ec3', label: 'Saaty (1980) — Multi-Criteria Decision Analysis', excerpt: 'Weighted priority aggregation across engine signals. Analytic Hierarchy Process (AHP) for cross-engine action ranking.', url: 'https://doi.org/10.1016/0377-2217(90)90057-I' },
]

export const executeReasoningSteps: ReasoningStep[] = [
  { step: 1, label: 'Signal Reception', description: `Protect engine flagged wire transfer with ${DEMO_THREAD.criticalAlert.confidence.toFixed(2)} fraud confidence.`, confidence: DEMO_THREAD.criticalAlert.confidence },
  { step: 2, label: 'Priority Classification', description: 'Transaction exceeds anomaly threshold and crosses manual review policy. Classified as CRITICAL priority.', confidence: 0.97 },
  { step: 3, label: 'Engine Correlation', description: 'Cross-checked Grow impact (nil) and Govern compliance (requires approval).', confidence: 0.91 },
  { step: 4, label: 'Action Recommendation', description: 'Immediate block recommended. Auto-execute disabled for CRITICAL tier.', confidence: 0.91 },
]

export const executeMethodology = {
  modelName: 'ActionPrioritizer',
  modelVersion: '2.4',
  accuracy: 0.934,
  description: 'Multi-engine action prioritization using weighted risk aggregation across Protect, Grow, and Govern signals. Confidence scores derived from ensemble model with cross-validation.',
}
