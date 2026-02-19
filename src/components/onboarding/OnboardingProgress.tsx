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
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#14B8A6' }}>
          Setup progress
        </span>
        <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>
          Step {currentStep} of {total}
        </span>
      </div>
      <div className="flex items-center gap-2" aria-label={`Onboarding step ${currentStep} of ${total}`}>
        {Array.from({ length: total }).map((_, idx) => {
          const isActive = idx + 1 <= currentStep
          return (
            <div
              key={idx}
              className="h-1.5 flex-1 rounded-full transition-all"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #14B8A6, #06B6D4)'
                  : 'rgba(255,255,255,0.1)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

