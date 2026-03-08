/**
 * Orchestrator Workspace v5.0 — Intent Workspace Shell
 *
 * Primary interface replacing the chat-centric layout.
 * Composes all workspace sub-components:
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │ WorkspaceHeader (GovernScore, AutonomyDial, toggles)       │
 *   ├─────────────────────────────────────────────────────────────┤
 *   │ DynamicSuggestionBar (horizontal scroll)                   │
 *   ├─────────────────────────────────────────┬───────────────────┤
 *   │ LeftColumn (flex-1, overflow-y-auto)    │ LiveSandbox       │
 *   │ ┌─────────────────────────────────────┐ │ Preview           │
 *   │ │ StreamingBentoGrid (+provenance)    │ │ (collapsible,     │
 *   │ │                                     │ │  360px)           │
 *   │ └─────────────────────────────────────┘ │                   │
 *   │ ┌─────────────────────────────────────┐ │                   │
 *   │ │ PinnedArtifactBento (if any pinned) │ │                   │
 *   │ │ (2-col grid, drag-reorder)          │ │                   │
 *   │ └─────────────────────────────────────┘ │                   │
 *   ├─────────────────────────────────────────┴───────────────────┤
 *   │ GovernFooter                                                │
 *   └─────────────────────────────────────────────────────────────┘
 *   ChatDrawer: collapsible overlay from left
 *   DecisionAutopsyDrawer: overlay from right
 *
 * Initializes user context and generates initial suggestions on mount.
 */

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { analyzeUserContext } from '@/lib/orchestrator/workspace/context-analyzer'
import { generateSuggestions } from '@/lib/orchestrator/workspace/suggestion-engine'

import { WorkspaceHeader } from './WorkspaceHeader'
import { DynamicSuggestionBar } from './DynamicSuggestionBar'
import { StreamingBentoGrid } from './StreamingBentoGrid'
import { ConfidenceHeatmapOverlay } from './ConfidenceHeatmapOverlay'
import { DecisionAutopsyDrawer } from './DecisionAutopsyDrawer'
import { ChatDrawer } from './ChatDrawer'
import { PinnedArtifactBento } from './v5/PinnedArtifactBento'
import { LiveSandboxPreview } from './v5/LiveSandboxPreview'
import { fadeUp } from '@/lib/motion-presets'

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyWorkspaceState() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex-1 flex items-center justify-center"
    >
      <div className="text-center max-w-md px-6">
        <div className="text-4xl mb-4">🔱</div>
        <h2 className="text-lg font-medium text-white/60 mb-2">
          ワークスペース準備完了
        </h2>
        <p className="text-[13px] text-white/35 leading-relaxed">
          上部のサジェスションカードをクリックして分析を開始するか、
          チャットを開いて自由に質問してください。
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-white/20 font-mono">
          <span>コンテキスト分析済み</span>
          <span className="text-white/10">•</span>
          <span>サジェスション生成済み</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function IntentWorkspaceShell() {
  const { state, dispatch } = useWorkbenchContext()
  const hasBentoLayout = !!state.activeBentoLayout
  const hasStreamingCards = Object.keys(state.workspace.streamingCards).length > 0
  const hasContent = hasBentoLayout || hasStreamingCards

  // v5.0 state
  const sandboxOpen = state.workspace.v5?.sandboxPreview.isOpen ?? false
  const hasPinnedArtifacts = (state.workspace.v5?.pinnedArtifacts.length ?? 0) > 0

  // Initialize context + suggestions on mount
  useEffect(() => {
    const initWorkspace = async () => {
      // Step 1: Build user context from environment signals
      const userContext = analyzeUserContext()
      dispatch({ type: 'SET_USER_CONTEXT', context: userContext })

      // Step 2: Generate proactive suggestions
      const suggestions = generateSuggestions(userContext)
      dispatch({ type: 'SET_SUGGESTIONS', suggestions })
    }

    // Only initialize once
    if (!state.workspace.userContext) {
      initWorkspace()
    }
  }, [dispatch, state.workspace.userContext])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <WorkspaceHeader />

      {/* Suggestion bar */}
      <div className="border-b border-white/[0.04]">
        <DynamicSuggestionBar />
      </div>

      {/* Main content area — flex row for left column + sandbox */}
      <div className="flex-1 relative overflow-hidden flex flex-row">
        {/* Left column: StreamingBentoGrid + PinnedArtifactBento */}
        <div className={cn(
          'flex-1 overflow-hidden flex flex-col min-w-0',
          // When sandbox is open on desktop, constrain left column
          sandboxOpen && 'md:mr-0',
        )}>
          {hasContent ? (
            <>
              {/* Bento grid with streaming states + agent provenance */}
              <div className="flex-1 overflow-y-auto p-4">
                <StreamingBentoGrid />

                {/* v5.0: Pinned artifacts below streaming grid */}
                {hasPinnedArtifacts && (
                  <div className="mt-4">
                    <PinnedArtifactBento />
                  </div>
                )}
              </div>

              {/* Confidence heatmap overlay (floating, bottom-right) */}
              <ConfidenceHeatmapOverlay />
            </>
          ) : (
            <EmptyWorkspaceState />
          )}
        </div>

        {/* v5.0: Live Sandbox Preview — collapsible right column */}
        {/* Desktop: inline panel. Mobile: handled as sheet inside LiveSandboxPreview */}
        {sandboxOpen && (
          <div className="hidden md:block">
            <LiveSandboxPreview />
          </div>
        )}
        {/* Mobile sandbox sheet (always rendered when open, LiveSandboxPreview handles visibility) */}
        {sandboxOpen && (
          <div className="md:hidden">
            <LiveSandboxPreview />
          </div>
        )}
      </div>

      {/* Decision Autopsy Drawer (right side, conditionally rendered) */}
      <DecisionAutopsyDrawer />

      {/* Chat Drawer (left side, conditionally rendered) */}
      <ChatDrawer />
    </div>
  )
}
