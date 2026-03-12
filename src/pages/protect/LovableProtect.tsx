import {  Link  } from "@/router";
import { Shield, Eye, AlertTriangle, ShieldCheck } from "lucide-react";
import { LovablePageHeader } from "@/components/layout/LovablePageHeader";
import { LovableSeverityBadge } from "@/components/shared/LovableSeverityBadge";
import { selectProtectThreats } from "@/domain/poseidon-universe";
import { motion } from "framer-motion";

const getSummaryCards = (threatsCount: number) => [
  {
    value: "8,452",
    label: "Transactions Protected",
    icon: Shield,
    iconBg: "bg-green-500/15",
    iconColor: "text-green-400",
  },
  {
    value: "100%",
    label: "Monitored",
    icon: Eye,
    iconBg: "bg-green-500/15",
    iconColor: "text-green-400",
  },
  {
    value: String(threatsCount),
    label: "Threats Detected",
    icon: AlertTriangle,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
  {
    value: String(threatsCount - 3),
    label: "Threats Blocked",
    icon: ShieldCheck,
    iconBg: "bg-green-500/15",
    iconColor: "text-green-400",
  },
];

const container: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function LovableProtect() {
  const universeThreats = selectProtectThreats();
  const threats = universeThreats.map(t => ({
    ...t,
    status: t.status === "resolved" ? "dismissed" : "active",
    amount: t.amountUsd,
    account: "Checking *1234",
    title: t.counterparty,
    timestamp: t.relativeTime,
    severity: (t.severity === "Critical" || t.severity === "High" ? "high" : (t.severity === "Medium" ? "medium" : "low")) as "high" | "medium" | "low"
  }));
  const summaryCards = getSummaryCards(threats.length);

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <LovablePageHeader
          icon={Shield}
          iconBg="bg-green-500/15"
          iconColor="text-green-400"
          title="Protect"
          description="AI-powered threat detection across all accounts"
        />
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-4 flex flex-col gap-2 hover:bg-white/[0.07] transition-all duration-300"
          >
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${card.iconBg} ring-1 ring-white/[0.08]`}
            >
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="text-xs text-white/40">{card.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Threat List */}
      <div className="space-y-3">
        {threats.map((threat, i) => (
          <motion.div
            key={threat.id}
            variants={item}
            className={`bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-4 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300 ${
              threat.status === "dismissed" ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <LovableSeverityBadge severity={threat.severity} />
              <span className="font-semibold text-white">
                {threat.title}
              </span>
            </div>
            {threat.description && (
              <p className="text-sm text-white/50 line-clamp-2 mb-1">
                {threat.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-white/30">{threat.timestamp}</span>
              <Link
                to={`/lovable/protect/alert-detail/${threat.id}?demo=true`}
                className="text-sm text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Review &rarr;
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
