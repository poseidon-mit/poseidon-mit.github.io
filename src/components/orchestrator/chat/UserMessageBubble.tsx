/**
 * UserMessageBubble — Right-aligned user message in the chat thread.
 */

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion-presets'
import type { ChatMessage } from '@/lib/orchestrator/types'

interface UserMessageBubbleProps {
  message: ChatMessage
}

export function UserMessageBubble({ message }: UserMessageBubbleProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex justify-end"
    >
      <div className="max-w-[80%] md:max-w-[60%]">
        <div className="rounded-2xl rounded-br-md bg-white/[0.08] border border-white/[0.06] px-4 py-3">
          <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
        <p className="mt-1 text-right text-[10px] text-slate-600 font-mono">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}

UserMessageBubble.displayName = 'UserMessageBubble'
