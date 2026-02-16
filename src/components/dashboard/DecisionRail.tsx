import type React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowDown, Activity } from 'lucide-react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
};

/* ═══════════════════════ Net Worth Hero ═══════════════════════ */

function NetWorthHero() {
  return (
    <motion.div variants={fadeUp} className="net-worth dashboard-side-card" style={{ '--context-accent': 'var(--engine-grow)' } as React.CSSProperties}>
      <header>
        <strong style={{ color: '#f8fafc' }}>Net worth</strong>
      </header>
      <div className="net-worth__value-wrap">
        <span className="net-worth__value">$847,200</span>
        <div className="net-worth__glow" aria-hidden="true" />
      </div>
      <div className="net-worth__trend">
        <TrendingUp size={16} style={{ color: '#10B981' }} />
        <span className="net-worth__trend-value">+$12,400 (+1.5%)</span>
        <span className="net-worth__trend-period">vs last month</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════ Risk Gauge ═══════════════════════ */

function RiskGauge() {
  const score = 0.12;
  const radius = 44;
  const circumference = Math.PI * radius; // semi-circle
  const filled = circumference * (score / 1);

  return (
    <motion.div variants={fadeUp} className="risk-gauge dashboard-side-card">
      <header>
        <strong style={{ color: '#f8fafc' }}>Risk score</strong>
      </header>
      <div className="risk-gauge__dial-wrap">
        <svg viewBox="0 0 120 72" width="120" height="72" role="img" aria-label={`Risk score ${score}`}>
          {/* Background arc */}
          <path
            d="M 10 62 A 44 44 0 0 1 110 62"
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round"
          />
          {/* Green zone */}
          <path
            d="M 10 62 A 44 44 0 0 1 110 62"
            fill="none" stroke="url(#riskGrad)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
          />
          <defs>
            <linearGradient id="riskGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <text x="60" y="52" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="700" fontFamily="var(--font-display)">{score.toFixed(2)}</text>
          <text x="60" y="66" textAnchor="middle" fill="#10B981" fontSize="10" fontFamily="var(--font-body)">Low</text>
        </svg>
      </div>
      <div className="risk-gauge__meta">
        <ArrowDown size={14} style={{ color: '#10B981' }} />
        <span style={{ color: '#10B981', fontSize: 13, fontWeight: 600 }}>-0.05</span>
        <span style={{ color: 'rgba(165,180,198,0.8)', fontSize: 12 }}>from last week</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════ Mission Action List ═══════════════════════ */

function ActionList() {
  const actions = [
    {
      urgency: 'critical' as const,
      title: 'Block suspicious wire',
      description: 'Unrecognized $12,400 transfer flagged by Protect engine',
      engine: 'Protect',
    },
    {
      urgency: 'warning' as const,
      title: 'Consolidate subscriptions',
      description: 'Save $140/mo by merging 3 overlapping SaaS tools',
      engine: 'Execute',
    },
    {
      urgency: 'healthy' as const,
      title: 'Rebalance portfolio',
      description: 'Drift detected: equity allocation 4% above target',
      engine: 'Grow',
    },
  ];

  const urgencyDots: Record<string, string> = {
    critical: '#EF4444',
    warning: '#F59E0B',
    healthy: '#10B981',
  };

  return (
    <motion.div variants={fadeUp} className="action-list dashboard-side-card">
      <header>
        <strong style={{ color: '#f8fafc' }}>Next best actions</strong>
      </header>
      <ul className="dashboard-action-list">
        {actions.map((a) => (
          <li key={a.title} data-tone={a.urgency}>
            <div className="dashboard-action-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: urgencyDots[a.urgency],
                    boxShadow: `0 0 6px ${urgencyDots[a.urgency]}66`,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <strong style={{ color: '#f8fafc' }}>{a.title}</strong>
              </div>
              <span className="dashboard-action-badge mission-badge--neutral">{a.engine}</span>
            </div>
            <span>{a.description}</span>
            <button
              className="action-list__exec-btn"
              type="button"
            >
              Execute
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ═══════════════════════ Activity Timeline ═══════════════════════ */

function ActivityTimeline() {
  const items = [
    { engine: 'Protect', color: '#22C55E', time: '2 min ago', text: 'Wire transfer flagged for review' },
    { engine: 'Execute', color: '#EAB308', time: '18 min ago', text: 'Monthly rent payment approved' },
    { engine: 'Govern', color: '#3B82F6', time: '1 hour ago', text: 'Compliance report generated' },
    { engine: 'Grow', color: '#8B5CF6', time: '3 hours ago', text: 'Portfolio rebalance recommendation updated' },
    { engine: 'Protect', color: '#22C55E', time: '6 hours ago', text: '3 alerts resolved automatically' },
  ];

  return (
    <motion.div variants={fadeUp} className="timeline dashboard-side-card">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={16} style={{ color: 'var(--accent-cyan)' }} />
          <strong style={{ color: '#f8fafc' }}>Activity</strong>
        </div>
      </header>
      <div className="timeline__list">
        {items.map((item, i) => (
          <div key={i} className="timeline__item">
            <div className="timeline__line-wrap">
              <span className="timeline__dot" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}55` }} />
              {i < items.length - 1 && <span className="timeline__connector" />}
            </div>
            <div className="timeline__content">
              <div className="timeline__meta">
                <span className="timeline__engine" style={{ color: item.color }}>{item.engine}</span>
                <span className="timeline__time">{item.time}</span>
              </div>
              <span className="timeline__text">{item.text}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════���════ Export ═══════════════════════ */

export function DecisionRail() {
  return (
    <motion.div
      className="decision-rail"
      data-slot="decision_rail"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <NetWorthHero />
      <RiskGauge />
      <ActionList />
      <ActivityTimeline />
    </motion.div>
  );
}
