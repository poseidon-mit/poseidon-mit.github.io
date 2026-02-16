import React, { useState } from 'react';
import { Link } from '../router';
import { ActionQueueCard } from '../components/ActionQueueCard';
import { AutoSaveRuleCard } from '../components/AutoSaveRuleCard';
import { ContributionChart } from '../components/ContributionChart';
import { DefinitionLine } from '../components/DefinitionLine';
import { PageShell } from '../components/PageShell';
import { ExplainableInsightPanel } from '../components/ExplainabilityPanel';
import { GovernContractSet } from '../components/GovernContractSet';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import type { Milestone } from '../components/MilestonesTimeline';
import { MissionEmptyState } from '../components/MissionEmptyState';
import { MissionEvidencePanel } from '../components/MissionEvidencePanel';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionStatusChip } from '../components/MissionStatusChip';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import {
  executeAction,
  mockActions,
  mockAutoSaveRules,
} from '../services/mockExecute';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';
import { useUI } from '../contexts/UIContext';
import type { Action, AutoSaveRule } from '../services/mockExecute';

// ── Static data ──────────────────────────────────────────────

const executeMilestones: Milestone[] = [
  { label: 'Q4 savings target set', date: 'Oct 2025', status: 'completed' },
  { label: 'First auto-save', date: 'Nov 2025', status: 'completed' },
  { label: '$500/mo milestone', date: 'Dec 2025', status: 'completed' },
  { label: '$847/mo current', date: 'Feb 2026', status: 'upcoming' },
  { label: '$1,000/mo target', date: 'Apr 2026', status: 'future' },
];

const savingsContributions = [
  { month: 'Sep', amount: 320 },
  { month: 'Oct', amount: 480 },
  { month: 'Nov', amount: 510 },
  { month: 'Dec', amount: 620 },
  { month: 'Jan', amount: 740 },
  { month: 'Feb', amount: 847 },
];

const kpiSparklines = {
  queued: [{ value: 8 }, { value: 7 }, { value: 6 }, { value: 5 }, { value: 5 }, { value: 5 }],
  savings: [{ value: 520 }, { value: 610 }, { value: 680 }, { value: 740 }, { value: 810 }, { value: 847 }],
  success: [{ value: 97 }, { value: 97.5 }, { value: 98 }, { value: 98.2 }, { value: 98.3 }, { value: 98.4 }],
  confidence: [{ value: 0.88 }, { value: 0.89 }, { value: 0.9 }, { value: 0.9 }, { value: 0.91 }, { value: 0.91 }],
};

// ── Component ────────────────────────────────────────────────

