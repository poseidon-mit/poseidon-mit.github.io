import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from 'recharts';
import {
  Brain,
  Lock,
  Play,
  RotateCcw,
  Scale,
  ScrollText,
  Shield,
  TrendingUp,
  Waves,
  Zap,
} from 'lucide-react';

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const metrics = [
  { label: 'System Confidence', value: '0.92', color: '#2dd4bf', data: [3, 5, 4, 7, 6, 8, 7, 9, 8, 9.2] },
  { label: 'Decisions Audited', value: '1,247', color: '#818cf8', data: [2, 4, 5, 3, 6, 7, 8, 7, 10, 12] },
  { label: 'Threats Blocked', value: '23', color: '#fbbf24', data: [1, 0, 2, 1, 3, 2, 1, 3, 2, 2.3] },
  { label: 'Response Time', value: '<200ms', color: '#60a5fa', data: [5, 4, 3, 4, 3, 2, 3, 2, 2, 1.8] },
];

const engines = [
  {
    name: 'Protect',
    icon: Shield,
    description: 'Real-time threat detection with explainable AI',
    confidence: '0.94',
    panelClass: 'hover:border-teal-400/20',
    iconWrapClass: 'bg-teal-400/10',
    iconClass: 'text-teal-400',
  },
  {
    name: 'Grow',
    icon: TrendingUp,
    description: 'Forecast-driven growth with Monte Carlo simulations',
    confidence: '0.89',
    panelClass: 'hover:border-violet-400/20',
    iconWrapClass: 'bg-violet-400/10',
    iconClass: 'text-violet-400',
  },
  {
    name: 'Execute',
    icon: Zap,
    description: 'Consent-first automation with reversible actions',
    confidence: '0.91',
    panelClass: 'hover:border-amber-400/20',
    iconWrapClass: 'bg-amber-400/10',
    iconClass: 'text-amber-400',
  },
  {
    name: 'Govern',
    icon: Scale,
    description: 'Full audit trail for every AI decision',
    confidence: '0.97',
    panelClass: 'hover:border-blue-400/20',
    iconWrapClass: 'bg-blue-400/10',
    iconClass: 'text-blue-400',
  },
];

const governancePillars = [
  {
    title: 'Explainable',
    description: 'Every AI recommendation includes a reasoning chain and evidence.',
    icon: Brain,
    iconClass: 'text-blue-400',
    iconWrapClass: 'bg-blue-400/10',
  },
  {
    title: 'Auditable',
    description: 'Immutable logs from model signal to user-visible action.',
    icon: ScrollText,
    iconClass: 'text-teal-400',
    iconWrapClass: 'bg-teal-400/10',
  },
  {
    title: 'Reversible',
    description: 'High-impact actions remain reversible with explicit consent gates.',
    icon: RotateCcw,
    iconClass: 'text-amber-400',
    iconWrapClass: 'bg-amber-400/10',
  },
];

export default function LandingPreviewNew() {
  return (
    <div className="app-bg-oled min-h-screen text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-teal-400 focus:px-4 focus:py-2 focus:text-slate-950"
      >
        Skip to main content
      </a>

      <nav className="glass-header sticky top-0 z-50 border-b border-white/[0.06]" aria-label="Main navigation">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2 text-lg font-bold text-slate-100">
            <Waves className="h-5 w-5 text-teal-400" />
            Poseidon
          </a>
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="/dashboard" className="hover:text-white">Product</a>
            <a href="/pricing" className="hover:text-white">Pricing</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <a href="/login" className="text-sm text-slate-300 hover:text-white">Sign in</a>
            <a href="/dashboard" className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <main id="main-content" role="main" className="pb-12">
        <section className="relative overflow-hidden px-6 pt-24 pb-16 text-center md:pt-32">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/[0.07] blur-[120px]" />
          </div>
          <div className="relative mx-auto max-w-5xl">
            <motion.h1 className="text-balance text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl" variants={fadeUp} initial="hidden" animate="visible">
              Safer satisfying money decisions, in one place.
            </motion.h1>
            <motion.p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl" variants={fadeUp} initial="hidden" animate="visible">
              Four AI engines working together. Every decision explainable, auditable, and reversible.
            </motion.p>
            <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-4" variants={fadeUp} initial="hidden" animate="visible">
              <a href="/dashboard" className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 px-8 py-4 text-lg font-semibold text-slate-950 shadow-[0_0_30px_rgba(13,217,180,0.3)]">
                Open Dashboard
              </a>
              <button type="button" className="flex items-center gap-2 rounded-xl border border-white/[0.1] px-8 py-4 text-white hover:bg-white/[0.05]">
                <Play className="h-4 w-4" />
                Watch Demo
              </button>
            </motion.div>
            <motion.div className="mt-6 flex flex-wrap items-center justify-center gap-7 text-xs text-slate-300" variants={fadeUp} initial="hidden" animate="visible">
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Bank-grade encryption</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />GDPR compliant</span>
              <span className="flex items-center gap-1.5"><ScrollText className="h-3.5 w-3.5" />100% auditable</span>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6" aria-label="Live metrics">
          <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {metrics.map((metric) => (
              <motion.div
                key={metric.label}
                variants={fadeUp}
                className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">{metric.label}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
                <ResponsiveContainer width={60} height={24}>
                  <AreaChart data={metric.data.map((v) => ({ v }))}>
                    <Area type="monotone" dataKey="v" stroke={metric.color} strokeWidth={1.5} fill={metric.color} fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto mt-20 max-w-7xl px-6" aria-label="Engine overview">
          <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-4xl">Four engines. One trusted system.</h2>
          <motion.div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {engines.map((engine) => {
              const Icon = engine.icon;
              return (
                <motion.article key={engine.name} variants={fadeUp} className={`rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-xl ${engine.panelClass}`}>
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${engine.iconWrapClass}`}>
                      <Icon className={`h-6 w-6 ${engine.iconClass}`} />
                    </div>
                    <span className="rounded-full bg-white/[0.07] px-2.5 py-1 font-mono text-xs text-white">{engine.confidence}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{engine.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">{engine.description}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <section className="mx-auto mt-20 max-w-7xl px-6" aria-label="Governance proof">
          <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-4xl">Governance by design, not by checkbox</h2>
          <motion.div className="grid grid-cols-1 gap-4 md:grid-cols-3" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {governancePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <motion.article key={pillar.title} variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${pillar.iconWrapClass}`}>
                    <Icon className={`h-6 w-6 ${pillar.iconClass}`} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{pillar.description}</p>
                </motion.article>
              );
            })}
          </motion.div>
          <motion.div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.03] px-6 py-3 backdrop-blur-xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-center font-mono text-xs text-slate-300">
              System uptime 99.97% · Last audit: 4m ago · Model version: v3.2.1 · Decisions today: 47
            </p>
          </motion.div>
        </section>
      </main>

      <footer className="mt-20 border-t border-white/[0.06] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 text-center">
          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">MIT Sloan CTO Program · Group 7 · March 2026</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
