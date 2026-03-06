/**
 * CountUp — Animated number counter with viewport trigger.
 *
 * Uses Framer Motion's useMotionValue + animate for smooth counting.
 * Respects prefers-reduced-motion via useReducedMotionSafe.
 */
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

export interface CountUpProps {
  value: number
  duration?: number      // ms, default 1200
  decimals?: number      // default 0
  prefix?: string        // "$", etc.
  suffix?: string        // "%", "M", etc.
  locale?: boolean       // default false — when true, uses toLocaleString()
  className?: string
}

export function CountUp({
  value,
  duration = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
  locale = false,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const prefersReduced = useReducedMotionSafe()
  const [display, setDisplay] = useState(prefersReduced ? value : 0)

  useEffect(() => {
    if (!inView || prefersReduced) {
      setDisplay(value)
      return
    }

    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(eased * value)

      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, prefersReduced])

  const fmt = (n: number) =>
    locale ? `${prefix}${Math.round(n).toLocaleString()}${suffix}` : `${prefix}${n.toFixed(decimals)}${suffix}`

  return (
    <span ref={ref} className={className} aria-label={fmt(value)}>
      {fmt(display)}
    </span>
  )
}

CountUp.displayName = 'CountUp'
