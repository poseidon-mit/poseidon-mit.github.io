import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Shield, TrendingUp, Zap, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ButtonLink, AuroraGradient, Badge } from '@/design-system';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-oled)] text-white overflow-x-hidden selection:bg-cyan-500/30 font-sans pb-24 md:pb-0">
      <AuroraGradient engine="execute" intensity="vivid" className="fixed inset-0 pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight hover:opacity-80 transition-opacity cursor-pointer">Poseidon.AI</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <ButtonLink to="/login" variant="glass" className="px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold border border-white/10 hover:bg-white/5 transition-all">
            Sign In
          </ButtonLink>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center">

        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center w-full max-w-4xl mx-auto space-y-6 md:space-y-8 mb-20 md:mb-32">
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <Badge variant="info" className="px-4 py-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              MIT Research Prototype - Autonomous Finance
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-[1.05] text-balance">
            The Engine for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              Modern Wealth.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp} className="text-base md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed px-4 text-balance">
            Experience the first hyper-personalized, autonomous financial engine that protects, grows, and manages your money with absolute transparency.
          </motion.p>

          {/* Video Placeholder */}
          <motion.div variants={fadeUp} className="w-full mt-12 mb-12 h-[300px] md:h-[500px] relative rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl shadow-2xl flex items-center justify-center group mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-50 mix-blend-overlay"></div>
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            <div className="relative z-10 text-center flex flex-col items-center">
              <Shield className="w-12 h-12 md:w-16 md:h-16 text-white/20 mb-4 drop-shadow-2xl" />
              <p className="text-white/40 tracking-widest uppercase text-xs md:text-sm font-semibold">Liquid Intelligence / Video Area</p>
            </div>
          </motion.div>

        </motion.div>

        {/* Value Propositions */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="w-full max-w-5xl mx-auto space-y-16">
          <motion.div variants={fadeUp} className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">Four Engines. Complete Control.</h2>
            <p className="text-slate-400 font-light max-w-xl mx-auto text-sm md:text-base px-4">Poseidon.AI handles the complexity of your financial life intuitively and transparently.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

            {/* Protect */}
            <motion.div variants={fadeUp} className="rounded-[32px] p-6 md:p-8 border border-white/[0.08] bg-black/40 backdrop-blur-xl hover:bg-white/[0.06] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-3 tracking-wide">Protect</h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6 text-sm md:text-base">Halts fraud instantly so you don't have to worry. Smart blocking catches anomalies before money leaves your account.</p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500/70" /> Active Threat Monitoring</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500/70" /> Automated Risk Freezes</li>
              </ul>
            </motion.div>

            {/* Grow */}
            <motion.div variants={fadeUp} className="rounded-[32px] p-6 md:p-8 border border-white/[0.08] bg-black/40 backdrop-blur-xl hover:bg-white/[0.06] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(139,92,246,0.15)] group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-3 tracking-wide">Grow</h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6 text-sm md:text-base">Optimizes cash flow and subscriptions automatically. Let the engine find compounding routing opportunities effortlessly.</p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500/70" /> Subscription Consolidation</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-violet-500/70" /> Cash Yield Optimization</li>
              </ul>
            </motion.div>

            {/* Execute */}
            <motion.div variants={fadeUp} className="rounded-[32px] p-6 md:p-8 border border-white/[0.08] bg-black/40 backdrop-blur-xl hover:bg-white/[0.06] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-3 tracking-wide">Execute</h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6 text-sm md:text-base">Handles the busywork of paying bills and moving money accurately. Approve multi-step actions with a single tap.</p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500/70" /> Intelligent Auto-Pay</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-amber-500/70" /> Cross-Account Transfers</li>
              </ul>
            </motion.div>

            {/* Govern */}
            <motion.div variants={fadeUp} className="rounded-[32px] p-6 md:p-8 border border-white/[0.08] bg-black/40 backdrop-blur-xl hover:bg-white/[0.06] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(20,184,166,0.15)] group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-3 tracking-wide">Govern</h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6 text-sm md:text-base">Honest, explainable AI where you are always in control and can reverse anything. Full audit trails backing every decision.</p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-teal-500/70" /> Mathematical Transparency</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-teal-500/70" /> Decision Ledger Reversibility</li>
              </ul>
            </motion.div>

          </div>
        </motion.div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-50 md:hidden">
        <ButtonLink to="/signup" variant="primary" engine="dashboard" className="w-full py-4 rounded-2xl text-base font-bold shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 border border-cyan-500/50">
          Initialize Wealth Engine <ArrowRight className="w-4 h-4" />
        </ButtonLink>
      </div>

      {/* Desktop Sticky/Bottom CTA */}
      <div className="hidden md:flex justify-center pb-32 pt-16 relative z-10 w-full">
        <ButtonLink to="/signup" variant="primary" engine="dashboard" className="px-10 py-5 rounded-full text-lg font-bold shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] transition-all hover:scale-105 flex items-center gap-3 border border-cyan-500/50">
          Initialize Wealth Engine <ArrowRight className="w-5 h-5" />
        </ButtonLink>
      </div>

    </div>
  );
}
