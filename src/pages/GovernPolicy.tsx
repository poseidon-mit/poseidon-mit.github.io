import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ScrollText, Clock, Eye as EyeIcon, Edit, ChevronDown, Plus } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter, AuroraPulse } from '@/components/poseidon'
import { GOVERNANCE_META } from '@/lib/governance-meta'
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets'


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
  { name: 'Consumer Protection Act', category: 'Compliance', engines: ['Execute'], status: 'Active' as const, reviewed: 'Feb 7, 2026', desc: 'Consumer financial protection compliance.', enforcement: 'Strict', violations: 0, fullText: 'All automated financial actions must be reversible within 24 hours. Clear disclosures required.' },
];

const categoryColors: Record<string, string> = { Privacy: 'var(--engine-grow)', Fairness: 'var(--engine-dashboard)', Safety: 'var(--engine-execute)', Compliance: 'var(--engine-govern)' };

const policyHealth = [
  { category: 'Privacy', count: 4 },
  { category: 'Fairness', count: 2 },
  { category: 'Safety', count: 3 },
  { category: 'Compliance', count: 3 },
];

const upcomingReviews = [
  { date: 'Feb 28', name: 'Model Bias Threshold' },
  { date: 'Mar 5', name: 'GDPR Compliance' },
  { date: 'Mar 10', name: 'Data Privacy Policy' },
  { date: 'Mar 15', name: 'Fair Lending Guidelines' },
];

export function GovernPolicy() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? policies : policies.slice(0, 5);
  const activePolicies = policies.filter((p) => p.status === 'Active').length;
  const pendingReview = policies.filter((p) => p.status === 'Pending review').length;

  return (
    <div className="relative min-h-screen w-full" style={{ background: '#0B1221' }}>
      <AuroraPulse color="var(--engine-govern)" intensity="subtle" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: 'var(--engine-govern)', color: '#fff' }}>Skip to main content</a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(11,18,33,0.8)' }} aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/govern" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-govern)' }}>
            <ArrowLeft className="h-4 w-4" />Govern
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Policy & Rules</span>
        </div>
      </nav>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: '1280px' }} variants={stagger} initial="hidden" animate="visible" role="main">
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <ScrollText className="h-4 w-4" style={{ color: 'var(--engine-govern)' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-govern)' }}>Govern · Policy</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Policy & Rules</h1>
          <p className="text-sm text-slate-400">12 active policies · 0 violations · Last reviewed Feb 16, 2026.</p>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active policies', value: String(activePolicies), color: 'var(--engine-govern)' },
            { label: 'Violations (30d)', value: '0', color: 'var(--engine-protect)' },
            { label: 'Pending review', value: String(pendingReview), color: 'var(--engine-execute)' },
            { label: 'Compliance', value: '100%', color: 'var(--engine-protect)' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
              <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Main 2-col */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Policy list */}
          <div className="flex-1 lg:w-2/3 flex flex-col gap-4">
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              {displayed.map((p) => (
                <div key={p.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                  <div className="p-4 md:p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${categoryColors[p.category]}20`, color: categoryColors[p.category] }}>{p.category}</span>
                      {p.status === 'Active' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{p.status}</span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">{p.status}</span>
                      )}
                      <div className="flex gap-1 ml-auto">
                        {p.engines.map((e) => (
                          <span key={e} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full border border-white/10 text-white/30">{e}</span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">{p.name}</h3>
                    <p className="text-xs text-slate-400 mb-2">{p.desc}</p>
                    <div className="flex items-center gap-3 text-[10px] text-white/30">
                      <span>Last reviewed: {p.reviewed}</span>
                    </div>
                    <button onClick={() => setExpanded(expanded === p.name ? null : p.name)} className="flex items-center gap-1 mt-2 text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-govern)' }}>
                      <EyeIcon className="h-3 w-3" />{expanded === p.name ? 'Hide details' : 'View details'}
                      <ChevronDown className={`h-3 w-3 transition-transform ${expanded === p.name ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {expanded === p.name && (
                    <div className="px-4 md:px-5 pb-4 border-t border-white/[0.06]">
                      <div className="rounded-xl bg-white/[0.02] p-3 mt-3 font-mono text-xs text-white/50 leading-relaxed">{p.fullText}</div>
                      <div className="flex flex-wrap gap-3 mt-3 text-xs">
                        <span className="text-white/30">Violations: <span className="text-emerald-400">{p.violations}</span></span>
                        <span className="text-white/30">Enforcement: <span className="text-white/60">{p.enforcement}</span></span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 transition-colors">
                          <Edit className="h-3 w-3" />Edit
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 transition-colors">
                          <Clock className="h-3 w-3" />Request review
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {!showAll && (
                <button onClick={() => setShowAll(true)} className="text-sm font-medium hover:opacity-80 transition-opacity text-center py-2" style={{ color: 'var(--engine-govern)' }}>
                  Show all 12 policies
                </button>
              )}
            </motion.div>
          </div>

          {/* Side rail */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
            {/* Policy health */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Policy Health</h3>
              <div className="flex flex-col gap-3">
                {policyHealth.map((ph) => (
                  <div key={ph.category}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: categoryColors[ph.category] }}>{ph.category}</span>
                      <span className="text-white/50">{ph.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${(ph.count / 4) * 100}%`, background: categoryColors[ph.category] }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Compliance calendar */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Upcoming Reviews</h3>
              <div className="flex flex-col gap-2.5">
                {upcomingReviews.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-white/20 shrink-0" />
                    <span className="text-white/30 w-12 shrink-0">{r.date}</span>
                    <span className="text-white/60 truncate">{r.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick add */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
              <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--engine-govern)' }}>
                <Plus className="h-3.5 w-3.5" />Draft new policy
              </button>
            </motion.div>
          </div>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/policy'].auditId} pageContext={GOVERNANCE_META['/govern/policy'].pageContext} />
      </motion.div>
    </div>
  );
}

export default GovernPolicy;
