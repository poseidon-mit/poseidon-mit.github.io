import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from '@/router'
import {
  Building2, CreditCard, TrendingUp, ShieldCheck, Zap, Scale,
  Brain, Lightbulb, Bell, CheckCircle, AlertTriangle,
  ArrowRight, ArrowLeft, Loader2, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Button } from '@/components/ui/button'
import { BottomSheet } from '@/components/ui/sheet'
import { useDemoState } from '@/lib/demo-state/provider'
import type { LucideIcon } from 'lucide-react'

/* ── Step data ─────────────────────────────────────────────────── */

const CONNECTORS = [
  { id: 'bank', icon: Building2, label: 'Bank Accounts' },
  { id: 'credit', icon: CreditCard, label: 'Credit Cards' },
  { id: 'investment', icon: TrendingUp, label: 'Investments' },
] as const

const GOALS = [
  { id: 'protect', icon: ShieldCheck, label: 'Protect', desc: 'Monitor threats & safeguard assets' },
  { id: 'grow', icon: TrendingUp, label: 'Grow', desc: 'Optimize balance and portfolio' },
  { id: 'execute', icon: Zap, label: 'Execute', desc: 'Automate financial operation with human approval' },
  { id: 'govern', icon: Scale, label: 'Govern', desc: 'Audit trail, Disclosure & Transparency, and compliance oversight' },
] as const

interface ConsentItemDef {
  id: string
  icon: LucideIcon
  label: string
  desc: string
  amber?: boolean
}

