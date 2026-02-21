import React, { useEffect } from 'react';
import { ChevronDown, Shield, TrendingUp, Zap, Scale, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { PublicTopBar } from '@/components/landing/PublicTopBar';

export default function Landing() {

  // Clean scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#05050A] overflow-x-hidden selection:bg-cyan-500 selection:text-black">

      {/* Top Level Content Wrapper (z-index 10) */}
      <div className="relative z-10 w-full font-manrope">

        {/* Navbar: Replaced with Signup Screen Top Bar */}
        <PublicTopBar />

        {/* Section 1: Hero */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-[102px] px-6 overflow-hidden">
          {/* Background Video (Constrained to Hero) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80"
              src="/videos/hero-theme-desktop.mp4"
            />
            {/* Fade out bottom to blend with background */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05050A] to-transparent" />

            {/* Unified Pill-shaped Blur Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-[871px] h-[508px] bg-[#000000] rounded-full blur-[77.5px] opacity-80 mix-blend-multiply" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-[900px] gap-[32px] mt-12 md:mt-24">

            {/* Badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">System Confidence: 0.92</span>
            </div>

            {/* Heading Block */}
            <div className="flex flex-col items-center gap-[16px] text-center">
              <h1 className="font-inter font-medium text-white text-[56px] md:text-[88px] tracking-[-3px] leading-[1.05]">
                Deterministic models compute.<br />
                <span className="font-instrument italic font-light text-cyan-400 drop-shadow-[0_0_40px_rgba(0,240,255,0.3)]">GenAI explains.</span>
              </h1>
              <p className="font-normal text-[#f6f7f9] opacity-80 text-[18px] md:text-[22px] leading-[1.6] max-w-[650px] mt-6 text-balance">
                The trusted AI-native money platform. AI Agents execute seamlessly. Humans confidently approve.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-[16px] md:gap-[24px] mt-8">
              <a href="/signup" className="flex items-center gap-2 bg-gradient-to-b from-[#7b39fc] to-[#6a2ce0] shadow-[0px_0px_40px_rgba(123,57,252,0.4)] px-[32px] py-[16px] rounded-[12px] font-cabin font-medium text-[16px] md:text-[18px] text-white hover:scale-[1.02] transition-transform">
                Activate Financial Engine
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/CTO-Group7-Poseidon.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-[32px] py-[16px] rounded-[12px] font-cabin font-medium text-[16px] md:text-[18px] text-white hover:bg-white/10 transition-colors">
                Read MIT Abstract
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: Core Formula Bento Box (Show, Don't Tell) */}
        <section className="relative w-full py-32 px-6 md:px-12 z-10">
          <div className="max-w-[1200px] w-full mx-auto">

            <div className="text-center mb-20">
              <h2 className="font-instrument italic text-white text-[48px] md:text-[64px] tracking-tight leading-[1.1]">
                Four sovereign engines.<br />One unified system.
              </h2>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

              {/* Protect Card */}
              <div className="group relative p-8 md:p-10 rounded-[32px] backdrop-blur-[24px] bg-[#05050A]/60 border border-white/5 hover:border-green-500/30 transition-all overflow-hidden flex flex-col justify-between min-h-[400px]">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col gap-4 max-w-[80%]">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-400" />
                    <h3 className="font-inter text-2xl text-white">Protect</h3>
                  </div>
                  <p className="text-white/60 text-lg">Real-time threat detection and active fraud blocking.</p>
                </div>

                {/* Mini UI Teaser */}
                <div className="relative z-10 mt-10 p-6 rounded-[16px] bg-black/40 border border-white/5 shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-green-400 uppercase tracking-wider">Critical Block</span>
                    <span className="text-xs text-white/40">Just now</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-white font-inter text-2xl tracking-tight">$2,847</div>
                      <div className="text-white/60 text-sm mt-1">TechElectro Store</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-sm font-medium">Blocked</div>
                      <div className="text-white/40 text-xs font-mono mt-1">THR-001</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grow Card */}
              <div className="group relative p-8 md:p-10 rounded-[32px] backdrop-blur-[24px] bg-[#05050A]/60 border border-white/5 hover:border-violet-500/30 transition-all overflow-hidden flex flex-col justify-between min-h-[400px]">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col gap-4 max-w-[80%]">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-violet-400" />
                    <h3 className="font-inter text-2xl text-white">Grow</h3>
                  </div>
                  <p className="text-white/60 text-lg">Strategic cash flow optimization and automated high-yield routing.</p>
                </div>

                {/* Mini UI Teaser */}
                <div className="relative z-10 mt-10 p-6 rounded-[16px] bg-black/40 border border-white/5 shadow-2xl flex items-center gap-6">
                  {/* Fake Progress Ring */}
                  <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-violet-500/20">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="36" cy="36" r="36" className="stroke-violet-500 fill-none" strokeWidth="8" strokeDasharray="226" strokeDashoffset="61" />
                    </svg>
                    <span className="font-inter text-xl text-white font-medium">73%</span>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Emergency Fund</div>
                    <div className="text-white font-inter text-2xl tracking-tight">$7,300 <span className="text-white/40 text-lg">/ $10,000</span></div>
                  </div>
                </div>
              </div>

              {/* Execute Card */}
              <div className="group relative p-8 md:p-10 rounded-[32px] backdrop-blur-[24px] bg-[#05050A]/60 border border-white/5 hover:border-amber-500/30 transition-all overflow-hidden flex flex-col justify-between min-h-[400px]">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col gap-4 max-w-[80%]">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-amber-400" />
                    <h3 className="font-inter text-2xl text-white">Execute</h3>
                  </div>
                  <p className="text-white/60 text-lg">Intelligent automation with consent-first, human-in-the-loop approvals.</p>
                </div>

                {/* Mini UI Teaser */}
                <div className="relative z-10 mt-10 p-6 rounded-[16px] bg-black/40 border border-white/5 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-inter text-white text-xl">5 pending actions</span>
                    <span className="text-amber-400 text-sm font-medium bg-amber-500/10 px-3 py-1 rounded-full">Requires Approval</span>
                  </div>
                  <button className="w-full bg-amber-500 text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                    Consent & Execute All
                  </button>
                </div>
              </div>

              {/* Govern Card */}
              <div className="group relative p-8 md:p-10 rounded-[32px] backdrop-blur-[24px] bg-[#05050A]/60 border border-white/5 hover:border-blue-500/30 transition-all overflow-hidden flex flex-col justify-between min-h-[400px]">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col gap-4 max-w-[80%]">
                  <div className="flex items-center gap-3">
                    <Scale className="w-6 h-6 text-blue-400" />
                    <h3 className="font-inter text-2xl text-white">Govern</h3>
                  </div>
                  <p className="text-white/60 text-lg">Immutable decision ledger with full cryptographic and semantic transparency.</p>
                </div>

                {/* Mini UI Teaser */}
                <div className="relative z-10 mt-10 grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-[16px] bg-black/40 border border-white/5 shadow-2xl">
                    <div className="text-white/60 text-sm mb-2">Decisions Audited</div>
                    <div className="text-white font-inter text-3xl tracking-tight">1,247</div>
                  </div>
                  <div className="p-5 rounded-[16px] bg-black/40 border border-white/5 shadow-2xl">
                    <div className="text-white/60 text-sm mb-2">Compliance Score</div>
                    <div className="flex items-end gap-1">
                      <div className="text-white font-inter text-3xl tracking-tight">96</div>
                      <div className="text-white/40 text-lg mb-1">/100</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 3: The Coordination Gap */}
        <section className="relative w-full py-32 px-6 border-y border-white/5 bg-black/40 backdrop-blur-md z-10">
          <div className="max-w-[1000px] mx-auto text-center">
            <h2 className="font-inter text-white text-[32px] md:text-[48px] tracking-tight leading-[1.2] mb-16">
              The coordination gap is costing you.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              <div className="flex flex-col items-center">
                <div className="font-instrument italic text-[64px] text-cyan-400 mb-2">$133<span className="text-3xl text-cyan-400/50">/mo</span></div>
                <div className="text-white/60 text-lg">Average subscription waste per active user due to lack of visibility.</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-instrument italic text-[64px] text-green-400 mb-2">$12.5<span className="text-3xl text-green-400/50">B</span></div>
                <div className="text-white/60 text-lg">Lost to fraud and theft annually due to delayed threat response.</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-instrument italic text-[64px] text-amber-400 mb-2">$12<span className="text-3xl text-amber-400/50">B</span></div>
                <div className="text-white/60 text-lg">In overdraft and NSF fees caused by uncoordinated cash flow.</div>
              </div>
            </div>

            <p className="font-manrope text-white/50 text-sm mt-16 mt-16 max-w-2xl mx-auto">
              Data aggregation is solved. Coordination is not. Poseidon is the missing coordination layer that acts instantly upon your linked financial data.
            </p>
          </div>
        </section>

        {/* Section 4: Final Ascent (Outro) */}
        <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center py-32 px-6 text-center z-10">
          <Lock className="w-8 h-8 text-white/40 mb-8" />
          <h2 className="font-inter font-medium text-white text-[48px] md:text-[64px] tracking-[-2px] leading-[1.1] mb-8">
            Take control of the narrative.
          </h2>
          <p className="font-manrope text-white/70 text-xl max-w-2xl text-balance mb-12">
            Experience the MIT prototype. Full cryptographic transparency, zero hallucination execution.
          </p>
          <a href="/signup" className="group relative inline-flex items-center justify-center px-8 py-4 font-cabin font-bold text-lg text-white transition-all duration-200 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 overflow-hidden">
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
            <span className="relative flex items-center gap-2">
              Enter Prototype
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>

          <footer className="absolute bottom-8 w-full flex justify-center text-white/30 font-mono text-xs tracking-wider uppercase">
            © 2026 Poseidon Web3 Infrastructure · MIT Capstone
          </footer>
        </section>

      </div>
    </div>
  );
}
