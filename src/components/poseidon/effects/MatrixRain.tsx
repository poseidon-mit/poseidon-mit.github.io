import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface MatrixRainProps {
  className?: string;
  color?: string;
  columnCount?: number;
  active?: boolean;
}

const HEX_CHARS = '0123456789ABCDEF';

function resolveColor(color: string, element: HTMLElement): string {
  if (!color.startsWith('var(')) return color;
  const variableName = color.slice(4, -1).trim();
  return getComputedStyle(element).getPropertyValue(variableName).trim() || '#3B82F6';
}

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('rgb')) {
    const channels = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map((part) => part.trim())
      .slice(0, 3);

    if (channels.length === 3) {
      return `rgba(${channels.join(', ')}, ${alpha})`;
    }
  }

  if (!color.startsWith('#')) {
    return `rgba(59, 130, 246, ${alpha})`;
  }

  const normalized = color.length === 4
    ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
    : color;
  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function MatrixRain({
  className,
  color = 'var(--engine-govern)',
  columnCount = 40,
  active = true,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const cols = columnCount;
    const fontSize = 14;
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * -20);
    const speeds: number[] = Array.from({ length: cols }, () => 0.3 + Math.random() * 0.7);

    const computedColor = resolveColor(color, canvas);

    const drawStaticGrid = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const colWidth = rect.width / cols;
      const rows = Math.floor(rect.height / fontSize);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const char = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          const alpha = 0.03 + (1 - r / rows) * 0.08;
          ctx.fillStyle = withAlpha(computedColor, alpha);
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(char, c * colWidth, r * fontSize + fontSize);
        }
      }
    };

    if (!active) {
      drawStaticGrid();
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
        ctx!.fillStyle = withAlpha(computedColor, 0.9);
        ctx!.font = `bold ${fontSize}px monospace`;
        ctx!.fillText(char, i * colWidth, y);

        // Trail chars
        if (drops[i] > 1) {
          const trailChar = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          ctx!.fillStyle = withAlpha(computedColor, 0.15);
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
  }, [active, columnCount, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full opacity-25 pointer-events-none', className)}
      aria-hidden="true"
    />
  );
}
