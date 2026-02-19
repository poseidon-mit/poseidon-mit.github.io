import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Link2, Building2, CreditCard, TrendingUp, Wallet, CheckCircle, AlertCircle, RefreshCw, Trash2, Lock, Plus, Shield } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets'

const connectedAccounts = [
  { id: 'a1', name: 'Chase Checking', type: 'Bank', masked: '••4821', status: 'Connected' as const, lastSync: '2m ago', icon: Building2, iconColor: 'var(--engine-protect)', iconBg: 'rgba(34,197,94,0.15)', chips: ['Transactions', 'Balances', 'Statements'] },
  { id: 'a2', name: 'Vanguard Investment', type: 'Investment', masked: '••7290', status: 'Connected' as const, lastSync: '1h ago', icon: TrendingUp, iconColor: 'var(--engine-grow)', iconBg: 'rgba(139,92,246,0.15)', chips: ['Transactions', 'Balances'] },
  { id: 'a3', name: 'Amex Credit', type: 'Credit Card', masked: '••3344', status: 'Needs attention' as const, lastSync: '3h ago', icon: CreditCard, iconColor: 'var(--engine-execute)', iconBg: 'rgba(234,179,8,0.15)', chips: ['Transactions', 'Balances', 'Statements'] },
];

const addTypes = [
  { id: 'bank', label: 'Bank', icon: Building2, desc: 'Checking & savings', iconColor: 'var(--engine-protect)', iconBg: 'rgba(34,197,94,0.15)' },
  { id: 'credit', label: 'Credit Card', icon: CreditCard, desc: 'Cards & rewards', iconColor: 'var(--engine-execute)', iconBg: 'rgba(234,179,8,0.15)' },
  { id: 'invest', label: 'Investment', icon: TrendingUp, desc: 'Brokerage & 401k', iconColor: 'var(--engine-grow)', iconBg: 'rgba(139,92,246,0.15)' },
  { id: 'crypto', label: 'Crypto', icon: Wallet, desc: 'Digital assets', iconColor: 'var(--engine-dashboard)', iconBg: 'rgba(0,240,255,0.15)' },
];

const permissions = [
  { label: 'Transactions', allowed: true },
  { label: 'Balances', allowed: true },
  { label: 'Statements', allowed: true },
  { label: 'Move money', allowed: false },
];

export function SettingsIntegrations() {
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 1500);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: '#94A3B8', color: '#fff' }}>Skip to main content</a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(11,18,33,0.8)' }} aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/settings" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#94A3B8' }}>
            <ArrowLeft className="h-4 w-4" />Settings
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Connected Accounts</span>
        </div>
      </nav>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: '1280px' }} variants={stagger} initial="hidden" animate="visible" role="main">
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(148,163,184,0.15)' }}>
              <Link2 className="h-4 w-4" style={{ color: '#94A3B8' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#94A3B8' }}>Settings · Integrations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Connected Accounts</h1>
          <p className="text-sm text-slate-400">3 accounts connected · Last sync: 2m ago · Read-only access.</p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Connected', value: '3', color: 'var(--engine-protect)' },
            { label: 'Last sync', value: '2m ago', color: 'var(--engine-dashboard)' },
            { label: 'Data coverage', value: '94%', color: 'var(--engine-grow)' },
            { label: 'Security', value: '256-bit', color: 'var(--engine-execute)' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
              <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Main content 2-col */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left main feed */}
          <div className="flex-1 lg:w-2/3 flex flex-col gap-6">
            {/* Connected accounts */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Connected Accounts</h2>
              {connectedAccounts.map((acct) => (
                <div key={acct.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: acct.iconBg }}>
                      <acct.icon className="h-5 w-5" style={{ color: acct.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{acct.name}</span>
                        <span className="text-xs text-white/30">{acct.type}</span>
                        <span className="text-xs text-white/30">{acct.masked}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {acct.status === 'Connected' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            <CheckCircle className="h-3 w-3" />Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                            <AlertCircle className="h-3 w-3" />Needs attention
                          </span>
                        )}
                        <span className="text-[10px] text-white/30">Last sync: {acct.lastSync}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {acct.chips.map((c) => (
                          <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
                    <button onClick={() => handleSync(acct.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-colors">
                      <RefreshCw className={`h-3 w-3 ${syncing === acct.id ? 'animate-spin' : ''}`} />{syncing === acct.id ? 'Syncing...' : 'Sync now'}
                    </button>
                    {disconnecting === acct.id ? (
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[10px] text-red-400">Confirm disconnect?</span>
                        <button onClick={() => setDisconnecting(null)} className="text-xs text-white/40 hover:text-white/60">Cancel</button>
                        <button className="text-xs text-red-400 hover:text-red-300">Yes, disconnect</button>
                      </div>
                    ) : (
                      <button onClick={() => setDisconnecting(acct.id)} className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="h-3 w-3" />Disconnect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Add account grid */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />Add Account
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addTypes.map((t) => (
                  <button key={t.id} disabled className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: t.iconBg }}>
                        <t.icon className="h-5 w-5" style={{ color: t.iconColor }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{t.label}</p>
                        <p className="text-xs text-white/40">{t.desc}</p>
                      </div>
                    </div>
                    <span className="inline-block mt-3 text-xs font-medium px-3 py-1 rounded-lg border border-white/10 text-white/60">Connect · Preview</span>
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-white/[0.02] border border-white/[0.06] p-3">
                <Lock className="h-4 w-4 text-white/30 shrink-0 mt-0.5" />
                <p className="text-xs text-white/30">256-bit encryption · Read-only access · SOC 2 Type II in progress</p>
              </div>
            </motion.div>
          </div>

          {/* Side rail */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
            {/* Sync status */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Sync Status</h3>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Health</span>
                  <span className="text-emerald-400 font-semibold">94%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: '94%', background: 'var(--engine-protect)' }} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {connectedAccounts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{a.name.split(' ')[0]}</span>
                    <span className={a.status === 'Connected' ? 'text-emerald-400' : 'text-amber-400'}>{a.lastSync}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Permissions */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Permissions</h3>
              <div className="flex flex-col gap-2">
                {permissions.map((p) => (
                  <div key={p.label} className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{p.label}</span>
                    {p.allowed ? (
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-red-400/60 text-[10px] font-medium">Denied</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Security */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Security</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-white/50">AES-256 encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-white/50">SOC 2 Type II in progress</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/settings/integrations'].auditId} pageContext={GOVERNANCE_META['/settings/integrations'].pageContext} />
      </motion.div>
    </div>
  );
}

export default SettingsIntegrations;
