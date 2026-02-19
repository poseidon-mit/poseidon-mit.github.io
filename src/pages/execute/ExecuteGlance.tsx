/**
 * ExecuteGlance — Glance-mode: single critical action with approve/reject.
 */
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { GlassCard, CitationCard, CountUp } from '@/components/poseidon'
import { executeCitations } from './execute-data'
import { DEMO_THREAD } from '@/lib/demo-thread'

export function ExecuteGlance() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
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
        <button
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #14B8A6, #0D9488)', color: '#04141a', minHeight: '48px' }}
        >
          <CheckCircle2 size={18} />
          Approve
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:shadow-[0_0_12px_rgba(var(--state-critical-rgb),0.3)] active:scale-[0.98] cursor-pointer"
          style={{ borderColor: 'rgba(var(--state-critical-rgb),0.4)', color: 'var(--state-critical)', background: 'transparent', minHeight: '48px' }}
        >
          <XCircle size={18} />
          Reject
        </button>
      </motion.div>

      {/* Summary stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
        <GlassCard className="flex flex-col items-center gap-1 py-4 glass-hover-execute">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Pending</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--engine-execute)' }}>
            <CountUp value={DEMO_THREAD.pendingActions} />
          </span>
        </GlassCard>
        <GlassCard className="flex flex-col items-center gap-1 py-4 glass-hover-execute">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Approved Today</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--state-healthy)' }}>
            <CountUp value={7} />
          </span>
        </GlassCard>
        <GlassCard className="flex flex-col items-center gap-1 py-4 glass-hover-execute">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Auto-executed</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--engine-govern)' }}>
            <CountUp value={12} />
          </span>
        </GlassCard>
      </motion.div>
    </motion.section>
  )
}

ExecuteGlance.displayName = 'ExecuteGlance'
