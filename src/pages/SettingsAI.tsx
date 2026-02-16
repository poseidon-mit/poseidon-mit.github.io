import React, { useState } from 'react';
import { GovernContractSet } from '../components/GovernContractSet';
import { PageShell } from '../components/PageShell';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

/* ── types & data ─────────────────────────────────────────── */

const autonomyStops = ['Manual', 'Guided', 'Balanced', 'Delegated', 'Autonomous'] as const;
type AutonomyLevel = (typeof autonomyStops)[number];

interface EngineAutonomy { engine: string; color: string; level: number; autoActions: boolean; confirmThreshold: number }

const defaultEngines: EngineAutonomy[] = [
  { engine: 'Protect', color: 'var(--accent-teal)', level: 3, autoActions: true, confirmThreshold: 85 },
  { engine: 'Grow', color: 'var(--accent-violet)', level: 2, autoActions: true, confirmThreshold: 70 },
  { engine: 'Execute', color: 'var(--engine-execute)', level: 2, autoActions: false, confirmThreshold: 80 },
  { engine: 'Govern', color: 'var(--accent-blue)', level: 4, autoActions: true, confirmThreshold: 90 },
];

type Verbosity = 'Minimal' | 'Standard' | 'Detailed' | 'Technical';

/* ── component ────────────────────────────────────────────── */

