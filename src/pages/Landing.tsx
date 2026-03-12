import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  Zap,
  Scale,
  Lock,
  Eye,
  UserCheck,
  ArrowRight,
  PlayCircle,
  Presentation,
} from "lucide-react";
import { Link } from "@/router";
import { CountUp } from "@/components/poseidon";
import { getMotionPreset } from "@/lib/motion-presets";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { LANDING_COPY } from "@/content/landing-copy";

/* ── Responsive hero video hook ── */

function useHeroVideoSrc() {
  const [src, setSrc] = useState("/videos/hero-theme-desktop-v2.mp4");
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) =>
      setSrc(
        e.matches
          ? "/videos/hero-theme-mobile-v2.mp4"
          : "/videos/hero-theme-desktop-v2.mp4",
      );
    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return src;
}

/* ── Helpers ── */

const withAlpha = (hsl: string, alpha: number) =>
  hsl.replace(")", ` / ${alpha})`);

/* ── Engine data for sections ── */

const CUSTOMER_STATS = [
  {
    engine: "protect" as const,
    color: "hsl(160, 84%, 39%)",
    value: 2.4,
    prefix: "$",
    suffix: "M+",
    label: "Fraud blocked across all users",
    detail: "Average $16.8K saved per household",
    icon: Shield,
  },
  {
    engine: "grow" as const,
    color: "hsl(258, 90%, 66%)",
    value: 340,
    prefix: "",
    suffix: "%",
    label: "Average ROI on AI recommendations",
    detail: "Users save $8,130/yr on average",
    icon: TrendingUp,
  },
  {
    engine: "execute" as const,
    color: "hsl(38, 92%, 50%)",
    value: 98.7,
    prefix: "",
    suffix: "%",
    label: "Actions approved on first review",
    detail: "One-tap execution with full transparency",
    icon: Zap,
  },
  {
    engine: "govern" as const,
    color: "hsl(217, 91%, 60%)",
    value: 100,
    prefix: "",
    suffix: "%",
    label: "Decisions fully auditable",
    detail: "Immutable ledger for every AI action",
    icon: Scale,
  },
] as const;

const ENGINE_STEPS = [
  {
    num: 1,
    engine: "protect",
    color: "hsl(160, 84%, 39%)",
    title: "Protect",
    desc: "Real-time threat detection with explainable AI that blocks fraud before it happens.",
  },
  {
    num: 2,
    engine: "grow",
    color: "hsl(258, 90%, 66%)",
    title: "Grow",
    desc: "Personalized savings and investment recommendations backed by behavioral analysis.",
  },
  {
    num: 3,
    engine: "execute",
    color: "hsl(38, 92%, 50%)",
    title: "Execute",
    desc: "One-tap approval for AI-prepared financial actions with full transparency.",
  },
  {
    num: 4,
    engine: "govern",
    color: "hsl(217, 91%, 60%)",
    title: "Govern",
    desc: "Immutable audit ledger ensuring every AI decision is traceable and accountable.",
  },
] as const;

const TRUST_SIGNALS = [
  { icon: Lock, label: "Bank-grade encryption" },
  { icon: Eye, label: "Full transparency" },
  { icon: UserCheck, label: "Human-in-the-loop" },
] as const;

const ARCH_CHIPS = [
  "Multi-Agent",
  "SHAP Explainability",
  "Immutable Audit",
  "Real-time Streaming",
] as const;

/* ═══════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════ */

