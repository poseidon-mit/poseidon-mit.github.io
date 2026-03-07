/**
 * 10 Banking Use Case Definitions + Bento Layout Presets
 * Based on v2.0 Implementation Plan §2
 */

import type { UseCaseId, BentoLayoutSpec, EngineName, RiskLevel, TierLevel } from './types'

export interface UseCaseDefinition {
  id: UseCaseId
  name: string
  nameJa: string
  engines: EngineName[]
  riskLevel: RiskLevel
  tier: TierLevel
  keywords: string[]
}

export const USE_CASE_DEFINITIONS: Record<UseCaseId, UseCaseDefinition> = {
  'UC-01': {
    id: 'UC-01',
    name: 'Executive Risk Summary',
    nameJa: '取締役会向けリスクサマリー作成',
    engines: ['protect', 'grow'],
    riskLevel: 'medium',
    tier: 2,
    keywords: ['リスク', 'サマリー', '取締役', 'risk', 'summary', 'executive', 'board'],
  },
  'UC-02': {
    id: 'UC-02',
    name: 'IT Tool ROI Simulation',
    nameJa: '新規ITツール導入ROIシミュレーション',
    engines: ['grow'],
    riskLevel: 'medium',
    tier: 2,
    keywords: ['ROI', 'シミュレーション', 'IT', 'ツール', '導入', 'roi', 'simulation', 'tool'],
  },
  'UC-03': {
    id: 'UC-03',
    name: 'AML Threshold Dynamic Change',
    nameJa: 'AML閾値動的変更＋インパクトテスト',
    engines: ['protect', 'govern'],
    riskLevel: 'critical',
    tier: 3,
    keywords: ['AML', '閾値', 'threshold', 'aml', 'anti-money', 'マネロン', 'インパクト'],
  },
  'UC-04': {
    id: 'UC-04',
    name: 'SaaS License Optimization',
    nameJa: '全社SaaSライセンス棚卸し一括削減',
    engines: ['execute'],
    riskLevel: 'high',
    tier: 2,
    keywords: ['SaaS', 'ライセンス', '棚卸', '削減', 'license', 'saas', 'optimization'],
  },
  'UC-05': {
    id: 'UC-05',
    name: 'Competitive Rate Counter Plan',
    nameJa: '競合金利対抗プラン＋稟議承認',
    engines: ['grow', 'execute'],
    riskLevel: 'high',
    tier: 3,
    keywords: ['金利', '競合', '対抗', '稟議', 'rate', 'competitive', 'counter', 'approval'],
  },
  'UC-06': {
    id: 'UC-06',
    name: 'Campaign Cohort Extraction',
    nameJa: 'キャンペーン対象コホート抽出',
    engines: ['grow'],
    riskLevel: 'low',
    tier: 1,
    keywords: ['コホート', 'キャンペーン', '抽出', 'cohort', 'campaign', 'extraction', 'ターゲット'],
  },
  'UC-07': {
    id: 'UC-07',
    name: 'AI Decision Trace Audit',
    nameJa: 'AI判断の逆追跡（監査対応）',
    engines: ['govern'],
    riskLevel: 'medium',
    tier: 2,
    keywords: ['監査', '逆追跡', 'AI判断', 'audit', 'trace', 'decision', '追跡', 'explain'],
  },
  'UC-08': {
    id: 'UC-08',
    name: 'Budget Overrun Detection & Reallocation',
    nameJa: '部門予算超過早期検知＋自動再配分',
    engines: ['protect', 'grow', 'execute'],
    riskLevel: 'high',
    tier: 3,
    keywords: ['予算', '超過', '再配分', 'budget', 'overrun', 'reallocation', '検知'],
  },
  'UC-09': {
    id: 'UC-09',
    name: 'Access Rights Template',
    nameJa: '新入社員・異動アクセス権テンプレート適用',
    engines: ['govern'],
    riskLevel: 'medium',
    tier: 2,
    keywords: ['アクセス権', '新入社員', '異動', 'テンプレート', 'access', 'rights', 'onboarding', 'template'],
  },
  'UC-10': {
    id: 'UC-10',
    name: 'Churn Risk Retention Offer',
    nameJa: '顧客チャーンリスク自動リテンションオファー設計',
    engines: ['execute'],
    riskLevel: 'medium',
    tier: 2,
    keywords: ['チャーン', 'リテンション', 'オファー', 'churn', 'retention', 'offer', '離反'],
  },
}

