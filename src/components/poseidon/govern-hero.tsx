import { useState } from 'react'
import { CheckCircle2, Eye, LockKeyhole, Shield, Terminal } from 'lucide-react'
import { MatrixRain } from './effects/MatrixRain'
import { ListPortalBar } from './list-portal-bar'
import { cn } from '@/lib/utils'
import type { DecisionStatus } from '@/domain/poseidon-universe'
import {
  HeroBackdrop,
  HeroEyebrow,
  HeroMetricPill,
  HeroPanel,
} from './hero-concept-primitives'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

export interface GovernHeroProps {
  decisionsAudited: number
  engineBreakdown: { engine: string; count: number; percent: number; color: string }[]
  auditEntries: {
    id: string
    engine: string
    engineColor: string
    action: string
    confidence: number
    time: string
    status: DecisionStatus
    modelVersion: string
    topFactor: string
  }[]
  errorCount?: number
  statusBreakdown?: { verified: number; pending: number; flagged: number }
  trustGuarantees?: {
    autoExecutionsWithoutConsent: number
    auditCoveragePercent: number
    llmTrainingOptOut: boolean
  }
  spotlightEntry?: { id: string; action: string; status: DecisionStatus; confidence: number } | null
}

export type GovernImmutableLedgerProps = GovernHeroProps

const STATUS_CLASS: Record<DecisionStatus, string> = {
  Verified: 'bg-[rgba(34,197,94,0.14)] text-[var(--engine-protect)]',
  'Pending review': 'bg-[rgba(234,179,8,0.14)] text-[var(--engine-execute)]',
  Flagged: 'bg-[rgba(59,130,246,0.16)] text-[var(--engine-govern)]',
}

export function GovernHero({
  decisionsAudited,
  engineBreakdown,
  auditEntries,
  errorCount = 0,
  statusBreakdown,
  trustGuarantees,
  spotlightEntry,
}: GovernHeroProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const reducedMotion = useReducedMotionSafe()

  return (
    <section
      role="region"
      aria-labelledby="govern-hero-title"
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#071121]"
    >
      <MatrixRain columnCount={34} />
      <HeroBackdrop
        accent="var(--engine-govern)"
        secondaryAccent="var(--engine-dashboard)"
        reducedMotion={reducedMotion}
      />

      <div className="relative z-10 flex min-h-[65vh] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <div className="grid flex-1 gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <HeroEyebrow>
                <Terminal className="h-3.5 w-3.5 text-[var(--engine-govern)]" />
                Decoded audit console
              </HeroEyebrow>
              <HeroEyebrow className="text-white/52">100% auditability</HeroEyebrow>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-white/38">Shield matrix</p>
              <h2
                id="govern-hero-title"
                className="mt-4 text-[clamp(2.7rem,8vw,5.5rem)] font-semibold leading-none tracking-[-0.06em] text-white"
              >
                SHIELD
                <br />
                MATRIX
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/58">
                Every governed decision stays replayable. The hero keeps the current ledger,
                spotlight exception, and safety guarantees on the same console plane.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <HeroMetricPill
                label="Audit decisions"
                value={decisionsAudited.toLocaleString()}
                tone="var(--engine-govern)"
              />
              <HeroMetricPill label="Integrity breaks" value={errorCount} />
              {statusBreakdown && (
                <HeroMetricPill
                  label="Verified / Pending / Flagged"
                  value={`${statusBreakdown.verified} / ${statusBreakdown.pending} / ${statusBreakdown.flagged}`}
                />
              )}
            </div>

            <HeroPanel className="relative overflow-hidden px-5 py-5 font-mono">
              <div className="absolute inset-y-8 right-14 hidden w-px bg-[linear-gradient(180deg,rgba(59,130,246,0),rgba(59,130,246,0.8),rgba(59,130,246,0))] blur-[1px] lg:block" />
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                Immutable ledger
              </p>
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <p className="text-[var(--engine-govern)]">
                  &gt; Govern console online. {decisionsAudited.toLocaleString()} auditable decisions in the current selector set.
                </p>
                {auditEntries.slice(0, 3).map((entry) => (
                  <p key={entry.id}>
                    &gt; [{entry.time}] {entry.id} {entry.engine.padEnd(7, ' ')} | {entry.action}
                  </p>
                ))}
                <p className={cn(!reducedMotion && 'animate-pulse')}>&gt; _</p>
              </div>
            </HeroPanel>
          </div>

          <div className="flex flex-col gap-5">
            <HeroPanel className="px-5 py-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  What Poseidon checked
                </p>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--engine-govern)]">
                  audit coverage
                </span>
              </div>

              <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/[0.06]">
                {engineBreakdown.map((item) => (
                  <div
                    key={item.engine}
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/45">
                {engineBreakdown.map((item) => (
                  <span key={item.engine} className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.engine} {item.percent}%
                  </span>
                ))}
              </div>

              {spotlightEntry && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]',
                        STATUS_CLASS[spotlightEntry.status],
                      )}
                    >
                      {spotlightEntry.status}
                    </span>
                    <span className="font-mono text-xs text-white/35">{spotlightEntry.id}</span>
                  </div>
                  <p className="mt-3 text-sm text-white">{spotlightEntry.action}</p>
                  <p className="mt-2 text-xs text-white/45">
                    {Math.round(spotlightEntry.confidence * 100)}% confidence
                  </p>
                </div>
              )}
            </HeroPanel>

            <HeroPanel className="px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Activity log</p>
              <div className="mt-4 space-y-3">
                {auditEntries.slice(0, 4).map((entry) => {
                  const expanded = expandedId === entry.id
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : entry.id)}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition-colors hover:bg-white/[0.05]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-white">{entry.action}</p>
                          <p className="mt-2 font-mono text-xs text-white/35">
                            {entry.time} · {entry.id}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]',
                            STATUS_CLASS[entry.status],
                          )}
                        >
                          {entry.status}
                        </span>
                      </div>
                      {expanded && (
                        <div className="mt-4 border-t border-white/10 pt-4 text-xs leading-6 text-white/48">
                          <p>Model: {entry.modelVersion}</p>
                          <p>Top factor: {entry.topFactor}</p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </HeroPanel>

            {trustGuarantees && (
              <HeroPanel className="px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Your safety guarantees
                </p>
                <div className="mt-4 space-y-2 text-sm text-white/58">
                  <p className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--engine-protect)]" />
                    {trustGuarantees.autoExecutionsWithoutConsent} actions taken without your approval
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[var(--engine-govern)]" />
                    {trustGuarantees.auditCoveragePercent}% of decisions have a paper trail
                  </p>
                  {trustGuarantees.llmTrainingOptOut && (
                    <p className="inline-flex items-center gap-2">
                      <LockKeyhole className="h-4 w-4 text-[var(--engine-govern)]" />
                      Your data is never used to train AI
                    </p>
                  )}
                </div>
              </HeroPanel>
            )}
          </div>
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-3">
          <ListPortalBar
            engine="govern"
            label="Activity log"
            count={decisionsAudited}
            destination={{ type: 'route', to: '/govern/audit' }}
          />
          <ListPortalBar
            engine="govern"
            label="Council settings"
            count={engineBreakdown.length}
            destination={{ type: 'route', to: '/settings/ai' }}
          />
          <ListPortalBar
            engine="govern"
            label="Safety controls"
            count={trustGuarantees?.auditCoveragePercent ?? 100}
            destination={{ type: 'route', to: '/settings/rights' }}
          />
        </div>
      </div>
    </section>
  )
}

export const GovernImmutableLedger = GovernHero
