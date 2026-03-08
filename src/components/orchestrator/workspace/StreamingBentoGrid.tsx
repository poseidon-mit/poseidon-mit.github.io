/**
 * Orchestrator Workspace v5.0 — Streaming Bento Grid
 *
 * Wraps the existing BentoGrid with streaming state management.
 * Reads streamingCards from WorkbenchContext and passes them as
 * streamingState props to individual BentoCard components.
 *
 * Key behaviors:
 *   - Cards receive per-card streaming states (skeleton → streaming → complete)
 *   - Low-confidence cards (< 0.8) trigger onInspect → opens Decision Autopsy
 *   - Framer Motion stagger for initial grid appearance
 *   - Responsive: single-column at mobile, multi-column at desktop
 *   - v5.0: Agent provenance badges (neon top-border + model label) per card
 */

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/motion-presets'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { BentoCard } from '@/components/orchestrator/bento/BentoCard'
import { BentoCardFactory } from '@/components/orchestrator/bento/BentoCardFactory'
import { AgentProvenanceWrapper } from './v5/AgentProvenanceBadge'
import { extractProvenance } from '@/lib/orchestrator/workspace/v5/provenance-tagger'
import type { BentoLayoutSpec } from '@/lib/orchestrator/types'

// ─── Props ──────────────────────────────────────────────────────────────────

export interface StreamingBentoGridProps {
  /** Override layout — if null, reads from context */
  layout?: BentoLayoutSpec | null
  /** Override govern mode */
  governMode?: boolean
}

// ─── Component ──────────────────────────────────────────────────────────────

export function StreamingBentoGrid({
  layout: layoutOverride,
  governMode: governModeOverride,
}: StreamingBentoGridProps) {
  const { state, dispatch } = useWorkbenchContext()

  const layout = layoutOverride ?? state.activeBentoLayout
  const governMode =
    governModeOverride ?? state.themeMode.mode === 'govern'

  // ─── Streaming card states from workspace ──────────────────────────────
  const streamingCards = state.workspace.streamingCards

  // ─── Inspect handler (opens Decision Autopsy for low-confidence cards)
  const handleInspect = useCallback(
    (cardId: string) => {
      dispatch({ type: 'SET_AUTOPSY_TARGET', cardId })
    },
    [dispatch],
  )

  // ─── Empty state ──────────────────────────────────────────────────────
  if (!layout || layout.cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/20 text-sm font-mono">
        サジェスションを選択してワークスペースを開始
      </div>
    )
  }

  // ─── Sort cards by priority ───────────────────────────────────────────
  const sortedCards = [...layout.cards].sort(
    (a, b) => a.priority - b.priority,
  )

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
        gap: '1rem',
      }}
    >
      {sortedCards.map((cardSpec) => {
        const cardState = state.cardStates[cardSpec.id] ?? null
        const streamingState = streamingCards[cardSpec.id] ?? null

        // v5.0: Extract agent provenance from streaming state
        const provenance = streamingState
          ? extractProvenance(streamingState)
          : null

        return (
          <motion.div
            key={cardSpec.id}
            variants={staggerItem}
            style={{
              gridColumn: `span ${cardSpec.colSpan}`,
              gridRow: `span ${cardSpec.rowSpan}`,
            }}
          >
            {provenance ? (
              <AgentProvenanceWrapper modelId={provenance.modelId}>
                <BentoCard
                  spec={cardSpec}
                  state={cardState}
                  streamingState={streamingState}
                  governMode={governMode}
                  onInspect={handleInspect}
                >
                  <BentoCardFactory spec={cardSpec} state={cardState} />
                </BentoCard>
              </AgentProvenanceWrapper>
            ) : (
              <BentoCard
                spec={cardSpec}
                state={cardState}
                streamingState={streamingState}
                governMode={governMode}
                onInspect={handleInspect}
              >
                <BentoCardFactory spec={cardSpec} state={cardState} />
              </BentoCard>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
