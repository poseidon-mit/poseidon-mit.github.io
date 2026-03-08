/**
 * AIChatBubble — Left-aligned AI response with optional inline artifact.
 *
 * The artifact renders below the text narrative inside the same bubble container.
 */

import { motion } from 'framer-motion'
import { Bot, ShieldCheck } from 'lucide-react'
import { fadeUp } from '@/lib/motion-presets'
import type { ChatMessage } from '@/lib/orchestrator/types'
import { ArtifactRenderer } from './artifacts/ArtifactRenderer'

interface AIChatBubbleProps {
  message: ChatMessage
}

export function AIChatBubble({ message }: AIChatBubbleProps) {
  const hasArtifact = message.artifact != null
  const hasText = message.content.trim().length > 0

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex gap-3 items-start"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
          <Bot size={16} className="text-blue-400" />
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 max-w-[85%] md:max-w-[70%] space-y-3">
        {hasText && (
          <div className="rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06] px-4 py-3">
            <div
              className="text-sm text-slate-300 leading-relaxed prose prose-invert prose-sm max-w-none
                         prose-strong:text-slate-200 prose-code:text-cyan-400 prose-code:bg-white/[0.06]
                         prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
            />
          </div>
        )}

        {hasArtifact && message.artifact && (
          <ArtifactRenderer artifact={message.artifact} />
        )}

        {/* Timestamp + proof indicator */}
        <div className="flex items-center gap-2">
          <p className="text-[10px] text-slate-600 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {message.artifact?.metadata?.proofBadge && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-500/60">
              <ShieldCheck size={10} />
              verified
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

AIChatBubble.displayName = 'AIChatBubble'

// ─── Minimal Markdown Rendering ─────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.*)$/, '<p>$1</p>')
}
