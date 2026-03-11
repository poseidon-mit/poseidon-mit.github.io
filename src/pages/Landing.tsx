import { motion, useScroll, useTransform } from 'framer-motion'
import { Shield, TrendingUp, Zap, Scale, Lock, Eye, UserCheck, ChevronDown, ArrowRight } from 'lucide-react'
import { Link } from '@/router'
import { CountUp } from '@/components/poseidon'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

/* ── Trident SVG ── */
function TridentIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 4v52M32 4l-8 12M32 4l8 12M12 20c0 8 8 14 16 18M52 20c0 8-8 14-16 18M32 56v4M26 60h12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── Engine data for sections ── */
const VALUE_STATS = [
  { engine: 'protect' as const, color: 'hsl(160, 84%, 39%)', label: 'Blocked from fraud', prefix: '$', value: 16860, icon: Shield },
  { engine: 'grow' as const, color: 'hsl(258, 90%, 66%)', label: 'Savings found per year', prefix: '$', value: 8130, suffix: '/yr', icon: TrendingUp },
  { engine: 'execute' as const, color: 'hsl(38, 92%, 50%)', label: 'Actions awaiting approval', prefix: '', value: 7, icon: Zap },
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

export default function Landing() {
  const prefersReduced = useReducedMotionSafe()
  const { fadeUp, staggerContainer, staggerItem } = getMotionPreset(prefersReduced)
  const { scrollYProgress } = useScroll()
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white selection:bg-cyan-500/20 overflow-x-hidden">
      {/* ════════════════════════════════════════════════════════════════════════
       * SECTION 1 — Hero
       * ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)',
          }}
          aria-hidden="true"
        />

        {/* Animated gradient orb */}
        <motion.div
          className="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, hsl(189 94% 43% / 0.6), hsl(258 90% 66% / 0.2), transparent 70%)',
            y: orbY,
          }}
          aria-hidden="true"
        />

        {/* Authority header */}
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            MIT Professional Education
          </span>
          <div className="flex items-center gap-5">
            <a
              href="/deck"
              className="text-[11px] font-medium text-white/30 transition-colors hover:text-white/60"
            >
              Deck
            </a>
            <a
              href="https://online.professionalprogramsmit.com/blended-professional-certificate-chief-technology-officer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-white/30 transition-colors hover:text-white/60"
            >
              MIT
            </a>
          </div>
        </motion.nav>

        {/* Hero content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Trident */}
          <motion.div variants={staggerItem}>
            <TridentIcon className="h-16 w-16 text-cyan-400 drop-shadow-[0_0_20px_rgba(0,200,255,0.4)]" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="mt-6 text-6xl font-bold tracking-[-0.04em] sm:text-7xl md:text-8xl"
            variants={staggerItem}
          >
            Poseidon
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-4 max-w-md text-lg text-white/50"
            variants={staggerItem}
          >
            AI-Native Personal Finance
          </motion.p>

          {/* CTA */}
          <motion.div variants={staggerItem} className="mt-10">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:scale-[1.02]"
            >
              Enter Demo
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-wider text-white/30">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-white/30" />
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
          {VALUE_STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.engine}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.05]"
                style={{
                  borderLeftWidth: '2px',
                  borderLeftColor: stat.color,
                  boxShadow: `0 0 40px ${stat.color.replace(')', ' / 0.06)')}`,
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
                    suffix={stat.suffix ?? ''}
                    locale
                    duration={1600}
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

        <div className="relative flex w-full max-w-lg flex-col gap-0">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" aria-hidden="true" />

          {ENGINE_STEPS.map((step, i) => (
            <motion.div
              key={step.engine}
              className="relative flex gap-5 py-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              {/* Numbered circle */}
              <div
                className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                style={{
                  borderColor: step.color.replace(')', ' / 0.3)'),
                  backgroundColor: step.color.replace(')', ' / 0.08)'),
                  color: step.color,
                  boxShadow: `0 0 20px ${step.color.replace(')', ' / 0.15)')}`,
                }}
              >
                {step.num}
              </div>

              {/* Content */}
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
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
       * SECTION 4 — Final CTA
       * ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
        {/* Trust signals */}
        <motion.div
          className="mb-10 flex items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {TRUST_SIGNALS.map((t) => {
            const Icon = t.icon
            return (
              <div key={t.label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-white/25" />
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
          {/* Animated border gradient */}
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

          <TridentIcon className="mx-auto h-10 w-10 text-cyan-400/60" />
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
            />
          </a>
          <p className="text-[11px] text-white/20">
            MIT CTO Program · Group 7 · &copy; 2026 Poseidon.AI
          </p>
        </div>
      </section>
    </div>
  )
}
