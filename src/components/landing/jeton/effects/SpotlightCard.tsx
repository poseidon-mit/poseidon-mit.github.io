import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { cn } from '@/lib/utils';

export interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  glowTone?: 'cyan' | 'protect' | 'grow' | 'execute' | 'govern';
}

const TONE_CLASS: Record<NonNullable<SpotlightCardProps['glowTone']>, string> = {
  cyan: 'bg-[radial-gradient(420px_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),rgba(0,240,255,0.16),transparent_60%)]',
  protect:
    'bg-[radial-gradient(420px_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),rgba(16,185,129,0.16),transparent_60%)]',
  grow: 'bg-[radial-gradient(420px_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),rgba(236,72,153,0.14),transparent_60%)]',
  execute:
    'bg-[radial-gradient(420px_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),rgba(245,158,11,0.16),transparent_60%)]',
  govern:
    'bg-[radial-gradient(420px_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),rgba(56,189,248,0.16),transparent_60%)]',
};

export default function SpotlightCard({
  children,
  className,
  glowTone = 'cyan',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    node.style.setProperty('--spot-x', '50%');
    node.style.setProperty('--spot-y', '50%');

    return () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  const flushPosition = () => {
    const node = cardRef.current;
    if (!node) return;

    node.style.setProperty('--spot-x', `${pointRef.current.x}px`);
    node.style.setProperty('--spot-y', `${pointRef.current.y}px`);
    frameRef.current = null;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;

    const node = cardRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    pointRef.current.x = event.clientX - rect.left;
    pointRef.current.y = event.clientY - rect.top;

    if (frameRef.current == null) {
      frameRef.current = requestAnimationFrame(flushPosition);
    }
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_20px_50px_-32px_rgba(2,6,23,0.8)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_28px_56px_-28px_rgba(2,6,23,0.92)]',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          TONE_CLASS[glowTone],
        )}
      />
      <div className="relative z-10">{children}</div>
    </article>
  );
}
