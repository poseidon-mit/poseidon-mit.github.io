import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Shield, TrendingUp, Zap, Scale, Save, RotateCcw } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets'

const autonomyLabels = ['Manual', 'Guided', 'Balanced', 'Delegated', 'Autonomous'];
const autonomyDescriptions = [
  'All actions require explicit manual approval. AI provides no suggestions.',
  'AI provides recommendations but every action requires your approval.',
  'AI handles low-risk actions automatically. High-risk actions require approval.',
  'AI handles most actions. Only critical decisions need your input.',
  'AI operates fully independently with post-action notifications only.',
];

const engines = [
  { name: 'Protect', color: 'var(--engine-protect)', icon: Shield, autonomy: 80, autoApprove: true, notify: true, minConf: 0.85 },
  { name: 'Grow', color: 'var(--engine-grow)', icon: TrendingUp, autonomy: 60, autoApprove: false, notify: true, minConf: 0.80 },
  { name: 'Execute', color: 'var(--engine-execute)', icon: Zap, autonomy: 55, autoApprove: false, notify: true, minConf: 0.90 },
  { name: 'Govern', color: 'var(--engine-govern)', icon: Scale, autonomy: 75, autoApprove: true, notify: false, minConf: 0.85 },
];

export function SettingsAI() {
  const [globalAutonomy, setGlobalAutonomy] = useState(65);
  const [engineStates, setEngineStates] = useState(
    engines.map((e) => ({ autonomy: e.autonomy, autoApprove: e.autoApprove, notify: e.notify, minConf: e.minConf }))
  );
  const [verbosity, setVerbosity] = useState<'Minimal' | 'Standard' | 'Detailed' | 'Technical'>('Standard');
  const [showConf, setShowConf] = useState(true);
  const [showShap, setShowShap] = useState(true);
  const [showAudit, setShowAudit] = useState(true);
  const [language, setLanguage] = useState('English');
  const [dirty, setDirty] = useState(false);

  const autonomyIndex = Math.min(4, Math.floor(globalAutonomy / 20));

  const updateEngine = (idx: number, updates: Partial<typeof engineStates[0]>) => {
    setEngineStates((prev) => prev.map((s, i) => (i === idx ? { ...s, ...updates } : s)));
    setDirty(true);
  };

  return (
    <div className="min-h-screen w-full">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: '#94A3B8', color: '#fff' }}>Skip to main content</a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(11,18,33,0.8)' }} aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/settings" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#94A3B8' }}>
            <ArrowLeft className="h-4 w-4" />Settings
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">AI Configuration</span>
        </div>
      </nav>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: '1280px' }} variants={stagger} initial="hidden" animate="visible" role="main">
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(148,163,184,0.15)' }}>
              <Brain className="h-4 w-4" style={{ color: '#94A3B8' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#94A3B8' }}>Settings · AI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">AI Configuration</h1>
          <p className="text-sm text-slate-400">Control autonomy levels, explanation preferences, and per-engine model behavior.</p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Global autonomy', value: `${globalAutonomy}%`, color: 'var(--engine-grow)' },
              { label: 'Auto-approvals', value: '47', color: 'var(--engine-protect)' },
              { label: 'Overrides', value: '3', color: 'var(--engine-execute)' },
              { label: 'Explanation level', value: verbosity, color: 'var(--engine-dashboard)' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Global autonomy */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Global Autonomy Level</h2>
            <span className="text-lg font-bold" style={{ color: 'var(--engine-grow)' }}>{globalAutonomy}%</span>
          </div>
          <label htmlFor="settings-ai-global-autonomy" className="sr-only">Global autonomy level</label>
          <input id="settings-ai-global-autonomy" type="range" min={0} max={100} value={globalAutonomy} onChange={(e) => { setGlobalAutonomy(Number(e.target.value)); setDirty(true); }} className="w-full accent-violet-500 cursor-pointer" />
          <div className="flex justify-between mt-2">
            {autonomyLabels.map((l) => (
              <span key={l} className="text-[10px] text-white/30">{l}</span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--engine-grow)' }}>{autonomyLabels[autonomyIndex]}</span>
          </div>
          <p className="text-xs text-white/40 mt-2">{autonomyDescriptions[autonomyIndex]}</p>
        </motion.div>

        {/* Per-engine autonomy */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engines.map((engine, idx) => (
              <div key={engine.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6" style={{ borderLeftWidth: 3, borderLeftColor: engine.color }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${engine.color}20` }}>
                    <engine.icon className="h-3.5 w-3.5" style={{ color: engine.color }} />
                  </div>
                  <span className="text-sm font-semibold text-white">{engine.name}</span>
                  <span className="ml-auto text-xs font-bold" style={{ color: engine.color }}>{engineStates[idx].autonomy}%</span>
                </div>
                <label htmlFor={`${engine.name.toLowerCase()}-autonomy`} className="sr-only">{engine.name} autonomy level</label>
                <input id={`${engine.name.toLowerCase()}-autonomy`} type="range" min={0} max={100} value={engineStates[idx].autonomy} onChange={(e) => updateEngine(idx, { autonomy: Number(e.target.value) })} className="w-full cursor-pointer" style={{ accentColor: engine.color }} />
                <div className="h-1 rounded-full bg-white/10 mt-2 mb-4">
                  <div className="h-full rounded-full" style={{ width: `${engineStates[idx].autonomy}%`, background: engine.color }} />
                </div>
                {/* Toggles */}
                {[
                  { label: 'Auto-approve low-risk', key: 'autoApprove' as const },
                  { label: 'Notify all decisions', key: 'notify' as const },
                ].map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between py-2">
                    <span className="text-xs text-white/50">{toggle.label}</span>
                    <button
                      onClick={() => updateEngine(idx, { [toggle.key]: !engineStates[idx][toggle.key] })}
                      className={`w-9 h-5 rounded-full relative transition-colors ${engineStates[idx][toggle.key] ? '' : 'bg-white/10'}`}
                      style={engineStates[idx][toggle.key] ? { background: engine.color } : {}}
                      role="switch"
                      aria-checked={engineStates[idx][toggle.key]}
                      aria-label={`${engine.name}: ${toggle.label}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${engineStates[idx][toggle.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <label htmlFor={`${engine.name.toLowerCase()}-min-confidence`} className="text-xs text-white/50">Min confidence</label>
                  <input id={`${engine.name.toLowerCase()}-min-confidence`} type="number" min={0.70} max={0.99} step={0.01} value={engineStates[idx].minConf} onChange={(e) => updateEngine(idx, { minConf: Number(e.target.value) })} className="w-16 text-right rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs text-white focus:outline-none" aria-label={`${engine.name} minimum confidence`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Explanation preferences */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Explanation Preferences</h2>
          <div className="flex flex-col gap-4">
            <div>
              <span id="settings-ai-verbosity-label" className="text-xs text-white/50 block mb-2">Verbosity</span>
              <div className="flex flex-wrap gap-2">
                {(['Minimal', 'Standard', 'Detailed', 'Technical'] as const).map((v) => (
                  <button key={v} onClick={() => { setVerbosity(v); setDirty(true); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${verbosity === v ? 'text-cyan-300 border-cyan-500/40' : 'text-white/50 border-white/10 bg-white/5 hover:bg-white/10'}`} style={verbosity === v ? { background: 'rgba(0,240,255,0.15)' } : {}} aria-pressed={verbosity === v} aria-label={`Set verbosity to ${v}`} aria-labelledby="settings-ai-verbosity-label">
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Show confidence scores', state: showConf, setter: setShowConf },
                { label: 'Show SHAP factors', state: showShap, setter: setShowShap },
                { label: 'Show audit links', state: showAudit, setter: setShowAudit },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between py-1">
                  <span className="text-xs text-white/50">{t.label}</span>
                  <button onClick={() => { t.setter(!t.state); setDirty(true); }} className={`w-9 h-5 rounded-full relative transition-colors ${t.state ? 'bg-cyan-500' : 'bg-white/10'}`} role="switch" aria-checked={t.state} aria-label={t.label}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${t.state ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="settings-ai-language" className="text-xs text-white/50 block mb-1">Language</label>
              <select id="settings-ai-language" value={language} onChange={(e) => { setLanguage(e.target.value); setDirty(true); }} className="w-full md:w-48 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none">
                <option>English</option><option>Japanese</option><option>Spanish</option>
              </select>
            </div>
          </div>
        </motion.div>

        <GovernFooter auditId={GOVERNANCE_META['/settings/ai'].auditId} pageContext={GOVERNANCE_META['/settings/ai'].pageContext} />
      </motion.div>

      {/* Sticky save bar */}
      {dirty && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 backdrop-blur-xl" style={{ background: 'rgba(11,18,33,0.95)' }}>
          <div className="mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8 py-3" style={{ maxWidth: '1280px' }}>
            <span className="text-xs text-white/50">Unsaved changes</span>
            <div className="flex gap-3">
              <button onClick={() => setDirty(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors">
                <RotateCcw className="h-3.5 w-3.5" />Discard
              </button>
              <button onClick={() => setDirty(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity" style={{ background: 'var(--engine-grow)' }}>
                <Save className="h-3.5 w-3.5" />Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsAI;
