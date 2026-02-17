import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '../router';
import {
  Shield,
  AlertCircle,
  Eye,
  Sparkles,
  Brain,
  CreditCard,
  MapPin,
  Clock,
  ChevronDown,
  ExternalLink,
  Check,
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

/* ─── Animation variants ─────────────────────────────────── */

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ─── Types ───────────────────────────────────────────────── */

interface Signal {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  merchant: string;
  amount: string;
  confidence: number;
  time: string;
}

/* ─── Data ────────────────────────────────────────────────── */

const signals: Signal[] = [
  {
    id: 's1',
    severity: 'critical',
    title: 'Unusual high-value transaction',
    merchant: 'MerchantX Electronics',
    amount: '$4,200.00',
    confidence: 0.94,
    time: '14:28',
  },
  {
    id: 's2',
    severity: 'warning',
    title: 'Geographic anomaly detected',
    merchant: 'TravelCo International',
    amount: '$890.00',
    confidence: 0.87,
    time: '13:45',
  },
  {
    id: 's3',
    severity: 'info',
    title: 'New merchant first transaction',
    merchant: 'CloudServices Pro',
    amount: '$149.99',
    confidence: 0.72,
    time: '12:10',
  },
];

const shapFactors = [
  { label: 'Merchant history', value: 0.82 },
  { label: 'Amount deviation', value: 0.71 },
  { label: 'Geographic mismatch', value: 0.65 },
];

const categoryScores = [
  { name: 'Transaction patterns', score: 92, icon: CreditCard },
  { name: 'Merchant risk', score: 87, icon: Shield },
  { name: 'Geographic', score: 95, icon: MapPin },
  { name: 'Behavioral', score: 91, icon: Brain },
];

const milestones = [
  { label: 'Signal detected', time: '14:28', status: 'completed' as const },
  { label: 'Analysis complete', time: '14:29', status: 'completed' as const },
  { label: 'Alert raised', time: '14:30', status: 'completed' as const },
  { label: 'Resolution pending', time: 'Now', status: 'current' as const },
];

const quickActions = [
  { title: 'Freeze card', priority: 'urgent' as const, color: '#EF4444', route: '/protect/dispute' as const },
  { title: 'Investigate MerchantX', priority: 'normal' as const, color: '#F59E0B', route: '/protect/alert-detail' as const },
  { title: 'Update alert rules', priority: 'low' as const, color: '#10B981', route: null },
];

/* ─── Severity Badge ──────────────────────────────────────── */

function SeverityBadge({ severity }: { severity: Signal['severity'] }) {
  const config = {
    critical: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', color: '#EF4444', label: 'Critical' },
    warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', color: '#F59E0B', label: 'Warning' },
    info: { bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.3)', color: '#38BDF8', label: 'Info' },
  };
  const c = config[severity];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
    >
      {c.label}
    </span>
  );
}

/* ─── Mini Score Ring (inline in table) ───────────────────── */

