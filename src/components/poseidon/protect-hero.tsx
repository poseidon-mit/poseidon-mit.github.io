/**
 * Protect Hero — facade components for the /protect page hero section.
 *
 * Two states:
 * - ProtectAnomalyRadar: bento grid with risk contribution radar when critical threat exists
 * - ProtectThreatPosture: posture summary when no critical threats exist
 */
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { SeverityBadge, CountUp, KpiCard, AuroraPulse } from '@/components/poseidon'
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
    merchant: string
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
  onReviewSignal: () => void
}

export function ProtectAnomalyRadar({
  alert,
  radarAxes,
  evidenceCues,
  auditChain,
  remainingCount,
  totalExposure,
  fpRate,
  onReviewSignal,
}: ProtectAnomalyRadarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative glass-card rounded-[32px] border border-[var(--state-critical)]/20 overflow-hidden">
        <AuroraPulse color="var(--state-critical)" intensity="subtle" className="absolute inset-0 pointer-events-none" />

        {/* Grid: mobile DOM order = headline → action → radar.
             Desktop: headline + radar on row 1, action spanning row 2.
             Uses explicit grid-row/col placement instead of grid-template-areas
             to avoid needing custom CSS. */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12">
          {/* ── Section 1: Headline & Status ── */}
          <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-5 md:col-span-5 md:row-start-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--engine-protect)]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Protect Engine
              </span>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-medium text-white/90">
                1 critical threat detected.
              </h2>
              <p className="text-sm text-white/50 mt-1">
                {remainingCount} more under review.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.06]">
              <PostureStat label="Total exposure" value={`$${totalExposure.toLocaleString()}`} />
              <PostureStat label="False positive rate" value={fpRate} />
            </div>
          </div>

          {/* ── Section 3: Action Spotlight (DOM before radar for mobile above-fold) ── */}
          <div className="px-6 md:px-8 lg:px-10 py-5 border-t border-white/[0.06] md:col-span-12 md:row-start-2 flex flex-col gap-4">
            {/* Alert info row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <SeverityBadge severity={toDisplaySeverity(alert.severity)} />
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{alert.id}</span>
              <span className="text-sm font-medium text-white/90">{alert.merchant}</span>
              <span className="text-sm font-mono tabular-nums text-white/70">{alert.amount}</span>
              <span className="text-xs font-mono text-white/40">
                <CountUp value={alert.confidence} decimals={2} /> confidence
              </span>
            </div>

            {/* Audit chain */}
            {auditChain && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/30 tracking-wide">
                <span>{auditChain.alertId}</span>
                <ArrowRight size={10} className="text-white/20" />
                <span>{auditChain.actionId}</span>
                <ArrowRight size={10} className="text-white/20" />
                <span>{auditChain.decisionId}</span>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={onReviewSignal}
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'w-full md:w-auto rounded-2xl px-8 py-4 min-h-[44px]',
                  'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950',
                  'font-semibold tracking-wide text-sm',
                  'hover:from-emerald-400 hover:to-cyan-400 transition-all',
                  'flex items-center justify-center gap-2',
                )}
              >
                Review signal <ArrowRight size={16} />
              </button>
              {auditChain && (
                <Link
                  to={`/govern/audit-detail?decision=${auditChain.decisionId}`}
                  className={cn(
                    buttonVariants({ variant: 'glass', size: 'lg' }),
                    'w-full md:w-auto rounded-2xl px-8 py-4 min-h-[44px]',
                    'font-medium tracking-wide text-sm',
                    'flex items-center justify-center gap-2',
                  )}
                >
                  View audit trail <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>

          {/* ── Section 2: Risk Contribution Radar ── */}
          <div className="p-6 md:p-8 lg:p-10 md:col-span-7 md:row-start-1 md:col-start-6 flex flex-col items-center gap-4">
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
                  fillColor="rgba(239,68,68,0.12)"
                  fillOpacity={0.15}
                  strokeColor="var(--state-critical)"
                />
              </div>
            )}

            {/* Evidence cues */}
            {evidenceCues.length > 0 && (
              <div className="flex flex-col gap-1.5 self-start md:self-center">
                {evidenceCues.map((cue, i) => (
                  <p key={i} className="text-xs font-mono text-white/40 flex items-start gap-2">
                    <span className="text-white/20 mt-0.5 shrink-0">·</span>
                    <span>{cue}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
  topAlert: { id: string; merchant: string; severity: HeroSeverity } | null
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
    <div className="flex flex-col gap-4">
      <div className="glass-card rounded-[32px] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={18} className="text-[var(--engine-protect)]" />
          <h2 className="text-lg md:text-xl font-medium text-white/90">{heading}</h2>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Active threats" value={activeCount} />
          <KpiCard
            label="High severity"
            value={highCount}
            color={highCount > 0 ? 'var(--state-warning)' : undefined}
          />
          <KpiCard label="Resolved (30d)" value={resolvedCount} color="var(--engine-protect)" />
          <KpiCard label="False positive rate" value={fpRate} />
        </div>

        {/* Top alert CTA */}
        {topAlert && onOpenTopAlert && (
          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <button
              onClick={onOpenTopAlert}
              className={cn(
                buttonVariants({ variant: 'glass', size: 'sm' }),
                'w-full md:w-auto rounded-xl px-6 py-3 min-h-[44px]',
                'font-medium tracking-wide text-sm',
                'flex items-center justify-center gap-2',
              )}
            >
              Review top alert <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
