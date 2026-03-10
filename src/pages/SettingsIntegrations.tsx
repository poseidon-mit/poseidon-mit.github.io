import { motion } from 'framer-motion'
import { Building2, CreditCard, TrendingUp, Plus } from 'lucide-react'
import { getMotionPreset } from '@/lib/motion-presets'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useToast } from '@/hooks/useToast'

const CONNECTORS = [
  { id: 'bank', icon: Building2, label: 'Bank Accounts', desc: 'Chase, Wells Fargo, Bank of America' },
  { id: 'credit', icon: CreditCard, label: 'Credit Cards', desc: 'Visa, Mastercard, Amex' },
  { id: 'investment', icon: TrendingUp, label: 'Investments', desc: 'Fidelity, Vanguard, Schwab' },
] as const

export function SettingsIntegrationsContent() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant } = getMotionPreset(prefersReducedMotion)
  const { showToast } = useToast()

  return (
    <>
        {/* ── Connected Accounts ── */}
        <motion.section variants={fadeUpVariant} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Connected accounts</h2>
          <div className="flex flex-col gap-1">
            {CONNECTORS.map((connector) => (
              <div key={connector.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 shrink-0">
                    <connector.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{connector.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{connector.desc}</p>
                  </div>
                </div>
                <span className="shrink-0 ml-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Connected</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => showToast({ variant: 'info', message: 'Available in production' })}
            className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer w-fit"
          >
            <Plus size={14} />
            Add integration
          </button>
        </motion.section>

        {/* ── Coming soon ── */}
        <motion.section variants={fadeUpVariant} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-2 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">More integrations</h2>
          <p className="text-sm text-muted-foreground">Crypto wallets, payroll, and tax platforms coming in a future release.</p>
        </motion.section>
    </>
  )
}

/** Thin route wrapper — preserves infra-integrity test compatibility */
import SettingsPage from './Settings'
export default function SettingsIntegrations() { return <SettingsPage /> }
