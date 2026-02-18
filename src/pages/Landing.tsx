/**
 * Landing — Standalone greenfield landing page.
 *
 * Self-contained: no design-system imports. Only React, framer-motion,
 * lucide-react, recharts, and the project router Link.
 *
 * Visual style: Linear.app / Vercel-inspired — premium dark glass-morphism,
 * generous spacing, teal accent palette, frosted-glass cards.
 */
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
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Link } from '../router';

/* ─── Mock data ────────────────────────────────────────────────────────────── */

const metricsData = [
  {
    label: 'System Confidence',
    value: '0.92',
    color: '#0DD9B4',
    spark: [4, 6, 5, 7, 8, 7, 9, 8, 9, 9.2],
  },
  {
    label: 'Decisions Audited',
    value: '1,247',
    color: '#4E94FF',
    spark: [2, 4, 5, 7, 8, 9, 10, 11, 12, 12.5],
  },
  {
    label: 'Threats Blocked',
    value: '23',
    color: '#FFB020',
    spark: [8, 7, 5, 6, 4, 3, 3, 2, 2, 2.3],
  },
  {
    label: 'Response Time',
    value: '<200ms',
    color: '#34D399',
    spark: [5, 4, 5, 4, 3, 4, 3, 3, 2, 2],
  },
];

const engines = [
  {
    icon: Shield,
    name: 'Protect',
    color: '#22C55E',
    desc: 'Real-time threat detection with explainable AI.',
    confidence: 0.94,
  },
  {
    icon: TrendingUp,
    name: 'Grow',
    color: '#9B6DFF',
    desc: 'Forecast-driven growth with Monte Carlo simulations.',
    confidence: 0.89,
  },
  {
    icon: Zap,
    name: 'Execute',
    color: '#FFB020',
    desc: 'Consent-first automation with reversible actions.',
    confidence: 0.91,
  },
  {
    icon: Scale,
    name: 'Govern',
    color: '#4E94FF',
    desc: 'Full audit trail for every AI decision.',
    confidence: 0.97,
  },
];

const governancePillars = [
  {
    icon: Brain,
    title: 'Explainable',
    desc: 'Every AI decision includes SHAP feature attribution.',
    color: '#4E94FF',
  },
  {
    icon: ScrollText,
    title: 'Auditable',
    desc: '1,247 decisions with full audit trails.',
    color: '#4E94FF',
  },
  {
    icon: RotateCcw,
    title: 'Reversible',
    desc: 'One-click rollback on any automated action.',
    color: '#4E94FF',
  },
];

/* ─── Animation helpers ────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

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

/* ─── Main component ───────────────────────────────────────────────────────── */

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#070d1a] text-white overflow-hidden">
      {/* ── 1. Navigation ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/[0.03] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: logo */}
          <Link to="/" className="flex items-center gap-1.5 text-white" aria-label="Poseidon home">
            <img src="/logo.png" alt="" width="40" height="40" className="h-10 w-10 object-contain" aria-hidden="true" />
            <span className="text-lg font-light tracking-widest">Poseidon</span>
          </Link>
          {/* Center: links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#product" className="hover:text-white cursor-pointer transition-colors">Product</a>
            <a href="#trust" className="hover:text-white cursor-pointer transition-colors">Trust</a>
            <a href="#pricing" className="hover:text-white cursor-pointer transition-colors">Pricing</a>
          </div>
          {/* Right: buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:inline-block">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 hover:brightness-110 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero ───────────────────────────────────────────────────── */}
      <section className="relative pt-24 md:pt-32 pb-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-teal-500/[0.07] blur-[120px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.07, 0.12, 0.07] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance"
          >
            Safer satisfying money decisions in one place.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mt-6 text-pretty"
          >
            Four AI engines working together. Every decision explainable, auditable, and reversible.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 w-full"
          >
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-semibold text-lg shadow-[0_0_30px_rgba(13,217,180,0.3)] hover:shadow-[0_0_40px_rgba(13,217,180,0.4)] transition-all text-center"
            >
              Open Dashboard
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl border border-white/[0.1] text-white hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-5 w-5" />
              Try the Demo
            </Link>
            <Link
              to="/deck"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl border border-white/[0.1] text-white hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2"
            >
              <FileDown className="h-5 w-5" />
              Deck (.pdf)
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-xs text-slate-500"
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

      {/* ── Sections wrapper with generous spacing ────────────────────── */}
      <div className="space-y-20 md:space-y-28">
        {/* ── 3. Live metrics strip ─────────────────────────────────────── */}
        <section id="product">
          <motion.div
            className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {metricsData.map((m) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                      {m.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-white">{m.value}</p>
                  </div>
                  <Sparkline data={m.spark} color={m.color} />
                </div>
              </motion.div>
            ))}
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
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
            >
              Four engines. One trusted system.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {engines.map((eng) => {
                const Icon = eng.icon;
                return (
                  <motion.div
                    key={eng.name}
                    variants={fadeUp}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="group backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${eng.color}18` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: eng.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white">{eng.name}</h3>
                          <span
                            className="text-xs font-mono px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: `${eng.color}18`,
                              color: eng.color,
                            }}
                          >
                            {eng.confidence.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{eng.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ── 5. Governance proof ───────────────────────────────────────── */}
        <section id="trust">
          <motion.div
            className="max-w-7xl mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
            >
              Governance by design, not by checkbox.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {governancePillars.map((g) => {
                const Icon = g.icon;
                return (
                  <motion.div
                    key={g.title}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                  >
                    <div
                      className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${g.color}18` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: g.color }} />
                    </div>
                    <h3 className="text-base font-bold text-white">{g.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{g.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Proof bar */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 py-3 mt-8 max-w-4xl mx-auto"
            >
              <p className="text-xs font-mono text-slate-500 text-center">
                System uptime 99.97% &middot; Last audit: 4m ago &middot; Model version: v3.2.1 &middot; Decisions today: 47
              </p>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* ── 6. Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-12 mt-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">MIT Sloan CTO Program &middot; Group 7 &middot; March 2026</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-600">
            <Link to="/trust" className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</Link>
            <Link to="/trust" className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
