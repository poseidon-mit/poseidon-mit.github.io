/**
 * Talk to Money — Mobile Bottom Sheet
 *
 * Bottom sheet for mobile (< 768px) with drag-to-dismiss.
 */
import { useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { TalkToMoneyConversation } from './TalkToMoneyConversation'
import type { Message, RouteContext } from './types'

interface SheetProps {
  messages: Message[]
  routeContext: RouteContext | null
  onSend: (content: string) => void
  onClose: () => void
}

export function TalkToMoneySheet({ messages, routeContext, onSend, onClose }: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const dragStart = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragStart.current === null) return
    const delta = e.touches[0].clientY - dragStart.current
    if (delta > 0) setDragOffset(delta)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (dragOffset > 100) {
      onClose()
    }
    setDragOffset(0)
    dragStart.current = null
  }, [dragOffset, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed left-0 right-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-[rgba(8,12,20,0.98)] backdrop-blur-xl border-t border-white/[0.08] shadow-2xl"
        style={{
          height: '60vh',
          maxHeight: '90vh',
          transform: `translateY(${dragOffset}px)`,
          transition: dragOffset === 0 ? 'transform 0.2s ease-out' : 'none',
        }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" />
            <span className="text-sm font-semibold text-white tracking-wide">Talk to Money</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close sheet"
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
    </>
  )
}
