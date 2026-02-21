import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/router';
import { Building2, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingShell } from '@/components/layout/OnboardingShell';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { Button } from '@/design-system';
import { useDemoState } from '@/lib/demo-state/provider';

const CONNECTORS = [
  {
    id: 'bank',
    icon: Building2,
    label: 'Chase Private Client',
    desc: 'Primary Operating Account',
  },
] as const

type ConnectionState = 'idle' | 'connecting' | 'success';

export default function OnboardingConnectPage() {
  const { navigate } = useRouter();
  const [connState, setConnState] = useState<ConnectionState>('idle');
  const { updateOnboarding } = useDemoState();

  const handleConnect = () => {
    if (connState !== 'idle') return;
    setConnState('connecting');
    // Simulate connection delay for premium feel
    setTimeout(() => {
      setConnState('success');
      updateOnboarding({ connectedAccountIds: ['bank'] });
    }, 2500);
  };

  return (
    <OnboardingShell
      step={1}
      title="Establish Connection"
      subtitle="Link your primary account to initialize the AI routing engine."
    >
      <main id="main-content" className="flex flex-col h-full min-h-[50vh]">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex-1 flex flex-col">

          <motion.div variants={staggerContainer} className="space-y-4 flex-1 mt-4">
            {CONNECTORS.map((connector) => {
              const isConnecting = connState === 'connecting';
              const isSuccess = connState === 'success';

              return (
                <motion.div key={connector.id} variants={fadeUp}>
                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={connState !== 'idle'}
                    className={cn(
                      'w-full rounded-3xl border p-5 md:p-6 text-left transition-all duration-500 flex items-center gap-4 md:gap-6 group relative overflow-hidden',
                      isSuccess
                        ? 'border-[var(--state-healthy)]/40 bg-[var(--state-healthy)]/10 shadow-[0_0_30px_rgba(34,197,94,0.15)]'
                        : isConnecting
                          ? 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
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
                        'inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl border transition-colors relative z-10 shrink-0',
                        isSuccess
                          ? 'border-[var(--state-healthy)]/40 bg-[var(--state-healthy)]/15 text-[var(--state-healthy)]'
                          : isConnecting
                            ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400'
                            : 'border-white/10 bg-white/[0.03] text-white/70 group-hover:text-white'
                      )}
                    >
                      <connector.icon className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1 relative z-10">
                      <p className="text-base md:text-lg font-display font-medium text-white">{connector.label}</p>
                      <p className="mt-0.5 text-xs md:text-sm text-slate-400 font-light">{connector.desc}</p>
                    </div>

                    <div className="shrink-0 relative z-10">
                      {connState === 'idle' && (
                        <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Connect</span>
                      )}
                      {isConnecting && (
                        <div className="flex items-center gap-2 text-cyan-400">
                          <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                          <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest font-semibold">Authenticating</span>
                        </div>
                      )}
                      {isSuccess && (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />
                          <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest font-semibold">Verified</span>
                        </div>
                      )}
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>

          <AnimatePresence>
            {connState === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 pt-4 pb-4 w-full"
              >
                <Button
                  onClick={() => navigate('/login')}
                  variant="primary"
                  engine="dashboard"
                  fullWidth
                  className="rounded-2xl py-5 text-lg font-bold shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] transition-all flex justify-center items-center gap-2 border border-cyan-500/50"
                >
                  Enter Command Center <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </main>
    </OnboardingShell>
  )
}
