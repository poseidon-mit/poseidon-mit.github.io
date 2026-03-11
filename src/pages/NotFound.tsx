import { motion } from 'framer-motion'
import { Link } from '@/router'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

function TridentIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Center prong */}
      <path d="M32 0 L32 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 0 L28 12 L36 12 Z" fill="currentColor" />
      {/* Left prong */}
      <path d="M32 24 L14 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 4 L12 16 L20 12 Z" fill="currentColor" />
      {/* Right prong */}
      <path d="M32 24 L50 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 4 L44 12 L52 16 Z" fill="currentColor" />
      {/* Handle */}
      <path d="M32 60 L32 92" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      {/* Crossbar */}
      <path d="M24 64 L40 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export default function NotFound() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion)

  return (
    <main
      id="main-content"
      role="main"
      className="relative flex min-h-screen items-center justify-center bg-[#F8F7F4]"
    >
      <div className="relative z-10 max-w-md px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Floating Trident */}
          <motion.div
            variants={fadeUp}
            className="mb-6 flex justify-center"
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TridentIcon className="h-20 w-auto text-muted-foreground/40" />
            </motion.div>
          </motion.div>

          {/* 404 */}
          <motion.p
            variants={fadeUp}
            className="mb-4 text-8xl font-mono font-bold tabular-nums text-muted-foreground/20 select-none"
          >
            404
          </motion.p>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="mb-3 text-2xl font-bold tracking-tight text-foreground"
          >
            Lost at Sea
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mb-8 text-sm text-muted-foreground"
          >
            The page you're looking for has drifted beyond our waters.
          </motion.p>

          {/* Return button */}
          <motion.div variants={fadeUp}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A1628] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0A1628]/90"
            >
              Return to Shore
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