export const USE_CASE_LAYOUTS: Record<UseCaseId, BentoLayoutSpec> = {
  'UC-01': {
    columns: 4,
    primaryEngine: 'protect',
    cards: [
      { id: 'market-risk', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 1 },
      { id: 'credit-risk', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 2 },
      { id: 'regulatory-risk', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'govern', priority: 3 },
      { id: 'trend-overview', type: 'trend-chart', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 4 },
      { id: 'ai-analysis', type: 'ai-insight', colSpan: 2, rowSpan: 2, engine: 'protect', priority: 5 },
      { id: 'exec-summary', type: 'document-preview', colSpan: 2, rowSpan: 2, engine: 'protect', priority: 6 },
      { id: 'approval-track', type: 'approval-tracker', colSpan: 4, rowSpan: 1, engine: 'execute', priority: 7 },
    ],
  },
  'UC-02': {
    columns: 3,
    primaryEngine: 'grow',
    cards: [
      { id: 'current-cost', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 1 },
      { id: 'projected-roi', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 2 },
      { id: 'payback-period', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 3 },
      { id: 'roi-simulation', type: 'simulation-result', colSpan: 2, rowSpan: 2, engine: 'grow', priority: 4 },
      { id: 'competitor-bench', type: 'comparison-matrix', colSpan: 1, rowSpan: 2, engine: 'grow', priority: 5 },
      { id: 'ai-recommendation', type: 'ai-insight', colSpan: 3, rowSpan: 1, engine: 'grow', priority: 6 },
    ],
  },
  'UC-03': {
    columns: 3,
    primaryEngine: 'protect',
    cards: [
      { id: 'current-threshold', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 1 },
      { id: 'proposed-change', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 2 },
      { id: 'impact-delta', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'govern', priority: 3 },
      { id: 'simulation', type: 'simulation-result', colSpan: 2, rowSpan: 2, engine: 'protect', priority: 4 },
      { id: 'audit-trail', type: 'audit-trail', colSpan: 1, rowSpan: 2, engine: 'govern', priority: 5 },
      { id: 'approval-flow', type: 'approval-tracker', colSpan: 3, rowSpan: 1, engine: 'execute', priority: 6 },
    ],
  },
  'UC-04': {
    columns: 4,
    primaryEngine: 'execute',
    cards: [
      { id: 'total-licenses', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'execute', priority: 1 },
      { id: 'total-spend', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'execute', priority: 2 },
      { id: 'savings-potential', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 3 },
      { id: 'unused-ratio', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 4 },
      { id: 'license-table', type: 'data-table', colSpan: 3, rowSpan: 2, engine: 'execute', priority: 5 },
      { id: 'ai-reduction-plan', type: 'ai-insight', colSpan: 1, rowSpan: 2, engine: 'execute', priority: 6 },
      { id: 'action-queue', type: 'action-queue', colSpan: 4, rowSpan: 1, engine: 'execute', priority: 7 },
    ],
  },
  'UC-05': {
    columns: 3,
    primaryEngine: 'grow',
    cards: [
      { id: 'competitor-rate', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 1 },
      { id: 'our-current-rate', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 2 },
      { id: 'margin-impact', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 3 },
      { id: 'rate-comparison', type: 'comparison-matrix', colSpan: 2, rowSpan: 2, engine: 'grow', priority: 4 },
      { id: 'ai-counter-plan', type: 'ai-insight', colSpan: 1, rowSpan: 2, engine: 'grow', priority: 5 },
      { id: 'approval-doc', type: 'document-preview', colSpan: 2, rowSpan: 1, engine: 'execute', priority: 6 },
      { id: 'approval-track', type: 'approval-tracker', colSpan: 3, rowSpan: 1, engine: 'execute', priority: 7 },
    ],
  },
  'UC-06': {
    columns: 3,
    primaryEngine: 'grow',
    cards: [
      { id: 'cohort-size', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 1 },
      { id: 'avg-balance', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 2 },
      { id: 'conversion-rate', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 3 },
      { id: 'cohort-table', type: 'data-table', colSpan: 3, rowSpan: 2, engine: 'grow', priority: 4 },
      { id: 'demographic-chart', type: 'trend-chart', colSpan: 3, rowSpan: 1, engine: 'grow', priority: 5 },
    ],
  },
  'UC-07': {
    columns: 3,
    primaryEngine: 'govern',
    cards: [
      { id: 'rejected-count', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'govern', priority: 1 },
      { id: 'override-rate', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'govern', priority: 2 },
      { id: 'model-accuracy', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 3 },
      { id: 'decision-trace', type: 'audit-trail', colSpan: 2, rowSpan: 3, engine: 'govern', priority: 4 },
      { id: 'ai-explanation', type: 'ai-insight', colSpan: 1, rowSpan: 2, engine: 'govern', priority: 5 },
      { id: 'human-review-notes', type: 'human-addon', colSpan: 1, rowSpan: 1, engine: 'govern', priority: 6 },
    ],
  },
  'UC-08': {
    columns: 4,
    primaryEngine: 'protect',
    cards: [
      { id: 'budget-consumed', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 1 },
      { id: 'remaining-budget', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 2 },
      { id: 'burn-rate', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 3 },
      { id: 'days-to-exhaust', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'execute', priority: 4 },
      { id: 'spend-trend', type: 'trend-chart', colSpan: 2, rowSpan: 2, engine: 'protect', priority: 5 },
      { id: 'realloc-simulation', type: 'simulation-result', colSpan: 2, rowSpan: 2, engine: 'grow', priority: 6 },
      { id: 'ai-realloc-plan', type: 'ai-insight', colSpan: 2, rowSpan: 1, engine: 'execute', priority: 7 },
      { id: 'approval-track', type: 'approval-tracker', colSpan: 2, rowSpan: 1, engine: 'execute', priority: 8 },
    ],
  },
  'UC-09': {
    columns: 3,
    primaryEngine: 'govern',
    cards: [
      { id: 'employee-info', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'govern', priority: 1 },
      { id: 'template-name', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'govern', priority: 2 },
      { id: 'permission-count', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'govern', priority: 3 },
      { id: 'access-comparison', type: 'comparison-matrix', colSpan: 2, rowSpan: 2, engine: 'govern', priority: 4 },
      { id: 'risk-assessment', type: 'ai-insight', colSpan: 1, rowSpan: 2, engine: 'protect', priority: 5 },
      { id: 'action-queue', type: 'action-queue', colSpan: 3, rowSpan: 1, engine: 'execute', priority: 6 },
    ],
  },
  'UC-10': {
    columns: 4,
    primaryEngine: 'execute',
    cards: [
      { id: 'churn-risk-score', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 1 },
      { id: 'at-risk-customers', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'protect', priority: 2 },
      { id: 'est-revenue-impact', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'grow', priority: 3 },
      { id: 'retention-budget', type: 'kpi-metric', colSpan: 1, rowSpan: 1, engine: 'execute', priority: 4 },
      { id: 'risk-heatmap', type: 'risk-heatmap', colSpan: 2, rowSpan: 2, engine: 'protect', priority: 5 },
      { id: 'ai-offer-design', type: 'ai-insight', colSpan: 2, rowSpan: 2, engine: 'execute', priority: 6 },
      { id: 'customer-table', type: 'data-table', colSpan: 4, rowSpan: 1, engine: 'execute', priority: 7 },
    ],
  },
}

/**
 * Keyword-based intent resolver (offline fallback / Chunk 2 mock).
 * Maps user input to the best-matching use case.
 */
export function resolveUseCaseByKeywords(input: string): UseCaseId | null {
  const normalized = input.toLowerCase()
  let bestMatch: UseCaseId | null = null
  let bestScore = 0

  for (const [id, def] of Object.entries(USE_CASE_DEFINITIONS)) {
    const score = def.keywords.reduce(
      (acc, kw) => acc + (normalized.includes(kw.toLowerCase()) ? 1 : 0),
      0,
    )
    if (score > bestScore) {
      bestScore = score
      bestMatch = id as UseCaseId
    }
  }

  return bestScore > 0 ? bestMatch : null
}
