/**
 * Govern Hero — "0 Errors" trust center bento for the /govern page.
 *
 * 3-zone HeroBento layout:
 * - Zone A: "0 errors in 47 AI decisions" hero + status breakdown + engine bar + trust guarantees
 * - Zone B: Decision audit trail with click-to-expand + spotlight alert
 * - Zone C: Portal links to audit log, council, safety
 */
import { useState } from 'react'
import { Lock, Shield, Eye, LockKeyhole } from 'lucide-react'
import { HeroBento } from './hero-bento'
import { ListPortalBar } from './list-portal-bar'
import { CountUp } from './count-up'
import { cn } from '@/lib/utils'
import type { DecisionStatus } from '@/domain/poseidon-universe'

/* ── Types ── */

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
  // New props
  errorCount?: number
  statusBreakdown?: { verified: number; pending: number; flagged: number }
  trustGuarantees?: {
    autoExecutionsWithoutConsent: number
    auditCoveragePercent: number
    llmTrainingOptOut: boolean
  }
  spotlightEntry?: { id: string; action: string; status: DecisionStatus; confidence: number } | null
}

/** @deprecated Use GovernHeroProps */
export type GovernImmutableLedgerProps = GovernHeroProps

/* ── Status badge ── */

const STATUS_STYLE: Record<DecisionStatus, string> = {
  Verified: 'bg-emerald-500/10 text-emerald-400/80 state-bg-healthy state-text-healthy',
  'Pending review': 'bg-amber-500/10 text-amber-400/80 state-bg-warning state-text-warning',
  Flagged: 'bg-red-500/10 text-red-400/80 state-bg-critical state-text-critical',
}

const STATUS_ICON: Record<DecisionStatus, string> = {
  Verified: '✓',
  'Pending review': '⏳',
  Flagged: '⚠',
}

