import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, Link } from "@/router";
import { SubPageNav } from "@/components/poseidon";
import { ShapWaterfall } from "@/components/poseidon/shap-waterfall";
import {
  AlertTriangle,
  MapPin,
  CreditCard,
  Globe,
  CheckCircle2,
  XCircle,
  CircleDot,
  Upload,
  Zap,
  Copy,
  Check,
  ShieldCheck,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import { formatConfidence, formatDemoTimestamp } from "@/lib/demo-date";
import { getMotionPreset } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/use-page-title";
import { useToastContext } from "@/components/providers/ToastProvider";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import {
  selectThreatFactors,
  selectThreatTiming,
} from "@/domain/poseidon-universe";
import { THREATS, deriveFactors } from "./protect-data";
import type { ThreatSeverity } from "./protect-data";
import { useDismissedAlerts } from "./useDismissedAlerts";

/* ── Severity config for dark theme ── */

const severityBadgeConfig: Record<
  ThreatSeverity,
  {
    bg: string;
    text: string;
    border: string;
    iconBg: string;
    iconColor: string;
    glow: string;
  }
> = {
  Critical: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/20",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
  },
  High: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/20",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]",
  },
  Medium: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  },
  Low: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    glow: "",
  },
};

/* ═══════════════════════════════════════════════════════
   PROTECT ALERT DETAIL PAGE — Dark Theme / Control Center
   ═══════════════════════════════════════════════════════ */

