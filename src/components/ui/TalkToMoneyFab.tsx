import { MessageCircle } from 'lucide-react'
import { Link } from '@/router'
import { cn } from '@/lib/utils'

export function TalkToMoneyFab() {
  return (
    <Link
      to="/chat"
      aria-label="Talk your money"
      className={cn(
        'fixed right-6 z-30',
        'mb-[env(safe-area-inset-bottom,0px)]',
        'bottom-[calc(64px+12px)] lg:bottom-20',
        'flex items-center justify-center rounded-full',
        'bg-gradient-to-r from-violet-500 to-cyan-500',
        'h-[52px] w-[52px]',
        'text-white',
        'shadow-lg shadow-violet-500/30',
        'backdrop-blur-md',
        'cursor-pointer',
        'border border-white/20',
        'hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 transition-all',
      )}
    >
      <MessageCircle size={22} className="relative z-10" />
      <span className="sr-only">Talk your money</span>
    </Link>
  )
}
