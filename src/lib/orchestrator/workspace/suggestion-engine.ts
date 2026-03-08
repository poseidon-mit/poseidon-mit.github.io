/**
 * Suggestion Engine — generates proactive DynamicSuggestionCards from UserContext.
 *
 * Maps context signals (role, fiscal quarter, recent actions, calendar events)
 * to prioritized suggestion cards that feed directly into intent-parser.ts.
 */

import type { UserContext, DynamicSuggestionCard, SuggestionContextSource } from './workspace-types'
import type { EngineName, UseCaseId } from '@/lib/orchestrator/types'
import { hasUrgentSignalForEngine } from './context-analyzer'
import { generateId } from '@/lib/orchestrator/crypto'

// ─── Suggestion Templates ────────────────────────────────────────────────────

interface SuggestionTemplate {
  icon: string
  label: string
  description: string
  engine: EngineName
  intentTemplate: string
  contextSource: SuggestionContextSource
  useCaseId?: UseCaseId
  basePriority: number
  /** Predicate: should this suggestion appear for the given context? */
  matches: (ctx: UserContext) => boolean
  /** Dynamic confidence based on context signals */
  confidence: (ctx: UserContext) => number
}

const SUGGESTION_TEMPLATES: SuggestionTemplate[] = [
  // ─── Fiscal Quarter Suggestions ─────────────────────────────────
  {
    icon: 'BarChart3',
    label: '予算差異分析',
    description: '当四半期の予算と実績の差異を分析します',
    engine: 'execute',
    intentTemplate: '予算差異分析 現四半期',
    contextSource: 'fiscal-quarter',
    useCaseId: 'UC-07',
    basePriority: 1,
    matches: () => true, // always relevant
    confidence: (ctx) => {
      const q = parseInt(ctx.fiscalQuarter.charAt(1))
      // Higher confidence near quarter end (month 3, 6, 9, 12)
      const month = new Date().getMonth() + 1
      const isNearQuarterEnd = month % 3 === 0
      return isNearQuarterEnd ? 0.95 : 0.7 + q * 0.05
    },
  },
  {
    icon: 'TrendingUp',
    label: '収益予測レビュー',
    description: '四半期末に向けた収益予測を確認します',
    engine: 'grow',
    intentTemplate: '収益予測分析',
    contextSource: 'fiscal-quarter',
    useCaseId: 'UC-06',
    basePriority: 2,
    matches: () => true,
    confidence: () => 0.8,
  },

  // ─── Role-Based Suggestions ─────────────────────────────────────
  {
    icon: 'Shield',
    label: 'AML閾値モニタリング',
    description: 'AMLコンプライアンス閾値の状態を確認します',
    engine: 'govern',
    intentTemplate: 'AML閾値チェック',
    contextSource: 'role-based',
    useCaseId: 'UC-01',
    basePriority: 3,
    matches: (ctx) =>
      ctx.role === 'CFO' || ctx.role === 'CCO' || ctx.department === 'Compliance',
    confidence: (ctx) =>
      hasUrgentSignalForEngine(ctx, 'govern') ? 0.95 : 0.75,
  },
  {
    icon: 'AlertTriangle',
    label: 'リスクヒートマップ',
    description: 'ポートフォリオ全体のリスク分布を可視化します',
    engine: 'protect',
    intentTemplate: 'ポートフォリオリスク分析',
    contextSource: 'role-based',
    useCaseId: 'UC-04',
    basePriority: 4,
    matches: (ctx) =>
      ctx.role === 'CFO' || ctx.role === 'CRO' || ctx.riskProfile === 'high',
    confidence: () => 0.8,
  },
  {
    icon: 'Users',
    label: '承認キュー確認',
    description: '保留中の承認リクエストを確認します',
    engine: 'execute',
    intentTemplate: '承認キュー確認',
    contextSource: 'role-based',
    useCaseId: 'UC-08',
    basePriority: 5,
    matches: (ctx) =>
      ctx.role === 'CFO' || ctx.role === 'CEO' || ctx.department === 'Finance',
    confidence: () => 0.7,
  },

  // ─── Calendar Signal Suggestions ────────────────────────────────
  {
    icon: 'Calendar',
    label: '会議準備: AMLレビューボード',
    description: '明日のAMLレビューに必要なデータを準備します',
    engine: 'govern',
    intentTemplate: 'AMLレビューボード準備 データ収集',
    contextSource: 'calendar-signal',
    basePriority: 0, // highest priority when triggered
    matches: (ctx) =>
      ctx.calendarSignals.some(
        (s) => s.relevantEngine === 'govern' && s.type === 'meeting',
      ),
    confidence: (ctx) => {
      const signal = ctx.calendarSignals.find(
        (s) => s.relevantEngine === 'govern' && s.type === 'meeting',
      )
      if (!signal) return 0
      const hoursUntil =
        (new Date(signal.timestamp).getTime() - Date.now()) / (1000 * 60 * 60)
      return hoursUntil < 24 ? 0.98 : 0.7
    },
  },

  // ─── Follow-Up Suggestions ──────────────────────────────────────
  {
    icon: 'RotateCcw',
    label: '前回分析の続き',
    description: '直近の分析結果を再確認し、アクションを実行します',
    engine: 'dashboard',
    intentTemplate: '前回の分析結果サマリー',
    contextSource: 'follow-up',
    basePriority: 6,
    matches: (ctx) => ctx.recentActions.length > 0,
    confidence: (ctx) => {
      if (ctx.recentActions.length === 0) return 0
      const lastAction = ctx.recentActions[0]
      const hoursSince =
        (Date.now() - new Date(lastAction.timestamp).getTime()) /
        (1000 * 60 * 60)
      return hoursSince < 4 ? 0.85 : 0.6
    },
  },

  // ─── Risk Alert Suggestions ─────────────────────────────────────
  {
    icon: 'Siren',
    label: '異常検知アラート確認',
    description: 'システムが検知した異常パターンを確認します',
    engine: 'protect',
    intentTemplate: '異常検知アラート一覧',
    contextSource: 'risk-alert',
    useCaseId: 'UC-03',
    basePriority: 1,
    matches: (ctx) => ctx.riskProfile === 'high' || ctx.riskProfile === 'critical',
    confidence: (ctx) =>
      ctx.riskProfile === 'critical' ? 0.98 : 0.82,
  },
]

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate proactive suggestion cards based on user context.
 * Returns cards sorted by priority (lower number = higher priority),
 * filtered to only matching suggestions.
 */
