import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
};

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkData: number[];
  sparkColor: string;
}

function StatCard({ label, value, delta, deltaPositive, sparkData, sparkColor }: StatCardProps) {
  const data = sparkData.map((v, i) => ({ i, v }));
  return (
    <motion.div variants={fadeUp} className="stat-card glass-surface">
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        <div className="stat-card__spark" aria-hidden="true">
          <ResponsiveContainer width={60} height={24}>
            <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparkColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={1.5}
                fill={`url(#spark-${label})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <span className="stat-card__value">{value}</span>
      <span className={`stat-card__delta ${deltaPositive ? 'stat-card__delta--up' : 'stat-card__delta--down'}`}>
        {delta}
      </span>
    </motion.div>
  );
}

export function KpiGrid() {
  return (
    <motion.section
      className="kpi-grid"
      variants={stagger}
      initial="hidden"
      animate="visible"
      aria-label="Key performance indicators"
    >
      <StatCard
        label="Net position"
        value="$847k"
        delta="+8.2%"
        deltaPositive
        sparkData={[30, 35, 28, 40, 38, 50, 55, 60]}
        sparkColor="#14B8A6"
      />
      <StatCard
        label="Cash flow"
        value="+$4.1k"
        delta="+12%"
        deltaPositive
        sparkData={[10, 20, 15, 30, 25, 35, 40, 42]}
        sparkColor="#00F0FF"
      />
      <StatCard
        label="Risk"
        value="Low"
        delta="Down from Med"
        deltaPositive
        sparkData={[60, 55, 50, 45, 35, 30, 25, 20]}
        sparkColor="#3B82F6"
      />
      <StatCard
        label="Alerts"
        value="2"
        delta="-3 resolved"
        deltaPositive
        sparkData={[8, 7, 5, 6, 4, 3, 3, 2]}
        sparkColor="#F59E0B"
      />
    </motion.section>
  );
}
