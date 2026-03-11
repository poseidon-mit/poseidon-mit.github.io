import { Link } from "react-router-dom";

interface GovernanceFooterProps {
  model: string;
  processingMs: number;
  auditId: string;
}

export function LovableGovernanceFooter({ model, processingMs, auditId }: GovernanceFooterProps) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full px-2.5 py-0.5 text-xs font-semibold">
            100% Auditable
          </span>
          <span className="text-sm text-gray-600">
            {model} &middot; {processingMs}ms &middot; {auditId}
          </span>
        </div>
        <Link
          to="/lovable/govern"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          View Full Audit &rarr;
        </Link>
      </div>
    </div>
  );
}
