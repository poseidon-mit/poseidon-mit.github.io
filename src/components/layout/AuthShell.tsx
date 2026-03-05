import type { ReactNode } from 'react'
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
  afterCard?: ReactNode
  className?: string
  formClassName?: string
  eyebrow?: string
  heading?: string
  description?: string
  features?: AuthShellFeature[]
  hideLogo?: boolean
}

export function AuthShell({
  title,
  subtitle,
  children,
  afterCard,
  className,
  formClassName,
  hideLogo,
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
        className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-blue-900/40 via-indigo-800/20 to-transparent opacity-70"
        aria-hidden="true"
      />

      <div id="auth-shell-content" className="relative z-10 mx-auto max-w-lg px-6 pt-28 pb-16 lg:pt-36 lg:pb-32 flex flex-col items-center">
        {!hideLogo && (
          <div className="w-16 h-16 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-3xl">
            <img src="/logo.png" alt="Poseidon" className="w-8 h-8 opacity-90 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]" />
          </div>
        )}

        <section
          className={cn(
            'w-full rounded-[32px] p-8 md:p-10 border border-white/[0.08] bg-black/40 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.5)]',
            formClassName
          )}
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-white mb-2">
              {subtitle}
            </h1>
            <p className="text-sm font-medium uppercase tracking-widest text-white/50">{title}</p>
          </div>
          <div className="mt-8">{children}</div>
        </section>

        {afterCard ? (
          <div className="mt-4 w-full">
            {afterCard}
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default AuthShell
