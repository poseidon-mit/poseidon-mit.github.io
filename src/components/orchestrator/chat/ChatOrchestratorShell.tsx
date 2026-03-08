/**
 * ChatOrchestratorShell — Main layout for the chat-centric orchestrator.
 *
 * Replaces the BentoGrid dashboard. Composes:
 * - Header (GovernScore + controls)
 * - ChatThreadPane (scrollable messages)
 * - SmartSuggestions (action chips)
 * - ChatInputField (bottom input)
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, PanelRightOpen, PanelRightClose } from 'lucide-react'
import { fadeUp } from '@/lib/motion-presets'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { getGovernScoreLabel, getGovernScoreColor, type ChatArtifact } from '@/lib/orchestrator/types'
import {
  processChatInput,
  createWelcomeMessages,
  generateSmartSuggestions,
  type SmartSuggestion,
} from '@/lib/orchestrator/chat/chat-flow-engine'
import { ChatThreadPane } from './ChatThreadPane'
import { ChatInputField } from './ChatInputField'
import { SmartSuggestions } from './SmartSuggestions'

interface ChatOrchestratorShellProps {
  showAuditSidebar?: boolean
  /** v5.0: Optional render prop to inject actions (e.g. PinArtifactButton) onto chat artifact bubbles */
  renderArtifactAction?: (artifact: ChatArtifact, messageId: string) => React.ReactNode
}

export function ChatOrchestratorShell({ showAuditSidebar: initialShowSidebar = false }: ChatOrchestratorShellProps) {
  const { state, dispatch } = useWorkbenchContext()
  const [sidebarOpen, setSidebarOpen] = useState(initialShowSidebar)

  // Seed welcome messages on mount
  useEffect(() => {
    if (state.chatThread.messages.length === 0) {
      const welcomeMessages = createWelcomeMessages()
      for (const msg of welcomeMessages) {
        dispatch({ type: 'ADD_CHAT_MESSAGE', message: msg })
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Smart suggestions based on current intent
  const suggestions = useMemo<SmartSuggestion[]>(
    () => generateSmartSuggestions(state.currentIntent),
    [state.currentIntent],
  )

  // Handle user input
  const handleSend = useCallback(
    async (message: string) => {
      const result = await processChatInput(message)
      for (const action of result.actions) {
        dispatch(action)
      }
    },
    [dispatch],
  )

  // Handle suggestion click
  const handleSuggestionSelect = useCallback(
    (prompt: string) => {
      handleSend(prompt)
    },
    [handleSend],
  )

  const score = state.governScore
  const scoreLabel = getGovernScoreLabel(score.overall)
  const scoreColor = getGovernScoreColor(score.overall)

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Header */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between border-b border-white/[0.06] bg-black/40 backdrop-blur-xl px-4 py-3 md:px-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `color-mix(in srgb, ${scoreColor} 15%, transparent)` }}>
            <Shield size={16} style={{ color: scoreColor }} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-200">Poseidon Orchestrator</h1>
            <p className="text-[10px] font-mono text-slate-500">
              Govern Score: {score.overall} — {scoreLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme mode indicator */}
          <span className="text-[10px] font-mono text-slate-600 hidden md:inline">
            {state.themeMode.mode} mode
          </span>

          {/* Audit sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={sidebarOpen ? 'Close audit sidebar' : 'Open audit sidebar'}
          >
            {sidebarOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
          </button>
        </div>
      </motion.header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat thread */}
        <div className="flex flex-1 flex-col min-w-0">
          <ChatThreadPane
            messages={state.chatThread.messages}
            isProcessing={state.chatThread.isProcessing}
          />
          <SmartSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            disabled={state.chatThread.isProcessing}
          />
          <ChatInputField
            onSend={handleSend}
            isProcessing={state.chatThread.isProcessing}
          />
        </div>

        {/* Audit sidebar (collapsible) */}
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="hidden md:flex flex-col border-l border-white/[0.06] bg-black/20 overflow-y-auto"
          >
            <div className="px-4 py-3 border-b border-white/[0.04]">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Audit Trail
              </h2>
            </div>
            <div className="flex-1 px-4 py-3 space-y-2">
              {state.auditTrail.events.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-8">
                  No audit events yet. Start a conversation to begin recording.
                </p>
              ) : (
                state.auditTrail.events.slice(-20).reverse().map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        {event.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-700">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-600">
                      {event.actor.label}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  )
}

ChatOrchestratorShell.displayName = 'ChatOrchestratorShell'
