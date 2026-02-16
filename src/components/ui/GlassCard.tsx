import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  engineColor?: string;
  glowColor?: string;
  noPadding?: boolean;
}

export function GlassCard({
  className,
  engineColor,
  glowColor,
  noPadding = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl',
        !noPadding && 'p-4 md:p-6',
        engineColor && 'border-l-2',
        className
      )}
      style={{
        boxShadow: glowColor
          ? `0 4px 16px rgba(0,0,0,0.2), 0 0 32px ${glowColor}15`
          : '0 4px 16px rgba(0,0,0,0.2)',
        ...(engineColor ? { borderLeftColor: engineColor } : {}),
      }}
      {...props}
    >
      {children}
    </div>
  );
}
