import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingUp,
  Archive,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  CircleDot,
  User,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM';
type Engine = 'Protect' | 'Grow' | 'Govern';
type ActionStatus = 'pending' | 'approved' | 'rejected' | 'auto-executed';

interface ActionItem {
  id: string;
  priority: Priority;
  action: string;
  detail: string;
  engine: Engine;
  confidence: number;
  amount: string;
  timeAgo: string;
  status: ActionStatus;
}

interface RecentExecution {
  action: string;
  engine: Engine;
  timeAgo: string;
  status: 'Approved' | 'Rejected' | 'Auto-executed';
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const initialActions: ActionItem[] = [
  {
    id: 'act-1',
    priority: 'CRITICAL',
    action: 'Block wire transfer to MerchantX',
    detail: 'Unusual merchant + high-risk geography + amount deviation',
    engine: 'Protect',
    confidence: 0.94,
    amount: '$12,400',
    timeAgo: '4 min ago',
    status: 'pending',
  },
  {
    id: 'act-2',
    priority: 'HIGH',
    action: 'Consolidate subscriptions',
    detail: '3 overlapping tools detected, usage <30% on 2',
    engine: 'Grow',
    confidence: 0.89,
    amount: 'Save $140/mo',
    timeAgo: '18 min ago',
    status: 'pending',
  },
  {
    id: 'act-3',
    priority: 'HIGH',
    action: 'Rebalance portfolio allocation',
    detail: 'Target allocation drift 8.2%, rebalance to 60/40',
    engine: 'Grow',
    confidence: 0.87,
    amount: '$24k allocation',
    timeAgo: '1 hr ago',
    status: 'pending',
  },
  {
    id: 'act-4',
    priority: 'MEDIUM',
    action: 'Archive old invoices',
    detail: 'Retention policy: archive after 7 years',
    engine: 'Govern',
    confidence: 0.78,
    amount: '142 items',
    timeAgo: '3 hr ago',
    status: 'pending',
  },
];

const recentExecutions: RecentExecution[] = [
  { action: 'Block wire transfer', engine: 'Protect', timeAgo: '2 min ago', status: 'Approved' },
  { action: 'Rebalance portfolio', engine: 'Grow', timeAgo: '18 min ago', status: 'Auto-executed' },
  { action: 'Archive invoices', engine: 'Govern', timeAgo: '1 hr ago', status: 'Approved' },
  { action: 'Consolidate tools', engine: 'Grow', timeAgo: '2 hr ago', status: 'Rejected' },
];

const confidenceData = [
  { range: '0.9-1.0', count: 6, fill: '#10B981' },
  { range: '0.8-0.9', count: 5, fill: '#14B8A6' },
  { range: '0.7-0.8', count: 3, fill: '#F59E0B' },
  { range: '<0.7', count: 0, fill: '#EF4444' },
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

const engineColor: Record<Engine, string> = {
  Protect: '#14B8A6',
  Grow: '#8B5CF6',
  Govern: '#3B82F6',
};

const engineBg: Record<Engine, string> = {
  Protect: 'rgba(20,184,166,0.12)',
  Grow: 'rgba(139,92,246,0.12)',
  Govern: 'rgba(59,130,246,0.12)',
};

const priorityConfig: Record<Priority, { color: string; bg: string; label: string }> = {
  CRITICAL: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'CRITICAL' },
  HIGH: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'HIGH' },
  MEDIUM: { color: '#64748B', bg: 'rgba(100,116,139,0.12)', label: 'MEDIUM' },
};

