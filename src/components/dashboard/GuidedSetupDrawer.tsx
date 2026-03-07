import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Landmark,
  CreditCard,
  BarChart3,
  Check,
  Loader2,
} from 'lucide-react'
import { BottomSheet } from '@/components/ui/sheet'
import { useDemoState } from '@/lib/demo-state/provider'

const SETUP_DEFERRED_KEY = 'poseidon-setup-deferred'
const SHOW_DELAY_MS = 300

type Step = 1 | 2 | 3

const CHAT_MESSAGES: Record<Step, string> = {
  1: 'Let me connect your accounts securely.',
  2: 'What should I focus on?',
  3: 'How much autonomy should I have?',
}

/* ── Step 1: Connect Accounts ── */

interface AccountRow {
  id: string
  label: string
  icon: typeof Landmark
}

const ACCOUNTS: AccountRow[] = [
  { id: 'bank', label: 'Bank Account', icon: Landmark },
  { id: 'credit', label: 'Credit Card', icon: CreditCard },
  { id: 'invest', label: 'Investments', icon: BarChart3 },
]

/* ── Step 2: Priorities ── */

const ENGINES = [
  { id: 'protect', label: 'Protect', color: 'var(--engine-protect)' },
  { id: 'grow', label: 'Grow', color: 'var(--engine-grow)' },
  { id: 'execute', label: 'Execute', color: 'var(--engine-execute)' },
  { id: 'govern', label: 'Govern', color: 'var(--engine-govern)', locked: true },
] as const

/* ── Step 3: Autonomy ── */

const AUTONOMY_OPTIONS = ['Advisory', 'Suggest & Queue', 'Auto < $50'] as const

/* ── Slide variant ── */

const slideVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
}

export function GuidedSetupDrawer() {
  const { state, updateOnboarding, markOnboardingCompleted } = useDemoState()
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (state.onboarding.completed) return
    try {
      if (sessionStorage.getItem(SETUP_DEFERRED_KEY) === 'true') return
    } catch { /* noop */ }
    timerRef.current = setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => clearTimeout(timerRef.current)
  }, [state.onboarding.completed])

  const [step, setStep] = useState<Step>(1)
  const [connected, setConnected] = useState<Set<string>>(new Set())
  const [connecting, setConnecting] = useState<string | null>(null)
  const [selectedEngines, setSelectedEngines] = useState<Set<string>>(new Set(['govern']))
  const [autonomy, setAutonomy] = useState(1) // index into AUTONOMY_OPTIONS

  const dismiss = useCallback(() => {
    setOpen(false)
    try { sessionStorage.setItem(SETUP_DEFERRED_KEY, 'true') } catch { /* noop */ }
  }, [])

  const handleConnect = useCallback((id: string) => {
    if (connected.has(id)) return
    setConnecting(id)
    setTimeout(() => {
      setConnected(prev => new Set(prev).add(id))
      setConnecting(null)
    }, 800)
  }, [connected])

  const handleConnectAll = useCallback(() => {
    ACCOUNTS.forEach((a, i) => {
      setTimeout(() => {
        setConnected(prev => new Set(prev).add(a.id))
      }, i * 400)
    })
  }, [])

  const toggleEngine = useCallback((id: string) => {
    if (id === 'govern') return // locked
    setSelectedEngines(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleComplete = useCallback(() => {
    updateOnboarding({
      connectedAccountIds: Array.from(connected),
      selectedGoals: Array.from(selectedEngines),
    })
    markOnboardingCompleted()
    setOpen(false)
  }, [connected, selectedEngines, updateOnboarding, markOnboardingCompleted])

  const canAdvance1 = connected.size > 0
  const canAdvance2 = selectedEngines.size > 1 // govern is always in, need at least one more

  return (
    <BottomSheet open={open} onDismiss={dismiss} persistent>
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-3">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === step ? 'bg-cyan-400' : i < step ? 'bg-cyan-400/50' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Poseidon chat line */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
          P
        </div>
        <p className="text-sm text-white/70">{CHAT_MESSAGES[step]}</p>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {step === 1 && (
            <div className="space-y-2">
              {ACCOUNTS.map(account => {
                const Icon = account.icon
                const isConnected = connected.has(account.id)
                const isConnecting = connecting === account.id
                return (
                  <button
                    key={account.id}
                    onClick={() => handleConnect(account.id)}
                    disabled={isConnected || isConnecting}
                    className="w-full flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 min-h-[44px] hover:bg-white/8 transition-colors disabled:opacity-60"
                  >
                    <Icon size={18} className="text-white/50" />
                    <span className="text-sm text-white flex-1 text-left">{account.label}</span>
                    {isConnecting && <Loader2 size={16} className="text-cyan-400 animate-spin" />}
                    {isConnected && <Check size={16} className="text-emerald-400" />}
                  </button>
                )
              })}
              <button
                onClick={handleConnectAll}
                disabled={connected.size === ACCOUNTS.length}
                className="w-full text-xs text-cyan-400 hover:text-cyan-300 py-1 disabled:opacity-40"
              >
                Connect All
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {ENGINES.map(engine => {
                const isSelected = selectedEngines.has(engine.id)
                return (
                  <button
                    key={engine.id}
                    onClick={() => toggleEngine(engine.id)}
                    disabled={engine.locked}
                    className={`rounded-xl border p-3 min-h-[44px] text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-white/20 bg-white/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-white/40'
                    } ${engine.locked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white/8'}`}
                  >
                    <div
                      className="w-2 h-2 rounded-full mb-1.5 mx-auto"
                      style={{ background: isSelected ? engine.color : 'rgba(255,255,255,0.15)' }}
                    />
                    {engine.label}
                    {engine.locked && (
                      <span className="block text-[10px] text-white/30 mt-0.5">Required</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="flex gap-1">
                {AUTONOMY_OPTIONS.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setAutonomy(i)}
                    className={`flex-1 rounded-lg py-2 px-1 text-xs font-medium transition-all min-h-[44px] ${
                      i === autonomy
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'bg-white/5 text-white/40 border border-transparent hover:bg-white/8'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {autonomy === 2 && (
                <p className="text-xs text-amber-400/80 bg-amber-400/10 rounded-lg px-3 py-2">
                  Auto-execution applies only to actions under $50. All others require your approval.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-2">
        {step < 3 ? (
          <button
            onClick={() => setStep((step + 1) as Step)}
            disabled={step === 1 ? !canAdvance1 : !canAdvance2}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 min-h-[44px] text-sm font-semibold text-white hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 min-h-[44px] text-sm font-semibold text-slate-950 hover:from-emerald-400 hover:to-cyan-400 transition-all"
          >
            Done
          </button>
        )}
        <button
          onClick={dismiss}
          className="text-xs text-white/40 hover:text-white/60 py-1 transition-colors"
        >
          Set up later
        </button>
      </div>
    </BottomSheet>
  )
}
