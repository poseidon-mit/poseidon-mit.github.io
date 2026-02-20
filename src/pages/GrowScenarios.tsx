import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
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
        
        {/* ── P1: Scenario Selection ── */}
        <motion.section variants={staggerContainer} className="px-4 md:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
            <Link to="/grow" className="flex items-center gap-1 text-xs font-medium" style={{ color: "#64748B" }}>
              <ArrowLeft size={14} />
              Back to Grow
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="hero-kicker" style={{ borderColor: "rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.06)", color: "var(--engine-grow)" }}>
            <span className="hero-kicker__icon"><TrendingUp size={14} /></span>
            Scenario Comparison
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-headline mt-3">
            Compare growth paths
          </motion.h1>
          <motion.p variants={fadeUp} className="hero-subline">
            Emergency fund at {EMERGENCY_FUND_PROGRESS}%. Choose a scenario to see projected outcomes.
          </motion.p>
        </motion.section>

        {/* ── Scenario cards ── */}
        <motion.section
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-6 lg:px-8">
          
          {SCENARIOS.map((s) => <Surface

            key={s.id}
            variants={fadeUp}
            onClick={() => setSelected(s.id)}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelected(s.id);
              }
            }} className="rounded-2xl p-5 text-left transition-all relative"

            style={{
              border: selected === s.id ?
              "1px solid rgba(139,92,246,0.4)" :
              "1px solid rgba(255,255,255,0.06)"
            }}
            role="button"
            tabIndex={0}
            aria-pressed={selected === s.id} variant="glass" padding="none" as={motion.div}>
            
              {selected === s.id &&
            <div
              className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "var(--engine-grow)" }}>
              
                  <Check size={12} style={{ color: 'var(--bg-oled)' }} />
                </div>
            }
              <p className="text-sm font-bold mb-1" style={{ color: "#F1F5F9" }}>{s.name}</p>
              <p className="text-xs mb-3" style={{ color: "#94A3B8" }}>{s.desc}</p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "#64748B" }}>Monthly</span>
                  <span className="font-mono font-semibold" style={{ color: "#F1F5F9" }}>${s.monthlySave}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "#64748B" }}>Time to goal</span>
                  <span className="font-mono font-semibold" style={{ color: "#F1F5F9" }}>{s.monthsToGoal} months</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "#64748B" }}>Confidence</span>
                  <span className="font-mono font-semibold" style={{ color: s.confidence >= 0.9 ? "var(--state-healthy)" : s.confidence >= 0.85 ? "var(--state-warning)" : "#F1F5F9" }}>
                    {(s.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </Surface>
          )}
        </motion.section>

        {/* ── P2: Comparative Forecast with ForecastBand ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="rounded-2xl p-6" variant="glass" padding="none">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>
                {activeScenario.name} forecast
              </p>
              <span className="text-[10px] font-mono" style={{ color: "#94A3B8" }}>
                Confidence: {(activeScenario.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <ForecastBand data={activeScenario.data} width={700} height={120} engine="grow" className="w-full" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] font-mono" style={{ color: "#94A3B8" }}>Now ($7,300)</span>
              <span className="text-[10px] font-mono" style={{ color: "#94A3B8" }}>
                +12 months (${activeScenario.data[11].median.toLocaleString()} projected)
              </span>
            </div>
          </Surface>
        </motion.section>

        {/* ── P3: Impact Summary + Send to Execute ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4" variant="glass" padding="none">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>
                Ready to commit to {activeScenario.name.toLowerCase()}?
              </p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                This will queue a monthly transfer of ${activeScenario.monthlySave} for approval in the Execute engine.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/grow"
                className="text-sm font-medium px-4 py-2 rounded-xl"
                style={{ color: "#94A3B8" }}>
                
                Back to grow
              </Link>
              {/* CTA: Primary -> /execute */}
              <ButtonLink
                to="/execute"
                variant="glass"
                engine="grow"
                size="md"
                className="rounded-xl"
                icon={<Zap size={16} />}
                iconPosition="right">
                
                Send to Execute
              </ButtonLink>
            </div>
          </Surface>
        </motion.section>

        {/* ── P4: Sensitivity notes (Tier B: 4 block cap) ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="rounded-2xl p-4" variant="glass" padding="none">
            <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "#64748B" }}>
              Sensitivity notes
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
              Forecasts incorporate market volatility, expense variation, and income stability. Confidence bands widen at longer horizons.
              All projections are re-evaluated weekly. Historical accuracy of this model: 89% within 5% margin.
            </p>
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
