import { motion } from 'framer-motion'
import { Sparkles, AlertTriangle } from 'lucide-react'
import { Link } from '@/router'
import { NetWorthCard } from '@/components/dashboard-v2/NetWorthCard'
import { EngineStatusGrid } from '@/components/dashboard-v2/EngineStatusGrid'
import { RecentActivityFeed } from '@/components/dashboard-v2/RecentActivityFeed'
import { QuickActions } from '@/components/dashboard-v2/QuickActions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'

const MOCK_USER_NAME = 'Shinji'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getDateStr() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
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
      {/* Greeting */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {MOCK_USER_NAME}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground hidden sm:block">{getDateStr()}</p>
      </motion.div>

      {/* Oslo Alert Banner */}
      <motion.div variants={fadeUp}>
        <Link
          href="/protect/alert-detail?alertId=THR-001"
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 transition-colors hover:bg-red-100"
        >
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          <span className="flex-1 text-sm font-medium text-red-800">
            Suspicious activity from Oslo, Norway
          </span>
          <span className="shrink-0 rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Review Now
          </span>
        </Link>
      </motion.div>

      <motion.div variants={fadeUp}>
        <NetWorthCard />
      </motion.div>

      <motion.div variants={fadeUp}>
        <EngineStatusGrid />
      </motion.div>

      <motion.div variants={fadeUp}>
        <QuickActions />
      </motion.div>

      {/* 2-Column: Recent Activity + AI Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={fadeUp}>
          <RecentActivityFeed />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="border border-border bg-card shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Sparkles className="h-5 w-5 text-cyan-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  "Your Chase Savings earns 0.01% APY. Moving $8,200 to a high-yield savings account at 3.30% APY would earn an additional <span className="font-semibold text-emerald-700">$269.40/year</span> in interest."
                </p>
              </div>
              <div className="rounded-xl bg-violet-50 border border-violet-200 p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  "I've identified <span className="font-semibold text-violet-700">$2,437/year</span> in total savings across 4 recommendations — including subscription optimization, portfolio rebalancing, and credit card reward maximization."
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  "A tax-loss harvesting opportunity in your VTI position could save <span className="font-semibold text-amber-700">$399.60</span> in taxes. Deadline: March 31, 2026. Awaiting your approval."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
