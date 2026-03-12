import {  Link  } from "@/router";
import { TrendingUp, CheckCircle, Lightbulb, Target } from "lucide-react";
import { LovablePageHeader } from "@/components/layout/LovablePageHeader";
import { selectRecommendationListItems } from "@/domain/poseidon-universe";
import { motion } from "framer-motion";

const getSummaryCards = (recsCount: number) => [
  {
    value: "$24,500/yr",
    label: "Identified",
    icon: TrendingUp,
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
  },
  {
    value: "$8,200/yr",
    label: "Realized",
    icon: CheckCircle,
    iconBg: "bg-green-500/15",
    iconColor: "text-green-400",
  },
  {
    value: String(recsCount),
    label: "Recommendations",
    icon: Lightbulb,
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
  },
  {
    value: "25%",
    label: "Acceptance Rate",
    icon: Target,
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
  },
];

const statusStyles: Record<string, string> = {
  approved: "bg-green-500/15 text-green-400",
  pending: "bg-amber-500/15 text-amber-400",
  dismissed: "bg-white/[0.06] text-white/40",
};

const container: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function LovableGrow() {
  const universeRecs = selectRecommendationListItems();
  const recommendations = universeRecs.map(r => ({
    ...r,
    benefit: `$${r.annualSavings.toLocaleString()}/yr`,
    status: r.annualSavings > 1000 ? 'pending' : 'approved',
  }));
  const summaryCards = getSummaryCards(recommendations.length);

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <LovablePageHeader
          icon={TrendingUp}
          iconBg="bg-purple-500/15"
          iconColor="text-purple-400"
          title="Grow"
          description="AI-identified savings and growth opportunities"
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

      {/* Recommendation List */}
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            variants={item}
            className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-4 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-white">{rec.title}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[rec.status] ?? ""}`}
              >
                {rec.status}
              </span>
            </div>
            <p className="text-sm text-white/50 line-clamp-2 mb-2">
              {rec.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-purple-400 text-sm">
                {rec.benefit}
              </span>
              <Link
                to={`/lovable/grow/recommendation/${rec.id}`}
                className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                View &rarr;
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