export const Execute: React.FC = () => {
  const [actions, setActions] = useState<Action[]>(mockActions);
  const [rules, setRules] = useState<AutoSaveRule[]>(mockAutoSaveRules);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const { addNotification } = useUI();
  const contract = getRouteScreenContract('execute');

  const handleApprove = async (id: string) => {
    setActions((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'executing' } : item)));
    const result = await executeAction(id);
    setActions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: result.success ? 'completed' : 'failed' } : item,
      ),
    );
    addNotification({
      type: result.success ? 'success' : 'error',
      message: result.success
        ? 'Action executed successfully. Audit trail updated.'
        : 'Action failed. Review evidence before retrying.',
    });
  };

  const handleDecline = (id: string) => {
    setActions((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'declined' } : item)));
    addNotification({ type: 'info', message: 'Action declined. Queue updated.' });
  };

  const handleDefer = (_id: string) => {
    // Prototype: no-op
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));
  };

  const pendingActions = actions.filter((item) => item.status === 'pending');
  const totalPotentialSavings = pendingActions.reduce((sum, item) => sum + item.estimatedImpact.savings, 0);
  const sortedPending = [...pendingActions].sort((a, b) => {
    const rank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3);
  });

  // ── Primary feed ───────────────────────────────────────────

  const primaryFeed = (
    <>
      {/* Savings summary */}
      {pendingActions.length > 0 && (
        <MissionEvidencePanel
          className="engine-card"
          title="Potential savings from pending actions"
          summary={`Total annual savings if all actions are approved: $${totalPotentialSavings.toLocaleString()}`}
          meta={`${pendingActions.length} pending`}
          tone="healthy"
        />
      )}

      {/* Action queue */}
      <section className="engine-section">
        <MissionSectionHeader
          title="Action queue"
          message="Actions ranked by impact, confidence, and urgency. Human approval required before every action."
          contextCue="Review action details and approve"
          right={<MissionStatusChip tone="warning" label={`${pendingActions.length} pending`} />}
        />
        <div className="engine-item-list">
          {sortedPending.length > 0 ? (
            sortedPending.map((action) => (
              <div
                key={action.id}
                onClick={() => setSelectedAction(action)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedAction(action); }}
              >
                <ActionQueueCard
                  action={action}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                  onDefer={handleDefer}
                />
                <ProofLine
                  claim={`${action.priority} priority`}
                  evidence={`${action.type} | Impact: $${action.estimatedImpact.savings}/yr | Risk: ${action.estimatedImpact.riskLevel}`}
                  source="Execute engine v2.4"
                  basis="per-action"
                  sourceType="model"
                />
              </div>
            ))
          ) : (
            <MissionEmptyState
              title="No pending actions"
              description="All queued actions are completed or acknowledged."
            />
          )}
        </div>
        <DefinitionLine
          metric="Queue ranking"
          formula="impact x confidence x urgency_weight"
          unit="composite score"
          period="per-action"
        />
      </section>

      {/* Auto-save rules */}
      <section className="engine-section">
        <MissionSectionHeader
          title="Auto-save rules"
          message="Configured automation rules with guardrails."
          right={<MissionStatusChip tone="primary" label={`${rules.filter((r) => r.enabled).length} active`} />}
        />
        <div className="engine-item-list">
          {rules.map((rule) => (
            <AutoSaveRuleCard key={rule.id} rule={rule} onToggle={handleToggleRule} />
          ))}
        </div>
        <ProofLine
          claim="Automation guardrails active"
          evidence="All rules have monthly caps | Reversible within 24h"
          source="Execute engine"
          sourceType="system"
        />
      </section>

      {/* Govern footer */}
      <GovernContractSet
        auditId="GV-2026-0215-EXE"
        modelVersion="Execute v2.4"
        explanationVersion="SHAP v2.1"
      />
    </>
  );

  // ── Decision rail ──────────────────────────────────────────

  const decisionRail = (
    <>
      {/* Success rate ring */}
      <article className="engine-card">
        <ScoreRing
          score={98}
          label="Success Rate"
          subtitle="/ 100"
          statusText="Excellent"
          color="var(--accent-gold)"
          size="lg"
        />
      </article>

      {/* Contribution chart */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Monthly savings"
          message="Cumulative savings by action type over 6 months."
        />
        <ContributionChart
          data={savingsContributions}
          targetMonthly={500}
          accentColor="var(--engine-execute)"
        />
        <ProofLine
          claim="$847/mo current savings"
          evidence="6-month trend | Target $1,000/mo"
          source="Execute engine"
          sourceType="model"
        />
      </article>

      {/* Milestones timeline */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Savings milestones"
          message="Progress toward monthly savings target."
        />
        <MilestonesTimeline
          milestones={executeMilestones}
          accentColor="var(--accent-gold)"
        />
      </article>

      {/* Selected action detail */}
      {selectedAction && (
        <article className="engine-card">
          <MissionSectionHeader
            title={selectedAction.title}
            message={`${selectedAction.sourceEngine} engine -- ${selectedAction.priority} priority`}
          />
          <ExplainableInsightPanel
            title="Action rationale"
            summary={selectedAction.aiRecommendation}
            topFactors={[
              { label: 'Impact', contribution: selectedAction.estimatedImpact.savings / 500, note: `$${selectedAction.estimatedImpact.savings}/yr` },
              { label: 'Risk level', contribution: selectedAction.estimatedImpact.riskLevel === 'none' ? 0.1 : 0.3 },
              { label: 'Speed', contribution: 1 - selectedAction.estimatedImpact.timeToExecute / 30 },
            ]}
            confidence={0.91}
            recency="Just now"
            governMeta={{
              auditId: `GV-2026-0215-${selectedAction.id}`,
              modelVersion: 'Execute v2.4',
              explanationVersion: 'SHAP v2.1',
              timestamp: new Date().toISOString(),
            }}
          />
        </article>
      )}

      {/* Navigation */}
      <div className="mission-dual-actions">
        <Link className="entry-btn entry-btn--ghost" to="/execute/history">Execution history</Link>
        <Link className="entry-btn entry-btn--ghost" to="/govern">Audit trail</Link>
      </div>
    </>
  );

  return (
    <PageShell
      slug="execute"
      contract={contract}
      layout="engine"
      heroVariant="analytical"
      hero={{
        kicker: 'Execute',
        engineBadge: 'Execute',
        headline: `5 actions queued. $847 in projected savings this month.`,
        subline: 'Human approval required before every action. All actions reversible within 24h.',
        statSummary: `${pendingActions.length} pending | 128 completed | 0 failed`,
        proofLine: {
          claim: '5 pending | 128 completed | 0 failed',
          evidence: 'Rollback coverage: 100% | Basis: Execute engine v2.4',
          source: 'Execute engine',
        },
        heroAction: {
          label: 'AI insight:',
          text: 'Approving the top 3 actions would save an estimated $412/mo with 91% confidence.',
          cta: { label: 'Review queue', to: '#action-queue' },
        },
        freshness: new Date(Date.now() - 4 * 60 * 1000),
        kpis: [
          {
            label: 'Queued actions',
            value: '5',
            definition: 'Actions awaiting human approval.',
            accent: 'amber',
            sparklineData: kpiSparklines.queued,
            sparklineColor: 'var(--state-warning)',
          },
          {
            label: 'Monthly savings',
            value: '$847',
            definition: 'Projected monthly savings from approved actions.',
            accent: 'teal',
            sparklineData: kpiSparklines.savings,
            sparklineColor: 'var(--state-healthy)',
          },
          {
            label: 'Success rate',
            value: '98.4%',
            definition: 'Completed actions without rollback in last 30 days.',
            accent: 'cyan',
            sparklineData: kpiSparklines.success,
            sparklineColor: '#00F0FF',
          },
          {
            label: 'Avg confidence',
            value: '0.91',
            definition: 'Mean model confidence across pending actions.',
            accent: 'blue',
            sparklineData: kpiSparklines.confidence,
            sparklineColor: 'var(--state-primary)',
          },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default Execute;
