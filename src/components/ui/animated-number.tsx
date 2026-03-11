import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

interface AnimatedNumberProps {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

export function AnimatedNumber({
  value,
  duration = 1.2,
  format = (n) => Math.round(n).toLocaleString(),
  className,
}: AnimatedNumberProps) {
  const prefersReduced = useReducedMotionSafe()
  const motionValue = useMotionValue(0)
  const display = useTransform(motionValue, (v) => format(v))
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReduced) {
      motionValue.set(value)
      return
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    })
    return () => controls.stop()
  }, [value, duration, prefersReduced, motionValue])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}
