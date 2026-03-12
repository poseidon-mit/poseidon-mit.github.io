import { useState } from "react";
import { CheckCircle2, Eye, LockKeyhole, Shield } from "lucide-react";
import { MatrixRain } from "./effects/MatrixRain";
import { ListPortalBar } from "./list-portal-bar";
import { cn } from "@/lib/utils";
import type { DecisionStatus } from "@/domain/poseidon-universe";

export interface GovernHeroProps {
  decisionsAudited: number;
  engineBreakdown: { engine: string; count: number; percent: number; color: string }[];
  auditEntries: {
    id: string;
    engine: string;
    engineColor: string;
    action: string;
    confidence: number;
    time: string;
    status: DecisionStatus;
    modelVersion: string;
    topFactor: string;
  }[];
  errorCount?: number;
  statusBreakdown?: { verified: number; pending: number; flagged: number };
  trustGuarantees?: {
    autoExecutionsWithoutConsent: number;
    auditCoveragePercent: number;
    llmTrainingOptOut: boolean;
  };
  spotlightEntry?: { id: string; action: string; status: DecisionStatus; confidence: number } | null;
}

export type GovernImmutableLedgerProps = GovernHeroProps;

const STATUS_CLASS: Record<DecisionStatus, string> = {
  Verified: "bg-[rgba(34,197,94,0.14)] text-[var(--engine-protect)]",
  "Pending review": "bg-[rgba(234,179,8,0.14)] text-[var(--engine-execute)]",
  Flagged: "bg-[rgba(59,130,246,0.16)] text-[var(--engine-govern)]",
};

export function GovernHero({
  decisionsAudited,
  engineBreakdown,
  auditEntries,
  errorCount = 0,
  statusBreakdown,
  trustGuarantees,
  spotlightEntry,
}: GovernHeroProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section
      role="region"
      aria-labelledby="govern-hero-title"
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#071121]"
    >
      <MatrixRain columnCount={34} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%),radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_44%)]" />
      <div className="relative z-10 flex min-h-[65vh] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Shield className="mb-6 h-10 w-10 text-[var(--engine-govern)]" />
          <h2
            id="govern-hero-title"
            className="text-[clamp(2.8rem,8vw,5.4rem)] font-semibold leading-none tracking-[-0.05em] text-white"
          >
            THE IMMUTABLE AUDIT TRAIL
          </h2>

          <div className="mt-8 space-y-2 font-mono text-xs text-white/28">
            {auditEntries.slice(0, 3).map((entry) => (
              <p key={entry.id}>
                {entry.id} ... [{entry.engine.toUpperCase()}] =&gt; VERIFIED
              </p>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
            100% Traceability. {decisionsAudited.toLocaleString()} AI inferences logged in the last 24h.
            Every decision Poseidon makes is mathematically verifiable.
          </p>

          <div className="mt-8 grid w-full max-w-5xl gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 text-left">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Governance integrity</p>
                  <p className="mt-3 text-5xl font-semibold leading-none text-white">{errorCount}</p>
                </div>
                {statusBreakdown && (
                  <div className="text-right text-xs text-white/45">
                    <p>{statusBreakdown.verified} verified</p>
                    <p>{statusBreakdown.pending} pending</p>
                    <p>{statusBreakdown.flagged} flagged</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">What Poseidon checked</p>
                <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  {engineBreakdown.map((item) => (
                    <div key={item.engine} style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/45">
                  {engineBreakdown.map((item) => (
                    <span key={item.engine} className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.engine} {item.percent}%
                    </span>
                  ))}
                </div>
              </div>

              {trustGuarantees && (
                <div className="mt-6 space-y-2 border-t border-white/10 pt-6 text-sm text-white/58">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Your safety guarantees</p>
                  <p className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--engine-protect)]" />
                    {trustGuarantees.autoExecutionsWithoutConsent} actions taken without your approval
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[var(--engine-govern)]" />
                    {trustGuarantees.auditCoveragePercent}% of decisions have a paper trail
                  </p>
                  {trustGuarantees.llmTrainingOptOut && (
                    <p className="inline-flex items-center gap-2">
                      <LockKeyhole className="h-4 w-4 text-[var(--engine-govern)]" />
                      Your data is never used to train AI
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 text-left">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Activity log</p>

              {spotlightEntry && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn("rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]", STATUS_CLASS[spotlightEntry.status])}>
                      {spotlightEntry.status}
                    </span>
                    <span className="font-mono text-xs text-white/35">{spotlightEntry.id}</span>
                  </div>
                  <p className="mt-3 text-sm text-white">{spotlightEntry.action}</p>
                  <p className="mt-2 text-xs text-white/45">{Math.round(spotlightEntry.confidence * 100)}% confidence</p>
                </div>
              )}

              <div className="mt-4 space-y-3">
                {auditEntries.slice(0, 4).map((entry) => {
                  const expanded = expandedId === entry.id;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : entry.id)}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition-colors hover:bg-white/[0.05]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-white">{entry.action}</p>
                          <p className="mt-2 font-mono text-xs text-white/35">{entry.time} · {entry.id}</p>
                        </div>
                        <span className={cn("rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]", STATUS_CLASS[entry.status])}>
                          {entry.status}
                        </span>
                      </div>
                      {expanded && (
                        <div className="mt-4 border-t border-white/10 pt-4 text-xs leading-6 text-white/48">
                          <p>Model: {entry.modelVersion}</p>
                          <p>Top factor: {entry.topFactor}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-3">
          <ListPortalBar
            engine="govern"
            label="Activity log"
            count={decisionsAudited}
            destination={{ type: "route", to: "/govern/audit" }}
          />
          <ListPortalBar
            engine="govern"
            label="Council settings"
            count={engineBreakdown.length}
            destination={{ type: "route", to: "/settings/ai" }}
          />
          <ListPortalBar
            engine="govern"
            label="Safety controls"
            count={trustGuarantees?.auditCoveragePercent ?? 100}
            destination={{ type: "route", to: "/settings/rights" }}
          />
        </div>
      </div>
    </section>
  );
}

export const GovernImmutableLedger = GovernHero;
