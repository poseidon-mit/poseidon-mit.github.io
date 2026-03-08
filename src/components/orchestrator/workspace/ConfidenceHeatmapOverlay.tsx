/**
 * Orchestrator Workspace v4.0 — Confidence Heatmap Overlay
 *
 * Reads all streaming card states from context.
 * Renders a floating summary panel showing confidence distribution
 * across all active cards.
 *
 * Cards with confidence < 0.8 are flagged — clicking them in the overlay
 * navigates to the Decision Autopsy Drawer for that card.
 *
 * This component overlays on top of the StreamingBentoGrid as a
 * compact floating indicator (bottom-right), expandable to full view.
 */

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { engineTokens } from '@/lib/engine-tokens'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import type { BentoCardStreamingState } from '@/lib/orchestrator/workspace/workspace-types'

// ─── Types ──────────────────────────────────────────────────────────────────

interface CardConfidenceSummary {
  cardId: string
  cardType: string
  engine: string
  confidence: number
  status: BentoCardStreamingState['streamingStatus']
  source: string
}

// ─── Confidence Classification ──────────────────────────────────────────────

function classifyConfidence(c: number): 'high' | 'medium' | 'low' {
  if (c >= 0.8) return 'high'
  if (c >= 0.6) return 'medium'
  return 'low'
}

const confidenceColors = {
  high: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-400/40' },
  medium: { bg: 'bg-amber-500/15', text: 'text-amber-400', ring: 'ring-amber-400/60' },
  low: { bg: 'bg-red-500/15', text: 'text-red-400', ring: 'ring-red-500/40' },
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ConfidenceHeatmapOverlay() {
  const { state, dispatch } = useWorkbenchContext()
  const [expanded, setExpanded] = useState(false)

  const streamingCards = state.workspace.streamingCards
  const layout = state.activeBentoLayout

  // ─── Build summaries from streaming cards ──────────────────────────────
  const summaries = useMemo((): CardConfidenceSummary[] => {
    if (!layout) return []

    const results: CardConfidenceSummary[] = []
    for (const cardSpec of layout.cards) {
      const streaming = streamingCards[cardSpec.id]
      if (!streaming) continue
      results.push({
        cardId: cardSpec.id,
        cardType: cardSpec.type as string,
        engine: cardSpec.engine,
        confidence: streaming.confidence ?? 0,
        status: streaming.streamingStatus,
        source: streaming.streamingSource ?? '',
      })
    }
    return results.sort((a, b) => a.confidence - b.confidence)
  }, [layout, streamingCards])

  // ─── Aggregates ────────────────────────────────────────────────────────
  const completedCards = summaries.filter((s) => s.status === 'complete')
  const lowConfidenceCount = completedCards.filter(
    (s) => classifyConfidence(s.confidence) !== 'high',
  ).length
  const avgConfidence =
    completedCards.length > 0
      ? completedCards.reduce((sum, s) => sum + s.confidence, 0) /
        completedCards.length
      : 0
  const streamingCount = summaries.filter(
    (s) => s.status === 'skeleton' || s.status === 'streaming',
  ).length

  const handleInspect = useCallback(
    (cardId: string) => {
      dispatch({ type: 'SET_AUTOPSY_TARGET', cardId })
      setExpanded(false)
    },
    [dispatch],
  )

  // ─── Don't render if no cards ──────────────────────────────────────────
  if (summaries.length === 0) return null

  // ─── Collapsed: compact floating badge ─────────────────────────────────
  const overallClass = classifyConfidence(avgConfidence)

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpanded(true)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl',
              'backdrop-blur-md border border-white/[0.08] bg-black/60',
              'shadow-lg hover:bg-black/70 transition-colors',
              'cursor-pointer',
            )}
          >
            {/* Confidence dot */}
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full',
                confidenceColors[overallClass].bg,
                `ring-2 ${confidenceColors[overallClass].ring}`,
              )}
            />
            <span className="text-[11px] font-mono text-white/60">
              信頼度
            </span>
            <span
              className={cn(
                'text-[11px] font-mono font-bold tabular-nums',
                confidenceColors[overallClass].text,
              )}
            >
              {Math.round(avgConfidence * 100)}%
            </span>
            {streamingCount > 0 && (
              <span className="text-[10px] text-cyan-400/60 font-mono animate-pulse">
                {streamingCount}件処理中
              </span>
            )}
            {lowConfidenceCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono">
                {lowConfidenceCount}件要確認
              </span>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'w-80 max-h-96 overflow-hidden rounded-xl',
              'backdrop-blur-xl border border-white/[0.08] bg-black/80',
              'shadow-2xl',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-white/70">
                  信頼度ヒートマップ
                </span>
                <span
                  className={cn(
                    'text-[10px] font-mono font-bold tabular-nums',
                    confidenceColors[overallClass].text,
                  )}
                >
                  平均 {Math.round(avgConfidence * 100)}%
                </span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Card list */}
            <div className="overflow-y-auto max-h-72 p-2 space-y-1">
              {summaries.map((summary) => {
                const level = classifyConfidence(summary.confidence)
                const colors = confidenceColors[level]
                const engine =
                  engineTokens[summary.engine as keyof typeof engineTokens]
                const isComplete = summary.status === 'complete'
                const isClickable = isComplete && level !== 'high'

                return (
                  <button
                    key={summary.cardId}
                    onClick={() => isClickable && handleInspect(summary.cardId)}
                    disabled={!isClickable}
                    className={cn(
                      'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left',
                      'transition-colors',
                      isClickable
                        ? 'hover:bg-white/[0.04] cursor-pointer'
                        : 'cursor-default',
                      !isComplete && 'opacity-50',
                    )}
                  >
                    {/* Engine dot */}
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: engine?.color ?? '#888' }}
                    />

                    {/* Card info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-white/60 font-medium block truncate">
                        {summary.cardType.replace(/-/g, ' ')}
                      </span>
                      {summary.source && (
                        <span className="text-[9px] text-white/30 font-mono block truncate">
                          {summary.source}
                        </span>
                      )}
                    </div>

                    {/* Confidence bar */}
                    <div className="w-16 flex-shrink-0">
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', colors.bg)}
                          style={{
                            width: `${Math.round(summary.confidence * 100)}%`,
                            backgroundColor:
                              level === 'high'
                                ? 'rgb(52 211 153 / 0.5)'
                                : level === 'medium'
                                  ? 'rgb(251 191 36 / 0.5)'
                                  : 'rgb(248 113 113 / 0.5)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Confidence % */}
                    <span
                      className={cn(
                        'text-[10px] font-mono tabular-nums w-8 text-right flex-shrink-0',
                        isComplete ? colors.text : 'text-white/30',
                      )}
                    >
                      {isComplete
                        ? `${Math.round(summary.confidence * 100)}%`
                        : summary.status === 'skeleton'
                          ? '...'
                          : `${Math.round(summary.confidence * 100)}%`}
                    </span>

                    {/* Inspect arrow for low-confidence */}
                    {isClickable && (
                      <span className="text-[10px] text-amber-400/60 flex-shrink-0">→</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            {lowConfidenceCount > 0 && (
              <div className="px-3 py-2 border-t border-white/[0.06]">
                <span className="text-[10px] text-amber-400/60">
                  信頼度が低いカードをクリックして詳細を確認できます
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
