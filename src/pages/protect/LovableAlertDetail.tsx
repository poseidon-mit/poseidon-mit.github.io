import { useState } from "react";
import {  useRouter, Link  } from "@/router";
import { useToast } from "@/hooks/useToast";
import { ChevronDown } from "lucide-react";
import { selectSpotlightThreat } from "@/domain/poseidon-universe";
import { LovableSeverityBadge } from "@/components/shared/LovableSeverityBadge";
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

const container: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function LovableAlertDetail() {
  const rawThreat = selectSpotlightThreat();
  const threat = rawThreat ? {
    ...rawThreat,
    amount: rawThreat.amountUsd,
    account: "Checking *1234",
    merchant: rawThreat.counterparty,
    title: rawThreat.counterparty,
    device: "iPhone 14 Pro",
    ip: "192.168.1.1",
    location: "Oslo, Norway",
    timestamp: rawThreat.relativeTime,
    severity: (rawThreat.severity === "Critical" || rawThreat.severity === "High" ? "high" : (rawThreat.severity === "Medium" ? "medium" : "low")) as "high" | "medium" | "low",
    drivers: (rawThreat as any).factors || []
  } : undefined;

  if (!threat) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link
          to="/lovable/protect"
          className="text-sm text-white/40 hover:text-white/70 mb-4 inline-block"
        >
          &larr; Back to Protect
        </Link>
        <p className="text-white/50">Threat not found.</p>
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
          to="/lovable/protect"
          className="text-sm text-white/40 hover:text-white/70 mb-4 inline-block transition-colors"
        >
          &larr; Back to Protect
        </Link>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={item} className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-5">
        <div className="flex items-center gap-2 mb-3">
          <LovableSeverityBadge severity={threat.severity} />
          <h1 className="text-xl font-semibold text-white">
            {threat.title}
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {threat.amount != null && (
            <div>
              <span className="text-white/40">Amount</span>
              <div className="font-mono text-white">
                ${threat.amount.toFixed(2)}
              </div>
            </div>
          )}
          <div>
            <span className="text-white/40">Timestamp</span>
            <div className="font-mono text-white">{threat.timestamp}</div>
          </div>
          {threat.location && (
            <div>
              <span className="text-white/40">Location</span>
              <div className="font-mono text-white">{threat.location}</div>
            </div>
          )}
          <div>
            <span className="text-white/40">Account</span>
            <div className="font-mono text-white">{threat.account}</div>
          </div>
        </div>
      </motion.div>

      {/* Action Card */}
      <motion.div variants={item} className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.08] p-5 mt-4">
        <h2 className="text-lg font-semibold mb-3 text-white">
          Is this activity legitimate?
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => alert("Demo mode — action simulated ✓")}
            className="bg-green-500 hover:bg-green-400 text-white py-4 rounded-xl shadow-lg shadow-green-500/25 flex-1 text-base font-semibold min-h-[44px] transition-all duration-200"
          >
            This was Me
          </button>
          <button
            onClick={() => alert("Demo mode — action simulated ✓")}
            className="bg-red-500 hover:bg-red-400 text-white py-4 rounded-xl shadow-lg shadow-red-500/25 flex-1 text-base font-semibold min-h-[44px] transition-all duration-200"
          >
            Block &amp; Secure
          </button>
        </div>
      </motion.div>

      {/* Collapsible Sections */}
      <motion.div variants={item}>
        <CollapsibleSection title="Transaction Details">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Merchant</span>
              <span className="text-white">{threat.merchant ?? "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Amount</span>
              <span className="text-white">
                {threat.amount != null ? `$${threat.amount.toFixed(2)}` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Card / Account</span>
              <span className="text-white">{threat.account}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Type</span>
              <span className="text-white">
                {threat.merchant ? "Purchase" : "Account Activity"}
              </span>
            </div>
          </div>
        </CollapsibleSection>
      </motion.div>

      <motion.div variants={item}>
        <CollapsibleSection title="Device & Location">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Device</span>
              <span className="text-white">{threat.device ?? "Unknown"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">OS / Browser</span>
              <span className="text-white">{threat.device ?? "Unknown"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">IP Address</span>
              <span className="text-white">{threat.ip ?? "Unknown"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Location</span>
              <span className="text-white">
                {threat.location ?? "Unknown"}
              </span>
            </div>
          </div>
        </CollapsibleSection>
      </motion.div>

      {threat.drivers && threat.drivers.length > 0 && (
        <motion.div variants={item}>
          <CollapsibleSection title="AI Decision Factors">
            <LovableDecisionDrivers drivers={threat.drivers} />
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Governance Footer */}
      <motion.div variants={item}>
        <LovableGovernanceFooter
          model="POSEIDON-THREATDETECT V1.0"
          processingMs={234}
          auditId="AUD-2026-0310-001"
        />
      </motion.div>
    </motion.div>
  );
}
