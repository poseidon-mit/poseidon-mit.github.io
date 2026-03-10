import { motion } from 'framer-motion';
import { MessageCircle, Download, RotateCcw, Lock, Shield, TrendingUp, Zap, Scale } from 'lucide-react';
import { useRouter } from '@/router';
import { SubPageNav, ConfidenceIndicator, EngineBadge } from '@/components/poseidon';
import { getMotionPreset } from '@/lib/motion-presets';
import { usePageTitle } from '@/hooks/use-page-title';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date';
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout';
import { AUDIT_DECISIONS, DEFAULT_DECISION_ID } from '@/lib/govern-audit-data';
import { useToast } from '@/hooks/useToast';

/* ── Helpers ── */

const ENGINE_MAP: Record<string, { engine: 'protect' | 'grow' | 'execute' | 'govern'; icon: typeof Shield }> = {
  Protect: { engine: 'protect', icon: Shield },
  Grow:    { engine: 'grow',    icon: TrendingUp },
  Execute: { engine: 'execute', icon: Zap },
  Govern:  { engine: 'govern',  icon: Scale },
};

const COMPLIANCE_INFO: Array<{ key: 'gdpr' | 'ecoa' | 'ccpa'; label: string; description: string }> = [
  { key: 'gdpr', label: 'GDPR', description: 'Your data rights under European privacy law' },
  { key: 'ecoa', label: 'ECOA', description: 'Equal treatment in financial decisions' },
  { key: 'ccpa', label: 'CCPA', description: 'Your California privacy protections' },
];

/**
 * Transform baseReality key-value pairs into a readable narrative sentence.
 */
function narrateBaseReality(baseReality: Array<{ label: string; value: string }>): string {
  const map = new Map(baseReality.map(r => [r.label.toLowerCase(), r.value]));

  const parts: string[] = [];

  // Amount-related
  const amount = map.get('amount') || map.get('charge amount') || map.get('transaction amount');
  if (amount) parts.push(`a transaction of ${amount}`);

  // Merchant/counterparty
  const merchant = map.get('merchant') || map.get('counterparty') || map.get('vendor');
  if (merchant) parts.push(`from ${merchant}`);

  // Service/product
  const service = map.get('service') || map.get('product') || map.get('category');
  if (service) parts.push(`for ${service}`);

  // Account
  const account = map.get('account') || map.get('card');
  if (account) parts.push(`on account ${account}`);

  // Risk level
  const risk = map.get('risk level') || map.get('severity');
  if (risk) parts.push(`assessed at ${risk.toLowerCase()} risk`);

  if (parts.length > 0) {
    return parts[0].charAt(0).toUpperCase() + parts.join(', ').slice(1) + '.';
  }

  // Fallback: render as readable list
  return baseReality.map(r => `${r.label}: ${r.value}`).join(' · ');
}

/* ── Page ── */