const CONSENT_ITEMS: ConsentItemDef[] = [
  { id: 'analyze', icon: Brain, label: 'Analyze', desc: 'AI can analyze your financial data' },
  { id: 'recommend', icon: Lightbulb, label: 'Recommend', desc: 'AI can suggest optimizations' },
  { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Send alerts and updates' },
  { id: 'approve', icon: CheckCircle, label: 'Quick Actions', desc: 'AI can handle routine transactions (configurable)', amber: true },
]

const STEP_TITLES = ['Connect Sources', 'Financial Goals', 'AI Permissions', 'Activate'] as const

/* ── Props ─────────────────────────────────────────────────────── */

interface OnboardingSheetProps {
  open: boolean
  onDismiss: () => void
}

type ConnectorState = 'idle' | 'connecting' | 'success'
type ActivateState = 'idle' | 'activating' | 'done'

/* ── Main component ────────────────────────────────────────────── */

export function OnboardingSheet({ open, onDismiss }: OnboardingSheetProps) {
  const { navigate } = useRouter()
  const { updateOnboarding, markOnboardingCompleted, beginDemoSession } = useDemoState()

  const [step, setStep] = useState(1)

  // Step 1 — Connect
  const [connectorStates, setConnectorStates] = useState<Record<string, ConnectorState>>(
    () => Object.fromEntries(CONNECTORS.map(c => [c.id, 'idle'])),
  )

  // Step 2 — Priorities
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(() => new Set(['govern']))

  // Step 3 — Consent
  const [consents, setConsents] = useState<Record<string, boolean>>({
    analyze: true,
    recommend: true,
    approve: false,
    notifications: true,
  })
  const [showApproveConfirm, setShowApproveConfirm] = useState(false)

  // Step 4 — Activate
  const [activateState, setActivateState] = useState<ActivateState>('idle')

  /* ── Step 1 handlers ── */
  const handleConnect = useCallback((id: string) => {
    if (connectorStates[id] !== 'idle') return
    setConnectorStates(prev => ({ ...prev, [id]: 'connecting' }))
    setTimeout(() => {
      setConnectorStates(prev => {
        const next = { ...prev, [id]: 'success' as ConnectorState }
        const connectedIds = Object.entries(next).filter(([, s]) => s === 'success').map(([k]) => k)
        updateOnboarding({ connectedAccountIds: connectedIds })
        return next
      })
    }, 2000)
  }, [connectorStates, updateOnboarding])

  const anyConnected = Object.values(connectorStates).some(s => s === 'success')

  /* ── Step 2 handlers ── */
  const toggleGoal = useCallback((id: string) => {
    if (id === 'govern') return
    setSelectedGoals(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      next.add('govern')
      updateOnboarding({ selectedGoals: Array.from(next) })
      return next
    })
  }, [updateOnboarding])

  const anyNonGovern = ['protect', 'grow', 'execute'].some(id => selectedGoals.has(id))

  /* ── Step 3 handlers ── */
  const toggleConsent = useCallback((id: string) => {
    if (id === 'approve' && !consents.approve) {
      setShowApproveConfirm(true)
      return
    }
    setConsents(prev => {
      const next = { ...prev, [id]: !prev[id] }
      updateOnboarding({ consentSelections: next })
      return next
    })
  }, [consents.approve, updateOnboarding])

  const confirmApprove = useCallback(() => {
    setConsents(prev => {
      const next = { ...prev, approve: true }
      updateOnboarding({ consentSelections: next })
      return next
    })
    setShowApproveConfirm(false)
  }, [updateOnboarding])

  /* ── Step 4 handler ── */
  const handleActivate = useCallback(() => {
    if (activateState !== 'idle') return
    setActivateState('activating')
    setTimeout(() => {
      setActivateState('done')
      markOnboardingCompleted()
      beginDemoSession({ method: 'form', entryIntent: 'agentic' })
      setTimeout(() => {
        try { sessionStorage.setItem('poseidon-onboarding-arrival', 'pending') } catch { /* noop */ }
        navigate('/dashboard')
      }, 800)
    }, 2000)
  }, [activateState, markOnboardingCompleted, beginDemoSession, navigate])

  /* ── Can advance? ── */
  const canAdvance = step === 1 ? anyConnected : step === 2 ? anyNonGovern : true

  /* ── Slide animation ── */
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  }

  const [slideDir, setSlideDir] = useState(1)

  const goNext = () => {
    if (step < 4) {
      setSlideDir(1)
      setStep(s => s + 1)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setSlideDir(-1)
      setStep(s => s - 1)
    }
  }

  return (
    <BottomSheet
      open={open}
      onDismiss={onDismiss}
      persistent={activateState !== 'idle'}
      className="!max-h-[85vh] lg:!max-h-[640px]"
    >
      {/* ── Progress ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            {STEP_TITLES[step - 1]}
          </span>
          <span className="text-xs font-mono text-slate-400">
            Step {step} of 4
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all',
                i <= step ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-white/10',
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="relative overflow-hidden min-h-[320px]">
        <AnimatePresence mode="wait" custom={slideDir}>
          <motion.div
            key={step}
            custom={slideDir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {step === 1 && (
              <StepConnect
                connectorStates={connectorStates}
                onConnect={handleConnect}
              />
            )}
            {step === 2 && (
              <StepPriorities
                selected={selectedGoals}
                onToggle={toggleGoal}
              />
            )}
            {step === 3 && (
              <StepConsent
                consents={consents}
                onToggle={toggleConsent}
                showApproveConfirm={showApproveConfirm}
                onConfirmApprove={confirmApprove}
                onCancelApprove={() => setShowApproveConfirm(false)}
              />
            )}
            {step === 4 && (
              <StepActivate
                activateState={activateState}
                onActivate={handleActivate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      {step < 4 && (
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
          {step > 1 && (
            <Button
              onClick={goBack}
              className="rounded-xl py-5 px-5 text-sm font-semibold bg-white/[0.06] text-white/70 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            onClick={goNext}
            disabled={!canAdvance}
            className={cn(
              'flex-1 rounded-xl py-5 text-sm font-semibold flex justify-center items-center gap-2 transition-all duration-500',
              canAdvance
                ? 'bg-gradient-to-r from-[#10B981] to-[#8B5CF6] text-white hover:opacity-90'
                : 'bg-white/[0.06] text-white/30 border border-white/[0.08] cursor-not-allowed',
            )}
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </BottomSheet>
  )
}

/* ══════════════════════════════════════════════════════════════════
   Step sub-components (inline — not exported)
   ══════════════════════════════════════════════════════════════════ */

/* ── Step 1: Connect ── */
function StepConnect({
  connectorStates,
  onConnect,
}: {
  connectorStates: Record<string, ConnectorState>
  onConnect: (id: string) => void
}) {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-3">
      <p className="text-sm text-slate-400 mb-4">Poseidon NEVER transacts without your approval.</p>
      {CONNECTORS.map(connector => {
        const state = connectorStates[connector.id]
        const isConnecting = state === 'connecting'
        const isSuccess = state === 'success'

        return (
          <motion.div key={connector.id} variants={fadeUp}>
            <button
              type="button"
              onClick={() => onConnect(connector.id)}
              disabled={state !== 'idle'}
              className={cn(
                'w-full rounded-2xl border p-4 text-left transition-all duration-500 flex items-center gap-4 group relative overflow-hidden',
                isSuccess
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : isConnecting
                    ? 'border-cyan-500/40 bg-cyan-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]',
              )}
            >
              {isConnecting && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
              )}
              <span
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors relative z-10 shrink-0',
                  isSuccess
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                    : isConnecting
                      ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400'
                      : 'border-white/10 bg-white/[0.03] text-white/70 group-hover:text-white',
                )}
              >
                <connector.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium text-white flex-1 relative z-10">{connector.label}</p>
              <div className="shrink-0 relative z-10">
                {state === 'idle' && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Connect</span>
                )}
                {isConnecting && <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />}
                {isSuccess && <ShieldCheck className="h-5 w-5 text-emerald-400" />}
              </div>
            </button>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ── Step 2: Priorities ── */
function StepPriorities({
  selected,
  onToggle,
}: {
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-3">
      <p className="text-sm text-slate-400 mb-4">Define your priorities</p>
      {GOALS.map(goal => {
        const isSelected = selected.has(goal.id)
        const isMandatory = goal.id === 'govern'

        return (
          <motion.div key={goal.id} variants={fadeUp}>
            <button
              type="button"
              onClick={() => onToggle(goal.id)}
              className={cn(
                'w-full rounded-2xl border p-4 text-left transition-all duration-500 flex items-center gap-4 group',
                isSelected
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors shrink-0',
                  isSelected
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                    : 'border-white/10 bg-white/[0.03] text-white/70 group-hover:text-white',
                )}
              >
                <goal.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{goal.label}</p>
                <p className="text-xs text-slate-400 font-light">{goal.desc}</p>
              </div>
              <div className="shrink-0">
                {isMandatory ? (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Required</span>
                ) : isSelected ? (
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                )}
              </div>
            </button>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

/* ── Step 3: Consent ── */
function StepConsent({
  consents,
  onToggle,
  showApproveConfirm,
  onConfirmApprove,
  onCancelApprove,
}: {
  consents: Record<string, boolean>
  onToggle: (id: string) => void
  showApproveConfirm: boolean
  onConfirmApprove: () => void
  onCancelApprove: () => void
}) {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-3">
      <p className="text-sm text-slate-400 mb-4">Set consent bounds</p>
      {CONSENT_ITEMS.map(item => {
        const isOn = consents[item.id] ?? false
        const isAmber = item.amber

        return (
          <motion.div key={item.id} variants={fadeUp}>
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              className={cn(
                'w-full rounded-2xl border p-4 text-left transition-all duration-500 flex items-center gap-4 group',
                isAmber
                  ? isOn
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-amber-500/20 bg-amber-500/[0.04] hover:border-amber-500/30'
                  : isOn
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors shrink-0',
                  isAmber
                    ? isOn
                      ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                      : 'border-amber-500/30 bg-amber-500/[0.06] text-amber-500/70 group-hover:text-amber-400'
                    : isOn
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                      : 'border-white/10 bg-white/[0.03] text-white/70 group-hover:text-white',
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm font-medium', isAmber ? 'text-amber-100' : 'text-white')}>{item.label}</p>
                <p className={cn('text-xs font-light', isAmber ? 'text-amber-400/70' : 'text-slate-400')}>{item.desc}</p>
              </div>
              <div className="shrink-0">
                <div
                  className={cn(
                    'w-10 h-6 rounded-full transition-colors duration-300 relative',
                    isAmber
                      ? isOn ? 'bg-amber-500' : 'bg-white/10'
                      : isOn ? 'bg-emerald-500' : 'bg-white/10',
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300',
                      isOn ? 'translate-x-5' : 'translate-x-1',
                    )}
                  />
                </div>
              </div>
            </button>
          </motion.div>
        )
      })}

      {/* Approve confirmation overlay */}
      <AnimatePresence>
        {showApproveConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 rounded-2xl border border-amber-500/30 bg-slate-900/95 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Enable Quick Actions?</p>
                <p className="text-xs text-slate-400 mt-1">
                  Poseidon will handle routine transactions without additional confirmation. Adjustable in Settings.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={onConfirmApprove}
                    className="rounded-lg py-2 px-4 text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400"
                  >
                    Enable
                  </Button>
                  <Button
                    onClick={onCancelApprove}
                    className="rounded-lg py-2 px-4 text-xs font-semibold bg-white/[0.06] text-white/70 hover:bg-white/10 border border-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Step 4: Activate ── */
function StepActivate({
  activateState,
  onActivate,
}: {
  activateState: ActivateState
  onActivate: () => void
}) {
  return (
    <div className="flex flex-col items-center pt-4">
      <div className="relative w-28 h-28 mx-auto mb-6">
        {activateState === 'activating' && (
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-emerald-400/50"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        )}
        <div
          className={cn(
            'w-full h-full rounded-3xl flex items-center justify-center border transition-all duration-500 relative z-10',
            activateState === 'done'
              ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
              : 'bg-black/50 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md',
          )}
        >
          {activateState === 'done' ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CheckCircle className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
            </motion.div>
          ) : activateState === 'activating' ? (
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" strokeWidth={1.5} />
          ) : (
            <div className="relative">
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient id="sparkle-grad-sheet" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <Sparkles
                className="w-12 h-12"
                style={{ stroke: 'url(#sparkle-grad-sheet)' }}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-400 font-light h-5 mb-6">
        {activateState === 'done'
          ? 'Engines Activated'
          : activateState === 'activating'
            ? 'Initializing engines...'
            : 'Poseidon is ready to assist you'}
      </p>

      <Button
        onClick={onActivate}
        disabled={activateState !== 'idle'}
        className={cn(
          'w-full rounded-xl py-5 text-sm font-semibold flex justify-center items-center gap-2 transition-all duration-500',
          activateState === 'idle'
            ? 'bg-gradient-to-r from-[#10B981] to-[#8B5CF6] text-white hover:opacity-90'
            : 'bg-white/[0.06] text-white/30 border border-white/[0.08] cursor-not-allowed',
        )}
      >
        {activateState === 'idle'
          ? 'Activate Poseidon'
          : activateState === 'activating'
            ? 'Activating...'
            : 'Entering...'}
      </Button>
    </div>
  )
}
