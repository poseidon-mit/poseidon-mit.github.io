import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Building2, Target, Scale, Sparkles, Check,
} from 'lucide-react';
import { Link } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ── Step progress bar (all complete) ── */
const stepsMeta = [
  { label: 'Connect' },
  { label: 'Goals' },
  { label: 'Consent' },
  { label: 'Ready' },
];

function StepProgress() {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-4">
      {stepsMeta.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[#22C55E] text-white">
              <Check className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium hidden md:inline text-[#22C55E]">
              {step.label}
            </span>
          </div>
          {idx < stepsMeta.length - 1 && (
            <div className="w-8 md:w-12 h-px flex-shrink-0 bg-[#22C55E]/40" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Summary stats ── */
const stats = [
  { icon: Building2, color: '#22C55E', label: '1 account connected' },
  { icon: Target, color: '#8B5CF6', label: '3 goals set' },
  { icon: Scale, color: '#3B82F6', label: 'Govern active', sub: '100% audit coverage' },
];

/* ── Insight items ── */
const insights = [
  { color: '#EAB308', text: '2 overlapping subscriptions' },
  { color: '#EF4444', text: '1 high-fee investment account' },
  { color: '#00F0FF', text: '$400 emergency fund gap' },
];

export function OnboardingComplete() {
  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <motion.div
        className="mx-auto flex flex-col gap-6 px-4 py-12 max-w-md items-center text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Progress — all done */}
        <motion.div variants={fadeUp} className="w-full">
          <StepProgress />
        </motion.div>

        {/* Celebration icon */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%)',
            }}
          >
            <CheckCircle2 className="h-14 w-14" style={{ color: '#00F0FF' }} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl font-bold text-white mb-2">{"You\u2019re protected."}</h1>
          <p className="text-sm text-white/50">
            {"Poseidon is live. Here\u2019s your starting position:"}
          </p>
        </motion.div>

        {/* Summary stats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-3 w-full"
          style={{ animationDelay: '0.3s' }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 flex flex-col items-center gap-2"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <p className="text-xs text-white/70 font-medium leading-tight">{stat.label}</p>
              {stat.sub && (
                <p className="text-[10px] text-white/40">{stat.sub}</p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* First insight card */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left w-full"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="h-4 w-4" style={{ color: '#00F0FF' }} />
            <span className="text-xs" style={{ color: '#00F0FF' }}>
              {'First insight \u2014 ready now'}
            </span>
          </div>
          <p className="text-white font-semibold text-sm mb-3 leading-relaxed">
            We found $133/mo in optimization opportunities
          </p>
          <div className="flex flex-col gap-2 mb-4">
            {insights.map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-sm text-white/60">{item.text}</span>
              </div>
            ))}
          </div>
          <Link
            to="/dashboard"
            className="text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#00F0FF' }}
          >
            {'View full analysis \u2192'}
          </Link>
        </motion.div>

        {/* Govern proof footer */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2">
          <Scale className="h-3.5 w-3.5 text-white/30" />
          <span className="text-xs text-white/30 font-mono">
            Your audit trail has been initialized. Audit ID: GV-2026-0216-SETUP
          </span>
        </motion.div>

        {/* Primary CTA */}
        <motion.div variants={fadeUp} className="w-full mt-2">
          <Link
            to="/dashboard"
            className="block w-full rounded-xl font-bold py-3.5 text-sm text-center transition-opacity hover:opacity-90"
            style={{ background: '#00F0FF', color: '#0B1221' }}
          >
            {'Enter Dashboard \u2192'}
          </Link>
          <p className="text-xs text-white/30 mt-3">
            Your data is read-only. Nothing changes without your approval.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OnboardingComplete;
