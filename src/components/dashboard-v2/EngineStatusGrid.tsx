import { Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import { MOCK_ENGINE_STATUS } from '@/lib/mock-data'

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
          <div
            key={item.engine}
            className="bg-white border border-zinc-200 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}1A` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-3">
              {item.label}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.statusColor }}
              />
              <span className="text-sm font-medium text-[#0A1628]">
                {item.status}
              </span>
            </div>
            <p className="text-xl font-bold text-[#0A1628] mt-2">
              {item.metric}
            </p>
            <p className="text-sm text-zinc-500">{item.subtext}</p>
          </div>
        )
      })}
    </div>
  )
}
