import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Link } from '@/router';
import { TrendingUp, ArrowRight, ArrowLeft, Scale, Check, Zap } from "lucide-react";
import { EngineBadge } from '@/components/poseidon';
import { ForecastBand } from "@/components/poseidon/forecast-band";
import type { ForecastPoint } from "@/components/poseidon/forecast-band";
import { getMotionPreset, cardSelect } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/use-page-title';
import { selectGrowLiquidityReserveView } from '@/domain/poseidon-universe';


/* ── Cross-thread ── */
const liquidityReserve = selectGrowLiquidityReserveView();
const RESERVE_PROGRESS = liquidityReserve.percent;
const RESERVE_CURRENT = liquidityReserve.currentUsd;

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
    median: RESERVE_CURRENT + i * factor,
    low: RESERVE_CURRENT + i * (factor * 0.7),
    high: RESERVE_CURRENT + i * (factor * 1.3)
  }));

const SCENARIOS: Scenario[] = [
  {
    id: "conservative",
    name: "Conservative",
    desc: "Maintain current contributions. Lower risk, longer timeline.",
    monthlySave: 400,
    monthsToGoal: 66,
    confidence: 0.92,
    data: BASE_DATA(250)
  },
  {
    id: "moderate",
    name: "Moderate boost",
    desc: "Increase monthly contribution by $100. Balanced risk-reward.",
    monthlySave: 500,
    monthsToGoal: 48,
    confidence: 0.87,
    data: BASE_DATA(320)
  },
  {
    id: "aggressive",
    name: "Aggressive",
    desc: "Maximize contributions. Fastest path, most aggressive growth.",
    monthlySave: 700,
    monthsToGoal: 30,
    confidence: 0.79,
    data: BASE_DATA(420)
  }];


