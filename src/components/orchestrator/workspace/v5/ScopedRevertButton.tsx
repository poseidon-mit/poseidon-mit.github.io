/**
 * Orchestrator Workspace v5.0 — Scoped Revert Button
 *
 * Per-artifact mock revert with premium animation.
 * Visual mock only — resets to hardcoded checkpoint, no real state-history.
 *
 * On click:
 *   1. Dispatches REVERT_ARTIFACT (resets artifact.data to checkpoint.snapshotData)
 *   2. Plays flash-white → scale(0.95) → scale(1.0) + emerald glow animation
 *   3. Shows toast: "Reverted [name] to checkpoint"
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import type { PinnedArtifact } from '@/lib/orchestrator/workspace/v5/v5-types'

interface ScopedRevertButtonProps {
  pinnedArtifact: PinnedArtifact
  className?: string
}

export function ScopedRevertButton({
  pinnedArtifact,
  className,
}: ScopedRevertButtonProps) {
  const { dispatch } = useWorkbenchContext()
  const [isReverting, setIsReverting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleRevert = useCallback(() => {
    if (isReverting || !pinnedArtifact.checkpoint) return

    setIsReverting(true)

    // Dispatch the revert action
    dispatch({ type: 'REVERT_ARTIFACT', artifactId: pinnedArtifact.id })

    // Show toast
    setShowToast(true)

    // Reset animation state
    setTimeout(() => {
      setIsReverting(false)
    }, 600)

    // Hide toast after 2.5s
    setTimeout(() => {
      setShowToast(false)
    }, 2500)
  }, [dispatch, pinnedArtifact, isReverting])

  if (!pinnedArtifact.checkpoint) return null

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        animate={
          isReverting
            ? {
                scale: [1, 0.95, 1.02, 1],
                boxShadow: [
                  '0 0 0px rgba(52, 211, 153, 0)',
                  '0 0 12px rgba(52, 211, 153, 0.5)',
                  '0 0 20px rgba(52, 211, 153, 0.3)',
                  '0 0 0px rgba(52, 211, 153, 0)',
                ],
              }
            : {}
        }
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onClick={handleRevert}
        disabled={isReverting}
        className={cn(
          'flex items-center gap-1 px-1.5 py-0.5 rounded',
          'text-[9px] font-mono transition-colors',
          isReverting
            ? 'bg-emerald-400/15 text-emerald-400'
            : 'text-white/25 hover:text-white/50 hover:bg-white/[0.06]',
          className,
        )}
        title="チェックポイントに復元"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path
            d="M1.5 3.5H0.5L2 1.5L3.5 3.5H2.5C2.5 5.16 3.84 6.5 5.5 6.5C5.84 6.5 6.17 6.44 6.47 6.34L7.15 7.02C6.67 7.31 6.1 7.5 5.5 7.5C3.29 7.5 1.5 5.71 1.5 3.5Z"
            fill="currentColor"
          />
        </svg>
        <span>{isReverting ? '復元中…' : '復元'}</span>
      </motion.button>

      {/* Revert toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className={cn(
              'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]',
              'flex items-center gap-2 px-4 py-2.5 rounded-lg',
              'bg-emerald-900/90 border border-emerald-400/20',
              'backdrop-blur-sm shadow-lg shadow-emerald-900/30',
            )}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-emerald-400">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[11px] text-emerald-300 font-medium">
              「{pinnedArtifact.artifact.title || 'Artifact'}」をチェックポイントに復元しました
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
