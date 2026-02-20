import { motion } from 'framer-motion';
import { Link } from '@/router';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingShell } from '@/components/layout/OnboardingShell';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { ButtonLink, Toggle, Surface } from '@/design-system';
import { useDemoState } from '@/lib/demo-state/provider';

interface ConsentItem {
  id: string;
  label: string;
  desc: string;
  required: boolean;
}

const CONSENT_ITEMS: ConsentItem[] = [
{
  id: 'analyze',
  label: 'Analyze my transactions',
  desc: 'Allow AI engines to process financial data for threat detection and opportunity analysis.',
  required: true
},
{
  id: 'recommend',
  label: 'Generate recommendations',
  desc: 'Allow suggestions for transfers, budget updates, and portfolio actions.',
  required: false
},
{
  id: 'approve',
  label: 'Require my approval before acting',
  desc: 'Every automated action must be explicitly approved before execution.',
  required: true
},
{
  id: 'notifications',
  label: 'Send real-time alerts',
  desc: 'Receive alerts for threats, opportunities, and pending approvals.',
  required: false
}];


export default function OnboardingConsentPage() {
  const { state, updateOnboarding } = useDemoState();
  const consents = state.onboarding.consentSelections;

  const toggle = (id: string) => {
    const item = CONSENT_ITEMS.find((entry) => entry.id === id);
    if (item?.required) return;
    updateOnboarding({
      consentSelections: {
        ...consents,
        [id]: !consents[id],
      },
    });
  };

  return (
    <OnboardingShell
      step={3}
      title="Set your consent boundaries"
      subtitle="Control exactly what Poseidon can do. All decisions remain explainable, auditable, and reversible.">
      <div>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={staggerContainer} className="space-y-3">
          {CONSENT_ITEMS.map((item) => {
            const enabled = consents[item.id];
            return <Surface
              key={item.id} variants={fadeUp} className="rounded-xl border border-white/10" variant="glass" padding="md" as={motion.div}>
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                      {item.required ?
                    <span className="rounded-full border border-[var(--engine-dashboard)]/35 bg-[var(--engine-dashboard)]/12 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--engine-dashboard)]">
                          Required
                        </span> :
                    null}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.desc}</p>
                  </div>

                  <Toggle
                  checked={enabled}
                  onChange={() => toggle(item.id)}
                  ariaLabel={item.label}
                  disabled={item.required}
                  className={cn(item.required ? 'opacity-70' : undefined)} />
                
                </div>
              </Surface>;

          })}
        </motion.div>

        <Surface variants={fadeUp} className="mt-6 rounded-xl border border-white/10" variant="glass" padding="md" as={motion.div}>
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4.5 w-4.5 text-[var(--engine-dashboard)]" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-slate-300">
              All actions are logged in an immutable audit ledger. You can review, reverse, or dispute outcomes at any time in Govern.
            </p>
          </div>
        </Surface>

        <motion.div variants={fadeUp} className="mt-7 flex items-center justify-between">
          <Link to="/onboarding/goals" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>

          <ButtonLink
            to="/onboarding/complete"
            variant="primary"
            engine="dashboard"
            className="rounded-xl">
            
            Activate Poseidon
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </motion.div>
        </motion.div>
      </div>
    </OnboardingShell>);

}
