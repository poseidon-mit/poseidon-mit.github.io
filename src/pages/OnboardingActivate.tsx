import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/router';
import { Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingShell } from '@/components/layout/OnboardingShell';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { Button } from '@/components/ui/button';
import { useDemoState } from '@/lib/demo-state/provider';

type ActivateState = 'idle' | 'activating' | 'done';

export default function OnboardingActivatePage() {
  const { navigate } = useRouter();
  const { markOnboardingCompleted } = useDemoState();
  const [activateState, setActivateState] = useState<ActivateState>('idle');

  const handleActivate = () => {
    if (activateState !== 'idle') return;
    setActivateState('activating');

    setTimeout(() => {
      setActivateState('done');
      markOnboardingCompleted();
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    }, 2000);
  };

  return (
    <OnboardingShell
      step={4}
      title="You are all set"
      subtitle=""
    >
      <main id="main-content" className="flex flex-col h-full">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex-1 flex flex-col items-center">

          <motion.div variants={fadeUp} className="text-center mt-8 mb-12">
            <div className="relative w-36 h-36 mx-auto mb-8">
              {activateState === 'activating' && (
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-emerald-400/50"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />
              )}

              <div
                className={cn(
                  'w-full h-full rounded-3xl flex items-center justify-center border transition-all duration-500 relative z-10',
                  activateState === 'done'
                    ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                    : 'bg-black/50 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md'
                )}
              >
                {activateState === 'done' ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle className="w-12 h-12 text-emerald-400" strokeWidth={1.5} />
                  </motion.div>
                ) : activateState === 'activating' ? (
                  <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" strokeWidth={1.5} />
                ) : (
                  <div className="relative">
                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <linearGradient id="sparkle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <Sparkles
                      className="w-16 h-16"
                      style={{ stroke: 'url(#sparkle-grad)' }}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-400 font-light h-5">
              {activateState === 'done'
                ? 'Engines Activated'
                : activateState === 'activating'
                  ? 'Initializing engines...'
                  : 'Poseidon is ready to assist you'}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="pt-4 pb-4 w-full mt-auto">
            <Button
              onClick={handleActivate}
              disabled={activateState !== 'idle'}
              className={cn(
                'w-full rounded-xl py-6 text-base font-semibold flex justify-center items-center gap-2 transition-all duration-500',
                activateState === 'idle'
                  ? 'bg-gradient-to-r from-[#10B981] to-[#8B5CF6] text-white hover:opacity-90'
                  : 'bg-white/[0.06] text-white/30 border border-white/[0.08] cursor-not-allowed'
              )}
            >
              {activateState === 'idle'
                ? 'Activate Poseidon'
                : activateState === 'activating'
                  ? 'Activating...'
                  : 'Entering...'}
            </Button>
          </motion.div>

        </motion.div>
      </main>
    </OnboardingShell>
  );
}
