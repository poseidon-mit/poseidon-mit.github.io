import React from 'react';
import { ContributionChart } from '../components/ContributionChart';
import { DefinitionLine } from '../components/DefinitionLine';
import { MilestonesTimeline } from '../components/MilestonesTimeline';
import type { Milestone } from '../components/MilestonesTimeline';
import { PageShell } from '../components/PageShell';
import { GovernContractSet } from '../components/GovernContractSet';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionStatusChip } from '../components/MissionStatusChip';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { TransactionTable } from '../components/TransactionTable';
import type { TransactionColumn } from '../components/TransactionTable';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

// ── Static data ──────────────────────────────────────────────

interface ExecutionRecord {
  id: string;
  title: string;
  status: string;
  savings: string;
  time: string;
}

const executionHistory: ExecutionRecord[] = [
  { id: 'EH-001', title: 'Negotiated Comcast bill', status: 'Completed', savings: '$45/mo', time: '2h ago' },
  { id: 'EH-002', title: 'Cancelled unused Hulu', status: 'Completed', savings: '$15/mo', time: '1d ago' },
  { id: 'EH-003', title: 'Auto-saved round-ups', status: 'Completed', savings: '$127', time: '2d ago' },
  { id: 'EH-004', title: 'Blocked suspicious charge', status: 'Completed', savings: '$4,200', time: '3d ago' },
  { id: 'EH-005', title: 'Investment rebalance', status: 'Failed', savings: '--', time: '4d ago' },
  { id: 'EH-006', title: 'Bill negotiation: Phone plan', status: 'Completed', savings: '$15/mo', time: '5d ago' },
  { id: 'EH-007', title: 'Auto-save: Surplus detected', status: 'Completed', savings: '$200', time: '7d ago' },
  { id: 'EH-008', title: 'Subscription cancel: Duplicate', status: 'Completed', savings: '$10/mo', time: '10d ago' },
  { id: 'EH-009', title: 'Transfer: Goal rebalance', status: 'Rolled back', savings: '--', time: '12d ago' },
  { id: 'EH-010', title: 'Bill negotiation: Insurance', status: 'Completed', savings: '$45/mo', time: '14d ago' },
  { id: 'EH-011', title: 'Auto-save: End-of-month', status: 'Completed', savings: '$175', time: '18d ago' },
  { id: 'EH-012', title: 'Round-up: Weekly deposit', status: 'Completed', savings: '$12', time: '21d ago' },
];

const statusBadge = (status: string) => {
  const colors: Record<string, { color: string; bg: string }> = {
    Completed: { color: 'var(--state-healthy)', bg: 'rgba(20,184,166,0.1)' },
    Failed: { color: 'var(--state-critical)', bg: 'rgba(239,68,68,0.1)' },
    'Rolled back': { color: 'var(--state-warning)', bg: 'rgba(245,158,11,0.1)' },
  };
  const c = colors[status] ?? colors.Completed;
  return <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ color: c.color, background: c.bg }}>{status}</span>;
};

const historyColumns: TransactionColumn<ExecutionRecord>[] = [
  { key: 'title', label: 'Action', sortable: true, mobileLabel: 'Action' },
  { key: 'status', label: 'Status', sortable: true, render: (row) => statusBadge(row.status) },
  { key: 'savings', label: 'Savings', sortable: false, mobileLabel: 'Savings' },
  { key: 'time', label: 'When', sortable: true, mobileLabel: 'When' },
];

const historyMilestones: Milestone[] = [
  { label: 'First action executed', date: 'Jan 10, 2026', status: 'completed' },
  { label: '100 actions milestone', date: 'Jan 28', status: 'completed' },
  { label: '$1k total saved', date: 'Feb 5', status: 'completed' },
  { label: '$4.2k saved (current)', date: 'Feb 15', status: 'upcoming' },
];

