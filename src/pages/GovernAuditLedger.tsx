import React, { useState } from 'react';
import { useRouter } from '../router';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  ArrowUpDown,
  User,
  CircleDot,
  FileText,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type DecisionType = 'Protect' | 'Grow' | 'Execute' | 'Govern';
type DecisionStatus = 'Verified' | 'Pending review' | 'Flagged';
type FilterTab = 'All' | 'Verified' | 'Pending review' | 'Flagged';
type SortField = 'id' | 'timestamp' | 'confidence' | 'evidence';
type SortDir = 'asc' | 'desc';

interface AuditEntry {
  id: string;
  timestamp: string;
  sortTime: number;
  type: DecisionType;
  action: string;
  confidence: number;
  evidence: number;
  status: DecisionStatus;
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const filterTabs: { label: FilterTab; count?: number }[] = [
  { label: 'All' },
  { label: 'Verified', count: 789 },
  { label: 'Pending review', count: 55 },
  { label: 'Flagged', count: 3 },
];

const auditEntries: AuditEntry[] = [
  { id: 'GV-2026-0216-847', timestamp: '14:28 Today', sortTime: 8, type: 'Execute', action: 'Portfolio rebalance', confidence: 0.97, evidence: 12, status: 'Verified' },
  { id: 'GV-2026-0216-846', timestamp: '14:15 Today', sortTime: 7, type: 'Protect', action: 'Block wire transfer', confidence: 0.94, evidence: 9, status: 'Verified' },
  { id: 'GV-2026-0216-845', timestamp: '13:52 Today', sortTime: 6, type: 'Grow', action: 'Subscription consolidation', confidence: 0.89, evidence: 7, status: 'Verified' },
  { id: 'GV-2026-0216-844', timestamp: '11:20 Today', sortTime: 5, type: 'Execute', action: 'Archive invoices', confidence: 0.78, evidence: 5, status: 'Pending review' },
  { id: 'GV-2026-0215-843', timestamp: 'Yesterday', sortTime: 4, type: 'Protect', action: 'Unusual transaction', confidence: 0.92, evidence: 10, status: 'Verified' },
  { id: 'GV-2026-0215-842', timestamp: 'Yesterday', sortTime: 3, type: 'Grow', action: 'Goal update', confidence: 0.86, evidence: 6, status: 'Verified' },
  { id: 'GV-2026-0214-841', timestamp: 'Feb 14', sortTime: 2, type: 'Execute', action: 'Payment processed', confidence: 0.91, evidence: 8, status: 'Verified' },
  { id: 'GV-2026-0214-840', timestamp: 'Feb 14', sortTime: 1, type: 'Govern', action: 'Policy update', confidence: 1.00, evidence: 15, status: 'Verified' },
];

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/* ═══════════════════════════════════════════
   UTILITY HELPERS
   ═══════════════════════════════════════════ */

const typeColor: Record<DecisionType, string> = {
  Protect: '#14B8A6',
  Grow: '#8B5CF6',
  Execute: '#EAB308',
  Govern: '#3B82F6',
};

const typeBg: Record<DecisionType, string> = {
  Protect: 'rgba(20,184,166,0.12)',
  Grow: 'rgba(139,92,246,0.12)',
  Execute: 'rgba(234,179,8,0.12)',
  Govern: 'rgba(59,130,246,0.12)',
};

const statusConfig: Record<DecisionStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Verified: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: CheckCircle2 },
  'Pending review': { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: Clock },
  Flagged: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: AlertTriangle },
};

function getConfidenceColor(c: number): string {
  if (c >= 0.9) return '#10B981';
  if (c >= 0.8) return '#3B82F6';
  if (c >= 0.7) return '#F59E0B';
  return '#EF4444';
}

/* ═══════════════════════════════════════════
   GLASS CARD COMPONENT
   ═══════════════════════════════════════════ */

