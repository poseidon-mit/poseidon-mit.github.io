import React from 'react';
import { Shield, ShieldCheck, ExternalLink, User } from 'lucide-react';

export interface GovernContractSetProps {
  auditId: string;
  modelVersion: string;
  explanationVersion?: string;
  className?: string;
}

/**
 * GovernContractSet — Canonical governance compliance footer widget.
 * Renders: verified badge | audit link chip | human review CTA.
 * Required on all govern-required screens (governRequired=true).
 */
export function GovernContractSet({
  auditId,
  modelVersion,
  explanationVersion,
  className = '',
}: GovernContractSetProps) {
  const isValid = Boolean(auditId) && Boolean(modelVersion);

  if (!isValid) {
    return (
      <div
        data-widget="GovernContractSet"
        className={`rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400 ${className}`}
      >
        Governance data unavailable — human review required before this action.
      </div>
    );
  }

  return (
    <div
      data-widget="GovernContractSet"
      className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/[0.06] px-4 py-3 md:px-6 md:py-4 ${className}`}
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Verified badge */}
      <div className="flex items-center gap-2">
        <div
          className="mission-govern-badge flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}
        >
          <ShieldCheck size={10} />
          Verified
        </div>
        {explanationVersion && (
          <span className="text-[10px] text-white/30">
            Explanation v{explanationVersion}
          </span>
        )}
      </div>

      {/* Audit link chip */}
      <div className="flex items-center gap-1.5">
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono border border-white/[0.06]"
          style={{ color: '#64748B' }}
        >
          <Shield size={10} />
          {auditId}
        </span>
        <span className="text-[10px] text-white/20">Model v{modelVersion}</span>
        <ExternalLink size={10} style={{ color: '#64748B' }} aria-hidden="true" />
      </div>

      {/* Human review CTA */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-white/[0.04] cursor-pointer"
        style={{
          borderColor: 'rgba(255,255,255,0.08)',
          color: '#CBD5E1',
          background: 'transparent',
          minHeight: '44px',
        }}
      >
        <User size={14} />
        Request human review
      </button>
    </div>
  );
}

GovernContractSet.displayName = 'GovernContractSet';

export default GovernContractSet;
