import { useState, useEffect } from 'react'
import { Link } from '@/router'
import {
  LayoutDashboard,
  DollarSign,
  CreditCard,
  PiggyBank,
  Bell,
  ShieldAlert,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { accountsSummary } from '@/data/accounts'
import { threats } from '@/data/threats'
import { actions } from '@/data/actions'

function useCountUp(target: number, duration = 500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const tick = () => {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

const pendingActions = actions.filter((a) => a.status === 'pending')
const highThreats = threats.filter((t) => t.severity === 'high')
const monthlyIncome = 29167 // $350,000/year ÷ 12
const savingsRate = Math.round(
  ((monthlyIncome - accountsSummary.monthlySpending) / monthlyIncome) * 100
)

export default function LovableDashboard() {
  const netWorth = useCountUp(accountsSummary.netWorth)
  const spending = useCountUp(accountsSummary.monthlySpending)
  const savings = useCountUp(savingsRate)
  const pending = useCountUp(pendingActions.length)

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Your financial command center</p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          label="Net Worth"
          value={`$${netWorth.toLocaleString()}`}
        />
        <SummaryCard
          icon={CreditCard}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          label="Monthly Spending"
          value={`$${spending.toLocaleString()}`}
        />
        <SummaryCard
          icon={PiggyBank}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          label="Savings Rate"
          value={`${savings}%`}
        />
        <SummaryCard
          icon={Bell}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          label="Pending Actions"
          value={String(pending)}
          pulse
        />
      </div>

      {/* Oslo Alert Card */}
      {highThreats.length > 0 && (
        <div className="bg-white border-2 border-red-200 rounded-xl p-4 mb-4 relative hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">
                  &#9888; Urgent: Suspicious Login from Oslo
                </p>
                <p className="text-sm text-gray-600">
                  {highThreats.length} high-severity threats require your attention
                </p>
              </div>
            </div>
            <Link
              to="/lovable/protect/alert-detail/THR-001?demo=true"
              className="text-red-600 font-medium text-sm whitespace-nowrap hover:underline"
            >
              Review Now &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Top Savings Card */}
      <div className="bg-white border rounded-xl p-4 mb-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-gray-900 font-medium">$831/year in idle cash savings</span>
          </div>
          <Link to="/lovable/grow" className="text-purple-600 font-medium text-sm hover:underline">
            View &rarr;
          </Link>
        </div>
      </div>

      {/* Pending Approval Card */}
      <div className="bg-white border rounded-xl p-4 mb-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
            <span className="text-gray-900 font-medium">Tax-Loss Harvest: Save $1,443</span>
          </div>
          <Link
            to="/lovable/execute/approval/EXE-001"
            className="text-yellow-600 font-medium text-sm hover:underline"
          >
            Review &rarr;
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  pulse,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  label: string
  value: string
  pulse?: boolean
}) {
  return (
    <div className="bg-white border rounded-xl p-4 relative hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {pulse && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      )}
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-bold font-mono tabular-nums text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
