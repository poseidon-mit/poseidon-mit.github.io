import React, { useReducer, useMemo, useCallback } from 'react';
import { Link } from '../router';
import { Shield, CreditCard, MapPin, Clock } from 'lucide-react';
import { ActionOutcomePreview } from '../components/ActionOutcomePreview';
import { AuditLinkChip } from '../components/AuditLinkChip';
import { Button } from '../components/Button';
import { CategoryScoreBar } from '../components/CategoryScoreBar';
import type { CategoryScore } from '../components/CategoryScoreBar';
import { DefinitionLine } from '../components/DefinitionLine';
import { PageShell } from '../components/PageShell';
import { ExplainableInsightPanel } from '../components/ExplainabilityPanel';
import { GovernContractSet } from '../components/GovernContractSet';
import { GovernVerifiedBadge } from '../components/GovernVerifiedBadge';
import { HumanReviewCTA } from '../components/HumanReviewCTA';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import type { Milestone } from '../components/MilestonesTimeline';
import { MissionActionList } from '../components/MissionActionList';
import { MissionEvidencePanel } from '../components/MissionEvidencePanel';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionStatusChip } from '../components/MissionStatusChip';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { ThreatAlertCard } from '../components/ThreatAlertCard';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';
import { useUI } from '../contexts/UIContext';
import {
  mockProtectStats,
  mockThreats,
} from '../services/mockProtect';
import type { ThreatAlert } from '../services/mockProtect';

// ── State machine ────────────────────────────────────────────

type ThreatAction = 'idle' | 'previewing_block' | 'previewing_approve';

interface ProtectState {
  threats: ThreatAlert[];
  focusedThreatId: string | null;
  pendingAction: ThreatAction;
}

type ProtectEvent =
  | { type: 'FOCUS_THREAT'; id: string }
  | { type: 'PREVIEW_BLOCK'; id: string }
  | { type: 'PREVIEW_APPROVE'; id: string }
  | { type: 'CONFIRM_ACTION' }
  | { type: 'CANCEL_PREVIEW' };

function protectReducer(state: ProtectState, event: ProtectEvent): ProtectState {
  switch (event.type) {
    case 'FOCUS_THREAT':
      return { ...state, focusedThreatId: event.id, pendingAction: 'idle' };
    case 'PREVIEW_BLOCK':
      return { ...state, focusedThreatId: event.id, pendingAction: 'previewing_block' };
    case 'PREVIEW_APPROVE':
      return { ...state, focusedThreatId: event.id, pendingAction: 'previewing_approve' };
    case 'CONFIRM_ACTION': {
      const newStatus = state.pendingAction === 'previewing_block' ? 'blocked' : 'approved';
      return {
        ...state,
        threats: state.threats.map((t) =>
          t.id === state.focusedThreatId ? { ...t, status: newStatus } : t,
        ),
        pendingAction: 'idle',
      };
    }
    case 'CANCEL_PREVIEW':
      return { ...state, pendingAction: 'idle' };
    default:
      return state;
  }
}

// ── Static data ──────────────────────────────────────────────

const categoryBreakdown: CategoryScore[] = [
  { name: 'Transaction patterns', score: 92, icon: CreditCard, color: 'var(--accent-teal)' },
  { name: 'Merchant risk', score: 87, icon: Shield, color: 'var(--accent-teal)' },
  { name: 'Geographic signals', score: 95, icon: MapPin, color: 'var(--accent-teal)' },
  { name: 'Behavioral match', score: 91, icon: Clock, color: 'var(--accent-teal)' },
];

const protectMilestones: Milestone[] = [
  { label: 'Signal detected', date: '14:28 UTC', status: 'completed' },
  { label: 'Analysis complete', date: '14:29 UTC', status: 'completed' },
  { label: 'Alert raised', date: '14:30 UTC', status: 'completed' },
  { label: 'Resolution pending', date: 'Awaiting', status: 'upcoming' },
];

const quickActions = [
  { title: 'Freeze card', meta: 'Immediate containment | Confidence 0.96', tone: 'critical' as const },
  { title: 'Investigate MerchantX', meta: 'SLA 24h | Confidence 0.91', tone: 'warning' as const },
  { title: 'Update alert rules', meta: 'Low priority | Confidence 0.88', tone: 'healthy' as const },
];

const kpiSparklines = {
  signals: [{ value: 5 }, { value: 4 }, { value: 6 }, { value: 3 }, { value: 4 }, { value: 3 }],
  blocked: [{ value: 0 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 0 }, { value: 1 }],
  fpRate: [{ value: 3.5 }, { value: 3.2 }, { value: 2.8 }, { value: 2.5 }, { value: 2.3 }, { value: 2.1 }],
  coverage: [{ value: 98 }, { value: 99 }, { value: 99 }, { value: 100 }, { value: 100 }, { value: 100 }],
};

