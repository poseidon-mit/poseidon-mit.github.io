/**
 * Autopsy Builder — constructs DecisionAutopsyData from a card's data lineage.
 *
 * Strictly deterministic: NO generative text, NO AI-written summaries.
 * All data is traceable back to source records and calculations.
 *
 * In production, this would query real data lineage APIs.
 * Current implementation provides realistic mock lineage aligned
 * with the streaming-coordinator's mock data.
 */

import type { BentoCardSpec, AuditEvent, ProofBadge } from '@/lib/orchestrator/types'
import type {
  DecisionAutopsyData,
  AutopsyDataSource,
  AutopsyFormula,
  BentoCardStreamingState,
} from './workspace-types'
import { generateId } from '@/lib/orchestrator/crypto'

// ─── Mock Data Lineage per Card Type ────────────────────────────────────────

interface CardLineage {
  dataSources: AutopsyDataSource[]
  formulas: AutopsyFormula[]
  rawInputs: Record<string, unknown>
}

function buildLineage(card: BentoCardSpec, streamingState: BentoCardStreamingState | null): CardLineage {
  const now = new Date().toISOString()
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  switch (card.type) {
    case 'kpi-metric':
      return {
        dataSources: [
          { name: '経理システム GL', fetchTimestamp: fiveMinAgo, recordCount: 1247, status: 'fresh' },
          { name: '予算管理DB', fetchTimestamp: fiveMinAgo, recordCount: 48, status: 'fresh' },
        ],
        formulas: [
          {
            label: '月次予算執行額',
            expression: 'SUM(gl_entries.amount) WHERE period = current_month AND category = "budget_execution"',
            inputs: { period: '2026-03', category: 'budget_execution', record_count: 1247 },
            output: '¥2.4B',
          },
          {
            label: '前月比変動率',
            expression: '((current_month - previous_month) / previous_month) * 100',
            inputs: { current_month: 2400000000, previous_month: 2484000000 },
            output: '-3.4%',
          },
        ],
        rawInputs: {
          query_params: { period: '2026-03', engine: card.engine },
          gl_summary: { total_entries: 1247, date_range: '2026-03-01 to 2026-03-07' },
          streaming_confidence: streamingState?.confidence ?? 0,
        },
      }

    case 'trend-chart':
      return {
        dataSources: [
          { name: '月次集計ビュー', fetchTimestamp: fiveMinAgo, recordCount: 12, status: 'fresh' },
          { name: '予測モデル出力', fetchTimestamp: now, recordCount: 12, status: 'fresh', endpoint: '/api/forecast/monthly' },
        ],
        formulas: [
          {
            label: '月次実績値',
            expression: 'SUM(transactions.amount) GROUP BY MONTH(date)',
            inputs: { date_range: '2025-04 to 2026-03', granularity: 'monthly' },
            output: '12 data points',
          },
          {
            label: '予測値 (線形回帰)',
            expression: 'LinearRegression(historical_12m).predict(next_3m)',
            inputs: { model: 'linear_regression', r_squared: 0.87, training_window: '12 months' },
            output: '3 forecast points',
          },
        ],
        rawInputs: {
          model_metadata: { algorithm: 'linear_regression', r_squared: 0.87, mae: 42.3 },
          data_points: streamingState?.data ?? null,
        },
      }

    case 'risk-heatmap':
      return {
        dataSources: [
          { name: 'リスク評価エンジン', fetchTimestamp: fiveMinAgo, recordCount: 5, status: 'fresh' },
          { name: '外部信用格付DB', fetchTimestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), recordCount: 312, status: 'stale' },
          { name: '内部監査レポート', fetchTimestamp: fiveMinAgo, recordCount: 23, status: 'fresh' },
        ],
        formulas: [
          {
            label: '市場リスクスコア',
            expression: 'WeightedAvg(var_95, stress_test_loss, volatility_index) * sector_weight',
            inputs: { var_95: 0.032, stress_test_loss: -0.08, volatility_index: 22.4, sector_weight: 1.2 },
            output: 65,
          },
          {
            label: '信用リスクスコア',
            expression: 'WeightedAvg(pd_avg, lgd_portfolio, exposure_concentration) * rating_adjustment',
            inputs: { pd_avg: 0.015, lgd_portfolio: 0.42, exposure_concentration: 0.67, rating_adjustment: 1.1 },
            output: 82,
          },
          {
            label: '総合リスクレベル',
            expression: 'Median(sector_scores) → classify(low: <40, medium: 40-70, high: >70)',
            inputs: { sector_scores: [65, 82, 34, 58, 78] },
            output: 'medium',
          },
        ],
        rawInputs: {
          risk_sectors: ['市場リスク', '信用リスク', 'オペリスク', '流動性リスク', 'コンプライアンス'],
          external_ratings_staleness_minutes: 30,
          confidence: streamingState?.confidence ?? 0,
        },
      }

    case 'approval-tracker':
      return {
        dataSources: [
          { name: 'ワークフローエンジン', fetchTimestamp: now, recordCount: 32, status: 'fresh' },
          { name: '承認ルールDB', fetchTimestamp: fiveMinAgo, recordCount: 15, status: 'fresh' },
        ],
        formulas: [
          {
            label: '承認待ち件数',
            expression: 'COUNT(approvals) WHERE status = "pending"',
            inputs: { total_approvals: 32, statuses: { pending: 7, approved: 23, rejected: 2 } },
            output: 7,
          },
          {
            label: '平均処理時間',
            expression: 'AVG(completed_at - submitted_at) WHERE status IN ("approved", "rejected")',
            inputs: { completed_count: 25, total_hours: 105 },
            output: '4.2h',
          },
        ],
        rawInputs: {
          urgent_items: [
            { id: 'APR-091', title: '大口送金承認', amount: '¥50M', deadline: '本日17:00' },
            { id: 'APR-092', title: 'システム変更承認', amount: '—', deadline: '明日12:00' },
          ],
        },
      }

    case 'ai-insight':
      return {
        dataSources: [
          { name: 'Claude Sonnet 4.5', fetchTimestamp: now, recordCount: 1, status: 'fresh', endpoint: 'claude-sonnet-4-5-20250514' },
          { name: '入力コンテキスト', fetchTimestamp: fiveMinAgo, recordCount: 3, status: 'fresh' },
        ],
        formulas: [
          {
            label: 'プロンプト構成',
            expression: 'SystemPrompt + ContextInjection(dataSources[]) + UserQuery',
            inputs: {
              model: 'claude-sonnet-4-5-20250514',
              context_tokens: 4200,
              temperature: 0.3,
              max_output_tokens: 1024,
            },
            output: 'AI生成テキスト (非決定的)',
          },
        ],
        rawInputs: {
          model_id: 'claude-sonnet-4-5-20250514',
          prompt_template: 'financial_analysis_v3',
          input_context_sources: ['gl_summary', 'budget_variance', 'previous_insights'],
          generation_params: { temperature: 0.3, top_p: 0.95, max_tokens: 1024 },
          note: 'AI生成コンテンツ — 出力は非決定的です。ProofBadgeのハッシュで再現性を検証してください。',
        },
      }

    case 'data-table':
      return {
        dataSources: [
          { name: '経理システム GL', fetchTimestamp: fiveMinAgo, recordCount: 4, status: 'fresh' },
          { name: '予算マスタ', fetchTimestamp: fiveMinAgo, recordCount: 4, status: 'fresh' },
        ],
        formulas: [
          {
            label: '差異計算',
            expression: 'actual - budget',
            inputs: { categories: 4 },
            output: '4 variance rows',
          },
          {
            label: '差異率計算',
            expression: '((actual - budget) / budget) * 100',
            inputs: { categories: 4 },
            output: '4 percentage values',
          },
        ],
        rawInputs: {
          columns: ['項目', '予算', '実績', '差異', '差異率'],
          row_count: 4,
          data: streamingState?.data ?? null,
        },
      }

    case 'audit-trail':
      return {
        dataSources: [
          { name: 'SHA-256監査チェーン', fetchTimestamp: now, recordCount: 3, status: 'fresh' },
          { name: 'システムイベントログ', fetchTimestamp: now, recordCount: 156, status: 'fresh' },
        ],
        formulas: [
          {
            label: 'チェーン整合性',
            expression: 'VERIFY(hash[n] == SHA256(payload[n] + hash[n-1])) FOR ALL n',
            inputs: { chain_length: 3, verified_count: 3 },
            output: '整合性確認済み',
          },
        ],
        rawInputs: {
          chain_length: 3,
          latest_hash: generateId().slice(0, 16),
          events: streamingState?.data ?? null,
        },
      }

    default:
      return {
        dataSources: [
          { name: '汎用データソース', fetchTimestamp: now, recordCount: 0, status: 'fresh' },
        ],
        formulas: [],
        rawInputs: { card_type: card.type, engine: card.engine },
      }
  }
}

