import type { ReactNode } from 'react'
import { Waves, Shield, Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AuthShellFeature {
  icon: LucideIcon
  label: string
}

export interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
  className?: string
  formClassName?: string
  eyebrow?: string
  heading?: string
  description?: string
  features?: AuthShellFeature[]
}

const DEFAULT_FEATURES: AuthShellFeature[] = [
  { icon: Shield, label: 'Encrypted end-to-end' },
  { icon: Lock, label: 'Every session fully auditable' },
]

export function AuthShell({
  title,
  subtitle,
  children,
  className,
  formClassName,
  eyebrow = 'POSEIDON FINANCIAL OS',
  heading = 'Trusted financial command center',
  description = 'Sign in to review decisions, approve actions, and maintain auditable control across all engines.',
  features = DEFAULT_FEATURES,
}: AuthShellProps) {
  return (
    <main id="main-content" className={cn('relative min-h-screen app-bg-depth overflow-x-hidden', className)}>
      <a
        href="#auth-shell-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[var(--engine-dashboard)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0B1221]"
      >
        Skip to main content
      </a>

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_18%,rgba(0,240,255,0.1),transparent_56%),radial-gradient(ellipse_at_82%_82%,rgba(139,92,246,0.09),transparent_60%)]"
        aria-hidden="true"
      />

      <div id="auth-shell-content" className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr,1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              <Waves className="h-3.5 w-3.5 text-[var(--engine-dashboard)]" aria-hidden="true" />
              {eyebrow}
            </div>

            <h1 className="mt-8 max-w-xl text-balance font-display text-5xl font-semibold leading-[0.98] tracking-[var(--tracking-h1)] text-slate-100">
              {heading}
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-slate-300">
              {description}
            </p>

            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3 text-sm text-slate-200">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <feature.icon className="h-4.5 w-4.5 text-[var(--engine-dashboard)]" aria-hidden="true" />
                  </span>
                  {feature.label}
                </li>
              ))}
            </ul>
          </aside>

          <section className={cn('glass-surface-card rounded-3xl p-7 md:p-9', formClassName)}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[var(--tracking-h2)] text-slate-100">
              {subtitle}
            </h2>
            <div className="mt-7">{children}</div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default AuthShell
