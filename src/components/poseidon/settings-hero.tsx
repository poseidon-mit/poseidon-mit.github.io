/**
 * SettingsControlCenter — Full-viewport hero for /settings.
 *
 * Engine: govern (blue glow). Zone A: summary + quick stats.
 * Zone B: profile, security, notifications cards.
 * Zone C: sub-page navigation.
 */
import { User, Shield, Bell, Link2, Brain } from 'lucide-react'
import { HeroBento } from './hero-bento'
import { Link } from '@/router'

export interface SettingsControlCenterProps {
  userName: string
  userInitials: string
  userEmail: string
  memberSince: string
  connectedAccounts: number
  twoFactorEnabled: boolean
  aiMode: string
  notificationCategories: number
  activeSessions: number
}

export function SettingsControlCenter({
  userName,
  userInitials,
  userEmail,
  memberSince,
  connectedAccounts,
  twoFactorEnabled,
  aiMode,
  notificationCategories,
  activeSessions,
}: SettingsControlCenterProps) {
  return (
    <HeroBento engine="govern" fullscreen>
      <HeroBento.Action>
        {/* Headline */}
        <h2 className="typo-display text-xl md:text-3xl lg:text-4xl text-white/95">
          Your AI, your rules.
        </h2>
        <p className="text-sm text-white/70 max-w-md">
          Full control over how Poseidon operates on your behalf.
        </p>

        {/* Quick Stats */}
        <div className="flex flex-col gap-3 mt-4">
          <QuickStat icon={Link2} label="Connected accounts" value={String(connectedAccounts)} />
          <QuickStat icon={Shield} label="Two-factor auth" value={twoFactorEnabled ? 'Enabled' : 'Disabled'} />
          <QuickStat icon={Brain} label="AI delegation" value={aiMode} />
          <QuickStat icon={Bell} label="Notification categories" value={String(notificationCategories)} />
        </div>
      </HeroBento.Action>

      <HeroBento.Proof>
        {/* Profile Card */}
        <div className="bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-3 border border-white/[0.04]">
          <span className="typo-label text-white/30">Profile</span>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center border border-white/[0.06] shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              <span className="text-lg font-semibold text-white/60">{userInitials}</span>
            </div>
            <div>
              <p className="text-base font-semibold text-white/90">{userName}</p>
              <p className="text-xs text-white/40">{userEmail}</p>
              <p className="typo-caption mt-0.5">Since {memberSince}</p>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-2 border border-white/[0.04]">
          <span className="typo-label text-white/30">Security</span>
          <div className="flex flex-col gap-1.5 text-xs text-white/60">
            <span className="flex items-center gap-1.5">2FA: <span className={twoFactorEnabled ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>{twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}</span></span>
            <span>Active sessions: {activeSessions}</span>
            <span>API access: Managed</span>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-2 border border-white/[0.04]">
          <span className="typo-label text-white/30">Notifications</span>
          <div className="flex flex-col gap-1.5 text-xs text-white/60">
            <span>{notificationCategories} categories active</span>
            <span>Email + Push enabled</span>
          </div>
        </div>
      </HeroBento.Proof>

      <HeroBento.Portal>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <PortalLink to="/settings" icon={User} label="Profile" />
          <PortalLink to="/settings/integrations" icon={Link2} label="Integrations" />
          <PortalLink to="/settings/ai" icon={Brain} label="AI Preferences" />
          <PortalLink to="/settings/rights" icon={Shield} label="Privacy & Rights" />
        </div>
      </HeroBento.Portal>
    </HeroBento>
  )
}

function QuickStat({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={14} className="text-white/30 shrink-0" />
      <span className="text-xs text-white/50 flex-1">{label}</span>
      <span className="text-sm typo-mono text-white/80">{value}</span>
    </div>
  )
}

function PortalLink({ to, icon: Icon, label }: { to: string; icon: typeof User; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-xs text-white/40 hover:text-white/80 transition-colors py-2 flex-1 min-h-[44px]"
    >
      <Icon size={12} />
      <span>{label}</span>
    </Link>
  )
}
