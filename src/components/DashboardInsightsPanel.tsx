import { motion } from 'framer-motion';

export type InsightVariant = 'morning' | 'evening';

interface EngineIconBadgeProps {
  engine: string;
}

function EngineIconBadge({ engine }: EngineIconBadgeProps) {
  return (
    <span
      data-widget="EngineIconBadge"
      data-engine={engine}
      className={`engine-icon-badge engine-icon-badge--${engine.toLowerCase()}`}
    >
      {engine}
    </span>
  );
}

const MORNING_ACTIVITIES = [
  { label: 'Unusual charge flagged', engine: 'Protect' },
  { label: 'Emergency fund on track', engine: 'Grow' },
  { label: '3 actions queued for review', engine: 'Execute' },
];

const EVENING_METRICS = [
  { label: 'Decisions made', value: '12', tone: 'healthy' },
  { label: 'Alerts resolved', value: '3', tone: 'primary' },
  { label: 'Actions pending', value: '2', tone: 'warning' },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
};

interface DashboardInsightsPanelProps {
  variant: InsightVariant;
}

export function DashboardInsightsPanel({ variant }: DashboardInsightsPanelProps) {
  return (
    <div
      data-widget="DashboardInsightsPanel"
      data-variant={variant}
      className="dashboard-insights-panel"
    >
      {variant === 'morning' ? (
        <motion.div
          className="dashboard-main-card dashboard-insights-card dashboard-insights-card--activity glass-surface"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={fadeUp} className="dashboard-insights-heading">Good morning</motion.h2>
          <motion.div variants={fadeUp} className="dashboard-insights-activity-rail">
            {MORNING_ACTIVITIES.map((item) => (
              <div key={item.label} className="activity-rail-item" data-engine={item.engine}>
                <span className="activity-rail-node">
                  <EngineIconBadge engine={item.engine} />
                </span>
                <span className="activity-rail-label">{item.label}</span>
              </div>
            ))}
          </motion.div>
          <motion.ul variants={fadeUp} className="dashboard-action-list">
            <li>Review flagged charge in Protect</li>
            <li>Top-up emergency fund</li>
            <li>Approve queued transfers</li>
          </motion.ul>
        </motion.div>
      ) : (
        <motion.div
          className="dashboard-main-card dashboard-insights-card glass-surface"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={fadeUp} className="dashboard-insights-heading">Day in review</motion.h2>
          <motion.div variants={fadeUp} className="dashboard-insights-metrics">
            {EVENING_METRICS.map((metric) => (
              <div key={metric.label} className="dashboard-insights-metric" data-tone={metric.tone}>
                <span className="dashboard-insights-metric-value">{metric.value}</span>
                <span className="dashboard-insights-metric-label">{metric.label}</span>
              </div>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="dashboard-insights-signal-trend">
            <EngineIconBadge engine="Protect" />
            <EngineIconBadge engine="Grow" />
            <EngineIconBadge engine="Execute" />
            <span className="dashboard-insights-signal-label">engines active today</span>
          </motion.div>
          <motion.p variants={fadeUp} className="dashboard-insights-proof">AI recommendations</motion.p>
        </motion.div>
      )}
    </div>
  );
}
