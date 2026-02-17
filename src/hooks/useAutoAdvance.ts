/**
 * useAutoAdvance — Auto-advance through items on a timer.
 *
 * Used in presentation mode to auto-cycle through engine pages.
 * Any user interaction (tap) pauses the auto-advance.
 */

import { useState, useEffect, useCallback } from 'react'

export interface UseAutoAdvanceReturn {
  currentIndex: number
  isPaused: boolean
  pause: () => void
  resume: () => void
  reset: () => void
}

export function useAutoAdvance(
  itemCount: number,
  intervalMs = 4000,
  enabled = true
): UseAutoAdvanceReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!enabled || isPaused || itemCount <= 1) return
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % itemCount)
    }, intervalMs)
    return () => clearInterval(id)
  }, [enabled, isPaused, itemCount, intervalMs])

  const pause = useCallback(() => setIsPaused(true), [])
  const resume = useCallback(() => setIsPaused(false), [])
  const reset = useCallback(() => {
    setCurrentIndex(0)
    setIsPaused(false)
  }, [])

  return { currentIndex, isPaused, pause, resume, reset }
}
