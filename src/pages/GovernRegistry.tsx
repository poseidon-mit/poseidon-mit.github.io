import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Database, Bot, ChevronDown, ExternalLink } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Button, Surface } from '@/design-system';

const engineColors: Record<string, string> = {
  Protect: 'var(--engine-protect)',
  Grow: 'var(--engine-grow)',
  Execute: 'var(--engine-execute)',
  Govern: 'var(--engine-govern)'
};

const models = [
{ name: 'FraudDetection', engine: 'Protect', version: 'v3.3.1', accuracy: 97.2, lastTrained: '2d', status: 'Active', precision: 96.8, recall: 97.5, f1: 97.1, trainingPeriod: '90 days' },
{ name: 'BehavioralBaseline', engine: 'Protect', version: 'v2.1.0', accuracy: 94.8, lastTrained: '5d', status: 'Active', precision: 93.5, recall: 95.2, f1: 94.3, trainingPeriod: '60 days' },
{ name: 'GrowthForecast', engine: 'Grow', version: 'v3.2.0', accuracy: 89.1, lastTrained: '3d', status: 'Active', precision: 88.5, recall: 89.7, f1: 89.1, trainingPeriod: '120 days' },
{ name: 'GoalTracker', engine: 'Grow', version: 'v2.1.3', accuracy: 91.5, lastTrained: '7d', status: 'Active', precision: 90.8, recall: 92.1, f1: 91.4, trainingPeriod: '90 days' },
{ name: 'BillNegotiator', engine: 'Execute', version: 'v2.1.0', accuracy: 98.4, lastTrained: '1d', status: 'Active', precision: 98.1, recall: 98.7, f1: 98.4, trainingPeriod: '30 days' },
{ name: 'ExecuteEngine', engine: 'Execute', version: 'v2.4.0', accuracy: 97.8, lastTrained: '4d', status: 'Active', precision: 97.2, recall: 98.3, f1: 97.7, trainingPeriod: '60 days' },
{ name: 'GovernanceEngine', engine: 'Govern', version: 'v1.8.2', accuracy: 99.1, lastTrained: '6d', status: 'Active', precision: 99.0, recall: 99.2, f1: 99.1, trainingPeriod: '180 days' },
{ name: 'PolicyEngine', engine: 'Govern', version: 'v2.0.0', accuracy: 98.7, lastTrained: '2d', status: 'Active', precision: 98.5, recall: 98.9, f1: 98.7, trainingPeriod: '120 days' }];


const recentUpdates = [
{ model: 'BillNegotiator', version: 'v2.1.0', date: 'Feb 15' },
{ model: 'PolicyEngine', version: 'v2.0.0', date: 'Feb 14' },
{ model: 'FraudDetection', version: 'v3.3.1', date: 'Feb 14' },
{ model: 'GrowthForecast', version: 'v3.2.0', date: 'Feb 13' },
{ model: 'ExecuteEngine', version: 'v2.4.0', date: 'Feb 12' }];


