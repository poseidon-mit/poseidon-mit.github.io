import { Link } from '@/router'
import { Shield, TrendingUp, Zap, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

const engines = [
  { icon: Shield, label: 'Protect', color: 'text-green-400', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]', desc: 'AI-powered threat detection' },
  { icon: TrendingUp, label: 'Grow', color: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]', desc: 'Smart savings & growth' },
  { icon: Zap, label: 'Execute', color: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]', desc: 'Human-approved automation' },
  { icon: FileText, label: 'Govern', color: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]', desc: 'Complete audit trail' },
] as const

const trustSignals = [
  { value: '1,247', label: 'Transactions Protected' },
  { value: '100%', label: 'Auditable' },
  { value: '$2,437', label: 'Savings Identified' },
] as const

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
}

export default function LovableLanding() {
  return (
    <div className="bg-[#0B1120] min-h-screen text-white overflow-hidden relative">
      {/* Ambient gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/[0.07] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="max-w-5xl mx-auto px-6 py-16 flex flex-col items-center gap-16 relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Section 1: Hero */}
        <section className="flex flex-col items-center text-center gap-6">
          <motion.div
            variants={fadeUp}
            className="bg-white/[0.08] backdrop-blur-lg border border-white/[0.12] rounded-full px-4 py-1.5 text-xs shadow-[0_0_20px_rgba(0,240,255,0.08)]"
          >
            MIT Professional Education CTO Program
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <span className="text-cyan-400 text-4xl drop-shadow-[0_0_16px_rgba(0,240,255,0.5)]">🔱</span>
            <span className="text-3xl font-bold">Poseidon</span>
            <span className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">.AI</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-white to-cyan-200 bg-clip-text text-transparent"
          >
            The Trusted AI-Native Money Platform
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-white/50 max-w-2xl mx-auto">
            Deterministic models compute. GenAI explains. AI Agents execute. Humans confidently approve.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard?demo=true"
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/30 text-lg font-semibold min-h-[44px] inline-flex items-center transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/40"
            >
              Explore Demo
            </Link>
            <Link
              to="/onboarding"
              className="bg-white/[0.06] backdrop-blur border border-white/[0.12] hover:bg-white/[0.12] text-white px-8 py-3 rounded-xl min-h-[44px] inline-flex items-center transition-all duration-200"
            >
              Get Started
            </Link>
          </motion.div>
        </section>

        {/* Section 2: Engine Cards */}
        <motion.section
          variants={fadeUp}
          className="grid grid-cols-2 gap-4 max-w-3xl mx-auto w-full"
        >
          {engines.map(({ icon: Icon, label, color, glow, desc }) => (
            <div
              key={label}
              className={`bg-white/[0.04] backdrop-blur-lg border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 ${glow}`}
            >
              <Icon className={`w-6 h-6 ${color} mb-3 drop-shadow-[0_0_6px_currentColor]`} />
              <h3 className="font-semibold mb-1">{label}</h3>
              <p className="text-sm text-white/40">{desc}</p>
            </div>
          ))}
        </motion.section>

        {/* Section 3: Trust Signals */}
        <motion.section variants={fadeUp} className="flex justify-center gap-8 sm:gap-16">
          {trustSignals.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">{value}</div>
              <div className="text-sm text-white/30">{label}</div>
            </div>
          ))}
        </motion.section>

        {/* Footer */}
        <motion.footer variants={fadeUp} className="text-white/30 text-sm text-center">
          MIT Professional Education &middot; CTO Program &middot; Group 7
        </motion.footer>
      </motion.div>
    </div>
  )
}