export const SettingsAI: React.FC = () => {
  const contract = getRouteScreenContract('settings-ai');
  const [globalLevel, setGlobalLevel] = useState(2);
  const [engines, setEngines] = useState(defaultEngines);
  const [verbosity, setVerbosity] = useState<Verbosity>('Standard');
  const [showConfidence, setShowConfidence] = useState(true);
  const [showSHAP, setShowSHAP] = useState(true);
  const [showAuditLinks, setShowAuditLinks] = useState(true);
  const [dirty, setDirty] = useState(false);

  const mark = () => setDirty(true);

  const updateEngine = (idx: number, field: keyof EngineAutonomy, value: unknown) => {
    setEngines((prev) => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));
    mark();
  };

  /* ── primary feed ───────────────────────────────────────── */
  const primaryFeed = (
    <>
      {/* Global Autonomy Slider */}
      <section className="engine-section">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Global Autonomy Level</h3>
        <div className="engine-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/50">Master control</span>
            <span className="text-sm font-semibold text-white">{autonomyStops[globalLevel]}</span>
          </div>
          <input type="range" min={0} max={4} step={1} value={globalLevel} onChange={(e) => { setGlobalLevel(Number(e.target.value)); mark(); }} className="w-full accent-blue-500" />
          <div className="flex justify-between mt-1">
            {autonomyStops.map((stop, i) => (
              <span key={stop} className={`text-[9px] ${i === globalLevel ? 'text-white' : 'text-white/30'}`}>{stop}</span>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-3">
            {globalLevel === 0 && 'AI suggests only. You decide and execute everything manually.'}
            {globalLevel === 1 && 'AI provides guided recommendations with explanations. You approve all actions.'}
            {globalLevel === 2 && 'AI handles routine low-risk decisions. Medium and high-risk require approval.'}
            {globalLevel === 3 && 'AI executes most decisions autonomously. Only high-risk actions need approval.'}
            {globalLevel === 4 && 'AI operates fully within your guardrails. Emergency escalation only.'}
          </p>
        </div>
      </section>

      {/* Per-Engine Cards */}
      <section className="engine-section">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Per-Engine Autonomy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {engines.map((eng, idx) => (
            <div key={eng.engine} className="engine-card" style={{ borderLeftWidth: 2, borderLeftColor: eng.color }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">{eng.engine}</h4>
                <ScoreRing score={eng.level * 25} maxScore={100} label="" size="sm" color={eng.color} />
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Autonomy: {autonomyStops[eng.level]}</span>
                </div>
                <input type="range" min={0} max={4} step={1} value={eng.level} onChange={(e) => updateEngine(idx, 'level', Number(e.target.value))} className="w-full" style={{ accentColor: eng.color }} />
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">Confirm threshold</span>
                  <span className="text-white/70">{eng.confirmThreshold}%</span>
                </div>
                <input type="range" min={50} max={100} value={eng.confirmThreshold} onChange={(e) => updateEngine(idx, 'confirmThreshold', Number(e.target.value))} className="w-full" style={{ accentColor: eng.color }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Automated actions</span>
                <button onClick={() => updateEngine(idx, 'autoActions', !eng.autoActions)} className={`w-9 h-5 rounded-full transition-colors relative ${eng.autoActions ? 'bg-blue-500' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${eng.autoActions ? 'left-4' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explanation Preferences */}
      <section className="engine-section">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Explanation Preferences</h3>
        <div className="engine-card space-y-4">
          <div>
            <span className="text-xs text-white/50 uppercase tracking-wider block mb-2">Verbosity Level</span>
            <div className="flex gap-2">
              {(['Minimal', 'Standard', 'Detailed', 'Technical'] as Verbosity[]).map((v) => (
                <button key={v} onClick={() => { setVerbosity(v); mark(); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${verbosity === v ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'}`}>{v}</button>
              ))}
            </div>
          </div>

          {[{ label: 'Show confidence scores', value: showConfidence, set: setShowConfidence },
            { label: 'Show SHAP factors', value: showSHAP, set: setShowSHAP },
            { label: 'Show audit links', value: showAuditLinks, set: setShowAuditLinks },
          ].map(({ label, value, set }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-white/50">{label}</span>
              <button onClick={() => { set(!value); mark(); }} className={`w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-blue-500' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'left-4' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Save Bar */}
      <div className="flex gap-3">
        <button disabled={!dirty} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${dirty ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>Save</button>
        <button disabled={!dirty} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 transition-colors">Discard</button>
        <button onClick={() => { setEngines(defaultEngines); setGlobalLevel(2); setVerbosity('Standard'); setDirty(false); }} className="px-4 py-2.5 rounded-lg text-white/30 text-sm hover:text-white/50 transition-colors">Reset to defaults</button>
      </div>

      <ProofLine claim={`Global autonomy: ${autonomyStops[globalLevel]}`} evidence="All changes audit-logged | Fail-closed defaults preserved" source="AI policy engine" basis="real-time" sourceType="policy" />

      <GovernContractSet auditId="GV-2026-0216-AISET" modelVersion="PolicyEngine v2.0" explanationVersion="xai-1.1" />
    </>
  );

  /* ── decision rail ──────────────────────────────────────── */
  const decisionRail = (
    <>
      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Current Profile</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-white/50">Global level</span><span className="text-white/70">{autonomyStops[globalLevel]}</span></div>
          <div className="flex justify-between"><span className="text-white/50">Verbosity</span><span className="text-white/70">{verbosity}</span></div>
          <div className="flex justify-between"><span className="text-white/50">Overrides (30d)</span><span className="text-white/70">2</span></div>
          <div className="flex justify-between"><span className="text-white/50">Auto-executed (30d)</span><span className="text-emerald-400">18</span></div>
          <div className="flex justify-between"><span className="text-white/50">Accuracy</span><span className="text-emerald-400">96%</span></div>
        </div>
      </article>

      <article className="engine-card">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Guidelines</h4>
        <p className="text-xs text-white/40">Higher autonomy levels reduce manual approval burden but increase the importance of trust thresholds and guardrails. All automated actions are audit-logged and reversible within 24 hours.</p>
      </article>
    </>
  );

  return (
    <PageShell
      slug="settings"
      contract={contract}
      layout="engine"
      heroVariant="editorial"
      hero={{
        kicker: 'AI Configuration',
        headline: 'Control autonomy levels, explanation preferences, and model behavior.',
        subline: `Current: ${autonomyStops[globalLevel]} mode across 4 engines.`,
        proofLine: { claim: `Autonomy: ${autonomyStops[globalLevel]}`, evidence: 'All changes audit-logged | Fail-closed defaults', source: 'AI policy engine' },
        freshness: new Date(Date.now() - 30 * 60 * 1000),
        kpis: [
          { label: 'Global level', value: autonomyStops[globalLevel], accent: 'amber', definition: 'Current AI autonomy level' },
          { label: 'Risk threshold', value: '0.90', accent: 'teal', definition: 'Minimum confidence for auto-execution' },
          { label: 'Overrides', value: '2', accent: 'cyan', definition: 'Manual overrides in last 30 days' },
          { label: 'Accuracy', value: '96%', accent: 'blue', definition: 'AI recommendation accuracy (30d)' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default SettingsAI;
