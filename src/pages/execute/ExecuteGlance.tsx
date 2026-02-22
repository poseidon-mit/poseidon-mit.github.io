/**
 * ExecuteGlance — Glance-mode: single critical action with approve/reject.
 */
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { CitationCard, CountUp } from '@/components/poseidon'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
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
        <button
          className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-xl px-5 py-2.5 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all bg-[var(--engine-execute)] text-black border-none font-semibold flex items-center cursor-pointer")}
        >
          <CheckCircle2 size={18} className="mr-2" />
          Approve
        </button>
        <button
          className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "rounded-xl px-5 py-2.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center cursor-pointer")}
        >
          <XCircle size={18} className="mr-2" />
          Reject
        </button>
      </motion.div>

      {/* Summary stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
        <div className="relative overflow-hidden rounded-[24px] p-6 border border-white/[0.04] backdrop-blur-2xl bg-black/40 shadow-xl flex flex-col items-center gap-1 hover:border-[var(--engine-execute)]/30 transition-colors">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Pending</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--engine-execute)' }}>
            <CountUp value={DEMO_THREAD.pendingActions} />
          </span>
        </div>
        <div className="relative overflow-hidden rounded-[24px] p-6 border border-white/[0.04] backdrop-blur-2xl bg-black/40 shadow-xl flex flex-col items-center gap-1 hover:border-[var(--engine-execute)]/30 transition-colors">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Approved Today</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--state-healthy)' }}>
            <CountUp value={7} />
          </span>
        </div>
        <div className="relative overflow-hidden rounded-[24px] p-6 border border-white/[0.04] backdrop-blur-2xl bg-black/40 shadow-xl flex flex-col items-center gap-1 hover:border-[var(--engine-execute)]/30 transition-colors">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Auto-executed</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--engine-govern)' }}>
            <CountUp value={12} />
          </span>
        </div>
      </motion.div>
    </motion.section>
  )
}

ExecuteGlance.displayName = 'ExecuteGlance'
