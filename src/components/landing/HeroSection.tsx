import { motion } from "framer-motion"
import { Lock, Shield, ScrollText, Play, Presentation } from "lucide-react"
import { Link, useRouter } from '@/router'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

const trustBadges = [
  { icon: Lock, label: "Bank-grade encryption" },
  { icon: Shield, label: "GDPR compliant" },
  { icon: ScrollText, label: "100% auditable" },
]

export function HeroSection() {
  const { navigate } = useRouter()

  return (
    <section className="relative pt-24 md:pt-32 pb-16 overflow-hidden">
      {/* Background video — clipped above CTAs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[64px] overflow-hidden" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full scale-[1.08] object-cover object-center opacity-56 saturate-[0.24] contrast-[1.28] brightness-[1.12]"
          src="/videos/hero-bg.mp4"
        />
      </div>
      {/* Fade overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[64px] bg-gradient-to-b from-[var(--color-surface-base)]/24 via-[var(--color-surface-base)]/7 to-[var(--color-surface-base)]/90" aria-hidden="true" />
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[440px] w-[980px] rounded-full bg-white/[0.08] blur-[140px]" />
        <div className="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-[280px] w-[680px] rounded-full bg-slate-200/[0.06] blur-[96px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <motion.h1
          className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-text-primary text-balance md:text-6xl lg:text-7xl"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Safer, smarter money decisions, in one place.
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-text-muted md:text-xl"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Four AI engines plus your command center. Every decision explainable,
          auditable, and reversible.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <Link
            to="/signup"
            className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 px-8 py-4 text-lg font-semibold text-slate-950 shadow-[0_0_30px_rgba(13,217,180,0.3)] transition-all hover:shadow-[0_0_40px_rgba(13,217,180,0.4)] hover:brightness-110 sm:w-auto"
          >
            Get Started
          </Link>
          <div className="flex w-full gap-3 sm:w-auto sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.1] px-6 py-4 text-text-primary transition-all hover:bg-white/[0.05] sm:flex-none sm:px-8"
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </button>
            <Link
              to="/deck"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.1] px-6 py-4 text-text-primary transition-all hover:bg-white/[0.05] sm:flex-none sm:px-8"
            >
              <Presentation className="h-4 w-4" />
              Presentation
            </Link>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-8 text-xs text-text-muted"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          {trustBadges.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
