import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { recommendations } from "@/data/recommendations";
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

export default function LovableRecommendation() {
  const { id } = useParams<{ id: string }>();
  const rec = recommendations.find((r) => r.id === id);

  if (!rec) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link
          to="/grow"
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
        >
          &larr; Back to Grow
        </Link>
        <p className="text-gray-600">Recommendation not found.</p>
      </div>
    );
  }

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-6"
      style={{ animation: "fadeIn 0.4s ease-out both" }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <Link
        to="/grow"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; Back to Grow
      </Link>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border p-5">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {rec.title}
        </h1>
        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
        {(rec.benefit ?? rec.savings) && (
          <div className="font-mono text-purple-600 text-lg font-semibold">
            {rec.benefit ?? rec.savings}
          </div>
        )}
      </div>

      {/* Action Card */}
      <div className="bg-white rounded-xl border p-5 mt-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => toast("Demo mode — action simulated ✓")}
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl flex-1 text-base font-semibold min-h-[44px] transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => toast("Demo mode — action simulated ✓")}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl flex-1 text-base font-semibold min-h-[44px] transition-colors"
          >
            Decline
          </button>
        </div>
      </div>

      {/* Collapsible Details */}
      <CollapsibleSection title="Calculation Details">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Recommendation</span>
            <span className="text-gray-900">{rec.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Benefit</span>
            <span className="text-gray-900">
              {rec.benefit ?? rec.savings ?? "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Engine</span>
            <span className="text-gray-900">{rec.engine}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="text-gray-900 capitalize">{rec.status}</span>
          </div>
        </div>
      </CollapsibleSection>

      {/* Governance Footer */}
      <LovableGovernanceFooter
        model="POSEIDON-OPTIMIZER V2.1"
        processingMs={456}
        auditId="AUD-2026-0312-003"
      />
    </div>
  );
}
