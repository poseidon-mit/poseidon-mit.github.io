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

      <motion.div id="main-content" className="mx-auto flex flex-col gap-8 w-full font-sans pb-8" style={{ maxWidth: '1440px' }} variants={staggerContainerVariant} initial="hidden" animate="visible" role="main">
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8 pt-8 lg:pt-12">
          {/* Hero */}
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/10 text-[var(--engine-govern)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <Database size={12} /> Govern · Registry
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>AI Model Registry</h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">
              8 active models · Last updated <span className="text-[var(--engine-govern)] font-mono drop-shadow-[0_0_10px_rgba(20,184,166,0.4)]">4m ago</span> · All models audited.
            </p>
          </motion.div>

          {/* KPI bar */}
          <motion.div variants={fadeUpVariant} className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-4">
            {[
              { label: 'Active models', value: '8', color: 'var(--engine-govern)' },
              { label: 'Avg accuracy', value: '96.2%', color: 'var(--engine-protect)' },
              { label: 'Last retrained', value: '2d ago', color: 'white' },
              { label: 'Coverage', value: '100%', color: 'var(--state-healthy)' }].
              map((kpi) => <Surface
                key={kpi.label} className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-5 md:p-6" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-2">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white/50">{kpi.label}</p>
                  <p className="text-2xl md:text-3xl font-light font-mono truncate" style={{ color: kpi.color, textShadow: kpi.color !== 'white' ? `0 0 15px ${kpi.color}60` : 'none' }}>{kpi.value}</p>
                </div>
              </Surface>
              )}
          </motion.div>
        </motion.section>

        {/* Main 2-col */}
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8 pb-12 w-full">
          {/* Model table / cards */}
          <div className="flex-1 lg:w-2/3 flex flex-col gap-6">
            <motion.div variants={staggerContainerVariant}>
              {/* Desktop table */}
              <Surface className="hidden md:block relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" variant="glass" padding="none" data-surface-role="structure">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 p-6 lg:p-8">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {['Model', 'Engine', 'Version', 'Accuracy', 'Last trained', 'Status', ''].map((h) =>
                          <th key={h} className="pb-4 text-[10px] font-semibold text-white/30 uppercase tracking-widest">{h}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((m) =>
                        <React.Fragment key={m.name}>
                          <tr
                            className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                            onClick={() => toggleExpanded(m.name)}
                            onKeyDown={(event) => handleRowKeyDown(event, m.name)}
                            tabIndex={0}
                            aria-label={`${m.name} model row`}>
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.05] group-hover:bg-[var(--engine-govern)]/10 group-hover:border-[var(--engine-govern)]/20 transition-all">
                                  <Bot className="h-4 w-4 text-white/50 group-hover:text-[var(--engine-govern)] transition-colors" />
                                </div>
                                <span className="text-sm font-light text-white tracking-wide group-hover:text-[var(--engine-govern)] transition-colors">{m.name}</span>
                              </div>
                            </td>
                            <td className="py-4 pr-4">
                              <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border" style={{ background: `${engineColors[m.engine]}10`, color: engineColors[m.engine], borderColor: `${engineColors[m.engine]}30` }}>
                                {m.engine}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-xs text-white/50 font-mono tracking-widest">{m.version}</td>
                            <td className="py-4 pr-4 text-sm font-mono tracking-wide" style={{ color: m.accuracy >= 95 ? 'var(--state-healthy)' : m.accuracy >= 90 ? 'var(--state-warning)' : 'var(--engine-execute)', textShadow: m.accuracy >= 95 ? '0 0 10px rgba(34,197,94,0.4)' : 'none' }}>{m.accuracy}%</td>
                            <td className="py-4 pr-4 text-xs font-mono text-white/40">{m.lastTrained}</td>
                            <td className="py-4 pr-4">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border bg-[var(--state-healthy)]/10 text-[var(--state-healthy)] border-[var(--state-healthy)]/30">{m.status}</span>
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.05] group-hover:bg-[var(--engine-govern)]/10 group-hover:border-[var(--engine-govern)]/30 transition-all">
                                <ChevronDown className={`h-4 w-4 text-white/50 transition-transform duration-300 group-hover:text-[var(--engine-govern)] ${expanded === m.name ? 'rotate-180' : ''}`} />
                              </div>
                            </td>
                          </tr>
                          {expanded === m.name &&
                            <tr>
                              <td colSpan={7} className="px-6 py-6 border-b border-white/[0.04] bg-black/20">
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-6">
                                  <div className="flex flex-wrap gap-8">
                                    {/* Sparkline bars */}
                                    <div className="flex-1 min-w-[200px] flex flex-col gap-3">
                                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold border-b border-white/[0.06] pb-2">7-Day Accuracy Trend</p>
                                      <div className="flex items-end gap-1.5 h-12">
                                        {[m.accuracy - 0.8, m.accuracy - 0.4, m.accuracy - 0.2, m.accuracy, m.accuracy - 0.1, m.accuracy + 0.1, m.accuracy].map((v, i) =>
                                          <div key={i} className="flex-1 rounded-t-sm bg-[var(--engine-govern)] flex items-end justify-center group/bar relative" style={{ height: `${v / 100 * 100}%`, minHeight: '4px', opacity: 0.6 + (i * 0.05) }}>
                                            <div className="absolute -top-6 bg-black/80 backdrop-blur-md border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-[var(--engine-govern)] opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                              {v.toFixed(1)}%
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-[250px] flex flex-col gap-3">
                                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold border-b border-white/[0.06] pb-2">Model Metrics</p>
                                      <div className="grid grid-cols-3 gap-4">
                                        <div className="flex flex-col gap-1">
                                          <p className="text-[10px] uppercase tracking-widest text-white/30">Precision</p>
                                          <p className="text-sm font-mono font-bold text-white/80">{m.precision}%</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <p className="text-[10px] uppercase tracking-widest text-white/30">Recall</p>
                                          <p className="text-sm font-mono font-bold text-white/80">{m.recall}%</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <p className="text-[10px] uppercase tracking-widest text-white/30">F1 Score</p>
                                          <p className="text-sm font-mono font-bold text-white/80">{m.f1}%</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold border-b border-white/[0.06] pb-2">Training Info</p>
                                      <div className="flex flex-col gap-1 text-xs">
                                        <p className="text-[10px] uppercase tracking-widest text-white/30">Training period</p>
                                        <p className="text-sm font-mono text-white/70">{m.trainingPeriod}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
                                    <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--engine-govern)] text-black text-xs font-semibold shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all">
                                      <ExternalLink size={14} /> View Audit Trail
                                    </button>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          }
                        </React.Fragment>
                      )}
                    </tbody>
                  </table>
                </div>
              </Surface>

              {/* Mobile cards */}
              <div className="md:hidden flex flex-col gap-4">
                {models.map((m) => <Surface
                  key={m.name} className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-5" padding="none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-light text-white tracking-wide">{m.name}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border" style={{ background: `${engineColors[m.engine]}10`, color: engineColors[m.engine], borderColor: `${engineColors[m.engine]}30` }}>{m.engine}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-sans uppercase tracking-widest text-white/30">Version</span>
                        <span className="text-white/60 tracking-wider">{m.version}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-sans uppercase tracking-widest text-white/30">Accuracy</span>
                        <span style={{ color: m.accuracy >= 95 ? 'var(--state-healthy)' : 'var(--engine-execute)', textShadow: m.accuracy >= 95 ? '0 0 10px rgba(34,197,94,0.4)' : 'none' }}>{m.accuracy}%</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-sans uppercase tracking-widest text-white/30">Trained</span>
                        <span className="text-white/40">{m.lastTrained}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06]">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border bg-[var(--state-healthy)]/10 text-[var(--state-healthy)] border-[var(--state-healthy)]/30">{m.status}</span>
                    </div>
                  </div>
                </Surface>
                )}
              </div>
            </motion.div>
          </div>

          {/* Side rail */}
          <motion.aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Registry sidebar" variants={staggerContainerVariant}>
            {/* Registry health */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/50 uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4">Registry Health</h3>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs border-b border-white/[0.04] pb-3">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Active</span>
                    <span className="text-[var(--state-healthy)] font-bold text-sm drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">8/8</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-white/[0.04] pb-3">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Degraded</span>
                    <span className="text-white/50 font-mono font-medium">0</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Failed</span>
                    <span className="text-white/50 font-mono font-medium">0</span>
                  </div>
                </div>
              </Surface>
            </motion.div>

            {/* Accuracy distribution */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/50 uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4">Accuracy by Engine</h3>
                <div className="relative z-10 flex flex-col gap-5">
                  {[
                    { engine: 'Protect', avg: 96.0 },
                    { engine: 'Grow', avg: 90.3 },
                    { engine: 'Execute', avg: 98.1 },
                    { engine: 'Govern', avg: 98.9 }].
                    map((e) =>
                      <div key={e.engine} className="flex flex-col gap-2 group">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] uppercase tracking-widest" style={{ color: engineColors[e.engine] }}>{e.engine}</span>
                          <span className="text-xs font-mono font-bold text-white/60">{e.avg}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/[0.03]">
                          <div className="h-full rounded-full transition-all duration-700 bg-[var(--engine-govern)]/60 group-hover:bg-[var(--engine-govern)]" style={{ width: `${e.avg}%` }} />
                        </div>
                      </div>
                    )}
                </div>
              </Surface>
            </motion.div>

            {/* Recent updates */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/50 uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4">Recent Updates</h3>
                <div className="relative z-10 flex flex-col gap-4">
                  {recentUpdates.map((u, i) =>
                    <div key={i} className="flex items-start gap-4 p-3 lg:p-4 rounded-2xl border border-white/[0.04] bg-white/[0.02]">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(20,184,166,0.5)]" style={{ background: 'var(--engine-govern)' }} />
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs tracking-wide text-white/80">{u.model}</p>
                          <p className="text-[10px] uppercase tracking-widest font-mono text-white/40">{u.date}</p>
                        </div>
                        <p className="text-[10px] text-white/40 font-mono tracking-widest">{u.version}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Surface>
            </motion.div>
          </motion.aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/registry'].auditId} pageContext={GOVERNANCE_META['/govern/registry'].pageContext} />
      </motion.div>
    </div>);

}

export default GovernRegistry;
