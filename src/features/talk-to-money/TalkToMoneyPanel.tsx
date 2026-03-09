/**
 * Talk to Money — Desktop Panel
 *
 * Right-side sliding panel for desktop (>= 768px).
 */
import { X } from 'lucide-react'
import { TalkToMoneyConversation } from './TalkToMoneyConversation'
import type { Message, RouteContext } from './types'

interface PanelProps {
  messages: Message[]
  routeContext: RouteContext | null
  onSend: (content: string) => void
  onClose: () => void
}

export function TalkToMoneyPanel({ messages, routeContext, onSend, onClose }: PanelProps) {
  return (
    <div className="fixed right-0 top-0 bottom-0 z-50 w-[400px] max-w-[90vw] flex flex-col bg-[rgba(8,12,20,0.97)] backdrop-blur-xl border-l border-white/[0.06] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" />
          <span className="text-sm font-semibold text-white tracking-wide">Talk to Money</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close panel"
        >
          <X size={16} className="text-white/50" />
        </button>
      </div>

      {/* Content */}
      <TalkToMoneyConversation
        messages={messages}
        routeContext={routeContext}
        onSend={onSend}
      />
    </div>
  )
}
