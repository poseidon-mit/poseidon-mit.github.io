/**
 * Orchestrator Workspace v5.0 — Workspace Header
 *
 * Top bar showing GovernScore, theme mode, and toggles for:
 *   - Chat drawer (left)
 *   - Autonomy Dial (center-left, v5.0)
 *   - GovernScore (center)
 *   - Sandbox preview toggle (right, v5.0)
 *   - Theme mode (standard / govern)
 *
 * Replaces the chat header when workspace is primary.
 */

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { AutonomyDial } from './v5/AutonomyDial'

export function WorkspaceHeader() {
  const { state, dispatch } = useWorkbenchContext()
  const isGovern = state.themeMode.mode === 'govern'

  const toggleChatDrawer = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT_DRAWER' })
  }, [dispatch])

  const toggleThemeMode = useCallback(() => {
    dispatch({
      type: 'SET_THEME_MODE',
      mode: isGovern ? 'standard' : 'govern',
    })
  }, [dispatch, isGovern])

  // v5.0: Sandbox preview toggle
  const sandboxOpen = state.workspace.v5?.sandboxPreview.isOpen ?? false
  const toggleSandbox = useCallback(() => {
    dispatch({ type: 'TOGGLE_SANDBOX_PREVIEW' })
  }, [dispatch])

  // Compute a simple GovernScore from streaming cards' average confidence
  const streamingCards = Object.values(state.workspace.streamingCards)
  const completedCards = streamingCards.filter((c) => c.streamingStatus === 'complete')
  const avgConfidence =
    completedCards.length > 0
      ? completedCards.reduce((sum, c) => sum + (c.confidence ?? 0), 0) / completedCards.length
      : 0
  const governScore = Math.round(avgConfidence * 100)

  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.01]">
      {/* Left: Chat toggle + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleChatDrawer}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg',
            'transition-colors',
            state.workspace.chatDrawerOpen
              ? 'bg-cyan-400/15 text-cyan-400'
              : 'bg-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.08]',
          )}
          title="チャットを開く"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4h12M2 8h8M2 12h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/80">
            Poseidon
          </span>
          <span className="text-[10px] text-white/30 font-mono">
            v4.0 ワークスペース
          </span>
        </div>
      </div>

      {/* Center: AutonomyDial + GovernScore */}
      <div className="flex items-center gap-4">
        {/* v5.0: Autonomy Dial */}
        <div className="hidden md:block">
          <AutonomyDial />
        </div>

        <div className="hidden md:block w-px h-4 bg-white/[0.08]" />

        <div className="flex items-center gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={cn(
            isGovern ? 'text-blue-400' : 'text-white/40',
          )}
        >
          <path
            d="M7 1L2 3.5V6.5C2 9.5 4 12 7 13C10 12 12 9.5 12 6.5V3.5L7 1Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {governScore > 0 && (
            <path
              d="M5 7L6.5 8.5L9 5.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        {governScore > 0 && (
          <motion.span
            key={governScore}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              'text-[11px] font-mono font-bold tabular-nums',
              governScore >= 80 ? 'text-emerald-400' : 'text-amber-400',
            )}
          >
            {governScore}
          </motion.span>
        )}
        <span className="text-[10px] text-white/30">Govern</span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* v5.0: Sandbox preview toggle */}
        <button
          onClick={toggleSandbox}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg',
            'transition-colors',
            sandboxOpen
              ? 'bg-cyan-400/15 text-cyan-400'
              : 'bg-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.08]',
          )}
          title="サンドボックスプレビュー"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="5.5" y1="1.5" x2="5.5" y2="12.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>

        {/* Theme mode toggle */}
        <button
          onClick={toggleThemeMode}
          className={cn(
            'text-[10px] font-mono px-2.5 py-1.5 rounded-lg',
            'border transition-colors',
            isGovern
              ? 'border-blue-400/30 bg-blue-400/10 text-blue-400'
              : 'border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/70',
          )}
        >
          {isGovern ? 'GOVERN' : 'STD'}
        </button>

        {/* User context indicator */}
        {state.workspace.userContext && (
          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-white/30 font-mono">
            <span>{state.workspace.userContext.role}</span>
            <span className="text-white/15">|</span>
            <span>{state.workspace.userContext.fiscalQuarter}</span>
          </div>
        )}
      </div>
    </header>
  )
}
