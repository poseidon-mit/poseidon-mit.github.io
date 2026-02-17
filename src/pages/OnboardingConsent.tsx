import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scale, Shield, TrendingUp, Zap, Lock, Check,
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
                    ? 'border-2 border-[#3B82F6] text-[#3B82F6]'
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

/* ── Toggle switch ── */
function Toggle({
  enabled,
  onToggle,
  color,
  locked,
}: {
  enabled: boolean;
  onToggle: () => void;
  color: string;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={locked}
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-colors shrink-0 flex items-center"
      style={{ background: enabled ? color : 'rgba(255,255,255,0.1)' }}
    >
      <motion.div
        className="w-4.5 h-4.5 rounded-full bg-white shadow-sm"
        style={{ width: 18, height: 18 }}
        animate={{ x: enabled ? 22 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      {locked && (
        <Lock className="absolute right-1.5 h-2.5 w-2.5 text-white/60" />
      )}
    </button>
  );
}

/* ── Engine definitions ── */
interface EngineDef {
  id: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  name: string;
  defaultOn: boolean;
  locked?: boolean;
  abilities: string[];
  cannot: string;
  specialNote?: string;
  lockedNote?: string;
}

const engines: EngineDef[] = [
  {
    id: 'protect',
    icon: Shield,
    color: '#22C55E',
    name: 'Protect',
    defaultOn: true,
    abilities: [
      'Monitor transactions for fraud',
      'Send real-time alerts',
      'Flag suspicious patterns',
    ],
    cannot: 'Block a transaction without your approval',
  },
  {
    id: 'grow',
    icon: TrendingUp,
    color: '#8B5CF6',
    name: 'Grow',
    defaultOn: true,
    abilities: [
      'Analyze spending patterns',
      'Generate savings forecasts',
      'Recommend optimizations',
    ],
    cannot: 'Move money or invest funds automatically',
  },
  {
    id: 'execute',
    icon: Zap,
    color: '#EAB308',
    name: 'Execute',
    defaultOn: false,
    abilities: [
      'Queue approved actions',
      'Send payment proposals',
      'Automate recurring transfers',
    ],
    cannot: 'Execute any action without step-by-step consent',
    specialNote: 'Always requires explicit approval',
  },
  {
    id: 'govern',
    icon: Scale,
    color: '#3B82F6',
    name: 'Govern',
    defaultOn: true,
    locked: true,
    abilities: [
      'Log all AI decisions with audit trail',
      'Explain every recommendation',
      'Enforce your rules',
    ],
    cannot: '',
    lockedNote: 'Cannot be disabled \u2014 this is your protection',
  },
];

export function OnboardingConsent() {
  const { navigate } = useRouter();
  const [toggleState, setToggleState] = useState<Record<string, boolean>>(
    Object.fromEntries(engines.map((e) => [e.id, e.defaultOn]))
  );

  const handleToggle = (id: string) => {
    const engine = engines.find((e) => e.id === id);
    if (engine?.locked) return;
    setToggleState((prev) => ({ ...prev, [id]: !prev[id] }));
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
          <StepProgress current={2} />
        </motion.div>

        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-1.5 mb-2">
            <Scale className="h-4 w-4" style={{ color: '#3B82F6' }} />
            <span className="text-xs font-mono" style={{ color: '#3B82F6' }}>Step 3 of 4</span>
          </div>
          <h1 className="text-2xl font-bold text-white text-balance">Your AI, your rules.</h1>
          <p className="text-sm text-white/50 max-w-sm">
            {"Every action Poseidon takes requires your approval. Here\u2019s exactly what each engine can do."}
          </p>
        </motion.div>

        {/* Engine permission cards */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          {engines.map((engine) => {
            const isOn = toggleState[engine.id];

            return (
              <div
                key={engine.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${engine.color}15` }}
                  >
                    <engine.icon className="h-5 w-5" style={{ color: engine.color }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-bold text-white">{engine.name}</p>
                      {engine.specialNote && (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: `${engine.color}20`, color: engine.color }}
                        >
                          {engine.specialNote}
                        </span>
                      )}
                    </div>

                    {/* Abilities */}
                    <div className="flex flex-col gap-1 mb-2">
                      {engine.abilities.map((a) => (
                        <div key={a} className="flex items-start gap-1.5">
                          <Check className="h-3 w-3 mt-0.5 shrink-0" style={{ color: engine.color }} />
                          <span className="text-xs text-white/60">{a}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cannot / locked note */}
                    {engine.cannot && (
                      <p className="text-xs text-white/40 italic">
                        {'\u2718 Cannot: ' + engine.cannot}
                      </p>
                    )}
                    {engine.lockedNote && (
                      <p className="text-xs italic" style={{ color: `${engine.color}CC` }}>
                        {engine.lockedNote}
                      </p>
                    )}
                  </div>

                  {/* Toggle */}
                  <Toggle
                    enabled={isOn}
                    onToggle={() => handleToggle(engine.id)}
                    color={engine.color}
                    locked={engine.locked}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Govern audit proof */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 border-l-2"
          style={{ borderLeftColor: '#3B82F6' }}
        >
          <p className="text-xs font-mono text-white/40 mb-1">Audit ID: GV-2026-0216-CONSENT</p>
          <p className="text-sm text-white/50">
            This consent record will be logged to your personal audit trail.
          </p>
        </motion.div>

        {/* Bottom action bar */}
        <motion.div variants={fadeUp} className="flex items-center justify-between mt-2">
          <Link
            to="/onboarding/goals"
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            {'\u2190 Back'}
          </Link>
          <button
            onClick={() => navigate('/onboarding/complete')}
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: '#3B82F6', color: '#FFFFFF' }}
          >
            {'Activate Poseidon \u2192'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OnboardingConsent;
