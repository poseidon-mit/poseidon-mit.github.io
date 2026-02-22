/**
 * GovernGlance — Glance-mode: big numbers + trust summary.
 */
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { CountUp } from '@/components/poseidon'

export function GovernGlance() {
  return (
    <motion.section
      variants={staggerContainer}
      className="flex flex-col gap-4"
      aria-label="Governance overview"
    >
      {/* Big number hero */}
      <motion.div variants={fadeUp}>
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 flex flex-col items-center gap-3 transition-colors hover:bg-white/[0.02]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-3 w-full">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'rgba(59,130,246,0.12)' }}
            >
              <ShieldCheck size={24} style={{ color: 'var(--engine-govern)' }} />
            </div>
            <span className="text-4xl md:text-5xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
              <CountUp value={847} />
            </span>
            <span className="text-sm font-medium" style={{ color: '#CBD5E1' }}>
              decisions fully audited
            </span>
            <span className="text-xs" style={{ color: 'var(--engine-govern)' }}>100% traceable</span>
          </div>
        </div>
      </motion.div>

      {/* Trust metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div variants={fadeUp}>
          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-lg p-4 flex flex-col items-center gap-1 transition-colors hover:bg-white/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Confidence</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--state-healthy)' }}>
                <CountUp value={97} suffix="%" />
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp}>
          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-lg p-4 flex flex-col items-center gap-1 transition-colors hover:bg-white/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Verified</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--engine-govern)' }}>
                <CountUp value={812} />
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp}>
          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-lg p-4 flex flex-col items-center gap-1 transition-colors hover:bg-white/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Pending</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--state-warning)' }}>
                <CountUp value={28} />
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp}>
          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-lg p-4 flex flex-col items-center gap-1 transition-colors hover:bg-white/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-wider" style={{ color: '#64748B' }}>Flagged</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--state-critical)' }}>
                <CountUp value={7} />
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

GovernGlance.displayName = 'GovernGlance'
