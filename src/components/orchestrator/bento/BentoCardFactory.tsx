/**
 * Orchestrator Workbench v2.0 — Bento Card Factory
 * Maps BentoCardType → concrete card component.
 * Placeholder implementations until Chunk 3 fills real card types.
 */

import type { BentoCardSpec, BentoCardState, BentoCardType } from '@/lib/orchestrator/types'
import { engineTokens } from '@/lib/engine-tokens'

export interface BentoCardContentProps {
  spec: BentoCardSpec
  state: BentoCardState | null
}

// ─── Placeholder Card (used until real card types are implemented) ────────────

function PlaceholderCard({ spec }: BentoCardContentProps) {
  const engine = engineTokens[spec.engine]
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1 text-white/30">
      <span className="text-2xl">{getTypeIcon(spec.type)}</span>
      <span className="text-[10px] font-mono uppercase">{spec.type}</span>
      <span
        className="text-[9px] font-mono"
        style={{ color: `color-mix(in srgb, ${engine.color} 60%, white)` }}
      >
        {engine.label}
      </span>
    </div>
  )
}

// ─── KPI Metric Card ─────────────────────────────────────────────────────────

function KpiMetricCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as { label?: string; value?: string | number; delta?: string; deltaType?: 'positive' | 'negative' | 'neutral' } | null
  const engine = engineTokens[spec.engine]

  return (
    <div className="flex flex-col justify-between h-full">
      <span className="text-[11px] text-white/50 font-medium">
        {data?.label ?? spec.id.replace(/-/g, ' ')}
      </span>
      <div className="flex items-end gap-2">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ color: engine.color }}
        >
          {data?.value ?? '—'}
        </span>
        {data?.delta && (
          <span
            className={`text-xs font-mono mb-0.5 ${
              data.deltaType === 'positive'
                ? 'text-green-400'
                : data.deltaType === 'negative'
                  ? 'text-red-400'
                  : 'text-white/40'
            }`}
          >
            {data.delta}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Trend Chart Card ────────────────────────────────────────────────────────

function TrendChartCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as { label?: string; points?: number[] } | null
  const engine = engineTokens[spec.engine]
  const points = data?.points ?? [40, 55, 45, 60, 52, 68, 72, 65, 80, 75, 85, 90]

  // Simple SVG sparkline
  const width = 200
  const height = 60
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const pathD = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width
      const y = height - ((p - min) / range) * height
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <div className="flex flex-col h-full">
      <span className="text-[11px] text-white/50 font-medium mb-2">
        {data?.label ?? spec.id.replace(/-/g, ' ')}
      </span>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full flex-1" preserveAspectRatio="none">
        <path d={pathD} fill="none" stroke={engine.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        <path d={`${pathD} L ${width} ${height} L 0 ${height} Z`} fill={engine.color} opacity="0.05" />
      </svg>
    </div>
  )
}

// ─── AI Insight Card ─────────────────────────────────────────────────────────

function AiInsightCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as { title?: string; summary?: string; model?: string } | null

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full font-mono">
          🤖 AI Insight
        </span>
        {data?.model && (
          <span className="text-[9px] text-white/30 font-mono">{data.model}</span>
        )}
      </div>
      <p className="text-xs text-white/70 leading-relaxed flex-1">
        {data?.summary ?? 'AI分析結果を読み込み中...'}
      </p>
    </div>
  )
}

// ─── Data Table Card ─────────────────────────────────────────────────────────

function DataTableCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as { headers?: string[]; rows?: string[][] } | null
  const headers = data?.headers ?? ['項目', '値', '変動']
  const rows = data?.rows ?? [
    ['サンプル A', '¥1,234,567', '+2.3%'],
    ['サンプル B', '¥987,654', '-1.1%'],
    ['サンプル C', '¥2,345,678', '+5.7%'],
  ]

  return (
    <div className="flex flex-col h-full overflow-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-1.5 px-2 text-white/40 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
              {row.map((cell, ci) => (
                <td key={ci} className="py-1.5 px-2 text-white/60">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Approval Tracker Card ───────────────────────────────────────────────────

function ApprovalTrackerCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as { steps?: { label: string; status: string }[] } | null
  const steps = data?.steps ?? [
    { label: 'AI準備完了', status: 'completed' },
    { label: 'マネージャー承認', status: 'in-progress' },
    { label: '実行待機', status: 'pending' },
  ]

  return (
    <div className="flex items-center gap-2 h-full px-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step.status === 'completed'
                  ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30'
                  : step.status === 'in-progress'
                    ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30 animate-pulse'
                    : 'bg-white/5 text-white/30 ring-1 ring-white/10'
              }`}
            >
              {step.status === 'completed' ? '✓' : i + 1}
            </div>
            <span className="text-[9px] text-white/50 text-center whitespace-nowrap">
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-[2px] rounded-full ${
                step.status === 'completed' ? 'bg-green-500/30' : 'bg-white/10'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Human Addon Card ────────────────────────────────────────────────────────

function HumanAddonCard({ spec, state }: BentoCardContentProps) {
  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full">
          📌 Human Note
        </span>
      </div>
      <div className="flex-1 rounded-lg border border-dashed border-amber-500/20 p-2">
        <p className="text-xs text-white/50 italic">
          {state?.humanAddons?.[0]?.content ?? 'メモを追加...'}
        </p>
      </div>
    </div>
  )
}

// ─── Risk Heatmap Card ──────────────────────────────────────────────────────

function RiskHeatmapCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as {
    label?: string
    cells?: { row: string; col: string; value: number }[]
    rows?: string[]
    cols?: string[]
  } | null
  const engine = engineTokens[spec.engine]

  const rows = data?.rows ?? ['信用リスク', '市場リスク', 'オペリスク']
  const cols = data?.cols ?? ['Q1', 'Q2', 'Q3', 'Q4']
  const cells = data?.cells ?? rows.flatMap((r, ri) =>
    cols.map((c, ci) => ({
      row: r,
      col: c,
      value: Math.round(20 + Math.random() * 80),
    })),
  )

  function getCellColor(value: number): string {
    if (value >= 80) return 'rgba(239, 68, 68, 0.6)'
    if (value >= 60) return 'rgba(245, 158, 11, 0.5)'
    if (value >= 40) return 'rgba(234, 179, 8, 0.3)'
    return 'rgba(34, 197, 94, 0.2)'
  }

  return (
    <div className="flex flex-col h-full">
      <span className="text-[11px] text-white/50 font-medium mb-2">
        {data?.label ?? 'Risk Heatmap'}
      </span>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr>
              <th className="py-1 px-1.5 text-left text-white/30" />
              {cols.map((c, i) => (
                <th key={i} className="py-1 px-1.5 text-center text-white/40 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                <td className="py-1 px-1.5 text-white/50 whitespace-nowrap">{r}</td>
                {cols.map((c, ci) => {
                  const cell = cells.find((ce) => ce.row === r && ce.col === c)
                  const val = cell?.value ?? 0
                  return (
                    <td key={ci} className="py-1 px-1.5 text-center">
                      <div
                        className="rounded px-2 py-1 text-white/80 font-mono text-[9px]"
                        style={{ backgroundColor: getCellColor(val) }}
                      >
                        {val}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Action Queue Card ──────────────────────────────────────────────────────

function ActionQueueCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as {
    actions?: { id: string; label: string; status: string; riskLevel: string }[]
  } | null
  const engine = engineTokens[spec.engine]

  const actions = data?.actions ?? [
    { id: '1', label: 'SaaSライセンス削除 (Slack)', status: 'ready', riskLevel: 'medium' },
    { id: '2', label: 'SaaSライセンス削除 (Zoom)', status: 'pending-approval', riskLevel: 'high' },
    { id: '3', label: '権限テンプレート適用', status: 'queued', riskLevel: 'low' },
  ]

  const statusStyles: Record<string, string> = {
    ready: 'bg-green-500/20 text-green-400',
    'pending-approval': 'bg-amber-500/20 text-amber-400',
    queued: 'bg-white/5 text-white/40',
    executing: 'bg-cyan-500/20 text-cyan-400',
  }

  const riskDot: Record<string, string> = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-red-500',
    critical: 'bg-red-600 animate-pulse',
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[11px] text-white/50 font-medium">Action Queue</span>
        <span className="text-[9px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded-full font-mono">
          {actions.length}
        </span>
      </div>
      <div className="flex-1 space-y-1.5 overflow-auto">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.04]"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${riskDot[action.riskLevel] ?? 'bg-white/20'}`} />
            <span className="text-[10px] text-white/60 flex-1 truncate">{action.label}</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-mono ${statusStyles[action.status] ?? 'bg-white/5 text-white/30'}`}>
              {action.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Audit Trail Card ───────────────────────────────────────────────────────

function AuditTrailCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as {
    events?: { type: string; actor: string; timestamp: string; hash: string }[]
  } | null

  const events = data?.events ?? [
    { type: 'INTENT_PARSED', actor: 'System', timestamp: new Date().toISOString(), hash: 'a1b2c3d4' },
    { type: 'AI_GENERATION', actor: 'GPT-4o', timestamp: new Date().toISOString(), hash: 'e5f6g7h8' },
    { type: 'HUMAN_REVIEW', actor: 'Tanaka K.', timestamp: new Date().toISOString(), hash: 'i9j0k1l2' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[11px] text-white/50 font-medium">Audit Trail</span>
        <span className="text-[9px] text-green-400 font-mono">🔗 chain valid</span>
      </div>
      <div className="flex-1 space-y-1 overflow-auto">
        {events.map((event, i) => (
          <div
            key={i}
            className="flex items-start gap-2 px-2 py-1.5 rounded-md bg-white/[0.02]"
          >
            <div className="w-1 h-full min-h-[24px] rounded-full bg-blue-500/30 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-blue-400">{event.type}</span>
                <span className="text-[8px] text-white/25 font-mono">{event.hash}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] text-white/40">{event.actor}</span>
                <span className="text-[8px] text-white/20">
                  {new Date(event.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Document Preview Card ──────────────────────────────────────────────────

function DocumentPreviewCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as {
    title?: string
    type?: string
    pages?: number
    excerpt?: string
    status?: string
  } | null

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">
          📄 Document
        </span>
        {data?.type && (
          <span className="text-[9px] text-white/30 font-mono uppercase">{data.type}</span>
        )}
      </div>
      <div className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 overflow-auto">
        <h4 className="text-xs text-white/70 font-medium mb-2">
          {data?.title ?? '取締役会向け エグゼクティブサマリー'}
        </h4>
        <p className="text-[10px] text-white/40 leading-relaxed">
          {data?.excerpt ?? '本レポートは2024年度Q3における主要リスク指標の変動とAI分析結果を要約したものです。市場リスク、信用リスク、規制リスクの3軸で評価を実施しました。'}
        </p>
      </div>
      <div className="flex items-center justify-between text-[9px] text-white/30">
        <span>{data?.pages ?? 12} pages</span>
        <span className={data?.status === 'approved' ? 'text-green-400' : 'text-amber-400'}>
          {data?.status ?? 'draft'}
        </span>
      </div>
    </div>
  )
}

// ─── Comparison Matrix Card ─────────────────────────────────────────────────

function ComparisonMatrixCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as {
    label?: string
    items?: { name: string; scores: Record<string, number> }[]
    dimensions?: string[]
  } | null
  const engine = engineTokens[spec.engine]

  const dimensions = data?.dimensions ?? ['コスト', '機能', 'セキュリティ', 'UX']
  const items = data?.items ?? [
    { name: 'プランA', scores: { コスト: 8, 機能: 7, セキュリティ: 9, UX: 6 } },
    { name: 'プランB', scores: { コスト: 6, 機能: 9, セキュリティ: 7, UX: 8 } },
    { name: '現行', scores: { コスト: 5, 機能: 5, セキュリティ: 6, UX: 5 } },
  ]

  return (
    <div className="flex flex-col h-full">
      <span className="text-[11px] text-white/50 font-medium mb-2">
        {data?.label ?? 'Comparison'}
      </span>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="py-1 px-1.5 text-left text-white/30" />
              {items.map((item, i) => (
                <th key={i} className="py-1 px-1.5 text-center text-white/50 font-medium">
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim) => (
              <tr key={dim} className="border-b border-white/[0.03]">
                <td className="py-1.5 px-1.5 text-white/40">{dim}</td>
                {items.map((item, i) => {
                  const score = item.scores[dim] ?? 0
                  return (
                    <td key={i} className="py-1.5 px-1.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${score * 10}%`,
                              backgroundColor: engine.color,
                              opacity: 0.6 + score * 0.04,
                            }}
                          />
                        </div>
                        <span className="text-[9px] text-white/40 font-mono w-4 text-right">{score}</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Simulation Result Card ─────────────────────────────────────────────────

function SimulationResultCard({ spec, state }: BentoCardContentProps) {
  const data = state?.data as {
    label?: string
    scenarios?: { name: string; value: string; probability: number; type: 'best' | 'base' | 'worst' }[]
    confidence?: number
  } | null
  const engine = engineTokens[spec.engine]

  const scenarios = data?.scenarios ?? [
    { name: '楽観シナリオ', value: '+¥24.5M', probability: 25, type: 'best' as const },
    { name: '基本シナリオ', value: '+¥12.3M', probability: 55, type: 'base' as const },
    { name: '悲観シナリオ', value: '-¥3.8M', probability: 20, type: 'worst' as const },
  ]

  const scenarioColors = {
    best: 'text-green-400 bg-green-500/10',
    base: 'text-blue-400 bg-blue-500/10',
    worst: 'text-red-400 bg-red-500/10',
  }

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-white/50 font-medium">
          {data?.label ?? 'Simulation'}
        </span>
        <span className="text-[9px] font-mono text-white/25">
          信頼度: {data?.confidence ?? 82}%
        </span>
      </div>
      <div className="flex-1 space-y-2">
        {scenarios.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-white/50">{s.name}</span>
                <span className={`text-[11px] font-mono font-bold ${scenarioColors[s.type]?.split(' ')[0]}`}>
                  {s.value}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${scenarioColors[s.type]?.split(' ')[1]}`}
                  style={{
                    width: `${s.probability}%`,
                    backgroundColor: s.type === 'best'
                      ? 'rgb(34 197 94 / 0.4)'
                      : s.type === 'worst'
                        ? 'rgb(239 68 68 / 0.4)'
                        : `color-mix(in srgb, ${engine.color} 40%, transparent)`,
                  }}
                />
              </div>
              <span className="text-[8px] text-white/25 font-mono">{s.probability}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Type → Icon map ─────────────────────────────────────────────────────────

function getTypeIcon(type: BentoCardType): string {
  const icons: Record<BentoCardType, string> = {
    'kpi-metric': '📊',
    'trend-chart': '📈',
    'risk-heatmap': '🌡',
    'approval-tracker': '🍕',
    'ai-insight': '🤖',
    'human-addon': '📌',
    'data-table': '📋',
    'action-queue': '⚡',
    'audit-trail': '🔗',
    'document-preview': '📄',
    'comparison-matrix': '⚖',
    'simulation-result': '🧪',
  }
  return icons[type] ?? '📦'
}

// ─── Factory ─────────────────────────────────────────────────────────────────

const CARD_COMPONENTS: Record<BentoCardType, React.ComponentType<BentoCardContentProps>> = {
  'kpi-metric': KpiMetricCard,
  'trend-chart': TrendChartCard,
  'ai-insight': AiInsightCard,
  'human-addon': HumanAddonCard,
  'approval-tracker': ApprovalTrackerCard,
  'data-table': DataTableCard,
  'risk-heatmap': RiskHeatmapCard,
  'action-queue': ActionQueueCard,
  'audit-trail': AuditTrailCard,
  'document-preview': DocumentPreviewCard,
  'comparison-matrix': ComparisonMatrixCard,
  'simulation-result': SimulationResultCard,
}

export function BentoCardFactory({ spec, state }: BentoCardContentProps) {
  const Component = CARD_COMPONENTS[spec.type] ?? PlaceholderCard
  return <Component spec={spec} state={state} />
}
