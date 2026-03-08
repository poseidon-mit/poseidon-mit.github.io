/**
 * SlideToApprove — Tactile authorization control
 *
 * Framer Motion horizontal drag with 90% threshold, spring-back on incomplete.
 * Keyboard Enter alternative. Touch target ≥ 44px.
 */

import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

export interface SlideToApproveProps {
  onAuthorize: () => void
  label?: string
  completedLabel?: string
  className?: string
  disabled?: boolean
}

const THUMB_SIZE = 52 // px — exceeds 44px touch target minimum
const COMPLETION_THRESHOLD = 0.9

export function SlideToApprove({
  onAuthorize,
  label = 'Slide to authorize',
  completedLabel = 'Authorized',
  className = '',
  disabled = false,
}: SlideToApproveProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [completed, setCompleted] = useState(false)
  const x = useMotionValue(0)

  const getTrackWidth = useCallback(() => {
    if (!trackRef.current) return 300
    return trackRef.current.offsetWidth - THUMB_SIZE
  }, [])

  const backgroundOpacity = useTransform(x, [0, getTrackWidth()], [0, 0.25])
  const textOpacity = useTransform(x, [0, getTrackWidth() * 0.5], [1, 0])

  const handleDragEnd = useCallback(() => {
    const maxX = getTrackWidth()
    if (x.get() >= maxX * COMPLETION_THRESHOLD) {
      setCompleted(true)
      x.set(maxX)
      try { navigator.vibrate?.(50) } catch {}
      onAuthorize()
    }
  }, [getTrackWidth, onAuthorize, x])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !disabled && !completed) {
        setCompleted(true)
        x.set(getTrackWidth())
        try { navigator.vibrate?.(50) } catch {}
        onAuthorize()
      }
    },
    [completed, disabled, getTrackWidth, onAuthorize, x],
  )

  return (
    <div
      ref={trackRef}
      className={`relative flex items-center w-full h-14 rounded-full overflow-hidden
        border border-white/10 bg-white/5 select-none
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}`}
      role="slider"
      aria-label={label}
      aria-valuenow={completed ? 100 : 0}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Progress fill */}
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-500/20"
        style={{ opacity: backgroundOpacity }}
      />

      {/* Label */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white/60 pointer-events-none"
        style={{ opacity: completed ? 0 : textOpacity }}
      >
        {completed ? completedLabel : label}
      </motion.span>

      {/* Completed label */}
      {completed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center text-sm font-medium text-emerald-400"
        >
          {completedLabel}
        </motion.span>
      )}

      {/* Draggable thumb */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing
          bg-white/10 border border-white/20 backdrop-blur-sm"
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE - 4,
          x,
        }}
        drag={completed || disabled ? false : 'x'}
        dragConstraints={{ left: 0, right: getTrackWidth() }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileTap={completed ? undefined : { scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {completed ? (
          <Check className="h-5 w-5 text-emerald-400" />
        ) : (
          <ArrowRight className="h-5 w-5 text-white/70" />
        )}
      </motion.div>
    </div>
  )
}
