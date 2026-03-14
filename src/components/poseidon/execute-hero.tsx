import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Timer,
  Zap,
  Lock,
  Activity,
  User,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ExecuteEngineName,
  ExecutionType,
} from "@/domain/poseidon-universe/types";
import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import { HeroBackdrop, HeroUnifiedFooter } from "./hero-concept-primitives";

export interface ExecuteHeroProps {
  queueTotal: number;
  urgentCount: number;
  agentStepsCompleted: number;
  agentStepsTotal: number;
  featuredAction: {
    id: string;
    title: string;
    amountLabel: string;
    confidence: number;
    engine: ExecuteEngineName;
    sourceEngine: ExecuteEngineName;
    expiresIn: string | null;
    rollbackHours: number | null;
    executionType?: ExecutionType;
    riskTier?: 1 | 2;
  } | null;
  engineSources: {
    engine: ExecuteEngineName;
    count: number;
    color: string;
  }[];
  onReviewApproval: (() => void) | null;
  urgencyBreakdown?: { high: number; medium: number; low: number };
  currentSavingsUsd?: number;
  potentialSavingsUsd?: number;
  pendingQueue: { id: string; title: string }[];
  featuredActionSteps?: {
    id: string;
    label: string;
    actor: "agent" | "user";
    status: "completed" | "current" | "waiting" | "blocked";
  }[];
}

export type ExecuteApprovalCommandDeckProps = ExecuteHeroProps;

function useAccentStyle(color: string): CSSProperties {
  return useMemo(
    () =>
      ({
        ["--poseidon-orbit-color" as string]: color,
      }) as CSSProperties,
    [color],
  );
}

/* ── Step Pipeline (shipping-tracker style) ── */
function StepPipeline({
  steps,
  allowPulse,
}: {
  steps: NonNullable<ExecuteHeroProps["featuredActionSteps"]>;
  allowPulse: boolean;
}) {
  if (steps.length === 0) return null;

  const gridColumnCount = Math.max(steps.length * 2 - 1, 1);

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5">
      <div
        data-testid="execute-step-pipeline"
        className="grid gap-y-2"
        style={{
          gridTemplateColumns: `repeat(${gridColumnCount}, minmax(0, 1fr))`,
          gridTemplateRows: "40px auto",
        }}
      >
        {steps.map((step, i) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          const isWaiting = step.status === "waiting";
          const isUser = step.actor === "user";
          const stepColumn = i * 2 + 1;

          return (
            <div
              key={`node-${step.id}`}
              className="flex h-full min-w-0 items-center justify-center"
              style={{ gridColumn: `${stepColumn} / span 1`, gridRow: "1 / span 1" }}
            >
              <div
                className={cn(
                  "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 transition-all",
                  isCompleted &&
                    "bg-[var(--engine-execute)]/20 border border-[var(--engine-execute)]/40",
                  isCurrent &&
                    isUser &&
                    "bg-white/10 border-2 border-[var(--engine-execute)]/60",
                  isCurrent &&
                    !isUser &&
                    "bg-[var(--engine-execute)]/10 border border-[var(--engine-execute)]/40",
                  isWaiting && "border border-white/15 bg-transparent",
                  isCurrent && allowPulse && "animate-pulse",
                )}
              >
                {isCompleted && (
                  <CheckCircle2 className="h-4 w-4 text-[var(--engine-execute)]" />
                )}
                {isCurrent && isUser && (
                  <User className="h-4 w-4 text-white/90" />
                )}
                {isCurrent && !isUser && (
                  <Zap className="h-4 w-4 text-[var(--engine-execute)]" />
                )}
                {isWaiting && (
                  <Clock className="h-3.5 w-3.5 text-white/25" />
                )}
              </div>
            </div>
          );
        })}

        {steps.slice(0, -1).map((step, i) => {
          const currentCompleted = step.status === "completed";
          const nextCompleted = steps[i + 1]?.status === "completed";
          const connectorColumn = i * 2 + 2;

          return (
            <div
              key={`connector-${step.id}`}
              data-testid={`execute-step-connector-${step.id}`}
              aria-hidden="true"
              className="flex h-full w-full items-center px-2"
              style={{ gridColumn: `${connectorColumn} / span 1`, gridRow: "1 / span 1" }}
            >
              <div
                className={cn(
                  "w-full",
                  currentCompleted && nextCompleted
                    ? "h-[2px] bg-[var(--engine-execute)]/40"
                    : "h-0 border-t-2 border-dashed border-white/20",
                )}
              />
            </div>
          );
        })}

        {steps.map((step, i) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          const isWaiting = step.status === "waiting";
          const isUser = step.actor === "user";
          const stepColumn = i * 2 + 1;

          return (
            <div
              key={`label-${step.id}`}
              className="flex min-w-0 flex-col items-center gap-1 pt-2"
              style={{ gridColumn: `${stepColumn} / span 1`, gridRow: "2 / span 1" }}
            >
              <span
                className={cn(
                  "text-center font-mono text-[11px] leading-tight sm:text-xs",
                  "max-w-[120px]",
                  isCompleted && "text-white/50",
                  isCurrent && "text-white/80 font-medium",
                  isWaiting && "text-white/25",
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider leading-none",
                  isUser
                    ? "bg-[var(--engine-execute)]/15 text-[var(--engine-execute)]"
                    : "bg-white/5 text-white/30",
                )}
              >
                {isUser ? "YOU" : "AI"}
              </span>
            </div>
          );
        })}
      </div>

      <span className="sr-only">
        {steps.filter((s) => s.status === "completed").length}/{steps.length}{" "}
        steps completed
      </span>
    </div>
  );
}

