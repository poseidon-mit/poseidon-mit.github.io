import { motion } from "framer-motion";
import { Link } from '@/router';
import { Target, ArrowRight, ArrowLeft, Scale, TrendingUp } from "lucide-react";
import { ForecastBand } from "@/components/poseidon/forecast-band";
import type { ForecastPoint } from "@/components/poseidon/forecast-band";
import { DEMO_THREAD } from '@/lib/demo-thread';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { AuroraPulse, GovernFooter } from '@/components/poseidon';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';


/* ── Cross-thread ── */
import { Surface, ButtonLink } from "@/design-system";
const EMERGENCY_FUND_PROGRESS = DEMO_THREAD.emergencyFund.percent;
const EMERGENCY_FUND_CURRENT = DEMO_THREAD.emergencyFund.current;
const EMERGENCY_FUND_TARGET = DEMO_THREAD.emergencyFund.target;

/* ── Forecast data (goal-specific) ── */
const FORECAST_DATA: ForecastPoint[] = Array.from({ length: 12 }, (_, i) => ({
  x: i,
  median: EMERGENCY_FUND_CURRENT + i * 250,
  low: EMERGENCY_FUND_CURRENT + i * 180,
  high: EMERGENCY_FUND_CURRENT + i * 320
}));

/* ── Monthly contribution data ── */
const CONTRIBUTIONS = [
  { month: "Oct", amount: 350 },
  { month: "Nov", amount: 380 },
  { month: "Dec", amount: 360 },
  { month: "Jan", amount: 420 },
  { month: "Feb", amount: 420 }];


export default function GrowGoalPage() {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - EMERGENCY_FUND_PROGRESS / 100 * circumference;

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

        {/* ── P1: Goal Progress Summary ── */}
        <motion.section variants={staggerContainer} className="px-4 md:px-6 lg:px-8 mb-8 pt-8 lg:pt-12">
          <motion.div variants={fadeUp} className="mb-8">
            <Link to="/grow" className="inline-flex items-center gap-2 rounded-[16px] px-4 py-2 text-sm font-medium transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]" style={{ color: "#94A3B8" }}>
              <ArrowLeft size={16} />
              Back to Grow
            </Link>
          </motion.div>

          <Surface variants={fadeUp} interactive className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col md:flex-row items-center gap-10 lg:gap-16" as={motion.div} padding="none">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/10 to-transparent pointer-events-none" />

            {/* Progress ring */}
            <div className="relative flex-shrink-0 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <svg width={160} height={160} className="-rotate-90">
                <circle cx={80} cy={80} r={70} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
                <circle
                  cx={80} cy={80} r={70}
                  fill="none"
                  stroke="var(--engine-grow)"
                  strokeWidth={12}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 - EMERGENCY_FUND_PROGRESS / 100 * 2 * Math.PI * 70}
                  className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-light font-mono text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] tracking-tighter">{EMERGENCY_FUND_PROGRESS}%</span>
              </div>
            </div>

            <div className="flex-1 relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                  <Target size={20} className="drop-shadow-[0_0_8px_currentColor]" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Emergency fund</h1>
              </div>
              <p className="text-2xl lg:text-3xl text-white/70 font-light mt-2 tracking-wide">
                <span className="font-mono text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] font-medium">${EMERGENCY_FUND_CURRENT.toLocaleString()}</span> of ${EMERGENCY_FUND_TARGET.toLocaleString()}
              </p>
              <p className="text-base text-white/50 tracking-wide mt-4 max-w-xl leading-relaxed">
                At current pace, you will reach your target in approximately <span className="text-white/80 font-medium">3 months</span>.
              </p>
            </div>
          </Surface>
        </motion.section>

        {/* ── P2: Contribution Timeline + Forecast ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-6 lg:px-8 mb-12">
          {/* Contribution timeline */}
          <Surface variants={fadeUp} interactive className="lg:col-span-4 relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-6 mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Recent contributions
              </h3>
            </div>
            <div className="flex flex-col gap-5 relative z-10 flex-1">
              {CONTRIBUTIONS.map((c, i) =>
                <div key={c.month} className={`flex items-center justify-between pt-2 pb-3 ${i !== 0 ? 'border-t border-white/[0.04]' : ''}`}>
                  <span className="text-sm font-semibold text-white/80 flex-shrink-0 w-24 tracking-wide uppercase">{c.month} <span className="text-white/30 text-xs ml-1 font-mono">2026</span></span>
                  <div className="flex items-center gap-4 flex-1 justify-end">
                    <div className="w-full max-w-[120px] h-2 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.02]">
                      <div
                        className="h-full rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                        style={{
                          width: `${c.amount / 450 * 100}%`,
                          background: "var(--engine-grow)"
                        }} />
                    </div>
                    <span className="text-sm font-mono font-bold flex-shrink-0 w-12 text-right text-[var(--engine-grow)] drop-shadow-[0_0_5px_rgba(139,92,246,0.4)]">
                      ${c.amount}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Surface>

          {/* Forecast */}
          <Surface variants={fadeUp} interactive className="lg:col-span-8 relative overflow-hidden rounded-[32px] p-6 lg:p-10 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-grow)]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-6 mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Projected path
              </h3>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center gap-4">
              <ForecastBand data={FORECAST_DATA} width={600} height={180} engine="grow" className="w-full drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">Now</span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">+12 months</span>
              </div>
            </div>
          </Surface>
        </div>

        {/* ── P3: Goal Adjustment Action ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8 mb-12">
          <Surface interactive className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group transition-all hover:bg-white/[0.02]" as={motion.div} padding="none">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--engine-grow)]/10 to-transparent pointer-events-none opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="absolute left-0 top-0 bottom-0 w-1.5 opacity-70 transition-opacity group-hover:opacity-100" style={{ background: "var(--engine-grow)" }} />
            <div className="relative z-10 max-w-2xl pl-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 flex items-center justify-center text-[var(--engine-grow)] shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  <TrendingUp size={20} />
                </div>
                <p className="text-2xl md:text-3xl font-light text-white leading-tight tracking-wide">
                  Adjust your savings pace
                </p>
              </div>
              <p className="text-base text-white/50 leading-relaxed tracking-wide mt-2">
                Increasing your monthly transfer by <span className="font-mono text-[var(--engine-grow)] font-bold drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] text-lg px-2 bg-white/[0.05] rounded-md border border-[var(--engine-grow)]/20">$60</span> would accelerate your target by <strong className="text-white/80 font-medium">3 weeks</strong>.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center gap-4 md:ml-auto">
              <ButtonLink
                to="/grow"
                variant="glass"
                engine="grow"
                size="lg"
                className="rounded-2xl px-6 border border-white/[0.1] hover:bg-white/[0.05] transition-all font-semibold tracking-wide">
                Back to grow
              </ButtonLink>
              {/* CTA: Primary -> /execute */}
              <ButtonLink
                to="/execute"
                variant="primary"
                engine="grow"
                size="lg"
                className="rounded-2xl px-8 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all font-semibold tracking-wide border-none bg-[var(--engine-grow)] text-white"
                icon={<ArrowRight size={18} />}
                iconPosition="right">
                Adjust goal
              </ButtonLink>
            </div>
          </Surface>
        </motion.section>

        {/* GovernFooter */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter
            auditId={GOVERNANCE_META['/grow/goal'].auditId}
            pageContext={GOVERNANCE_META['/grow/goal'].pageContext} />

        </div>
      </motion.main>
    </div>);

}