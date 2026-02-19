"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle2, Shield, TrendingUp, Zap, Scale, ArrowRight } from "lucide-react"

const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const READY_ITEMS = [
  { icon: Shield, label: "Protect engine", desc: "Monitoring for threats", color: "var(--engine-protect)" },
  { icon: TrendingUp, label: "Grow engine", desc: "Tracking your goals", color: "var(--engine-grow)" },
  { icon: Zap, label: "Execute engine", desc: "Ready for approvals", color: "var(--engine-execute)" },
  { icon: Scale, label: "Govern engine", desc: "Audit trail active", color: "var(--engine-govern)" },
]

export default function OnboardingCompletePage() {
  return (
    <main id="main-content" className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(40% 30% at 50% 20%, rgba(16,185,129,0.06), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          {/* Success icon */}
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <CheckCircle2 size={32} style={{ color: "var(--state-healthy)" }} />
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-3 text-balance"
            style={{ color: "#F1F5F9" }}
          >
            {"You're all set"}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base mb-10" style={{ color: "#94A3B8" }}>
            Your AI engines are now active and working on your behalf. Every decision is explainable, auditable, and reversible.
          </motion.p>

          {/* Readiness checklist */}
          <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-3 mb-10">
            {READY_ITEMS.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className="glass-surface rounded-xl p-4 flex items-center gap-3"
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                  style={{ background: `${item.color}15` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold" style={{ color: "#F1F5F9" }}>{item.label}</p>
                  <p className="text-[10px]" style={{ color: "var(--state-healthy)" }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Setup summary */}
          <motion.div
            variants={fadeUp}
            className="glass-surface rounded-xl p-4 mb-10 text-left"
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
              Setup summary
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "#94A3B8" }}>Accounts connected</span>
                <span className="font-mono font-semibold" style={{ color: "#F1F5F9" }}>3</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "#94A3B8" }}>Goals selected</span>
                <span className="font-mono font-semibold" style={{ color: "#F1F5F9" }}>2</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "#94A3B8" }}>Consent boundaries</span>
                <span className="font-mono font-semibold" style={{ color: "var(--state-healthy)" }}>All set</span>
              </div>
            </div>
          </motion.div>

          {/* CTA: Primary -> /dashboard */}
          <motion.div variants={fadeUp}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #14B8A6, #06B6D4)",
                color: "#0B1221",
              }}
            >
              Enter dashboard
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
