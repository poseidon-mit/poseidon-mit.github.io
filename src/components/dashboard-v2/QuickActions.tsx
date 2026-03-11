import { ArrowRight, CreditCard, Sparkles, BarChart3 } from 'lucide-react'
import { Link } from '@/router'

const actions = [
  { label: 'Transfer Money', icon: ArrowRight, path: '/execute' },
  { label: 'Pay Bills', icon: CreditCard, path: '/execute' },
  { label: 'Ask Poseidon', icon: Sparkles, path: '/help' },
  { label: 'View Reports', icon: BarChart3, path: '/govern/audit' },
] as const

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Link
          key={action.label}
          to={action.path}
          className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] rounded-lg font-medium text-sm text-foreground hover:bg-white/[0.08] transition-colors"
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </Link>
      ))}
    </div>
  )
}
