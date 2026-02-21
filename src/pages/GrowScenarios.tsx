import { useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from '@/router';
import { TrendingUp, ArrowRight, ArrowLeft, Scale, Check, Zap } from "lucide-react";
import { ForecastBand } from "@/components/poseidon/forecast-band";
import type { ForecastPoint } from "@/components/poseidon/forecast-band";
import { DEMO_THREAD } from '@/lib/demo-thread';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { AuroraPulse, GovernFooter } from '@/components/poseidon';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { ButtonLink, Surface } from '@/design-system';


/* ── Cross-thread ── */
const EMERGENCY_FUND_PROGRESS = DEMO_THREAD.emergencyFund.percent;
const EMERGENCY_FUND_CURRENT = DEMO_THREAD.emergencyFund.current;

/* ── Scenario definitions ── */
interface Scenario {
  id: string;
  name: string;
  desc: string;
  monthlySave: number;
  monthsToGoal: number;
  confidence: number;
  data: ForecastPoint[];
}

const BASE_DATA = (factor: number): ForecastPoint[] =>
  Array.from({ length: 12 }, (_, i) => ({
    x: i,
    median: EMERGENCY_FUND_CURRENT + i * factor,
    low: EMERGENCY_FUND_CURRENT + i * (factor * 0.7),
    high: EMERGENCY_FUND_CURRENT + i * (factor * 1.3)
  }));

const SCENARIOS: Scenario[] = [
  {
    id: "conservative",
    name: "Conservative",
    desc: "Keep current pace. Lower risk, longer timeline.",
    monthlySave: 420,
    monthsToGoal: 7,
    confidence: 0.92,
    data: BASE_DATA(250)
  },
  {
    id: "moderate",
    name: "Moderate boost",
    desc: "Increase monthly by $60. Balanced risk-reward.",
    monthlySave: 480,
    monthsToGoal: 5,
    confidence: 0.87,
    data: BASE_DATA(320)
  },
  {
    id: "aggressive",
    name: "Aggressive",
    desc: "Maximize contributions. Fastest path, tighter budget.",
    monthlySave: 600,
    monthsToGoal: 4,
    confidence: 0.79,
    data: BASE_DATA(420)
  }];


export default function GrowScenariosPage() {
  const [selected, setSelected] = useState("moderate");
  const prefersReducedMotion = useReducedMotion();
  const activeScenario = SCENARIOS.find((s) => s.id === selected) ?? SCENARIOS[1];

  return (
    <div className="relative">
      <AuroraPulse engine="grow" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "var(--engine-grow)", color: 'var(--bg-oled)' }}>

        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="command-center__main"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}>

        {/* ── Dashboard Hero ── */}
        <motion.section variants={staggerContainer} className="flex flex-col gap-6 mb-12 px-4 md:px-6 lg:px-8 pt-8 lg:pt-12">
          <motion.div variants={fadeUp}>
            <Link to="/grow" className="inline-flex items-center gap-2 rounded-[16px] px-4 py-2 text-sm font-medium transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]" style={{ color: "#94A3B8" }}>
              <ArrowLeft size={16} />
              Back to Grow
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-grow)]/20 bg-[var(--engine-grow)]/10 text-[var(--engine-grow)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <TrendingUp size={12} /> Scenario Comparison
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Compare growth paths
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">
              Emergency fund at <span className="text-white/80 font-medium">{EMERGENCY_FUND_PROGRESS}%</span>. Choose a scenario to see projected outcomes.
            </p>
          </motion.div>
        </motion.section>

        {/* ── Scenario cards ── */}
        <motion.section
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8 mb-8">

          {SCENARIOS.map((s) => (
            <Surface
              key={s.id}
              variants={fadeUp}
              interactive
              animate={prefersReducedMotion ? undefined : { scale: selected === s.id ? 1.015 : 1, y: 0 }}
              whileHover={prefersReducedMotion ? undefined : { scale: selected === s.id ? 1.02 : 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: selected === s.id ? 1.005 : 0.995 }}
              transition={prefersReducedMotion ? undefined : { type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
              onClick={() => setSelected(s.id)}
              onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelected(s.id);
                }
              }}
              className={`relative overflow-hidden rounded-[32px] p-6 lg:p-8 backdrop-blur-3xl bg-black/60 flex flex-col gap-4 text-left transition-all will-change-transform ${selected === s.id ? 'shadow-[0_0_30px_rgba(139,92,246,0.2)] border-2 border-[var(--engine-grow)]/40' : 'shadow-xl border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'}`}
              role="button"
              tabIndex={0}
              padding="none"
              aria-pressed={selected === s.id} as={motion.div}>
              <div className={`absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none ${selected === s.id ? 'opacity-100' : 'opacity-60'}`} />
              <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-50 transition-opacity ${selected === s.id ? 'opacity-100' : 'opacity-0'}`} style={{ background: "var(--engine-grow)" }} />

              {selected === s.id &&
                <div
                  className="absolute top-6 right-6 w-6 h-6 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] z-10"
                  style={{ background: "var(--engine-grow)" }}>
                  <Check size={14} style={{ color: 'var(--bg-oled)' }} />
                </div>
              }
              <div className="relative z-10 flex-1 flex flex-col">
                <p className="text-xl font-light tracking-wide text-white mb-2 pr-8">{s.name}</p>
                <p className="text-sm text-white/50 leading-relaxed tracking-wide mb-6 flex-1">{s.desc}</p>
                <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-5 mt-auto">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40 tracking-widest uppercase text-xs font-semibold">Monthly</span>
                    <span className="font-mono font-bold text-white/90 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] text-lg">${s.monthlySave}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40 tracking-widest uppercase text-xs font-semibold">Time to goal</span>
                    <span className="font-mono font-medium text-white/90">{s.monthsToGoal} months</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40 tracking-widest uppercase text-xs font-semibold">Confidence</span>
                    <span className="font-mono font-bold" style={{ color: s.confidence >= 0.9 ? "var(--state-healthy)" : s.confidence >= 0.85 ? "var(--state-warning)" : "#F1F5F9", textShadow: s.confidence >= 0.9 ? "0 0 10px rgba(34,197,94,0.4)" : "none" }}>
                      {(s.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </Surface>
          ))}
        </motion.section>

        {/* ── P2: Comparative Forecast with ForecastBand ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8 mb-8">
          <Surface interactive className="relative overflow-hidden rounded-[32px] p-6 lg:p-10 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/[0.06] pb-6 mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                {activeScenario.name} forecast
              </h3>
              <span className="text-xs font-mono font-medium text-[var(--engine-grow)] drop-shadow-[0_0_10px_rgba(139,92,246,0.3)] mt-2 md:mt-0 bg-[var(--engine-grow)]/10 px-3 py-1.5 rounded-full border border-[var(--engine-grow)]/20">
                Confidence: {(activeScenario.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center gap-4">
              <ForecastBand data={activeScenario.data} width={800} height={180} engine="grow" className="w-full drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">Now ($7,300)</span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">
                  +12 months (${activeScenario.data[11].median.toLocaleString()} projected)
                </span>
              </div>
            </div>
          </Surface>
        </motion.section>

        {/* ── P3: Impact Summary + Send to Execute ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8 mb-8">
          <Surface interactive className="relative overflow-hidden rounded-[32px] p-8 lg:p-10 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--engine-grow)]/10 to-transparent pointer-events-none opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="absolute left-0 top-0 bottom-0 w-1.5 opacity-70 transition-opacity group-hover:opacity-100" style={{ background: "var(--engine-grow)" }} />
            <div className="relative z-10 max-w-2xl pl-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)] shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  <Zap size={20} />
                </div>
                <p className="text-2xl md:text-3xl font-light text-white leading-tight tracking-wide">
                  Ready to commit to {activeScenario.name.toLowerCase()}?
                </p>
              </div>
              <p className="text-base text-white/50 leading-relaxed tracking-wide mt-2">
                This will queue a monthly transfer of <span className="font-mono text-[var(--engine-grow)] font-bold drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] text-lg px-2 bg-white/[0.05] rounded-md border border-[var(--engine-grow)]/20">${activeScenario.monthlySave}</span> for approval in the Execute engine.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center gap-4 md:ml-auto">
              <ButtonLink
                to="/grow"
                variant="glass"
                engine="grow"
                size="lg"
                className="rounded-2xl px-6 border border-white/[0.1] hover:bg-white/[0.05] transition-all font-semibold tracking-wide">
                Cancel
              </ButtonLink>
              {/* CTA: Primary -> /execute */}
              <ButtonLink
                to="/execute"
                variant="primary"
                engine="execute"
                size="lg"
                className="rounded-2xl px-8 shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] transition-all bg-gradient-to-r from-[var(--engine-execute)] to-[#FDE68A] text-black font-bold tracking-wide border-none"
                icon={<Zap size={18} />}
                iconPosition="right">
                Send to Execute
              </ButtonLink>
            </div>
          </Surface>
        </motion.section>

        {/* ── P4: Sensitivity notes (Tier B: 4 block cap) ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8 mb-12">
          <Surface className="relative overflow-hidden rounded-[24px] p-8 border border-white/[0.04] backdrop-blur-2xl bg-black/40 shadow-xl" as={motion.div} padding="none">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2">
                <Scale size={14} className="text-white/40" />
                Sensitivity notes
              </p>
              <p className="text-sm leading-relaxed text-white/40 tracking-wide font-light max-w-4xl">
                Forecasts incorporate market volatility, expense variation, and income stability. Confidence bands widen at longer horizons.
                All projections are re-evaluated weekly. Historical accuracy of this model: <strong className="font-medium text-white/70 tracking-wide drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">89%</strong> within 5% margin.
              </p>
            </div>
          </Surface>
        </motion.section>

        {/* GovernFooter */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter
            auditId={GOVERNANCE_META['/grow/scenarios'].auditId}
            pageContext={GOVERNANCE_META['/grow/scenarios'].pageContext} />

        </div>
      </motion.main>
    </div>);

}
