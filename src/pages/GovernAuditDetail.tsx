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
  model: {name: string;version: string;accuracy: number;};
  explanation: {
    summary: string;
    confidence: number;
  };
  topFactors: Array<{label: string;contribution: number;note: string;}>;
  compliance: {gdpr: boolean;ecoa: boolean;ccpa: boolean;};
  userFeedback: {correct: boolean;comment: string;};
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
        className="mx-auto flex flex-col gap-6 md:gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8"
        style={{ maxWidth: '1280px' }}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main">
        
        <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5" style={{ color: 'var(--engine-govern)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--engine-govern)' }}>
              Govern · Audit Detail
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Decision Reconstruction</h1>
          <p className="text-sm text-slate-400">
            Full decision audit for <code className="text-blue-400 bg-white/5 px-1 rounded">{auditEntry.id}</code> · Confidence {resolvedConfidence} · {resolvedTimestamp}
          </p>
        </motion.div>

        <motion.div variants={fadeUpVariant}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Confidence', value: resolvedConfidence, color: 'var(--engine-govern)' },
            { label: 'Factors', value: String(auditEntry.topFactors.length), color: 'var(--engine-dashboard)' },
            { label: 'Model accuracy', value: `${auditEntry.model.accuracy}%`, color: 'var(--engine-protect)' },
            { label: 'Card', value: `••••${DEMO_THREAD.criticalAlert.cardLast4}`, color: 'var(--engine-execute)' }].
            map((kpi) => <Surface
              key={kpi.label} className="rounded-2xl" variant="glass" padding="md">
                <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </Surface>
            )}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div variants={fadeUpVariant} className="flex-1 min-w-0 lg:w-2/3 flex flex-col gap-4">
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <h2 className="text-sm font-semibold text-white mb-4">Decision Metadata</h2>
              <div className="space-y-3">
                {metaRows.map((row) =>
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-white/50">{row.label}</span>
                    <span className={`text-xs font-medium ${row.highlight ? 'text-amber-400' : 'text-white/80'}`}>{row.value}</span>
                  </div>
                )}
              </div>
            </Surface>

            <Surface className="rounded-2xl" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--engine-govern)' }} variant="glass" padding="md">
              <h2 className="text-sm font-semibold text-white mb-3">Decision Reconstruction</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{auditEntry.explanation.summary}</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${auditEntry.explanation.confidence * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-blue-400 shrink-0">{resolvedConfidence} confidence</span>
              </div>
              <div className="space-y-3">
                {auditEntry.topFactors.map((factor) =>
                <div key={factor.label} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">{factor.label}</span>
                      <span className="text-white/40">{factor.note}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-blue-400/70" style={{ width: `${factor.contribution * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-white/30">Contribution: {formatConfidence(factor.contribution)}</span>
                  </div>
                )}
              </div>
            </Surface>

            <Surface className="rounded-2xl" variant="glass" padding="md">
              <h2 className="text-sm font-semibold text-white mb-4">Compliance Flags</h2>
              <div className="space-y-2.5">
                {complianceFlags.map((flag) =>
                <div key={flag.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-sm text-white/70">{flag.label}</span>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${flag.compliant ? 'text-emerald-400' : 'text-red-400'}`}>
                      {flag.compliant ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      {flag.compliant ? 'Compliant' : 'Non-compliant'}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/30 mt-3">All 3 regulatory frameworks satisfied · Source: Compliance engine</p>
            </Surface>
          </motion.div>

          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4" aria-label="Audit detail sidebar">
            <Surface className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <ChevronDown className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Contributing Factors</h3>
              </div>
              <div className="space-y-2.5">
                {auditEntry.topFactors.map((f) =>
                <div key={f.label} className="flex items-center gap-2">
                    <span className="text-xs text-white/50 w-28 shrink-0 truncate">{f.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-blue-500/60" style={{ width: `${f.contribution * 100}%` }} />
                    </div>
                    <span className="text-xs text-white/40 w-8 text-right">{formatConfidence(f.contribution)}</span>
                  </div>
                )}
              </div>
            </Surface>

            <Surface className="rounded-2xl" variant="glass" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">User Feedback</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-white/50">Verdict</span>
                  <span className={`text-xs font-medium ${auditEntry.userFeedback.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                    {auditEntry.userFeedback.correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs text-white/50 shrink-0">Comment</span>
                  <span className="text-xs text-white/70 text-right">{auditEntry.userFeedback.comment}</span>
                </div>
              </div>
              <p className="text-xs text-white/30 mt-3">Human-validated · Source: Feedback system</p>
            </Surface>

            <Surface className="rounded-2xl" variant="glass" padding="md">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Related</h3>
              <div className="flex flex-col gap-2">
                <Link to="/govern/audit" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">← Back to Audit Ledger</Link>
                <Link to="/govern/oversight" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Oversight Queue →</Link>
              </div>
            </Surface>
          </aside>
        </div>

        <GovernFooter auditId={GOVERNANCE_META['/govern/audit-detail'].auditId} pageContext={GOVERNANCE_META['/govern/audit-detail'].pageContext} />
      </motion.div>
    </div>);

}

export default GovernAuditDetail;
