import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TalkToMoneyFab() {
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
