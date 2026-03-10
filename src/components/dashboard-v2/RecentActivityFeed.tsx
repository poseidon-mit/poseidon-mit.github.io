import { Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import { Link } from '@/router'
import { MOCK_RECENT_ACTIVITY } from '@/lib/mock-data'

const typeIcons = {
  protect: Shield,
  grow: TrendingUp,
  execute: Zap,
  govern: Eye,
} as const

const typeColors = {
  protect: '#16A34A',
  grow: '#7C3AED',
  execute: '#CA8A04',
  govern: '#2563EB',
} as const

const amountFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
})

export function RecentActivityFeed() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#1A1A1A]">
          Recent Activity
        </h2>
        <Link
          to="/govern/audit"
          className="text-sm text-[#2563EB] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
        {MOCK_RECENT_ACTIVITY.map((item) => {
          const Icon = typeIcons[item.type]
          const color = typeColors[item.type]

          return (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div
                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0"
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#1A1A1A]">
                  {item.title}
                </p>
                <p className="text-sm text-stone-500 truncate">
                  {item.description}
                </p>
              </div>

              <div className="shrink-0 text-right flex flex-col items-end gap-1">
                <span className="text-xs text-stone-400">{item.time}</span>
                {'amount' in item && item.amount != null && (
                  <span
                    className={`font-semibold text-sm ${
                      item.amount < 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {amountFmt.format(item.amount)}
                  </span>
                )}
                {'action' in item && item.action && (
                  <Link
                    to={`/${item.type}`}
                    className="text-xs font-medium text-[#2563EB] hover:underline"
                  >
                    {item.action}
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
