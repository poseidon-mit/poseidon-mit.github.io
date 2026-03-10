import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Shield,
  Building2,
  CreditCard,
  TrendingUp,
  Mail,
  Smartphone,
  MessageSquare,
  Key,
  LogOut,
  Plus,
} from 'lucide-react'
import { getMotionPreset } from '@/lib/motion-presets'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

/* ── Connected Accounts data ── */
const CONNECTED_ACCOUNTS = [
  { id: 'chase-checking', icon: Building2, name: 'Chase Checking (...4521)', connected: 'Mar 15, 2024', iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 'fidelity', icon: TrendingUp, name: 'Fidelity Investment (...8832)', connected: 'Jan 8, 2024', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { id: 'chase-savings', icon: Building2, name: 'Chase Savings (...7654)', connected: 'Mar 15, 2024', iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 'coinbase', icon: CreditCard, name: 'Coinbase Wallet (...3344)', connected: 'Aug 1, 2025', iconColor: 'text-violet-600', iconBg: 'bg-violet-50' },
]

/* ── Notification categories ── */
const NOTIFICATION_CATEGORIES = [
  { id: 'security', label: 'Security Alerts', desc: 'Get notified about suspicious activity', defaults: { email: true, push: true, sms: true } },
  { id: 'recommendations', label: 'Recommendations', desc: 'New AI recommendations for your finances', defaults: { email: true, push: true, sms: false } },
  { id: 'approvals', label: 'Pending Approvals', desc: 'Actions awaiting your approval', defaults: { email: true, push: true, sms: false } },
  { id: 'reports', label: 'Monthly Reports', desc: 'Monthly financial summary and insights', defaults: { email: true, push: false, sms: false } },
]

/* ── General tab content ── */

function SettingsGeneralContent() {
  const prefersReducedMotion = useReducedMotionSafe()
  const { fadeUp: fadeUpVariant } = getMotionPreset(prefersReducedMotion)
  const { state, updateSettings } = useDemoState()

  const [firstName, setFirstName] = useState(state.user.name.split(' ')[0] || 'Shinji')
  const [lastName, setLastName] = useState(state.user.name.split(' ')[1] || 'Fujiwara')
  const [email] = useState(state.user.email)
  const [phone] = useState('+1 (415) 555-0123')
  const [twoFactor] = useState(true)
  const [notifPrefs, setNotifPrefs] = useState(() =>
    Object.fromEntries(NOTIFICATION_CATEGORIES.map(c => [c.id, { ...c.defaults }]))
  )

  const toggleNotif = (categoryId: string, channel: 'email' | 'push' | 'sms') => {
    setNotifPrefs(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [channel]: !prev[categoryId][channel],
      },
    }))
  }

  return (
    <>
      {/* ── Profile ── */}
      <motion.section variants={fadeUpVariant} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
            <User size={16} className="text-blue-600" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Profile</h2>
        </div>

        {/* Avatar + info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <span className="text-xl font-semibold text-gray-600">
              {firstName[0]}{lastName[0]}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{firstName} {lastName}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
            <p className="text-xs text-gray-400 mt-0.5">Member since January 2024</p>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Phone</label>
            <input
              type="tel"
              value={phone}
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </motion.section>

      {/* ── Connected Accounts ── */}
      <motion.section variants={fadeUpVariant} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50">
              <Building2 size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Connected Accounts ({CONNECTED_ACCOUNTS.length})</h2>
          </div>
        </div>

        <div className="space-y-2">
          {CONNECTED_ACCOUNTS.map((account) => (
            <div key={account.id} className="flex items-center justify-between py-3 px-4 rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 ${account.iconBg}`}>
                  <account.icon className={`h-4 w-4 ${account.iconColor}`} />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{account.name}</p>
                  <p className="text-xs text-gray-400">Connected {account.connected}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                Manage
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full text-gray-700">
          <Plus className="mr-1.5 h-4 w-4" />
          Connect New Account
        </Button>
      </motion.section>

      {/* ── Notification Preferences ── */}
      <motion.section variants={fadeUpVariant} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50">
            <Bell size={16} className="text-amber-600" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          {NOTIFICATION_CATEGORIES.map((cat) => (
            <div key={cat.id} className="py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {(['email', 'push', 'sms'] as const).map((channel) => {
                  const Icon = channel === 'email' ? Mail : channel === 'push' ? Smartphone : MessageSquare
                  const checked = notifPrefs[cat.id]?.[channel] ?? false
                  return (
                    <label key={channel} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleNotif(cat.id, channel)}
                        className="h-4 w-4 rounded border-gray-300 accent-amber-600"
                      />
                      <Icon className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600 capitalize">{channel}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Security ── */}
      <motion.section variants={fadeUpVariant} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
            <Shield size={16} className="text-red-600" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Security</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Badge variant="outline" className={twoFactor ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}>
              {twoFactor ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-foreground">Active sessions</p>
              <p className="text-xs text-muted-foreground">1 active session on this device</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-gray-500">
              <LogOut className="mr-1 h-3.5 w-3.5" />
              Sign out all
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">API access</p>
              <p className="text-xs text-muted-foreground">Manage API keys for integrations</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-gray-500">
              <Key className="mr-1 h-3.5 w-3.5" />
              Manage
            </Button>
          </div>
        </div>
      </motion.section>
    </>
  )
}
