import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { actions } from "@/data/actions";
import { LovableDecisionDrivers } from "@/components/shared/LovableDecisionDrivers";
import { LovableGovernanceFooter } from "@/components/shared/LovableGovernanceFooter";

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left font-medium min-h-[44px]"
      >
        {title}
        <ChevronDown
          className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t pt-3">{children}</div>
      )}
    </div>
  );
}

export default function LovableApproval() {
  const { id } = useParams<{ id: string }>();
  const action = actions.find((a) => a.id === id);

  if (!action) {
    return (
      <div className="min-h-screen bg-[#ECEAE5] p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">
            Action not found
          </p>
          <Link to="/lovable/execute" className="text-yellow-600 hover:text-yellow-700">
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
    <div className="min-h-screen bg-[#ECEAE5] p-4 pb-24 animate-fade-in">
      {/* Back Link */}
      <Link
        to="/lovable/execute"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Execute
      </Link>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border p-5 mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {action.title}
        </h1>
        <p className="text-sm text-gray-600 mb-3">{action.description}</p>

        <div className="flex flex-wrap gap-3 text-sm">
          {action.amount != null && (
            <span className="bg-yellow-50 text-yellow-700 rounded-lg px-3 py-1 font-medium">
              ${action.amount.toLocaleString()}
            </span>
          )}
          {action.taxSavings != null && (
            <span className="bg-green-50 text-green-700 rounded-lg px-3 py-1 font-medium">
              Tax Savings: ${action.taxSavings.toLocaleString()}
            </span>
          )}
          {action.deadline && (
            <span className="bg-gray-100 text-gray-700 rounded-lg px-3 py-1">
              Deadline: {action.deadline}
            </span>
          )}
          {action.confidence != null && (
            <span className="bg-blue-50 text-blue-700 rounded-lg px-3 py-1 font-medium">
              {(action.confidence * 100).toFixed(0)}% confidence
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => handleAction("approve")}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-4 rounded-xl min-h-[44px] transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction("reject")}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-4 rounded-xl min-h-[44px] transition-colors"
        >
          Reject
        </button>
      </div>

      {/* Tax Calculation (EXE-001 only) */}
      {action.id === "EXE-001" && (
        <CollapsibleSection title="Tax Calculation">
          <table className="w-full text-sm font-mono">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Federal Tax Savings</td>
                <td className="py-2 text-right font-medium">$1,024.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">California State Tax</td>
                <td className="py-2 text-right font-medium">$297.60</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">NIIT (3.8%)</td>
                <td className="py-2 text-right font-medium">$121.60</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-900 font-bold">Total</td>
                <td className="py-2 text-right font-bold text-gray-900">
                  $1,443.20
                </td>
              </tr>
            </tbody>
          </table>
        </CollapsibleSection>
      )}

      {/* AI Decision Factors */}
      {action.drivers && action.drivers.length > 0 && (
        <CollapsibleSection title="AI Decision Factors">
          <LovableDecisionDrivers drivers={action.drivers} />
        </CollapsibleSection>
      )}

      {/* Governance Footer */}
      <LovableGovernanceFooter
        model="POSEIDON-EXECUTOR V1.3"
        processingMs={312}
        auditId="AUD-2026-0310-004"
      />
    </div>
  );
}
