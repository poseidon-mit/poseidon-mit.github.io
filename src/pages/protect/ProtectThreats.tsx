import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Link } from '@/router'
import { EmptyState, EngineBadge } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { cn } from '@/lib/utils'
import { THREATS, severityConfig } from './protect-data'
import type { ThreatRow } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

type SortMode = 'critical' | 'confidence' | 'recent'

const SORT_LABELS: Record<SortMode, string> = {
  critical: 'Critical first',
  confidence: 'Highest confidence',
  recent: 'Most recent',
}

export default function ProtectThreatsPage() {
  usePageTitle('All Threats')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const [sort, setSort] = useState<SortMode>('critical')
  const { dismissed } = useDismissedAlerts()

  const activeThreats = useMemo(() => THREATS.filter(t => !dismissed.has(t.id)), [dismissed])

  const sorted = useMemo(() => {
    return [...activeThreats].sort((a, b) => {
      if (sort === 'critical') {
        const scoreA = severityConfig[a.severity].order * 100 + a.confidence * 100
        const scoreB = severityConfig[b.severity].order * 100 + b.confidence * 100
        return scoreB - scoreA
      }
      if (sort === 'confidence') return b.confidence - a.confidence
      return b.sortTime - a.sortTime
    })
  }, [activeThreats, sort])

  const criticalCount = activeThreats.filter(t => t.severity === 'Critical').length

  return (
    <motion.main
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 pb-12`}
      style={PAGE_CONTENT_STYLE}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.section variants={staggerContainer} className="flex flex-col gap-5">
        <div>
          <Link
            to="/protect"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Protect
          </Link>
        </div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <EngineBadge engine="protect" icon={Shield} label="Protect · All Threats" className="self-start" />
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
            All Threats
          </h1>
          <p className="text-white/50 text-base">
            {activeThreats.length === 0
              ? 'No active threats.'
              : `${activeThreats.length} signal${activeThreats.length !== 1 ? 's' : ''}${criticalCount > 0 ? ` · ${criticalCount} critical` : ''}`}
          </p>
        </motion.div>

        {/* Sort bar */}
        <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
          {(Object.keys(SORT_LABELS) as SortMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                sort === mode
                  ? 'bg-[var(--engine-protect)]/15 text-[var(--engine-protect)] border-[var(--engine-protect)]/30'
                  : 'bg-white/[0.04] text-white/40 border-white/10 hover:border-white/20 hover:text-white/60',
              )}
            >
              {SORT_LABELS[mode]}
            </button>
          ))}
        </motion.div>
      </motion.section>

      {/* Threat list */}
      {sorted.length === 0 ? (
        <motion.div variants={fadeUp}>
          <div className="glass-card glass-card-overlay rounded-[24px] p-12 flex items-center justify-center">
            <EmptyState
              icon={Shield}
              title="No active threats"
              description="Threat feed is clear right now."
              accentColor="var(--engine-protect)"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          {sorted.map(threat => (
            <ThreatCard key={threat.id} threat={threat} />
          ))}
        </motion.div>
      )}
    </motion.main>
  )
}

function ThreatCard({ threat }: { threat: ThreatRow }) {
  const config = severityConfig[threat.severity]

  return (
    <div
      className="glass-card glass-card-overlay rounded-[20px] p-5 lg:p-6 flex items-center gap-4 hover:border-white/[0.12] transition-colors border-l-2"
      style={{ borderLeftColor: config.color }}
    >
      {/* Severity icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
        style={{
          borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
          background: `color-mix(in srgb, ${config.color} 10%, transparent)`,
        }}
      >
        <AlertTriangle size={16} style={{ color: config.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium text-white/90 truncate">{threat.merchant}</span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border"
            style={{
              background: config.bg,
              color: config.color,
              borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
            }}
          >
            {threat.severity}
          </span>
        </div>
        <p className="text-xs text-white/40 mb-1 truncate">{threat.description}</p>
        <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
          <span className="font-mono font-bold text-white/70">{threat.amount}</span>
          <span>·</span>
          <span>{threat.time}</span>
          <span>·</span>
          <span style={{ color: config.color }}>{Math.round(threat.confidence * 100)}% confidence</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/protect/alert-detail?alertId=${threat.id}`}
        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
        style={{
          borderColor: 'color-mix(in srgb, var(--engine-protect) 30%, transparent)',
          color: 'var(--engine-protect)',
          background: 'color-mix(in srgb, var(--engine-protect) 10%, transparent)',
        }}
      >
        Investigate
        <ArrowRight size={12} />
      </Link>
    </div>
  )
}
