import { motion } from "framer-motion"
import { Shield, TrendingUp, Zap, Scale } from "lucide-react"

const engines = [
  {
    name: "Protect",
    icon: Shield,
    description: "Real-time threat detection with explainable AI",
    confidence: "0.94",
    colorClass: "text-engine-protect",
    bgClass: "bg-teal-400/10",
    badgeBg: "bg-teal-400/10",
    badgeText: "text-teal-400",
    borderHover: "hover:border-teal-400/20",
  },
  {
    name: "Grow",
    icon: TrendingUp,
    description: "Forecast-driven growth with Monte Carlo simulations",
    confidence: "0.89",
    colorClass: "text-engine-grow",
    bgClass: "bg-violet-400/10",
    badgeBg: "bg-violet-400/10",
    badgeText: "text-violet-400",
    borderHover: "hover:border-violet-400/20",
  },
  {
    name: "Execute",
    icon: Zap,
    description: "Consent-first automation with reversible actions",
    confidence: "0.91",
    colorClass: "text-engine-execute",
    bgClass: "bg-amber-400/10",
    badgeBg: "bg-amber-400/10",
    badgeText: "text-amber-400",
    borderHover: "hover:border-amber-400/20",
  },
  {
    name: "Govern",
    icon: Scale,
    description: "Full audit trail for every AI decision",
    confidence: "0.97",
    colorClass: "text-engine-govern",
    bgClass: "bg-blue-400/10",
    badgeBg: "bg-blue-400/10",
    badgeText: "text-blue-400",
    borderHover: "hover:border-blue-400/20",
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
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function EngineCards() {
  return (
    <section className="mx-auto max-w-7xl px-6" aria-label="Four AI engines and command center">
      <motion.h2
        className="mb-12 text-center text-3xl font-bold text-text-primary text-balance md:text-4xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Four engines. One trusted command center.
      </motion.h2>

      <motion.div
        className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {engines.map((engine) => {
          const Icon = engine.icon
          return (
            <motion.div
              key={engine.name}
              className={`group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] ${engine.borderHover}`}
              variants={staggerItem}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${engine.bgClass}`}
                >
                  <Icon className={`h-6 w-6 ${engine.colorClass}`} />
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-xs ${engine.badgeBg} ${engine.badgeText}`}
                >
                  {engine.confidence}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                {engine.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">
                {engine.description}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
