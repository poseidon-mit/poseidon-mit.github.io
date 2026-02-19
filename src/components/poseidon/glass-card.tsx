/**
 * GlassCard — Glass morphism container for the Poseidon design language.
 *
 * Self-contained implementation matching v0 engine page pattern.
 * Supports optional left-border accent via borderColor prop.
 * Includes whileTap spring feedback for mobile haptic feel.
 */
import { motion, type HTMLMotionProps } from 'framer-motion'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { EngineName } from '@/lib/engine-tokens'

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  className?: string
  borderColor?: string
  depth?: 'surface' | 'elevated' | 'floating'
  interactive?: boolean
  engine?: EngineName
}

const tapSpring = { type: 'spring' as const, stiffness: 400, damping: 25 }

const depthStyleMap: Record<NonNullable<GlassCardProps['depth']>, CSSProperties> = {
  surface: {
    background: 'var(--glass-depth-surface, rgba(8, 12, 24, 0.62))',
    boxShadow:
      'var(--glass-inset, inset 0 1px 0 0 rgba(255,255,255,0.26), inset -1px 0 0 rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.06)), 0 4px 16px rgba(0,0,0,0.2)',
  },
  elevated: {
    background: 'var(--glass-depth-elevated, rgba(12, 20, 38, 0.7))',
    boxShadow:
      'var(--glass-inset, inset 0 1px 0 0 rgba(255,255,255,0.2), inset 0 0 20px rgba(255,255,255,0.05)), 0 12px 30px rgba(0,0,0,0.35)',
  },
  floating: {
    background: 'var(--glass-depth-floating, rgba(16, 26, 48, 0.78))',
    boxShadow:
      'var(--glass-depth-floating-shadow, 0 20px 60px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1))',
  },
}

export function GlassCard({
  children,
  className,
  borderColor,
  depth = 'surface',
  interactive = false,
  engine,
  style,
  ...props
}: GlassCardProps) {
  const interactiveClass = interactive && engine ? `glass-hover-${engine}` : undefined
  const depthStyle = depthStyleMap[depth]

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={tapSpring}
      className={cn('rounded-2xl border border-white/[0.06] p-4 md:p-6', interactiveClass, className)}
      style={{
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        ...depthStyle,
        ...(borderColor ? { borderLeftWidth: '2px', borderLeftColor: borderColor } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

GlassCard.displayName = 'GlassCard'
