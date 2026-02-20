import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Surface } from '@/design-system'

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

export function AuthShell({
  title,
  subtitle,
  children,
  className,
  formClassName,
}: AuthShellProps) {
  return (
    <main id="main-content" className={cn('relative min-h-screen app-bg-oled overflow-x-hidden', className)}>
      <a
        href="#auth-shell-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[var(--engine-dashboard)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to main content
      </a>

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_18%,rgba(0,240,255,0.05),transparent_56%),radial-gradient(ellipse_at_82%_82%,rgba(139,92,246,0.035),transparent_60%)]"
        aria-hidden="true"
      />

      <div id="auth-shell-content" className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <Surface as="section" variant="glass" padding="md" className={cn('rounded-3xl', formClassName)}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[var(--tracking-h2)] text-slate-100">
            {subtitle}
          </h1>
          <div className="mt-7">{children}</div>
        </Surface>
      </div>
    </main>
  )
}

export default AuthShell
