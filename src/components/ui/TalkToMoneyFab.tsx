import { useState, useMemo } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from '@/router'
import { AUDIT_DECISIONS } from '@/lib/govern-audit-data'

export function TalkToMoneyFab() {
  const { path, search } = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const isAuditDetail = path === '/govern/audit-detail'
  const contextMessage = useMemo(() => {
    if (!isAuditDetail) return null
    const decisionId = new URLSearchParams(search).get('decision')
    const entry = decisionId ? AUDIT_DECISIONS[decisionId] : null
    if (!entry) return null
    return {
      id: entry.id,
      summary: entry.explanation.summary,
      engine: entry.engine,
      action: entry.action,
    }
  }, [isAuditDetail, search])

  const isEnabled = !!contextMessage

  if (!isEnabled) {
    return (
      <button
        disabled
        aria-label="Talk to Money (coming soon)"
        className={cn(
          'fixed right-6 z-30',
          'mb-[env(safe-area-inset-bottom,0px)]',
          'bottom-[calc(64px+12px)] lg:bottom-20',
          'flex items-center gap-2 rounded-full',
          'bg-gradient-to-r from-violet-500/80 to-cyan-500/80',
          'px-4 py-3 min-h-[44px]',
          'text-sm font-semibold text-white',
          'shadow-lg shadow-violet-500/20',
          'backdrop-blur-md',
          'cursor-not-allowed opacity-70',
          'border border-white/10',
        )}
      >
        <MessageCircle size={16} />
        <span>Talk to Money</span>
        <span className="text-[10px] font-normal text-white/50 ml-1">soon</span>
      </button>
    )
  }

  return (
    <>
      {/* Context panel */}
      {isOpen && contextMessage && (
        <div className="fixed right-6 z-30 bottom-[calc(64px+12px+56px)] lg:bottom-[calc(80px+56px)] w-[min(90vw,360px)] rounded-2xl bg-[#0f1e35]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Audit Context: {contextMessage.id}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={14} className="text-white/50" />
            </button>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">{contextMessage.summary}</p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="font-mono">{contextMessage.engine}</span>
            <span>·</span>
            <span>{contextMessage.action}</span>
          </div>
          <p className="text-[10px] text-white/30 italic">
            GenAI analysis available here — decoupled from the deterministic audit record above.
          </p>
        </div>
      )}

      {/* FAB button */}
      <button
        aria-label="Talk to Money — Audit context available"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed right-6 z-30',
          'mb-[env(safe-area-inset-bottom,0px)]',
          'bottom-[calc(64px+12px)] lg:bottom-20',
          'flex items-center gap-2 rounded-full',
          'bg-gradient-to-r from-violet-500 to-cyan-500',
          'px-4 py-3 min-h-[44px]',
          'text-sm font-semibold text-white',
          'shadow-lg shadow-violet-500/30',
          'backdrop-blur-md',
          'cursor-pointer',
          'border border-white/20',
          'hover:shadow-xl hover:shadow-violet-500/40 transition-shadow',
        )}
      >
        <MessageCircle size={16} />
        <span>Talk to Money</span>
      </button>
    </>
  )
}
