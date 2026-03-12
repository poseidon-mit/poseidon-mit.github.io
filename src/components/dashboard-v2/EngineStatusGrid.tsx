import { Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import { Link } from '@/router'
import { CountUp } from '@/components/poseidon'
import {
  getCanonicalUniverse,
  selectExecuteActionsView,
  selectGovernAuditEntries
} from '@/domain/poseidon-universe'

export function EngineStatusGrid() {
  const universe = getCanonicalUniverse()
  const metrics = universe.metrics
  const pendingActions = selectExecuteActionsView().filter(a => a.executionType !== 'auto').length
  const auditEntries = selectGovernAuditEntries().length

  const engines = [
    {
      key: 'protect',
      label: 'Protect',
      icon: Shield,
      color: '#16A34A',
      path: '/protect',
      metric: metrics.decisionsAuditedTotal,
      context: 'transactions monitored',
      prefix: '',
    },
    {
      key: 'grow',
      label: 'Grow',
      icon: TrendingUp,
      color: '#7C3AED',
      path: '/grow',
      metric: metrics.monthlyOptimizationPotentialUsd * 12,
      context: '/yr savings found',
      prefix: '$',
    },
    {
      key: 'execute',
      label: 'Execute',
      icon: Zap,
      color: '#CA8A04',
      path: '/execute',
      metric: pendingActions,
      context: 'awaiting your decision',
      prefix: '',
    },
    {
      key: 'govern',
      label: 'Govern',
      icon: Eye,
      color: '#2563EB',
      path: '/govern',
      metric: auditEntries,
      context: 'records \u2014 100% auditable',
      prefix: '',
    },
  ] as const

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {engines.map((e) => {
        const Icon = e.icon
        return (
          <Link
            key={e.key}
            to={e.path}
            className="block bg-white/[0.03] border border-white/[0.06] border-t-2 rounded-xl p-5 hover:bg-white/[0.05] transition-all group"
            style={{
              borderTopColor: `${e.color}33`,
              boxShadow: `0 0 40px ${e.color}14`,
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${e.color}1A` }}
              >
                <Icon className="w-5 h-5" style={{ color: e.color }} />
              </div>
              <span className="text-xs font-medium text-white/40 group-hover:text-white/60 transition-colors">
                View &rarr;
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-3">
              {e.label}
            </p>
            <p className="text-xl font-bold text-foreground font-mono tabular-nums mt-1">
              {e.prefix}<CountUp value={e.metric} duration={1200} locale />
            </p>
            <p className="text-sm text-muted-foreground">{e.context}</p>
          </Link>
        )
      })}
    </div>
  )
}
