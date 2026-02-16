import React, { useState } from 'react';
import { Link } from '../router';
import { GovernContractSet } from '../components/GovernContractSet';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── mock data ────────────────────────────────────────────── */

const transaction = {
  merchant: 'MerchantX',
  amount: '$4,200.00',
  date: 'Feb 16, 2026 at 03:00 AM',
  card: '****4821',
  category: 'Electronics',
  confidence: 94,
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

/* ── component ────────────────────────────────────────────── */

export const ProtectDispute: React.FC = () => {
  const contract = getRouteScreenContract('protect-dispute');
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const goNext = () => {
    if (currentStep === disputeSteps.length - 1) {
      setSubmitted(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const goBack = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const milestones = [
    { label: 'Dispute filed', date: 'Now', status: 'completed' as const },
    { label: 'Evidence reviewed', date: '24h', status: submitted ? 'completed' as const : 'upcoming' as const },
    { label: 'Provisional credit', date: '48h', status: 'upcoming' as const },
    { label: 'Investigation complete', date: '10 days', status: 'upcoming' as const },
    { label: 'Resolution', date: '30 days', status: 'upcoming' as const },
  ];

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Progress Stepper */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {disputeSteps.map((step, idx) => (
          <React.Fragment key={step.title}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${idx === currentStep ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : idx < currentStep || submitted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < currentStep || submitted ? 'bg-emerald-500 text-white' : idx === currentStep ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/40'}`}>
                {idx < currentStep || submitted ? '\u2713' : idx + 1}
              </span>
              <span className="hidden md:inline">{step.title}</span>
            </div>
            {idx < disputeSteps.length - 1 && <div className={`w-6 h-px ${idx < currentStep || submitted ? 'bg-emerald-500/40' : 'bg-white/10'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {!submitted && currentStep === 0 && (
        <section className="space-y-4">
          <div className="engine-card border-l-2 border-teal-500/50">
            <h4 className="text-sm font-semibold text-white mb-3">Transaction Details</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-white/40 block">Merchant</span><span className="text-white">{transaction.merchant}</span></div>
              <div><span className="text-white/40 block">Amount</span><span className="text-white font-semibold">{transaction.amount}</span></div>
              <div><span className="text-white/40 block">Date</span><span className="text-white">{transaction.date}</span></div>
              <div><span className="text-white/40 block">Card</span><span className="text-white">{transaction.card}</span></div>
              <div><span className="text-white/40 block">Category</span><span className="text-white">{transaction.category}</span></div>
              <div><span className="text-white/40 block">AI confidence</span><span className="text-teal-400 font-semibold">{transaction.confidence}%</span></div>
            </div>
          </div>

          <div className="engine-card">
            <h4 className="text-sm font-semibold text-white mb-3">AI Analysis — SHAP Factors</h4>
            <div className="space-y-2">
              {shapFactors.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <span className={`text-[10px] w-4 ${f.value > 0 ? 'text-teal-400' : 'text-red-400'}`}>{f.value > 0 ? '+' : '-'}</span>
                  <span className="text-xs text-white/50 w-36 shrink-0">{f.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div className={`h-full rounded-full ${f.value > 0 ? 'bg-teal-500/60' : 'bg-red-500/40'}`} style={{ width: `${Math.abs(f.value) * 100}%` }} />
                  </div>
                  <span className="text-xs text-white/40 w-10 text-right">{f.value > 0 ? '+' : ''}{f.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/30 mt-2">Base value 0.50 → Prediction {(0.50 + shapFactors.reduce((s, f) => s + f.value, 0)).toFixed(2)}</p>
          </div>

          <ProofLine claim="Signal confidence 0.94" evidence="5 SHAP factors analyzed | FraudDetection v3.2" source="Protect engine" basis="per-transaction" sourceType="model" />
        </section>
      )}

      {!submitted && currentStep === 1 && (
        <section className="space-y-4">
          <div className="engine-card">
            <h4 className="text-sm font-semibold text-white mb-3">Upload Evidence</h4>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
              <p className="text-sm text-white/40">Drag & drop files or click to upload</p>
              <p className="text-xs text-white/25 mt-1">PDF, PNG, JPG up to 10MB</p>
            </div>
          </div>
          <div className="engine-card border-l-2 border-violet-500/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0"><span className="text-violet-400 text-sm">AI</span></div>
              <div><p className="text-sm text-white">Suggested evidence: bank statement showing no authorization for this merchant.</p><p className="text-xs text-white/40 mt-1">AI-identified based on dispute pattern analysis.</p></div>
            </div>
          </div>
        </section>
      )}

      {!submitted && currentStep === 2 && (
        <section className="space-y-4">
          <div className="engine-card">
            <h4 className="text-sm font-semibold text-white mb-3">AI-Generated Dispute Letter</h4>
            <div className="rounded-lg bg-white/[0.02] border border-white/5 p-4 text-xs text-white/60 leading-relaxed font-mono">
              <p>Dear Dispute Resolution Team,</p>
              <p className="mt-2">I am writing to dispute a charge of $4,200.00 made on February 16, 2026, to MerchantX on my card ending in 4821. I did not authorize this transaction.</p>
              <p className="mt-2">The AI analysis indicates this transaction has a 94% fraud confidence score based on merchant history anomaly, amount deviation (3x typical), and geographic mismatch.</p>
              <p className="mt-2">I request that this charge be reversed and my account credited accordingly.</p>
              <p className="mt-2">Sincerely,<br />Account Holder</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="text-xs text-teal-400 hover:underline">Regenerate</button>
              <button className="text-xs text-white/40 hover:text-white/60">Edit manually</button>
            </div>
          </div>
        </section>
      )}

      {!submitted && currentStep === 3 && (
        <section className="space-y-4">
          <div className="engine-card">
            <h4 className="text-sm font-semibold text-white mb-3">Review Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-white/50">Transaction</span><span className="text-white">{transaction.merchant} — {transaction.amount}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Evidence</span><span className="text-white">1 file uploaded</span></div>
              <div className="flex justify-between"><span className="text-white/50">Dispute letter</span><span className="text-emerald-400">AI-generated, reviewed</span></div>
              <div className="flex justify-between"><span className="text-white/50">Confidence</span><span className="text-teal-400">{transaction.confidence}%</span></div>
            </div>
          </div>
        </section>
      )}

      {submitted && (
        <section className="space-y-4">
          <div className="engine-card border-l-2 border-emerald-500/50 text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-emerald-400 text-xl font-bold">{'\u2713'}</span>
            </div>
            <h3 className="text-lg font-bold text-white">Dispute Submitted Successfully</h3>
            <p className="text-sm text-white/50 mt-2">Case DIS-2026-0216-001 has been filed and assigned to a reviewer.</p>
            <ProofLine claim="SLA: 48h provisional credit" evidence="Investigation completes within 10 business days | Full audit trail active" source="Dispute resolution" basis="per-case" sourceType="system" />
          </div>
          <div className="engine-card">
            <h4 className="text-sm font-semibold text-white mb-3">Tracking</h4>
            <MilestonesTimeline milestones={milestones} accentColor="var(--accent-teal)" />
          </div>
          <Link to="/protect" className="entry-btn entry-btn--ghost inline-block">Back to Protect</Link>
        </section>
      )}

      {/* Bottom Navigation */}
      {!submitted && (
        <div className="flex justify-between mt-6">
          <button onClick={goBack} disabled={currentStep === 0} className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${currentStep === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-white/70 bg-white/5 border border-white/10'}`}>Back</button>
          <button onClick={goNext} className="px-6 py-2.5 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors">
            {currentStep === disputeSteps.length - 1 ? 'Submit Dispute' : 'Continue'}
          </button>
        </div>
      )}

      <GovernContractSet auditId="GV-2026-0216-DIS1" modelVersion="DisputeFlow v1.0" explanationVersion="xai-1.1" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <>
      <article className="engine-card flex flex-col items-center">
        <ScoreRing score={transaction.confidence} maxScore={100} label="Fraud confidence" size="md" color="var(--accent-teal)" />
        <p className="text-xs text-white/40 mt-2">AI fraud detection score</p>
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Resolution Timeline</h4>
        <MilestonesTimeline milestones={milestones} accentColor="var(--accent-teal)" />
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Dispute Stats</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-white/50">Avg resolution</span><span className="text-white/70">2.5 hours</span></div>
          <div className="flex justify-between"><span className="text-white/50">Success rate</span><span className="text-emerald-400">96%</span></div>
          <div className="flex justify-between"><span className="text-white/50">Overturn rate</span><span className="text-white/70">7%</span></div>
        </div>
      </article>
    </>
  );

  return (
    <PageShell
      slug="protect"
      contract={contract}
      layout="engine"
      heroVariant="focused"
      hero={{
        kicker: 'Protect / Dispute',
        headline: 'Dispute Transaction',
        subline: `Step ${currentStep + 1} of ${disputeSteps.length}: ${disputeSteps[currentStep].title}`,
        proofLine: { claim: 'Human sovereignty', evidence: 'Every dispute gets human review | 48h provisional credit SLA', source: 'Governance policy' },
        freshness: new Date(),
        kpis: [
          { label: 'Confidence', value: `${transaction.confidence}%`, accent: 'teal', definition: 'AI fraud detection confidence' },
          { label: 'Amount', value: transaction.amount, accent: 'amber', definition: 'Disputed transaction amount' },
          { label: 'Success rate', value: '96%', accent: 'cyan', definition: 'Historical dispute success rate' },
          { label: 'SLA', value: '48h', accent: 'blue', definition: 'Provisional credit SLA' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default ProtectDispute;
