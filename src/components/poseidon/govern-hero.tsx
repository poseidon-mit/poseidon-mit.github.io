/**
 * Govern Hero — "The Immutable Audit Ledger" bento for the /govern page.
 *
 * Two-column asymmetric layout:
 * - Left: giant CountUp + headline + engine breakdown bar
 * - Right: flight recorder stream with hover-to-reveal details
 */
import { ArrowRight, Lock } from 'lucide-react'
import { AuroraPulse } from '@/components/poseidon/aurora-pulse'
import { CountUp } from '@/components/poseidon/count-up'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { DecisionStatus } from '@/domain/poseidon-universe'

/* ── Types ── */

export interface GovernImmutableLedgerProps {
  decisionsAudited: number
  engineBreakdown: { engine: string; count: number; percent: number; color: string }[]
  flightRecorderEntries: {
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
  onOpenLedger: (() => void) | null
}

/* ── Status badge ── */

const STATUS_STYLE: Record<DecisionStatus, string> = {
  Verified: 'bg-emerald-500/15 text-emerald-400',
  'Pending review': 'bg-amber-500/15 text-amber-400',
  Flagged: 'bg-red-500/15 text-red-400',
}

/* ═══════════════════════════════════════════════════════
   IMMUTABLE AUDIT LEDGER HERO
   ═══════════════════════════════════════════════════════ */

export function GovernImmutableLedger({
  decisionsAudited,
  engineBreakdown,
  flightRecorderEntries,
  onOpenLedger,
}: GovernImmutableLedgerProps) {
  return (
    <div className="relative glass-card rounded-[32px] border border-[var(--engine-govern)]/20 overflow-hidden">
      <AuroraPulse color="var(--engine-govern)" intensity="subtle" />

      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 md:gap-10">

          {/* ── Left: The Proof Metric ── */}
          <div className="flex flex-col gap-5">
            {/* Giant count */}
            <div
              className="text-5xl md:text-6xl lg:text-7xl font-mono tabular-nums font-bold"
              style={{
                color: 'var(--engine-govern)',
                filter: 'drop-shadow(0 0 20px var(--engine-govern))',
              }}
            >
              <CountUp value={decisionsAudited} locale duration={1800} />
            </div>

            {/* Headline */}
            <h2
              className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Decisions Audited &amp; Secured
            </h2>

            {/* Subheadline */}
            <p className="text-sm text-white/50 max-w-md">
              Every AI action across all engines is permanently logged and 100% traceable.
            </p>

            {/* Engine Breakdown Bar */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex h-3 rounded-full overflow-hidden" role="img" aria-label="Engine breakdown">
                {engineBreakdown.map((seg) => (
                  <div
                    key={seg.engine}
                    className="transition-all"
                    style={{
                      width: `${seg.percent}%`,
                      backgroundColor: seg.color,
                      boxShadow: `0 0 8px ${seg.color}`,
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-widest text-white/40">
                {engineBreakdown.map((seg) => (
                  <span key={seg.engine} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    {seg.engine} {seg.percent}%
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            {onOpenLedger && (
              <button
                onClick={onOpenLedger}
                className={cn(
                  buttonVariants({ variant: 'default', size: 'sm' }),
                  'self-start rounded-xl px-6 py-2.5 min-h-[44px]',
                  'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
                  'font-semibold tracking-wide text-xs',
                  'hover:from-blue-400 hover:to-cyan-400 transition-all',
                  'flex items-center gap-2',
                )}
              >
                Open Audit Ledger <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* ── Right: Flight Recorder Stream ── */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Flight Recorder
            </span>

            {flightRecorderEntries.map((entry) => (
              <div
                key={entry.id}
                className="group/entry bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-2.5 transition-colors hover:bg-white/[0.04]"
              >
                {/* Trail line */}
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.engineColor }}
                  />
                  <span className="text-sm text-white/80 truncate flex-1">{entry.action}</span>
                  <span className="text-[10px] font-mono tabular-nums text-white/30 shrink-0">
                    {Math.round(entry.confidence * 100)}%
                  </span>
                  <Lock size={10} className="text-white/20 shrink-0" />
                </div>

                {/* Status + time */}
                <div className="flex items-center gap-2 text-[10px]">
                  <span className={cn('px-1.5 py-0.5 rounded font-bold uppercase tracking-wider', STATUS_STYLE[entry.status])}>
                    {entry.status}
                  </span>
                  <span className="text-white/30">{entry.time}</span>
                </div>

                {/* Hover reveal: model + SHAP factor */}
                <div className="overflow-hidden transition-all duration-300 opacity-0 max-h-0 group-hover/entry:opacity-100 group-hover/entry:max-h-12">
                  <div className="flex items-center gap-2 text-[10px] text-white/30 pt-1 border-t border-white/[0.04]">
                    <span className="font-mono">{entry.modelVersion}</span>
                    <span className="text-white/15">&middot;</span>
                    <span className="truncate">Top factor: {entry.topFactor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

GovernImmutableLedger.displayName = 'GovernImmutableLedger'
