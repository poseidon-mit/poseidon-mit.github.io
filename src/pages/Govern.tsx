import React, { useState } from 'react';
import { Link } from '../router';
import { Lock, Scale, Search, Users } from 'lucide-react';
import { AuditLinkChip } from '../components/AuditLinkChip';
import { AuditLogCard } from '../components/AuditLogCard';
import { CategoryScoreBar } from '../components/CategoryScoreBar';
import type { CategoryScore } from '../components/CategoryScoreBar';
import { DefinitionLine } from '../components/DefinitionLine';
import { PageShell } from '../components/PageShell';
import { GovernContractSet } from '../components/GovernContractSet';
import { GovernVerifiedBadge } from '../components/GovernVerifiedBadge';
import { HumanReviewCTA } from '../components/HumanReviewCTA';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import type { Milestone } from '../components/MilestonesTimeline';
import { MissionActionList } from '../components/MissionActionList';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionStatusChip } from '../components/MissionStatusChip';
import { PrivacyControlCard } from '../components/PrivacyControlCard';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import {
  mockAuditLogs,
  mockGovernStats,
  mockPrivacyControls,
} from '../services/mockGovern';
import type { PrivacyControl } from '../services/mockGovern';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';
import { useUI } from '../contexts/UIContext';

// ── Static data ──────────────────────────────────────────────

const complianceCategories: CategoryScore[] = [
  { name: 'Data Privacy', score: 98, icon: Lock, color: 'var(--state-healthy)' },
  { name: 'Fair Lending', score: 94, icon: Scale, color: 'var(--state-healthy)' },
  { name: 'AML / KYC', score: 92, icon: Search, color: 'var(--state-healthy)' },
  { name: 'Consumer Protection', score: 100, icon: Users, color: 'var(--state-healthy)' },
];

const governMilestones: Milestone[] = [
  { label: 'Governance engine deployed', date: 'Jan 15, 2026', status: 'completed' },
  { label: '1,000 decisions audited', date: 'Feb 1, 2026', status: 'completed' },
  { label: 'Zero-violation streak: 30d', date: 'Feb 15, 2026', status: 'upcoming' },
  { label: 'SOC 2 audit target', date: 'Mar 15, 2026', status: 'future' },
];

const kpiSparklines = {
  compliance: [{ value: 93 }, { value: 94 }, { value: 95 }, { value: 95 }, { value: 96 }, { value: 96 }],
  audited: [{ value: 800 }, { value: 900 }, { value: 1000 }, { value: 1100 }, { value: 1200 }, { value: 1247 }],
  override: [{ value: 5 }, { value: 4.5 }, { value: 4 }, { value: 3.8 }, { value: 3.5 }, { value: 3.2 }],
  response: [{ value: 250 }, { value: 230 }, { value: 220 }, { value: 210 }, { value: 205 }, { value: 198 }],
};

// ── Component ────────────────────────────────────────────────

