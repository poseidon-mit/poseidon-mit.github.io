/**
 * DashboardGlance — Glance-mode view for Dashboard.
 *
 * Shows 3 key financial metrics and engine health summary
 * as large, easily scannable cards.
 */
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Bell, Activity } from 'lucide-react';
import { CountUp, ConfidenceIndicator } from '@/components/poseidon';
import { Surface } from '@/design-system';
import { fadeUp, staggerContainer } from '@/lib/motion-presets';

const glanceKpis = [
  { id: 'net', label: 'Net Position', Icon: DollarSign, value: 847, prefix: '$', suffix: 'k', decimals: 0, accent: '#14B8A6', trend: '+8.2% this month' },
  { id: 'cash', label: 'Cash Flow', Icon: TrendingUp, value: 4.1, prefix: '+$', suffix: 'k', decimals: 1, accent: '#00F0FF', trend: '+12% vs last month' },
  { id: 'alerts', label: 'Active Alerts', Icon: Bell, value: 1, prefix: '', suffix: '', decimals: 0, accent: '#F59E0B', trend: '3 resolved today' },
] as const;

const engineStatus = [
  { name: 'Protect', confidence: 0.94, color: '#22C55E' },
  { name: 'Grow', confidence: 0.89, color: '#8B5CF6' },
  { name: 'Execute', confidence: 0.91, color: '#EAB308' },
  { name: 'Govern', confidence: 0.97, color: '#3B82F6' },
] as const;

export function DashboardGlance() {
  return (
    <motion.div
      variants={staggerContainer}
      className="flex flex-col gap-4"
      aria-label="Dashboard glance view"
    >
      {/* KPI Cards Row */}
      <motion.section
        variants={fadeUp}
        className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4"
        aria-label="Key financial metrics"
      >
        {glanceKpis.map(({ id, label, Icon, value, prefix, suffix, decimals, accent, trend }) => (
          <Surface
            as={motion.div}
            variant="glass"
            padding="md"
            key={id}
            variants={fadeUp}
            className="flex flex-col gap-3"
            borderColor={accent}
            borderWidth={2}
          >
            <div className="flex items-center justify-between">
              <span
                className="flex items-center gap-1.5 text-xs font-medium tracking-wide"
                style={{ color: '#64748B' }}
              >
                <Icon size={12} aria-hidden="true" />
                {label}
              </span>
              <div className="h-2 w-2 rounded-full" style={{ background: accent }} />
            </div>
            <p className="font-mono text-3xl font-bold tracking-tight" style={{ color: accent }}>
              <CountUp value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
            </p>
            <span className="text-xs" style={{ color: '#64748B' }}>{trend}</span>
          </Surface>
        ))}
      </motion.section>

      {/* Engine Health Row */}
      <motion.section variants={fadeUp} aria-label="Engine health summary">
        <Surface
          variant="glass"
          padding="md"
          className="flex flex-col gap-3"
          borderColor="#00F0FF"
          borderWidth={2}
        >
          <div className="flex items-center gap-2">
            <Activity size={14} style={{ color: '#00F0FF' }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: '#00F0FF' }}
            >
              System Confidence
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {engineStatus.map(({ name, confidence, color }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <span className="text-xs font-medium" style={{ color }}>{name}</span>
                <ConfidenceIndicator value={confidence} accentColor={color} />
              </div>
            ))}
          </div>
        </Surface>
      </motion.section>
    </motion.div>
  );
}

DashboardGlance.displayName = 'DashboardGlance';
