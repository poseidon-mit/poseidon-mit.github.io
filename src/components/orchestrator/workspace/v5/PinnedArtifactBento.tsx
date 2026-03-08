/**
 * Orchestrator Workspace v5.0 — Pinned Artifact Bento Grid
 *
 * Persistent user-curated grid displayed below StreamingBentoGrid.
 * Cards are drag-reorderable via Framer Motion Reorder.Group.
 * 2-column on desktop, 1-column on mobile.
 *
 * Separate from StreamingBentoGrid — different layout rules,
 * different data source (pinned artifacts vs. streaming cards).
 */

import { useCallback } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { PinnedCard } from './PinnedCard'
import { fadeUp } from '@/lib/motion-presets'

export function PinnedArtifactBento() {
  const { state, dispatch } = useWorkbenchContext()
  const pinnedArtifacts = state.workspace.v5?.pinnedArtifacts ?? []

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      dispatch({ type: 'REORDER_PINNED', orderedIds: newOrder })
    },
    [dispatch],
  )

  if (pinnedArtifacts.length === 0) return null

  // Extract IDs for Reorder.Group
  const pinnedIds = pinnedArtifacts.map((pa) => pa.id)

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="px-4 pb-4"
    >
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-mono uppercase tracking-wider">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-cyan-400/50">
            <path
              d="M5 0.5L7 2.5L6.2 4.5L7.5 5.5H5.7L5 8.5L4.3 5.5H2.5L3.8 4.5L3 2.5L5 0.5Z"
              fill="currentColor"
            />
          </svg>
          <span>Pinned Artifacts</span>
          <span className="text-white/15">({pinnedArtifacts.length})</span>
        </div>
      </div>

      {/* Reorderable grid */}
      <Reorder.Group
        axis="y"
        values={pinnedIds}
        onReorder={handleReorder}
        className={cn(
          'grid gap-3',
          'grid-cols-1 md:grid-cols-2',
        )}
      >
        <AnimatePresence mode="popLayout">
          {pinnedArtifacts.map((pa) => (
            <Reorder.Item
              key={pa.id}
              value={pa.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <PinnedCard pinnedArtifact={pa} />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </motion.section>
  )
}
