import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ShoppingCart, Coffee, Dumbbell, Banknote, Film, Shield, Zap, TrendingUp } from 'lucide-react'
import { Link } from '@/router'
import { NetWorthCard } from '@/components/dashboard-v2/NetWorthCard'
import { EngineStatusGrid } from '@/components/dashboard-v2/EngineStatusGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { persona } from '@/data/persona'
import { accounts, recentTransactions, monthlyCategories } from '@/data/accounts'
import { formatCurrency, getGreeting, getDemoDateStr } from '@/lib/formatters'

const txnIcons: Record<string, typeof ShoppingCart> = {
  'shopping-cart': ShoppingCart,
  'coffee': Coffee,
  'dumbbell': Dumbbell,
  'banknote': Banknote,
  'film': Film,
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-white/[0.06] rounded-xl bg-white/[0.03] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-4 text-left cursor-pointer"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="border-t border-white/[0.06]">{children}</div>}
    </div>
  )
}

export default function Dashboard() {
  usePageTitle('Dashboard')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)

  return (
    <motion.div
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6`}
      style={PAGE_CONTENT_STYLE}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Greeting */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {persona.name.split(' ')[0]}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground hidden sm:block">{getDemoDateStr()}</p>
      </motion.div>

      {/* Net Worth Hero (One Message: largest element) */}
      <motion.div variants={fadeUp}>
        <NetWorthCard />
      </motion.div>

      {/* 2. Engine Summary Cards (2x2) */}
      <motion.div variants={fadeUp}>
        <EngineStatusGrid />
      </motion.div>

      {/* 3. Needs Your Attention Feed */}
      <motion.div variants={fadeUp}>
        <h2 className="text-lg font-semibold text-foreground mb-3">Needs Your Attention</h2>
        <div className="space-y-3">
          <Link
            to="/protect/alert-detail?alertId=THR-001"
            className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 transition-colors hover:bg-red-500/15"
          >
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
            <Shield className="h-4 w-4 shrink-0 text-red-400" />
            <span className="flex-1 text-sm font-medium text-red-300">
              Suspicious login from Oslo, Norway
            </span>
            <span className="shrink-0 rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              Review
            </span>
          </Link>

          <Link
            to="/execute/approval?actionId=EXE-001"
            className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 transition-colors hover:bg-amber-500/15"
          >
            <Zap className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="flex-1 text-sm font-medium text-amber-300">
              $399.60 tax savings if you approve
            </span>
            <span className="shrink-0 rounded-lg bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
              Approve
            </span>
          </Link>

          <Link
            to="/grow/recommendation?id=GRW-001"
            className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 transition-colors hover:bg-violet-500/15"
          >
            <TrendingUp className="h-4 w-4 shrink-0 text-violet-400" />
            <span className="flex-1 text-sm font-medium text-violet-300">
              +$269.40/year in interest — move to high-yield savings
            </span>
            <span className="shrink-0 rounded-lg bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
              View
            </span>
          </Link>
        </div>
      </motion.div>

      {/* 4. Monthly Spending */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyCategories.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-muted-foreground shrink-0">{cat.name}</span>
                  <div className="flex-1 h-5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/20 rounded-full transition-all"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono tabular-nums text-foreground w-20 text-right shrink-0">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 5. Linked Accounts (collapsible, default closed) */}
      <motion.div variants={fadeUp}>
        <CollapsibleSection title={`Linked Accounts (${accounts.length})`}>
          <div className="divide-y divide-white/[0.06]">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{acc.name}</p>
                  <p className="text-xs text-muted-foreground">{acc.institution}</p>
                </div>
                <p className={`text-sm font-mono tabular-nums font-semibold ${acc.balance < 0 ? 'text-red-600' : 'text-foreground'}`}>
                  {formatCurrency(acc.balance)}
                </p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* 6. Recent Transactions (collapsible, default closed) */}
      <motion.div variants={fadeUp}>
        <CollapsibleSection title="Recent Transactions">
          <div className="divide-y divide-white/[0.06]">
            {recentTransactions.map((txn) => {
              const Icon = txnIcons[txn.icon] ?? ShoppingCart
              return (
                <div key={txn.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{txn.merchant}</p>
                    <p className="text-xs text-muted-foreground">{txn.date}</p>
                  </div>
                  <p className={`text-sm font-mono tabular-nums font-semibold ${txn.amount < 0 ? 'text-foreground' : 'text-emerald-600'}`}>
                    {formatCurrency(txn.amount, { showSign: txn.amount > 0 })}
                  </p>
                </div>
              )
            })}
          </div>
        </CollapsibleSection>
      </motion.div>
    </motion.div>
  )
}
