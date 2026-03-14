import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "@/router";
import {
  Shield,
  Lock,
  CheckCircle2,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import { MatrixRain } from "./effects/MatrixRain";
import { HeroBackdrop, HeroUnifiedFooter } from "./hero-concept-primitives";
import type { DecisionStatus } from "@/domain/poseidon-universe";

export interface GovernHeroProps {
  decisionsAudited: number;
  engineBreakdown: {
    engine: string;
    count: number;
    percent: number;
    color: string;
  }[];
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
  spotlightEntry?: {
    id: string;
    action: string;
    status: DecisionStatus;
    confidence: number;
  } | null;
}

export type GovernImmutableLedgerProps = GovernHeroProps;

const LEDGER_STATUS_COLOR: Record<DecisionStatus, string> = {
  Verified: "color-mix(in srgb, var(--engine-protect) 72%, white 20%)",
  "Pending review": "color-mix(in srgb, var(--engine-execute) 78%, white 16%)",
  Flagged: "color-mix(in srgb, var(--engine-govern) 88%, white 16%)",
};

interface GovernLedgerLineDescriptor {
  id: string;
  text: string;
  color: string;
}

interface GovernLedgerTimelineLine extends GovernLedgerLineDescriptor {
  delayMs: number;
  charIntervalMs: number;
  charsPerTick: number;
}

function buildGovernLedgerLines({
  decisionsAudited,
  engineBreakdown,
  auditEntries,
  statusBreakdown,
  trustGuarantees,
  spotlightEntry,
}: GovernHeroProps): GovernLedgerLineDescriptor[] {
  const coverageSummary = engineBreakdown
    .filter((entry) => entry.count > 0)
    .map((entry) => `${entry.engine} ${entry.count} (${entry.percent}%)`)
    .join(" · ");

  const latestTrace = auditEntries[0];
  const primaryEscalation =
    auditEntries.find((entry) => entry.status === "Flagged") ??
    auditEntries.find((entry) => entry.status === "Pending review") ??
    spotlightEntry;

  const lines: Array<GovernLedgerLineDescriptor | null> = [
    {
      id: "boot-sequence",
      text: `Govern console online. ${decisionsAudited} auditable decisions in the current selector set.`,
      color: "color-mix(in srgb, var(--engine-govern) 72%, white 18%)",
    },
    statusBreakdown
      ? {
          id: "verification-queue",
          text: `Verification queue stable. ${statusBreakdown.verified} verified / ${statusBreakdown.pending} pending / ${statusBreakdown.flagged} flagged.`,
          color: "color-mix(in srgb, var(--engine-govern) 52%, white 16%)",
        }
      : null,
    coverageSummary
      ? {
          id: "coverage-map",
          text: `Coverage by engine: ${coverageSummary}.`,
          color: "color-mix(in srgb, var(--engine-govern) 46%, white 14%)",
        }
      : null,
    trustGuarantees
      ? {
          id: "consent-guardrail",
          text: `Consent guardrail locked. ${trustGuarantees.autoExecutionsWithoutConsent} actions executed without approval. Paper trail coverage ${trustGuarantees.auditCoveragePercent}%.`,
          color: "color-mix(in srgb, var(--engine-govern) 60%, white 12%)",
        }
      : null,
    trustGuarantees?.llmTrainingOptOut
      ? {
          id: "data-boundary",
          text: "Training boundary enforced. Customer data remains excluded from model training datasets.",
          color: "color-mix(in srgb, var(--engine-govern) 68%, white 14%)",
        }
      : null,
    latestTrace
      ? {
          id: "trace-evidence",
          text: `Latest trace ${latestTrace.id} used ${latestTrace.modelVersion} with ${latestTrace.topFactor.toLowerCase()}.`,
          color: "color-mix(in srgb, var(--engine-govern) 78%, white 14%)",
        }
      : null,
    primaryEscalation
      ? {
          id: `escalation-${primaryEscalation.id}`,
          text: `Escalation focus ${primaryEscalation.id}: ${primaryEscalation.status} at ${Math.round(primaryEscalation.confidence * 100)}% confidence. ${primaryEscalation.action}.`,
          color: LEDGER_STATUS_COLOR[primaryEscalation.status],
        }
      : null,
    ...auditEntries.slice(0, 5).map((entry) => ({
      id: `entry-${entry.id}`,
      text: `[${entry.time}] ${entry.id} ${entry.status} ${entry.engine} | ${entry.action}`,
      color: LEDGER_STATUS_COLOR[entry.status],
    })),
  ];

  return lines.filter(
    (line): line is GovernLedgerLineDescriptor => line !== null,
  );
}

function GovernLedgerLine({
  line,
  performanceProfile,
}: {
  line: GovernLedgerTimelineLine;
  performanceProfile: "full" | "lite" | "static";
}) {
  const totalCharacters = line.text.length;
  const revealProgressively = performanceProfile === "full";
  const [visibleCharacters, setVisibleCharacters] = useState(() =>
    revealProgressively ? 0 : totalCharacters,
  );

  useEffect(() => {
    if (!revealProgressively) {
      setVisibleCharacters(totalCharacters);
      return;
    }

    setVisibleCharacters(0);

    let timeoutId = 0;
    let frameId = 0;
    let startTime: number | null = null;

    timeoutId = window.setTimeout(() => {
      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const ticks = Math.max(1, Math.floor(elapsed / line.charIntervalMs) + 1);
        const next = Math.min(totalCharacters, ticks * line.charsPerTick);
        setVisibleCharacters((current) => (current === next ? current : next));
        if (next < totalCharacters) {
          frameId = window.requestAnimationFrame(step);
        }
      };

      frameId = window.requestAnimationFrame(step);
    }, line.delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [
    line.charIntervalMs,
    line.charsPerTick,
    line.delayMs,
    revealProgressively,
    totalCharacters,
  ]);

  const visibleText = revealProgressively
    ? line.text.slice(0, visibleCharacters)
    : line.text;

  return <p>{visibleText}</p>;
}

function buildGovernLink(id: string): string {
  if (id.startsWith("THR")) return `/protect/alert-detail?alertId=${id}`;
  if (id.startsWith("REC") || id.startsWith("GRW")) {
    return `/grow/recommendation?id=${id}`;
  }
  if (id.startsWith("GV") || id.startsWith("AUD")) {
    return `/govern/audit-detail?decision=${id}`;
  }
  return `/execute/approval?actionId=${id}`;
}

export function GovernHero(props: GovernHeroProps) {
  const {
    decisionsAudited,
    engineBreakdown,
    auditEntries,
    errorCount = 0,
    statusBreakdown,
    trustGuarantees,
    spotlightEntry,
  } = props;
  const performance = usePerformanceProfile();
  const [isHoveringPrism, setIsHoveringPrism] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const orbitStyle = useMemo(
    () =>
      ({
        ["--poseidon-orbit-color" as string]: "var(--engine-govern)",
      }) as CSSProperties,
    [],
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const ledgerLines = useMemo(
    () =>
      buildGovernLedgerLines({
        decisionsAudited,
        engineBreakdown,
        auditEntries,
        errorCount,
        statusBreakdown,
        trustGuarantees,
        spotlightEntry,
      }),
    [
      auditEntries,
      decisionsAudited,
      engineBreakdown,
      errorCount,
      spotlightEntry,
      statusBreakdown,
      trustGuarantees,
    ],
  );

  const ledgerTimeline = useMemo(() => {
    let nextDelayMs = 120;

    return ledgerLines.map((line) => {
      const charsPerTick =
        line.text.length > 120 ? 4 : line.text.length > 72 ? 3 : 2;
      const charIntervalMs = line.text.length > 120 ? 12 : 14;
      const delayMs = nextDelayMs;
      const revealDurationMs =
        Math.ceil(line.text.length / charsPerTick) * charIntervalMs + 90;

      nextDelayMs += revealDurationMs;

      return {
        ...line,
        delayMs,
        charIntervalMs,
        charsPerTick,
      };
    });
  }, [ledgerLines]);

  const matrixActive = performance.allowContinuousAnimation && isVisible;
  const canHoverPrism = performance.allowHoverEnhancements && isVisible;

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-labelledby="govern-hero-title"
      className="hero-canvas relative flex h-full flex-1 flex-col overflow-hidden rounded-[32px] border border-white/10"
    >
      <div
        className="sr-only"
        aria-hidden="true"
        data-testid="govern-ledger-tests"
      >
        {engineBreakdown.map((item) => (
          <p key={item.engine}>
            {item.engine} {item.percent}%
          </p>
        ))}
        {trustGuarantees && (
          <>
            <p>Your safety guarantees</p>
            <p>
              {trustGuarantees.autoExecutionsWithoutConsent} actions taken
              without your approval
            </p>
          </>
        )}
        {ledgerTimeline.map((line) => (
          <GovernLedgerLine
            key={line.id}
            line={line}
            performanceProfile={performance.profile}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-screen">
        <MatrixRain columnCount={48} className="opacity-100" active={matrixActive} />
      </div>
      <div className="pointer-events-none relative z-0">
        <HeroBackdrop
          accent="var(--engine-govern)"
          secondaryAccent="#020202"
          performanceProfile={performance.profile}
        />
      </div>

      <div className="relative z-10 flex h-full flex-1 flex-col p-5 sm:p-8">
        <div className="flex h-full flex-col">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 id="govern-hero-title" className="sr-only">
                Govern
              </h2>
              <div className="poseidon-govern-glow-subtle inline-flex items-center gap-2 rounded-full border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--engine-govern)]">
                <Shield className="h-3.5 w-3.5" />
                100% auditability
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="poseidon-govern-glow-subtle inline-flex items-center rounded-full border border-[var(--engine-govern)]/30 bg-[var(--engine-govern)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--engine-govern)]">
                {decisionsAudited.toLocaleString()} total audited decisions
              </span>
              {errorCount > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border border-[var(--state-error)]/30 bg-[var(--state-error)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--state-error)]",
                    matrixActive && "animate-pulse",
                  )}
                >
                  <ShieldAlert className="mr-1 h-3 w-3" />
                  {errorCount} INTEGRITY BREAKS
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-8">
            <div
              className={cn(
                "group relative w-full max-w-4xl rounded-[32px] p-[1px] transition-all duration-700",
                canHoverPrism && isHoveringPrism
                  ? "shadow-[0_0_40px_-15px_var(--engine-govern)]/40"
                  : "",
              )}
              style={orbitStyle}
              onMouseEnter={() => canHoverPrism && setIsHoveringPrism(true)}
              onMouseLeave={() => canHoverPrism && setIsHoveringPrism(false)}
            >
              <div className="pointer-events-none absolute inset-0 z-[1] rounded-[32px] border border-white/5 transition-colors group-hover:border-white/10" />

              {matrixActive && (
                <div
                  className={cn(
                    "pointer-events-none absolute -inset-[1px] z-0 overflow-hidden rounded-[33px] opacity-0 transition-opacity duration-500",
                    canHoverPrism && isHoveringPrism && "opacity-40",
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
                {spotlightEntry ? (
                  <Link
                    to={buildGovernLink(spotlightEntry.id)}
                    className="flex min-w-0 flex-col justify-between gap-8 rounded-xl p-4 -m-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-white/50">
                        {spotlightEntry.id}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest",
                          spotlightEntry.status === "Flagged"
                            ? "border-[var(--state-error)]/30 bg-[var(--state-error)]/10 text-[var(--state-error)]"
                            : spotlightEntry.status === "Pending review"
                              ? "border-[var(--engine-execute)]/30 bg-[var(--engine-execute)]/10 text-[var(--engine-execute)]"
                              : "border-[var(--engine-protect)]/30 bg-[var(--engine-protect)]/10 text-[var(--engine-protect)]",
                        )}
                      >
                        {spotlightEntry.status}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                        <Activity className="h-3.5 w-3.5" />
                        CONF: {Math.round(spotlightEntry.confidence * 100)}%
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-3 text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl">
                        {spotlightEntry.action}
                      </h3>
                      <p
                        className={cn(
                          "poseidon-govern-glow-subtle mt-5 text-sm font-mono tracking-wider",
                          spotlightEntry.status === "Flagged"
                            ? "text-[var(--state-error)]"
                            : "text-[var(--engine-govern)]",
                        )}
                      >
                        EXCEPTION DETECTED. GOVERNANCE REVIEW REQUIRED.
                      </p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/govern/audit"
                    className="flex min-w-0 flex-col gap-8 rounded-xl p-4 -m-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center rounded-full border border-[var(--engine-govern)]/30 bg-[var(--engine-govern)]/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[var(--engine-govern)]">
                        SYSTEM HEALTH OPTIMAL
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                        <Activity className="h-3.5 w-3.5" />
                        INTEGRITY BREAKS: {errorCount}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-3 text-lg font-semibold leading-snug tracking-tight text-white">
                        Your safety guarantees are locked and continuously
                        verified.
                      </h3>
                      <div className="mt-8 flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-sm text-white/80 sm:text-base">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--engine-protect)]" />
                          <span>
                            <strong>
                              {trustGuarantees?.autoExecutionsWithoutConsent.toLocaleString() ??
                                0}
                            </strong>{" "}
                            actions taken without your approval
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/80 sm:text-base">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--engine-protect)]" />
                          <span>
                            <strong>
                              {trustGuarantees?.auditCoveragePercent.toLocaleString() ??
                                100}
                              %
                            </strong>{" "}
                            audit coverage on all decisions
                          </span>
                        </div>
                        {trustGuarantees?.llmTrainingOptOut && (
                          <div className="flex items-center gap-4 text-sm text-white/80 sm:text-base">
                            <Lock className="h-5 w-5 shrink-0 text-[var(--engine-govern)]" />
                            <span>
                              Zero customer data is used for LLM training
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex min-w-0 flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-[var(--engine-govern)]/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <span className="block border-b border-white/5 pb-3 font-mono text-[10px] uppercase tracking-wider text-white/30">
                Verification Queue Stability
              </span>
              {statusBreakdown && (
                <div className="poseidon-hide-scrollbar flex items-end justify-between gap-2 overflow-x-auto pb-1">
                  <div className="flex flex-col">
                    <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-mono leading-none tracking-tighter text-[var(--engine-protect)]">
                      {statusBreakdown.verified.toLocaleString()}
                    </span>
                    <span className="mt-3 text-[10px] uppercase tracking-wider text-white/40">
                      Verified
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-mono leading-none tracking-tighter text-[var(--engine-execute)]">
                      {statusBreakdown.pending.toLocaleString()}
                    </span>
                    <span className="mt-3 text-[10px] uppercase tracking-wider text-white/40">
                      Pending
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "text-[clamp(2.5rem,5vw,3.5rem)] font-mono leading-none tracking-tighter",
                        statusBreakdown.flagged > 0
                          ? matrixActive
                            ? "animate-pulse text-[var(--state-error)]"
                            : "text-[var(--state-error)]"
                          : "text-[var(--engine-govern)]",
                      )}
                    >
                      {statusBreakdown.flagged.toLocaleString()}
                    </span>
                    <span className="mt-3 text-[10px] uppercase tracking-wider text-white/40">
                      Flagged
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex h-full min-w-0 flex-col justify-between rounded-2xl border border-[var(--engine-govern)]/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div>
                <span className="mb-5 block border-b border-white/5 pb-3 font-mono text-[10px] uppercase tracking-wider text-white/30">
                  What Poseidon checked
                </span>
                <div className="mb-5 flex h-[6px] overflow-hidden rounded-full bg-white/[0.06]">
                  {engineBreakdown.map((item) => (
                    <div
                      key={item.engine}
                      className={cn(
                        "h-full",
                        performance.allowContinuousAnimation &&
                          "transition-all duration-1000",
                      )}
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                      }}
                      title={`${item.engine} ${item.percent}%`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-3">
                {engineBreakdown.map((source) => (
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
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="font-medium text-white/80">
                      {source.engine}
                    </span>
                    <span className="ml-0.5 font-mono text-[var(--engine-govern)]/70">
                      {source.percent}%
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="-mx-5 -mb-5 mt-6 sm:-mx-8 sm:-mb-8">
            <HeroUnifiedFooter
              to="/govern/audit"
              label="VIEW FULL IMMUTABLE AUDIT LOG"
              engineColor="var(--engine-govern)"
              performanceProfile={performance.profile}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export const GovernImmutableLedger = GovernHero;
