import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { actions } from "@/data/actions";
import { LovableDecisionDrivers } from "@/components/shared/LovableDecisionDrivers";
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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function LovableApproval() {
  const { id } = useParams<{ id: string }>();
  const action = actions.find((a) => a.id === id);

  if (!action) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-medium text-white mb-2">
            Action not found
          </p>
          <Link to="/lovable/execute" className="text-amber-400 hover:text-amber-300 transition-colors">
            &larr; Back to Execute
          </Link>
        </div>
      </div>
    );
  }

  const handleAction = (type: "approve" | "reject") => {
    toast(`Demo mode \u2014 action simulated \u2713`);
  };

  return (
    <motion.div className="p-4 pb-24" variants={container} initial="hidden" animate="show">
      {/* Back Link */}
      <motion.div variants={item}>
        <Link
          to="/lovable/execute"
          className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Execute
        </Link>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={item} className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-5 mb-4">
        <h1 className="text-xl font-bold text-white mb-2">
          {action.title}
        </h1>
        <p className="text-sm text-white/50 mb-3">{action.description}</p>

        <div className="flex flex-wrap gap-3 text-sm">
          {action.amount != null && (
            <span className="bg-amber-500/15 text-amber-400 rounded-lg px-3 py-1 font-medium">
              ${action.amount.toLocaleString()}
            </span>
          )}
          {action.taxSavings != null && (
            <span className="bg-green-500/15 text-green-400 rounded-lg px-3 py-1 font-medium">
              Tax Savings: ${action.taxSavings.toLocaleString()}
            </span>
          )}
          {action.deadline && (
            <span className="bg-white/[0.06] text-white/60 rounded-lg px-3 py-1">
              Deadline: {action.deadline}
            </span>
          )}
          {action.confidence != null && (
            <span className="bg-blue-500/15 text-blue-400 rounded-lg px-3 py-1 font-medium">
              {(action.confidence * 100).toFixed(0)}% confidence
            </span>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => handleAction("approve")}
          className="bg-green-500 hover:bg-green-400 text-white font-medium py-4 rounded-xl shadow-lg shadow-green-500/25 min-h-[44px] transition-all duration-200"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction("reject")}
          className="bg-red-500 hover:bg-red-400 text-white font-medium py-4 rounded-xl shadow-lg shadow-red-500/25 min-h-[44px] transition-all duration-200"
        >
          Reject
        </button>
      </motion.div>

      {/* Tax Calculation (EXE-001 only) */}
      {action.id === "EXE-001" && (
        <motion.div variants={item}>
          <CollapsibleSection title="Tax Calculation">
            <table className="w-full text-sm font-mono">
              <tbody>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 text-white/50">Federal Tax Savings</td>
                  <td className="py-2 text-right font-medium text-white">$1,024.00</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 text-white/50">California State Tax</td>
                  <td className="py-2 text-right font-medium text-white">$297.60</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 text-white/50">NIIT (3.8%)</td>
                  <td className="py-2 text-right font-medium text-white">$121.60</td>
                </tr>
                <tr>
                  <td className="py-2 text-white font-bold">Total</td>
                  <td className="py-2 text-right font-bold text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.3)]">
                    $399.60
                  </td>
                </tr>
              </tbody>
            </table>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* AI Decision Factors */}
      {action.drivers && action.drivers.length > 0 && (
        <motion.div variants={item}>
          <CollapsibleSection title="AI Decision Factors">
            <LovableDecisionDrivers drivers={action.drivers} />
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Governance Footer */}
      <motion.div variants={item}>
        <LovableGovernanceFooter
          model="POSEIDON-EXECUTOR V1.3"
          processingMs={312}
          auditId="AUD-2026-0310-004"
        />
      </motion.div>
    </motion.div>
  );
}
