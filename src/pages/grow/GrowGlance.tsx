/**
 * GrowGlance — Glance-mode view: big net worth target + goal progress bars.
 */
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { CountUp, ConfidenceIndicator } from '@/components/poseidon'
import { goals } from './grow-data'

export function GrowGlance() {
  return (
    <motion.section
      variants={staggerContainer}
      className="flex flex-col gap-4"
      aria-label="Growth overview"
    >
      {/* Big number hero */}
      <motion.div variants={fadeUp}>
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 flex flex-col items-center gap-2 transition-colors hover:bg-white/[0.02]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-2 w-full">
            <span className="text-xs uppercase tracking-wider font-medium" style={{ color: '#64748B' }}>
              Target Net Worth
            </span>
            <span className="text-4xl md:text-5xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
              <CountUp value={2.4} decimals={1} prefix="$" suffix="M" />
            </span>
            <span className="text-sm" style={{ color: 'var(--engine-grow)' }}>On track for 2 of 3 goals</span>
          </div>
        </div>
      </motion.div>

      {/* Goal progress bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <motion.div key={goal.id} variants={fadeUp}>
            <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-lg p-5 flex flex-col gap-3 transition-colors hover:bg-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{goal.name}</h3>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
                    style={{
                      background: goal.status === 'On track' ? 'rgba(16,185,129,0.12)' : goal.status === 'Ahead' ? 'rgba(139,92,246,0.12)' : 'rgba(var(--state-warning-rgb),0.12)',
                      color: goal.status === 'On track' ? 'var(--state-healthy)' : goal.status === 'Ahead' ? 'var(--engine-grow)' : 'var(--state-warning)',
                    }}
                  >
                    {goal.status}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${goal.progress}%`, background: 'var(--engine-grow)' }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: '#64748B' }}>
                  <span>{goal.current} / {goal.target}</span>
                  <ConfidenceIndicator value={goal.confidence} accentColor="var(--engine-grow)" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

GrowGlance.displayName = 'GrowGlance'
