import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/router'
import { Shield, TrendingUp, PiggyBank, Target, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OnboardingShell } from '@/components/layout/OnboardingShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'

type GoalTone = 'protect' | 'grow' | 'execute' | 'dashboard'

const GOALS: ReadonlyArray<{ id: string; icon: typeof Shield; label: string; desc: string; tone: GoalTone }> = [
  { id: 'protect', icon: Shield, label: 'Protect my money', desc: 'Detect fraud, block threats, monitor risk', tone: 'protect' },
  { id: 'grow', icon: TrendingUp, label: 'Grow my wealth', desc: 'Optimize savings and hit financial milestones', tone: 'grow' },
  { id: 'save', icon: PiggyBank, label: 'Build emergency fund', desc: 'Automated savings toward a safety buffer', tone: 'execute' },
  { id: 'invest', icon: Target, label: 'Invest smarter', desc: 'Scenario-aware portfolio optimization', tone: 'dashboard' },
]

const TONE_CLASSES: Record<GoalTone, { icon: string; bg: string; border: string }> = {
  protect: {
    icon: 'text-[var(--engine-protect)]',
    bg: 'bg-[var(--engine-protect)]/12',
    border: 'border-[var(--engine-protect)]/40',
  },
  grow: {
    icon: 'text-[var(--engine-grow)]',
    bg: 'bg-[var(--engine-grow)]/12',
    border: 'border-[var(--engine-grow)]/40',
  },
  execute: {
    icon: 'text-[var(--engine-execute)]',
    bg: 'bg-[var(--engine-execute)]/12',
    border: 'border-[var(--engine-execute)]/40',
  },
  dashboard: {
    icon: 'text-[var(--engine-dashboard)]',
    bg: 'bg-[var(--engine-dashboard)]/12',
    border: 'border-[var(--engine-dashboard)]/40',
  },
}

export default function OnboardingGoalsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['protect']))

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <OnboardingShell
      step={2}
      title="What matters most to you?"
      subtitle="Pick your priorities. Poseidon tunes recommendations and guardrails around these goals, and you can edit anytime."
    >
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GOALS.map((goal) => {
            const isSelected = selected.has(goal.id)
            const tone = TONE_CLASSES[goal.tone]

            return (
              <motion.button
                key={goal.id}
                type="button"
                variants={fadeUp}
                onClick={() => toggle(goal.id)}
                className={cn(
                  'glass-surface relative rounded-xl border p-4 text-left transition-colors',
                  isSelected ? cn('bg-white/[0.04]', tone.border) : 'border-white/10 bg-white/[0.02] hover:border-white/20',
                )}
              >
                {isSelected ? (
                  <span className={cn('absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full text-[#0B1221]', tone.bg)}>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                ) : null}

                <span className={cn('inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10', tone.bg, tone.icon)}>
                  <goal.icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <p className="mt-3 text-sm font-semibold text-slate-100">{goal.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{goal.desc}</p>
              </motion.button>
            )
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-7 flex items-center justify-between">
          <Link to="/onboarding/connect" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>

          <Link
            to="/onboarding/consent"
            aria-disabled={selected.size === 0}
            tabIndex={selected.size === 0 ? -1 : 0}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-opacity',
              selected.size > 0
                ? 'cta-primary-glow bg-gradient-to-r from-teal-400 to-cyan-300 text-[#0B1221]'
                : 'cursor-not-allowed bg-white/[0.06] text-slate-500',
            )}
          >
            Continue to consent
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </OnboardingShell>
  )
}