export function GovernAuditDetail() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion);
  usePageTitle('Audit Detail');
  const { showToast } = useToast();

  const { search } = useRouter();
  const decisionId = new URLSearchParams(search).get('decision');
  const auditEntry = decisionId && AUDIT_DECISIONS[decisionId] || AUDIT_DECISIONS[DEFAULT_DECISION_ID];
  const resolvedTimestamp = formatDemoTimestamp(auditEntry.timestamp);

  return (
    <>
      <SubPageNav engine="govern" parentPath="/govern" parentLabel="Govern" currentLabel={`Audit: ${auditEntry.action}`} />

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-8 md:gap-10 pb-12 pt-8 lg:pt-12`}
        style={PAGE_CONTENT_STYLE}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* ═══════════════════════════════════════════
            PHASE 1: THE CATALYST — Context
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-xl p-6 lg:p-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[var(--engine-govern)] font-bold">Phase 1</span>
              <span className="h-px flex-1 bg-[var(--engine-govern)]/20" />
            </div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)]">
              The Catalyst
            </h2>

            <h1 className={`${PAGE_HEADING_CLASS} break-words`} style={PAGE_HEADING_STYLE}>
              {auditEntry.coreAssertion}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <EngineBadge engine={(ENGINE_MAP[auditEntry.engine] || ENGINE_MAP.Govern).engine} icon={(ENGINE_MAP[auditEntry.engine] || ENGINE_MAP.Govern).icon} label={auditEntry.engine} />
              <span className="text-[11px] uppercase tracking-widest text-white/40 font-semibold font-mono">{auditEntry.id}</span>
              <span className="text-sm text-white/40 font-mono">{resolvedTimestamp}</span>
            </div>

            {/* Narrative from baseReality */}
            <p className="text-sm text-white/70 leading-relaxed">
              {narrateBaseReality(auditEntry.baseReality)}
            </p>

            {/* Key facts as subtle tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {auditEntry.baseReality.map((row) => (
                <span
                  key={row.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs"
                >
                  <span className="text-white/40 font-mono uppercase tracking-wider text-[10px]">{row.label}</span>
                  <span className="text-white/80">{row.value}</span>
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            PHASE 2: THE ANALYSIS — Decision Journey
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-xl p-6 lg:p-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[var(--engine-govern)] font-bold">Phase 2</span>
              <span className="h-px flex-1 bg-[var(--engine-govern)]/20" />
            </div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)]">
              The Analysis
            </h2>

            {/* Decision journey — vertical timeline of factors */}
            <div className="flex flex-col gap-0 relative">
              {/* Vertical connector line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-[var(--engine-govern)]/20" />

              {auditEntry.topFactors.map((factor, i) => (
                <div key={factor.label} className="flex gap-4 relative py-4">
                  {/* Step indicator */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[var(--engine-govern)]/30 bg-[var(--engine-govern)]/10 flex items-center justify-center text-[10px] font-mono font-bold z-10" style={{ color: 'var(--engine-govern)' }}>
                    {i + 1}
                  </div>

                  {/* Factor content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium tracking-wide text-white/90">{factor.label}</span>
                      <span className="text-xs font-mono font-bold tabular-nums" style={{ color: 'var(--engine-govern)' }}>
                        {formatConfidence(factor.contribution)}
                      </span>
                    </div>
                    {/* Contribution bar */}
                    <div className="h-1.5 rounded-full overflow-hidden bg-black/40 border border-white/[0.03]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'var(--engine-govern)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.contribution * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{factor.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Data sources */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Sources analyzed</span>
              <div className="flex flex-wrap gap-2">
                {auditEntry.dataSources.map((src) => (
                  <span
                    key={src}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono tracking-wide text-white/60"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>

            {/* Model info — integrated directly */}
            <p className="text-xs text-white/40 font-mono">
              Model: {auditEntry.model.name} v{auditEntry.model.version} · {auditEntry.model.accuracy}% accuracy
            </p>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            PHASE 3: THE OUTCOME — Protections
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-xl p-6 lg:p-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[var(--engine-govern)] font-bold">Phase 3</span>
              <span className="h-px flex-1 bg-[var(--engine-govern)]/20" />
            </div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)]">
              The Outcome
            </h2>

            {/* Concluding narrative */}
            <p className="text-base text-white/80 leading-relaxed font-light" style={{ fontFamily: 'var(--font-display)' }}>
              {auditEntry.explanation.summary}
            </p>

            {/* Confidence */}
            <div className="flex items-center gap-4 py-4 px-5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <ConfidenceIndicator value={auditEntry.explanation.confidence} colorOverride="var(--engine-govern)" size="lg" glow />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white/90">{formatConfidence(auditEntry.explanation.confidence)} confidence</span>
                <span className="text-xs text-white/40">AI decision certainty for this action</span>
              </div>
            </div>

            {/* Compliance protections — always visible */}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Your Regulatory Protections</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {COMPLIANCE_INFO.map((reg) => (
                  <div
                    key={reg.key}
                    className="flex flex-col gap-1.5 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white/90">{reg.label}</span>
                      {auditEntry.compliance[reg.key] && (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active</span>
                      )}
                    </div>
                    <span className="text-xs text-white/40 leading-relaxed">{reg.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            YOUR VOICE — Actions
            ═══════════════════════════════════════════ */}
        <motion.section variants={fadeUpVariant} className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)] border-b border-white/[0.06] pb-4 px-2">
            Your Voice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => {
                const fab = document.querySelector<HTMLButtonElement>('[aria-label*="Talk to Money"]')
                if (fab) fab.click()
              }}
              className="glass-card rounded-2xl p-5 md:p-6 flex flex-col gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-400/20">
                <MessageCircle size={18} className="text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">I disagree with this</h3>
              <p className="text-xs text-white/40 leading-relaxed">Talk to our AI about this decision and share your perspective.</p>
            </button>

            <button
              type="button"
              onClick={() => showToast({ message: 'Review request submitted', variant: 'success' })}
              className="glass-card rounded-2xl p-5 md:p-6 flex flex-col gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20">
                <RotateCcw size={18} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Request review</h3>
              <p className="text-xs text-white/40 leading-relaxed">Ask for a human review of this automated decision.</p>
            </button>

            <button
              type="button"
              onClick={() => showToast({ message: 'Preparing download...', variant: 'info' })}
              className="glass-card rounded-2xl p-5 md:p-6 flex flex-col gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
                <Download size={18} className="text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Download record</h3>
              <p className="text-xs text-white/40 leading-relaxed">Get a copy of this decision record for your files.</p>
            </button>
          </div>
        </motion.section>

        {/* Permanently sealed footer */}
        <motion.div variants={fadeUpVariant} className="flex items-center justify-center gap-3 py-6 border-t border-white/[0.04]">
          <Lock size={12} className="text-white/20" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-mono">
            Permanently sealed on Poseidon immutable ledger · {auditEntry.id}
          </p>
        </motion.div>

      </motion.div>
    </>
  );
}

export default GovernAuditDetail;
