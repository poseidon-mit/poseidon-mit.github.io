import React, { useState } from 'react';
import { useRouter } from '../router';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Zap,
  Clock,
  Download,
  Mail,
  User,
  CircleDot,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type ActionType = 'Approved' | 'Rejected' | 'Auto-executed';
type SourceEngine = 'Protect' | 'Grow' | 'Execute' | 'Govern';

interface HistoryItem {
  id: string;
  time: string;
  type: ActionType;
  action: string;
  source: SourceEngine;
  confidence: number;
  detail: string;
  amount?: string;
  approvedBy?: string;
  reason?: string;
  executionStatus: string;
}

type FilterTab = 'All' | 'Approved' | 'Rejected' | 'Auto-executed';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const filters: { label: FilterTab; count?: number }[] = [
  { label: 'All' },
  { label: 'Approved', count: 32 },
  { label: 'Rejected', count: 8 },
  { label: 'Auto-executed', count: 207 },
];

interface DayGroup {
  date: string;
  count: number;
  items: HistoryItem[];
}

const historyData: DayGroup[] = [
  {
    date: 'Today',
    count: 12,
    items: [
      {
        id: 'h1',
        time: '14:28',
        type: 'Approved',
        action: 'Block wire transfer',
        source: 'Protect',
        confidence: 0.94,
        detail: 'Unusual merchant + high-risk geography',
        approvedBy: 'You',
        amount: '$12,400',
        executionStatus: 'Executed',
      },
      {
        id: 'h2',
        time: '13:52',
        type: 'Auto-executed',
        action: 'Rebalance portfolio',
        source: 'Grow',
        confidence: 0.87,
        detail: 'Auto-approved (threshold 0.85)',
        amount: '$24k allocation',
        executionStatus: 'Completed',
      },
      {
        id: 'h3',
        time: '11:20',
        type: 'Rejected',
        action: 'Archive old invoices',
        source: 'Govern',
        confidence: 0.78,
        detail: 'Manual review required',
        approvedBy: 'You',
        reason: 'Manual review required',
        executionStatus: 'Cancelled',
      },
    ],
  },
  {
    date: 'Yesterday',
    count: 18,
    items: [
      {
        id: 'h4',
        time: '16:45',
        type: 'Approved',
        action: 'Consolidate subscriptions',
        source: 'Grow',
        confidence: 0.89,
        detail: '3 overlapping tools detected',
        approvedBy: 'You',
        amount: '$140/mo savings',
        executionStatus: 'Scheduled for Feb 20',
      },
      {
        id: 'h5',
        time: '14:20',
        type: 'Auto-executed',
        action: 'Pay invoice #4287',
        source: 'Execute',
        confidence: 0.92,
        detail: 'Auto-approved',
        amount: '$1,240',
        executionStatus: 'Completed',
      },
      {
        id: 'h6',
        time: '09:15',
        type: 'Rejected',
        action: 'Sell ETF shares',
        source: 'Grow',
        confidence: 0.81,
        detail: 'Market timing concern',
        approvedBy: 'You',
        reason: 'Market timing concern',
        executionStatus: 'Cancelled',
      },
    ],
  },
  {
    date: 'Feb 14',
    count: 24,
    items: [
      {
        id: 'h7',
        time: '15:30',
        type: 'Auto-executed',
        action: 'Transfer to savings',
        source: 'Execute',
        confidence: 0.95,
        detail: 'Scheduled auto-transfer',
        amount: '$500',
        executionStatus: 'Completed',
      },
      {
        id: 'h8',
        time: '12:10',
        type: 'Approved',
        action: 'Update spending limit',
        source: 'Protect',
        confidence: 0.88,
        detail: 'Spending limit adjustment',
        approvedBy: 'You',
        executionStatus: 'Completed',
      },
      {
        id: 'h9',
        time: '08:45',
        type: 'Auto-executed',
        action: 'Recurring bill payment',
        source: 'Execute',
        confidence: 0.99,
        detail: 'Monthly bill payment',
        amount: '$89.99',
        executionStatus: 'Completed',
      },
    ],
  },
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

const typeConfig: Record<ActionType, { color: string; bg: string; icon: React.ElementType }> = {
  Approved: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: CheckCircle2 },
  Rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: XCircle },
  'Auto-executed': { color: '#14B8A6', bg: 'rgba(20,184,166,0.12)', icon: Zap },
};

const engineColor: Record<SourceEngine, string> = {
  Protect: '#14B8A6',
  Grow: '#8B5CF6',
  Execute: '#EAB308',
  Govern: '#3B82F6',
};

const engineBg: Record<SourceEngine, string> = {
  Protect: 'rgba(20,184,166,0.12)',
  Grow: 'rgba(139,92,246,0.12)',
  Execute: 'rgba(234,179,8,0.12)',
  Govern: 'rgba(59,130,246,0.12)',
};

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

function EngineBadge({ engine }: { engine: SourceEngine }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: engineBg[engine], color: engineColor[engine] }}
    >
      <CircleDot size={10} />
      {engine}
    </span>
  );
}

function TypeBadge({ type }: { type: ActionType }) {
  const cfg = typeConfig[type];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={11} />
      {type}
    </span>
  );
}

/* ═══════════════════════════════════════════
   HERO + FILTERS
   ═══════════════════════════════════════════ */

