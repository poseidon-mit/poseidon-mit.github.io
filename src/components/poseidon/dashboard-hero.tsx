/**
 * Dashboard Hero — "Unified Command Nexus" for the /dashboard page.
 *
 * Spatial Bento layout: 3 engine cards (Protect/Grow/Execute) connected
 * by gradient coordination rails, backed by a live canonical audit stream,
 * sitting on a Govern foundation rail.
 *
 * Motion: No own initial/animate root — inherits from page-level stagger.
 * CountUp handles its own viewport-triggered animation.
 */
import { ArrowRight, Shield, TrendingUp, Zap, ShieldCheck, CheckCircle, Scale } from 'lucide-react'
import { AuroraPulse, CountUp, SeverityBadge } from '@/components/poseidon'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { formatUsd } from '@/domain/poseidon-universe'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/* ── Types ── */

type HeroSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

function toDisplaySeverity(s: HeroSeverity): 'critical' | 'warning' | 'info' {
  switch (s) {
    case 'Critical': return 'critical'
    case 'High': return 'warning'
    case 'Medium': return 'info'
    case 'Low': return 'info'
  }
}

export interface DashboardCoordinationProofProps {
  activeThreats: number
  monthlySavings: number
  pendingActions: number
  decisionsAudited: number
  decisionsVerified: number
  recommendationCount: number

  criticalSignal: {
    id: string
    merchant: string
    amount: string
    confidence: number
    severity: HeroSeverity
  } | null

  nextApproval: {
    id: string
    title: string
    amountLabel: string
    engine: string
    urgency: 'high' | 'medium' | 'low'
  } | null

  auditStreamEntries: {
    id: string
    type: string
    action: string
    confidence: number
  }[]

  onReviewSignal: (() => void) | null
  onReviewApproval: (() => void) | null
  onViewRecommendations: () => void
  cohortAvgSavingsUsd?: number
}

/* ── Live Audit Stream (background) ── */

