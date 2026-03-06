import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, TrendingUp, Zap, Scale, ArrowRight, Play, X, ExternalLink } from 'lucide-react'
import { PublicTopBar } from '@/components/landing/PublicTopBar'
import { Link } from '@/router'
import { CountUp, CohortFraudTrend } from '@/components/poseidon'
import { selectCohortMetrics, selectArchitecturalTrust, selectPlatformProfileCount } from '@/domain/poseidon-universe'
import { DEMO_THREAD } from '@/lib/demo-thread'
import { LANDING_COPY } from '@/content/landing-copy'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function Landing() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const cohort = selectCohortMetrics()
  const trust = selectArchitecturalTrust()
  const platformProfileCount = selectPlatformProfileCount()

  useEffect(() => {
    if (!videoOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setVideoOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [videoOpen])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.defaultMuted = true
    video.muted = true
    const tryPlay = () => {
      video.play().catch((err: DOMException) => {
        if (err.name === 'AbortError') {
          setTimeout(() => { video.play().catch(() => {}) }, 200)
        }
      })
    }
    if (video.readyState >= 3) tryPlay()
    else video.addEventListener('canplay', tryPlay, { once: true })
    return () => { video.removeEventListener('canplay', tryPlay); video.pause() }
  }, [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="relative min-h-screen w-full bg-[#05050A] overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Skip link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg">
        Skip to main content
      </a>

      {/* Background depth */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="landing-grid-overlay absolute inset-0" />
        <div className="absolute top-[40%] left-[15%] w-[500px] h-[500px] rounded-full bg-green-500/[0.03] blur-[120px]" />
        <div className="absolute top-[55%] right-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/[0.03] blur-[120px]" />
        <div className="absolute top-[75%] left-[40%] w-[400px] h-[400px] rounded-full bg-cyan-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full">
        <PublicTopBar variant="landing" />

        <main id="main-content" role="main">
          {/* ═══ Section 1: Hero ═══ */}
          <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-[102px] px-6">
            {/* Background video */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/videos/hero-theme-poster-v2.jpg"
                className="w-full h-full object-cover opacity-50 saturate-[0.7]"
              >
                <source src="/videos/hero-theme-mobile-v2.mp4" media="(max-width: 767px)" type="video/mp4" />
                <source src="/videos/hero-theme-desktop-v2.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05050A] to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-[871px] h-[508px] bg-[#000000] rounded-full blur-[77.5px] opacity-80 mix-blend-multiply" />
              </div>
            </div>

            <motion.div
              className="relative z-10 flex flex-col items-center max-w-[900px] gap-8 mt-12 md:mt-24"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{LANDING_COPY.hero.badge}</span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
                  {LANDING_COPY.hero.titleA}
                  <br />
                  <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    {LANDING_COPY.hero.titleB}
                  </span>
                </h1>
                <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-[650px] mt-2 text-balance">
                  {LANDING_COPY.hero.subtitle}
                </p>
              </motion.div>

              {/* 2 Floating Proof Cards */}
              <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {/* Protect proof */}
                <div className="rounded-2xl border border-green-500/20 bg-white/[0.03] backdrop-blur-sm p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Shield size={12} className="text-green-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-green-400/60">Protect</span>
                  </div>
                  <div className="flex flex-col gap-1.5 mb-3">
                    <span className="text-sm font-mono font-bold text-green-400">
                      {LANDING_COPY.hero.protectProof.headline}
                    </span>
                    <span className="text-xs text-white/40">
                      {LANDING_COPY.hero.protectProof.sublabel}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/[0.06]">
                    <CohortFraudTrend
                      variant="compact"
                      label={cohort.fraudTrend.label}
                      changePercent={cohort.fraudTrend.changePercent}
                      period={cohort.fraudTrend.period}
                      factors={cohort.fraudTrend.factors}
                      accentColor="var(--engine-protect)"
                    />
                  </div>
                </div>

                {/* Grow proof */}
                <div className="rounded-2xl border border-violet-500/20 bg-white/[0.03] backdrop-blur-sm p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <TrendingUp size={12} className="text-violet-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400/60">Grow</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-mono font-bold text-violet-400">
                      +${(cohort.avgMonthlySavingsUsd * platformProfileCount).toLocaleString()}/mo
                    </span>
                    <span className="text-xs text-white/40">
                      {LANDING_COPY.hero.growProof.sublabel}
                    </span>
                    <span className="text-[10px] text-white/25 font-mono mt-1">
                      {LANDING_COPY.hero.growProof.formulaNote}: ${cohort.avgMonthlySavingsUsd.toLocaleString()}/mo × {platformProfileCount.toLocaleString()} profiles
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 min-h-[44px] text-sm font-semibold text-slate-950 hover:from-emerald-400 hover:to-cyan-400 transition-all cta-primary-glow"
                >
                  {LANDING_COPY.hero.primaryCta} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/deck"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-4 min-h-[44px] text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  {LANDING_COPY.hero.secondaryCta} <ArrowRight size={14} />
                </Link>
                <a
                  href={LANDING_COPY.hero.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-4 min-h-[44px] text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  {LANDING_COPY.hero.videoCta} <ExternalLink size={14} />
                </a>
              </motion.div>

              {/* Trust bar */}
              <motion.div variants={fadeUp} className="flex flex-wrap md:flex-nowrap items-center justify-center gap-x-3 gap-y-2 text-[10px] md:text-xs text-white/30 font-mono uppercase tracking-widest mt-4">
                {LANDING_COPY.hero.trustItems.map((item, i) => (
                  <span key={item} className="flex items-center gap-2">
                    {i > 0 && <span className="text-white/10">//</span>}
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* ═══ Section 2: Platform Intelligence ═══ */}
          <section className="relative w-full py-20 px-6">
            <motion.div
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <div className="flex items-center justify-center gap-3 mb-10">
                <div className="h-px w-8 bg-cyan-400/30" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80 font-mono">
                  Platform Intelligence
                </p>
                <div className="h-px w-8 bg-cyan-400/30" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* Govern — Decisions audited */}
                <motion.div variants={fadeUp} className="relative rounded-2xl border border-blue-500/15 bg-white/[0.02] backdrop-blur-md p-5 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(59,130,246,0.1)]">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  <CountUp value={DEMO_THREAD.decisionsAudited} locale className="text-2xl md:text-3xl font-mono font-semibold text-white/90" />
                  <p className="text-xs text-white/40 mt-2">Decisions audited & logged</p>
                </motion.div>
                {/* Grow — Cohort savings */}
                <motion.div variants={fadeUp} className="relative rounded-2xl border border-violet-500/15 bg-white/[0.02] backdrop-blur-md p-5 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(139,92,246,0.1)]">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  <CountUp value={cohort.avgMonthlySavingsUsd} prefix="$" locale className="text-2xl md:text-3xl font-mono font-semibold text-white/90" />
                  <p className="text-xs text-white/40 mt-2">Avg cohort savings found</p>
                </motion.div>
                {/* Execute — Zero auto-executions */}
                <motion.div variants={fadeUp} className="relative rounded-2xl border border-amber-500/15 bg-white/[0.02] backdrop-blur-md p-5 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(234,179,8,0.1)]">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  <span className="text-2xl md:text-3xl font-mono font-semibold text-white/90">{trust.autoExecutionsWithoutConsent}</span>
                  <p className="text-xs text-white/40 mt-2">Auto-executions without human consent</p>
                </motion.div>
                {/* Govern — Audit coverage */}
                <motion.div variants={fadeUp} className="relative rounded-2xl border border-blue-500/15 bg-white/[0.02] backdrop-blur-md p-5 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(59,130,246,0.1)]">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  <span className="text-2xl md:text-3xl font-mono font-semibold text-white/90">{trust.auditCoveragePercent}%</span>
                  <p className="text-xs text-white/40 mt-2">AI decisions fully audited</p>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* ═══ Section 3: Coordination Gap ═══ */}
          <section className="relative w-full py-24 px-6 border-y border-white/[0.04]">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4">
                {LANDING_COPY.gap.title}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base text-white/40 mb-16 max-w-2xl mx-auto">
                {LANDING_COPY.gap.subtitle}
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {LANDING_COPY.gap.stats.map((stat, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-mono font-bold text-white/80 mb-2">{stat.value}</span>
                    <span className="text-sm text-white/50 mb-1">{stat.label}</span>
                    <span className="text-[10px] text-white/25 font-mono">{stat.source}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ═══ Section 4: Architecture Principle ═══ */}
          <section className="relative w-full py-24 px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-light tracking-tight text-white text-center mb-4">
                {LANDING_COPY.architecture.title}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base text-white/40 text-center mb-16">
                {LANDING_COPY.architecture.subtitle}
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {LANDING_COPY.architecture.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-mono font-bold text-white/50">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-white/80">{step.label}</span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ═══ Section 5: 4 Engines Bento Grid ═══ */}
          <section className="relative w-full py-24 px-6">
            <motion.div
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-light tracking-tight text-white text-center mb-16">
                {LANDING_COPY.engines.title}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Protect */}
                <motion.div variants={fadeUp} className="group relative rounded-[32px] border border-green-500/15 bg-white/[0.02] p-6 md:p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(34,197,94,0.1)] overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-green-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Protect</span>
                    <span className="ml-auto text-[10px] font-mono text-green-400/60 bg-green-500/10 px-2 py-0.5 rounded-full">Flagged for Review</span>
                  </div>
                  <CohortFraudTrend
                    variant="compact"
                    label={cohort.fraudTrend.label}
                    changePercent={cohort.fraudTrend.changePercent}
                    period={cohort.fraudTrend.period}
                    factors={cohort.fraudTrend.factors}
                    accentColor="var(--engine-protect)"
                  />
                  <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
                    <span>THR-001</span>
                    <span className="text-white/10">·</span>
                    <span>${DEMO_THREAD.criticalAlert.amount.toLocaleString()}</span>
                    <span className="text-white/10">·</span>
                    <span>{DEMO_THREAD.criticalAlert.merchant}</span>
                  </div>
                </motion.div>

                {/* Grow */}
                <motion.div variants={fadeUp} className="group relative rounded-[32px] border border-violet-500/15 bg-white/[0.02] p-6 md:p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(139,92,246,0.1)] overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-violet-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Grow</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white/30 text-sm">+</span>
                    <span className="text-2xl font-mono font-semibold text-violet-400">
                      ${cohort.projected3yAdvantageUsd.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-white/40">
                    Projected 3-year advantage · {Math.round(cohort.recommendationAcceptanceRate * 100)}% acceptance rate
                  </span>
                  {/* Mini trajectory */}
                  <svg className="w-full h-12 text-violet-400/30" viewBox="0 0 200 40" preserveAspectRatio="none">
                    <path d="M0 35 C40 32, 80 25, 120 18 S180 5, 200 2" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M0 38 L200 38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                  </svg>
                </motion.div>

                {/* Execute */}
                <motion.div variants={fadeUp} className="group relative rounded-[32px] border border-amber-500/15 bg-white/[0.02] p-6 md:p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(234,179,8,0.1)] overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Execute</span>
                    <span className="ml-auto text-[10px] font-mono text-amber-400/60 bg-amber-500/10 px-2 py-0.5 rounded-full">Requires Your Approval</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-mono font-semibold text-amber-400">{DEMO_THREAD.pendingActions}</span>
                    <span className="text-sm text-white/40">queued</span>
                    <span className="text-white/10">·</span>
                    <span className="text-sm font-mono text-amber-400/70">${DEMO_THREAD.monthlySavings}/mo</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs text-white/30 font-mono">
                    <span>EXE-001 Portfolio rebalance — $12,400</span>
                    <span>EXE-002 Flag suspicious transfer — ${DEMO_THREAD.criticalAlert.amount.toLocaleString()}</span>
                  </div>
                </motion.div>

                {/* Govern */}
                <motion.div variants={fadeUp} className="group relative rounded-[32px] border border-blue-500/15 bg-white/[0.02] p-6 md:p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(59,130,246,0.1)] overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  <div className="flex items-center gap-2">
                    <Scale size={16} className="text-blue-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Govern</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <div>
                      <CountUp value={DEMO_THREAD.decisionsAudited} locale className="text-2xl font-mono font-semibold text-white/90" />
                      <span className="text-xs text-white/30 ml-1.5">audited</span>
                    </div>
                    <div>
                      <span className="text-2xl font-mono font-semibold text-white/90">{trust.auditCoveragePercent}%</span>
                      <span className="text-xs text-white/30 ml-1.5">fully audited</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-[10px] text-white/25 font-mono overflow-hidden max-h-16">
                    <span>GV-2026-0319-847 Portfolio rebalance · 0.97</span>
                    <span>GV-2026-0319-846 Flag wire transfer · {DEMO_THREAD.criticalAlert.confidence}</span>
                    <span>GV-2026-0319-845 Subscription consolidation · 0.89</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* ═══ Section 6: Final CTA + Footer ═══ */}
          <section className="relative w-full py-24 px-6">
            <motion.div
              className="max-w-2xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light tracking-tight text-white mb-8">
                {LANDING_COPY.cta.title}
              </motion.h2>
              <motion.div variants={fadeUp}>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-10 py-4 min-h-[44px] text-base font-semibold text-slate-950 hover:from-emerald-400 hover:to-cyan-400 transition-all cta-primary-glow"
                >
                  {LANDING_COPY.cta.button} <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 flex justify-center text-white/30 font-mono text-xs tracking-wider uppercase">
          2026 MAR MIT CTO PROGRAM CAPSTONE - GROUP7
        </footer>
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/ymwtd7X3CYI?autoplay=1"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}
