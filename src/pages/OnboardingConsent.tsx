import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/router';
import { Brain, Lightbulb, CheckCircle, Bell, ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingShell } from '@/components/layout/OnboardingShell';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useDemoState } from '@/lib/demo-state/provider';
import type { LucideIcon } from 'lucide-react';

interface ConsentItem {
  id: string;
  icon: LucideIcon;
  label: string;
  desc: string;
}

interface ConsentItemDef extends ConsentItem {
  amber?: boolean;
}

const CONSENT_ITEMS: ConsentItemDef[] = [
  {
    id: 'analyze',
    icon: Brain,
    label: 'Analyze',
    desc: 'AI can analyze your financial data',
  },
  {
    id: 'recommend',
    icon: Lightbulb,
    label: 'Recommend',
    desc: 'AI can suggest optimizations',
  },
  {
    id: 'notifications',
    icon: Bell,
    label: 'Notifications',
    desc: 'Send alerts and updates',
  },
  {
    id: 'approve',
    icon: CheckCircle,
    label: 'Quick Actions',
    desc: 'AI can handle routine transactions (configurable)',
    amber: true,
  },
];

export default function OnboardingConsentPage() {
  const { navigate } = useRouter();
  const { state, updateOnboarding } = useDemoState();
  const [consents, setConsents] = useState<Record<string, boolean>>(
    () => ({ ...state.onboarding.consentSelections })
  );
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const toggleConsent = (id: string) => {
    if (id === 'approve' && !consents['approve']) {
      // Turning ON Quick Actions requires confirmation
      setShowApproveDialog(true);
      return;
    }
    setConsents(prev => {
      const next = { ...prev, [id]: !prev[id] };
      updateOnboarding({ consentSelections: next });
      return next;
    });
  };

  const confirmApprove = () => {
    setConsents(prev => {
      const next = { ...prev, approve: true };
      updateOnboarding({ consentSelections: next });
      return next;
    });
    setShowApproveDialog(false);
  };

  return (
    <OnboardingShell
      step={3}
      title="AI Permissions"
      subtitle="Set consent bounds"
    >
      <div className="flex flex-col h-full">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex-1 flex flex-col">

          <motion.div variants={staggerContainer} className="space-y-3 flex-1 mt-4">
            {CONSENT_ITEMS.map((item) => {
              const isOn = consents[item.id] ?? false;
              const isAmber = item.amber;

              return (
                <motion.div key={item.id} variants={fadeUp}>
                  <button
                    type="button"
                    onClick={() => toggleConsent(item.id)}
                    className={cn(
                      'w-full rounded-2xl border p-4 md:p-5 text-left transition-all duration-500 flex items-center gap-4 group',
                      isAmber
                        ? isOn
                          ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                          : 'border-amber-500/20 bg-amber-500/[0.04] hover:border-amber-500/30 hover:bg-amber-500/[0.07]'
                        : isOn
                          ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors shrink-0',
                        isAmber
                          ? isOn
                            ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                            : 'border-amber-500/30 bg-amber-500/[0.06] text-amber-500/70 group-hover:text-amber-400'
                          : isOn
                            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                            : 'border-white/10 bg-white/[0.03] text-white/70 group-hover:text-white'
                      )}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className={cn('text-sm font-display font-medium', isAmber ? 'text-amber-100' : 'text-white')}>{item.label}</p>
                      <p className={cn('text-xs font-light', isAmber ? 'text-amber-400/70' : 'text-slate-400')}>{item.desc}</p>
                    </div>

                    <div className="shrink-0">
                      <div
                        className={cn(
                          'w-10 h-6 rounded-full transition-colors duration-300 relative',
                          isAmber
                            ? isOn ? 'bg-amber-500' : 'bg-white/10'
                            : isOn ? 'bg-emerald-500' : 'bg-white/10'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300',
                            isOn ? 'translate-x-5' : 'translate-x-1'
                          )}
                        />
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 pt-4 pb-4 w-full">
            <Button
              onClick={() => navigate('/onboarding/activate')}
              className="w-full rounded-xl py-6 text-base font-semibold bg-gradient-to-r from-[#10B981] to-[#8B5CF6] text-white hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

        </motion.div>
      </div>

      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-sm rounded-2xl border border-amber-500/30 bg-[#0d0d14] text-white shadow-[0_0_40px_rgba(245,158,11,0.1)]">
          <DialogHeader className="text-center items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <DialogTitle className="text-white font-display text-lg font-semibold">Enable Quick Actions?</DialogTitle>
            <DialogDescription className="text-slate-400 text-sm mt-2 leading-relaxed">
              Poseidon will be able to handle routine transactions without additional confirmation. You can adjust this at any time in Settings.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Button
              onClick={confirmApprove}
              className="w-full rounded-xl py-5 text-sm font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Yes, Enable Quick Actions
            </Button>
            <Button
              onClick={() => setShowApproveDialog(false)}
              className="w-full rounded-xl py-5 text-sm font-semibold bg-white/[0.06] text-white/70 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </OnboardingShell>
  );
}
