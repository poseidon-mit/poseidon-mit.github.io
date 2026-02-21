import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Link } from '../router'
import { GovernFooter, AuroraPulse } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { usePageTitle } from '../hooks/use-page-title'
import { getMotionPreset } from '@/lib/motion-presets'
import { DEMO_THREAD } from '@/lib/demo-thread'
import { Button, Toggle, Surface } from '@/design-system'
import { useDemoState } from '@/lib/demo-state/provider'
import { useToast } from '@/hooks/useToast'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import type { DemoGovernEngine } from '@/lib/demo-state/types'

interface EngineCardDefinition {
  engine: DemoGovernEngine
  color: string
  trustScore: number
  toggleLabels: [string, string]
}

const ENGINE_CARD_DEFINITIONS: EngineCardDefinition[] = [
  {
    engine: 'Protect',
    color: 'var(--engine-protect)',
    trustScore: 94,
    toggleLabels: ['Auto-block suspicious', 'Real-time alerts'],
  },
  {
    engine: 'Grow',
    color: 'var(--engine-grow)',
    trustScore: 87,
    toggleLabels: ['Auto-save rules', 'Goal tracking'],
  },
  {
    engine: 'Execute',
    color: 'var(--engine-execute)',
    trustScore: 91,
    toggleLabels: ['Low-risk auto-execute', 'Bill negotiation'],
  },
  {
    engine: 'Govern',
    color: 'var(--engine-govern)',
    trustScore: 97,
    toggleLabels: ['Auto-audit logging', 'Policy enforcement'],
  },
]

const trustTrend = [
  { label: '30d avg', value: '91.4', positive: false },
  { label: '90d avg', value: '89.8', positive: false },
  { label: 'All-time high', value: '92', positive: true },
  { label: 'Trend', value: 'Improving', positive: true },
]

interface GovernTrustDraftItem {
  engine: DemoGovernEngine
  color: string
  trustScore: number
  riskTolerance: number
  autoApproval: number
  toggles: [
    { label: string; enabled: boolean },
    { label: string; enabled: boolean },
  ]
}

function makeDraftFromState(config: ReturnType<typeof useDemoState>['state']['settings']['governTrust']): GovernTrustDraftItem[] {
  return ENGINE_CARD_DEFINITIONS.map((definition) => {
    const stateConfig = config[definition.engine]
    return {
      engine: definition.engine,
      color: definition.color,
      trustScore: definition.trustScore,
      riskTolerance: stateConfig.riskTolerance,
      autoApproval: stateConfig.autoApproval,
      toggles: [
        {
          label: definition.toggleLabels[0],
          enabled: stateConfig.toggles[definition.toggleLabels[0]],
        },
        {
          label: definition.toggleLabels[1],
          enabled: stateConfig.toggles[definition.toggleLabels[1]],
        },
      ],
    }
  })
}

