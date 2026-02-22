import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/router';
import { ShieldCheck, TrendingUp, Zap, Scale, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingShell } from '@/components/layout/OnboardingShell';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { Button } from '@/components/ui/button';
import { useDemoState } from '@/lib/demo-state/provider';

const GOALS = [
  {
    id: 'protect',
    icon: ShieldCheck,
    label: 'Protect',
    desc: 'Monitor threats & safeguard assets',
  },
  {
    id: 'grow',
    icon: TrendingUp,
    label: 'Grow',
    desc: 'Optimize balance and portfolio',
  },
  {
    id: 'execute',
    icon: Zap,
    label: 'Execute',
    desc: 'Automate financial operation with human approval',
  },
  {
    id: 'govern',
    icon: Scale,
    label: 'Govern',
    desc: 'Audit trail, Disclosure & Transparency, and compliance oversight',
  },
] as const;

export default function OnboardingPrioritiesPage() {
  const { navigate } = useRouter();
  const { state, updateOnboarding } = useDemoState();
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set([...state.onboarding.selectedGoals, 'govern'])
  );

  const toggleGoal = (id: string) => {
    if (id === 'govern') return; // Govern is mandatory
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      next.add('govern'); // Always keep govern
      const goals = Array.from(next);
      updateOnboarding({ selectedGoals: goals });
      return next;
    });
  };

  const anyNonGovern = ['protect', 'grow', 'execute'].some(id => selected.has(id));

  return (
    <OnboardingShell
      step={2}
      title="Financial Goals"
      subtitle="Define your priorities"
    >
      <div className="flex flex-col h-full">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex-1 flex flex-col">

          <motion.div variants={staggerContainer} className="space-y-3 flex-1 mt-4">
            {GOALS.map((goal) => {
              const isSelected = selected.has(goal.id);
              const isMandatory = goal.id === 'govern';

              return (
                <motion.div key={goal.id} variants={fadeUp}>
                  <button
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      'w-full rounded-2xl border p-4 md:p-5 text-left transition-all duration-500 flex items-center gap-4 group',
                      isSelected
                        ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors shrink-0',
                        isSelected
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                          : 'border-white/10 bg-white/[0.03] text-white/70 group-hover:text-white'
                      )}
                    >
                      <goal.icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-display font-medium text-white">{goal.label}</p>
                      <p className="text-xs text-slate-400 font-light">{goal.desc}</p>
                    </div>

                    <div className="shrink-0">
                      {isMandatory ? (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Required</span>
                      ) : isSelected ? (
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 pt-4 pb-4 w-full">
            <Button
              onClick={() => navigate('/onboarding/consent')}
              disabled={!anyNonGovern}
              className={cn(
                'w-full rounded-xl py-6 text-base font-semibold flex justify-center items-center gap-2 transition-all duration-500',
                anyNonGovern
                  ? 'bg-gradient-to-r from-[#10B981] to-[#8B5CF6] text-white hover:opacity-90'
                  : 'bg-white/[0.06] text-white/30 border border-white/[0.08] cursor-not-allowed'
              )}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

        </motion.div>
      </div>
    </OnboardingShell>
  );
}
