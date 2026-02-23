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
        className="glass-card w-full rounded-[32px] p-6 !border-amber-500/20 group cursor-pointer transition-all hover:!border-amber-500/30 text-left"
      >
        {/* Amber radial glow background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-700"
          style={{ background: 'radial-gradient(circle at 40px 50%, rgba(245,158,11,0.15), transparent 60%)' }}
          aria-hidden="true"
        />

        <div className="flex items-center gap-5 relative z-10">
          {/* Animated icon */}
          <div className="relative shrink-0">
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-[-4px] rounded-full border-2 border-amber-500/50"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            {/* Icon container */}
            <div className="w-12 h-12 rounded-full border-2 border-amber-500/60 bg-amber-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Zap size={20} className="text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" fill="currentColor" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <span className="text-2xl font-display font-light tracking-tight text-white tabular-nums">{pendingCount}</span>
            <span className="text-base text-white/70 ml-2 tracking-wide">pending actions</span>
            <p className="text-sm text-amber-400/70 mt-0.5 tracking-wide">tap to review approval queue</p>
          </div>

          {/* Arrow */}
          <ArrowRight size={20} className="text-white/30 group-hover:text-amber-400 transition-colors shrink-0" />
        </div>
      </button>
    </motion.section>
  )
}
