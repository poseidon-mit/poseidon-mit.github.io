import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Building2, CreditCard, TrendingUp, Wallet, Lock, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import { Link } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const steps = ['Connect', 'Preferences', 'Configure AI', 'Review & Go'];

interface AccountType {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  desc: string;
}

const accountTypes: AccountType[] = [
  { id: 'bank', label: 'Bank Account', icon: Building2, iconColor: '#22C55E', iconBg: 'rgba(34,197,94,0.15)', desc: 'Checking, savings, cash' },
  { id: 'credit', label: 'Credit Card', icon: CreditCard, iconColor: '#EAB308', iconBg: 'rgba(234,179,8,0.15)', desc: 'Cards, rewards, debt' },
  { id: 'invest', label: 'Investment', icon: TrendingUp, iconColor: '#8B5CF6', iconBg: 'rgba(139,92,246,0.15)', desc: 'Brokerage, 401k, IRA' },
  { id: 'wallet', label: 'Wallet / Crypto', icon: Wallet, iconColor: '#00F0FF', iconBg: 'rgba(0,240,255,0.15)', desc: 'Digital assets' },
];

interface ConnectedAccount {
  name: string;
  masked: string;
}

export function Onboarding() {
  const [currentStep] = useState(0);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Record<string, ConnectedAccount>>({});

  const handleConnect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setConnecting(null);
      const names: Record<string, ConnectedAccount> = {
        bank: { name: 'Chase Checking', masked: '••4821' },
        credit: { name: 'Amex Platinum', masked: '••3344' },
        invest: { name: 'Vanguard Brokerage', masked: '••7290' },
        wallet: { name: 'Coinbase Wallet', masked: '••9102' },
      };
      setConnected((prev) => ({ ...prev, [id]: names[id] }));
    }, 1500);
  };

  const connectedCount = Object.keys(connected).length;

  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <motion.div
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '800px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Progress stepper */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 md:gap-4 py-4">
          {steps.map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    idx < currentStep ? 'bg-emerald-500 text-white' :
                    idx === currentStep ? 'border-2 text-white' :
                    'bg-white/5 border border-white/10 text-white/30'
                  }`}
                  style={idx === currentStep ? { borderColor: '#22C55E', color: '#22C55E', animation: 'pulse 2s infinite' } : {}}
                >
                  {idx < currentStep ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                </div>
                <span className={`text-xs font-medium hidden md:inline ${idx === currentStep ? 'text-white' : idx < currentStep ? 'text-emerald-400' : 'text-white/30'}`}>
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 md:w-12 h-px ${idx < currentStep ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Main content */}
        <motion.div variants={fadeUp} className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <Shield className="h-6 w-6" style={{ color: '#22C55E' }} />
          </div>
          <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Step 1 of 4</span>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Connect your accounts</h1>
          <p className="text-sm text-slate-400 max-w-md">Read-only access. Bank-grade encryption. Disconnect anytime.</p>
        </motion.div>

        {/* Account type grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accountTypes.map((acct) => {
            const isConnected = !!connected[acct.id];
            const isConnecting = connecting === acct.id;
            return (
              <button
                key={acct.id}
                onClick={() => !isConnected && !isConnecting && handleConnect(acct.id)}
                disabled={isConnected || isConnecting}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  isConnected ? 'border-emerald-500/30 bg-emerald-500/5' :
                  'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15]'
                }`}
                style={!isConnected && !isConnecting ? { cursor: 'pointer' } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: acct.iconBg }}>
                    {isConnected ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : isConnecting ? (
                      <Loader2 className="h-5 w-5 animate-spin" style={{ color: acct.iconColor }} />
                    ) : (
                      <acct.icon className="h-5 w-5" style={{ color: acct.iconColor }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{acct.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{acct.desc}</p>
                    {isConnected && (
                      <p className="text-xs text-emerald-400 mt-1">{connected[acct.id].name} {connected[acct.id].masked}</p>
                    )}
                  </div>
                  {!isConnected && !isConnecting && (
                    <span className="text-xs font-medium px-3 py-1 rounded-lg border border-white/10 text-white/60">Connect</span>
                  )}
                  {isConnected && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Connected</span>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Connected accounts list */}
        {connectedCount > 0 && (
          <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Connected Accounts ({connectedCount})</h3>
            <div className="space-y-2">
              {Object.entries(connected).map(([, acct]) => (
                <div key={acct.name} className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="text-sm text-white">{acct.name}</span>
                  <span className="text-xs text-white/30">{acct.masked}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 ml-auto">Connected</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Security note */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-white/40 shrink-0 mt-0.5" />
          <p className="text-xs text-white/40 leading-relaxed">
            256-bit encryption · Read-only access · No data sold · Disconnect anytime · SOC 2 certified
          </p>
        </motion.div>

        {/* Bottom nav */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <button className="text-sm text-white/40 hover:text-white/60 transition-colors">Skip for now</button>
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity ${connectedCount > 0 ? 'text-white hover:opacity-90' : 'text-white/40 pointer-events-none opacity-50'}`}
            style={connectedCount > 0 ? { background: '#22C55E' } : { background: '#22C55E' }}
          >
            {'Continue'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Onboarding;
