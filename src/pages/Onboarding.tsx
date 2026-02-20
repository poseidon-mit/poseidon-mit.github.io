import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/router';
import { Building2, CreditCard, PiggyBank, Check, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingShell } from '@/components/layout/OnboardingShell';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { Button, ButtonLink, Surface } from '@/design-system';

const CONNECTORS = [
{
  id: 'bank',
  icon: Building2,
  label: 'Bank account',
  desc: 'Checking and savings accounts'
},
{
  id: 'credit',
  icon: CreditCard,
  label: 'Credit cards',
  desc: 'Track spending and statement risk'
},
{
  id: 'investment',
  icon: PiggyBank,
  label: 'Investment accounts',
  desc: 'Brokerage and retirement balances'
}] as
const;

export default function OnboardingConnectPage() {
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else
      next.add(id);
      return next;
    });
  };

  return (
    <OnboardingShell
      step={1}
      title="Connect your financial accounts"
      subtitle="Poseidon uses read-only access. Money movement always requires explicit consent and leaves a full audit trail.">
      
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
                    'w-full rounded-xl border p-4 text-left transition-colors !h-auto !min-h-0 justify-start',
                    isConnected ?
                    'border-[var(--state-healthy)]/45 bg-[var(--state-healthy)]/10' :
                    'border-white/10 bg-white/[0.02] hover:border-white/20'
                  )}>
                  
                  <div className="flex w-full items-center gap-4">
                    <span
                      className={cn(
                        'inline-flex h-10 w-10 items-center justify-center rounded-lg border',
                        isConnected ?
                        'border-[var(--state-healthy)]/40 bg-[var(--state-healthy)]/15 text-[var(--state-healthy)]' :
                        'border-white/10 bg-white/[0.03] text-slate-500'
                      )}>
                      
                      <connector.icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-100">{connector.label}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{connector.desc}</p>
                    </div>

                    <span
                      className={cn(
                        'inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border',
                        isConnected ?
                        'border-[var(--state-healthy)] bg-[var(--state-healthy)] text-slate-950' :
                        'border-white/15 bg-white/[0.03] text-transparent'
                      )}>
                      
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Button>
              </motion.div>);

          })}
        </motion.div>

        <Surface variants={fadeUp} className="mt-6 rounded-xl p-4" variant="glass" padding="none" as={motion.div}>
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-4.5 w-4.5 text-[var(--engine-dashboard)]" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Security guarantee</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Credentials are never stored. Access is encrypted end-to-end and logged in the immutable governance ledger.
              </p>
            </div>
          </div>
        </Surface>

        <motion.div variants={fadeUp} className="mt-7 flex items-center justify-between gap-4">
          <Link to="/onboarding" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/onboarding/goals" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">
              Skip for now
            </Link>
            <ButtonLink
              to="/onboarding/goals"
              variant="primary"
              engine="dashboard"
              className="rounded-xl">
              
              Continue to goals
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </motion.div>
      </motion.div>
    </OnboardingShell>);

}