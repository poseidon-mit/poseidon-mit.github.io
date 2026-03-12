import {  Link  } from "@/router";

interface GovernanceFooterProps {
  model: string;
  processingMs: number;
  auditId: string;
}

export function LovableGovernanceFooter({ model, processingMs, auditId }: GovernanceFooterProps) {
  return (
    <div className="bg-blue-500/[0.08] border border-blue-500/15 rounded-xl p-4 mt-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-blue-500/20 text-blue-400 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-blue-500/20">
            100% Auditable
          </span>
          <span className="text-sm text-white/40">
            {model} &middot; {processingMs}ms &middot; {auditId}
          </span>
        </div>
        <Link
          to="/lovable/govern"
          className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          View Full Audit &rarr;
        </Link>
      </div>
    </div>
  );
}
