/**
 * DecryptText — Text that "decrypts" on mount.
 *
 * Characters scramble through random hex glyphs then settle left-to-right.
 * Respects prefers-reduced-motion via useReducedMotionSafe.
 */
import { useEffect, useRef, useState } from 'react'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

export interface DecryptTextProps {
  text: string
  duration?: number      // ms, default 800
  delay?: number         // ms before starting, default 0
  charset?: string       // default hex chars
  className?: string
  as?: 'span' | 'p' | 'code'
}

const DEFAULT_CHARSET = '0123456789ABCDEF-'

export function DecryptText({
  text,
  duration = 800,
  delay = 0,
  charset = DEFAULT_CHARSET,
  className,
  as: Tag = 'span',
}: DecryptTextProps) {
  const prefersReduced = useReducedMotionSafe()
  const [display, setDisplay] = useState(prefersReduced ? text : scramble(text, charset, 0))
  const raf = useRef<number | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(text)
      return
    }

    timeout.current = setTimeout(() => {
      const start = performance.now()

      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        setDisplay(scramble(text, charset, progress))
        if (progress < 1) {
          raf.current = requestAnimationFrame(tick)
        }
      }

      raf.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      if (timeout.current) clearTimeout(timeout.current)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [text, duration, delay, charset, prefersReduced])

  return <Tag className={className} aria-label={text}>{display}</Tag>
}

/** Resolve characters left-to-right based on progress (0→1) */
function scramble(text: string, charset: string, progress: number): string {
  const resolved = Math.floor(progress * text.length)
  return text
    .split('')
    .map((ch, i) => {
      if (i < resolved) return ch
      if (ch === ' ' || ch === '-') return ch // preserve structure
      return charset[Math.floor(Math.random() * charset.length)]
    })
    .join('')
}

DecryptText.displayName = 'DecryptText'
