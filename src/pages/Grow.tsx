import { motion } from "framer-motion";
import { Link } from '@/router';
import {
  TrendingUp,
  Target,
  ArrowRight,
  PiggyBank,
  DollarSign,
  Scale,
  Zap
} from
  "lucide-react";
import { ForecastBand } from "@/components/poseidon/forecast-band";
import type { ForecastPoint } from "@/components/poseidon/forecast-band";
import { DEMO_THREAD } from '@/lib/demo-thread';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { AuroraPulse, GovernFooter } from '@/components/poseidon';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { ButtonLink, Surface } from '@/design-system';


/* ── Cross-thread values ── */
const EMERGENCY_FUND_PROGRESS = DEMO_THREAD.emergencyFund.percent;
const EMERGENCY_FUND_CURRENT = DEMO_THREAD.emergencyFund.current;
const EMERGENCY_FUND_TARGET = DEMO_THREAD.emergencyFund.target;

/* ── Forecast data ── */
const FORECAST_DATA: ForecastPoint[] = Array.from({ length: 12 }, (_, i) => ({
  x: i,
  median: EMERGENCY_FUND_CURRENT + i * 250,
  low: EMERGENCY_FUND_CURRENT + i * 180,
  high: EMERGENCY_FUND_CURRENT + i * 320
}));

/* ── Goal KPIs ── */
const GOAL_KPIS = [
  { label: "Emergency fund", value: `${EMERGENCY_FUND_PROGRESS}%`, delta: "+5% this month", icon: PiggyBank, color: "var(--engine-grow)" },
  { label: "Monthly savings", value: "$420", delta: "+$60 vs plan", icon: DollarSign, color: "var(--engine-execute)" },
  { label: "Invest target", value: "On track", delta: "Q3 milestone", icon: Target, color: "var(--engine-dashboard)" }];


export default function GrowPage() {
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
          <motion.div variants={fadeUp} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-grow)]/20 bg-[var(--engine-grow)]/10 text-[var(--engine-grow)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <TrendingUp size={12} /> Grow Engine
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Emergency fund at{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">{EMERGENCY_FUND_PROGRESS}%</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">
              ${EMERGENCY_FUND_CURRENT.toLocaleString()} of ${EMERGENCY_FUND_TARGET.toLocaleString()} target.
              At current pace, you will reach your goal in approximately <span className="text-white/80 font-medium tracking-wide">3 months</span>.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mt-4">
            {/* CTA: Primary -> /grow/goal */}
            <ButtonLink
              to="/grow/goal"
              variant="primary"
              engine="grow"
              size="lg"
              className="rounded-xl px-8 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all font-semibold tracking-wide"
              icon={<ArrowRight size={18} />}
              iconPosition="right">
              Review growth plan
            </ButtonLink>
            <ButtonLink
              to="/grow/scenarios"
              variant="glass"
              engine="grow"
              size="lg"
              className="rounded-xl px-8 border border-white/[0.08] hover:bg-white/[0.05] transition-all font-semibold tracking-wide shadow-lg backdrop-blur-md">
              Open scenarios
            </ButtonLink>
          </motion.div>
        </motion.section>

        {/* ── P2: Goal / Forecast KPI Strip ── */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8 mb-8"
          variants={staggerContainer}
          aria-label="Growth KPIs">

          {GOAL_KPIS.map((kpi) => (
            <Surface
              key={kpi.label}
              variants={fadeUp}
              interactive
              className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col justify-center gap-4 group transition-all hover:bg-white/[0.02]"
              as={motion.div}
              padding="none">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0 border border-white/[0.08] shadow-inner transition-transform group-hover:scale-105"
                  style={{ background: `${kpi.color}15`, boxShadow: `0 0 20px ${kpi.color}30` }}>
                  <kpi.icon size={20} style={{ color: kpi.color }} className="drop-shadow-[0_0_8px_currentColor]" />
                </div>
                <div className="text-right flex flex-col gap-1.5">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white/50">{kpi.label}</p>
                  <p className="text-2xl md:text-3xl font-light font-mono text-white/90" style={{ textShadow: `0 0 20px ${kpi.color}40` }}>{kpi.value}</p>
                  <p className="text-xs font-medium tracking-wide" style={{ color: kpi.color === "var(--engine-dashboard)" ? "var(--engine-dashboard)" : kpi.color === "var(--engine-grow)" ? "var(--engine-grow)" : kpi.color === "var(--engine-execute)" ? "var(--engine-execute)" : "var(--state-healthy)" }}>{kpi.delta}</p>
                </div>
              </div>
            </Surface>
          ))}
        </motion.section>

        {/* ── P3: Forecast Preview + Recommendation ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-6 lg:px-8 mb-12">
          {/* Forecast visualization */}
          <Surface variants={fadeUp} interactive className="lg:col-span-8 relative overflow-hidden rounded-[32px] p-6 lg:p-10 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">12-month forecast</h3>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center gap-4">
              <ForecastBand data={FORECAST_DATA} width={800} height={200} engine="grow" className="w-full drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
              <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/[0.04]">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">Now</span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">+12 months</span>
              </div>
            </div>
          </Surface>

          {/* Top recommendation */}
          <Surface variants={fadeUp} interactive className="lg:col-span-4 relative overflow-hidden rounded-[32px] p-6 lg:p-10 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col justify-between group transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/10 to-transparent pointer-events-none opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Top recommendation</h3>
              </div>
              <div className="flex flex-col gap-8">
                <div className="w-14 h-14 rounded-2xl bg-[var(--engine-grow)]/10 border border-[var(--engine-grow)]/20 flex items-center justify-center text-[var(--engine-grow)] shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-transform group-hover:scale-110">
                  <Zap size={24} />
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-3xl font-light text-white leading-tight tracking-wide">
                    Increase monthly transfer by <span className="font-mono text-[var(--engine-grow)] drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">$60</span>
                  </p>
                  <p className="text-sm text-white/40 leading-relaxed font-light">
                    This would accelerate your emergency fund target by <span className="text-white/80 font-medium tracking-wide">3 weeks</span> based on current projections.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-10 pt-6 border-t border-white/[0.06]">
              <Link
                to="/grow/scenarios"
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide transition-all group-hover:text-white"
                style={{ color: "var(--engine-grow)" }}>
                Compare scenarios <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Surface>
        </div>

        {/* GovernFooter */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter
            auditId={GOVERNANCE_META['/grow'].auditId}
            pageContext={GOVERNANCE_META['/grow'].pageContext} />

        </div>
      </motion.main>
    </div>);

}