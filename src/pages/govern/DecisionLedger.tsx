/**
 * DecisionLedger — Decision audit trail table (desktop) + cards (mobile)
 * with expandable detail for the Govern engine page.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, CircleDot, FileText } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';
import { StatusBadge, ConfidenceIndicator, CitationCard, ReasoningChain } from '@/components/poseidon';
import type { ViewMode } from '@/hooks/useViewMode';
import { decisions, typeColor, typeBg, governCitations, governReasoningSteps, type DecisionType } from './govern-data';
import { Surface, Button } from '@/design-system'

/* ═══════════════════════════════════════════
   GOVERN-SPECIFIC: TypeBadge
   ═══════════════════════════════════════════ */

function TypeBadge({ type }: { type: DecisionType }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: typeBg[type], color: typeColor[type] }}
    >
      <CircleDot size={10} />
      {type}
    </span>
  );
}

/* ═══════════════════════════════════════════
   DECISION LEDGER
   ═══════════════════════════════════════════ */

interface DecisionLedgerProps {
  navigate: (path: string) => void;
  viewMode?: ViewMode;
}

export function DecisionLedger({ navigate, viewMode = 'detail' }: DecisionLedgerProps) {
  // expandedDecision state — wired up for future detail expansion
  const [expandedDecision, setExpandedDecision] = React.useState<string | null>(null);

  return (
    <motion.section variants={staggerContainer} className="flex flex-col gap-4">
      <h2
        className="text-lg md:text-xl font-semibold flex items-center gap-2"
        style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}
      >
        <FileText size={20} style={{ color: 'var(--engine-govern)' }} aria-hidden="true" />
        Decision Audit Trail
      </h2>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Surface variant="glass" padding="none" data-surface-role="structure" className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left" role="table">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Decision ID', 'Type', 'Timestamp', 'Confidence', 'Evidence', 'Status', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold"
                        style={{ color: '#64748B' }}
                        scope="col"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {decisions.map((d) => (
                  <motion.tr
                    key={d.id}
                    variants={fadeUp}
                    className="group transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-4 py-3.5">
                      <Button
                        className="text-sm font-mono font-medium transition-colors hover:underline cursor-pointer"
                        variant="ghost"
                        engine="govern"
                        size="sm"
                        style={{ color: 'var(--engine-govern)' }}
                        aria-label={`View details for decision ${d.id}`}
                        onClick={() => navigate('/govern/audit-detail')}
                      >
                        {d.id}
                      </Button>
                      <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{d.description}</p>
                      {d.hash && (
                        <p className="text-[10px] mt-0.5 font-mono" style={{ color: '#475569' }}>{d.hash}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <TypeBadge type={d.type} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs" style={{ color: '#94A3B8' }}>{d.timestamp}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <ConfidenceIndicator value={d.confidence} accentColor="var(--engine-govern)" />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-mono tabular-nums" style={{ color: '#CBD5E1' }}>
                        {d.evidencePoints} pts
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <Button
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        variant="glass"
                        engine="govern"
                        size="sm"
                        aria-label={`View audit trail for decision ${d.id}`}
                        onClick={() => navigate('/govern/audit-detail')}
                      >
                        <Eye size={13} />
                        View trail
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {decisions.map((d) => (
          <motion.div key={d.id} variants={fadeUp}>
            <Surface variant="glass" padding="md" className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={d.type} />
                <StatusBadge status={d.status} />
                <span className="ml-auto text-xs" style={{ color: '#64748B' }}>{d.timestamp}</span>
              </div>
              <Button
                className="text-sm font-mono font-medium text-left transition-colors hover:underline cursor-pointer"
                variant="ghost"
                engine="govern"
                size="sm"
                style={{ color: 'var(--engine-govern)', padding: 0 }}
                aria-label={`View details for decision ${d.id}`}
                onClick={() => {
                  if (viewMode === 'deep') {
                    setExpandedDecision(expandedDecision === d.id ? null : d.id);
                  } else {
                    navigate('/govern/audit-detail');
                  }
                }}
              >
                {d.id}
              </Button>
              <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{d.description}</p>
              {d.hash && (
                <p className="text-[10px] font-mono" style={{ color: '#475569' }}>{d.hash}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#64748B' }}>
                  {d.evidencePoints} evidence points
                </span>
                <ConfidenceIndicator value={d.confidence} accentColor="var(--engine-govern)" />
              </div>
              {viewMode === 'deep' && expandedDecision === d.id && (
                <CitationCard
                  summary={`${d.id}: ${d.description}. ${d.evidencePoints} evidence points collected.`}
                  sources={governCitations}
                  confidence={d.confidence}
                  accentColor="var(--engine-govern)"
                  viewMode={viewMode}
                  className="mt-2"
                />
              )}
              <Button
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                variant="glass"
                engine="govern"
                fullWidth
                aria-label={`View audit trail for decision ${d.id}`}
                onClick={() => navigate('/govern/audit-detail')}
              >
                <Eye size={16} />
                View trail
              </Button>
            </Surface>
          </motion.div>
        ))}
      </div>

      {/* Deep mode: reasoning chain */}
      {viewMode === 'deep' && (
        <ReasoningChain steps={governReasoningSteps} accentColor="var(--engine-govern)" className="mt-4" />
      )}
    </motion.section>
  );
}

export default DecisionLedger;
