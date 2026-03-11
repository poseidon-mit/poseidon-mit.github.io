import { useRef } from 'react'
import { Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { AnimatedNumber } from '@/components/ui/animated-number'

const miniEngines = [
  { label: 'Protect', value: 'Active', color: '#16A34A', icon: Shield },
  { label: 'Grow', value: '+12.4%', color: '#7C3AED', icon: TrendingUp },
  { label: 'Execute', value: '3 pending', color: '#CA8A04', icon: Zap },
  { label: 'Govern', value: 'All clear', color: '#2563EB', icon: Eye },
]

const auditEntries = [
  { time: '2 min ago', action: 'Portfolio rebalance recommended', engine: 'Grow', color: '#7C3AED' },
  { time: '15 min ago', action: 'Suspicious transaction flagged', engine: 'Protect', color: '#16A34A' },
  { time: '1 hr ago', action: 'Bill payment scheduled', engine: 'Execute', color: '#CA8A04' },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const } },
}

export default function DashboardPreview() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' })

  return (
    <section className="bg-[#F8F7F4] py-24 px-4">
      <div className="max-w-5xl mx-auto" ref={sectionRef}>
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-[#1A1A1A]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] as const }}
        >
          Your Command Center
        </motion.h2>

        {/* Mock dashboard */}
        <motion.div
          className="bg-[#0A1628] rounded-2xl p-2 shadow-2xl max-w-4xl mx-auto mt-12"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] as const, delay: 0.15 }}
        >
          <div className="bg-white rounded-xl p-6 md:p-8">
            {/* Net worth */}
            <div>
              <p className="text-sm text-stone-500 font-medium">Total Net Worth</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-bold text-[#1A1A1A]">
                  {isInView ? (
                    <AnimatedNumber
                      value={847392}
                      duration={1.4}
                      format={(n) => '$' + Math.round(n).toLocaleString()}
                    />
                  ) : (
                    '$0'
                  )}
                </span>
                <span className="text-sm font-semibold text-[#16A34A]">
                  {isInView ? (
                    <AnimatedNumber
                      value={12847}
                      duration={1.4}
                      format={(n) => '+$' + Math.round(n).toLocaleString() + ' (1.5%)'}
                    />
                  ) : (
                    '+$0'
                  )}
                </span>
              </div>
            </div>

            {/* Mini engine cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {miniEngines.map((engine) => {
                const Icon = engine.icon
                return (
                  <div key={engine.label} className="border border-stone-200 rounded-lg p-3">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" style={{ color: engine.color }} />
                      <span className="text-xs text-stone-500 font-medium">{engine.label}</span>
                    </div>
                    <p className="text-sm font-semibold mt-1" style={{ color: engine.color }}>
                      {engine.value}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Live Audit Trail */}
        <motion.div
          className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm max-w-4xl mx-auto mt-6"
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
            Live Audit Trail
          </p>
          <div className="space-y-4">
            {auditEntries.map((entry) => (
              <motion.div
                key={entry.action}
                variants={fadeUp}
                className="flex items-start gap-3 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 animate-pulse"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A]">{entry.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-medium" style={{ color: entry.color }}>
                      {entry.engine}
                    </span>
                    <span className="text-xs text-stone-400">{entry.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
