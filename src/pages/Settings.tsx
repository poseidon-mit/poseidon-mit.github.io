import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Building2, CreditCard, TrendingUp } from 'lucide-react'
import { getMotionPreset } from '@/lib/motion-presets'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { useDemoState } from '@/lib/demo-state/provider'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useRouter } from '@/router'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { SettingToggle } from '@/components/settings/SettingToggle'

// Static imports — all content loads in one chunk for instant tab switching
import { SettingsAIContent } from './SettingsAI'
import { SettingsIntegrationsContent } from './SettingsIntegrations'
import { SettingsRightsContent } from './SettingsRights'

const PAGE_TITLES: Record<string, string> = {
  '/settings': 'Settings',
  '/settings/ai': 'AI Preferences',
  '/settings/integrations': 'Integrations',
  '/settings/rights': 'Rights & Privacy',
}

export default function SettingsPage() {
  const { path } = useRouter()
  const currentPath = path.startsWith('/settings') ? path : '/settings'
  usePageTitle(PAGE_TITLES[currentPath] ?? 'Settings')
  const prefersReducedMotion = useReducedMotionSafe()
  const { staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)

  return (
    <SettingsLayout currentPath={currentPath}>
      <motion.main
        key={currentPath}
        id="main-content"
        role="main"
        className={`${PAGE_CONTENT_CLASS} command-center__main`}
        style={PAGE_CONTENT_STYLE}
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}
      >
        {currentPath === '/settings' && <SettingsGeneralContent />}
        {currentPath === '/settings/ai' && <SettingsAIContent />}
        {currentPath === '/settings/integrations' && <SettingsIntegrationsContent />}
        {currentPath === '/settings/rights' && <SettingsRightsContent />}
      </motion.main>
    </SettingsLayout>
  )
}

/* ── General tab content ── */

function SettingsGeneralContent() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant } = getMotionPreset(prefersReducedMotion)
  const { state, updateSettings } = useDemoState()

  const CONNECTORS = [
    { id: 'bank', icon: Building2, label: 'Bank Accounts' },
    { id: 'credit', icon: CreditCard, label: 'Credit Cards' },
    { id: 'investment', icon: TrendingUp, label: 'Investments' },
  ] as const

  const [twoFactor] = useState(true)

  return (
    <>
      {/* ── Account ── */}
      <motion.section variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-400/10">
            <User size={16} style={{ color: 'var(--engine-dashboard)' }} />
          </div>
          <h2 className="text-base font-semibold text-white">Account</h2>
        </div>

        {/* Profile */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">Profile</h3>
          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
            <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Name</span>
            <span className="text-sm font-medium text-white truncate ml-4">{state.user.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
            <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Email</span>
            <span className="text-sm font-medium text-white truncate ml-4">{state.user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Plan</span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{state.user.plan}</span>
          </div>
        </div>

        {/* Security */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-white/40 flex items-center gap-2 mb-2">
            <Shield size={12} className="text-white/30" />
            Security
          </h3>
          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
            <div>
              <p className="text-sm font-medium text-white tracking-wide">Two-factor authentication</p>
              <p className="text-xs text-white/50">Add an extra layer of security</p>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${twoFactor ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/10 text-white/40 border border-white/10'}`}>
              {twoFactor ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-white/40 flex items-center gap-2 mb-2">
            <Building2 size={12} className="text-white/30" />
            Connected Accounts
          </h3>
          {CONNECTORS.map((connector) => (
            <div key={connector.id} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0">
                  <connector.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-sm font-medium text-white tracking-wide truncate">{connector.label}</p>
              </div>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Connected</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Notifications ── */}
      <motion.section variants={fadeUpVariant} className="glass-card glass-card-overlay rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/10">
            <Bell size={16} style={{ color: 'var(--engine-execute)' }} />
          </div>
          <h2 className="text-base font-semibold text-white">Notifications</h2>
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
      </motion.section>
    </>
  )
}
