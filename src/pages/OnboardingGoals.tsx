import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Target, Home, GraduationCap, Briefcase, Plane, ShoppingBag, Check,
} from 'lucide-react';
import { Link, useRouter } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ── Step progress bar ── */
const stepsMeta = [
  { label: 'Connect' },
  { label: 'Goals' },
  { label: 'Consent' },
  { label: 'Ready' },
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
                    ? 'border-2 border-[#8B5CF6] text-[#8B5CF6]'
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

/* ── Goals data ── */
interface GoalDef {
  id: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
  desc: string;
  target: string;
}

const goals: GoalDef[] = [
  { id: 'emergency', icon: Target, color: '#22C55E', label: 'Emergency Fund', desc: '3\u20136 months of expenses', target: '$18,000' },
  { id: 'home', icon: Home, color: '#00F0FF', label: 'Buy a Home', desc: 'Down payment savings', target: '$80,000' },
  { id: 'debt', icon: GraduationCap, color: '#EAB308', label: 'Pay Off Debt', desc: 'Student loans & credit cards', target: '$24,500' },
  { id: 'retire', icon: Briefcase, color: '#8B5CF6', label: 'Retirement', desc: 'FIRE or 401k maximization', target: '$1.2M by 65' },
  { id: 'travel', icon: Plane, color: '#F59E0B', label: 'Dream Vacation', desc: 'Travel fund', target: '$8,000' },
  { id: 'purchase', icon: ShoppingBag, color: '#EF4444', label: 'Major Purchase', desc: 'Car, gadgets, etc.', target: 'Custom' },
];

export function OnboardingGoals() {
  const { navigate } = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleGoal = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

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
          <StepProgress current={1} />
        </motion.div>

        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="h-4 w-4" style={{ color: '#8B5CF6' }} />
            <span className="text-xs font-mono" style={{ color: '#8B5CF6' }}>Step 2 of 4</span>
          </div>
          <h1 className="text-2xl font-bold text-white text-balance">What matters most to you?</h1>
          <p className="text-sm text-white/50 max-w-sm">
            {"Poseidon\u2019s Grow engine builds your personalized financial roadmap."}
          </p>
        </motion.div>

        {/* Goal cards */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          {goals.map((goal) => {
            const isSelected = selected.includes(goal.id);
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`rounded-2xl border p-4 text-left transition-all flex items-center gap-4 ${
                  isSelected
                    ? 'bg-[#8B5CF6]/[0.06]'
                    : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20'
                }`}
                style={isSelected ? { borderColor: 'rgba(139,92,246,0.5)' } : undefined}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${goal.color}15` }}
                >
                  <goal.icon className="h-5 w-5" style={{ color: goal.color }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{goal.label}</p>
                  <p className="text-xs text-white/50 mt-0.5">{goal.desc}</p>
                </div>

                {/* Target */}
                <span className="text-sm text-white/50 shrink-0 font-mono">{goal.target}</span>

                {/* Check indicator */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#8B5CF6] border-[#8B5CF6]'
                      : 'border-white/20'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Selected count */}
        <motion.div variants={fadeUp} className="text-center">
          <span className="text-xs text-white/40">
            {selected.length} {selected.length === 1 ? 'goal' : 'goals'} selected
          </span>
        </motion.div>

        {/* Bottom action bar */}
        <motion.div variants={fadeUp} className="flex items-center justify-between mt-2">
          <Link
            to="/onboarding/connect"
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            {'\u2190 Back'}
          </Link>
          <button
            onClick={() => navigate('/onboarding/consent')}
            disabled={selected.length === 0}
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: '#8B5CF6', color: '#FFFFFF' }}
          >
            {'Continue \u2192'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OnboardingGoals;
