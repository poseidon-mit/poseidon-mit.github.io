import React from 'react';
import { Link } from '../router';
import {
  Shield, TrendingUp, Zap, Scale, Lock, ScrollText,
  PlayCircle, RotateCcw, ChevronRight, Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProofLine } from '../components/ProofLine';
import { StatCard } from '../components/StatCard';
import { PageShell } from '../components/PageShell';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionMetadataStrip } from '../components/MissionMetadataStrip';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

// ── Animation variants ───────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ── Static data ──────────────────────────────────────────────

const engines = [
  {
    key: 'protect',
    name: 'Protect',
    icon: Shield,
    color: '#14B8A6',
    confidence: '0.94',
    description: 'Real-time threat detection with explainable AI',
    route: '/protect',
  },
  {
    key: 'grow',
    name: 'Grow',
    icon: TrendingUp,
    color: '#8B5CF6',
    confidence: '0.89',
    description: 'Forecast-driven growth with Monte Carlo bands',
    route: '/grow',
  },
  {
    key: 'execute',
    name: 'Execute',
    icon: Zap,
    color: '#F59E0B',
    confidence: '0.91',
    description: 'Consent-first automation with reversible actions',
    route: '/execute',
  },
  {
    key: 'govern',
    name: 'Govern',
    icon: Scale,
    color: '#3B82F6',
    confidence: '0.97',
    description: 'Full audit trail for every decision',
    route: '/govern',
  },
];

const trustMetrics = [
  { label: 'System Confidence', value: '0.92', sparklineData: [{ value: 0.88 }, { value: 0.89 }, { value: 0.9 }, { value: 0.91 }, { value: 0.92 }, { value: 0.92 }], sparklineColor: 'var(--accent-teal)' },
  { label: 'Decisions Audited', value: '1,247', sparklineData: [{ value: 900 }, { value: 980 }, { value: 1040 }, { value: 1100 }, { value: 1180 }, { value: 1247 }], sparklineColor: 'var(--accent-blue)' },
  { label: 'Threats Blocked', value: '23', sparklineData: [{ value: 12 }, { value: 14 }, { value: 16 }, { value: 18 }, { value: 20 }, { value: 23 }], sparklineColor: 'var(--state-warning)' },
  { label: 'Response Time', value: '<200ms', sparklineData: [{ value: 210 }, { value: 208 }, { value: 205 }, { value: 202 }, { value: 200 }, { value: 198 }], sparklineColor: 'var(--state-healthy)' },
];

const proofColumns = [
  {
    icon: Activity,
    title: 'Explainable',
    description: 'Every AI decision includes feature attribution',
  },
  {
    icon: ScrollText,
    title: 'Auditable',
    description: '1,247 decisions with full audit trails',
  },
  {
    icon: RotateCcw,
    title: 'Reversible',
    description: 'One-click rollback on any automated action',
  },
];

const kpiSparklines = {
  confidence: [{ value: 0.88 }, { value: 0.89 }, { value: 0.9 }, { value: 0.91 }, { value: 0.92 }, { value: 0.92 }],
  coverage: [{ value: 93 }, { value: 94 }, { value: 95 }, { value: 96 }, { value: 97 }, { value: 98 }],
  latency: [{ value: 18 }, { value: 16 }, { value: 15 }, { value: 14 }, { value: 13 }, { value: 12 }],
  readiness: [{ value: 82 }, { value: 84 }, { value: 86 }, { value: 88 }, { value: 90 }, { value: 91 }],
};

// ── Component ────────────────────────────────────────────────

