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
import {
  selectBalanceSheet,
  selectProtectThreats,
  selectExecuteActionsView
} from '@/domain/poseidon-universe'
import { motion } from 'framer-motion'

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const tick = () => {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

const balanceSheet = selectBalanceSheet()
const threats = selectProtectThreats()
const actions = selectExecuteActionsView()

const pendingActions = actions.filter((a) => a.executionType !== 'auto')
const highThreats = threats.filter((t) => t.severity === 'High' || t.severity === 'Critical')
const monthlyIncome = balanceSheet.monthlyIncome || 15000
const savingsRate = Math.round(
  ((monthlyIncome - balanceSheet.monthlyExpenses) / monthlyIncome) * 100
)

const container: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

export default function LovableDashboard() {
  const netWorth = useCountUp(balanceSheet.netWorth)
  const spending = useCountUp(balanceSheet.monthlyExpenses)
  const savings = useCountUp(savingsRate)
  const pending = useCountUp(pendingActions.length)

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Page Header */}
      <motion.div variants={item} className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center ring-1 ring-cyan-500/20">
          <LayoutDashboard className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/40">Your financial command center</p>
        </div>
      </motion.div>

      {/* 4 Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          icon={DollarSign}
          iconBg="bg-green-500/15"
          iconColor="text-green-400"
          glowColor="shadow-[0_0_30px_rgba(34,197,94,0.08)]"
          label="Net Worth"
          value={`$${netWorth.toLocaleString()}`}
        />
        <SummaryCard
          icon={CreditCard}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-400"
          glowColor="shadow-[0_0_30px_rgba(234,179,8,0.08)]"
          label="Monthly Spending"
          value={`$${spending.toLocaleString()}`}
        />
        <SummaryCard
          icon={PiggyBank}
          iconBg="bg-purple-500/15"
          iconColor="text-purple-400"
          glowColor="shadow-[0_0_30px_rgba(139,92,246,0.08)]"
          label="Savings Rate"
          value={`${savings}%`}
        />
        <SummaryCard
          icon={Bell}
          iconBg="bg-red-500/15"
          iconColor="text-red-400"
          glowColor="shadow-[0_0_30px_rgba(239,68,68,0.08)]"
          label="Pending Actions"
          value={String(pending)}
          pulse
        />
      </motion.div>

      {/* Oslo Alert Card */}
      {highThreats.length > 0 && (
        <motion.div
          variants={item}
          className="bg-red-500/[0.08] border border-red-500/20 rounded-xl p-4 mb-4 relative backdrop-blur-sm hover:bg-red-500/[0.12] transition-all duration-300 shadow-[0_0_40px_rgba(239,68,68,0.06)]"
        >
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          </span>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">
                  &#9888; Urgent: Suspicious Login from Oslo
                </p>
                <p className="text-sm text-white/50">
                  {highThreats.length} high-severity threats require your attention
                </p>
              </div>
            </div>
            <Link
              to="/lovable/protect/alert-detail/THR-001?demo=true"
              className="text-red-400 font-medium text-sm whitespace-nowrap hover:text-red-300 transition-colors"
            >
              Review Now &rarr;
            </Link>
          </div>
        </motion.div>
      )}

      {/* Top Savings Card */}
      <motion.div
        variants={item}
        className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 mb-4 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">$831/year in idle cash savings</span>
          </div>
          <Link to="/lovable/grow" className="text-purple-400 font-medium text-sm hover:text-purple-300 transition-colors">
            View &rarr;
          </Link>
        </div>
      </motion.div>

      {/* Pending Approval Card */}
      <motion.div
        variants={item}
        className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 mb-4 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
            <span className="text-white font-medium">Tax-Loss Harvest: Save $399.60</span>
          </div>
          <Link
            to="/lovable/execute/approval/EXE-001"
            className="text-amber-400 font-medium text-sm hover:text-amber-300 transition-colors"
          >
            Review &rarr;
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SummaryCard({
  icon: Icon,
  iconBg,
  iconColor,
  glowColor,
  label,
  value,
  pulse,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  glowColor: string
  label: string
  value: string
  pulse?: boolean
}) {
  return (
    <div className={`bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 relative hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300 ${glowColor}`}>
      {pulse && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        </span>
      )}
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center ring-1 ring-white/[0.08]`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-bold font-mono tabular-nums text-white">{value}</p>
      <p className="text-xs text-white/40 mt-1">{label}</p>
    </div>
  )
}
