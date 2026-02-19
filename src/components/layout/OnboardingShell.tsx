import type { ReactNode } from 'react'
import { CheckCircle2, Shield, TrendingUp, Zap, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'

const STEP_ITEMS = [
  { id: 1, label: 'Connect sources', icon: Shield },
  { id: 2, label: 'Define priorities', icon: TrendingUp },
  { id: 3, label: 'Set consent bounds', icon: Scale },
  { id: 4, label: 'Activate engines', icon: Zap },
] as const

export interface OnboardingShellProps {
  step: number
  title: string
  subtitle: string
  children: ReactNode
  className?: string
  showProgress?: boolean
}

export function OnboardingShell({
  step,
  title,
  subtitle,
  children,
  className,
  showProgress = true,
}: OnboardingShellProps) {
  const activeStep = Math.max(1, Math.min(step, STEP_ITEMS.length))

  return (
    <main id="main-content" className={cn('relative min-h-screen app-bg-depth overflow-x-hidden', className)}>
      <a
        href="#onboarding-shell-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[var(--engine-dashboard)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0B1221]"
      >
        Skip to main content
      </a>

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_14%_15%,rgba(0,240,255,0.12),transparent_56%),radial-gradient(ellipse_at_84%_72%,rgba(139,92,246,0.08),transparent_62%)]"
        aria-hidden="true"
      />

      <div id="onboarding-shell-content" className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[0.95fr,1.05fr] lg:gap-12">
          <aside className="hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">POSEIDON ONBOARDING</p>
            <h1 className="mt-4 max-w-sm text-balance font-display text-4xl font-semibold leading-[1.03] tracking-[var(--tracking-h2)] text-slate-100">
              Activate your four-engine financial OS
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Complete each step to unlock explainable recommendations, consent-first execution, and full governance lineage.
            </p>

            <ol className="mt-8 space-y-3">
              {STEP_ITEMS.map((item) => {
                const isDone = item.id < activeStep
                const isCurrent = item.id === activeStep
                return (
                  <li
                    key={item.id}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors',
                      isCurrent
                        ? 'border-[var(--engine-dashboard)]/35 bg-[var(--engine-dashboard)]/10 text-slate-100'
                        : 'border-white/10 bg-white/[0.02] text-slate-400',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-8 w-8 items-center justify-center rounded-lg border',
                        isCurrent || isDone
                          ? 'border-[var(--engine-dashboard)]/35 bg-[var(--engine-dashboard)]/15 text-[var(--engine-dashboard)]'
                          : 'border-white/12 bg-white/[0.04] text-slate-500',
                      )}
                    >
                      {isDone ? <CheckCircle2 className="h-4.5 w-4.5" aria-hidden="true" /> : <item.icon className="h-4.5 w-4.5" aria-hidden="true" />}
                    </span>
                    <span>{item.label}</span>
                  </li>
                )
              })}
            </ol>
          </aside>

          <section className="glass-surface-card rounded-3xl p-7 md:p-9">
            {showProgress ? <OnboardingProgress step={activeStep} /> : null}
            <h2 className="font-display text-3xl font-semibold tracking-[var(--tracking-h2)] text-slate-100 md:text-4xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default OnboardingShell
