import { motion } from 'framer-motion';
import { Link } from '@/router';
import { Building2, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingShell } from '@/components/layout/OnboardingShell';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { Button, ButtonLink, Surface } from '@/design-system';
import { useDemoState } from '@/lib/demo-state/provider';

const CONNECTORS = [
  {
    id: 'bank',
    icon: Building2,
    label: 'Connect Primary Institution',
    desc: 'Secure read-only access for demonstration',
  },
] as const

export default function OnboardingConnectPage() {
  const { state, updateOnboarding } = useDemoState();
  const connected = new Set(state.onboarding.connectedAccountIds);

  const toggle = (id: string) => {
    const next = new Set(connected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    updateOnboarding({ connectedAccountIds: Array.from(next) });
  };

  return (
    <OnboardingShell
      step={1}
      title="Establish Connection"
      subtitle="Link a primary institution to initialize the AI engines.">
      <main id="main-content">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={staggerContainer} className="space-y-3">
            {CONNECTORS.map((connector) => {
              const isConnected = connected.has(connector.id);
              return (
                <motion.div
                  key={connector.id}
                  variants={fadeUp}>

                  <Button
                    type="button"
                    variant="glass"
                    engine="dashboard"
                    onClick={() => toggle(connector.id)}
                    fullWidth
                    className={cn(
                      'w-full rounded-2xl border p-6 text-left transition-all duration-300 !h-auto !min-h-0 justify-start',
                      isConnected
                        ? 'border-[var(--state-healthy)]/45 bg-[var(--state-healthy)]/10 shadow-[0_0_30px_rgba(34,197,94,0.15)]'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    )}
                  >
                    <div className="flex w-full items-center gap-6">
                      <span
                        className={cn(
                          'inline-flex h-14 w-14 items-center justify-center rounded-xl border transition-colors',
                          isConnected
                            ? 'border-[var(--state-healthy)]/40 bg-[var(--state-healthy)]/15 text-[var(--state-healthy)] shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                            : 'border-white/10 bg-white/[0.03] text-slate-400'
                        )}
                      >
                        <connector.icon className="h-7 w-7" aria-hidden="true" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-display font-medium text-slate-100">{connector.label}</p>
                        <p className="mt-1 text-sm text-slate-400 font-light">{connector.desc}</p>
                      </div>

                      <span
                        className={cn(
                          'inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all',
                          isConnected
                            ? 'border-[var(--state-healthy)] bg-[var(--state-healthy)] text-slate-950 scale-100 opacity-100'
                            : 'border-white/15 bg-white/[0.03] text-transparent scale-90 opacity-50'
                        )}
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center">
            <ButtonLink
              to="/onboarding/complete"
              variant="primary"
              engine="dashboard"
              className="rounded-full py-6 px-12 text-lg tracking-wide transition-all shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]"
            >
              Initialize Command Center
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </ButtonLink>
          </motion.div>
        </motion.div>
      </main>
    </OnboardingShell>
  )

}
