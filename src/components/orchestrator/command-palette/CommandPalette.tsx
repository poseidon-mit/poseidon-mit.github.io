/**
 * Orchestrator Workbench v2.0 — Command Palette (Cmd+K)
 * Intent-based natural language command palette for the workbench.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { useIntentResolver } from '@/hooks/useIntentResolver'
import { USE_CASE_DEFINITIONS } from '@/lib/orchestrator/use-cases'
import { engineTokens } from '@/lib/engine-tokens'
import type { UseCaseId } from '@/lib/orchestrator/types'

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

const EXAMPLE_QUERIES = [
  '取締役会向けリスクサマリー作成',
  'AML閾値を動的変更してインパクトテスト実行',
  'SaaSライセンス棚卸し',
  '競合金利対抗プラン作成',
  'AI判断の逆追跡（監査対応）',
  '部門予算超過検知',
]

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [input, setInput] = useState('')
  const [isResolving, setIsResolving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { dispatch } = useWorkbenchContext()
  const { resolve } = useIntentResolver()

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setInput('')
    }
  }, [open])

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!open) {
          // Parent should handle opening
        } else {
          onClose()
        }
      }
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleSubmit = useCallback(
    async (query: string) => {
      if (!query.trim() || isResolving) return
      setIsResolving(true)

      try {
        const intent = await resolve(query)
        dispatch({ type: 'RESOLVE_INTENT', intent })
        dispatch({ type: 'SET_BENTO_LAYOUT', layout: intent.bentoLayout })

        // Auto-switch to Govern mode for audit use cases
        if (intent.useCase === 'UC-07') {
          dispatch({ type: 'SET_THEME_MODE', mode: 'govern' })
        }

        onClose()
      } catch (error) {
        console.error('Intent resolution failed:', error)
      } finally {
        setIsResolving(false)
      }
    },
    [resolve, dispatch, onClose, isResolving],
  )

  // Filter suggestions based on input
  const suggestions = input.trim()
    ? Object.entries(USE_CASE_DEFINITIONS)
        .filter(([_, def]) =>
          def.name.toLowerCase().includes(input.toLowerCase()) ||
          def.nameJa.includes(input) ||
          def.keywords.some((kw) => kw.toLowerCase().includes(input.toLowerCase())),
        )
        .slice(0, 5)
    : []

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'relative w-full max-w-xl rounded-2xl border overflow-hidden',
            'border-white/[0.08] bg-[hsl(220_20%_6%_/_0.95)] backdrop-blur-xl',
            'shadow-[0_0_60px_rgba(0,240,255,0.08)]',
          )}
        >
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
            <span className="text-cyan-400/70 text-sm">⌘K</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit(input)
              }}
              placeholder="意図を入力... (例: 取締役会向けリスクサマリー作成)"
              className={cn(
                'flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/30',
                'outline-none',
              )}
              disabled={isResolving}
            />
            {isResolving && (
              <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-2 py-2 border-b border-white/[0.04]">
              <div className="text-[10px] text-white/30 px-2 mb-1 uppercase tracking-wider">
                Use Cases
              </div>
              {suggestions.map(([id, def]) => (
                <button
                  key={id}
                  onClick={() => handleSubmit(def.nameJa)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left',
                    'hover:bg-white/[0.04] transition-colors',
                  )}
                >
                  <div className="flex gap-1">
                    {(def.engines as string[]).map((eng) => (
                      <div
                        key={eng}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: engineTokens[eng as keyof typeof engineTokens]?.color }}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/80 truncate">{def.nameJa}</div>
                    <div className="text-[10px] text-white/30 font-mono">{id} · Tier {def.tier}</div>
                  </div>
                  <span
                    className={cn(
                      'text-[9px] px-1.5 py-0.5 rounded-full font-mono',
                      def.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                      def.riskLevel === 'high' ? 'bg-amber-500/20 text-amber-400' :
                      def.riskLevel === 'medium' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-green-500/20 text-green-400',
                    )}
                  >
                    {def.riskLevel}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Example queries */}
          {!input && (
            <div className="px-2 py-2">
              <div className="text-[10px] text-white/30 px-2 mb-1 uppercase tracking-wider">
                Quick Start
              </div>
              <div className="grid grid-cols-2 gap-1">
                {EXAMPLE_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q)
                      handleSubmit(q)
                    }}
                    className="text-left text-[11px] text-white/40 hover:text-white/70 px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04] text-[9px] text-white/20">
            <span>Enter で実行 · Esc で閉じる</span>
            <span>Orchestrator v2.0</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