export function GovernRegistry() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion);

  const [expanded, setExpanded] = useState<string | null>(null);
  const toggleExpanded = (name: string) => setExpanded((prev) => prev === name ? null : name);
  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, name: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded(name);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-govern)" intensity="subtle" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: 'var(--engine-govern)', color: '#fff' }}>Skip to main content</a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/govern" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-govern)' }}>
            <ArrowLeft className="h-4 w-4" />Govern
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Model Registry</span>
        </div>
      </nav>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: '1280px' }} variants={staggerContainerVariant} initial="hidden" animate="visible" role="main">
        {/* Hero */}
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Database className="h-4 w-4" style={{ color: 'var(--engine-govern)' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-govern)' }}>Govern · Registry</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">AI Model Registry</h1>
          <p className="text-sm text-slate-400">8 active models · Last updated 4m ago · All models audited.</p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUpVariant} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
          { label: 'Active models', value: '8', color: 'var(--engine-govern)' },
          { label: 'Avg accuracy', value: '96.2%', color: 'var(--engine-protect)' },
          { label: 'Last retrained', value: '2d ago', color: 'var(--engine-dashboard)' },
          { label: 'Coverage', value: '100%', color: 'var(--engine-grow)' }].
          map((kpi) => <Surface
            key={kpi.label} className="rounded-2xl" variant="glass" padding="md">
              <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
              <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            </Surface>
          )}
        </motion.div>

        {/* Main 2-col */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Model table / cards */}
          <div className="flex-1 lg:w-2/3 flex flex-col gap-4">
            <motion.div variants={fadeUpVariant}>
              {/* Desktop table */}
              <Surface className="hidden md:block rounded-2xl overflow-hidden" variant="glass" padding="none" data-surface-role="structure">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Model', 'Engine', 'Version', 'Accuracy', 'Last trained', 'Status', ''].map((h) =>
                      <th key={h} className="px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((m) =>
                    <React.Fragment key={m.name}>
                        <tr
                          className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                          onClick={() => toggleExpanded(m.name)}
                          onKeyDown={(event) => handleRowKeyDown(event, m.name)}
                          tabIndex={0}
                          aria-label={`${m.name} model row`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Bot className="h-3.5 w-3.5 text-white/30" />
                              <span className="text-sm font-medium text-white">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${engineColors[m.engine]}20`, color: engineColors[m.engine] }}>
                              {m.engine}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-white/60 font-mono">{m.version}</td>
                          <td className="px-4 py-3 text-xs font-semibold" style={{ color: m.accuracy >= 95 ? 'var(--engine-protect)' : m.accuracy >= 90 ? 'var(--engine-dashboard)' : 'var(--engine-execute)' }}>{m.accuracy}%</td>
                          <td className="px-4 py-3 text-xs text-white/40">{m.lastTrained}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{m.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <ChevronDown className={`h-3.5 w-3.5 text-white/30 transition-transform ${expanded === m.name ? 'rotate-180' : ''}`} />
                          </td>
                        </tr>
                        {expanded === m.name &&
                      <tr>
                            <td colSpan={7} className="px-4 py-4 bg-white/[0.01]">
                              <div className="flex flex-wrap gap-6">
                                {/* Sparkline bars */}
                                <div className="flex-1 min-w-[200px]">
                                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">7-Day Accuracy</p>
                                  <div className="flex items-end gap-1 h-8">
                                    {[m.accuracy - 0.8, m.accuracy - 0.4, m.accuracy - 0.2, m.accuracy, m.accuracy - 0.1, m.accuracy + 0.1, m.accuracy].map((v, i) =>
                                <div key={i} className="flex-1 rounded-sm" style={{ height: `${v / 100 * 100}%`, minHeight: '4px', background: 'var(--engine-govern)' }} />
                                )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-xs">
                                  <div><p className="text-white/30">Precision</p><p className="text-white/70 font-semibold">{m.precision}%</p></div>
                                  <div><p className="text-white/30">Recall</p><p className="text-white/70 font-semibold">{m.recall}%</p></div>
                                  <div><p className="text-white/30">F1 Score</p><p className="text-white/70 font-semibold">{m.f1}%</p></div>
                                </div>
                                <div className="text-xs">
                                  <p className="text-white/30">Training period</p>
                                  <p className="text-white/70 font-semibold">{m.trainingPeriod}</p>
                                </div>
                              </div>
                              <Button variant="ghost" engine="govern" size="sm" className="flex items-center gap-1.5 mt-3 text-xs font-medium hover:opacity-80 transition-opacity !px-0">
                                <ExternalLink className="h-3 w-3" />View audit trail
                              </Button>
                            </td>
                          </tr>
                      }
                      </React.Fragment>
                    )}
                  </tbody>
                </table>
              </Surface>

              {/* Mobile cards */}
              <div className="md:hidden flex flex-col gap-3">
                {models.map((m) => <Surface
                  key={m.name} className="rounded-2xl" variant="glass" padding="md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{m.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${engineColors[m.engine]}20`, color: engineColors[m.engine] }}>{m.engine}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="text-white/40">{m.version}</span>
                      <span style={{ color: m.accuracy >= 95 ? 'var(--engine-protect)' : 'var(--engine-execute)' }}>{m.accuracy}%</span>
                      <span className="text-white/40">Trained {m.lastTrained}</span>
                    </div>
                    <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{m.status}</span>
                  </Surface>
                )}
              </div>
            </motion.div>
          </div>

          {/* Side rail */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
            {/* Registry health */}
            <Surface variants={fadeUpVariant} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Registry Health</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Active</span>
                  <span className="text-emerald-400 font-semibold">8/8</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Degraded</span>
                  <span className="text-white/30">0</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Failed</span>
                  <span className="text-white/30">0</span>
                </div>
              </div>
            </Surface>

            {/* Accuracy distribution */}
            <Surface variants={fadeUpVariant} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Accuracy by Engine</h3>
              <div className="flex flex-col gap-3">
                {[
                { engine: 'Protect', avg: 96.0 },
                { engine: 'Grow', avg: 90.3 },
                { engine: 'Execute', avg: 98.1 },
                { engine: 'Govern', avg: 98.9 }].
                map((e) =>
                <div key={e.engine}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: engineColors[e.engine] }}>{e.engine}</span>
                      <span className="text-white/50">{e.avg}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${e.avg}%`, background: engineColors[e.engine] }} />
                    </div>
                  </div>
                )}
              </div>
            </Surface>

            {/* Recent updates */}
            <Surface variants={fadeUpVariant} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Recent Updates</h3>
              <div className="flex flex-col gap-3">
                {recentUpdates.map((u, i) =>
                <div key={i} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--engine-govern)' }} />
                    <div>
                      <p className="text-xs text-white/70">{u.model} <span className="text-white/30 font-mono">{u.version}</span></p>
                      <p className="text-[10px] text-white/30">{u.date}</p>
                    </div>
                  </div>
                )}
              </div>
            </Surface>
          </div>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/registry'].auditId} pageContext={GOVERNANCE_META['/govern/registry'].pageContext} />
      </motion.div>
    </div>);

}

export default GovernRegistry;
