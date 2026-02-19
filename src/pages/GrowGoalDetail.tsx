import { motion } from "framer-motion"
import { Link } from '@/router'
import { Target, ArrowRight, ArrowLeft, Scale, TrendingUp } from "lucide-react"
import { ForecastBand } from "@/components/poseidon/forecast-band"
import type { ForecastPoint } from "@/components/poseidon/forecast-band"
import { DEMO_THREAD } from '@/lib/demo-thread'
import { GOVERNANCE_META } from '@/lib/governance-meta'

/* ── Motion presets ── */
const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ── Cross-thread ── */
const EMERGENCY_FUND_PROGRESS = DEMO_THREAD.emergencyFund.percent
const EMERGENCY_FUND_CURRENT = DEMO_THREAD.emergencyFund.current
const EMERGENCY_FUND_TARGET = DEMO_THREAD.emergencyFund.target

/* ── AuroraPulse ── */
function AuroraPulse({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background: `radial-gradient(70% 50% at 50% 0%, ${color}0F, transparent), radial-gradient(40% 40% at 80% 20%, ${color}08, transparent)`,
        animation: "aurora-drift 8s ease-in-out infinite alternate",
      }}
    />
  )
}

/* ── GovernFooter ── */
function GovernFooter({ auditId, pageContext }: { auditId: string; pageContext: string }) {
  return (
    <footer
      className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/[0.06] px-4 py-3 md:px-6 md:py-4"
      style={{ background: "rgba(255,255,255,0.03)" }}
      role="contentinfo"
      aria-label="Governance verification footer"
    >
      <div className="flex items-center gap-3">
        <Scale size={14} style={{ color: "var(--engine-govern)" }} />
        <span className="text-xs" style={{ color: "#94A3B8" }}>
          Every decision on this page is logged to the immutable audit ledger.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "#64748B" }}>
          {auditId}
        </span>
        <Link
          to="/govern/audit"
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--engine-govern)" }}
        >
          Open ledger
        </Link>
      </div>
    </footer>
  )
}

/* ── Forecast data (goal-specific) ── */
const FORECAST_DATA: ForecastPoint[] = Array.from({ length: 12 }, (_, i) => ({
  x: i,
  median: EMERGENCY_FUND_CURRENT + i * 250,
  low: EMERGENCY_FUND_CURRENT + i * 180,
  high: EMERGENCY_FUND_CURRENT + i * 320,
}))

/* ── Monthly contribution data ── */
const CONTRIBUTIONS = [
  { month: "Oct", amount: 350 },
  { month: "Nov", amount: 380 },
  { month: "Dec", amount: 360 },
  { month: "Jan", amount: 420 },
  { month: "Feb", amount: 420 },
]

export default function GrowGoalPage() {
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (EMERGENCY_FUND_PROGRESS / 100) * circumference

  return (
    <div className="relative">
      <AuroraPulse color="var(--engine-grow)" />
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
        {/* ── P1: Goal Progress Summary ── */}
        <motion.section variants={staggerContainer} className="px-4 md:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
            <Link to="/grow" className="flex items-center gap-1 text-xs font-medium" style={{ color: "#64748B" }}>
              <ArrowLeft size={14} />
              Back to Grow
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-surface rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8">
            {/* Progress ring */}
            <div className="relative flex-shrink-0">
              <svg width={100} height={100} className="-rotate-90">
                <circle cx={50} cy={50} r={40} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
                <circle
                  cx={50} cy={50} r={40}
                  fill="none"
                  stroke="var(--engine-grow)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold font-mono" style={{ color: "#F1F5F9" }}>{EMERGENCY_FUND_PROGRESS}%</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} style={{ color: "var(--engine-grow)" }} />
                <h1 className="text-xl font-bold" style={{ color: "#F1F5F9" }}>Emergency fund</h1>
              </div>
              <p className="text-sm mb-1" style={{ color: "#94A3B8" }}>
                ${EMERGENCY_FUND_CURRENT.toLocaleString()} of ${EMERGENCY_FUND_TARGET.toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: "#64748B" }}>
                At current pace, you will reach your target in approximately 3 months.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* ── P2: Contribution Timeline + Forecast ── */}
        <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-6 lg:px-8">
          {/* Contribution timeline */}
          <motion.div variants={fadeUp} className="flex-1 glass-surface rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#64748B" }}>
              Recent contributions
            </p>
            <div className="flex flex-col gap-3">
              {CONTRIBUTIONS.map((c) => (
                <div key={c.month} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "#CBD5E1" }}>{c.month} 2026</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(c.amount / 450) * 100}%`,
                          background: "var(--engine-grow)",
                        }}
                      />
                    </div>
                    <span className="text-sm font-mono font-semibold w-14 text-right" style={{ color: "#F1F5F9" }}>
                      ${c.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Forecast */}
          <motion.div variants={fadeUp} className="lg:w-80 glass-surface rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#64748B" }}>
              Projected path
            </p>
            <ForecastBand data={FORECAST_DATA} width={280} height={80} engine="grow" className="w-full" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] font-mono" style={{ color: "#94A3B8" }}>Now</span>
              <span className="text-[10px] font-mono" style={{ color: "#94A3B8" }}>+12 months</span>
            </div>
          </motion.div>
        </div>

        {/* ── P3: Goal Adjustment Action ── */}
        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <div className="glass-surface rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>
                Adjust your savings pace
              </p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                Increasing your monthly transfer by $60 would accelerate your target by 3 weeks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/grow"
                className="text-sm font-medium px-4 py-2 rounded-xl"
                style={{ color: "#94A3B8" }}
              >
                Back to grow
              </Link>
              {/* CTA: Primary -> /execute */}
              <Link
                to="/execute"
                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
                  color: "#0B1221",
                }}
              >
                Adjust goal
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* GovernFooter */}
        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter
            auditId={GOVERNANCE_META['/grow/goal'].auditId}
            pageContext={GOVERNANCE_META['/grow/goal'].pageContext}
          />
        </div>
      </motion.main>
    </div>
  )
}
