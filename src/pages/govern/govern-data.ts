/**
 * govern-data.ts — Type definitions, const data arrays, and utility helpers
 * for the Govern engine page.
 *
 * Types already in @/types/engine-data.ts (Decision, DecisionType,
 * DecisionStatus, ConfidenceTrendPoint, EvidenceType) are imported from there.
 * Page-specific types and all static data live here.
 */
import type { Decision, DecisionType, DecisionStatus, ConfidenceTrendPoint, EvidenceType, CitationSource, ReasoningStep } from '@/types/engine-data'

// Re-export shared types so sibling files only need one import source
export type { Decision, DecisionType, DecisionStatus, ConfidenceTrendPoint, EvidenceType, CitationSource, ReasoningStep }

/* ═══════════════════════════════════════════
   PAGE-SPECIFIC TYPES
   ═══════════════════════════════════════════ */

export interface KpiCardData {
  label: string
  value: string
  badge?: { text: string; color: string; bg: string }
  trend?: { text: string; color: string }
}

export interface ComplianceItem {
  label: string
  compliant: boolean
}

/* ═══════════════════════════════════════════
   CONST DATA
   ═══════════════════════════════════════════ */

export const decisions: Decision[] = [
  {
    id: 'GV-2026-0216-42',
    type: 'Execute',
    timestamp: '14:28 Today',
    confidence: 0.97,
    evidencePoints: 12,
    status: 'Verified',
    description: 'Portfolio rebalance — $24k allocation shift',
    hash: 'sha256:a3f8c1...d42e',
  },
  {
    id: 'GV-2026-0216-41',
    type: 'Protect',
    timestamp: '14:15 Today',
    confidence: 0.94,
    evidencePoints: 9,
    status: 'Verified',
    description: 'Wire transfer blocked — fraud score 0.94',
    hash: 'sha256:7b2e09...f18a',
  },
  {
    id: 'GV-2026-0216-40',
    type: 'Grow',
    timestamp: '13:52 Today',
    confidence: 0.89,
    evidencePoints: 7,
    status: 'Verified',
    description: 'Subscription consolidation — $140/mo savings',
    hash: 'sha256:e4d1b7...c903',
  },
  {
    id: 'GV-2026-0216-39',
    type: 'Execute',
    timestamp: '11:20 Today',
    confidence: 0.78,
    evidencePoints: 5,
    status: 'Pending review',
    description: 'Invoice archival — 142 items',
  },
  {
    id: 'GV-2026-0215-38',
    type: 'Protect',
    timestamp: 'Yesterday',
    confidence: 0.92,
    evidencePoints: 10,
    status: 'Verified',
    description: 'Unusual transaction flagged — manual review',
    hash: 'sha256:91ca34...b67d',
  },
  {
    id: 'GV-2026-0215-37',
    type: 'Grow',
    timestamp: 'Yesterday',
    confidence: 0.86,
    evidencePoints: 6,
    status: 'Verified',
    description: 'Goal progress update — retirement timeline',
    hash: 'sha256:f0283e...5a41',
  },
]

export const confidenceTrendData: ConfidenceTrendPoint[] = [
  { day: '1', value: 0.948 },
  { day: '3', value: 0.952 },
  { day: '5', value: 0.941 },
  { day: '8', value: 0.956 },
  { day: '10', value: 0.949 },
  { day: '13', value: 0.963 },
  { day: '15', value: 0.958 },
  { day: '18', value: 0.961 },
  { day: '20', value: 0.955 },
  { day: '23', value: 0.967 },
  { day: '25', value: 0.972 },
  { day: '28', value: 0.964 },
  { day: '30', value: 0.971 },
]

export const evidenceTypes: EvidenceType[] = [
  { label: 'Transaction data', pct: 92 },
  { label: 'User patterns', pct: 87 },
  { label: 'External signals', pct: 95 },
  { label: 'Policy rules', pct: 100 },
]

export const complianceItems: ComplianceItem[] = [
  { label: 'GDPR', compliant: true },
  { label: 'SOC 2 Type II in progress', compliant: true },
  { label: 'CCPA', compliant: true },
]

export const kpiData: KpiCardData[] = [
  {
    label: 'Decisions Audited',
    value: '847',
    badge: { text: 'audited', color: 'var(--engine-govern)', bg: 'rgba(59,130,246,0.12)' },
  },
  {
    label: 'Verifiable',
    value: '100%',
    trend: { text: 'up from 99.8%', color: 'var(--state-healthy)' },
  },
  {
    label: 'Avg Evidence Points',
    value: '8.4',
    trend: { text: '+1.2 trend', color: 'var(--state-healthy)' },
  },
  {
    label: 'Human Reviews',
    value: '3',
    badge: { text: 'pending', color: 'var(--state-warning)', bg: 'rgba(var(--state-warning-rgb),0.12)' },
  },
]

/* ═══════════════════════════════════════════
   UTILITY MAPS
   ═══════════════════════════════════════════ */

export const typeColor: Record<DecisionType, string> = {
  Protect: '#14B8A6',
  Grow: 'var(--engine-grow)',
  Execute: 'var(--engine-execute)',
}

export const typeBg: Record<DecisionType, string> = {
  Protect: 'rgba(20,184,166,0.12)',
  Grow: 'rgba(139,92,246,0.12)',
  Execute: 'rgba(234,179,8,0.12)',
}

/* ═══════════════════════════════════════════
   AI CREDIBILITY LAYER DATA
   ═══════════════════════════════════════════ */

export const governCitations: CitationSource[] = [
  { id: 'gvc1', label: 'Decision Audit Trail', excerpt: 'GV-2026-0214-42: Portfolio rebalance from Growth to Balanced allocation. 12 supporting evidence points collected.' },
  { id: 'gvc2', label: 'Doshi-Velez & Kim (2017)', excerpt: 'Rigorous science of interpretable ML. Model-agnostic explanation framework for auditability.', url: 'https://arxiv.org/abs/1702.08608' },
  { id: 'gvc3', label: 'Multi-Engine Verification', excerpt: 'Protect: no risk flags. Grow: alignment confirmed. Execute: action logged and traced.' },
]

export const governReasoningSteps: ReasoningStep[] = [
  { step: 1, label: 'Decision Capture', description: 'AI recommendation captured with full context: inputs, model version, confidence score.', confidence: 0.99 },
  { step: 2, label: 'Evidence Collection', description: '12 evidence points aggregated from transaction data, market signals, and policy rules.', confidence: 0.97 },
  { step: 3, label: 'Compliance Verification', description: 'Checked against SOC 2 Type II controls and internal governance policies.', confidence: 0.98 },
  { step: 4, label: 'Audit Trail Sealed', description: 'Immutable record created with cryptographic hash. Full provenance chain intact.', confidence: 0.99 },
]

export const governMethodology = {
  modelName: 'GovernanceTracer',
  modelVersion: '3.1',
  accuracy: 0.989,
  description: 'Multi-source evidence aggregation with cryptographic audit trail. Verifies decision provenance across all engine interactions. SOC 2 Type II in progress with real-time compliance monitoring.',
}
