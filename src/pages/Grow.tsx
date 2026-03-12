import { motion } from "framer-motion";
import { TrendingUp, Landmark, Shield, CreditCard, Lock, Building2, Gift, Sparkles, ArrowRight, Activity, Percent } from "lucide-react";
import { Link } from "@/router";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion-presets";
import { usePageTitle } from "@/hooks/use-page-title";
import { FractalTrajectory } from "@/components/poseidon/FractalTrajectory";
import { formatUsd } from "@/domain/poseidon-universe";

const MOCK_STRATEGIES = [
  { id: "REC-001", title: "Mega Backdoor Roth Conversion", action: "Route post-tax to Roth IRA", amount: 8200, tags: ["Tax-Free", "Complex"], icon: Building2 },
  { id: "REC-002", title: "Tax-Loss Harvesting", action: "Offset Tech Sector Cap Gains", amount: 4500, tags: ["Tax", "Automated"], icon: TrendingUp },
  { id: "REC-003", title: "Optimize 401k Match Limit", action: "Increase contribution +4%", amount: 4800, tags: ["Retirement", "Employer"], icon: Landmark },
  { id: "REC-004", title: "Private Credit Allocation", action: "Move $50k from low-yield bonds", amount: 3500, tags: ["Alternative", "Yield"], icon: Target },
  { id: "REC-005", title: "CD Ladder Strategy", action: "Lock $25k at 5.45%", amount: 1362, tags: ["Fixed Income", "Illiquid"], icon: Lock },
  { id: "REC-006", title: "Credit Card Rewards Optimization", action: "Switch daily spend to premium tier", amount: 1250, tags: ["Rewards", "Habit"], icon: Gift },
  { id: "REC-007", title: "Refinance Auto Loan", action: "Drop rate 6.5% -> 4.2%", amount: 1200, tags: ["Liability", "Paperwork"], icon: Activity },
  { id: "REC-008", title: "Sweep Idle Cash to HYSA", action: "Move $15k to Wealthfront", amount: 750, tags: ["Zero Risk", "Liquid"], icon: Percent },
  { id: "REC-009", title: "Cancel Latent Subscriptions", action: "9 unused services found", amount: 420, tags: ["Cashflow", "Quick Win"], icon: CreditCard },
];

function Target(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
}

export default function Grow() {
  usePageTitle("Grow");

  const totalOpportunity = MOCK_STRATEGIES.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="w-full h-[calc(100dvh-9.5rem-env(safe-area-inset-bottom,0px))] lg:h-[calc(100dvh-5rem)] flex flex-col overflow-hidden bg-[#0A1628] text-white p-4 md:p-6 lg:p-8">
      <motion.div
        className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 md:gap-6 min-h-0"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT COLUMN: FRACTAL TRAJECTORY & OMNI-GROWTH STATUS */}
        <motion.div
          variants={staggerItem}
          className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md p-8 md:p-10"
        >
          {/* Subtle violet highlight at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <span className="flex h-8 items-center rounded-full bg-[var(--engine-grow)]/10 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--engine-grow)] border border-[var(--engine-grow)]/20 backdrop-blur-md">
              <Sparkles size={12} className="mr-2" />
              YIELD OPTIMIZATION ACTIVE
            </span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-8">
            <div className="w-full max-w-[500px] aspect-[5/4] relative">
              <FractalTrajectory />
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white leading-none drop-shadow-xl mb-4">
              9 Strategies <br/><span className="text-[var(--engine-grow)]">Prepared</span>
            </h1>
            <div className="flex items-end gap-6 text-white/50">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold mb-1">Total Opportunity</p>
                <p className="text-3xl font-mono text-white font-semibold flex items-baseline gap-1">
                  +{formatUsd(totalOpportunity)} <span className="text-base text-white/40">/ yr</span>
                </p>
              </div>
              <div className="hidden sm:block pb-1">
                <p className="text-xs uppercase tracking-widest font-semibold mb-1">Avg Confidence</p>
                <p className="text-xl font-mono text-white/80">92.4%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: STRATEGY QUEUE */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/20">
            <div>
              <h2 className="text-xl font-semibold tracking-wide flex items-center gap-2">
                <TrendingUp className="text-[var(--engine-grow)]" /> 
                Wealth Generation Pipelines
              </h2>
              <p className="text-sm text-white/50 mt-1">
                Poseidon has engineered 9 autonomous strategies awaiting approval.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
            {MOCK_STRATEGIES.map((strategy, idx) => {
              const Icon = strategy.icon;
              return (
                <div 
                  key={strategy.id} 
                  className={`group relative flex flex-col rounded-2xl border ${idx === 0 ? 'bg-[var(--engine-grow)]/10 border-[var(--engine-grow)]/30' : 'bg-black/20 border-white/5'} p-4 transition-colors hover:bg-white/10`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-[var(--engine-grow)]/20 text-[var(--engine-grow)]' : 'bg-white/10 text-white/60'}`}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-semibold ${idx === 0 ? 'text-[var(--engine-grow)]' : 'text-white/90'}`}>
                            {strategy.title}
                          </h3>
                        </div>
                        <p className="text-xs text-white/50 mt-1">{strategy.action}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {strategy.tags.map(t => (
                            <span key={t} className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 text-white/40 px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-semibold font-mono ${idx === 0 ? 'text-[var(--engine-grow)]' : 'text-white/80'}`}>+{formatUsd(strategy.amount)}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">/ year</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 md:p-6 pt-2 shrink-0">
            <Link
              to="/execute"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--engine-grow)]/20 border border-[var(--engine-grow)]/30 py-4 text-sm font-bold tracking-wide transition hover:bg-[var(--engine-grow)]/30 text-[var(--engine-grow)]"
            >
              DEPLOY ALL 9 STRATEGIES <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
