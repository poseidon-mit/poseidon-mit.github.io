import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { getMotionPreset } from '@/lib/motion-presets';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { Button, ButtonLink, Surface } from '@/design-system';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const transaction = {
  merchant: DEMO_THREAD.criticalAlert.merchant,
  amount: `$${DEMO_THREAD.criticalAlert.amount.toLocaleString()}.00`,
  date: 'Feb 16, 2026 at 03:00 AM',
  card: `****${DEMO_THREAD.criticalAlert.cardLast4}`,
  category: 'Electronics',
  confidence: Math.round(DEMO_THREAD.criticalAlert.confidence * 100)
};

const shapFactors = [
  { label: 'Merchant history', value: 0.82, direction: 'up' as const },
  { label: 'Amount deviation', value: 0.71, direction: 'up' as const },
  { label: 'Geographic mismatch', value: 0.65, direction: 'up' as const },
  { label: 'Time pattern', value: -0.12, direction: 'down' as const },
  { label: 'Account age', value: -0.08, direction: 'down' as const }];


const disputeSteps = [
  { title: 'Review Transaction', description: 'Verify transaction details and AI analysis.' },
  { title: 'Evidence & Documents', description: 'Upload supporting evidence and documentation.' },
  { title: 'AI Dispute Letter', description: 'Review AI-generated dispute letter.' },
  { title: 'Submit & Track', description: 'Submit dispute and monitor resolution.' }];


const milestones = [
  { label: 'Dispute filed', date: 'Now', done: true },
  { label: 'Evidence reviewed', date: '24h', done: false },
  { label: 'Provisional credit', date: '48h', done: false },
  { label: 'Investigation complete', date: '10 days', done: false },
  { label: 'Resolution', date: '30 days', done: false }];


