import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Link, useRouter } from "@/router";
import { ShapWaterfall } from "@/components/poseidon/shap-waterfall";
import { Badge } from "@/components/ui/badge";
import { getMotionPreset } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { usePageTitle } from "@/hooks/use-page-title";
import { cn } from "@/lib/utils";
import {
  selectRecommendationListItems,
  formatUsd,
} from "@/domain/poseidon-universe";
import { recommendationDetails } from "./recommendation-detail-data";
import type { RecommendationDetail } from "./recommendation-detail-data";
import { useDemoState } from "@/lib/demo-state";
import { useToastContext } from "@/components/providers/ToastProvider";

/* ── Helpers ── */

function recommendationIdToNumeric(value: string): number {
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/GRW-(\d+)/);
  return match ? Number(match[1]) : -1;
}

function getConfidenceLabel(c: number): string {
  if (c >= 0.85) return "High Confidence";
  if (c >= 0.7) return "Medium Confidence";
  return "Low Confidence";
}

function getConfidenceBadgeClass(c: number): string {
  if (c >= 0.85)
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold tracking-widest";
  if (c >= 0.7)
    return "border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold tracking-widest";
  return "border-red-500/30 bg-red-500/10 text-red-400 font-bold tracking-widest";
}

function getRiskLabel(c: number): string {
  if (c >= 0.85) return "Low Risk";
  if (c >= 0.7) return "Moderate Risk";
  return "Higher Risk";
}

/* ── SHAP Factor Builder ── */
const SHAP_FACTOR_TEMPLATES: Record<
  string,
  Array<{ label: string; value: number }>
