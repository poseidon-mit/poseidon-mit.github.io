import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Download, RotateCcw, ChevronDown, Lock } from 'lucide-react';
import { useRouter } from '@/router';
import { SubPageNav, ConfidenceIndicator } from '@/components/poseidon';
import { getMotionPreset } from '@/lib/motion-presets';
import { usePageTitle } from '@/hooks/use-page-title';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date';
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout';
import { AUDIT_DECISIONS, DEFAULT_DECISION_ID } from '@/lib/govern-audit-data';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

const COMPLIANCE_TOOLTIPS: Record<string, string> = {
  gdpr: 'Your data rights under European privacy law',
  ecoa: 'Equal treatment in financial decisions',
  ccpa: 'Your California privacy protections',
};

export function GovernAuditDetail() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion);
  usePageTitle('Audit Detail');
  const { showToast } = useToast();
  const [techOpen, setTechOpen] = useState(false);

  const { search } = useRouter();
  const decisionId = new URLSearchParams(search).get('decision');
  const auditEntry = decisionId && AUDIT_DECISIONS[decisionId] || AUDIT_DECISIONS[DEFAULT_DECISION_ID];
  const resolvedTimestamp = formatDemoTimestamp(auditEntry.timestamp);

  return (
    <>
      <SubPageNav engine="govern" parentPath="/govern" parentLabel="Govern" currentLabel={`Audit: ${auditEntry.action}`} />

      <motion.div
        id="main-content"
        className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6 md:gap-8 lg:gap-12 pb-12 pt-8 lg:pt-12`}
        style={PAGE_CONTENT_STYLE}
        variants={staggerContainerVariant}
        initial="hidden"
        animate="visible"
        role="main"
      >
        {/* What Happened */}
        <motion.section variants={fadeUpVariant} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-widest text-white/40 font-semibold mb-2 font-mono block">{auditEntry.id}</span>
          <h1 className={`${PAGE_HEADING_CLASS} break-words`} style={PAGE_HEADING_STYLE}>
            {auditEntry.coreAssertion}
          </h1>
          <p className="text-sm text-white/40 mt-2 font-mono">{resolvedTimestamp}</p>
        </motion.section>

        {/* Two-column grid: The Facts + Why This Decision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: The Facts */}
          <motion.div variants={fadeUpVariant}>
            <div className="glass-card glass-card-overlay rounded-xl p-6 lg:p-8 flex flex-col gap-6 h-full">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)] border-b border-white/[0.06] pb-4">
                The Facts
              </h2>

              {/* Factual rows — visual diff treatment for before/after pairs */}
              <div className="flex flex-col gap-0">
                {auditEntry.baseReality.map((row) => {
                  const isPrevious = /^(previous|current apr|old|before)/i.test(row.label)
                  const isTarget = /^(current(?! apr)|target|new|after|available)/i.test(row.label)
                  return (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0"
                    >
                      <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">{row.label}</span>
                      <span className={cn(
                        'text-base text-right',
                        isPrevious ? 'text-white/40 line-through' : isTarget ? 'text-white/90 font-medium' : 'text-white/90 font-light',
                      )}>
                        {row.value}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Data source pills */}
              <div className="flex flex-col gap-3 pt-2">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Data Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {auditEntry.dataSources.map((src) => (
                    <span
                      key={src}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono tracking-wide text-white/70"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>

              {/* Model info — de-emphasized */}
              <div className="pt-2 border-t border-white/[0.06]">
                <p className="text-xs text-white/50">
                  Analyzed by <span className="text-white/70 font-mono">{auditEntry.model.name}</span> — {auditEntry.model.accuracy}% accuracy
                </p>
                <button
                  type="button"
                  onClick={() => setTechOpen(v => !v)}
                  className="flex items-center gap-1 mt-2 text-[10px] uppercase tracking-widest text-white/30 hover:text-white/50 transition-colors cursor-pointer"
                >
                  Technical details
                  <ChevronDown size={10} className={cn('transition-transform', techOpen && 'rotate-180')} />
                </button>
                {techOpen && (
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                    <span className="font-mono">{auditEntry.model.name}</span>
                    <span>v{auditEntry.model.version}</span>
                    <span>{auditEntry.model.accuracy}% accuracy</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Why This Decision — SHAP bars */}
          <motion.div variants={fadeUpVariant}>
            <div className="glass-card glass-card-overlay rounded-xl p-6 lg:p-8 flex flex-col gap-6 h-full" style={{ borderTopWidth: 2, borderTopColor: 'var(--engine-govern)' }}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)] border-b border-white/[0.06] pb-4">
                Why This Decision
              </h2>

              <div className="flex flex-col gap-5">
                {auditEntry.topFactors.map((factor) => (
                  <div key={factor.label} className="flex flex-col gap-2 group">
                    <div className="flex items-end justify-between gap-2">
                      <span className="text-sm tracking-wide text-white/90">{factor.label}</span>
                      <span className="text-[10px] font-mono tracking-widest text-white/50">{formatConfidence(factor.contribution)}</span>
                    </div>
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-black/40 shadow-inner border border-white/[0.03]">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-[var(--engine-govern)]/60 group-hover:bg-[var(--engine-govern)]"
                        style={{ width: `${factor.contribution * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/40 italic">{factor.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Your Protections */}
        <motion.div variants={fadeUpVariant}>
          <div className="glass-card glass-card-overlay rounded-xl p-6 lg:p-8 flex flex-col gap-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)] border-b border-white/[0.06] pb-4">
              Your Protections
            </h2>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
              {/* Compliance badges with tooltips */}
              <div className="flex flex-wrap gap-4">
                {([
                  { key: 'gdpr' as const, label: 'GDPR' },
                  { key: 'ecoa' as const, label: 'ECOA' },
                  { key: 'ccpa' as const, label: 'CCPA' },
                ]).map((reg) => (
                  <div
                    key={reg.key}
                    className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                    title={COMPLIANCE_TOOLTIPS[reg.key]}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white/90">{reg.label}</span>
                      {auditEntry.compliance[reg.key] && (
                        <span className="text-xs font-medium text-emerald-400">Protected</span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/30">{COMPLIANCE_TOOLTIPS[reg.key]}</span>
                  </div>
                ))}
              </div>

              {/* Confidence indicator */}
              <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <ConfidenceIndicator value={auditEntry.explanation.confidence} colorOverride="var(--engine-govern)" size="lg" glow />
                <span className="text-xs text-white/50">{formatConfidence(auditEntry.explanation.confidence)} confidence</span>
              </div>
            </div>

            {/* Explanation summary */}
            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-sm text-white/70 leading-relaxed">{auditEntry.explanation.summary}</p>
            </div>
          </div>
        </motion.div>

        {/* What You Can Do */}
        <motion.section variants={fadeUpVariant} className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)] border-b border-white/[0.06] pb-4 px-2">
            What You Can Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => {
                // Find and click the Talk to Money FAB to open with audit context
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