export function ExecuteHero({
  queueTotal,
  urgentCount,
  agentStepsCompleted,
  agentStepsTotal,
  featuredAction,
  engineSources,
  onReviewApproval,
  urgencyBreakdown,
  currentSavingsUsd,
  pendingQueue = [],
  featuredActionSteps = [],
}: ExecuteHeroProps) {
  const performance = usePerformanceProfile();
  const [isHoveringApprove, setIsHoveringApprove] = useState(false);
  const accentStyle = useAccentStyle("var(--engine-execute)");
  const canAnimateHover =
    performance.allowHoverEnhancements && onReviewApproval !== null;

  if (!featuredAction) {
    return (
      <section
        role="region"
        aria-labelledby="execute-hero-title"
        className="hero-canvas relative flex h-full flex-1 flex-col overflow-hidden rounded-[32px] border border-white/10"
      >
        <HeroBackdrop
          accent="var(--engine-execute)"
          secondaryAccent="var(--engine-protect)"
          performanceProfile={performance.profile}
        />
        <div className="relative z-10 flex h-full flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
          <CheckCircle2 className="h-14 w-14 text-[var(--engine-protect)]" />
          <h2
            id="execute-hero-title"
            className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-light tracking-tight text-white"
          >
            Queue Clear
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-white/50">
            Poseidon has no actions waiting for consent. The command deck is
            clear and audit logging remains active.
          </p>
          {currentSavingsUsd != null && (
            <p className="rounded-full border border-white/10 px-4 py-2 font-mono text-sm text-white/70">
              Current monthly lift: ${currentSavingsUsd.toLocaleString()}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      role="region"
      aria-labelledby="execute-hero-title"
      className="hero-canvas relative flex h-full flex-1 flex-col overflow-hidden rounded-[32px] border border-white/10"
    >
      <span className="sr-only">{queueTotal}</span>
      <HeroBackdrop
        accent="var(--engine-execute)"
        secondaryAccent="#020202"
        performanceProfile={performance.profile}
      />

      <div className="relative z-10 flex h-full flex-1 flex-col p-5 sm:p-8">
        <div className="flex h-full flex-col">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 id="execute-hero-title" className="sr-only">
                Execute
              </h2>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--engine-execute)]/20 bg-[var(--engine-execute)]/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--engine-execute)]">
                <Zap className="h-3.5 w-3.5" />
                Auth Required
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-[var(--engine-execute)]/30 bg-[var(--engine-execute)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--engine-execute)]">
                {queueTotal} live queue item{queueTotal === 1 ? "" : "s"}
              </span>
              {urgentCount > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border border-[var(--state-warning)]/30 bg-[var(--state-warning)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--state-warning)]",
                    performance.allowContinuousAnimation && "animate-pulse",
                  )}
                >
                  <Timer className="mr-1 h-3 w-3" />
                  {urgentCount} URGENT
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-8">
            <div
              className={cn(
                "group relative w-full max-w-4xl rounded-[32px] p-[1px] transition-all duration-700",
                canAnimateHover && isHoveringApprove
                  ? "shadow-[0_0_40px_-15px_var(--engine-execute)]/40"
                  : "",
              )}
              style={accentStyle}
            >
              <div className="pointer-events-none absolute inset-0 z-0 rounded-[32px] border border-white/5 transition-colors group-hover:border-white/10" />

              {performance.allowContinuousAnimation && (
                <div
                  className={cn(
                    "pointer-events-none absolute -inset-[1px] -z-10 overflow-hidden rounded-[33px] opacity-0 transition-opacity duration-500",
                    canAnimateHover && isHoveringApprove && "opacity-40",
                  )}
                >
                  <div className="poseidon-orbit-ring absolute inset-[-50%] h-[200%] w-[200%]" />
                </div>
              )}

              <div
                className={cn(
                  "relative z-10 h-full min-w-0 rounded-[31px] border border-white/5 p-6 transition-all duration-500 group-hover:border-white/10 sm:p-10",
                  performance.allowHeavyBlur
                    ? "bg-black/60 backdrop-blur-3xl"
                    : performance.allowBackdrop
                      ? "bg-black/72 backdrop-blur-lg"
                      : "bg-[#0b0d12]/92",
                )}
              >
                <div className="flex min-w-0 flex-col justify-between gap-8 md:flex-row md:items-start">
                  <div className="flex min-w-0 flex-1 flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-white/50">
                        {featuredAction.id}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                        <Activity className="h-3.5 w-3.5" />
                        CONF: {Math.round(featuredAction.confidence * 100)}%
                      </span>
                      {featuredAction.rollbackHours != null && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                          <Lock className="h-3.5 w-3.5" />
                          {featuredAction.rollbackHours}H REVERSIBLE
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-3 text-lg font-semibold leading-snug tracking-tight text-white">
                        {featuredAction.title}
                      </h3>
                      <p className="mt-4 truncate font-mono text-[clamp(1.5rem,2.5vw,2.5rem)] leading-none tracking-tighter text-[var(--engine-execute)]">
                        {featuredAction.amountLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-[200px] items-center justify-center gap-5 border-t border-white/10 pt-6 md:flex-col md:items-end md:justify-center md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    {onReviewApproval && (
                      <button
                        type="button"
                        onClick={onReviewApproval}
                        onMouseEnter={() => canAnimateHover && setIsHoveringApprove(true)}
                        onMouseLeave={() => canAnimateHover && setIsHoveringApprove(false)}
                        className={cn(
                          "relative flex min-h-[56px] w-full items-center justify-center rounded-2xl px-6 font-semibold tracking-wide transition-all duration-500",
                          canAnimateHover && isHoveringApprove
                            ? "-translate-y-1 bg-[var(--engine-execute)] text-black shadow-[0_10px_40px_-10px_rgba(245,158,11,0.25)]"
                            : "bg-white text-black hover:bg-white/90",
                        )}
                      >
                        Review & Approve
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    )}
                    {featuredAction.expiresIn && (
                      <div className="hidden items-center justify-center font-mono text-xs text-white/40 md:flex">
                        Exp: {featuredAction.expiresIn}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex min-w-0 flex-col rounded-2xl border border-white/5 bg-white/[0.01] p-5">
              <span className="mb-4 font-mono text-[10px] uppercase tracking-wider text-white/30">
                [PENDING LIMIT: SHOW MAX 3 ITEMS]
              </span>
              <div className="flex min-w-0 flex-col gap-3 font-mono text-xs text-white/60">
                {pendingQueue.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="group/item flex min-w-0 items-start gap-3"
                  >
                    <span className="shrink-0 font-bold text-[var(--engine-execute)] opacity-50 transition-opacity group-hover/item:opacity-100">
                      {">"}
                    </span>
                    <span className="block truncate transition-colors group-hover/item:text-white">
                      {item.title}
                    </span>
                  </div>
                ))}
                {pendingQueue.length === 0 && (
                  <div className="italic text-white/30">
                    No additional items pending.
                  </div>
                )}
                {queueTotal > 3 && (
                  <div className="mt-1 pl-4 text-white/40">
                    ... + {queueTotal - 3} more queued
                  </div>
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <StepPipeline
                steps={featuredActionSteps}
                allowPulse={performance.allowContinuousAnimation}
              />

              <div className="flex min-w-0 flex-col rounded-2xl border border-white/5 bg-white/[0.01] p-5">
                <span className="mb-3 font-mono text-[10px] uppercase tracking-wider text-white/30">
                  Cross-engine sources
                </span>
                <div className="flex flex-wrap gap-2">
                  {engineSources.map((source) => (
                    <span
                      key={source.engine}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-md border border-white/5 px-2.5 py-1 text-xs text-white/60",
                        performance.allowBackdrop
                          ? "bg-black/40 backdrop-blur-sm"
                          : "bg-black/55",
                      )}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="font-medium">{source.engine}</span>
                      <span className="ml-1 font-mono text-white/30">
                        {source.count}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="-mx-5 -mb-5 mt-6 sm:-mx-8 sm:-mb-8">
            <HeroUnifiedFooter
              to="/execute/queue"
              label={`VIEW ALL ${queueTotal} PENDING ACTIONS`}
              engineColor="var(--engine-execute)"
              performanceProfile={performance.profile}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export const ExecuteApprovalCommandDeck = ExecuteHero;
