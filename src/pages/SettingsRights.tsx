import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Download, PauseCircle, Trash2, Lock, FileText, Database, ChevronDown } from 'lucide-react';
import { Link } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const dataInventory = [
  { category: 'Transactions', records: '1,247', retention: '2 years' },
  { category: 'Account data', records: '1', retention: 'Lifetime' },
  { category: 'AI decisions', records: '1,247', retention: '1 year' },
  { category: 'Audit logs', records: '2,891', retention: '7 years' },
  { category: 'Session data', records: '45', retention: '90 days' },
];

const consentItems = [
  { label: 'AI model improvement', enabled: true },
  { label: 'Cross-engine data sharing', enabled: true },
  { label: 'Third-party enrichment', enabled: false },
  { label: 'Analytics', enabled: true },
];

export function SettingsRights() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedInventory, setExpandedInventory] = useState<string | null>(null);
  const [consents, setConsents] = useState(consentItems);

  const toggleConsent = (idx: number) => {
    setConsents((prev) => prev.map((c, i) => (i === idx ? { ...c, enabled: !c.enabled } : c)));
  };

  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: '#3B82F6', color: '#fff' }}>Skip to main content</a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(11,18,33,0.8)' }} aria-label="Breadcrumb">
        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link to="/settings" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#94A3B8' }}>
            <ArrowLeft className="h-4 w-4" />Settings
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Data Rights</span>
        </div>
      </nav>

      <motion.div id="main-content" className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8" style={{ maxWidth: '1280px' }} variants={stagger} initial="hidden" animate="visible" role="main">
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Shield className="h-4 w-4" style={{ color: '#3B82F6' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#3B82F6' }}>Settings · Data Rights</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Your Data Rights</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-sm text-slate-400">GDPR · CCPA compliant · Exercise your rights at any time.</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: '#3B82F6', color: '#3B82F6' }}>GDPR</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: '#3B82F6', color: '#3B82F6' }}>CCPA</span>
          </div>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Data stored', value: '847 MB', color: '#3B82F6' },
            { label: 'Active requests', value: '0', color: '#22C55E' },
            { label: 'Retention', value: '2 years', color: '#94A3B8' },
            { label: 'Last export', value: 'Never', color: '#EAB308' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
              <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Rights actions 3-col */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Download className="h-5 w-5" style={{ color: '#3B82F6' }} />
            </div>
            <h3 className="text-sm font-semibold text-white">Export My Data</h3>
            <p className="text-xs text-slate-400">Download JSON or CSV</p>
            <button className="mt-auto px-4 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: '#3B82F6' }}>Request export</button>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.15)' }}>
              <PauseCircle className="h-5 w-5" style={{ color: '#EAB308' }} />
            </div>
            <h3 className="text-sm font-semibold text-white">Restrict Processing</h3>
            <p className="text-xs text-slate-400">Pause AI analysis</p>
            <button className="mt-auto px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-amber-500/10 transition-colors" style={{ borderColor: 'rgba(234,179,8,0.3)', color: '#EAB308' }}>Restrict processing</button>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Delete All Data</h3>
            <p className="text-xs text-slate-400">Irreversible.</p>
            <button onClick={() => setShowDeleteModal(true)} className="mt-auto px-4 py-2 rounded-xl text-xs font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Delete all data</button>
          </div>
        </motion.div>

        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <motion.div variants={fadeUp} className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 md:p-6">
            <h3 className="text-sm font-semibold text-red-400 mb-2">Confirm Data Deletion</h3>
            <p className="text-xs text-white/50 mb-3">This action is irreversible. All your data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-colors">Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">Permanently delete</button>
            </div>
          </motion.div>
        )}

        {/* Active requests table */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Active Requests</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-8 w-8 text-white/20 mb-2" />
            <p className="text-sm text-white/40">No active requests</p>
            <p className="text-xs text-white/20 mt-1">Data rights requests will appear here</p>
          </div>
        </motion.div>

        {/* Data inventory accordion */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-white/40" />Data Inventory
          </h2>
          <div className="flex flex-col gap-2">
            {dataInventory.map((item) => (
              <div key={item.category} className="border border-white/[0.06] rounded-xl overflow-hidden">
                <button onClick={() => setExpandedInventory(expandedInventory === item.category ? null : item.category)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white">{item.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">{item.records} records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30">{item.retention}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-white/30 transition-transform ${expandedInventory === item.category ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {expandedInventory === item.category && (
                  <div className="px-4 pb-3 border-t border-white/[0.06]">
                    <div className="grid grid-cols-3 gap-4 py-2 text-xs">
                      <div>
                        <p className="text-white/30 mb-0.5">Records</p>
                        <p className="text-white/70 font-medium">{item.records}</p>
                      </div>
                      <div>
                        <p className="text-white/30 mb-0.5">Retention</p>
                        <p className="text-white/70 font-medium">{item.retention}</p>
                      </div>
                      <div>
                        <p className="text-white/30 mb-0.5">Last updated</p>
                        <p className="text-white/70 font-medium">2m ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Consent management */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-white/40" />Consent Management
          </h2>
          <div className="flex flex-col gap-3">
            {consents.map((c, idx) => (
              <div key={c.label} className="flex items-center justify-between py-2">
                <span className="text-sm text-white/60">{c.label}</span>
                <button
                  onClick={() => toggleConsent(idx)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${c.enabled ? '' : 'bg-white/10'}`}
                  style={c.enabled ? { background: '#3B82F6' } : {}}
                  role="switch"
                  aria-checked={c.enabled}
                  aria-label={`Toggle ${c.label}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${c.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Govern footer */}
        <motion.footer variants={fadeUp} className="flex flex-wrap items-center gap-3 rounded-2xl border-t border-white/10 bg-white/[0.03] px-4 py-3" role="contentinfo">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Verified</span>
          <span className="text-xs font-mono text-white/30">GV-2026-0216-RIGHTS</span>
          <span className="text-xs text-white/20">·</span>
          <span className="text-xs text-white/30">DataGovernance v1.2</span>
          <button className="ml-auto text-xs text-white/40 hover:text-white/60 transition-colors">Request human review</button>
        </motion.footer>
      </motion.div>
    </div>
  );
}

export default SettingsRights;
