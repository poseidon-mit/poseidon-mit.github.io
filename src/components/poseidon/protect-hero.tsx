/**
 * Protect Hero — facade components for the /protect page hero section.
 *
 * Two states:
 * - ProtectAnomalyRadar: bento grid with risk contribution radar when critical threat exists
 * - ProtectThreatPosture: posture summary when no critical threats exist
 */
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SeverityBadge } from './severity-badge'
import { CountUp } from './count-up'
import { KpiCard } from './kpi-card'
import { HeroBento } from './hero-bento'
import { ListPortalBar } from './list-portal-bar'
import { Link } from '@/router'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ChartRadar } from '@/assets/charts/ChartRadar'

/* ── Types (narrowed inline — no page-module dependency) ── */

type HeroSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

function toDisplaySeverity(s: HeroSeverity): 'critical' | 'warning' | 'info' {
  switch (s) {
    case 'Critical': return 'critical'
    case 'High': return 'warning'
    case 'Medium': return 'info'
    case 'Low': return 'info'
  }
}

/* ── Posture Stat helper ── */

function PostureStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs md:text-sm text-white/50">{label}</span>
      <span className="text-sm md:text-base font-mono tabular-nums text-white/80">{value}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ANOMALY RADAR HERO
   ═══════════════════════════════════════════════════════ */

export interface ProtectAnomalyRadarProps {
  alert: {
    id: string
    counterparty: string
    amount: string
    confidence: number
    severity: HeroSeverity
    description: string
    time: string
  }
  /** Derived contribution values mapped to radar axes (fixed 0-0.30 scale) */
  radarAxes: { label: string; value: number; maxValue: number; color?: string }[]
  /** Authored short evidence cues for hero display */
  evidenceCues: string[]
  /** Canonical audit chain (alert → action → decision), null if ambiguous or missing */
  auditChain: { alertId: string; actionId: string; decisionId: string } | null
  remainingCount: number
  totalExposure: number
  fpRate: string
  onReviewThreat: () => void
}

