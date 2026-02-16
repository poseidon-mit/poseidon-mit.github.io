import React from 'react';
import { Link } from '../router';
import { Shield, CreditCard, MapPin, Clock } from 'lucide-react';
import { ActionOutcomePreview } from '../components/ActionOutcomePreview';
import { CategoryScoreBar } from '../components/CategoryScoreBar';
import type { CategoryScore } from '../components/CategoryScoreBar';
import { DefinitionLine } from '../components/DefinitionLine';
import { PageShell } from '../components/PageShell';
import { ExplainableInsightPanel } from '../components/ExplainabilityPanel';
import { GovernContractSet } from '../components/GovernContractSet';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import type { Milestone } from '../components/MilestonesTimeline';
import { MissionActionList } from '../components/MissionActionList';
import { MissionDataRows } from '../components/MissionDataRows';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionStatusChip } from '../components/MissionStatusChip';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

// ── Static data ──────────────────────────────────────────────

const alertDetail = {
  id: 'ALT-2026-0215-001',
  merchant: 'MerchantX',
  amount: '$4,200',
  date: 'Feb 15, 2026 14:28 UTC',
  card: '****4829',
  category: 'Electronics',
  status: 'Under investigation',
  confidence: 0.94,
  topFactors: [
    { label: 'Merchant history', contribution: 0.82, note: 'First purchase at this merchant' },
    { label: 'Amount deviation', contribution: 0.71, note: '3.2x category average' },
    { label: 'Geographic mismatch', contribution: 0.65, note: '2,400km from usual location' },
  ],
  shapFactors: [
    { feature: 'Merchant history', shapValue: 0.82, explanation: 'First purchase at this merchant category' },
    { feature: 'Amount deviation', shapValue: 0.71, explanation: '$4,200 is 3.2x the category average' },
    { feature: 'Geographic mismatch', shapValue: 0.65, explanation: 'Transaction origin 2,400km from usual' },
    { feature: 'Time pattern', shapValue: -0.12, explanation: 'Within normal business hours' },
    { feature: 'Account age', shapValue: -0.08, explanation: 'Account >2 years old (stabilizing factor)' },
  ],
};

const categoryBreakdown: CategoryScore[] = [
  { name: 'Transaction patterns', score: 92, icon: CreditCard, color: 'var(--accent-teal)' },
  { name: 'Merchant risk', score: 87, icon: Shield, color: 'var(--accent-teal)' },
  { name: 'Geographic signals', score: 95, icon: MapPin, color: 'var(--accent-teal)' },
  { name: 'Behavioral match', score: 91, icon: Clock, color: 'var(--accent-teal)' },
];

const decisionTimeline: Milestone[] = [
  { label: 'Signal detected', date: '14:28 UTC', status: 'completed' },
  { label: 'Analysis complete', date: '14:29 UTC', status: 'completed' },
  { label: 'Alert raised', date: '14:30 UTC', status: 'completed' },
  { label: 'User notified', date: '14:31 UTC', status: 'completed' },
  { label: 'Resolution', date: 'Pending', status: 'upcoming' },
];

const kpiSparklines = {
  confidence: [{ value: 0.91 }, { value: 0.92 }, { value: 0.93 }, { value: 0.93 }, { value: 0.94 }, { value: 0.94 }],
  factors: [{ value: 3 }, { value: 4 }, { value: 4 }, { value: 5 }, { value: 5 }, { value: 5 }],
  similar: [{ value: 14 }, { value: 15 }, { value: 16 }, { value: 17 }, { value: 18 }, { value: 18 }],
  resolved: [{ value: 93 }, { value: 94 }, { value: 95 }, { value: 96 }, { value: 97 }, { value: 97 }],
};

// ── Component ────────────────────────────────────────────────

