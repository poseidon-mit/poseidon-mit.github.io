import { ArrowRight, CheckCircle2, ShieldCheck, Timer } from "lucide-react";
import { HourglassLock } from "./effects/HourglassLock";
import { ListPortalBar } from "./list-portal-bar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  ExecuteEngineName,
  ExecutionType,
} from "@/domain/poseidon-universe/types";

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
}

export type ExecuteApprovalCommandDeckProps = ExecuteHeroProps;

function SourcePill({
  engine,
  count,
  color,
}: {
  engine: ExecuteEngineName;
  count: number;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
      style={{ boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 16%, transparent)` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {engine} {count}
    </span>
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
  potentialSavingsUsd,
}: ExecuteHeroProps) {
  if (!featuredAction) {
    return (
      <section
        role="region"
        aria-labelledby="execute-hero-title"
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#110d08]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.18),transparent_42%)]" />
        <div className="relative z-10 flex min-h-[65vh] flex-col items-center justify-center gap-6 px-6 py-10 text-center">
          <CheckCircle2 className="h-14 w-14 text-[var(--engine-protect)]" />
          <h2 id="execute-hero-title" className="text-4xl font-semibold tracking-[-0.04em] text-white">
            Queue Clear
          </h2>
          <p className="max-w-2xl text-base leading-8 text-white/55">
            Poseidon has no actions waiting for consent. The command deck is clear and audit logging remains active.
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

  const realizationPct =
    potentialSavingsUsd && currentSavingsUsd != null && potentialSavingsUsd > 0
      ? Math.round((currentSavingsUsd / potentialSavingsUsd) * 100)
      : null;

  return (
    <section
      role="region"
      aria-labelledby="execute-hero-title"
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#100d08]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.22),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(248,113,113,0.10),transparent_28%)]" />
      <div className="relative z-10 flex min-h-[65vh] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h2
            id="execute-hero-title"
            className="text-[clamp(2.8rem,8vw,5.2rem)] font-semibold leading-none tracking-[-0.05em] text-white"
          >
            AWAITING AUTHORIZATION
          </h2>

          <div className="mt-10">
            <HourglassLock count={queueTotal} />
          </div>

          <div className="mt-8 flex items-end justify-center gap-3">
            <span className="text-5xl font-semibold leading-none text-[var(--engine-execute)]">{queueTotal}</span>
            <span className="pb-1 text-sm uppercase tracking-[0.18em] text-white/45">
              action{queueTotal === 1 ? "" : "s"} queued for review
            </span>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
            Poseidon AI cannot move money without your cryptographic consent. Review the execution plans below and authorize.
          </p>

          <div className="mt-8 grid w-full max-w-4xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
                  {featuredAction.id}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
                  {Math.round(featuredAction.confidence * 100)}% confidence
                </span>
                {featuredAction.rollbackHours != null && (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
                    {featuredAction.rollbackHours}h reversible
                  </span>
                )}
              </div>

              <p className="mt-5 text-2xl font-semibold text-white">{featuredAction.title}</p>
              <p className="mt-3 text-lg font-mono text-[var(--engine-execute)]">{featuredAction.amountLabel}</p>

              {featuredAction.expiresIn && (
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--state-warning)]">
                  <Timer className="h-4 w-4" />
                  Expires in {featuredAction.expiresIn}
                </p>
              )}

              {onReviewApproval && (
                <button
                  type="button"
                  onClick={onReviewApproval}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "mt-6 min-h-[48px] rounded-full bg-[var(--engine-execute)] px-7 text-slate-950 hover:bg-[var(--engine-execute)]/90",
                  )}
                >
                  Review & Approve
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Execution posture</p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
                  <p className="text-sm text-white">Agent prepared</p>
                  <p className="mt-2 font-mono text-xs text-white/45">{agentStepsCompleted}/{agentStepsTotal} steps completed</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
                  <p className="text-sm text-white">Urgent actions</p>
                  <p className="mt-2 font-mono text-xs text-white/45">{urgentCount} currently time-sensitive</p>
                </div>
                {urgencyBreakdown && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
                    <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      {urgencyBreakdown.high > 0 && (
                        <div className="bg-[var(--state-critical)]" style={{ width: `${(urgencyBreakdown.high / Math.max(queueTotal, 1)) * 100}%` }} />
                      )}
                      {urgencyBreakdown.medium > 0 && (
                        <div className="bg-[var(--engine-execute)]" style={{ width: `${(urgencyBreakdown.medium / Math.max(queueTotal, 1)) * 100}%` }} />
                      )}
                      {urgencyBreakdown.low > 0 && (
                        <div className="bg-white/30" style={{ width: `${(urgencyBreakdown.low / Math.max(queueTotal, 1)) * 100}%` }} />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-white/45">High / Medium / Low: {urgencyBreakdown.high} / {urgencyBreakdown.medium} / {urgencyBreakdown.low}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Cross-engine sources</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {engineSources.map((source) => (
                    <SourcePill key={source.engine} {...source} />
                  ))}
                </div>
              </div>

              {(currentSavingsUsd != null || potentialSavingsUsd != null) && (
                <div className="mt-6 border-t border-white/10 pt-6 text-sm text-white/60">
                  <p className="inline-flex items-center gap-2 text-white/75">
                    <ShieldCheck className="h-4 w-4 text-[var(--engine-execute)]" />
                    You're always in control.
                  </p>
                  {realizationPct != null && (
                    <p className="mt-2 text-xs text-white/45">
                      Realized optimization: {realizationPct}% of modeled monthly potential.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-3">
          <ListPortalBar
            engine="execute"
            label="Approval queue"
            count={queueTotal}
            destination={{ type: "route", to: "/execute/queue" }}
          />
          <ListPortalBar
            engine="execute"
            label="Savings history"
            count={Math.max(0, Math.round(currentSavingsUsd ?? 0))}
            destination={{ type: "route", to: "/execute/history" }}
          />
          <ListPortalBar
            engine="govern"
            label="Audit trail"
            count={queueTotal}
            destination={{ type: "route", to: "/govern/audit" }}
          />
        </div>
      </div>
    </section>
  );
}

export const ExecuteApprovalCommandDeck = ExecuteHero;
