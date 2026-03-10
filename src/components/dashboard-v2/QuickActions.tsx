import { ArrowRight, CreditCard, Sparkles, BarChart3 } from 'lucide-react'

const actions = [
  { label: 'Transfer Money', icon: ArrowRight },
  { label: 'Pay Bills', icon: CreditCard },
  { label: 'Ask Poseidon', icon: Sparkles },
  { label: 'View Reports', icon: BarChart3 },
] as const

export function QuickActions() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="flex items-center gap-2 px-4 py-3 bg-zinc-100 rounded-lg font-medium text-sm text-[#0A1628] whitespace-nowrap hover:bg-zinc-200 transition-colors"
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </button>
      ))}
    </div>
  )
}