export default function Landing() {
  const prefersReduced = useReducedMotionSafe();
  const { staggerContainer, staggerItem } = getMotionPreset(prefersReduced);
  const videoSrc = useHeroVideoSrc();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden overflow-x-hidden w-full relative">
      <svg className="pointer-events-none fixed inset-0 z-50 h-[100dvh] w-full opacity-[0.035] mix-blend-overlay" aria-hidden="true">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
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
          
          {/* Video dark overlays for text readability (z-[1]) */}
          <div className="absolute inset-0 z-[1] bg-black/20 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,transparent_60%)] pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0B0B14]/30 via-transparent to-[#0B0B14] pointer-events-none" aria-hidden="true" />


          {/* Navbar (z-50, fixed) */}
          <nav
            className="fixed top-0 left-0 right-0 z-50"
            aria-label="Main navigation"
          >
            <div className="max-w-[1440px] mx-auto px-6 md:px-[120px] h-[102px] flex items-center justify-between">
              {/* Left: Logo + Nav Links */}
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2.5">
                  <img src="/logo.png" className="h-9 w-9" alt="Poseidon" />
                  <span className="text-lg font-semibold text-white">
                    Poseidon
                  </span>
                </Link>
                <div className="hidden md:flex items-center gap-[10px]">
                  {/* Desktop Nav Links removed as requested */}
                </div>
              </div>

              {/* Right: Get Started */}
              <div className="flex items-center gap-3">
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
          <div
            className="relative z-[2] flex flex-col items-center text-center max-w-[1024px] mx-auto mt-[120px] md:mt-[180px] px-6"
          >
            <motion.div
              className="flex flex-col gap-6 w-full"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Headline */}
              <motion.div
                variants={staggerItem}
                className="flex flex-col gap-2 md:gap-4"
              >
                <h1 className="text-5xl md:text-[96px] lg:text-[112px] font-medium tracking-tighter leading-[0.9] text-white">
                  {LANDING_COPY.hero.titleA}
                </h1>
                <span className="block text-4xl md:text-[64px] lg:text-[76px] typo-display text-white/80 mt-2">
                  {LANDING_COPY.hero.titleB}
                </span>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                variants={staggerItem}
                className="text-lg md:text-xl leading-relaxed text-white/60 max-w-[600px] mx-auto font-light mt-6 tracking-wide"
              >
                {LANDING_COPY.hero.subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={staggerItem}
                className="flex flex-col gap-8 items-center justify-center mt-8"
              >
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center max-w-2xl mx-auto">
                  <Link
                    to="/dashboard?demo=true"
                    data-cta-priority="primary"
                    className="px-8 py-4 rounded-full font-medium text-sm md:text-base text-black transition-all duration-300 hover:scale-[1.03] inline-flex items-center gap-2 whitespace-nowrap bg-white shadow-[0_0_32px_rgba(255,255,255,0.15)]"
                  >
                    Explore Prototype
                    <ArrowRight size={18} className="text-black/70" />
                  </Link>
                  <a
                    href="https://youtu.be/ymwtd7X3CYI?si=T_4MA_Zs7n8Rf91U"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full text-sm md:text-base font-medium text-white/90 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 inline-flex items-center gap-2 whitespace-nowrap glass-surface"
                  >
                    <PlayCircle size={18} className="text-white/60" />
                    Watch Video
                  </a>
                  <Link
                    to="/deck"
                    className="px-8 py-4 rounded-full text-sm md:text-base font-medium text-white/90 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 inline-flex items-center gap-2 whitespace-nowrap glass-surface"
                  >
                    <Presentation size={18} className="text-white/60" />
                    Presentation Deck
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-6 text-xs md:text-sm font-medium text-white/40 tracking-wide uppercase">
                  <span className="flex items-center gap-2">
                    <Lock size={12} className="opacity-50" /> Bank-grade encryption
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield size={12} className="opacity-50" /> SOC 2 Type II
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </section>

        {/* ════════════════════════════════════════════════════════════════════════
         * SECTION 2 — Value Proof
         * ════════════════════════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 md:py-32 overflow-hidden">
          {/* Ambient glass blobs */}
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--engine-protect)]/10 blur-[120px] pointer-events-none -z-10 mix-blend-screen" />
          <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--engine-grow)]/10 blur-[150px] pointer-events-none -z-10 mix-blend-screen" />


          <motion.div
            className="mb-6 text-center relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 typo-label">
              Trusted by Users Worldwide
            </span>
          </motion.div>
          <motion.h2
            className="mb-20 text-center text-4xl md:text-5xl font-medium tracking-tight text-white/90 relative z-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Real Results, Real Impact
          </motion.h2>

          {/* 1px Architectural Grid */}
          <motion.div
            className="grid w-full max-w-5xl sm:grid-cols-2 relative z-10 bg-white/[0.06] gap-[1px] p-[1px] rounded-[32px] overflow-hidden"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {CUSTOMER_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.engine}
                  variants={staggerItem}
                  className="group relative bg-[#0A0A0F] p-10 md:p-14 transition-colors duration-500 hover:bg-white/[0.02] flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40">
                        {stat.engine}
                      </span>
                      <Icon className="h-4 w-4 opacity-50" style={{ color: stat.color }} />
                    </div>
                    <div
                      className="text-5xl md:text-6xl font-light tracking-tighter mb-4 typo-hero-number"
                    >
                      <CountUp
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        decimals={stat.value % 1 !== 0 ? 1 : 0}
                        duration={1.2}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium tracking-tight text-white/80">{stat.label}</p>
                    <p className="mt-1 text-sm text-white/40">{stat.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════
         * SECTION 3 — How It Works (1px Timeline)
         * ════════════════════════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-screen flex-col items-center px-6 py-24 md:py-32 overflow-hidden">
          {/* Ambient glass blobs */}
          <div className="absolute top-[30%] right-[-20%] w-[700px] h-[700px] rounded-full bg-[var(--engine-execute)]/10 blur-[140px] pointer-events-none -z-10 mix-blend-screen" />
          <div className="absolute bottom-[10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-[var(--engine-govern)]/15 blur-[120px] pointer-events-none -z-10 mix-blend-screen" />


          <motion.span
            className="mb-20 text-xs font-semibold uppercase tracking-[0.2em] text-white/40 typo-label relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The Precision System
          </motion.span>

          {/* 1px structural spine timeline */}
          <motion.div
            className="relative flex w-full max-w-[1000px] flex-col gap-0 z-10 mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Center line */}
            <div
              className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-[1px] bg-white/[0.08] -translate-x-1/2"
              aria-hidden="true"
            />

            {ENGINE_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.engine}
                  className="relative flex items-center py-10 md:py-16 group w-full"
                  variants={staggerItem}
                >
                  {/* Node */}
                  <div className="absolute left-[24px] md:left-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#0A0A0F] text-xs font-mono font-bold transition-all duration-500 group-hover:scale-110 -translate-x-1/2"
                       style={{ color: step.color, borderColor: withAlpha(step.color, 0.4) }}>
                    0{step.num}
                  </div>

                  {/* Content Container */}
                  <div className={`flex w-full pl-[60px] md:pl-0 ${!isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                    <div className={`w-full md:w-1/2 ${!isEven ? 'md:pl-16' : 'md:pr-16 md:text-right'}`}>
                         <h3 className="text-2xl md:text-3xl font-medium tracking-tight" style={{ color: step.color }}>{step.title}</h3>
                         <p className={`mt-3 text-base md:text-lg leading-relaxed text-white/50 font-light max-w-sm md:max-w-none ml-0 ${isEven ? 'md:ml-auto' : ''}`}>{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════
         * SECTION 4 — Final CTA (The Monolith)
         * ════════════════════════════════════════════════════════════════════════ */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 md:py-32 overflow-hidden">
          {/* Ambient glass blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-[180px] pointer-events-none -z-10 mix-blend-screen" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none -z-10 mix-blend-screen" />


          {/* Trust signals */}
          <motion.div
            className="mb-12 flex flex-wrap items-center justify-center gap-6 gap-y-3 relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {TRUST_SIGNALS.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="flex items-center gap-2">
                  <Icon
                    className="h-4 w-4 text-white/30"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium tracking-[0.04em] text-white/40 uppercase">{t.label}</span>
                </div>
              );
            })}
          </motion.div>

          {/* Monolithic CTA card */}
          <motion.div
            className="relative z-10 w-full max-w-[800px] overflow-hidden rounded-[40px] border border-white/[0.06] bg-[#0A0A0F] p-16 md:p-24 text-center glass-surface"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 40px rgba(0,0,0,0.8)",
            }}
          >
            <img
              src="/logo.png"
              className="mx-auto h-16 w-16 opacity-50 mb-10"
              alt=""
            />
            <h2 className="text-4xl md:text-[56px] font-medium tracking-tighter leading-tight mb-6">
              Your Money, Your Control.
            </h2>
            <p className="text-lg md:text-xl text-white/50 max-w-[480px] mx-auto font-light leading-relaxed mb-12">
              AI-powered decisions. Human-approved actions. Every step mathematically audited.
            </p>

            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-base font-semibold text-black transition-all duration-500 hover:scale-[1.02]"
            >
              Open Dashboard
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 opacity-70" />
            </Link>
          </motion.div>

          {/* Footer */}
          <div className="mt-16 flex flex-col items-center gap-3 relative z-10">
            <a
              href="https://online.professionalprogramsmit.com/blended-professional-certificate-chief-technology-officer"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="/mit-logo.png"
                alt="MIT Professional Education"
                className="h-8 w-auto opacity-50"
                loading="lazy"
                width={120}
                height={32}
              />
            </a>
            <p className="text-xs text-white/30">
              MIT CTO Program · Group 7 · &copy; 2026 Poseidon.AI
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
