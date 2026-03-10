import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, CreditCard, TrendingUp, Shield, Zap, Scale,
  ArrowRight, ChevronLeft, ChevronRight, Loader2, ShieldCheck,
  Brain, Lightbulb, Bell, CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BottomSheet } from '@/components/ui/sheet'
import { useDemoState } from '@/lib/demo-state/provider'
import { fadeUp } from '@/lib/motion-presets'

const ONBOARDING_KEY = 'poseidon-onboarding-sheet-seen'
const SHOW_DELAY_MS = typeof window !== 'undefined' && window.innerWidth < 1024 ? 2000 : 600
const TOTAL_STEPS = 3

/* ── Step 1: Connectors ── */
const CONNECTORS = [
  { id: 'bank', icon: Building2, label: 'Bank Accounts' },
  { id: 'credit', icon: CreditCard, label: 'Credit Cards' },
  { id: 'investment', icon: TrendingUp, label: 'Investments' },
] as const

/* ── Step 2: Engine Goals ── */
const ENGINES = [
  { id: 'protect', icon: Shield, label: 'Protect', desc: 'Monitor threats & safeguard assets', color: 'var(--engine-protect)' },
  { id: 'grow', icon: TrendingUp, label: 'Grow', desc: 'Optimize balance and portfolio', color: 'var(--engine-grow)' },
  { id: 'execute', icon: Zap, label: 'Execute', desc: 'Automate with human approval', color: 'var(--engine-execute)' },
  { id: 'govern', icon: Scale, label: 'Govern', desc: 'Audit trail & compliance', color: 'var(--engine-govern)', mandatory: true },
] as const

