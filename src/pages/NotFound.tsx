import { motion } from 'framer-motion'
import { Link } from '@/router'
import { Waves, ArrowRight, HelpCircle } from 'lucide-react'
import {
  creatorStudioFadeUp,
  creatorStudioStaggerContainer,
} from '@/lib/motion-presets'

/**
 * Vite SPA catch-all not-found page.
 * Renders the same UI as /404 explicit route for consistency.
 */
export default function NotFound() {
  return (
    <main
      id="main-content"
      role="main"
      className="relative flex min-h-screen items-center justify-center bg-[var(--bg-oled)]"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[var(--engine-dashboard)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to main content
      </a>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_40%,rgba(0,240,255,0.04),transparent)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-md px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={creatorStudioStaggerContainer}
        >
          <motion.div variants={creatorStudioFadeUp} className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
              <Waves size={28} className="text-[var(--engine-dashboard)]" />
            </div>
          </motion.div>

          <motion.p variants={creatorStudioFadeUp} className="mb-4 font-mono text-6xl font-bold text-white/10">
            404
          </motion.p>
          <motion.h1
            variants={creatorStudioFadeUp}
            className="mb-3 text-balance text-2xl font-bold tracking-tight text-slate-100 md:text-3xl"
          >
            Page not found
          </motion.h1>
          <motion.p variants={creatorStudioFadeUp} className="mb-8 text-sm text-slate-400">
            This route does not exist. Return safely to the command center where your engines are waiting.
          </motion.p>

          <motion.div variants={creatorStudioFadeUp}>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:brightness-110"
            >
              Back to dashboard
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div variants={creatorStudioFadeUp} className="mt-8">
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <HelpCircle size={12} />
              If you expected this page to exist, contact support.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
