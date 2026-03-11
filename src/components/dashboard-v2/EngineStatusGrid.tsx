import { Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import { Link } from '@/router'
import { MOCK_ENGINE_STATUS } from '@/lib/mock-data'
import { AnimatedNumber } from '@/components/ui/animated-number'

const engineIcons = {
  protect: Shield,
  grow: TrendingUp,
  execute: Zap,
  govern: Eye,
} as const

const engineColors = {
  protect: '#16A34A',
  grow: '#7C3AED',
  execute: '#CA8A04',
  govern: '#2563EB',
} as const

export function EngineStatusGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {MOCK_ENGINE_STATUS.map((item) => {
        const Icon = engineIcons[item.engine]
        const color = engineColors[item.engine]

        return (
          <Link
            key={item.engine}
            to={`/${item.engine}`}
            className="block bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}1A` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-3">
              {item.label}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.statusColor }}
              />
              <span className="text-sm font-medium text-[#1A1A1A]">
                {item.status}
              </span>
            </div>
            <p className="text-xl font-bold text-[#1A1A1A] mt-2">
              <AnimatedNumber value={item.metricValue} format={item.metricFormat} />
            </p>
            <p className="text-sm text-stone-500">{item.subtext}</p>
          </Link>
        )
      })}
    </div>
  )
}
