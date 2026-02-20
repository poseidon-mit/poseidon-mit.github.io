import { cn } from '@/lib/utils'

interface OnboardingProgressProps {
  step: number
  total?: number
  className?: string
}

export function OnboardingProgress({
  step,
  total = 4,
  className,
}: OnboardingProgressProps) {
  const currentStep = Math.max(1, Math.min(step, total))

  return (
    <div className={cn('mb-6', className)} data-testid="onboarding-progress">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Setup progress
        </span>
        <span className="text-xs font-mono text-slate-400">
          Step {currentStep} of {total}
        </span>
      </div>
      <div
        className="flex items-center gap-2"
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={currentStep}
      >
        {Array.from({ length: total }).map((_, idx) => {
          const isActive = idx + 1 <= currentStep
          return (
            <div
              key={idx}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all',
                isActive ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-white/10',
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
