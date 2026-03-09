import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, ShieldAlert, TrendingUp } from 'lucide-react'
import { getMotionPreset } from '@/lib/motion-presets'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

type ProtectSensitivity = 'calm' | 'standard' | 'vigilant'
type GrowSensitivity = 'conservative' | 'balanced' | 'aggressive'

const PROTECT_OPTIONS: { value: ProtectSensitivity; label: string; desc: string }[] = [
  { value: 'calm', label: 'Calm', desc: 'Weekly alert digests only' },
  { value: 'standard', label: 'Standard', desc: 'Anomalies and critical events' },
  { value: 'vigilant', label: 'Vigilant', desc: 'Flag all detected changes' },
]

const GROW_OPTIONS: { value: GrowSensitivity; label: string; desc: string }[] = [
  { value: 'conservative', label: 'Conservative', desc: 'Preserve capital, low risk' },
  { value: 'balanced', label: 'Balanced', desc: 'Moderate growth and safety' },
  { value: 'aggressive', label: 'Aggressive', desc: 'Maximize long-term return' },
]

export function SettingsAIContent() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant } = getMotionPreset(prefersReducedMotion)
  const { showToast } = useToast()

  const [protectSensitivity, setProtectSensitivity] = useState<ProtectSensitivity>('standard')
  const [growSensitivity, setGrowSensitivity] = useState<GrowSensitivity>('balanced')

  function handleSave() {
    showToast({ variant: 'success', message: 'Preferences updated' })
  }

  return (
    <>
        {/* ── Protect ── */}
        <motion.section variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10">
              <ShieldAlert size={16} style={{ color: 'var(--engine-protect)' }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Protect</h2>
              <p className="text-xs text-white/40">Alert sensitivity</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PROTECT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setProtectSensitivity(opt.value)}
                className={cn(
                  'flex flex-col gap-1 p-4 rounded-xl border text-left transition-colors cursor-pointer',
                  protectSensitivity === opt.value
                    ? 'border-[var(--engine-protect)] bg-emerald-500/10'
                    : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'
                )}
              >
                <span className={cn('text-sm font-semibold', protectSensitivity === opt.value ? 'text-emerald-400' : 'text-white')}>{opt.label}</span>
                <span className="text-xs text-white/50">{opt.desc}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ── Grow ── */}
        <motion.section variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10">
              <TrendingUp size={16} style={{ color: 'var(--engine-grow)' }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Grow</h2>
              <p className="text-xs text-white/40">Investment posture</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {GROW_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGrowSensitivity(opt.value)}
                className={cn(
                  'flex flex-col gap-1 p-4 rounded-xl border text-left transition-colors cursor-pointer',
                  growSensitivity === opt.value
                    ? 'border-[var(--engine-grow)] bg-violet-500/10'
                    : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'
                )}
              >
                <span className={cn('text-sm font-semibold', growSensitivity === opt.value ? 'text-violet-400' : 'text-white')}>{opt.label}</span>
                <span className="text-xs text-white/50">{opt.desc}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ── Model info ── */}
        <motion.section variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
              <Bot size={16} style={{ color: 'var(--engine-govern)' }} />
            </div>
            <h2 className="text-base font-semibold text-white">AI Model</h2>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
            <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Model version</span>
            <span className="text-sm font-mono text-white">Poseidon-1.2</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Data training cutoff</span>
            <span className="text-sm font-mono text-white">Q4 2025</span>
          </div>
        </motion.section>

        {/* ── Save ── */}
        <motion.div variants={fadeUpVariant} className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[var(--engine-execute)] text-black text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
          >
            Save preferences
          </button>
        </motion.div>
    </>
  )
}

/** Thin route wrapper — preserves infra-integrity test compatibility */
import SettingsPage from './Settings'
export default function SettingsAI() { return <SettingsPage /> }
