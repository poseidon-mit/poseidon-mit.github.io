import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import {
  HeroBackdrop,
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

export function GrowHero({
  spotlightRec,
}: GrowHeroProps) {
  const performance = usePerformanceProfile();

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
          performanceProfile={performance.profile}
        />

        {performance.allowContinuousAnimation && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-screen opacity-10">
            <div className="h-[50vh] w-[50vw] rounded-full bg-[var(--engine-grow)] blur-[150px] animate-[pulse_8s_ease-in-out_infinite]" />
          </div>
        )}

        <div className="relative z-10 flex w-full flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-12 md:px-10">
            <h2 id="grow-hero-title" className="sr-only">
              Grow
            </h2>

            <div className="w-full">
              <div
                className={cn(
                  "group relative w-full overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-[1px] transition-all duration-500 hover:border-[var(--engine-grow)]/30",
                  performance.allowHeavyBlur
                    ? "shadow-2xl backdrop-blur-3xl hover:shadow-[0_0_80px_-20px_var(--engine-grow)]"
                    : "shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
                )}
              >
                {performance.allowContinuousAnimation && (
                  <div className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] bg-[conic-gradient(from_0deg,transparent_0_340deg,var(--engine-grow)_360deg)] opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:animate-[spin_4s_linear_infinite] group-hover:opacity-100" />
                )}

                <div className="relative z-10 rounded-[23px] bg-[#050510]">
                  <div className="flex flex-col p-8 md:p-10">
                    <h3 className="mb-4 text-lg font-semibold leading-snug tracking-tight text-white/80">
                      Potential Savings Identified
                    </h3>

                    <p className="mb-10 max-w-sm text-sm leading-relaxed text-white/60">
                      We detected spending patterns across your accounts that may be worth reviewing.
                    </p>

                    <div className="mt-auto mb-8 flex flex-col gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                        Top observation
                      </span>

                      {spotlightRec ? (
                        <div className="flex flex-col gap-3">
                          <h3 className="min-w-0 text-lg font-semibold text-white">
                            {spotlightRec.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <HeroMetricPill
                              label="Risk"
                              value="Potential overdraft fee"
                              tone="var(--state-critical)"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 p-4">
                          <p className="text-xs text-white/40">
                            No observations detected.
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "min-h-[48px] w-full rounded-xl bg-[var(--engine-grow)]/50 px-7 font-semibold text-black/50 cursor-default sm:w-auto",
                      )}
                    >
                      See detail
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div>
            <HeroUnifiedFooter
              engineColor="var(--engine-grow)"
              label="View all opportunities"
              to="/grow/recommendations"
              performanceProfile={performance.profile}
              icon={ArrowRight}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export const GrowGrowthAdvantage = GrowHero;
