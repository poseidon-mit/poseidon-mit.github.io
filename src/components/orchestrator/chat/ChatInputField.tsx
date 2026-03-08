/**
 * ChatInputField — Bottom-anchored textarea for user input.
 * Enter to send, Shift+Enter for newline.
 */

import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Loader2 } from 'lucide-react'

interface ChatInputFieldProps {
  onSend: (message: string) => void
  isProcessing: boolean
  placeholder?: string
}

export function ChatInputField({
  onSend,
  isProcessing,
  placeholder = 'Ask Poseidon anything...',
}: ChatInputFieldProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isProcessing) return
    onSend(trimmed)
    setValue('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, isProcessing, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [])

  return (
    <div className="border-t border-white/[0.06] bg-black/40 backdrop-blur-xl px-4 py-3 md:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 focus-within:border-blue-500/30 transition-colors">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              handleInput()
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isProcessing}
            className="flex-1 resize-none bg-transparent text-sm text-slate-200 placeholder:text-slate-600 outline-none min-h-[24px] max-h-[160px] leading-relaxed disabled:opacity-50"
            aria-label="Chat input"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!value.trim() || isProcessing}
            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/80 text-white transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-500"
            aria-label="Send message"
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ArrowUp size={16} />
            )}
          </motion.button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-slate-700">
          Poseidon orchestrates across 5 engines · All actions are auditable
        </p>
      </div>
    </div>
  )
}

ChatInputField.displayName = 'ChatInputField'
