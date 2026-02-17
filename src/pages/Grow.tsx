import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '../router';
import { usePageTitle } from '../hooks/use-page-title';
import {
  Shield,
  ShieldCheck,
  ExternalLink,
  TrendingUp,
  Target,
  DollarSign,
  User,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CircleDot,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

type GoalStatus = 'On track' | 'Behind' | 'Ahead';

interface Goal {
  id: string;
  name: string;
  progress: number;
  target: string;
  current: string;
  gap: string;
  timeline: string;
  status: GoalStatus;
  recommendation: string;
  confidence: number;
  actions: string[];
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const goals: Goal[] = [
  {
    id: 'g1',
    name: 'Retirement by 2045',
    progress: 67,
    target: '$2.4M',
    current: '$847k',
    gap: '$1.55M',
    timeline: '19 years remaining',
    status: 'Behind',
    recommendation: 'Increase monthly contribution by $420',
    confidence: 0.89,
    actions: ['Adjust goal', 'View scenarios'],
  },
  {
    id: 'g2',
    name: 'Emergency fund: $50k',
    progress: 88,
    target: '$50k',
    current: '$44k',
    gap: '$6k',
    timeline: '4 months to completion',
    status: 'On track',
    recommendation: 'Maintain current savings rate',
    confidence: 0.94,
    actions: ['View details'],
  },
  {
    id: 'g3',
    name: 'Home down payment: $120k',
    progress: 42,
    target: '$120k',
    current: '$50k',
    gap: '$70k',
    timeline: '3.5 years to target',
    status: 'On track',
    recommendation: 'No action needed',
    confidence: 0.91,
    actions: ['View details'],
  },
];

const projectionData = [
  { year: '2026', value: 847, low: 780, high: 920 },
  { year: '2030', value: 1100, low: 950, high: 1300 },
  { year: '2035', value: 1500, low: 1200, high: 1900 },
  { year: '2040', value: 2000, low: 1500, high: 2600 },
  { year: '2045', value: 2400, low: 1800, high: 3200 },
  { year: '2050', value: 2800, low: 2000, high: 3800 },
  { year: '2054', value: 2800, low: 2100, high: 3600 },
];

const allocationData = [
  { name: 'Stocks', value: 62, color: '#8B5CF6' },
  { name: 'Bonds', value: 28, color: '#3B82F6' },
  { name: 'Cash', value: 10, color: '#64748B' },
];

const recentActivity = [
  { text: 'Goal updated: Retirement target', time: '2 days ago' },
  { text: 'Contribution increased: +$200/mo', time: '1 week ago' },
  { text: 'Rebalanced portfolio: +2% stocks', time: '2 weeks ago' },
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

const statusConfig: Record<GoalStatus, { color: string; bg: string }> = {
  'On track': { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  Behind: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  Ahead: { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
};

function getConfidenceColor(c: number): string {
  if (c >= 0.9) return '#10B981';
  if (c >= 0.8) return '#8B5CF6';
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
            borderColor: 'rgba(139,92,246,0.3)',
            background: 'rgba(139,92,246,0.08)',
            color: '#8B5CF6',
          }}
        >
          <TrendingUp size={12} />
          Grow Engine
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h1
          className="text-2xl md:text-4xl font-bold leading-tight tracking-tight text-balance"
          style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
        >
          3 active goals. Confidence 0.89. On track for 2 of 3.
        </h1>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
          AI-driven forecasts and optimization scenarios. Net worth growth: +$12.4k this month.
        </p>
      </motion.div>

      {/* Featured AI insight card */}
      <motion.div variants={fadeUp}>
        <GlassCard borderColor="#8B5CF6" className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-sm md:text-base font-medium" style={{ color: '#F1F5F9' }}>
                Retire by 2045 — increase monthly contributions by $420 to stay on track (89% confidence)
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs" style={{ color: '#64748B' }}>Confidence</span>
              <ConfidenceIndicator value={0.89} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                color: '#ffffff',
                minHeight: '44px',
              }}
              aria-label="Review growth scenarios"
              onClick={() => navigate('/grow/scenarios')}
            >
              <Target size={16} />
              Review scenarios
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.04] active:scale-[0.98] cursor-pointer"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
              onClick={() => navigate('/grow/goal')}
            >
              Adjust goal
            </button>
          </div>
          {/* ProofLine */}
          <div
            className="flex flex-wrap items-center gap-1 text-xs"
            style={{ color: '#64748B' }}
            role="note"
            aria-label="Evidence trail"
          >
            <span>3 goals tracked</span>
            <span aria-hidden="true">|</span>
            <span>Confidence 0.89</span>
            <span aria-hidden="true">|</span>
            <span className="font-mono">Model: GrowthOptimizer v2.8</span>
            <span aria-hidden="true">|</span>
            <span>Basis: Monte Carlo simulation (10K runs)</span>
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
    label: 'Net Worth',
    value: '$847k',
    trend: { text: '+$12.4k (+1.5%)', color: '#10B981' },
  },
  {
    label: 'Goal Progress',
    value: '67%',
    badge: { text: 'on track', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  },
  {
    label: 'Projected Growth',
    value: '+8.2%',
    trend: { text: 'annualized', color: '#10B981' },
  },
  {
    label: 'Risk-adjusted Return',
    value: '6.4%',
    trend: { text: 'Sharpe-adjusted', color: '#14B8A6' },
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
                <ArrowUpRight size={12} />
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
   GOAL CARDS
   ═══════════════════════════════════════════ */

function GoalCard({ goal }: { goal: Goal }) {
  const sc = statusConfig[goal.status];
  return (
    <motion.div variants={fadeUp}>
      <GlassCard borderColor={goal.status === 'Behind' ? '#F59E0B' : 'rgba(139,92,246,0.3)'} className="flex flex-col gap-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <h3 className="text-base font-semibold" style={{ color: '#F1F5F9' }}>{goal.name}</h3>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: sc.bg, color: sc.color }}
          >
            {goal.status === 'On track' || goal.status === 'Ahead' ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
            {goal.status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#64748B' }}>Progress</span>
            <span className="text-xs font-mono tabular-nums" style={{ color: '#8B5CF6' }}>{goal.progress}%</span>
          </div>
          <div
            className="h-2 w-full rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            role="progressbar"
            aria-valuenow={goal.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${goal.progress}% progress toward ${goal.name}`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#8B5CF6' }}
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Target details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Target</span>
            <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: '#F1F5F9' }}>{goal.target}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Current</span>
            <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: '#F1F5F9' }}>{goal.current}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Gap</span>
            <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: '#F59E0B' }}>{goal.gap}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2">
          <Clock size={12} style={{ color: '#64748B' }} />
          <span className="text-xs" style={{ color: '#94A3B8' }}>{goal.timeline}</span>
        </div>

        {/* AI Recommendation */}
        <div
          className="rounded-xl px-3 py-2.5 flex items-start gap-2"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <CircleDot size={12} className="mt-0.5 shrink-0" style={{ color: '#8B5CF6' }} />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>
              AI recommendation: {goal.recommendation}
            </span>
            <ConfidenceIndicator value={goal.confidence} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {goal.actions.map((action, i) => (
            <button
              key={action}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                i === 0 ? '' : ''
              }`}
              style={
                i === 0
                  ? {
                      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                      color: '#ffffff',
                      minHeight: '44px',
                    }
                  : {
                      borderWidth: '1px',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#CBD5E1',
                      background: 'transparent',
                      minHeight: '44px',
                    }
              }
              aria-label={`${action} for ${goal.name}`}
              onClick={() => {
                if (action === 'View scenarios') navigate('/grow/scenarios');
                else if (action === 'Recommendations') navigate('/grow/recommendations');
                else navigate('/grow/goal');
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function GoalsSection() {
  return (
    <motion.section variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
      <h2
        className="text-lg md:text-xl font-semibold"
        style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
      >
        Your Goals
      </h2>
      <div className="flex flex-col gap-4">
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR COMPONENTS
   ═══════════════════════════════════════════ */

function GrowthProjection() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
          30-Year Projection
        </h3>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#64748B' }}>$847k</span>
        <span className="text-xs font-semibold" style={{ color: '#8B5CF6' }}>$2.8M (2054)</span>
      </div>
      <div className="h-32" role="img" aria-label="Growth projection chart showing net worth growing from $847k to projected $2.8M by 2054">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="growGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="growBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: '#0F1D32',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F1F5F9',
              }}
              formatter={(value: number) => [`$${value}k`, '']}
            />
            <Area type="monotone" dataKey="high" stackId="1" stroke="none" fill="url(#growBand)" />
            <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fill="url(#growGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

function AssetAllocation() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Asset Allocation
      </h3>
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 shrink-0" role="img" aria-label="Asset allocation: 62% stocks, 28% bonds, 10% cash">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {allocationData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">
          {allocationData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-xs" style={{ color: '#CBD5E1' }}>{item.name}</span>
              <span className="text-xs font-mono tabular-nums ml-auto" style={{ color: '#94A3B8' }}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: '#10B981' }}
      >
        <CheckCircle2 size={10} />
        Within target range
      </span>
    </GlassCard>
  );
}

function RecentActivity() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        Recent Activity
      </h3>
      <div className="flex flex-col gap-0">
        {recentActivity.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-2.5"
            style={{
              borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <div
              className="mt-0.5 h-2 w-2 rounded-full shrink-0"
              style={{ background: '#8B5CF6' }}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-medium" style={{ color: '#F1F5F9' }}>{item.text}</span>
              <span className="text-[10px]" style={{ color: '#64748B' }}>{item.time}</span>
            </div>
          </div>
        ))}
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
          GV-2026-0216-GROW
        </span>
        <ExternalLink size={12} style={{ color: '#64748B' }} aria-hidden="true" />
      </div>
      <button
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', background: 'transparent', minHeight: '44px' }}
        aria-label="Request human review of growth projections"
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

export function Grow() {
  usePageTitle('Grow');
  const { navigate } = useRouter();
  return (
    <div className="relative min-h-screen w-full" style={{ background: '#0B1221' }}>
      {/* Aurora background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(70% 50% at 50% 0%, rgba(139,92,246,0.06), transparent), radial-gradient(40% 40% at 80% 20%, rgba(139,92,246,0.03), transparent)',
        }}
      />
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: '#8B5CF6', color: '#ffffff' }}
      >
        Skip to main content
      </a>

      <div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        role="main"
      >
        <HeroSection />
        <KpiGrid />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 lg:w-2/3">
            <GoalsSection />
          </div>
          <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Growth statistics sidebar">
            <GrowthProjection />
            <AssetAllocation />
            <RecentActivity />
          </aside>
        </div>

        <GovernFooter />
      </div>
    </div>
  );
}

export default Grow;
