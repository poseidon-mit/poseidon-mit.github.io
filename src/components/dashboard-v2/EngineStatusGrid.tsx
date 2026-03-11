import { Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import { Link } from '@/router'
import { CountUp } from '@/components/poseidon'
import { protectStats } from '@/data/threats'
import { growStats } from '@/data/recommendations'
import { executeStats } from '@/data/actions'
import { governStats } from '@/data/audit'
import { formatNumber } from '@/lib/formatters'

const engines = [
  {
    key: 'protect',
    label: 'Protect',
    icon: Shield,
    color: '#16A34A',
    path: '/protect',
    metric: protectStats.transactionsMonitored,
    context: 'transactions monitored',
    prefix: '',
  },
  {
    key: 'grow',
    label: 'Grow',
    icon: TrendingUp,
    color: '#7C3AED',
    path: '/grow',
    metric: 2437,
    context: '/yr savings found',
    prefix: '$',
  },
  {
    key: 'execute',
    label: 'Execute',
    icon: Zap,
    color: '#CA8A04',
    path: '/execute',
    metric: executeStats.pending,
    context: 'awaiting your decision',
    prefix: '',
  },
  {
    key: 'govern',
    label: 'Govern',
    icon: Eye,
    color: '#2563EB',
    path: '/govern',
    metric: governStats.totalRecords,
    context: 'records \u2014 100% auditable',
    prefix: '',
  },
] as const

export function EngineStatusGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {engines.map((e) => {
        const Icon = e.icon
        return (
          <Link
            key={e.key}
            to={e.path}
            className="block bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${e.color}1A` }}
              >
                <Icon className="w-5 h-5" style={{ color: e.color }} />
              </div>
              <span className="text-xs font-medium text-stone-400 group-hover:text-stone-600 transition-colors">
                View &rarr;
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-3">
              {e.label}
            </p>
            <p className="text-xl font-bold text-[#1A1A1A] font-mono tabular-nums mt-1">
              {e.prefix}<CountUp value={e.metric} duration={1200} locale />
            </p>
            <p className="text-sm text-stone-500">{e.context}</p>
          </Link>
        )
      })}
    </div>
  )
}
