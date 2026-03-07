/**
 * Orchestrator Workbench v2.0 — Dynamic Bento Grid
 * CSS Grid container that renders BentoLayoutSpec into a responsive grid.
 */

import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/motion-presets'
import type { BentoLayoutSpec, BentoCardState } from '@/lib/orchestrator/types'
import { BentoCard } from './BentoCard'
import { BentoCardFactory } from './BentoCardFactory'

export interface BentoGridProps {
  layout: BentoLayoutSpec
  cardStates: Record<string, BentoCardState>
  governMode?: boolean
}

export function BentoGrid({ layout, cardStates, governMode = false }: BentoGridProps) {
  const sortedCards = [...layout.cards].sort((a, b) => a.priority - b.priority)

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
        const cardState = cardStates[cardSpec.id]
        return (
          <motion.div
            key={cardSpec.id}
            variants={staggerItem}
            style={{
              gridColumn: `span ${cardSpec.colSpan}`,
              gridRow: `span ${cardSpec.rowSpan}`,
            }}
          >
            <BentoCard
              spec={cardSpec}
              state={cardState ?? null}
              governMode={governMode}
            >
              <BentoCardFactory
                spec={cardSpec}
                state={cardState ?? null}
              />
            </BentoCard>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