export function ProtectAnomalyRadar({
  alert,
  radarAxes,
  evidenceCues,
  auditChain,
  remainingCount,
  totalExposure,
  fpRate,
  onReviewThreat,
}: ProtectAnomalyRadarProps) {
  const [showAiLogic, setShowAiLogic] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <HeroBento engine="protect" accentColor={alert.severity === 'Critical' ? 'var(--state-critical)' : 'var(--state-warning)'} className="xl:grid-cols-[2fr_1fr]">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Col 1: Hero & Content */}
          <div className="flex flex-col gap-3 lg:gap-5 flex-1 p-6 lg:p-10 justify-center">
            {/* Hero Number */}
            <span className="typo-hero-number text-[clamp(2.5rem,8vw,5rem)] leading-none"
                  style={{ color: alert.severity === 'Critical' ? 'var(--state-critical)' : 'var(--state-warning)' }}>
              ${totalExposure.toLocaleString()}
            </span>

            {/* Editorial Headline */}
            <h2 className="typo-display text-xl md:text-2xl lg:text-3xl text-white">
              {alert.severity === 'Critical'
                ? '1 critical threat detected.'
                : '1 high-severity threat requires attention.'}
            </h2>

            {/* Subtitle */}
            <p className="text-sm text-white/50">
              {remainingCount} more under review · {fpRate} false positive rate
            </p>

            {/* Alert info row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
              <SeverityBadge severity={toDisplaySeverity(alert.severity)} />
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{alert.id}</span>
              <span className="text-sm font-medium text-white/90">{alert.counterparty}</span>
              <span className="text-sm font-mono tabular-nums text-white/70">{alert.amount}</span>
              <span className="text-xs font-mono text-white/40">
                <CountUp value={alert.confidence} decimals={2} /> confidence
              </span>
            </div>
          </div>

          {/* Col 2: Action & AI Logic */}
          <div className="flex flex-col gap-6 lg:min-w-[300px] lg:border-l lg:border-white/5 p-6 lg:p-10 justify-center bg-white/[0.02]">
            {/* CTAs */}
            <div className="flex flex-col gap-3 mt-auto lg:mt-0">
              <button
                onClick={onReviewThreat}
                data-cta-priority="primary"
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'h-auto w-full md:w-auto rounded-2xl px-8 py-4 min-h-[44px]',
                  'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950',
                  'font-semibold tracking-wide text-sm',
                  'hover:from-emerald-400 hover:to-cyan-400 transition-all',
                  'flex items-center justify-center gap-2',
                )}
              >
                Review threat <ArrowRight size={16} />
              </button>
              <Link
                to={auditChain ? `/govern/audit-detail?decision=${auditChain.decisionId}` : '/govern/audit'}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-auto w-full md:w-auto rounded-2xl px-8 py-4 min-h-[44px]',
                  'border-white/12 bg-white/[0.03] text-white/75',
                  'font-semibold tracking-wide text-sm',
                  'hover:bg-white/[0.06] hover:text-white transition-all',
                  'flex items-center justify-center gap-2',
                )}
              >
                View audit trail <ArrowRight size={14} />
              </Link>
            </div>

            {/* ✨ AI Logic toggle + inline accordion */}
            {evidenceCues.length > 0 && (
              <div className="flex flex-col items-start mt-auto">
                <button
                  onClick={() => setShowAiLogic(v => !v)}
                  className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors"
                >
                  <span>✨</span>
                  <span>{showAiLogic ? 'Hide AI Logic' : 'Read AI Logic'}</span>
                </button>
                <div className={cn(
                  'overflow-hidden transition-all duration-300 w-full',
                  showAiLogic ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                )}>
                  <div className="flex flex-col gap-1.5">
                    {evidenceCues.map((cue, i) => (
                      <p key={i} className="text-xs font-mono text-white/40 flex items-start gap-2">
                        <span className="text-white/20 mt-0.5 shrink-0">·</span>
                        <span>{cue}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Col 3: Radar */}
          <div className="flex flex-col gap-4 p-6 lg:p-10 lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-black/20 items-center lg:justify-center">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 self-start md:self-center">
              Risk Contribution Profile
            </span>

            {radarAxes.length > 0 && (
              <div className="w-full max-w-[300px]">
                <ChartRadar
                  axes={radarAxes}
                  width={300}
                  height={300}
                  rings={4}
                  showLabels
                  showValues={false}
                  fillColor={alert.severity === 'Critical' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'}
                  fillOpacity={0.15}
                  strokeColor={alert.severity === 'Critical' ? 'var(--state-critical)' : 'var(--state-warning)'}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Zone C: Portal ── */}
        <HeroBento.Portal>
          <ListPortalBar
            engine="protect"
            label={`${remainingCount} more threat${remainingCount !== 1 ? 's' : ''}`}
            count={remainingCount}
            destination={{ type: 'route', to: '/protect/threats' }}
          />
        </HeroBento.Portal>
      </HeroBento>

      {/* Bridge line */}
      {remainingCount > 0 && (
        <p className="text-xs text-white/30 text-center font-mono tracking-wide">
          {remainingCount} more threat{remainingCount !== 1 ? 's' : ''} below · ${totalExposure.toLocaleString()} total exposure
        </p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   THREAT POSTURE (fallback — no critical alerts)
   ═══════════════════════════════════════════════════════ */

export interface ProtectThreatPostureProps {
  activeCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  resolvedCount: number
  fpRate: string
  modelUpdate: string
  topAlert: { id: string; counterparty: string; severity: HeroSeverity } | null
  onOpenTopAlert: (() => void) | null
}

export function ProtectThreatPosture({
  activeCount,
  highCount,
  resolvedCount,
  fpRate,
  topAlert,
  onOpenTopAlert,
}: ProtectThreatPostureProps) {
  const heading = activeCount === 0
    ? 'All clear'
    : `No critical alerts — ${activeCount} threat${activeCount !== 1 ? 's' : ''} monitored`

  return (
    <HeroBento engine="protect">
      <div className="flex flex-col lg:flex-row w-full">
        <div className="flex flex-col gap-6 lg:gap-10 flex-1 p-6 lg:p-10 justify-center">
          <h2 className="typo-display text-2xl md:text-3xl lg:text-[clamp(2rem,4vw,3rem)] text-white">
            {heading}
          </h2>

          {/* KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-5">
            <KpiCard label="Active threats" value={activeCount} />
            <KpiCard
              label="High severity"
              value={highCount}
              color={highCount > 0 ? 'var(--state-warning)' : undefined}
            />
            <KpiCard label="Resolved (30d)" value={resolvedCount} color="var(--engine-protect)" />
            <KpiCard label="False positive rate" value={fpRate} />
          </div>
        </div>

        {/* Top alert CTA */}
        {topAlert && onOpenTopAlert && (
          <div className="flex flex-col lg:min-w-[300px] lg:border-l lg:border-white/5 p-6 lg:p-10 justify-end mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-white/[0.06] lg:border-t-0 bg-white/[0.02]">
            <button
              onClick={onOpenTopAlert}
              data-cta-priority="primary"
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'h-auto w-full md:w-auto self-start rounded-2xl px-8 py-4 min-h-[44px]',
                'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950',
                'font-semibold tracking-wide text-sm',
                'hover:from-emerald-400 hover:to-cyan-400 transition-all',
                'flex items-center justify-center gap-2',
              )}
            >
              Review top alert <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Posture Metrics */}
        <div className="flex flex-col gap-3 p-6 lg:p-10 lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-black/20">
          <span className="typo-label text-white/30">Posture Metrics</span>
          <div className="flex flex-col gap-4 mt-2">
            <PostureStat label="Transactions monitored" value="1,347" />
            <PostureStat label="Accounts protected" value={String(activeCount)} />
            <PostureStat label="False positive rate" value={fpRate} />
            <PostureStat label="Last scan" value="2 min ago" />
          </div>
        </div>
      </div>

      {/* ── Zone C: Portal ── */}
      <HeroBento.Portal>
        <ListPortalBar
          engine="protect"
          label="View all threats"
          count={activeCount}
          destination={{ type: 'route', to: '/protect/threats' }}
        />
      </HeroBento.Portal>
    </HeroBento>
  )
}
