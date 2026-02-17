import { useState, useEffect } from 'react';
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
  const [alertCount, setAlertCount] = useState(2);
  const [alertSpark, setAlertSpark] = useState([8, 7, 5, 6, 4, 3, 3, 2]);
  const [cashSpark, setCashSpark] = useState([10, 20, 15, 30, 25, 35, 40, 42]);
  const [riskSpark, setRiskSpark] = useState([60, 55, 50, 45, 35, 30, 25, 20]);

  useEffect(() => {
    const id = setInterval(() => {
      // Alert count: random walk ±1, clamped 0-8
      setAlertCount((prev) => Math.max(0, Math.min(8, prev + (Math.random() > 0.45 ? -1 : 1))));
      // Sparkline update: drop oldest, append new point
      setAlertSpark((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(0, last + Math.round((Math.random() - 0.5) * 2));
        return [...prev.slice(1), next];
      });
      setCashSpark((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(5, last + Math.round((Math.random() - 0.3) * 4));
        return [...prev.slice(1), next];
      });
      setRiskSpark((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(10, Math.min(70, last + Math.round((Math.random() - 0.6) * 3)));
        return [...prev.slice(1), next];
      });
    }, 12000);
    return () => clearInterval(id);
  }, []);

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
        sparkData={cashSpark}
        sparkColor="#00F0FF"
      />
      <StatCard
        label="Risk"
        value="Low"
        delta="Down from Med"
        deltaPositive
        sparkData={riskSpark}
        sparkColor="#3B82F6"
      />
      <StatCard
        label="Alerts"
        value={String(alertCount)}
        delta={alertCount <= 2 ? '-3 resolved' : `+${alertCount - 2} new`}
        deltaPositive={alertCount <= 2}
        sparkData={alertSpark}
        sparkColor="#F59E0B"
      />
    </motion.section>
  );
}
