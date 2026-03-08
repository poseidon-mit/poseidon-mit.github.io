/**
 * Streaming Coordinator — manages per-card simulated SSE streams.
 *
 * In production, each card would connect to a real SSE/WebSocket endpoint.
 * Current implementation provides realistic mock streaming with:
 *   - Staggered timing (skeleton → streaming → complete)
 *   - Partial data delivery during streaming phase
 *   - Confidence score assignment based on card type + engine
 *   - Countdown timer estimation
 */

import type { BentoCardSpec, IntentResult, ProofBadge } from '@/lib/orchestrator/types'
import type { BentoCardStreamingState } from './workspace-types'
import { generateId } from '@/lib/orchestrator/crypto'

// ─── Stream Update Callback ─────────────────────────────────────────────────

export type StreamUpdateCallback = (
  update: Partial<BentoCardStreamingState>,
) => void

// ─── Mock Data Generators ───────────────────────────────────────────────────

interface MockCardData {
  partialData: unknown
  fullData: unknown
  confidence: number
}

function generateMockData(card: BentoCardSpec, intent: IntentResult): MockCardData {
  const engine = card.engine

  switch (card.type) {
    case 'kpi-metric':
      return {
        partialData: { value: '---', label: '読み込み中...' },
        fullData: {
          value: engine === 'execute' ? '¥2.4B' : engine === 'protect' ? '97.3%' : '¥847M',
          change: engine === 'protect' ? '+2.1%' : '-3.4%',
          trend: engine === 'protect' ? 'up' : 'down',
          label:
            engine === 'execute'
              ? '月次予算執行額'
              : engine === 'protect'
                ? 'AML準拠率'
                : '四半期収益予測',
          period: intent.rawInput.includes('Q') ? intent.rawInput : '当四半期',
        },
        confidence: 0.92,
      }

    case 'trend-chart':
      return {
        partialData: { points: [], loading: true },
        fullData: {
          points: Array.from({ length: 12 }, (_, i) => ({
            month: `${i + 1}月`,
            value: Math.round(700 + Math.random() * 300),
            forecast: Math.round(750 + Math.random() * 250),
          })),
          label: '月次推移',
          unit: '百万円',
        },
        confidence: 0.85,
      }

    case 'risk-heatmap':
      return {
        partialData: { sectors: [], loading: true },
        fullData: {
          sectors: [
            { name: '市場リスク', level: 'medium', score: 65 },
            { name: '信用リスク', level: 'high', score: 82 },
            { name: 'オペリスク', level: 'low', score: 34 },
            { name: '流動性リスク', level: 'medium', score: 58 },
            { name: 'コンプライアンス', level: 'high', score: 78 },
          ],
          overallRisk: 'medium',
        },
        confidence: 0.78,
      }

    case 'approval-tracker':
      return {
        partialData: { pending: '...' },
        fullData: {
          pending: 7,
          approved: 23,
          rejected: 2,
          avgTimeHours: 4.2,
          urgentItems: [
            { id: 'APR-091', title: '大口送金承認', amount: '¥50M', deadline: '本日17:00' },
            { id: 'APR-092', title: 'システム変更承認', amount: '—', deadline: '明日12:00' },
          ],
        },
        confidence: 0.95,
      }

    case 'ai-insight':
      return {
        partialData: { generating: true },
        fullData: {
          summary:
            engine === 'govern'
              ? 'AML閾値超過アラートが前月比15%増加。重点監視対象3件を検出。'
              : '予算差異は主に人件費(+8.2%)と外注費(-12.1%)に集中。',
          keyPoints: [
            engine === 'govern'
              ? '重点監視: 口座ID-7834, ID-9102, ID-4521'
              : '人件費超過の主因: Q2採用計画の前倒し',
            engine === 'govern'
              ? '閾値超過パターン: 週末深夜帯に集中'
              : '外注費削減: プロジェクトAlpha完了による自然減',
          ],
          modelId: 'claude-sonnet-4-5-20250514',
          generatedAt: new Date().toISOString(),
        },
        confidence: 0.72,
      }

    case 'data-table':
      return {
        partialData: { rows: [], columns: [] },
        fullData: {
          columns: ['項目', '予算', '実績', '差異', '差異率'],
          rows: [
            ['人件費', '¥120M', '¥129.8M', '+¥9.8M', '+8.2%'],
            ['外注費', '¥85M', '¥74.7M', '-¥10.3M', '-12.1%'],
            ['設備費', '¥45M', '¥43.2M', '-¥1.8M', '-4.0%'],
            ['通信費', '¥12M', '¥13.1M', '+¥1.1M', '+9.2%'],
          ],
        },
        confidence: 0.98,
      }

    case 'audit-trail':
      return {
        partialData: { events: [] },
        fullData: {
          events: [
            { time: '09:15', action: 'AML閾値チェック実行', actor: 'System', status: 'completed' },
            { time: '09:16', action: 'アラート3件生成', actor: 'AI Model', status: 'completed' },
            { time: '09:20', action: 'CCO通知送信', actor: 'System', status: 'pending' },
          ],
        },
        confidence: 1.0,
      }

    default:
      return {
        partialData: null,
        fullData: { message: 'データ取得完了' },
        confidence: 0.8,
      }
  }
}