function GlassCard({
  children,
  className = '',
  borderColor,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { borderColor?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] p-4 md:p-6 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        ...(borderColor ? { borderLeftWidth: '2px', borderLeftColor: borderColor } : {}),
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

function TypeBadge({ type }: { type: DecisionType }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: typeBg[type], color: typeColor[type] }}
    >
      <CircleDot size={10} />
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: DecisionStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
      aria-label={`Status: ${status}`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════
   HEADER + SEARCH + FILTERS
   ═══════════════════════════════════════════ */

function HeroSection({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  activeFilter: FilterTab;
  onFilterChange: (tab: FilterTab) => void;
}) {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={fadeUp}>
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase"
          style={{
            borderColor: 'rgba(59,130,246,0.3)',
            background: 'rgba(59,130,246,0.08)',
            color: '#3B82F6',
          }}
        >
          <ShieldCheck size={12} />
          Audit Ledger
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h1
          className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance"
          style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
        >
          Audit Ledger
        </h1>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          Immutable record of 847 decisions with full evidence chain
        </p>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeUp}>
        <div
          className="flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
        >
          <Search size={16} style={{ color: '#64748B' }} aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by decision ID, type, or date..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#475569]"
            style={{ color: '#F1F5F9' }}
            aria-label="Search audit ledger"
          />
        </div>
      </motion.div>

      {/* Filter pills */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2" role="tablist" aria-label="Filter decisions">
        {filterTabs.map((f) => {
          const isActive = f.label === activeFilter;
          return (
            <button
              key={f.label}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(f.label)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: isActive ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                color: isActive ? '#3B82F6' : '#94A3B8',
                border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                minHeight: '44px',
              }}
            >
              {f.label}
              {f.count != null && (
                <span className="text-[10px]" style={{ color: isActive ? '#3B82F6' : '#64748B' }}>
                  ({f.count})
                </span>
              )}
            </button>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   AUDIT TABLE
   ═══════════════════════════════════════════ */

function AuditTable({
  entries,
  sortField,
  sortDir,
  onSort,
}: {
  entries: AuditEntry[];
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}) {
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={11} style={{ color: '#475569' }} />;
    return sortDir === 'asc' ? (
      <ArrowUp size={11} style={{ color: '#3B82F6' }} />
    ) : (
      <ArrowDown size={11} style={{ color: '#3B82F6' }} />
    );
  };

  return (
    <motion.section variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
      {/* Desktop table */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th
                    className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none"
                    style={{ color: '#64748B' }}
                    scope="col"
                    onClick={() => onSort('id')}
                    aria-sort={sortField === 'id' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <div className="flex items-center gap-1">Decision ID <SortIndicator field="id" /></div>
                  </th>
                  <th
                    className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none"
                    style={{ color: '#64748B' }}
                    scope="col"
                    onClick={() => onSort('timestamp')}
                    aria-sort={sortField === 'timestamp' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <div className="flex items-center gap-1">Timestamp <SortIndicator field="timestamp" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#64748B' }} scope="col">Type</th>
                  <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#64748B' }} scope="col">Action</th>
                  <th
                    className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none"
                    style={{ color: '#64748B' }}
                    scope="col"
                    onClick={() => onSort('confidence')}
                    aria-sort={sortField === 'confidence' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <div className="flex items-center gap-1">Confidence <SortIndicator field="confidence" /></div>
                  </th>
                  <th
                    className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold cursor-pointer select-none"
                    style={{ color: '#64748B' }}
                    scope="col"
                    onClick={() => onSort('evidence')}
                    aria-sort={sortField === 'evidence' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <div className="flex items-center gap-1">Evidence <SortIndicator field="evidence" /></div>
                  </th>
                  <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#64748B' }} scope="col">Status</th>
                  <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#64748B' }} scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <motion.tr
                    key={entry.id}
                    variants={fadeUp}
                    className="group transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-4 py-3.5">
                      <button
                        className="text-sm font-mono font-medium transition-colors hover:underline cursor-pointer"
                        style={{ color: '#3B82F6', background: 'transparent', border: 'none' }}
                        aria-label={`View details for ${entry.id}`}
                      >
                        {entry.id}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs" style={{ color: '#94A3B8' }}>{entry.timestamp}</span>
                    </td>
                    <td className="px-4 py-3.5"><TypeBadge type={entry.type} /></td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm" style={{ color: '#CBD5E1' }}>{entry.action}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono tabular-nums" style={{ color: getConfidenceColor(entry.confidence) }}>
                        {entry.confidence.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-mono tabular-nums" style={{ color: '#CBD5E1' }}>{entry.evidence}</span>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={entry.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                          style={{
                            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                            color: '#ffffff',
                            minHeight: '32px',
                          }}
                          aria-label={`View details for ${entry.id}`}
                        >
                          Details
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
                          style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#94A3B8', background: 'transparent' }}
                          aria-label={`Export entry ${entry.id}`}
                        >
                          <Download size={11} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {entries.map((entry) => (
          <motion.div key={entry.id} variants={fadeUp}>
            <GlassCard className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={entry.type} />
                <StatusBadge status={entry.status} />
                <span className="ml-auto text-xs" style={{ color: '#64748B' }}>{entry.timestamp}</span>
              </div>
              <button
                className="text-sm font-mono font-medium text-left transition-colors hover:underline cursor-pointer"
                style={{ color: '#3B82F6', background: 'transparent', border: 'none', padding: 0 }}
                aria-label={`View details for ${entry.id}`}
              >
                {entry.id}
              </button>
              <span className="text-xs" style={{ color: '#CBD5E1' }}>{entry.action}</span>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#64748B' }}>
                  {entry.evidence} evidence pts | Conf: {entry.confidence.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#ffffff', minHeight: '44px' }}
                  aria-label={`View details for ${entry.id}`}
                >
                  Details
                </button>
                <button
                  className="inline-flex items-center justify-center gap-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#94A3B8', background: 'transparent', minHeight: '44px' }}
                  aria-label={`Export entry ${entry.id}`}
                >
                  <Download size={14} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR COMPONENTS
   ═══════════════════════════════════════════ */

function AuditSummary() {
  const data = [
    { label: 'Total decisions', value: '847' },
    { label: 'Verified', value: '789 (93%)', color: '#10B981' },
    { label: 'Pending', value: '55 (6%)', color: '#F59E0B' },
    { label: 'Flagged', value: '3 (1%)', color: '#EF4444' },
    { label: 'Avg evidence', value: '8.4 pts' },
    { label: 'Compliance', value: '100%', color: '#10B981' },
  ];

  return (
    <GlassCard className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Audit Summary
      </h3>
      {data.map((d) => (
        <div key={d.label} className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#64748B' }}>{d.label}</span>
          <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: d.color || '#F1F5F9' }}>
            {d.value}
          </span>
        </div>
      ))}
    </GlassCard>
  );
}

function EvidenceFlowDiagram() {
  const steps = ['Data Source', 'AI Analysis', 'Evidence Aggregation', 'Confidence Score', 'Audit Record'];
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Evidence Flow
      </h3>
      <div className="flex flex-col items-center gap-0">
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <div
              className="w-full flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#93C5FD' }}
            >
              {step}
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center justify-center py-1" aria-hidden="true">
                <ArrowDown size={14} style={{ color: '#3B82F6' }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </GlassCard>
  );
}

function ExportOptionsPanel() {
  return (
    <GlassCard className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Export Options
      </h3>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
      >
        <Download size={14} />
        Export full ledger (CSV)
      </button>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
      >
        <FileText size={14} />
        Generate compliance report (PDF)
      </button>
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xs" style={{ color: '#64748B' }}>Last export</span>
        <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>2 hours ago</span>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════
   GOVERNANCE FOOTER
   ═══════════════════════════════════════════ */

function GovernFooter() {
  const { navigate } = useRouter();
  return (
    <footer
      className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/[0.06] px-4 py-3 md:px-6 md:py-4"
      style={{ background: 'rgba(255,255,255,0.03)' }}
      role="contentinfo"
      aria-label="Governance verification footer"
    >
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 28, height: 28, background: 'rgba(59,130,246,0.12)' }}
        >
          <ShieldCheck size={14} style={{ color: '#3B82F6' }} />
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}
        >
          <Shield size={10} />
          Verified
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: '#64748B' }}>
            GV-2026-0216-AUDIT
          </span>
          <ExternalLink size={12} style={{ color: '#64748B' }} aria-hidden="true" />
        </div>
        <span className="text-[10px] font-mono" style={{ color: '#475569' }}>
          0x4f2a...8b3c
        </span>
      </div>
      <button
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
        aria-label="Request human review of audit records"
        onClick={() => navigate('/govern/oversight')}
      >
        <User size={14} />
        Request human review
      </button>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export function GovernAudit() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Filter & sort entries
  let filtered = auditEntries;
  if (activeFilter !== 'All') {
    filtered = filtered.filter((e) => e.status === activeFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.id.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.timestamp.toLowerCase().includes(q)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'id':
        cmp = a.id.localeCompare(b.id);
        break;
      case 'timestamp':
        cmp = a.sortTime - b.sortTime;
        break;
      case 'confidence':
        cmp = a.confidence - b.confidence;
        break;
      case 'evidence':
        cmp = a.evidence - b.evidence;
        break;
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#3B82F6', color: '#ffffff' }}
      >
        Skip to main content
      </a>

      <div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        role="main"
      >
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <AuditTable entries={sorted} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
          </div>
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Audit sidebar">
            <AuditSummary />
            <EvidenceFlowDiagram />
            <ExportOptionsPanel />
          </aside>
        </div>

        <GovernFooter />
      </div>
    </div>
  );
}

export default GovernAudit;
