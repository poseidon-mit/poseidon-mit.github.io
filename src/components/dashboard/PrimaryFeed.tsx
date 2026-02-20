import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { useRouter } from '../../router';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import {
  Sparkles, ExternalLink, AlertTriangle, ChevronRight,
} from 'lucide-react';


/* ═══════════════════════ Trust Pulse (Score Ring) ═══════════════════════ */

function ScoreRing() {
  const score = 92;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const engines = [
    { name: 'Protect', score: 94, color: 'var(--engine-protect)', trend: '+2' },
    { name: 'Grow', score: 89, color: 'var(--engine-grow)', trend: '+1' },
    { name: 'Execute', score: 91, color: 'var(--engine-execute)', trend: '+3' },
    { name: 'Govern', score: 97, color: 'var(--engine-govern)', trend: '0' },
  ];
  const segments = [
    { color: '#22C55E', fraction: 0.25 },
    { color: '#8B5CF6', fraction: 0.25 },
    { color: '#EAB308', fraction: 0.25 },
    { color: '#3B82F6', fraction: 0.25 },
  ];
  let accOffset = 0;

  return (
    <motion.div variants={fadeUp} className="trust-pulse dashboard-main-card">
      <header>
        <strong style={{ color: '#f8fafc' }}>System trust</strong>
        <span style={{ fontSize: 13, color: 'rgba(165,180,198,0.9)' }}>Composite confidence across all four engines.</span>
      </header>

      <div className="trust-pulse__ring-wrap">
        <svg viewBox="0 0 140 140" width="160" height="160" role="img" aria-label={`Trust score ${score} out of 100`}>
          {/* Background ring */}
          <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Colored segments */}
          {segments.map((seg, i) => {
            const dash = circumference * seg.fraction * (score / 100);
            const gap = circumference - dash;
            const offset = -(circumference * accOffset);
            accOffset += seg.fraction;
            return (
              <circle
                key={i}
                cx="70" cy="70" r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="10"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', filter: `drop-shadow(0 0 6px ${seg.color}55)` }}
              />
            );
          })}
          <text x="70" y="66" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="700" fontFamily="var(--font-display)">{score}</text>
          <text x="70" y="84" textAnchor="middle" fill="rgba(165,180,198,0.8)" fontSize="11" fontFamily="var(--font-body)">/ 100</text>
        </svg>
      </div>

      <div className="trust-pulse__engines">
        {engines.map((e) => (
          <div key={e.name} className="trust-pulse__engine-item">
            <span className="trust-pulse__engine-dot" style={{ background: e.color }} />
            <span className="trust-pulse__engine-name">{e.name}</span>
            <span className="trust-pulse__engine-score" style={{ color: e.color }}>{e.score}</span>
            <span className={`trust-pulse__engine-trend ${Number(e.trend) >= 0 ? 'trust-pulse__engine-trend--up' : ''}`}>
              {Number(e.trend) > 0 ? `+${e.trend}` : e.trend}
            </span>
          </div>
        ))}
      </div>

      <span className="trust-pulse__updated">Updated 2 hours ago</span>
    </motion.div>
  );
}

/* ═══════════════════════ AI Insight Panel ═══════════════════════ */

