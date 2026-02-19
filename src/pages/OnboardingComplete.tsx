import { motion } from 'framer-motion'
import { Link } from '@/router'
import { CheckCircle2, Shield, TrendingUp, Zap, Scale, ArrowRight } from 'lucide-react'
import { OnboardingShell } from '@/components/layout/OnboardingShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'

type ReadyTone = 'protect' | 'grow' | 'execute' | 'govern'

const READY_ITEMS: ReadonlyArray<{ icon: typeof Shield; label: string; desc: string; tone: ReadyTone }> = [
  { icon: Shield, label: 'Protect engine', desc: 'Monitoring for threats', tone: 'protect' },
  { icon: TrendingUp, label: 'Grow engine', desc: 'Tracking goals', tone: 'grow' },
  { icon: Zap, label: 'Execute engine', desc: 'Ready for approvals', tone: 'execute' },
  { icon: Scale, label: 'Govern engine', desc: 'Audit trail active', tone: 'govern' },
]

const TONE_CLASSES: Record<ReadyTone, { text: string; bg: string }> = {
  protect: { text: 'text-[var(--engine-protect)]', bg: 'bg-[var(--engine-protect)]/14' },
  grow: { text: 'text-[var(--engine-grow)]', bg: 'bg-[var(--engine-grow)]/14' },
  execute: { text: 'text-[var(--engine-execute)]', bg: 'bg-[var(--engine-execute)]/14' },
  govern: { text: 'text-[var(--engine-govern)]', bg: 'bg-[var(--engine-govern)]/14' },
}

export default function OnboardingCompletePage() {
  return (
    <OnboardingShell
      step={4}
      title="You're all set"
      subtitle="Your engines are active and decisions now flow through explainable recommendations, consent-first execution, and governance proof."
    >
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={fadeUp} className="mb-6 flex justify-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--state-healthy)]/30 bg-[var(--state-healthy)]/14 text-[var(--state-healthy)]">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {READY_ITEMS.map((item) => {
            const tone = TONE_CLASSES[item.tone]
            return (
              <motion.div key={item.label} variants={fadeUp} className="glass-surface rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tone.bg} ${tone.text}`}>
                    <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-100">{item.label}</p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="glass-surface mt-6 rounded-xl border border-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Setup summary</p>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Accounts connected</span>
              <span className="font-mono font-semibold text-slate-100">3</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Goals selected</span>
              <span className="font-mono font-semibold text-slate-100">2</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Consent boundaries</span>
              <span className="font-mono font-semibold text-[var(--state-healthy)]">All set</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-7">
          <Link
            to="/dashboard"
            className="cta-primary-glow inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-300 px-8 py-3 text-sm font-semibold text-[#0B1221]"
          >
            Enter dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </OnboardingShell>
  )
}
