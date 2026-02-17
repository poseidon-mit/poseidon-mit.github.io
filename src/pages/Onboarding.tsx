import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, CreditCard, TrendingUp, Wallet,
  Lock, CheckCircle2, Loader2, Check,
} from 'lucide-react';
import { Link, useRouter } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ── Step progress bar (reused across onboarding) ── */
const stepsMeta = [
  { label: 'Connect', path: '/onboarding/connect' },
  { label: 'Goals', path: '/onboarding/goals' },
  { label: 'Consent', path: '/onboarding/consent' },
  { label: 'Ready', path: '/onboarding/complete' },
];

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-4">
      {stepsMeta.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                idx < current
                  ? 'bg-[#22C55E] text-white'
                  : idx === current
                    ? 'border-2 border-[#00F0FF] text-[#00F0FF]'
                    : 'border border-white/20 text-white/30'
              }`}
              style={idx === current ? { animation: 'pulse 2s infinite' } : {}}
            >
              {idx < current ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span
              className={`text-xs font-medium hidden md:inline ${
                idx < current
                  ? 'text-[#22C55E]'
                  : idx === current
                    ? 'text-white'
                    : 'text-white/30'
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < stepsMeta.length - 1 && (
            <div className={`w-8 md:w-12 h-px flex-shrink-0 ${idx < current ? 'bg-[#22C55E]/40' : 'bg-white/10'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Account cards ── */
interface AccountDef {
  id: string;
  label: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  sub: string;
}

const accountTypes: AccountDef[] = [
  { id: 'bank', label: 'Bank Account', icon: Building2, color: '#22C55E', sub: 'Checking \u00b7 Savings \u00b7 Cash' },
  { id: 'credit', label: 'Credit Card', icon: CreditCard, color: '#EAB308', sub: 'Cards \u00b7 Rewards \u00b7 Debt tracking' },
  { id: 'invest', label: 'Investment', icon: TrendingUp, color: '#8B5CF6', sub: 'Brokerage \u00b7 401k \u00b7 IRA' },
  { id: 'wallet', label: 'Crypto / Wallet', icon: Wallet, color: '#00F0FF', sub: 'Digital assets \u00b7 DeFi' },
];

interface ConnectedInfo {
  name: string;
  masked: string;
}

const mockConnections: Record<string, ConnectedInfo> = {
  bank: { name: 'Chase', masked: '\u2022\u20224892' },
  credit: { name: 'Amex Platinum', masked: '\u2022\u20223344' },
  invest: { name: 'Vanguard', masked: '\u2022\u20227290' },
  wallet: { name: 'Coinbase', masked: '\u2022\u20229102' },
};

export function Onboarding() {
  const { navigate } = useRouter();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Record<string, ConnectedInfo>>({
    bank: mockConnections.bank, // pre-connected for demo
  });

  const handleConnect = (id: string) => {
    if (connected[id] || connecting) return;
    setConnecting(id);
    setTimeout(() => {
      setConnected((prev) => ({ ...prev, [id]: mockConnections[id] }));
      setConnecting(null);
    }, 1500);
  };

  const connectedCount = Object.keys(connected).length;

  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <motion.div
        className="mx-auto flex flex-col gap-6 px-4 py-8 max-w-lg"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Progress */}
        <motion.div variants={fadeUp}>
          <StepProgress current={0} />
        </motion.div>

        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-1.5 mb-2">
            <img src="/logo.png" alt="" className="h-7 w-7 object-contain" aria-hidden="true" />
            <span className="text-xs font-mono" style={{ color: '#00F0FF' }}>Step 1 of 4</span>
          </div>
          <h1 className="text-2xl font-bold text-white text-balance">Connect your accounts</h1>
          <p className="text-sm text-white/50 max-w-sm">
            Poseidon reads your data. It never writes without your approval.
          </p>
        </motion.div>

        {/* Account cards grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {accountTypes.map((acct) => {
            const isConnected = !!connected[acct.id];
            const isConnecting = connecting === acct.id;

            return (
              <button
                key={acct.id}
                onClick={() => handleConnect(acct.id)}
                disabled={isConnected || !!connecting}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  isConnected
                    ? 'bg-white/[0.03]'
                    : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20'
                }`}
                style={
                  isConnected
                    ? { borderColor: `${acct.color}30` }
                    : undefined
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${acct.color}15` }}
                  >
                    {isConnected ? (
                      <CheckCircle2 className="h-5 w-5" style={{ color: acct.color }} />
                    ) : isConnecting ? (
                      <Loader2 className="h-5 w-5 animate-spin" style={{ color: acct.color }} />
                    ) : (
                      <acct.icon className="h-5 w-5" style={{ color: acct.color }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{acct.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{acct.sub}</p>
                    {isConnected && (
                      <p className="text-xs mt-1" style={{ color: acct.color }}>
                        {connected[acct.id].name} {connected[acct.id].masked}
                      </p>
                    )}
                    {isConnecting && (
                      <p className="text-xs text-white/40 mt-1">{'Connecting\u2026'}</p>
                    )}
                  </div>
                  {!isConnected && !isConnecting && (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.04] text-white/70 shrink-0">
                      Connect
                    </span>
                  )}
                  {isConnected && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#22C55E] shrink-0" style={{ background: 'rgba(34,197,94,0.15)' }}>
                      Connected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Security footer */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 text-center">
          <Lock className="h-3.5 w-3.5 text-white/30 shrink-0" />
          <p className="text-xs text-white/30">
            {'256-bit encryption \u00b7 Read-only access \u00b7 No data sold \u00b7 Disconnect anytime \u00b7 SOC 2 Type II'}
          </p>
        </motion.div>

        {/* Bottom action bar */}
        <motion.div variants={fadeUp} className="flex items-center justify-between mt-2">
          <Link
            to="/onboarding/goals"
            className="text-sm text-white/40 underline-offset-2 hover:text-white/60 transition-colors"
          >
            Skip for now
          </Link>
          <button
            onClick={() => navigate('/onboarding/goals')}
            disabled={connectedCount === 0}
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: '#00F0FF', color: '#0B1221' }}
          >
            {'Continue \u2192'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Onboarding;
