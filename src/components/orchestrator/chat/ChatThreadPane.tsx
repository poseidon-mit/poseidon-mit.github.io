/**
 * ChatThreadPane — Scrollable message list rendering user, AI, and system messages.
 * Auto-scrolls to bottom on new messages.
 */

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer } from '@/lib/motion-presets'
import type { ChatMessage } from '@/lib/orchestrator/types'
import { UserMessageBubble } from './UserMessageBubble'
import { AIChatBubble } from './AIChatBubble'
import { SystemEventMessage } from './SystemEventMessage'
import { TypingIndicator } from './TypingIndicator'

interface ChatThreadPaneProps {
  messages: ChatMessage[]
  isProcessing: boolean
}

export function ChatThreadPane({ messages, isProcessing }: ChatThreadPaneProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isProcessing])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {messages.map((msg) => (
            <MessageRouter key={msg.id} message={msg} />
          ))}

          {isProcessing && <TypingIndicator />}
        </motion.div>
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </div>
  )
}

ChatThreadPane.displayName = 'ChatThreadPane'

// ─── Message Router ─────────────────────────────────────────────────────────

function MessageRouter({ message }: { message: ChatMessage }) {
  switch (message.role) {
    case 'user':
      return <UserMessageBubble message={message} />
    case 'assistant':
      return <AIChatBubble message={message} />
    case 'system':
      return <SystemEventMessage message={message} />
    default:
      return null
  }
}
