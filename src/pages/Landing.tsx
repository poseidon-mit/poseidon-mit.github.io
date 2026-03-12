import { lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from '@/router';
import { Lock, Eye, ShieldCheck, Shield, TrendingUp, Zap, Scale, Play, FileText } from 'lucide-react';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/motion-presets';
import { usePageTitle } from '@/hooks/use-page-title';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { MenuOverlay } from '@/components/landing/jeton/MenuOverlay';
import { Footer } from '@/components/landing/jeton/Footer';
import SpotlightCard from '@/components/landing/jeton/effects/SpotlightCard';
import { JETON_COPY, JETON_FEATURES } from '@/content/landing-copy-jeton';
import { selectArchitecturalTrust, selectCohortMetrics } from '@/domain/poseidon-universe';
import { LANDING_COPY } from '@/content/landing-copy';

const ParticleGlobe = lazy(() => import('@/components/landing/jeton/effects/ParticleGlobe'));

const ENGINE_ICONS = { protect: Shield, grow: TrendingUp, execute: Zap, govern: Scale } as const;
const ENGINE_COLORS: Record<string, string> = {
  protect: 'var(--engine-protect)',
  grow: 'var(--engine-grow)',
  execute: 'var(--engine-execute)',
  govern: 'var(--engine-govern)',
};

const TRUST_ICONS = { lock: Lock, shield: ShieldCheck, eye: Eye } as const;

export default function Landing() {
  usePageTitle('Welcome to Poseidon');
  const reducedMotion = useReducedMotionSafe();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const trust = selectArchitecturalTrust();
  const cohort = selectCohortMetrics();

  return (
    <div className="overflow-x-clip bg-[#06060A] text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>
      <MenuOverlay />
      <main id="main-content" role="main">

      {/* ═══════════════════════════════════════════
          SECTION 1: IMMERSIVE HERO (100vh)
          ═══════════════════════════════════════════ */}
      <motion.section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16"
        style={{ opacity: reducedMotion ? 1 : heroOpacity }}
      >
        {/* Video Background */}
        <video
          src="/videos/hero-theme-desktop-v2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover scale-[1.15] opacity-70 pointer-events-none"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06060A]/20 to-[#06060A]/80 pointer-events-none" />

        {/* Particle Globe */}
        {!reducedMotion && (
          <Suspense fallback={null}>
            <div className="absolute inset-0 opacity-90 pointer-events-none">
              <ParticleGlobe quality="auto" />
            </div>
          </Suspense>
        )}

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <motion.div
            className="max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-6">
              Deterministic Finance.
              <br />
              <span className="bg-gradient-to-r from-[var(--engine-dashboard)] to-[var(--engine-govern)] bg-clip-text text-transparent">
                Agentic Execution.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12">
              The AI-native platform that shows its work before it asks for trust.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-3xl mx-auto">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-[var(--engine-dashboard)] text-[#06060A] font-semibold text-[15px] tracking-wide hover:scale-105 transition-transform shadow-[0_0_40px_rgba(0,240,255,0.4)] flex-1 min-w-[200px]"
              >
                OPEN PROTOTYPE
              </Link>
              
              <a
                href="https://youtu.be/ymwtd7X3CYI?si=GquLUJOtmQ7RVN4k"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-[15px] hover:bg-white/10 transition-colors backdrop-blur-md flex-1 min-w-[200px]"
              >
                <Play className="w-4 h-4" />
                Video
              </a>
              
              <Link
                to="/deck"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-[15px] hover:bg-white/10 transition-colors backdrop-blur-md flex-1 min-w-[200px]"
              >
                <FileText className="w-4 h-4" />
                Presentation
              </Link>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-16 text-white/40 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {LANDING_COPY.hero.trustItems.map((item, idx) => {
              const Icon = idx === 0 ? Lock : idx === 1 ? ShieldCheck : Eye;
              return (
                <span key={item} className="flex items-center gap-2">
                  <Icon size={14} /> {item}
                </span>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          SECTION 2: FOUR ENGINES
          ═══════════════════════════════════════════ */}
      <section id="platform" className="relative px-6 py-28 md:py-40 md:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20%' }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">
              {JETON_COPY.valueProp.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
              Four Engines. One Cohesive Ecosystem.
            </h2>
            <p className="mt-4 text-base md:text-lg text-white/50 max-w-2xl mx-auto">
              Coordinated protection, capital allocation, execution, and governance for the same balance sheet. {cohort.cohortSize.toLocaleString()} similar users shape the recommendation layer.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
          >
            {JETON_FEATURES.map((feature) => {
              const Icon = ENGINE_ICONS[feature.tone];
              return (
                <motion.div key={feature.name} variants={staggerItem}>
                  <SpotlightCard glowTone={feature.tone} theme="dark" className="h-full">
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10"
                          style={{ color: ENGINE_COLORS[feature.tone] }}
                        >
                          <Icon size={20} />
                        </div>
                        <h3 className="text-lg font-semibold">{feature.name}</h3>
                        <span className="ml-auto font-mono text-xs text-white/30">
                          {feature.confidence} confidence
                        </span>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: TRUST & ARCHITECTURE
          ═══════════════════════════════════════════ */}
      <section className="relative px-6 py-28 md:py-40 md:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20%' }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-4">
              {JETON_COPY.trust.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
              Built on Cryptographic Certainty.
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
          >
            {JETON_COPY.trust.pillars.map((pillar) => {
              const Icon = TRUST_ICONS[pillar.icon];
              return (
                <motion.div
                  key={pillar.title}
                  variants={staggerItem}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 mb-5 text-[var(--engine-dashboard)]">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{pillar.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4: FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
        {/* Decorative radials */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse,var(--engine-dashboard)_0%,transparent_70%)] opacity-[0.06]" />
        </div>

        <motion.div
          className="relative z-10 max-w-2xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20%' }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Take control of your
            </span>
            <br />
            <span className="bg-gradient-to-r from-[var(--engine-dashboard)] to-[var(--engine-grow)] bg-clip-text text-transparent">
              financial destiny today.
            </span>
          </h2>

          <p className="text-base md:text-lg text-white/50 mb-10">
            Start with the command center, then drill into Protect, Grow, Execute, and Govern as the story unfolds.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[var(--engine-dashboard)] text-[#06060A] font-semibold text-base tracking-wide hover:scale-105 transition-transform shadow-[0_0_40px_var(--engine-dashboard)]"
          >
            GET STARTED NOW
          </Link>

          <p className="mt-8 text-xs text-white/30">
            Read-only bank connectivity. Explainable AI. No invisible automation.
          </p>
        </motion.div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
