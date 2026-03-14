import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Timer,
  XCircle,
  Zap,
} from "lucide-react";
import { Link, useRouter } from "@/router";
import { EmptyState, ProofChips } from "@/components/poseidon";
import { SlideToApprove } from "@/components/poseidon/slide-to-approve";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { usePageTitle } from "@/hooks/use-page-title";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { getMotionPreset } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import { getRiskTier } from "@/lib/execute-risk-tier";
import {
  selectDeliberationTrace,
  selectExecuteActionById,
} from "@/domain/poseidon-universe";
import { useExecuteApprovalFlow } from "./useExecuteApprovalFlow";
import { useState } from "react";

const EXECUTION_STEPS = [
  {
    phase: "reviewing",
    label: "Reviewing",
    detail: "Verifying your request...",
  },
  { phase: "signing", label: "Signing", detail: "Securing your approval..." },
  {
    phase: "submitting",
    label: "Submitting",
    detail: "Processing your action...",
  },
  { phase: "confirmed", label: "Confirmed", detail: "Action completed." },
] as const;

// March 19, 2026 anchor
function normalizeGrowRecommendationId(value: string): string {
  const match = value.match(/(?:REC|GRW)-(\d+)/i);
  return match ? `GRW-${match[1].padStart(3, "0")}` : value;
}

function getStepStatus(
  stepPhase: (typeof EXECUTION_STEPS)[number]["phase"],
  currentPhase: string,
): "pending" | "active" | "completed" {
  const order = ["reviewing", "signing", "submitting", "confirmed"];
  const stepIndex = order.indexOf(stepPhase);
  const currentIndex = order.indexOf(currentPhase);
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "active";
  return "pending";
}

