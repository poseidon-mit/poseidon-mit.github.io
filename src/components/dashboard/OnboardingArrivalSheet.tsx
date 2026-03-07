import { useEffect, useState } from 'react'
import { Shield, TrendingUp, Zap, Scale, CheckCircle } from 'lucide-react'
import { BottomSheet } from '@/components/ui/sheet'

const ARRIVAL_KEY = 'poseidon-onboarding-arrival'

const ENGINES = [
  { label: 'Protect', color: 'var(--engine-protect)', icon: Shield },
  { label: 'Grow', color: 'var(--engine-grow)', icon: TrendingUp },
  { label: 'Execute', color: 'var(--engine-execute)', icon: Zap },
  { label: 'Govern', color: 'var(--engine-govern)', icon: Scale },
] as const

export function OnboardingArrivalSheet() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(ARRIVAL_KEY) === 'pending') {
        sessionStorage.removeItem(ARRIVAL_KEY)
        setTimeout(() => setOpen(true), 400)
      }
    } catch { /* noop */ }
  }, [])

  return (
    <BottomSheet open={open} onDismiss={() => setOpen(false)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
          P
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Poseidon is now active</h2>
          <p className="text-xs text-white/40">Your AI is analyzing your financial data</p>
        </div>
      </div>

      {/* Engine status grid */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {ENGINES.map(({ label, color, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
          >
            <Icon size={14} style={{ color }} />
            <span className="text-xs font-medium text-white/70 flex-1">{label}</span>
            <CheckCircle size={12} style={{ color }} />
          </div>
        ))}
      </div>

      <p className="text-xs text-white/40 mb-5 leading-relaxed">
        All four engines are running. Poseidon will surface insights, flag risks, and queue actions for your approval.
      </p>

      {/* CTA */}
      <button
        onClick={() => setOpen(false)}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 min-h-[44px] text-sm font-semibold text-white hover:from-cyan-400 hover:to-blue-400 transition-all"
      >
        Go to Command Center
      </button>
    </BottomSheet>
  )
}
