import { motion } from "framer-motion";
import { Link } from '@/router';
import { Target, ArrowRight, ArrowLeft, Scale, TrendingUp } from "lucide-react";
import { ForecastBand } from "@/components/poseidon/forecast-band";
import type { ForecastPoint } from "@/components/poseidon/forecast-band";
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { usePageTitle } from '@/hooks/use-page-title';
import { Card, CardContent } from '@/components/ui/card';


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
  median: RESERVE_CURRENT + i * 250,
  low: RESERVE_CURRENT + i * 180,
  high: RESERVE_CURRENT + i * 320
}));

/* ── Monthly contribution data ── */
const ALLOCATIONS = [
  { month: "Oct", amount: 350 },
  { month: "Nov", amount: 380 },
  { month: "Dec", amount: 360 },
  { month: "Jan", amount: 420 },
  { month: "Feb", amount: 420 }];


export default function GrowGoalPage() {
  usePageTitle('Goal Detail');
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - RESERVE_PROGRESS / 100 * circumference;

  return (
    <div className="hero-viewport">

      <motion.main
        id="main-content"
        className="flex-1 min-h-0 overflow-y-auto flex flex-col"
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}>

        {/* ── P1: Goal Progress Summary ── */}
        <motion.section variants={staggerContainerVariant} className="mb-8 pt-8 lg:pt-12">
          <motion.div variants={fadeUpVariant} className="mb-8">
            <Link to="/grow" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} />
              Back to Grow
            </Link>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <Card className="border border-border bg-card shadow-sm">
              <CardContent className="p-8 lg:p-12 flex flex-col md:flex-row items-center gap-10 lg:gap-16">

                <div className="relative w-40 h-40 lg:w-48 lg:h-48 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" className="stroke-[hsl(var(--muted))] fill-none" strokeWidth="8" />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      strokeWidth="8"
                      style={{ stroke: "var(--engine-grow)" }}
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={2 * Math.PI * 70 - RESERVE_PROGRESS / 100 * 2 * Math.PI * 70}
                      className="fill-none transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-light font-mono text-foreground tracking-tighter">{RESERVE_PROGRESS}%</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)]">
                      <Target size={20} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Liquidity Reserve</h1>
                  </div>
                  <p className="text-2xl lg:text-3xl text-muted-foreground font-light mt-2 tracking-wide">
                    <span className="font-mono text-foreground font-medium">${RESERVE_CURRENT.toLocaleString()}</span> of ${RESERVE_TARGET.toLocaleString()}
                  </p>
                  <p className="text-base text-muted-foreground tracking-wide mt-4 max-w-xl leading-relaxed">
                    At your current savings rate, the reserve will reach target in approximately <span className="text-foreground font-medium">14 months</span>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* ── P2: Contribution Timeline + Forecast ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Contribution timeline */}
          <motion.div variants={fadeUpVariant} className="lg:col-span-4">
            <Card className="border border-border bg-card shadow-sm h-full">
              <CardContent className="p-6 lg:p-8 flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Recent allocations
                  </h3>
                </div>
                <div className="flex flex-col gap-5 flex-1">
                  {ALLOCATIONS.map((c, i) =>
                    <div key={c.month} className={`flex items-center justify-between pt-2 pb-3 ${i !== 0 ? 'border-t border-border' : ''}`}>
                      <span className="text-sm font-semibold text-foreground flex-shrink-0 w-24 tracking-wide uppercase">{c.month} <span className="text-white/40 text-xs ml-1 font-mono">2026</span></span>
                      <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="w-full max-w-[120px] h-2 rounded-full overflow-hidden bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c.amount / 450 * 100}%`,
                              background: "var(--engine-grow)"
                            }} />
                        </div>
                        <span className="text-sm font-mono font-bold flex-shrink-0 w-16 text-right text-[var(--engine-grow)]">
                          ${c.amount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Forecast */}
          <motion.div variants={fadeUpVariant} className="lg:col-span-8">
            <Card className="border border-border bg-card shadow-sm h-full">
              <CardContent className="p-6 lg:p-10 flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Projected path
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <ForecastBand data={FORECAST_DATA} width={600} height={180} engine="grow" className="w-full" />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2">Now</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2">+12 months</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── P3: Goal Adjustment Action ── */}
        <motion.section variants={fadeUpVariant} className="mb-12">
          <Card className="border border-border bg-card shadow-sm border-l-4" style={{ borderLeftColor: 'var(--engine-grow)' }}>
            <CardContent className="p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl pl-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)]">
                    <TrendingUp size={20} />
                  </div>
                  <p className="text-2xl md:text-3xl font-light text-foreground leading-tight tracking-wide">
                    Modify reserve allocation rate
                  </p>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed tracking-wide mt-2">
                  Increasing the monthly allocation by <span className="font-mono text-[var(--engine-grow)] font-bold text-lg px-2 bg-violet-500/10 rounded-md border border-violet-500/20">$60</span> would accelerate reserve target by <strong className="text-foreground font-medium">3 weeks</strong>.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 md:ml-auto">
                <Link
                  to="/grow"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl px-6 transition-all font-semibold tracking-wide")}>
                  Back to grow
                </Link>
                {/* CTA: Primary -> /execute */}
                <Link
                  to="/execute"
                  className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-2xl px-8 transition-all font-semibold tracking-wide border-none bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2")}>
                  Modify allocation <ArrowRight size={18} />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.section>


      </motion.main>
    </div>
  );

}
