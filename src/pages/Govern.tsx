import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '../router';
import { usePageTitle } from '../hooks/use-page-title';
import {
  Shield,
  ShieldCheck,
  ExternalLink,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  User,
  FileText,
  Eye,
  CircleDot,
} from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type DecisionType = 'Protect' | 'Grow' | 'Execute';
type DecisionStatus = 'Verified' | 'Pending review' | 'Flagged';

interface Decision {
  id: string;
  type: DecisionType;
  timestamp: string;
  confidence: number;
  evidencePoints: number;
  status: DecisionStatus;
  description: string;
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const decisions: Decision[] = [
  {
    id: 'GV-2026-0216-42',
    type: 'Execute',
    timestamp: '14:28 Today',
    confidence: 0.97,
    evidencePoints: 12,
    status: 'Verified',
    description: 'Portfolio rebalance — $24k allocation shift',
  },
  {
    id: 'GV-2026-0216-41',
    type: 'Protect',
    timestamp: '14:15 Today',
    confidence: 0.94,
    evidencePoints: 9,
    status: 'Verified',
    description: 'Wire transfer blocked — fraud score 0.94',
  },
  {
    id: 'GV-2026-0216-40',
    type: 'Grow',
    timestamp: '13:52 Today',
    confidence: 0.89,
    evidencePoints: 7,
    status: 'Verified',
    description: 'Subscription consolidation — $140/mo savings',
  },
  {
    id: 'GV-2026-0216-39',
    type: 'Execute',
    timestamp: '11:20 Today',
    confidence: 0.78,
    evidencePoints: 5,
    status: 'Pending review',
    description: 'Invoice archival — 142 items',
  },
  {
    id: 'GV-2026-0215-38',
    type: 'Protect',
    timestamp: 'Yesterday',
    confidence: 0.92,
    evidencePoints: 10,
    status: 'Verified',
    description: 'Unusual transaction flagged — manual review',
  },
  {
    id: 'GV-2026-0215-37',
    type: 'Grow',
    timestamp: 'Yesterday',
    confidence: 0.86,
    evidencePoints: 6,
    status: 'Verified',
    description: 'Goal progress update — retirement timeline',
  },
];

const confidenceTrendData = [
  { day: '1', value: 0.95 },
  { day: '5', value: 0.94 },
  { day: '10', value: 0.95 },
  { day: '15', value: 0.96 },
  { day: '20', value: 0.96 },
  { day: '25', value: 0.97 },
  { day: '30', value: 0.97 },
];

const evidenceTypes = [
  { label: 'Transaction data', pct: 92 },
  { label: 'User patterns', pct: 87 },
  { label: 'External signals', pct: 95 },
  { label: 'Policy rules', pct: 100 },
];

const complianceItems = [
  { label: 'GDPR', compliant: true },
  { label: 'SOC 2', compliant: true },
  { label: 'CCPA', compliant: true },
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
};

const typeBg: Record<DecisionType, string> = {
  Protect: 'rgba(20,184,166,0.12)',
  Grow: 'rgba(139,92,246,0.12)',
  Execute: 'rgba(234,179,8,0.12)',
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
    >
      <Icon size={11} />
      {status}
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
            borderColor: 'rgba(59,130,246,0.3)',
            background: 'rgba(59,130,246,0.08)',
            color: '#3B82F6',
          }}
        >
          <ShieldCheck size={12} />
          Govern Engine
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h1
          className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance"
          style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
        >
          Full transparency across 847 decisions. Confidence 0.97. 100% traceable.
        </h1>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          Complete audit trail from AI recommendation to execution. Every decision has evidence.
        </p>
      </motion.div>

      {/* Featured AI insight card */}
      <motion.div variants={fadeUp}>
        <GlassCard borderColor="#3B82F6" className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base font-medium" style={{ color: '#F1F5F9' }}>
                Decision GV-2026-0214-42 verified — portfolio rebalance approved with 12 evidence points
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs" style={{ color: '#64748B' }}>Confidence</span>
              <ConfidenceIndicator value={0.97} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: '#ffffff',
                minHeight: '44px',
              }}
              aria-label="View audit trail for decision GV-2026-0214-42"
              onClick={() => navigate('/govern/audit-detail')}
            >
              <Eye size={16} />
              View audit trail
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.04] active:scale-[0.98] cursor-pointer"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
              onClick={() => navigate('/govern/audit')}
            >
              <FileText size={16} />
              Export report
            </button>
          </div>
          {/* ProofLine */}
          <div
            className="flex flex-wrap items-center gap-1 text-xs"
            style={{ color: '#64748B' }}
            role="note"
            aria-label="Evidence trail"
          >
            <span>847 decisions logged</span>
            <span aria-hidden="true">|</span>
            <span>Confidence 0.97</span>
            <span aria-hidden="true">|</span>
            <span className="font-mono">Model: GovernanceTracer v3.1</span>
            <span aria-hidden="true">|</span>
            <span>Basis: Multi-source evidence aggregation</span>
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
  trend?: { text: string; color: string };
}

