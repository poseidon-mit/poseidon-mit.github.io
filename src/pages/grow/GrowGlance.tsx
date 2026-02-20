/**
 * GrowGlance — Glance-mode view: big net worth target + goal progress bars.
 */
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { CountUp, ConfidenceIndicator } from '@/components/poseidon'
import { goals } from './grow-data'
import { Surface } from '@/design-system'

export function GrowGlance() {
  return (
    <motion.section
      variants={staggerContainer}
      className="flex flex-col gap-4"
      aria-label="Growth overview"
    >
      {/* Big number hero */}
      <motion.div variants={fadeUp}>
        <Surface variant="glass" padding="none" className="flex flex-col items-center gap-2 py-8 glass-hover-grow">
          <span className="text-xs uppercase tracking-wider font-medium" style={{ color: '#64748B' }}>
            Target Net Worth
          </span>
          <span className="text-4xl md:text-5xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
            <CountUp value={2.4} decimals={1} prefix="$" suffix="M" />
          </span>
          <span className="text-sm" style={{ color: 'var(--engine-grow)' }}>On track for 2 of 3 goals</span>
        </Surface>
      </motion.div>

      {/* Goal progress bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <motion.div key={goal.id} variants={fadeUp}>
            <Surface variant="glass" padding="none" className="flex flex-col gap-3 glass-hover-grow">
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
            </Surface>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

GrowGlance.displayName = 'GrowGlance'