function InsightPanel() {
  const factors = [
    { label: 'Cost overlap', value: 0.82 },
    { label: 'Usage frequency', value: 0.45 },
    { label: 'Contract flexibility', value: 0.71 },
  ];

  return (
    <motion.div variants={fadeUp} className="insight-panel dashboard-main-card">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
          <strong style={{ color: '#f8fafc' }}>Top recommendation rationale</strong>
        </div>
      </header>

      <p className="insight-panel__summary">
        Consolidating overlapping subscriptions can reduce monthly SaaS spend by $140. Analysis driven by cost overlap detection and usage pattern scoring.
      </p>

      <div className="insight-panel__factors">
        {factors.map((f) => (
          <div key={f.label} className="insight-panel__factor">
            <div className="insight-panel__factor-header">
              <span>{f.label}</span>
              <span style={{ color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{f.value.toFixed(2)}</span>
            </div>
            <div className="insight-panel__factor-bar-bg">
              <div
                className="insight-panel__factor-bar"
                style={{ width: `${f.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="insight-panel__footer">
        <div className="insight-panel__confidence">
          <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14"
              fill="none" stroke="var(--accent-teal)" strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 14 * 0.92} ${2 * Math.PI * 14 * 0.08}`}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
            <text x="18" y="21" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="600">92%</text>
          </svg>
          <span style={{ fontSize: 12, color: 'rgba(165,180,198,0.9)' }}>Confidence</span>
        </div>
        <span className="insight-panel__audit-link" aria-label="Audit reference">
          <ExternalLink size={12} />
          GV-2026-0216-DASH-REC
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════ Forecast Chart ═══════════════════════ */

const forecastData = [
  { date: 'Jan', actual: 3200, forecast: null, hi: null, lo: null },
  { date: 'Feb', actual: 3800, forecast: null, hi: null, lo: null },
  { date: 'Mar', actual: 3500, forecast: null, hi: null, lo: null },
  { date: 'Apr', actual: 4100, forecast: null, hi: null, lo: null },
  { date: 'May', actual: 4600, forecast: null, hi: null, lo: null },
  { date: 'Jun', actual: 4100, forecast: 4100, hi: 4100, lo: 4100 },
  { date: 'Jul', actual: null, forecast: 4400, hi: 4800, lo: 4000 },
  { date: 'Aug', actual: null, forecast: 4800, hi: 5400, lo: 4200 },
  { date: 'Sep', actual: null, forecast: 5100, hi: 5900, lo: 4300 },
  { date: 'Oct', actual: null, forecast: 5500, hi: 6400, lo: 4600 },
  { date: 'Nov', actual: null, forecast: 5900, hi: 7000, lo: 4800 },
  { date: 'Dec', actual: null, forecast: 6200, hi: 7500, lo: 4900 },
];

function ForecastChart() {
  return (
    <motion.div variants={fadeUp} className="forecast-chart dashboard-main-card">
      <header>
        <strong style={{ color: '#f8fafc' }}>Cash flow forecast</strong>
      </header>
      <div className="dashboard-chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={forecastData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#253852" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" stroke="#4a6384" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#4a6384" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
            <Tooltip
              contentStyle={{
                background: 'rgba(8,12,24,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                fontSize: 12,
                color: '#f8fafc',
              }}
              labelStyle={{ color: '#a5b4c6' }}
            />
            <Area type="monotone" dataKey="hi" stroke="none" fill="url(#bandGrad)" isAnimationActive={false} />
            <Area type="monotone" dataKey="lo" stroke="none" fill="#0A1628" isAnimationActive={false} />
            <Area type="monotone" dataKey="actual" stroke="#14B8A6" strokeWidth={2} fill="url(#actualGrad)" dot={false} isAnimationActive={false} />
            <Area type="monotone" dataKey="forecast" stroke="#14B8A6" strokeWidth={2} strokeDasharray="6 4" fill="none" dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════ Alerts Hub ═══════════════════════ */

function AlertsHub() {
  const { navigate } = useRouter();
  const alerts = [
    {
      id: 1,
      severity: 'Critical' as const,
      merchant: 'Wire Transfer — Unknown Recipient',
      amount: '$12,400',
      timestamp: '14 min ago',
    },
    {
      id: 2,
      severity: 'Warning' as const,
      merchant: 'Subscription — Adobe Creative Cloud',
      amount: '$599/yr',
      timestamp: '2 hours ago',
    },
  ];

  return (
    <motion.div variants={fadeUp} className="alerts-hub dashboard-main-card">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} style={{ color: 'var(--state-warning)' }} />
          <strong style={{ color: '#f8fafc' }}>Alerts</strong>
        </div>
        <span className="alerts-hub__badge">2 active</span>
      </header>

      <div className="alerts-hub__list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alerts-hub__card alerts-hub__card--${alert.severity.toLowerCase()}`}>
            <div className="alerts-hub__card-top">
              <span className={`alerts-hub__severity alerts-hub__severity--${alert.severity.toLowerCase()}`}>
                {alert.severity}
              </span>
              <span className="alerts-hub__timestamp">{alert.timestamp}</span>
            </div>
            <div className="alerts-hub__card-body">
              <span className="alerts-hub__merchant">{alert.merchant}</span>
              <span className="alerts-hub__amount">{alert.amount}</span>
            </div>
            <div className="alerts-hub__actions">
              <button className="alerts-hub__btn alerts-hub__btn--primary" type="button" onClick={() => navigate('/protect/alert-detail')}>
                Investigate
                <ChevronRight size={14} />
              </button>
              <button className="alerts-hub__btn alerts-hub__btn--ghost" type="button">Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════ Export ═══════════════════════ */

export function PrimaryFeed() {
  return (
    <motion.div
      className="primary-feed"
      data-slot="primary_feed"
      variants={staggerContainer}
    >
      <ScoreRing />
      <InsightPanel />
      <ForecastChart />
      <AlertsHub />
    </motion.div>
  );
}
