import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { usePageTitle } from '../hooks/use-page-title';
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { Button, Toggle, Surface } from '@/design-system';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

interface EngineCard {
  engine: string;
  color: string;
  trustScore: number;
  riskTolerance: number;
  autoApproval: number;
  toggles: Array<{label: string;enabled: boolean;}>;
}

const engineCards: EngineCard[] = [
{
  engine: 'Protect',
  color: 'var(--engine-protect)',
  trustScore: 94,
  riskTolerance: 30,
  autoApproval: 85,
  toggles: [{ label: 'Auto-block suspicious', enabled: true }, { label: 'Real-time alerts', enabled: true }]
},
{
  engine: 'Grow',
  color: 'var(--engine-grow)',
  trustScore: 87,
  riskTolerance: 55,
  autoApproval: 70,
  toggles: [{ label: 'Auto-save rules', enabled: true }, { label: 'Goal tracking', enabled: true }]
},
{
  engine: 'Execute',
  color: 'var(--engine-execute)',
  trustScore: 91,
  riskTolerance: 40,
  autoApproval: 80,
  toggles: [{ label: 'Low-risk auto-execute', enabled: false }, { label: 'Bill negotiation', enabled: true }]
},
{
  engine: 'Govern',
  color: 'var(--engine-govern)',
  trustScore: 97,
  riskTolerance: 20,
  autoApproval: 95,
  toggles: [{ label: 'Auto-audit logging', enabled: true }, { label: 'Policy enforcement', enabled: true }]
}];


const trustTrend = [
{ label: '30d avg', value: '91.4', positive: false },
{ label: '90d avg', value: '89.8', positive: false },
{ label: 'All-time high', value: '92', positive: true },
{ label: 'Trend', value: 'Improving', positive: true }];