/* ── Step 3: Consent Items ── */
const CONSENT_ITEMS = [
  { id: 'analyze', icon: Brain, label: 'Analyze', desc: 'AI can analyze your financial data' },
  { id: 'recommend', icon: Lightbulb, label: 'Recommend', desc: 'AI can suggest optimizations' },
  { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Send alerts and updates' },
  { id: 'approve', icon: CheckCircle, label: 'Quick Actions', desc: 'AI can handle routine transactions', amber: true },
] as const

type ConnectorState = 'idle' | 'connecting' | 'success'

/* ── Step Indicator ── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-1 rounded-full transition-all duration-300',
            i === current ? 'w-6 bg-cyan-400' : i < current ? 'w-2 bg-cyan-400/40' : 'w-2 bg-white/15',
          )}
        />
      ))}
    </div>
  )
}

/* ── Step 1: Connect Accounts ── */
function StepConnect({
  onNext,
  onSkip,
}: {
  onNext: (ids: string[]) => void
  onSkip: () => void
}) {
  const [states, setStates] = useState<Record<string, ConnectorState>>(
    () => Object.fromEntries(CONNECTORS.map(c => [c.id, 'idle'])),
  )

  const handleConnect = (id: string) => {
    if (states[id] !== 'idle') return
    setStates(prev => ({ ...prev, [id]: 'connecting' }))
    setTimeout(() => {
      setStates(prev => ({ ...prev, [id]: 'success' }))
    }, 1500)
  }

  const connectedIds = Object.entries(states).filter(([, s]) => s === 'success').map(([k]) => k)
  const anyConnected = connectedIds.length > 0

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-white">Connect Accounts</h2>
      <p className="text-xs text-white/40 -mt-1">Poseidon never transacts without your approval.</p>

      <div className="space-y-2 mt-1">
        {CONNECTORS.map(c => {
          const state = states[c.id]
          const Icon = c.icon
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleConnect(c.id)}
              disabled={state !== 'idle'}
              className={cn(
                'w-full rounded-xl border p-3 text-left transition-all flex items-center gap-3 group relative overflow-hidden',
                state === 'success'
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : state === 'connecting'
                    ? 'border-cyan-500/40 bg-cyan-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20',
              )}
            >
              {state === 'connecting' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
              )}
              <span className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 relative z-10',
                state === 'success' ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                  : state === 'connecting' ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400'
                    : 'border-white/10 bg-white/[0.03] text-white/70',
              )}>
                <Icon size={14} />
              </span>
              <span className="text-sm font-medium text-white relative z-10 flex-1">{c.label}</span>
              <div className="shrink-0 relative z-10">
                {state === 'idle' && <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Connect</span>}
                {state === 'connecting' && <Loader2 size={14} className="animate-spin text-cyan-400" />}
                {state === 'success' && <ShieldCheck size={16} className="text-emerald-400" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button onClick={onSkip} className="text-xs text-white/30 hover:text-white/60 transition-colors">
          Skip for now
        </button>
        <button
          onClick={() => onNext(connectedIds)}
          disabled={!anyConnected}
          className={cn(
            'flex-1 rounded-xl py-3 text-sm font-semibold flex justify-center items-center gap-2 transition-all',
            anyConnected
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400'
              : 'bg-white/[0.06] text-white/30 cursor-not-allowed',
          )}
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

/* ── Step 2: Choose Engines ── */
function StepEngines({
  onNext,
  onSkip,
}: {
  onNext: (goals: string[]) => void
  onSkip: () => void
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['govern']))
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollIndex, setScrollIndex] = useState(0)

  const toggleEngine = (id: string) => {
    if (id === 'govern') return
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      next.add('govern')
      return next
    })
  }

  const scrollTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, ENGINES.length - 1))
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / ENGINES.length
    el.scrollTo({ left: cardWidth * clamped, behavior: 'smooth' })
    setScrollIndex(clamped)
  }

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / ENGINES.length
    setScrollIndex(Math.round(el.scrollLeft / cardWidth))
  }, [])

  const anyNonGovern = ['protect', 'grow', 'execute'].some(id => selected.has(id))

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-white">Choose Your Engines</h2>
      <p className="text-xs text-white/40 -mt-1">Select which AI engines to activate. Govern is always on.</p>

      {/* Carousel with desktop arrows */}
      <div className="relative mt-1">
        {/* Desktop arrow — left */}
        <button
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30"
          onClick={() => scrollTo(scrollIndex - 1)}
          disabled={scrollIndex === 0}
          aria-label="Previous engine"
        >
          <ChevronLeft size={14} className="text-white/60" />
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1 pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {ENGINES.map(e => {
            const Icon = e.icon
            const isSelected = selected.has(e.id)
            const isMandatory = 'mandatory' in e && e.mandatory
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => toggleEngine(e.id)}
                className={cn(
                  'snap-center shrink-0 w-[70%] md:w-[48%] rounded-xl border p-3 text-left transition-all flex flex-col gap-2',
                  isSelected
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20',
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
                    style={{ background: `color-mix(in srgb, ${e.color} 20%, transparent)` }}
                  >
                    <Icon size={14} style={{ color: e.color }} />
                  </span>
                  <span className="text-sm font-medium text-white">{e.label}</span>
                  {isMandatory && <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-emerald-400">Required</span>}
                  {!isMandatory && isSelected && <ShieldCheck size={14} className="ml-auto text-emerald-400" />}
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed">{e.desc}</p>
              </button>
            )
          })}
        </div>

        {/* Desktop arrow — right */}
        <button
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30"
          onClick={() => scrollTo(scrollIndex + 1)}
          disabled={scrollIndex >= ENGINES.length - 1}
          aria-label="Next engine"
        >
          <ChevronRight size={14} className="text-white/60" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 md:hidden">
        {ENGINES.map((_, i) => (
          <div key={i} className={cn('w-1.5 h-1.5 rounded-full transition-colors', i === scrollIndex ? 'bg-white/80' : 'bg-white/20')} />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-1">
        <button onClick={onSkip} className="text-xs text-white/30 hover:text-white/60 transition-colors">
          Skip
        </button>
        <button
          onClick={() => onNext(Array.from(selected))}
          disabled={!anyNonGovern}
          className={cn(
            'flex-1 rounded-xl py-3 text-sm font-semibold flex justify-center items-center gap-2 transition-all',
            anyNonGovern
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400'
              : 'bg-white/[0.06] text-white/30 cursor-not-allowed',
          )}
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

/* ── Step 3: Auto-Approve Policy ── */
function StepPolicy({ onDone }: { onDone: (consents: Record<string, boolean>) => void }) {
  const [consents, setConsents] = useState<Record<string, boolean>>({
    analyze: true,
    recommend: true,
    notifications: true,
    approve: false,
  })

  const toggle = (id: string) => {
    setConsents(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-white">AI Permissions</h2>
      <p className="text-xs text-white/40 -mt-1">Set what Poseidon can do. Change anytime in Settings.</p>

      <div className="space-y-2 mt-1">
        {CONSENT_ITEMS.map(item => {
          const isOn = consents[item.id] ?? false
          const isAmber = 'amber' in item && item.amber
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={cn(
                'w-full rounded-xl border p-3 text-left transition-all flex items-center gap-3',
                isAmber
                  ? isOn ? 'border-amber-500/50 bg-amber-500/10' : 'border-amber-500/20 bg-amber-500/[0.04] hover:border-amber-500/30'
                  : isOn ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20',
              )}
            >
              <span className={cn(
                'inline-flex h-7 w-7 items-center justify-center rounded-lg border shrink-0',
                isAmber
                  ? isOn ? 'border-amber-500/50 bg-amber-500/15 text-amber-400' : 'border-amber-500/30 bg-amber-500/[0.06] text-amber-500/70'
                  : isOn ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : 'border-white/10 bg-white/[0.03] text-white/70',
              )}>
                <Icon size={14} />
              </span>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', isAmber ? 'text-amber-100' : 'text-white')}>{item.label}</p>
                <p className={cn('text-[11px]', isAmber ? 'text-amber-400/70' : 'text-white/40')}>{item.desc}</p>
              </div>
              <div className={cn(
                'w-9 h-5 rounded-full transition-colors relative shrink-0',
                isAmber ? (isOn ? 'bg-amber-500' : 'bg-white/10') : (isOn ? 'bg-emerald-500' : 'bg-white/10'),
              )}>
                <div className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                  isOn ? 'translate-x-[18px]' : 'translate-x-0.5',
                )} />
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onDone(consents)}
        className="w-full rounded-xl py-3 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400 transition-all flex justify-center items-center gap-2 mt-2"
      >
        Get Started <ArrowRight size={14} />
      </button>
    </div>
  )
}

/* ── Main Component ── */
export function OnboardingBottomSheet() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const { state, updateOnboarding } = useDemoState()

  useEffect(() => {
    if (state.onboarding.completed) return
    try {
      if (sessionStorage.getItem(ONBOARDING_KEY) === 'true') return
    } catch { /* noop */ }
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [state.onboarding.completed])

  const dismiss = useCallback(() => {
    setOpen(false)
    try { sessionStorage.setItem(ONBOARDING_KEY, 'true') } catch { /* noop */ }
  }, [])

  const handleConnectDone = (ids: string[]) => {
    updateOnboarding({ connectedAccountIds: ids })
    setStep(1)
  }

  const handleEnginesDone = (goals: string[]) => {
    updateOnboarding({ selectedGoals: goals })
    setStep(2)
  }

  const handlePolicyDone = (consents: Record<string, boolean>) => {
    updateOnboarding({ consentSelections: consents, completed: true, completedAt: new Date().toISOString() })
    dismiss()
  }

  const handleSkip = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1)
    } else {
      dismiss()
    }
  }

  return (
    <BottomSheet open={open} onDismiss={dismiss} persistent={step < TOTAL_STEPS - 1}>
      <StepDots current={step} total={TOTAL_STEPS} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step-connect" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <StepConnect onNext={handleConnectDone} onSkip={handleSkip} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="step-engines" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <StepEngines onNext={handleEnginesDone} onSkip={handleSkip} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="step-policy" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <StepPolicy onDone={handlePolicyDone} />
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheet>
  )
}
