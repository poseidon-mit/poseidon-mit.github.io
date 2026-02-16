import React, { useState } from 'react';
import { Link } from '../router';
import { GovernContractSet } from '../components/GovernContractSet';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── types & data ─────────────────────────────────────────── */

const steps = [
  { title: 'Connect accounts', description: 'Link your financial accounts with read-only access.' },
  { title: 'Set preferences', description: 'Configure notification and privacy preferences.' },
  { title: 'Configure AI', description: 'Set autonomy levels and trust thresholds.' },
  { title: 'Review & go', description: 'Confirm settings and launch your dashboard.' },
];

const connectionTypes = [
  { type: 'Bank', icon: 'B', description: 'Checking & savings accounts', count: 0 },
  { type: 'Credit Card', icon: 'C', description: 'Credit cards & lines of credit', count: 0 },
  { type: 'Investment', icon: 'I', description: 'Brokerage & retirement accounts', count: 0 },
  { type: 'Wallet', icon: 'W', description: 'Digital wallets & crypto', count: 0 },
];

const connectedAccounts = [
  { name: 'Chase Checking ****4821', type: 'Bank', status: 'synced', lastSync: '2m ago' },
  { name: 'Amex Platinum ****1234', type: 'Credit Card', status: 'synced', lastSync: '5m ago' },
];

/* ── component ────────────────────────────────────────────── */

