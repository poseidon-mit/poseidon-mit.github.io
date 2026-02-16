/**
 * GovernFooter — Governance audit footer required on all Tier 1-2 pages.
 *
 * Thin facade over the existing GovernContractSet component.
 * Ensures consistent audit trail visibility across all pages.
 */
import { GovernContractSet } from '@/components/GovernContractSet'

export interface GovernFooterProps {
  auditId?: string
  modelVersion?: string
  className?: string
}

export function GovernFooter({
  auditId = 'GV-2026-0211-4821',
  modelVersion = 'poseidon-v2.1',
  className,
}: GovernFooterProps) {
  return (
    <div className={className}>
      <GovernContractSet auditId={auditId} modelVersion={modelVersion} />
    </div>
  )
}

GovernFooter.displayName = 'GovernFooter'
