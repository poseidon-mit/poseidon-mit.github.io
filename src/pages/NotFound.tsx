import { motion } from "framer-motion"
import { Link } from '@/router'
import { Waves, ArrowRight, HelpCircle } from "lucide-react"

const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/**
 * Vite SPA catch-all not-found page.
 * Renders the same UI as /404 explicit route for consistency.
 */
export default function NotFound() {
  return (
    <main id="main-content" className="relative min-h-screen flex items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(40% 30% at 50% 40%, rgba(0,240,255,0.04), transparent)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-md">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl"
              style={{ background: "rgba(0,240,255,0.06)", border: "1px solid rgba(0,240,255,0.12)" }}
            >
              <Waves size={28} style={{ color: "var(--engine-dashboard)" }} />
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-6xl font-bold font-mono mb-4"
            style={{ color: "rgba(255,255,255,0.08)" }}
          >
            404
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-balance"
            style={{ color: "#F1F5F9" }}
          >
            Page not found
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm mb-8" style={{ color: "#94A3B8" }}>
            This route does not exist. Return safely to the command center where your engines are waiting.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #14B8A6, #06B6D4)",
                color: "#0B1221",
              }}
            >
              Back to dashboard
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8">
            <p className="flex items-center justify-center gap-1.5 text-xs" style={{ color: "#64748B" }}>
              <HelpCircle size={12} />
              If you expected this page to exist, contact support.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
