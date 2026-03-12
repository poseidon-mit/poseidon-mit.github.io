import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

export interface MatrixRainProps {
  className?: string;
  color?: string;
  columnCount?: number;
}

const HEX_CHARS = '0123456789ABCDEF';

export function MatrixRain({ className, color = 'var(--engine-govern)', columnCount = 40 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotionSafe();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const cols = columnCount;
    const fontSize = 14;
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * -20);
    const speeds: number[] = Array.from({ length: cols }, () => 0.3 + Math.random() * 0.7);

    // Resolve CSS variable to actual color
    const computedColor = getComputedStyle(canvas).getPropertyValue('--engine-govern').trim() || '#3B82F6';

    if (reducedMotion) {
      // Static grid display
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const colWidth = rect.width / cols;
      const rows = Math.floor(rect.height / fontSize);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const char = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          const alpha = 0.03 + (1 - r / rows) * 0.08;
          ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(char, c * colWidth, r * fontSize + fontSize);
        }
      }

      return () => window.removeEventListener('resize', resize);
    }

    let rafId: number;
    let lastTime = 0;
    const interval = 60; // ms between frames

    function draw(time: number) {
      if (time - lastTime < interval) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      const rect = canvas!.getBoundingClientRect();
      const colWidth = rect.width / cols;

      // Fade effect
      ctx!.fillStyle = 'rgba(10, 22, 40, 0.12)';
      ctx!.fillRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < cols; i++) {
        const char = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        const y = drops[i] * fontSize;

        // Bright head
        ctx!.fillStyle = `rgba(59, 130, 246, 0.9)`;
        ctx!.font = `bold ${fontSize}px monospace`;
        ctx!.fillText(char, i * colWidth, y);

        // Trail chars
        if (drops[i] > 1) {
          const trailChar = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          ctx!.fillStyle = `rgba(59, 130, 246, 0.15)`;
          ctx!.font = `${fontSize}px monospace`;
          ctx!.fillText(trailChar, i * colWidth, y - fontSize * 2);
        }

        drops[i] += speeds[i];

        if (y > rect.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [columnCount, reducedMotion, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full opacity-25 pointer-events-none', className)}
      aria-hidden="true"
    />
  );
}
