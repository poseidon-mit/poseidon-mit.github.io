import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';
import { DEMO_THREAD } from '@/lib/demo-thread'

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const transaction = {
  merchant: DEMO_THREAD.criticalAlert.merchant,
  amount: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}.00`,
  date: 'Feb 16, 2026 at 03:00 AM',
  card: `****${DEMO_THREAD.criticalAlert.cardLast4}`,
  category: 'Electronics',
  confidence: Math.round(DEMO_THREAD.criticalAlert.confidence * 100),
};

const shapFactors = [
  { label: 'Merchant history', value: 0.82, direction: 'up' as const },
  { label: 'Amount deviation', value: 0.71, direction: 'up' as const },
  { label: 'Geographic mismatch', value: 0.65, direction: 'up' as const },
  { label: 'Time pattern', value: -0.12, direction: 'down' as const },
  { label: 'Account age', value: -0.08, direction: 'down' as const },
];

const disputeSteps = [
  { title: 'Review Transaction', description: 'Verify transaction details and AI analysis.' },
  { title: 'Evidence & Documents', description: 'Upload supporting evidence and documentation.' },
  { title: 'AI Dispute Letter', description: 'Review AI-generated dispute letter.' },
  { title: 'Submit & Track', description: 'Submit dispute and monitor resolution.' },
];

const milestones = [
  { label: 'Dispute filed', date: 'Now', done: true },
  { label: 'Evidence reviewed', date: '24h', done: false },
  { label: 'Provisional credit', date: '48h', done: false },
  { label: 'Investigation complete', date: '10 days', done: false },
  { label: 'Resolution', date: '30 days', done: false },
];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function ProtectDispute() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const goNext = () => {
    if (currentStep === disputeSteps.length - 1) setSubmitted(true);
    else setCurrentStep((prev) => prev + 1);
  };
  const goBack = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const circumference = 2 * Math.PI * 40;
  const confidencePct = transaction.confidence / 100;

  return (
    <div className="relative min-h-screen w-full" style={{ background: '#0B1221' }}>
      <AuroraPulse color="var(--engine-protect)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-protect)', color: '#ffffff' }}
      >
        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"
        style={{ background: 'rgba(11,18,33,0.8)' }}
        aria-label="Breadcrumb"
      >
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link
            to="/protect"
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--engine-protect)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Protect
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Dispute Transaction</span>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5" style={{ color: 'var(--engine-protect)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-protect)' }}>
              Protect · Dispute
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dispute Transaction</h1>
          <p className="text-sm text-slate-400">
            Step {currentStep + 1} of {disputeSteps.length}: {disputeSteps[currentStep].title}
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Confidence', value: `${transaction.confidence}%`, color: 'var(--engine-protect)' },
              { label: 'Amount', value: transaction.amount, color: 'var(--engine-execute)' },
              { label: 'Success rate', value: '96%', color: 'var(--engine-dashboard)' },
              { label: 'SLA', value: '48h', color: 'var(--engine-govern)' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed */}
          <motion.div variants={fadeUp} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            {/* Progress stepper */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {disputeSteps.map((step, idx) => (
                <React.Fragment key={step.title}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap border ${idx === currentStep ? 'border-emerald-500/40 text-emerald-300' : idx < currentStep || submitted ? 'border-emerald-500/20 text-emerald-400' : 'border-white/10 text-white/40'}`}
                    style={idx === currentStep ? { background: 'rgba(34,197,94,0.1)' } : idx < currentStep || submitted ? { background: 'rgba(34,197,94,0.05)' } : { background: 'rgba(255,255,255,0.03)' }}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < currentStep || submitted ? 'bg-emerald-500 text-white' : idx === currentStep ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white/40'}`}>
                      {idx < currentStep || submitted ? '✓' : idx + 1}
                    </span>
                    <span className="hidden md:inline">{step.title}</span>
                  </div>
                  {idx < disputeSteps.length - 1 && (
                    <div className={`w-6 h-px shrink-0 ${idx < currentStep || submitted ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step 0: Review */}
            {!submitted && currentStep === 0 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6" style={{ borderLeftWidth: 2, borderLeftColor: 'var(--engine-protect)' }}>
                  <h4 className="text-sm font-semibold text-white mb-3">Transaction Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-white/40 block">Merchant</span><span className="text-white">{transaction.merchant}</span></div>
                    <div><span className="text-white/40 block">Amount</span><span className="text-white font-semibold">{transaction.amount}</span></div>
                    <div><span className="text-white/40 block">Date</span><span className="text-white">{transaction.date}</span></div>
                    <div><span className="text-white/40 block">Card</span><span className="text-white">{transaction.card}</span></div>
                    <div><span className="text-white/40 block">Category</span><span className="text-white">{transaction.category}</span></div>
                    <div><span className="text-white/40 block">AI confidence</span><span className="font-semibold" style={{ color: 'var(--engine-protect)' }}>{transaction.confidence}%</span></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
                  <h4 className="text-sm font-semibold text-white mb-3">AI Analysis — SHAP Factors</h4>
                  <div className="space-y-2">
                    {shapFactors.map((f) => (
                      <div key={f.label} className="flex items-center gap-2">
                        <span className={`text-[10px] w-4 ${f.value > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{f.value > 0 ? '+' : '-'}</span>
                        <span className="text-xs text-white/50 w-36 shrink-0">{f.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10">
                          <div className={`h-full rounded-full ${f.value > 0 ? 'bg-emerald-500/60' : 'bg-red-500/40'}`} style={{ width: `${Math.abs(f.value) * 100}%` }} />
                        </div>
                        <span className="text-xs text-white/40 w-10 text-right">{f.value > 0 ? '+' : ''}{f.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/30 mt-2">
                    Base value 0.50 → Prediction {(0.50 + shapFactors.reduce((s, f) => s + f.value, 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Evidence */}
            {!submitted && currentStep === 1 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Upload Evidence</h4>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
                    <p className="text-sm text-white/40">Drag & drop files or click to upload</p>
                    <p className="text-xs text-white/25 mt-1">PDF, PNG, JPG up to 10MB</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4" style={{ borderLeftWidth: 2, borderLeftColor: 'var(--engine-grow)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                      <span className="text-violet-400 text-sm">AI</span>
                    </div>
                    <div>
                      <p className="text-sm text-white">Suggested evidence: bank statement showing no authorization for this merchant.</p>
                      <p className="text-xs text-white/40 mt-1">AI-identified based on dispute pattern analysis.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Letter */}
            {!submitted && currentStep === 2 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
                <h4 className="text-sm font-semibold text-white mb-3">AI-Generated Dispute Letter</h4>
                <div className="rounded-lg bg-white/[0.02] border border-white/5 p-4 text-xs text-white/60 leading-relaxed font-mono">
                  <p>Dear Dispute Resolution Team,</p>
                  <p className="mt-2">{`I am writing to dispute a charge of ${transaction.amount} made on February 16, 2026, to ${transaction.merchant} on my card ending in ${transaction.card.replace('****', '')}. I did not authorize this transaction.`}</p>
                  <p className="mt-2">{`The AI analysis indicates this transaction has a ${transaction.confidence}% fraud confidence score based on merchant history anomaly, amount deviation (3x typical), and geographic mismatch.`}</p>
                  <p className="mt-2">I request that this charge be reversed and my account credited accordingly.</p>
                  <p className="mt-2">Sincerely,<br />Account Holder</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs font-medium hover:underline" style={{ color: 'var(--engine-protect)' }}>Regenerate</button>
                  <button className="text-xs text-white/40 hover:text-white/60">Edit manually</button>
                </div>
              </div>
            )}

            {/* Step 3: Summary */}
            {!submitted && currentStep === 3 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
                <h4 className="text-sm font-semibold text-white mb-3">Review Summary</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-white/50">Transaction</span><span className="text-white">{transaction.merchant} — {transaction.amount}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Evidence</span><span className="text-white">1 file uploaded</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Dispute letter</span><span className="text-emerald-400">AI-generated, reviewed</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Confidence</span><span style={{ color: 'var(--engine-protect)' }}>{transaction.confidence}%</span></div>
                </div>
              </div>
            )}

            {/* Submitted */}
            {submitted && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 md:p-8 text-center" style={{ borderLeftWidth: 2, borderLeftColor: 'var(--engine-protect)' }}>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Dispute Submitted Successfully</h3>
                  <p className="text-sm text-white/50 mt-2">Case DIS-2026-0216-001 has been filed and assigned to a reviewer.</p>
                  <p className="text-xs text-white/30 mt-3">SLA: 48h provisional credit · Investigation completes within 10 business days</p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Resolution Timeline</h4>
                  <div className="space-y-3">
                    {milestones.map((m) => (
                      <div key={m.label} className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.done ? 'bg-emerald-400' : 'bg-white/20'}`} />
                        <span className="text-xs text-white/70 flex-1">{m.label}</span>
                        <span className="text-xs text-white/40">{m.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link to="/protect" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-protect)' }}>← Back to Protect</Link>
              </div>
            )}

            {/* Navigation */}
            {!submitted && (
              <div className="flex justify-between mt-2">
                <button
                  onClick={goBack}
                  disabled={currentStep === 0}
                  className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${currentStep === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-white/70 bg-white/5 border border-white/10'}`}
                >
                  Back
                </button>
                <button
                  onClick={goNext}
                  className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: 'var(--engine-protect)' }}
                >
                  {currentStep === disputeSteps.length - 1 ? 'Submit Dispute' : 'Continue'}
                </button>
              </div>
            )}
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Dispute sidebar">
            {/* Confidence ring */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 flex flex-col items-center">
              <div className="relative" aria-label={`Fraud confidence: ${transaction.confidence}%`}>
                <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="40" fill="none" stroke="var(--engine-protect)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${confidencePct * circumference} ${circumference}`}
                    transform="rotate(-90 48 48)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{transaction.confidence}%</span>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-2">Fraud confidence</p>
              <p className="text-[10px] text-white/30">AI fraud detection score</p>
            </div>

            {/* Resolution timeline */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Resolution Timeline</h3>
              <div className="space-y-3">
                {milestones.map((m) => (
                  <div key={m.label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${m.done || submitted ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    <span className="text-xs text-white/70 flex-1">{m.label}</span>
                    <span className="text-xs text-white/40">{m.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispute stats */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Dispute Stats</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Avg resolution', value: '2.5 hours', color: 'text-white/70' },
                  { label: 'Success rate', value: '96%', color: 'text-emerald-400' },
                  { label: 'Overturn rate', value: '7%', color: 'text-white/70' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`text-xs font-medium ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/protect/dispute'].auditId} pageContext={GOVERNANCE_META['/protect/dispute'].pageContext} />
      </motion.div>
    </div>
  );
}

export default ProtectDispute;
