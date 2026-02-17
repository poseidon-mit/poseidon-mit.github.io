import React, { useState } from 'react';
import { useRouter } from '../router';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ExternalLink,
  User as UserIcon,
  Brain,
  Plug,
  Bell,
  Settings as SettingsIcon,
  Mail,
  Download,
  Upload,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CircleDot,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type IntegrationStatus = 'Connected' | 'Pending' | 'Not connected' | 'Configured';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  logoColor: string;
  logoBg: string;
  status: IntegrationStatus;
  details: string;
  lastSync?: string;
  actions: string[];
}

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const tabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'ai', label: 'AI Configuration', icon: Brain },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
];

const integrations: Integration[] = [
  {
    id: 'plaid',
    name: 'Plaid',
    description: 'Bank Connections',
    logo: 'P',
    logoColor: '#14B8A6',
    logoBg: 'rgba(20,184,166,0.15)',
    status: 'Connected',
    details: '4 accounts linked',
    lastSync: '5 minutes ago',
    actions: ['Configure', 'Disconnect'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment Processing',
    logo: 'S',
    logoColor: '#8B5CF6',
    logoBg: 'rgba(139,92,246,0.15)',
    status: 'Connected',
    details: 'Business account',
    lastSync: '1 hour ago',
    actions: ['Configure', 'Disconnect'],
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    description: 'Crypto',
    logo: 'C',
    logoColor: '#F59E0B',
    logoBg: 'rgba(245,158,11,0.15)',
    status: 'Pending',
    details: 'Authorization required',
    actions: ['Complete setup'],
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Accounting',
    logo: 'Q',
    logoColor: '#10B981',
    logoBg: 'rgba(16,185,129,0.15)',
    status: 'Not connected',
    details: 'Sync transactions automatically',
    actions: ['Connect'],
  },
  {
    id: 'robinhood',
    name: 'Robinhood',
    description: 'Investments',
    logo: 'R',
    logoColor: '#14B8A6',
    logoBg: 'rgba(20,184,166,0.15)',
    status: 'Connected',
    details: '1 portfolio',
    lastSync: '3 hours ago',
    actions: ['Configure', 'Disconnect'],
  },
  {
    id: 'email',
    name: 'Email Notifications',
    description: 'Alerts & Reports',
    logo: '',
    logoColor: '#3B82F6',
    logoBg: 'rgba(59,130,246,0.15)',
    status: 'Configured',
    details: 'user@example.com',
    actions: ['Configure'],
  },
];

const recentChanges = [
  { text: 'Plaid reconnected', time: '5 min ago' },
  { text: 'Email preferences updated', time: '2 hours ago' },
  { text: 'AI risk threshold adjusted', time: 'Yesterday' },
];

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/* ═══════════════════════════════════════════
   UTILITY HELPERS
   ═══════════════════════════════════════════ */

const statusConfig: Record<IntegrationStatus, { color: string; bg: string }> = {
  Connected: { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  Pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  'Not connected': { color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
  Configured: { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
};

/* ═══════════════════════════════════════════
   GLASS CARD COMPONENT
   ═══════════════════════════════════════════ */

function GlassCard({
  children,
  className = '',
  borderColor,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { borderColor?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] p-4 md:p-6 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        ...(borderColor ? { borderLeftWidth: '2px', borderLeftColor: borderColor } : {}),
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */

function HeroSection() {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fadeUp}>
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase"
          style={{
            borderColor: 'rgba(0,240,255,0.3)',
            background: 'rgba(0,240,255,0.08)',
            color: '#00F0FF',
          }}
        >
          <SettingsIcon size={12} />
          Settings
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h1
          className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance"
          style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
        >
          System preferences. 8 integrations active. All engines configured.
        </h1>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          Control AI behavior, data access, and system policies.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-1 text-xs"
        style={{ color: '#64748B' }}
        role="note"
      >
        <span>Last updated 2 hours ago</span>
        <span aria-hidden="true">|</span>
        <span>Auto-save enabled</span>
        <span aria-hidden="true">|</span>
        <span>Changes take effect immediately</span>
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   TABS
   ═══════════════════════════════════════════ */

function SettingsTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <>
      {/* Desktop vertical tabs */}
      <nav
        className="hidden lg:flex flex-col gap-1 w-52 shrink-0"
        role="tablist"
        aria-label="Settings categories"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer text-left"
              style={{
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: isActive ? '#F1F5F9' : '#94A3B8',
                borderLeft: isActive ? '4px solid #00F0FF' : '4px solid transparent',
                minHeight: '44px',
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Mobile horizontal scroll tabs */}
      <div className="lg:hidden overflow-x-auto -mx-4 px-4">
        <div className="flex gap-2 pb-2" role="tablist" aria-label="Settings categories">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
                style={{
                  background: isActive ? 'rgba(0,240,255,0.12)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#00F0FF' : '#94A3B8',
                  border: isActive ? '1px solid rgba(0,240,255,0.3)' : '1px solid transparent',
                  minHeight: '44px',
                }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   INTEGRATION CARD
   ═══════════════════════════════════════════ */

function IntegrationCard({ integration }: { integration: Integration }) {
  const sc = statusConfig[integration.status];
  return (
    <motion.div variants={fadeUp}>
      <GlassCard className="flex flex-col gap-4 transition-all hover:bg-white/[0.04]">
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 40, height: 40, background: integration.logoBg }}
            aria-hidden="true"
          >
            {integration.logo ? (
              <span className="text-sm font-bold" style={{ color: integration.logoColor }}>
                {integration.logo}
              </span>
            ) : (
              <Mail size={18} style={{ color: integration.logoColor }} />
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{integration.name}</span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: sc.bg, color: sc.color }}
                aria-label={`${integration.name} integration: ${integration.status}`}
              >
                {integration.status === 'Connected' || integration.status === 'Configured' ? (
                  <CheckCircle2 size={9} />
                ) : integration.status === 'Pending' ? (
                  <AlertTriangle size={9} />
                ) : (
                  <CircleDot size={9} />
                )}
                {integration.status}
              </span>
            </div>
            <span className="text-xs" style={{ color: '#64748B' }}>{integration.description}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#94A3B8' }}>{integration.details}</span>
          {integration.lastSync && (
            <span className="flex items-center gap-1 text-[10px]" style={{ color: '#64748B' }}>
              <Clock size={10} />
              {integration.lastSync}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {integration.actions.map((action) => {
            const isDisconnect = action === 'Disconnect';
            const isConnect = action === 'Connect' || action === 'Complete setup';
            return (
              <button
                key={action}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={
                  isConnect
                    ? {
                        background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                        color: '#04141a',
                        minHeight: '36px',
                      }
                    : isDisconnect
                    ? {
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: '#EF4444',
                        background: 'transparent',
                        minHeight: '36px',
                      }
                    : {
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#CBD5E1',
                        background: 'transparent',
                        minHeight: '36px',
                      }
                }
                aria-label={`${action} ${integration.name}`}
              >
                {action}
              </button>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR COMPONENTS
   ═══════════════════════════════════════════ */

function QuickActions() {
  return (
    <GlassCard className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Quick Actions
      </h3>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
      >
        <Download size={14} />
        Export all settings
      </button>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all hover:shadow-[0_0_8px_rgba(239,68,68,0.2)] cursor-pointer"
        style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444', background: 'transparent', minHeight: '44px' }}
      >
        <RotateCcw size={14} />
        Reset to defaults
      </button>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
      >
        <Upload size={14} />
        Import configuration
      </button>
    </GlassCard>
  );
}

function RecentChanges() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Recent Changes
      </h3>
      <div className="flex flex-col gap-0">
        {recentChanges.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-2.5"
            style={{
              borderBottom: i < recentChanges.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <div
              className="mt-0.5 h-2 w-2 rounded-full shrink-0"
              style={{ background: '#00F0FF' }}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium" style={{ color: '#F1F5F9' }}>{item.text}</span>
              <span className="text-[10px]" style={{ color: '#64748B' }}>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════
   GOVERNANCE FOOTER
   ═══════════════════════════════════════════ */

function GovernFooter() {
  const { navigate } = useRouter();
  return (
    <footer
      className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/[0.06] px-4 py-3 md:px-6 md:py-4"
      style={{ background: 'rgba(255,255,255,0.03)' }}
      role="contentinfo"
      aria-label="Governance verification footer"
    >
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 28, height: 28, background: 'rgba(59,130,246,0.12)' }}
        >
          <ShieldCheck size={14} style={{ color: '#3B82F6' }} />
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}
        >
          <Shield size={10} />
          Verified
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: '#64748B' }}>
          GV-2026-0216-SET
        </span>
        <ExternalLink size={12} style={{ color: '#64748B' }} aria-hidden="true" />
      </div>
      <button
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
        aria-label="Request human review of settings changes"
        onClick={() => navigate('/govern/oversight')}
      >
        <UserIcon size={14} />
        Request human review
      </button>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export function Settings() {
  const [activeTab, setActiveTab] = useState('integrations');

  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#00F0FF', color: '#0B1221' }}
      >
        Skip to main content
      </a>

      <div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        role="main"
      >
        <HeroSection />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs */}
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main content */}
          <div className="flex-1 min-w-0" role="tabpanel" aria-label={`${tabs.find(t => t.id === activeTab)?.label} settings`}>
            <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
              <motion.div variants={fadeUp}>
                <h2 className="text-lg md:text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
                  Integrations
                </h2>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                  Connect external accounts and services
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Settings sidebar">
            <QuickActions />
            <RecentChanges />
          </aside>
        </div>

        <GovernFooter />
      </div>
    </div>
  );
}

export default Settings;
