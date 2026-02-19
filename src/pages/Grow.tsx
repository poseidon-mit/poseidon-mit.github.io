import { motion } from "framer-motion"
import { Link } from '@/router'
import {
  TrendingUp,
  Target,
  ArrowRight,
  PiggyBank,
  DollarSign,
  Scale,
  Zap,
} from "lucide-react"
import { ForecastBand } from "@/components/poseidon/forecast-band"
import type { ForecastPoint } from "@/components/poseidon/forecast-band"
import { DEMO_THREAD } from '@/lib/demo-thread'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { AuroraPulse, GovernFooter } from '@/components/poseidon'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'


/* ── Cross-thread values ── */
const EMERGENCY_FUND_PROGRESS = DEMO_THREAD.emergencyFund.percent
const EMERGENCY_FUND_CURRENT = DEMO_THREAD.emergencyFund.current
const EMERGENCY_FUND_TARGET = DEMO_THREAD.emergencyFund.target

/* ── Forecast data ── */
const FORECAST_DATA: ForecastPoint[] = Array.from({ length: 12 }, (_, i) => ({
  x: i,
  median: EMERGENCY_FUND_CURRENT + i * 250,
  low: EMERGENCY_FUND_CURRENT + i * 180,
  high: EMERGENCY_FUND_CURRENT + i * 320,
}))

/* ── Goal KPIs ── */
const GOAL_KPIS = [
  { label: "Emergency fund", value: `${EMERGENCY_FUND_PROGRESS}%`, delta: "+5% this month", icon: PiggyBank, color: "var(--engine-grow)" },
  { label: "Monthly savings", value: "$420", delta: "+$60 vs plan", icon: DollarSign, color: "var(--engine-execute)" },
  { label: "Invest target", value: "On track", delta: "Q3 milestone", icon: Target, color: "var(--engine-dashboard)" },
]

export default function GrowPage() {
  return (
    <div className="relative">
      <AuroraPulse engine="grow" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "var(--engine-grow)", color: "#0B1221" }}
      >
        Skip to main content
      </a>

      <motion.main
        id="main-content"
        className="command-center__main"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* ── P1: Growth Summary + CTA ── */}
        <motion.section variants={staggerContainer} className="hero-section">
          <motion.div variants={fadeUp} className="hero-kicker" style={{ borderColor: "rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.06)", color: "var(--engine-grow)" }}>
            <span className="hero-kicker__icon"><TrendingUp size={14} /></span>
            Grow Engine
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-headline">
            Emergency fund at{" "}
            <span style={{ color: "var(--engine-grow)" }}>{EMERGENCY_FUND_PROGRESS}%</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-subline">
            ${EMERGENCY_FUND_CURRENT.toLocaleString()} of ${EMERGENCY_FUND_TARGET.toLocaleString()} target.
            At current pace, you will reach your goal in approximately 3 months.
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-3 mt-2">
            {/* CTA: Primary -> /grow/goal */}
            <Link
              to="/grow/goal"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, var(--engine-grow), #A78BFA)",
                color: "#0B1221",
              }}
            >
              Review growth plan
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/grow/scenarios"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#CBD5E1",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Open scenarios
            </Link>
          </motion.div>
        </motion.section>

        {/* ── P2: Goal / Forecast KPI Strip ── */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 md:px-6 lg:px-8"
          variants={staggerContainer}
          aria-label="Growth KPIs"
        >
          {GOAL_KPIS.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className="glass-surface rounded-2xl p-4 flex items-start gap-3"
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                style={{ background: `${kpi.color}15` }}
              >
                <kpi.icon size={18} style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#64748B" }}>{kpi.label}</p>
                <p className="text-xl font-bold font-mono" style={{ color: "#F1F5F9" }}>{kpi.value}</p>
                <p className="text-[10px] font-semibold" style={{ color: "var(--state-healthy)" }}>{kpi.delta}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ── P3: Forecast Preview + Recommendation ── */}
        <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-6 lg:px-8">
          {/* Forecast visualization */}
          <motion.div variants={fadeUp} className="flex-1 glass-surface rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748B" }}>
              12-month forecast
            </p>
            <ForecastBand data={FORECAST_DATA} width={480} height={100} engine="grow" className="w-full" />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] font-mono" style={{ color: "#94A3B8" }}>Now</span>
              <span className="text-[10px] font-mono" style={{ color: "#94A3B8" }}>+12 months</span>
            </div>
          </motion.div>

          {/* Top recommendation */}
          <motion.div variants={fadeUp} className="lg:w-80 glass-surface rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
                Top recommendation
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>
                Increase monthly transfer by $60
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
                This would accelerate your emergency fund target by 3 weeks based on current projections.
              </p>
            </div>
            <Link
              to="/grow/scenarios"
              className="inline-flex items-center gap-1 text-xs font-semibold mt-4"
              style={{ color: "var(--engine-grow)" }}
            >
              Compare scenarios <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>

        {/* GovernFooter */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter
            auditId={GOVERNANCE_META['/grow'].auditId}
            pageContext={GOVERNANCE_META['/grow'].pageContext}
          />
        </div>
      </motion.main>
    </div>
  )
}
