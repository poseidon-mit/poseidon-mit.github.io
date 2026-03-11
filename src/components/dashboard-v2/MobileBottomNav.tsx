import { Home, Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import { Link } from '@/router'

const tabs = [
  { label: 'Home', icon: Home, to: '/', active: true },
  { label: 'Protect', icon: Shield, to: '/protect', active: false },
  { label: 'Grow', icon: TrendingUp, to: '/grow', active: false },
  { label: 'Execute', icon: Zap, to: '/execute', active: false },
  { label: 'Govern', icon: Eye, to: '/govern', active: false },
] as const

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-white/[0.06] md:hidden z-20 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.to}
            className={`flex flex-col items-center gap-1 p-2 ${
              tab.active
                ? 'text-foreground font-medium'
                : 'text-white/40'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px]">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
