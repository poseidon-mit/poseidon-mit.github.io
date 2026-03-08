/**
 * Orchestrator Workspace v4.0 — Suggestion Card
 *
 * Individual proactive suggestion card rendered in DynamicSuggestionBar.
 * Engine-colored accent, confidence indicator, one-click action.
 *
 * Clicking dispatches the suggestion through workspace-flow-engine.
 */

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { engineTokens } from '@/lib/engine-tokens'
import type { DynamicSuggestionCard as SuggestionCardType } from '@/lib/orchestrator/workspace/workspace-types'

export interface SuggestionCardProps {
  suggestion: SuggestionCardType
  onSelect: (suggestion: SuggestionCardType) => void
}

export function SuggestionCard({ suggestion, onSelect }: SuggestionCardProps) {
  const engine = engineTokens[suggestion.engine]
  const confidencePct = Math.round(suggestion.confidence * 100)
  const isHighConfidence = suggestion.confidence >= 0.8

  const handleClick = useCallback(() => {
    onSelect(suggestion)
  }, [suggestion, onSelect])

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={handleClick}
      className={cn(
        'flex-shrink-0 w-[200px] md:w-[220px]',
        'rounded-xl border border-white/[0.08]',
        'bg-white/[0.03] backdrop-blur-sm',
        'p-3 text-left cursor-pointer',
        'hover:bg-white/[0.06] hover:border-white/[0.12]',
        'transition-colors group',
      )}
      style={{
        borderTopWidth: '2px',
        borderTopColor: `color-mix(in srgb, ${engine.color} 40%, transparent)`,
      }}
    >
      {/* Icon + Engine indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg" role="img" aria-label={suggestion.label}>
          {suggestion.icon}
        </span>
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: engine.color }}
          />
          <span className="text-[9px] text-white/30 font-mono uppercase">
            {suggestion.engine}
          </span>
        </div>
      </div>

      {/* Label */}
      <h3 className="text-[12px] font-medium text-white/80 leading-tight mb-1 line-clamp-2">
        {suggestion.label}
      </h3>

      {/* Description */}
      <p className="text-[10px] text-white/40 leading-relaxed mb-2 line-clamp-2">
        {suggestion.description}
      </p>

      {/* Confidence + Source */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full',
                isHighConfidence ? 'bg-emerald-400/50' : 'bg-amber-400/50',
              )}
              style={{ width: `${confidencePct}%` }}
            />
          </div>
          <span
            className={cn(
              'text-[9px] font-mono font-bold tabular-nums',
              isHighConfidence ? 'text-emerald-400/70' : 'text-amber-400/70',
            )}
          >
            {confidencePct}%
          </span>
        </div>
        <span className="text-[9px] text-white/20 font-mono">
          {suggestion.contextSource}
        </span>
      </div>
    </motion.button>
  )
}
