import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { Surface } from '@/design-system';

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_14%_15%,rgba(0,240,255,0.05),transparent_56%),radial-gradient(ellipse_at_84%_72%,rgba(139,92,246,0.035),transparent_62%)]"
        aria-hidden="true"
      />

      <div id="onboarding-shell-content" className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <Surface className="rounded-3xl" variant="glass" padding="md" as="section">
          {showProgress ? <OnboardingProgress step={activeStep} /> : null}
          <h1 className="font-display text-3xl font-semibold tracking-[var(--tracking-h2)] text-slate-100 md:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </Surface>
      </div>
    </main>
  );
}

export default OnboardingShell;
