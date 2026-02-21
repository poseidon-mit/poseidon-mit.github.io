import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, User, ChevronDown } from 'lucide-react';
import { Link, useRouter } from '../router';
import { GovernFooter, AuroraPulse } from '@/components/poseidon';
import { GOVERNANCE_META } from '@/lib/governance-meta';
import { getMotionPreset } from '@/lib/motion-presets';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date';
import { Surface } from '@/design-system';

interface AuditDecision {
  id: string;
  engine: 'Protect' | 'Grow' | 'Execute' | 'Govern';
  type: string;
  action: string;
  timestamp: string;
  model: { name: string; version: string; accuracy: number; };
  explanation: {
    summary: string;
    confidence: number;
  };
  topFactors: Array<{ label: string; contribution: number; note: string; }>;
  compliance: { gdpr: boolean; ecoa: boolean; ccpa: boolean; };
  userFeedback: { correct: boolean; comment: string; };
}

const DEFAULT_DECISION_ID = 'GV-2026-0319-846';

const sharedFactors = [
  { label: 'Amount deviation', contribution: 0.95, note: '3x typical transaction amount' },
  { label: 'Location anomaly', contribution: 0.92, note: 'Unusual network region for account profile' },
  { label: 'Time-of-day risk', contribution: 0.88, note: 'Activity outside normal behavior window' },
  { label: 'Merchant history', contribution: 0.72, note: 'Low historical trust score in this category' }];


