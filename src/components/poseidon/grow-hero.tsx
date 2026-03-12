import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Sparkles, Users } from "lucide-react";
import { BranchingTree } from "./effects/BranchingTree";
import { ListPortalBar } from "./list-portal-bar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export interface GrowHeroProps {
  projectedGain: number;
  totalMonthlySavings: number;
  avgConfidence: number;
  recommendationCount: number;
  simulationData: {
    year: string;
    baseline: number;
    aiOptimized: number;
    low?: number;
    high?: number;
  }[];
  onViewRecommendations: () => void;
  spotlightRec?: {
    title: string;
    monthlySavings: number;
    confidence: number;
  } | null;
  goals?: {
    id: string;
    title: string;
    currentUsd: number;
    targetUsd: number;
  }[];
  cohortHeadline?: string;
}

export type GrowGrowthAdvantageProps = GrowHeroProps;

function money(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

function GoalProgress({
  title,
  currentUsd,
  targetUsd,
}: {
  title: string;
  currentUsd: number;
  targetUsd: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((currentUsd / Math.max(targetUsd, 1)) * 100)));

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white">{title}</p>
        <span className="font-mono text-xs text-[var(--engine-grow)]">{pct}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-[var(--engine-grow)] shadow-[0_0_16px_rgba(139,92,246,0.45)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-white/45">
        ${money(currentUsd)} of ${money(targetUsd)}
      </p>
    </div>
  );
}

export function GrowHero({
  projectedGain,
  totalMonthlySavings,
  avgConfidence,
  recommendationCount,
  simulationData,
  onViewRecommendations,
  spotlightRec,
  goals,
  cohortHeadline,
}: GrowHeroProps) {
  const reducedMotion = useReducedMotionSafe();
  const [showDelta, setShowDelta] = useState(reducedMotion);
  const [replayKey, setReplayKey] = useState(0);

  const start = simulationData[0] ?? { baseline: 0, aiOptimized: 0 };
  const finish = simulationData[simulationData.length - 1] ?? start;
  const currentValue = start.baseline;
  const optimizedValue = showDelta ? finish.aiOptimized : start.aiOptimized;
  const idleValue = finish.baseline;

  const chartLabel = useMemo(
    () =>
      `3-year growth outlook from $${money(currentValue)} to $${money(finish.aiOptimized)} optimized versus $${money(idleValue)} idle path`,
    [currentValue, finish.aiOptimized, idleValue],
  );

  return (
    <section
      role="region"
      aria-labelledby="grow-hero-title"
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#08101d]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />
      <div className="relative z-10 flex min-h-[65vh] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Sparkles className="mb-6 h-10 w-10 text-[var(--engine-grow)]" />
          <h2
            id="grow-hero-title"
            aria-label="WEALTH TRAJECTORY FORECAST"
            className="text-[clamp(2.8rem,8vw,5.4rem)] font-semibold leading-none tracking-[-0.05em] text-white"
          >
            WEALTH TRAJECTORY
            <br />
            FORECAST
          </h2>

          <div
            key={replayKey}
            role="img"
            aria-label={chartLabel}
            className="mt-10 w-full max-w-5xl rounded-[28px] border border-white/10 bg-black/20 px-4 py-6"
          >
            <BranchingTree
              className="mx-auto"
              currentValue={currentValue}
              optimizedValue={optimizedValue}
              idleValue={idleValue}
            />
          </div>

          <p className="mt-8 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
            Poseidon AI has identified {recommendationCount} high-conviction opportunities.
            Optimizing your idle capital will yield a potential{" "}
            <span className="text-[var(--engine-grow)]">+${money(projectedGain)}/yr</span>.
          </p>

          <div className="mt-8 grid w-full max-w-4xl gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Annual upside</p>
              <p className="mt-3 text-2xl font-semibold text-white">+${money(projectedGain)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Monthly lift</p>
              <p className="mt-3 text-2xl font-semibold text-white">+${money(totalMonthlySavings)}/mo</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Average confidence</p>
              <p className="mt-3 text-2xl font-semibold text-white">{Math.round(avgConfidence * 100)}%</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onViewRecommendations}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-[48px] rounded-full bg-[var(--engine-grow)] px-7 text-white hover:bg-[var(--engine-grow)]/90",
              )}
            >
              View all opportunities
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            {!reducedMotion && !showDelta && (
              <button
                type="button"
                onClick={() => setShowDelta(true)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-[48px] rounded-full border-white/15 bg-white/[0.03] px-7 text-white/80 hover:bg-white/[0.08]",
                )}
              >
                See Poseidon delta
              </button>
            )}

            {!reducedMotion && showDelta && (
              <button
                type="button"
                onClick={() => setReplayKey((value) => value + 1)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-[48px] rounded-full border-white/15 bg-white/[0.03] px-7 text-white/80 hover:bg-white/[0.08]",
                )}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Replay
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Top recommendation</p>
            {spotlightRec ? (
              <div className="mt-4 space-y-3">
                <p className="text-xl font-semibold text-white">{spotlightRec.title}</p>
                <div className="flex flex-wrap gap-3 text-xs text-white/45">
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    +${money(spotlightRec.monthlySavings)}/mo
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {Math.round(spotlightRec.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/55">No recommendation is currently prioritized.</p>
            )}

            {cohortHeadline && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm leading-7 text-white/58">
                <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                  <Users className="h-3.5 w-3.5" />
                  Cohort signal
                </div>
                {cohortHeadline}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Goal progress</p>
            <div className="mt-4 space-y-3">
              {goals?.slice(0, 2).map((goal) => (
                <GoalProgress key={goal.id} {...goal} />
              ))}
              {!goals?.length && (
                <p className="text-sm text-white/55">No goals are currently connected to the Grow engine.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-2">
          <ListPortalBar
            engine="grow"
            label="Recommendation list"
            count={recommendationCount}
            destination={{ type: "route", to: "/grow/recommendations" }}
          />
          <ListPortalBar
            engine="grow"
            label="Goal tracking"
            count={goals?.length ?? 0}
            destination={{ type: "route", to: "/grow/goal" }}
          />
        </div>
      </div>
    </section>
  );
}

export const GrowGrowthAdvantage = GrowHero;
