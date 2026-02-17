/**
 * ExecuteSidebar — Right-rail sidebar for the Execute engine page.
 *
 * Contains: ExecutionStats, ConfidenceChart, RecentExecutionsTimeline.
 */

import {
  CheckCircle2,
  XCircle,
  Zap,
  Clock,
  CircleDot,
  Calendar,
  Gauge,
  History,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { GlassCard, MethodologyCard } from '@/components/poseidon'
import {
  recentExecutions,
  confidenceData,
  statusConfig,
  engineColor,
  engineBg,
  executeMethodology,
} from './execute-data'
import type { Engine } from '@/types/engine-data'
import type { ViewMode } from '@/hooks/useViewMode'

/* ── Local EngineBadge (Execute-specific inline style) ── */

function EngineBadge({ engine }: { engine: Engine }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: engineBg[engine], color: engineColor[engine] }}
    >
      <CircleDot size={10} />
      {engine}
    </span>
  )
}

/* ═══════════════════════════════════════════
   EXECUTION STATS
   ═══════════════════════════════════════════ */

function ExecutionStats() {
  const stats = [
    { label: 'Approved', value: 12, color: '#10B981', icon: CheckCircle2 },
    { label: 'Rejected', value: 3, color: '#EF4444', icon: XCircle },
    { label: 'Auto-executed', value: 8, color: '#14B8A6', icon: Zap },
    { label: 'Pending review', value: 4, color: '#EAB308', icon: Clock },
  ]

  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        <Calendar size={14} style={{ color: '#EAB308' }} aria-hidden="true" />
        {"Today's Activity"}
      </h3>
      <div className="flex flex-col gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  background: `${s.color}15`,
                }}
              >
                <s.icon size={14} style={{ color: s.color }} />
              </div>
              <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>
                {s.label}
              </span>
            </div>
            <span className="text-base font-bold tabular-nums" style={{ color: s.color }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

/* ═══════════════════════════════════════════
   CONFIDENCE CHART
   ═══════════════════════════════════════════ */

function ConfidenceChart() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        <Gauge size={14} style={{ color: '#EAB308' }} aria-hidden="true" />
        Confidence Scores
      </h3>
      <div className="h-36" role="img" aria-label="Confidence score distribution chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={confidenceData} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
            <XAxis
              type="number"
              hide
              domain={[0, 8]}
            />
            <YAxis
              type="category"
              dataKey="range"
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              width={54}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                background: '#0F1D32',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F1F5F9',
              }}
              formatter={(value: number) => [`${value} actions`, 'Count']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
              {confidenceData.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

/* ═══════════════════════════════════════════
   RECENT EXECUTIONS TIMELINE
   ═══════════════════════════════════════════ */

function RecentExecutionsTimeline() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        <History size={14} style={{ color: '#EAB308' }} aria-hidden="true" />
        Recent Executions
      </h3>
      <div className="flex flex-col gap-0">
        {recentExecutions.map((item, i) => {
          const cfg = statusConfig[item.status]
          return (
            <div
              key={i}
              className="flex items-start gap-3 py-2.5"
              style={{
                borderBottom:
                  i < recentExecutions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div
                className="mt-0.5 h-2 w-2 rounded-full shrink-0"
                style={{ background: cfg.color }}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs font-medium truncate" style={{ color: '#F1F5F9' }}>
                  {item.action}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <EngineBadge engine={item.engine} />
                  <span className="text-[10px]" style={{ color: '#64748B' }}>
                    {item.timeAgo}
                  </span>
                </div>
              </div>
              <span
                className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: cfg.bg, color: cfg.color }}
              >
                {item.status}
              </span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

/* ═══════════════════════════════════════════
   EXPORTED COMPOSITE
   ═══════════════════════════════════════════ */

export interface ExecuteSidebarProps {
  viewMode?: ViewMode
}

export function ExecuteSidebar({ viewMode = 'detail' }: ExecuteSidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Execution statistics sidebar">
      <ExecutionStats />
      <ConfidenceChart />
      <RecentExecutionsTimeline />
      {viewMode === 'deep' && (
        <MethodologyCard
          modelName={executeMethodology.modelName}
          modelVersion={executeMethodology.modelVersion}
          accuracy={executeMethodology.accuracy}
          description={executeMethodology.description}
          accentColor="#EAB308"
        />
      )}
    </aside>
  )
}

export default ExecuteSidebar
