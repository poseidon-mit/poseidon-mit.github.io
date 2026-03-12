import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Zap, Shield, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";
import { Link, useRouter } from "@/router";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion-presets";
import { usePageTitle } from "@/hooks/use-page-title";
import { OrbitalConstellation } from "@/components/poseidon/OrbitalConstellation";
import { formatUsd } from "@/domain/poseidon-universe";

export default function Dashboard() {
  usePageTitle("Dashboard");

  return (
    <div className="absolute inset-x-0 bottom-0 lg:top-[72px] top-16 p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 overflow-hidden bg-[#0A1628] text-white">
      {/* 
        ========================================================================================
        HERO COMMAND CENTER - 100VH, NO SCROLLING
        ========================================================================================
      */}
      <motion.div
        className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* TOP ROW: PORTFOLIO & INSIGHTS (Taking approx 55-60% of height) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 min-h-0" style={{ flex: 3 }}>
          {/* Portfolio Trajectory + Orbital Constellation */}
          <motion.div
            variants={staggerItem}
            className="lg:col-span-2 relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md p-8 md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,240,255,0.08),transparent_60%)] pointer-events-none" />
            
            {/* The sophisticated 3D Physics Particle Array */}
            <OrbitalConstellation />

            <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="flex h-8 items-center rounded-full bg-white/10 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--engine-dashboard)] border border-[var(--engine-dashboard)]/20 backdrop-blur-md">
                  PORTFOLIO TRAJECTORY
                </span>
              </div>
              
              <div className="mt-auto">
                <h1 className="text-[clamp(3.5rem,7vw,6.5rem)] font-medium tracking-tight text-white leading-none drop-shadow-xl">
                  {formatUsd(284500)}
                </h1>
                <p className="mt-4 flex items-center gap-2 text-xl md:text-2xl font-mono text-[var(--engine-dashboard)] font-semibold drop-shadow-md">
                  <TrendingUp className="h-6 w-6" /> +{formatUsd(2450)} <span className="text-white/50 text-lg font-sans ml-1">(Past 30d)</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Insights ✨ */}
          <motion.div
            variants={staggerItem}
            className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md p-8 pt-10"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                AI INSIGHT ✨
              </span>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#0A1628] bg-green-500/20 flex items-center justify-center text-green-400"><Shield size={14}/></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#0A1628] bg-violet-500/20 flex items-center justify-center text-violet-400"><TrendingUp size={14}/></div>
              </div>
            </div>

            <div className="flex-1 flex items-center">
              <p className="text-2xl md:text-3xl font-medium leading-[1.3] tracking-tight">
                Poseidon detected <span className="text-red-400 font-semibold border-b border-red-500/30">6 critical anomalies</span> and found <span className="text-[var(--engine-grow)] font-semibold border-b border-[var(--engine-grow)]/30">{formatUsd(6800)}/yr</span> in missed yield.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                to="/execute"
                className="group flex w-full items-center justify-between rounded-2xl bg-white/10 px-6 py-5 transition-colors hover:bg-white/20 backdrop-blur-md border border-white/5"
              >
                <div className="flex items-center gap-3 font-semibold tracking-wide">
                  <Zap className="h-5 w-5 text-amber-400" />
                  REVIEW ACTIONS (15)
                </div>
                <ArrowRight className="h-5 w-5 text-white/50 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM ROW: TRI-COLUMN TRIAGE (Taking approx 40-45% of height) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 min-h-0" style={{ flex: 2 }}>
          
          {/* PROTECT COLUMN */}
          <motion.div
            variants={staggerItem}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md p-6 lg:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.1),transparent_50%)] pointer-events-none" />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  <ShieldCheck size={16} className="text-red-400" />
                </div>
                <span className="text-sm font-semibold tracking-wider text-red-400 uppercase">Protect</span>
                <span className="ml-auto text-xs font-mono bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/20">Critical</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">6 Anomalies Detected</h3>
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 text-sm">
                <p className="text-white/80 font-medium pb-1 border-b border-white/5 mb-1 flex justify-between">
                  <span>Top: Miami ATM</span>
                  <span className="text-red-400">$800.00</span>
                </p>
                <p className="text-white/40 text-xs">(Velocity Anomaly)</p>
              </div>
            </div>
            <div className="mt-6 flex-shrink-0">
              <Link to="/protect" className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20">
                Inspect 6 Threats <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* GROW COLUMN */}
          <motion.div
            variants={staggerItem}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md p-6 lg:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--engine-grow)]/20 text-[var(--engine-grow)] border border-[var(--engine-grow)]/30">
                  <TrendingUp size={16} />
                </div>
                <span className="text-sm font-semibold tracking-wider text-[var(--engine-grow)] uppercase">Grow</span>
                <span className="ml-auto text-xs font-mono bg-[var(--engine-grow)]/20 text-[var(--engine-grow)] px-2 py-1 rounded-full border border-[var(--engine-grow)]/20">Opportunity</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">9 Strategies Prepared</h3>
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 text-sm">
                <p className="text-white/80 font-medium pb-1 border-b border-white/5 mb-1 flex justify-between">
                  <span>Top: HYSA Transfer</span>
                  <span className="text-[var(--engine-grow)]">$15k</span>
                </p>
                <p className="text-white/40 text-xs">Est. +$675/year</p>
              </div>
            </div>
            <div className="mt-6 flex-shrink-0">
              <Link to="/grow" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--engine-grow)]/10 border border-[var(--engine-grow)]/20 py-3 text-sm font-semibold text-[var(--engine-grow)] transition hover:bg-[var(--engine-grow)]/20">
                View 9 Strategies <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* EXECUTE COLUMN */}
          <motion.div
            variants={staggerItem}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-[var(--engine-execute)]/5 border border-[var(--engine-execute)]/20 backdrop-blur-md p-6 lg:p-8 shadow-[inset_0_0_80px_rgba(234,179,8,0.05)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(234,179,8,0.15),transparent_60%)] pointer-events-none" />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--engine-execute)]/20 text-[var(--engine-execute)] border border-[var(--engine-execute)]/30">
                  <Zap size={16} />
                </div>
                <span className="text-sm font-semibold tracking-wider text-[var(--engine-execute)] uppercase">Execute</span>
                <span className="ml-auto text-xs font-mono bg-white/10 text-white/70 px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Pending
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">15 Total Actions</h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-[90%]">
                await your cryptographic signature to deploy automated remediation and growth pipelines.
              </p>
            </div>
            <div className="mt-6 flex-shrink-0">
              <Link to="/execute" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--engine-execute)] text-black py-4 text-sm font-bold tracking-wide transition hover:scale-[1.02] shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                GO TO VAULT (15) <ExternalLink size={16} />
              </Link>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
