import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/router';
import { Building2, ArrowRight, Loader2, ShieldCheck, TrendingUp, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingShell } from '@/components/layout/OnboardingShell';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { Button } from '@/components/ui/button';
import { useDemoState } from '@/lib/demo-state/provider';

const CONNECTORS = [
  {
    id: 'bank',
    icon: Building2,
    label: 'Bank Accounts',
    desc: '',
  },
  {
    id: 'credit',
    icon: CreditCard,
    label: 'Credit Cards',
    desc: '',
  },
  {
    id: 'investment',
    icon: TrendingUp,
    label: 'Investments',
    desc: '',
  },
] as const

type ConnectorState = 'idle' | 'connecting' | 'success';

export default function OnboardingConnectPage() {
  const { navigate } = useRouter();
  const [states, setStates] = useState<Record<string, ConnectorState>>(
    () => Object.fromEntries(CONNECTORS.map(c => [c.id, 'idle']))
  );
  const { updateOnboarding } = useDemoState();

  const handleConnect = (id: string) => {
    if (states[id] !== 'idle') return;
    setStates(prev => ({ ...prev, [id]: 'connecting' }));
    setTimeout(() => {
      setStates(prev => {
        const next = { ...prev, [id]: 'success' as ConnectorState };
        const connectedIds = Object.entries(next)
          .filter(([, s]) => s === 'success')
          .map(([k]) => k);
        updateOnboarding({ connectedAccountIds: connectedIds });
        return next;
      });
    }, 2000);
  };

  const anyConnected = Object.values(states).some(s => s === 'success');

  return (
    <OnboardingShell
      step={1}
      title="Secure Connection with 3rd party aggregator"
      titleClassName="text-2xl md:text-3xl"
      subtitle="Poseidon NEVER transacts without your approval."
    >
      <main id="main-content" className="flex flex-col h-full">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex-1 flex flex-col">

          <motion.div variants={staggerContainer} className="space-y-3 flex-1 mt-4">
            {CONNECTORS.map((connector) => {
              const state = states[connector.id];
              const isConnecting = state === 'connecting';
              const isSuccess = state === 'success';

              return (
                <motion.div key={connector.id} variants={fadeUp}>
                  <button
                    type="button"
                    onClick={() => handleConnect(connector.id)}
                    disabled={state !== 'idle'}
                    className={cn(
                      'w-full rounded-2xl border p-4 md:p-5 text-left transition-all duration-500 flex items-center gap-4 group relative overflow-hidden',
                      isSuccess
                        ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                        : isConnecting
                          ? 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    )}
                  >
                    {isConnecting && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      />
                    )}

                    <span
                      className={cn(
                        'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors relative z-10 shrink-0',
                        isSuccess
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                          : isConnecting
                            ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400'
                            : 'border-white/10 bg-white/[0.03] text-white/70 group-hover:text-white'
                      )}
                    >
                      <connector.icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1 relative z-10">
                      <p className="text-sm font-display font-medium text-white">{connector.label}</p>
                      {connector.desc && <p className="text-xs text-slate-400 font-light">{connector.desc}</p>}
                    </div>

                    <div className="shrink-0 relative z-10">
                      {state === 'idle' && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Connect</span>
                      )}
                      {isConnecting && (
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                      )}
                      {isSuccess && (
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 pt-4 pb-4 w-full">
            <Button
              onClick={() => navigate('/onboarding/priorities')}
              disabled={!anyConnected}
              className={cn(
                'w-full rounded-xl py-6 text-base font-semibold flex justify-center items-center gap-2 transition-all duration-500',
                anyConnected
                  ? 'bg-gradient-to-r from-[#10B981] to-[#8B5CF6] text-white hover:opacity-90'
                  : 'bg-white/[0.06] text-white/30 border border-white/[0.08] cursor-not-allowed'
              )}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

        </motion.div>
      </main>
    </OnboardingShell>
  )
}
