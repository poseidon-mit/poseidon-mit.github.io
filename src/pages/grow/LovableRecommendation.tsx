import { useState } from "react";
import {  useRouter, Link  } from "@/router";
import { useToast } from "@/hooks/useToast";
import { ChevronDown } from "lucide-react";
import { selectSpotlightRecommendation } from "@/domain/poseidon-universe";
import { LovableGovernanceFooter } from "@/components/shared/LovableGovernanceFooter";
import { motion } from "framer-motion";

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-white min-h-[44px]"
      >
        {title}
        <ChevronDown
          className={`h-5 w-5 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-white/[0.06] pt-3">{children}</div>
      )}
    </div>
  );
}

const container: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function LovableRecommendation() {
  const rawRec = selectSpotlightRecommendation();
  const rec = rawRec ? {
    ...rawRec,
    benefit: `$${rawRec.annualSavings.toLocaleString()}/yr`,
    status: "pending",
    engine: "Grow",
    savings: undefined
  } : undefined;

  if (!rec) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link
          to="/lovable/grow"
          className="text-sm text-white/40 hover:text-white/70 mb-4 inline-block"
        >
          &larr; Back to Grow
        </Link>
        <p className="text-white/50">Recommendation not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Link
          to="/lovable/grow"
          className="text-sm text-white/40 hover:text-white/70 mb-4 inline-block transition-colors"
        >
          &larr; Back to Grow
        </Link>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={item} className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-5">
        <h1 className="text-xl font-semibold text-white mb-2">
          {rec.title}
        </h1>
        <p className="text-sm text-white/50 mb-3">{rec.description}</p>
        {(rec.benefit ?? rec.savings) && (
          <div className="font-mono text-purple-400 text-lg font-semibold drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
            {rec.benefit ?? rec.savings}
          </div>
        )}
      </motion.div>

      {/* Action Card */}
      <motion.div variants={item} className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-5 mt-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => alert("Demo mode — action simulated ✓")}
            className="bg-purple-500 hover:bg-purple-400 text-white py-3 rounded-xl shadow-lg shadow-purple-500/25 flex-1 text-base font-semibold min-h-[44px] transition-all duration-200"
          >
            Accept
          </button>
          <button
            onClick={() => alert("Demo mode — action simulated ✓")}
            className="border border-white/[0.15] text-white/70 hover:bg-white/[0.06] py-3 rounded-xl flex-1 text-base font-semibold min-h-[44px] transition-all duration-200"
          >
            Decline
          </button>
        </div>
      </motion.div>

      {/* Collapsible Details */}
      <motion.div variants={item}>
        <CollapsibleSection title="Calculation Details">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Recommendation</span>
              <span className="text-white">{rec.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Estimated Benefit</span>
              <span className="text-white">
                {rec.benefit ?? rec.savings ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Engine</span>
              <span className="text-white">{rec.engine}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Status</span>
              <span className="text-white capitalize">{rec.status}</span>
            </div>
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* Governance Footer */}
      <motion.div variants={item}>
        <LovableGovernanceFooter
          model="POSEIDON-OPTIMIZER V2.1"
          processingMs={456}
          auditId="AUD-2026-0311-003"
        />
      </motion.div>
    </motion.div>
  );
}
