import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react'
import { Link } from '@/router'
import { getMotionPreset } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { THREATS } from './protect-data'
import type { ThreatRow, ThreatSeverity } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'

/* ── Severity display config ── */

const severityBadgeConfig: Record<ThreatSeverity, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  High: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  Medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
}

const severityIconColor: Record<ThreatSeverity, string> = {
  Critical: 'text-white',
  High: 'text-white',
  Medium: 'text-white',
  Low: 'text-white',
}

const severityIconBg: Record<ThreatSeverity, string> = {
  Critical: 'bg-red-500',
  High: 'bg-red-500',
  Medium: 'bg-amber-500',
  Low: 'bg-blue-500',
}

const SEVERITY_SORT_ORDER: Record<ThreatSeverity, number> = {
  Critical: 3,
  High: 2,
  Medium: 1,
  Low: 0,
}

/* ── Main Page ── */

export default function ProtectThreatsPage() {
  usePageTitle('Security Threats')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const { dismissed } = useDismissedAlerts()

  const pendingThreats = useMemo(() => {
    const active = THREATS.filter(t => !dismissed.has(t.id) && t.status === 'pending')
    return [...active].sort((a, b) => SEVERITY_SORT_ORDER[b.severity] - SEVERITY_SORT_ORDER[a.severity])
  }, [dismissed])

  return (
    <main id="main-content" role="main" className="hero-viewport">
      <motion.div
        className="flex flex-col gap-5 h-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Back link */}
        <motion.div variants={fadeUp}>
          <Link
            to="/protect"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Protect
          </Link>
        </motion.div>

        {/* Threat list */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3">
          {pendingThreats.length === 0 ? (
            <motion.div variants={fadeUp}>
              <Card className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-md">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                  <p className="mt-4 text-lg font-medium text-foreground">All clear!</p>
                  <p className="text-muted-foreground">No pending threats to review</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="space-y-3">
              <SpotlightThreatCard threat={pendingThreats[0]} />
              {pendingThreats.slice(1).map(threat => (
                <ThreatCard key={threat.id} threat={threat} />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  )
}

/* ── Severity border color mapping ── */

const severityBorderColor: Record<ThreatSeverity, string> = {
  Critical: 'var(--state-critical)',
  High: 'var(--state-critical)',
  Medium: 'var(--state-warning)',
  Low: 'var(--engine-protect)',
}

/* ── Spotlight Threat Card ── */

function SpotlightThreatCard({ threat }: { threat: ThreatRow }) {
  const config = severityBadgeConfig[threat.severity]

  return (
    <div
      className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-lg rounded-2xl p-5 md:p-6 border-l-[3px]"
      style={{
        borderLeftColor: severityBorderColor[threat.severity],
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--engine-protect) 6%, transparent), transparent)',
        boxShadow: '0 0 24px color-mix(in srgb, var(--engine-protect) 8%, transparent), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--state-critical)' }}>
            Priority Alert
          </span>
          <Badge variant="outline" className={cn('text-[9px] uppercase tracking-widest', config.bg, config.text, config.border)}>
            {threat.severity}
          </Badge>
        </div>

        <div className="flex items-start gap-4">
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', severityIconBg[threat.severity])}>
            <AlertTriangle className={cn('h-5 w-5', severityIconColor[threat.severity])} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-foreground">{threat.counterparty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{threat.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
          {threat.account && <span>{threat.account}</span>}
          <span className="font-mono tabular-nums">{threat.amount}</span>
          <span>Detected: {threat.time}</span>
          <span className="tabular-nums">{Math.round(threat.confidence * 100)}% confidence</span>
        </div>
      </div>
    </div>
  )
}

/* ── Threat Card ── */

function ThreatCard({ threat }: { threat: ThreatRow }) {
  const config = severityBadgeConfig[threat.severity]
  const isResolved = threat.status === 'resolved'

  return (
    <div
      className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/[0.1] hover:translate-y-[-1px] transition-all duration-300 border-l-[3px]"
      style={{ borderLeftColor: severityBorderColor[threat.severity] }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', severityIconBg[threat.severity])}
          >
            {isResolved ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <AlertTriangle className={cn('h-5 w-5', severityIconColor[threat.severity])} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-foreground">{threat.counterparty}</p>
              <Badge variant="outline" className={cn('text-[9px] uppercase tracking-widest', config.bg, config.text, config.border)}>
                {threat.severity}
              </Badge>
              {isResolved && (
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[9px] uppercase tracking-widest">
                  Resolved
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{threat.description}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
              {threat.account && <span>{threat.account}</span>}
              <span className="font-mono tabular-nums">{threat.amount}</span>
              <span>Detected: {threat.time}</span>
              {threat.resolvedAt && <span>Resolved: {threat.resolvedAt}</span>}
            </div>
          </div>
        </div>

        <span
          className={cn(
            buttonVariants({ variant: isResolved ? 'outline' : 'default', size: 'sm' }),
            'shrink-0 whitespace-nowrap cursor-default opacity-50'
          )}
        >
          {isResolved ? 'View' : 'Investigate'}
          <ChevronRight className="ml-1 h-4 w-4" />
        </span>
      </div>
    </div>
  )
}

/* ── Empty State ── */

function InlineEmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-md">
      <CardContent className="flex flex-col items-center justify-center py-12">
        {icon}
        <p className="mt-4 text-lg font-medium text-foreground">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
