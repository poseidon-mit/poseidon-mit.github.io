import { cn } from '@/lib/utils';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

export interface HourglassLockProps {
  count: number;
  className?: string;
}

export function HourglassLock({ count, className }: HourglassLockProps) {
  const reducedMotion = useReducedMotionSafe();

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      {/* Hourglass SVG */}
      <div className="relative">
        <svg
          width={120}
          height={140}
          viewBox="0 0 120 140"
          aria-hidden="true"
          className={cn(
            'drop-shadow-[0_0_20px_var(--engine-execute)]',
            !reducedMotion && 'animate-pulse',
          )}
          style={{ animationDuration: '3s' }}
        >
          {/* Top frame */}
          <rect x={15} y={8} width={90} height={4} rx={2} fill="var(--engine-execute)" opacity={0.6} />
          {/* Bottom frame */}
          <rect x={15} y={128} width={90} height={4} rx={2} fill="var(--engine-execute)" opacity={0.6} />

          {/* Top glass */}
          <path
            d="M 25 16 L 25 50 Q 25 70, 60 70 Q 95 70, 95 50 L 95 16 Z"
            fill="none"
            stroke="var(--engine-execute)"
            strokeWidth={1.5}
            strokeOpacity={0.4}
          />
          {/* Bottom glass */}
          <path
            d="M 25 124 L 25 90 Q 25 70, 60 70 Q 95 70, 95 90 L 95 124 Z"
            fill="none"
            stroke="var(--engine-execute)"
            strokeWidth={1.5}
            strokeOpacity={0.4}
          />

          {/* Sand in top */}
          <path
            d="M 30 20 L 30 45 Q 30 62, 60 65 Q 90 62, 90 45 L 90 20 Z"
            fill="var(--engine-execute)"
            fillOpacity={0.15}
          />

          {/* Sand stream */}
          {!reducedMotion && (
            <line
              x1={60} y1={68} x2={60} y2={82}
              stroke="var(--engine-execute)"
              strokeWidth={1.5}
              strokeOpacity={0.5}
              className="animate-pulse"
            />
          )}

          {/* Sand in bottom */}
          <path
            d="M 35 124 L 35 105 Q 35 90, 60 85 Q 85 90, 85 105 L 85 124 Z"
            fill="var(--engine-execute)"
            fillOpacity={0.25}
          />
        </svg>

        {/* Count overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-4xl font-mono font-bold tabular-nums drop-shadow-[0_0_12px_var(--engine-execute)]"
            style={{ color: 'var(--engine-execute)' }}
          >
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}
