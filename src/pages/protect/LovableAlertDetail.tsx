import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { threats } from "@/data/threats";
import { LovableSeverityBadge } from "@/components/shared/LovableSeverityBadge";
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

export default function LovableAlertDetail() {
  const { id } = useParams<{ id: string }>();
  const threat = threats.find((t) => t.id === id);

  if (!threat) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link
          to="/lovable/protect"
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
        >
          &larr; Back to Protect
        </Link>
        <p className="text-gray-600">Threat not found.</p>
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
        to="/lovable/protect"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; Back to Protect
      </Link>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border p-5">
        <div className="flex items-center gap-2 mb-3">
          <LovableSeverityBadge severity={threat.severity} />
          <h1 className="text-xl font-semibold text-gray-900">
            {threat.title}
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {threat.amount != null && (
            <div>
              <span className="text-gray-500">Amount</span>
              <div className="font-mono text-gray-900">
                ${threat.amount.toFixed(2)}
              </div>
            </div>
          )}
          <div>
            <span className="text-gray-500">Timestamp</span>
            <div className="font-mono text-gray-900">{threat.timestamp}</div>
          </div>
          {threat.location && (
            <div>
              <span className="text-gray-500">Location</span>
              <div className="font-mono text-gray-900">{threat.location}</div>
            </div>
          )}
          <div>
            <span className="text-gray-500">Account</span>
            <div className="font-mono text-gray-900">{threat.account}</div>
          </div>
        </div>
      </div>

      {/* Action Card — ABOVE FOLD */}
      <div className="bg-white rounded-xl border p-5 mt-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900">
          Is this activity legitimate?
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => toast("Demo mode — action simulated ✓")}
            className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl shadow-lg shadow-green-500/25 flex-1 text-base font-semibold min-h-[44px] transition-colors"
          >
            This was Me
          </button>
          <button
            onClick={() => toast("Demo mode — action simulated ✓")}
            className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl shadow-lg shadow-red-500/25 flex-1 text-base font-semibold min-h-[44px] transition-colors"
          >
            Block &amp; Secure
          </button>
        </div>
      </div>

      {/* Collapsible Sections */}
      <CollapsibleSection title="Transaction Details">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Merchant</span>
            <span className="text-gray-900">{threat.merchant ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="text-gray-900">
              {threat.amount != null ? `$${threat.amount.toFixed(2)}` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Card / Account</span>
            <span className="text-gray-900">{threat.account}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Type</span>
            <span className="text-gray-900">
              {threat.merchant ? "Purchase" : "Account Activity"}
            </span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Device & Location">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Device</span>
            <span className="text-gray-900">{threat.device ?? "Unknown"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">OS / Browser</span>
            <span className="text-gray-900">{threat.device ?? "Unknown"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">IP Address</span>
            <span className="text-gray-900">{threat.ip ?? "Unknown"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Location</span>
            <span className="text-gray-900">
              {threat.location ?? "Unknown"}
            </span>
          </div>
        </div>
      </CollapsibleSection>

      {threat.drivers && threat.drivers.length > 0 && (
        <CollapsibleSection title="AI Decision Factors">
          <LovableDecisionDrivers drivers={threat.drivers} />
        </CollapsibleSection>
      )}

      {/* Governance Footer */}
      <LovableGovernanceFooter
        model="POSEIDON-THREATDETECT V1.0"
        processingMs={234}
        auditId="AUD-2026-0310-001"
      />
    </div>
  );
}