/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function GovernTrust() {
  usePageTitle('Trust Index');
  const [cards, setCards] = useState(engineCards);
  const [dirty, setDirty] = useState(false);
  const baselineSystemTrust = Math.round(DEMO_THREAD.systemConfidence * 100);

  const updateSlider = (idx: number, field: 'riskTolerance' | 'autoApproval', value: number) => {
    setCards((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
    setDirty(true);
  };

  const toggleSwitch = (cardIdx: number, toggleIdx: number) => {
    setCards((prev) =>
    prev.map((c, ci) =>
    ci === cardIdx ?
    { ...c, toggles: c.toggles.map((t, ti) => ti === toggleIdx ? { ...t, enabled: !t.enabled } : t) } :
    c
    )
    );
    setDirty(true);
  };

  const systemTrust = Math.round(cards.reduce((acc, c) => acc + c.trustScore, 0) / cards.length);
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-govern)" intensity="subtle" />
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-govern)', color: '#ffffff' }}>
        
        Skip to main content
      </a>

      {/* Back nav */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"

        aria-label="Breadcrumb">
        
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link
            to="/govern"
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--engine-govern)' }}>
            
            <ArrowLeft className="h-4 w-4" />
            Govern
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Trust Dashboard</span>
        </div>
      </nav>

      {/* Main */}
      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={stagger}
        initial="hidden"
        animate="visible"
        role="main">
        
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5" style={{ color: 'var(--engine-govern)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-govern)' }}>
              Govern · Trust
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Trust Dashboard</h1>
          <p className="text-sm text-slate-400">
            Per-engine trust scores, threshold configuration, and auto-approval settings.
          </p>
        </motion.div>

        {/* System trust KPI */}
        <motion.div variants={fadeUp}>
          <Surface className="rounded-2xl flex flex-col md:flex-row items-center gap-6" variant="glass" padding="md">
            <div className="relative flex items-center justify-center shrink-0" aria-label={`System trust score: ${systemTrust} out of 100`}>
              <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
                <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="var(--engine-govern)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${systemTrust / 100 * circumference} ${circumference}`}
                  transform="rotate(-90 48 48)" />
                
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{systemTrust}</span>
                <span className="text-xs text-white/40">/100</span>
              </div>
            </div>
            <div className="flex-1 w-full">
              <p className="text-lg font-semibold text-white">System Trust Score</p>
              <p className="text-sm text-slate-400 mt-0.5">
                {`Weighted composite across all 4 engines (baseline ${baselineSystemTrust})`}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {cards.map((c) =>
                <div key={c.engine} className="flex flex-col gap-1">
                    <span className="text-xs text-white/40">{c.engine}</span>
                    <span className="text-xl font-bold" style={{ color: c.color }}>{c.trustScore}</span>
                    <div className="h-1 rounded-full bg-white/10">
                      <div className="h-full rounded-full transition-all" style={{ width: `${c.trustScore}%`, background: c.color }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Surface>
        </motion.div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Per-engine config */}
          <motion.div variants={fadeUp} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Per-Engine Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card, idx) => <Surface

                key={card.engine} className="rounded-2xl"

                style={{ borderLeftWidth: 3, borderLeftColor: card.color }} variant="glass" padding="md">
                
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-white">{card.engine}</span>
                    <span className="text-base font-bold" style={{ color: card.color }}>{card.trustScore}</span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/50">Risk tolerance</span>
                      <span className="text-white/70">{card.riskTolerance}%</span>
                    </div>
                    <input
                    type="range"
                    min={0}
                    max={100}
                    value={card.riskTolerance}
                    onChange={(e) => updateSlider(idx, 'riskTolerance', Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                    aria-label={`${card.engine} risk tolerance`} />
                  
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/50">Auto-approval threshold</span>
                      <span className="text-white/70">{card.autoApproval}%</span>
                    </div>
                    <input
                    type="range"
                    min={50}
                    max={100}
                    value={card.autoApproval}
                    onChange={(e) => updateSlider(idx, 'autoApproval', Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                    aria-label={`${card.engine} auto-approval threshold`} />
                  
                  </div>

                  <div className="space-y-2.5 border-t border-white/[0.06] pt-3">
                    {card.toggles.map((toggle, ti) =>
                  <div key={toggle.label} className="flex items-center justify-between">
                        <span className="text-xs text-white/50">{toggle.label}</span>
                        <Toggle
                      checked={toggle.enabled}
                      onChange={() => toggleSwitch(idx, ti)}
                      ariaLabel={toggle.label} />
                    
                      </div>
                  )}
                  </div>
                </Surface>
              )}
            </div>

            <div className="flex gap-3 mt-1">
              <Button
                disabled={!dirty}
                variant="glass"
                engine="govern"
                size="sm"
                className={`rounded-xl text-sm font-semibold transition-all ${dirty ? '' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>
                
                Save changes
              </Button>
              <Button
                disabled={!dirty}
                onClick={() => {setCards(engineCards);setDirty(false);}}
                variant="secondary"
                engine="govern"
                size="sm"
                className="rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                
                Reset
              </Button>
            </div>
          </motion.div>

          {/* Side rail */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Trust statistics">
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Trust Trend</h3>
              </div>
              <div className="space-y-2.5">
                {trustTrend.map((row) =>
                <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`text-xs font-medium ${row.positive ? 'text-emerald-400' : 'text-white/70'}`}>{row.value}</span>
                  </div>
                )}
              </div>
            </Surface>

            <Surface className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">System Status</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-emerald-400 font-medium">All engines healthy</span>
              </div>
              <p className="text-xs text-white/40">
                Trust scores recalculated every 15 min based on accuracy, transparency, fairness, and compliance.
              </p>
            </Surface>

            <Surface className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Policy Notes</h3>
              </div>
              <p className="text-xs text-white/40">
                Threshold changes are logged in the audit ledger. Requires Govern-level authorization.
              </p>
            </Surface>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/trust'].auditId} pageContext={GOVERNANCE_META['/govern/trust'].pageContext} />
      </motion.div>
    </div>);

}

export default GovernTrust;