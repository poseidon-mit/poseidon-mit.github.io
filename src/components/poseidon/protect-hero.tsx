import { ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "@/router";
import { buttonVariants } from "@/components/ui/button";
import { ListPortalBar } from "./list-portal-bar";
import { RadarSweep } from "./effects/RadarSweep";
import { cn } from "@/lib/utils";

type HeroSeverity = "Critical" | "High" | "Medium" | "Low";

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
  evidenceCues: string[];
  auditChain: { alertId: string; actionId: string; decisionId: string } | null;
  remainingCount: number;
  totalExposure: number;
  fpRate: string;
  onReviewThreat: () => void;
}

export function ProtectAnomalyRadar({
  alert,
  radarAxes,
  evidenceCues,
  auditChain,
  remainingCount,
  totalExposure,
  fpRate,
  onReviewThreat,
}: ProtectAnomalyRadarProps) {
  const badgeTone =
    alert.severity === "Critical" ? "border-[var(--state-warning)] text-[var(--state-warning)]" : "border-[var(--engine-protect)] text-[var(--engine-protect)]";
  const riskLines = radarAxes.slice(0, 3);

  return (
    <div className="flex flex-col gap-3">
      <section
        role="region"
        aria-labelledby="protect-hero-title"
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111d]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />
        <div className="relative z-10 grid min-h-[65vh] gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1fr_320px] lg:items-center">
          <div className="flex flex-col items-center justify-center text-center">
            <ShieldAlert className="mb-6 h-10 w-10 text-[var(--engine-execute)]" />
            <h2
              id="protect-hero-title"
              className="text-[clamp(2.6rem,8vw,5.4rem)] font-semibold leading-none tracking-[-0.05em] text-white"
            >
              SYSTEM DEFENSE PATTERN
            </h2>

            <div className={cn("mt-6 inline-flex items-center gap-3 rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.22em]", badgeTone)}>
              <span className="h-2 w-2 rounded-full bg-current" />
              Status: 1 anomaly flagged
            </div>

            <div className="relative mt-10 flex items-center justify-center">
              <RadarSweep size={420} />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border border-[rgba(34,197,94,0.24)] bg-[rgba(4,12,18,0.82)] px-5 py-3 font-mono text-sm text-[var(--engine-protect)] shadow-[0_0_35px_rgba(34,197,94,0.22)]">
                  {alert.counterparty}
                </div>
              </div>
            </div>

            <p className="mt-8 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
              2,450 transactions scanned in the last 30 days. We caught an unusual pattern requiring your immediate review.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-white/45">
              <span className="rounded-full border border-white/10 px-3 py-1 font-mono">{alert.id}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 font-mono">{alert.amount}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 font-mono">{Math.round(alert.confidence * 100)}% confidence</span>
              <span className="rounded-full border border-white/10 px-3 py-1 font-mono">{alert.time}</span>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onReviewThreat}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "min-h-[48px] rounded-full bg-[var(--engine-protect)] px-7 text-slate-950 hover:bg-[var(--engine-protect)]/90",
                )}
              >
                Review threat
              </button>
              <Link
                to={auditChain ? `/govern/audit-detail?decision=${auditChain.decisionId}` : "/govern/audit"}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-[48px] rounded-full border-white/15 bg-white/[0.03] px-7 text-white/80 hover:bg-white/[0.08]",
                )}
              >
                View audit trail
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Signal breakdown</p>
            <div className="mt-5 space-y-3">
              {riskLines.map((item) => (
                <div key={item.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-white/50">
                    <span>{item.label}</span>
                    <span className="font-mono">{Math.round(item.value * 100)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (item.value / Math.max(item.maxValue, 0.01)) * 100)}%`,
                        backgroundColor: item.color ?? "var(--engine-protect)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {evidenceCues.length > 0 && (
              <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Why Poseidon cares</p>
                {evidenceCues.slice(0, 3).map((cue) => (
                  <p key={cue} className="text-sm leading-6 text-white/58">
                    {cue}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-6 text-xs text-white/45">
              <span className="rounded-full border border-white/10 px-3 py-1">False positives {fpRate}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Exposure ${totalExposure.toLocaleString()}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">{remainingCount} more below</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4 md:px-10">
          <ListPortalBar
            engine="protect"
            label="Threat details"
            count={remainingCount + 1}
            destination={{ type: "route", to: "/protect/threats" }}
          />
        </div>
      </section>

      <p className="text-center text-xs font-mono uppercase tracking-[0.22em] text-white/28">
        {remainingCount} more threat{remainingCount === 1 ? "" : "s"} below · ${totalExposure.toLocaleString()} total exposure
      </p>
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
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111d] px-6 py-8 md:px-10 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_40%)]" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <h2
            className="font-light tracking-tight text-[clamp(2.2rem,6vw,4rem)] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {activeCount === 0 ? "All clear" : `No critical threats. ${activeCount} alerts still monitored.`}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/55">
            Protect stays read-only and keeps surfacing the anomalies that deserve human review.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm text-white/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Active</p>
              <p className="mt-3 text-2xl font-semibold text-white">{activeCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm text-white/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Resolved</p>
              <p className="mt-3 text-2xl font-semibold text-white">{resolvedCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm text-white/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">High / Medium / Low</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {highCount} / {mediumCount} / {lowCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm text-white/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">False positives</p>
              <p className="mt-3 text-lg font-semibold text-white">{fpRate}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Monitoring posture</p>
          <p className="mt-4 text-sm leading-7 text-white/58">
            Model refresh: {modelUpdate}. Protect prioritizes pattern shifts, keeps the system read-only, and only escalates when evidence crosses the critical threshold.
          </p>
          {topAlert && onOpenTopAlert && (
            <button
              type="button"
              onClick={onOpenTopAlert}
              className="mt-6 inline-flex h-auto min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950"
            >
              Review top alert
            </button>
          )}
          <div className="mt-6 border-t border-white/10 pt-6">
            <ListPortalBar
              engine="protect"
              label="View all threats"
              count={activeCount}
              destination={{ type: "route", to: "/protect/threats" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
