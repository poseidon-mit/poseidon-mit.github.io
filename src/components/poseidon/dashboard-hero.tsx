import { AlertTriangle, ArrowRight, CheckCircle2, Landmark, Shield, TrendingUp, Zap } from "lucide-react";
import { ListPortalBar } from "./list-portal-bar";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/domain/poseidon-universe";
import type { FinancialHealthBreakdown } from "@/domain/poseidon-universe";

export interface DashboardHeroProps {
  userName: string;
  netWorth: number;
  netWorthChange: number;
  netWorthChangePercent: number;
  assets?: number;
  liabilities?: number;
  monthlyCashFlow?: number;
  sparklineData: number[];
  healthScore: number;
  healthBreakdown: FinancialHealthBreakdown[];
  protectSignal: {
    threatCount: number;
    topAmount: string;
    topCounterparty: string;
    severity: string;
  } | null;
  growSignal: {
    savingsPerMonth: number;
    recCount: number;
    topTitle: string;
  } | null;
  executeSignal: {
    pendingCount: number;
    topTitle: string;
    topAmount: string;
  } | null;
  decisionsAudited: number;
  complianceScore: number;
  onNavigate: (path: string) => void;
}

function formatMoney(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function AssetTopography({ data }: { data: number[] }) {
  if (data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const width = 820;
  const height = 320;
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 60) - 30;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,17,30,0.9),rgba(6,10,18,0.7))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[280px] w-full"
        role="img"
        aria-label="Portfolio asset topography for the last month"
      >
        <defs>
          <linearGradient id="dashboard-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,240,255,0.45)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0.02)" />
          </linearGradient>
          <filter id="dashboard-line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0.15, 0.35, 0.55, 0.75].map((y) => (
          <line
            key={y}
            x1="0"
            y1={height * y}
            x2={width}
            y2={height * y}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 8"
          />
        ))}

        <polygon points={areaPoints} fill="url(#dashboard-area-fill)" />
        <polyline
          points={points}
          fill="none"
          stroke="var(--engine-dashboard)"
          strokeWidth="4"
          filter="url(#dashboard-line-glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="pointer-events-none absolute inset-x-8 bottom-6 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/35">
        <span>Month Open</span>
        <span>Command Center Projection</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function SignalCard({
  label,
  body,
  helper,
  icon: Icon,
  tintClass,
  onClick,
}: {
  label: string;
  body: string;
  helper: string;
  icon: typeof Shield;
  tintClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[88px] items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition-colors hover:bg-white/[0.06]"
    >
      <div className={cn("mt-0.5 rounded-2xl border border-white/10 p-3", tintClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{label}</p>
        <p className="mt-2 text-sm text-white">{body}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="truncate text-xs text-white/45">{helper}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-white/35" />
        </div>
      </div>
    </button>
  );
}

function HealthMeter({
  score,
  breakdown,
  decisionsAudited,
  complianceScore,
}: {
  score: number;
  breakdown: FinancialHealthBreakdown[];
  decisionsAudited: number;
  complianceScore: number;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Financial Health Score
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{score.toFixed(1)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Govern</p>
          <p className="mt-2 font-mono text-sm text-[var(--engine-govern)]">{decisionsAudited.toLocaleString()} verified</p>
        </div>
      </div>

      <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
        {breakdown.map((item) => (
          <div
            key={item.engine}
            style={{ width: `${item.weight * 100}%` }}
            className={cn(
              item.engine === "protect" && "bg-[var(--engine-protect)]",
              item.engine === "grow" && "bg-[var(--engine-grow)]",
              item.engine === "execute" && "bg-[var(--engine-execute)]",
              item.engine === "govern" && "bg-[var(--engine-govern)]",
            )}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/40">
        {breakdown.map((item) => (
          <span key={item.engine} className="inline-flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                item.engine === "protect" && "bg-[var(--engine-protect)]",
                item.engine === "grow" && "bg-[var(--engine-grow)]",
                item.engine === "execute" && "bg-[var(--engine-execute)]",
                item.engine === "govern" && "bg-[var(--engine-govern)]",
              )}
            />
            {item.engine} {Math.round(item.value)}
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-[var(--engine-govern)]" />
          Compliance {complianceScore}%
        </span>
      </div>
    </div>
  );
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
  const resolvedAssets = assets ?? netWorth;
  const resolvedLiabilities = liabilities ?? 0;
  const resolvedMonthlyCashFlow = monthlyCashFlow ?? netWorthChange;
  const positiveDay = netWorthChange >= 0;

  return (
    <section
      role="region"
      aria-labelledby="dashboard-hero-title"
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#081221] shadow-[0_30px_120px_rgba(0,0,0,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.12),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />
      <div className="relative z-10 flex min-h-[65vh] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <div className="grid flex-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/45">
              <span>Portfolio Command Center</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-white/55">
                {userName}
              </span>
            </div>

            <div>
              <p className="text-sm text-white/45">Net Worth</p>
              <h2
                id="dashboard-hero-title"
                className="mt-3 text-[clamp(3.25rem,9vw,6.5rem)] font-semibold leading-none tracking-[-0.05em] text-white"
              >
                ${formatMoney(netWorth)}
              </h2>
              <p
                className={cn(
                  "mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                  positiveDay
                    ? "bg-[rgba(34,197,94,0.12)] text-[var(--engine-protect)]"
                    : "bg-[rgba(239,68,68,0.12)] text-[var(--state-critical)]",
                )}
              >
                <TrendingUp className="h-4 w-4" />
                {positiveDay ? "+" : "-"}
                {formatUsd(Math.abs(netWorthChange))} Today
                <span className="text-white/45">({positiveDay ? "+" : ""}{netWorthChangePercent.toFixed(2)}%)</span>
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Assets</p>
                <p className="mt-3 text-lg font-semibold text-white">{formatUsd(resolvedAssets)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Liabilities</p>
                <p className="mt-3 text-lg font-semibold text-white">{formatUsd(resolvedLiabilities)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Monthly Flow</p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {resolvedMonthlyCashFlow >= 0 ? "+" : "-"}
                  {formatUsd(Math.abs(resolvedMonthlyCashFlow))}
                </p>
              </div>
            </div>

            <HealthMeter
              score={healthScore}
              breakdown={healthBreakdown}
              decisionsAudited={decisionsAudited}
              complianceScore={complianceScore}
            />
          </div>

          <div className="flex flex-col gap-5">
            <AssetTopography data={sparklineData} />

            <div className="grid gap-3">
              {protectSignal && (
                <SignalCard
                  label="Protect"
                  body={`${protectSignal.threatCount} anomaly flagged`}
                  helper={`${protectSignal.topCounterparty} · ${protectSignal.topAmount}`}
                  icon={AlertTriangle}
                  tintClass="bg-[rgba(34,197,94,0.12)] text-[var(--engine-protect)]"
                  onClick={() => onNavigate("/protect")}
                />
              )}
              {growSignal && (
                <SignalCard
                  label="Grow"
                  body={`+${formatUsd(growSignal.savingsPerMonth)}/mo unlocked`}
                  helper={`${growSignal.recCount} opportunity${growSignal.recCount === 1 ? "" : "ies"} · ${growSignal.topTitle}`}
                  icon={Landmark}
                  tintClass="bg-[rgba(139,92,246,0.14)] text-[var(--engine-grow)]"
                  onClick={() => onNavigate("/grow")}
                />
              )}
              {executeSignal && (
                <SignalCard
                  label="Execute"
                  body={`${executeSignal.pendingCount} action${executeSignal.pendingCount === 1 ? "" : "s"} queued`}
                  helper={`${executeSignal.topTitle} · ${executeSignal.topAmount}`}
                  icon={Zap}
                  tintClass="bg-[rgba(234,179,8,0.14)] text-[var(--engine-execute)]"
                  onClick={() => onNavigate("/execute")}
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="grid gap-3 md:grid-cols-4">
            <ListPortalBar
              engine="protect"
              label="Threat details"
              count={protectSignal?.threatCount ?? 0}
              destination={{ type: "route", to: "/protect/threats" }}
            />
            <ListPortalBar
              engine="grow"
              label="Opportunities"
              count={growSignal?.recCount ?? 0}
              destination={{ type: "route", to: "/grow/recommendations" }}
            />
            <ListPortalBar
              engine="execute"
              label="Approval queue"
              count={executeSignal?.pendingCount ?? 0}
              destination={{ type: "route", to: "/execute/queue" }}
            />
            <ListPortalBar
              engine="govern"
              label="Audit history"
              count={decisionsAudited}
              destination={{ type: "route", to: "/govern/audit" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
