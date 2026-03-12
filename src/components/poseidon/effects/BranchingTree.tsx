import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

export interface BranchingTreeProps {
  currentValue: number;
  optimizedValue: number;
  idleValue: number;
  className?: string;
}

export function BranchingTree({ currentValue, optimizedValue, idleValue, className }: BranchingTreeProps) {
  const reducedMotion = useReducedMotionSafe();
  const [animationProgress, setAnimationProgress] = useState(reducedMotion ? 1 : 0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (reducedMotion) return;

    const start = performance.now();
    const duration = 2000;

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setAnimationProgress(eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion]);

  const w = 600;
  const h = 300;
  const startX = 60;
  const forkX = 200;
  const endX = 540;
  const midY = h / 2;
  const topY = 70;
  const bottomY = h - 70;

  // Path data
  const trunkPath = `M ${startX} ${midY} L ${forkX} ${midY}`;
  const optimizedPath = `M ${forkX} ${midY} C ${forkX + 100} ${midY}, ${endX - 120} ${topY}, ${endX} ${topY}`;
  const idlePath = `M ${forkX} ${midY} C ${forkX + 100} ${midY}, ${endX - 120} ${bottomY}, ${endX} ${bottomY}`;

  const trunkLen = forkX - startX;
  const branchLen = 450; // approximate

  const fmt = (v: number) => `$${Math.round(v / 1000)}K`;

  return (
    <div className={cn('pointer-events-none select-none', className)}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-xl mx-auto" aria-hidden="true">
        <defs>
          <filter id="branch-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Trunk */}
        <path
          d={trunkPath}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={2}
          strokeDasharray={trunkLen}
          strokeDashoffset={trunkLen * (1 - Math.min(animationProgress * 2, 1))}
        />

        {/* Idle path (gray, dashed) */}
        <path
          d={idlePath}
          fill="none"
          stroke="#94A3B8"
          strokeWidth={1.5}
          strokeDasharray={`6 4`}
          strokeOpacity={0.4 * Math.max(0, (animationProgress - 0.3) / 0.7)}
        />

        {/* Optimized path (violet, solid, glow) */}
        <path
          d={optimizedPath}
          fill="none"
          stroke="var(--engine-grow)"
          strokeWidth={2.5}
          strokeDasharray={branchLen}
          strokeDashoffset={branchLen * (1 - Math.max(0, (animationProgress - 0.3) / 0.7))}
          filter="url(#branch-glow)"
        />

        {/* Current point */}
        {animationProgress > 0.1 && (
          <g opacity={Math.min(1, animationProgress * 2)}>
            <circle cx={startX} cy={midY} r={5} fill="rgba(255,255,255,0.6)" />
            <text x={startX} y={midY - 16} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={11} fontFamily="monospace">
              NOW
            </text>
            <text x={startX} y={midY + 24} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={12} fontFamily="monospace" fontWeight="bold">
              {fmt(currentValue)}
            </text>
          </g>
        )}

        {/* Optimized endpoint */}
        {animationProgress > 0.7 && (
          <g opacity={(animationProgress - 0.7) / 0.3}>
            <circle cx={endX} cy={topY} r={5} fill="var(--engine-grow)" />
            <text x={endX} y={topY - 14} textAnchor="end" fill="var(--engine-grow)" fontSize={13} fontFamily="monospace" fontWeight="bold">
              {fmt(optimizedValue)}
            </text>
            <text x={endX} y={topY + 20} textAnchor="end" fill="var(--engine-grow)" fontSize={10} fontFamily="monospace" opacity={0.7}>
              OPTIMIZED
            </text>
          </g>
        )}

        {/* Idle endpoint */}
        {animationProgress > 0.7 && (
          <g opacity={(animationProgress - 0.7) / 0.3 * 0.5}>
            <circle cx={endX} cy={bottomY} r={4} fill="#94A3B8" opacity={0.5} />
            <text x={endX} y={bottomY - 14} textAnchor="end" fill="#94A3B8" fontSize={12} fontFamily="monospace">
              {fmt(idleValue)}
            </text>
            <text x={endX} y={bottomY + 18} textAnchor="end" fill="#94A3B8" fontSize={10} fontFamily="monospace" opacity={0.5}>
              IDLE
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
