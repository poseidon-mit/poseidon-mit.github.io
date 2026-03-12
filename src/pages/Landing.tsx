import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, TrendingUp, Zap, Scale, Lock, Eye, UserCheck, ArrowRight, PlayCircle, Presentation } from 'lucide-react'
import { Link } from '@/router'
import { CountUp } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { LANDING_COPY } from '@/content/landing-copy'

/* ── Responsive hero video hook ── */

function useHeroVideoSrc() {
  const [src, setSrc] = useState('/videos/hero-theme-desktop-v2.mp4')
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const update = (e: MediaQueryListEvent | MediaQueryList) =>
      setSrc(e.matches ? '/videos/hero-theme-mobile-v2.mp4' : '/videos/hero-theme-desktop-v2.mp4')
    update(mql)
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])
  return src
}

/* ── Helpers ── */

const withAlpha = (hsl: string, alpha: number) => hsl.replace(')', ` / ${alpha})`)

/* ── Engine data for sections ── */

const VALUE_STATS = [
  { engine: 'protect' as const, color: 'hsl(160, 84%, 39%)', label: 'Blocked from fraud', prefix: '$', value: 16860, suffix: '', icon: Shield },
  { engine: 'grow' as const, color: 'hsl(258, 90%, 66%)', label: 'Savings found per year', prefix: '$', value: 8130, suffix: '/yr', icon: TrendingUp },
  { engine: 'execute' as const, color: 'hsl(38, 92%, 50%)', label: 'Actions awaiting approval', prefix: '', value: 7, suffix: '', icon: Zap },
  { engine: 'govern' as const, color: 'hsl(217, 91%, 60%)', label: 'Fully auditable', prefix: '', value: 100, suffix: '%', icon: Scale },
] as const

const ENGINE_STEPS = [
  { num: 1, engine: 'protect', color: 'hsl(160, 84%, 39%)', title: 'Protect', desc: 'Real-time threat detection with explainable AI that blocks fraud before it happens.' },
  { num: 2, engine: 'grow', color: 'hsl(258, 90%, 66%)', title: 'Grow', desc: 'Personalized savings and investment recommendations backed by behavioral analysis.' },
  { num: 3, engine: 'execute', color: 'hsl(38, 92%, 50%)', title: 'Execute', desc: 'One-tap approval for AI-prepared financial actions with full transparency.' },
  { num: 4, engine: 'govern', color: 'hsl(217, 91%, 60%)', title: 'Govern', desc: 'Immutable audit ledger ensuring every AI decision is traceable and accountable.' },
] as const

const TRUST_SIGNALS = [
  { icon: Lock, label: 'Bank-grade encryption' },
  { icon: Eye, label: 'Full transparency' },
  { icon: UserCheck, label: 'Human-in-the-loop' },
] as const

const ARCH_CHIPS = ['Multi-Agent', 'SHAP Explainability', 'Immutable Audit', 'Real-time Streaming'] as const

/* ═══════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════ */

