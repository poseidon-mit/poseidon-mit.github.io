import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ScrollText, Clock, Eye as EyeIcon, Edit, ChevronDown, Plus } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { Button, Surface } from '@/design-system';


const policies = [
  { name: 'Data Privacy Policy', category: 'Privacy', engines: ['All'], status: 'Active' as const, reviewed: 'Feb 10, 2026', desc: 'Governs collection, storage, and processing of personal financial data.', enforcement: 'Strict', violations: 0, fullText: 'All personal data shall be encrypted at rest and in transit. Access is limited to authorized processes. Data retention follows category-specific schedules.' },
  { name: 'Fair Lending Guidelines', category: 'Fairness', engines: ['Grow', 'Execute'], status: 'Active' as const, reviewed: 'Feb 8, 2026', desc: 'Ensures AI recommendations comply with fair lending practices.', enforcement: 'Strict', violations: 0, fullText: 'AI models must not discriminate based on protected characteristics. All lending recommendations undergo fairness audits.' },
  { name: 'Transaction Blocking Rules', category: 'Safety', engines: ['Protect'], status: 'Active' as const, reviewed: 'Feb 12, 2026', desc: 'Defines thresholds and rules for blocking suspicious transactions.', enforcement: 'Strict', violations: 0, fullText: 'Transactions exceeding risk thresholds are blocked pending review. False positive rate target: < 2%.' },
  { name: 'GDPR Compliance', category: 'Compliance', engines: ['All'], status: 'Active' as const, reviewed: 'Feb 5, 2026', desc: 'Full GDPR compliance framework for EU data subjects.', enforcement: 'Strict', violations: 0, fullText: 'Data subjects have right to access, portability, erasure, and restriction. All requests processed within 72 hours.' },
  { name: 'CCPA Rights Handler', category: 'Compliance', engines: ['All'], status: 'Active' as const, reviewed: 'Feb 5, 2026', desc: 'California Consumer Privacy Act compliance.', enforcement: 'Strict', violations: 0, fullText: 'California residents can opt out of data sale. Do Not Sell My Personal Information link available.' },
  { name: 'Model Bias Threshold', category: 'Fairness', engines: ['All'], status: 'Pending review' as const, reviewed: 'Jan 28, 2026', desc: 'Maximum acceptable bias scores for all AI models.', enforcement: 'Advisory', violations: 0, fullText: 'All models must maintain disparate impact ratio > 0.8. Monthly bias audits required.' },
  { name: 'Auto-approval Limits', category: 'Safety', engines: ['Execute'], status: 'Active' as const, reviewed: 'Feb 1, 2026', desc: 'Maximum amounts for auto-approved actions.', enforcement: 'Strict', violations: 0, fullText: 'Auto-approval limit: $500/transaction, $2,000/day. Above limits require human review.' },
  { name: 'Minimum Confidence Rule', category: 'Safety', engines: ['All'], status: 'Active' as const, reviewed: 'Feb 3, 2026', desc: 'Minimum confidence thresholds for AI actions.', enforcement: 'Strict', violations: 0, fullText: 'No autonomous action with confidence < 0.70. Actions between 0.70-0.85 flagged for review.' },
  { name: 'Data Retention Policy', category: 'Privacy', engines: ['All'], status: 'Active' as const, reviewed: 'Jan 30, 2026', desc: 'Defines how long different data categories are retained.', enforcement: 'Strict', violations: 0, fullText: 'Transactions: 2 years. Sessions: 90 days. Audit logs: 7 years. Account data: lifetime.' },
  { name: 'Cross-engine Data Share', category: 'Privacy', engines: ['All'], status: 'Active' as const, reviewed: 'Feb 2, 2026', desc: 'Rules for sharing data between engine subsystems.', enforcement: 'Strict', violations: 0, fullText: 'Cross-engine data sharing requires explicit consent. Anonymization required for analytics.' },
  { name: 'AML Detection Rules', category: 'Compliance', engines: ['Protect'], status: 'Active' as const, reviewed: 'Feb 11, 2026', desc: 'Anti-money laundering detection and reporting.', enforcement: 'Strict', violations: 0, fullText: 'Suspicious activity reports filed automatically. CTR threshold: $10,000. SAR threshold: $5,000.' },
  { name: 'Consumer Protection Act', category: 'Compliance', engines: ['Execute'], status: 'Active' as const, reviewed: 'Feb 7, 2026', desc: 'Consumer financial protection compliance.', enforcement: 'Strict', violations: 0, fullText: 'All automated financial actions must be reversible within 24 hours. Clear disclosures required.' }];


const categoryColors: Record<string, string> = { Privacy: 'var(--engine-grow)', Fairness: 'var(--engine-dashboard)', Safety: 'var(--engine-execute)', Compliance: 'var(--engine-govern)' };

const policyHealth = [
  { category: 'Privacy', count: 4 },
  { category: 'Fairness', count: 2 },
  { category: 'Safety', count: 3 },
  { category: 'Compliance', count: 3 }];


const upcomingReviews = [
  { date: 'Feb 28', name: 'Model Bias Threshold' },
  { date: 'Mar 5', name: 'GDPR Compliance' },
  { date: 'Mar 10', name: 'Data Privacy Policy' },
  { date: 'Mar 15', name: 'Fair Lending Guidelines' }];