export default function ProtectAlertDetailPage() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion);
  usePageTitle("Alert Detail");
  const { search, navigate } = useRouter();

  const [disputeState, setDisputeState] = useState<
    "idle" | "drafting" | "submitted" | "neutralized"
  >("idle");
  const [copied, setCopied] = useState(false);
  const { showToast } = useToastContext();
  const [actionTaken, setActionTaken] = useState<
    "blocked" | "confirmed" | null
  >(null);
  const { dismiss } = useDismissedAlerts();

  const alert = useMemo(() => {
    const alertId = new URLSearchParams(search).get("alertId");
    return THREATS.find((t) => t.id === alertId) ?? null;
  }, [search]);

  useEffect(() => {
    if (!alert) navigate("/protect/threats");
  }, [alert, navigate]);

  if (!alert) return null;

  const sevConfig = severityBadgeConfig[alert.severity];

  const factors = useMemo(() => {
    const items = selectThreatFactors(alert.id);
    return deriveFactors(items, alert.confidence);
  }, [alert.id, alert.confidence]);

  const sortedFactors = useMemo(() => {
    const risk = factors
      .filter((f) => !f.mitigating)
      .sort((a, b) => b.value - a.value);
    const safe = factors
      .filter((f) => f.mitigating)
      .sort((a, b) => a.value - b.value);
    return [...risk, ...safe];
  }, [factors]);

  const caseBrief = useMemo(() => {
    const topRisk = sortedFactors.filter((f) => !f.mitigating).slice(0, 3);
    const findings = topRisk.map((f) => {
      const first = f.details.split(". ")[0];
      return first.endsWith(".") ? first : `${first}.`;
    });
    const t = selectThreatTiming(alert.id) || { detected: "" };
    const dateStr = t.detected
      ? new Date(t.detected).toISOString().replace("T", " ").slice(0, 16) +
        " UTC"
      : "N/A";
    const caseId = `POS-DIS-${alert.id.replace("THR-", "")}`;
    const text = [
      `CASE BRIEF — ${alert.id}`,
      "",
      `Transaction    ${alert.amount} · ${alert.counterparty}`,
      `Date           ${dateStr}`,
      ...(alert.account ? [`Account        ${alert.account}`] : []),
      `AI Confidence  ${formatConfidence(alert.confidence)} (${alert.severity})`,
      "",
      "Key Findings",
      ...findings.map((f) => `· ${f}`),
      "",
      `Reference      ${caseId}`,
    ].join("\n");
    return { findings, dateStr, caseId, text };
  }, [alert, sortedFactors]);

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(caseBrief.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const timing = selectThreatTiming(alert.id);
  const detectedAt = timing ? formatDemoTimestamp(timing.detected) : null;

  interface TimelineStep {
    label: string;
    time: string;
    status: "complete" | "active";
  }
  const timelineSteps: TimelineStep[] | null = timing
    ? [
        { label: "Threat detected", time: timing.times[0], status: "complete" },
        {
          label: "Analysis complete",
          time: timing.times[1],
          status: "complete",
        },
        { label: "Alert raised", time: timing.times[2], status: "complete" },
        { label: "User notified", time: timing.times[3], status: "complete" },
        { label: "Resolution pending", time: "Now", status: "active" },
      ]
    : null;

  return (
    <main
      id="main-content"
      role="main"
      className="detail-canvas flex flex-col min-h-screen overflow-x-hidden text-white selection:bg-cyan-500/30"
    >
      <SubPageNav
        engine="protect"
        parentPath="/protect/threats"
        parentLabel="Threats"
        currentLabel={`Alert #${alert.id}`}
      />

      {/* Decorative Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[10%] left-[20%] h-[600px] w-[600px] rounded-full bg-red-500/5 mix-blend-screen blur-[140px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[500px] w-[500px] rounded-full bg-amber-500/5 mix-blend-screen blur-[120px]" />
      </div>

      <motion.section
        className="flex flex-col gap-8 pb-16 pt-6 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* ── HEADER: Alert Overview ── */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-6 border-b border-white/[0.08] pb-8 md:flex-row md:flex-wrap md:items-end md:justify-between"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 relative overflow-hidden",
                  sevConfig.iconBg,
                  sevConfig.glow,
                )}
              >
                <div className="absolute inset-0 bg-white/5" />
                <AlertTriangle
                  className={cn("h-6 w-6 relative z-10", sevConfig.iconColor)}
                />
              </div>
              <div className="min-w-0 flex flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="min-w-0 text-3xl font-light tracking-tight text-white">
                    {alert.counterparty}
                  </h1>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest border",
                      sevConfig.bg,
                      sevConfig.text,
                      sevConfig.border,
                    )}
                  >
                    {alert.severity} Risk
                  </span>
                </div>
                <p className="mt-1 max-w-3xl text-sm text-white/50">
                  {alert.description}
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">
                  Exposure Amount
                </p>
                <p className="font-mono tabular-nums text-2xl text-red-400">
                  {alert.amount}
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">
                  Detected Time
                </p>
                <p className="font-mono tabular-nums text-lg text-white/80">
                  {detectedAt}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {disputeState === "idle" && (
            <div className="mt-4 flex w-full flex-row gap-3 md:ml-auto md:mt-0 md:w-auto md:shrink-0">
              <div
                className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400/50 font-semibold tracking-wide flex items-center justify-center gap-2 cursor-default"
              >
                <CheckCircle2 size={18} />
                This was me
              </div>
              <div
                className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-red-500/50 bg-red-500/20 text-red-400/50 font-semibold tracking-wide flex items-center justify-center gap-2 cursor-default"
              >
                <XCircle size={18} />
                Prepare Resolution
              </div>
            </div>
          )}
        </motion.div>

        {/* ── WORKFLOW STATES ── */}
        <AnimatePresence mode="wait">
          {disputeState === "drafting" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full bg-white/[0.02] border border-amber-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.05)]"
            >
              <div className="p-6 md:p-8">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
                  <Zap size={14} /> Preparing Dispute Brief
                </h3>
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Brief Content */}
                  <div className="flex-1">
                    <div className="font-mono text-xs text-white/70 leading-relaxed bg-[#000000] p-6 rounded-xl border border-white/5 shadow-inner">
                      <div className="grid grid-cols-[120px_1fr] gap-y-3">
                        <span className="text-white/40">Transaction</span>
                        <span>
                          <span className="text-red-400 font-bold tabular-nums">
                            {alert.amount}
                          </span>{" "}
                          · {alert.counterparty}
                        </span>
                        <span className="text-white/40">Date</span>
                        <span>{caseBrief.dateStr}</span>
                        {alert.account && (
                          <>
                            <span className="text-white/40">Account</span>
                            <span>{alert.account}</span>
                          </>
                        )}
                        <span className="text-white/40">AI Confidence</span>
                        <span
                          className={cn(
                            sevConfig.text,
                            "font-bold tabular-nums",
                          )}
                        >
                          {formatConfidence(alert.confidence)}
                        </span>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-[10px] uppercase text-amber-400 font-bold tracking-widest mb-3">
                          Key Findings
                        </p>
                        <ul className="space-y-2">
                          {caseBrief.findings.map((f, i) => (
                            <li key={i} className="flex gap-3 text-white/60">
                              <span className="text-amber-500">·</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-white/40">
                          Reference:{" "}
                          <span className="text-white font-bold">
                            {caseBrief.caseId}
                          </span>
                        </span>
                        <button
                          onClick={handleCopyBrief}
                          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full lg:w-64 flex flex-col gap-4">
                    <div className="rounded-xl border border-dashed border-white/20 hover:border-white/40 cursor-pointer p-6 flex flex-col items-center justify-center bg-white/[0.02] text-center transition-all group">
                      <Upload className="h-6 w-6 text-white/30 group-hover:text-white/60 mb-3 transition-colors" />
                      <span className="text-xs font-semibold text-white/80">
                        Attach Documents
                      </span>
                      <span className="text-[10px] text-white/40 mt-1">
                        Receipts or invoices
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setDisputeState("submitted");
                        setTimeout(() => {
                          setDisputeState("neutralized");
                          // Firing the event to simulate ledger insertion could happen here.
                        }, 2000);
                      }}
                      className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold tracking-wide transition-colors"
                    >
                      FILE DISPUTE
                    </button>
                    <button
                      onClick={() => setDisputeState("idle")}
                      className="w-full py-3 rounded-xl border border-white/10 text-white/50 hover:bg-white/5 hover:text-white transition-colors text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {disputeState === "submitted" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="h-16 w-16 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  Filing Dispute...
                </h3>
                <p className="text-emerald-400/80 text-sm">
                  Transmitting dossier to banking partner.
                </p>
              </div>
            </motion.div>
          )}

          {disputeState === "neutralized" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-8 rounded-2xl bg-[#000000] border border-white/10 relative overflow-hidden flex flex-col items-center text-center shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
              <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-light text-white mb-3 relative z-10">
                Threat Neutralized
              </h2>
              <p className="text-white/50 max-w-md relative z-10">
                Your account is secure. The dispute was successfully filed as
                case{" "}
                <Link
                  to={`/govern/audit-detail?decision=${caseBrief.caseId}`}
                  className="text-emerald-400 font-mono font-bold hover:underline"
                >
                  {caseBrief.caseId}
                </Link>
                . Your bank will process provisional credit within 48h.
              </p>
              <button
                onClick={() => navigate("/protect")}
                className="mt-8 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold tracking-wide transition-colors relative z-10"
              >
                Return to Threat Landscape
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Main Column: SHAP & Evidence */}
          <motion.div variants={fadeUp} className="lg:col-span-2 space-y-8">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-semibold tracking-wider text-white mb-2">
                AI Diagnostic Driver
              </h3>
              <p className="text-xs text-white/40 mb-8">
                Visualization of exactly why this anomaly was flagged.
              </p>
              <ShapWaterfall
                factors={factors.map((f) => ({
                  label: f.title,
                  value: f.value,
                }))}
                baseValue={0}
                finalValue={alert.confidence}
              />
            </div>

            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-semibold tracking-wider text-white mb-6">
                Evidence Log
              </h3>
              <div className="flex flex-col gap-3">
                {sortedFactors.map((item) => {
                  const displayValue =
                    item.value >= 0
                      ? `+${item.value.toFixed(2)}`
                      : item.value.toFixed(2);
                  const isRisk = !item.mitigating;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-xl border border-white/5 bg-black/40 items-start"
                    >
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-widest mt-0.5",
                          isRisk
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                        )}
                      >
                        {displayValue}
                      </span>
                      <div>
                        <p className="text-sm font-semibold tracking-wide text-white/90">
                          {item.title}
                        </p>
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Sidebar: Details & Timeline */}
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-semibold tracking-wider text-white mb-6">
                Execution Context
              </h3>
              <div className="space-y-5">
                {alert.account && (
                  <DetailRow
                    icon={<CreditCard />}
                    label="Account"
                    value={alert.account}
                  />
                )}
                <DetailRow
                  icon={<AlertTriangle />}
                  label="Alert Type"
                  value={alert.description}
                />
                {alert.location && (
                  <DetailRow
                    icon={<MapPin />}
                    label="Location Object"
                    value={alert.location}
                  />
                )}
                {alert.flaggedIp && (
                  <DetailRow
                    icon={<Globe />}
                    label="Network IP"
                    value={alert.flaggedIp}
                  />
                )}
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 shrink-0 border border-white/[0.05]">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                      Model Confidence
                    </p>
                    <span
                      className={cn(
                        "text-xs font-bold font-mono tabular-nums px-2 py-0.5 rounded border tracking-widest",
                        sevConfig.text,
                        sevConfig.border,
                        sevConfig.bg,
                      )}
                    >
                      {formatConfidence(alert.confidence)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {timelineSteps && (
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-sm font-semibold tracking-wider text-white mb-6">
                  Threat Timeline
                </h3>
                <div className="relative border-l border-white/10 ml-5 space-y-8">
                  {timelineSteps.map((step, i) => (
                    <div key={i} className="relative pl-6">
                      <div
                        className={cn(
                          "absolute -left-2.5 top-0.5 w-5 h-5 rounded-full border-4 border-[#030305] flex items-center justify-center",
                          step.status === "complete"
                            ? "bg-emerald-500"
                            : "bg-amber-500 animate-pulse",
                        )}
                      />
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          step.status === "complete"
                            ? "text-white/80"
                            : "text-amber-400",
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-white/40 font-mono mt-1">
                        {step.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 shrink-0 border border-white/[0.05]">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium tracking-wide text-white/90 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
