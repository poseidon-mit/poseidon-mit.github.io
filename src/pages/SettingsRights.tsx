import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Download, PauseCircle, Trash2, Lock, FileText, Database, ChevronDown } from 'lucide-react';
import { Link } from '../router';
import { GovernFooter } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets';
import { Button, Toggle, Surface } from '@/design-system';

const dataInventory = [
{ category: 'Transactions', records: '1,247', retention: '2 years' },
{ category: 'Account data', records: '1', retention: 'Lifetime' },
{ category: 'AI decisions', records: '1,247', retention: '1 year' },
{ category: 'Audit logs', records: '2,891', retention: '7 years' },
{ category: 'Session data', records: '45', retention: '90 days' }];


const consentItems = [
{ label: 'AI model improvement', enabled: true },
{ label: 'Cross-engine data sharing', enabled: true },
{ label: 'Third-party enrichment', enabled: false },
{ label: 'Analytics', enabled: true }];


export function SettingsRights() {
  const [deleteInput, setDeleteInput] = useState('');
  const [expandedInventory, setExpandedInventory] = useState<string | null>(null);
  const [consents, setConsents] = useState(consentItems);
  const deleteConfirmed = deleteInput === 'DELETE';

  const toggleConsent = (idx: number) => {
    setConsents((prev) => prev.map((c, i) => i === idx ? { ...c, enabled: !c.enabled } : c));
  };

  return (
    <div className="min-h-screen w-full">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold" style={{ background: 'var(--engine-govern)', color: '#fff' }}>Skip to main content</a>

      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]" aria-label="Breadcrumb">
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
              <Shield className="h-4 w-4" style={{ color: 'var(--engine-govern)' }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-govern)' }}>Settings · Data Rights</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Your Data Rights</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-sm text-slate-400">GDPR · CCPA compliant · Exercise your rights at any time.</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: 'var(--engine-govern)', color: 'var(--engine-govern)' }}>GDPR</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: 'var(--engine-govern)', color: 'var(--engine-govern)' }}>CCPA</span>
          </div>
        </motion.div>

        {/* KPI bar */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
          { label: 'Data stored', value: '847 MB', color: 'var(--engine-govern)' },
          { label: 'Active requests', value: '0', color: 'var(--engine-protect)' },
          { label: 'Retention', value: '2 years', color: '#94A3B8' },
          { label: 'Last export', value: 'Never', color: 'var(--engine-execute)' }].
          map((kpi) => <Surface
            key={kpi.label} className="rounded-2xl" variant="glass" padding="md">
              <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
              <p className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            </Surface>
          )}
        </motion.div>

        {/* Rights actions 3-col */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Surface className="rounded-2xl flex flex-col gap-3" variant="glass" padding="md">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Download className="h-5 w-5" style={{ color: 'var(--engine-govern)' }} />
            </div>
            <h3 className="text-sm font-semibold text-white">Export My Data</h3>
            <p className="text-xs text-slate-400">Download a copy of your data</p>
            <div className="mt-auto flex flex-col gap-2">
              <Button variant="glass" engine="govern" size="sm" fullWidth className="rounded-xl text-xs">Export as JSON</Button>
              <Button variant="secondary" engine="govern" size="sm" fullWidth className="rounded-xl text-xs">Export as CSV</Button>
            </div>
          </Surface>
          <Surface className="rounded-2xl flex flex-col gap-3" variant="glass" padding="md">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.15)' }}>
              <PauseCircle className="h-5 w-5" style={{ color: 'var(--engine-execute)' }} />
            </div>
            <h3 className="text-sm font-semibold text-white">Restrict Processing</h3>
            <p className="text-xs text-slate-400">Pause AI analysis</p>
            <Button variant="secondary" engine="execute" size="sm" className="mt-auto rounded-xl text-xs">Restrict processing</Button>
          </Surface>
          <Surface className="rounded-2xl flex flex-col gap-3" variant="glass" padding="md">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Delete my data</h3>
            <p className="text-xs text-slate-400">Permanently remove all personal data</p>
            <Button variant="danger" size="sm" className="mt-auto rounded-xl text-xs">
              Open delete flow
            </Button>
          </Surface>
        </motion.div>

        {/* Delete my data — inline confirmation with typed DELETE required */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 md:p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-red-400 mb-1">Delete my data</h2>
            <p className="text-xs text-white/50">This action is irreversible. All your personal data and AI decisions will be permanently removed.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/40" htmlFor="delete-confirm-input">
              Type <span className="font-mono font-bold text-white/60">DELETE</span> to confirm
            </label>
            <input
              id="delete-confirm-input"
              type="text"
              placeholder="Type DELETE to confirm"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)} className="rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-red-500/40"
            />

            
          </div>
          <Button
            disabled={!deleteConfirmed}
            variant="danger"
            size="sm"
            className="self-start rounded-xl text-xs disabled:opacity-40 disabled:cursor-not-allowed">
            
            {deleteConfirmed ? 'Permanently delete all data' : 'Type DELETE above to confirm'}
          </Button>
        </motion.div>

        {/* Active requests table */}
        <Surface variants={fadeUp} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
          <h2 className="text-sm font-semibold text-white mb-4">Active Requests</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-8 w-8 text-white/20 mb-2" />
            <p className="text-sm text-white/40">No active requests</p>
            <p className="text-xs text-white/20 mt-1">Data rights requests will appear here</p>
          </div>
        </Surface>

        {/* Data inventory accordion */}
        <Surface variants={fadeUp} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-white/40" />Data Inventory
          </h2>
          <div className="flex flex-col gap-2">
            {dataInventory.map((item) =>
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
                {expandedInventory === item.category &&
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
              }
              </div>
            )}
          </div>
        </Surface>

        {/* Consent management */}
        <Surface variants={fadeUp} className="rounded-2xl" variant="glass" padding="md" as={motion.div}>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-white/40" />Data consent scopes
          </h2>
          <div className="flex flex-col gap-3">
            {consents.map((c, idx) =>
            <div key={c.label} className="flex items-center justify-between py-2">
                <span className="text-sm text-white/60">{c.label}</span>
                <Toggle checked={c.enabled} onChange={() => toggleConsent(idx)} ariaLabel={`Toggle ${c.label}`} />
              </div>
            )}
          </div>
        </Surface>

        <GovernFooter auditId={GOVERNANCE_META['/settings/rights'].auditId} pageContext={GOVERNANCE_META['/settings/rights'].pageContext} />
      </motion.div>
    </div>);

}

export default SettingsRights;