// ─── Streaming Lifecycle ────────────────────────────────────────────────────

/**
 * Stream data for a single card through the full lifecycle:
 *   skeleton (already set) → streaming (partial) → complete (full data)
 *
 * Each phase has realistic timing to simulate real SSE delivery.
 */
export async function streamCardData(
  card: BentoCardSpec,
  intent: IntentResult,
  onUpdate: StreamUpdateCallback,
): Promise<void> {
  const mock = generateMockData(card, intent)

  // Phase 1: Skeleton → Streaming transition (500-1500ms)
  const skeletonDuration = 500 + Math.random() * 1000
  await delay(skeletonDuration)

  onUpdate({
    streamingStatus: 'streaming',
    partialData: mock.partialData,
    estimatedTimeRemainingMs: 2000 + Math.random() * 1500,
    confidence: mock.confidence * 0.5, // partial confidence during streaming
  })

  // Phase 2: Streaming progress updates (2-4 updates over 1-3 seconds)
  const updateCount = 2 + Math.floor(Math.random() * 3)
  const updateInterval = (1000 + Math.random() * 2000) / updateCount

  for (let i = 0; i < updateCount; i++) {
    await delay(updateInterval)
    const progress = (i + 1) / updateCount
    onUpdate({
      streamingStatus: 'streaming',
      confidence: mock.confidence * (0.5 + progress * 0.3),
      estimatedTimeRemainingMs: Math.max(0, (1 - progress) * 2000),
    })
  }

  // Phase 3: Complete
  const proof: ProofBadge = {
    type: card.type === 'ai-insight' ? 'ai-generated' : 'system-data',
    hash: generateId().slice(0, 16),
    verifiedAt: new Date().toISOString(),
    source: card.dataSource?.label ?? card.type,
    tamperDetected: false,
  }

  onUpdate({
    streamingStatus: 'complete',
    data: mock.fullData,
    confidence: mock.confidence,
    estimatedTimeRemainingMs: 0,
    partialData: null,
    completedStreamingAt: new Date().toISOString(),
    loading: false,
    proofBadge: proof,
  })
}

// ─── Re-stream a Single Card ────────────────────────────────────────────────

/**
 * Re-stream a single card (e.g., after a GenerativeUI control change).
 */
export async function restreamCard(
  card: BentoCardSpec,
  intent: IntentResult,
  onUpdate: StreamUpdateCallback,
): Promise<void> {
  // Reset to skeleton
  onUpdate({
    streamingStatus: 'skeleton',
    confidence: 0,
    estimatedTimeRemainingMs: 3000,
    partialData: null,
    data: null,
    loading: true,
    startedStreamingAt: new Date().toISOString(),
    completedStreamingAt: undefined,
  })

  await streamCardData(card, intent, onUpdate)
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
