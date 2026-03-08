import { motion, type Variants } from 'framer-motion'
import { Zap, ArrowRight } from 'lucide-react'

interface PendingActionsBannerProps {
  pendingCount: number
  navigate: (path: string) => void
  variants?: Variants
}

export function PendingActionsBanner({ pendingCount, navigate, variants }: PendingActionsBannerProps) {
  if (pendingCount === 0) return null

  return (
    <motion.section variants={variants} className="mb-10" aria-label="Pending actions">
      <button
        type="button"
        onClick={() => navigate('/execute')}
        className="glass-card w-full rounded-2xl p-6 !border-amber-500/20 engine-border-execute group cursor-pointer transition-all hover:!border-amber-500/30 text-left"
      >
        {/* Subtle background tint */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-700"
          aria-hidden="true"
        />

        <div className="flex items-center gap-5 relative z-10">
          {/* Animated icon */}
          <div className="relative shrink-0">
            {/* Static ring */}
            <div
              className="absolute inset-[-4px] rounded-full border-2 border-amber-500/50 engine-border-execute opacity-60"
              aria-hidden="true"
            />
            {/* Icon container */}
            <div className="w-12 h-12 rounded-full border-2 border-amber-500/60 engine-border-execute bg-amber-500/10 engine-bg-execute flex items-center justify-center">
              <Zap size={20} className="text-amber-400 engine-text-execute" fill="currentColor" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <span className="text-2xl font-display font-light tracking-tight text-white tabular-nums">{pendingCount}</span>
            <span className="text-base text-white/70 ml-2 tracking-wide">pending actions</span>
            <p className="text-sm text-amber-400/70 engine-text-execute mt-0.5 tracking-wide">tap to review approval queue</p>
          </div>

          {/* Arrow */}
          <ArrowRight size={20} className="text-white/30 group-hover:text-amber-400 group-hover:engine-text-execute transition-colors shrink-0" />
        </div>
      </button>
    </motion.section>
  )
}
