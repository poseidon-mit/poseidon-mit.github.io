import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Link } from '@/router'
import { EmptyState, EngineBadge, PrioritySpotlight } from '@/components/poseidon'
import { selectSpotlightThreat } from '@/domain/poseidon-universe'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { usePageTitle } from '@/hooks/use-page-title'
import { cn } from '@/lib/utils'
import { CARD_TIER_STYLES, focusGlowStyle, type CardTier } from '@/lib/card-variants'
import { THREATS, severityConfig } from './protect-data'
import type { ThreatRow, ThreatSeverity } from './protect-data'
import { useDismissedAlerts } from './useDismissedAlerts'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

type SortMode = 'critical' | 'confidence' | 'recent'

const SORT_LABELS: Record<SortMode, string> = {
  critical: 'Critical first',
  confidence: 'Highest confidence',
  recent: 'Most recent',
}

function getThreatTier(severity: ThreatSeverity): CardTier {
  if (severity === 'Critical') return 'focus'
  if (severity === 'High') return 'standard'
  return 'compact'
}

export default function ProtectThreatsPage() {
  usePageTitle('All Threats')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)
  const [sort, setSort] = useState<SortMode>('critical')
  const { dismissed } = useDismissedAlerts()

  const activeThreats = useMemo(() => THREATS.filter(t => !dismissed.has(t.id)), [dismissed])

  // Spotlight: highest compositePriority threat always at top
  const spotlightEntity = selectSpotlightThreat()
  const spotlightId = spotlightEntity?.id ?? null

  const spotlightThreat = useMemo(
    () => (spotlightId ? activeThreats.find(t => t.id === spotlightId) ?? null : null),
    [activeThreats, spotlightId],
  )

  const sorted = useMemo(() => {
    const remaining = spotlightId
      ? activeThreats.filter(t => t.id !== spotlightId)
      : activeThreats
    return [...remaining].sort((a, b) => {
      if (sort === 'critical') {
        const scoreA = severityConfig[a.severity].order * 100 + a.confidence * 100
        const scoreB = severityConfig[b.severity].order * 100 + b.confidence * 100
        return scoreB - scoreA
      }
      if (sort === 'confidence') return b.confidence - a.confidence
      return b.sortTime - a.sortTime
    })
  }, [activeThreats, sort, spotlightId])

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
              : `${activeThreats.length} threat${activeThreats.length !== 1 ? 's' : ''}${criticalCount > 0 ? ` · ${criticalCount} critical` : ''}`}
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

      {/* Spotlight threat */}
      {spotlightThreat && (
        <motion.div variants={fadeUp}>
          <PrioritySpotlight engine="protect">
            <SpotlightCard threat={spotlightThreat} />
          </PrioritySpotlight>
        </motion.div>
      )}

      {/* More threats separator */}
      {spotlightThreat && sorted.length > 0 && (
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-xs font-mono text-white/30 uppercase tracking-widest shrink-0">
            {sorted.length} more threat{sorted.length !== 1 ? 's' : ''}
          </span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </motion.div>
      )}

      {/* Threat list */}
      {activeThreats.length === 0 ? (
        <motion.div variants={fadeUp}>
          <div className="glass-card glass-card-overlay rounded-xl p-12 flex items-center justify-center">
            <EmptyState
              icon={Shield}
              title="No active threats"
              description="Threat feed is clear right now."
              accentColor="var(--engine-protect)"
            />
          </div>
        </motion.div>
      ) : sorted.length > 0 ? (
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          {sorted.map(threat => (
            <ThreatCard key={threat.id} threat={threat} />
          ))}
        </motion.div>
      ) : null}
    </motion.main>
  )
}

function SpotlightCard({ threat }: { threat: ThreatRow }) {
  const config = severityConfig[threat.severity]

  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0"
          style={{
            borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
            background: `color-mix(in srgb, ${config.color} 10%, transparent)`,
          }}
        >
          <AlertTriangle size={20} style={{ color: config.color }} />
        </div>
        <span className="text-base md:text-lg font-semibold text-white/90">{threat.counterparty}</span>
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

      {/* Structured data row */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-lg font-mono font-bold text-white/90">{threat.amount}</span>
        <span className="text-sm text-white/55">{threat.time}</span>
        <span className="text-sm font-semibold" style={{ color: config.color }}>
          {Math.round(threat.confidence * 100)}% confidence
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-white/55 leading-relaxed">{threat.description}</p>

      {/* Full-width CTA — hidden on mobile (card is tappable) */}
      <Link
        to={`/protect/alert-detail?alertId=${threat.id}`}
        className={cn(
          'hidden sm:inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors',
          'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950',
          'hover:from-emerald-400 hover:to-cyan-400',
        )}
      >
        Investigate
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}

function ThreatCard({ threat }: { threat: ThreatRow }) {
  const config = severityConfig[threat.severity]
  const tier = getThreatTier(threat.severity)
  const styles = CARD_TIER_STYLES[tier]

  return (
    <Link
      to={`/protect/alert-detail?alertId=${threat.id}`}
      className={cn(
        'glass-card glass-card-overlay rounded-[20px] flex items-center hover:border-white/[0.12] transition-colors border-l-2 group block',
        styles.padding,
        styles.gap,
      )}
      style={{
        borderLeftColor: config.color,
        ...(tier === 'focus' ? focusGlowStyle(config.color) : {}),
      }}
    >
      {/* Severity icon */}
      <div
        className={cn(styles.iconBoxSize, 'flex items-center justify-center border shrink-0')}
        style={{
          borderColor: `color-mix(in srgb, ${config.color} 30%, transparent)`,
          background: `color-mix(in srgb, ${config.color} 10%, transparent)`,
        }}
      >
        <AlertTriangle size={styles.iconSize} style={{ color: config.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={cn('text-white/90 truncate', styles.titleSize)}>{threat.counterparty}</span>
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

        {/* Focus tier: show description */}
        {tier === 'focus' && (
          <p className="text-sm text-white/55 leading-relaxed mb-1.5 line-clamp-2">{threat.description}</p>
        )}

        {/* Structured meta */}
        <div className={cn('flex items-center gap-3 flex-wrap', styles.metaSize)}>
          <span className={cn(styles.amountSize, 'text-white/80')}>{threat.amount}</span>
          <span className="text-white/40">·</span>
          <span className="text-white/55">{threat.time}</span>
          <span className="text-white/40">·</span>
          <span style={{ color: config.color }}>{Math.round(threat.confidence * 100)}% confidence</span>
        </div>
      </div>

      {/* CTA — hidden on mobile, card itself is the touch target */}
      {tier === 'focus' ? (
        <span
          className={cn(
            'shrink-0 hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
            'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950',
            'group-hover:from-emerald-400 group-hover:to-cyan-400',
          )}
        >
          Investigate
          <ArrowRight size={14} />
        </span>
      ) : (
        <span
          className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
          style={{
            borderColor: 'color-mix(in srgb, var(--engine-protect) 30%, transparent)',
            color: 'var(--engine-protect)',
            background: 'color-mix(in srgb, var(--engine-protect) 10%, transparent)',
          }}
        >
          Investigate
          <ArrowRight size={12} />
        </span>
      )}
    </Link>
  )
}
