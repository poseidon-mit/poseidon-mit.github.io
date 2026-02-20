/**
 * ExecuteGlance — Glance-mode: single critical action with approve/reject.
 */
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { CitationCard, CountUp } from '@/components/poseidon'
import { Surface, Button } from '@/design-system'
import { executeCitations } from './execute-data'
import { DEMO_THREAD } from '@/lib/demo-thread'

export function ExecuteGlance() {
  return (
    <motion.section
      variants={staggerContainer}
      className="flex flex-col gap-4"
      aria-label="Critical actions overview"
    >
      {/* Primary action card */}
      <motion.div variants={fadeUp}>
        <CitationCard
          summary={`Block wire transfer to ${DEMO_THREAD.criticalAlert.merchant} — fraud score ${DEMO_THREAD.criticalAlert.confidence.toFixed(2)}, elevated anomaly threshold exceeded. Immediate action required.`}
          sources={executeCitations}
          confidence={DEMO_THREAD.criticalAlert.confidence}
          accentColor="var(--engine-execute)"
          viewMode="glance"
        />
      </motion.div>

      {/* Quick action buttons */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          engine="execute"
          size="md"
          className="rounded-xl"
          icon={<CheckCircle2 size={18} />}
        >
          Approve
        </Button>
        <Button
          variant="secondary"
          engine="execute"
          size="md"
          className="rounded-xl"
          icon={<XCircle size={18} />}
        >
          Reject
        </Button>
      </motion.div>

      {/* Summary stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
        <Surface variant="glass" padding="md" className="flex flex-col items-center gap-1 glass-hover-execute">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Pending</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--engine-execute)' }}>
            <CountUp value={DEMO_THREAD.pendingActions} />
          </span>
        </Surface>
        <Surface variant="glass" padding="md" className="flex flex-col items-center gap-1 glass-hover-execute">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Approved Today</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--state-healthy)' }}>
            <CountUp value={7} />
          </span>
        </Surface>
        <Surface variant="glass" padding="md" className="flex flex-col items-center gap-1 glass-hover-execute">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Auto-executed</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--engine-govern)' }}>
            <CountUp value={12} />
          </span>
        </Surface>
      </motion.div>
    </motion.section>
  )
}

ExecuteGlance.displayName = 'ExecuteGlance'