// ── Component ────────────────────────────────────────────────

export const Protect: React.FC = () => {
  const [state, dispatch] = useReducer(protectReducer, {
    threats: mockThreats,
    focusedThreatId: mockThreats[0]?.id ?? null,
    pendingAction: 'idle',
  });
  const { addNotification } = useUI();
  const contract = getRouteScreenContract('protect');

  // Derived values
  const pendingCount = useMemo(
    () => state.threats.filter((t) => t.status === 'pending').length,
    [state.threats],
  );
  const focusedThreat = useMemo(
    () => state.threats.find((t) => t.id === state.focusedThreatId) ?? null,
    [state.threats, state.focusedThreatId],
  );

  // Handlers
  const handleBlock = useCallback((id: string) => {
    dispatch({ type: 'PREVIEW_BLOCK', id });
  }, []);

  const handleApprove = useCallback((id: string) => {
    dispatch({ type: 'PREVIEW_APPROVE', id });
  }, []);

  const handleConfirm = useCallback(() => {
    dispatch({ type: 'CONFIRM_ACTION' });
    const message = state.pendingAction === 'previewing_block'
      ? 'Threat blocked. Protection controls active. Audit trail updated.'
      : 'Alert resolved. Model feedback recorded. Audit trail updated.';
    addNotification({ type: 'success', message });
  }, [state.pendingAction, addNotification]);

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CANCEL_PREVIEW' });
  }, []);

  // ── Primary feed ───────────────────────────────────────────

  const primaryFeed = (
    <>
      {/* Threat table / triage queue */}
      <section className="engine-section">
        <MissionSectionHeader
          title="Threat triage queue"
          message="Sorted by severity and confidence. Select to inspect evidence."
          contextCue="Tap a threat to see SHAP evidence and decide"
          right={pendingCount > 0 ? <MissionStatusChip tone="critical" label={`${pendingCount} pending`} /> : undefined}
        />
        <div className="engine-item-list">
          {state.threats.map((threat) => (
            <div
              key={threat.id}
              onClick={() => dispatch({ type: 'FOCUS_THREAT', id: threat.id })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') dispatch({ type: 'FOCUS_THREAT', id: threat.id }); }}
            >
              <ThreatAlertCard
                alert={threat}
                onApprove={handleApprove}
                onBlock={handleBlock}
                summaryMaxLinesDesktop={contract.density.maxSummaryLinesDesktop}
                summaryMaxLinesMobile={contract.density.maxSummaryLinesMobile}
                detailsDefault={contract.density.detailsDefault}
              />
              <ProofLine
                claim={`Confidence ${(threat.aiExplanation.confidence / 100).toFixed(2)}`}
                evidence={`Top SHAP: ${threat.aiExplanation.shapValues[0]?.feature ?? 'N/A'} (${Math.abs(threat.aiExplanation.shapValues[0]?.shapValue ?? 0).toFixed(2)})`}
                source={`FP rate ${threat.aiExplanation.falsePositiveRate}%`}
                basis="per-event"
                sourceType="model"
              />
            </div>
          ))}
        </div>
        <DefinitionLine
          metric="Risk Score"
          formula="weighted_sum(signal_confidence x severity_factor)"
          unit="0-1"
          period="rolling 24h"
          threshold="> 0.7 triggers alert"
        />
      </section>

      {/* Quick actions */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Recommended actions"
          message="Ranked by severity and confidence."
        />
        <MissionActionList items={quickActions} />
        <ProofLine
          claim="3 actions recommended"
          evidence="Prioritized by severity x confidence | Model v3.2"
          source="Protect action ranker"
          sourceType="model"
        />
      </article>

      {/* Govern footer */}
      <GovernContractSet
        auditId="GV-2026-0215-PRT-SIG"
        modelVersion="FraudDetection v3.2"
        explanationVersion="SHAP v2.1"
      />
      <div className="govern-footer">
        <GovernVerifiedBadge
          auditId="GV-2026-0215-PRT-SIG"
          modelVersion="FraudDetection v3.2"
          explanationVersion="SHAP v2.1"
        />
        <AuditLinkChip auditId="GV-2026-0215-PRT-SIG" />
        <HumanReviewCTA caseType="dispute" />
      </div>
    </>
  );

  // ── Decision rail ──────────────────────────────────────────

  const decisionRail = (
    <>
      {/* Score ring */}
      <article className="engine-card">
        <ScoreRing
          score={94}
          label="Risk Score"
          subtitle="/ 100"
          statusText="Low -- monitoring"
          color="var(--accent-teal)"
          size="lg"
        />
      </article>

      {/* Category breakdown */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Category breakdown"
          message="Per-category threat scores."
        />
        <CategoryScoreBar categories={categoryBreakdown} iconAccent="var(--accent-teal)" />
      </article>

      {/* Milestones timeline */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Alert timeline"
          message="Signal lifecycle from detection to resolution."
        />
        <MilestonesTimeline
          milestones={protectMilestones}
          accentColor="var(--accent-teal)"
        />
      </article>

      {/* Evidence summary */}
      <MissionEvidencePanel
        className="engine-card"
        title="Evidence summary"
        summary="AI identified 3 correlated signals across 2 accounts in the last 6 hours."
        tone="primary"
      />

      {/* Focused threat evidence */}
      {focusedThreat && (
        <article className="engine-card">
          <MissionSectionHeader
            title={`Alert: ${focusedThreat.transaction.merchant}`}
            message={`${focusedThreat.type} -- ${focusedThreat.severity} severity`}
          />
          <ExplainableInsightPanel
            title="Threat evidence"
            summary={focusedThreat.aiExplanation.reason}
            topFactors={focusedThreat.aiExplanation.shapValues.slice(0, 3).map((s) => ({
              label: s.feature,
              contribution: Math.abs(s.shapValue),
              note: s.explanation,
            }))}
            confidence={focusedThreat.aiExplanation.confidence / 100}
            recency="Just now"
            governMeta={{
              auditId: `GV-2026-0215-${focusedThreat.id}`,
              modelVersion: 'FraudDetection v3.2',
              explanationVersion: 'SHAP v2.1',
              timestamp: new Date().toISOString(),
            }}
          />
          {state.pendingAction !== 'idle' && (
            <>
              {state.pendingAction === 'previewing_block' ? (
                <ActionOutcomePreview
                  outcome="Transaction blocked. Merchant rule updated. Future transactions from this merchant will be flagged."
                  reversibleWindow="24h"
                  sideEffects={[
                    'Merchant flagged for future transactions',
                    'Finance owner notified via alert',
                    'Audit trail entry created',
                  ]}
                  impact={`$${focusedThreat.transaction.amount.toLocaleString()} blocked`}
                  reversible
                />
              ) : (
                <ActionOutcomePreview
                  outcome="Transaction approved. Alert resolved. Model will incorporate this feedback."
                  reversibleWindow="N/A"
                  sideEffects={[
                    'Model updated with approval feedback',
                    'False positive rate may adjust',
                    'Audit trail entry created',
                  ]}
                  reversible={false}
                />
              )}
              <div className="mission-dual-actions">
                <Button variant="primary" onClick={handleConfirm}>
                  {state.pendingAction === 'previewing_block' ? 'Confirm block' : 'Confirm approve'}
                </Button>
                <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
              </div>
            </>
          )}
        </article>
      )}

      {/* Navigation links */}
      <div className="mission-dual-actions">
        <Link className="entry-btn entry-btn--ghost" to="/protect/alert-detail">Alert detail</Link>
        <Link className="entry-btn entry-btn--ghost" to="/govern">Audit trail</Link>
      </div>
    </>
  );

  return (
    <PageShell
      slug="protect"
      contract={contract}
      layout="engine"
      heroVariant="focused"
      hero={{
        kicker: 'Protect',
        engineBadge: 'Protect',
        headline: `3 active signals. Confidence 0.94. No action required.`,
        subline: 'Continuous monitoring across all accounts. Last scan: 4 minutes ago.',
        valueStatement: `$${mockProtectStats.totalProtected.toLocaleString()} protected this cycle.`,
        proofLine: {
          claim: '3 signals detected | Confidence 0.94',
          evidence: 'Model: FraudDetection v3.2 | Basis: 180-day behavioral analysis',
          source: 'Protect engine',
        },
        heroAction: {
          label: 'AI insight:',
          text: 'Unusual pattern detected at MerchantX -- $4,200 charge deviates 3.2x from category average.',
          cta: { label: 'Begin triage', to: '#threat-triage' },
        },
        freshness: new Date(Date.now() - 4 * 60 * 1000),
        kpis: [
          {
            label: 'Active signals',
            value: '3',
            definition: 'Active threat signals across all accounts.',
            accent: 'amber',
            sparklineData: kpiSparklines.signals,
            sparklineColor: 'var(--state-warning)',
          },
          {
            label: 'Blocked today',
            value: '1',
            definition: 'Transactions blocked by automated fraud detection.',
            accent: 'teal',
            sparklineData: kpiSparklines.blocked,
            sparklineColor: 'var(--state-healthy)',
          },
          {
            label: 'False positive rate',
            value: '2.1%',
            definition: 'Percentage of alerts later marked as false positives.',
            accent: 'cyan',
            sparklineData: kpiSparklines.fpRate,
            sparklineColor: '#00F0FF',
          },
          {
            label: 'Coverage',
            value: '100%',
            definition: 'Percentage of accounts monitored by threat detection.',
            accent: 'blue',
            sparklineData: kpiSparklines.coverage,
            sparklineColor: 'var(--state-primary)',
          },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default Protect;
