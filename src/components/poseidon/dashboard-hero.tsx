/**
 * DashboardHero — Cinematic command nexus for /dashboard.
 *
 * Zone A: Greeting, giant net-worth CountUp, health score bar, sparkline.
 * Zone B: 3 engine signal cards (Protect/Grow/Execute) + Govern badge.
 * Zone C: 4× ListPortalBar navigation.
 *
 * CSS-only animations (no framer-motion).
 */
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Zap,
  Scale,
  CheckCircle2,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroBento } from "./hero-bento";
import { CountUp } from "./count-up";
import { KpiCard } from "./kpi-card";
import { ListPortalBar } from "./list-portal-bar";
import { formatUsd } from "@/domain/poseidon-universe";
import type { FinancialHealthBreakdown } from "@/domain/poseidon-universe";

/* ── Props ── */

export interface DashboardHeroProps {
  userName: string;
  netWorth: number;
  netWorthChange: number;
  netWorthChangePercent: number;
  assets: number;
  liabilities: number;
  monthlyCashFlow: number;
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

/* ── Engine color map ── */

const ENGINE_CSS_VAR: Record<string, string> = {
  protect: "--engine-protect",
  grow: "--engine-grow",
  execute: "--engine-execute",
  govern: "--engine-govern",
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export function DashboardHero({
  userName,
  netWorth,
  netWorthChange,
  netWorthChangePercent,
  sparklineData,
  healthScore,
  healthBreakdown,
  protectSignal,
  growSignal,
  executeSignal,
  decisionsAudited,
  onNavigate,
  assets,
  liabilities,
  monthlyCashFlow,
}: DashboardHeroProps) {
  return (
    <HeroBento engine="dashboard">
      <div className="flex flex-col lg:flex-row w-full">
        {/* ── Main Dashboard Top Section ── */}
        <div className="flex flex-col flex-1 p-6 lg:p-10 justify-between gap-8 lg:gap-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
            <div className="flex flex-col flex-1">
              <GreetingLine userName={userName} />
              <div className="mt-6 lg:mt-8">
                <NetWorthDisplay
                  netWorth={netWorth}
                  change={netWorthChange}
                  changePercent={netWorthChangePercent}
                />
              </div>
            </div>

            <div className="flex flex-col justify-end gap-6 lg:gap-8 lg:min-w-[320px]">
              <HealthScoreBar score={healthScore} breakdown={healthBreakdown} />
              <NetWorthSparkline data={sparklineData} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-auto">
            <KpiCard label="Assets" value={formatUsd(assets)} color="white" />
            <KpiCard
              label="Liabilities"
              value={formatUsd(liabilities)}
              color="var(--state-warning)"
            />
            <KpiCard
              label="Monthly Flow"
              value={`+${formatUsd(monthlyCashFlow)}`}
              color="var(--engine-grow)"
            />
          </div>
        </div>

        {/* ── Engine Signals ── */}
        <div className="flex flex-col gap-3 p-6 lg:p-10 lg:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-black/20">
          <div className="flex flex-col gap-2">
            {protectSignal && (
              <EngineSignalCard
                engine="protect"
                icon={Shield}
                primaryMetric={`${protectSignal.threatCount} active threat${protectSignal.threatCount !== 1 ? "s" : ""}`}
                secondaryLine={`${protectSignal.topAmount} flagged · ${protectSignal.topCounterparty}`}
                navigateTo="/protect"
                onNavigate={onNavigate}
                priority="primary"
                delayClass=""
              />
            )}
            {growSignal && (
              <EngineSignalCard
                engine="grow"
                icon={TrendingUp}
                primaryMetric={`+${formatUsd(growSignal.savingsPerMonth)}/mo found`}
                secondaryLine={`${growSignal.recCount} recommendation${growSignal.recCount !== 1 ? "s" : ""}`}
                navigateTo="/grow"
                onNavigate={onNavigate}
                priority="secondary"
                delayClass="animate-fade-up-delay-1"
              />
            )}
            {executeSignal && (
              <EngineSignalCard
                engine="execute"
                icon={Zap}
                primaryMetric={`${executeSignal.pendingCount} pending approval${executeSignal.pendingCount !== 1 ? "s" : ""}`}
                secondaryLine={`${executeSignal.topAmount} tax savings`}
                navigateTo="/execute"
                onNavigate={onNavigate}
                priority="secondary"
                delayClass="animate-fade-up-delay-2"
              />
            )}
          </div>

          <GovernBadge
            decisionsAudited={decisionsAudited}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* ── Zone C: Portal ── */}
      <HeroBento.Portal>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <ListPortalBar
            engine="protect"
            label="View all threats"
            count={protectSignal?.threatCount ?? 0}
            destination={{ type: "route", to: "/protect/threats" }}
          />
          <ListPortalBar
            engine="grow"
            label="View recommendations"
            count={growSignal?.recCount ?? 0}
            destination={{ type: "route", to: "/grow/recommendations" }}
          />
          <ListPortalBar
            engine="execute"
            label="Actions to approve"
            count={executeSignal?.pendingCount ?? 0}
            destination={{ type: "route", to: "/execute/queue" }}
          />
          <ListPortalBar
            engine="govern"
            label="Decision history"
            count={decisionsAudited}
            destination={{ type: "route", to: "/govern/audit" }}
          />
        </div>
      </HeroBento.Portal>
    </HeroBento>
  );
}

/* ═══════════════════════════════════════════
   INTERNAL COMPONENTS
   ═══════════════════════════════════════════ */

/* ── Greeting ── */

function GreetingLine({ userName }: { userName: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <p
      className="text-lg md:text-xl text-white/60 italic"
      style={{ fontFamily: "var(--font-display, serif)" }}
    >
      {greeting}, {userName}.
    </p>
  );
}

/* ── Net Worth Display ── */

function NetWorthDisplay({
  netWorth,
  change,
  changePercent,
}: {
  netWorth: number;
  change: number;
  changePercent: number;
}) {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="flex flex-col gap-2 lg:gap-4">
      <span className="typo-hero-number text-[clamp(3.5rem,10vw,7rem)] leading-none text-white/95 tracking-tighter">
        <CountUp value={Math.round(netWorth)} prefix="$" locale />
      </span>
      <span className="text-[10px] uppercase tracking-[0.08em] text-white/40 font-medium">
        Net Worth
      </span>
      <span
        className={`inline-flex items-center gap-1.5 font-mono text-sm ${isPositive ? "text-emerald-400" : "text-red-400"}`}
      >
        <TrendIcon size={12} />
        {isPositive ? "+" : ""}
        {formatUsd(Math.abs(change))} ({isPositive ? "+" : ""}
        {changePercent.toFixed(1)}%)
      </span>
    </div>
  );
}

