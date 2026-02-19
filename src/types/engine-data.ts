/**
 * Shared type definitions for engine page data.
 *
 * Extracted from inline type definitions in Protect/Grow/Execute/Govern pages.
 * Also includes types for the AI Credibility Layer (Phase 5).
 */

import type { LucideIcon } from 'lucide-react'

/* ── Protect ── */

export type Severity = 'critical' | 'warning' | 'info'

export interface Signal {
  id: string
  severity: Severity
  title: string
  merchant: string
  amount: string
  confidence: number
  time: string
}

export interface ShapFactor {
  label: string
  value: number
}

export interface CategoryScore {
  name: string
  score: number
  icon: LucideIcon
}

export interface Milestone {
  label: string
  time: string
  status: 'completed' | 'current'
}

/* ── Grow ── */

export type GoalStatus = 'On track' | 'Behind' | 'Ahead'

export interface Goal {
  id: string
  name: string
  progress: number
  target: string
  current: string
  gap: string
  timeline: string
  status: GoalStatus
  recommendation: string
  confidence: number
  actions: string[]
}

export interface ProjectionPoint {
  year: string
  value: number
  low: number
  high: number
}

export interface AllocationSlice {
  name: string
  value: number
  color: string
}

/* ── Execute ── */

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM'
export type ActionStatus = 'pending' | 'approved' | 'rejected' | 'auto-executed'
export type Engine = 'Protect' | 'Grow' | 'Govern'

export interface ActionItem {
  id: string
  priority: Priority
  action: string
  detail: string
  engine: Engine
  confidence: number
  amount: string
  timeAgo: string
  status: ActionStatus
}

export interface RecentExecution {
  action: string
  engine: Engine
  timeAgo: string
  status: 'Approved' | 'Rejected' | 'Auto-executed'
}

/* ── Govern ── */

export type DecisionType = 'Protect' | 'Grow' | 'Execute'
export type DecisionStatus = 'Verified' | 'Pending review' | 'Flagged'

export interface Decision {
  id: string
  type: DecisionType
  timestamp: string
  confidence: number
  evidencePoints: number
  status: DecisionStatus
  description: string
  hash?: string
}

export interface ConfidenceTrendPoint {
  day: string
  value: number
}

export interface EvidenceType {
  label: string
  pct: number
}

/* ── AI Credibility Layer (Phase 5) ── */

export interface CitationSource {
  id: string
  label: string
  excerpt: string
  url?: string
}

export interface ReasoningStep {
  step: number
  label: string
  description: string
  confidence?: number
}
