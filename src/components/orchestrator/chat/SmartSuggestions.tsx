/**
 * SmartSuggestions — Context-aware action chips displayed above the input field.
 */

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/motion-presets'
import { engineTokens } from '@/lib/engine-tokens'
import type { EngineName } from '@/lib/engine-tokens'
import type { SmartSuggestion } from '@/lib/orchestrator/chat/chat-flow-engine'

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[]
  onSelect: (prompt: string) => void
  disabled?: boolean
}

export function SmartSuggestions({ suggestions, onSelect, disabled }: SmartSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="border-t border-white/[0.04] bg-black/20 px-4 py-2 md:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={10} className="text-slate-600" />
          <span className="text-[10px] text-slate-600 uppercase tracking-wider">Suggestions</span>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2"
        >
          {suggestions.map((s) => {
            const token = engineTokens[s.engine as EngineName]
            const color = token?.cssVar ? `var(${token.cssVar})` : 'var(--engine-dashboard)'

            return (
              <motion.button
                key={s.id}
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(s.prompt)}
                disabled={disabled}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 hover:bg-white/[0.06] hover:text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                {s.label}
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

SmartSuggestions.displayName = 'SmartSuggestions'
