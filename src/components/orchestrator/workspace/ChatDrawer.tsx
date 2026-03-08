/**
 * Orchestrator Workspace v5.0 — Chat Drawer
 *
 * Collapsible left-side panel wrapping the existing ChatOrchestratorShell.
 * Chat becomes secondary to the workspace — user toggles it from WorkspaceHeader
 * or it auto-opens when an intent needs conversational clarification.
 *
 * v5.0: PinArtifactButton injected on chat artifact bubbles via
 * renderArtifactAction prop on ChatOrchestratorShell.
 *
 * No modifications to existing chat components — ChatOrchestratorShell,
 * ChatThreadPane, ChatInputField, etc. remain as-is.
 */

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { ChatOrchestratorShell } from '@/components/orchestrator/chat/ChatOrchestratorShell'
import { PinArtifactButton } from './v5/PinArtifactButton'

// ─── Main Component ──────────────────────────────────────────────────────────

export function ChatDrawer() {
  const { state, dispatch } = useWorkbenchContext()
  const isOpen = state.workspace.chatDrawerOpen

  const handleClose = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT_DRAWER' })
  }, [dispatch])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={handleClose}
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 left-0 z-50 h-full',
              'w-full md:w-[380px] lg:w-[420px]',
              'border-r border-white/[0.08]',
              'backdrop-blur-xl bg-black/90',
              'overflow-hidden flex flex-col',
            )}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-cyan-400/70"
                >
                  <path
                    d="M2 3.5h10M2 7h6M2 10.5h8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xs font-medium text-white/70">
                  チャット
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-white/30 hover:text-white/60 text-sm transition-colors px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Chat shell (existing v3.0 component — untouched) */}
            {/* v5.0: PinArtifactButton injected via renderArtifactAction prop */}
            <div className="flex-1 overflow-hidden">
              <ChatOrchestratorShell
                showAuditSidebar={false}
                renderArtifactAction={(artifact, messageId) => (
                  <PinArtifactButton
                    artifact={artifact}
                    sourceMessageId={messageId}
                  />
                )}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