> = {
  "Cash & Savings": [
    { label: "Idle cash ratio", value: 0.9 },
    { label: "Rate spread", value: 0.7 },
    { label: "FDIC coverage", value: 0.5 },
    { label: "Liquidity buffer", value: -0.15 },
    { label: "Transfer friction", value: -0.1 },
    { label: "Account consolidation", value: 0.25 },
  ],
  Investments: [
    { label: "Idle balance", value: 0.85 },
    { label: "Yield differential", value: 0.72 },
    { label: "Reinvestment ease", value: 0.45 },
    { label: "Market volatility", value: -0.2 },
    { label: "Tax impact", value: -0.12 },
    { label: "Compound growth", value: 0.3 },
  ],
  Subscriptions: [
    { label: "Duplicate services", value: 0.88 },
    { label: "Bundle discount", value: 0.65 },
    { label: "Usage overlap", value: 0.55 },
    { label: "Feature loss risk", value: -0.18 },
    { label: "Migration effort", value: -0.08 },
    { label: "Annual cost delta", value: 0.4 },
  ],
  "Rewards & Points": [
    { label: "Reward rate gap", value: 0.82 },
    { label: "Spend category match", value: 0.68 },
    { label: "No new fees", value: 0.42 },
    { label: "Habit change needed", value: -0.15 },
    { label: "Point devaluation", value: -0.1 },
    { label: "Annual value uplift", value: 0.35 },
  ],
  Retirement: [
    { label: "Employer match gap", value: 0.92 },
    { label: "Tax bracket benefit", value: 0.7 },
    { label: "Cash flow capacity", value: 0.55 },
    { label: "Liquidity reduction", value: -0.22 },
    { label: "Early withdrawal risk", value: -0.1 },
    { label: "Compound growth", value: 0.38 },
  ],
  "Bills & Fees": [
    { label: "Rate increase detected", value: 0.86 },
    { label: "Competitive alternative", value: 0.62 },
    { label: "Retention offer odds", value: 0.48 },
    { label: "Switching cost", value: -0.18 },
    { label: "Service disruption", value: -0.12 },
    { label: "Annual savings", value: 0.35 },
  ],
  Education: [
    { label: "Tax-free growth", value: 0.88 },
    { label: "Dependent eligibility", value: 0.72 },
    { label: "State deduction", value: 0.5 },
    { label: "Lock-in period", value: -0.15 },
    { label: "Opportunity cost", value: -0.1 },
    { label: "Compounding horizon", value: 0.4 },
  ],
  Insurance: [
    { label: "Premium vs market", value: 0.84 },
    { label: "Clean driving record", value: 0.68 },
    { label: "Coverage equivalence", value: 0.45 },
    { label: "Switching friction", value: -0.15 },
    { label: "Loyalty discount loss", value: -0.08 },
    { label: "Multi-policy savings", value: 0.3 },
  ],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildShapFactors(rec: {
  id: number;
  category: string;
}): Array<{ label: string; value: number }> {
  const template =
    SHAP_FACTOR_TEMPLATES[rec.category] ??
    SHAP_FACTOR_TEMPLATES["Cash & Savings"]!;
  const rng = seededRandom(rec.id * 1000 + 7);
  return template.map((f) => ({
    label: f.label,
    value: f.value * (0.85 + rng() * 0.3),
  }));
}

/* ── Before → After Panel Redesign ── */

function BeforeAfterPanel({ rec }: { rec: RecommendationDetail }) {
  const c = rec.comparison;

  const currentBoxStyle =
    "flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl relative overflow-hidden group";
  const targetBoxStyle =
    "flex-1 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6 shadow-[0_0_30px_rgba(139,92,246,0.1)] backdrop-blur-xl relative overflow-hidden group";
  const glowOverlay = (
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  );

  if (c?.kind === "yield") {
    return (
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Before */}
        <div className={currentBoxStyle}>
          {glowOverlay}
          <div className="absolute -left-20 -top-20 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
            Current State
          </p>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-white/20" />
            <p className="text-sm font-medium text-white/60">Chase Savings</p>
          </div>
          <p className="mt-4 font-mono tabular-nums text-3xl font-light text-white/40">
            {c.currentApy}% <span className="text-sm">APY</span>
          </p>
          <p className="mt-1 text-xs text-white/30">$0.82/yr interest yield</p>
        </div>

        <div className="shrink-0 flex items-center justify-center self-center h-12 w-12 rounded-full border border-white/10 bg-black rotate-90 md:rotate-0 z-10 shadow-2xl">
          <ArrowRight className="h-5 w-5 text-white/50" />
        </div>

        {/* After */}
        <div className={targetBoxStyle}>
          {glowOverlay}
          <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-violet-500/20 blur-3xl rounded-full pointer-events-none" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400 mb-2">
            Projected Yield
          </p>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgb(139,92,246)] animate-pulse" />
            <p className="text-sm font-medium text-violet-300">
              Marcus High-Yield
            </p>
          </div>
          <p className="mt-4 font-mono tabular-nums text-4xl font-light text-violet-400">
            {c.newApy}% <span className="text-xl">APY</span>
          </p>
          <p className="mt-1 text-sm font-bold text-emerald-400 tracking-wide">
            +${c.annualGain?.toLocaleString() ?? 0}/yr captured
          </p>
        </div>
      </div>
    );
  }

  if (c?.kind === "allocation") {
    return (
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className={currentBoxStyle}>
          {glowOverlay}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">
            Current Execution Matrix
          </p>
          <p className="font-mono text-lg text-white/60 leading-relaxed">
            {c.currentMix}
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center self-center h-12 w-12 rounded-full border border-white/10 bg-black rotate-90 md:rotate-0 z-10 shadow-2xl">
          <ArrowRight className="h-5 w-5 text-white/50" />
        </div>
        <div className={targetBoxStyle}>
          {glowOverlay}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400 mb-3">
            Target Matrix
          </p>
          <p className="font-mono text-xl font-light text-violet-300 leading-relaxed">
            {c.newMix}
          </p>
        </div>
      </div>
    );
  }

  if (c?.kind === "coverage") {
    return (
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className={currentBoxStyle}>
          {glowOverlay}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">
            Current Coverage Horizon
          </p>
          <p className="font-mono tabular-nums text-3xl font-light text-white/60">
            {c.currentMonths}{" "}
            <span className="text-base font-sans">months</span>
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center self-center h-12 w-12 rounded-full border border-white/10 bg-black rotate-90 md:rotate-0 z-10 shadow-2xl">
          <ArrowRight className="h-5 w-5 text-white/50" />
        </div>
        <div className={targetBoxStyle}>
          {glowOverlay}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400 mb-3">
            Target Resilience
          </p>
          <p className="font-mono tabular-nums text-4xl font-light text-white">
            {c.targetMonths}{" "}
            <span className="text-lg font-sans text-violet-300">months</span>
          </p>
        </div>
      </div>
    );
  }

  if (c?.kind === "contribution") {
    return (
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className={currentBoxStyle}>
          {glowOverlay}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">
            Current Deployment
          </p>
          <p className="font-mono tabular-nums text-3xl font-light text-white/60">
            {c.currentPct}%
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center self-center h-12 w-12 rounded-full border border-white/10 bg-black rotate-90 md:rotate-0 z-10 shadow-2xl">
          <ArrowRight className="h-5 w-5 text-white/50" />
        </div>
        <div className={targetBoxStyle}>
          {glowOverlay}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400 mb-3 flex items-center justify-between">
            <span>Optimized Velocity</span>
            <span className="text-[10px] text-emerald-400 tracking-wider">
              Match Recovered
            </span>
          </p>
          <div className="flex items-end justify-between">
            <p className="font-mono tabular-nums text-4xl font-light text-white">
              {c.newPct}%
            </p>
            {c.matchCapture != null && (
              <p className="font-mono tabular-nums text-xl font-medium text-emerald-400 mb-1">
                +${c.matchCapture.toLocaleString()}/yr
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default spend comparison
  if (rec.currentTotal === 0 && rec.newTotal === 0) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <div className={currentBoxStyle}>
        {glowOverlay}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">
          Previous Baseline
        </p>
        <p className="font-mono tabular-nums text-3xl font-light text-white/40 line-through">
          ${rec.currentTotal.toFixed(2)}
          <span className="text-base font-sans">/mo</span>
        </p>
      </div>
      <div className="shrink-0 flex items-center justify-center self-center h-12 w-12 rounded-full border border-white/10 bg-black rotate-90 md:rotate-0 z-10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        <ArrowRight className="h-5 w-5 text-white/50" />
      </div>
      <div className={targetBoxStyle}>
        {glowOverlay}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400 mb-3 text-shadow">
          Optimized State
        </p>
        <p className="font-mono tabular-nums text-4xl font-light text-white">
          ${rec.newTotal.toFixed(2)}
          <span className="text-lg font-sans text-violet-300">/mo</span>
        </p>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function GrowRecommendationDetailPage() {
  const { search, navigate } = useRouter();
  usePageTitle("Recommendation Detail");
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion);
  const { state, decideRecommendation } = useDemoState();
  const { showToast } = useToastContext();

  const grwId = useMemo(
    () => new URLSearchParams(search).get("id") ?? "",
    [search],
  );
  const numericId = useMemo(() => recommendationIdToNumeric(grwId), [grwId]);

  const recSummary = useMemo(
    () => selectRecommendationListItems().find((r) => r.id === numericId),
    [numericId],
  );
  const rec = useMemo(
    () => recommendationDetails.find((r) => r.id === numericId),
    [numericId],
  );

  if (!rec || !recSummary) {
    navigate("/grow");
    return null;
  }

  const recommendationKey = `GRW-${String(rec.id).padStart(3, "0")}`;
  const demoDecision = state.recommendations.decisions[recommendationKey];
  const effectiveStatus = demoDecision
    ? demoDecision.decision === "accepted"
      ? "approved"
      : "dismissed"
    : "pending";
  const isDecided =
    effectiveStatus === "approved" || effectiveStatus === "dismissed";

  const handleAccept = () => {
    decideRecommendation(recommendationKey, "accepted");
    showToast({
      message: `Recommendation "${recSummary.title}" accepted`,
      variant: "success",
    });
  };

  const handleDecline = () => {
    decideRecommendation(recommendationKey, "declined");
    showToast({
      message: `Recommendation "${recSummary.title}" declined`,
      variant: "info",
    });
  };

  const confLabel = getConfidenceLabel(rec.confidence);
  const confBadgeClass = getConfidenceBadgeClass(rec.confidence);

  return (
    <main className="hero-viewport detail-canvas flex flex-col min-h-screen text-white selection:bg-violet-500/30 overflow-x-hidden relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] bg-violet-500/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <motion.div
        className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 relative z-10 pb-20"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Navigation */}
        <motion.div variants={fadeUp} className="mb-8">
          <Link
            to="/grow"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white/50" />
            <span className="sr-only">Back to Grow</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
          {/* LEFT: Central Information */}
          <div className="space-y-12">
            {/* Header & Benefit */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-1 bg-white/5 border-white/10 text-white/60",
                    confBadgeClass,
                  )}
                >
                  <Shield className="mr-1.5 h-3.5 w-3.5" /> {confLabel}
                </Badge>
                {effectiveStatus === "approved" && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 border-emerald-500/30 bg-emerald-500/20 text-emerald-400 font-bold tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approved
                  </Badge>
                )}
                {effectiveStatus === "dismissed" && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 border-red-500/30 bg-red-500/10 text-red-400 font-bold tracking-widest"
                  >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> Declined
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                {recSummary.title}
              </h1>

              <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
                {recSummary.description}
              </p>

              {recSummary.annualSavings > 0 && (
                <div className="inline-flex flex-col border border-violet-500/30 bg-violet-500/10 rounded-2xl px-6 py-4 shadow-[0_0_20px_rgba(139,92,246,0.15)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 mb-1 relative z-10">
                    Annual Benefit Projection
                  </span>
                  <span className="font-mono tabular-nums text-4xl font-light text-white relative z-10">
                    +${recSummary.annualSavings.toLocaleString()}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Before After Panel */}
            <motion.div variants={fadeUp}>
              <BeforeAfterPanel rec={rec} />
            </motion.div>

            {/* AI Decision Diagnostics (SHAP) */}
            <motion.div
              variants={fadeUp}
              className="bg-black border border-white/10 rounded-3xl p-8 relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent"
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest text-white/80 mb-6 flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-400" /> Explainability
                Diagnostics
              </h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <ShapWaterfall
                    factors={buildShapFactors(rec)}
                    baseValue={0.2}
                    engine="grow"
                  />
                </div>
                <div className="space-y-6 self-start border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-2">
                      Model Assertion
                    </h3>
                    <div className="border-l-2 border-violet-500/50 pl-4 py-1">
                      <p className="text-white/70 italic text-sm leading-relaxed shrink-0">
                        &ldquo;{rec.cohortProof}&rdquo;
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-2">
                      Algorithm Lineage
                    </h3>
                    <div className="flex flex-col gap-1 text-sm font-mono text-white/60">
                      <span>
                        Model:{" "}
                        <span className="text-white">
                          {rec.modelInfo.name} v{rec.modelInfo.version}
                        </span>
                      </span>
                      <span>
                        Confidence:{" "}
                        <span className="text-emerald-400">
                          {(rec.modelInfo.accuracy * 100).toFixed(1)}%
                        </span>
                      </span>
                      <span>
                        Risk Level:{" "}
                        <span
                          className={cn(
                            rec.confidence >= 0.85
                              ? "text-emerald-400"
                              : "text-amber-400",
                          )}
                        >
                          {getRiskLabel(rec.confidence)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/govern/audit-detail?decision=${encodeURIComponent(recSummary.auditId)}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-violet-400 hover:text-violet-300 transition-colors py-2"
                  >
                    Audit Proof Trail <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Actions Side Panel */}
          <div className="relative border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10">
            <div className="sticky top-10 flex flex-col gap-8">
              {/* Controls */}
              <motion.div
                variants={fadeUp}
                className="bg-black/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
              >
                <h2 className="text-sm font-semibold text-white mb-4">
                  Execute Node
                </h2>

                {!isDecided ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleAccept}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 py-4 rounded-xl text-white font-semibold tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
                    >
                      <CheckCircle2 size={18} />
                      Commit Execution
                    </button>
                    <button
                      onClick={handleDecline}
                      className="w-full flex items-center justify-center py-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white/50 hover:text-white transition-all text-sm font-bold tracking-wide"
                    >
                      Reject Directive
                    </button>
                    <p className="text-[10px] text-white/30 text-center uppercase tracking-widest px-4 mt-4 leading-normal">
                      Authorization commits transaction simulation to live
                      ledger immediately.
                    </p>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "rounded-xl p-5 flex flex-col items-center justify-center border text-center transition-all",
                      effectiveStatus === "approved"
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : "bg-white/5 border-white/10",
                    )}
                  >
                    {effectiveStatus === "approved" ? (
                      <>
                        <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                          <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-emerald-400">
                          Routing Committed
                        </h3>
                        <p className="text-xs text-white/50 mt-1">
                          Pending batch clearance
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-3 text-white/40">
                          <XCircle size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-white/60">
                          Execution Rejected
                        </h3>
                        <p className="text-xs text-white/40 mt-1">
                          Log updated
                        </p>
                      </>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Trajectory */}
              <motion.div
                variants={fadeUp}
                className="bg-black/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl group cursor-default"
              >
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={14} className="text-violet-400" /> Cohort
                  Signal
                </h2>
                <div className="space-y-4">
                  <p className="text-xs text-white/60 leading-relaxed">
                    This vector represents a 98th percentile maneuver deployed
                    by profiles matching your capital velocity pattern in the
                    past 14 days.
                  </p>
                  <div className="rounded-xl px-4 py-3 bg-white/5 border border-white/5 flex justify-between items-center group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 group-hover:text-violet-400 transition-colors">
                      Yield Cohort
                    </span>
                    <span className="text-sm font-bold text-white group-hover:text-violet-300">
                      Top 2%
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
