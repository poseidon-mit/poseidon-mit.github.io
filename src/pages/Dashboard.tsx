import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
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
          <p className="mt-1 text-sm text-muted-foreground">
            Your finances at a glance
          </p>
        </div>
        <p className="text-sm text-muted-foreground hidden sm:block">{getDateStr()}</p>
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
              <div className="rounded-xl bg-cyan-50 border border-cyan-200 p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  "Based on your spending patterns, I recommend increasing your 401(k) contribution by 2% to capture the full employer match. This would add an estimated <span className="font-semibold text-emerald-700">$3,600/yr</span> in free money."
                </p>
              </div>
              <div className="rounded-xl bg-violet-50 border border-violet-200 p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  "Your emergency fund is 90% funded. Consider redirecting the remaining $3,000 from your savings surplus over the next 2 months to complete it."
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  "I detected a potential tax-loss harvesting opportunity in your international fund holdings that could save approximately <span className="font-semibold text-emerald-700">$450</span> in taxes this year."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
