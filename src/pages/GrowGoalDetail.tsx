import { motion } from "framer-motion";
import { Link } from '@/router';
import { Target, ArrowRight, ArrowLeft, Scale, TrendingUp } from "lucide-react";
import { ForecastBand } from "@/components/poseidon/forecast-band";
import type { ForecastPoint } from "@/components/poseidon/forecast-band";
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout';
import { usePageTitle } from '@/hooks/use-page-title';


/* ── Cross-thread ── */
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { selectGrowLiquidityReserveView } from '@/domain/poseidon-universe';

const liquidityReserve = selectGrowLiquidityReserveView();
const RESERVE_PROGRESS = liquidityReserve.percent;
const RESERVE_CURRENT = liquidityReserve.currentUsd;
const RESERVE_TARGET = liquidityReserve.targetUsd;

/* ── Forecast data (goal-specific) ── */
const FORECAST_DATA: ForecastPoint[] = Array.from({ length: 12 }, (_, i) => ({
  x: i,
  median: RESERVE_CURRENT + i * 250_000,
  low: RESERVE_CURRENT + i * 180_000,
  high: RESERVE_CURRENT + i * 320_000
}));

/* ── Monthly contribution data ── */
const ALLOCATIONS = [
  { month: "Oct", amount: 350_000 },
  { month: "Nov", amount: 380_000 },
  { month: "Dec", amount: 360_000 },
  { month: "Jan", amount: 420_000 },
  { month: "Feb", amount: 420_000 }];


export default function GrowGoalPage() {
  usePageTitle('Goal Detail');
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - RESERVE_PROGRESS / 100 * circumference;

  return (
    <>

      <motion.main
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} command-center__main`}
        style={PAGE_CONTENT_STYLE}
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}>

        {/* ── P1: Goal Progress Summary ── */}
        <motion.section variants={staggerContainerVariant} className="mb-8 pt-8 lg:pt-12">
          <motion.div variants={fadeUpVariant} className="mb-8">
            <Link to="/grow" className="inline-flex items-center gap-2 rounded-[16px] px-4 py-2 text-sm font-medium transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]" style={{ color: "#94A3B8" }}>
              <ArrowLeft size={16} />
              Back to Grow
            </Link>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="glass-card rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center gap-10 lg:gap-16">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/10 to-transparent pointer-events-none opacity-50" />

            <div className="relative w-40 h-40 lg:w-48 lg:h-48 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" className="stroke-white/[0.05] fill-none" strokeWidth="8" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  strokeWidth="8"
                  style={{ stroke: "var(--engine-grow)" }}
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={2 * Math.PI * 70 - RESERVE_PROGRESS / 100 * 2 * Math.PI * 70}
                  className="fill-none drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-light font-mono text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] tracking-tighter">{RESERVE_PROGRESS}%</span>
              </div>
            </div>

            <div className="flex-1 relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                  <Target size={20} className="drop-shadow-[0_0_8px_currentColor]" />
                </div>
                <h1 className={PAGE_HEADING_CLASS} style={PAGE_HEADING_STYLE}>Liquidity Reserve</h1>
              </div>
              <p className="text-2xl lg:text-3xl text-white/70 font-light mt-2 tracking-wide">
                <span className="font-mono text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] font-medium">${RESERVE_CURRENT.toLocaleString()}</span> of ${RESERVE_TARGET.toLocaleString()}
              </p>
              <p className="text-base text-white/50 tracking-wide mt-4 max-w-xl leading-relaxed">
                At current allocation rate, the reserve will reach target in approximately <span className="text-white/80 font-medium">3 months</span>.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* ── P2: Contribution Timeline + Forecast ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Contribution timeline */}
          <motion.div variants={fadeUpVariant} className="lg:col-span-4 glass-card glass-card-overlay rounded-2xl p-6 lg:p-8 flex flex-col transition-colors">
            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-6 mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Recent allocations
              </h3>
            </div>
            <div className="flex flex-col gap-5 relative z-10 flex-1">
              {ALLOCATIONS.map((c, i) =>
                <div key={c.month} className={`flex items-center justify-between pt-2 pb-3 ${i !== 0 ? 'border-t border-white/[0.04]' : ''}`}>
                  <span className="text-sm font-semibold text-white/80 flex-shrink-0 w-24 tracking-wide uppercase">{c.month} <span className="text-white/30 text-xs ml-1 font-mono">2026</span></span>
                  <div className="flex items-center gap-4 flex-1 justify-end">
                    <div className="w-full max-w-[120px] h-2 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.02]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${c.amount / 450_000 * 100}%`,
                          background: "var(--engine-grow)"
                        }} />
                    </div>
                    <span className="text-sm font-mono font-bold flex-shrink-0 w-16 text-right text-[var(--engine-grow)]">
                      ${(c.amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Forecast */}
          <motion.div variants={fadeUpVariant} className="lg:col-span-8 glass-card rounded-2xl p-6 lg:p-10 flex flex-col transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-6 mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Projected path
              </h3>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center gap-4">
              <ForecastBand data={FORECAST_DATA} width={600} height={180} engine="grow" className="w-full" />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">Now</span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">+12 months</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── P3: Goal Adjustment Action ── */}
        <motion.section variants={fadeUpVariant} className="mb-12">
          <motion.div className="glass-card rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--engine-grow)]/10 to-transparent pointer-events-none opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="absolute left-0 top-0 bottom-0 w-1.5 opacity-70 transition-opacity group-hover:opacity-100" style={{ background: "var(--engine-grow)" }} />
            <div className="relative z-10 max-w-2xl pl-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)]">
                  <TrendingUp size={20} />
                </div>
                <p className="text-2xl md:text-3xl font-light text-white leading-tight tracking-wide">
                  Modify reserve allocation rate
                </p>
              </div>
              <p className="text-base text-white/50 leading-relaxed tracking-wide mt-2">
                Increasing the monthly allocation by <span className="font-mono text-[var(--engine-grow)] font-bold text-lg px-2 bg-white/[0.05] rounded-md border border-[var(--engine-grow)]/20">$60K</span> would accelerate reserve target by <strong className="text-white/80 font-medium">3 weeks</strong>.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center gap-4 md:ml-auto">
              <Link
                to="/grow"
                className={cn(buttonVariants({ variant: "glass", size: "lg" }), "rounded-2xl px-6 border border-white/[0.1] hover:bg-white/[0.05] transition-all font-semibold tracking-wide")}>
                Back to grow
              </Link>
              {/* CTA: Primary -> /execute */}
              <Link
                to="/execute"
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-2xl px-8 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all font-semibold tracking-wide border-none bg-[var(--engine-grow)] hover:opacity-90 text-white flex items-center gap-2")}>
                Modify allocation <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </motion.section>


      </motion.main>
    </>);

}