export default function Landing() {
  const prefersReduced = useReducedMotionSafe()
  const { staggerContainer, staggerItem } = getMotionPreset(prefersReduced)
  const videoSrc = useHeroVideoSrc()

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden overflow-x-hidden w-full relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:bg-[var(--engine-grow)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to main content
      </a>

      {/* ════════════════════════════════════════════════════════════════════════
       * SECTION 1 — Hero with Background Video
       * ════════════════════════════════════════════════════════════════════════ */}
      <main id="main-content" role="main">
        <section className="relative min-h-[100dvh] w-full flex flex-col items-center overflow-hidden">

        {/* Background video (z-0) */}
        <video
          key={videoSrc}
          className="absolute inset-0 w-[120%] h-[120%] max-w-none object-cover object-bottom -translate-x-[8.33%] z-0"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/videos/hero-theme-poster-v2.jpg"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Blur pill (z-[1]) - Reduced opacity to brighten the landing page */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[30%] w-full h-[50vh] rounded-full bg-black blur-[120px] opacity-30 z-[1]"
          aria-hidden="true"
        />

        {/* Navbar (z-50, fixed) */}
        <nav className="fixed top-0 left-0 right-0 z-50" aria-label="Main navigation">
          <div className="max-w-[1440px] mx-auto px-6 md:px-[120px] h-[102px] flex items-center justify-between">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2.5">
                <img src="/logo.png" className="h-9 w-9" alt="Poseidon" />
                <span className="text-lg font-semibold text-white">Poseidon</span>
              </Link>
              <div className="hidden md:flex items-center gap-[10px]">
                {/* Desktop Nav Links removed as requested */}
              </div>
            </div>

            {/* Right: Sign In + Get Started */}
            <div className="flex items-center gap-3">
              {/* Mobile Presentation Link removed as requested */}
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-semibold text-sm text-white/70 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg border border-white/10 font-semibold text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content (z-[2]) */}
        <div className="relative z-[2] flex flex-col items-center text-center max-w-[871px] mx-auto mt-[120px] md:mt-[162px] px-6">
          <motion.div
            className="flex flex-col gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Headline */}
            <motion.div variants={staggerItem} className="flex flex-col gap-2.5">
              <h1 className="text-4xl md:text-[76px] font-medium tracking-[-2px] leading-[1.15] text-white">
                {LANDING_COPY.hero.titleA}
              </h1>
              <span className="block text-4xl md:text-[76px] font-medium tracking-[-2px] leading-[1.15] text-white italic font-serif">
                {LANDING_COPY.hero.titleB}
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={staggerItem}
              className="text-lg leading-[26px] text-[#f6f7f9]/90 max-w-[613px] mx-auto"
            >
              {LANDING_COPY.hero.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={staggerItem} className="flex flex-col gap-6 items-center justify-center">
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center max-w-2xl mx-auto">
                <Link
                  to="/dashboard?demo=true"
                  data-cta-priority="primary"
                  className="px-6 py-3.5 rounded-[10px] font-medium text-base text-slate-950 transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, var(--engine-grow), color-mix(in srgb, var(--engine-grow) 72%, white))',
                  }}
                >
                  Explore Prototype
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://youtu.be/ymwtd7X3CYI?si=T_4MA_Zs7n8Rf91U"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-sm font-medium text-white/65 hover:text-white transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <PlayCircle size={16} />
                  Video
                </a>
                <Link
                  to="/deck"
                  className="px-3 py-2 text-sm font-medium text-white/65 hover:text-white transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <Presentation size={16} />
                  Presentation
                </Link>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs font-medium text-white/40">
                <span className="flex items-center gap-1.5"><Lock size={12} className="text-emerald-500/70" /> Bank-grade encryption</span>
                <span className="flex items-center gap-1.5"><Shield size={12} className="text-cyan-500/70" /> AICPA SOC 2 Type II</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Dashboard Preview (z-[2]) */}
        <motion.div
          className="relative z-[2] mt-20 pb-10 flex justify-center px-6"
          variants={staggerItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-[1163px] w-[90vw] rounded-3xl backdrop-blur-[10px] bg-white/5 border border-white/10 p-[22.5px]">
            <img
              src="/og/poseidon-dashboard.png"
              alt="Poseidon Dashboard Preview"
              className="w-full h-auto rounded-lg object-cover"
              loading="lazy"
              width={1163}
              height={654}
              onError={(e) => {
                // Fallback: hide if image doesn't exist
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        </motion.div>
        </section>

      {/* ════════════════════════════════════════════════════════════════════════
       * SECTION 2 — Value Proof
       * ════════════════════════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <motion.span
          className="mb-12 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          What Poseidon Has Done for You
        </motion.span>

        <motion.div
          className="grid w-full max-w-3xl gap-5 sm:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {VALUE_STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.engine}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.05]"
                style={{
                  borderLeftWidth: '2px',
                  borderLeftColor: stat.color,
                  boxShadow: `0 0 40px ${withAlpha(stat.color, 0.06)}`,
                }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                  <span className="text-xs font-medium text-white/40">{stat.engine.charAt(0).toUpperCase() + stat.engine.slice(1)}</span>
                </div>
                <div className="text-3xl font-bold tracking-tight" style={{ color: stat.color }}>
                  <CountUp
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    locale
                    duration={1.2}
                  />
                </div>
                <p className="mt-1 text-sm text-white/40">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
        </section>

      {/* ════════════════════════════════════════════════════════════════════════
       * SECTION 3 — How It Works
       * ════════════════════════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <motion.span
          className="mb-16 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.span>

        <motion.div
          className="relative flex w-full max-w-lg flex-col gap-0"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" aria-hidden="true" />

          {ENGINE_STEPS.map((step) => (
            <motion.div
              key={step.engine}
              className="relative flex gap-5 py-6"
              variants={staggerItem}
            >
              <div
                className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                style={{
                  borderColor: withAlpha(step.color, 0.3),
                  backgroundColor: withAlpha(step.color, 0.08),
                  color: step.color,
                  boxShadow: `0 0 20px ${withAlpha(step.color, 0.15)}`,
                }}
              >
                {step.num}
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-semibold" style={{ color: step.color }}>
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/40">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        </section>

      {/* ════════════════════════════════════════════════════════════════════════
       * SECTION 4 — Final CTA
       * ════════════════════════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
        {/* Trust signals */}
        <motion.div
          className="mb-10 flex flex-wrap items-center justify-center gap-4 gap-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {TRUST_SIGNALS.map((t) => {
            const Icon = t.icon
            return (
              <div key={t.label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-white/25" aria-hidden="true" />
                <span className="text-[11px] text-white/25">{t.label}</span>
              </div>
            )
          })}
        </motion.div>

        {/* CTA card */}
        <motion.div
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            boxShadow:
              '0 0 80px hsl(189 94% 43% / 0.06), 0 0 40px hsl(258 90% 66% / 0.04)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                'conic-gradient(from 180deg, hsl(189 94% 43% / 0.15), hsl(258 90% 66% / 0.1), hsl(38 92% 50% / 0.1), hsl(217 91% 60% / 0.1), hsl(189 94% 43% / 0.15))',
              maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
              maskComposite: 'exclude',
              padding: '1px',
            }}
            aria-hidden="true"
          />

          <img src="/logo.png" className="mx-auto h-10 w-10 opacity-60" alt="" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight">
            Your Money, Your Control
          </h2>
          <p className="mt-2 text-sm text-white/40">
            AI-powered decisions. Human-approved actions. Every step audited.
          </p>

          <Link
            to="/dashboard"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Architecture chips */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {ARCH_CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[10px] font-medium text-white/25"
            >
              {chip}
            </span>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <a
            href="https://online.professionalprogramsmit.com/blended-professional-certificate-chief-technology-officer"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/mit-logo.png"
              alt="MIT Professional Education"
              className="h-8 w-auto opacity-40"
              loading="lazy"
              width={120}
              height={32}
            />
          </a>
          <p className="text-[11px] text-white/20">
            MIT CTO Program · Group 7 · &copy; 2026 Poseidon.AI
          </p>
        </div>
        </section>
      </main>
    </div>
  )
}
