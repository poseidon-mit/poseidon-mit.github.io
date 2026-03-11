/**
 * Govern Hero — "The Immutable Audit Ledger" bento for the /govern page.
 *
 * Two-column asymmetric layout:
 * - Left: giant CountUp + headline + engine breakdown bar
 * - Right: decision audit trail with click-to-reveal details
 */
import { useState } from 'react'
import { Lock } from 'lucide-react'
import { HeroBento } from './hero-bento'
import { ListPortalBar } from './list-portal-bar'
import { CountUp } from './count-up'
import { cn } from '@/lib/utils'
import type { DecisionStatus } from '@/domain/poseidon-universe'

/* ── Types ── */

export interface GovernImmutableLedgerProps {
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
}

/* ── Status badge ── */

const STATUS_STYLE: Record<DecisionStatus, string> = {
  Verified: 'bg-emerald-500/10 text-emerald-400/80 state-bg-healthy state-text-healthy',
  'Pending review': 'bg-amber-500/10 text-amber-400/80 state-bg-warning state-text-warning',
  Flagged: 'bg-red-500/10 text-red-400/80 state-bg-critical state-text-critical',
}

/* ═══════════════════════════════════════════════════════
   IMMUTABLE AUDIT LEDGER HERO
   ═══════════════════════════════════════════════════════ */

export function GovernImmutableLedger({
  decisionsAudited,
  engineBreakdown,
  auditEntries,
}: GovernImmutableLedgerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  return (
    <HeroBento engine="govern">
      <HeroBento.Action>
        {/* Giant count */}
        <div
          className="typo-hero-number text-4xl md:text-5xl"
          style={{ color: 'var(--engine-govern)' }}
        >
          <CountUp value={decisionsAudited} locale duration={1800} />
        </div>

        {/* Headline */}
        <h2
          className="typo-display text-xl md:text-2xl lg:text-3xl text-white"
        >
          Every decision, accounted for.
        </h2>

        {/* Subheadline */}
        <p className="text-sm text-white/50 max-w-md">
          Every AI action across all engines is permanently logged and 100% traceable.
        </p>

        {/* Engine Breakdown Bar */}
        <div className="flex flex-col gap-2 pt-2">
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

      </HeroBento.Action>

      <HeroBento.Proof className="gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Decision Audit Trail
        </span>

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

              {/* Click-to-reveal (hover on desktop, tap on mobile): model + SHAP factor */}
              <div className={cn(
                'overflow-hidden transition-all duration-300',
                isExpanded ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 group-hover/entry:opacity-100 group-hover/entry:max-h-12'
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

      <HeroBento.Portal>
        <ListPortalBar
          engine="govern"
          label="View full audit ledger"
          count={decisionsAudited}
          destination={{ type: 'route', to: '/govern/audit' }}
        />
      </HeroBento.Portal>
    </HeroBento>
  )
}

GovernImmutableLedger.displayName = 'GovernImmutableLedger'
