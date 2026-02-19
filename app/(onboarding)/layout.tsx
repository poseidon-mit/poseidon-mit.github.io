"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Waves, Check } from "lucide-react"

const STEPS = [
  { path: "/onboarding", label: "Welcome" },
  { path: "/onboarding/connect", label: "Connect" },
  { path: "/onboarding/goals", label: "Goals" },
  { path: "/onboarding/consent", label: "Consent" },
  { path: "/onboarding/complete", label: "Complete" },
]

function StepIndicator() {
  const pathname = usePathname()
  const currentIdx = STEPS.findIndex((s) => pathname === s.path)

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const isDone = i < currentIdx
        const isCurrent = i === currentIdx
        return (
          <div key={step.path} className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors"
              style={{
                background: isDone
                  ? "var(--state-healthy)"
                  : isCurrent
                  ? "var(--engine-dashboard)"
                  : "rgba(255,255,255,0.06)",
                color: isDone || isCurrent ? "#0B1221" : "#64748B",
                border: !isDone && !isCurrent ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
            >
              {isDone ? <Check size={14} /> : i + 1}
            </div>
            <span
              className="hidden sm:inline text-xs font-medium"
              style={{ color: isCurrent ? "#F1F5F9" : "#64748B" }}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className="w-6 lg:w-10 h-px"
                style={{
                  background: isDone ? "var(--state-healthy)" : "rgba(255,255,255,0.08)",
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Top bar with logo + step indicator */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          background: "rgba(11,18,33,0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto max-w-4xl px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="Poseidon.AI home">
            <Waves size={20} style={{ color: "var(--engine-dashboard)" }} />
            <span className="text-sm font-bold" style={{ color: "#F1F5F9" }}>Poseidon.AI</span>
          </Link>
          <StepIndicator />
        </div>
      </header>
      {children}
    </div>
  )
}