export const Govern: React.FC = () => {
  const contract = getRouteScreenContract('govern');
  const { addNotification } = useUI();
  const [controls, setControls] = useState<PrivacyControl[]>(mockPrivacyControls);

  const handleToggleControl = (category: string) => {
    let updatedState = false;
    setControls((prev) =>
      prev.map((item) => {
        if (item.category !== category) return item;
        updatedState = !item.enabled;
        return { ...item, enabled: updatedState };
      }),
    );
    addNotification({
      type: 'success',
      message: `${category} control ${updatedState ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleFeedback = () => {
    // Prototype no-op
  };

  // ── Primary feed ───────────────────────────────────────────

  const primaryFeed = (
    <>
      {/* Compliance score ring */}
      <article className="engine-card">
        <ScoreRing
          score={96}
          label="Compliance Score"
          subtitle="/ 100"
          statusText="Excellent -- no violations"
          color="var(--accent-blue)"
          gradientEnd="#60A5FA"
          size="lg"
        />
      </article>

      {/* Category breakdown */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Compliance categories"
          message="Score breakdown by regulatory area."
        />
        <CategoryScoreBar categories={complianceCategories} iconAccent="var(--accent-blue)" />
        <DefinitionLine
          metric="Compliance Score"
          formula="mean(category_scores) weighted by regulatory priority"
          unit="0-100"
          period="rolling 30d"
          threshold="< 80 triggers review"
        />
      </article>

      {/* Audit log preview */}
      <section className="engine-section">
        <MissionSectionHeader
          title="Audit log"
          message="Recent AI decisions with full audit trail."
          right={<MissionStatusChip tone="primary" label={`${mockGovernStats.totalDecisions.toLocaleString()} decisions`} />}
        />
        <div className="engine-item-list">
          {mockAuditLogs.map((log) => (
            <div key={log.id}>
              <AuditLogCard log={log} onProvideFeedback={handleFeedback} />
              <ProofLine
                claim={`Accuracy ${log.decision.model.accuracy}%`}
                evidence={`GDPR: ${log.complianceFlags.gdprCompliant ? 'Compliant' : 'Non-compliant'} | ECOA: ${log.complianceFlags.ecoaCompliant ? 'Compliant' : 'Non-compliant'}`}
                source="Govern engine"
                sourceType="audit"
              />
            </div>
          ))}
        </div>
        <div className="mission-dual-actions">
          <Link className="entry-btn entry-btn--ghost" to="/govern/audit">View full audit ledger</Link>
        </div>
      </section>

      {/* Privacy controls */}
      <section className="engine-section">
        <MissionSectionHeader
          title="Privacy controls"
          message="Data sharing and processing preferences."
          right={<MissionStatusChip tone="primary" label={`${controls.filter((c) => c.enabled).length}/${controls.length} active`} />}
        />
        <div className="engine-item-list">
          {controls.map((control) => (
            <PrivacyControlCard key={control.category} control={control} onToggle={handleToggleControl} />
          ))}
        </div>
        <ProofLine
          claim="Privacy controls configured"
          evidence="GDPR + CCPA compliant | User consent tracked"
          source="Governance policy engine"
          sourceType="policy"
        />
      </section>

      {/* Govern footer */}
      <GovernContractSet
        auditId="GV-2026-0215-GOV"
        modelVersion="Governance v1.8"
        explanationVersion="SHAP v2.1"
      />
    </>
  );

  // ── Decision rail ──────────────────────────────────────────

  const decisionRail = (
    <>
      {/* Verified badge */}
      <article className="engine-card">
        <div className="flex flex-col items-center gap-4 py-4">
          <GovernVerifiedBadge
            auditId="GV-2026-0215-GOV"
            modelVersion="Governance v1.8"
            explanationVersion="SHAP v2.1"
          />
          <p className="text-center text-sm font-medium" style={{ color: 'var(--text)' }}>
            All Systems Verified
          </p>
        </div>
      </article>

      {/* Audit summary */}
      <article className="engine-card">
        <MissionSectionHeader title="Audit summary" />
        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Total decisions</span>
            <span className="text-lg font-bold font-mono" style={{ color: 'var(--text)' }}>1,247</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Audit coverage</span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: 'rgba(20,184,166,0.1)', color: 'var(--state-healthy)' }}
            >
              100%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Last entry</span>
            <span className="text-sm" style={{ color: 'var(--muted-2)' }}>4m ago</span>
          </div>
        </div>
        <AuditLinkChip auditId="GV-2026-0215-GOV" />
      </article>

      {/* Milestones */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Governance milestones"
          message="Progress toward compliance targets."
        />
        <MilestonesTimeline
          milestones={governMilestones}
          accentColor="var(--accent-blue)"
        />
      </article>

      {/* Human review CTA */}
      <article className="engine-card">
        <HumanReviewCTA />
      </article>

      {/* Next actions */}
      <article className="engine-card">
        <MissionSectionHeader title="Next best actions" />
        <MissionActionList
          items={[
            { title: 'Review SOX compliance gap', meta: 'Priority', tone: 'critical' },
            { title: 'Audit latest model update', meta: 'Scheduled', tone: 'primary' },
            { title: 'Update consent scope', meta: 'Monthly task', tone: 'warning' },
          ]}
        />
        <div className="mission-dual-actions">
          <Link className="entry-btn entry-btn--ghost" to="/dashboard">Return to dashboard</Link>
        </div>
      </article>
    </>
  );

  return (
    <PageShell
      slug="govern"
      contract={contract}
      layout="engine"
      heroVariant="analytical"
      hero={{
        kicker: 'Govern',
        engineBadge: 'Govern',
        headline: '1,247 decisions audited. Compliance score: 96/100.',
        subline: 'Every AI decision explainable, auditable, and reversible. Zero compliance violations.',
        statSummary: `${mockGovernStats.totalDecisions.toLocaleString()} audited | 0 violations | Last audit: 4m ago`,
        proofLine: {
          claim: '1,247 audited | 0 violations | Last audit: 4m ago',
          evidence: 'Model: Governance v1.8 | Basis: GDPR + Fair Lending Act',
          source: 'Govern engine',
        },
        heroAction: {
          label: 'AI insight:',
          text: 'All 4 engines within compliance bounds. Data Privacy score improved +2 points this week.',
          cta: { label: 'View audit ledger', to: '/govern/audit' },
        },
        freshness: new Date(Date.now() - 4 * 60 * 1000),
        kpis: [
          {
            label: 'Compliance',
            value: '96/100',
            definition: 'Composite compliance score across all regulatory categories.',
            accent: 'teal',
            sparklineData: kpiSparklines.compliance,
            sparklineColor: 'var(--state-healthy)',
          },
          {
            label: 'Decisions audited',
            value: '1,247',
            definition: 'Total AI decisions with full audit trail.',
            accent: 'blue',
            sparklineData: kpiSparklines.audited,
            sparklineColor: 'var(--state-primary)',
          },
          {
            label: 'Override rate',
            value: '3.2%',
            definition: 'Percentage of AI decisions overridden by humans.',
            accent: 'cyan',
            sparklineData: kpiSparklines.override,
            sparklineColor: '#00F0FF',
          },
          {
            label: 'Response time',
            value: '<200ms',
            definition: 'Time to generate explanation for any decision.',
            accent: 'amber',
            sparklineData: kpiSparklines.response,
            sparklineColor: 'var(--state-warning)',
          },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default Govern;
