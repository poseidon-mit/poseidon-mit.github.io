"use client"

import { motion } from "framer-motion"
import { Brain, ScrollText, RotateCcw } from "lucide-react"

const pillars = [
  {
    icon: Brain,
    title: "Explainable",
    description:
      "Every AI recommendation comes with a plain-language reasoning chain and contributing data sources.",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
  },
  {
    icon: ScrollText,
    title: "Auditable",
    description:
      "Immutable audit trail for every decision. Full lineage from data input to action output.",
    colorClass: "text-teal-400",
    bgClass: "bg-teal-400/10",
  },
  {
    icon: RotateCcw,
    title: "Reversible",
    description:
      "One-click undo on any automated action. Consent gates before every execution.",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-400/10",
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

export function GovernanceProofSection() {
  return (
    <section
      className="mx-auto max-w-7xl px-6"
      aria-label="Governance principles"
    >
      <motion.h2
        className="mb-12 text-center text-3xl font-bold text-text-primary text-balance md:text-4xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Governance by design, not by checkbox
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {pillars.map((pillar) => {
          const Icon = pillar.icon
          return (
            <motion.div
              key={pillar.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl"
              variants={staggerItem}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${pillar.bgClass}`}
              >
                <Icon className={`h-6 w-6 ${pillar.colorClass}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {pillar.description}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Proof Bar */}
      <motion.div
        className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.03] px-6 py-3 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <p className="text-center font-mono text-xs text-text-muted">
          {"System uptime 99.97% \u00B7 Last audit: 4m ago \u00B7 Model version: v3.2.1 \u00B7 Decisions today: 47"}
        </p>
      </motion.div>
    </section>
  )
}
