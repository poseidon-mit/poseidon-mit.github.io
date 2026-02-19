"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Info } from "lucide-react"

const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

interface ConsentItem {
  id: string
  label: string
  desc: string
  required: boolean
}

const CONSENT_ITEMS: ConsentItem[] = [
  { id: "analyze", label: "Analyze my transactions", desc: "Allow AI engines to process your financial data to detect threats and find opportunities.", required: true },
  { id: "recommend", label: "Generate recommendations", desc: "Allow AI to suggest actions like savings transfers, budget adjustments, and investment moves.", required: false },
  { id: "approve", label: "Require my approval before acting", desc: "Every automated action must be explicitly approved by you before execution.", required: true },
  { id: "notifications", label: "Send real-time alerts", desc: "Receive notifications about threats, opportunities, and pending approvals.", required: false },
]

export default function OnboardingConsentPage() {
  const [consents, setConsents] = useState<Record<string, boolean>>({
    analyze: true,
    recommend: true,
    approve: true,
    notifications: true,
  })

  const toggle = (id: string) => {
    const item = CONSENT_ITEMS.find((c) => c.id === id)
    if (item?.required) return
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }))
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
            Set your boundaries
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm mb-8" style={{ color: "#94A3B8" }}>
            Control exactly what Poseidon can do. You can adjust these at any time from Settings.
          </motion.p>

          {/* Consent toggles */}
          <motion.div variants={staggerContainer} className="flex flex-col gap-3 mb-8">
            {CONSENT_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="glass-surface rounded-xl p-4 flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{item.label}</p>
                    {item.required && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(0,240,255,0.1)", color: "var(--engine-dashboard)" }}
                      >
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>{item.desc}</p>
                </div>
                <button
                  onClick={() => toggle(item.id)}
                  className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors mt-1"
                  style={{
                    background: consents[item.id] ? "var(--engine-dashboard)" : "rgba(255,255,255,0.1)",
                    opacity: item.required ? 0.7 : 1,
                    cursor: item.required ? "not-allowed" : "pointer",
                  }}
                  aria-checked={consents[item.id]}
                  aria-label={item.label}
                  role="switch"
                  disabled={item.required}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                    style={{
                      background: "#0B1221",
                      left: consents[item.id] ? "calc(100% - 22px)" : "2px",
                    }}
                  />
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary */}
          <motion.div
            variants={fadeUp}
            className="glass-surface rounded-xl p-4 flex items-start gap-3 mb-8"
          >
            <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--engine-dashboard)" }} />
            <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
              All AI decisions are logged in the immutable audit ledger. You can review, reverse, or dispute any action at any time through the Govern engine.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <Link
              href="/onboarding/goals"
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#64748B" }}
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            {/* CTA: Primary -> /onboarding/complete */}
            <Link
              href="/onboarding/complete"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #14B8A6, #06B6D4)",
                color: "#0B1221",
              }}
            >
              Activate Poseidon
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