const statusConfig: Record<RecentExecution['status'], { color: string; bg: string }> = {
  Approved: { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  Rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  'Auto-executed': { color: '#14B8A6', bg: 'rgba(20,184,166,0.12)' },
};

function getConfidenceColor(c: number): string {
  if (c >= 0.9) return '#10B981';
  if (c >= 0.8) return '#14B8A6';
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

function EngineBadge({ engine }: { engine: Engine }) {
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

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {priority === 'CRITICAL' && <AlertTriangle size={11} />}
      {priority === 'HIGH' && <Zap size={11} />}
      {priority === 'MEDIUM' && <Layers size={11} />}
      {cfg.label}
    </span>
  );
}

function ConfidenceIndicator({ value }: { value: number }) {
  const color = getConfidenceColor(value);
  const pct = value * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-mono tabular-nums" style={{ color }}>{value.toFixed(2)}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */

function HeroSection() {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {/* Engine badge */}
      <motion.div variants={fadeUp}>
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase"
          style={{
            borderColor: 'rgba(234,179,8,0.3)',
            background: 'rgba(234,179,8,0.08)',
            color: '#EAB308',
          }}
        >
          <Zap size={12} />
          Execute Engine
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h1
          className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance"
          style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
        >
          4 actions pending review. Confidence 0.91. 2 ready to execute.
        </h1>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          AI-recommended actions across Protect, Grow, and Govern engines. Review threshold: 0.85+
        </p>
      </motion.div>

      {/* Featured AI insight card */}
      <motion.div variants={fadeUp}>
        <GlassCard borderColor="#EF4444" className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <PriorityBadge priority="CRITICAL" />
                <EngineBadge engine="Protect" />
              </div>
              <p className="text-sm md:text-base font-medium" style={{ color: '#F1F5F9' }}>
                Block wire transfer to MerchantX — fraud score 0.94, exceeds $5k threshold
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#64748B' }}>Confidence</span>
              <ConfidenceIndicator value={0.94} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                color: '#04141a',
              }}
              aria-label="Approve action: Block wire transfer to MerchantX"
            >
              <CheckCircle2 size={16} />
              Approve
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] active:scale-[0.98] cursor-pointer"
              style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#EF4444', background: 'transparent' }}
              aria-label="Reject action: Block wire transfer to MerchantX"
            >
              <XCircle size={16} />
              Reject
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.04] active:scale-[0.98] cursor-pointer"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent' }}
            >
              Review details
            </button>
          </div>
          {/* ProofLine */}
          <div
            className="flex flex-wrap items-center gap-1 text-xs"
            style={{ color: '#64748B' }}
            role="note"
            aria-label="Evidence trail"
          >
            <span>4 pending</span>
            <span aria-hidden="true">|</span>
            <span>Confidence 0.91</span>
            <span aria-hidden="true">|</span>
            <span className="font-mono">Model: ActionPrioritizer v2.4</span>
            <span aria-hidden="true">|</span>
            <span>Basis: Multi-engine risk aggregation</span>
          </div>
        </GlassCard>
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   KPI GRID
   ═══════════════════════════════════════════ */

interface KpiCardData {
  label: string;
  value: string;
  badge?: { text: string; color: string; bg: string };
  trend?: { text: string; color: string; icon: 'up' | 'down' };
}

