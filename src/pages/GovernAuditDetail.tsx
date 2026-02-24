import { motion } from 'framer-motion';
import { useRouter } from '@/router';
import { SubPageNav, ConfidenceIndicator } from '@/components/poseidon';
import { getMotionPreset } from '@/lib/motion-presets';
import { usePageTitle } from '@/hooks/use-page-title';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { formatConfidence, formatDemoTimestamp } from '@/lib/demo-date';
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE, PAGE_HEADING_CLASS, PAGE_HEADING_STYLE } from '@/lib/page-layout';
import { AUDIT_DECISIONS, DEFAULT_DECISION_ID } from '@/lib/govern-audit-data';

export function GovernAuditDetail() {
  const prefersReducedMotion = useReducedMotionSafe();
  const { fadeUp: fadeUpVariant, staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion);
  usePageTitle('Audit Detail');

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
        role="main">

        <motion.section variants={staggerContainerVariant} className="flex flex-col gap-6">
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-1">
            <h1 className={`${PAGE_HEADING_CLASS} mb-2 break-words`} style={PAGE_HEADING_STYLE}>Audit log for <span className="text-[var(--engine-govern)]">{auditEntry.id}</span></h1>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-4">
              {[
                { label: 'Timestamp', value: resolvedTimestamp, color: 'white' },
                { label: 'Confidence', value: resolvedConfidence, color: 'var(--engine-govern)' },
                { label: 'Model', value: auditEntry.model.name, subValue: `v${auditEntry.model.version}`, color: 'var(--engine-execute)' }].
                map((kpi) => <div
                  key={kpi.label} className="glass-card glass-card-overlay rounded-[24px] p-4 md:p-5">
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-semibold text-white/50">{kpi.label}</p>
                    <div className="flex flex-col">
                      <p className="text-lg md:text-xl font-light font-mono truncate" style={{ color: kpi.color, textShadow: kpi.color !== 'white' ? `0 0 15px ${kpi.color}60` : 'none' }}>{kpi.value}</p>
                      {kpi.subValue && <p className="text-[10px] text-white/40 mt-0.5">{kpi.subValue}</p>}
                    </div>
                  </div>
                </div>
                )}
            </div>
          </motion.div>
        </motion.section>

        <div className="flex flex-col gap-6 lg:gap-8">
          <motion.div variants={staggerContainerVariant} className="flex flex-col gap-6 lg:gap-8">
            <motion.div variants={fadeUpVariant}>
              <div className="glass-card glass-card-overlay rounded-[32px] p-6 lg:p-8">
                <h2 className="relative z-10 section-label-bordered mb-6">Decision Metadata</h2>
                <div className="relative z-10 flex flex-col gap-4">
                  {metaRows.map((row) =>
                    <div key={row.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-white/[0.04] last:border-0 gap-2 sm:gap-4">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 shrink-0">{row.label}</span>
                      <span className={`text-sm tracking-wide sm:text-right break-words ${row.highlight ? 'text-[var(--engine-govern)] font-medium drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]' : 'text-white/80 font-light'}`}>{row.value}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <div className="glass-card rounded-[32px] p-6 lg:p-10" style={{ borderTopWidth: 4, borderTopColor: 'var(--engine-govern)' }}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_70%)] pointer-events-none" />
                <h2 className="relative z-10 text-xs font-semibold uppercase tracking-widest text-[var(--engine-govern)] border-b border-white/[0.06] pb-4 mb-6">Decision Reconstruction</h2>

                <div className="relative z-10 flex flex-col gap-5 md:gap-8">
                  <div className="flex flex-col gap-4">
                    <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">{auditEntry.explanation.summary}</p>
                    <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                      <ConfidenceIndicator value={auditEntry.explanation.confidence} colorOverride="var(--engine-govern)" size="lg" glow />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 pt-6 border-t border-white/[0.06]">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-[10px] uppercase tracking-widest text-[#94a3b8] font-semibold flex items-center gap-2">Data Sources Analyzed</h3>
                      <div className="flex flex-wrap gap-2">
                        {auditEntry.dataSources?.map(src => (
                          <span key={src} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono tracking-wide text-white/70 shadow-sm">{src}</span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-2 mt-2">Contributing Factors</h3>
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
              </div>
            </motion.div>

          </motion.div>

        </div>

      </motion.div>
    </>);

}

export default GovernAuditDetail;
