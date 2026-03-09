import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Shield, TrendingUp, Zap, Scale, ArrowRight, ExternalLink, Play, Presentation } from 'lucide-react'
import { PublicTopBar } from '@/components/landing/PublicTopBar'
import { Link } from '@/router'
import { CountUp, CohortFraudTrend } from '@/components/poseidon'
import { selectCohortMetrics, selectArchitecturalTrust } from '@/domain/poseidon-universe'
import { DEMO_THREAD } from '@/lib/demo-thread'
import { LANDING_COPY } from '@/content/landing-copy'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

export default function Landing() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotionSafe()
  const isSafari =
    typeof navigator !== 'undefined' &&
    /Safari/i.test(navigator.userAgent) &&
    !/Chrome|Chromium|CriOS|Edg|EdgiOS|FxiOS|OPR|Android/i.test(navigator.userAgent)
  const prefersCalmMotion = prefersReduced || isSafari
  const { fadeUp, staggerContainer: stagger } = getMotionPreset(prefersCalmMotion)
  const cohort = selectCohortMetrics()
  const trust = selectArchitecturalTrust()
  const sectionRevealProps = prefersCalmMotion
    ? ({ initial: false, animate: 'visible' } as const)
    : ({ initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-80px' } } as const)

  useEffect(() => {
    const video = videoRef.current
    const heroSection = heroSectionRef.current
    if (!video || !heroSection) return
    video.defaultMuted = true
    video.muted = true

    let visible = document.visibilityState === 'visible'
    let intersecting = true
    let disposed = false
    let abortRetryScheduled = false

    const tryPlay = () => {
      if (!visible || !intersecting || disposed) {
        try {
          video.pause()
        } catch {
          // Ignore browsers/test environments that do not implement media pause.
        }
        return
      }
      video.play().catch((err: DOMException) => {
        if (disposed) return
        if (err.name === 'AbortError' && !abortRetryScheduled) {
          abortRetryScheduled = true
          setTimeout(() => { video.play().catch(() => {}) }, 200)
        } else if (err.name !== 'NotAllowedError') {
          try {
            video.pause()
          } catch {
            // Ignore browsers/test environments that do not implement media pause.
          }
        }
      })
    }

    const handleVisibilityChange = () => {
      visible = document.visibilityState === 'visible'
      tryPlay()
    }

    let observer: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          intersecting = entry?.isIntersecting ?? true
          tryPlay()
        },
        { threshold: 0.15, rootMargin: '160px 0px' },
      )
      observer.observe(heroSection)
    }

    if (video.readyState >= 3) tryPlay()
    else video.addEventListener('canplay', tryPlay, { once: true })

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      disposed = true
      observer?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      video.removeEventListener('canplay', tryPlay)
      try {
        video.pause()
      } catch {
        // Ignore browsers/test environments that do not implement media pause.
      }
    }
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
        <div className="hidden md:block absolute top-[40%] left-[15%] w-[500px] h-[500px] rounded-full bg-green-500/[0.03] blur-[120px]" />
        <div className="hidden md:block absolute top-[55%] right-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/[0.03] blur-[120px]" />
        <div className="hidden md:block absolute top-[75%] left-[40%] w-[400px] h-[400px] rounded-full bg-cyan-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full">
        <PublicTopBar variant="landing" />

        <main id="main-content" role="main">
          {/* ═══ Section 1: Hero ═══ */}
          <section ref={heroSectionRef} className="relative w-full min-h-screen flex flex-col items-center justify-center pt-[102px] px-6">
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
              className="relative z-10 flex flex-col items-center max-w-[900px] gap-5 md:gap-8 mt-6 md:mt-24"
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
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-green-400/60">Protect</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-mono font-bold text-green-400">
                      ${DEMO_THREAD.criticalAlert.amount.toLocaleString()} Suspicious Transfer Flagged
                    </span>
                    <span className="text-xs text-white/40">
                      {Math.round(DEMO_THREAD.criticalAlert.confidence * 100)}% confidence · {DEMO_THREAD.criticalAlert.counterparty}
                    </span>
                    <span className="hidden md:block text-xs text-white/25">
                      {LANDING_COPY.hero.protectProof.sublabel}
                    </span>
                  </div>
                </div>

                {/* Grow proof */}
                <div className="rounded-2xl border border-violet-500/20 bg-white/[0.03] backdrop-blur-sm p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <TrendingUp size={12} className="text-violet-400" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-400/60">Grow</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-mono font-bold text-violet-400">
                      +${cohort.projected3yAdvantageUsd.toLocaleString()}
                    </span>
                    <span className="text-xs text-white/40">
                      {LANDING_COPY.hero.growProof.sublabel} · {Math.round(cohort.recommendationAcceptanceRate * 100)}% acceptance
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* CTAs — primary=1, secondary=1 per route contract */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 min-h-[44px] text-sm font-semibold text-slate-950 hover:from-emerald-400 hover:to-cyan-400 transition-all cta-primary-glow"
                >
                  {LANDING_COPY.hero.primaryCta} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-4 min-h-[44px] text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  {LANDING_COPY.hero.secondaryCta} <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* Deliverables */}
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
                <Link
                  to="/deck"
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all"
                >
                  <Presentation size={14} className="text-cyan-400/70" />
                  Presentation
                </Link>
                <a
                  href={LANDING_COPY.hero.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all"
                >
                  <Play size={14} className="text-red-400/70" />
                  Video
                  <ExternalLink size={10} className="text-white/30" />
                </a>
              </motion.div>

              {/* Trust bar */}
              <motion.div variants={fadeUp} className="flex flex-wrap md:flex-nowrap items-center justify-center gap-x-3 gap-y-2 text-[11px] md:text-xs text-white/30 font-mono uppercase tracking-widest mt-4">
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
              variants={stagger}
              {...sectionRevealProps}
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
                <motion.div variants={fadeUp} className="relative rounded-2xl border border-blue-500/15 bg-white/[0.03] p-5 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(59,130,246,0.1)]">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  <CountUp value={DEMO_THREAD.decisionsAudited} locale className="text-2xl md:text-3xl font-mono font-semibold text-white/90" />
                  <p className="text-xs text-white/40 mt-2">Decisions audited & logged</p>
                </motion.div>
                {/* Grow — Cohort optimization */}
                <motion.div variants={fadeUp} className="relative rounded-2xl border border-violet-500/15 bg-white/[0.03] p-5 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(139,92,246,0.1)]">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  <CountUp value={cohort.avgMonthlySavingsUsd} prefix="$" locale className="text-2xl md:text-3xl font-mono font-semibold text-white/90" />
                  <p className="text-xs text-white/40 mt-2">Avg monthly optimization identified</p>
                </motion.div>
                {/* Execute — Zero auto-executions */}
                <motion.div variants={fadeUp} className="relative rounded-2xl border border-amber-500/15 bg-white/[0.03] p-5 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(234,179,8,0.1)]">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  <span className="text-2xl md:text-3xl font-mono font-semibold text-white/90">{trust.autoExecutionsWithoutConsent}</span>
                  <p className="text-xs text-white/40 mt-2">Auto-executions without human consent</p>
                </motion.div>
                {/* Govern — Audit coverage */}
                <motion.div variants={fadeUp} className="relative rounded-2xl border border-blue-500/15 bg-white/[0.03] p-5 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(59,130,246,0.1)]">
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
              variants={stagger}
              {...sectionRevealProps}
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
                    <span className="text-[11px] text-white/25 font-mono">{stat.source}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ═══ Section 4: Architecture Principle ═══ */}
          <section className="relative w-full py-24 px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              variants={stagger}
              {...sectionRevealProps}
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
                      <span className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-[11px] font-mono font-bold text-white/50">
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
              variants={stagger}
              {...sectionRevealProps}
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
                    <span className="ml-auto text-[11px] font-mono text-green-400/60 bg-green-500/10 px-2 py-0.5 rounded-full">Flagged for Review</span>
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
                    <span>{DEMO_THREAD.criticalAlert.counterparty}</span>
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
                    <span className="ml-auto text-[11px] font-mono text-amber-400/60 bg-amber-500/10 px-2 py-0.5 rounded-full">Requires Your Approval</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-mono font-semibold text-amber-400">{DEMO_THREAD.pendingActions}</span>
                    <span className="text-sm text-white/40">queued</span>
                    <span className="text-white/10">·</span>
                    <span className="text-sm font-mono text-amber-400/70">${DEMO_THREAD.monthlyOptimization.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs text-white/30 font-mono">
                    <span>EXE-001 Payment authorization — $2,500,000</span>
                    <span>EXE-002 Account configuration — ${DEMO_THREAD.criticalAlert.amount.toLocaleString()}</span>
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
                  <div className="flex flex-col gap-1 text-[11px] text-white/25 font-mono overflow-hidden max-h-16">
                    <span>GV-2026-0319-847 Transaction review · 0.97</span>
                    <span>GV-2026-0319-846 Risk assessment flag · {DEMO_THREAD.criticalAlert.confidence}</span>
                    <span>GV-2026-0319-845 Account approval · 0.89</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* ═══ Section 6: Final CTA + Footer ═══ */}
          <section className="relative w-full py-24 px-6">
            <motion.div
              className="max-w-2xl mx-auto text-center"
              variants={stagger}
              {...sectionRevealProps}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light tracking-tight text-white mb-8">
                {LANDING_COPY.cta.title}
              </motion.h2>
              <motion.div variants={fadeUp}>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-10 py-4 min-h-[44px] text-base font-semibold text-slate-950 hover:from-emerald-400 hover:to-cyan-400 transition-all cta-primary-glow"
                >
                  {LANDING_COPY.cta.button} <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/[0.06] py-12 px-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-6 items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40">
              <Link to="/deck" className="hover:text-white transition-colors">Presentation</Link>
              <a href={LANDING_COPY.hero.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                Video <ExternalLink size={10} />
              </a>
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-white/20 font-mono uppercase tracking-widest">
              {LANDING_COPY.hero.trustItems.map((item, i) => (
                <span key={item} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/10">//</span>}
                  {item}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-white/20 font-mono tracking-wider uppercase">
              2026 MAR MIT CTO PROGRAM CAPSTONE - GROUP7
            </p>
          </div>
        </footer>
      </div>

    </div>
  )
}
