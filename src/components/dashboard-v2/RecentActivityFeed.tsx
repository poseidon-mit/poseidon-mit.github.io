import { Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import { Link } from '@/router'
import { selectDashboardView } from '@/domain/poseidon-universe'

const typeIcons = {
  protect: Shield,
  grow: TrendingUp,
  execute: Zap,
  govern: Eye,
  system: Eye // Fallback for system kind
} as const

const typeColors = {
  protect: '#16A34A',
  grow: '#7C3AED',
  execute: '#CA8A04',
  govern: '#2563EB',
  system: '#64748B' // Fallback for system kind
} as const

export function RecentActivityFeed() {
  const activities = selectDashboardView().activities
  
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h2>
        <Link
          to="/govern/audit"
          className="text-sm text-[#2563EB] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl divide-y divide-white/[0.06]">
        {activities.map((item) => {
          const Icon = typeIcons[item.kind]
          const color = typeColors[item.kind]

          return (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div
                className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0"
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">
                  {item.label}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {item.relativeTime}
                </p>
              </div>

            </div>
          )
        })}
      </div>
    </section>
  )
}
