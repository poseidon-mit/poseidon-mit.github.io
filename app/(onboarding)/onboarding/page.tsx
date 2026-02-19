"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Shield, TrendingUp, Zap, Scale, Waves, ArrowRight } from "lucide-react"

const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const STEPS_PREVIEW = [
  { icon: Shield, label: "Connect", desc: "Link your financial accounts securely with read-only access" },
  { icon: TrendingUp, label: "Set goals", desc: "Define what matters most to your financial growth" },
  { icon: Scale, label: "Set boundaries", desc: "Control what the AI can and cannot do on your behalf" },
  { icon: Zap, label: "Activate", desc: "Your AI engines start working immediately" },
]

export default function OnboardingWelcomePage() {
  return (
    <main id="main-content" className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(50% 40% at 50% 0%, rgba(0,240,255,0.05), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          {/* Logo */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-8">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{ background: "rgba(0,240,255,0.08)", border: "1px solid rgba(0,240,255,0.15)" }}
            >
              <Waves size={28} style={{ color: "var(--engine-dashboard)" }} />
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4 text-balance"
            style={{ color: "#F1F5F9" }}
          >
            {"Let's set up your financial command center"}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base mb-12" style={{ color: "#94A3B8" }}>
            4 quick steps to activate your AI engines. Takes under 3 minutes.
          </motion.p>

          {/* Step preview cards */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 text-left">
            {STEPS_PREVIEW.map((step, i) => (
              <motion.div
                key={step.label}
                variants={fadeUp}
                className="glass-surface rounded-xl p-4 flex items-start gap-3"
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                  style={{ background: "rgba(0,240,255,0.08)" }}
                >
                  <step.icon size={18} style={{ color: "var(--engine-dashboard)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "#F1F5F9" }}>
                    {i + 1}. {step.label}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-4 flex-wrap mb-10 text-[10px] font-mono uppercase tracking-widest"
            style={{ color: "#475569" }}
          >
            <span>Read-only access</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>Bank-level encryption</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>Cancel anytime</span>
          </motion.div>

          {/* CTA: Primary -> /onboarding/connect */}
          <motion.div variants={fadeUp}>
            <Link
              href="/onboarding/connect"
              className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #14B8A6, #06B6D4)",
                color: "#0B1221",
              }}
            >
              Continue setup
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