const AUDIT_DECISIONS: Record<string, AuditDecision> = {
  'GV-2026-0319-847': {
    id: 'GV-2026-0319-847',
    engine: 'Execute',
    type: 'portfolio_rebalance',
    action: 'Portfolio rebalance',
    timestamp: '2026-03-19T14:28:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Portfolio allocation shifted from concentrated tech exposure to balanced risk targets after market-volatility threshold crossed.',
      confidence: 0.97
    },
    topFactors: [
      { label: 'Risk concentration', contribution: 0.93, note: 'Technology allocation exceeded target by 14%' },
      { label: 'Volatility index', contribution: 0.89, note: '30-day volatility exceeded policy threshold' },
      { label: 'Liquidity buffer', contribution: 0.81, note: 'Cash reserve remains above required floor' },
      { label: 'Tax impact', contribution: 0.62, note: 'Estimated tax drag stayed within accepted range' }],

    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Matches investment policy and approved risk profile.' }
  },
  'GV-2026-0319-846': {
    id: 'GV-2026-0319-846',
    engine: 'Protect',
    type: 'fraud_detected',
    action: 'Block wire transfer',
    timestamp: '2026-03-19T14:15:00-04:00',
    model: { name: 'FraudDetectionV3.2', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: `Transaction was blocked after concurrent anomalies on merchant (${DEMO_THREAD.criticalAlert.merchant}), amount ($${DEMO_THREAD.criticalAlert.amount.toLocaleString()}), and location signal. Combined risk exceeded auto-block threshold.`,
      confidence: DEMO_THREAD.criticalAlert.confidence
    },
    topFactors: sharedFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Confirmed suspicious transfer. Keep card protection active.' }
  },
  'GV-2026-0319-845': {
    id: 'GV-2026-0319-845',
    engine: 'Grow',
    type: 'savings_optimization',
    action: 'Subscription consolidation',
    timestamp: '2026-03-19T13:52:00-04:00',
    model: { name: 'GrowthForecast', version: '3.2.0', accuracy: 97.8 },
    explanation: {
      summary: 'Three overlapping services with low combined utilization were grouped into one replacement plan with lower monthly burn.',
      confidence: 0.89
    },
    topFactors: [
      { label: 'Utilization overlap', contribution: 0.91, note: 'Three services provide duplicative content' },
      { label: 'Monthly cost delta', contribution: 0.87, note: 'Projected savings of $140 per month' },
      { label: 'Service switching risk', contribution: 0.74, note: 'Low disruption expected from consolidation' },
      { label: 'Contract term', contribution: 0.58, note: 'Cancellation windows confirmed open' }],

    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Recommendation approved. Savings target updated.' }
  },
  'GV-2026-0319-844': {
    id: 'GV-2026-0319-844',
    engine: 'Execute',
    type: 'document_archive',
    action: 'Archive invoices',
    timestamp: '2026-03-19T11:20:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Automated retention policy identified stale paid invoices and queued them for archive to reduce dashboard noise.',
      confidence: 0.78
    },
    topFactors: [
      { label: 'Retention policy match', contribution: 0.84, note: 'Documents exceeded retention visibility window' },
      { label: 'Duplicate artifacts', contribution: 0.73, note: '47 paid invoices already stored in backup archive' },
      { label: 'Searchability score', contribution: 0.66, note: 'Metadata quality sufficient for recall' },
      { label: 'Audit preservation', contribution: 0.59, note: 'Immutable references retained in ledger' }],

    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Queued for human review before completion.' }
  },
  'GV-2026-0318-843': {
    id: 'GV-2026-0318-843',
    engine: 'Protect',
    type: 'transaction_review',
    action: 'Unusual transaction',
    timestamp: '2026-03-18T16:42:00-04:00',
    model: { name: 'FraudDetectionV3.2', version: '3.2.1', accuracy: 99.7 },
    explanation: {
      summary: 'Transaction pattern deviated from baseline and triggered manual verification workflow before settlement.',
      confidence: 0.92
    },
    topFactors: sharedFactors,
    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Escalation was appropriate for this charge profile.' }
  },
  'GV-2026-0318-842': {
    id: 'GV-2026-0318-842',
    engine: 'Grow',
    type: 'goal_update',
    action: 'Goal update',
    timestamp: '2026-03-18T10:18:00-04:00',
    model: { name: 'GoalTracker', version: '2.9.0', accuracy: 96.9 },
    explanation: {
      summary: 'Savings trajectory model recalculated expected completion after recurring transfers increased.',
      confidence: 0.86
    },
    topFactors: [
      { label: 'Contribution consistency', contribution: 0.88, note: 'Transfers remained stable for 10 weeks' },
      { label: 'Income stability', contribution: 0.84, note: 'No variance events in payroll stream' },
      { label: 'Expense variability', contribution: 0.72, note: 'Spend volatility remained within expected band' },
      { label: 'Forecast uncertainty', contribution: 0.61, note: 'Confidence interval narrowed month-over-month' }],

    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Progress estimate aligns with current account balances.' }
  },
  'GV-2026-0317-841': {
    id: 'GV-2026-0317-841',
    engine: 'Execute',
    type: 'payment_execution',
    action: 'Payment processed',
    timestamp: '2026-03-17T14:12:00-04:00',
    model: { name: 'ExecutePlanner', version: '4.1.0', accuracy: 99.1 },
    explanation: {
      summary: 'Scheduled payment executed inside approved threshold with complete trace of consent and transaction lifecycle.',
      confidence: 0.91
    },
    topFactors: [
      { label: 'Consent state', contribution: 0.94, note: 'Action approved by account owner' },
      { label: 'Policy alignment', contribution: 0.88, note: 'Payment complied with risk and spend constraints' },
      { label: 'Funds availability', contribution: 0.85, note: 'Buffer remained above minimum reserve target' },
      { label: 'Counterparty trust', contribution: 0.63, note: 'Verified vendor with prior successful history' }],

    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Execution met expected timing and amount.' }
  },
  'GV-2026-0317-840': {
    id: 'GV-2026-0317-840',
    engine: 'Govern',
    type: 'policy_update',
    action: 'Policy update',
    timestamp: '2026-03-17T09:40:00-04:00',
    model: { name: 'GovernanceTracer', version: '3.1.0', accuracy: 98.9 },
    explanation: {
      summary: 'Policy thresholds were recalibrated after oversight review to improve explainability and reduce false-positive escalation.',
      confidence: 0.97
    },
    topFactors: [
      { label: 'Oversight feedback', contribution: 0.93, note: 'Human review signaled threshold adjustment need' },
      { label: 'False-positive trend', contribution: 0.89, note: 'Recent alerts exceeded target false-positive rate' },
      { label: 'Audit completeness', contribution: 0.82, note: 'Policy migration retained full evidence lineage' },
      { label: 'Policy coverage', contribution: 0.67, note: 'Controls expanded for edge-case transactions' }],

    compliance: { gdpr: true, ecoa: true, ccpa: true },
    userFeedback: { correct: true, comment: 'Policy update approved with full oversight trace.' }
  }
};

