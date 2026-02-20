import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  User,
  Bell,
  Shield,
} from 'lucide-react'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { AuroraPulse, GovernFooter } from '@/components/poseidon'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Button, Surface, Toggle } from '@/design-system'
import { useDemoState } from '@/lib/demo-state/provider'
import { useToast } from '@/hooks/useToast'
import { usePageTitle } from '@/hooks/use-page-title'

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
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} ariaLabel={label} />
    </div>
  )
}

export default function SettingsPage() {
  usePageTitle('Settings')
  const { state, updateSettings } = useDemoState()
  const { showToast } = useToast()

  const [draftNotifications, setDraftNotifications] = useState(state.settings.notifications)

  useEffect(() => {
    setDraftNotifications(state.settings.notifications)
  }, [state.settings.notifications])

  const dirty = useMemo(
    () => JSON.stringify(draftNotifications) !== JSON.stringify(state.settings.notifications),
    [draftNotifications, state.settings.notifications],
  )

  const handleSave = () => {
    updateSettings({ notifications: draftNotifications })
    showToast({ variant: 'success', message: 'Settings saved and logged to audit ledger.' })
  }

  const handleReset = () => {
    setDraftNotifications(state.settings.notifications)
    showToast({ variant: 'info', message: 'Unsaved changes were reset.' })
  }

  return (
    <div className="relative">
      <AuroraPulse engine="dashboard" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-dashboard)', color: 'var(--bg-oled)' }}
      >
        Skip to main content
      </a>

      <motion.main id="main-content" className="command-center__main" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.section variants={staggerContainer} className="hero-section">
          <motion.div variants={fadeUp} className="hero-kicker">
            <span className="hero-kicker__icon"><Settings size={14} /></span>
            Settings
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-headline">
            Control your <span style={{ color: 'var(--engine-dashboard)' }}>experience</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-subline">
            Manage your profile, notifications, and security preferences. All changes are logged.
          </motion.p>
        </motion.section>

        <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-6 lg:px-8">
          <Surface variants={fadeUp} className="flex-1 rounded-2xl" variant="glass" padding="md" as={motion.div}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/10">
                <User size={20} style={{ color: 'var(--engine-dashboard)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">Profile</p>
                <p className="text-xs text-slate-500">Account details</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Name</span>
                <span className="text-sm font-medium text-slate-100">{state.user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Email</span>
                <span className="text-sm font-medium text-slate-100">{state.user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Plan</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300">{state.user.plan}</span>
              </div>
            </div>
          </Surface>

          <Surface variants={fadeUp} className="flex-1 rounded-2xl" variant="glass" padding="md" as={motion.div}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400/10">
                <Bell size={20} style={{ color: 'var(--engine-execute)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">Notifications</p>
                <p className="text-xs text-slate-500">Alert preferences</p>
              </div>
            </div>
            <SettingToggle
              label="Threat alerts"
              desc="Immediate notification for critical threats"
              checked={draftNotifications.threatAlerts}
              onChange={(next) => setDraftNotifications((prev) => ({ ...prev, threatAlerts: next }))}
            />
            <SettingToggle
              label="Weekly digest"
              desc="Summary of activity and recommendations"
              checked={draftNotifications.weeklyDigest}
              onChange={(next) => setDraftNotifications((prev) => ({ ...prev, weeklyDigest: next }))}
            />
            <SettingToggle
              label="Execution alerts"
              desc="Notify when actions are auto-queued"
              checked={draftNotifications.executionAlerts}
              onChange={(next) => setDraftNotifications((prev) => ({ ...prev, executionAlerts: next }))}
            />
          </Surface>
        </div>

        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="rounded-2xl" variant="glass" padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400/10">
                <Shield size={20} style={{ color: 'var(--engine-protect)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">Security</p>
                <p className="text-xs text-slate-500">Authentication and access controls</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-slate-100">Two-factor authentication</p>
                  <p className="text-xs text-slate-400">Add an extra layer of security</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-slate-100">Active sessions</p>
                  <p className="text-xs text-slate-400">Manage your logged-in devices</p>
                </div>
                <span className="text-sm font-mono text-slate-100">2 devices</span>
              </div>
            </div>
          </Surface>
        </motion.section>

        <motion.section variants={fadeUp} className="px-4 md:px-6 lg:px-8">
          <Surface className="rounded-2xl flex items-center justify-between gap-3" variant="glass" padding="md">
            <p className="text-sm text-slate-400">All settings changes are recorded in the audit ledger.</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleReset}
                disabled={!dirty}
                variant="secondary"
                engine="dashboard"
                size="sm"
                className="rounded-xl"
              >
                Reset draft
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!dirty}
                variant="glass"
                engine="dashboard"
                size="sm"
                className="rounded-xl"
              >
                Save settings
              </Button>
            </div>
          </Surface>
        </motion.section>

        <div className="px-4 md:px-6 lg:px-8">
          <GovernFooter
            auditId={GOVERNANCE_META['/settings'].auditId}
            pageContext={GOVERNANCE_META['/settings'].pageContext}
          />
        </div>
      </motion.main>
    </div>
  )
}