/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function ProtectDispute() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: stagger } = getMotionPreset(prefersReducedMotion);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const goNext = () => {
    if (currentStep === disputeSteps.length - 1) setSubmitted(true); else
      setCurrentStep((prev) => prev + 1);
  };
  const goBack = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const circumference = 2 * Math.PI * 40;
  const confidencePct = transaction.confidence / 100;

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-protect)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-protect)', color: '#ffffff' }}>

        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"

        aria-label="Breadcrumb">

        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link
            to="/protect"
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--engine-protect)' }}>

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
        role="main">

        {/* Hero */}
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-protect)]/20 bg-[var(--engine-protect)]/10 text-[var(--engine-protect)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Shield className="h-3.5 w-3.5" /> Protect · Dispute
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Dispute Transaction
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">
            Step {currentStep + 1} of {disputeSteps.length}: <span className="text-white/80 font-medium tracking-wide">{disputeSteps[currentStep].title}</span>
          </p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUpVariant} className="mb-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { label: 'Confidence', value: `${transaction.confidence}%`, color: 'var(--engine-protect)' },
              { label: 'Amount', value: transaction.amount, color: 'var(--engine-execute)' },
              { label: 'Success rate', value: '96%', color: 'var(--state-healthy)' },
              { label: 'SLA', value: '48h', color: 'var(--engine-govern)' }].
              map((kpi) => <Surface
                key={kpi.label}
                className="relative overflow-hidden rounded-[24px] lg:rounded-[32px] p-5 lg:p-6 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl flex flex-col justify-center gap-1 group transition-all hover:bg-white/[0.02]"
                padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <p className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white/40">{kpi.label}</p>
                <p className="text-2xl md:text-3xl font-light font-mono" style={{ color: kpi.color, textShadow: `0 0 20px ${kpi.color}40` }}>{kpi.value}</p>
              </Surface>
              )}
          </div>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main feed */}
          <motion.div variants={fadeUpVariant} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-6">
            {/* Progress stepper */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none rounded-[24px] border border-white/[0.08] backdrop-blur-xl bg-black/40 p-2 shadow-inner">
              {disputeSteps.map((step, idx) =>
                <React.Fragment key={step.title}>
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-[16px] text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${idx === currentStep ? 'shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : idx < currentStep || submitted ? 'bg-emerald-500/5 border border-emerald-500/10 text-emerald-500/70' : 'bg-white/[0.02] border border-white/[0.05] text-white/40'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-inner ${idx < currentStep || submitted ? 'bg-emerald-500/80 text-white' : idx === currentStep ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10 text-white/40'}`}>
                      {idx < currentStep || submitted ? '✓' : idx + 1}
                    </span>
                    <span className={idx === currentStep ? "text-emerald-400" : idx < currentStep || submitted ? "text-emerald-500/70" : "text-white/40"}>{step.title}</span>
                  </div>
                  {idx < disputeSteps.length - 1 &&
                    <div className={`w-6 h-px shrink-0 ${idx < currentStep || submitted ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
                  }
                </React.Fragment>
              )}
            </div>

            {/* Step 0: Review */}
            {!submitted && currentStep === 0 &&
              <div className="flex flex-col gap-6">
                <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--engine-protect)] shadow-[0_0_15px_var(--engine-protect)]" />
                  <div className="relative z-10">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6">Transaction Details</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                      <div className="flex flex-col gap-1.5"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Merchant</span><span className="text-base text-white/90 font-medium tracking-wide">{transaction.merchant}</span></div>
                      <div className="flex flex-col gap-1.5"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Amount</span><span className="text-xl font-mono text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]">{transaction.amount}</span></div>
                      <div className="flex flex-col gap-1.5"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Date</span><span className="text-base text-white/80">{transaction.date}</span></div>
                      <div className="flex flex-col gap-1.5"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Card</span><span className="text-base font-mono text-white/80">{transaction.card}</span></div>
                      <div className="flex flex-col gap-1.5"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">Category</span><span className="text-base text-white/80">{transaction.category}</span></div>
                      <div className="flex flex-col gap-1.5"><span className="text-xs uppercase tracking-widest text-white/40 font-semibold">AI confidence</span><span className="text-xl font-bold font-mono drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" style={{ color: 'var(--engine-protect)' }}>{transaction.confidence}%</span></div>
                    </div>
                  </div>
                </Surface>

                <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="border-b border-white/[0.06] pb-4">
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">AI Analysis</h4>
                      <p className="text-sm font-medium text-white/80 tracking-wide">SHAP feature contribution</p>
                    </div>
                    <div className="space-y-4">
                      {shapFactors.map((f) =>
                        <div key={f.label} className="flex items-center gap-4 text-xs font-medium tracking-wide">
                          <span className={`w-4 text-center font-bold font-mono text-lg leading-none ${f.value > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{f.value > 0 ? '+' : '-'}</span>
                          <span className="text-white/70 w-36 shrink-0">{f.label}</span>
                          <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden shadow-inner">
                            <div className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: `${Math.abs(f.value) * 100}%`, background: f.value > 0 ? 'var(--state-critical)' : 'var(--state-healthy)' }} />
                          </div>
                          <span className="font-mono text-white/60 w-12 text-right">{f.value > 0 ? '+' : ''}{f.value.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 shadow-inner mt-2">
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Base value 0.50</span>
                      <span className="text-sm font-mono font-bold text-white/90 text-right">Prediction {(0.50 + shapFactors.reduce((s, f) => s + f.value, 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </Surface>
              </div>
            }

            {/* Step 1: Evidence */}
            {!submitted && currentStep === 1 &&
              <div className="flex flex-col gap-6">
                <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6">Upload Evidence</h4>
                    <div className="border border-dashed border-white/20 rounded-[24px] p-10 md:p-14 text-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                        <span className="text-xl text-white/60">+</span>
                      </div>
                      <p className="text-base font-medium tracking-wide text-white/80">Drag & drop files or click to upload</p>
                      <p className="text-xs font-mono text-white/40 mt-2 tracking-widest">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </Surface>
                <Surface className="relative overflow-hidden rounded-[24px] p-6 border border-emerald-500/30 backdrop-blur-3xl bg-black/60 shadow-[0_0_30px_rgba(16,185,129,0.1)]" padding="none">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <span className="text-emerald-400 text-sm font-bold font-mono tracking-widest">AI</span>
                    </div>
                    <div className="flex flex-col gap-1 mt-0.5">
                      <p className="text-sm font-medium tracking-wide text-white/90 leading-relaxed">Suggested evidence: <span className="text-emerald-300">bank statement showing no authorization for this merchant</span>.</p>
                      <p className="text-xs font-mono text-emerald-500/70 tracking-wide mt-1">AI-identified based on dispute pattern analysis.</p>
                    </div>
                  </div>
                </Surface>
              </div>
            }

            {/* Step 2: Letter */}
            {!submitted && currentStep === 2 && <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6">AI-Generated Dispute Letter</h4>
                <div className="rounded-[24px] bg-white/[0.02] border border-white/[0.05] p-6 text-sm text-white/70 leading-loose font-mono tracking-wide shadow-inner">
                  <p>Dear Dispute Resolution Team,</p>
                  <p className="mt-4">{`I am writing to dispute a charge of `}<span className="text-red-400 font-bold bg-red-400/10 px-1 rounded">{transaction.amount}</span>{` made on `}<span className="text-white/90">February 16, 2026</span>{`, to `}<span className="text-white/90 font-bold">{transaction.merchant}</span>{` on my card ending in ${transaction.card.replace('****', '')}. I did not authorize this transaction.`}</p>
                  <p className="mt-4">{`The AI analysis indicates this transaction has a `}<span className="text-red-400 font-bold bg-red-400/10 px-1 rounded">{transaction.confidence}% fraud confidence score</span>{` based on merchant history anomaly, amount deviation (3x typical), and geographic mismatch.`}</p>
                  <p className="mt-4">I request that this charge be reversed and my account credited accordingly.</p>
                  <p className="mt-4">Sincerely,<br />Account Holder</p>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button variant="ghost" engine="protect" size="sm" className="font-semibold tracking-wide bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] rounded-xl px-6 h-10">Regenerate</Button>
                  <Button variant="ghost" engine="protect" size="sm" className="font-medium tracking-wide text-white/50 hover:text-white/90 h-10 px-4">Edit manually</Button>
                </div>
              </div>
            </Surface>
            }

            {/* Step 3: Summary */}
            {!submitted && currentStep === 3 && <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6">Review Summary</h4>
                <div className="space-y-4 text-sm font-medium tracking-wide bg-white/[0.02] border border-white/[0.05] rounded-[24px] p-6 shadow-inner">
                  <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]"><span className="text-white/50">Transaction</span><span className="text-white/90 font-mono bg-white/[0.05] px-2 py-1 rounded-lg border border-white/[0.05]">{transaction.merchant} — <span className="text-red-400">{transaction.amount}</span></span></div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]"><span className="text-white/50">Evidence</span><span className="text-white/90">1 file uploaded</span></div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]"><span className="text-white/50">Dispute letter</span><span className="text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> AI-generated, reviewed</span></div>
                  <div className="flex justify-between items-center"><span className="text-white/50">AI Confidence</span><span className="font-mono font-bold text-lg drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" style={{ color: 'var(--engine-protect)' }}>{transaction.confidence}%</span></div>
                </div>
              </div>
            </Surface>
            }

            {/* Submitted */}
            {submitted &&
              <div className="flex flex-col gap-6">
                <div className="rounded-[32px] border border-emerald-500/30 bg-emerald-500/10 p-8 md:p-12 text-center shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
                  <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400 drop-shadow-[0_0_10px_currentColor]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-light tracking-wide text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>Dispute Submitted Successfully</h3>
                    <p className="text-base text-white/70 leading-relaxed tracking-wide">Case <span className="font-mono text-emerald-300 font-bold tracking-widest bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">DIS-2026-0216-001</span> has been filed and assigned to a reviewer.</p>
                    <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-4 w-full text-left flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <span className="text-emerald-400 text-sm font-bold font-mono tracking-widest">SLA</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium tracking-wide text-white/90">48h provisional credit</span>
                        <span className="text-xs text-white/50 tracking-wide font-mono">Investigation completes within 10 days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <ButtonLink to="/protect" variant="ghost" engine="protect" size="lg" className="w-fit self-center font-bold tracking-widest uppercase text-sm bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-2xl px-8 h-12 shadow-lg backdrop-blur-md">← Back to Protect</ButtonLink>
              </div>
            }

            {/* Navigation */}
            {!submitted &&
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/[0.06]">
                <Button
                  onClick={goBack}
                  disabled={currentStep === 0}
                  variant="ghost"
                  engine="protect"
                  size="lg"
                  className={`rounded-2xl font-semibold tracking-wide border border-transparent h-12 px-8 ${currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/[0.05] border-white/10 shadow-lg backdrop-blur-md text-white/80'}`}>

                  Back
                </Button>
                <Button
                  onClick={goNext}
                  variant="primary"
                  engine="protect"
                  size="lg"
                  className="rounded-2xl font-bold tracking-wide h-12 px-10 shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_50px_rgba(239,68,68,0.4)] transition-shadow">

                  {currentStep === disputeSteps.length - 1 ? 'Submit Dispute' : 'Continue'}
                </Button>
              </div>
            }
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Dispute sidebar">
            {/* Confidence ring */}
            <Surface className="relative overflow-hidden rounded-[32px] flex flex-col items-center justify-center p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
              <h3 className="w-full text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6 relative z-10 text-left">Confidence Score</h3>
              <div className="relative z-10 my-4" aria-label={`Fraud confidence: ${transaction.confidence}%`}>
                <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true" className="drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle
                    cx="70" cy="70" r="60" fill="none" stroke="var(--engine-protect)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${confidencePct * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dasharray 1s ease-in-out' }} />

                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-light font-mono text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{transaction.confidence}<span className="text-xl text-white/50">%</span></span>
                </div>
              </div>
              <p className="text-sm font-medium tracking-wide text-white/80 mt-4 relative z-10">AI Fraud Assessment</p>
              <p className="text-xs font-mono text-[var(--engine-protect)] font-bold tracking-widest mt-1 drop-shadow-[0_0_5px_currentColor] relative z-10 uppercase">Critical Risk</p>
            </Surface>

            {/* Resolution timeline */}
            {!submitted &&
              <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--engine-protect)]/5 to-transparent pointer-events-none" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6 relative z-10">Resolution Timeline</h3>
                <div className="relative z-10 space-y-6">
                  {milestones.map((m, idx) =>
                    <div key={m.label} className="flex items-center gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full shrink-0 border z-10 transition-all duration-300 ${m.done || submitted ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-black/50 border-white/20'}`}>
                          {(m.done || submitted) && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full m-auto mt-0.5 shadow-[0_0_5px_currentColor]" />}
                        </div>
                        {idx < milestones.length - 1 && <div className={`w-0.5 h-6 -mb-6 mt-1 rounded-full ${m.done || submitted ? 'bg-emerald-500/30' : 'bg-white/10'}`} aria-hidden="true" />}
                      </div>
                      <div className="flex items-center justify-between flex-1 pb-1">
                        <span className={`text-sm font-medium tracking-wide transition-colors ${m.done || submitted ? 'text-white/90' : 'text-white/50 group-hover:text-white/70'}`}>{m.label}</span>
                        <span className="text-xs font-mono font-bold tracking-widest text-white/30">{m.date}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Surface>}

            {/* Dispute stats */}
            <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6 relative z-10">Historical Data</h3>
              <div className="relative z-10 space-y-4">
                {[
                  { label: 'Avg resolution', value: '2.5 hours', color: 'text-white/90' },
                  { label: 'Success rate', value: '96%', color: 'text-emerald-400 drop-shadow-[0_0_8px_currentColor]' },
                  { label: 'Overturn rate', value: '7%', color: 'text-white/70' }].
                  map((row, i) =>
                    <div key={row.label} className={`flex justify-between items-center py-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 shadow-inner`}>
                      <span className="text-xs font-semibold uppercase tracking-widest text-white/50">{row.label}</span>
                      <span className={`text-base font-bold font-mono ${row.color}`}>{row.value}</span>
                    </div>
                  )}
              </div>
            </Surface>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/protect/dispute'].auditId} pageContext={GOVERNANCE_META['/protect/dispute'].pageContext} />
      </motion.div>
    </div>);

}

export default ProtectDispute;
