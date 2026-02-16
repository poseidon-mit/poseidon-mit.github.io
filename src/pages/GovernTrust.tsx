import React, { useState } from 'react';
import { CategoryScoreBar } from '../components/CategoryScoreBar';
import { GovernContractSet } from '../components/GovernContractSet';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── mock data ────────────────────────────────────────────── */

interface EngineCard {
  engine: string;
  color: string;
  trustScore: number;
  riskTolerance: number;
  autoApproval: number;
  toggles: Array<{ label: string; enabled: boolean }>;
}

const engineCards: EngineCard[] = [
  { engine: 'Protect', color: 'var(--accent-teal)', trustScore: 94, riskTolerance: 30, autoApproval: 85, toggles: [{ label: 'Auto-block suspicious', enabled: true }, { label: 'Real-time alerts', enabled: true }] },
  { engine: 'Grow', color: 'var(--accent-violet)', trustScore: 89, riskTolerance: 55, autoApproval: 70, toggles: [{ label: 'Auto-save rules', enabled: true }, { label: 'Goal tracking', enabled: true }] },
  { engine: 'Execute', color: 'var(--engine-execute)', trustScore: 91, riskTolerance: 40, autoApproval: 80, toggles: [{ label: 'Low-risk auto-execute', enabled: false }, { label: 'Bill negotiation', enabled: true }] },
  { engine: 'Govern', color: 'var(--accent-blue)', trustScore: 97, riskTolerance: 20, autoApproval: 95, toggles: [{ label: 'Auto-audit logging', enabled: true }, { label: 'Policy enforcement', enabled: true }] },
];

/* ── component ────────────────────────────────────────────── */

export const GovernTrust: React.FC = () => {
  const contract = getRouteScreenContract('govern-trust');
  const [cards, setCards] = useState(engineCards);
  const [dirty, setDirty] = useState(false);

  const updateSlider = (idx: number, field: 'riskTolerance' | 'autoApproval', value: number) => {
    setCards((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
    setDirty(true);
  };

  const toggleSwitch = (cardIdx: number, toggleIdx: number) => {
    setCards((prev) => prev.map((c, ci) => ci === cardIdx ? { ...c, toggles: c.toggles.map((t, ti) => ti === toggleIdx ? { ...t, enabled: !t.enabled } : t) } : c));
    setDirty(true);
  };

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Global Trust */}
      <section className="engine-section">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">System Trust Score</h3>
        <div className="engine-card flex flex-col items-center py-6">
          <ScoreRing score={92} maxScore={100} label="System Trust" size="lg" color="var(--accent-blue)" />
          <p className="text-xs text-white/40 mt-3">Weighted composite across all 4 engines</p>
        </div>
        <div className="mt-4">
          <CategoryScoreBar categories={[
            { label: 'Protect', score: 94, color: 'var(--accent-teal)' },
            { label: 'Grow', score: 89, color: 'var(--accent-violet)' },
            { label: 'Execute', score: 91, color: 'var(--accent-gold)' },
            { label: 'Govern', score: 97, color: 'var(--accent-blue)' },
          ]} />
        </div>
        <ProofLine claim="System trust 92/100" evidence="Per-engine trust scores: Protect 94, Grow 89, Execute 91, Govern 97" source="Trust engine" basis="real-time composite" sourceType="model" />
      </section>

      {/* Per-Engine Cards */}
      <section className="engine-section">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Per-Engine Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, idx) => (
            <div key={card.engine} className="engine-card" style={{ borderLeftWidth: 2, borderLeftColor: card.color }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-white">{card.engine}</h4>
                <ScoreRing score={card.trustScore} maxScore={100} label="" size="sm" color={card.color} />
              </div>

              {/* Risk tolerance slider */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Risk tolerance</span>
                  <span className="text-white/70">{card.riskTolerance}%</span>
                </div>
                <input type="range" min={0} max={100} value={card.riskTolerance} onChange={(e) => updateSlider(idx, 'riskTolerance', Number(e.target.value))} className="w-full accent-blue-500" />
              </div>

              {/* Auto-approval threshold slider */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Auto-approval threshold</span>
                  <span className="text-white/70">{card.autoApproval}%</span>
                </div>
                <input type="range" min={50} max={100} value={card.autoApproval} onChange={(e) => updateSlider(idx, 'autoApproval', Number(e.target.value))} className="w-full accent-blue-500" />
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                {card.toggles.map((toggle, ti) => (
                  <div key={toggle.label} className="flex items-center justify-between">
                    <span className="text-xs text-white/50">{toggle.label}</span>
                    <button onClick={() => toggleSwitch(idx, ti)} className={`w-9 h-5 rounded-full transition-colors relative ${toggle.enabled ? 'bg-blue-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${toggle.enabled ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Bar */}
      <div className="flex gap-3">
        <button disabled={!dirty} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${dirty ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>Save changes</button>
        <button disabled={!dirty} onClick={() => { setCards(engineCards); setDirty(false); }} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 transition-colors">Reset to defaults</button>
      </div>

      <GovernContractSet auditId="GV-2026-0216-TRUST" modelVersion="TrustComposite v2.0" explanationVersion="xai-1.1" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <>
      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Trust Trend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-white/50">30d avg</span><span className="text-white/70">91.4</span></div>
          <div className="flex justify-between"><span className="text-white/50">90d avg</span><span className="text-white/70">89.8</span></div>
          <div className="flex justify-between"><span className="text-white/50">All-time high</span><span className="text-emerald-400">92</span></div>
          <div className="flex justify-between"><span className="text-white/50">Trend</span><span className="text-emerald-400">Improving</span></div>
        </div>
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Policy Notes</h4>
        <p className="text-xs text-white/40">Trust scores are recalculated every 15 minutes based on accuracy, transparency, fairness, and compliance metrics. Changes to thresholds are logged in the audit ledger.</p>
      </article>
    </>
  );

  return (
    <PageShell
      slug="govern"
      contract={contract}
      layout="engine"
      heroVariant="analytical"
      hero={{
        kicker: 'Trust Dashboard',
        headline: 'Per-engine trust scores, threshold configuration, and auto-approval settings.',
        subline: 'System trust score: 92/100 across all engines.',
        proofLine: { claim: 'System trust 92/100', evidence: '4 engines monitored | All above threshold', source: 'Trust engine' },
        freshness: new Date(Date.now() - 15 * 60 * 1000),
        kpis: [
          { label: 'System trust', value: '92', accent: 'blue', definition: 'Weighted composite trust score' },
          { label: 'Protect', value: '94', accent: 'teal', definition: 'Protect engine trust score' },
          { label: 'Execute', value: '91', accent: 'amber', definition: 'Execute engine trust score' },
          { label: 'Govern', value: '97', accent: 'cyan', definition: 'Govern engine trust score' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default GovernTrust;
