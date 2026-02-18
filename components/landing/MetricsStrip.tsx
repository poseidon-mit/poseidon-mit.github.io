"use client"

import { motion } from "framer-motion"
import { AreaChart, Area, ResponsiveContainer } from "recharts"

/* Cross-thread fixed values */
const metrics = [
  {
    label: "System Confidence",
    value: "0.92",
    color: "#2dd4bf",
    data: [3, 5, 4, 7, 6, 8, 7, 9, 8, 9.2],
  },
  {
    label: "Decisions Audited",
    value: "1,247",
    color: "#818cf8",
    data: [2, 4, 5, 3, 6, 7, 8, 7, 10, 12],
  },
  {
    label: "Threats Blocked",
    value: "23",
    color: "#fbbf24",
    data: [1, 0, 2, 1, 3, 2, 1, 3, 2, 2.3],
  },
  {
    label: "Response Time",
    value: "<200ms",
    color: "#60a5fa",
    data: [5, 4, 3, 4, 3, 2, 3, 2, 2, 1.8],
  },
]

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function MetricsStrip() {
  return (
    <section className="mx-auto max-w-7xl px-6" aria-label="Live metrics">
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl"
            variants={staggerItem}
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
                {metric.label}
              </span>
              <span className="text-2xl font-bold text-text-primary">
                {metric.value}
              </span>
            </div>
            <div className="flex-shrink-0">
              <ResponsiveContainer width={60} height={24}>
                <AreaChart data={metric.data.map((v) => ({ v }))}>
                  <defs>
                    <linearGradient
                      id={`grad-${metric.label.replace(/\s/g, "")}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={metric.color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={metric.color}
                    strokeWidth={1.5}
                    fill={`url(#grad-${metric.label.replace(/\s/g, "")})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
