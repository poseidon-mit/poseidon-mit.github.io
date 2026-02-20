import { motion } from 'framer-motion';
import { Shield, TrendingUp, Zap, Scale, ArrowRight } from 'lucide-react';
import { OnboardingShell } from '@/components/layout/OnboardingShell';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { ButtonLink, Surface } from '@/design-system';

const STEPS_PREVIEW = [
{ icon: Shield, label: 'Connect', desc: 'Link your financial accounts securely with read-only access' },
{ icon: TrendingUp, label: 'Set goals', desc: 'Define priorities that guide growth and risk posture' },
{ icon: Scale, label: 'Set boundaries', desc: 'Control exactly what AI can and cannot do for you' },
{ icon: Zap, label: 'Activate', desc: 'Engines begin generating explainable recommendations' }];


export default function OnboardingWelcomePage() {
  return (
    <OnboardingShell
      step={1}
      showProgress={false}
      title="One AI studio for safer and faster money decisions"
      subtitle="Complete four short steps to activate your command center. Average setup time is under three minutes.">
      
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STEPS_PREVIEW.map((step, index) => <Surface
            key={step.label} variants={fadeUp} className="rounded-xl" variant="glass" padding="md" as={motion.div}>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[var(--engine-dashboard)]">
                  <step.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {index + 1}. {step.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{step.desc}</p>
                </div>
              </div>
            </Surface>
          )}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">
          
          <span>Read-only access</span>
          <span className="text-slate-600">•</span>
          <span>Bank-level encryption</span>
          <span className="text-slate-600">•</span>
          <span>Cancel anytime</span>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8">
          <ButtonLink
            to="/onboarding/connect"
            variant="primary"
            engine="dashboard"
            className="rounded-xl">
            
            Continue setup
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </motion.div>
      </motion.div>
    </OnboardingShell>);

}