export function GovernPolicy() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? policies : policies.slice(0, 5);
  const activePolicies = policies.filter((p) => p.status === 'Active').length;
  const pendingReview = policies.filter((p) => p.status === 'Pending review').length;

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
          <span className="text-sm text-white/50">Policy & Rules</span>
        </div>
      </nav>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-8 w-full font-sans pb-8" style={{ maxWidth: '1440px' }} variants={staggerContainerVariant} initial="hidden" animate="visible" role="main">
        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8 pt-8 lg:pt-12">
          {/* Hero */}
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/10 text-[var(--engine-govern)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <ScrollText size={12} /> Govern · Policy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>Policy & Rules</h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">12 active policies · <span className="text-[var(--state-healthy)] font-mono drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">0 violations</span> · Last reviewed Feb 16, 2026.</p>
          </motion.div>

          {/* KPI bar */}
          <motion.div variants={fadeUpVariant} className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-4">
            {[
              { label: 'Active policies', value: String(activePolicies), color: 'var(--engine-govern)' },
              { label: 'Violations (30d)', value: '0', color: 'var(--state-healthy)' },
              { label: 'Pending review', value: String(pendingReview), color: 'var(--engine-execute)' },
              { label: 'Compliance', value: '96%', color: 'var(--engine-protect)' }].
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
          {/* Policy list */}
          <div className="flex-1 lg:w-2/3 flex flex-col gap-6">
            <motion.div variants={staggerContainerVariant} className="flex flex-col gap-4">
              {displayed.map((p) => <Surface
                key={p.name} className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 transition-all hover:bg-white/[0.02]" variant="glass" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="relative z-10 block p-6 lg:p-8 cursor-pointer group" onClick={() => setExpanded(expanded === p.name ? null : p.name)}>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border" style={{ background: `${categoryColors[p.category]}10`, color: categoryColors[p.category], borderColor: `${categoryColors[p.category]}30` }}>{p.category}</span>
                    {p.status === 'Active' ?
                      <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[var(--state-healthy)]/10 text-[var(--state-healthy)] border border-[var(--state-healthy)]/30">{p.status}</span> :
                      <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[var(--state-warning)]/10 text-[var(--state-warning)] border border-[var(--state-warning)]/30">{p.status}</span>
                    }
                    <div className="flex gap-1.5 ml-auto">
                      {p.engines.map((e) =>
                        <span key={e} className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-white/10 text-white/40">{e}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl md:text-2xl font-light text-white tracking-wide group-hover:text-[var(--engine-govern)] transition-colors">{p.name}</h3>
                    <p className="text-sm text-white/50 font-light leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Last reviewed: <span className="text-white/50 font-sans">{p.reviewed}</span></span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.05] group-hover:bg-[var(--engine-govern)]/10 group-hover:border-[var(--engine-govern)]/30 transition-all">
                      <ChevronDown size={14} className={`text-white/50 transition-transform duration-300 group-hover:text-[var(--engine-govern)] ${expanded === p.name ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
                {expanded === p.name && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative z-10 px-6 lg:px-8 pb-6 lg:pb-8 border-t border-white/[0.06] bg-black/20">
                    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-5 mt-6 mb-6">
                      <p className="font-mono text-sm text-white/60 leading-relaxed font-light">{p.fullText}</p>
                    </div>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-white/40">Violations</span>
                        <span className="text-sm font-mono font-bold text-[var(--state-healthy)] drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">{p.violations}</span>
                      </div>
                      <div className="w-px h-8 bg-white/[0.06]" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-white/40">Enforcement</span>
                        <span className="text-sm tracking-wide text-white/80">{p.enforcement}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--engine-govern)] text-black text-xs font-semibold shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all">
                        <Edit size={14} /> Edit Policy
                      </button>
                      <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs font-semibold hover:bg-white/[0.1] transition-colors">
                        <Clock size={14} className="text-white/50" /> Request Review
                      </button>
                    </div>
                  </motion.div>
                )}
              </Surface>
              )}
              {!showAll &&
                <button onClick={() => setShowAll(true)} className="w-full py-4 mt-2 rounded-[24px] border border-white/[0.05] bg-white/[0.02] text-xs font-semibold tracking-widest uppercase text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all">
                  Show all 12 policies
                </button>
              }
            </motion.div>
          </div>

          {/* Side rail */}
          <motion.aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Policy sidebar" variants={staggerContainerVariant}>
            {/* Policy health */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/50 uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4">Policy Health</h3>
                <div className="relative z-10 flex flex-col gap-5">
                  {policyHealth.map((ph) =>
                    <div key={ph.category} className="flex flex-col gap-2 group">
                      <div className="flex justify-between items-end">
                        <span className="text-xs uppercase tracking-widest text-white/70">{ph.category}</span>
                        <span className="text-xs font-mono font-bold text-white/50">{ph.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/[0.03]">
                        <div className="h-full rounded-full transition-all duration-700 bg-white/20 group-hover:bg-white/40" style={{ width: `${ph.count / 4 * 100}%`, background: categoryColors[ph.category] }} />
                      </div>
                    </div>
                  )}
                </div>
              </Surface>
            </motion.div>

            {/* Compliance calendar */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/50 uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4">Upcoming Reviews</h3>
                <div className="relative z-10 flex flex-col gap-4">
                  {upcomingReviews.map((r, i) =>
                    <div key={i} className="flex items-center justify-between p-3 lg:p-4 rounded-2xl border border-white/[0.04] bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded bg-white/[0.05]">
                          <Clock size={12} className="text-white/40" />
                        </div>
                        <span className="text-xs tracking-wide text-white/80">{r.name}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 shrink-0">{r.date}</span>
                    </div>
                  )}
                </div>
              </Surface>
            </motion.div>

            {/* Quick add */}
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <button className="relative z-10 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[var(--engine-govern)] text-black transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] text-sm font-semibold">
                  <Plus size={16} /> Draft New Policy
                </button>
              </Surface>
            </motion.div>
          </motion.aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/policy'].auditId} pageContext={GOVERNANCE_META['/govern/policy'].pageContext} />
      </motion.div>
    </div>);

}

export default GovernPolicy;