import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';

const STEP_ITEMS = [
  { id: 1, label: 'Connect sources' },
  { id: 2, label: 'Define priorities' },
  { id: 3, label: 'Set consent bounds' },
  { id: 4, label: 'Activate engines' },
] as const;

export interface OnboardingShellProps {
  step: number;
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  showProgress?: boolean;
}

export function OnboardingShell({
  step,
  title,
  subtitle,
  children,
  className,
  showProgress = true
}: OnboardingShellProps) {
  const activeStep = Math.max(1, Math.min(step, STEP_ITEMS.length));

  return (
    <main id="main-content" className={cn('relative min-h-screen app-bg-oled overflow-x-hidden', className)}>
      <a
        href="#onboarding-shell-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[var(--engine-dashboard)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to main content
      </a>

      <div
        className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-violet-900/40 via-purple-800/20 to-transparent opacity-70"
        aria-hidden="true"
      />

      <div id="onboarding-shell-content" className="relative z-10 mx-auto max-w-4xl px-6 py-12 lg:py-24">
        <section className="rounded-[32px] p-8 md:p-12 border border-white/[0.08] bg-black/40 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.5)]">
          {showProgress ? <OnboardingProgress step={activeStep} /> : null}
          <div className="text-center mt-12 mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-white">{title}</h1>
            <p className="mt-4 text-base leading-relaxed text-white/50 max-w-2xl mx-auto">{subtitle}</p>
          </div>
          <div className="mt-12">{children}</div>
        </section>
      </div>
    </main >
  );
}

export default OnboardingShell;
