import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Shield,
  Building2,
  CreditCard,
  TrendingUp,
  ShieldAlert,
  Zap,
  Database,
  Download,
  Trash2,
} from 'lucide-react'
import { getMotionPreset } from '@/lib/motion-presets'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { cn } from '@/lib/utils'
import { useDemoState } from '@/lib/demo-state/provider'
import { useToast } from '@/hooks/useToast'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

function SettingToggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string
  desc: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.04]">
      <div>
        <p className="text-sm font-medium text-white tracking-wide">{label}</p>
        <p className="text-xs text-white/50">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          checked ? "bg-[var(--engine-execute)]" : "bg-white/20"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  usePageTitle('Settings')
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { state, updateSettings } = useDemoState()
  const { showToast } = useToast()

  const CONNECTORS = [
    { id: 'bank', icon: Building2, label: 'Bank Accounts' },
    { id: 'credit', icon: CreditCard, label: 'Credit Cards' },
    { id: 'investment', icon: TrendingUp, label: 'Investments' },
  ] as const

  const [protectAlertNotify, setProtectAlertNotify] = useState(true)
  const [protectAutoBlock, setProtectAutoBlock] = useState(true)
  const [protectSeverityFilter, setProtectSeverityFilter] = useState(false)
  const [growWeeklyGoalDigest, setGrowWeeklyGoalDigest] = useState(true)
  const [growAutoRebalance, setGrowAutoRebalance] = useState(false)
  const [growContributionReminder, setGrowContributionReminder] = useState(true)
  const [executeApprovalNotify, setExecuteApprovalNotify] = useState(true)
  const [executeDailySummary, setExecuteDailySummary] = useState(true)

  return (
    <div className="relative">

      <motion.main id="main-content" className={`${PAGE_CONTENT_CLASS} command-center__main`} style={PAGE_CONTENT_STYLE} initial="hidden" animate="visible" variants={staggerContainerVariant}>
        <div className="flex flex-col lg:flex-row gap-4">
          <motion.div variants={fadeUpVariant} className="glass-card glass-card-overlay flex-1 rounded-2xl p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/10">
                  <User size={20} style={{ color: 'var(--engine-dashboard)' }} />
                </div>
                <div>
                  <p className="text-base font-medium text-white tracking-wide">Profile</p>
                  <p className="text-xs text-white/50 tracking-wider uppercase font-semibold">Account details</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Name</span>
                  <span className="text-sm font-medium text-white">{state.user.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Email</span>
                  <span className="text-sm font-medium text-white">{state.user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Plan</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">{state.user.plan}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="glass-card glass-card-overlay flex-1 rounded-2xl p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400/10">
                  <Bell size={20} style={{ color: 'var(--engine-execute)' }} />
                </div>
                <div>
                  <p className="text-base font-medium text-white tracking-wide">Notifications</p>
                  <p className="text-xs text-white/50 tracking-wider uppercase font-semibold">Alert preferences</p>
                </div>
              </div>
              <SettingToggle
                label="Threat alerts"
                desc="Immediate notification for critical threats"
                checked={state.settings.notifications.threatAlerts}
                onChange={(next) => updateSettings({ notifications: { ...state.settings.notifications, threatAlerts: next } })}
              />
              <SettingToggle
                label="Weekly digest"
                desc="Summary of activity and recommendations"
                checked={state.settings.notifications.weeklyDigest}
                onChange={(next) => updateSettings({ notifications: { ...state.settings.notifications, weeklyDigest: next } })}
              />
            </div>
          </motion.div>
        </div>

        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-2xl p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400/10">
                  <Shield size={20} style={{ color: 'var(--engine-protect)' }} />
                </div>
                <div>
                  <p className="text-base font-medium text-white tracking-wide">Security</p>
                  <p className="text-xs text-white/50 tracking-wider uppercase font-semibold">Authentication and access controls</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                  <div>
                    <p className="text-sm font-medium text-white tracking-wide">Two-factor authentication</p>
                    <p className="text-xs text-white/50">Add an extra layer of security</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Connected Accounts ── */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-2xl p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/10">
                  <Building2 size={20} style={{ color: 'var(--engine-dashboard)' }} />
                </div>
                <div>
                  <p className="text-base font-medium text-white tracking-wide">Connected Accounts</p>
                  <p className="text-xs text-white/50 tracking-wider uppercase font-semibold">Data sources</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {CONNECTORS.map((connector) => (
                  <div key={connector.id} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                        <connector.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-medium text-white tracking-wide">{connector.label}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]">Connected</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Protect Engine ── */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-2xl p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400/10">
                  <ShieldAlert size={20} style={{ color: 'var(--engine-protect)' }} />
                </div>
                <div>
                  <p className="text-base font-medium text-white tracking-wide">Protect Engine</p>
                  <p className="text-xs text-white/50 tracking-wider uppercase font-semibold">Threat detection preferences</p>
                </div>
              </div>
              <SettingToggle label="Immediate threat alerts" desc="Push notification for every detected threat" checked={protectAlertNotify} onChange={setProtectAlertNotify} />
              <SettingToggle label="Auto-block suspicious activity" desc="Automatically block transactions above confidence threshold" checked={protectAutoBlock} onChange={setProtectAutoBlock} />
              <SettingToggle label="Low-severity filter" desc="Suppress alerts below Medium severity" checked={protectSeverityFilter} onChange={setProtectSeverityFilter} />
            </div>
          </div>
        </motion.section>

        {/* ── Grow Engine ── */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-2xl p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-400/10">
                  <TrendingUp size={20} style={{ color: 'var(--engine-grow)' }} />
                </div>
                <div>
                  <p className="text-base font-medium text-white tracking-wide">Grow Engine</p>
                  <p className="text-xs text-white/50 tracking-wider uppercase font-semibold">Goal and investment preferences</p>
                </div>
              </div>
              <SettingToggle label="Weekly goal digest" desc="Summary of goal progress and AI recommendations" checked={growWeeklyGoalDigest} onChange={setGrowWeeklyGoalDigest} />
              <SettingToggle label="Auto-rebalance notifications" desc="Alert when portfolio rebalancing is suggested" checked={growAutoRebalance} onChange={setGrowAutoRebalance} />
              <SettingToggle label="Contribution reminders" desc="Remind to contribute toward active savings goals" checked={growContributionReminder} onChange={setGrowContributionReminder} />
            </div>
          </div>
        </motion.section>

        {/* ── Execute Engine ── */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-2xl p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400/10">
                  <Zap size={20} style={{ color: 'var(--engine-execute)' }} />
                </div>
                <div>
                  <p className="text-base font-medium text-white tracking-wide">Execute Engine</p>
                  <p className="text-xs text-white/50 tracking-wider uppercase font-semibold">Automation and approval preferences</p>
                </div>
              </div>
              <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-white tracking-wide">Auto-execute threshold</p>
                  <p className="text-xs text-white/50">Automatically execute actions below this amount</p>
                </div>
                <div className="relative shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/50">$</span>
                  <input type="text" readOnly value="50" className="w-20 rounded-lg border border-white/[0.08] bg-white/[0.04] pl-7 pr-3 py-1.5 text-sm font-mono text-white text-right cursor-default focus:outline-none" />
                </div>
              </div>
              <SettingToggle label="Approval notifications" desc="Notify when new actions require your approval" checked={executeApprovalNotify} onChange={setExecuteApprovalNotify} />
              <SettingToggle label="Daily execution summary" desc="End-of-day digest of all executed and pending actions" checked={executeDailySummary} onChange={setExecuteDailySummary} />
            </div>
          </div>
        </motion.section>

        {/* ── Data & Privacy ── */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-2xl p-6">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-400/10">
                  <Database size={20} style={{ color: 'var(--state-critical)' }} />
                </div>
                <div>
                  <p className="text-base font-medium text-white tracking-wide">Data & Privacy</p>
                  <p className="text-xs text-white/50 tracking-wider uppercase font-semibold">Your data rights</p>
                </div>
              </div>
              <div className="flex flex-col">
                {[
                  { icon: Download, label: 'Export my data', desc: 'Download all personal and financial data', danger: false },
                  { icon: Download, label: 'Export audit log', desc: 'Download Govern Engine decision history', danger: false },
                  { icon: Trash2, label: 'Delete my account', desc: 'Permanently delete all data — cannot be undone', danger: true },
                ].map((item, i, arr) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => showToast({ variant: 'info', message: 'Not available in demo.' })}
                    className={cn(
                      'flex items-center gap-3 py-3 text-left cursor-pointer hover:bg-white/[0.04] -mx-2 px-2 rounded-lg transition-colors',
                      i < arr.length - 1 && 'border-b border-white/[0.04]'
                    )}
                  >
                    <item.icon size={16} className={item.danger ? 'text-red-400' : 'text-white/60'} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium tracking-wide',
                        item.danger ? 'text-red-400' : 'text-white'
                      )}>{item.label}</p>
                      <p className="text-xs text-white/50">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

      </motion.main>
    </div>
  )
}