const kpiData: KpiCardData[] = [
  {
    label: 'Decisions Audited',
    value: '847',
    badge: { text: 'audited', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  },
  {
    label: 'Verifiable',
    value: '100%',
    trend: { text: 'up from 99.8%', color: '#10B981' },
  },
  {
    label: 'Avg Evidence Points',
    value: '8.4',
    trend: { text: '+1.2 trend', color: '#10B981' },
  },
  {
    label: 'Human Reviews',
    value: '3',
    badge: { text: 'pending', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
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
                <TrendingUp size={12} />
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
   DECISION TABLE (DESKTOP) + CARDS (MOBILE)
   ═══════════════════════════════════════════ */

function DecisionAuditTrail() {
  return (
    <motion.section variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
      <h2
        className="text-lg md:text-xl font-semibold"
        style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
      >
        Decision Audit Trail
      </h2>

      {/* Desktop table */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Decision ID', 'Type', 'Timestamp', 'Confidence', 'Evidence', 'Status', ''].map(
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
                {decisions.map((d) => (
                  <motion.tr
                    key={d.id}
                    variants={fadeUp}
                    className="group transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-4 py-3.5">
                      <button
                        className="text-sm font-mono font-medium transition-colors hover:underline cursor-pointer"
                        style={{ color: '#3B82F6', background: 'transparent', border: 'none' }}
                        aria-label={`View details for decision ${d.id}`}
                        onClick={() => navigate('/govern/audit-detail')}
                      >
                        {d.id}
                      </button>
                      <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{d.description}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <TypeBadge type={d.type} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs" style={{ color: '#94A3B8' }}>{d.timestamp}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <ConfidenceIndicator value={d.confidence} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-mono tabular-nums" style={{ color: '#CBD5E1' }}>
                        {d.evidencePoints} pts
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                          color: '#ffffff',
                          minHeight: '36px',
                        }}
                        aria-label={`View audit trail for decision ${d.id}`}
                        onClick={() => navigate('/govern/audit-detail')}
                      >
                        <Eye size={13} />
                        View trail
                      </button>
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
        {decisions.map((d) => (
          <motion.div key={d.id} variants={fadeUp}>
            <GlassCard className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={d.type} />
                <StatusBadge status={d.status} />
                <span className="ml-auto text-xs" style={{ color: '#64748B' }}>{d.timestamp}</span>
              </div>
              <button
                className="text-sm font-mono font-medium text-left transition-colors hover:underline cursor-pointer"
                style={{ color: '#3B82F6', background: 'transparent', border: 'none', padding: 0 }}
                aria-label={`View details for decision ${d.id}`}
                onClick={() => navigate('/govern/audit-detail')}
              >
                {d.id}
              </button>
              <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{d.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#64748B' }}>
                  {d.evidencePoints} evidence points
                </span>
                <ConfidenceIndicator value={d.confidence} />
              </div>
              <button
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  color: '#ffffff',
                  minHeight: '44px',
                }}
                aria-label={`View audit trail for decision ${d.id}`}
                onClick={() => navigate('/govern/audit-detail')}
              >
                <Eye size={16} />
                View trail
              </button>
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

function EvidenceDistribution() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Evidence Types
      </h3>
      <div className="flex flex-col gap-3">
        {evidenceTypes.map((e) => (
          <div key={e.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>{e.label}</span>
              <span className="text-xs font-mono tabular-nums" style={{ color: '#3B82F6' }}>{e.pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${e.pct}%`, background: '#3B82F6' }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function ConfidenceTrend() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
          30-Day Confidence
        </h3>
        <span className="text-xs font-mono tabular-nums" style={{ color: '#10B981' }}>0.97</span>
      </div>
      <div className="h-24" role="img" aria-label="Confidence trend over 30 days showing increase from 0.95 to 0.97">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={confidenceTrendData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6', stroke: '#0B1221', strokeWidth: 2 }}
            />
            <Tooltip
              contentStyle={{
                background: '#0F1D32',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F1F5F9',
              }}
              formatter={(value: number) => [value.toFixed(2), 'Confidence']}
              labelFormatter={(label) => `Day ${label}`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

function ComplianceStatus() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Compliance Status
      </h3>
      <div className="flex flex-col gap-3">
        {complianceItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>{item.label}</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: item.compliant ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: item.compliant ? '#10B981' : '#EF4444',
              }}
            >
              <CheckCircle2 size={11} />
              Compliant
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs" style={{ color: '#64748B' }}>Last audit</span>
          <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>2026-02-10</span>
        </div>
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
          style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}
        >
          <Shield size={10} />
          Verified
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: '#64748B' }}>
          GV-2026-0216-GOV
        </span>
        <ExternalLink size={12} style={{ color: '#64748B' }} aria-hidden="true" />
      </div>
      <button
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
        aria-label="Request human review of governance decisions"
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

export function Govern() {
  usePageTitle('Govern');
  const { navigate } = useRouter();
  return (
    <div
      className="relative min-h-screen w-full"
      style={{ background: '#0B1221' }}
    >
      {/* Aurora background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(70% 50% at 50% 0%, rgba(59,130,246,0.06), transparent), radial-gradient(40% 40% at 80% 20%, rgba(59,130,246,0.03), transparent)',
        }}
      />
      {/* Skip link */}
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
        {/* Hero */}
        <HeroSection />

        {/* KPI Grid */}
        <KpiGrid />

        {/* Main content: Decision trail + sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Primary feed (2/3) */}
          <div className="flex-1 min-w-0 lg:w-2/3">
            <DecisionAuditTrail />
          </div>

          {/* Decision rail (1/3) */}
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Governance statistics sidebar">
            <EvidenceDistribution />
            <ConfidenceTrend />
            <ComplianceStatus />
          </aside>
        </div>

        {/* Governance footer */}
        <GovernFooter />
      </div>
    </div>
  );
}

export default Govern;
