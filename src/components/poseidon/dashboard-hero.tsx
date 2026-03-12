import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Landmark,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { ListPortalBar } from './list-portal-bar'
import { cn } from '@/lib/utils'
import { formatUsd } from '@/domain/poseidon-universe'
import type { FinancialHealthBreakdown } from '@/domain/poseidon-universe'
import {
  HeroBackdrop,
  HeroEyebrow,
  HeroMetricPill,
  HeroPanel,
} from './hero-concept-primitives'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

export interface DashboardHeroProps {
  userName: string
  netWorth: number
  netWorthChange: number
  netWorthChangePercent: number
  assets?: number
  liabilities?: number
  monthlyCashFlow?: number
  sparklineData: number[]
  healthScore: number
  healthBreakdown: FinancialHealthBreakdown[]
  protectSignal: {
    threatCount: number
    topAmount: string
    topCounterparty: string
    severity: string
  } | null
  growSignal: {
    savingsPerMonth: number
    recCount: number
    topTitle: string
  } | null
  executeSignal: {
    pendingCount: number
    topTitle: string
    topAmount: string
  } | null
  decisionsAudited: number
  complianceScore: number
  onNavigate: (path: string) => void
}

type SignalCardItem = {
  key: string
  label: string
  body: string
  helper: string
  icon: typeof Shield
  accent: string
  path: string
}

function formatMoney(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function HorizonTopography({
  data,
  reducedMotion,
}: {
  data: number[]
  reducedMotion: boolean
}) {
  if (data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const width = 820
  const height = 280
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width
      const y =
        height - ((value - min) / Math.max(max - min, 1)) * (height - 64) - 28
      return `${x},${y}`
    })
    .join(' ')
  const areaPoints = `${points} ${width},${height} 0,${height}`

  return (
    <HeroPanel className="relative overflow-hidden px-4 py-4 md:px-5">
      <div
        className={cn(
          'absolute inset-x-[8%] top-1/3 h-28 rounded-full blur-3xl opacity-35',
          !reducedMotion && 'animate-[pulse_8s_ease-in-out_infinite]',
        )}
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(0,240,255,0.26), transparent)',
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-10 h-[240px] w-full"
        role="img"
        aria-label="Portfolio horizon showing selector-driven net-worth movement"
      >
        <defs>
          <linearGradient id="dashboard-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,240,255,0.42)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0.02)" />
          </linearGradient>
          <linearGradient id="dashboard-line-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0,240,255,0.35)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.8)" />
          </linearGradient>
          <filter id="dashboard-line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="dashboard-breath-mask">
            <rect x="0" y="0" width={width} height={height} fill="black" />
            <rect
              x="-160"
              y="0"
              width="240"
              height={height}
              fill="white"
              className={cn(!reducedMotion && 'animate-[dashboard-breath_10s_linear_infinite]')}
            />
          </mask>
        </defs>

        {[0.18, 0.38, 0.58, 0.78].map((line) => (
          <line
            key={line}
            x1="0"
            y1={height * line}
            x2={width}
            y2={height * line}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 8"
          />
        ))}

        <polygon points={areaPoints} fill="url(#dashboard-area-fill)" />
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="rgba(255,255,255,0.3)"
          opacity="0.2"
          mask="url(#dashboard-breath-mask)"
        />
        <polyline
          points={points}
          fill="none"
          stroke="url(#dashboard-line-gradient)"
          strokeWidth="4"
          filter="url(#dashboard-line-glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="relative z-10 mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/35">
        <span>Command open</span>
        <span>Selector horizon</span>
        <span>Live now</span>
      </div>
    </HeroPanel>
  )
}