// ─── Mock Audit Events for a Card ───────────────────────────────────────────

function buildAuditEvents(card: BentoCardSpec): AuditEvent[] {
  const now = Date.now()

  return [
    {
      id: generateId(),
      timestamp: new Date(now - 120000).toISOString(),
      type: 'DATA_FETCHED',
      actor: { type: 'system', id: 'streaming-coordinator', label: 'ストリーミングコーディネーター' },
      payload: { cardId: card.id, cardType: card.type, phase: 'skeleton' },
      hash: generateId().slice(0, 16),
      previousHash: '0'.repeat(16),
    },
    {
      id: generateId(),
      timestamp: new Date(now - 60000).toISOString(),
      type: 'DATA_FETCHED',
      actor: { type: 'system', id: `engine-${card.engine}`, label: `${card.engine}エンジン` },
      payload: { cardId: card.id, cardType: card.type, phase: 'streaming', confidence: 0.5 },
      hash: generateId().slice(0, 16),
      previousHash: generateId().slice(0, 16),
    },
    {
      id: generateId(),
      timestamp: new Date(now).toISOString(),
      type: 'DATA_FETCHED',
      actor: { type: 'system', id: `engine-${card.engine}`, label: `${card.engine}エンジン` },
      payload: { cardId: card.id, cardType: card.type, phase: 'complete' },
      hash: generateId().slice(0, 16),
      previousHash: generateId().slice(0, 16),
    },
  ]
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Build a DecisionAutopsyData for a given card.
 * Strictly deterministic — NO generative content.
 */
export function buildAutopsyData(
  card: BentoCardSpec,
  streamingState: BentoCardStreamingState | null,
): DecisionAutopsyData {
  const lineage = buildLineage(card, streamingState)

  return {
    cardId: card.id,
    cardType: card.type,
    engine: card.engine,
    dataSources: lineage.dataSources,
    formulas: lineage.formulas,
    auditEvents: buildAuditEvents(card),
    rawInputs: lineage.rawInputs,
    proofBadge: streamingState?.proofBadge ?? null,
    computedAt: new Date().toISOString(),
  }
}