const kpiData: KpiCardData[] = [
  {
    label: 'Pending Actions',
    value: '4',
    badge: { text: 'pending', color: '#EAB308', bg: 'rgba(234,179,8,0.12)' },
  },
  {
    label: 'Auto-approved Today',
    value: '12',
    trend: { text: '+3 from yesterday', color: '#10B981', icon: 'up' },
  },
  {
    label: 'Blocked Today',
    value: '1',
    badge: { text: 'blocked', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  },
  {
    label: 'Avg Review Time',
    value: '2.3 min',
    trend: { text: '-15% trend', color: '#10B981', icon: 'down' },
  },
];

function KpiGrid() {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      aria-label="Key performance indicators"
    >
      {kpiData.map((kpi) => (
        <motion.div key={kpi.label} variants={fadeUp}>
          <GlassCard className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider font-medium" style={{ color: '#64748B' }}>
              {kpi.label}
            </span>
            <div className="flex items-end gap-2">
              <span
                className="text-2xl md:text-3xl font-bold tabular-nums"
                style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
              >
                {kpi.value}
              </span>
              {kpi.badge && (
                <span
                  className="mb-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: kpi.badge.bg, color: kpi.badge.color }}
                >
                  {kpi.badge.text}
                </span>
              )}
            </div>
            {kpi.trend && (
              <span className="flex items-center gap-1 text-xs font-medium" style={{ color: kpi.trend.color }}>
                {kpi.trend.icon === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend.text}
              </span>
            )}
          </GlassCard>
        </motion.div>
      ))}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   ACTION QUEUE TABLE (DESKTOP)
   ═══════════════════════════════════════════ */

function ActionQueueTable({
  actions,
  onApprove,
  onReject,
}: {
  actions: ActionItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.section variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
      <h2
        className="text-lg md:text-xl font-semibold"
        style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
      >
        Pending Actions
      </h2>

      {/* Desktop table */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Priority', 'Action', 'Engine', 'Confidence', 'Amount', 'Time', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold"
                        style={{ color: '#64748B' }}
                        scope="col"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {actions
                  .filter((a) => a.status === 'pending')
                  .map((item) => {
                    const expanded = expandedId === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        <motion.tr
                          variants={fadeUp}
                          className="group transition-colors cursor-pointer"
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            ...(item.priority === 'CRITICAL'
                              ? { borderLeft: '2px solid rgba(234,179,8,0.5)' }
                              : {}),
                          }}
                          onClick={() => setExpandedId(expanded ? null : item.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setExpandedId(expanded ? null : item.id);
                            }
                          }}
                          tabIndex={0}
                          role="row"
                          aria-expanded={expanded}
                          aria-label={`${item.priority} priority: ${item.action}`}
                        >
                          <td className="px-4 py-3.5">
                            <PriorityBadge priority={item.priority} />
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                                {item.action}
                              </span>
                              {expanded ? (
                                <ChevronUp size={14} style={{ color: '#64748B' }} />
                              ) : (
                                <ChevronDown size={14} style={{ color: '#64748B' }} />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <EngineBadge engine={item.engine} />
                          </td>
                          <td className="px-4 py-3.5">
                            <ConfidenceIndicator value={item.confidence} />
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm font-mono tabular-nums" style={{ color: '#CBD5E1' }}>
                              {item.amount}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs" style={{ color: '#64748B' }}>
                              {item.timeAgo}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onApprove(item.id);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                style={{
                                  background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                                  color: '#04141a',
                                }}
                                aria-label={`Approve: ${item.action}`}
                              >
                                <CheckCircle2 size={13} />
                                Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReject(item.id);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:shadow-[0_0_8px_rgba(239,68,68,0.3)] active:scale-[0.98] cursor-pointer"
                                style={{
                                  borderColor: 'rgba(239,68,68,0.3)',
                                  color: '#EF4444',
                                  background: 'transparent',
                                }}
                                aria-label={`Reject: ${item.action}`}
                              >
                                <XCircle size={13} />
                                Reject
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                        {expanded && (
                          <tr>
                            <td colSpan={7} className="px-6 py-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                              <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                                {item.detail}
                              </p>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {actions
          .filter((a) => a.status === 'pending')
          .map((item) => (
            <motion.div key={item.id} variants={fadeUp}>
              <GlassCard
                borderColor={item.priority === 'CRITICAL' ? 'rgba(234,179,8,0.5)' : undefined}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <PriorityBadge priority={item.priority} />
                  <EngineBadge engine={item.engine} />
                  <span className="ml-auto text-xs" style={{ color: '#64748B' }}>
                    {item.timeAgo}
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                  {item.action}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                  {item.detail}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono tabular-nums" style={{ color: '#CBD5E1' }}>
                    {item.amount}
                  </span>
                  <ConfidenceIndicator value={item.confidence} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApprove(item.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                      color: '#04141a',
                      minHeight: '44px',
                    }}
                    aria-label={`Approve: ${item.action}`}
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(item.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:shadow-[0_0_8px_rgba(239,68,68,0.3)] active:scale-[0.98] cursor-pointer"
                    style={{
                      borderColor: 'rgba(239,68,68,0.3)',
                      color: '#EF4444',
                      background: 'transparent',
                      minHeight: '44px',
                    }}
                    aria-label={`Reject: ${item.action}`}
                  >
                    <XCircle size={16} />
                    Reject
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

function ExecutionStats() {
  const stats = [
    { label: 'Approved', value: 12, color: '#10B981', icon: CheckCircle2 },
    { label: 'Rejected', value: 3, color: '#EF4444', icon: XCircle },
    { label: 'Auto-executed', value: 8, color: '#14B8A6', icon: Zap },
    { label: 'Pending review', value: 4, color: '#EAB308', icon: Clock },
  ];

  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        {"Today's Activity"}
      </h3>
      <div className="flex flex-col gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  background: `${s.color}15`,
                }}
              >
                <s.icon size={14} style={{ color: s.color }} />
              </div>
              <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>
                {s.label}
              </span>
            </div>
            <span className="text-base font-bold tabular-nums" style={{ color: s.color }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function ConfidenceChart() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Confidence Scores
      </h3>
      <div className="h-36" role="img" aria-label="Confidence score distribution chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={confidenceData} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
            <XAxis
              type="number"
              hide
              domain={[0, 8]}
            />
            <YAxis
              type="category"
              dataKey="range"
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              width={54}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                background: '#0F1D32',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F1F5F9',
              }}
              formatter={(value: number) => [`${value} actions`, 'Count']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
              {confidenceData.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

function RecentExecutionsTimeline() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Recent Executions
      </h3>
      <div className="flex flex-col gap-0">
        {recentExecutions.map((item, i) => {
          const cfg = statusConfig[item.status];
          return (
            <div
              key={i}
              className="flex items-start gap-3 py-2.5"
              style={{
                borderBottom:
                  i < recentExecutions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div
                className="mt-0.5 h-2 w-2 rounded-full shrink-0"
                style={{ background: cfg.color }}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs font-medium truncate" style={{ color: '#F1F5F9' }}>
                  {item.action}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <EngineBadge engine={item.engine} />
                  <span className="text-[10px]" style={{ color: '#64748B' }}>
                    {item.timeAgo}
                  </span>
                </div>
              </div>
              <span
                className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: cfg.bg, color: cfg.color }}
              >
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════
   GOVERNANCE FOOTER
   ═══════════════════════════════════════════ */

function GovernFooter() {
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
          GV-2026-0216-EXEC
        </span>
        <ExternalLink size={12} style={{ color: '#64748B' }} aria-hidden="true" />
      </div>
      <button
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
        aria-label="Request human review of this execution batch"
      >
        <User size={14} />
        Request human review
      </button>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */

export function Execute() {
  const [actions, setActions] = useState<ActionItem[]>(initialActions);

  const handleApprove = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' as ActionStatus } : a))
    );
  };

  const handleReject = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected' as ActionStatus } : a))
    );
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: '#0B1221' }}
    >
      {/* Skip link */}
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
        {/* Hero */}
        <HeroSection />

        {/* KPI Grid */}
        <KpiGrid />

        {/* Main content: Action queue + sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Primary feed (2/3) */}
          <div className="flex-1 min-w-0 lg:w-2/3">
            <ActionQueueTable actions={actions} onApprove={handleApprove} onReject={handleReject} />
          </div>

          {/* Decision rail (1/3) */}
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Execution statistics sidebar">
            <ExecutionStats />
            <ConfidenceChart />
            <RecentExecutionsTimeline />
          </aside>
        </div>

        {/* Governance footer */}
        <GovernFooter />
      </div>
    </div>
  );
}

export default Execute;