/* ── Health Score Bar ── */

function HealthScoreBar({
  score,
  breakdown,
}: {
  score: number;
  breakdown: FinancialHealthBreakdown[];
}) {
  return (
    <div className="flex flex-col gap-2 mt-1">
      <div className="flex items-center gap-3">
        {/* Segmented bar */}
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] flex overflow-hidden">
          {breakdown.map((b) => (
            <div
              key={b.engine}
              className="h-full transition-all duration-700"
              style={{
                width: `${b.weight * 100}%`,
                backgroundColor: `var(${ENGINE_CSS_VAR[b.engine]})`,
                opacity: Math.max(0.2, b.value / 100),
              }}
            />
          ))}
        </div>
        {/* Score */}
        <span className="font-mono text-xl text-white/90 tabular-nums">
          <CountUp value={score} decimals={1} />
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-[0.08em] text-white/40 font-medium">
        Financial Health Score
      </span>
    </div>
  );
}

/* ── Sparkline ── */

function NetWorthSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const width = 200;
  const height = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const areaPath = `M${points[0]} ${points
    .slice(1)
    .map((p) => `L${p}`)
    .join(" ")} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-sm h-12 mt-1 opacity-80"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--engine-dashboard)"
            stopOpacity="0.12"
          />
          <stop
            offset="100%"
            stopColor="var(--engine-dashboard)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkline-fill)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="var(--engine-dashboard)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Engine Signal Card ── */

function EngineSignalCard({
  engine,
  icon: Icon,
  primaryMetric,
  secondaryLine,
  navigateTo,
  onNavigate,
  priority,
  delayClass,
}: {
  engine: string;
  icon: LucideIcon;
  primaryMetric: string;
  secondaryLine: string;
  navigateTo: string;
  onNavigate: (path: string) => void;
  priority: "primary" | "secondary";
  delayClass: string;
}) {
  const cssVar = ENGINE_CSS_VAR[engine] ?? "--engine-dashboard";

  return (
    <button
      type="button"
      onClick={() => onNavigate(navigateTo)}
      data-cta-priority={priority === "primary" ? "primary" : undefined}
      className={`animate-fade-up ${delayClass} flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 rounded-xl bg-[#0A0A0A]/40 backdrop-blur-md border border-white/5 border-l-4 p-4 md:p-5 w-full cursor-pointer hover:bg-white/5 transition-colors overflow-hidden relative group`}
      style={{
        borderLeftColor: `var(${cssVar})`,
        backgroundColor:
          priority === "primary" ? "rgba(255,255,255,0.06)" : undefined,
        boxShadow:
          priority === "primary"
            ? `0 0 36px color-mix(in srgb, var(${cssVar}) 12%, transparent)`
            : undefined,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, var(${cssVar}) 0%, transparent 100%)`,
        }}
      />
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
        <Icon
          size={20}
          style={{
            color: `var(${cssVar})`,
          }}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
        <span
          className="font-mono text-base md:text-lg font-bold text-white block truncate"
          style={{ color: `var(${cssVar})` }}
        >
          {primaryMetric}
        </span>
        <span className="text-xs text-white/50 block truncate font-medium">
          {secondaryLine}
        </span>
      </div>
      <div
        className={cn(
          "mt-2 sm:mt-0 ml-auto flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
          priority === "primary"
            ? "border border-white/[0.15] bg-white/[0.08] text-white/80 group-hover:bg-white/[0.12]"
            : "border border-white/10 bg-white/5 text-white/55 group-hover:bg-white/10",
        )}
      >
        View
        <ChevronRight size={14} />
      </div>
    </button>
  );
}

/* ── Govern Badge ── */

function GovernBadge({
  decisionsAudited,
  onNavigate,
}: {
  decisionsAudited: number;
  onNavigate: (path: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate("/govern")}
      className="animate-fade-up animate-fade-up-delay-3 flex items-center gap-2 mt-3 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <Scale
        size={14}
        style={{ color: "var(--engine-govern)" }}
        className="shrink-0"
      />
      <span className="text-xs text-white/40">
        {decisionsAudited.toLocaleString()} decisions verified
      </span>
      <CheckCircle2 size={12} className="text-emerald-400/60 shrink-0" />
    </button>
  );
}
