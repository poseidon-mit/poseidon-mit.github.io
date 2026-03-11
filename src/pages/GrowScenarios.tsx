import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Link } from '@/router';
import { TrendingUp, ArrowRight, Scale, Check, Zap } from "lucide-react";
import { ListHeroBanner } from '@/components/poseidon/list-hero-banner';
import { ForecastBand } from "@/components/poseidon/forecast-band";
import type { ForecastPoint } from "@/components/poseidon/forecast-band";
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="hero-viewport">
      <motion.div
        className="flex flex-col gap-6 h-full"
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}
      >
        {/* Hero Banner */}
        <motion.div variants={fadeUpVariant}>
          <ListHeroBanner
            engine="grow"
            icon={TrendingUp}
            engineLabel="Grow · Scenarios"
            title="Compare growth paths"
            subtitle={`Liquidity reserve at ${RESERVE_PROGRESS}%. Choose a scenario to see projected outcomes.`}
            backTo="/grow"
            backLabel="Back to Grow"
            stats={[
              { label: 'Reserve', value: `${RESERVE_PROGRESS}%` },
              { label: 'Current', value: `$${RESERVE_CURRENT.toLocaleString()}` },
            ]}
          />
        </motion.div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-6">
          {/* Scenario cards */}
          <motion.section
            variants={staggerContainerVariant}
            className="grid grid-cols-1 md:grid-cols-3 gap-6">

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
                className={`rounded-2xl border bg-card shadow-sm p-6 lg:p-8 flex flex-col gap-4 text-left transition-all will-change-transform cursor-pointer ${
                  selected === s.id ? 'border-2 border-violet-400 shadow-md' : 'border-border hover:shadow-md'
                }`}
                role="button"
                tabIndex={0}
                aria-pressed={selected === s.id}>
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-opacity ${selected === s.id ? 'opacity-100' : 'opacity-0'}`} style={{ background: "var(--engine-grow)" }} />

                {selected === s.id &&
                  <div
                    className="absolute top-6 right-6 w-6 h-6 rounded-full flex items-center justify-center z-10 bg-violet-600">
                    <Check size={14} className="text-white" />
                  </div>
                }
                <div className="flex-1 flex flex-col">
                  <p className="text-xl font-light tracking-wide text-foreground mb-2 pr-8">{s.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed tracking-wide mb-6 flex-1">{s.desc}</p>
                  <div className="flex flex-col gap-4 border-t border-border pt-5 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/40 tracking-widest uppercase text-xs font-semibold">Monthly</span>
                      <span className="font-mono font-bold text-foreground text-lg">${s.monthlySave}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/40 tracking-widest uppercase text-xs font-semibold">Time to goal</span>
                      <span className="font-mono font-medium text-foreground">{s.monthsToGoal} months</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/40 tracking-widest uppercase text-xs font-semibold">Confidence</span>
                      <span className="font-mono font-bold" style={{ color: s.confidence >= 0.9 ? "var(--state-healthy)" : s.confidence >= 0.85 ? "var(--state-warning)" : undefined }}>
                        {(s.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* Comparative Forecast */}
          <motion.section variants={fadeUpVariant}>
            <Card className="border border-border bg-card shadow-sm">
              <CardContent className="p-6 lg:p-10 flex flex-col transition-colors">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border pb-6 mb-8">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {activeScenario.name} forecast
                  </h3>
                  <span className="text-xs font-mono font-medium text-[var(--engine-grow)] mt-2 md:mt-0 bg-[var(--engine-grow)]/10 px-3 py-1.5 rounded-full border border-[var(--engine-grow)]/20">
                    Confidence: {(activeScenario.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <ForecastBand data={activeScenario.data} width={800} height={180} engine="grow" className="w-full" />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2">Now (${RESERVE_CURRENT.toLocaleString()})</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2">
                      +12 months (${activeScenario.data[11].median.toLocaleString()} projected)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Impact Summary + Send to Execute */}
          <motion.section variants={fadeUpVariant}>
            <Card className="border border-border bg-card shadow-sm border-l-4" style={{ borderLeftColor: 'var(--engine-grow)' }}>
              <CardContent className="p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl pl-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)] ">
                      <Zap size={20} />
                    </div>
                    <p className="text-2xl md:text-3xl font-light text-foreground leading-tight tracking-wide">
                      Ready to commit to {activeScenario.name.toLowerCase()}?
                    </p>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed tracking-wide mt-2">
                    This will queue a monthly contribution of <span className="font-mono text-[var(--engine-grow)] font-bold text-lg px-2 bg-violet-500/10 rounded-md border border-violet-500/20">${activeScenario.monthlySave.toLocaleString()}</span> for approval in Execute.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 md:ml-auto">
                  <Link
                    to="/grow"
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl px-6 transition-all font-semibold tracking-wide")}>
                    Cancel
                  </Link>
                  <Link
                    to="/execute"
                    className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-2xl px-8 transition-all bg-amber-600 text-white hover:bg-amber-700 font-bold tracking-wide border-none flex items-center gap-2")}>
                    Send to Execute <Zap size={18} />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Sensitivity notes */}
          <motion.section variants={fadeUpVariant} className="mb-4">
            <Card className="border border-border bg-muted/30 shadow-sm">
              <CardContent className="p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Scale size={14} className="text-muted-foreground" />
                  Sensitivity notes
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground tracking-wide font-light max-w-4xl">
                  Forecasts incorporate market volatility, expense variation, and income stability. Confidence bands widen at longer horizons.
                  All projections are re-evaluated weekly. Historical accuracy of this model: <strong className="font-medium text-foreground tracking-wide ">89%</strong> within 5% margin.
                </p>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
