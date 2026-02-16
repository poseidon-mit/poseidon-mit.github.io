import React from 'react';
import { Lock, Scale, Search, Users } from 'lucide-react';
import { AuditLedgerTable } from '../components/AuditLedgerTable';
import { CategoryScoreBar } from '../components/CategoryScoreBar';
import type { CategoryScore } from '../components/CategoryScoreBar';
import { DefinitionLine } from '../components/DefinitionLine';
import { PageShell } from '../components/PageShell';
import { GovernContractSet } from '../components/GovernContractSet';
import { MissionDataRows } from '../components/MissionDataRows';
import { MissionSectionHeader } from '../components/MissionSectionHeader';
import { MissionStatusChip } from '../components/MissionStatusChip';
import { ProofLine } from '../components/ProofLine';
import { ScoreRing } from '../components/ScoreRing';
import { mockAuditLogs } from '../services/mockGovern';
import { getRouteScreenContract } from '../contracts/route-screen-contracts';

// ── Static data ──────────────────────────────────────────────

const engineDistribution: CategoryScore[] = [
  { name: 'Protect decisions', score: 52, icon: Lock, color: 'var(--accent-teal)' },
  { name: 'Grow decisions', score: 31, icon: Scale, color: 'var(--accent-violet)' },
  { name: 'Execute decisions', score: 29, icon: Search, color: 'var(--accent-gold)' },
  { name: 'Govern decisions', score: 13, icon: Users, color: 'var(--accent-blue)' },
];

const kpiSparklines = {
  total: [{ value: 1100 }, { value: 1150 }, { value: 1180 }, { value: 1210 }, { value: 1230 }, { value: 1247 }],
  coverage: [{ value: 99.5 }, { value: 99.6 }, { value: 99.7 }, { value: 99.8 }, { value: 99.9 }, { value: 100 }],
  lastEntry: [{ value: 8 }, { value: 6 }, { value: 5 }, { value: 5 }, { value: 4 }, { value: 4 }],
  avgConf: [{ value: 0.89 }, { value: 0.9 }, { value: 0.9 }, { value: 0.91 }, { value: 0.91 }, { value: 0.92 }],
};

// ── Component ────────────────────────────────────────────────

export const GovernAuditLedger: React.FC = () => {
  const contract = getRouteScreenContract('govern-audit');

  const handleFeedback = () => {
    // Prototype no-op
  };

  // ── Primary feed ───────────────────────────────────────────

  const primaryFeed = (
    <>
      {/* Audit table */}
      <section className="engine-section">
        <MissionSectionHeader
          title="Audit ledger"
          message="Every AI decision, fully traceable. Sortable by any column."
          right={<MissionStatusChip tone="primary" label="Showing 1-25 of 1,247" />}
        />
        <AuditLedgerTable
          entries={mockAuditLogs}
          onFeedback={handleFeedback}
        />
        <ProofLine
          claim="Full audit trail for every AI decision"
          evidence="Immutable log | Exportable for SOC 2 review"
          source="Govern engine"
          basis="all time"
          sourceType="system"
        />
        <DefinitionLine
          metric="Audit coverage"
          formula="audited_decisions / total_ai_decisions"
          unit="percentage"
          period="all time"
          threshold="100%"
        />
      </section>

      {/* Govern footer */}
      <GovernContractSet
        auditId="GV-2026-0215-LEDGER"
        modelVersion="Governance v1.8"
        explanationVersion="SHAP v2.1"
      />
    </>
  );

  // ── Decision rail ──────────────────────────────────────────

  const decisionRail = (
    <>
      {/* Compliance ring */}
      <article className="engine-card">
        <ScoreRing
          score={96}
          label="Compliance"
          subtitle="/ 100"
          statusText="Excellent"
          color="var(--accent-blue)"
          size="lg"
        />
      </article>

      {/* Engine distribution */}
      <article className="engine-card">
        <MissionSectionHeader
          title="Decision distribution"
          message="Audit entries by engine."
        />
        <CategoryScoreBar categories={engineDistribution} iconAccent="var(--accent-blue)" />
      </article>

      {/* Average confidence */}
      <article className="engine-card">
        <MissionSectionHeader title="Aggregate stats" />
        <MissionDataRows
          items={[
            { id: 'AS-1', title: 'Average confidence', value: '0.92', tone: 'healthy' },
            { id: 'AS-2', title: 'Human reviews', value: '47', tone: 'primary' },
            { id: 'AS-3', title: 'AI-only decisions', value: '1,200', tone: 'primary' },
            { id: 'AS-4', title: 'Last entry', value: '4m ago', tone: 'primary' },
          ]}
        />
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
        kicker: 'Govern / Audit Ledger',
        engineBadge: 'Govern',
        headline: '1,247 decisions audited. 100% coverage.',
        subline: 'Full audit trail for every AI decision. Immutable log. Exportable for SOC 2 review.',
        statSummary: '1,247 entries | 100% audited | Last entry: 4m ago',
        proofLine: {
          claim: '1,247 entries | 100% audited | Last entry: 4m ago',
          evidence: 'Full coverage across all 4 engines',
          source: 'Govern engine',
        },
        freshness: new Date(Date.now() - 4 * 60 * 1000),
        kpis: [
          { label: 'Total entries', value: '1,247', definition: 'Total audit records in ledger.', accent: 'blue', sparklineData: kpiSparklines.total, sparklineColor: 'var(--state-primary)' },
          { label: 'Coverage', value: '100%', definition: 'Percentage of AI decisions with full audit trail.', accent: 'teal', sparklineData: kpiSparklines.coverage, sparklineColor: 'var(--state-healthy)' },
          { label: 'Last entry', value: '4m ago', definition: 'Time since most recent audit log entry.', accent: 'cyan', sparklineData: kpiSparklines.lastEntry, sparklineColor: '#00F0FF' },
          { label: 'Avg confidence', value: '0.92', definition: 'Mean model confidence across all entries.', accent: 'amber', sparklineData: kpiSparklines.avgConf, sparklineColor: 'var(--state-warning)' },
        ],
      }}
      primaryFeed={primaryFeed}
      decisionRail={decisionRail}
    />
  );
};

export default GovernAuditLedger;
