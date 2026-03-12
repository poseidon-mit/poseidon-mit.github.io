import { ArrowRight, ShieldAlert } from 'lucide-react'
import { Link } from '@/router'
import { buttonVariants } from '@/components/ui/button'
import { ListPortalBar } from './list-portal-bar'
import { RadarSweep } from './effects/RadarSweep'
import { cn } from '@/lib/utils'
import {
  HeroBackdrop,
  HeroEyebrow,
  HeroMetricPill,
  HeroPanel,
} from './hero-concept-primitives'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

type HeroSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

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
  radarAxes: {
    label: string
    value: number
    maxValue: number
    color?: string
  }[]
  evidenceCues: string[]
  auditChain: { alertId: string; actionId: string; decisionId: string } | null
  remainingCount: number
  totalExposure: number
  fpRate: string
  onReviewThreat: () => void
}

function ProtectLedgerField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{label}</p>
      <p className="mt-2 text-sm text-white">{value}</p>
    </div>
  )
}

function BackgroundTransactionTape({
  items,
  reducedMotion,
}: {
  items: string[]
  reducedMotion: boolean
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_center,transparent_18%,rgba(0,0,0,0.6)_74%)]" />
      <div className="absolute inset-y-0 left-0 flex w-full flex-col justify-between px-4 py-5 text-[10px] font-mono uppercase tracking-[0.18em] text-white/20 md:px-8">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className={cn(
              'flex justify-between gap-6 whitespace-nowrap',
              !reducedMotion && index % 2 === 0 && 'animate-[pulse_9s_ease-in-out_infinite]',
            )}
          >
            <span>{item}</span>
            <span>verified</span>
            <span>{item}</span>
            <span>verified</span>
          </div>
        ))}
      </div>
    </div>
  )
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
  const reducedMotion = useReducedMotionSafe()
  const ringClass = reducedMotion ? '' : 'animate-[ping_4s_ease-out_infinite]'
  const tapeItems = [
    `${alert.id} // ${alert.time}`,
    `${alert.counterparty} // ${alert.amount}`,
    `${Math.round(alert.confidence * 100)}% confidence // geo mismatch`,
    `owner review required // protect matrix live`,
    `exposure ${totalExposure.toLocaleString()} // false positives ${fpRate}`,
  ]

  return (
    <div className="flex flex-col gap-3">
      <section
        role="region"
        aria-labelledby="protect-hero-title"
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111d]"
      >
        <HeroBackdrop
          accent="var(--engine-protect)"
          secondaryAccent="var(--engine-govern)"
          reducedMotion={reducedMotion}
        />
        <BackgroundTransactionTape items={tapeItems} reducedMotion={reducedMotion} />

        <div className="relative z-10 grid min-h-[65vh] gap-8 px-6 py-8 md:px-10 md:py-10 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <HeroEyebrow>
                <ShieldAlert className="h-3.5 w-3.5 text-[var(--engine-protect)]" />
                Protect matrix live
              </HeroEyebrow>
              <HeroEyebrow className="text-white/52">Status: 1 anomaly flagged</HeroEyebrow>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-white/38">
                Glass matrix projection
              </p>
              <h2
                id="protect-hero-title"
                className="mt-4 text-[clamp(2.7rem,8vw,5.5rem)] font-semibold leading-none tracking-[-0.06em] text-white"
              >
                GLASS MATRIX
                <br />
                PROJECTION
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/58">
                Protect pushed the highest-priority anomaly to the center, suppressed the
                background noise, and kept the next action path attached to the same proof chain.
              </p>
            </div>

            <div className="relative flex items-center justify-center py-4">
              <div className={cn('absolute h-[320px] w-[320px] rounded-full border border-[rgba(34,197,94,0.26)]', ringClass)} />
              <div
                className={cn(
                  'absolute h-[420px] w-[420px] rounded-full border border-[rgba(34,197,94,0.12)]',
                  !reducedMotion && 'animate-[ping_5.8s_ease-out_infinite]',
                )}
              />
              <RadarSweep size={420} />
              <HeroPanel className="relative z-10 w-full max-w-xl px-6 py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <HeroEyebrow className="border-[rgba(34,197,94,0.22)] text-[var(--engine-protect)]">
                    Anomaly detected
                  </HeroEyebrow>
                  <HeroEyebrow className="font-mono text-white/46">{alert.id}</HeroEyebrow>
                </div>

                <p className="mt-5 text-2xl font-semibold text-white md:text-3xl">
                  {alert.counterparty}
                </p>
                <p className="mt-2 font-mono text-3xl text-[var(--engine-protect)] md:text-4xl">
                  {alert.amount}
                </p>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/58">
                  {alert.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <HeroMetricPill
                    label="Confidence"
                    value={`${Math.round(alert.confidence * 100)}%`}
                    tone="var(--engine-protect)"
                  />
                  <HeroMetricPill label="Severity" value={alert.severity} />
                  <HeroMetricPill label="Observed" value={alert.time} />
                </div>
              </HeroPanel>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onReviewThreat}
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'min-h-[48px] rounded-full bg-[var(--engine-protect)] px-7 text-slate-950 hover:bg-[var(--engine-protect)]/90',
                )}
              >
                Review threat
              </button>
              <Link
                to={
                  auditChain
                    ? `/govern/audit-detail?decision=${auditChain.decisionId}`
                    : '/govern/audit'
                }
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'min-h-[48px] rounded-full border-white/15 bg-white/[0.03] px-7 text-white/80 hover:bg-white/[0.08]',
                )}
              >
                View audit trail
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <HeroPanel className="px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Containment field
            </p>

            <div className="mt-5 space-y-3">
              {radarAxes.slice(0, 3).map((item) => (
                <div key={item.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-white/50">
                    <span>{item.label}</span>
                    <span className="font-mono">{Math.round(item.value * 100)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (item.value / Math.max(item.maxValue, 0.01)) * 100)}%`,
                        backgroundColor: item.color ?? 'var(--engine-protect)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ProtectLedgerField label="Total exposure" value={`$${totalExposure.toLocaleString()}`} />
              <ProtectLedgerField label="False positives" value={fpRate} />
              <ProtectLedgerField label="Remaining queue" value={`${remainingCount} below`} />
              <ProtectLedgerField label="Linked review" value={auditChain ? auditChain.actionId : 'Govern audit'} />
            </div>

            {evidenceCues.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Why Poseidon cares
                </p>
                <div className="mt-4 space-y-3">
                  {evidenceCues.slice(0, 3).map((cue) => (
                    <p key={cue} className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm leading-6 text-white/58">
                      {cue}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </HeroPanel>
        </div>

        <div className="border-t border-white/10 px-6 py-4 md:px-10">
          <ListPortalBar
            engine="protect"
            label="Threat details"
            count={remainingCount + 1}
            destination={{ type: 'route', to: '/protect/threats' }}
          />
        </div>
      </section>

      <p className="text-center text-xs font-mono uppercase tracking-[0.22em] text-white/28">
        {remainingCount} more threat{remainingCount === 1 ? '' : 's'} below · $
        {totalExposure.toLocaleString()} exposure mapped to the current account graph
      </p>
    </div>
  )
}

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
  mediumCount,
  lowCount,
  resolvedCount,
  fpRate,
  modelUpdate,
  topAlert,
  onOpenTopAlert,
}: ProtectThreatPostureProps) {
  const reducedMotion = useReducedMotionSafe()

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111d] px-6 py-8 md:px-10 md:py-10">
      <HeroBackdrop
        accent="var(--engine-protect)"
        secondaryAccent="var(--engine-dashboard)"
        reducedMotion={reducedMotion}
      />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <HeroEyebrow>Monitoring matrix</HeroEyebrow>
          <h2
            className="mt-5 font-light tracking-tight text-[clamp(2.4rem,6vw,4.3rem)] text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {activeCount === 0
              ? 'All clear'
              : `Monitoring matrix stable. ${activeCount} alerts still tracked.`}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/55">
            Protect stays read-only, keeps background telemetry flowing, and only escalates
            when the evidence stack becomes undeniable.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <HeroMetricPill label="Active" value={activeCount} tone="var(--engine-protect)" />
            <HeroMetricPill label="Resolved" value={resolvedCount} />
            <HeroMetricPill label="False positives" value={fpRate} />
            <HeroMetricPill label="Latest pass" value={modelUpdate} />
          </div>
        </div>

        <HeroPanel className="px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Monitoring posture
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ProtectLedgerField label="High / Medium / Low" value={`${highCount} / ${mediumCount} / ${lowCount}`} />
            <ProtectLedgerField label="Resolved" value={`${resolvedCount} closed`} />
          </div>
          <p className="mt-5 text-sm leading-7 text-white/58">
            This calmer state intentionally removes the sonar focus and leaves the route ready
            for manual review when a new spike re-enters the field.
          </p>

          {topAlert && onOpenTopAlert && (
            <button
              type="button"
              onClick={onOpenTopAlert}
              className="mt-6 inline-flex h-auto min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950"
            >
              Review top alert
            </button>
          )}

          <div className="mt-6 border-t border-white/10 pt-6">
            <ListPortalBar
              engine="protect"
              label="View all threats"
              count={activeCount}
              destination={{ type: 'route', to: '/protect/threats' }}
            />
          </div>
        </HeroPanel>
      </div>
    </section>
  )
}