export const Landing: React.FC = () => {
  const contract = getRouteScreenContract('landing');

  const primaryFeed = (
    <>
      {/* Live Trust Metrics */}
      <motion.section
        className="engine-card"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <MissionSectionHeader
          title="Live Trust Metrics"
          message="Real-time system health across all engines."
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {trustMetrics.map((metric) => (
            <motion.div key={metric.label} variants={fadeUp}>
              <StatCard
                label={metric.label}
                value={metric.value}
                sparkline={metric.sparklineData}
                accent={metric.sparklineColor as 'teal' | 'cyan' | 'blue' | 'amber'}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Four Engine Cards */}
      <motion.section
        className="engine-card"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <MissionSectionHeader
          title="Four engines, one trusted system"
          message="Each engine provides explainable, auditable AI assistance."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {engines.map((engine) => {
            const Icon = engine.icon;
            return (
              <motion.div key={engine.key} variants={fadeUp}>
                <Link
                  to={engine.route}
                  className="group flex flex-col gap-4 rounded-2xl border p-5 transition-all hover:shadow-lg md:p-6"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-shadow group-hover:shadow-md"
                      style={{
                        background: `color-mix(in srgb, ${engine.color} 12%, transparent)`,
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: engine.color }} />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                        {engine.name}
                      </h3>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-semibold font-mono"
                        style={{
                          background: `color-mix(in srgb, ${engine.color} 12%, transparent)`,
                          color: engine.color,
                        }}
                      >
                        {engine.confidence}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {engine.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
                    style={{ color: engine.color }}
                  >
                    {'Open '}
                    {engine.name}
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <ProofLine
          claim="4 engines integrated"
          evidence="Cross-engine trust composite | Evidence-backed decisions"
          source="Mission control"
          basis="real-time"
          sourceType="system"
        />
      </motion.section>

      {/* Governance Proof Section */}
      <motion.section
        className="engine-card"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <MissionSectionHeader
          title="Governance by design, not by checkbox"
          message="Trust built into every layer of the system."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {proofColumns.map((col) => {
            const Icon = col.icon;
            return (
              <motion.div
                key={col.title}
                variants={fadeUp}
                className="flex flex-col items-center gap-3 rounded-xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: 'rgba(59,130,246,0.1)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: '#3B82F6' }} />
                </div>
                <h4 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                  {col.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {col.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        <ProofLine
          claim="System uptime 99.97%"
          evidence="Last audit: 4m ago | Model version: v3.2.1"
          source="Governance engine"
          sourceType="system"
        />
      </motion.section>

      {/* Social Proof Footer */}
      <motion.section
        className="engine-card"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: '#3B82F6' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              MIT CTO Program
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-2)' }}>
            Built by Group 7 | MIT Sloan CTO Program 2026
          </p>
          <div className="flex gap-4 text-xs" style={{ color: 'var(--muted-2)' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </motion.section>
    </>
  );

  const decisionRail = (
    <>
      {/* Trust badges */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Trust signals"
          message="Security and compliance at a glance."
        />
        <div className="flex flex-col gap-3">
          {[
            { icon: Lock, label: 'Bank-grade security' },
            { icon: Shield, label: 'GDPR compliant' },
            { icon: ScrollText, label: '100% auditable' },
          ].map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: 'rgba(20,184,166,0.1)' }}
                >
                  <Icon className="h-4 w-4" style={{ color: '#14B8A6' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </article>

      {/* CTA section */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Get started"
          message="Three steps to full command center access."
        />
        <div className="flex flex-col gap-3">
          <Link
            className="entry-btn entry-btn--primary"
            to="/dashboard"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            Open Dashboard
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            className="entry-btn entry-btn--ghost"
            to="/dashboard"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <PlayCircle className="h-4 w-4" />
            Watch demo
          </Link>
        </div>
      </article>

      {/* Activation flow */}
      <article className="engine-card">
        <MissionSectionHeader title="Activation flow" />
        <div className="flex flex-col gap-3">
          {['Signup', 'Onboarding', 'Activate Studio'].map((step, i) => (
            <div
              key={step}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold font-mono"
                style={{ background: 'rgba(20,184,166,0.15)', color: '#14B8A6' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </article>
    </>
  );

  const rail = (
    <article className="engine-card mission-rail-card">
      <MissionMetadataStrip
        compact
        items={['Audit-ready defaults', 'Model + policy visible', 'Human review always available']}
      />
    </article>
  );

  return (
    <PageShell
      slug="landing"
      contract={contract}
      layout="dashboard"
      heroVariant="minimal"
      hero={{
        kicker: 'Poseidon.AI',
        headline: 'Safer, satisfying money decisions -- in one place.',
        subline: 'Four AI engines. One trusted system. Every decision auditable.',
        proofLine: {
          claim: 'Confidence 0.92',
          evidence: 'Cross-engine trust composite | 98% coverage',
          source: 'Mission control snapshot',
        },
        heroAction: {
          label: 'Recommended:',
          text: 'Create your account and complete onboarding to unlock full command center controls.',
          cta: { label: 'Open Dashboard', to: '/dashboard' },
        },
        freshness: new Date(Date.now() - 2 * 60 * 60 * 1000),
        kpis: [
          {
            label: 'Trust confidence',
            value: '0.92',
            definition: 'Composite confidence across Protect, Grow, Execute, and Govern',
            accent: 'teal',
            sparklineData: kpiSparklines.confidence,
            sparklineColor: 'var(--state-healthy)',
          },
          {
            label: 'Coverage',
            value: '98%',
            definition: 'Percent of critical financial workflows with traceable evidence',
            accent: 'cyan',
            sparklineData: kpiSparklines.coverage,
            sparklineColor: '#00F0FF',
          },
          {
            label: 'Decision latency',
            value: '12m',
            definition: 'Median time from signal to reviewed recommendation',
            accent: 'blue',
            sparklineData: kpiSparklines.latency,
            sparklineColor: 'var(--state-primary)',
          },
          {
            label: 'Activation readiness',
            value: '91%',
            definition: 'Likelihood of completing setup in one guided session',
            accent: 'amber',
            sparklineData: kpiSparklines.readiness,
            sparklineColor: 'var(--state-warning)',
          },
        ],
      }}
      rail={rail}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default Landing;
