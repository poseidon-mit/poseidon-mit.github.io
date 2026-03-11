import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  ChevronRight,
  AlertTriangle,
  Copy,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getMotionPreset } from '@/lib/motion-presets'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { Link } from '@/router'
import { CountUp } from '@/components/poseidon'
import { recommendations, growStats } from '@/data/recommendations'
import { subscriptions } from '@/data/accounts'
import { formatCurrency } from '@/lib/formatters'
import { useDemoState } from '@/lib/demo-state'

/* ── Flag display helpers ── */

const FLAG_CONFIG: Record<string, { label: string; icon: typeof AlertTriangle; bg: string; text: string }> = {
  PRICE_INCREASE: { label: 'Price Increase', icon: AlertTriangle, bg: 'bg-amber-500/10', text: 'text-amber-400' },
  DUPLICATE: { label: 'Duplicate', icon: Copy, bg: 'bg-red-500/10', text: 'text-red-400' },
  LOW_USAGE: { label: 'Low Usage', icon: BarChart3, bg: 'bg-orange-500/10', text: 'text-orange-400' },
}

/* ── Page Component ── */
export default function GrowPage() {
  usePageTitle('Grow')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { state } = useDemoState()

  // Parse the hero number from growStats
  const heroAmount = useMemo(() => {
    const match = growStats.totalIdentified.match(/[\d,]+/)
    return match ? Number(match[0].replace(/,/g, '')) : 0
  }, [])

  const realizedAmount = useMemo(() => {
    const match = growStats.realized.match(/[\d,.]+/)
    return match ? Number(match[0].replace(/,/g, '')) : 0
  }, [])

  // Derive recommendation status from demo state
  const getEffectiveStatus = (id: string, originalStatus: string) => {
    const decision = state.recommendations.decisions[id]
    if (decision) {
      return decision.decision === 'accepted' ? 'approved' : 'dismissed'
    }
    return originalStatus
  }

  const acceptedCount = useMemo(() => {
    return recommendations.filter(
      r => getEffectiveStatus(r.id, r.status) === 'approved',
    ).length
  }, [state.recommendations.decisions])

  return (
    <motion.div
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6`}
      style={PAGE_CONTENT_STYLE}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Hero: Annual Savings */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card border-t-4 border-t-violet-600">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Savings Opportunities Identified
            </p>
            <div className="mt-3">
              <CountUp
                value={heroAmount}
                duration={1200}
                prefix="$"
                locale
                className="font-mono tabular-nums text-6xl font-bold text-violet-600"
              />
              <span className="ml-1 text-2xl font-semibold text-violet-400">/year</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Cards 2x2 */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
        <Card className="border border-border bg-card">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Annual Savings</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-foreground">
              {growStats.totalIdentified}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Already Realized</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-emerald-600">
              {formatCurrency(realizedAmount)}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recommendations</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-foreground">
              {growStats.totalRecommendations}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Accepted</p>
            <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-foreground">
              {acceptedCount} of {growStats.totalRecommendations}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription Insights */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Subscription Insights</h2>
            <div className="divide-y divide-border">
              {subscriptions.map((sub) => {
                const flagInfo = sub.flag ? FLAG_CONFIG[sub.flag] : null
                const FlagIcon = flagInfo?.icon
                return (
                  <div
                    key={sub.name}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{sub.name}</span>
                      {flagInfo && (
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] font-semibold', flagInfo.bg, flagInfo.text)}
                        >
                          {FlagIcon && <FlagIcon className="mr-1 h-3 w-3" />}
                          {flagInfo.label}
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono tabular-nums text-sm font-medium text-foreground">
                      {formatCurrency(sub.amount)}/mo
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendation List */}
      <motion.div variants={fadeUp}>
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recommendations</h2>
              <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400">
                <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                {growStats.totalRecommendations} items
              </Badge>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec) => {
                const effectiveStatus = getEffectiveStatus(rec.id, rec.status)
                return (
                  <Link
                    key={rec.id}
                    to={`/grow/recommendation?id=${rec.id}`}
                    className="block"
                  >
                    <div
                      className={cn(
                        'rounded-xl border border-border p-4 transition-colors hover:bg-muted/30',
                        'border-l-4 border-l-violet-600',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-foreground">{rec.title}</p>
                            {effectiveStatus === 'approved' && (
                              <Badge
                                variant="outline"
                                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Approved
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            {rec.description}
                          </p>
                          {(rec.benefit || rec.savings) && (
                            <p className="mt-1.5 font-mono tabular-nums text-sm font-semibold text-violet-600">
                              {rec.benefit ? `+${rec.benefit}` : `Save ${rec.savings}`}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
