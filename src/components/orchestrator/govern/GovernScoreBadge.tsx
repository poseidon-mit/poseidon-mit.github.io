/**
 * Orchestrator Workbench v2.0 — Govern Score Badge
 * Visual governance score display with 4-dimension breakdown.
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { getGovernScoreLabel, getGovernScoreColor } from '@/lib/orchestrator/types'

export function GovernScoreBadge() {
  const { state } = useWorkbenchContext()
  const { governScore } = state
  const isGovern = state.themeMode.mode === 'govern'
  const color = getGovernScoreColor(governScore.overall)
  const label = getGovernScoreLabel(governScore.overall)

  const dimensions = [
    { key: 'auditability', label: '監査性', value: governScore.dimensions.auditability },
    { key: 'explainability', label: '説明可能性', value: governScore.dimensions.explainability },
    { key: 'compliance', label: 'コンプライアンス', value: governScore.dimensions.compliance },
    { key: 'humanOversight', label: '人間監視', value: governScore.dimensions.humanOversight },
  ]

  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        isGovern
          ? 'border-blue-500/15 bg-blue-950/20'
          : 'border-white/[0.06] bg-white/[0.02]',
      )}
    >
      {/* Overall Score */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-12 h-12">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-white/[0.06]"
            />
            {/* Score ring */}
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(governScore.overall / 100) * 97.4} 97.4`}
              initial={{ strokeDasharray: '0 97.4' }}
              animate={{ strokeDasharray: `${(governScore.overall / 100) * 97.4} 97.4` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-xs font-bold"
            style={{ color }}
          >
            {governScore.overall}
          </span>
        </div>
        <div>
          <div className="text-xs font-semibold text-white/80">Govern Score</div>
          <div className="text-[10px] font-mono" style={{ color }}>
            {label}
          </div>
        </div>
      </div>

      {/* Dimension Bars */}
      <div className="space-y-2">
        {dimensions.map((dim) => (
          <div key={dim.key}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] text-white/40">{dim.label}</span>
              <span className="text-[10px] font-mono text-white/50">{dim.value}</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dim.value}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: getGovernScoreColor(dim.value) }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Computed At */}
      <div className="mt-3 text-[9px] text-white/15 font-mono">
        Computed: {new Date(governScore.computedAt).toLocaleString('ja-JP')}
      </div>
    </div>
  )
}
