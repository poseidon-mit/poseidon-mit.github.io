import { motion } from 'framer-motion'
import { Link } from '@/router'
import { Shield, TrendingUp, PiggyBank, Target, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OnboardingShell } from '@/components/layout/OnboardingShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Button, ButtonLink } from '@/design-system'
import { useDemoState } from '@/lib/demo-state/provider'

type GoalTone = 'protect' | 'grow' | 'execute' | 'dashboard'

const GOALS: ReadonlyArray<{ id: string; icon: typeof Shield; label: string; desc: string; tone: GoalTone }> = [
  { id: 'protect', icon: Shield, label: 'Protect my money', desc: 'Detect fraud, block threats, monitor risk', tone: 'protect' },
  { id: 'grow', icon: TrendingUp, label: 'Grow my wealth', desc: 'Optimize savings and hit financial milestones', tone: 'grow' },
  { id: 'save', icon: PiggyBank, label: 'Build emergency fund', desc: 'Automated savings toward a safety buffer', tone: 'execute' },
  { id: 'invest', icon: Target, label: 'Invest smarter', desc: 'Scenario-aware portfolio optimization', tone: 'dashboard' },
]

const TONE_CLASSES: Record<GoalTone, { icon: string; bg: string; border: string; checkBg: string; checkIcon: string; checkGlow: string }> = {
  protect: {
    icon: 'text-[var(--engine-protect)]',
    bg: 'bg-[var(--engine-protect)]/12',
    border: 'border-[var(--engine-protect)]/40',
    checkBg: 'bg-[var(--engine-protect)]',
    checkIcon: 'text-white',
    checkGlow: 'shadow-[0_0_16px_rgba(34,197,94,0.55)]',
  },
  grow: {
    icon: 'text-[var(--engine-grow)]',
    bg: 'bg-[var(--engine-grow)]/12',
    border: 'border-[var(--engine-grow)]/40',
    checkBg: 'bg-[var(--engine-grow)]',
    checkIcon: 'text-white',
    checkGlow: 'shadow-[0_0_16px_rgba(139,92,246,0.55)]',
  },
  execute: {
    icon: 'text-[var(--engine-execute)]',
    bg: 'bg-[var(--engine-execute)]/12',
    border: 'border-[var(--engine-execute)]/40',
    checkBg: 'bg-[var(--engine-execute)]',
    checkIcon: 'text-slate-950',
    checkGlow: 'shadow-[0_0_16px_rgba(234,179,8,0.55)]',
  },
  dashboard: {
    icon: 'text-[var(--engine-dashboard)]',
    bg: 'bg-[var(--engine-dashboard)]/12',
    border: 'border-[var(--engine-dashboard)]/40',
    checkBg: 'bg-[var(--engine-dashboard)]',
    checkIcon: 'text-slate-950',
    checkGlow: 'shadow-[0_0_16px_rgba(0,240,255,0.55)]',
  },
}

export default function OnboardingGoalsPage() {
  const { state, updateOnboarding } = useDemoState()
  const selected = new Set(state.onboarding.selectedGoals)

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    updateOnboarding({ selectedGoals: Array.from(next) })
  }

  return (
    <OnboardingShell
      step={2}
      title="What matters most to you?"
      subtitle="Pick your priorities. Poseidon tunes recommendations and guardrails around these goals, and you can edit anytime."
    >
      <div>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GOALS.map((goal) => {
            const isSelected = selected.has(goal.id)
            const tone = TONE_CLASSES[goal.tone]

            return (
              <motion.div
                key={goal.id}
                variants={fadeUp}
              >
                <Button
                  type="button"
                  variant="glass"
                  engine="dashboard"
                  onClick={() => toggle(goal.id)}
                  fullWidth
                  className={cn(
                    'relative rounded-xl border p-4 text-left transition-colors !h-auto !min-h-0 justify-start',
                    isSelected ? cn('bg-white/[0.04]', tone.border) : 'border-white/10 bg-white/[0.02] hover:border-white/20',
                  )}
                >
                  {isSelected ? (
                    <span className={cn('absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-white/20', tone.checkBg, tone.checkIcon, tone.checkGlow)}>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  ) : null}

                  <span className={cn('inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10', tone.bg, tone.icon)}>
                    <goal.icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <p className="mt-3 text-sm font-semibold text-slate-100">{goal.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{goal.desc}</p>
                </Button>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-7 flex items-center justify-between">
          <Link to="/onboarding/connect" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>

          <ButtonLink
            to="/onboarding/consent"
            variant="primary"
            engine="dashboard"
            springPress={selected.size > 0}
            className={cn('rounded-xl', selected.size > 0 ? '' : 'pointer-events-none opacity-50')}
          >
            Continue to consent
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </motion.div>
        </motion.div>
      </div>
    </OnboardingShell>
  )
}
