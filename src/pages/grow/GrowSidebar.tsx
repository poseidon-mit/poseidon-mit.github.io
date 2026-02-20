/**
 * GrowSidebar — Right sidebar for the Grow engine page.
 *
 * Contains: 30-year growth projection chart, asset allocation pie chart,
 * and recent activity feed.
 */

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CheckCircle2, TrendingUp as TrendingUpIcon, PieChart as PieChartIcon, Activity } from 'lucide-react'
import { MethodologyCard } from '@/components/poseidon'
import type { ViewMode } from '@/hooks/useViewMode'
import { projectionData, allocationData, recentActivity, growMethodology } from './grow-data'
import { Surface } from '@/design-system'

/* ── Growth Projection Chart ── */

function GrowthProjection() {
  return (
    <Surface variant="glass" padding="none" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
          <TrendingUpIcon size={14} style={{ color: 'var(--engine-grow)' }} aria-hidden="true" />
          30-Year Projection
        </h3>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#64748B' }}>$847k</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--engine-grow)' }}>$2.8M (2054)</span>
      </div>
      <div className="h-32" role="img" aria-label="Growth projection chart showing net worth growing from $847k to projected $2.8M by 2054">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="growGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--engine-grow)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--engine-grow)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="growBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--engine-grow)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--engine-grow)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: '#0F1D32',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F1F5F9',
              }}
              formatter={(value) => [`$${value}k`, '']}
            />
            <Area type="monotone" dataKey="high" stackId="1" stroke="none" fill="url(#growBand)" />
            <Area type="monotone" dataKey="value" stroke="var(--engine-grow)" strokeWidth={2} fill="url(#growGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Surface>
  )
}

/* ── Asset Allocation Pie Chart ── */

function AssetAllocation() {
  return (
    <Surface variant="glass" padding="none" className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        <PieChartIcon size={14} style={{ color: 'var(--engine-grow)' }} aria-hidden="true" />
        Asset Allocation
      </h3>
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 shrink-0" role="img" aria-label="Asset allocation: 62% stocks, 28% bonds, 10% cash">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {allocationData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">
          {allocationData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-xs" style={{ color: '#CBD5E1' }}>{item.name}</span>
              <span className="text-xs font-mono tabular-nums ml-auto" style={{ color: '#94A3B8' }}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--state-healthy)' }}
      >
        <CheckCircle2 size={10} />
        Within target range
      </span>
    </Surface>
  )
}

/* ── Recent Activity Feed ── */

function RecentActivity() {
  return (
    <Surface variant="glass" padding="none" className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        <Activity size={14} style={{ color: 'var(--engine-grow)' }} aria-hidden="true" />
        Recent Activity
      </h3>
      <div className="flex flex-col gap-0">
        {recentActivity.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-2.5"
            style={{
              borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <div
              className="mt-0.5 h-2 w-2 rounded-full shrink-0"
              style={{ background: 'var(--engine-grow)' }}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium" style={{ color: '#F1F5F9' }}>{item.text}</span>
              <span className="text-[10px]" style={{ color: '#64748B' }}>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  )
}

/* ── Sidebar Wrapper ── */

interface GrowSidebarProps {
  viewMode?: ViewMode
}

export function GrowSidebar({ viewMode = 'detail' }: GrowSidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Growth statistics sidebar">
      <GrowthProjection />
      <AssetAllocation />
      <RecentActivity />
      {viewMode === 'deep' && (
        <MethodologyCard
          modelName={growMethodology.modelName}
          modelVersion={growMethodology.modelVersion}
          accuracy={growMethodology.accuracy}
          description={growMethodology.description}
          accentColor="var(--engine-grow)"
        />
      )}
    </aside>
  )
}