export function GovernAuditDetail() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion);

  const { search } = useRouter();
  const decisionId = new URLSearchParams(search).get('decision');
  const auditEntry = decisionId && AUDIT_DECISIONS[decisionId] || AUDIT_DECISIONS[DEFAULT_DECISION_ID];
  const resolvedTimestamp = formatDemoTimestamp(auditEntry.timestamp);
  const resolvedConfidence = formatConfidence(auditEntry.explanation.confidence);

  const metaRows = [
    { label: 'Audit ID', value: auditEntry.id, highlight: false },
    { label: 'Engine', value: auditEntry.engine, highlight: false },
    { label: 'Decision type', value: auditEntry.type, highlight: true },
    { label: 'Action', value: auditEntry.action, highlight: false },
    { label: 'Timestamp', value: resolvedTimestamp, highlight: false },
    { label: 'Model', value: `${auditEntry.model.name} v${auditEntry.model.version}`, highlight: false },
    { label: 'Model accuracy', value: `${auditEntry.model.accuracy}%`, highlight: false }];


  const complianceFlags = [
    { label: 'GDPR', compliant: auditEntry.compliance.gdpr },
    { label: 'ECOA', compliant: auditEntry.compliance.ecoa },
    { label: 'CCPA', compliant: auditEntry.compliance.ccpa }];


  return (
    <div className="relative min-h-screen w-full">
      <AuroraPulse color="var(--engine-govern)" intensity="subtle" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-govern)', color: '#ffffff' }}>

        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"

        aria-label="Breadcrumb">

        <div className="mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-2" style={{ maxWidth: '1280px' }}>
          <Link
            to="/govern/audit"
            className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--engine-govern)' }}>

            <ArrowLeft className="h-4 w-4" />
            Audit Ledger
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm text-white/50">Audit Detail</span>
        </div>
      </nav>

      <motion.div
        id="main-content"
        className="mx-auto flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12 w-full pt-8 lg:pt-12"
        style={{ maxWidth: '1440px' }}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main">

        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--engine-govern)]/20 bg-[var(--engine-govern)]/10 text-[var(--engine-govern)] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <FileText size={12} /> Govern · Audit Detail
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)" }}>Decision Reconstruction</h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed tracking-wide">
              Full decision audit for <code className="text-[var(--engine-govern)] font-mono tracking-wider drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">{auditEntry.id}</code>
            </p>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-4">
              {[
                { label: 'Timestamp', value: resolvedTimestamp.substring(0, resolvedTimestamp.lastIndexOf(' ')), subValue: resolvedTimestamp.substring(resolvedTimestamp.lastIndexOf(' ') + 1), color: 'white' },
                { label: 'Confidence', value: resolvedConfidence, color: 'var(--engine-govern)' },
                { label: 'Model', value: auditEntry.model.name, subValue: `v${auditEntry.model.version}`, color: 'var(--engine-execute)' },
                { label: 'Accuracy', value: `${auditEntry.model.accuracy}%`, color: 'var(--engine-protect)' }].
                map((kpi) => <Surface
                  key={kpi.label} className="relative overflow-hidden rounded-[24px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-xl p-5 md:p-6" padding="none">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-2">
                    <p className="text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white/50">{kpi.label}</p>
                    <div className="flex flex-col">
                      <p className="text-2xl md:text-3xl font-light font-mono truncate" style={{ color: kpi.color, textShadow: kpi.color !== 'white' ? `0 0 15px ${kpi.color}60` : 'none' }}>{kpi.value}</p>
                      {kpi.subValue && <p className="text-xs text-white/40 mt-1">{kpi.subValue}</p>}
                    </div>
                  </div>
                </Surface>
                )}
            </div>
          </motion.div>
        </motion.section>

        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-6 lg:px-8">
          <motion.div variants={staggerContainerVariant} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-6 lg:gap-8">
            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <h2 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6">Decision Metadata</h2>
                <div className="relative z-10 flex flex-col gap-4">
                  {metaRows.map((row) =>
                    <div key={row.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-white/[0.04] last:border-0 gap-2 sm:gap-4">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 shrink-0">{row.label}</span>
                      <span className={`text-sm tracking-wide sm:text-right ${row.highlight ? 'text-[var(--engine-govern)] font-medium drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]' : 'text-white/80 font-light'}`}>{row.value}</span>
                    </div>
                  )}
                </div>
              </Surface>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-6 lg:p-10" style={{ borderTopWidth: 4, borderTopColor: 'var(--engine-govern)' }} padding="none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_70%)] pointer-events-none" />
                <h2 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)] border-b border-white/[0.06] pb-4 mb-6">Decision Reconstruction</h2>

                <div className="relative z-10 flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">{auditEntry.explanation.summary}</p>
                    <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                      <div className="flex-1 h-3 rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/[0.03]">
                        <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]" style={{ width: `${auditEntry.explanation.confidence * 100}%`, background: 'var(--engine-govern)' }} />
                      </div>
                      <span className="text-base font-mono tracking-widest font-bold text-[var(--engine-govern)] shrink-0 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">{resolvedConfidence} conf</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 pt-6 border-t border-white/[0.06]">
                    <h3 className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-2">Contributing Factors</h3>
                    {auditEntry.topFactors.map((factor) =>
                      <div key={factor.label} className="flex flex-col gap-3 group">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                          <span className="text-sm tracking-wide text-white/90 flex-1">{factor.label}</span>
                          <span className="text-xs text-white/40 italic sm:text-right">{factor.note}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 rounded-full overflow-hidden bg-black/40 shadow-inner border border-white/[0.03]">
                            <div className="h-full rounded-full transition-all duration-700 bg-[var(--engine-govern)]/60 group-hover:bg-[var(--engine-govern)]" style={{ width: `${factor.contribution * 100}%` }} />
                          </div>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-white/50 w-12 text-right">{formatConfidence(factor.contribution)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Surface>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <Surface className="relative overflow-hidden rounded-[32px] border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl p-6 lg:p-8" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h2 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/50 border-b border-white/[0.06] pb-4 mb-6">Compliance Flags</h2>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {complianceFlags.map((flag) =>
                      <div key={flag.label} className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                        <span className="text-xs uppercase tracking-widest text-white/70">{flag.label}</span>
                        <div className={`flex items-center gap-2 text-sm font-semibold tracking-wide ${flag.compliant ? 'text-[var(--state-healthy)] drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'text-red-400'}`}>
                          {flag.compliant ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                          {flag.compliant ? 'Compliant' : 'Non-compliant'}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 text-center mt-4">All 3 regulatory frameworks satisfied · Source: Compliance engine</p>
                </div>
              </Surface>
            </motion.div>
          </motion.div>

          <aside className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6" aria-label="Audit detail sidebar">
            <div className="sticky top-24 flex flex-col gap-6">
              <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3 mb-6 border-b border-white/[0.06] pb-4">
                  <div className="p-1.5 rounded-lg bg-[var(--engine-govern)]/10 border border-[var(--engine-govern)]/20">
                    <User className="h-4 w-4 text-[var(--engine-govern)]" />
                  </div>
                  <h3 className="text-xs font-semibold text-white/70 uppercase tracking-widest">User Feedback</h3>
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Verdict</span>
                    <span className={`inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl border font-bold text-sm tracking-wide ${auditEntry.userFeedback.correct ? 'bg-[var(--state-healthy)]/10 border-[var(--state-healthy)]/30 text-[var(--state-healthy)]' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      {auditEntry.userFeedback.correct ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                      {auditEntry.userFeedback.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Comment</span>
                    <p className="text-sm font-light leading-relaxed text-white/80 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                      "{auditEntry.userFeedback.comment}"
                    </p>
                  </div>
                </div>
                <p className="relative z-10 text-[10px] uppercase tracking-widest text-white/30 text-center mt-6">Human-validated · Source: Feedback system</p>
              </Surface>

              <Surface className="relative overflow-hidden rounded-[32px] p-6 lg:p-8 border border-white/[0.08] backdrop-blur-3xl bg-black/60 shadow-2xl" padding="none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <h3 className="relative z-10 text-xs font-semibold text-white/70 uppercase tracking-widest mb-6 border-b border-white/[0.06] pb-4">Actions</h3>
                <div className="relative z-10 flex flex-col gap-3">
                  <Link to="/govern/audit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/[0.05] text-sm text-white font-medium">
                    <ArrowLeft size={16} className="text-white/50" /> Back to Ledger
                  </Link>
                  <Link to="/govern/oversight" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[var(--engine-govern)] text-black transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] text-sm font-semibold">
                    Oversight Queue <ArrowLeft size={16} className="rotate-180" />
                  </Link>
                </div>
              </Surface>
            </div>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/audit-detail'].auditId} pageContext={GOVERNANCE_META['/govern/audit-detail'].pageContext} />
      </motion.div>
    </div>);

}

export default GovernAuditDetail;