export function GovernTrust() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)

  usePageTitle('Trust Index')
  const { state, updateGovernTrust } = useDemoState()
  const { showToast } = useToast()

  const [draft, setDraft] = useState<GovernTrustDraftItem[]>(() => makeDraftFromState(state.settings.governTrust))

  useEffect(() => {
    setDraft(makeDraftFromState(state.settings.governTrust))
  }, [state.settings.governTrust])

  const baselineSystemTrust = Math.round(DEMO_THREAD.systemConfidence * 100)
  const currentFromState = useMemo(() => makeDraftFromState(state.settings.governTrust), [state.settings.governTrust])
  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(currentFromState),
    [draft, currentFromState],
  )

  const systemTrust = Math.round(draft.reduce((acc, c) => acc + c.trustScore, 0) / draft.length)
  const circumference = 2 * Math.PI * 40

  const updateSlider = (idx: number, field: 'riskTolerance' | 'autoApproval', value: number) => {
    setDraft((prev) => prev.map((card, i) => (i === idx ? { ...card, [field]: value } : card)))
  }

  const toggleSwitch = (cardIdx: number, toggleIdx: number) => {
    setDraft((prev) =>
      prev.map((card, currentCardIdx) => {
        if (cardIdx !== currentCardIdx) return card
        const nextToggles = [...card.toggles] as GovernTrustDraftItem['toggles']
        const toggle = nextToggles[toggleIdx]
        nextToggles[toggleIdx] = { ...toggle, enabled: !toggle.enabled }
        return {
          ...card,
          toggles: nextToggles,
        }
      }),
    )
  }

  const handleSave = () => {
    for (const card of draft) {
      updateGovernTrust(card.engine, {
        riskTolerance: card.riskTolerance,
        autoApproval: card.autoApproval,
        toggles: {
          [card.toggles[0].label]: card.toggles[0].enabled,
          [card.toggles[1].label]: card.toggles[1].enabled,
        },
      })
    }
    showToast({ variant: 'success', message: 'Govern trust settings saved.' })
  }

  const handleReset = () => {
    setDraft(currentFromState)
    showToast({ variant: 'info', message: 'Unsaved trust changes reset.' })
  }

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-govern)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-govern)', color: '#ffffff' }}
      >
        Skip to main content
      </a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/govern" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-govern)' }}>
            <ArrowLeft className="h-4 w-4" />
            Govern
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Trust Dashboard</span>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-8 w-full font-sans pb-8"
        style={{ maxWidth: '1440px' }}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8 pt-8 lg:pt-12">
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/10 text-[var(--engine-govern)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <Shield size={12} /> Govern · Trust
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>Trust Dashboard</h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">
              Per-engine trust scores, threshold configuration, and auto-approval settings.
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl flex flex-col md:flex-row items-center gap-8 lg:gap-12 p-8 lg:p-12 mt-4" variant="glass" padding="none">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center justify-center shrink-0" aria-label={`System trust score: ${systemTrust} out of 100`}>
                <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true" className="drop-shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="var(--engine-govern)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(systemTrust / 100) * (2 * Math.PI * 60)} ${2 * Math.PI * 60}`}
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-light font-mono text-white tracking-tighter" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>{systemTrust}</span>
                  <span className="text-xs uppercase tracking-widest font-semibold text-white/40 mt-1">/100</span>
                </div>
              </div>
              <div className="relative z-10 flex-1 w-full flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-light text-white tracking-wide mb-2">System Trust Score</h2>
                  <p className="text-sm font-mono text-white/50 tracking-wide">
                    Weighted composite across all 4 engines (baseline <span className="text-[var(--engine-govern)]">{baselineSystemTrust}</span>)
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/[0.06]">
                  {draft.map((card) => (
                    <div key={card.engine} className="flex flex-col justify-between gap-3 group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: card.color }}>{card.engine}</span>
                        <span className="text-xl font-mono text-white/90 group-hover:text-white transition-colors">{card.trustScore}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/[0.03]">
                        <div className="h-full rounded-full transition-all duration-700 opacity-80 group-hover:opacity-100" style={{ width: `${card.trustScore}%`, background: card.color, boxShadow: `0 0 10px ${card.color}80` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Surface>
          </motion.div>
        </motion.section>

        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8 pb-12 w-full">
          <motion.div variants={fadeUpVariant} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-6">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest pl-2">Per-Engine Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {draft.map((card, idx) => (
                <Surface
                  key={card.engine}
                  className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl transition-all hover:bg-white/[0.02]"
                  variant="glass"
                  padding="none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-50" style={{ background: card.color }} />
                  <div className="relative z-10 p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
                      <span className="text-xl font-light text-white tracking-wide">{card.engine}</span>
                      <span className="text-2xl font-mono font-bold" style={{ color: card.color, textShadow: `0 0 15px ${card.color}60` }}>{card.trustScore}</span>
                    </div>

                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="uppercase tracking-widest text-white/40 font-semibold">Risk tolerance</span>
                          <span className="font-mono text-white/70 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.05]">{card.riskTolerance}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={card.riskTolerance}
                          onChange={(event) => updateSlider(idx, 'riskTolerance', Number(event.target.value))}
                          className="w-full accent-[var(--engine-govern)] cursor-pointer h-1.5 bg-white/10 rounded-full appearance-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--engine-govern)]/50"
                          aria-label={`${card.engine} risk tolerance`}
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="uppercase tracking-widest text-white/40 font-semibold">Auto-approval</span>
                          <span className="font-mono text-white/70 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.05]">{card.autoApproval}%</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={100}
                          value={card.autoApproval}
                          onChange={(event) => updateSlider(idx, 'autoApproval', Number(event.target.value))}
                          className="w-full accent-[var(--engine-govern)] cursor-pointer h-1.5 bg-white/10 rounded-full appearance-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--engine-govern)]/50"
                          aria-label={`${card.engine} auto-approval threshold`}
                        />
                      </div>

                      <div className="flex flex-col gap-4 mt-2 pt-6 border-t border-white/[0.06]">
                        {card.toggles.map((toggle, toggleIdx) => (
                          <div key={toggle.label} className="flex items-center justify-between group">
                            <span className="text-xs font-mono text-white/60 group-hover:text-white/80 transition-colors tracking-wide">{toggle.label}</span>
                            <Toggle
                              checked={toggle.enabled}
                              onChange={() => toggleSwitch(idx, toggleIdx)}
                              ariaLabel={toggle.label}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Surface>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-4 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04]">
              <button
                disabled={!dirty}
                onClick={handleSave}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] ${dirty ? 'bg-[var(--engine-govern)] text-black cursor-pointer' : 'bg-white/5 text-white/30 cursor-not-allowed shadow-none hover:shadow-none'}`}
              >
                Save Changes
              </button>
              <button
                disabled={!dirty}
                onClick={handleReset}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all border ${dirty ? 'border-white/20 text-white hover:bg-white/[0.05] cursor-pointer' : 'border-white/5 text-white/20 cursor-not-allowed hidden'}`}
              >
                Reset
              </button>
            </div>
          </motion.div>

          <motion.aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Trust statistics" variants={staggerContainerVariant}>
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-[var(--state-info)]/10 border border-[var(--state-info)]/20">
                    <TrendingUp className="h-4 w-4 text-[var(--state-info)]" />
                  </div>
                  <h3 className="text-xs font-semibold text-white/70 uppercase tracking-widest">Trust Trend</h3>
                </div>
                <div className="relative z-10 flex flex-col gap-4 text-sm font-mono tracking-wide border border-white/[0.04] bg-white/[0.02] rounded-2xl p-4">
                  {trustTrend.map((row, index) => (
                    <div key={row.label} className={`flex justify-between items-center ${index !== trustTrend.length - 1 ? 'border-b border-white/[0.04] pb-3' : ''}`}>
                      <span className="text-[10px] uppercase font-sans tracking-widest text-white/40">{row.label}</span>
                      <span className={`font-semibold ${row.positive ? 'text-[var(--state-healthy)] drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'text-white/80'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </Surface>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-[var(--state-healthy)]/10 border border-[var(--state-healthy)]/20">
                    <CheckCircle2 className="h-4 w-4 text-[var(--state-healthy)]" />
                  </div>
                  <h3 className="text-xs font-semibold text-white/70 uppercase tracking-widest">System Status</h3>
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--state-healthy)]/5 border border-[var(--state-healthy)]/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--state-healthy)] shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
                    <span className="text-sm text-[var(--state-healthy)] font-medium tracking-wide">All engines healthy</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-light">
                    Trust scores recalculated every <span className="text-white/70 font-mono">15 min</span> based on accuracy, transparency, fairness, and compliance.
                  </p>
                </div>
              </Surface>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-[var(--state-warning)]/10 border border-[var(--state-warning)]/20">
                    <AlertTriangle className="h-4 w-4 text-[var(--state-warning)]" />
                  </div>
                  <h3 className="text-xs font-semibold text-white/70 uppercase tracking-widest">Policy Notes</h3>
                </div>
                <p className="relative z-10 text-xs text-white/40 leading-relaxed font-light">
                  Threshold changes are logged in the audit ledger. Requires <span className="text-[var(--engine-govern)] font-semibold tracking-wide">Govern-level authorization</span>.
                </p>
              </Surface>
            </motion.div>
          </motion.aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/trust'].auditId} pageContext={GOVERNANCE_META['/govern/trust'].pageContext} />
      </motion.div>
    </div>
  )
}

export default GovernTrust
