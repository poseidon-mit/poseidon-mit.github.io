/**
 * TypingIndicator — Animated dots shown while AI is processing.
 */

import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { fadeUp } from '@/lib/motion-presets'

export function TypingIndicator() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex gap-3 items-start"
    >
      <div className="flex-shrink-0 mt-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
          <Bot size={16} className="text-blue-400" />
        </div>
      </div>
      <div className="rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06] px-4 py-3">
        <div className="flex gap-1.5" aria-label="Processing">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-blue-400/60"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

TypingIndicator.displayName = 'TypingIndicator'
