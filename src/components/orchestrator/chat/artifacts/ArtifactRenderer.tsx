/**
 * ArtifactRenderer — Dispatches ChatArtifact to the correct visual component.
 * Stub implementation for Chunk 3; individual renderers added in Chunk 4.
 */

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion-presets'
import type { ChatArtifact } from '@/lib/orchestrator/types'
import { engineTokens } from '@/lib/engine-tokens'
import type { EngineName } from '@/lib/engine-tokens'

interface ArtifactRendererProps {
  artifact: ChatArtifact
}

export function ArtifactRenderer({ artifact }: ArtifactRendererProps) {
  const token = engineTokens[artifact.engine as EngineName]
  const borderColor = token?.cssVar ? `var(${token.cssVar})` : 'var(--engine-dashboard)'

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border bg-white/[0.03] overflow-hidden"
      style={{ borderColor: `color-mix(in srgb, ${borderColor} 30%, transparent)` }}
    >
      {/* Engine badge header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: borderColor }}
          />
          <span className="text-xs font-medium text-slate-400">{artifact.title}</span>
        </div>
        {artifact.metadata?.confidence != null && (
          <span className="text-[10px] font-mono text-slate-600">
            {Math.round(artifact.metadata.confidence * 100)}% confidence
          </span>
        )}
      </div>

      {/* Content area — placeholder until Chunk 4 */}
      <div className="px-4 py-6">
        <ArtifactContent artifact={artifact} borderColor={borderColor} />
      </div>

      {/* Risk indicator */}
      {artifact.metadata?.riskLevel && artifact.metadata.riskLevel !== 'low' && (
        <div className="px-4 py-1.5 border-t border-white/[0.04] bg-white/[0.02]">
          <span className={`text-[10px] font-mono uppercase tracking-wider ${getRiskColor(artifact.metadata.riskLevel)}`}>
            {artifact.metadata.riskLevel} risk
          </span>
        </div>
      )}
    </motion.div>
  )
}

ArtifactRenderer.displayName = 'ArtifactRenderer'

// ─── Content Dispatcher ─────────────────────────────────────────────────────

function ArtifactContent({ artifact, borderColor }: { artifact: ChatArtifact; borderColor: string }) {
  switch (artifact.type) {
    case 'kpi-metric':
      return <KpiPlaceholder engine={artifact.engine} color={borderColor} />
    case 'trend-chart':
      return <ChartPlaceholder color={borderColor} />
    case 'risk-heatmap':
      return <HeatmapPlaceholder />
    case 'data-table':
      return <TablePlaceholder />
    case 'simulation-result':
      return <SimulationPlaceholder color={borderColor} />
    case 'friction-gate':
      return <FrictionPlaceholder />
    default:
      return (
        <p className="text-xs text-slate-500 text-center">
          {artifact.type} artifact
        </p>
      )
  }
}

// ─── Placeholder Renderers (replaced in Chunk 4 & 5) ────────────────────────

function KpiPlaceholder({ engine, color }: { engine: string; color: string }) {
  // Mock KPI data per engine
  const kpis: Record<string, { label: string; value: string; delta: string; up: boolean }> = {
    dashboard: { label: 'System Health', value: '98.2%', delta: '+0.3%', up: true },
    protect: { label: 'Threat Score', value: '12', delta: '-3', up: false },
    grow: { label: 'Growth Rate', value: '8.4%', delta: '+1.2%', up: true },
    execute: { label: 'Pending Actions', value: '7', delta: '+2', up: true },
    govern: { label: 'Compliance', value: '94%', delta: '+1%', up: true },
  }
  const kpi = kpis[engine] ?? kpis.dashboard

  return (
    <div className="text-center space-y-1">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{kpi.label}</p>
      <p className="text-3xl font-bold" style={{ color }}>{kpi.value}</p>
      <p className={`text-xs font-mono ${kpi.up ? 'text-emerald-400' : 'text-rose-400'}`}>
        {kpi.delta}
      </p>
    </div>
  )
}

function ChartPlaceholder({ color }: { color: string }) {
  // Simple SVG sparkline
  const points = [20, 35, 25, 45, 30, 55, 40, 50, 60, 55, 70, 65]
  const path = points.map((y, i) => `${i === 0 ? 'M' : 'L'} ${i * 24} ${80 - y}`).join(' ')

  return (
    <svg viewBox="0 0 264 80" className="w-full h-16" aria-label="Trend chart">
      <path d={path} fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
    </svg>
  )
}

function HeatmapPlaceholder() {
  const cells = Array.from({ length: 20 }, (_, i) => {
    const intensity = Math.random()
    const hue = intensity > 0.7 ? 0 : intensity > 0.4 ? 40 : 120
    return `hsl(${hue} 70% ${30 + intensity * 20}%)`
  })
  return (
    <div className="grid grid-cols-5 gap-1" aria-label="Risk heatmap">
      {cells.map((bg, i) => (
        <div key={i} className="h-6 rounded" style={{ backgroundColor: bg }} />
      ))}
    </div>
  )
}

function TablePlaceholder() {
  return (
    <div className="space-y-1 text-xs font-mono text-slate-500">
      <div className="grid grid-cols-3 gap-4 border-b border-white/[0.06] pb-1 text-slate-400">
        <span>Entity</span><span>Status</span><span>Value</span>
      </div>
      {['Alpha Corp', 'Beta Ltd', 'Gamma Inc'].map((name) => (
        <div key={name} className="grid grid-cols-3 gap-4 py-0.5">
          <span className="text-slate-300">{name}</span>
          <span className="text-emerald-400">Active</span>
          <span>¥{(Math.random() * 100).toFixed(1)}M</span>
        </div>
      ))}
    </div>
  )
}

function SimulationPlaceholder({ color }: { color: string }) {
  return (
    <div className="text-center space-y-2">
      <div className="inline-flex items-center gap-2">
        <div className="h-3 w-3 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        <span className="text-xs text-slate-400">Simulation complete</span>
      </div>
      <div className="flex justify-center gap-6">
        {['Best', 'Likely', 'Worst'].map((label, i) => (
          <div key={label} className="text-center">
            <p className="text-[10px] text-slate-500">{label}</p>
            <p className="text-sm font-bold text-slate-300">
              {['+12.4%', '+5.7%', '-3.2%'][i]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FrictionPlaceholder() {
  return (
    <div className="text-center space-y-2">
      <p className="text-xs text-amber-400">⚠ Authorization required</p>
      <button
        disabled
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-6 py-2 text-sm font-medium text-amber-400 cursor-not-allowed opacity-60"
      >
        Authenticate to continue
      </button>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getRiskColor(risk: string): string {
  switch (risk) {
    case 'critical': return 'text-rose-400'
    case 'high': return 'text-amber-400'
    case 'medium': return 'text-yellow-400'
    default: return 'text-slate-500'
  }
}
