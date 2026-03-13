import { ArrowRight, ShieldAlert, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/router";
import { buttonVariants } from "@/components/ui/button";
import { ListPortalBar } from "./list-portal-bar";
import { cn } from "@/lib/utils";
import {
  HeroBackdrop,
  HeroEyebrow,
  HeroMetricPill,
  HeroUnifiedFooter,
} from "./hero-concept-primitives";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { getMotionPreset } from "@/lib/motion-presets";

type HeroSeverity = "Critical" | "High" | "Medium" | "Low";

export interface ShapFactor {
  label: string;
  weight: number;
  mitigating: boolean;
}

export interface ProtectAnomalyRadarProps {
  alert: {
    id: string;
    counterparty: string;
    amount: string;
    confidence: number;
    severity: HeroSeverity;
    description: string;
    time: string;
  };
  radarAxes: {
    label: string;
    value: number;
    maxValue: number;
    color?: string;
  }[];
  shapFactors: ShapFactor[];
  auditChain: { alertId: string; actionId: string; decisionId: string } | null;
  remainingCount: number;
  totalExposure: number;
  fpRate: string;
  onReviewThreat: () => void;
}

import { ShapWaterfall } from "@/components/poseidon/shap-waterfall";

const SHAP_BASE = 0.12; // baseline fraud probability

function ProtectLedgerField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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

function BackgroundTransactionTape({
  items,
  reducedMotion,
}: {
  items: string[];
  reducedMotion: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
      <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_80%)]" />
      <div className="absolute inset-y-0 left-0 flex w-full flex-col justify-between px-4 py-8 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 md:px-8">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className={cn(
              "flex justify-between gap-6 whitespace-nowrap opacity-20",
              !reducedMotion && "animate-[pulse_8s_ease-in-out_infinite]",
              index % 2 === 0 ? "translate-x-[5%]" : "-translate-x-[5%]",
            )}
            style={{ animationDelay: `${index * 1.5}s` }}
          >
            <span>{item} verified</span>
            <span>{item} flagged</span>
            <span>{item} verified</span>
            <span>{item} flagged</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProtectAnomalyRadar({
  alert,
  radarAxes, // Kept for interface compatibility but unused in this visual paradigm
  shapFactors,
  auditChain,
  remainingCount,
  totalExposure,
  fpRate,
  onReviewThreat,
}: ProtectAnomalyRadarProps) {
  const reducedMotion = useReducedMotionSafe();
  const { heroFadeUp, heroStaggerContainer } = getMotionPreset(reducedMotion);
  const tapeItems = [
    `NODE-891`,
    `NODE-892`,
    `NODE-893`,
    `NODE-894`,
    `NODE-895`,
    `NODE-896`,
  ];

  return (
    <div className="flex flex-col gap-3">
      <section
        role="region"
        aria-labelledby="protect-hero-title"
        className="hero-canvas relative flex min-h-[580px] w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10"
      >
        <HeroBackdrop
          accent="var(--engine-protect)"
          secondaryAccent="#020202"
          reducedMotion={reducedMotion}
        />
        <BackgroundTransactionTape
          items={tapeItems}
          reducedMotion={reducedMotion}
        />

        <motion.div
          className="relative z-10 flex flex-1 w-full flex-col"
          variants={heroStaggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-12 md:px-10">
            <motion.div variants={heroFadeUp} className="mb-8 w-full flex justify-center">
              <div className="flex flex-col items-center gap-2 text-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02]">
                <HeroEyebrow className="border-[var(--engine-protect)]/20 bg-[var(--engine-protect)]/5 text-[var(--engine-protect)]">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Protect matrix live
                </HeroEyebrow>
                <h2 id="protect-hero-title" className="sr-only">
                  Protect
                </h2>
                <p className="mt-2 text-[11px] font-mono tracking-[0.2em] uppercase text-white/50">
                  Status: 1 anomaly flagged
                </p>
              </div>
            </motion.div>

            <motion.div variants={heroFadeUp} className="w-full">
              <div className="group relative w-full overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-[1px] shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-[var(--engine-protect)]/30 hover:shadow-[0_0_80px_-20px_var(--engine-protect)]">
              {!reducedMotion && (
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-[24px] bg-[conic-gradient(from_0deg,transparent_0_340deg,var(--engine-protect)_360deg)] opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:animate-[spin_3s_linear_infinite] group-hover:opacity-100" />
              )}

              <div className="relative z-10 grid gap-0 rounded-[23px] bg-[#050A0F] lg:grid-cols-2">
                <div className="flex flex-col border-b border-white/10 p-8 lg:border-b-0 lg:border-r md:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-2 w-2 rounded-full bg-[var(--engine-protect)] shadow-[0_0_10px_var(--engine-protect)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                      Target Identification
                    </span>
                  </div>

                  <h3 className="mb-1 min-w-0 text-lg font-semibold leading-snug tracking-tight text-white/90">
                    {alert.counterparty}
                  </h3>
                  <p className="mb-6 font-mono text-[clamp(1.5rem,2.5vw,2.5rem)] leading-none tracking-tighter text-white">
                    {alert.amount}
                  </p>

                  <p className="mb-8 max-w-sm text-sm leading-6 text-white/60">
                    {alert.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-3">
                    <HeroMetricPill
                      label="Confidence"
                      value={`${Math.round(alert.confidence * 100)}%`}
                      tone="var(--engine-protect)"
                    />
                    <HeroMetricPill
                      label="Severity"
                      value={alert.severity}
                      tone={
                        alert.severity === "Critical"
                          ? "var(--state-critical)"
                          : "var(--engine-execute)"
                      }
                    />
                  </div>
                </div>

                <div className="relative flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.05)_0%,transparent_70%)] p-8 md:p-10">
                  {!reducedMotion && (
                    <div className="absolute top-0 right-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--engine-protect)]/30 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  )}

                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                      Diagnostic Trace
                    </span>
                    <span className="font-mono text-xs text-[var(--engine-protect)]">
                      {alert.id}
                    </span>
                  </div>

                  {shapFactors.length > 0 ? (
                    <div className="mt-2 ml-auto flex-1 w-full max-w-md">
                      <p className="sr-only">SHAP Waterfall</p>
                      <ShapWaterfall
                        factors={shapFactors.map((f) => ({
                          label: f.label,
                          value: f.mitigating ? -f.weight : f.weight,
                        }))}
                        baseValue={SHAP_BASE}
                        finalValue={alert.confidence}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10">
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
                        AWAITING_TELEMETRY
                      </p>
                    </div>
                  )}

                  <div className="mt-10 flex justify-end">
                    <button
                      type="button"
                      onClick={onReviewThreat}
                      className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "min-h-[48px] w-full rounded-xl border border-white/10 bg-white/5 text-white shadow-[0_0_0_transparent] transition-all duration-300 hover:border-[var(--engine-protect)] hover:bg-[var(--engine-protect)] hover:text-black hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] sm:w-auto",
                      )}
                    >
                      Review threat
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </motion.div>

            <motion.div variants={heroFadeUp} className="w-full max-w-4xl">
              <div className="mt-8 flex w-full flex-col items-center justify-between gap-6 border-t border-white/5 pt-6 sm:flex-row">
                <div className="flex flex-wrap items-center justify-center gap-8">
                  <ProtectLedgerField
                    label="Total exposure"
                    value={`$${totalExposure.toLocaleString()}`}
                  />
                  <ProtectLedgerField label="False positives" value={fpRate} />
                  <ProtectLedgerField
                    label="Linked review"
                    value={auditChain ? auditChain.actionId : "Govern audit"}
                  />
                </div>

                {auditChain && (
                  <div className="flex w-full max-w-md shrink-0 items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.02] px-4 py-3 lg:w-auto lg:justify-end">
                    <Users className="h-4 w-4 shrink-0 text-[var(--engine-protect)]/60" />
                    <span className="mr-2 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                      Cohort signal
                    </span>
                    <p className="text-xs leading-snug text-white/70">
                      Credential-stuffing attacks up 31% this quarter. Threat
                      correlated across 12,847 profiles in real-time.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div variants={heroFadeUp}>
            <HeroUnifiedFooter
              to="/protect/threats"
              label="VIEW ALL ANOMALIES"
              engineColor="var(--engine-protect)"
              icon={ShieldAlert}
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export interface ProtectThreatPostureProps {
  activeCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  resolvedCount: number;
  fpRate: string;
  modelUpdate: string;
  topAlert: { id: string; counterparty: string; severity: HeroSeverity } | null;
  onOpenTopAlert: (() => void) | null;
}

export function ProtectThreatPosture({
  activeCount,
  highCount,
  mediumCount,
  lowCount,
  resolvedCount,
  fpRate,
  modelUpdate,
  topAlert,
  onOpenTopAlert,
}: ProtectThreatPostureProps) {
  const reducedMotion = useReducedMotionSafe();
  const { heroFadeUp, heroStaggerContainer } = getMotionPreset(reducedMotion);

  return (
    <section className="hero-canvas relative flex min-h-[580px] w-full flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10">
      <HeroBackdrop
        accent="var(--engine-protect)"
        secondaryAccent="#020202"
        reducedMotion={reducedMotion}
      />

      {/* Subtle Breathing Green Glow */}
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-screen opacity-20">
          <div className="h-[40vh] w-[40vw] rounded-full bg-[var(--engine-protect)] blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
        </div>
      )}

      <motion.div
        className="relative z-10 flex flex-1 w-full flex-col"
        variants={heroStaggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 py-12 text-center md:px-10">
          <motion.div
            variants={heroFadeUp}
            className="mb-8 flex flex-col items-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--engine-protect)]/20 bg-[var(--engine-protect)]/10 text-[var(--engine-protect)] shadow-[0_0_30px_rgba(34,197,94,0.1)]" />

            <h2 className="mb-2 max-w-2xl text-[clamp(1.5rem,4vw,3.5rem)] font-light tracking-tight text-white">
              {activeCount === 0
                ? "All clear"
                : `Monitoring matrix stable. ${activeCount} alerts still tracked.`}
            </h2>
          </motion.div>

          <motion.p
            variants={heroFadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/50"
          >
            {activeCount === 0
              ? "No suspicious activity detected. Protect engines are continuously scanning telemetry in the background."
              : "Protect stays read-only, keeps background telemetry flowing, and only escalates when the evidence stack becomes undeniable."}
          </motion.p>

          <motion.div
            variants={heroFadeUp}
            className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-white/10 pt-8"
          >
            <ProtectLedgerField
              label="Total Tracked"
              value={activeCount.toString()}
            />
            <ProtectLedgerField
              label="Resolved"
              value={resolvedCount.toString()}
            />
            <ProtectLedgerField label="False Positives" value={fpRate} />
            <ProtectLedgerField label="Model Update" value={modelUpdate} />
          </motion.div>

          {topAlert && onOpenTopAlert && (
            <motion.div variants={heroFadeUp} className="mt-12">
              <button
                type="button"
                onClick={onOpenTopAlert}
                className="inline-flex h-auto min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--engine-protect)] to-[var(--engine-dashboard)] px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:opacity-90"
              >
                Review top alert: {topAlert.counterparty}
              </button>
            </motion.div>
          )}
        </div>

        <motion.div variants={heroFadeUp}>
          <HeroUnifiedFooter
            to="/protect/threats"
            label="View all threats"
            engineColor="var(--engine-protect)"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
