/**
 * GovernSidebar — Right sidebar with confidence trend chart,
 * evidence distribution bars, and compliance status for the Govern engine page.
 */
import { CheckCircle2, Database, TrendingUp, ShieldCheck } from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { GlassCard, MethodologyCard } from '@/components/poseidon';
import type { ViewMode } from '@/hooks/useViewMode';
import { confidenceTrendData, evidenceTypes, complianceItems, governMethodology } from './govern-data';

/* ═══════════════════════════════════════════
   EVIDENCE DISTRIBUTION
   ═══════════════════════════════════════════ */

function EvidenceDistribution() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        <Database size={14} style={{ color: '#3B82F6' }} aria-hidden="true" />
        Evidence Types
      </h3>
      <div className="flex flex-col gap-3">
        {evidenceTypes.map((e) => (
          <div key={e.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>{e.label}</span>
              <span className="text-xs font-mono tabular-nums" style={{ color: '#3B82F6' }}>{e.pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${e.pct}%`, background: '#3B82F6' }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════
   CONFIDENCE TREND
   ═══════════════════════════════════════════ */

function ConfidenceTrend() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
          <TrendingUp size={14} style={{ color: '#3B82F6' }} aria-hidden="true" />
          30-Day Confidence
        </h3>
        <span className="text-xs font-mono tabular-nums" style={{ color: '#10B981' }}>0.97</span>
      </div>
      <div className="h-24" role="img" aria-label="Confidence trend over 30 days showing increase from 0.95 to 0.97">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={confidenceTrendData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6', stroke: '#0B1221', strokeWidth: 2 }}
            />
            <Tooltip
              contentStyle={{
                background: '#0F1D32',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F1F5F9',
              }}
              formatter={(value: number) => [value.toFixed(2), 'Confidence']}
              labelFormatter={(label) => `Day ${label}`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════
   COMPLIANCE STATUS
   ═══════════════════════════════════════════ */

function ComplianceStatus() {
  return (
    <GlassCard className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#F1F5F9' }}>
        <ShieldCheck size={14} style={{ color: '#3B82F6' }} aria-hidden="true" />
        Compliance Status
      </h3>
      <div className="flex flex-col gap-3">
        {complianceItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: '#CBD5E1' }}>{item.label}</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: item.compliant ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                color: item.compliant ? '#10B981' : '#EF4444',
              }}
            >
              <CheckCircle2 size={11} />
              Compliant
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs" style={{ color: '#64748B' }}>Last audit</span>
          <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>2026-02-10</span>
        </div>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════
   COMBINED SIDEBAR EXPORT
   ═══════════════════════════════════════════ */

interface GovernSidebarProps {
  viewMode?: ViewMode;
}

export function GovernSidebar({ viewMode = 'detail' }: GovernSidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4" aria-label="Governance statistics sidebar">
      <EvidenceDistribution />
      <ConfidenceTrend />
      <ComplianceStatus />
      {viewMode === 'deep' && (
        <MethodologyCard
          modelName={governMethodology.modelName}
          modelVersion={governMethodology.modelVersion}
          accuracy={governMethodology.accuracy}
          description={governMethodology.description}
          accentColor="#3B82F6"
        />
      )}
    </aside>
  );
}

export default GovernSidebar;