function LiveAuditStream({
  entries,
}: {
  entries: DashboardCoordinationProofProps['auditStreamEntries']
}) {
  const prefersReduced = useReducedMotionSafe()

  if (entries.length === 0) return null

  const lines = entries.map(
    (e) => `[${e.type}] ${e.action} \u00B7 ${Math.round(e.confidence * 100)}%`,
  )

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06]"
      aria-hidden="true"
      data-testid="audit-stream"
    >
      <div
        className="audit-stream-scroll font-mono text-[10px] leading-6 text-white whitespace-nowrap flex flex-col"
        style={{
          animation: prefersReduced
            ? 'none'
            : `audit-scroll ${Math.max(30, entries.length * 4)}s linear infinite`,
        }}
      >
        {/* Render twice for seamless loop */}
        {[0, 1].map((pass) => (
          <div key={pass} className="flex flex-col">
            {lines.map((line, i) => (
              <span key={`${pass}-${i}`} className="px-6 md:px-10">
                {line}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Coordination Rail ── */

function CoordinationRail({
  fromColor,
  toColor,
}: {
  fromColor: string
  toColor: string
}) {
  return (
    <>
      {/* Desktop: vertical rail */}
      <div
        className="hidden md:flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-[2px] h-[60%] rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
            boxShadow: `0 0 8px color-mix(in srgb, ${fromColor} 50%, ${toColor})`,
          }}
        />
      </div>
      {/* Mobile: horizontal rail */}
      <div
        className="md:hidden flex justify-center"
        aria-hidden="true"
      >
        <div
          className="h-[2px] w-[40%] rounded-full"
          style={{
            background: `linear-gradient(to right, ${fromColor}, ${toColor})`,
          }}
        />
      </div>
    </>
  )
}

/* ── Govern Foundation Rail ── */

function GovernFoundationRail({ decisionsAudited }: { decisionsAudited: number }) {
  return (
    <div
      className="border-t border-white/[0.06] px-6 md:px-10 py-4 flex items-center gap-3"
      data-testid="govern-rail"
    >
      <Scale size={14} style={{ color: 'var(--engine-govern)' }} className="shrink-0" />
      <span className="text-xs text-white/40">
        <CountUp value={decisionsAudited} locale className="text-xs font-mono tabular-nums text-white/60" />
        {' '}AI decisions audited by Govern
      </span>
    </div>
  )
}

/* ── Narrative Builder ── */

function buildNarrative({
  criticalSignal,
  monthlySavings,
  pendingActions,
  recommendationCount,
  decisionsVerified,
}: {
  criticalSignal: DashboardCoordinationProofProps['criticalSignal']
  monthlySavings: number
  pendingActions: number
  recommendationCount: number
  decisionsVerified: number
}): string {
  const parts: string[] = []

  if (criticalSignal) {
    parts.push(`Protect detected a ${criticalSignal.amount} anomaly`)
  }

  const growPart = criticalSignal
    ? `Grow found ${formatUsd(monthlySavings)}/mo in upside`
    : `Grow found ${formatUsd(monthlySavings)}/mo in upside across ${recommendationCount} recommendations`

  parts.push(growPart)

  if (pendingActions > 0) {
    const actionWord = pendingActions === 1 ? 'action' : 'actions'
    parts.push(`Execute queued ${pendingActions} ${actionWord}`)
  }

  const joined = parts.length > 2
    ? `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`
    : parts.join(' and ')

  return `${joined} \u2014 all logged, ${decisionsVerified.toLocaleString()} verified.`
}

/* ═══════════════════════════════════════════════════════
   UNIFIED COMMAND NEXUS HERO
   ═══════════════════════════════════════════════════════ */

export function DashboardCoordinationProof({
  activeThreats,
  monthlySavings,
  pendingActions,
  decisionsAudited,
  decisionsVerified,
  recommendationCount,
  criticalSignal,
  nextApproval,
  auditStreamEntries,
  onReviewSignal,
  onReviewApproval,
  onViewRecommendations,
  cohortAvgSavingsUsd,
}: DashboardCoordinationProofProps) {
  const narrative = buildNarrative({
    criticalSignal,
    monthlySavings,
    pendingActions,
    recommendationCount,
    decisionsVerified,
  })

  return (
    <div className="relative glass-card rounded-[32px] border border-[var(--engine-dashboard)]/20 overflow-hidden">
      <AuroraPulse color="var(--engine-dashboard)" intensity="subtle" className="absolute inset-0 pointer-events-none" />
      <LiveAuditStream entries={auditStreamEntries} />

      <div className="relative z-10">
        {/* ── Headline + Narrative ── */}
        <div className="p-6 md:p-8 lg:p-10 pb-0 md:pb-0 lg:pb-0">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-white mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your money, finally coordinated.
          </h1>
          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-3xl">
            {narrative}
          </p>
        </div>

        {/* ── Engine Card Strip ── */}
        <div className="p-6 md:p-8 lg:p-10">
          {/* Desktop: 3 cards + 2 rails */}
          <div className="hidden md:grid grid-cols-[1fr_2px_1fr_2px_1fr] gap-4">
            <ProtectCard
              criticalSignal={criticalSignal}
              activeThreats={activeThreats}
              onReviewSignal={onReviewSignal}
            />
            <CoordinationRail fromColor="var(--engine-protect)" toColor="var(--engine-grow)" />
            <GrowCard
              monthlySavings={monthlySavings}
              recommendationCount={recommendationCount}
              onViewRecommendations={onViewRecommendations}
              cohortAvgSavingsUsd={cohortAvgSavingsUsd}
            />
            <CoordinationRail fromColor="var(--engine-grow)" toColor="var(--engine-execute)" />
            <ExecuteCard
              nextApproval={nextApproval}
              pendingActions={pendingActions}
              onReviewApproval={onReviewApproval}
            />
          </div>

          {/* Mobile: stacked cards with horizontal rails */}
          <div className="flex flex-col gap-3 md:hidden">
            <ProtectCard
              criticalSignal={criticalSignal}
              activeThreats={activeThreats}
              onReviewSignal={onReviewSignal}
            />
            <CoordinationRail fromColor="var(--engine-protect)" toColor="var(--engine-grow)" />
            <GrowCard
              monthlySavings={monthlySavings}
              recommendationCount={recommendationCount}
              onViewRecommendations={onViewRecommendations}
              cohortAvgSavingsUsd={cohortAvgSavingsUsd}
            />
            <CoordinationRail fromColor="var(--engine-grow)" toColor="var(--engine-execute)" />
            <ExecuteCard
              nextApproval={nextApproval}
              pendingActions={pendingActions}
              onReviewApproval={onReviewApproval}
            />
          </div>
        </div>

        {/* ── Govern Foundation Rail ── */}
        <GovernFoundationRail decisionsAudited={decisionsAudited} />
      </div>
    </div>
  )
}

/* ── Protect Engine Card ── */

function ProtectCard({
  criticalSignal,
  activeThreats,
  onReviewSignal,
}: {
  criticalSignal: DashboardCoordinationProofProps['criticalSignal']
  activeThreats: number
  onReviewSignal: (() => void) | null
}) {
  return (
    <div
      className="bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-3 border-t-2 transition-colors hover:bg-white/[0.04]"
      style={{ borderTopColor: 'var(--engine-protect)' }}
      data-testid="engine-card-protect"
    >
      <div className="flex items-center gap-2">
        <Shield size={14} style={{ color: 'var(--engine-protect)' }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Protect
        </span>
        <span className="text-[10px] text-white/20 ml-auto">{activeThreats} active</span>
      </div>

      {criticalSignal ? (
        <>
          <div className="flex items-center gap-2">
            <SeverityBadge severity={toDisplaySeverity(criticalSignal.severity)} />
            <span className="text-xs font-mono text-white/40">{criticalSignal.id}</span>
          </div>

          <p className="text-sm font-medium text-white/90 truncate">
            {criticalSignal.merchant}
          </p>

          <div className="flex items-center gap-2 text-xs text-white/50">
            <CountUp
              value={parseFloat(criticalSignal.amount.replace(/[$,]/g, ''))}
              prefix="$"
              locale
              className="font-mono tabular-nums"
            />
            <span className="text-white/20">&middot;</span>
            <span>{Math.round(criticalSignal.confidence * 100)}% confidence</span>
          </div>

          {onReviewSignal && (
            <button
              onClick={onReviewSignal}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--engine-protect)] hover:text-[var(--engine-protect)]/80 transition-colors mt-1 self-start min-h-[44px]"
            >
              Review signal <ArrowRight size={12} />
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2 py-4">
          <ShieldCheck size={16} className="text-[var(--engine-protect)]" />
          <span className="text-sm text-white/50">All clear</span>
        </div>
      )}
    </div>
  )
}

/* ── Grow Engine Card ── */

function GrowCard({
  monthlySavings,
  recommendationCount,
  onViewRecommendations,
  cohortAvgSavingsUsd,
}: {
  monthlySavings: number
  recommendationCount: number
  onViewRecommendations: () => void
  cohortAvgSavingsUsd?: number
}) {
  return (
    <div
      className="bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-3 border-t-2 transition-colors hover:bg-white/[0.04]"
      style={{ borderTopColor: 'var(--engine-grow)' }}
      data-testid="engine-card-grow"
    >
      <div className="flex items-center gap-2">
        <TrendingUp size={14} style={{ color: 'var(--engine-grow)' }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Grow
        </span>
      </div>

      <div className="flex items-baseline gap-1" style={{ color: 'var(--engine-grow)' }}>
        <span className="text-white/30 text-sm">+</span>
        <CountUp
          value={monthlySavings}
          prefix="$"
          suffix="/mo"
          locale
          className="text-xl font-mono font-semibold tabular-nums"
        />
      </div>

      <span className="text-xs text-white/40">
        {recommendationCount} recommendation{recommendationCount !== 1 ? 's' : ''}
      </span>
      {cohortAvgSavingsUsd != null && (
        <span className="text-xs text-white/30">Cohort avg: ${cohortAvgSavingsUsd.toLocaleString()}/mo</span>
      )}

      <button
        onClick={onViewRecommendations}
        className="flex items-center gap-1.5 text-xs font-medium text-[var(--engine-grow)] hover:text-[var(--engine-grow)]/80 transition-colors mt-auto self-start min-h-[44px]"
      >
        See all <ArrowRight size={12} />
      </button>
    </div>
  )
}

/* ── Execute Engine Card ── */

function ExecuteCard({
  nextApproval,
  pendingActions,
  onReviewApproval,
}: {
  nextApproval: DashboardCoordinationProofProps['nextApproval']
  pendingActions: number
  onReviewApproval: (() => void) | null
}) {
  return (
    <div
      className="bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-3 border-t-2 transition-colors hover:bg-white/[0.04]"
      style={{ borderTopColor: 'var(--engine-execute)' }}
      data-testid="engine-card-execute"
    >
      <div className="flex items-center gap-2">
        <Zap size={14} style={{ color: 'var(--engine-execute)' }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Execute
        </span>
        {pendingActions > 0 && (
          <span className="text-[10px] text-white/20 ml-auto">
            {pendingActions} pending
          </span>
        )}
      </div>

      {nextApproval ? (
        <>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <p className="text-sm font-medium text-white/90 line-clamp-2">
                {nextApproval.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="font-mono tabular-nums">{nextApproval.amountLabel}</span>
                {nextApproval.urgency === 'high' && (
                  <>
                    <span className="text-white/20">&middot;</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
                      Urgent
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {onReviewApproval && (
            <button
              onClick={onReviewApproval}
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'w-full rounded-xl px-5 py-2.5 min-h-[44px] mt-auto',
                'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950',
                'font-semibold tracking-wide text-xs',
                'hover:from-amber-400 hover:to-yellow-400 transition-all',
                'flex items-center justify-center gap-2',
              )}
            >
              Review &amp; Approve <ArrowRight size={14} />
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2 py-4">
          <CheckCircle size={16} className="text-[var(--engine-protect)]" />
          <span className="text-sm text-white/50">Queue clear</span>
        </div>
      )}
    </div>
  )
}
