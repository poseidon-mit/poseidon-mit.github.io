import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Shield } from 'lucide-react';
import { ButtonLink, AuroraGradient, Badge } from '@/design-system';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }
};

const stagger: Variants = {
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-oled)] text-white overflow-x-hidden selection:bg-cyan-500/30">

      <AuroraGradient
        engine="govern"
        intensity="vivid"
        className="fixed inset-0 pointer-events-none z-0"
      />

      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-transparent backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Poseidon.AI</span>
        </div>
        <div className="flex items-center gap-4">
          <ButtonLink to="/login" variant="glass" className="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/10 hover:bg-white/5 transition-all">
            Sign In
          </ButtonLink>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center">

        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center max-w-4xl mx-auto space-y-8 mb-32"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="info" className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase mb-6 mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              MIT Research Project
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[1.05] text-balance"
          >
            The Engine for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500">
              Modern Wealth.
            </span>
          </motion.h1>



          <motion.div variants={fadeUp} className="pt-8 flex justify-center">
            <ButtonLink to="/signup" variant="primary" engine="dashboard" className="px-8 py-4 rounded-full text-lg font-semibold min-w-[240px] hover:scale-[1.02] shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] transition-all duration-500">
              Get Started
            </ButtonLink>
          </motion.div>
        </motion.div>

        {/* Decorative Liquid Glass Visual Element (Placeholder for Video/3D) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full max-w-5xl mx-auto h-[400px] md:h-[600px] relative rounded-[40px] overflow-hidden border border-white/[0.08] bg-white/[0.02] backdrop-blur-3xl shadow-2xl flex items-center justify-center group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-50 mix-blend-overlay"></div>
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          <div className="relative z-10 text-center">
            <Shield className="w-16 h-16 text-white/20 mx-auto mb-6 drop-shadow-2xl" />
            <p className="text-white/40 tracking-widest uppercase text-sm font-semibold">Liquid Intelligence</p>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
