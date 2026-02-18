/**
 * Landing — Standalone greenfield landing page with cinematic video hero.
 *
 * Self-contained: no design-system imports. Only React, framer-motion,
 * lucide-react, recharts, and the project router Link.
 *
 * Visual style: Premium dark glass-morphism with full-screen video hero,
 * gradient text, engine-colored accents, and scroll-revealed sections.
 */
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  Zap,
  Scale,
  Lock,
  ScrollText,
  PlayCircle,
  FileDown,
  RotateCcw,
  Brain,
  ArrowRight,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Link } from '../router';
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/* ─── Mock data ────────────────────────────────────────────────────────────── */

const metricsData = [
  {
    label: 'System Confidence',
    value: '0.92',
    color: '#00F0FF',
    spark: [4, 6, 5, 7, 8, 7, 9, 8, 9, 9.2],
  },
  {
    label: 'Decisions Audited',
    value: '1,247',
    color: '#3B82F6',
    spark: [2, 4, 5, 7, 8, 9, 10, 11, 12, 12.5],
  },
  {
    label: 'Threats Blocked',
    value: '23',
    color: '#22C55E',
    spark: [8, 7, 5, 6, 4, 3, 3, 2, 2, 2.3],
  },
  {
    label: 'Response Time',
    value: '<200ms',
    color: '#8B5CF6',
    spark: [5, 4, 5, 4, 3, 4, 3, 3, 2, 2],
  },
];

const engines = [
  {
    icon: Shield,
    name: 'Protect',
    color: 'var(--engine-protect)',
    hex: '#22C55E',
    desc: 'Real-time threat detection powered by explainable AI that shows its reasoning.',
    confidence: 0.94,
    hoverClass: 'glass-hover-protect',
  },
  {
    icon: TrendingUp,
    name: 'Grow',
    color: 'var(--engine-grow)',
    hex: '#8B5CF6',
    desc: 'Monte Carlo simulations and forecast-driven strategies for confident growth.',
    confidence: 0.89,
    hoverClass: 'glass-hover-grow',
  },
  {
    icon: Zap,
    name: 'Execute',
    color: 'var(--engine-execute)',
    hex: '#EAB308',
    desc: 'Consent-first automation with one-click reversibility on every action.',
    confidence: 0.91,
    hoverClass: 'glass-hover-execute',
  },
  {
    icon: Scale,
    name: 'Govern',
    color: 'var(--engine-govern)',
    hex: '#3B82F6',
    desc: 'Complete audit trail and compliance proof for every AI decision.',
    confidence: 0.97,
    hoverClass: 'glass-hover-govern',
  },
];

const governancePillars = [
  {
    icon: Brain,
    title: 'Explainable',
    desc: 'Every decision includes SHAP feature attribution so you understand the "why" behind every recommendation.',
  },
  {
    icon: ScrollText,
    title: 'Auditable',
    desc: '1,247+ decisions tracked with immutable audit trails. Full compliance proof at your fingertips.',
  },
  {
    icon: RotateCcw,
    title: 'Reversible',
    desc: 'One-click rollback on any automated action. You are always in the pilot seat.',
  },
];

/* ─── Sparkline component ──────────────────────────────────────────────────── */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width={60} height={24}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace('#', '')})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── Video background sub-component ───────────────────────────────────────── */

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4';