function MiniScoreRing({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="14" fill="none" stroke="#14B8A6" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${pct * 0.88} ${88 - pct * 0.88}`}
          />
        </svg>
      </div>
      <span className="font-mono text-sm font-semibold" style={{ color: '#14B8A6' }}>
        {pct}{'%'}
      </span>
    </div>
  );
}

/* ─── Score Ring (large, for Decision Rail) ────────────────── */

function ScoreRingLarge({ score }: { score: number }) {
  const data = [{ value: score, fill: '#14B8A6' }];
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: '#64748B' }}>
        Risk Score
      </p>
      <div className="relative">
        <RadialBarChart
          width={180}
          height={180}
          cx={90}
          cy={90}
          innerRadius={62}
          outerRadius={80}
          barSize={12}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: 'rgba(255,255,255,0.06)' }}
            angleAxisId={0}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-bold" style={{ color: '#F1F5F9' }}>{score}</span>
          <span className="text-xs" style={{ color: '#64748B' }}>{'/100'}</span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color: '#14B8A6' }}>
        {'Low \u2014 monitoring'}
      </span>
    </div>
  );
}

/* ─── Category Score Bars ─────────────────────────────────── */

function CategoryScoreBars() {
  return (
    <div className="flex flex-col gap-3">
      {categoryScores.map((cat) => {
        const Icon = cat.icon;
        return (
          <div
            key={cat.name}
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'rgba(20,184,166,0.1)' }}
            >
              <Icon className="h-4 w-4" style={{ color: '#14B8A6' }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{cat.name}</span>
                <span className="font-mono text-sm font-semibold" style={{ color: '#14B8A6' }}>{cat.score}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #14B8A6, rgba(20,184,166,0.6))' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.score}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Milestones Timeline ─────────────────────────────────── */

function Timeline() {
  return (
    <div className="flex flex-col">
      {milestones.map((m, i) => {
        const isLast = i === milestones.length - 1;
        return (
          <div key={m.label} className="relative flex gap-4">
            {!isLast && (
              <div
                className="absolute left-4 top-8 h-full w-px -translate-x-1/2"
                style={{
                  background: m.status === 'completed'
                    ? 'linear-gradient(to bottom, rgba(20,184,166,0.3), rgba(20,184,166,0.1))'
                    : 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                }}
              />
            )}
            <div className="z-10 shrink-0">
              {m.status === 'completed' ? (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'rgba(20,184,166,0.15)', boxShadow: 'inset 0 0 0 2px rgba(20,184,166,0.3)' }}
                >
                  <Check className="h-4 w-4" style={{ color: '#10B981' }} />
                </div>
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'rgba(20,184,166,0.15)', boxShadow: 'inset 0 0 0 2px rgba(20,184,166,0.3)' }}
                >
                  <div className="h-3 w-3 animate-pulse rounded-full" style={{ background: '#14B8A6' }} />
                </div>
              )}
            </div>
            <div className={`flex flex-1 items-center justify-between ${isLast ? 'pb-0' : 'pb-6'}`}>
              <div>
                <p className="text-sm font-medium" style={{ color: m.status === 'completed' ? '#F1F5F9' : '#CBD5E1' }}>
                  {m.label}
                </p>
                <p className="text-xs" style={{ color: '#64748B' }}>{m.time}</p>
              </div>
              {m.status === 'completed' && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: 'rgba(20,184,166,0.1)', color: '#10B981' }}
                >
                  Done
                </span>
              )}
              {m.status === 'current' && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: 'rgba(20,184,166,0.1)', color: '#14B8A6' }}
                >
                  Active
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── SHAP Detail Panel ───────────────────────────────────── */

function SHAPPanel() {
  return (
    <div className="flex flex-col gap-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4" style={{ color: '#14B8A6' }} />
        <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>SHAP Factor Analysis</span>
      </div>
      <div className="flex flex-col gap-3">
        {shapFactors.map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#CBD5E1' }}>{f.label}</span>
              <span className="font-mono text-sm font-semibold" style={{ color: '#14B8A6' }}>{f.value.toFixed(2)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #14B8A6, rgba(20,184,166,0.5))' }}
                initial={{ width: 0 }}
                animate={{ width: `${f.value * 100}%` }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="font-mono text-xs" style={{ color: '#64748B' }}>
          {'FraudDetection v3.2 | Trained on 180d | Accuracy 97.2%'}
        </p>
      </div>
    </div>
  );
}

/* ─── Glass Card wrapper ──────────────────────────────────── */

function GlassCard({
  children,
  className = '',
  borderAccent,
}: {
  children: React.ReactNode;
  className?: string;
  borderAccent?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-4 md:p-6 ${className}`}
      style={{
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        ...(borderAccent ? { borderLeft: `2px solid ${borderAccent}` } : {}),
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── MAIN PAGE COMPONENT ──────────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

export const Protect: React.FC = () => {
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null);
  const { navigate } = useRouter();

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#0A1628' }}
    >
      {/* Aurora background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(70% 50% at 50% 0%, rgba(20,184,166,0.06), transparent), radial-gradient(40% 40% at 80% 20%, rgba(20,184,166,0.03), transparent)',
        }}
      />

      {/* Main content */}
      <motion.main
        className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 md:gap-8 md:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        role="main"
        aria-label="Protect Engine - Threat Detection"
      >
        {/* ═══ 1. HERO SECTION ═══ */}
        <motion.section variants={fadeUp} className="flex flex-col gap-3" aria-labelledby="protect-headline">
          {/* Kicker badge */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: 'rgba(20,184,166,0.15)' }}
            >
              <Shield className="h-3.5 w-3.5" style={{ color: '#14B8A6' }} />
            </div>
            <span className="text-sm font-semibold tracking-wide" style={{ color: '#14B8A6' }}>
              Protect
            </span>
          </div>

          {/* Headline */}
          <h1
            id="protect-headline"
            className="text-2xl font-bold leading-tight tracking-tight text-balance md:text-4xl"
            style={{ color: '#F1F5F9' }}
          >
            3 active signals. Confidence 0.94. No action required.
          </h1>

          {/* Subline */}
          <p className="max-w-xl text-base leading-relaxed" style={{ color: '#CBD5E1' }}>
            Continuous monitoring across all accounts. Last scan: 4 minutes ago.
          </p>

          {/* AI Insight Banner */}
          <GlassCard className="flex flex-wrap items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: 'rgba(20,184,166,0.1)' }}
            >
              <Sparkles className="h-4 w-4" style={{ color: '#14B8A6' }} />
            </div>
            <p className="min-w-[200px] flex-1 text-sm leading-relaxed" style={{ color: 'rgba(248,250,252,0.9)' }}>
              Unusual pattern detected at <strong style={{ color: '#F1F5F9' }}>MerchantX</strong> {'\u2014'} $4,200 charge deviates 3.2x from category average.
            </p>
          </GlassCard>

          {/* ProofLine */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs" style={{ color: 'rgba(165,180,198,0.8)' }}>
            <span>3 signals detected</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>Confidence 0.94</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>{'Model: FraudDetectionV3.2'}</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>{'Basis: 180-day behavioral analysis'}</span>
          </div>
        </motion.section>

        {/* ═══ 2. KPI GRID ═══ */}
        <motion.section variants={fadeUp} aria-label="Key metrics">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              { label: 'Active signals', value: '3', accent: '#F59E0B', status: 'amber' },
              { label: 'Blocked today', value: '1', accent: '#10B981', status: 'green' },
              { label: 'False positive rate', value: '2.1%', accent: '#10B981', status: 'green' },
              { label: 'Coverage', value: '100%', accent: '#10B981', status: 'green' },
            ].map((kpi) => (
              <GlassCard key={kpi.label}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wide" style={{ color: '#64748B' }}>
                    {kpi.label}
                  </span>
                  <div className="h-2 w-2 rounded-full" style={{ background: kpi.accent }} />
                </div>
                <p
                  className="mt-2 font-mono text-2xl font-bold tracking-tight md:text-3xl"
                  style={{ color: kpi.accent }}
                >
                  {kpi.value}
                </p>
              </GlassCard>
            ))}
          </div>
        </motion.section>

        {/* ═══ 3. TWO-COLUMN CONTENT ═══ */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-5">
          {/* ── LEFT: Primary Feed ── */}
          <motion.div variants={fadeUp} className="flex min-w-0 flex-[2] flex-col gap-5">
            {/* Threat Table */}
            <GlassCard borderAccent="#14B8A6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: '#F1F5F9' }}>
                  Threat Signals
                </h2>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  3 active
                </span>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full" role="table">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Severity', 'Signal', 'Amount', 'Confidence', 'Time', 'Actions'].map((h) => (
                        <th
                          key={h}
                          className="pb-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: '#64748B' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {signals.map((s) => (
                      <React.Fragment key={s.id}>
                        <tr
                          className="cursor-pointer transition-colors"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                          onClick={() => setExpandedSignal(expandedSignal === s.id ? null : s.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedSignal(expandedSignal === s.id ? null : s.id); }}
                          aria-expanded={expandedSignal === s.id}
                        >
                          <td className="py-3 pr-3">
                            <SeverityBadge severity={s.severity} />
                          </td>
                          <td className="py-3 pr-3">
                            <div>
                              <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{s.title}</p>
                              <p className="text-xs" style={{ color: '#64748B' }}>{s.merchant}</p>
                            </div>
                          </td>
                          <td className="py-3 pr-3 font-mono text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                            {s.amount}
                          </td>
                          <td className="py-3 pr-3">
                            <MiniScoreRing value={s.confidence} />
                          </td>
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" style={{ color: '#64748B' }} />
                              <span className="text-sm" style={{ color: '#CBD5E1' }}>{s.time}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <button
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                              style={{
                                background: 'rgba(20,184,166,0.1)',
                                border: '1px solid rgba(20,184,166,0.3)',
                                color: '#14B8A6',
                              }}
                              onClick={(e) => { e.stopPropagation(); navigate('/protect/alert-detail'); }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                          </td>
                        </tr>
                        {/* Expanded row */}
                        {expandedSignal === s.id && (
                          <tr>
                            <td colSpan={6} className="pb-4 pt-1">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <SHAPPanel />
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="flex flex-col gap-3 md:hidden">
                {signals.map((s) => (
                  <div key={s.id}>
                    <div
                      className="flex flex-col gap-3 rounded-xl p-3 transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderLeft: `3px solid ${s.severity === 'critical' ? '#EF4444' : s.severity === 'warning' ? '#F59E0B' : '#38BDF8'}`,
                      }}
                      role="button"
                      tabIndex={0}
                      onClick={() => setExpandedSignal(expandedSignal === s.id ? null : s.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedSignal(expandedSignal === s.id ? null : s.id); }}
                      aria-expanded={expandedSignal === s.id}
                    >
                      <div className="flex items-center justify-between">
                        <SeverityBadge severity={s.severity} />
                        <span className="text-xs" style={{ color: '#64748B' }}>{s.time}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{s.title}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{s.merchant}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-semibold" style={{ color: '#F1F5F9' }}>{s.amount}</span>
                        <MiniScoreRing value={s.confidence} />
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
                          style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)', color: '#14B8A6' }}
                          onClick={(e) => { e.stopPropagation(); navigate('/protect/alert-detail'); }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <ChevronDown
                          className="h-4 w-4 transition-transform"
                          style={{
                            color: '#64748B',
                            transform: expandedSignal === s.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </div>
                    </div>
                    {expandedSignal === s.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-2"
                      >
                        <SHAPPanel />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* DefinitionLine */}
            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="font-mono text-xs leading-relaxed" style={{ color: '#64748B' }}>
                {'Risk Score = weighted_sum(signal_confidence \u00D7 severity_factor) | Unit: 0\u20131 | Period: rolling 24h | Threshold: >0.7 triggers alert'}
              </p>
            </div>

            {/* Quick Actions */}
            <GlassCard borderAccent="#14B8A6">
              <h2 className="mb-4 text-lg font-semibold" style={{ color: '#F1F5F9' }}>
                Quick Actions
              </h2>
              <div className="flex flex-col gap-3">
                {quickActions.map((a) => (
                  <div
                    key={a.title}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderLeft: `3px solid ${a.color}`,
                      cursor: 'pointer',
                    }}
                    role="button"
                    tabIndex={0}
                    onClick={() => { if (a.route) navigate(a.route); }}
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && a.route) navigate(a.route); }}
                  >
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: a.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{a.title}</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>
                        {a.priority === 'urgent' ? 'Immediate containment required' : a.priority === 'normal' ? 'SLA: 24 hours' : 'Low priority'}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0" style={{ color: '#64748B' }} />
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* ── RIGHT: Decision Rail ── */}
          <motion.aside variants={fadeUp} className="flex min-w-0 flex-1 flex-col gap-5" aria-label="Decision rail">
            {/* Score Ring */}
            <GlassCard>
              <ScoreRingLarge score={94} />
            </GlassCard>

            {/* Category Score Bars */}
            <GlassCard>
              <h3 className="mb-4 text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                Category Breakdown
              </h3>
              <CategoryScoreBars />
            </GlassCard>

            {/* Milestones Timeline */}
            <GlassCard>
              <h3 className="mb-4 text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                Signal Timeline
              </h3>
              <Timeline />
            </GlassCard>

            {/* Evidence Summary */}
            <GlassCard borderAccent="#14B8A6">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'rgba(20,184,166,0.1)' }}
                >
                  <AlertCircle className="h-4 w-4" style={{ color: '#14B8A6' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                    Evidence Summary
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>
                    AI identified 3 correlated signals across 2 accounts in the last 6 hours.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.aside>
        </div>

        {/* ═══ 4. GOVERN FOOTER ═══ */}
        <motion.footer
          variants={fadeUp}
          className="flex flex-wrap items-center gap-4 rounded-xl p-3"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
          aria-label="Governance verification"
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)' }}
            >
              <Shield className="h-3 w-3" style={{ color: '#10B981' }} />
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              Verified
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs" style={{ color: '#64748B' }}>
            <span>{'GV-2026-0215-PRT-SIG'}</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>{'FraudDetection v3.2'}</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>{'SHAP v2.1'}</span>
          </div>
          <div className="ml-auto">
            <button
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#CBD5E1',
              }}
              onClick={() => navigate('/govern/oversight')}
            >
              Request human review
            </button>
          </div>
        </motion.footer>
      </motion.main>
    </div>
  );
};

export default Protect;
