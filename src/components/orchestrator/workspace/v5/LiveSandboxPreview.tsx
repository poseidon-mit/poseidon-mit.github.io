/**
 * Orchestrator Workspace v5.0 — Live Sandbox Preview
 *
 * Collapsible right column showing a mock iframe HTML/CSS preview
 * of the workspace's current state. Uses `<iframe srcDoc={html} sandbox="allow-scripts" />`
 * for isolation.
 *
 * Width: 360px desktop, full-screen Sheet on mobile.
 * Toggle in WorkspaceHeader.
 */

import { useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { buildSandboxHTML } from '@/lib/orchestrator/workspace/v5/sandbox-renderer'

export function LiveSandboxPreview() {
  const { state, dispatch } = useWorkbenchContext()
  const v5 = state.workspace.v5
  const isOpen = v5?.sandboxPreview.isOpen ?? false

  // Collect streaming cards and pinned artifacts
  const streamingCards = useMemo(
    () => Object.values(state.workspace.streamingCards),
    [state.workspace.streamingCards],
  )
  const pinnedArtifacts = useMemo(
    () => v5?.pinnedArtifacts ?? [],
    [v5?.pinnedArtifacts],
  )

  // Build HTML when cards change and preview is open
  const htmlContent = useMemo(() => {
    if (!isOpen) return ''
    return buildSandboxHTML(streamingCards, pinnedArtifacts)
  }, [isOpen, streamingCards, pinnedArtifacts])

  // Update sandbox state when HTML changes
  useEffect(() => {
    if (!isOpen || !htmlContent) return
    dispatch({
      type: 'UPDATE_SANDBOX_PREVIEW',
      preview: {
        htmlContent,
        lastRenderedAt: new Date().toISOString(),
        sourceCardIds: streamingCards.map((c) => c.id),
      },
    })
  }, [htmlContent, isOpen, dispatch, streamingCards])

  const handleClose = useCallback(() => {
    dispatch({ type: 'TOGGLE_SANDBOX_PREVIEW' })
  }, [dispatch])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'hidden md:flex flex-col flex-shrink-0',
            'border-l border-white/[0.06] bg-white/[0.01]',
            'overflow-hidden',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-cyan-400/60">
                <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1" />
                <rect x="3" y="3" width="6" height="4" rx="0.5" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
              </svg>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                Preview
              </span>
            </div>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-5 h-5 rounded text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
              title="プレビューを閉じる"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Iframe */}
          <div className="flex-1 overflow-hidden">
            {htmlContent ? (
              <iframe
                srcDoc={htmlContent}
                sandbox="allow-scripts"
                title="Sandbox Preview"
                className="w-full h-full border-0"
                style={{ colorScheme: 'dark' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white/20 text-[11px] font-mono">
                カード完了待ち...
              </div>
            )}
          </div>

          {/* Footer timestamp */}
          <div className="px-3 py-1.5 border-t border-white/[0.04] text-[9px] font-mono text-white/20">
            {v5?.sandboxPreview.lastRenderedAt
              ? `Last: ${new Date(v5.sandboxPreview.lastRenderedAt).toLocaleTimeString('ja-JP')}`
              : 'Not rendered'}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

/**
 * Mobile Sheet variant — full-screen overlay for 375px viewports.
 * Triggered by the same toggle but renders as a sheet instead of a column.
 */
export function LiveSandboxSheet() {
  const { state, dispatch } = useWorkbenchContext()
  const v5 = state.workspace.v5
  const isOpen = v5?.sandboxPreview.isOpen ?? false
  const htmlContent = v5?.sandboxPreview.htmlContent ?? ''

  const handleClose = useCallback(() => {
    dispatch({ type: 'TOGGLE_SANDBOX_PREVIEW' })
  }, [dispatch])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'md:hidden fixed inset-0 z-50',
            'flex flex-col bg-[#0a0a0f]',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <span className="text-xs font-mono text-white/50 uppercase">
              Sandbox Preview
            </span>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/[0.08]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Iframe */}
          <div className="flex-1 overflow-hidden">
            {htmlContent ? (
              <iframe
                srcDoc={htmlContent}
                sandbox="allow-scripts"
                title="Sandbox Preview"
                className="w-full h-full border-0"
                style={{ colorScheme: 'dark' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white/20 text-xs">
                カード完了待ち...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
