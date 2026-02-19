import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/router'
import { ArrowRight, ArrowLeft, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OnboardingShell } from '@/components/layout/OnboardingShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'

interface ConsentItem {
  id: string
  label: string
  desc: string
  required: boolean
}

const CONSENT_ITEMS: ConsentItem[] = [
  {
    id: 'analyze',
    label: 'Analyze my transactions',
    desc: 'Allow AI engines to process financial data for threat detection and opportunity analysis.',
    required: true,
  },
  {
    id: 'recommend',
    label: 'Generate recommendations',
    desc: 'Allow suggestions for transfers, budget updates, and portfolio actions.',
    required: false,
  },
  {
    id: 'approve',
    label: 'Require my approval before acting',
    desc: 'Every automated action must be explicitly approved before execution.',
    required: true,
  },
  {
    id: 'notifications',
    label: 'Send real-time alerts',
    desc: 'Receive alerts for threats, opportunities, and pending approvals.',
    required: false,
  },
]

export default function OnboardingConsentPage() {
  const [consents, setConsents] = useState<Record<string, boolean>>({
    analyze: true,
    recommend: true,
    approve: true,
    notifications: true,
  })

  const toggle = (id: string) => {
    const item = CONSENT_ITEMS.find((entry) => entry.id === id)
    if (item?.required) return
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <OnboardingShell
      step={3}
      title="Set your consent boundaries"
      subtitle="Control exactly what Poseidon can do. All decisions remain explainable, auditable, and reversible."
    >
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={staggerContainer} className="space-y-3">
          {CONSENT_ITEMS.map((item) => {
            const enabled = consents[item.id]
            return (
              <motion.div key={item.id} variants={fadeUp} className="glass-surface rounded-xl border border-white/10 p-4">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                      {item.required ? (
                        <span className="rounded-full border border-[var(--engine-dashboard)]/35 bg-[var(--engine-dashboard)]/12 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--engine-dashboard)]">
                          Required
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={cn(
                      'relative mt-1 h-6 w-11 rounded-full border transition-colors',
                      enabled
                        ? 'border-[var(--engine-dashboard)]/40 bg-[var(--engine-dashboard)]'
                        : 'border-white/12 bg-white/10',
                      item.required ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
                    )}
                    aria-checked={enabled}
                    aria-label={item.label}
                    role="switch"
                    disabled={item.required}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 h-5 w-5 rounded-full bg-[#0B1221] transition-transform',
                        enabled ? 'translate-x-[1.3rem]' : 'translate-x-[2px]',
                      )}
                    />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="glass-surface mt-6 rounded-xl border border-white/10 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4.5 w-4.5 text-[var(--engine-dashboard)]" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-slate-300">
              All actions are logged in an immutable audit ledger. You can review, reverse, or dispute outcomes at any time in Govern.
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-7 flex items-center justify-between">
          <Link to="/onboarding/goals" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>

          <Link
            to="/onboarding/complete"
            className="cta-primary-glow inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-300 px-6 py-2.5 text-sm font-semibold text-[#0B1221]"
          >
            Activate Poseidon
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </OnboardingShell>
  )
}