const savingsContributions = [
  { month: 'Sep', amount: 420 },
  { month: 'Oct', amount: 580 },
  { month: 'Nov', amount: 710 },
  { month: 'Dec', amount: 890 },
  { month: 'Jan', amount: 1050 },
  { month: 'Feb', amount: 1280 },
];

const kpiSparklines = {
  total: [{ value: 98 }, { value: 108 }, { value: 118 }, { value: 128 }, { value: 136 }, { value: 142 }],
  success: [{ value: 97 }, { value: 97.5 }, { value: 98 }, { value: 98.2 }, { value: 98.3 }, { value: 98.4 }],
  failed: [{ value: 3 }, { value: 3 }, { value: 2 }, { value: 2 }, { value: 1 }, { value: 1 }],
  savings: [{ value: 2800 }, { value: 3200 }, { value: 3600 }, { value: 3900 }, { value: 4100 }, { value: 4280 }],
};

// ── Component ────────────────────────────────────────────────

export const ExecuteHistory: React.FC = () => {
  const contract = getRouteScreenContract('execute-history');

  // ── Primary feed ───────────────────────────────────────────

  const primaryFeed = (
    <>
      {/* History table */}
      <section className="engine-section">
        <MissionSectionHeader
          title="Execution history"
          message="Complete record of all executed actions. Sortable by any column."
          right={<MissionStatusChip tone="healthy" label="Showing 1-12 of 142" />}
        />
        <TransactionTable columns={historyColumns} data={executionHistory} pageSize={8} />
        <ProofLine
          claim="98.4% success rate"
          evidence="128 completed | 8 failed | 6 rolled back | All audit-linked"
          source="Execute engine v2.4"
          basis="quarterly"
          sourceType="system"
        />
        <DefinitionLine
          metric="Success rate"
          formula="completed / (completed + failed)"
          unit="percentage"
          period="30 days rolling"
          threshold="> 95%"
        />
      </section>

      {/* Govern footer */}
      <GovernContractSet
        auditId="GV-2026-0215-EXE-HIST"
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

      {/* Monthly savings chart */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Monthly savings"
          message="Cumulative savings from executed actions."
        />
        <ContributionChart
          data={savingsContributions}
          targetMonthly={1000}
          accentColor="var(--engine-execute)"
        />
      </article>

      {/* Key milestones */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Key milestones"
          message="Execution program progress."
        />
        <MilestonesTimeline
          milestones={historyMilestones}
          accentColor="var(--accent-gold)"
        />
      </article>
    </>
  );

  return (
    <PageShell
      slug="execute"
      contract={contract}
      layout="engine"
      heroVariant="analytical"
      hero={{
        kicker: 'Execute / History',
        engineBadge: 'Execute',
        headline: '142 actions executed. $4,280 saved this quarter.',
        subline: '128 completed, 8 failed, 6 rolled back. Full audit trail for every action.',
        statSummary: '128 completed | 8 failed | 6 rolled back',
        proofLine: {
          claim: '98.4% success rate | Avg confidence 0.91',
          evidence: 'All actions audit-linked | Rollback coverage 100%',
          source: 'Execute engine v2.4',
        },
        freshness: new Date(Date.now() - 30 * 60 * 1000),
        kpis: [
          { label: 'Total actions', value: '142', definition: 'All executed actions this quarter.', accent: 'amber', sparklineData: kpiSparklines.total, sparklineColor: 'var(--state-warning)' },
          { label: 'Success rate', value: '98.4%', definition: 'Actions completed without rollback.', accent: 'teal', sparklineData: kpiSparklines.success, sparklineColor: 'var(--state-healthy)' },
          { label: 'Failed', value: '8', definition: 'Actions that failed during execution.', accent: 'cyan', sparklineData: kpiSparklines.failed, sparklineColor: '#00F0FF' },
          { label: 'Saved', value: '$4,280', definition: 'Total savings realized this quarter.', accent: 'blue', sparklineData: kpiSparklines.savings, sparklineColor: 'var(--state-primary)' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default ExecuteHistory;