/* ═══════════════════════════════════════════════════════
   GOVERN HERO
   ═══════════════════════════════════════════════════════ */

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

  return (
    <HeroBento engine="govern">
      {/* ── Zone A: Action ── */}
      <HeroBento.Action>
        {/* Hero: "0 errors in N AI decisions" */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span
              className="typo-hero-number text-6xl md:text-7xl font-mono"
              style={{ color: 'var(--engine-govern)' }}
            >
              <CountUp value={errorCount} locale duration={800} />
            </span>
            <span className="text-xl md:text-2xl text-white/60">
              errors in <span className="text-white/80 font-mono tabular-nums">{decisionsAudited}</span> AI decisions
            </span>
          </div>
          <p className="text-sm text-white/50">
            Every action Poseidon took was verified safe.
          </p>
        </div>

        {/* Status Breakdown Bar */}
        {statusBreakdown && (
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400/80">
                <span>✓</span>
                <span className="font-mono tabular-nums">{statusBreakdown.verified}</span>
                <span className="text-white/40">Verified</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400/80">
                <span>⏳</span>
                <span className="font-mono tabular-nums">{statusBreakdown.pending}</span>
                <span className="text-white/40">Reviewing</span>
              </span>
              <span className="flex items-center gap-1.5 text-red-400/80">
                <span>⚠</span>
                <span className="font-mono tabular-nums">{statusBreakdown.flagged}</span>
                <span className="text-white/40">Flagged</span>
              </span>
            </div>
            {/* Proportional bar */}
            <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.06]">
              {statusBreakdown.verified > 0 && (
                <div
                  className="bg-emerald-500/60 transition-all duration-600"
                  style={{ width: `${(statusBreakdown.verified / decisionsAudited) * 100}%` }}
                />
              )}
              {statusBreakdown.pending > 0 && (
                <div
                  className="bg-amber-500/60 transition-all duration-600"
                  style={{ width: `${(statusBreakdown.pending / decisionsAudited) * 100}%` }}
                />
              )}
              {statusBreakdown.flagged > 0 && (
                <div
                  className="bg-red-500/60 transition-all duration-600"
                  style={{ width: `${(statusBreakdown.flagged / decisionsAudited) * 100}%` }}
                />
              )}
            </div>
          </div>
        )}

        {/* Engine Breakdown — "What Poseidon checked" */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
            What Poseidon checked
          </span>
          <div className="flex h-5 rounded-full overflow-hidden" role="img" aria-label="Engine breakdown">
            {engineBreakdown.map((seg) => (
              <div
                key={seg.engine}
                className="transition-all flex items-center justify-center"
                style={{
                  width: `${seg.percent}%`,
                  backgroundColor: seg.color,
                }}
              >
                {seg.percent >= 20 && (
                  <span className="text-[9px] font-bold text-slate-950">{seg.percent}%</span>
                )}
              </div>
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

        {/* Trust Guarantees — "Your safety guarantees" */}
        {trustGuarantees && (
          <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Your safety guarantees
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Shield size={12} className="text-emerald-400/60 shrink-0" />
                <span><span className="font-mono text-white/70">{trustGuarantees.autoExecutionsWithoutConsent}</span> actions taken without your approval</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Eye size={12} className="text-emerald-400/60 shrink-0" />
                <span><span className="font-mono text-white/70">{trustGuarantees.auditCoveragePercent}%</span> of decisions have a paper trail</span>
              </div>
              {trustGuarantees.llmTrainingOptOut && (
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <LockKeyhole size={12} className="text-emerald-400/60 shrink-0" />
                  <span>Your data is never used to train AI</span>
                </div>
              )}
            </div>
          </div>
        )}
      </HeroBento.Action>

      {/* ── Zone B: Proof (Audit Trail) ── */}
      <HeroBento.Proof className="gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Activity Log
        </span>

        {/* Spotlight Alert */}
        {spotlightEntry && spotlightEntry.status !== 'Verified' && (
          <div className={cn(
            'rounded-xl p-3 border-l-2 flex flex-col gap-1',
            spotlightEntry.status === 'Flagged'
              ? 'bg-red-500/[0.06] border-red-500/40'
              : 'bg-amber-500/[0.06] border-amber-500/40',
          )}>
            <div className="flex items-center gap-2">
              <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', STATUS_STYLE[spotlightEntry.status])}>
                {STATUS_ICON[spotlightEntry.status]} {spotlightEntry.status}
              </span>
              <span className="text-[10px] font-mono text-white/30">{spotlightEntry.id}</span>
            </div>
            <p className="text-sm text-white/80">{spotlightEntry.action}</p>
            <span className="text-[10px] font-mono text-white/40">
              {Math.round(spotlightEntry.confidence * 100)}% confidence
            </span>
          </div>
        )}

        {auditEntries.map((entry) => {
          const isExpanded = expandedId === entry.id
          return (
            <button
              key={entry.id}
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              className="text-left bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-2.5 transition-colors hover:bg-white/[0.04] w-full"
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

              {/* Click-to-reveal: model + SHAP factor */}
              <div className={cn(
                'overflow-hidden transition-all duration-300',
                isExpanded ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0'
              )}>
                <div className="flex items-center gap-2 text-[10px] text-white/30 pt-1 border-t border-white/[0.04]">
                  <span className="font-mono">{entry.modelVersion}</span>
                  <span className="text-white/15">&middot;</span>
                  <span className="truncate">Top factor: {entry.topFactor}</span>
                </div>
              </div>
            </button>
          )
        })}
      </HeroBento.Proof>

      {/* ── Zone C: Portal ── */}
      <HeroBento.Portal>
        <div className="flex items-center gap-4">
          <ListPortalBar
            engine="govern"
            label="Activity log"
            count={decisionsAudited}
            destination={{ type: 'route', to: '/govern/audit' }}
          />
        </div>
      </HeroBento.Portal>
    </HeroBento>
  )
}

GovernHero.displayName = 'GovernHero'

/** @deprecated Use GovernHero */
export const GovernImmutableLedger = GovernHero