export const ProtectAlertDetail: React.FC = () => {
  const contract = getRouteScreenContract('protect-alert-detail');

  // ── Primary feed ───────────────────────────────────────────

  const primaryFeed = (
    <>
      {/* Transaction detail card */}
      <article
        className="engine-card"
        style={{ borderLeft: '3px solid var(--accent-teal)' }}
      >
        <MissionSectionHeader
          title="Transaction detail"
          right={<MissionStatusChip tone="warning" label={alertDetail.status} />}
        />
        <div className="flex flex-col gap-2 py-2">
          <MissionDataRows
            items={[
              { id: 'TD-MERCH', title: 'Merchant', value: alertDetail.merchant, tone: 'primary' },
              { id: 'TD-AMT', title: 'Amount', value: alertDetail.amount, tone: 'critical' },
              { id: 'TD-DATE', title: 'Date', value: alertDetail.date, tone: 'primary' },
              { id: 'TD-CARD', title: 'Card ending', value: alertDetail.card, tone: 'primary' },
              { id: 'TD-CAT', title: 'Category', value: alertDetail.category, tone: 'primary' },
            ]}
          />
        </div>
        <ScoreRing
          score={94}
          label="Threat Confidence"
          subtitle="/ 100"
          statusText="High confidence"
          color="var(--accent-teal)"
          size="md"
        />
      </article>

      {/* SHAP explanation */}
      <ExplainableInsightPanel
        title="SHAP explanation"
        summary={`Base value 0.50 -> Prediction ${alertDetail.confidence}. ${alertDetail.shapFactors.length} factors analyzed.`}
        topFactors={alertDetail.topFactors}
        confidence={alertDetail.confidence}
        recency="14:28 UTC"
        governMeta={{
          auditId: alertDetail.id,
          modelVersion: 'FraudDetection v3.2',
          explanationVersion: 'SHAP v2.1',
          timestamp: new Date().toISOString(),
        }}
      />

      {/* Category breakdown */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Category breakdown"
          message="Per-category risk assessment."
        />
        <CategoryScoreBar categories={categoryBreakdown} iconAccent="var(--accent-teal)" />
      </article>

      {/* Actions */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Available actions"
          message="Choose an action based on the evidence above."
        />
        <MissionActionList
          items={[
            { title: 'Block card', meta: 'Immediate -- reversible within 24h', tone: 'critical' },
            { title: 'Mark as safe', meta: 'Resolve alert -- model feedback recorded', tone: 'healthy' },
          ]}
        />
        <ActionOutcomePreview
          outcome="Card will be frozen immediately. All pending transactions held. Merchant flagged."
          reversibleWindow="24h"
          sideEffects={['Pending charges held', 'Cardholder notified', 'Audit trail updated']}
          impact={`${alertDetail.amount} blocked`}
          reversible
        />
        <div className="mission-dual-actions">
          <button type="button" className="entry-btn entry-btn--primary">Block card</button>
          <Link className="entry-btn entry-btn--ghost" to="/protect/dispute">Dispute transaction</Link>
        </div>
      </article>

      {/* Govern footer */}
      <GovernContractSet
        auditId={alertDetail.id}
        modelVersion="FraudDetection v3.2"
        explanationVersion="SHAP v2.1"
      />
    </>
  );

  // ── Decision rail ──────────────────────────────────────────

  const decisionRail = (
    <>
      {/* Decision timeline */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Decision timeline"
          message="Signal lifecycle from detection to resolution."
        />
        <MilestonesTimeline
          milestones={decisionTimeline}
          accentColor="var(--accent-teal)"
        />
      </article>

      {/* Model metadata */}
      <article className="engine-card">
        <MissionSectionHeader title="Model metadata" />
        <MissionDataRows
          items={[
            { id: 'MM-VER', title: 'Model version', value: 'FraudDetection v3.2', tone: 'primary' },
            { id: 'MM-TRAIN', title: 'Training data', value: '180 days', tone: 'primary' },
            { id: 'MM-ACC', title: 'Accuracy', value: '97.2%', tone: 'healthy' },
            { id: 'MM-FP', title: 'False positive rate', value: '2.1%', tone: 'primary' },
          ]}
        />
        <DefinitionLine
          metric="Confidence"
          formula="SHAP(features) x ensemble_weight"
          unit="0-1"
          period="per-event"
          threshold="> 0.80 actionable"
        />
      </article>

      {/* Similar cases */}
      <article className="engine-card">
        <MissionSectionHeader title="Similar past cases" />
        <MissionDataRows
          items={[
            { id: 'SC-1', title: 'MerchantY $3,800 -- Jan 2026', value: 'Blocked', tone: 'critical' },
            { id: 'SC-2', title: 'Online purchase $2,100 -- Dec 2025', value: 'Cleared', tone: 'healthy' },
            { id: 'SC-3', title: 'Foreign transaction $5,400 -- Nov 2025', value: 'Blocked', tone: 'critical' },
          ]}
        />
        <ProofLine
          claim="18 similar cases resolved"
          evidence="97% resolution accuracy on matching patterns"
          source="Pattern matching engine"
          basis="6 months"
          sourceType="model"
        />
      </article>
    </>
  );

  return (
    <PageShell
      slug="protect"
      contract={contract}
      layout="engine"
      heroVariant="focused"
      hero={{
        kicker: 'Protect / Alert Detail',
        engineBadge: 'Protect',
        headline: `Suspicious transaction -- ${alertDetail.merchant} ${alertDetail.amount}`,
        subline: `Signal confidence ${alertDetail.confidence} | Model: FraudDetection v3.2 | Reported: 14:28 UTC`,
        proofLine: {
          claim: `Signal confidence ${alertDetail.confidence}`,
          evidence: `${alertDetail.shapFactors.length} SHAP factors | FraudDetection v3.2`,
          source: 'Protect engine',
        },
        freshness: new Date(Date.now() - 12 * 60 * 1000),
        kpis: [
          { label: 'Confidence', value: '94%', definition: 'Model confidence in threat classification.', accent: 'teal', sparklineData: kpiSparklines.confidence, sparklineColor: 'var(--state-healthy)' },
          { label: 'SHAP factors', value: '5', definition: 'Contributing factors in explanation.', accent: 'cyan', sparklineData: kpiSparklines.factors, sparklineColor: '#00F0FF' },
          { label: 'Similar cases', value: '18', definition: 'Historical cases with matching pattern.', accent: 'blue', sparklineData: kpiSparklines.similar, sparklineColor: 'var(--state-primary)' },
          { label: 'Resolution rate', value: '97%', definition: 'Similar alerts resolved correctly.', accent: 'amber', sparklineData: kpiSparklines.resolved, sparklineColor: 'var(--state-warning)' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default ProtectAlertDetail;
