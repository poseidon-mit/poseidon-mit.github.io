import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, TrendingUp, Shield } from "lucide-react";
import { Link } from "@/router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { getMotionPreset } from "@/lib/motion-presets";
import {
  HeroBackdrop,
  HeroEyebrow,
  HeroMetricPill,
  HeroUnifiedFooter,
} from "./hero-concept-primitives";

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
  spotlightRec?: {
    id: number;
    title: string;
    monthlySavings: number;
    confidence: number;
  } | null;
  onViewRecommendations?: () => void;
  cohortHeadline?: string;
  goals?: {
    id: string;
    title: string;
    currentUsd: number;
    targetUsd: number;
  }[];
}

export type GrowGrowthAdvantageProps = GrowHeroProps;

function money(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

function GrowLedgerField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 items-start min-w-[100px]">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        {label}
      </span>
      <p className="font-mono text-sm text-white/80 truncate leading-none mt-1">
        {value}
      </p>
    </div>
  );
}

function CompoundTerrain({
  data,
  showDelta,
  reducedMotion,
  replayKey,
}: {
  data: GrowHeroProps["simulationData"];
  showDelta: boolean;
  reducedMotion: boolean;
  replayKey: number;
}) {
  const [activeIndex, setActiveIndex] = useState(Math.max(data.length - 1, 0));
  const width = 820;
  const height = 320;
  const allValues = data.flatMap((point) => [
    point.baseline,
    point.aiOptimized,
    point.low ?? point.aiOptimized,
    point.high ?? point.aiOptimized,
  ]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  const normalized = useMemo(
    () =>
      data.map((point, index) => {
        const x = (index / Math.max(data.length - 1, 1)) * width;
        const baselineY =
          height -
          ((point.baseline - min) / Math.max(max - min, 1)) * (height - 80) -
          40;
        const optimizedY =
          height -
          ((point.aiOptimized - min) / Math.max(max - min, 1)) * (height - 80) -
          40;
        const lowY =
          height -
          (((point.low ?? point.aiOptimized) - min) / Math.max(max - min, 1)) *
            (height - 80) -
          40;
        const highY =
          height -
          (((point.high ?? point.aiOptimized) - min) / Math.max(max - min, 1)) *
            (height - 80) -
          40;
        return { x, baselineY, optimizedY, lowY, highY };
      }),
    [data, height, max, min, width],
  );

  const baselinePoints = normalized
    .map((point) => `${point.x},${point.baselineY}`)
    .join(" ");
  const optimizedPoints = normalized
    .map((point) => `${point.x},${point.optimizedY}`)
    .join(" ");
  const vaporArea = normalized
    .map((point) => `${point.x},${point.highY}`)
    .concat(
      [...normalized].reverse().map((point) => `${point.x},${point.lowY}`),
    )
    .join(" ");
  const activePoint =
    normalized[activeIndex] ?? normalized[normalized.length - 1];
  const activeData = data[activeIndex] ?? data[data.length - 1];

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      onMouseMove={(event) => {
        if (reducedMotion || data.length <= 1) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / Math.max(rect.width, 1);
        setActiveIndex(
          Math.max(
            0,
            Math.min(data.length - 1, Math.round(ratio * (data.length - 1))),
          ),
        );
      }}
      onTouchMove={(event) => {
        if (reducedMotion || data.length <= 1) return;
        const touch = event.touches[0];
        if (!touch) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const ratio = (touch.clientX - rect.left) / Math.max(rect.width, 1);
        setActiveIndex(
          Math.max(
            0,
            Math.min(data.length - 1, Math.round(ratio * (data.length - 1))),
          ),
        );
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(139,92,246,0.03),transparent_65%)]" />
      <div
        className={cn(
          "absolute inset-x-[12%] top-1/4 h-32 rounded-full blur-3xl opacity-30 mix-blend-screen pointer-events-none",
          showDelta &&
            !reducedMotion &&
            "animate-[pulse_8s_ease-in-out_infinite]",
        )}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
        }}
      />

      {/* SVG Canvas */}
      <div className="relative z-10 flex-1 w-full flex flex-col justify-end pt-8 md:pt-12">
        <svg
          key={replayKey}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(139,92,246,0.1)]"
          preserveAspectRatio="none"
          role="img"
          aria-label={`3-year growth outlook from $${money(data[0]?.baseline ?? 0)} to $${money(data[data.length - 1]?.aiOptimized ?? 0)} optimized versus $${money(data[data.length - 1]?.baseline ?? 0)} baseline`}
        >
          <defs>
            <linearGradient
              id="grow-optimized-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="rgba(139,92,246,0.4)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="100%" stopColor="rgba(139,92,246,1)" />
            </linearGradient>
            <linearGradient id="grow-vapor-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(139,92,246,0.25)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0.01)" />
            </linearGradient>
            <filter
              id="grow-vapor-glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Holographic grid pattern for the graph background */}
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {[0.2, 0.5, 0.8].map((line) => (
            <line
              key={line}
              x1="0"
              y1={height * line}
              x2={width}
              y2={height * line}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 8"
            />
          ))}

          {showDelta && (
            <polygon
              points={vaporArea}
              fill="url(#grow-vapor-fill)"
              filter="url(#grow-vapor-glow)"
              className={cn(
                !reducedMotion && "animate-[pulse_10s_ease-in-out_infinite]",
              )}
            />
          )}

          {/* Lines */}
          <polyline
            points={baselinePoints}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
            strokeDasharray="5 10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={optimizedPoints}
            fill="none"
            stroke="url(#grow-optimized-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              !reducedMotion && "drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]",
            )}
          />

          {/* Active Point Highlight */}
          {activePoint && !reducedMotion && (
            <g
              style={{
                transformOrigin: `${activePoint.x}px ${activePoint.optimizedY}px`,
              }}
              className="animate-[pulse_4s_ease-in-out_infinite]"
            >
              <circle
                cx={activePoint.x}
                cy={activePoint.optimizedY}
                r="40"
                fill="url(#grow-vapor-fill)"
                filter="url(#grow-vapor-glow)"
                opacity="0.6"
              />
            </g>
          )}

          {/* Interactive Contour Scrubber */}
          {activePoint && (
            <g className="transition-all duration-200 ease-out">
              <line
                x1={activePoint.x}
                y1="0"
                x2={activePoint.x}
                y2={height}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="4 6"
                strokeWidth="2"
              />
              {/* Scrubber Handles */}
              <circle
                cx={activePoint.x}
                cy={activePoint.optimizedY}
                r="6"
                fill="var(--engine-grow)"
                className="transition-transform duration-200 hover:scale-150 cursor-ew-resize drop-shadow-[0_0_5px_rgba(139,92,246,1)]"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.optimizedY}
                r="16"
                fill="var(--engine-grow)"
                opacity="0.15"
                className="pointer-events-none"
              />

              <circle
                cx={activePoint.x}
                cy={activePoint.baselineY}
                r="4"
                fill="rgba(255,255,255,0.6)"
                className="transition-transform duration-200 hover:scale-150 cursor-ew-resize"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.baselineY}
                r="10"
                fill="rgba(255,255,255,0.1)"
                opacity="0.2"
                className="pointer-events-none"
              />
            </g>
          )}
        </svg>
      </div>

      <div className="relative z-10 flex w-full flex-col px-6 pb-6 md:px-10 md:pb-8 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 border-t border-white/5 pt-4">
          <span>Baseline path finding</span>
          <span className="text-[var(--engine-grow)] font-bold">
            {activeData?.year ?? "Now"}
          </span>
          <span>AI Optimized arc</span>
        </div>

        {activeData && (
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-white/40">
                Baseline
              </span>
              <span className="font-mono text-lg text-white/50">
                ${money(activeData.baseline)}
              </span>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <span className="text-[10px] uppercase tracking-widest text-[var(--engine-grow)]/60">
                Optimized
              </span>
              <span className="font-mono text-xl md:text-2xl text-[var(--engine-grow)] drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                ${money(activeData.aiOptimized)}
              </span>
            </div>
          </div>
        )}
      </div>
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
  cohortHeadline,
  goals,
}: GrowHeroProps & { goals?: unknown }) {
  const reducedMotion = useReducedMotionSafe();
  const { heroFadeUp, heroStaggerContainer } = getMotionPreset(reducedMotion);
  const showDelta = true;
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <section
        role="region"
        aria-labelledby="grow-hero-title"
        className="hero-canvas relative flex min-h-[580px] w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10"
      >
        <HeroBackdrop
          accent="var(--engine-grow)"
          secondaryAccent="#020202"
          reducedMotion={reducedMotion}
        />

        {/* Subtle Breathing Violet Glow Canvas */}
        {!reducedMotion && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-screen opacity-10">
            <div className="h-[50vh] w-[50vw] rounded-full bg-[var(--engine-grow)] blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
          </div>
        )}

        <motion.div
          className="relative z-10 flex flex-1 w-full flex-col"
          variants={heroStaggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-12 md:px-10">
            <motion.div variants={heroFadeUp} className="mb-10 w-full flex justify-center">
              <div className="flex flex-col items-center gap-2 text-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]">
                <HeroEyebrow className="border-[var(--engine-grow)]/20 bg-[var(--engine-grow)]/5 text-[var(--engine-grow)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Grow horizon live
                </HeroEyebrow>
                <h2 id="grow-hero-title" className="sr-only">
                  Grow
                </h2>
                <p className="sr-only mt-2 text-sm font-medium tracking-wide text-white/50">
                  {recommendationCount} ranked opportunities ready for execution
                </p>
              </div>
            </motion.div>

            <motion.div variants={heroFadeUp} className="w-full">
              <div className="group relative w-full overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-[1px] shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-[var(--engine-grow)]/30 hover:shadow-[0_0_80px_-20px_var(--engine-grow)]">
              {!reducedMotion && (
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] bg-[conic-gradient(from_0deg,transparent_0_340deg,var(--engine-grow)_360deg)] opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:animate-[spin_4s_linear_infinite] group-hover:opacity-100" />
              )}

              <div className="relative z-10 grid gap-0 rounded-[23px] bg-[#050510] lg:grid-cols-2">
                <div className="flex flex-col border-b border-white/10 p-8 lg:border-b-0 lg:border-r md:p-10">
                  <h3 className="mb-4 text-lg font-semibold leading-snug tracking-tight text-white/80">
                    Projected Gain
                  </h3>
                  <p className="mb-2 break-all font-mono text-[clamp(1.5rem,2.5vw,2.5rem)] leading-none tracking-tighter text-white">
                    +${money(projectedGain)}
                  </p>

                  <p className="mb-10 max-w-sm text-sm leading-relaxed text-white/60">
                    AI has optimized your portfolio distribution. Executing
                    these recommendations will compound your theoretical gain.
                  </p>

                  <div className="mt-auto mb-8 flex flex-col gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                      Top recommendation
                    </span>

                    {spotlightRec ? (
                      <div className="flex flex-col gap-3">
                        <h3 className="min-w-0 text-lg font-semibold text-white">
                          {spotlightRec.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <HeroMetricPill
                            label="Monthly Lift"
                            value={`+$${money(spotlightRec.monthlySavings)}/mo`}
                            tone="var(--engine-grow)"
                          />
                          <HeroMetricPill
                            label="Confidence"
                            value={`${Math.round(spotlightRec.confidence * 100)}%`}
                            tone="var(--state-success)"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 p-4">
                        <p className="text-xs text-white/40">
                          No priority recommendations detected.
                        </p>
                      </div>
                    )}
                  </div>

                  <Link
                    to={
                      spotlightRec
                        ? `/grow/recommendation?id=${spotlightRec.id}`
                        : "/grow/recommendations"
                    }
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "min-h-[48px] w-full rounded-xl bg-[var(--engine-grow)] px-7 font-semibold text-black transition-all duration-300 hover:bg-[var(--engine-grow)]/90 sm:w-auto",
                    )}
                  >
                    Approve
                  </Link>
                </div>

                <div className="relative flex min-h-[400px] flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.05)_0%,transparent_70%)]">
                  {!reducedMotion && (
                    <div className="absolute top-0 right-0 z-20 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--engine-grow)]/30 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  )}

                  <div className="absolute top-8 right-8 left-8 z-20 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--engine-grow)]">
                      Compound Singularity
                    </span>
                    {!reducedMotion && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setReplayKey((i) => i + 1)}
                          className="sr-only text-white"
                        >
                          see poseidon delta
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplayKey((i) => i + 1)}
                          className="sr-only text-white"
                        >
                          replay
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative flex w-full flex-1 pt-12">
                    <CompoundTerrain
                      data={simulationData}
                      showDelta={showDelta}
                      reducedMotion={reducedMotion}
                      replayKey={replayKey}
                    />
                  </div>
                </div>
              </div>
              </div>
            </motion.div>

              <motion.div variants={heroFadeUp}>
                <div className="mt-8 flex w-full max-w-5xl flex-col items-center justify-between gap-6 border-t border-white/5 pt-6 lg:flex-row">
                  <div className="flex w-full flex-wrap items-center justify-center gap-6 md:gap-10 lg:w-auto">
                    {goals && (
                      <span className="sr-only mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                        Goal progress
                      </span>
                    )}
                    <div className="sr-only">87%</div>
                    <GrowLedgerField
                      label="Avg Confidence"
                      value={`${Math.round(avgConfidence * 100)}%`}
                    />
                    <GrowLedgerField
                      label="Ranked Ops"
                      value={recommendationCount.toString()}
                    />
                    <div className="sr-only">
                      {recommendationCount} ranked opportunities ready for execution
                    </div>
                    <GrowLedgerField
                      label="Total Monthly Savings"
                      value={`+$${money(totalMonthlySavings)}/mo`}
                    />
                  </div>

                  {cohortHeadline && (
                    <div className="flex w-full max-w-sm shrink-0 items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.02] px-4 py-3 lg:w-auto lg:justify-end">
                      <Users className="h-4 w-4 text-[var(--engine-grow)]/60" />
                      <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                        Cohort signal
                      </span>
                      <p className="text-xs leading-snug text-white/70">
                        {cohortHeadline}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
          </div>

          <motion.div variants={heroFadeUp}>
            <HeroUnifiedFooter
              engineColor="var(--engine-grow)"
              label="View all opportunities"
              to="/grow/recommendations"
              icon={ArrowRight}
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export const GrowGrowthAdvantage = GrowHero;