/* ── Decision Drivers — Execute-specific contributing factor bars ── */
function DecisionDrivers({
  factors,
  confidence,
}: {
  factors: { label: string; value: number }[];
  confidence: number;
}) {
  const sorted = useMemo(() => {
    const pos = factors.filter((f) => f.value >= 0).sort((a, b) => b.value - a.value);
    const neg = factors.filter((f) => f.value < 0).sort((a, b) => a.value - b.value);
    return [...pos, ...neg];
  }, [factors]);

  const maxAbs = Math.max(...sorted.map((f) => Math.abs(f.value)), 0.01);

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((factor, i) => {
        const isPositive = factor.value >= 0;
        const widthPct = (Math.abs(factor.value) / maxAbs) * 100;
        return (
          <div key={`${factor.label}-${i}`} className="group flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/60 font-medium truncate pr-2">
                {factor.label}
              </span>
              <span
                className={cn(
                  "font-mono text-[11px] font-semibold tabular-nums shrink-0",
                  isPositive ? "text-rose-400" : "text-blue-400",
                )}
              >
                {isPositive ? "+" : "\u2212"}
                {Math.abs(factor.value * 100).toFixed(0)}%
              </span>
            </div>
            <div className="relative h-[6px] w-full rounded-full bg-white/5">
              <div
                className={cn(
                  "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
                  isPositive
                    ? "bg-rose-500/70"
                    : "bg-blue-500/70",
                )}
                style={{ width: `${Math.max(2, widthPct)}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Final Score */}
      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">
          Confidence
        </span>
        <span className="font-mono text-sm font-bold tabular-nums text-[var(--engine-execute)]">
          {Math.round(confidence * 100)}%
        </span>
      </div>
    </div>
  );
}

export function ExecuteApproval() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion);
  const { search, navigate } = useRouter();
  const [isHoveringPrism, setIsHoveringPrism] = useState(false);

  const actionId = useMemo(
    () =>
      new URLSearchParams(search).get("actionId") ??
      new URLSearchParams(search).get("id"),
    [search],
  );
  const action = useMemo(
    () => (actionId ? selectExecuteActionById(actionId) : undefined),
    [actionId],
  );
  const deliberationTrace = useMemo(
    () =>
      action?.sourceEntityId
        ? selectDeliberationTrace(action.sourceEntityId)
        : null,
    [action?.sourceEntityId],
  );

  usePageTitle(action ? `Approve: ${action.title}` : "Action Approval");

  const {
    consentReviewed,
    setConsentReviewed,
    setSlideAuthorized,
    confirmAction,
    setConfirmAction,
    handleConfirm,
    executionPhase,
  } = useExecuteApprovalFlow(action, (decision) => {
    if (decision === "approved") {
      navigate(`/execute?undo=${action?.id ?? ""}`);
      return;
    }
    navigate("/execute");
  });

  if (!action) {
    return (
      <main
        id="main-content"
        role="main"
        className="hero-viewport hero-canvas mx-auto flex flex-col items-center justify-center gap-8 pt-24 pb-12 px-5 text-white"
      >
        <EmptyState
          icon={AlertTriangle}
          title="Action not found"
          description={
            actionId
              ? `No action with ID "${actionId}" exists in the queue.`
              : "No action ID was provided in the URL."
          }
          accentColor="var(--engine-execute)"
          action={{
            label: "Back to Execute queue",
            onClick: () => navigate("/execute"),
          }}
        />
      </main>
    );
  }

  const isTier2 = getRiskTier(action) === 2;
  const sourceLink =
    action.sourceEngine === "Protect" && action.sourceEntityId
      ? {
          label: `From Protect alert ${action.sourceEntityId}`,
          to: `/protect/alert-detail?alertId=${action.sourceEntityId}`,
        }
      : action.sourceEngine === "Grow" && action.sourceEntityId
        ? {
            label: `From Grow recommendation ${normalizeGrowRecommendationId(action.sourceEntityId)}`,
            to: `/grow/recommendation?id=${normalizeGrowRecommendationId(action.sourceEntityId)}`,
          }
        : null;

  return (
    <motion.main
      id="main-content"
      role="main"
      className="hero-viewport hero-canvas flex flex-col gap-6 pb-20 pt-6 px-4 sm:px-6 lg:px-8 text-white min-h-screen"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={fadeUp}
        className="relative z-10 w-full max-w-4xl mx-auto"
      >
        <Link
          to="/execute"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to queue
        </Link>
      </motion.div>

      {/* Main Focus Card */}
      <motion.div
        variants={fadeUp}
        className="relative z-10 w-full max-w-4xl mx-auto"
      >
        <div
          className={cn(
            "group relative w-full rounded-[32px] p-[1px] transition-all duration-700",
            isHoveringPrism && !prefersReducedMotion
              ? "shadow-[0_0_40px_-15px_var(--engine-execute)]/40"
              : "",
          )}
          onMouseEnter={() => setIsHoveringPrism(true)}
          onMouseLeave={() => setIsHoveringPrism(false)}
        >
          {/* Static Border Fallback */}
          <div className="absolute inset-0 rounded-[32px] border border-white/5 group-hover:border-white/10 transition-colors z-[1] pointer-events-none" />

          {/* Quantum Routing Border Animation */}
          {!prefersReducedMotion && (
            <div
              className={cn(
                "absolute -inset-[1px] rounded-[33px] opacity-0 transition-opacity duration-500 overflow-hidden pointer-events-none z-0",
                isHoveringPrism && "opacity-40",
              )}
            >
              <div
                className="absolute inset-[-50%] w-[200%] h-[200%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 70%, var(--engine-execute) 100%)",
                  animation: "spin 2s linear infinite",
                  transformOrigin: "50% 50%",
                }}
              />
            </div>
          )}

          <div className="relative overflow-hidden rounded-[31px] bg-black/60 shadow-2xl p-6 sm:p-10 z-10 border border-white/5 group-hover:border-white/10 min-w-0 transition-all duration-500 backdrop-blur-3xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between gap-6 flex-wrap sm:flex-nowrap">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-[var(--engine-execute)]/30 bg-[var(--engine-execute)]/10 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-[var(--engine-execute)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                      Approval Required
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug">
                      {action.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-sm border border-[var(--engine-execute)]/30 bg-[var(--engine-execute)]/10 px-2 py-0.5 text-xs font-medium text-[var(--engine-execute)]">
                        {action.engine}
                      </span>
                      <span className="inline-flex items-center rounded-sm border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-white/70">
                        {action.executionType}
                      </span>
                      {action.expiresIn && (
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--engine-execute)]">
                          <Timer size={12} />
                          Expires in {action.expiresIn}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-white/40 ml-2">
                        <ShieldCheck size={12} />
                        Auditable
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 w-full sm:w-auto">
                  <span className="text-[clamp(2rem,5vw,3.5rem)] font-mono tabular-nums text-[var(--engine-execute)] tracking-tighter leading-none">
                    {action.amountLabel}
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-white/60 max-w-2xl">
                {action.description}
              </p>

              {sourceLink && (
                <div>
                  <Link
                    to={sourceLink.to}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--engine-execute)] transition-colors hover:text-[var(--engine-execute)]/80"
                  >
                    <ExternalLink size={12} />
                    {sourceLink.label}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Impact Section */}
      <motion.div
        variants={fadeUp}
        className="relative z-10 w-full max-w-4xl mx-auto grid gap-4 sm:grid-cols-2"
      >
        <div className="rounded-2xl border border-[var(--engine-grow)]/20 bg-[#060A14] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--engine-grow)]">
            <CheckCircle2 size={12} /> If approved
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            {action.impact.approved}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--engine-execute)]/20 bg-[#1A1406] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--engine-execute)]">
            <Timer size={12} /> If deferred
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            {action.impact.deferred}
          </p>
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-4xl mx-auto grid gap-6 lg:grid-cols-3">
        {/* Execution Plan */}
        <motion.div variants={fadeUp} className="lg:col-span-1 flex flex-col">
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-md">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white tracking-wide mb-5">
              <Zap className="h-4 w-4 text-[var(--engine-execute)]" />
              Execution Plan
            </h2>
            <div className="space-y-4">
              {action.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[10px] font-mono text-white/60">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <span className="text-sm text-white/80 leading-snug">
                      {step.label}
                    </span>
                    {step.requiresConsent && (
                      <ShieldCheck
                        size={12}
                        className="ml-1.5 inline text-[var(--engine-execute)]"
                      />
                    )}
                    {step.estimatedDuration && (
                      <p className="mt-1 text-xs font-mono text-white/30">
                        {step.estimatedDuration}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Intelligence / Why */}
        <motion.div variants={fadeUp} className="lg:col-span-2 flex flex-col">
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-md">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-5">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Intelligence Brief
              </h2>
              <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                <span className="text-xs text-white/50 font-mono uppercase tracking-wider">
                  Confidence
                </span>
                <span className="text-sm font-bold font-mono tabular-nums text-[var(--engine-execute)]">
                  {Math.round(action.confidence * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {deliberationTrace?.consensus && (
                <div className="rounded-xl border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/5 p-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--engine-govern)] mb-2">
                    Council Consensus
                  </p>
                  <p className="text-sm leading-relaxed text-white/80 font-serif italic">
                    "{deliberationTrace.consensus.rationale}"
                  </p>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Decision Drivers
                  </h3>
                  <DecisionDrivers
                    factors={action.factors.map((factor) => ({
                      label: factor.label,
                      value: factor.value,
                    }))}
                    confidence={action.confidence}
                  />
                </div>

                <div className="space-y-3 flex flex-col justify-center">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-white/50 font-mono uppercase">
                      Transaction
                    </span>
                    <span className="text-sm font-medium font-mono tabular-nums text-white">
                      {action.amountLabel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-white/50 font-mono uppercase">
                      Expected Benefit
                    </span>
                    <span className="text-sm font-medium text-[var(--engine-grow)]">
                      {action.impact.approved.match(/\$[\d,]+/)?.[0] ??
                        "Strategic lift"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-white/50 font-mono uppercase">
                      Net Impact
                    </span>
                    <span className="text-sm font-bold text-[var(--engine-grow)]">
                      Positive
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Area */}
      <motion.div
        variants={fadeUp}
        className="relative z-10 w-full max-w-4xl mx-auto mt-4"
      >
        <div className="rounded-[24px] border border-[var(--engine-execute)]/30 bg-[#050A0F] p-6 sm:p-8 shadow-[0_0_40px_-10px_rgba(245,158,11,0.1)]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <label
                className="flex cursor-pointer items-start gap-4 group"
                data-slot="consent_scope"
              >
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={consentReviewed}
                    onChange={(event) =>
                      setConsentReviewed(event.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <div className="h-5 w-5 rounded border-2 border-white/20 bg-white/5 transition-all peer-checked:border-[var(--engine-execute)] peer-checked:bg-[var(--engine-execute)] group-hover:border-white/40 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-500/50" />
                  <CheckCircle2 className="absolute inset-0 h-5 w-5 text-black opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none stroke-[3]" />
                </div>
                <span className="text-sm leading-relaxed text-white/60 transition-colors group-hover:text-white/80">
                  I have reviewed the execution plan and understand the expected
                  outcome of this action.
                </span>
              </label>

              {isTier2 ? (
                <div className="flex flex-col items-center sm:items-end gap-3 min-w-[280px]">
                  <SlideToApprove
                    label="Slide to Approve"
                    completedLabel="Approved"
                    disabled={!consentReviewed}
                    onAuthorize={() => {
                      setSlideAuthorized(true);
                      setConfirmAction({ type: "approve" });
                    }}
                  />
                  <div className="flex items-center gap-4 w-full justify-between sm:justify-end px-2 sm:px-0">
                    <button
                      type="button"
                      className="text-xs font-medium text-white/50 hover:text-white transition-colors uppercase tracking-wider font-mono"
                      onClick={() => setConfirmAction({ type: "defer" })}
                    >
                      Defer Action
                    </button>
                    <button
                      type="button"
                      className="text-xs font-medium text-[var(--state-error)] hover:text-red-400 transition-colors uppercase tracking-wider font-mono"
                      onClick={() => navigate("/execute")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
                  <button
                    disabled={!consentReviewed}
                    className={cn(
                      "relative flex min-h-[56px] w-full sm:w-[220px] items-center justify-center rounded-xl px-6 font-semibold tracking-wide transition-all duration-500",
                      consentReviewed
                        ? "bg-[var(--engine-execute)] text-black hover:bg-[var(--engine-execute)]/90 shadow-[0_0_30px_-5px_var(--engine-execute)]"
                        : "bg-white/5 text-white/30 cursor-not-allowed border border-white/10",
                    )}
                    onClick={() => setConfirmAction({ type: "approve" })}
                  >
                    Approve & Execute
                  </button>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0 px-2 sm:px-0 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      type="button"
                      className="text-xs font-medium text-white/50 hover:text-white transition-colors uppercase tracking-wider font-mono px-3"
                      onClick={() => setConfirmAction({ type: "defer" })}
                    >
                      Defer
                    </button>
                    <button
                      type="button"
                      className="text-xs font-medium text-[var(--state-error)] hover:text-red-400 transition-colors uppercase tracking-wider font-mono px-3"
                      onClick={() => navigate("/execute")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog (Modal) */}
      {confirmAction && (
        <Dialog open onOpenChange={(open) => !open && setConfirmAction(null)}>
          <DialogContent
            className="max-w-md border border-white/10 bg-[#0A0A0A] text-white p-0 overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--engine-execute)] to-transparent opacity-50" />

            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <DialogTitle className="sr-only">
                {confirmAction.type === "approve"
                  ? "Approve action"
                  : "Defer action"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Review the action summary, expected outcome, and execution plan
                before confirming.
              </DialogDescription>

              <div>
                <p
                  className={cn(
                    "mb-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                    confirmAction.type === "approve"
                      ? "text-[var(--engine-execute)]"
                      : "text-white/50",
                  )}
                >
                  {confirmAction.type === "approve" ? (
                    <>
                      <Zap size={14} /> Confirm Execution
                    </>
                  ) : (
                    <>
                      <Timer size={14} /> Confirm Deferral
                    </>
                  )}
                </p>
                <h3 className="text-xl font-semibold text-white tracking-tight leading-snug">
                  {action.title}
                </h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="mb-3 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  Protocol ({action.steps.length} steps)
                </p>
                <div className="space-y-2.5">
                  {action.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 text-xs"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[9px] font-mono text-white/50">
                        {index + 1}
                      </span>
                      <span className="text-white/80">{step.label}</span>
                      {step.requiresConsent && (
                        <ShieldCheck
                          size={12}
                          className="shrink-0 text-[var(--engine-execute)] ml-auto"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "rounded-xl border p-4",
                  confirmAction.type === "approve"
                    ? "border-[var(--engine-grow)]/20 bg-[#060A14]"
                    : "border-[var(--engine-execute)]/20 bg-[#1A1406]",
                )}
              >
                <p
                  className={cn(
                    "mb-2 text-[10px] font-bold uppercase tracking-widest",
                    confirmAction.type === "approve"
                      ? "text-[var(--engine-grow)]"
                      : "text-[var(--engine-execute)]",
                  )}
                >
                  {confirmAction.type === "approve"
                    ? "Expected outcome"
                    : "If deferred"}
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {confirmAction.type === "approve"
                    ? action.impact.approved
                    : action.impact.deferred}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  className={cn(
                    "flex-1 min-h-[48px] rounded-xl font-semibold tracking-wide transition-all duration-300",
                    confirmAction.type === "approve"
                      ? "bg-[var(--engine-execute)] text-black hover:bg-[var(--engine-execute)]/90 shadow-[0_0_20px_-5px_var(--engine-execute)]"
                      : "bg-white text-black hover:bg-white/90",
                  )}
                  onClick={handleConfirm}
                >
                  {confirmAction.type === "approve"
                    ? "Approve & Sign"
                    : "Confirm Deferral"}
                </button>
                <button
                  className="flex-1 min-h-[48px] rounded-xl font-medium text-white hover:bg-white/5 border border-white/10 transition-colors"
                  onClick={() => setConfirmAction(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Execution Processing Overlay */}
      {executionPhase !== "idle" && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <div className="mx-4 w-full max-w-sm rounded-[24px] border border-white/10 bg-[#050A0F] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--engine-execute)] to-transparent animate-pulse" />

            <h2 className="mb-8 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
              <Zap size={14} className="text-[var(--engine-execute)]" />
              Secured Execution Stream
            </h2>

            <div className="flex flex-col gap-6 relative">
              <div className="absolute left-[15px] top-6 bottom-6 w-[1px] bg-white/5 -z-10" />

              {EXECUTION_STEPS.map((step, index) => {
                const status = getStepStatus(step.phase, executionPhase);
                return (
                  <div key={step.phase} className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-[#050A0F] transition-all duration-500 relative z-10",
                        status === "completed" &&
                          "border-[var(--engine-grow)] shadow-[0_0_10px_var(--engine-grow)]",
                        status === "active" &&
                          "border-[var(--engine-execute)] shadow-[0_0_10px_var(--engine-execute)]",
                        status === "pending" && "border-white/10",
                      )}
                    >
                      {status === "completed" ? (
                        <CheckCircle2
                          size={16}
                          className="text-[var(--engine-grow)]"
                        />
                      ) : status === "active" ? (
                        <Loader2
                          size={16}
                          className={cn(
                            "text-[var(--engine-execute)]",
                            !prefersReducedMotion && "animate-spin",
                          )}
                        />
                      ) : (
                        <span className="text-[10px] font-mono text-white/30">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col pt-1.5">
                      <span
                        className={cn(
                          "text-sm font-medium tracking-wide",
                          status === "active"
                            ? "text-white"
                            : status === "completed"
                              ? "text-white/60"
                              : "text-white/30",
                        )}
                      >
                        {step.label}
                      </span>
                      {status === "active" && (
                        <span className="text-xs font-mono text-[var(--engine-execute)] mt-1 animate-pulse">
                          {step.detail}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {executionPhase === "confirmed" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center text-xs font-mono uppercase tracking-widest text-[var(--engine-grow)]"
              >
                Action confirmed. Redirecting...
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </motion.main>
  );
}

export default ExecuteApproval;