export default function GrowScenariosPage() {
  const [selected, setSelected] = useState("moderate");
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion);
  usePageTitle('Scenario Comparison');
  const activeScenario = SCENARIOS.find((s) => s.id === selected) ?? SCENARIOS[1];

  return (
    <>

      <motion.main
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} command-center__main`}
        style={PAGE_CONTENT_STYLE}
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}>

        {/* ── Dashboard Hero ── */}
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 mb-12 pt-8 lg:pt-12">
          <motion.div variants={fadeUpVariant}>
            <Link to="/grow" className="inline-flex items-center gap-2 rounded-[16px] px-4 py-2 text-sm font-medium transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]" style={{ color: "#94A3B8" }}>
              <ArrowLeft size={16} />
              Back to Grow
            </Link>
          </motion.div>
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <EngineBadge engine="grow" icon={TrendingUp} label="Scenario Comparison" />
            </div>
            <h1 className={`${PAGE_HEADING_CLASS} mb-2`} style={PAGE_HEADING_STYLE}>
              Compare growth paths
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">
              Liquidity reserve at <span className="text-white/80 font-medium">{RESERVE_PROGRESS}%</span>. Choose a scenario to see projected outcomes.
            </p>
          </motion.div>
        </motion.section>

        {/* ── Scenario cards ── */}
        <motion.section
          variants={staggerContainerVariant}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {SCENARIOS.map((s) => (
            <motion.div
              key={s.id}
              variants={fadeUpVariant}
              onClick={() => setSelected(s.id)}
              onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelected(s.id);
                }
              }}
              className={`glass-card glass-card-overlay rounded-2xl p-6 lg:p-8 flex flex-col gap-4 text-left transition-all will-change-transform cursor-pointer ${selected === s.id ? '!border-2 !border-[var(--engine-grow)]/40' : 'hover:border-white/[0.15]'}`}
              role="button"
              tabIndex={0}
              aria-pressed={selected === s.id}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-50 transition-opacity ${selected === s.id ? 'opacity-100' : 'opacity-0'}`} style={{ background: "var(--engine-grow)" }} />

              {selected === s.id &&
                <div
                  className="absolute top-6 right-6 w-6 h-6 rounded-full flex items-center justify-center z-10"
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
                    <span className="font-mono font-bold text-white/90 text-lg">${s.monthlySave}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40 tracking-widest uppercase text-xs font-semibold">Time to goal</span>
                    <span className="font-mono font-medium text-white/90">{s.monthsToGoal} months</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40 tracking-widest uppercase text-xs font-semibold">Confidence</span>
                    <span className="font-mono font-bold" style={{ color: s.confidence >= 0.9 ? "var(--state-healthy)" : s.confidence >= 0.85 ? "var(--state-warning)" : "#F1F5F9", }}>
                      {(s.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ── P2: Comparative Forecast with ForecastBand ── */}
        <motion.section variants={fadeUpVariant} className="mb-8">
          <motion.div className="glass-card rounded-2xl p-6 lg:p-10 flex flex-col transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/[0.06] pb-6 mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                {activeScenario.name} forecast
              </h3>
              <span className="text-xs font-mono font-medium text-[var(--engine-grow)] mt-2 md:mt-0 bg-[var(--engine-grow)]/10 px-3 py-1.5 rounded-full border border-[var(--engine-grow)]/20">
                Confidence: {(activeScenario.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center gap-4">
              <ForecastBand data={activeScenario.data} width={800} height={180} engine="grow" className="w-full" />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">Now (${RESERVE_CURRENT.toLocaleString()})</span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">
                  +12 months (${activeScenario.data[11].median.toLocaleString()} projected)
                </span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ── P3: Impact Summary + Send to Execute ── */}
        <motion.section variants={fadeUpVariant} className="mb-8">
          <motion.div className="glass-card rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 group transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--engine-grow)]/10 to-transparent pointer-events-none opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="absolute left-0 top-0 bottom-0 w-1.5 opacity-70 transition-opacity group-hover:opacity-100" style={{ background: "var(--engine-grow)" }} />
            <div className="relative z-10 max-w-2xl pl-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)] ">
                  <Zap size={20} />
                </div>
                <p className="text-2xl md:text-3xl font-light text-white leading-tight tracking-wide">
                  Ready to commit to {activeScenario.name.toLowerCase()}?
                </p>
              </div>
              <p className="text-base text-white/50 leading-relaxed tracking-wide mt-2">
                This will queue a monthly contribution of <span className="font-mono text-[var(--engine-grow)] font-bold text-lg px-2 bg-white/[0.05] rounded-md border border-[var(--engine-grow)]/20">${activeScenario.monthlySave.toLocaleString()}</span> for approval in Execute.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center gap-4 md:ml-auto">
              <Link
                to="/grow"
                className={cn(buttonVariants({ variant: "glass", size: "lg" }), "rounded-2xl px-6 border border-white/[0.1] hover:bg-white/[0.05] transition-all font-semibold tracking-wide")}>
                Cancel
              </Link>
              {/* CTA: Primary -> /execute */}
              <Link
                to="/execute"
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-2xl px-8 shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] transition-all bg-gradient-to-r from-[var(--engine-execute)] to-[#FDE68A] text-black hover:opacity-90 font-bold tracking-wide border-none flex items-center gap-2")}>
                Send to Execute <Zap size={18} />
              </Link>
            </div>
          </motion.div>
        </motion.section>

        {/* ── P4: Sensitivity notes (Tier B: 4 block cap) ── */}
        <motion.section variants={fadeUpVariant} className="mb-12">
          <motion.div className="glass-card glass-card-overlay rounded-xl p-8">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2">
                <Scale size={14} className="text-white/40" />
                Sensitivity notes
              </p>
              <p className="text-sm leading-relaxed text-white/40 tracking-wide font-light max-w-4xl">
                Forecasts incorporate market volatility, expense variation, and income stability. Confidence bands widen at longer horizons.
                All projections are re-evaluated weekly. Historical accuracy of this model: <strong className="font-medium text-white/70 tracking-wide ">89%</strong> within 5% margin.
              </p>
            </div>
          </motion.div>
        </motion.section>


      </motion.main>
    </>);

}
