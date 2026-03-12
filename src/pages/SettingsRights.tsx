import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Download } from 'lucide-react'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useToast } from '@/hooks/useToast'

const CONSENT_SCOPES = [
  { id: 'read', label: 'Read', desc: 'Access your financial account data' },
  { id: 'categorize', label: 'Categorize', desc: 'Classify transactions with AI' },
  { id: 'recommend', label: 'Recommend', desc: 'Generate personalized insights' },
  { id: 'execute-draft', label: 'Execute (draft)', desc: 'Prepare actions for your approval' },
] as const

export function SettingsRightsContent() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant } = getMotionPreset(prefersReducedMotion)
  const { showToast } = useToast()

  const [deleteInput, setDeleteInput] = useState('')
  const isDeleteConfirmed = deleteInput === 'DELETE'

  function handleExport(format: 'JSON' | 'CSV') {
    showToast({ variant: 'info', message: 'Not available in demo.' })
  }

  function handleDelete() {
    if (!isDeleteConfirmed) return
    showToast({ variant: 'info', message: 'Not available in demo.' })
  }

  return (
    <>
      {/* ── Consent scopes ── */}
      <motion.section variants={fadeUpVariant} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
            <Shield size={16} className="text-blue-400" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Data consent scopes</h2>
        </div>
        <p className="text-xs text-white/40">These are the data operations Poseidon is authorized to perform on your behalf.</p>
        <div className="flex flex-col gap-1">
          {CONSENT_SCOPES.map((scope) => (
            <div key={scope.id} className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.06] last:border-0">
              <div>
                  <p className="text-sm font-medium text-foreground">{scope.label}</p>
                <p className="text-xs text-white/40">{scope.desc}</p>
              </div>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Active</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Export ── */}
      <motion.section variants={fadeUpVariant} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-foreground">Export my data</h2>
        <p className="text-xs text-white/40">Download a copy of all personal and financial data Poseidon has processed.</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleExport('JSON')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-white/40 hover:text-foreground hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <Download size={14} />
            Export as JSON
          </button>
          <button
            type="button"
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-white/40 hover:text-foreground hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <Download size={14} />
            Export as CSV
          </button>
        </div>
      </motion.section>

      {/* ── Delete ── */}
      <motion.section variants={fadeUpVariant} className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-red-400">Delete my data</h2>
        <p className="text-xs text-white/40">Permanently delete all personal and financial data. This action cannot be undone.</p>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-foreground placeholder:text-white/20 focus:outline-none focus:border-red-500/50"
          />
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isDeleteConfirmed}
            className="w-fit px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed bg-red-500/10 border border-red-500/30 text-red-400 disabled:opacity-40 enabled:hover:bg-red-500/20"
          >
            {isDeleteConfirmed ? 'Permanently delete all data' : 'Type DELETE above to confirm'}
          </button>
        </div>
      </motion.section>

        {/* ── Governance badge ── */}
        <motion.div variants={fadeUpVariant}>
          <div className="mission-govern-badge" data-audit-id="GV-2026-0216-SETT-RTS">
            <p className="text-[10px] text-muted-foreground font-mono">Audit ID: GV-2026-0216-SETT-RTS · Rights & Privacy · Poseidon Govern</p>
          </div>
        </motion.div>
    </>
  )
}

/** Thin route wrapper — preserves infra-integrity test compatibility */
import SettingsPage from './Settings'
export default function SettingsRights() { return <SettingsPage /> }
