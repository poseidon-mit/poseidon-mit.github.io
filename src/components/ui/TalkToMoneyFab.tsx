import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTalkToMoney, TalkToMoneyPanel, TalkToMoneySheet } from '@/features/talk-to-money'

function useIsDesktop() {
  if (typeof window === 'undefined') return true
  return window.innerWidth >= 768
}

export function TalkToMoneyFab() {
  const { isOpen, hasContext, messages, routeContext, open, close, send } = useTalkToMoney()
  const isDesktop = useIsDesktop()

  return (
    <>
      {/* Panel / Sheet */}
      {isOpen && isDesktop && (
        <TalkToMoneyPanel
          messages={messages}
          routeContext={routeContext}
          onSend={send}
          onClose={close}
        />
      )}
      {isOpen && !isDesktop && (
        <TalkToMoneySheet
          messages={messages}
          routeContext={routeContext}
          onSend={send}
          onClose={close}
        />
      )}

      {/* FAB button */}
      <button
        aria-label={hasContext ? 'Talk your money — Context available' : 'Talk your money'}
        onClick={isOpen ? close : open}
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
          isOpen && 'ring-2 ring-violet-400/50',
        )}
      >
        <MessageCircle size={16} />
        <span>Talk your money</span>
        {hasContext && !isOpen && (
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
        )}
      </button>
    </>
  )
}
