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
import { ArrowRight, Shield, TrendingUp, Zap, Scale, type LucideIcon } from 'lucide-react'
import { Link } from '@/router'
import { HeroBento } from './hero-bento'
import { ListPortalBar } from './list-portal-bar'
import { CostOfInaction } from './cost-of-inaction'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { formatUsd } from '@/domain/poseidon-universe'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import type { EngineName } from '@/lib/engine-tokens'

/* ── Types ── */

type HeroSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

export interface DashboardCoordinationProofProps {
  activeThreats: number
  monthlySavings: number
  pendingActions: number
  decisionsAudited: number
  decisionsVerified: number
  recommendationCount: number

  criticalSignal: {
    id: string
    counterparty: string
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

  onReviewThreat: (() => void) | null
  onReviewApproval: (() => void) | null
  onViewRecommendations: () => void
  cohortAvgSavingsUsd?: number
  dominantEngine?: EngineName
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
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-0"
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

/* ── Engine Pulse Badge ── */

function EnginePulseBadge({
  icon: Icon,
  color,
  value,
  label,
  to,
}: {
  icon: LucideIcon
  color: string
  value: string
  label: string
  to: string
}) {
  return (
    <Link
      to={to}
      className="relative flex-1 min-h-[48px] flex items-center gap-2.5 md:gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 md:px-4 py-3 border-t-2 transition-colors hover:bg-white/[0.06]"
      style={{ borderTopColor: color }}
    >
      <Icon size={16} style={{ color }} className="shrink-0 opacity-60" />
      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-base md:text-lg font-mono font-semibold tabular-nums truncate text-white/80">
          {value}
        </span>
        <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-medium">
          {label}
        </span>
      </div>
    </Link>
  )
}

/* ── Govern Foundation Rail ── */

function GovernFoundationRail() {
  return (
    <div
      className="border-t border-white/[0.06] px-6 md:px-10 py-4 flex items-center gap-3"
      data-testid="govern-rail"
    >
      <Scale size={14} style={{ color: 'var(--engine-govern)' }} className="shrink-0" />
      <span className="text-xs text-white/40">
        Every decision Poseidon makes is verified and auditable
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
    parts.push(`${pendingActions} ${actionWord} ready for your approval`)
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
  onReviewThreat,
  onReviewApproval,
  onViewRecommendations,
  cohortAvgSavingsUsd,
  dominantEngine,
}: DashboardCoordinationProofProps) {
  const narrative = buildNarrative({
    criticalSignal,
    monthlySavings,
    pendingActions,
    recommendationCount,
    decisionsVerified,
  })

  return (
    <HeroBento engine={dominantEngine ?? 'dashboard'} className="xl:grid-cols-[1fr_1fr]">
      <LiveAuditStream entries={auditStreamEntries} />

      {/* ── Zone A: Action ── */}
      <HeroBento.Action>
        <h1
          className="typo-display text-2xl md:text-3xl lg:text-4xl tracking-tight leading-tight text-white mb-4 drop-shadow-sm"
        >
          Your money, finally coordinated.
        </h1>
        <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-3xl">
          {narrative}
        </p>

        {onReviewThreat && criticalSignal && (
          <button
            onClick={onReviewThreat}
            className={cn(
              buttonVariants({ variant: 'default', size: 'sm' }),
              'h-auto w-fit rounded-xl px-5 py-2.5 min-h-[44px] mt-2',
              'bg-gradient-to-r from-emerald-600 to-cyan-600 text-slate-950',
              'font-semibold tracking-wide text-xs',
              'hover:from-emerald-500 hover:to-cyan-500 transition-all',
              'flex items-center gap-2',
            )}
          >
            Review flagged charge <ArrowRight size={12} />
          </button>
        )}

        <GovernFoundationRail />
      </HeroBento.Action>

      {/* ── Zone B: Proof — EnginePulseStrip ── */}
      <HeroBento.Proof>
        <div className="flex flex-col xl:flex-row gap-2 xl:gap-3">
          <EnginePulseBadge
            icon={Shield}
            color="var(--engine-protect)"
            value={String(activeThreats)}
            label="threats"
            to="/protect/threats"
          />
          <EnginePulseBadge
            icon={TrendingUp}
            color="var(--engine-grow)"
            value={`+${formatUsd(monthlySavings)}`}
            label="savings/mo"
            to="/grow/recommendations"
          />
          <EnginePulseBadge
            icon={Zap}
            color="var(--engine-execute)"
            value={String(pendingActions)}
            label="to approve"
            to="/execute/queue"
          />
        </div>

        <CostOfInaction
          label={criticalSignal
            ? `${criticalSignal.amount} at risk if unreviewed`
            : `${formatUsd(monthlySavings)}/mo unrealized without action`}
          severity={criticalSignal ? 'high' : 'medium'}
        />
      </HeroBento.Proof>

      {/* ── Zone C: Portal ── */}
      <HeroBento.Portal>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <ListPortalBar engine="protect" label="View all threats" count={activeThreats} destination={{ type: 'route', to: '/protect/threats' }} />
          <ListPortalBar engine="grow" label="View recommendations" count={recommendationCount} destination={{ type: 'route', to: '/grow/recommendations' }} />
          <ListPortalBar engine="execute" label="Actions to approve" count={pendingActions} destination={{ type: 'route', to: '/execute/queue' }} />
          <ListPortalBar engine="govern" label="Decision history" count={decisionsAudited} destination={{ type: 'route', to: '/govern/audit' }} />
        </div>
      </HeroBento.Portal>
    </HeroBento>
  )
}