function HeroSection({
  activeFilter,
  onFilterChange,
}: {
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
            borderColor: 'rgba(234,179,8,0.3)',
            background: 'rgba(234,179,8,0.08)',
            color: '#EAB308',
          }}
        >
          <Clock size={12} />
          Execution History
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h1
          className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance"
          style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
        >
          Execution History
        </h1>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          Complete audit trail of 247 actions in the last 30 days
        </p>
      </motion.div>

      {/* Filter pills */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2" role="tablist" aria-label="Filter actions">
        {filters.map((f) => {
          const isActive = f.label === activeFilter;
          return (
            <button
              key={f.label}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(f.label)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: isActive ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.05)',
                color: isActive ? '#EAB308' : '#94A3B8',
                border: isActive ? '1px solid rgba(234,179,8,0.3)' : '1px solid transparent',
                minHeight: '44px',
              }}
            >
              {f.label}
              {f.count != null && (
                <span className="text-[10px]" style={{ color: isActive ? '#EAB308' : '#64748B' }}>
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
   TIMELINE LIST
   ═══════════════════════════════════════════ */

function HistoryTimeline({ activeFilter }: { activeFilter: FilterTab }) {
  return (
    <motion.section variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-6">
      {historyData.map((group) => {
        const filtered = activeFilter === 'All'
          ? group.items
          : group.items.filter((item) => item.type === activeFilter);

        if (filtered.length === 0) return null;

        return (
          <div key={group.date} className="flex flex-col gap-3">
            <motion.h3
              variants={fadeUp}
              className="text-sm font-semibold flex items-center gap-2"
              style={{ color: '#F1F5F9' }}
            >
              {group.date}
              <span
                className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#64748B' }}
              >
                {group.count} actions
              </span>
            </motion.h3>

            <div className="flex flex-col gap-3">
              {filtered.map((item) => {
                const tc = typeConfig[item.type];
                return (
                  <motion.div key={item.id} variants={fadeUp}>
                    <GlassCard
                      className="flex flex-col gap-3 transition-all hover:bg-white/[0.02]"
                      borderColor={item.type === 'Rejected' ? '#EF4444' : undefined}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono tabular-nums" style={{ color: '#64748B' }}>
                          {item.time}
                        </span>
                        <TypeBadge type={item.type} />
                        <EngineBadge engine={item.source} />
                      </div>

                      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                        <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                          {item.action}
                        </span>
                        {item.amount && (
                          <span className="text-sm font-mono tabular-nums" style={{ color: '#CBD5E1' }}>
                            {item.amount}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: '#94A3B8' }}>
                        <span>Confidence: {item.confidence.toFixed(2)}</span>
                        {item.approvedBy && <span>{item.type === 'Rejected' ? 'Rejected' : 'Approved'} by: {item.approvedBy}</span>}
                        {item.reason && <span>Reason: {item.reason}</span>}
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ background: tc.bg, color: tc.color }}
                        >
                          {item.executionStatus}
                        </span>
                      </div>

                      <button
                        className="self-start text-xs font-medium transition-colors hover:underline cursor-pointer"
                        style={{ color: '#14B8A6', background: 'transparent', border: 'none', padding: 0, minHeight: '24px' }}
                        aria-label={`View details for ${item.action}`}
                      >
                        View details
                      </button>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR COMPONENTS
   ═══════════════════════════════════════════ */

function SummaryStats() {
  const stats = [
    { label: 'Total actions', value: '247', sub: 'last 30 days' },
    { label: 'Approved', value: '32', sub: '13%', color: '#10B981' },
    { label: 'Auto-executed', value: '207', sub: '84%', color: '#14B8A6' },
    { label: 'Rejected', value: '8', sub: '3%', color: '#EF4444' },
    { label: 'Success rate', value: '97%', color: '#10B981' },
  ];

  return (
    <GlassCard className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Summary
      </h3>
      {stats.map((s) => (
        <div key={s.label} className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#64748B' }}>{s.label}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold font-mono tabular-nums" style={{ color: s.color || '#F1F5F9' }}>
              {s.value}
            </span>
            {s.sub && <span className="text-[10px]" style={{ color: '#64748B' }}>({s.sub})</span>}
          </div>
        </div>
      ))}
    </GlassCard>
  );
}

function EngineFilters() {
  const engines: { name: SourceEngine; count: number }[] = [
    { name: 'Protect', count: 12 },
    { name: 'Grow', count: 87 },
    { name: 'Execute', count: 142 },
    { name: 'Govern', count: 6 },
  ];

  return (
    <GlassCard className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Source Engine
      </h3>
      {engines.map((e) => (
        <label key={e.name} className="flex items-center gap-3 cursor-pointer" style={{ minHeight: '32px' }}>
          <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: engineColor[e.name] }} />
          <span className="text-xs font-medium flex-1" style={{ color: '#CBD5E1' }}>{e.name}</span>
          <span className="text-[10px] font-mono" style={{ color: '#64748B' }}>({e.count})</span>
        </label>
      ))}
    </GlassCard>
  );
}

function ExportOptions() {
  return (
    <GlassCard className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Export
      </h3>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
      >
        <Download size={14} />
        Export CSV
      </button>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
      >
        <Download size={14} />
        Export PDF report
      </button>
      <button
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
      >
        <Mail size={14} />
        Send to email
      </button>
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
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: '#64748B' }}>
          GV-2026-0216-EXEC-HIST
        </span>
        <ExternalLink size={12} style={{ color: '#64748B' }} aria-hidden="true" />
      </div>
      <button
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
        aria-label="Request human review of execution history"
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

export function ExecuteHistory() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  return (
    <div className="min-h-screen w-full" style={{ background: '#0B1221' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#EAB308', color: '#0B1221' }}
      >
        Skip to main content
      </a>

      <div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        role="main"
      >
        <HeroSection activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <HistoryTimeline activeFilter={activeFilter} />
          </div>
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="History sidebar">
            <SummaryStats />
            <EngineFilters />
            <ExportOptions />
          </aside>
        </div>

        <GovernFooter />
      </div>
    </div>
  );
}

export default ExecuteHistory;
