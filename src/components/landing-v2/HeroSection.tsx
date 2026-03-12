import { useState } from 'react'
import { Check, Lock, Play, Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from '@/router'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { CountUp } from '@/components/poseidon'
import { getCanonicalUniverse, selectExecuteActionsView } from '@/domain/poseidon-universe'

const engines = [
  { icon: Shield, label: 'Protect', color: '#16A34A' },
  { icon: TrendingUp, label: 'Grow', color: '#7C3AED' },
  { icon: Zap, label: 'Execute', color: '#CA8A04' },
  { icon: Eye, label: 'Govern', color: '#2563EB' },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const } },
}

export default function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false)
  const universe = getCanonicalUniverse()
  const metrics = universe.metrics
  const pendingActions = selectExecuteActionsView().filter(a => a.executionType !== 'auto').length

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950">
      {/* ── Background video ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          poster="/videos/hero-theme-poster-v2.jpg"
        >
          <source
            src="/videos/hero-theme-mobile-v2.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source
            src="/videos/hero-theme-desktop-v2.mp4"
            type="video/mp4"
          />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.80) 100%)',
          }}
        />
      </div>

      {/* ── Floating gradient orbs ── */}
      <motion.div
        className="absolute -top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[100px] pointer-events-none z-[1]"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -left-20 w-[300px] h-[300px] rounded-full bg-cyan-400/6 blur-[100px] pointer-events-none z-[1]"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Hero content ── */}
      <motion.div
        className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-24"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5"
        >
          <span className="text-sm text-white/80 font-medium">MIT CTO Program · Group 7</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight mt-6 whitespace-pre-line"
        >
          {'Your Money,\n'}
          <span className="text-blue-400">Orchestrated by AI</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg md:text-xl text-white/70 max-w-xl text-center mt-5"
        >
          Protection · Growth · Execution · Governance — one AI platform.
        </motion.p>

        {/* Engine icons */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 sm:gap-8 mt-8">
          {engines.map((e) => {
            const Icon = e.icon
            return (
              <div key={e.label} className="flex flex-col items-center gap-1.5">
                <Icon className="w-5 h-5" style={{ color: e.color }} />
                <span className="text-xs text-white/50 font-medium">{e.label}</span>
              </div>
            )
          })}
        </motion.div>

        {/* Primary CTA */}
        <motion.div variants={fadeUp} className="mt-10 w-full flex justify-center">
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white text-lg font-semibold px-8 py-4 min-h-[56px] rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] w-full sm:w-auto"
          >
            <Play className="w-5 h-5" />
            Explore Demo
          </Link>
        </motion.div>

        {/* Secondary links */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mt-5">
          <Link
            to="/deck"
            className="text-white/50 text-sm font-medium hover:text-white/70 transition-colors underline underline-offset-4 min-h-[44px] flex items-center px-2"
          >
            Presentation
          </Link>
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="text-white/50 text-sm font-medium hover:text-white/70 transition-colors underline underline-offset-4 min-h-[44px] flex items-center px-2 cursor-pointer"
          >
            Video
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mt-8 text-white/40 text-xs">
          <span className="flex items-center gap-1.5">
            <Check className="w-3 h-3" /> SOC 2
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Bank-grade Encryption
          </span>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 w-full max-w-2xl"
        >
          {[
            { label: 'Transactions Monitored', value: metrics.decisionsAuditedTotal, prefix: '' },
            { label: 'Annual Savings', value: metrics.monthlyOptimizationPotentialUsd * 12, prefix: '$' },
            { label: 'Credit Score', value: 782, prefix: '' },
            { label: 'Pending Actions', value: pendingActions, prefix: '' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                {stat.prefix}
                <CountUp value={stat.value} duration={2000} locale />
              </p>
              <p className="text-xs text-white/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Philosophy */}
        <motion.p
          variants={fadeUp}
          className="mt-8 text-xs text-white/30 text-center max-w-md"
        >
          Deterministic models compute. GenAI explains. Humans approve.
        </motion.p>
      </motion.div>

      {/* ── Video Modal ── */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl border-0 bg-black p-0 overflow-hidden">
          <DialogTitle className="sr-only">Poseidon Introduction Video</DialogTitle>
          <div style={{ aspectRatio: '16/9' }}>
            {videoOpen && (
              <iframe
                src="https://www.youtube.com/embed/ymwtd7X3CYI?autoplay=1"
                title="Poseidon Introduction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
                style={{ border: 0 }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
