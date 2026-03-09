/**
 * Talk to Money — Shared Conversation Content
 *
 * Message list + input field, shared between desktop panel and mobile sheet.
 */
import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Message, RouteContext } from './types'

interface ConversationProps {
  messages: Message[]
  routeContext: RouteContext | null
  onSend: (content: string) => void
}

export function TalkToMoneyConversation({ messages, routeContext, onSend }: ConversationProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Context badge */}
      {routeContext && (
        <div className="px-4 py-2 border-b border-white/[0.06]">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">
            {routeContext.label}
            {routeContext.decisionId && ` · ${routeContext.decisionId}`}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'self-end bg-violet-500/20 text-white/90 border border-violet-400/20'
                : 'self-start bg-white/[0.04] text-white/70 border border-white/[0.06]',
            )}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-400/40 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-xl transition-all cursor-pointer',
            input.trim()
              ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/20'
              : 'bg-white/[0.04] text-white/20',
          )}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
