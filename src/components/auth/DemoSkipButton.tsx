import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
} from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DemoSkipButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function DemoSkipButton({
  onClick,
  label = 'Skip to Dashboard',
  className,
}: DemoSkipButtonProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const pointRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    node.style.setProperty('--spot-x', '50%')
    node.style.setProperty('--spot-y', '50%')

    return () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [])

  const flushPosition = () => {
    const node = rootRef.current
    if (!node) return

    node.style.setProperty('--spot-x', `${pointRef.current.x}px`)
    node.style.setProperty('--spot-y', `${pointRef.current.y}px`)
    frameRef.current = null
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return
    const node = rootRef.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    pointRef.current.x = event.clientX - rect.left
    pointRef.current.y = event.clientY - rect.top

    if (frameRef.current == null) {
      frameRef.current = requestAnimationFrame(flushPosition)
    }
  }

  const handlePointerLeave = () => {
    const node = rootRef.current
    if (!node) return
    node.style.setProperty('--spot-x', '50%')
    node.style.setProperty('--spot-y', '50%')
  }

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('group relative overflow-visible rounded-2xl', className)}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-0.5 z-0 rounded-[17px] bg-[linear-gradient(120deg,#ff5a1f,#ff2d95,#d946ef,#facc15,#22d3ee,#4f46e5,#ff5a1f)] [background-size:300%_300%]"
        animate={{
          opacity: [0.64, 0.84, 0.64],
          scale: [1, 1.008, 1],
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          boxShadow: [
            '0 0 8px rgba(255,45,149,0.2), 0 0 14px rgba(34,211,238,0.14)',
            '0 0 12px rgba(217,70,239,0.3), 0 0 20px rgba(250,204,21,0.2)',
            '0 0 8px rgba(255,45,149,0.2), 0 0 14px rgba(34,211,238,0.14)',
          ],
        }}
        transition={{
          opacity: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
          boxShadow: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
          backgroundPosition: { duration: 6.2, repeat: Infinity, ease: 'linear' },
        }}
      />

      <Button
        type="button"
        variant="glass"
        onClick={onClick}
        className="relative z-10 h-auto w-full overflow-hidden rounded-2xl border border-fuchsia-100/55 bg-[#8a1057]/90 px-5 py-4 text-left text-white transition-all duration-300 hover:border-fuchsia-100/75 hover:bg-[#b21670] hover:shadow-[0_0_22px_rgba(255,45,149,0.3)] focus-visible:ring-fuchsia-300/80"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-px rounded-[15px] opacity-100"
          style={{
            background:
              'linear-gradient(130deg, rgba(250,204,21,0.32), rgba(255,110,199,0.28), rgba(244,114,182,0.24))',
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-px rounded-[15px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.24), rgba(255,45,149,0.22) 18%, rgba(255,90,31,0.15) 38%, transparent 64%)',
          }}
        />

        <span className="relative z-10 flex w-full items-center justify-between gap-4">
          <span className="flex min-w-0 items-center gap-3">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-fuchsia-100/80 bg-fuchsia-300/28 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fuchsia-50 shadow-[0_0_16px_rgba(255,45,149,0.4)]">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Demo</span>
            </span>
            <span className="truncate text-sm font-semibold tracking-[0.01em]">
              {label}
            </span>
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-fuchsia-100 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </Button>
    </div>
  )
}

export default DemoSkipButton