export function generateSuggestions(
  context: UserContext,
  maxCards: number = 8,
): DynamicSuggestionCard[] {
  return SUGGESTION_TEMPLATES
    .filter((t) => t.matches(context))
    .map((t) => ({
      id: generateId(),
      icon: t.icon,
      label: t.label,
      description: t.description,
      confidence: t.confidence(context),
      engine: t.engine,
      intentTemplate: t.intentTemplate,
      contextSource: t.contextSource,
      priority: t.basePriority,
      useCaseId: t.useCaseId,
    }))
    .sort((a, b) => {
      // Sort by confidence first (descending), then priority (ascending)
      const confidenceDiff = b.confidence - a.confidence
      if (Math.abs(confidenceDiff) > 0.1) return confidenceDiff
      return a.priority - b.priority
    })
    .slice(0, maxCards)
}

/**
 * Regenerate suggestions after an action is completed.
 * Boosts follow-up suggestions and adjusts priorities based on what just happened.
 */
export function regenerateSuggestionsAfterAction(
  context: UserContext,
  completedIntentTemplate: string,
  maxCards: number = 8,
): DynamicSuggestionCard[] {
  // Remove the suggestion that was just actioned
  const base = generateSuggestions(context, maxCards + 2)
  return base
    .filter((s) => s.intentTemplate !== completedIntentTemplate)
    .slice(0, maxCards)
}
