/**
 * GlassCard — Glass morphism container for the Poseidon design language.
 *
 * Self-contained implementation matching v0 engine page pattern.
 * Supports optional left-border accent via borderColor prop.
 * Includes whileTap spring feedback for mobile haptic feel.
 */
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  className?: string
  borderColor?: string
}

const tapSpring = { type: 'spring' as const, stiffness: 400, damping: 25 }

export function GlassCard({
  children,
  className,
  borderColor,
  style,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={tapSpring}
      className={cn('rounded-2xl border border-white/[0.06] p-4 md:p-6', className)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: 'var(--glass-inset, inset 0 1px 0 0 rgba(255,255,255,0.26), inset -1px 0 0 rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.06)), 0 4px 16px rgba(0,0,0,0.2)',
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
