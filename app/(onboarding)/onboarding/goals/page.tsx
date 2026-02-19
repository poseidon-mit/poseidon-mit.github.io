"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Shield, TrendingUp, PiggyBank, Target, ArrowRight, ArrowLeft, Check } from "lucide-react"

const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const GOALS = [
  { id: "protect", icon: Shield, label: "Protect my money", desc: "Detect fraud, block threats, monitor risk", color: "var(--engine-protect)" },
  { id: "grow", icon: TrendingUp, label: "Grow my wealth", desc: "Optimize savings, hit financial milestones", color: "var(--engine-grow)" },
  { id: "save", icon: PiggyBank, label: "Build emergency fund", desc: "Automated savings toward safety net", color: "var(--engine-execute)" },
  { id: "invest", icon: Target, label: "Invest smarter", desc: "Scenario-based portfolio optimization", color: "var(--engine-dashboard)" },
]

export default function OnboardingGoalsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["protect"]))

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <main id="main-content" className="relative">
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.h1
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-2 text-balance"
            style={{ color: "#F1F5F9" }}
          >
            What matters most to you?
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm mb-8" style={{ color: "#94A3B8" }}>
            Select your priorities. Your AI engines will be tuned accordingly. You can always change these later.
          </motion.p>

          {/* Goal cards grid */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {GOALS.map((goal) => {
              const isSelected = selected.has(goal.id)
              return (
                <motion.button
                  key={goal.id}
                  variants={fadeUp}
                  onClick={() => toggle(goal.id)}
                  className="glass-surface rounded-xl p-4 text-left transition-all relative"
                  style={{
                    border: isSelected
                      ? `1px solid ${goal.color}50`
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: goal.color }}
                    >
                      <Check size={12} style={{ color: "#0B1221" }} />
                    </div>
                  )}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg mb-3"
                    style={{ background: `${goal.color}15` }}
                  >
                    <goal.icon size={20} style={{ color: goal.color }} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>{goal.label}</p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>{goal.desc}</p>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <Link
              href="/onboarding/connect"
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#64748B" }}
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            {/* CTA: Primary -> /onboarding/consent */}
            <Link
              href="/onboarding/consent"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
              style={{
                background: selected.size > 0 ? "linear-gradient(135deg, #14B8A6, #06B6D4)" : "rgba(255,255,255,0.06)",
                color: selected.size > 0 ? "#0B1221" : "#64748B",
                pointerEvents: selected.size > 0 ? "auto" : "none",
              }}
            >
              Continue to consent
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
