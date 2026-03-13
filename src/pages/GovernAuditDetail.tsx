import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Scale,
  Shield,
  TrendingUp,
  Zap,
  FileText,
  Activity,
} from "lucide-react";
import { Link, useRouter } from "@/router";
import { usePageTitle } from "@/hooks/use-page-title";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { getMotionPreset } from "@/lib/motion-presets";
import { formatDemoTimestamp } from "@/lib/demo-date";
import { AUDIT_DECISIONS, DEFAULT_DECISION_ID } from "@/lib/govern-audit-data";
import { cn } from "@/lib/utils";

const ENGINE_MAP = {
  Protect: {
    icon: Shield,
    accent: "var(--engine-protect)",
    bg: "bg-red-500",
    label: "Protect",
  },
  Grow: {
    icon: TrendingUp,
    accent: "var(--engine-grow)",
    bg: "bg-violet-500",
    label: "Grow",
  },
  Execute: {
    icon: Zap,
    accent: "var(--engine-execute)",
    bg: "bg-amber-500",
    label: "Execute",
  },
  Govern: {
    icon: Scale,
    accent: "var(--engine-govern)",
    bg: "bg-blue-500",
    label: "Govern",
  },
} as const;

const DECISION_ID_ALIASES: Record<string, string> = {
  "LED-8092": "GV-2026-0310-002",
};

function resolveDecision(id: string | null) {
  if (!id) return AUDIT_DECISIONS[DEFAULT_DECISION_ID];
  const normalized = DECISION_ID_ALIASES[id] ?? id;
  return AUDIT_DECISIONS[normalized] ?? AUDIT_DECISIONS[DEFAULT_DECISION_ID];
}

export function GovernAuditDetail() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion);
  const { search } = useRouter();
  const decisionId = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get("auditId") ?? params.get("decision") ?? params.get("id");
  }, [search]);

  const decision = useMemo(() => resolveDecision(decisionId), [decisionId]);
  const engineInfo =
    ENGINE_MAP[decision.engine as keyof typeof ENGINE_MAP] ?? ENGINE_MAP.Govern;
  const EngineIcon = engineInfo.icon;
  const confidencePct = Math.round(decision.explanation.confidence * 100);

  usePageTitle("Audit Detail");

  return (
    <main className="hero-viewport detail-canvas flex flex-col min-h-screen text-white selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Ambience & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
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
            to="/govern/audit"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white/50" />
            <span className="sr-only">Back to Audit Ledger</span>
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div variants={fadeUp} className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end border-b border-white/[0.08] pb-10">
            <div className="flex gap-6 max-w-3xl">
              <div
                className="h-16 w-16 shrink-0 rounded-2xl border flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden group"
                style={{
                  borderColor: `color-mix(in srgb, ${engineInfo.accent} 30%, transparent)`,
                  backgroundColor: `color-mix(in srgb, ${engineInfo.accent} 10%, transparent)`,
                }}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <EngineIcon
                  className="h-8 w-8"
                  style={{ color: engineInfo.accent }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-sm tracking-widest text-white/50 uppercase">
                    {decision.id}
                  </p>
                  <span
                    className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border"
                    style={{
                      color: engineInfo.accent,
                      borderColor: `color-mix(in srgb, ${engineInfo.accent} 30%, transparent)`,
                      backgroundColor: `color-mix(in srgb, ${engineInfo.accent} 10%, transparent)`,
                    }}
                  >
                    {decision.engine} Engine
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-white/40 border border-white/10 bg-white/5">
                    Immutable Record
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">
                  {decision.action}
                </h1>
                <p className="text-white/40 text-sm font-mono tracking-wide">
                  {formatDemoTimestamp(decision.timestamp)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                Algorithmic Confidence
              </p>
              <p
                className="text-5xl font-light font-mono tabular-nums"
                style={{ color: engineInfo.accent }}
              >
                {confidencePct}
                <span className="text-2xl text-white/50">%</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Logics & Factors */}
          <motion.div variants={fadeUp} className="lg:col-span-2 space-y-10">
            {/* Executive Summary */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <FileText size={120} />
              </div>
              <h2 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-4 flex items-center gap-2 relative z-10">
                <Scale size={14} className="text-blue-400" /> Rationale Summary
              </h2>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light relative z-10">
                {decision.explanation.summary}
              </p>
            </div>

            {/* Attribution Factors */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-6 pl-2">
                Key Decision Drivers
              </h2>
              <div className="grid gap-3">
                {decision.topFactors.map((factor) => {
                  const pct = Math.round(factor.contribution * 100);
                  return (
                    <div
                      key={factor.label}
                      className="group bg-black/40 border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] transition-colors relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-sm font-semibold tracking-wide text-white/90">
                          {factor.label}
                        </span>
                        <span
                          className="text-sm font-mono font-bold tabular-nums"
                          style={{ color: engineInfo.accent }}
                        >
                          {pct}%
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4 relative z-10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                          style={{ backgroundColor: engineInfo.accent }}
                        />
                      </div>

                      <p className="text-xs leading-relaxed text-white/50 relative z-10">
                        {factor.note}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Telemetry & Traces */}
          <motion.div variants={fadeUp} className="space-y-10">
            {/* Outcome Assertion */}
            <div className="bg-black border border-white/10 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none" />
              <h2 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-6 flex items-center gap-2">
                <Eye size={14} className="text-blue-400" /> Outcome Assertion
              </h2>
              <p className="text-white/80 leading-relaxed text-sm font-medium border-l-2 border-blue-500/50 pl-4 py-1 italic">
                "{decision.coreAssertion}"
              </p>
            </div>

            {/* Data Sources & Base Reality */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-6 flex items-center gap-2">
                <Activity size={14} className="text-blue-400" /> Input Telemetry
              </h2>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
                    Detected Variables
                  </p>
                  <ul className="space-y-3">
                    {decision.baseReality.map((row) => (
                      <li
                        key={row.label}
                        className="flex justify-between items-start gap-4 border-b border-white/[0.04] pb-2"
                      >
                        <span className="text-xs text-white/50 uppercase tracking-wider">
                          {row.label}
                        </span>
                        <span className="text-sm font-medium text-white/80 text-right">
                          {row.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
                    Data Streams
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {decision.dataSources.map((src) => (
                      <span
                        key={src}
                        className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/50 text-[10px] font-mono text-white/60 tracking-wider"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Matrix */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-xs uppercase font-bold tracking-widest text-white/40 mb-6 flex items-center gap-2">
                <Shield size={14} className="text-blue-400" /> Regulatory
                Compliance
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { label: "GDPR", enabled: decision.compliance.gdpr },
                    { label: "ECOA", enabled: decision.compliance.ecoa },
                    { label: "CCPA", enabled: decision.compliance.ccpa },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-black/40 text-center relative overflow-hidden group"
                  >
                    {item.enabled && (
                      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    <CheckCircle2
                      className={cn(
                        "h-5 w-5 mb-2",
                        item.enabled ? "text-emerald-400" : "text-white/20",
                      )}
                    />
                    <span className="text-sm font-bold tracking-wider text-white/80">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] uppercase tracking-widest mt-1",
                        item.enabled ? "text-emerald-500/80" : "text-white/30",
                      )}
                    >
                      {item.enabled ? "Protected" : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

export default GovernAuditDetail;
