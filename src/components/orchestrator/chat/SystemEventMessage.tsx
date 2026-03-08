/**
 * SystemEventMessage — Inline system event indicator in the chat thread.
 * Renders as a subtle center-aligned pill (intent resolved, action executed, etc.)
 */

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { fadeUp } from '@/lib/motion-presets'
import type { ChatMessage } from '@/lib/orchestrator/types'

interface SystemEventMessageProps {
  message: ChatMessage
}

export function SystemEventMessage({ message }: SystemEventMessageProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex justify-center py-1"
    >
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.03] border border-white/[0.04] px-3 py-1">
        <Activity size={10} className="text-slate-600" />
        <span className="text-[10px] font-mono text-slate-500">
          {message.content}
        </span>
      </div>
    </motion.div>
  )
}

SystemEventMessage.displayName = 'SystemEventMessage'
