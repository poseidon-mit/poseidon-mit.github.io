import { useState } from "react";
import { Link } from "@/router";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { selectExecuteActionById } from "@/domain/poseidon-universe";
import { LovableDecisionDrivers } from "@/components/shared/LovableDecisionDrivers";
import { LovableGovernanceFooter } from "@/components/shared/LovableGovernanceFooter";
import { motion, type Variants } from "framer-motion";

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

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function LovableApproval() {
  const { showToast } = useToast();
  // Using a mock ID as parameterized routes aren't supported in standard lazyRoutes without query parsing
  const id = "EXE-001";
  const rawAction = selectExecuteActionById(id || "");
  const action = rawAction ? {
    ...rawAction,
    deadline: rawAction.expiresIn,
  } : undefined;

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
    showToast({ variant: 'success', message: `Demo mode \u2014 action simulated \u2713` });
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
          {action.amountLabel && (
            <span className="bg-amber-500/15 text-amber-400 rounded-lg px-3 py-1 font-medium">
              {action.amountLabel}
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

        {/* Impact Summary (Summary First) */}
        {action.id === "EXE-001" && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1">Current</p>
                <p className="font-mono tabular-nums text-xl font-bold text-white/60">
                  $0 Tax Saved
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 mb-1">After Execution</p>
                <p className="font-mono tabular-nums text-xl font-bold text-amber-500">
                  $399.60 Tax Saved
                </p>
              </div>
            </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 mb-6 sticky top-4 z-10 p-2 -mx-2 bg-[#0A0A0A]/80 backdrop-blur-md rounded-2xl border border-white/5">
        <button
          onClick={() => handleAction("approve")}
          className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/25 min-h-[44px] transition-all duration-200"
        >
          Approve Execution
        </button>
        <button
          onClick={() => handleAction("reject")}
          className="bg-transparent hover:bg-white/5 border border-white/10 text-white/60 hover:text-white font-medium py-4 rounded-xl min-h-[44px] transition-all duration-200"
        >
          Decline
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
      {(action as any).factors && (action as any).factors.length > 0 && (
        <motion.div variants={item}>
          <CollapsibleSection title="AI Decision Factors">
            <LovableDecisionDrivers drivers={(action as any).factors} />
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