function HeroVideoBackground({ reducedMotion }: { reducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (reducedMotion) {
      el.pause();
    } else {
      const p = el.play();
      if (p != null && typeof p.catch === 'function') p.catch(() => {});
    }
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Poster shown instantly, fades out when video is ready */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: 'url(/videos/hero-bg-poster.jpg)',
        }}
      />
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onPlaying={() => setReady(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
        src={HERO_VIDEO_URL}
      />
      {/* Overlay — matches tmp/tmp original: bg-black/50 */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────────────────── */

export default function Landing() {
  const reducedMotion = useReducedMotionSafe();
  const mp = getMotionPreset(reducedMotion);

  return (
    <div className="min-h-screen bg-[#070d1a] text-white overflow-hidden">
      {/* ── 1. Navigation ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 glass-surface border-b border-white/[0.06]"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-white" aria-label="Poseidon home">
            <img
              src="/logo.png"
              alt=""
              width="40"
              height="40"
              className="h-10 w-10 object-contain"
              aria-hidden="true"
            />
            <span
              className="text-lg font-light tracking-widest"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Poseidon
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#platform" className="hover:text-white cursor-pointer transition-colors">
              Platform
            </a>
            <a href="#governance" className="hover:text-white cursor-pointer transition-colors">
              Governance
            </a>
            <a href="#pricing" className="hover:text-white cursor-pointer transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors hidden md:inline-block"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:brightness-110 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero with Video Background ─────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        <HeroVideoBackground reducedMotion={reducedMotion} />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24 md:py-32"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Badge pill */}
          <motion.div
            variants={mp.fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.05] backdrop-blur-sm mb-8"
          >
            <span
              className={`w-2 h-2 rounded-full bg-emerald-400 ${reducedMotion ? '' : 'animate-pulse'}`}
            />
            <span className="text-[13px] font-medium text-white/60">
              Early Access — <span className="text-white">May 2026</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={mp.fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
              AI That Earns Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Financial Trust
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={mp.fadeUp}
            className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mt-6 text-pretty leading-relaxed"
          >
            Four transparent engines working in concert. Every decision explainable, auditable, and
            reversible — so you stay in control.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={mp.fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-10 w-full"
          >
            <Link
              to="/dashboard"
              className="group w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-semibold text-lg shadow-[0_0_30px_rgba(13,217,180,0.3)] hover:shadow-[0_0_40px_rgba(13,217,180,0.4)] transition-all text-center inline-flex items-center justify-center gap-2"
            >
              Explore the Platform
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl border border-white/[0.12] text-white hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-5 w-5" />
              Watch Demo
            </Link>
            <Link
              to="/deck"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl border border-white/[0.12] text-white hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2"
            >
              <FileDown className="h-5 w-5" />
              Deck (.pdf)
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={mp.fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs text-slate-500"
          >
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Bank-grade encryption
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              GDPR compliant
            </span>
            <span className="flex items-center gap-1.5">
              <ScrollText className="h-3.5 w-3.5" />
              100% auditable
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Sections wrapper ──────────────────────────────────────────── */}
      <div className="space-y-20 md:space-y-28">
        {/* ── 3. Live metrics strip ─────────────────────────────────────── */}
        <section id="platform">
          <motion.div
            className="max-w-7xl mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={mp.staggerContainerDelayed}
          >
            <motion.p
              variants={mp.fadeUp}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 text-center mb-6"
            >
              Live System Metrics
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metricsData.map((m) => (
                <motion.div
                  key={m.label}
                  variants={mp.fadeUp}
                  className="glass-surface-card rounded-2xl p-5 relative overflow-hidden"
                >
                  {/* Accent top line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: m.color }}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                        {m.label}
                      </p>
                      <p
                        className="mt-1 text-2xl font-bold text-white"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {m.value}
                      </p>
                    </div>
                    <Sparkline data={m.spark} color={m.color} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── 4. Four Engine showcase ───────────────────────────────────── */}
        <section>
          <motion.div
            className="max-w-7xl mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h2
              variants={mp.fadeUp}
              className="text-3xl md:text-4xl font-bold text-white text-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Four Engines. One Unified Intelligence.
            </motion.h2>
            <motion.p
              variants={mp.fadeUp}
              className="text-base text-slate-400 text-center mt-4 mb-12 max-w-2xl mx-auto"
            >
              Each engine specializes in a critical dimension of your financial life — working
              together as one trusted system.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {engines.map((eng) => {
                const Icon = eng.icon;
                return (
                  <Link key={eng.name} to={`/${eng.name.toLowerCase()}`} className="block group">
                    <motion.div
                      variants={mp.fadeUp}
                      className={`glass-surface rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${eng.hoverClass}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${eng.hex} 12%, transparent)`,
                          }}
                        >
                          <Icon className="h-5 w-5" style={{ color: eng.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{eng.name}</h3>
                            <span
                              className="text-xs font-mono px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: `color-mix(in srgb, ${eng.hex} 12%, transparent)`,
                                color: eng.color,
                              }}
                            >
                              {eng.confidence.toFixed(2)}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                            {eng.desc}
                          </p>
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                            <span>Explore {eng.name}</span>
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ── 5. Governance proof ───────────────────────────────────────── */}
        <section id="governance">
          <motion.div
            className="max-w-7xl mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2
              variants={mp.fadeUp}
              className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Governance Built In, Not Bolted On
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {governancePillars.map((g) => {
                const Icon = g.icon;
                return (
                  <motion.div
                    key={g.title}
                    variants={mp.fadeUp}
                    className="glass-surface-card rounded-2xl p-6 text-center"
                  >
                    <div
                      className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--engine-govern) 12%, transparent)',
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: 'var(--engine-govern)' }} />
                    </div>
                    <h3 className="text-base font-bold text-white">{g.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{g.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Proof bar */}
            <motion.div
              variants={mp.fadeUp}
              className="glass-surface rounded-xl px-6 py-3 mt-8 max-w-4xl mx-auto flex items-center justify-center gap-4 flex-wrap"
            >
              <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${reducedMotion ? '' : 'animate-pulse'}`}
                />
                Uptime 99.97%
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-xs font-mono text-slate-500">Last audit: 4m ago</span>
              <span className="text-slate-700">|</span>
              <span className="text-xs font-mono text-slate-500">Model v3.2.1</span>
              <span className="text-slate-700">|</span>
              <span className="text-xs font-mono text-slate-500">47 decisions today</span>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* ── 6. Footer ──────────────────────────────────────────────────── */}
      <footer className="mt-20 pt-12 pb-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Brand */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt=""
                  width="24"
                  height="24"
                  className="h-6 w-6 object-contain"
                  aria-hidden="true"
                />
                <span
                  className="text-sm font-light tracking-widest text-slate-300"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Poseidon.AI
                </span>
              </div>
              <p className="text-xs text-slate-600">Built with transparency, for trust.</p>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <Shield className="h-3.5 w-3.5" />
                <span className="text-xs">MIT Sloan CTO Program &middot; Group 7 &middot; March 2026</span>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex gap-6 text-xs text-slate-500">
              <Link to="/dashboard" className="hover:text-slate-300 transition-colors">
                Platform
              </Link>
              <Link to="/govern" className="hover:text-slate-300 transition-colors">
                Governance
              </Link>
              <Link to="/pricing" className="hover:text-slate-300 transition-colors">
                Pricing
              </Link>
              <Link to="/deck" className="hover:text-slate-300 transition-colors">
                Deck
              </Link>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-1 text-xs text-slate-600">
              <div className="flex gap-4">
                <Link to="/trust" className="hover:text-slate-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/trust" className="hover:text-slate-400 transition-colors">
                  Terms of Service
                </Link>
              </div>
              <p className="text-slate-700">&copy; 2026 Poseidon.AI. Research project — not financial advice.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