export const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const contract = getRouteScreenContract('onboarding', { onboardingStepIndex: currentStep });

  const goNext = () => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  const goBack = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Progress Stepper */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {steps.map((step, idx) => (
          <React.Fragment key={step.title}>
            <button onClick={() => setCurrentStep(idx)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${idx === currentStep ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : idx < currentStep ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx < currentStep ? 'bg-emerald-500 text-white' : idx === currentStep ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/40'}`}>
                {idx < currentStep ? '\u2713' : idx + 1}
              </span>
              <span className="hidden md:inline">{step.title}</span>
            </button>
            {idx < steps.length - 1 && <div className={`w-6 h-px ${idx < currentStep ? 'bg-emerald-500/40' : 'bg-white/10'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Connect Accounts */}
      {currentStep === 0 && (
        <>
          <section className="engine-section">
            <h3 className="text-lg font-bold text-white mb-2">Connect your first account</h3>
            <p className="text-sm text-white/50 mb-4">Choose an account type to begin. All connections use bank-grade encryption with read-only access.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {connectionTypes.map((ct) => (
                <button key={ct.type} className="engine-card text-left hover:bg-white/[0.06] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center shrink-0">
                      <span className="text-teal-400 font-semibold">{ct.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{ct.type}</h4>
                      <p className="text-xs text-white/40 mt-0.5">{ct.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-teal-500/5 border border-teal-500/10">
              <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <p className="text-xs text-teal-400/70">Bank-grade encryption. Read-only access. Disconnect anytime.</p>
            </div>
          </section>

          {/* Connected Accounts */}
          {connectedAccounts.length > 0 && (
            <section className="engine-section mt-4">
              <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Connected Accounts</h4>
              <div className="space-y-2">
                {connectedAccounts.map((acct) => (
                  <div key={acct.name} className="engine-card flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{acct.name}</p>
                      <p className="text-xs text-white/40">{acct.type} | Last sync: {acct.lastSync}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Synced</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Step 2: Preferences */}
      {currentStep === 1 && (
        <section className="engine-section">
          <h3 className="text-lg font-bold text-white mb-2">Set your preferences</h3>
          <div className="engine-card space-y-4">
            {[{ label: 'Protect alerts', desc: 'Real-time fraud and security notifications' },
              { label: 'Grow insights', desc: 'Savings opportunities and goal updates' },
              { label: 'Execute actions', desc: 'Action recommendations and approvals' },
              { label: 'Govern reviews', desc: 'Audit summaries and compliance updates' },
            ].map((pref, idx) => (
              <div key={pref.label} className="flex items-center justify-between">
                <div><p className="text-sm text-white">{pref.label}</p><p className="text-xs text-white/40">{pref.desc}</p></div>
                <button className={`w-9 h-5 rounded-full relative ${idx < 3 ? 'bg-teal-500' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${idx < 3 ? 'left-4' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
            <div>
              <span className="text-xs text-white/50 block mb-1">Email digest frequency</span>
              <select className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/70 focus:outline-none">
                <option>Daily</option><option>Weekly</option><option>Monthly</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Configure AI */}
      {currentStep === 2 && (
        <section className="engine-section">
          <h3 className="text-lg font-bold text-white mb-2">Configure AI behavior</h3>
          <div className="engine-card space-y-4">
            <div>
              <span className="text-xs text-white/50 block mb-2">Autonomy level</span>
              <div className="flex gap-2">
                {['Manual', 'Guided', 'Balanced'].map((level) => (
                  <button key={level} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${level === 'Guided' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>{level}</button>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-2">Guided: AI provides recommendations with explanations. You approve all actions.</p>
            </div>
            <div>
              <span className="text-xs text-white/50 block mb-1">Auto-approval confidence threshold</span>
              <input type="range" min={50} max={100} defaultValue={85} className="w-full accent-teal-500" />
              <div className="flex justify-between text-[10px] text-white/30"><span>50%</span><span>100%</span></div>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Review & Go */}
      {currentStep === 3 && (
        <section className="engine-section">
          <h3 className="text-lg font-bold text-white mb-2">Review & launch</h3>
          <div className="engine-card space-y-3">
            <div className="flex justify-between text-xs"><span className="text-white/50">Connected accounts</span><span className="text-white">{connectedAccounts.length}</span></div>
            <div className="flex justify-between text-xs"><span className="text-white/50">Notifications</span><span className="text-emerald-400">3 of 4 enabled</span></div>
            <div className="flex justify-between text-xs"><span className="text-white/50">Autonomy level</span><span className="text-teal-400">Guided</span></div>
            <div className="flex justify-between text-xs"><span className="text-white/50">Trust threshold</span><span className="text-white">85%</span></div>
          </div>
          <ProofLine claim="Setup complete" evidence="2 accounts connected | Guided autonomy | All policies active" source="Onboarding flow" basis="per-session" sourceType="system" />
        </section>
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-between mt-6">
        <button onClick={goBack} disabled={currentStep === 0} className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${currentStep === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-white/70 bg-white/5 border border-white/10'}`}>
          {currentStep === 0 ? 'Skip for now' : 'Back'}
        </button>
        {currentStep < steps.length - 1 ? (
          <button onClick={goNext} className="px-6 py-2.5 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors">Continue</button>
        ) : (
          <Link to="/dashboard" className="px-6 py-2.5 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors inline-flex items-center">Launch Dashboard</Link>
        )}
      </div>

      <GovernContractSet auditId="GV-2026-0216-ONBRD" modelVersion="OnboardFlow v1.0" explanationVersion="xai-1.0" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <article className="engine-card">
      <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Setup Progress</h4>
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={step.title} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${idx < currentStep ? 'bg-emerald-500 text-white' : idx === currentStep ? 'bg-teal-500 text-white' : 'bg-white/10 text-white/30'}`}>
              {idx < currentStep ? '\u2713' : idx + 1}
            </div>
            <span className={`text-xs ${idx === currentStep ? 'text-white' : idx < currentStep ? 'text-emerald-400/70' : 'text-white/30'}`}>{step.title}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex justify-between text-xs"><span className="text-white/50">Completion</span><span className="text-teal-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span></div>
      </div>
    </article>
  );

  return (
    <PageShell
      slug="onboarding"
      contract={contract}
      layout="engine"
      heroVariant="minimal"
      hero={{
        kicker: `Step ${currentStep + 1} of ${steps.length}`,
        headline: steps[currentStep].title,
        subline: steps[currentStep].description,
        proofLine: { claim: `${Math.round(((currentStep + 1) / steps.length) * 100)}% complete`, evidence: 'Bank-grade encryption | Read-only access | Governed flow', source: 'Onboarding system' },
        freshness: new Date(),
        kpis: [
          { label: 'Progress', value: `${Math.round(((currentStep + 1) / steps.length) * 100)}%`, accent: 'teal', definition: 'Setup completion progress' },
          { label: 'Accounts', value: `${connectedAccounts.length}`, accent: 'blue', definition: 'Connected financial accounts' },
          { label: 'Security', value: 'AES-256', accent: 'cyan', definition: 'Encryption standard' },
          { label: 'Access', value: 'Read-only', accent: 'amber', definition: 'Account access level' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default Onboarding;