function SignalDockCard({
  label,
  body,
  helper,
  icon: Icon,
  accent,
  onClick,
}: {
  label: string
  body: string
  helper: string
  icon: typeof Shield
  accent: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group snap-start rounded-[26px] border border-white/10 bg-white/[0.03] px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors hover:bg-white/[0.06] min-w-0"
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px color-mix(in srgb, ${accent} 16%, transparent)`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="rounded-2xl border border-white/10 p-3"
          style={{ color: accent, background: `color-mix(in srgb, ${accent} 14%, transparent)` }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-white/28 transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{body}</p>
      <p className="mt-3 text-xs leading-5 text-white/46">{helper}</p>
    </button>
  )
}

function HealthConsole({
  score,
  breakdown,
  decisionsAudited,
  complianceScore,
}: {
  score: number
  breakdown: FinancialHealthBreakdown[]
  decisionsAudited: number
  complianceScore: number
}) {
  return (
    <HeroPanel className="px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            System posture
          </p>
          <p className="mt-3 text-4xl font-semibold text-white">{score.toFixed(1)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Govern</p>
          <p className="mt-2 text-sm font-medium text-[var(--engine-govern)]">
            {decisionsAudited.toLocaleString()} audited
          </p>
        </div>
      </div>

      <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
        {breakdown.map((item) => (
          <div
            key={item.engine}
            style={{ width: `${item.weight * 100}%` }}
            className={cn(
              item.engine === 'protect' && 'bg-[var(--engine-protect)]',
              item.engine === 'grow' && 'bg-[var(--engine-grow)]',
              item.engine === 'execute' && 'bg-[var(--engine-execute)]',
              item.engine === 'govern' && 'bg-[var(--engine-govern)]',
            )}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/45">
        {breakdown.map((item) => (
          <span key={item.engine} className="inline-flex items-center gap-2">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                item.engine === 'protect' && 'bg-[var(--engine-protect)]',
                item.engine === 'grow' && 'bg-[var(--engine-grow)]',
                item.engine === 'execute' && 'bg-[var(--engine-execute)]',
                item.engine === 'govern' && 'bg-[var(--engine-govern)]',
              )}
            />
            {item.engine} {Math.round(item.value)}
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-[var(--engine-govern)]" />
          Audit coverage {complianceScore}%
        </span>
      </div>
    </HeroPanel>
  )
}

export function DashboardHero({
  userName,
  netWorth,
  netWorthChange,
  netWorthChangePercent,
  assets,
  liabilities,
  monthlyCashFlow,
  sparklineData,
  healthScore,
  healthBreakdown,
  protectSignal,
  growSignal,
  executeSignal,
  decisionsAudited,
  complianceScore,
  onNavigate,
}: DashboardHeroProps) {
  const reducedMotion = useReducedMotionSafe()
  const [glow, setGlow] = useState({ x: 50, y: 50 })
  const positiveDay = netWorthChange >= 0
  const resolvedAssets = assets ?? netWorth
  const resolvedLiabilities = liabilities ?? 0
  const resolvedMonthlyCashFlow = monthlyCashFlow ?? netWorthChange

  const signalCards = useMemo(
    () =>
      [
        protectSignal && {
          key: 'protect',
          label: 'Protect',
          body: `${protectSignal.threatCount} ${protectSignal.threatCount === 1 ? 'anomaly' : 'anomalies'} flagged`,
          helper: `${protectSignal.topCounterparty} · ${protectSignal.topAmount}`,
          icon: AlertTriangle,
          accent: 'var(--engine-protect)',
          path: '/protect',
        },
        growSignal && {
          key: 'grow',
          label: 'Grow',
          body: `+${formatUsd(growSignal.savingsPerMonth)}/mo ready`,
          helper: `${growSignal.topTitle} · ${growSignal.recCount} queued opportunities`,
          icon: Landmark,
          accent: 'var(--engine-grow)',
          path: '/grow',
        },
        executeSignal && {
          key: 'execute',
          label: 'Execute',
          body: `${executeSignal.pendingCount} authorization${executeSignal.pendingCount === 1 ? '' : 's'} live`,
          helper: `${executeSignal.topTitle} · ${executeSignal.topAmount}`,
          icon: Zap,
          accent: 'var(--engine-execute)',
          path: '/execute',
        },
        {
          key: 'govern',
          label: 'Govern',
          body: `${decisionsAudited.toLocaleString()} decisions replayable`,
          helper: `Audit coverage ${complianceScore}%`,
          icon: Shield,
          accent: 'var(--engine-govern)',
          path: '/govern',
        },
      ].filter((card): card is SignalCardItem => Boolean(card)),
    [complianceScore, decisionsAudited, executeSignal, growSignal, protectSignal],
  )

  return (
    <section
      role="region"
      aria-labelledby="dashboard-hero-title"
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#081221] shadow-[0_30px_120px_rgba(0,0,0,0.35)]"
    >
      <style>
        {`
          @keyframes dashboard-breath {
            0% { transform: translateX(0); }
            100% { transform: translateX(980px); }
          }
        `}
      </style>
      <HeroBackdrop
        accent="var(--engine-dashboard)"
        secondaryAccent="var(--engine-govern)"
        reducedMotion={reducedMotion}
      />

      <div className="relative z-10 flex min-h-[65vh] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <div className="grid flex-1 gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <HeroEyebrow>
                <Sparkles className="h-3.5 w-3.5 text-[var(--engine-dashboard)]" />
                Portfolio Command Center
              </HeroEyebrow>
              <HeroEyebrow className="text-white/52">{userName}</HeroEyebrow>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-white/38">Core observatory</p>
              <h2
                id="dashboard-hero-title"
                className="mt-4 text-[clamp(3rem,9vw,6.1rem)] font-semibold leading-none tracking-[-0.06em] text-white"
              >
                CORE OBSERVATORY
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/58">
                A selector-driven financial command stage that turns the highest-leverage
                protect, grow, execute, and govern signals into one decision surface.
              </p>
            </div>

            <HeroPanel
              className="relative overflow-hidden px-5 py-5 md:px-6"
              onMouseMove={(event) => {
                if (reducedMotion) return
                const rect = event.currentTarget.getBoundingClientRect()
                setGlow({
                  x: ((event.clientX - rect.left) / rect.width) * 100,
                  y: ((event.clientY - rect.top) / rect.height) * 100,
                })
              }}
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background: reducedMotion
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent 65%)'
                    : `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(0,240,255,0.22), transparent 26%), linear-gradient(135deg, rgba(255,255,255,0.03), transparent 65%)`,
                }}
              />
              <div className="relative z-10">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                  Net worth
                </p>
                <p className="mt-3 text-[clamp(3rem,7vw,5rem)] font-semibold leading-none tracking-[-0.05em] text-white">
                  ${formatMoney(netWorth)}
                </p>
                <div
                  className={cn(
                    'mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
                    positiveDay
                      ? 'bg-[rgba(34,197,94,0.12)] text-[var(--engine-protect)]'
                      : 'bg-[rgba(239,68,68,0.12)] text-[var(--state-critical)]',
                  )}
                >
                  <TrendingUp className="h-4 w-4" />
                  {positiveDay ? '+' : '-'}
                  {formatUsd(Math.abs(netWorthChange))} selector delta
                  <span className="text-white/45">
                    ({positiveDay ? '+' : ''}
                    {netWorthChangePercent.toFixed(2)}%)
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <HeroMetricPill label="Assets" value={formatUsd(resolvedAssets)} />
                  <HeroMetricPill label="Liabilities" value={formatUsd(resolvedLiabilities)} />
                  <HeroMetricPill
                    label="Monthly flow"
                    value={`${resolvedMonthlyCashFlow >= 0 ? '+' : '-'}${formatUsd(Math.abs(resolvedMonthlyCashFlow))}`}
                    tone={resolvedMonthlyCashFlow >= 0 ? 'var(--engine-protect)' : undefined}
                  />
                </div>
              </div>
            </HeroPanel>

            <HealthConsole
              score={healthScore}
              breakdown={healthBreakdown}
              decisionsAudited={decisionsAudited}
              complianceScore={complianceScore}
            />
          </div>

          <div className="flex flex-col gap-5">
            <HorizonTopography data={sparklineData} reducedMotion={reducedMotion} />

            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
              {signalCards.map((card) => (
                <div key={card.key} className="min-w-[78%] md:min-w-0">
                  <SignalDockCard
                    label={card.label}
                    body={card.body}
                    helper={card.helper}
                    icon={card.icon}
                    accent={card.accent}
                    onClick={() => onNavigate(card.path)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="grid gap-3 md:grid-cols-4">
            <ListPortalBar
              engine="protect"
              label="Threat details"
              count={protectSignal?.threatCount ?? 0}
              destination={{ type: 'route', to: '/protect/threats' }}
            />
            <ListPortalBar
              engine="grow"
              label="Opportunities"
              count={growSignal?.recCount ?? 0}
              destination={{ type: 'route', to: '/grow/recommendations' }}
            />
            <ListPortalBar
              engine="execute"
              label="Approval queue"
              count={executeSignal?.pendingCount ?? 0}
              destination={{ type: 'route', to: '/execute/queue' }}
            />
            <ListPortalBar
              engine="govern"
              label="Audit history"
              count={decisionsAudited}
              destination={{ type: 'route', to: '/govern/audit' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
