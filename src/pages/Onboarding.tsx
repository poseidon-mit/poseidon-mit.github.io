import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from '@/router'
import { Building2, CreditCard, PiggyBank, Check, Shield, ArrowRight, ArrowLeft } from "lucide-react"
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'

const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const CONNECTORS = [
  {
    id: "bank",
    icon: Building2,
    label: "Bank account",
    desc: "Checking & savings accounts",
    status: "available" as const,
  },
  {
    id: "credit",
    icon: CreditCard,
    label: "Credit cards",
    desc: "Track spending and payments",
    status: "available" as const,
  },
  {
    id: "investment",
    icon: PiggyBank,
    label: "Investment accounts",
    desc: "Brokerage & retirement",
    status: "available" as const,
  },
]

export default function OnboardingConnectPage() {
  const [connected, setConnected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setConnected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <main id="main-content" className="relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "var(--engine-dashboard)", color: "#0B1221" }}
      >
        Skip to main content
      </a>
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <OnboardingProgress step={1} />
          <motion.h1
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-2 text-balance"
            style={{ color: "#F1F5F9" }}
          >
            Connect your financial accounts
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm mb-8" style={{ color: "#94A3B8" }}>
            We use read-only access. Poseidon never moves money or modifies your accounts.
          </motion.p>

          {/* Connection cards */}
          <motion.div variants={staggerContainer} className="flex flex-col gap-3 mb-8">
            {CONNECTORS.map((c) => {
              const isConnected = connected.has(c.id)
              return (
                <motion.button
                  key={c.id}
                  variants={fadeUp}
                  onClick={() => toggle(c.id)}
                  className="glass-surface rounded-xl p-4 flex items-center gap-4 text-left transition-all w-full"
                  style={{
                    border: isConnected
                      ? "1px solid rgba(16,185,129,0.4)"
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                    style={{
                      background: isConnected ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <c.icon size={20} style={{ color: isConnected ? "var(--state-healthy)" : "#64748B" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{c.label}</p>
                    <p className="text-xs" style={{ color: "#64748B" }}>{c.desc}</p>
                  </div>
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
                    style={{
                      background: isConnected ? "var(--state-healthy)" : "rgba(255,255,255,0.06)",
                      border: isConnected ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {isConnected && <Check size={14} style={{ color: "#0B1221" }} />}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Security note */}
          <motion.div
            variants={fadeUp}
            className="glass-surface rounded-xl p-4 flex items-start gap-3 mb-8"
          >
            <Shield size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--engine-dashboard)" }} />
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "#F1F5F9" }}>Read-only access</p>
              <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
                We use bank-level encryption and never store credentials. Your data is analyzed locally and every access is logged in the audit ledger.
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <Link
              to="/onboarding"
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#64748B" }}
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/onboarding/goals"
                className="text-sm font-medium px-4 py-2 rounded-xl"
                style={{ color: "#94A3B8" }}
              >
                Skip for now
              </Link>
              {/* CTA: Primary -> /onboarding/goals */}
              <Link
                to="/onboarding/goals"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
                style={{
                  background: "linear-gradient(135deg, #14B8A6, #06B6D4)",
                  color: "#0B1221",
                }}
              >
                Continue to goals
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
