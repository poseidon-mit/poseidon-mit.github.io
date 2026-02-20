/**
 * ProtectGlance — Glance-mode view for Protect engine.
 * Shows 3 large signal cards with severity, amount, and confidence.
 */
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { SeverityBadge, ConfidenceIndicator } from '@/components/poseidon'
import { signals } from './protect-data'
import { Surface } from '@/design-system'

export function ProtectGlance() {
  return (
    <motion.section
      variants={staggerContainer}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      aria-label="Signal overview"
    >
      {signals.map((signal) => (
        <motion.div key={signal.id} variants={fadeUp}>
          <Surface variant="glass" padding="none" className="flex flex-col gap-4 glass-hover-protect">
            <div className="flex items-center justify-between">
              <SeverityBadge severity={signal.severity} />
              <ConfidenceIndicator value={signal.confidence} accentColor="var(--engine-protect)" />
            </div>
            <h3 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
              {signal.title}
            </h3>
            <div className="flex items-end justify-between">
              <span className="text-2xl md:text-3xl font-bold font-mono tabular-nums" style={{ color: '#F1F5F9' }}>
                {signal.amount}
              </span>
              <span className="text-xs" style={{ color: '#64748B' }}>{signal.merchant}</span>
            </div>
          </Surface>
        </motion.div>
      ))}
    </motion.section>
  )
}

ProtectGlance.displayName = 'ProtectGlance'
